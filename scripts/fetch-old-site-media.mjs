/**
 * Downloads ALL the photos the client's current site publishes today.
 *
 *   node scripts/fetch-old-site-media.mjs
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ WHY IT EXISTS. The client's delivery is 36 photos —trucks, bar and
 * music nights— and the new site has gaps that none of those 36 can
 * fill: the market, the game lounge, the trucks that aren't in the delivery, the
 * people. But the client DOES publish material for all of that: it's on the 23
 * routes of `eatdrinkparadise.com`, which is their Wix.
 *
 * Camila, 2026-09-22: «download all the photos from the original website and put them in a
 * folder in the repo, along with the ones I've already given you myself».
 *
 * ⚠️ WHAT IT DOWNLOADS GOES TO `_internal/`, WHICH IS NOT VERSIONED. It's rule §5b of
 * `docs/INVARIANTS.md`: the client's material doesn't go into git; what goes in
 * is the DERIVATIVE —the cropped and optimized image the site serves—. This
 * script fills the input folder; `scripts/build-media.mjs` is the one that
 * produces what gets published.
 *
 * ⚠️ IT DOWNLOADS THE ORIGINAL AND NOT THE TRANSFORMED VERSION. Wix serves each image with
 * a crop and quality suffix —`/v1/fill/w_640,h_480,q_80/…`— and those are the
 * thumbnails ITS layout uses. The URL without the suffix returns the file as
 * it was uploaded, which is usually 2000 to 4000px. It's the only thing useful for
 * cropping again.
 *
 * ⚠️ IT DOESN'T TOUCH `public/`. Nothing this script downloads gets published on its own: it has
 * to be chosen, cropped and given an `alt`. That step is by hand and by eye.
 * ══════════════════════════════════════════════════════════════════════════
 */
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const BASE = 'https://www.eatdrinkparadise.com';
const OUTPUT = '_internal/photos/_web-originals';

/**
 * The current site's routes, taken from `docs/current-site-inventory.md`.
 *
 * ⚠️ ALL 23 ARE HERE, INCLUDING THE ONES WE DON'T USE. `/blank` and `/blank-1` are
 * template leftovers and `/inquiry-services-page` is Wix lorem, but all three
 * may have real photos loaded on top: the inventory says `/blank`
 * mixes a vendors form with a cocktail's card. Downloading too much here
 * costs nothing; finding out a month from now that a photo was missing does.
 */
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

/*
 * ⚠️ THE BROWSER USER-AGENT IS NOT OPTIONAL. Wix answers 403 to a fetch without
 * it, and the error it returns is an HTML page: without this the script downloads 23
 * error pages and reports zero images, which is the worst way to fail.
 */
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

/**
 * The media IDs that appear in a page's HTML.
 *
 * ⚠️ THEY'RE READ FROM THE RAW HTML AND NOT FROM THE RENDERED DOM, and that's enough: Wix puts the
 * page's entire catalog in an embedded JSON (`warmupData`), so the
 * photos its layout loads via JavaScript are still written in the text
 * that arrives in the first response.
 *
 * ⚠️ FILES WITHOUT `~mv2` ARE FILTERED OUT, which are the Wix template's
 * icons —arrows, social logos, the map pin—. The `<hash>~mv2.<ext>` pattern
 * is that of a file someone UPLOADED; the others come with the theme.
 */
function mediaFrom(html) {
  const ids = new Set();
  for (const m of html.matchAll(/static\.wixstatic\.com\/media\/([A-Za-z0-9~_.%-]+)/g)) {
    // Wix escapes the tilde in some occurrences in the JSON.
    const file = decodeURIComponent(m[1]);
    if (!/~mv2\.(jpg|jpeg|png|webp|gif)$/i.test(file)) continue;
    ids.add(file);
  }
  return ids;
}

await mkdir(OUTPUT, { recursive: true });

/** Where each file appeared. It's half the value of the inventory. */
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

/*
 * The index. Without it the folder is eighty Wix hashes and you can't tell which
 * came from where, which is precisely the piece of information you need to choose.
 */
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
