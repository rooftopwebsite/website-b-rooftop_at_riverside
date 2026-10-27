import { chromium } from 'playwright';

const BASE = process.env.BASE ?? 'http://localhost:3000';
const CHECK = process.argv.includes('--check');

const ROUTES = [
  '/',
  '/the-yard',
  '/sunset-bar',
  '/whats-on',
  '/events',
  '/about',
  '/visit',
  '/contact',
  '/join-us',
  '/private-dining',
];

const SURFACES = {
  'rgb(255, 255, 255)': 'paper',
  'rgb(250, 246, 234)': 'bone',
  'rgb(253, 240, 180)': 'cream',
  'rgb(196, 242, 236)': 'mint',
  'rgb(245, 242, 232)': 'chalk',
  'rgb(1, 69, 69)': 'deep',
  'rgb(1, 52, 52)': 'deeper',
};

const WIDTHS = [
  { name: 'desk', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
];

const browser = await chromium.launch();
const buckets = { missing: new Map(), extra: new Map(), patches: new Map() };

for (const vp of WIDTHS) {
  const page = await (
    await browser.newContext({ viewport: { width: vp.width, height: vp.height } })
  ).newPage();

  for (const route of ROUTES) {
    const res = await page
      .goto(BASE + route, { waitUntil: 'networkidle', timeout: 60000 })
      .catch(() => null);
    if (!res || res.status() >= 400) continue;
    await page.waitForTimeout(900);

    const findings = await page.evaluate((SUP) => {
      const opaque = (c) => c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent';
      const hasGrain = (e, s) =>
        s.backgroundImage.includes('feTurbulence') || e.classList.contains('grain-layer');
      const name = (e) =>
        `${e.tagName.toLowerCase()}.${(e.className?.toString?.() || '')
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 4)
          .join('.')}`;

      const out = { missing: [], extra: [], patches: [] };

      for (const e of document.querySelectorAll('body *')) {
        const s = getComputedStyle(e);
        const r = e.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (s.maskImage !== 'none' || s.webkitMaskImage !== 'none') continue;
        if (s.opacity !== '1') continue;

        const has = hasGrain(e, s);
        const tone = SUP[s.backgroundColor];
        const full = r.width >= innerWidth * 0.98;
        const surface = Boolean(tone) && full;

        let n = e.parentElement;
        let background = null;
        while (n && n !== document.documentElement) {
          const t = getComputedStyle(n);
          if (hasGrain(n, t) && opaque(t.backgroundColor)) {
            background = t.backgroundColor;
            break;
          }
          n = n.parentElement;
        }
        const standIn =
          opaque(s.backgroundColor) && s.backgroundColor === background && s.boxShadow === 'none';

        if (surface && !has) out.missing.push({ tone, el: name(e) });
        else if (has && !surface && !standIn && !e.classList.contains('grain-layer'))
          out.extra.push({ el: name(e) });
        else if (!has && standIn && r.width >= 40 && r.height >= 40)
          out.patches.push({ tone: SUP[s.backgroundColor] ?? s.backgroundColor, el: name(e) });
      }
      return out;
    }, SURFACES);

    for (const [bucket, rows] of Object.entries(findings))
      for (const f of rows) {
        if (!buckets[bucket].has(f.el)) buckets[bucket].set(f.el, { ...f, routes: new Set() });
        buckets[bucket].get(f.el).routes.add(`${vp.name}${route}`);
      }
  }
  await page.close();
}

await browser.close();

const total = buckets.missing.size + buckets.extra.size + buckets.patches.size;
if (!total) {
  console.log(
    `✅ the grain is on every surface, on no object and on every stand-in — ${ROUTES.length} routes x ${WIDTHS.length} widths`,
  );
  process.exit(0);
}

const report = (map, title, fix) => {
  if (!map.size) return;
  console.log(`\n❌ ${map.size} ${title}\n`);
  for (const f of map.values()) {
    console.log(`   ${(f.tone ?? '').padEnd(8)} ${f.el}`);
    console.log(`            ${[...f.routes].slice(0, 5).join(' ')}`);
  }
  console.log(`\n   ${fix}`);
};

report(buckets.missing, 'surfaces WITHOUT grain', 'Add `grain` to them.');
report(
  buckets.extra,
  'objects WITH grain that are not background',
  'Remove the grain from them: it goes on backgrounds, not on objects.',
);
report(
  buckets.patches,
  'background stand-ins WITHOUT grain',
  'They are painted the color of their surface to disappear into it, and without the grain they look like a smooth patch. Add `grain` to them.',
);

process.exit(CHECK ? 1 : 0);
