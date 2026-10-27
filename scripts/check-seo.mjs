import { chromium } from 'playwright';
import { assertFresh } from './assert-fresh.mjs';

import { PAGE_SEO } from '../src/content/seo-pages.ts';

const BASE = process.env.BASE ?? 'http://localhost:3157';

await assertFresh(BASE);
const SITE = 'https://rooftopatriverside.com';

const BANNED = [
  { re: /\bour kitchen\b/i, note: 'the venue has no kitchen' },
  { re: /\bour chefs?\b/i, note: 'the venue has no cooks' },
  { re: /\bour menu\b/i, note: 'the only menu is the bar\'s; saying «our menu» suggests food' },
  { re: /\bwe cater\b/i, note: 'there is no in-house catering' },
  { re: /\border online\b/i, note: 'there is no online ordering' },
  { re: /\bupper deck\b/i, note: 'old naming' },
  { re: /\btwo-story bar\b/i, note: 'old naming' },
];

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

  if (data.noindex && data.h1s.length === 0) {
    console.log(`⏸  ${route} hidden (noindex, no content): skipped`);
    continue;
  }
  if (data.title !== expected.title) {
    issues.push(`title\n      expected: ${expected.title}\n      actual:   ${data.title}`);
  }
  if (data.h1s.length !== 1) issues.push(`${data.h1s.length} H1 (there must be 1): ${data.h1s.join(' | ')}`);
  else if (data.h1s[0] !== expected.h1) {
    issues.push(`H1\n      expected: ${expected.h1}\n      actual:   ${data.h1s[0]}`);
  }
  if (!data.description) issues.push('no meta description');
  else if (data.description !== expected.description) issues.push('meta description differs from the table');

  const wantCanonical = data.noindex ? '' : `${SITE}${route === '/' ? '' : route}`;
  if (data.canonical !== wantCanonical) {
    issues.push(`canonical: ${data.canonical || '(none)'} ≠ ${wantCanonical}`);
  }

  for (const { re, note } of BANNED) {
    const hit = data.text.match(re);
    if (!hit) continue;
    const around = data.text.slice(Math.max(0, hit.index - 120), hit.index + 120);
    if (ALLOWED_CONTEXT.some((ok) => ok.test(around))) continue;
    issues.push(`banned vocabulary «${hit[0]}» — ${note}`);
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
console.log(problems === 0 ? '\nSEO OK: titles, H1s, descriptions and canonicals match the table.' : `\n${problems} pages with problems.`);
if (problems > 0) process.exitCode = 1;
