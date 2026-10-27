import sharp from 'sharp';

const [out, widthStr, ...rest] = process.argv.slice(2);
const width = Number(widthStr);
const pairs = [];
for (let i = 0; i < rest.length; i += 2) pairs.push([rest[i], rest[i + 1]]);

const LABEL_HEIGHT = 44;
const GAP = 16;

const cols = [];
for (const [label, file] of pairs) {
  const buf = await sharp(file).resize({ width }).toBuffer();
  const { height } = await sharp(buf).metadata();
  cols.push({ label, buf, height });
}

const H = LABEL_HEIGHT + Math.max(...cols.map((c) => c.height)) + GAP * 2;
const W = cols.length * width + GAP * (cols.length + 1);

const layers = [];
let x = GAP;
for (const c of cols) {
  const svg = Buffer.from(
    `<svg width="${width}" height="${LABEL_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
       <rect width="100%" height="100%" fill="#0A1F1E"/>
       <text x="12" y="29" font-family="Arial,Helvetica,sans-serif" font-size="17"
             font-weight="bold" fill="#FFFFFF">${c.label}</text>
     </svg>`,
  );
  layers.push({ input: svg, top: GAP, left: x });
  layers.push({ input: c.buf, top: GAP + LABEL_HEIGHT, left: x });
  x += width + GAP;
}

await sharp({ create: { width: W, height: H, channels: 3, background: '#4a4a4a' } })
  .composite(layers)
  .png()
  .toFile(out);

console.log(`${out} — ${W}×${H}`);
