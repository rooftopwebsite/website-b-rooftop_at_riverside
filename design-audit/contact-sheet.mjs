import sharp from 'sharp';
import { readdirSync } from 'node:fs';

const [dir, out, colsStr = '6', cellStr = '300', fromStr = '0', toStr = '999'] =
  process.argv.slice(2);
const COLS = Number(colsStr);
const CELL = Number(cellStr);
const LABEL = 26;

const files = readdirSync(dir)
  .filter((f) => /\.(jpe?g|png)$/i.test(f))
  .sort()
  .slice(Number(fromStr), Number(toStr));

const layers = [];
let i = 0;
for (const f of files) {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  const x = col * CELL;
  const y = row * (CELL + LABEL);
  try {
    const buf = await sharp(`${dir}/${f}`)
      .rotate()
      .resize(CELL - 4, CELL - 4, { fit: 'cover' })
      .toBuffer();
    layers.push({ input: buf, top: y + LABEL, left: x + 2 });
  } catch (e) {
    console.error('could not read', f);
  }
  const n = String(Number(fromStr) + i + 1).padStart(2, '0');
  const svg = Buffer.from(
    `<svg width="${CELL}" height="${LABEL}" xmlns="http://www.w3.org/2000/svg">
       <rect width="100%" height="100%" fill="#0A1F1E"/>
       <text x="5" y="18" font-family="Arial" font-size="13" font-weight="bold" fill="#F58521">${n}</text>
       <text x="26" y="18" font-family="Arial" font-size="11" fill="#FFFFFF">${f.replace(/\.[^.]+$/, '').slice(0, 30)}</text>
     </svg>`,
  );
  layers.push({ input: svg, top: y, left: x });
  i += 1;
}

const rows = Math.ceil(i / COLS);
await sharp({
  create: { width: COLS * CELL, height: rows * (CELL + LABEL), channels: 3, background: '#333' },
})
  .composite(layers)
  .png()
  .toFile(out);
console.log(`${out} — ${i} images, ${COLS}×${rows}`);
