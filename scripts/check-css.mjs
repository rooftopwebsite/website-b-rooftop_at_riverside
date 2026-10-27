import fs from 'node:fs/promises';

/**
 * CSS guard. Runs AFTER the build.
 *
 * ⚠️ It exists because of a real failure that cost a lot: a CSS comment nested inside
 * the `@font-face` block closed the comment early, left a stray `*​/`,
 * and Tailwind stopped emitting **all** the theme utilities. The build
 * passed without a single warning, the page was served with no styles, and it was only caught
 * by bisecting against the previous commit.
 *
 * Two checks:
 *   1. Nested comments or stray closers in globals.css — the cause.
 *   2. That the emitted CSS contains a handful of canary utilities. It's the
 *      check that really matters: it assumes nothing about WHY it broke,
 *      it only looks at whether the result works.
 *
 *   npm run build && npm run check:css
 */

const SOURCE = 'src/app/globals.css';

/**
 * Utilities that MUST exist in the emitted CSS. They were chosen because
 * each one comes from a different theme namespace: color, spacing, text
 * size, radius, shadow and tracking. If the theme stops registering, they all
 * fall together.
 */
const CANARIES = [
  'bg-cream',
  'text-ink',
  'px-gutter',
  'text-d4',
  'rounded-pill',
  'shadow-btn',
  /* ⚠️ It was `tracking-display`, the display tracking token, which was
     removed when moving to the optical scale of `--text-*--letter-spacing`. The
     tracking canary is now `tracking-eyebrow`, which is still a token of the
     theme's own and covers the same namespace. */
  'tracking-eyebrow',
  'page-box',
  'eyebrow',
];

/** Reasonable floor: healthy CSS is around 50 KB; broken it dropped to 33 KB. */
const MIN_BYTES = 42_000;

let failed = false;

/* ── 1. Comments ────────────────────────────────────────────────────────── */
const css = await fs.readFile(SOURCE, 'utf8');
let depth = 0;
let line = 1;
const commentProblems = [];

for (let i = 0; i < css.length - 1; i++) {
  if (css[i] === '\n') line += 1;
  if (css[i] === '/' && css[i + 1] === '*') {
    if (depth > 0) commentProblems.push(`NESTED comment opened on line ${line}`);
    depth += 1;
    i += 1;
  } else if (css[i] === '*' && css[i + 1] === '/') {
    depth -= 1;
    i += 1;
    if (depth < 0) {
      commentProblems.push(`STRAY comment closer on line ${line}`);
      depth = 0;
    }
  }
}
if (depth > 0) commentProblems.push('there is an UNCLOSED comment at the end of the file');

if (commentProblems.length) {
  failed = true;
  console.log(`❌ ${SOURCE}`);
  for (const p of commentProblems) console.log(`   ${p}`);
  console.log('   CSS comments do not nest. This breaks @theme silently.');
} else {
  console.log(`✅ ${SOURCE} — comments well balanced, none nested`);
}

/* ── 2. Canaries in the emitted CSS ─────────────────────────────────────── */
async function findBuiltCss() {
  const dir = '.next/static/chunks';
  try {
    const files = await fs.readdir(dir);
    return files.filter((f) => f.endsWith('.css')).map((f) => `${dir}/${f}`);
  } catch {
    return [];
  }
}

const built = await findBuiltCss();
if (built.length === 0) {
  console.log('⚠️  There is no compiled CSS. Run `npm run build` before this.');
  process.exitCode = 1;
} else {
  const all = (await Promise.all(built.map((f) => fs.readFile(f, 'utf8')))).join('');
  const bytes = all.length;

  const missing = CANARIES.filter((c) => !all.includes(c));
  if (missing.length) {
    failed = true;
    console.log(`❌ Emitted CSS: ${missing.length} canary utilities missing`);
    console.log(`   ${missing.join(', ')}`);
    console.log('   A sign that @theme did not register or the scan did not find the sources.');
  } else {
    console.log(`✅ Emitted CSS — all ${CANARIES.length} canary utilities are present`);
  }

  if (bytes < MIN_BYTES) {
    failed = true;
    console.log(`❌ Emitted CSS weighs ${bytes} bytes, below the floor of ${MIN_BYTES}`);
  } else {
    console.log(`✅ Emitted CSS — ${bytes.toLocaleString('en-US')} bytes`);
  }
}

if (failed) process.exitCode = 1;
