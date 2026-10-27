/**
 * Calibrates the opacity of the greek-key pattern panel by panel.
 *
 *   node design-audit/pattern.mjs
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ WHY IT EXISTS. The three panels of «How this place works» carry the
 * same pattern over three different fields, and with the SAME opacity the pattern doesn't
 * weigh the same in all three: `deep` at 15 % over `cream` is a drawing, and
 * `cream` at 20 % over `deep` is a whisper. I noted it in `SELF-CRITIQUE.md` §2
 * and said there that the right fix was one opacity per panel, calibrated
 * against its own field.
 *
 * This measures it instead of estimating it. The perceived strength of a texture isn't
 * its opacity: it's how far it separates in LIGHTNESS from the background it sits on.
 * So the script composites the pattern over its field at a given opacity,
 * converts both to CIELAB **L\*** —which is a perceptual scale, unlike
 * WCAG's relative luminance— and returns the ΔL\*.
 *
 * The target is NOT chosen by eye: it's taken from the two panels that already work
 * (orange and green) and the third one's opacity is solved so it lands on the
 * same ΔL\*.
 *
 * ⚠️ The colors are read from `globals.css`, which is what RENDERS. It's the
 * same rule as `scripts/contrast.mjs`: the old audit was calculated
 * against the copy in `brand.ts`, which said something else.
 * ══════════════════════════════════════════════════════════════════════════
 */
import { readFileSync } from 'node:fs';

const CSS = readFileSync(new URL('../src/app/globals.css', import.meta.url), 'utf8');

/** The `@theme`'s `--color-*: #hex;`. The `var(...)` aliases are skipped. */
function palette() {
  const out = {};
  for (const [, name, hex] of CSS.matchAll(/--color-([a-z-]+):\s*(#[0-9a-fA-F]{3,8})\s*;/g)) {
    out[name] = hex;
  }
  return out;
}

const P = palette();

const rgb = (hex) => {
  const h = hex.replace('#', '');
  const n = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
};

/** `source-over` compositing: the pattern at opacity α over the opaque field. */
const composite = (pattern, field, a) =>
  rgb(pattern).map((c, i) => Math.round(c * a + rgb(field)[i] * (1 - a)));

/** sRGB → CIELAB, D65. The linearization is the same one WCAG uses. */
function lab([r, g, b]) {
  const lin = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  /* sRGB → XYZ D65 matrix, normalized by the reference white. */
  const X = (0.4124 * lin[0] + 0.3576 * lin[1] + 0.1805 * lin[2]) / 0.95047;
  const Y = 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
  const Z = (0.0193 * lin[0] + 0.1192 * lin[1] + 0.9505 * lin[2]) / 1.08883;
  const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (841 / 108) * t + 4 / 29);
  return [116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))];
}

/**
 * ⚠️ ΔE IS MEASURED AND NOT JUST ΔL\*, and that's this script's finding.
 *
 * My self-critique said the pattern was shouting on the cream panel because the
 * `deep`/`cream` pair measures 9.44:1 in WCAG. **That was badly reasoned**: 9.44:1 is
 * a measure of text LEGIBILITY, and in lightness the cream panel turned out to be the
 * softest of the three (ΔL\* 9.9 versus 14.0 for the green).
 *
 * What makes noise there isn't the lightness: it's the HUE. `deep` is a saturated
 * teal and `cream` a saturated yellow — they're almost opposite on the
 * wheel, so the spiral separates from the field by color and not by shade, and
 * that's what turns it into a drawing. ΔL\* sees none of that; ΔE\*ab does,
 * because it includes the a\* and b\* axes.
 */
const delta = (pattern, field, a) => {
  const A = lab(composite(pattern, field, a));
  const B = lab(rgb(field));
  return Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]);
};

const deltaL = (pattern, field, a) => Math.abs(lab(composite(pattern, field, a))[0] - lab(rgb(field))[0]);

const PANELS = [
  { step: '01 · Afternoon', field: 'cream', pattern: 'deep', current: 0.15 },
  { step: '02 · Golden hour', field: 'sunset', pattern: 'ink', current: 0.15 },
  { step: '03 · Night', field: 'deep', pattern: 'cream', current: 0.2 },
];

console.log('\nThe pattern against its own field, with today\'s opacity\n');
console.log('  step                pattern       field      ΔL*     ΔE');
for (const c of PANELS) {
  console.log(
    `  ${c.step.padEnd(18)} ${(c.pattern + '/' + Math.round(c.current * 100) + '%').padEnd(13)} ${c.field.padEnd(10)} ${deltaL(P[c.pattern], P[c.field], c.current).toFixed(1).padStart(4)}  ${delta(P[c.pattern], P[c.field], c.current).toFixed(1).padStart(5)}`
  );
}

/* The target comes from the two panels that already work, not from a made-up
   number: orange and green read as texture, so their average ΔE IS the
   operational definition of «texture» in this palette. */
const target = (delta(P.ink, P.sunset, 0.15) + delta(P.cream, P.deep, 0.2)) / 2;
console.log(`\nTarget = average ΔE of panels 02 and 03 → ${target.toFixed(1)}\n`);

console.log('Opacity that puts each panel on the target\n');
for (const c of PANELS) {
  /* Sweep in 1 % steps: opacity modifiers are written in
     hundredths, so there's no finer resolution worth searching for. */
  let best = 0.01;
  for (let a = 0.01; a <= 0.6; a += 0.01) {
    const d = (x) => Math.abs(delta(P[c.pattern], P[c.field], x) - target);
    if (d(a) < d(best)) best = a;
  }
  const pct = Math.round(best * 100);
  const changes = pct !== Math.round(c.current * 100);
  console.log(
    `  ${c.step.padEnd(18)} ${String(Math.round(c.current * 100)).padStart(3)}% → ${String(pct).padStart(3)}%   ΔE ${delta(P[c.pattern], P[c.field], best).toFixed(1)}${changes ? '   ← changes' : ''}`
  );
}
console.log('');
