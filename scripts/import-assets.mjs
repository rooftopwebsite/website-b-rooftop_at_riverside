/**
 * Baja a `public/images/` las fotos que el cliente publica en su sitio viejo.
 *
 *   node scripts/import-assets.mjs
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LEE DE `_interno/fotos/_originales-web/`, QUE ES DONDE ESTÁN DE VERDAD.
 * Hasta hoy apuntaba al scratchpad de una sesión de 2026-09-09 que hace rato
 * no existe, así que el script no corría: quedaba como registro de cómo se
 * habían generado esos archivos, no como algo reejecutable. Las mismas fotos
 * las baja `fetch-old-site-media.mjs` a una ruta estable del repo, y eso es lo
 * que usa ahora.
 *
 * ⚠️ NO ES EL PIPELINE PRINCIPAL. `build-media.mjs` parte de los originales de
 * cámara que entregó el cliente; esto parte de lo que Wix ya recomprimió, que
 * es lo mejor que hay de estas fotos. Es la diferencia que explica por qué acá
 * las calidades son más altas y el ahorro más flaco.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ LA CALIDAD DE CADA UNA ESTÁ MEDIDA, NO ELEGIDA A OJO. Camila, 2026-09-22:
 * «que estén en WebP, sin perder la calidad». Para cada foto se comparó el
 * SSIM —contra el archivo de Wix sin recomprimir— del JPEG que se publicaba y
 * del WebP a cada calidad, y quedó la calidad mínima que iguala al JPEG.
 *
 * ⚠️ SEIS SIGUEN EN JPEG A PROPÓSITO, y son el caso que prueba que la regla no
 * se aplicó a ciegas: su JPEG salió casi idéntico al archivo de Wix (SSIM de
 * 0,998 para arriba), y para igualar ESO el WebP tiene que reproducir también
 * el ruido de compresión que Wix ya le había metido — y ahí pesa más que el
 * JPEG. Pasarlas igual sería cambiar el formato a cambio de peso y de nada.
 *
 * ⚠️ `images/trucks/seafood-1.jpg` NO SE REGENERA: su original en Wix tiene un
 * nombre con sufijo de tamaño —`..._d_3840_5760_s_4_2.jpg`— que no quedó en la
 * bajada. El archivo publicado sigue sirviendo; sólo no se puede rehacer.
 */
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const RAW = '_interno/fotos/_originales-web';
const OUT = 'public';

/**
 * `q` es la calidad WebP medida. Sin `q`, el destino sigue en JPEG (ver arriba)
 * y `rot` es el cuarto de vuelta que necesita la foto.
 */
