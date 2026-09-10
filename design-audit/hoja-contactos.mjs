/**
 * Hoja de contactos de una carpeta de imágenes, con índice numerado.
 *   node design-audit/hoja-contactos.mjs <dir> <salida.png> [cols] [celda] [desde] [hasta]
 *
 * Sirve para MIRAR un lote entero de una vez en lugar de abrir 36 archivos.
 */
import sharp from 'sharp';
import { readdirSync } from 'node:fs';

const [dir, out, colsStr = '6', celdaStr = '300', desdeStr = '0', hastaStr = '999'] =
  process.argv.slice(2);
const COLS = Number(colsStr);
const CELDA = Number(celdaStr);
const ROTULO = 26;

const archivos = readdirSync(dir)
  .filter((f) => /\.(jpe?g|png)$/i.test(f))
  .sort()
  .slice(Number(desdeStr), Number(hastaStr));

const capas = [];
let i = 0;
for (const f of archivos) {
  const col = i % COLS;
  const fila = Math.floor(i / COLS);
  const x = col * CELDA;
  const y = fila * (CELDA + ROTULO);
  try {
    const buf = await sharp(`${dir}/${f}`)
      /* ⚠️ .rotate() SIN argumentos aplica la orientación EXIF. Sin esto, las
         fotos tomadas en vertical con la cámara girada salen acostadas: pasó
         con seis de las 36 en el primer intento. */
      .rotate()
      .resize(CELDA - 4, CELDA - 4, { fit: 'cover' })
      .toBuffer();
    capas.push({ input: buf, top: y + ROTULO, left: x + 2 });
  } catch (e) {
    console.error('no se pudo leer', f);
  }
  const n = String(Number(desdeStr) + i + 1).padStart(2, '0');
  const svg = Buffer.from(
    `<svg width="${CELDA}" height="${ROTULO}" xmlns="http://www.w3.org/2000/svg">
       <rect width="100%" height="100%" fill="#0A1F1E"/>
       <text x="5" y="18" font-family="Arial" font-size="13" font-weight="bold" fill="#F58521">${n}</text>
       <text x="26" y="18" font-family="Arial" font-size="11" fill="#FFFFFF">${f.replace(/\.[^.]+$/, '').slice(0, 30)}</text>
     </svg>`,
  );
  capas.push({ input: svg, top: y, left: x });
  i += 1;
}

const filas = Math.ceil(i / COLS);
await sharp({
  create: { width: COLS * CELDA, height: filas * (CELDA + ROTULO), channels: 3, background: '#333' },
})
  .composite(capas)
  .png()
  .toFile(out);
console.log(`${out} — ${i} imágenes, ${COLS}×${filas}`);
