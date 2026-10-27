import { readFileSync } from 'node:fs';

const CSS = readFileSync(new URL('../src/app/globals.css', import.meta.url), 'utf8');

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

const composite = (pattern, field, a) =>
  rgb(pattern).map((c, i) => Math.round(c * a + rgb(field)[i] * (1 - a)));

function lab([r, g, b]) {
  const lin = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  const X = (0.4124 * lin[0] + 0.3576 * lin[1] + 0.1805 * lin[2]) / 0.95047;
  const Y = 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
  const Z = (0.0193 * lin[0] + 0.1192 * lin[1] + 0.9505 * lin[2]) / 1.08883;
  const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (841 / 108) * t + 4 / 29);
  return [116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))];
}

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

const target = (delta(P.ink, P.sunset, 0.15) + delta(P.cream, P.deep, 0.2)) / 2;
console.log(`\nTarget = average ΔE of panels 02 and 03 → ${target.toFixed(1)}\n`);

console.log('Opacity that puts each panel on the target\n');
for (const c of PANELS) {
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
