import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';

const events = JSON.parse(readFileSync('src/content/events.json', 'utf8'));

const fingerprint = (url) => {
  const file = `public${url.split('?')[0]}`;
  if (!existsSync(file)) return null;
  return createHash('sha1').update(readFileSync(file)).digest('hex');
};

const noPhoto = [];
const broken = [];
const byTitle = new Map();
const byFingerprint = new Map();

for (const e of events) {
  if (!e.bannerUrl) {
    noPhoto.push(`${e.title} (${e.startDate})`);
    continue;
  }
  const h = fingerprint(e.bannerUrl);
  if (!h) {
    broken.push(`${e.title} (${e.startDate}) → ${e.bannerUrl}`);
    continue;
  }
  if (!byTitle.has(e.title)) byTitle.set(e.title, new Set());
  byTitle.get(e.title).add(h);
  if (!byFingerprint.has(h)) byFingerprint.set(h, new Set());
  byFingerprint.get(h).add(e.title);
}

const different = [...byTitle].filter(([, hs]) => hs.size > 1).map(([t, hs]) => `${t}: ${hs.size} photos`);
const shared = [...byFingerprint.values()].filter((ts) => ts.size > 1).map((ts) => [...ts].join(' / '));

const blocks = [
  ['No photo', noPhoto],
  ['File that does not exist in public/', broken],
  ['Same event with different photos', different],
  ['Different events with the same photo', shared],
];

let failures = 0;
for (const [title, list] of blocks) {
  if (list.length === 0) continue;
  failures += list.length;
  console.log(`\n${title} (${list.length})`);
  for (const l of list) console.log(`  · ${l}`);
}

console.log(failures === 0 ? `${events.length} events, all in order.` : `\n${failures} problems.`);
process.exit(failures === 0 ? 0 : 1);
