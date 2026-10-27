/**
 * Verifies that THE GRAIN IS WHERE IT BELONGS AND ONLY WHERE IT BELONGS.
 *
 *   BASE=http://localhost:3000 node scripts/check-grain.mjs
 *   node scripts/check-grain.mjs --check     → exits with 1 if it finds anything
 *
 * ⚠️ WHY THIS GUARD EXISTS: the grain slipped out three times, in three
 * different ways, and nothing warned about any of them.
 *
 * The first was BY OMISSION. The grain was applied surface by surface
 * with a utility, and every one nobody remembered to mark was left out:
 * the header bar, the mega-menu, the drawer, the agency band. Every new
 * section was born without grain.
 *
 * The second was BY EXCESS. The fix for the first was a fixed layer over
 * the viewport, which forgets nothing —but it paints over EVERYTHING: the photos,
 * the logo, the wave emblem. Camila: «the elements shouldn't have the noise
 * effect, only the backgrounds».
 *
 * The third was THE SUBTLEST, and it showed up while fixing the second. Several
 * pieces of the site are painted the SAME color as the surface they have
 * behind them, precisely to disappear against it: the hero's crop, the
 * «TOGETHER» plate, the logo's slab. When the grain moved to live on the
 * surface, those pieces were left smooth over a grainy background — and the grain
 * shifts the mean by about 3 levels, so they started to show as patches.
 *
 * The three ways of being wrong are real and distinct, and this guard measures
 * all three.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ WHAT COUNTS AS A SURFACE: an element that paints a palette color and
 * takes the full width of the window. That pair of conditions is what
 * separates a section from a card: both paint color, but only one is the
 * field everything else rests on. A `bg-deep` card inside
 * `FindUs` is NOT a surface and must not have grain.
 *
 * ⚠️ WIDTH IS ENOUGH AS A CRITERION AND HEIGHT ISN'T. A first version also
 * required 60px of height, so as not to count rules, and it ran over three
 * real surfaces: the `UtilityBar`, which is a thin bar, and the two
 * pieces of the drawer. No card on the site reaches full width, so
 * height wasn't separating anything — only discarding legitimate bars.
 *
 * ⚠️ WHAT ISN'T VISIBLE ISN'T JUDGED. A hidden element measures 0 and therefore
 * isn't «full width»: without skipping it, the mobile drawer is reported as
 * an element with extra grain on every desktop run. That's why the guard
 * measures at BOTH widths: what's hidden at one is evaluated at the other.
 *
 * ⚠️ WHAT DRAWS ITS OWN BORDER IS AN OBJECT, NOT A STAND-IN. The
 * `secondary` button is `bg-paper` with a 1px `ring`, and on a `paper` section it gives
 * the same color as the background — but it isn't there to disappear: the ring
 * outlines it. Its fill staying smooth doesn't show. That's why any element
 * with `box-shadow` is left out of the stand-in count.
 *
 * ⚠️ MASKED ELEMENTS AREN'T JUDGED EITHER. A silhouette cut out with
 * `mask-image` —the footer's palm tree, the logo's slab— can measure the
 * width of the screen by its BOX and paint nothing near the edges. Width
 * stops meaning «surface» as soon as there's a mask
 * involved.
 *
 * ⚠️ WHY IT MEASURES IN THE BROWSER AND DOESN'T READ THE CODE: the background classes
 * are put together in twenty different components, some concatenated and others in a
 * tone map. The only thing that can be stated with certainty is what the
 * browser paints, and that includes the cases where one class got overridden by another.
 *
 * ⚠️ `grain-layer` IS ALWAYS ACCEPTED. It's an explicit declaration of
 * «this is background», and it's used precisely where the color isn't painted by a
 * `background`: the wave strip has no `background-color`, so none
 * of the rules above would recognize it.
 *
 * The fix, in all three directions, is to add or remove `grain` —or `grain-layer`
 * if the color isn't painted by a `background`— on the element the report
 * names. See their notes in `globals.css`.
 */

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

/** The colors that are a SURFACE. Orange and teal don't paint backgrounds. */
const SURFACES = {
  'rgb(255, 255, 255)': 'paper',
  'rgb(250, 246, 234)': 'bone',
  'rgb(253, 240, 180)': 'cream',
  /* ⚠️ `mint` WAS MISSING. It was added as a `Section` tone on 2026-09-21 for the
     card band on `/food-trucks` and this list wasn't updated, so
     the guard saw a full-width section painted a color it didn't
     know and reported it as «object with grain that isn't background». It hadn't
     been noticed because `/food-trucks` isn't in `ROUTES`; it surfaced when `/events`
     —which is— debuted its own mint band. */
  'rgb(196, 242, 236)': 'mint',
  'rgb(245, 242, 232)': 'chalk',
  'rgb(1, 69, 69)': 'deep',
  'rgb(1, 52, 52)': 'deeper',
};

/** The drawer and the mega-menu only exist at one of the two widths. */
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
        if (r.width === 0 || r.height === 0) continue; // hidden: not judged
        if (s.maskImage !== 'none' || s.webkitMaskImage !== 'none') continue; // cut out
        if (s.opacity !== '1') continue; // translucent decoration

        const has = hasGrain(e, s);
        const tone = SUP[s.backgroundColor];
        const full = r.width >= innerWidth * 0.98;
        const surface = Boolean(tone) && full;

        /*
          The color of the SURFACE this element has behind it, which isn't
          the same as its parent's color: the hero's crop hangs inside
          the photo frame, which paints `fog`, and yet its job is to
          pass itself off as the section's bone. That's why the search climbs
          up to the first ancestor WITH GRAIN and compares against that one.
        */
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
        /** It's painted the same color as its surface: it's acting as background. */
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
