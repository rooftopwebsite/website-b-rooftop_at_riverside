import { readFileSync, writeFileSync, statSync } from 'node:fs';

const COLORS = Object.fromEntries(
  [...readFileSync('src/lib/brand.ts', 'utf8').matchAll(/^\s+'?([a-z-]+)'?:\s*'(#[0-9A-Fa-f]{6})'/gm)].map(
    (m) => [m[1], m[2]],
  ),
);
for (const t of ['deep', 'cream']) {
  if (!COLORS[t]) {
    console.error(`could not read the \`${t}\` token from src/lib/brand.ts`);
    process.exit(1);
  }
}

const INPUT = 'design-audit/tmp/horizon.svg';
const WAVE_OUTPUT = 'src/components/shared/horizon-wave.ts';
const SUN_OUTPUT = 'public/brand/sun-palm.svg';

const svg = readFileSync(INPUT, 'utf8');
const before = statSync(INPUT).size;

const round = (s) => s.replace(/-?\d+\.\d+/g, (n) => String(Math.round(Number(n) * 10) / 10));

const waves = [...svg.matchAll(/<path id="Vector(?:_2)?" d="([^"]+)"/g)].map((m) => round(m[1]));
if (waves.length !== 2) {
  console.error(`expected 2 wave paths, found ${waves.length}`);
  process.exit(1);
}

const viewBox = (svg.match(/viewBox="([^"]+)"/) ?? [])[1];

writeFileSync(
  WAVE_OUTPUT,
  `export const HORIZON = {
  viewBox: '${viewBox}',
  waves: [
${waves.map((d) => `    '${d}',`).join('\n')}
  ],
} as const;
`,
);

const sunGroup = svg.match(/<g id="Group 2134282044">([\s\S]*?)<\/g>\s*<\/g>/);
if (!sunGroup) {
  console.error('the medallion group was not found');
  process.exit(1);
}

const c = sunGroup[1].match(/<circle[^>]*cx="([\d.]+)"[^>]*cy="([\d.]+)"[^>]*r="([\d.]+)"/);
if (!c) {
  console.error('the medallion circle was not found');
  process.exit(1);
}
const [, cx, cy, r] = c.map(Number);
const margin = r * 0.18;
const side = (r + margin) * 2;

let body = round(sunGroup[1])
  .replace(/\s+id="[^"]*"/g, '')
  .replace(/<\/?g[^>]*>/g, '')
  .replace(/#003A3A/gi, COLORS.deep)
  .replace(/#FFF7ED/gi, COLORS.cream)
  .replace(/>\s+</g, '><')
  .trim();

const sunSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${side.toFixed(0)}" height="${side.toFixed(0)}" viewBox="${(cx - r - margin).toFixed(1)} ${(cy - r - margin).toFixed(1)} ${side.toFixed(1)} ${side.toFixed(1)}" fill="none">${body}</svg>`;

for (const t of ['svg', 'g']) {
  const opens = (sunSvg.match(new RegExp(`<${t}[ >]`, 'g')) ?? []).length;
  const closes = (sunSvg.match(new RegExp(`</${t}>`, 'g')) ?? []).length;
  if (opens !== closes) {
    console.error(
      `❌ the medallion SVG ended up unbalanced: <${t}> opens ${opens} times and closes ${closes}.\n` +
        '   The file is not written. An invalid SVG draws NOTHING and gives no warning.',
    );
    process.exit(1);
  }
}

writeFileSync(SUN_OUTPUT, sunSvg);

const waveWeight = statSync(WAVE_OUTPUT).size;
const sunWeight = statSync(SUN_OUTPUT).size;
console.log(`input             ${(before / 1024).toFixed(1)} KB`);
console.log(`${WAVE_OUTPUT}  ${(waveWeight / 1024).toFixed(1)} KB  (inline)`);
console.log(`${SUN_OUTPUT}          ${(sunWeight / 1024).toFixed(1)} KB  (file, cached)`);
console.log(
  `total ${((waveWeight + sunWeight) / 1024).toFixed(1)} KB  (−${(100 - ((waveWeight + sunWeight) / before) * 100).toFixed(0)} %), and of that only ${(waveWeight / 1024).toFixed(1)} KB travel in the HTML`,
);
