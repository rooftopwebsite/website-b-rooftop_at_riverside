/**
 * Generates `design-audit/specimen.html`: the type scale and the surfaces
 * RENDERED, to look at them before applying them to the site.
 *
 *   node design-audit/specimen.mjs
 *
 * ⚠️ Everything is read from `src/app/globals.css`. Not a single value written here. It's the
 * replacement for `public/_specimen.html`, which had been left pointing to the three
 * discarded families and to .woff2 files that no longer exist.
 *
 * The fonts are referenced by a path relative to `src/app/fonts/`, so the
 * file opens with `file://` and doesn't need a server.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const CSS = readFileSync(new URL('../src/app/globals.css', import.meta.url), 'utf8');

/** Reads a token from @theme (static value) and its `:root` override if it exists. */
function token(name) {
  const all = [...CSS.matchAll(new RegExp(`--${name}:\\s*([^;]+);`, 'g'))].map((m) =>
    m[1].trim(),
  );
  if (all.length === 0) return null;
  /* The last one wins: `:root` comes after `@theme` in the file. */
  return all[all.length - 1];
}

const T = {
  hero: token('text-hero'),
  heroLh: token('text-hero--line-height'),
  h1: token('text-h1'),
  h1Lh: token('text-h1--line-height'),
  h2: token('text-h2'),
  h2Lh: token('text-h2--line-height'),
  h3: token('text-h3'),
  h3Lh: token('text-h3--line-height'),
  lead: token('text-lead'),
  leadLh: token('text-lead--line-height'),
  base: token('text-base'),
  baseLh: token('text-base--line-height'),
  caption: token('text-caption'),
  eyebrowTrack: token('tracking-eyebrow'),
  paper: token('color-paper'),
  bone: token('color-bone'),
  cream: token('color-cream'),
  deep: token('color-deep'),
  sunset: token('color-sunset'),
  ink: token('color-ink'),
  muted: token('color-muted'),
  fog: token('color-fog'),
  terra: token('color-terra'),
};

const missing = Object.entries(T).filter(([, v]) => v == null).map(([k]) => k);
if (missing.length) {
  console.error('tokens not found in globals.css:', missing.join(', '));
  process.exit(1);
}

const H1 = 'Bonita comes together';
const LEAD =
  'Rooftop bar over a curated food truck park in downtown Bonita Springs. Four independent kitchens, craft cocktails and live music five nights a week.';
