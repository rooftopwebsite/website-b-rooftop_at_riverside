import sharp from 'sharp';
import { existsSync, mkdirSync, statSync } from 'node:fs';

/**
 * THE OPEN GRAPH IMAGES: the preview that shows up when sharing a link on
 * WhatsApp, iMessage, Facebook, LinkedIn, X or Slack.
 *
 *     npm run og
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ WHY A SEPARATE SCRIPT AND NOT `build-media.mjs`. OG images have rules that
 * aren't those of a page photo, and all four broke the previous version:
 *
 *   1. JPEG AND NOT WEBP. Facebook and X read WebP, but LinkedIn and several
 *      messaging-app preview readers don't, and there the link shows up with no photo.
 *      JPEG is the only format they all display.
 *   2. EXACTLY 1200×630 (1.91:1). It's the large card's ratio on every
 *      platform. A 3:2 or vertical photo gets cropped blindly, and what
 *      ends up on the card is decided by each network.
 *   3. UNDER 300 KB. Above that WhatsApp shows the small preview or none
 *      at all. The script lowers the quality step by step until it fits.
 *   4. sRGB WITH NO ODD PROFILE. A photo in Display P3 or Adobe RGB comes out washed
 *      out in half the readers, which ignore the profile.
 *
 * ⚠️ THE ORIGINAL OF THE DEFAULT OG GOES IN `_internal/og/`, which isn't
 * versioned (house rule: working material doesn't go into git). It's uploaded
 * there with the name `og-default` and any extension (.png, .jpg, .webp).
 * While it isn't there, the photo of the yard from the terrace is used.
 * ══════════════════════════════════════════════════════════════════════════
 */

const W = 1200;
const H = 630;
const MAX_KB = 300;
const OUT_DIR = 'public/og';

/** The first file that exists, or `null`. */
function first(...paths) {
  return paths.find((r) => existsSync(r)) ?? null;
}

const UPLOAD = first(
  '_internal/og/og-default.png',
  '_internal/og/og-default.jpg',
  '_internal/og/og-default.jpeg',
  '_internal/og/og-default.webp',
  // The name the first one was uploaded with, on 2026-09-23.
  '_internal/og/OG.png',
);

/*
 * ⚠️ `position` IS WHERE IT GETS CROPPED WHEN THE SOURCE ISN'T 1.91:1. `attention`
 * looks for the area with the most detail and is the right choice for a photo; for a design
 * with text (the uploaded OG) it's `centre`, because a design already comes laid out to
 * read centered and `attention` could eat a word at the edge.
 */
const INPUTS = [
  {
    out: 'og-default.jpg',
    src: UPLOAD ?? 'public/images/venue/story-yard-day-wide.webp',
    position: UPLOAD ? 'centre' : 'attention',
  },
  { out: 'contact.jpg', src: 'public/images/venue/contact-bar-day-wide.webp', position: 'attention' },
  { out: 'events.jpg', src: 'public/images/events/events-hero.webp', position: 'centre' },
  { out: 'join-us.jpg', src: 'public/images/venue/join-stage-day-wide.webp', position: 'attention' },
  { out: 'market.jpg', src: 'public/images/market/hero-yard-wide.webp', position: 'attention' },
  { out: 'our-story.jpg', src: 'public/images/venue/story-yard-day-wide.webp', position: 'attention' },
  { out: 'sunset-bar.jpg', src: 'public/images/venue/bar-cocktails-wide.webp', position: 'attention' },
];

mkdirSync(OUT_DIR, { recursive: true });

for (const e of INPUTS) {
  const meta = await sharp(e.src).metadata();
  if ((meta.width ?? 0) < W || (meta.height ?? 0) < H) {
    console.warn(
      `⚠️  ${e.src} measures ${meta.width}×${meta.height}: smaller than ${W}×${H}, it will look stretched.`,
    );
  }

  const out = `${OUT_DIR}/${e.out}`;
  let q = 86;
  for (;;) {
    await sharp(e.src)
      .rotate() // respects the EXIF orientation of a phone photo
      .resize(W, H, { fit: 'cover', position: e.position })
      .toColorspace('srgb')
      .flatten({ background: '#ffffff' }) // a PNG with transparency doesn't come out black
      // A design with text over a flat color goes in 4:4:4: with 4:2:0 the white
      // letters over the orange come out with a halo. Photos don't need it.
      .jpeg({ quality: q, mozjpeg: true, chromaSubsampling: e.position === 'centre' ? '4:4:4' : '4:2:0' })
      .toFile(out);
    const kb = Math.round(statSync(out).size / 1024);
    if (kb <= MAX_KB || q <= 60) {
      console.log(`${out.padEnd(26)} ${W}×${H}  q${q}  ${kb} KB  ← ${e.src}`);
      if (kb > MAX_KB) console.warn(`⚠️  ${out} is still above ${MAX_KB} KB at q60.`);
      break;
    }
    q -= 4;
  }
}

if (!UPLOAD) {
  console.log('\nℹ️  There is no _internal/og/og-default.*: the default OG comes from the yard photo.');
}
