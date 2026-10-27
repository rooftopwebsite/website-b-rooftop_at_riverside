import { chromium } from 'playwright';
import { assertFresh } from './assert-fresh.mjs';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Accessibility audit with axe-core over the real pages.
 *
 * Runs against the PRODUCTION BUILD, not against dev: dev injects the Next
 * overlay, which adds its own nodes and pollutes the report.
 *
 *   npm run build && npx next start --port 3114
 *   node scripts/a11y.mjs
 *
 * ⚠️ It exists because `docs/contrast-audit.md` can only cover the PALETTE
 * PAIRS. What it can't foresee is the COMPOSITE color: one opacity over another
 * opacity, or translucent text over cream. That only shows up by measuring the
 * rendered pixel, which is what axe does.
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
const PAGES = [
  '/',
  '/sunset-bar',
  '/food-trucks',
  '/food-trucks/el-chilango',
  '/whats-on',
  // The calendar view: the other half of `/whats-on`. It used to say
  // `?view=month`, which was the parameter's name before 2026-09-17 and no
  // longer exists, so this line had been auditing the grid view twice.
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

    /* ⚠️ You have to WAIT for the entrance animations to finish before
       measuring. Without this, axe reads the color mid-fade: a text that at
       rest is `#5a5a5a` gets measured as `#e2e2e2` because the parent is still
       at opacity 0.3. That fills the report with made-up contrast failures,
       and the made-up ones hide the real ones.

       `networkidle` isn't enough: it says there are no requests, not that the
       page has settled. The slowest entrances are delay 0.42s + 0.6s. */
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
  console.log(`OK — no WCAG 2.1 AA violations across ${PAGES.length} pages x 2 widths.`);
} else {
  // Grouped by message: 40 nodes are usually 3 repeated problems.
  const byMsg = new Map();
  for (const b of bad) {
    const key = `${b.id}|${b.message}`;
    if (!byMsg.has(key)) byMsg.set(key, { ...b, count: 0, pages: new Set() });
    const e = byMsg.get(key);
    e.count += 1;
    e.pages.add(b.page);
  }
  console.log(`${bad.length} nodes with violations, ${byMsg.size} distinct problems:\n`);
  for (const e of [...byMsg.values()].sort((a, b) => b.count - a.count)) {
    console.log(`[${e.impact}] ${e.id}  x${e.count} nodes, ${e.pages.size} pages`);
    console.log(`   ${e.message}`);
    console.log(`   e.g.: ${e.html}`);
    console.log('');
  }
  process.exitCode = 1;
}
