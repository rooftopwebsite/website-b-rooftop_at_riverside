import { chromium } from 'playwright';
import { assertFresh } from './assert-fresh.mjs';

/**
 * Compara lo que el sitio RENDERIZA contra la tabla del brief.
 *
 * Verifica, página por página:
 *   · el `<title>` exacto
 *   · el H1 exacto, y que haya **uno solo**
 *   · que exista una meta description no vacía
 *   · que el canonical apunte a la URL correcta
 *   · que no aparezca vocabulario prohibido en el texto visible
 *
 * Corre contra el build de producción:
 *   npm run build && npx next start --port 3120
 *   node scripts/check-seo.mjs
 */

import { PAGE_SEO } from '../src/content/seo-pages.ts';

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
const SITE = 'https://rooftopatriverside.com';

/**
 * Vocabulario prohibido por el brief. Buscado en el texto VISIBLE.
 *
 * ⚠️ Las excepciones son deliberadas y cada una es una frase donde la palabra
 * aparece para NEGARLA: «Is Rooftop at Riverside a restaurant? No.» Prohibir la
 * palabra en absoluto obligaría a no poder desmentir la confusión, que es
 * justamente el trabajo del sitio.
 */
const BANNED = [
  { re: /\bour kitchen\b/i, note: 'el venue no tiene cocina' },
  { re: /\bour chefs?\b/i, note: 'el venue no tiene cocineros' },
  { re: /\bour menu\b/i, note: 'la única carta es la del bar; decir «our menu» sugiere comida' },
  { re: /\bwe cater\b/i, note: 'no hay catering propio' },
  { re: /\border online\b/i, note: 'no hay pedidos online' },
  { re: /\bupper deck\b/i, note: 'nomenclatura vieja' },
  { re: /\btwo-story bar\b/i, note: 'nomenclatura vieja' },
];

/** Frases donde una palabra prohibida aparece para negarla. */
const ALLOWED_CONTEXT = [
  /no delivery, no takeout, no online ordering/i,
  /is rooftop at riverside a restaurant\?/i,
  /not a restaurant/i,
  /don.t have a kitchen/i,
  /no venue kitchen/i,
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

let problems = 0;

for (const [route, expected] of Object.entries(PAGE_SEO)) {
  const res = await page.goto(BASE + route, { waitUntil: 'domcontentloaded' });
  const issues = [];

  if (res?.status() !== 200) issues.push(`HTTP ${res?.status()}`);

  const data = await page.evaluate(() => {
    const h1s = [...document.querySelectorAll('h1')].map((h) => h.textContent.trim());
    return {
      title: document.title,
      h1s,
      description: document.querySelector('meta[name=description]')?.content ?? '',
      canonical: document.querySelector('link[rel=canonical]')?.getAttribute('href') ?? '',
      noindex: /noindex/.test(document.querySelector('meta[name=robots]')?.content ?? ''),
      text: document.body.innerText,
    };
  });

  // El blog se esconde (noindex, sin H1) mientras no haya notas: no es un error.
  if (data.noindex && data.h1s.length === 0) {
    console.log(`⏸  ${route} escondida (noindex, sin contenido): se saltea`);
    continue;
  }
  if (data.title !== expected.title) {
    issues.push(`title\n      esperado: ${expected.title}\n      real:     ${data.title}`);
  }
  if (data.h1s.length !== 1) issues.push(`${data.h1s.length} H1 (debe haber 1): ${data.h1s.join(' | ')}`);
  else if (data.h1s[0] !== expected.h1) {
    issues.push(`H1\n      esperado: ${expected.h1}\n      real:     ${data.h1s[0]}`);
  }
  if (!data.description) issues.push('sin meta description');
  else if (data.description !== expected.description) issues.push('meta description distinta de la tabla');

  // Una página noindex no declara canonical: serían dos señales opuestas (2026-09-23).
  const wantCanonical = data.noindex ? '' : `${SITE}${route === '/' ? '' : route}`;
  if (data.canonical !== wantCanonical) {
    issues.push(`canonical: ${data.canonical || '(ninguno)'} ≠ ${wantCanonical}`);
  }

  for (const { re, note } of BANNED) {
    const hit = data.text.match(re);
    if (!hit) continue;
    // ¿Está dentro de una frase que lo niega?
    const around = data.text.slice(Math.max(0, hit.index - 120), hit.index + 120);
    if (ALLOWED_CONTEXT.some((ok) => ok.test(around))) continue;
    issues.push(`vocabulario prohibido «${hit[0]}» — ${note}`);
  }

  if (issues.length) {
    problems += 1;
    console.log(`❌ ${route}`);
    for (const i of issues) console.log(`   ${i}`);
  } else {
    console.log(`✅ ${route}`);
  }
}

await browser.close();
console.log(problems === 0 ? '\nSEO OK: títulos, H1, descriptions y canonicals coinciden con la tabla.' : `\n${problems} páginas con problemas.`);
if (problems > 0) process.exitCode = 1;
