import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const BASE = 'https://www.eatdrinkparadise.com';
const OUTPUT = '_internal/photos/_web-originals';

const ROUTES = [
  '/',
  '/this-is-us',
  '/eat',
  '/drink',
  '/calendar',
  '/hostanevent',
  '/neighborhood-market',
  '/entertainment',
  '/game-lounge',
  '/find-us',
  '/parking',
  '/giveback',
  '/tnt-sign-ups',
  '/primecarvery',
  '/tropicalfusion',
  '/seameonwheels',
  '/el-chilango',
  '/ocn',
  '/bar-games-waiver',
  '/game-zone-waiver',
  '/blank',
  '/blank-1',
  '/inquiry-services-page',
];

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

function mediaFrom(html) {
  const ids = new Set();
  for (const m of html.matchAll(/static\.wixstatic\.com\/media\/([A-Za-z0-9~_.%-]+)/g)) {
    const file = decodeURIComponent(m[1]);
    if (!/~mv2\.(jpg|jpeg|png|webp|gif)$/i.test(file)) continue;
    ids.add(file);
  }
  return ids;
}

await mkdir(OUTPUT, { recursive: true });

const where = new Map();
let failures = 0;

for (const route of ROUTES) {
  const url = `${BASE}${route}`;
  let html = '';
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) {
      console.log(`⚠️  ${route} → HTTP ${res.status}`);
      failures += 1;
      continue;
    }
    html = await res.text();
  } catch (e) {
    console.log(`⚠️  ${route} → ${e.message}`);
    failures += 1;
    continue;
  }

  const found = mediaFrom(html);
  for (const a of found) {
    if (!where.has(a)) where.set(a, []);
    where.get(a).push(route);
  }
  console.log(`   ${route.padEnd(26)} ${found.size} images`);
}

console.log(`\n${where.size} unique files across ${ROUTES.length - failures} routes. Downloading…\n`);

let downloaded = 0;
let skipped = 0;

for (const [file, routes] of where) {
  const dest = `${OUTPUT}/${file}`;
  if (existsSync(dest)) {
    skipped += 1;
    continue;
  }
  try {
    const res = await fetch(`https://static.wixstatic.com/media/${file}`, {
      headers: { 'User-Agent': UA },
    });
    if (!res.ok) {
      console.log(`⚠️  ${file} → HTTP ${res.status}`);
      continue;
    }
    await writeFile(dest, Buffer.from(await res.arrayBuffer()));
    downloaded += 1;
  } catch (e) {
    console.log(`⚠️  ${file} → ${e.message}`);
  }
  void routes;
}

const index = [
  '# Photos from the client\'s current site',
  '',
  `Downloaded from \`eatdrinkparadise.com\` on ${new Date().toISOString().slice(0, 10)} with`,
  '`node scripts/fetch-old-site-media.mjs`. **This folder is not versioned** (see',
  '§5b of `docs/INVARIANTS.md`): what goes into git is the optimized derivative,',
  'not the original.',
  '',
  '| file | appears on |',
  '|---|---|',
  ...[...where.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([a, routes]) => `| \`${a}\` | ${routes.join(', ')} |`),
  '',
].join('\n');

await writeFile(`${OUTPUT}/INDEX.md`, index);

console.log(`✅ ${downloaded} downloaded, ${skipped} were already there. Index at ${OUTPUT}/INDEX.md`);
void readFile;