const BODY =
  'Four trucks park in the yard and each one is somebody’s own business. You order at the window, you pay that truck. Separate line, separate card, separate receipt. The Sunset Bar on the roof is ours, and it is the one tab we run.';

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Specimen — Rooftop at Riverside · redesign/light-tropical</title>
<style>
  @font-face{font-family:'RT Display';src:url('../src/app/fonts/big-shoulders-variable.woff2') format('woff2-variations');font-weight:100 900;font-display:block}
  @font-face{font-family:'RT Body';src:url('../src/app/fonts/jost-variable.woff2') format('woff2-variations');font-weight:100 900;font-display:block}

  :root{
    --paper:${T.paper}; --bone:${T.bone}; --cream:${T.cream}; --deep:${T.deep};
    --sunset:${T.sunset}; --ink:${T.ink}; --muted:${T.muted}; --fog:${T.fog}; --terra:${T.terra};
    --hero:${T.hero}; --h1:${T.h1}; --h2:${T.h2}; --h3:${T.h3};
    --lead:${T.lead}; --base:${T.base}; --caption:${T.caption};
  }
  *{box-sizing:border-box}
  body{margin:0;background:var(--paper);color:var(--ink);font-family:'RT Body',system-ui,sans-serif;font-size:var(--base);line-height:${T.baseLh};-webkit-font-smoothing:antialiased}
  .wrap{max-width:1280px;margin:0 auto;padding:0 32px}
  .band{padding:56px 0;border-bottom:1px solid var(--fog)}
  .band.bone{background:var(--bone)}
  .band.deep{background:var(--deep);color:var(--paper);border-bottom:0}

  .meta{font-family:ui-monospace,'SF Mono',monospace;font-size:11px;letter-spacing:.04em;color:var(--muted);margin:0 0 10px}
  .band.deep .meta{color:var(--cream)}

  .d{font-family:'RT Display',Arial Narrow,sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:0;margin:0}
  .hero{font-size:var(--hero);line-height:${T.heroLh}}
  .h1{font-size:var(--h1);line-height:${T.h1Lh}}
  .h2{font-size:var(--h2);line-height:${T.h2Lh}}
  .h3{font-size:var(--h3);line-height:${T.h3Lh}}

  .lead{font-family:'RT Body';font-weight:300;font-size:var(--lead);line-height:${T.leadLh};color:var(--muted);max-width:60ch;margin:16px 0 0}
  .band.deep .lead{color:var(--cream)}
  .body{max-width:75ch;margin:14px 0 0}
  .eyebrow{font-family:'RT Body';font-weight:500;text-transform:uppercase;font-size:var(--caption);letter-spacing:${T.eyebrowTrack};color:var(--deep);margin:0 0 12px}
  .band.deep .eyebrow{color:var(--cream)}
  .accent{color:var(--terra)}
  .band.deep .accent{color:var(--sunset)}

  .weights > div{font-family:'RT Display';font-size:64px;line-height:.9;text-transform:uppercase}
  .cmp{display:flex;gap:28px;align-items:baseline;flex-wrap:wrap;margin-top:8px}
  .surf{display:flex;flex-wrap:wrap;gap:0;margin-top:18px;border:1px solid var(--fog)}
  .surf div{flex:1 1 140px;min-height:96px;display:flex;align-items:flex-end;padding:10px;font-family:ui-monospace,monospace;font-size:10px;line-height:1.4}
  .pill{display:inline-block;background:var(--cream);color:#000;font-weight:500;font-size:13px;padding:5px 13px;border-radius:9999px}
  .cta{display:inline-block;background:var(--sunset);color:#000;font-weight:500;font-size:16px;padding:14px 26px;border-radius:10px;text-transform:uppercase;letter-spacing:.06em}
  .rule{border:0;border-top:1px solid var(--fog);margin:34px 0}
</style>
</head>
<body>

<div class="band">
  <div class="wrap">
    <p class="meta">SPECIMEN GENERATED FROM src/app/globals.css · branch redesign/light-tropical · resize the window to see the clamps</p>
    <p class="eyebrow">Display scale</p>

    <p class="meta">hero · ${T.hero} · lh ${T.heroLh} · weight 600 · the home page h1, and only that one</p>
    <h1 class="d hero">${H1.split(' ').slice(0, 2).join(' ')}<br>together</h1>

    <hr class="rule">
    <p class="meta">h1 · ${T.h1} · lh ${T.h1Lh} · the h1 of the 22 inner pages</p>
    <p class="d h1">Four kitchens in the yard</p>

    <hr class="rule">
    <p class="meta">h2 · ${T.h2} · lh ${T.h2Lh} · every section headline · BEFORE: 28→46px</p>
    <p class="d h2">Five businesses, one set of stairs.</p>

    <hr class="rule">
    <p class="meta">h3 · ${T.h3} · lh ${T.h3Lh} · floor 28px, above the 24px minimum</p>
    <p class="d h3">Order at whichever window you want</p>
  </div>
</div>

<div class="band bone">
  <div class="wrap">
    <p class="eyebrow">The hierarchy jump</p>
    <p class="meta">h2 over subhead — the number this redesign fixes</p>
    <p class="d h2">This week in the yard</p>
    <p class="lead">${LEAD}</p>
    <p class="meta" style="margin-top:22px">BEFORE 46px / 18px = 2.6× · NOW ${T.h2} / ${T.lead} = 4.0× at the top</p>
    <hr class="rule">
    <p class="meta">body · ${T.base} · lh ${T.baseLh} · 75 characters max</p>
    <p class="body">${BODY}</p>
  </div>
</div>

<div class="band">
  <div class="wrap">
    <p class="eyebrow">Display weights — why 600</p>
    <div class="weights">
      <p class="meta">400 — what it was: at this size it reads light, almost hairline</p>
      <div style="font-weight:400">Bonita comes together</div>
      <p class="meta" style="margin-top:18px">600 — the decision: stem body without closing the counters</p>
      <div style="font-weight:600">Bonita comes together</div>
      <p class="meta" style="margin-top:18px">700 — what the brief asked for: it starts to clog</p>
      <div style="font-weight:700">Bonita comes together</div>
    </div>

    <hr class="rule">
    <p class="eyebrow">Tracking — why zero</p>
    <div class="cmp">
      <div><p class="meta">−0.01em (brief)</p><div class="d h3" style="letter-spacing:-.01em">TOGETHER</div></div>
      <div><p class="meta">0 (the decision)</p><div class="d h3">TOGETHER</div></div>
      <div><p class="meta">+0.035em (before)</p><div class="d h3" style="letter-spacing:.035em">TOGETHER</div></div>
    </div>

    <hr class="rule">
    <p class="eyebrow">Eyebrow — 0.12em versus 0.24em</p>
    <p class="eyebrow" style="letter-spacing:.24em;margin-bottom:6px">Planning a work event? — 13px / 0.24em, before</p>
    <p class="eyebrow">Planning a work event? — ${T.caption} / ${T.eyebrowTrack}, now</p>
  </div>
</div>

<div class="band bone">
  <div class="wrap">
    <p class="eyebrow">Headline accent — two colors depending on surface</p>
    <p class="d h2">Not a restaurant. <span class="accent">Three of them</span></p>
    <p class="meta" style="margin-top:14px">terra on light: 7.43:1 on paper, 6.87:1 on bone · orange here would give 2.35:1 and is banned</p>
  </div>
</div>

<div class="band deep">
  <div class="wrap">
    <p class="eyebrow">On the dark band</p>
    <p class="d h2">We close the whole place <span class="accent">for you</span></p>
    <p class="lead">Holiday parties, client nights, fundraisers and reunions. You get the rooftop, the yard and four kitchens.</p>
    <p class="meta" style="margin-top:20px">paper on deep 10.83:1 · sunset on deep 4.26:1 — passes for display, NOT for body</p>
    <p style="margin-top:22px"><span class="cta">Plan your event</span> &nbsp; <span class="pill">Tonight</span></p>
  </div>
</div>

<div class="band">
  <div class="wrap">
    <p class="eyebrow">Surfaces and their target split</p>
    <div class="surf">
      <div style="background:${T.paper};color:${T.ink}">paper ${T.paper}<br>base · 70–75 % with bone</div>
      <div style="background:${T.bone};color:${T.ink}">bone ${T.bone}<br>2nd surface · 1.08:1 vs paper</div>
      <div style="background:${T.cream};color:#000">cream ${T.cream}<br>pills · ≤5 %</div>
      <div style="background:${T.deep};color:${T.paper}">deep ${T.deep}<br>Events + footer · 20–25 %</div>
      <div style="background:${T.sunset};color:#000">sunset ${T.sunset}<br>CTA · ≤5 % · BLACK text</div>
    </div>
    <p class="meta" style="margin-top:14px">measured on the baseline: 55.4 % deep versus 40.3 % light. target: the inverse.</p>
  </div>
</div>

</body>
</html>
`;

writeFileSync(new URL('./specimen.html', import.meta.url), html);
console.log('specimen.html written · tokens read from globals.css:');
for (const [k, v] of Object.entries(T)) console.log(`  ${k.padEnd(12)} ${v}`);
