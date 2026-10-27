import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const DEEP = '#014545';
const ISOTYPE = readFileSync('public/brand/isotype-truck.svg', 'utf8');
const INTERIOR = ISOTYPE.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');

function plate({ radius, width }) {
  const w = 512 * width;
  const h = (w * 390) / 552;
  const x = (512 - w) / 2;
  const y = (512 - h) / 2 + 8;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="${radius}" fill="${DEEP}"/>
  <svg x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" viewBox="0 0 552 390">${INTERIOR}</svg>
</svg>
`;
}

const png = (svg, side) => sharp(Buffer.from(svg), { density: 300 }).resize(side, side).png().toBuffer();

function ico(pngs) {
  const header = Buffer.alloc(6 + 16 * pngs.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = header.length;
  pngs.forEach(({ side, buf }, i) => {
    const e = 6 + 16 * i;
    header.writeUInt8(side, e);
    header.writeUInt8(side, e + 1);
    header.writeUInt16LE(1, e + 4);
    header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(buf.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += buf.length;
  });
  return Buffer.concat([header, ...pngs.map((p) => p.buf)]);
}

const rounded = plate({ radius: 112, width: 0.8 });
const square = plate({ radius: 0, width: 0.7 });

writeFileSync('src/app/icon.svg', rounded);
writeFileSync(
  'src/app/favicon.ico',
  ico(await Promise.all([16, 32, 48].map(async (side) => ({ side, buf: await png(rounded, side) })))),
);
writeFileSync('src/app/apple-icon.png', await png(square, 180));
mkdirSync('public/icons', { recursive: true });
writeFileSync('public/icons/icon-192.png', await png(square, 192));
writeFileSync('public/icons/icon-512.png', await png(square, 512));

console.log('✓ icon.svg, favicon.ico, apple-icon.png, icon-192.png, icon-512.png');
