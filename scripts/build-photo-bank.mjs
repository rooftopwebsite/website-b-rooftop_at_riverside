import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import sharp from 'sharp';

const BANK = '_internal/photos/bank';

const SOURCES = [
  { dir: 'public/multimedia', label: 'client delivery', prefix: '' },
  { dir: '_internal/photos/from-camila', label: 'added by Camila', prefix: 'cami-' },
  { dir: '_internal/photos/_web-originals', label: 'current website', prefix: 'web-' },
];

const IS_IMAGE = /\.(jpe?g|png|webp|gif|avif)$/i;

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

const distance = (a, b) => {
  let d = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
  return d;
};

await mkdir(BANK, { recursive: true });

const files = [];
for (const f of SOURCES) {
  if (!existsSync(f.dir)) continue;
  for (const name of await readdir(f.dir)) {
    if (!IS_IMAGE.test(name)) continue;
    files.push({ path: `${f.dir}/${name}`, name, source: f.label, prefix: f.prefix });
  }
}

console.log(`${files.length} images in ${SOURCES.length} folders.\n`);

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

const groups = [];
for (const a of good) {
  const g = groups.find(
    (gr) => gr[0].sha === a.sha || distance(gr[0].fingerprint, a.fingerprint) < 12,
  );
  if (g) g.push(a);
  else groups.push([a]);
}

for (const g of groups) g.sort((x, y) => y.px - x.px);

const duplicates = groups.filter((g) => g.length > 1);

let n = 0;
for (const g of groups) {
  const a = g[0];
  const dest = `${BANK}/${a.prefix}${a.name}`;
  if (!existsSync(dest)) await copyFile(a.path, dest);
  a.dest = dest;
  n += 1;
}

const pipeline = await readFile('scripts/build-media.mjs', 'utf8');
const inUse = new Map();
for (const m of pipeline.matchAll(/src:\s*'([^']+)'[^}]*out:\s*'([^']+)'/g)) {
  if (!inUse.has(m[1])) inUse.set(m[1], []);
  inUse.get(m[1]).push(m[2].replace('public/', '/'));
}

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

await writeFile(`${BANK}/INDEX.md`, md);

console.log(`✅ ${n} distinct photos in ${BANK}`);
console.log(`   ${duplicates.length} duplicate groups, ${good.length - n} extra files`);
for (const g of duplicates) {
  console.log(`   · ${g[0].name}  ←  ${g.slice(1).map((x) => x.name).join(', ')}`);
}
