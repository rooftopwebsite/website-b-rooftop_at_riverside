/**
 * Looks for SHADOWS CLIPPED by an ancestor with `overflow` other than `visible`.
 *
 *   BASE=http://localhost:3000 node scripts/check-shadows.mjs
 *   node scripts/check-shadows.mjs --check     → exits with 1 if it finds any
 *
 * ⚠️ WHAT PROBLEM IT GUARDS AGAINST, because it's one of those you see but can't explain.
 * A card with `shadow-card` inside a carousel (`overflow-x-auto`) or a
 * marquee (`overflow-hidden`) shows its shadow CUT OFF SHARPLY at the edge
 * of the container: instead of a halo that fades out, you get a gray rectangle
 * with a hard edge. Camila flagged it on the yard tickets —«the shadows shouldn't
 * be trapped in the div»— and it was in four places on the site.
 *
 * ⚠️ THE TRAP THAT ALWAYS LETS THIS SLIP THROUGH: declaring `overflow-x: auto`
 * computes `overflow-y` to `auto` as well. That means a horizontal carousel
 * clips TOP AND BOTTOM even though nobody asked for vertical scroll, and the bottom
 * shadow —which is the biggest one, because shadows fall downward— is the first to get
 * eaten. Looking at the axis you touched isn't enough.
 *
 * The fix is always the same and is written at every call site: padding on
 * the clipping container, and —if needed— a negative margin or `scroll-px-*`
 * so the layout and the snap don't move.
 *
 * How it measures: for each element with `box-shadow` (not `inset`) or
 * `filter: drop-shadow`, it calculates how far the shadow extends beyond its
 * box and compares it with the room left by the clip box of the nearest
 * clipping ancestor.
 *
 * ⚠️ IT ONLY COUNTS THE SIDE WHOSE EDGE IS INSIDE THE CLIP BOX. Without that, the
 * fourth card of a carousel —which is out of view because it hasn't been
 * scrolled to yet— gets reported with «missing 1400px on the right», which
 * is noise and not a defect.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ AND IT DOESN'T COUNT THE AXIS ON WHICH THE CONTAINER ACTUALLY SCROLLS. It's the
 * rule that decides what's a defect and what's design, and it had to be learned
 * by breaking something.
 *
 * The side of a carousel is the WINDOW through which you see there's more
 * content: the clipping there isn't an accident, it's the piece that communicates that
 * the row continues. Pushing it outward so the first card's shadow fits,
 * what comes in through the gap is half of the NEXT card, and that
 * does read as an error. Camila, about the `WhatsOn` carousel after
 * that change: «you can see a bit of the 4th card and it's cut off and looks bad, before
 * it was fine».
 *
 * What's always a defect is clipping on the CROSS axis —the bottom
 * of a horizontal carousel— because there's nothing to show there: it's just
 * shadow cut off sharply. And it shows up on its own, without anyone asking for it, because
 * declaring `overflow-x: auto` computes `overflow-y` to `auto`.
 *
 * The condition is `scrollWidth > clientWidth` and not «has overflow-x»: a
 * container with `overflow-x: auto` whose content fits does NOT scroll, so
 * there the side clipping is an accident again and gets reported. It's
 * exactly the case of the three `YardSteps` tickets on desktop.
 * ══════════════════════════════════════════════════════════════════════════
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE ?? 'http://localhost:3000';
const CHECK = process.argv.includes('--check');

/** The site's 10 routes. They all have cards, carousels or photos. */
const ROUTES = [
  '/',
  '/the-yard',
  '/sunset-bar',
  '/whats-on',
  '/events',
  '/food-trucks',
  '/our-story',
  '/contact',
  '/join-us',
  '/market',

];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 834, height: 1112 },
  { name: 'mobile', width: 390, height: 844 },
];

