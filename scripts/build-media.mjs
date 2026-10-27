import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, statSync } from 'node:fs';
import { dirname } from 'node:path';

const IN = 'public/multimedia';
const kb = (p) => Math.round(statSync(p).size / 1024);

const PHOTOS = [
  ...[
    ['_RCZ4830.jpg', 'cocktails-rooftop'],
    ['_RCZ5702.JPG', 'live-music-tent'],
    ['_RCZ4336.JPG', 'yard-night-crowd'],
    ['D5F6CEA7-2C91-4C2E-B2D0-3C3BF1E20A93.PNG', 'food-platter'],
    ['_RCZ5884.JPG', 'yard-night-table'],
    ['_RCZ8096.jpg', 'truck-window-day'],
    ['_RCZ4397 (1).JPG', 'bartender'],
    ['_RCZ4382.JPG', 'dancing-night'],
    ['_RCZ8185.jpg', 'guests-yard-day'],
    ['_RCZ4528.JPG', 'sandwich'],
  ].map(([src, name]) => ({
    src,
    out: `public/images/venue/wall-${name}.webp`,
    w: 540,
    h: 720,
    q: 72,
  })),

  {
    src: '_RCZ8185.jpg',
    out: 'public/images/venue/hero-truck-window.webp',
    w: 2576,
    h: 1200,
    focus: 0.38,
    q: 76,
  },

  {
    src: '_RCZ4830.jpg',
    out: 'public/images/venue/bar-cocktails-wide.webp',
    w: 2576,
    h: 1364,
    focus: 0.56,
    q: 78,
  },

  {
    src: 'terrace-video-44s.png',
    out: 'public/images/venue/patio-rooftop-table.webp',
    w: 810,
    h: 1080,
    position: 'centre',
    q: 82,
  },

  {
    src: 'DSC04091.JPG',
    out: 'public/images/venue/whats-on-yard-wide.webp',
    w: 2576,
    h: 1364,
    focus: 0.5,
    q: 78,
  },

  {
    src: 'events-party-night.jpg',
    out: 'public/images/events/events-hero.webp',
    w: 2400,
    h: 1800,
    q: 78,
    focus: 0.333,
  },

  {
    src: 'events-party-night.jpg',
    out: 'public/images/events/events-hero-mobile.webp',
    w: 1080,
    h: 720,
    q: 80,
    focus: 0.317,
  },

  {
    src: '_RCZ7197.JPG',
    out: 'public/images/venue/contact-bar-day-wide.webp',
    w: 2576,
    h: 1364,
    focus: 0.422,
    q: 78,
  },

  {
    src: '_RCZ5702.JPG',
    out: 'public/images/venue/join-stage-day-wide.webp',
    w: 2576,
    h: 1364,
    focus: 0.46,
    q: 78,
  },

  {
    src: '_RCZ8015.jpg',
    out: 'public/images/venue/story-yard-day-wide.webp',
    w: 2576,
    h: 1364,
    focus: 0.44,
    q: 78,
  },

  { src: '_RCZ5847.JPG', out: 'public/images/venue/truck-window-night.webp', w: 900, h: 1125, q: 78 },

  { src: '_RCZ5702.JPG', out: 'public/images/venue/event-live-music.webp', w: 1200, h: 900, q: 78 },
  { src: '_RCZ5757.JPG', out: 'public/images/venue/event-yard-night.webp', w: 800, h: 500, q: 78 },
  { src: '_RCZ4382.JPG', out: 'public/images/venue/event-dj-night.webp', w: 800, h: 500, q: 78 },

  { src: 'calendar-la-noche.jpg', out: 'public/images/venue/event-la-noche.webp', w: 900, h: 1125, q: 80 },
  { src: 'calendar-ross-brown.jpg', out: 'public/images/venue/event-ross-brown.webp', w: 900, h: 1125, q: 80 },

  { src: 'market-yard.jpg', out: 'public/images/market/hero-yard-wide.webp', w: 2048, h: 1084, q: 78 },

  { src: 'market-jewelry.jpg', out: 'public/images/market/stall-jewelry.webp', w: 880, h: 1100, q: 76 },
  { src: 'market-picnic.jpg', out: 'public/images/market/stall-picnic.webp', w: 900, h: 675, q: 76 },
  { src: 'market-art.jpg', out: 'public/images/market/stall-art.webp', w: 880, h: 1100, q: 76 },
  { src: 'market-flowers.jpg', out: 'public/images/market/stall-flowers.webp', w: 900, h: 675, q: 76 },
  { src: 'market-boba.jpg', out: 'public/images/market/vendor-boba.webp', w: 880, h: 1100, focus: 0.42, q: 76 },
  { src: 'market-home.jpg', out: 'public/images/market/stall-home.webp', w: 900, h: 675, q: 76 },

  {
    src: 'WhatsApp Image 2026-06-11 at 22.58.56 (1).jpeg',
    out: 'public/images/venue/venue-aerial.webp',
    w: 1000,
    h: 667,
    q: 70,
  },

  {
    src: '_RCZ8192.jpg',
    out: 'public/images/venue/doors-band.webp',
    w: 2080,
    h: 420,
    focus: 0.564,
    q: 74,
  },

  { src: 'leaf-backdrop.jpg', out: 'public/images/venue/leaf-backdrop.webp', turn: 90, w: 1800, h: 760, q: 68 },

  { src: 'gt-yard.jpg', out: 'public/images/game-truck/truck-wide.webp', w: 2048, h: 1084, focus: 0.33, q: 78 },

  { src: 'gt-inside.jpg', out: 'public/images/game-truck/truck-night.webp', w: 1400, h: 1050, focus: 0.42, q: 78 },
  { src: 'gt-inside.jpg', out: 'public/images/game-truck/truck-inside-wide.webp', w: 2048, h: 1084, focus: 0.45, q: 78 },

  { src: 'gt-exterior.jpg', out: 'public/images/game-truck/truck-side.webp', w: 900, h: 1200, q: 78 },

  { src: 'gt-player.jpg', out: 'public/images/game-truck/truck-player.webp', w: 1400, h: 933, q: 78 },

  { src: 'dog-pomeranian.jpg', out: 'public/images/venue/dog-pomeranian.webp', w: 900, h: 1125, q: 78 },
  { src: 'dog-golden-market.jpg', out: 'public/images/venue/dog-yard-day.webp', w: 1400, h: 933, q: 78 },

  { src: 'venue-front-night.jpg', out: 'public/images/venue/front-night-wide.webp', w: 2048, h: 1084, focus: 0.52, q: 78 },
  { src: 'venue-front-night.jpg', out: 'public/images/venue/front-night.webp', w: 1400, h: 933, q: 78 },

  { src: 'dj-decks.jpg', out: 'public/images/venue/dj-decks.webp', w: 900, h: 1125, focus: 0.42, q: 78 },
  { src: 'live-bass.jpg', out: 'public/images/venue/live-bass.webp', w: 900, h: 1125, focus: 0.42, q: 78 },
  { src: 'live-drums.jpg', out: 'public/images/venue/live-drums.webp', w: 1400, h: 933, q: 78 },
  { src: 'live-steel-drums.jpg', out: 'public/images/venue/live-steel-drums.webp', w: 900, h: 1125, focus: 0.45, q: 78 },

  { src: 'bar-game-day.jpg', out: 'public/images/venue/bar-game-day.webp', w: 1400, h: 933, q: 78 },
  { src: 'bar-flight.jpg', out: 'public/images/venue/bar-flight.webp', w: 900, h: 1125, focus: 0.45, q: 78 },

  { src: 'yard-night-friends.jpg', out: 'public/images/venue/yard-night-friends.webp', w: 900, h: 900, q: 80 },
  { src: 'guests-group-day.jpg', out: 'public/images/venue/guests-group-day.webp', w: 1400, h: 933, q: 78 },

  { src: 'yard-yoga.jpg', out: 'public/images/events/yard-yoga.webp', w: 1400, h: 933, focus: 0.55, q: 78 },
  { src: 'street-fourth.jpg', out: 'public/images/events/street-fourth.webp', w: 900, h: 1125, focus: 0.45, q: 78 },

  { src: 'ocn-crab-boil.jpg', out: 'public/images/trucks/ocn-seafood-1.webp', w: 800, h: 1000, q: 80 },
];

