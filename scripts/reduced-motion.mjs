import { chromium } from 'playwright';

/**
 * Verifica la regla dura del brief: **con la animación desactivada el sitio
 * queda perfectamente usable y con el mismo layout**.
 *
 * Cómo. Carga cada página dos veces —con y sin `prefers-reduced-motion`— y
 * compara la caja de cada elemento con `id` o con encabezado. Si una animación
 * está haciendo trabajo de LAYOUT (posicionando algo, dándole altura), las
 * cajas no coinciden y salta acá.
 *
 * ⚠️ Es la comprobación que un checker de accesibilidad NO hace: axe verifica
 * que respetes la preferencia, no que el resultado siga sirviendo.
 *
 *   node scripts/reduced-motion.mjs
 */

const BASE = process.env.BASE ?? 'http://localhost:3119';
const PAGES = ['/', '/food-trucks', '/events', '/whats-on', '/sunset-bar', '/events/spaces'];
/** Cuántos px de diferencia se toleran (redondeos de subpíxel). */
const TOLERANCE = 2;

async function measure(browser, path, reduced) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: reduced ? 'reduce' : 'no-preference',
  });
  const page = await ctx.newPage();
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  // Las animaciones de entrada tardan como mucho 600ms; con margen.
  await page.waitForTimeout(1400);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(900);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);

  const boxes = await page.evaluate(() => {
    const out = {};
    for (const el of document.querySelectorAll('h1, h2, h3, section[id], [id]')) {
      const key = el.id || `${el.tagName}:${(el.textContent || '').trim().slice(0, 30)}`;
      if (!key || out[key]) continue;
      const r = el.getBoundingClientRect();
      out[key] = [Math.round(r.width), Math.round(r.height)];
    }
    return { boxes: out, docHeight: document.body.scrollHeight };
  });

  await ctx.close();
  return boxes;
}

const browser = await chromium.launch();
let problems = 0;

for (const path of PAGES) {
  const normal = await measure(browser, path, false);
  const reduced = await measure(browser, path, true);

  const diffs = [];
  for (const [key, box] of Object.entries(normal.boxes)) {
    const other = reduced.boxes[key];
    if (!other) {
      diffs.push(`falta con reduced-motion: ${key}`);
      continue;
    }
    if (Math.abs(box[0] - other[0]) > TOLERANCE || Math.abs(box[1] - other[1]) > TOLERANCE) {
      diffs.push(`${key}: ${box.join('×')} vs ${other.join('×')}`);
    }
  }

  const heightDiff = Math.abs(normal.docHeight - reduced.docHeight);
  if (heightDiff > TOLERANCE) {
    diffs.push(`alto del documento: ${normal.docHeight} vs ${reduced.docHeight}`);
  }

  if (diffs.length) {
    problems += 1;
    console.log(`❌ ${path}`);
    for (const d of diffs.slice(0, 6)) console.log(`   ${d}`);
    if (diffs.length > 6) console.log(`   …y ${diffs.length - 6} más`);
  } else {
    console.log(`✅ ${path.padEnd(18)} layout idéntico con y sin movimiento`);
  }
}

await browser.close();
console.log(problems === 0 ? '\nOK.' : `\n${problems} páginas cambian de layout.`);
if (problems > 0) process.exitCode = 1;
