/**
 * Junta capturas en UNA imagen, apiladas y rotuladas.
 *   node design-audit/comparar.mjs salida.png "Rótulo A" a.png "Rótulo B" b.png ...
 */
import sharp from 'sharp';

const [out, ...resto] = process.argv.slice(2);
const pares = [];
for (let i = 0; i < resto.length; i += 2) pares.push([resto[i], resto[i + 1]]);

const ALTO_ROTULO = 56;
const PAD = 20;

const piezas = [];
let anchoMax = 0;
for (const [rotulo, archivo] of pares) {
  const img = sharp(archivo);
  const { width, height } = await img.metadata();
  anchoMax = Math.max(anchoMax, width);
  piezas.push({ rotulo, archivo, width, height });
}

const W = anchoMax + PAD * 2;
let H = PAD;
for (const p of piezas) H += ALTO_ROTULO + p.height + PAD;

const capas = [];
let y = PAD;
for (const p of piezas) {
  const svg = Buffer.from(
    `<svg width="${anchoMax}" height="${ALTO_ROTULO}" xmlns="http://www.w3.org/2000/svg">
       <rect width="100%" height="100%" fill="#0A1F1E"/>
       <text x="18" y="36" font-family="Arial,Helvetica,sans-serif" font-size="21"
             font-weight="bold" fill="#FFFFFF">${p.rotulo}</text>
     </svg>`,
  );
  capas.push({ input: svg, top: y, left: PAD });
  y += ALTO_ROTULO;
  capas.push({ input: await sharp(p.archivo).toBuffer(), top: y, left: PAD });
  y += p.height + PAD;
}

await sharp({ create: { width: W, height: H, channels: 3, background: '#4a4a4a' } })
  .composite(capas)
  .png()
  .toFile(out);

console.log(`${out} — ${W}×${H}, ${piezas.length} capturas`);
