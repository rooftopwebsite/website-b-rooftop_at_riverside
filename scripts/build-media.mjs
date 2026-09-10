/**
 * Convierte los originales de `public/multimedia/` en los derivados que sirve
 * el sitio.
 *
 *   npm run media
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ POR QUÉ EXISTE ESTE PASO Y NO SE USAN LOS ORIGINALES DIRECTO.
 *
 * La entrega del cliente pesa **681 MB**: 36 fotos de hasta 7008×4672 (17 MB
 * cada una) y 5 videos de 16 a 165 MB. Todo eso está en `public/`, o sea que
 * viajaría entero al deploy aunque el sitio muestre versiones chicas —
 * `next/image` optimiza lo que SIRVE, pero el archivo fuente igual se publica.
 *
 * Y los videos no se pueden usar ni con el peso arreglado: cuatro de los cinco
 * están en **HEVC**, que sólo reproduce Safari. En Chrome y Firefox el
 * `<video>` queda negro. Hay que recodificar a H.264 de todos modos.
 *
 * Así que `public/multimedia/` es la carpeta de ENTRADA —está en `.gitignore`,
 * igual que `public/fonts/_drop`— y lo que se versiona son los derivados de
 * `public/images/venue/` y `public/videos/`.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ `.rotate()` sin argumentos aplica la orientación EXIF. Sin eso, seis de
 * las 36 fotos salen acostadas: están tomadas en vertical con la cámara girada
 * y el alto/ancho del archivo no coincide con cómo hay que verlas.
 */
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname } from 'node:path';

const IN = 'public/multimedia';
const kb = (p) => Math.round(statSync(p).size / 1024);

/**
 * Las fotos, con su destino y su recorte.
 *
 * El `fit: 'cover'` recorta al centro. Donde el encuadre importa —un plato, una
 * cara— va `position` para mover el recorte.
 */