/** Runs in the browser. Returns one finding per clipped shadow. */
const PROBE = () => {
  const out = [];

  /** Splits by TOP-LEVEL commas: `rgba(...)` has commas inside. */
  const layers = (value) => {
    const res = [];
    let level = 0;
    let cur = '';
    for (const ch of value) {
      if (ch === '(') level++;
      if (ch === ')') level--;
      if (ch === ',' && level === 0) {
        res.push(cur);
        cur = '';
      } else cur += ch;
    }
    res.push(cur);
    return res;
  };

  /** Extent of a `box-shadow`, in px: [top, right, bottom, left]. */
  const extBox = (value) => {
    if (!value || value === 'none') return null;
    let t = 0;
    let r = 0;
    let b = 0;
    let l = 0;
    for (const layer of layers(value)) {
      if (/\binset\b/.test(layer)) continue;
      const nums = (layer.replace(/\w+\([^)]*\)/g, ' ').match(/-?[\d.]+px/g) ?? []).map(parseFloat);
      const [dx = 0, dy = 0, blur = 0, spread = 0] = nums;
      /*
       * ⚠️ THE REACH IS `blur + spread` AND NOT `blur / 2 + spread`, and the
       * first version of this guard used the latter. It was the literal
       * reading of the spec —the transition happens within ±blur/2 around the shadow's
       * edge— and it gives green on shadows that look cut off to the eye.
       *
       * The reason is that the spec describes where the MIDDLE of the gradient is, not
       * where it stops being visible. The blur is a gaussian with sigma = blur/2,
       * and a gaussian has a tail: at blur/2 from the edge there's still about
       * a third of the value left. With a shadow at 55 % opacity over a dark
       * slab, that third is perfectly visible.
       *
       * Measured with a pixel profile over the `WhatsOn` carousel
       * (`0 18px 44px -12px`, old reach 28px, padding 32px, i.e. «room to spare»):
       * at the container's edge the luminance was still 4 levels
       * below the background, and that straight step is exactly what Camila
       * flagged — «I still see the shadow contained in a frame».
       *
       * With `blur + spread` the reach of that same shadow comes to 50px and the guard
       * asks for the padding that's really needed.
       */
      const reach = blur + spread;
      t = Math.max(t, reach - dy);
      b = Math.max(b, reach + dy);
      l = Math.max(l, reach - dx);
      r = Math.max(r, reach + dx);
    }
    return t <= 0 && r <= 0 && b <= 0 && l <= 0 ? null : [t, r, b, l];
  };

  /** Same for `filter: drop-shadow(...)`, which has no spread. */
  const extFilter = (value) => {
    if (!value || value === 'none') return null;
    let t = 0;
    let r = 0;
    let b = 0;
    let l = 0;
    let found = false;
    for (const m of value.matchAll(/drop-shadow\(([^)]*\)[^)]*|[^)]*)\)/g)) {
      const nums = (m[1].replace(/\w+\([^)]*\)/g, ' ').match(/-?[\d.]+px/g) ?? []).map(parseFloat);
      if (!nums.length) continue;
      found = true;
      /* Same criterion as in `extBox`: the WHOLE blur, not half.
         `drop-shadow` has no spread, so the blur is the entire reach. */
      const [dx = 0, dy = 0, blur = 0] = nums;
      t = Math.max(t, blur - dy);
      b = Math.max(b, blur + dy);
      l = Math.max(l, blur - dx);
      r = Math.max(r, blur + dx);
    }
    return found ? [t, r, b, l] : null;
  };

  const selectorPath = (el) => {
    const p = [];
    for (let n = el; n && n.nodeType === 1 && p.length < 4; n = n.parentElement) {
      let s = n.tagName.toLowerCase();
      const cls = (n.getAttribute('class') ?? '').split(/\s+/).filter(Boolean).slice(0, 3).join('.');
      if (n.id) s += '#' + n.id;
      else if (cls) s += '.' + cls;
      p.unshift(s);
    }
    return p.join(' > ');
  };

  for (const el of document.querySelectorAll('*')) {
    const cs = getComputedStyle(el);
    const ext = extBox(cs.boxShadow) ?? extFilter(cs.filter);
    if (!ext) continue;
    const box = el.getBoundingClientRect();
    if (box.width < 2 || box.height < 2) continue;

    /* The nearest clipping ancestor. A `filter` or a `transform` on the
       ancestor don't clip; `overflow` other than `visible` does. */
    let clipper = null;
    for (let p = el.parentElement; p && p !== document.documentElement; p = p.parentElement) {
      const ps = getComputedStyle(p);
      if (ps.overflowX !== 'visible' || ps.overflowY !== 'visible') {
        clipper = {
          node: p,
          ox: ps.overflowX,
          oy: ps.overflowY,
          /* If the content REALLY overflows, the clipping on that axis is the
             carousel's window and not a defect. See the note in the header. */
          scrollsX: p.scrollWidth - p.clientWidth > 1,
          scrollsY: p.scrollHeight - p.clientHeight > 1,
        };
        break;
      }
    }
    if (!clipper) continue;

    /* The clip box is the ancestor's PADDING box: padding gives breathing room, and
       padding is precisely how this gets fixed. */
    const pc = clipper.node.getBoundingClientRect();
    const slack = {
      top: box.top - pc.top,
      right: pc.right - box.right,
      bottom: pc.bottom - box.bottom,
      left: box.left - pc.left,
    };
    const [et, er, eb, elf] = ext;
    const clipsX = clipper.ox !== 'visible' && !clipper.scrollsX;
    const clipsY = clipper.oy !== 'visible' && !clipper.scrollsY;
    const inside = (v) => v >= -0.5;
    const missing = {};
    if (clipsY && inside(slack.top) && et > slack.top + 0.5)
      missing.top = +(et - slack.top).toFixed(1);
    if (clipsX && inside(slack.right) && er > slack.right + 0.5)
      missing.right = +(er - slack.right).toFixed(1);
    if (clipsY && inside(slack.bottom) && eb > slack.bottom + 0.5)
      missing.bottom = +(eb - slack.bottom).toFixed(1);
    if (clipsX && inside(slack.left) && elf > slack.left + 0.5)
      missing.left = +(elf - slack.left).toFixed(1);
    if (!Object.keys(missing).length) continue;

    out.push({
      el: selectorPath(el),
      clipper: selectorPath(clipper.node),
      overflow: `${clipper.ox}/${clipper.oy}`,
      missing,
    });
  }
  return out;
};

