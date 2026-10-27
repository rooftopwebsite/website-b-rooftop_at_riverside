import fs from 'node:fs/promises';

const SOURCE = 'src/app/globals.css';

const CANARIES = [
  'bg-cream',
  'text-ink',
  'px-gutter',
  'text-d4',
  'rounded-pill',
  'shadow-btn',
  'tracking-eyebrow',
  'page-box',
  'eyebrow',
];

const MIN_BYTES = 42_000;

let failed = false;

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
