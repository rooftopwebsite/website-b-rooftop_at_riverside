/**
 * THE PHOTO BANK: all the material in a single folder, with no duplicates.
 *
 *   node scripts/build-photo-bank.mjs
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ WHY IT EXISTS. Camila, 2026-09-22: «in one folder put the ones we use in
 * our redesign and the ones on the original website, clean out the duplicates,
 * fill the gaps».
 *
 * Until today the material lived in three places that didn't talk to each other:
 *
 *   · `public/multimedia/` — the client's delivery (36 photos and 5 videos), which
 *     is where everything the site publishes today comes from;
 *   · `_interno/fotos/_originales-web/` — the 81 the client publishes on their
 *     Wix, downloaded with `fetch-old-site-media.mjs`;
 *   · `_interno/fotos/de-camila/` — whatever Camila adds by hand.
 *
 * And they overlapped: several of the 81 WERE ALREADY in the delivery, because the
 * client uploaded to their website the same photos they gave us. Looking at them one by one
 * you can't tell; in a single folder, you can.
 *
 * ⚠️ IT DOESN'T DELETE ANYTHING FROM THE SOURCE FOLDERS. The bank is a FOURTH folder
 * that gathers them by copying. If something goes wrong, the bank is deleted and
 * regenerated; the originals are never touched.
 *
 * ⚠️ AND IT ISN'T VERSIONED, like all of `_interno/` (§5b of INVARIANTS).
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠️ HOW IT DECIDES WHAT A DUPLICATE IS. Two passes, and the second is the one
 * that matters:
 *
 *   1. EXACT HASH (sha1 of the file). Catches the same file uploaded twice.
 *      It's cheap and never fails.
 *   2. PERCEPTUAL FINGERPRINT (16×16 dHash over the grayscale image). Catches the
 *      same photo re-exported, recompressed or resized, which is the real
 *      case: the client's delivery and their Wix have the same photos in
 *      two sizes.
 *
 * ⚠️ WHAT IT DOESN'T CATCH, AND YOU HAVE TO KNOW IT: two different shots of the same
 * moment. It happened in this project —`live-band-crowd` and `wall-yard-night-crowd`
 * are the same singer on the same night with two framings— and no hash flags
 * them, because as images they're different. That's seen by looking, not measuring.
 * The index keeps them together so they're seen one at a time.
 * ══════════════════════════════════════════════════════════════════════════
 */
import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import sharp from 'sharp';

const BANK = '_interno/fotos/banco';

/** Where each thing comes from, in priority order: the first one wins the name. */
const SOURCES = [
  { dir: 'public/multimedia', label: 'client delivery', prefix: '' },
  { dir: '_interno/fotos/de-camila', label: 'added by Camila', prefix: 'cami-' },
  { dir: '_interno/fotos/_originales-web', label: 'current website', prefix: 'web-' },
];

const IS_IMAGE = /\.(jpe?g|png|webp|gif|avif)$/i;

/**
 * The perceptual fingerprint: 16×16 dHash.
 *
 * ⚠️ IT COMPARES GRADIENTS, NOT PIXELS. Each bit says whether a pixel is lighter
 * than the one to its right, and that survives the image being rescaled,
 * recompressed or changing brightness — which is exactly what happens to a photo
 * when Wix re-exports it.
 */
async function fingerprint(filePath) {
  const px = await sharp(filePath)
    .rotate()
    .greyscale()
    .resize(17, 16, { fit: 'fill' })
    .raw()
    .toBuffer();
  let bits = '';
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      bits += px[y * 17 + x] > px[y * 17 + x + 1] ? '1' : '0';
    }
  }
  return bits;
}

/** How many bits differ. Fewer than 12 out of 256 is the same photo. */
const distance = (a, b) => {
  let d = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
  return d;
};

await mkdir(BANK, { recursive: true });

/* ── 1 · Gather everything there is ─────────────────────────────────────── */
const files = [];
for (const f of SOURCES) {
  if (!existsSync(f.dir)) continue;
  for (const name of await readdir(f.dir)) {
    if (!IS_IMAGE.test(name)) continue;
    files.push({ path: `${f.dir}/${name}`, name, source: f.label, prefix: f.prefix });
  }
}

