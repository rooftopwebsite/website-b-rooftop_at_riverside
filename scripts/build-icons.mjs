/**
 * Generates the site's icons from the truck isotype.
 *
 *   npm run icons
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ UNTIL 2026-09-23 THE FAVICON WAS NEXT'S TRIANGLE, the one
 * `create-next-app` leaves in the first commit. Nobody had changed it.
 *
 * ⚠️ THE DRAWING IS `public/brand/isotype-truck.svg`, the reduced logo: the
 * truck with the palm trees. It's the mark that's already in the header lockup
 * and on the venue's sign, and the only silhouette in the brand book that still
 * reads at 16px. The seal and the emblem have text and rings that at that size
 * become a smudge.
 *
 * ⚠️ IT SITS ON A `deep` PLATE AND NOT ON ITS OWN. Orange on transparent
 * disappears in a light tab with the system theme set to light, and the
 * isotype's palm trees are HOLES: without a plate, at 16px they don't show. On
 * `deep` the palm trees come out green, the orange gives contrast in light and
 * dark tabs, and it's the same color as the layout's `themeColor`.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Outputs (the ones in `src/app/` are picked up by Next by file convention):
 *
 *   src/app/icon.svg          the vector one, for browsers that read it
 *   src/app/favicon.ico       16, 32 and 48 px, for everything else
 *   src/app/apple-icon.png    180 px, opaque and unrounded: iOS applies the mask
 *   public/icons/icon-192.png and icon-512.png, for the manifest (Android)
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const DEEP = '#014545';
const ISOTYPE = readFileSync('public/brand/isotype-truck.svg', 'utf8');
/* The isotype's viewBox is 552×390. What goes inside the root `<svg>`. */
const INTERIOR = ISOTYPE.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');

/**
 * The plate with the truck centered. `radius` 0 for Apple's, which rounds
 * itself; `width` is how much of the side the truck takes up.
 */
function plate({ radius, width }) {
  const w = 512 * width;
  const h = (w * 390) / 552;
  const x = (512 - w) / 2;
  /* A little below the optical center: the truck's roof is narrower than the
     wheels and, centered exactly, it looks raised. */
  const y = (512 - h) / 2 + 8;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="${radius}" fill="${DEEP}"/>
  <svg x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" viewBox="0 0 552 390">${INTERIOR}</svg>
</svg>
`;
}

const png = (svg, side) => sharp(Buffer.from(svg), { density: 300 }).resize(side, side).png().toBuffer();

/** An .ico with PNGs inside (valid since Windows Vista and in every browser). */
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

/* Rounded like an app, and the truck large: at 16px every pixel counts. */
const rounded = plate({ radius: 112, width: 0.8 });
/* Square and with more breathing room: iOS and Android apply their own mask. */
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
