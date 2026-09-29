import sharp from 'sharp';
import { existsSync, mkdirSync, statSync } from 'node:fs';

/**
 * LAS IMÁGENES DE OPEN GRAPH: la vista previa que sale al compartir un link en
 * WhatsApp, iMessage, Facebook, LinkedIn, X o Slack.
 *
 *     npm run og
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ POR QUÉ UN SCRIPT APARTE Y NO `build-media.mjs`. Las OG tienen reglas que
 * no son las de una foto de la página, y las cuatro rompían la versión anterior:
 *
 *   1. JPEG Y NO WEBP. Facebook y X leen WebP, pero LinkedIn y varios lectores
 *      de vista previa de apps de mensajería no, y ahí el link sale sin foto.
 *      El JPEG es el único formato que todos muestran.
 *   2. 1200×630 EXACTOS (1,91:1). Es la proporción de la tarjeta grande en
 *      todas las plataformas. Una foto 3:2 o vertical se recorta a ciegas, y
 *      lo que queda en la tarjeta lo decide cada red.
 *   3. MENOS DE 300 KB. Arriba de eso WhatsApp muestra la vista previa chica
 *      o ninguna. El script baja la calidad de a pasos hasta entrar.
 *   4. sRGB SIN PERFIL RARO. Una foto en Display P3 o Adobe RGB sale lavada en
 *      la mitad de los lectores, que ignoran el perfil.
 *
 * ⚠️ EL ORIGINAL DE LA OG POR DEFECTO VA EN `_interno/og/`, que no se
 * versiona (regla de la casa: el material de trabajo no entra a git). Se sube
 * ahí con el nombre `og-default` y cualquier extensión (.png, .jpg, .webp).
 * Mientras no esté, se usa la foto del patio desde la terraza.
 * ══════════════════════════════════════════════════════════════════════════
 */

const W = 1200;
const H = 630;
const MAX_KB = 300;
const OUT_DIR = 'public/og';

/** El primer archivo que exista, o `null`. */
function primero(...rutas) {
  return rutas.find((r) => existsSync(r)) ?? null;
}

const SUBIDA = primero(
  '_interno/og/og-default.png',
  '_interno/og/og-default.jpg',
  '_interno/og/og-default.jpeg',
  '_interno/og/og-default.webp',
  // El nombre con el que se subió la primera, el 2026-09-23.
  '_interno/og/OG.png',
);

/*
 * ⚠️ `position` ES DÓNDE SE CORTA CUANDO LA FUENTE NO ES 1,91:1. `attention`
 * busca la zona con más detalle y es lo correcto para una foto; para un diseño
 * con texto (la OG subida) va `centre`, porque un diseño ya viene armado para
 * leerse centrado y `attention` podría comerle una palabra del borde.
 */
const ENTRADAS = [
  {
    out: 'og-default.jpg',
    src: SUBIDA ?? 'public/images/venue/story-yard-day-wide.webp',
    position: SUBIDA ? 'centre' : 'attention',
  },
  { out: 'contact.jpg', src: 'public/images/venue/contact-bar-day-wide.webp', position: 'attention' },
  { out: 'events.jpg', src: 'public/images/events/events-hero.webp', position: 'centre' },
  { out: 'join-us.jpg', src: 'public/images/venue/join-stage-day-wide.webp', position: 'attention' },
  { out: 'market.jpg', src: 'public/images/market/hero-yard-wide.webp', position: 'attention' },
  { out: 'our-story.jpg', src: 'public/images/venue/story-yard-day-wide.webp', position: 'attention' },
  { out: 'sunset-bar.jpg', src: 'public/images/venue/bar-cocktails-wide.webp', position: 'attention' },
];

mkdirSync(OUT_DIR, { recursive: true });

for (const e of ENTRADAS) {
  const meta = await sharp(e.src).metadata();
  if ((meta.width ?? 0) < W || (meta.height ?? 0) < H) {
    console.warn(
      `⚠️  ${e.src} mide ${meta.width}×${meta.height}: más chico que ${W}×${H}, se va a ver estirada.`,
    );
  }

  const out = `${OUT_DIR}/${e.out}`;
  let q = 86;
  for (;;) {
    await sharp(e.src)
      .rotate() // respeta la orientación EXIF de una foto de teléfono
      .resize(W, H, { fit: 'cover', position: e.position })
      .toColorspace('srgb')
      .flatten({ background: '#ffffff' }) // un PNG con transparencia no sale negro
      // Un diseño con texto sobre color plano va en 4:4:4: con 4:2:0 las letras
      // blancas sobre el naranja salen con un halo. Las fotos no lo necesitan.
      .jpeg({ quality: q, mozjpeg: true, chromaSubsampling: e.position === 'centre' ? '4:4:4' : '4:2:0' })
      .toFile(out);
    const kb = Math.round(statSync(out).size / 1024);
    if (kb <= MAX_KB || q <= 60) {
      console.log(`${out.padEnd(26)} ${W}×${H}  q${q}  ${kb} KB  ← ${e.src}`);
      if (kb > MAX_KB) console.warn(`⚠️  ${out} sigue arriba de ${MAX_KB} KB con q60.`);
      break;
    }
    q -= 4;
  }
}

if (!SUBIDA) {
  console.log('\nℹ️  No hay _interno/og/og-default.*: la OG por defecto sale de la foto del patio.');
}
