/**
 * Convierte las dos grecas dibujadas a mano del Figma en la trama que usa el
 * sitio.
 *
 *   npm run greca
 *
 * Entrada:  design-audit/tmp/greca-a.svg · greca-b.svg  (export del Figma)
 * Salida:   public/brand/greca.png                       (la tira, 2 celdas)
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ SE RASTERIZA, Y NO ES UN ATAJO — ES LA DECISIÓN CORRECTA ACÁ.
 *
 * Los SVG que exporta Figma son trazados A MANO: un solo `<path>` con 8.601 y
 * 10.375 números. Pesan 67 KB y 81 KB. Redondear los decimales a uno los baja
 * a 42 y 51 KB, y ahí se termina lo que se puede ganar sin simplificar la
 * geometría — el peso está en los miles de micro-segmentos que describen el
 * borde del trazo, no en la precisión.
 *
 * 93 KB de SVG para un adorno que se REPITE es más que todo el CSS del sitio
 * (66 KB). Y el vector no aporta nada en este uso: la celda se muestra a
 * ~34px, así que un raster a 3× es indistinguible.
 *
 * ⚠️ SE USA COMO `mask-image`, no como `background-image`, y de eso depende
 * todo lo demás. Una imagen de fondo trae su color adentro; una máscara usa el
 * canal ALFA del PNG y el color lo pone `background-color`, o sea un token.
 * Es lo único que permite que la misma trama vaya en `deep` sobre un cuadro
 * claro y en `cream` sobre uno oscuro sin duplicar archivos.
 *
 * ⚠️ LAS DOS GRECAS VAN EN UNA SOLA TIRA, alternadas. Son dos dibujos
 * distintos del mismo motivo, y ése es el regalo: repitiendo una sola, la tira
 * se lee estampada; alternando las dos, se lee dibujada. Un PNG de dos celdas
 * repetido horizontalmente da un período de dos, que es lo que rompe el patrón
 * mecánico sin cargar dos archivos.
 * ══════════════════════════════════════════════════════════════════════════
 */
import sharp from 'sharp';
import { readFileSync, statSync } from 'node:fs';

/** La celda, en píxeles del PNG. 3× el tamaño de exhibición (~34px). */
const CELDA = 102;

const fuentes = ['design-audit/tmp/greca-a.svg', 'design-audit/tmp/greca-b.svg'];
const salida = 'public/brand/greca.png';

/**
 * ⚠️ El relleno se fuerza a BLANCO antes de rasterizar. Los archivos del Figma
 * vienen en `white`, pero si alguien los vuelve a exportar con otro color el
 * alfa sigue siendo el mismo — lo que importa para una máscara es la forma, no
 * el color. Ponerlo explícito hace que el resultado no dependa de eso.
 *
 * ⚠️ Y se quita `preserveAspectRatio="none"`: acá cada greca se rasteriza en su
 * propia celda cuadrada, y estirarla la deformaría antes de tiempo. El ajuste a
 * la celda lo hace `resize` con `fit: contain`, que respeta la proporción y
 * rellena con transparencia.
 */
function prepararSvg(ruta) {
  return Buffer.from(
    readFileSync(ruta, 'utf8')
      .replace(/fill="(?:currentColor|white|#fff(?:fff)?)"/gi, 'fill="#ffffff"')
      .replace(/\s*preserveAspectRatio="none"/g, ''),
  );
}

const celdas = [];
let pesoFuente = 0;
for (const f of fuentes) {
  pesoFuente += statSync(f).size;
  celdas.push(
    await sharp(prepararSvg(f), { density: 600 })
      .resize(CELDA, CELDA, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer(),
  );
}

await sharp({
  create: {
    width: CELDA * celdas.length,
    height: CELDA,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite(celdas.map((input, i) => ({ input, top: 0, left: i * CELDA })))
  /* `palette: true` cuantiza a paleta indexada. El dibujo es una sola forma con
     bordes suaves, así que 32 colores de alfa alcanzan y el archivo se derrumba. */
  .png({ palette: true, colors: 32, compressionLevel: 9, effort: 10 })
  .toFile(salida);

const peso = statSync(salida).size;
console.log(`${salida}  ${CELDA * celdas.length}×${CELDA}px`);
console.log(
  `  SVG de origen: ${(pesoFuente / 1024).toFixed(1)} KB  →  PNG de la tira: ${(peso / 1024).toFixed(1)} KB  (−${(100 - (peso / pesoFuente) * 100).toFixed(0)} %)`,
);