const VIDEOS = [
  { src: 'LATIN NIGHT 1.mp4', out: 'public/videos/latin-night.mp4', start: 3, dur: 6 },
  { src: 'GABRIEL KEY 2.mp4', out: 'public/videos/live-music.mp4', start: 6, dur: 6 },
];

const WEBP = {
  'public/images/venue/wall-cocktails-rooftop.webp': 78,
  'public/images/venue/wall-live-music-tent.webp': 68,
  'public/images/venue/wall-yard-night-crowd.webp': 78,
  'public/images/venue/wall-food-platter.webp': 70,
  'public/images/venue/wall-yard-night-table.webp': 64,
  'public/images/venue/wall-truck-window-day.webp': 60,
  'public/images/venue/wall-bartender.webp': 80,
  'public/images/venue/wall-dancing-night.webp': 80,
  'public/images/venue/wall-guests-yard-day.webp': 64,
  'public/images/venue/wall-sandwich.webp': 82,
  'public/images/venue/hero-truck-window.webp': 78,
  'public/images/venue/bar-cocktails-wide.webp': 74,
  'public/images/venue/whats-on-yard-wide.webp': 78,
  'public/images/venue/contact-bar-day-wide.webp': 86,
  'public/images/venue/join-stage-day-wide.webp': 68,
  'public/images/venue/story-yard-day-wide.webp': 78,
  'public/images/venue/truck-window-night.webp': 78,
  'public/images/venue/event-live-music.webp': 80,
  'public/images/venue/event-yard-night.webp': 80,
  'public/images/venue/event-dj-night.webp': 84,
  'public/images/venue/event-la-noche.webp': 74,
  'public/images/venue/event-ross-brown.webp': 84,
  'public/images/market/hero-yard-wide.webp': 80,
  'public/images/market/stall-jewelry.webp': 76,
  'public/images/market/stall-picnic.webp': 64,
  'public/images/market/stall-art.webp': 72,
  'public/images/market/stall-flowers.webp': 70,
  'public/images/market/vendor-boba.webp': 84,
  'public/images/market/stall-home.webp': 74,
  'public/images/venue/venue-aerial.webp': 60,
  'public/images/venue/doors-band.webp': 70,
  'public/images/venue/leaf-backdrop.webp': 72,
  'public/images/game-truck/truck-wide.webp': 80,
  'public/images/game-truck/truck-night.webp': 82,
  'public/images/game-truck/truck-side.webp': 68,
  'public/images/game-truck/truck-player.webp': 82,
  'public/images/venue/dog-pomeranian.webp': 82,
  'public/images/venue/dog-yard-day.webp': 80,
  'public/images/venue/front-night-wide.webp': 78,
  'public/images/venue/front-night.webp': 68,
  'public/images/venue/dj-decks.webp': 82,
  'public/images/venue/live-bass.webp': 82,
  'public/images/venue/live-drums.webp': 86,
  'public/images/venue/live-steel-drums.webp': 84,
  'public/images/venue/bar-game-day.webp': 82,
  'public/images/venue/bar-flight.webp': 68,
  'public/images/venue/yard-night-friends.webp': 82,
  'public/images/venue/guests-group-day.webp': 82,
  'public/images/events/yard-yoga.webp': 68,
  'public/images/events/street-fourth.webp': 68,
  'public/images/trucks/ocn-seafood-1.webp': 68,
};
const ensureDir = (p) => mkdirSync(dirname(p), { recursive: true });

