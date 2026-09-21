import { chromium } from 'playwright';
import { assertFresh } from './assert-fresh.mjs';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Auditoría de accesibilidad con axe-core sobre las páginas reales.
 *
 * Corre contra el BUILD DE PRODUCCIÓN, no contra dev: dev inyecta el overlay de
 * Next, que mete sus propios nodos y ensucia el reporte.
 *
 *   npm run build && npx next start --port 3114
 *   node scripts/a11y.mjs
 *
 * ⚠️ Existe porque `docs/contrast-audit.md` sólo puede cubrir los PARES DE
 * PALETA. Lo que no puede prever es el color COMPUESTO: una opacidad sobre otra
 * opacidad, o texto translúcido sobre crema. Eso sólo se ve midiendo el píxel
 * renderizado, que es lo que hace axe.
 */

/*
 * ⚠️ UN SOLO puerto para los tres guards, y uno poco común a propósito.
 * Antes cada script tenía el suyo (3114, 3119, 3120) y los tres chocaban con
 * servers viejos de otras sesiones — de ahí los resultados falsos. Serví el
 * build acá:
 *
 *   npm run build && npx next start --port 3157
 *
 * assertFresh() verifica que lo que contesta sea de verdad el build actual.
 */
const BASE = process.env.BASE ?? 'http://localhost:3157';

await assertFresh(BASE);
const PAGES = [
  '/',
  '/sunset-bar',
  '/food-trucks',
  '/food-trucks/el-chilango',
  '/whats-on',
  // La vista calendario: la otra mitad de `/whats-on`. Decía `?view=month`,
  // que es el nombre que tenía el parámetro antes del 2026-09-17 y que hoy no
  // existe, así que esta línea venía auditando la vista grid dos veces.
  '/whats-on?view=calendar',
  '/events',
  '/whats-on?type=music',
  '/game-truck',
  '/market',
  '/our-story',
  '/join-us',
  '/contact',
];

const axeSource = fs.readFileSync(
  path.join(process.cwd(), 'node_modules/axe-core/axe.min.js'),
  'utf8',
);

const browser = await chromium.launch();
const bad = [];

for (const width of [1440, 390]) {
  const ctx = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 } });
  const page = await ctx.newPage();

  for (const p of PAGES) {
    await page.goto(BASE + p, { waitUntil: 'networkidle' });

    /* ⚠️ Hay que ESPERAR a que las animaciones de entrada terminen antes de
       medir. Sin esto, axe lee el color a mitad del fundido: un texto que en
       reposo es `#5a5a5a` se mide como `#e2e2e2` porque el padre todavía está
       en opacity 0.3. Eso llena el informe de fallos de contraste inventados,
       y los inventados tapan a los de verdad.

       `networkidle` no alcanza: dice que no hay peticiones, no que la página
       se quedó quieta. Las entradas más lentas son delay 0.42s + 0.6s. */
    await page.waitForTimeout(1600);
    await page.addScriptTag({ content: axeSource });
    const res = await page.evaluate(async () =>
      window.axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
      }),
    );

    for (const v of res.violations) {
      for (const n of v.nodes) {
        bad.push({
          page: p,
          width,
          id: v.id,
          impact: v.impact,
          target: String(n.target?.[0] ?? '').slice(0, 90),
          html: (n.html ?? '').replace(/\s+/g, ' ').slice(0, 110),
          message: (n.any?.[0]?.message ?? n.all?.[0]?.message ?? v.help)
            .replace(/\s+/g, ' ')
            .slice(0, 200),
        });
      }
    }
  }
  await ctx.close();
}

await browser.close();

fs.writeFileSync('a11y-report.json', JSON.stringify(bad, null, 1));

if (bad.length === 0) {
  console.log(`OK — sin violaciones de WCAG 2.1 AA en ${PAGES.length} páginas x 2 anchos.`);
} else {
  // Agrupado por mensaje: 40 nodos suelen ser 3 problemas repetidos.
  const byMsg = new Map();
  for (const b of bad) {
    const key = `${b.id}|${b.message}`;
    if (!byMsg.has(key)) byMsg.set(key, { ...b, count: 0, pages: new Set() });
    const e = byMsg.get(key);
    e.count += 1;
    e.pages.add(b.page);
  }
  console.log(`${bad.length} nodos con violaciones, ${byMsg.size} problemas distintos:\n`);
  for (const e of [...byMsg.values()].sort((a, b) => b.count - a.count)) {
    console.log(`[${e.impact}] ${e.id}  x${e.count} nodos, ${e.pages.size} páginas`);
    console.log(`   ${e.message}`);
    console.log(`   ej: ${e.html}`);
    console.log('');
  }
  process.exitCode = 1;
}
