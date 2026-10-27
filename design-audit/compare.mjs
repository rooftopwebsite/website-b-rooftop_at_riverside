import sharp from 'sharp';

const [out, ...rest] = process.argv.slice(2);
const pairs = [];
for (let i = 0; i < rest.length; i += 2) pairs.push([rest[i], rest[i + 1]]);

const LABEL_HEIGHT = 56;
const PAD = 20;

const pieces = [];
let maxWidth = 0;
for (const [label, file] of pairs) {
  const img = sharp(file);
  const { width, height } = await img.metadata();
  maxWidth = Math.max(maxWidth, width);
  pieces.push({ label, file, width, height });
}

const W = maxWidth + PAD * 2;
let H = PAD;
for (const p of pieces) H += LABEL_HEIGHT + p.height + PAD;

const layers = [];
let y = PAD;
for (const p of pieces) {
  const svg = Buffer.from(
    `<svg width="${maxWidth}" height="${LABEL_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
       <rect width="100%" height="100%" fill="#0A1F1E"/>
       <text x="18" y="36" font-family="Arial,Helvetica,sans-serif" font-size="21"
             font-weight="bold" fill="#FFFFFF">${p.label}</text>
     </svg>`,
  );
  layers.push({ input: svg, top: y, left: PAD });
  y += LABEL_HEIGHT;
  layers.push({ input: await sharp(p.file).toBuffer(), top: y, left: PAD });
  y += p.height + PAD;
}

await sharp({ create: { width: W, height: H, channels: 3, background: '#4a4a4a' } })
  .composite(layers)
  .png()
  .toFile(out);

console.log(`${out} — ${W}×${H}, ${pieces.length} screenshots`);
