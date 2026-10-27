import { readFileSync, writeFileSync } from 'node:fs';

const CSS = readFileSync(new URL('../src/app/globals.css', import.meta.url), 'utf8');

function readPalette() {
  const p = {};
  for (const m of CSS.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{3,8})\s*;/g)) {
    p[m[1]] = m[2].toUpperCase();
  }
  if (Object.keys(p).length === 0) throw new Error('no --color-* found in globals.css');
  return p;
}

const P = readPalette();

const hx = (h) => {
  h = h.replace('#', '');
  if (h.length === 3) h = [...h].map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
};
const lin = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const L = (h) => {
  const [r, g, b] = hx(h).map(lin);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const hex = (n) => P[n] ?? (n.startsWith('#') ? n.toUpperCase() : null);
function ratio(a, b) {
  const ha = hex(a), hb = hex(b);
  if (!ha) throw new Error(`unknown token: ${a}`);
  if (!hb) throw new Error(`unknown token: ${b}`);
  const x = L(ha), y = L(hb);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

const PAIRS = [
  ['— Text on the two light surfaces —'],
  ['ink', 'paper', 'Headlines and body on the base', 'body'],
  ['ink', 'bone', 'Headlines and body on the second surface', 'body'],
  ['body', 'paper', 'Body — same value as `ink`, separate token', 'body'],
  ['muted', 'paper', '**The subhead** and secondary text', 'body'],
  ['muted', 'bone', 'The subhead on the second surface', 'body'],
  ['muted', 'cream', 'The subhead on a yellow pill', 'body'],

  ['— Text on the dark band —'],
  ['paper', 'deep', 'Headlines and body on the Events band and the footer', 'body'],
  ['muted-dark', 'deep', '**The subhead** on dark — the pair `npm run a11y` found', 'body'],
  ['cream', 'deep', 'Eyebrow and detail on dark', 'body'],
  ['paper', 'deeper', 'Header text', 'body'],
  ['muted', 'deep', '❌ `muted` on dark — the bug that had to be fixed', 'body'],

  ['— The newsletter card: `teal600`, where ONLY white passes —'],
  ['paper', 'teal600', 'All the card text — headline, subhead and errors', 'body'],
  ['teal600', 'deep', 'The card against the footer slab — two surfaces, no minimum', 'deco'],
  ['cream', 'teal600', 'The «Join» button fill and the focus ring', 'ui'],
  ['muted-dark', 'teal600', '❌ the subhead in `muted-dark` — that is why the card overrides `--lead-ink`', 'body'],
  ['tomato-soft', 'teal600', '❌ the error in red — that is why the errors stayed white', 'body'],
  ['bone', 'teal600', '❌ not even `bone` makes it: this surface\'s ceiling is 4.59', 'body'],

  ['— Brand fills: the text on top goes BLACK —'],
  ['#000000', 'sunset', 'Primary CTA text', 'body'],
  ['#000000', 'river', 'Text on teal fill', 'body'],
  ['#000000', 'cream', 'Text on the yellow pill', 'body'],
  ['deep', 'cream', 'Text on cream button (the CTA on dark)', 'body'],

  ['— The headline accent, in two colors depending on surface —'],
  ['sunset-deep', 'paper', 'Accent on light — display only, NOT body', 'large'],
  ['sunset-deep', 'bone', 'Accent on the second surface — display only', 'large'],
  ['sunset', 'deep', 'Accent on dark — display only, NOT body', 'large'],

  ['— The error and pending-data red on light —'],
  ['terra', 'paper', 'Form error and pending marker', 'body'],
  ['terra', 'bone', 'Same on the second surface', 'body'],

  ['— Eyebrows: only the tones that pass —'],
  ['deep', 'paper', 'Eyebrow and colored text on light', 'body'],
  ['deep', 'bone', 'Eyebrow on the second surface', 'body'],
  ['plum', 'paper', 'Alternative eyebrow', 'body'],
  ['plum', 'bone', 'Alternative eyebrow', 'body'],
  ['magenta', 'paper', 'Editorial eyebrow', 'body'],
  ['magenta', 'bone', 'Editorial eyebrow', 'body'],

  ['— Focus ring (WCAG 1.4.11, 3:1) —'],
  ['ink', 'paper', 'Ring on light', 'ui'],
  ['ink', 'sunset', 'Ring on the orange CTA', 'ui'],
  ['cream', 'deep', 'Ring on dark', 'ui'],

  ['— 1px rules: decorative, not controls —'],
  ['fog', 'paper', 'The rule that replaces the cards', 'deco'],
  ['fog', 'bone', 'same on the second surface', 'deco'],

  ['— BANNED, measured so the reason is on record —'],
  ['sunset', 'paper', '❌ orange as TEXT on light', 'body'],
  ['sunset', 'bone', '❌ same on the second surface', 'body'],
  ['river', 'paper', '❌ mid teal as TEXT on light', 'body'],
  ['paper', 'sunset', '❌ white on the orange CTA', 'body'],
  ['paper', 'river', '❌ white on teal fill', 'body'],
  ['teal600', 'cream', '❌ teal600 on yellow — the historical case', 'body'],
];

const minimum = (t) => (t === 'body' ? 4.5 : t === 'deco' ? 0 : 3);

const rows = [];
let failures = 0;
for (const pair of PAIRS) {
  if (pair.length === 1) {
    rows.push({ section: pair[0] });
    continue;
  }
  const [f, b, use, type] = pair;
  const r = ratio(f, b);
  const passes = r >= minimum(type);
  const banned = use.startsWith('❌');
  if (!passes && !banned && type !== 'deco') failures++;
  rows.push({ f, b, use, type, r, passes, banned });
}

const name = (n) => (n.startsWith('#') ? `\`${n}\`` : `\`${n}\``);
const value = (n) => hex(n);

let md = `# Measured contrast — \`redesign/light-tropical\`

Generated by \`node scripts/contrast.mjs\`. **The palette is read from
\`src/app/globals.css\`**, it is not written in the script: it is the fix for the
problem the audit found, where \`scripts/contrast.mjs\` had the
palette copied by hand and it had gone stale, so all the documented
ratios were calculated against colors the site did not paint.

Method: WCAG 2.1 relative luminance. Minimums: **4.5:1** for body,
**3:1** for large text (≥24px, or ≥19px bold) and for non-text
interface components (WCAG 1.4.11). A decorative rule is not an interface
component and has no minimum.

## The palette that was measured

| token | hex |
|---|---|
${Object.entries(P)
  .map(([k, v]) => `| \`${k}\` | \`${v}\` |`)
  .join('\n')}

