import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const outDir = process.argv[2];
const url = process.argv[3] ?? 'http://localhost:3000/';
if (!outDir) { console.error('outDir missing'); process.exit(1); }
mkdirSync(join(outDir, 'sections'), { recursive: true });

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

async function scrollThrough(page) {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.6);
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await sleep(220);
    }
    window.scrollTo(0, document.body.scrollHeight);
    await sleep(700);
    window.scrollTo(0, 0);
    await sleep(500);
  });
}

const browser = await chromium.launch();
let inventory = null;

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await scrollThrough(page);

  await page.screenshot({ path: join(outDir, `home-${vp.name}.png`), fullPage: true });

  const sections = await page.evaluate(() => {
    const main = document.querySelector('main');
    return [...main.children].map((el, i) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const h = el.querySelector('h1,h2,h3');
      return {
        i,
        tag: el.tagName.toLowerCase(),
        id: el.id || el.getAttribute('aria-labelledby') || el.getAttribute('aria-label') || `s${i}`,
        heading: h ? h.textContent.trim().replace(/\s+/g, ' ').slice(0, 70) : null,
        bg: cs.backgroundColor,
        color: cs.color,
        height: Math.round(r.height),
        classes: el.className,
      };
    });
  });

  if (vp.name === 'desktop') inventory = sections;

  const main = page.locator('main');
  const n = await main.locator('> *').count();
  for (let i = 0; i < n; i++) {
    const el = main.locator('> *').nth(i);
    const meta = sections[i];
    const slug = String(meta.id).replace(/[^a-z0-9-]+/gi, '-').toLowerCase().slice(0, 32);
    const name = `${String(i).padStart(2, '0')}-${slug}-${vp.name}.png`;
    try {
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await el.screenshot({ path: join(outDir, 'sections', name) });
    } catch (e) {
      console.error(`  ! ${name}: ${e.message.split('\n')[0]}`);
    }
  }
  console.log(`${vp.name}: ${n} sections`);
  await ctx.close();
}

writeFileSync(join(outDir, 'sections.json'), JSON.stringify(inventory, null, 2));
console.log('\n--- desktop inventory ---');
for (const s of inventory) {
  console.log(`${String(s.i).padStart(2)} ${s.id.padEnd(24)} bg=${s.bg.padEnd(20)} color=${s.color.padEnd(18)} h=${s.height}px  ${s.heading ?? ''}`);
}
await browser.close();
