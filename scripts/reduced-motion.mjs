import { chromium } from 'playwright';
import { assertFresh } from './assert-fresh.mjs';

/**
 * Verifies the brief's hard rule: **with animation turned off the site
 * stays perfectly usable and with the same layout**.
 *
 * How. It loads each page twice —with and without `prefers-reduced-motion`— and
 * compares the box of every element with an `id` or heading. If an animation
 * is doing LAYOUT work (positioning something, giving it height), the
 * boxes don't match and it trips here.
 *
 * ⚠️ It's the check an accessibility checker does NOT do: axe verifies
 * that you respect the preference, not that the result still works.
 *
 *   node scripts/reduced-motion.mjs
 */

/*
 * ⚠️ ONE SINGLE port for the three guards, and an uncommon one on purpose.
 * Each script used to have its own (3114, 3119, 3120) and all three collided
 * with stale servers from other sessions, hence the false results. Serve the
 * build here:
 *
 *   npm run build && npx next start --port 3157
 *
 * assertFresh() verifies that whatever answers really is the current build.
 */
const BASE = process.env.BASE ?? 'http://localhost:3157';

await assertFresh(BASE);
const PAGES = ['/', '/food-trucks', '/events', '/whats-on', '/sunset-bar', '/events/spaces'];
/** How many px of difference are tolerated (subpixel rounding). */
const TOLERANCE = 2;

async function measure(browser, path, reduced) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: reduced ? 'reduce' : 'no-preference',
  });
  const page = await ctx.newPage();
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  // The entrance animations take 600ms at most; with margin.
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

  /* ⚠️ THE PINNED-LISTS EXCEPTION USED TO LIVE HERE.

     `PinnedList` —the «how this place works» module— changed height depending
     on the motion preference, on purpose: the pinning IS motion, and with
     the preference active the section stopped measuring several screens. It was the
     only legitimate exception to the identical-height rule, and instead of
     comparing boxes the accordion's state was verified.

     The module no longer exists: it was replaced by `StepStair`, which is static and measures
     the same in both modes. So the home page went back to the normal comparison,
     which is the right one and is also the brief's rule with no asterisks.

     If a module that changes height by design ever comes back, the exception
     is in the git history — but first it's worth asking whether the module
     can avoid changing height, which is what happened here. */

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