let totalIn = 0;
let totalOut = 0;

console.log('── PHOTOS ─────────────────────────────────────────────────────');
const ONLY = process.argv[2];

for (const f of PHOTOS) {
  if (ONLY && !f.out.includes(ONLY)) continue;
  const src = `${IN}/${f.src}`;
  if (!existsSync(src)) {
    console.error(`  ✗ original missing: ${f.src}`);
    continue;
  }
  ensureDir(f.out);
  let pipe = sharp(src).rotate();

  if (f.turn) pipe = pipe.rotate(f.turn);

  if (f.focus !== undefined) {
    const meta = await pipe.metadata();
    const { width, height } = meta.autoOrient ?? meta;
    const bandHeight = Math.min(height, Math.round((width * f.h) / f.w));
    const top = Math.max(0, Math.min(height - bandHeight, Math.round(height * f.focus - bandHeight / 2)));
    pipe = pipe.extract({ left: 0, top, width, height: bandHeight });
  }

  await pipe
    .resize(f.w, f.h, { fit: 'cover', position: f.position ?? 'centre' })
    .webp({ quality: WEBP[f.out] ?? f.q + 4, effort: 6 })
    .toFile(f.out);
  totalIn += kb(src);
  totalOut += kb(f.out);
  console.log(`  ${f.out.replace('public/', '')}  ${f.w}×${f.h}  ${kb(src)} KB → ${kb(f.out)} KB`);
}

console.log('\n── VIDEOS ─────────────────────────────────────────────────────');
for (const v of ONLY ? [] : VIDEOS) {
  const src = `${IN}/${v.src}`;
  if (!existsSync(src)) {
    console.error(`  ✗ original missing: ${v.src}`);
    continue;
  }
  ensureDir(v.out);
  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-loglevel', 'error',
      '-ss', String(v.start),
      '-t', String(v.dur),
      '-i', src,
      '-vf', 'crop=iw:iw*4/3,scale=480:640,fps=24',
      '-an',
      '-c:v', 'libx264',
      '-profile:v', 'main',
      '-pix_fmt', 'yuv420p',
      '-crf', '30',
      '-preset', 'slow',
      '-movflags', '+faststart',
      v.out,
    ],
    { stdio: ['ignore', 'ignore', 'inherit'] },
  );

  const poster = v.out.replace(/\.mp4$/, '.webp');
  const rawFrame = v.out.replace(/\.mp4$/, '.frame.png');
  execFileSync(
    'ffmpeg',
    ['-y', '-loglevel', 'error', '-ss', String(v.start + 1), '-i', src,
     '-vf', 'crop=iw:iw*4/3,scale=480:640', '-frames:v', '1', rawFrame],
    { stdio: ['ignore', 'ignore', 'inherit'] },
  );

  await sharp(rawFrame).webp({ quality: 80, effort: 6 }).toFile(poster);
  rmSync(rawFrame);

  totalIn += kb(src);
  totalOut += kb(v.out) + kb(poster);
  console.log(
    `  ${v.out.replace('public/', '')}  480×640 ${v.dur}s  ${kb(src)} KB → ${kb(v.out)} KB (+ poster ${kb(poster)} KB)`,
  );
}

console.log('\n── TOTAL ──────────────────────────────────────────────────────');
console.log(`  originals used:    ${(totalIn / 1024).toFixed(1)} MB`);
console.log(`  derivatives:       ${(totalOut / 1024).toFixed(1)} MB`);
console.log(`  reduction:         ${(100 - (totalOut / totalIn) * 100).toFixed(1)} %`);
