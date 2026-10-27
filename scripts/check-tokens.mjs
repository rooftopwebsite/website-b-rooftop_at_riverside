import { readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const CSS = readFileSync(new URL('src/app/globals.css', root), 'utf8');
const TS = readFileSync(new URL('src/lib/brand.ts', root), 'utf8');

function cssPalette() {
  const p = new Map();
  const alias = new Set();
  for (const m of CSS.matchAll(/--color-([a-z0-9-]+):\s*([^;]+);/g)) {
    const [, name, value] = m;
    const v = value.trim();
    if (v.startsWith('var(')) alias.add(name);
    else if (/^#[0-9a-fA-F]{3,8}$/.test(v)) p.set(name, v.toUpperCase());
  }
  return { palette: p, alias };
}

function tsPalette() {
  const block = TS.match(/export const COLORS = \{([\s\S]*?)\n\} as const;/);
  if (!block) throw new Error('`export const COLORS` was not found in src/lib/brand.ts');
  const p = new Map();
  for (const m of block[1].matchAll(/^\s*'?([a-zA-Z0-9-]+)'?:\s*'(#[0-9a-fA-F]{3,8})'/gm)) {
    p.set(m[1], m[2].toUpperCase());
  }
  return p;
}

const { palette: css, alias } = cssPalette();
const ts = tsPalette();

const problems = [];

for (const [name, value] of ts) {
  if (alias.has(name)) continue;
  if (!css.has(name)) {
    problems.push(`· \`${name}\` is in brand.ts (${value}) and NOT in the @theme of globals.css`);
  } else if (css.get(name) !== value) {
    problems.push(
      `· \`${name}\` DIVERGES — globals.css paints ${css.get(name)}, brand.ts declares ${value}`,
    );
  }
}

const cssOnly = [...css.keys()].filter((n) => !ts.has(n) && !alias.has(n));

console.log(`check:tokens — ${css.size} colors in globals.css, ${ts.size} in brand.ts`);
if (alias.size) console.log(`  aliases (skipped): ${[...alias].join(', ')}`);
if (cssOnly.length) console.log(`  ⓘ only in globals.css, with no mirror in brand.ts: ${cssOnly.join(', ')}`);

if (problems.length) {
  console.error(`\n❌ ${problems.length} sync problem(s):\n${problems.join('\n')}`);
  console.error('\nFix it in `src/lib/brand.ts` so it mirrors `globals.css`, which is what renders.');
  process.exit(1);
}

console.log('✅ the two declarations match');
