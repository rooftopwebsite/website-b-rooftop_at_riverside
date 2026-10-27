/**
 * Downloads into `public/images/` the photos the client publishes on their old site.
 *
 *   node scripts/import-assets.mjs
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ IT READS FROM `_internal/photos/_web-originals/`, WHICH IS WHERE THEY REALLY ARE.
 * Until today it pointed to the scratchpad of a 2026-09-09 session that hasn't
 * existed for a while, so the script didn't run: it remained as a record of how
 * those files had been generated, not as something re-runnable. The same photos
 * are downloaded by `fetch-old-site-media.mjs` to a stable path in the repo, and that's what
 * it uses now.
 *
 * ⚠️ IT'S NOT THE MAIN PIPELINE. `build-media.mjs` starts from the camera
 * originals the client delivered; this starts from what Wix already recompressed, which
 * is the best there is of these photos. It's the difference that explains why here
 * the qualities are higher and the savings slimmer.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ EACH ONE'S QUALITY IS MEASURED, NOT CHOSEN BY EYE. Camila, 2026-09-22:
 * «make them WebP, without losing quality». For each photo the
 * SSIM —against the un-recompressed Wix file— of the JPEG that was being published and
 * of the WebP at each quality was compared, and the minimum quality that matches the JPEG was kept.
 *
 * ⚠️ SIX STAY IN JPEG ON PURPOSE, and they're the case that proves the rule wasn't
 * applied blindly: their JPEG came out almost identical to the Wix file (SSIM of
 * 0.998 and up), and to match THAT the WebP also has to reproduce
 * the compression noise Wix had already put into it — and there it weighs more than the
 * JPEG. Converting them anyway would be changing the format in exchange for weight and nothing.
 *
 * ⚠️ `images/trucks/seafood-1.jpg` IS NOT REGENERATED: its original on Wix has a
 * name with a size suffix —`..._d_3840_5760_s_4_2.jpg`— that didn't make it into the
 * download. The published file still works; it just can't be redone.
 */
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const RAW = '_internal/photos/_web-originals';
const OUT = 'public';

/**
 * `q` is the measured WebP quality. Without `q`, the destination stays in JPEG (see above)
 * and `rot` is the quarter turn the photo needs.
 */
/*
 * ⚠️ ON 2026-09-23 THIRTEEN ENTRIES WERE REMOVED: the first-phase photos that
 * no page uses anymore (hero-live-music, venue-guests, venue-rooftop,
 * venue-park, venue-story, venue-truck-line, event-a) and photos 2 to 4 of the
 * retired trucks. They were removed along with their file so that running this again doesn't
 * publish them again. They're still in the git history.
 */
const JOBS = [
  { src: '14dedf_30ae92d396a543c09f8f84ffe49ab688~mv2.png', dst: 'brand/logo-lockup.png', w: 1200 },
  { src: '14dedf_74ed434a480f44d581972e66aef20a3f~mv2.png', dst: 'brand/isotype-truck.png', w: 900 },
  { src: '526079_c0bd2d9cd428427498708da539a5db7e~mv2.jpg', dst: 'images/events/event-b.webp', w: 1800, q: 72 },// −19 %
  { src: '526079_4b4989fd71894880b13ceeae691ec992~mv2.jpg', dst: 'images/events/event-c.webp', w: 1800, q: 80 },// −12 %
  { src: '526079_50eb2ec4bac240208b3bc5ec7614afd8~mv2.jpg', dst: 'images/events/event-d.webp', w: 1800, q: 82 },// −9 %
  { src: '526079_98c407bd94a44a219c5dc74e96670edb~mv2.jpg', dst: 'images/game-truck.webp', w: 1800, q: 78 },// −21 %
  { src: '11062b_a8b1fc399c4b4b19a703e00812a646a4~mv2.jpg', dst: 'images/game-controller.jpg', w: 1800 },// stays in JPEG: in WebP it weighs more
  { src: '526079_04e12ccd6da44291ac7c96b4ff530a46~mv2.jpg', dst: 'images/trucks/el-chilango-1.webp', w: 1600, q: 86 },// −9 %
  { src: '526079_33ccb8b874144046aa86905f60f820fb~mv2.jpg', dst: 'images/trucks/el-chilango-2.webp', w: 1600, q: 80 },// −23 %
  { src: '526079_3cfc45bc0bc042a69c704066c883500d~mv2.jpeg', dst: 'images/trucks/el-chilango-3.webp', w: 1600, q: 80 },// −17 %
  { src: '11062b_567789504ad040be8bae8e94b3c393ac~mv2.jpg', dst: 'images/trucks/prime-carvery-1.jpg', w: 1600 },// stays in JPEG: in WebP it weighs more
  { src: '11062b_64de79fd442c4ef98de2d8baa77bdc5f~mv2_d_3840_5760_s_4_2.jpg', dst: 'images/trucks/seafood-1.jpg', w: 1600 },
  { src: '526079_05bd8539d47844d8b73bd063bd9c27dc~mv2.jpg', dst: 'images/trucks/tropical-1.jpg', w: 1600 },// stays in JPEG: in WebP it weighs more
];

let ok = 0;
const missing = [];

for (const j of JOBS) {
  const from = path.join(RAW, j.src.replace(/[^\w.~-]/g, '_'));
  try {
    await fs.access(from);
  } catch {
    missing.push(j.dst);
    continue;
  }

  const to = path.join(OUT, j.dst);
  await fs.mkdir(path.dirname(to), { recursive: true });

  let img = sharp(from, { failOn: 'none' });
  if (j.rot) img = img.rotate(j.rot);
  img = img.resize({ width: j.w, withoutEnlargement: true });

  if (j.dst.endsWith('.png')) await img.png({ compressionLevel: 9 }).toFile(to);
  else if (j.dst.endsWith('.webp')) await img.webp({ quality: j.q, effort: 6 }).toFile(to);
  else await img.jpeg({ quality: 82, mozjpeg: true }).toFile(to);

  ok += 1;
}

console.log(`processed: ${ok}${missing.length ? `  ·  no original: ${missing.join(', ')}` : ''}`);
