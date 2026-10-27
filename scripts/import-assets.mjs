import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const RAW = '_internal/photos/_web-originals';
const OUT = 'public';

const JOBS = [
  { src: '14dedf_30ae92d396a543c09f8f84ffe49ab688~mv2.png', dst: 'brand/logo-lockup.png', w: 1200 },
  { src: '14dedf_74ed434a480f44d581972e66aef20a3f~mv2.png', dst: 'brand/isotype-truck.png', w: 900 },
  { src: '526079_c0bd2d9cd428427498708da539a5db7e~mv2.jpg', dst: 'images/events/event-b.webp', w: 1800, q: 72 },
  { src: '526079_4b4989fd71894880b13ceeae691ec992~mv2.jpg', dst: 'images/events/event-c.webp', w: 1800, q: 80 },
  { src: '526079_50eb2ec4bac240208b3bc5ec7614afd8~mv2.jpg', dst: 'images/events/event-d.webp', w: 1800, q: 82 },
  { src: '526079_98c407bd94a44a219c5dc74e96670edb~mv2.jpg', dst: 'images/game-truck.webp', w: 1800, q: 78 },
  { src: '11062b_a8b1fc399c4b4b19a703e00812a646a4~mv2.jpg', dst: 'images/game-controller.jpg', w: 1800 },
  { src: '526079_04e12ccd6da44291ac7c96b4ff530a46~mv2.jpg', dst: 'images/trucks/el-chilango-1.webp', w: 1600, q: 86 },
  { src: '526079_33ccb8b874144046aa86905f60f820fb~mv2.jpg', dst: 'images/trucks/el-chilango-2.webp', w: 1600, q: 80 },
  { src: '526079_3cfc45bc0bc042a69c704066c883500d~mv2.jpeg', dst: 'images/trucks/el-chilango-3.webp', w: 1600, q: 80 },
  { src: '11062b_567789504ad040be8bae8e94b3c393ac~mv2.jpg', dst: 'images/trucks/prime-carvery-1.jpg', w: 1600 },
  { src: '11062b_64de79fd442c4ef98de2d8baa77bdc5f~mv2_d_3840_5760_s_4_2.jpg', dst: 'images/trucks/seafood-1.jpg', w: 1600 },
  { src: '526079_05bd8539d47844d8b73bd063bd9c27dc~mv2.jpg', dst: 'images/trucks/tropical-1.jpg', w: 1600 },
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
