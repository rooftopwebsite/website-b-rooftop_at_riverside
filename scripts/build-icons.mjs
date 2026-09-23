/**
 * Genera los íconos del sitio a partir del isotipo del camión.
 *
 *   npm run icons
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ HASTA EL 2026-09-23 EL FAVICON ERA EL TRIÁNGULO DE NEXT, el que deja
 * `create-next-app` en el primer commit. Nadie lo había cambiado.
 *
 * ⚠️ EL DIBUJO ES `public/brand/isotype-truck.svg`, la reducción del logo: el
 * camión con las palmeras. Es la marca que ya está en el lockup del header y en
 * el cartel del local, y la única silueta del brand book que se sigue leyendo a
 * 16px. El sello y el emblema tienen texto y anillos que a ese tamaño son una
 * mancha.
 *
 * ⚠️ VA SOBRE UNA PLACA `deep` Y NO SUELTO. Naranja sobre transparente
 * desaparece en una pestaña clara con el tema del sistema en claro, y las
 * palmeras del isotipo son HUECOS: sin placa, a 16px no se ven. Sobre `deep`
 * las palmeras salen en verde, el naranja da contraste en pestañas claras y
 * oscuras, y es el mismo color del `themeColor` del layout.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Salidas (las de `src/app/` las toma Next por convención de archivo):
 *
 *   src/app/icon.svg          el vectorial, para los navegadores que lo leen
 *   src/app/favicon.ico       16, 32 y 48 px, para todo lo demás
 *   src/app/apple-icon.png    180 px, opaco y sin redondear: iOS pone la máscara
 *   public/icons/icon-192.png y icon-512.png, para el manifest (Android)
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const DEEP = '#014545';
const ISOTIPO = readFileSync('public/brand/isotype-truck.svg', 'utf8');
/* El viewBox del isotipo es 552×390. Lo que va adentro del `<svg>` raíz. */
const INTERIOR = ISOTIPO.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');

/**
 * La placa con el camión centrado. `radio` 0 para el de Apple, que se
 * redondea solo; `ancho` es cuánto del lado ocupa el camión.
 */
function placa({ radio, ancho }) {
  const w = 512 * ancho;
  const h = (w * 390) / 552;
  const x = (512 - w) / 2;
  /* Un poco más abajo del centro óptico: el techo del camión es más angosto
     que las ruedas y, centrado exacto, se ve subido. */
  const y = (512 - h) / 2 + 8;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="${radio}" fill="${DEEP}"/>
  <svg x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" viewBox="0 0 552 390">${INTERIOR}</svg>
</svg>
`;
}

const png = (svg, lado) => sharp(Buffer.from(svg), { density: 300 }).resize(lado, lado).png().toBuffer();

/** Un .ico con PNG adentro (válido desde Windows Vista y en todo navegador). */
function ico(pngs) {
  const cabecera = Buffer.alloc(6 + 16 * pngs.length);
  cabecera.writeUInt16LE(0, 0);
  cabecera.writeUInt16LE(1, 2);
  cabecera.writeUInt16LE(pngs.length, 4);
  let offset = cabecera.length;
  pngs.forEach(({ lado, buf }, i) => {
    const e = 6 + 16 * i;
    cabecera.writeUInt8(lado, e);
    cabecera.writeUInt8(lado, e + 1);
    cabecera.writeUInt16LE(1, e + 4);
    cabecera.writeUInt16LE(32, e + 6);
    cabecera.writeUInt32LE(buf.length, e + 8);
    cabecera.writeUInt32LE(offset, e + 12);
    offset += buf.length;
  });
  return Buffer.concat([cabecera, ...pngs.map((p) => p.buf)]);
}

/* Redondeada como una app, y el camión grande: a 16px cada píxel cuenta. */
const redonda = placa({ radio: 112, ancho: 0.8 });
/* Cuadrada y con más aire: iOS y Android le aplican su propia máscara. */
const cuadrada = placa({ radio: 0, ancho: 0.7 });

writeFileSync('src/app/icon.svg', redonda);
writeFileSync(
  'src/app/favicon.ico',
  ico(await Promise.all([16, 32, 48].map(async (lado) => ({ lado, buf: await png(redonda, lado) })))),
);
writeFileSync('src/app/apple-icon.png', await png(cuadrada, 180));
mkdirSync('public/icons', { recursive: true });
writeFileSync('public/icons/icon-192.png', await png(cuadrada, 192));
writeFileSync('public/icons/icon-512.png', await png(cuadrada, 512));

console.log('✓ icon.svg, favicon.ico, apple-icon.png, icon-192.png, icon-512.png');
