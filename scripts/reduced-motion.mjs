import { chromium } from 'playwright';
import { assertFresh } from './assert-fresh.mjs';

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
    /* Estado de las listas fijadas: cuántos ítems hay y cuántos están
       desplegados. Ver el bloque PINNED más abajo. */
    const pinned = [...document.querySelectorAll('[data-pinned]')].map((el) => ({
      mode: el.getAttribute('data-pinned'),
      total: el.querySelectorAll('[data-pinned-body]').length,
      open: [...el.querySelectorAll('[data-pinned-body]')].filter(
        (b) => b.getAttribute('data-pinned-body') === 'open',
      ).length,
      clipped: [...el.querySelectorAll('[data-pinned-body] > *')].filter(
        (inner) => inner.getBoundingClientRect().height < 8,
      ).length,
    }));
    return { boxes: out, docHeight: document.body.scrollHeight, pinned };
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

  /* ── PINNED ────────────────────────────────────────────────────────────
     Una lista fijada (`PinnedList`) es la ÚNICA excepción legítima a la
     regla del alto idéntico, y lo es porque el pineado en sí es movimiento:
     con la preferencia activa no se pinea, y sostener el recorrido de varias
     pantallas dejaría un socavón vacío en su lugar.

     Así que en esas páginas no se comparan alturas —tienen que diferir— y en
     cambio se verifica lo que de verdad importa, que es MÁS estricto que la
     comparación de cajas:

       · con reduced-motion, TODOS los ítems abiertos y ninguno recortado
       · sin reduced-motion, exactamente UNO abierto (o sea: el mecanismo
         está andando, no quedó desactivado por accidente)

     Si alguna vez `PinnedList` se rompe y deja todo plegado sin JS, este
     chequeo lo caza; la comparación de alturas no lo cazaría. */
  const hasPinned = normal.pinned.length > 0;

  if (hasPinned) {
    for (const [i, p] of reduced.pinned.entries()) {
      if (p.mode !== 'off') diffs.push(`lista fijada #${i + 1}: se pineó igual con reduced-motion`);
      if (p.open !== p.total) diffs.push(`lista fijada #${i + 1}: con reduced-motion hay ${p.open}/${p.total} ítems abiertos`);
      if (p.clipped > 0) diffs.push(`lista fijada #${i + 1}: ${p.clipped} ítems recortados con reduced-motion`);
    }
    for (const [i, p] of normal.pinned.entries()) {
      if (p.mode !== 'on') diffs.push(`lista fijada #${i + 1}: no se activó el pineado`);
      else if (p.open !== 1) diffs.push(`lista fijada #${i + 1}: ${p.open} ítems abiertos a la vez, debería ser 1`);
    }
  }

  /* Las cajas de los ancestros de una lista fijada cambian de alto por diseño;
     el resto tiene que coincidir. */
  const SPANS_PINNED = new Set(['main']);

  for (const [key, box] of Object.entries(normal.boxes)) {
    const other = reduced.boxes[key];
    if (!other) {
      diffs.push(`falta con reduced-motion: ${key}`);
      continue;
    }
    if (hasPinned && SPANS_PINNED.has(key)) continue;
    if (Math.abs(box[0] - other[0]) > TOLERANCE || Math.abs(box[1] - other[1]) > TOLERANCE) {
      diffs.push(`${key}: ${box.join('×')} vs ${other.join('×')}`);
    }
  }

  const heightDiff = Math.abs(normal.docHeight - reduced.docHeight);
  if (!hasPinned && heightDiff > TOLERANCE) {
    diffs.push(`alto del documento: ${normal.docHeight} vs ${reduced.docHeight}`);
  }

  if (diffs.length) {
    problems += 1;
    console.log(`❌ ${path}`);
    for (const d of diffs.slice(0, 6)) console.log(`   ${d}`);
    if (diffs.length > 6) console.log(`   …y ${diffs.length - 6} más`);
  } else if (hasPinned) {
    console.log(
      `✅ ${path.padEnd(18)} lista fijada: 1 ítem abierto con movimiento, ` +
        `${reduced.pinned[0].total}/${reduced.pinned[0].total} sin él`,
    );
  } else {
    console.log(`✅ ${path.padEnd(18)} layout idéntico con y sin movimiento`);
  }
}

await browser.close();
console.log(problems === 0 ? '\nOK.' : `\n${problems} páginas cambian de layout.`);
if (problems > 0) process.exitCode = 1;