const FOTOS = [
  /* ── El muro del hero: 3:4 vertical, tiles de ~230px en desktop ──────────
     ⚠️ SON DIEZ FOTOS Y NO SIETE, porque de los cinco videos sólo dos sirven.
     Los otros tres son piezas de redes con texto quemado y alguien hablando a
     cámara: en un tile de 230px, muteado y en loop de 6s, eso no lee como
     ambiente — lee como un anuncio roto. El detalle está en `docs/media.md`.

     El orden de la lista importa: se alternan día/noche, comida/gente/lugar,
     para que dos tiles vecinos del muro nunca sean lo mismo. */
  ...[
    ['_RCZ4830.jpg', 'cocktails-rooftop'],
    ['_RCZ5702.JPG', 'live-music-tent'],
    ['_RCZ4336.JPG', 'yard-night-crowd'],
    ['D5F6CEA7-2C91-4C2E-B2D0-3C3BF1E20A93.PNG', 'food-platter'],
    ['_RCZ5884.JPG', 'yard-night-table'],
    ['_RCZ8096.jpg', 'truck-window-day'],
    ['_RCZ4397 (1).JPG', 'bartender'],
    ['_RCZ4382.JPG', 'dancing-night'],
    ['_RCZ8185.jpg', 'guests-yard-day'],
    ['_RCZ4528.JPG', 'sandwich'],
  ].map(([src, name]) => ({
    src,
    out: `public/images/venue/wall-${name}.jpg`,
    w: 540,
    h: 720,
    q: 72,
  })),

  /* ── La foto del hueco de la escalera: 4:5 ──────────────────────────────
     ⚠️ `_RCZ5847` es la ventanilla del truck de noche con gente pidiendo. Es
     literalmente lo que dice el paso 01 —«order at whichever window you
     want»—, así que reemplaza a `venue-truck-line.jpg`, que era una fila de
     camiones vacía. */
  { src: '_RCZ5847.JPG', out: 'public/images/venue/truck-window-night.jpg', w: 900, h: 1125, q: 78 },

  /* ── What's on ──────────────────────────────────────────────────────────
     La de HOY va a 4:3 y las dos chicas a 16:10. */
  { src: '_RCZ5702.JPG', out: 'public/images/venue/event-live-music.jpg', w: 1200, h: 900, q: 78 },
  { src: '_RCZ5757.JPG', out: 'public/images/venue/event-yard-night.jpg', w: 800, h: 500, q: 78 },
  { src: '_RCZ4382.JPG', out: 'public/images/venue/event-dj-night.jpg', w: 800, h: 500, q: 78 },

  /* ── El fondo del Events banner ─────────────────────────────────────────
     ⚠️ VA CHICO A PROPÓSITO: el componente lo pinta con `blur-[22px]`, así que
     el detalle es irrelevante y una imagen grande sería peso puro. 1000×667 es
     de sobra para una banda a todo el ancho desenfocada. Es la aérea del patio
     entero, que es exactamente lo que vende «we close the whole place». */
  {
    src: 'WhatsApp Image 2026-06-11 at 22.58.56 (1).jpeg',
    out: 'public/images/venue/venue-aerial.jpg',
    w: 1000,
    h: 667,
    q: 70,
  },

  /* ── La banda del titular de «Three doors» ───────────────────────────────
     ⚠️ ES UN RECORTE EXTREMO A PROPÓSITO: 4,95:1. La foto va INTERCALADA
     entre los dos renglones del h2, así que su trabajo es leerse como un
     renglón más y no como una foto puesta al lado del texto. A esa altura
     una foto vertical o de 3:2 no sirve: hay que recortarla.

     `_RCZ8192` es la barra de arriba entera con gente a lo largo. Se eligió
     midiendo el RECORTE y no la foto —hoja de contactos a 4,7:1 de las 24
     candidatas sin usar—: la línea de la barra corre de borde a borde, que es
     lo único que sobrevive a una franja de 200px de alto. Las otras dos
     finalistas se cayeron por eso mismo: en `DSC04091` la franja central es
     un cartel de «Table Reserved», y en `DSC02178` son cabezas cortadas.

     Y dice lo que dice la sección: «no es un restaurante». Una barra llena de
     gente NO es una foto de comida, que es justo la confusión que el bloque
     corrige.

     ⚠️ RECORTE A TODO EL ANCHO Y CON `foco` EN 0,564, no centrado. Arriba de
     la franja centrada son los televisores del techo y abajo son respaldos de
     silla, así que la ventana vertical está muy acotada; pero bajando el
     centro seis puntos entran la barra y la cristalería y salen las dos
     TELARAÑAS DE HALLOWEEN que hay colgadas en la pared del fondo. Una home
     evergreen no puede tener fecha, y ésa la tenía.

     Probé también recortar los ~18 % de la derecha para sacarlas: se pierde la
     barra corriendo de borde a borde, que es lo único que justifica un
     4,95:1. El ajuste vertical las saca sin perder el barrido. */
  {
    src: '_RCZ8192.jpg',
    out: 'public/images/venue/doors-band.jpg',
    w: 2080,
    h: 420,
    foco: 0.564,
    q: 74,
  },
];

/**
 * Los videos del muro. Recorte 9:16 → 3:4, sin audio, H.264.
 *
 * ⚠️ `desde`/`dur` recortan el fragmento. Los originales van de 17 a 56
 * segundos y el muro necesita loops cortos: un clip largo dentro de un tile de
 * 230px no se lee como una pieza, se lee como una película lejos.
 *
 * ⚠️ SIN AUDIO (`-an`), y no es sólo peso: un `<video autoplay>` con pista de
 * audio no arranca solo en ningún navegador moderno.
 */
const VIDEOS = [
  /*
   * ══════════════════════════════════════════════════════════════════════
   * ⚠️ SÓLO DOS DE LOS CINCO ENTREGADOS SE USAN, y el motivo es de contenido,
   * no de peso.
   *
   * Estos dos son metraje AMBIENTE: gente bailando en la noche latina, y un
   * guitarrista tocando. Sin audio y en loop de 6 segundos siguen diciendo lo
   * mismo que dicen con sonido, que es la prueba de que sirven para un muro
   * decorativo.
   *
   * Los tres descartados son piezas de REDES:
   *   · `Rooftop_4th schedule.mov` abre con una placa gráfica —«RED WHITE &
   *     MIMOSAS · JULY 4TH · $30 BOTTOMLESS»—. Es un flyer animado: en un tile
   *     de 230px el texto no se puede leer y no queda nada.
   *   · `Rooftop_Red White Mimosas.mov` y `Gaming Truck.mp4` son alguien
   *     hablando a cámara con subtítulo quemado. Muteado, es una persona
   *     moviendo la boca en silencio — el efecto es de video roto, no de
   *     ambiente.
   *
   * No se borran: quedan en `public/multimedia/` y sirven para redes o para
   * una página de eventos con sonido y controles. Simplemente no son material
   * para este muro. Ver `docs/media.md`.
   * ══════════════════════════════════════════════════════════════════════
   */
  { src: 'LATIN NIGHT 1.mp4', out: 'public/videos/latin-night.mp4', desde: 3, dur: 6 },
  { src: 'GABRIEL KEY 2.mp4', out: 'public/videos/live-music.mp4', desde: 6, dur: 6 },
];

