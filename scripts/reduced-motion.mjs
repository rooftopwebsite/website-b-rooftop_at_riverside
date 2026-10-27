import { chromium } from 'playwright';
import { assertFresh } from './assert-fresh.mjs';

const BASE = process.env.BASE ?? 'http://localhost:3157';

await assertFresh(BASE);
const PAGES = ['/', '/food-trucks', '/events', '/whats-on', '/sunset-bar', '/events/spaces'];
const TOLERANCE = 2;

async function measure(browser, path, reduced) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: reduced ? 'reduce' : 'no-preference',
  });
  const page = await ctx.newPage();
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
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
      diffs.push(`missing with reduced-motion: ${key}`);
      continue;
    }
    if (Math.abs(box[0] - other[0]) > TOLERANCE || Math.abs(box[1] - other[1]) > TOLERANCE) {
      diffs.push(`${key}: ${box.join('×')} vs ${other.join('×')}`);
    }
  }

  const heightDiff = Math.abs(normal.docHeight - reduced.docHeight);
  if (heightDiff > TOLERANCE) {
    diffs.push(`document height: ${normal.docHeight} vs ${reduced.docHeight}`);
  }

  if (diffs.length) {
    problems += 1;
    console.log(`❌ ${path}`);
    for (const d of diffs.slice(0, 6)) console.log(`   ${d}`);
    if (diffs.length > 6) console.log(`   …and ${diffs.length - 6} more`);
  } else {
    console.log(`✅ ${path.padEnd(18)} identical layout with and without motion`);
  }
}

await browser.close();
console.log(problems === 0 ? '\nOK.' : `\n${problems} pages change layout.`);
if (problems > 0) process.exitCode = 1;
