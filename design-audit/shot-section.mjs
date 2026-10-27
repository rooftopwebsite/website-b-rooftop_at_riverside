/**
 * Captures ONE section. `node design-audit/shot-section.mjs "<selector>" name`
 *
 * ⚠️ It scrolls through the whole page BEFORE capturing, and
 * `scrollIntoViewIfNeeded()` isn't enough: with Lenis interpolating the wheel, that jump doesn't
 * produce the scroll event the `whileInView` IntersectionObserver needs,
 * so the section gets captured with the reveals not fired
 * —an image with a closed `clip-path` comes out blank—. Confirmed by measuring the
 * computed style: scrolling slowly, zero elements stay invisible.
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