const JOBS = [
  { src: '14dedf_30ae92d396a543c09f8f84ffe49ab688~mv2.png', dst: 'brand/logo-lockup.png', w: 1200 },
  { src: '14dedf_74ed434a480f44d581972e66aef20a3f~mv2.png', dst: 'brand/isotype-truck.png', w: 900 },
  { src: '526079_71d7c0d734ae427c8faf3067c51899b6~mv2.jpg', dst: 'images/hero-live-music.webp', w: 2400, q: 88 },// −9 %
  { src: '526079_6cbb265faa9c48708cad5fe1923e588d~mv2.jpg', dst: 'images/venue-guests.webp', w: 2000, rot: -90, q: 86 },// −15 %
  { src: '14dedf_bb158bb053bb41f892f60ec07f67654b~mv2.jpg', dst: 'images/venue-rooftop.webp', w: 2000, q: 84 },// −19 %
  { src: '14dedf_33e55fe8f1f74c01b8a557fc2b20c7b2~mv2.jpg', dst: 'images/venue-park.webp', w: 2000, q: 80 },// −12 %
  { src: '526079_0b925a7df5fc4f499420dda13fcce297~mv2.jpg', dst: 'images/venue-story.webp', w: 2000, q: 84 },// −23 %
  { src: '11062b_e8674ba6ab55403bbb4db28ab9111ffb~mv2.jpg', dst: 'images/venue-truck-line.webp', w: 2000, q: 82 },// −19 %
  { src: '526079_4ea03d5f20d64c4b8e58dd5f3923a5f6~mv2.jpg', dst: 'images/events/event-a.webp', w: 1800, q: 80 },// −12 %
  { src: '526079_c0bd2d9cd428427498708da539a5db7e~mv2.jpg', dst: 'images/events/event-b.webp', w: 1800, q: 72 },// −19 %
  { src: '526079_4b4989fd71894880b13ceeae691ec992~mv2.jpg', dst: 'images/events/event-c.webp', w: 1800, q: 80 },// −12 %
  { src: '526079_50eb2ec4bac240208b3bc5ec7614afd8~mv2.jpg', dst: 'images/events/event-d.webp', w: 1800, q: 82 },// −9 %
  { src: '526079_98c407bd94a44a219c5dc74e96670edb~mv2.jpg', dst: 'images/game-truck.webp', w: 1800, q: 78 },// −21 %
  { src: '11062b_a8b1fc399c4b4b19a703e00812a646a4~mv2.jpg', dst: 'images/game-controller.jpg', w: 1800 },// se queda en JPEG: en WebP pesa más
  { src: '526079_04e12ccd6da44291ac7c96b4ff530a46~mv2.jpg', dst: 'images/trucks/el-chilango-1.webp', w: 1600, q: 86 },// −9 %
  { src: '526079_33ccb8b874144046aa86905f60f820fb~mv2.jpg', dst: 'images/trucks/el-chilango-2.webp', w: 1600, q: 80 },// −23 %
  { src: '526079_3cfc45bc0bc042a69c704066c883500d~mv2.jpeg', dst: 'images/trucks/el-chilango-3.webp', w: 1600, q: 80 },// −17 %
  { src: '11062b_567789504ad040be8bae8e94b3c393ac~mv2.jpg', dst: 'images/trucks/prime-carvery-1.jpg', w: 1600 },// se queda en JPEG: en WebP pesa más
  { src: '11062b_8d771aba921645479337888186918d0c~mv2.jpg', dst: 'images/trucks/prime-carvery-2.webp', w: 1600, q: 84 },// −2 %
  { src: '526079_70b7e8d636054e3ba4434ccba04a953d~mv2.jpeg', dst: 'images/trucks/prime-carvery-3.webp', w: 1600, q: 86 },// −7 %
  { src: '11062b_64de79fd442c4ef98de2d8baa77bdc5f~mv2_d_3840_5760_s_4_2.jpg', dst: 'images/trucks/seafood-1.jpg', w: 1600 },
  { src: '11062b_cf6dcb4e04214c82b701a83832cb9b8b~mv2.jpg', dst: 'images/trucks/seafood-2.webp', w: 1600, q: 60 },// −24 %
  { src: '526079_05bd8539d47844d8b73bd063bd9c27dc~mv2.jpg', dst: 'images/trucks/tropical-1.jpg', w: 1600 },// se queda en JPEG: en WebP pesa más
  { src: '526079_a2ef5f04336945d08b7823e57334eadb~mv2.jpg', dst: 'images/trucks/tropical-2.jpg', w: 1600 },// se queda en JPEG: en WebP pesa más
  { src: '526079_4607a2e45e8e45c386c0e0648c4d3ef3~mv2.jpeg', dst: 'images/trucks/tropical-3.jpg', w: 1600 },// se queda en JPEG: en WebP pesa más
  { src: '526079_d0c342a8d5494bc38b05c7579a07c45d~mv2.jpg', dst: 'images/trucks/tropical-4.jpg', w: 1600 },// se queda en JPEG: en WebP pesa más
];

let ok = 0;
const faltan = [];

for (const j of JOBS) {
  const from = path.join(RAW, j.src.replace(/[^\w.~-]/g, '_'));
  try {
    await fs.access(from);
  } catch {
    faltan.push(j.dst);
    continue;
  }

  const to = path.join(OUT, j.dst);
  await fs.mkdir(path.dirname(to), { recursive: true });

  let img = sharp(from, { failOn: 'none' });
  if (j.rot) img = img.rotate(j.rot);
  img = img.resize({ width: j.w, withoutEnlargement: true });

  if (j.dst.endsWith('.png')) await img.png({ compressionLevel: 9 }).toFile(to);
  else if (j.dst.endsWith('.webp')) await img.webp({ quality: j.q, effort: 6 }).toFile(to);
  else await img.jpeg({ quality: 82, mozjpeg: true }).toFile(to);

  ok += 1;
}

console.log(`procesadas: ${ok}${faltan.length ? `  ·  sin original: ${faltan.join(', ')}` : ''}`);