const asegurar = (p) => mkdirSync(dirname(p), { recursive: true });

let entrada = 0;
let salida = 0;

console.log('── FOTOS ──────────────────────────────────────────────────────');
for (const f of FOTOS) {
  const src = `${IN}/${f.src}`;
  if (!existsSync(src)) {
    console.error(`  ✗ falta el original: ${f.src}`);
    continue;
  }
  asegurar(f.out);
  let pipe = sharp(src).rotate();

  /*
   * ⚠️ `foco` es un recorte vertical FINO, y existe porque `position` de sharp
   * sólo acepta las nueve gravedades —`top`, `centre`, `bottom`…— y en un
   * recorte de 4,95:1 el salto de `centre` a `bottom` es de mil píxeles: uno
   * te deja el techo y el otro los respaldos de las sillas.
   *
   * Es la fracción del alto donde va el CENTRO de la franja. 0.5 es `centre`.
   */
  if (f.foco !== undefined) {
    const { width, height } = await pipe.metadata();
    const alto = Math.min(height, Math.round((width * f.h) / f.w));
    const top = Math.max(0, Math.min(height - alto, Math.round(height * f.foco - alto / 2)));
    pipe = pipe.extract({ left: 0, top, width, height: alto });
  }

  await pipe
    .resize(f.w, f.h, { fit: 'cover', position: f.position ?? 'centre' })
    .jpeg({ quality: f.q, mozjpeg: true, progressive: true })
    .toFile(f.out);
  entrada += kb(src);
  salida += kb(f.out);
  console.log(`  ${f.out.replace('public/', '')}  ${f.w}×${f.h}  ${kb(src)} KB → ${kb(f.out)} KB`);
}

console.log('\n── VIDEOS ─────────────────────────────────────────────────────');
for (const v of VIDEOS) {
  const src = `${IN}/${v.src}`;
  if (!existsSync(src)) {
    console.error(`  ✗ falta el original: ${v.src}`);
    continue;
  }
  asegurar(v.out);
  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-loglevel', 'error',
      '-ss', String(v.desde),
      '-t', String(v.dur),
      '-i', src,
      /* 9:16 → 3:4 recortando al centro, y después a 480×640. `-2` deja que
         ffmpeg elija la dimensión par que corresponda. */
      '-vf', 'crop=iw:iw*4/3,scale=480:640,fps=24',
      '-an',
      '-c:v', 'libx264',
      '-profile:v', 'main',
      '-pix_fmt', 'yuv420p',
      '-crf', '30',
      '-preset', 'slow',
      /* `faststart` mueve el índice al principio del archivo: sin esto el
         navegador tiene que bajar el archivo entero antes del primer frame. */
      '-movflags', '+faststart',
      v.out,
    ],
    { stdio: ['ignore', 'ignore', 'inherit'] },
  );

  /* El póster: el primer frame, para que el tile muestre algo antes de que
     cargue el video y con `prefers-reduced-motion`. */
  const poster = v.out.replace(/\.mp4$/, '.jpg');
  execFileSync(
    'ffmpeg',
    ['-y', '-loglevel', 'error', '-ss', String(v.desde + 1), '-i', src,
     '-vf', 'crop=iw:iw*4/3,scale=480:640', '-frames:v', '1', '-q:v', '5', poster],
    { stdio: ['ignore', 'ignore', 'inherit'] },
  );

  entrada += kb(src);
  salida += kb(v.out) + kb(poster);
  console.log(
    `  ${v.out.replace('public/', '')}  480×640 ${v.dur}s  ${kb(src)} KB → ${kb(v.out)} KB (+ póster ${kb(poster)} KB)`,
  );
}

console.log('\n── TOTAL ──────────────────────────────────────────────────────');
console.log(`  originales usados: ${(entrada / 1024).toFixed(1)} MB`);
console.log(`  derivados:         ${(salida / 1024).toFixed(1)} MB`);
console.log(`  reducción:         ${(100 - (salida / entrada) * 100).toFixed(1)} %`);
