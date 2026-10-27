import sharp from 'sharp';
import { existsSync, mkdirSync, statSync } from 'node:fs';

const W = 1200;
const H = 630;
const MAX_KB = 300;
const OUT_DIR = 'public/og';

function first(...paths) {
  return paths.find((r) => existsSync(r)) ?? null;
}

const UPLOAD = first(
  '_internal/og/og-default.png',
  '_internal/og/og-default.jpg',
  '_internal/og/og-default.jpeg',
  '_internal/og/og-default.webp',
  '_internal/og/OG.png',
);

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
      .rotate()
      .resize(W, H, { fit: 'cover', position: e.position })
      .toColorspace('srgb')
      .flatten({ background: '#ffffff' })
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
