/**
 * Converts the two hand-drawn greek keys from the Figma into the pattern the
 * site uses.
 *
 *   npm run greek-key
 *
 * Input:   design-audit/tmp/greek-key-a.svg · greek-key-b.svg  (Figma export)
 * Output:  public/brand/greek-key.png                          (the strip, 2 cells)
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ IT GETS RASTERIZED, AND IT'S NOT A SHORTCUT — IT'S THE RIGHT CALL HERE.
 *
 * The SVGs Figma exports are traced BY HAND: a single `<path>` with 8,601 and
 * 10,375 numbers. They weigh 67 KB and 81 KB. Rounding the decimals to one
 * brings them down to 42 and 51 KB, and that's the end of what can be gained
 * without simplifying the geometry — the weight is in the thousands of
 * micro-segments describing the stroke's edge, not in the precision.
 *
 * 93 KB of SVG for an ornament that REPEATS is more than the site's entire CSS
 * (66 KB). And the vector adds nothing in this use: the cell is displayed at
 * ~34px, so a 3× raster is indistinguishable.
 *
 * ⚠️ IT'S USED AS `mask-image`, not as `background-image`, and everything else
 * depends on that. A background image carries its color inside; a mask uses the
 * PNG's ALPHA channel and the color comes from `background-color`, i.e. a token.
 * It's the only thing that lets the same pattern go in `deep` over a light
 * panel and in `cream` over a dark one without duplicating files.
 *
 * ⚠️ THE TWO GREEK KEYS GO IN A SINGLE STRIP, alternated. They're two different
 * drawings of the same motif, and that's the gift: repeating just one, the strip
 * reads as stamped; alternating the two, it reads as drawn. A two-cell PNG
 * repeated horizontally gives a period of two, which is what breaks the
 * mechanical pattern without loading two files.
 * ══════════════════════════════════════════════════════════════════════════
 */
import sharp from 'sharp';
import { readFileSync, statSync } from 'node:fs';

/** The cell, in PNG pixels. 3× the display size (~34px). */
const CELL = 102;

const sources = ['design-audit/tmp/greek-key-a.svg', 'design-audit/tmp/greek-key-b.svg'];
const output = 'public/brand/greek-key.png';

/**
 * ⚠️ The fill is forced to WHITE before rasterizing. The Figma files come in
 * `white`, but if someone re-exports them in another color the alpha stays the
 * same — what matters for a mask is the shape, not the color. Making it
 * explicit means the result doesn't depend on that.
 *
 * ⚠️ And `preserveAspectRatio="none"` is removed: here each greek key is
 * rasterized in its own square cell, and stretching it would distort it too
 * early. Fitting to the cell is done by `resize` with `fit: contain`, which
 * respects the proportion and pads with transparency.
 */
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
  /* `palette: true` quantizes to an indexed palette. The drawing is a single
     shape with soft edges, so 32 alpha colors are enough and the file collapses. */
  .png({ palette: true, colors: 32, compressionLevel: 9, effort: 10 })
  .toFile(output);

const weight = statSync(output).size;
console.log(`${output}  ${CELL * cells.length}×${CELL}px`);
console.log(
  `  Source SVG: ${(sourceWeight / 1024).toFixed(1)} KB  →  Strip PNG: ${(weight / 1024).toFixed(1)} KB  (−${(100 - (weight / sourceWeight) * 100).toFixed(0)} %)`,
);