const browser = await chromium.launch();
const findings = [];

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  for (const r of ROUTES) {
    try {
      await page.goto(BASE + r, { waitUntil: 'networkidle', timeout: 60000 });
    } catch {
      console.error(`  (does not load) ${r}`);
      continue;
    }
    /*
     * You have to scroll down to the footer: the cards enter with a reveal and before
     * appearing they have no shadow to measure.
     *
     * ⚠️ AND YOU HAVE TO WAIT FOR THE REVEAL TO FINISH, not just for it to fire. The
     * `RevealItem`s enter with an inline `translateY`: measured mid-
     * animation, the card is shifted downward and its bottom edge
     * sits closer to the container's edge than it will at
     * rest. With 300ms the guard reported «missing 10px» on the yard
     * tickets intermittently, and at rest there are four to spare.
     *
     * 900ms covers the site's longest entrance (620ms) with margin.
     */
    await page.evaluate(async () => {
      const step = Math.round(window.innerHeight * 0.7);
      const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await sleep(120);
      }
      window.scrollTo(0, 0);
      await sleep(900);
    });
    for (const h of await page.evaluate(PROBE)) findings.push({ vp: vp.name, route: r, ...h });
  }
  await ctx.close();
}
await browser.close();

/* Groups by (element, clipping ancestor) and keeps the worst case. */
const map = new Map();
for (const h of findings) {
  const k = `${h.el} ||| ${h.clipper}`;
  const worst = Math.max(...Object.values(h.missing));
  if (!map.has(k) || worst > map.get(k).worst) {
    map.set(k, { ...h, worst, vps: new Set(), routes: new Set() });
  }
  map.get(k).vps.add(h.vp);
  map.get(k).routes.add(h.route);
}
const list = [...map.values()].sort((a, b) => b.worst - a.worst);

if (!list.length) {
  console.log(`✅ no clipped shadows across ${ROUTES.length} routes x ${VIEWPORTS.length} widths`);
  process.exit(0);
}

console.log(`\n❌ ${list.length} clipped shadows\n`);
for (const h of list) {
  console.log(`[missing ${h.worst}px]  ${JSON.stringify(h.missing)}   (${[...h.vps].join(', ')})`);
  console.log(`   element  : ${h.el}`);
  console.log(`   clipper  : ${h.clipper}   overflow ${h.overflow}`);
  console.log(`   routes   : ${[...h.routes].slice(0, 6).join(' ')}`);
  console.log('');
}
console.log('The fix is padding on the clipping container. See `YardSteps.tsx`.');
process.exit(CHECK ? 1 : 0);
