/**
 * Sync guard between the two declarations of the palette.
 *
 *   npm run check:tokens
 *
 * ⚠️ WHY IT EXISTS. The palette is written in two places and it has to be:
 *
 *   · `src/app/globals.css`, `@theme` block → it's what RENDERS. Tailwind v4
 *     is CSS-first, there's no `tailwind.config.ts` and a `.ts` can't be imported
 *     inside `@theme`.
 *   · `src/lib/brand.ts`, `COLORS` object → it's what can be READ from
 *     TypeScript and from the scripts, and where the usage rules live.
 *
 * Without a guard, the two copies drift apart without anything warning. It already happened: for
 * months `brand.ts` declared `paper: '#FFFFFF'` and `ink: '#000000'` while the
 * site painted `#FDFCF7` and `#0A1F1E`. `scripts/contrast.mjs` read the stale
 * copy, so the entire contrast audit was calculated against
 * colors the site didn't use and the documented ratios weren't the real ones.
 * Nobody noticed because the build passed.
 *
 * This script compares token by token and fails with the detail of the difference.
 */
import { readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const CSS = readFileSync(new URL('src/app/globals.css', root), 'utf8');
const TS = readFileSync(new URL('src/lib/brand.ts', root), 'utf8');

/** The CSS's `--color-*: #hex;`. The ones that are `var(...)` are aliases and get skipped. */
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

/** The `COLORS` object from brand.ts. Accepts keys with and without quotes. */
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

/* The reverse is only a warning: @theme can have tokens TypeScript doesn't
   need to see, and forcing total symmetry would be noise. */
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
