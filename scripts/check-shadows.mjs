import { chromium } from 'playwright';

const BASE = process.env.BASE ?? 'http://localhost:3000';
const CHECK = process.argv.includes('--check');

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

const PROBE = () => {
  const out = [];

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
      const reach = blur + spread;
      t = Math.max(t, reach - dy);
      b = Math.max(b, reach + dy);
      l = Math.max(l, reach - dx);
      r = Math.max(r, reach + dx);
    }
    return t <= 0 && r <= 0 && b <= 0 && l <= 0 ? null : [t, r, b, l];
  };

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

    let clipper = null;
    for (let p = el.parentElement; p && p !== document.documentElement; p = p.parentElement) {
      const ps = getComputedStyle(p);
      if (ps.overflowX !== 'visible' || ps.overflowY !== 'visible') {
        clipper = {
          node: p,
          ox: ps.overflowX,
          oy: ps.overflowY,
          scrollsX: p.scrollWidth - p.clientWidth > 1,
          scrollsY: p.scrollHeight - p.clientHeight > 1,
        };
        break;
      }
    }
    if (!clipper) continue;

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
