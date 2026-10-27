import sharp from 'sharp';
import { readFileSync, statSync } from 'node:fs';

const CELL = 102;

const sources = ['design-audit/tmp/greek-key-a.svg', 'design-audit/tmp/greek-key-b.svg'];
const output = 'public/brand/greek-key.png';

function prepareSvg(filePath) {
  return Buffer.from(
    readFileSync(filePath, 'utf8')
      .replace(/fill="(?:currentColor|white|#fff(?:fff)?)"/gi, 'fill="#ffffff"')
      .replace(/\s*preserveAspectRatio="none"/g, ''),
  );
}

const cells = [];
let sourceWeight = 0;
for (const f of sources) {
  sourceWeight += statSync(f).size;
  cells.push(
    await sharp(prepareSvg(f), { density: 600 })
      .resize(CELL, CELL, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer(),
  );
}

await sharp({
  create: {
    width: CELL * cells.length,
    height: CELL,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite(cells.map((input, i) => ({ input, top: 0, left: i * CELL })))
  .png({ palette: true, colors: 32, compressionLevel: 9, effort: 10 })
  .toFile(output);

const weight = statSync(output).size;
console.log(`${output}  ${CELL * cells.length}×${CELL}px`);
console.log(
  `  Source SVG: ${(sourceWeight / 1024).toFixed(1)} KB  →  Strip PNG: ${(weight / 1024).toFixed(1)} KB  (−${(100 - (weight / sourceWeight) * 100).toFixed(0)} %)`,
);
