/**
 * Captura UNA sección. `node design-audit/shot-seccion.mjs "<selector>" nombre`
 *
 * ⚠️ Recorre la página entera ANTES de capturar, y no alcanza con
 * `scrollIntoViewIfNeeded()`: con Lenis interpolando la rueda, ese salto no
 * produce el evento de scroll que necesita el IntersectionObserver de los
 * `whileInView`, así que la sección se captura con los reveals sin disparar
 * —una imagen con `clip-path` cerrado sale en blanco—. Confirmado midiendo el
 * estilo computado: recorriendo despacio, cero elementos quedan invisibles.
 */
import { chromium } from 'playwright';

const sel = process.argv[2];
const name = process.argv[3];
const b = await chromium.launch();

for (const [w, h, n] of [[1440, 900, 'desktop'], [390, 844, 'mobile']]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const p = await c.newPage();
  await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await sleep(150);
    }
    await sleep(1200);
  });
  const el = p.locator(sel).first();
  await el.scrollIntoViewIfNeeded();
  await p.waitForTimeout(900);
  await el.screenshot({ path: `design-audit/${name}-${n}.png` });
  console.log(n, 'ok');
  await c.close();
}
await b.close();
