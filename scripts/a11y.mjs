import { chromium } from 'playwright';
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

const BASE = process.env.BASE ?? 'http://localhost:3114';
const PAGES = [
  '/',
  '/sunset-bar',
  '/food-trucks',
  '/food-trucks/el-chilango',
  '/whats-on',
  '/whats-on?view=month',
  '/whats-on/bingo-night',
  '/events',
  '/events/spaces',
  '/events/inquire',
  '/events/corporate',
  '/the-yard',
  '/the-experience',
  '/nfc-north-hq',
  '/market',
  '/our-story',
  '/join-us',
  '/faq',
  '/visit',
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