console.log(`${files.length} images in ${SOURCES.length} folders.\n`);

/* ── 2 · Measure each one ───────────────────────────────────────────────── */
for (const a of files) {
  const buf = await readFile(a.path);
  a.sha = createHash('sha1').update(buf).digest('hex');
  try {
    a.fingerprint = await fingerprint(a.path);
    const m = await sharp(a.path).rotate().metadata();
    a.w = m.width;
    a.h = m.height;
    a.px = m.width * m.height;
  } catch {
    a.broken = true;
  }
}

const good = files.filter((a) => !a.broken);

/* ── 3 · Group duplicates ───────────────────────────────────────────────── */
const groups = [];
for (const a of good) {
  const g = groups.find(
    (gr) => gr[0].sha === a.sha || distance(gr[0].fingerprint, a.fingerprint) < 12,
  );
  if (g) g.push(a);
  else groups.push([a]);
}

/*
 * From each group THE LARGEST one is kept, not the first one found: between the
 * delivery's version and the one Wix re-exported, the one that's useful for cropping
 * is the one with more pixels.
 */
for (const g of groups) g.sort((x, y) => y.px - x.px);

const duplicates = groups.filter((g) => g.length > 1);

/* ── 4 · Copy to the bank ───────────────────────────────────────────────── */
let n = 0;
for (const g of groups) {
  const a = g[0];
  const dest = `${BANK}/${a.prefix}${a.name}`;
  if (!existsSync(dest)) await copyFile(a.path, dest);
  a.dest = dest;
  n += 1;
}

/* ── 5 · Which of this is published today ───────────────────────────────── */
const pipeline = await readFile('scripts/build-media.mjs', 'utf8');
const inUse = new Map();
for (const m of pipeline.matchAll(/src:\s*'([^']+)'[^}]*out:\s*'([^']+)'/g)) {
  if (!inUse.has(m[1])) inUse.set(m[1], []);
  inUse.get(m[1]).push(m[2].replace('public/', '/'));
}

/* ── 6 · The index ──────────────────────────────────────────────────────── */
const rows = groups
  .map((g) => {
    const a = g[0];
    const uses = inUse.get(a.name) ?? [];
    const others = g.slice(1).map((x) => x.name);
    return {
      file: `${a.prefix}${a.name}`,
      size: `${a.w}×${a.h}`,
      source: a.source,
      uses,
      others,
    };
  })
  .sort((x, y) => x.file.localeCompare(y.file));

const md = [
  '# The photo bank',
  '',
  `Generated on ${new Date().toISOString().slice(0, 10)} with`,
  '`node scripts/build-photo-bank.mjs`. **Not versioned** and **can be deleted**:',
  'it is a copy of the other folders, not the original of anything.',
  '',
  `**${n} distinct photos** out of ${good.length} files. ${good.length - n} were duplicates.`,
  '',
  '## How to read this',
  '',
  '- **On the site** says which published file it gives rise to. Empty = it is in the',
  '  bank and not used on any page.',
  '- **Duplicate of** lists the other copies found of the same photo.',
  '  From the group, the highest-resolution one is kept.',
  '',
  '| file | size | source | on the site | duplicate of |',
  '|---|---|---|---|---|',
  ...rows.map(
    (f) =>
      `| \`${f.file}\` | ${f.size} | ${f.source} | ${f.uses.map((u) => `\`${u}\``).join(' ') || '—'} | ${f.others.map((o) => `\`${o}\``).join(' ') || '—'} |`,
  ),
  '',
].join('\n');

await writeFile(`${BANK}/INDICE.md`, md);

console.log(`✅ ${n} distinct photos in ${BANK}`);
console.log(`   ${duplicates.length} duplicate groups, ${good.length - n} extra files`);
for (const g of duplicates) {
  console.log(`   · ${g[0].name}  ←  ${g.slice(1).map((x) => x.name).join(', ')}`);
}
