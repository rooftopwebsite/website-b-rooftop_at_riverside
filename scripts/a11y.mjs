import { chromium } from 'playwright';
import { assertFresh } from './assert-fresh.mjs';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE ?? 'http://localhost:3157';

await assertFresh(BASE);
const PAGES = [
  '/',
  '/sunset-bar',
  '/food-trucks',
  '/food-trucks/el-chilango',
  '/whats-on',
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