## The pairs

| Pair | Use | Ratio | Minimum | Status |
|---|---|---:|---:|---|
`;

for (const x of rows) {
  if (x.section) {
    md += `| **${x.section}** | | | | |\n`;
    continue;
  }
  const min = x.type === 'deco' ? '—' : `${minimum(x.type)}:1`;
  let status;
  if (x.banned) status = x.passes ? '⚠️ passes but is banned for another reason' : '🚫 **banned, and this is why**';
  else if (x.type === 'deco') status = '➖ exempt — decorative';
  else if (!x.passes) status = '❌ **FAILS**';
  else if (x.type === 'body' && x.r >= 7) status = '✅ AAA';
  else status = '✅ AA';
  md += `| ${name(x.f)} \`${value(x.f)}\` on ${name(x.b)} \`${value(x.b)}\` | ${x.use} | **${x.r.toFixed(2)}:1** | ${min} | ${status} |\n`;
}

md += `
## The hard rules that come out of the table

1. **Orange and mid teal are not text colors on light.** They give
   ${ratio('sunset', 'paper').toFixed(2)}:1 and ${ratio('river', 'paper').toFixed(2)}:1 on the base, and on the second surface
   even less (${ratio('sunset', 'bone').toFixed(2)}:1). They don't even pass the large-text minimum, at
   any size. That is why the headline accent is **in two colors depending on the
   surface**: \`sunset-deep\` on light, \`sunset\` on dark. The two
   are the SAME hue (28.3°) and the same saturation; between them only the
   lightness changes, and that is why the accent reads orange on both surfaces.
2. **On orange or teal fill, the text goes black.** White gives
   ${ratio('paper', 'sunset').toFixed(2)}:1 and ${ratio('paper', 'river').toFixed(2)}:1; black gives ${ratio('#000000', 'sunset').toFixed(2)}:1 and ${ratio('#000000', 'river').toFixed(2)}:1.
3. **The headline accent is display-only, on both sides.** \`sunset\`
   on \`deep\` gives ${ratio('sunset', 'deep').toFixed(2)}:1, and \`sunset-deep\` on \`paper\` gives
   ${ratio('sunset-deep', 'paper').toFixed(2)}:1 (on \`bone\`, ${ratio('sunset-deep', 'bone').toFixed(2)}:1). Both pass the 3:1 for
   large text and neither the 4.5:1 for body: they work for one word of an
   88px headline, not for a subhead. The \`terra\` red —${ratio('terra', 'paper').toFixed(2)}:1— is the
   one that can go in body, and it is the one for form errors.
4. **The subhead has an opaque token and not an opacity.** \`muted\`
   \`${P.muted}\` passes AA on the three light surfaces
   (${ratio('muted', 'paper').toFixed(2)}:1 · ${ratio('muted', 'bone').toFixed(2)}:1 · ${ratio('muted', 'cream').toFixed(2)}:1). With \`text-body/75\` the resulting
   color changed depending on whatever was behind it, so it couldn't be measured.
5. **The focus ring inverts on dark.** \`ink\` on \`deep\` would be
   ${ratio('ink', 'deep').toFixed(2)}:1 — invisible. The \`.on-dark\` rule in globals.css switches it to
   \`cream\`, which gives ${ratio('cream', 'deep').toFixed(2)}:1.

## Composite colors — what this table CANNOT foresee

A translucent color over another translucent one over a photo can't be resolved
here: it only shows up by measuring the rendered pixel. The known case is the
\`video\` label on the hero wall, which is translucent \`paper\` over a translucent
fill. **It is verified with \`npm run a11y\` on the served page**, not in
this table.

With the light direction that label becomes opaque \`muted\` on opaque
\`paper\`, i.e. ${ratio('muted', 'paper').toFixed(2)}:1 measurable here — which is one of the reasons why
it is better for the wall to stop relying on opacities.
`;

if (process.argv.includes('--check')) {
  console.log(failures === 0 ? '✅ all pairs in use pass their minimum' : `❌ ${failures} pair(s) below the minimum`);
  process.exit(failures === 0 ? 0 : 1);
}

writeFileSync(new URL('../design-audit/CONTRAST.md', import.meta.url), md);
console.log(`CONTRAST.md written · ${Object.keys(P).length} tokens read from globals.css · ${rows.filter((f) => !f.section).length} pairs measured`);
console.log(failures === 0 ? '✅ all pairs in use pass their minimum' : `❌ ${failures} pair(s) below the minimum`);
