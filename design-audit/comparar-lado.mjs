/**
 * Comparativa LADO A LADO y escalada, para páginas completas.
 *   node design-audit/comparar-lado.mjs salida.png anchoCol "Rótulo A" a.png "Rótulo B" b.png
 *
 * ⚠️ Existe porque apilar dos home completas daba una imagen de 13.000px de
 * alto, que no se puede mirar. Escaladas y en paralelo el ritmo de superficies
 * —que es lo que hay que comparar— se ve de una.
 */
import sharp from 'sharp';

const [out, anchoStr, ...resto] = process.argv.slice(2);
const ancho = Number(anchoStr);
const pares = [];
for (let i = 0; i < resto.length; i += 2) pares.push([resto[i], resto[i + 1]]);

const ALTO_ROTULO = 44;
const GAP = 16;

const cols = [];
for (const [rotulo, archivo] of pares) {
  const buf = await sharp(archivo).resize({ width: ancho }).toBuffer();
  const { height } = await sharp(buf).metadata();
  cols.push({ rotulo, buf, height });
}

const H = ALTO_ROTULO + Math.max(...cols.map((c) => c.height)) + GAP * 2;
const W = cols.length * ancho + GAP * (cols.length + 1);

const capas = [];
let x = GAP;
for (const c of cols) {
  const svg = Buffer.from(
    `<svg width="${ancho}" height="${ALTO_ROTULO}" xmlns="http://www.w3.org/2000/svg">
       <rect width="100%" height="100%" fill="#0A1F1E"/>
       <text x="12" y="29" font-family="Arial,Helvetica,sans-serif" font-size="17"
             font-weight="bold" fill="#FFFFFF">${c.rotulo}</text>
     </svg>`,
  );
  capas.push({ input: svg, top: GAP, left: x });
  capas.push({ input: c.buf, top: GAP + ALTO_ROTULO, left: x });
  x += ancho + GAP;
}

await sharp({ create: { width: W, height: H, channels: 3, background: '#4a4a4a' } })
  .composite(capas)
  .png()
  .toFile(out);

console.log(`${out} — ${W}×${H}`);
