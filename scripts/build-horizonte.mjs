/**
 * Parte el elemento «horizonte» del Figma en sus dos piezas y las optimiza.
 *
 *   npm run horizonte
 *
 * Entrada: design-audit/tmp/horizonte.svg  (export del nodo 2012:4491)
 * Salida:
 *   src/components/shared/horizonte-ola.ts   los dos paths de la ola (inline)
 *   public/brand/sun-palm.svg                el medallón, como archivo
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ POR QUÉ SE PARTE EN DOS EN LUGAR DE USARLO COMO UN SOLO SVG.
 *
 * El export viene en una pieza de 77 KB, y ese peso está repartido de forma
 * muy desigual:
 *
 *     las dos olas        1,4 KB   ← geometría simple
 *     la palmera         20,1 KB
 *     los dientes del sol 52,5 KB   ← cientos de formitas
 *
 * Y las dos piezas necesitan cosas OPUESTAS:
 *
 *   · **La ola** tiene que estirarse a todo el ancho de la pantalla y tomar su
 *     color de un token —es la superficie de la sección de abajo emergiendo—.
 *     Eso pide SVG inline con `fill="currentColor"`. Son 1,4 KB: inline no
 *     cuesta nada.
 *   · **El medallón** tiene un tamaño fijo, va centrado y sus colores no
 *     cambian. Inline serían 72 KB en el HTML de la home, sin caché y
 *     repetidos en cada carga. Como archivo se cachea una vez.
 *
 * ⚠️ LOS COLORES DEL FIGMA NO SON LOS DEL SITIO y hay que mapearlos: el export
 * trae `#003A3A` y `#FFF7ED`, que son un verde y un hueso parecidos pero
 * distintos a `deep` (#014545) y a la paleta de acá. Se traducen a los tokens.
 * Dejarlos como vienen mete dos colores fuera de paleta en el medio de la home.
 * ══════════════════════════════════════════════════════════════════════════
 */
import { readFileSync, writeFileSync, statSync } from 'node:fs';

/**
 * La paleta se LEE de `src/lib/brand.ts` en lugar de escribirla acá.
 *
 * ⚠️ Es la misma lección que dejó `scripts/contrast.mjs`, que tenía los hexes
 * copiados a mano y quedó midiendo colores que el sitio no pintaba. Un script
 * que genera arte con color horneado tiene que leer la fuente.
 */
const COLORS = Object.fromEntries(
  [...readFileSync('src/lib/brand.ts', 'utf8').matchAll(/^\s+'?([a-z-]+)'?:\s*'(#[0-9A-Fa-f]{6})'/gm)].map(
    (m) => [m[1], m[2]],
  ),
);
for (const t of ['deep', 'cream']) {
  if (!COLORS[t]) {
    console.error(`no se pudo leer el token \`${t}\` de src/lib/brand.ts`);
    process.exit(1);
  }
}

const ENTRADA = 'design-audit/tmp/horizonte.svg';
const SALIDA_OLA = 'src/components/shared/horizonte-ola.ts';
const SALIDA_SOL = 'public/brand/sun-palm.svg';

const svg = readFileSync(ENTRADA, 'utf8');
const antes = statSync(ENTRADA).size;

/** Un decimal. Sobre un dibujo de 2176px de ancho, 0,05px de error. */
const redondear = (s) => s.replace(/-?\d+\.\d+/g, (n) => String(Math.round(Number(n) * 10) / 10));

/* ── 1. Las dos olas ─────────────────────────────────────────────────────── */
const olas = [...svg.matchAll(/<path id="Vector(?:_2)?" d="([^"]+)"/g)].map((m) => redondear(m[1]));
if (olas.length !== 2) {
  console.error(`se esperaban 2 paths de ola, se encontraron ${olas.length}`);
  process.exit(1);
}

const viewBox = (svg.match(/viewBox="([^"]+)"/) ?? [])[1];

writeFileSync(
  SALIDA_OLA,
  `/**
 * Los dos paths de la ola del elemento «horizonte» del brand book.
 *
 * ⚠️ GENERADO por \`npm run horizonte\` desde el nodo 2012:4491 del Figma
 * («Rooftop at Riverside (Copy)»). No editar a mano: se sobreescribe.
 *
 * ⚠️ Van INLINE y no como archivo porque la ola tiene que estirarse a todo el
 * ancho de la pantalla y tomar su color de un token —es la superficie de la
 * sección de abajo emergiendo sobre la de arriba—. Son 1,4 KB, así que inline
 * no cuesta nada. El medallón, que pesa 72 KB, sí es un archivo aparte.
 */
export const HORIZONTE = {
  viewBox: '${viewBox}',
  /** Las dos capas de ola. La segunda va un poco más abajo y da profundidad. */
  olas: [
${olas.map((d) => `    '${d}',`).join('\n')}
  ],
} as const;
`,
);

/* ── 2. El medallón ──────────────────────────────────────────────────────── */
const grupoSol = svg.match(/<g id="Group 2134282044">([\s\S]*?)<\/g>\s*<\/g>/);
if (!grupoSol) {
  console.error('no se encontró el grupo del medallón');
  process.exit(1);
}

/* El `<circle>` del disco trae su centro y su radio en atributos, no en un
   path: hay que leerlos para recortar el viewBox del medallón. */
const c = grupoSol[1].match(/<circle[^>]*cx="([\d.]+)"[^>]*cy="([\d.]+)"[^>]*r="([\d.]+)"/);
if (!c) {
  console.error('no se encontró el círculo del medallón');
  process.exit(1);
}
const [, cx, cy, r] = c.map(Number);
/* Los dientes sobresalen del círculo, así que el lienzo lleva un margen. */
const margen = r * 0.18;
const lado = (r + margen) * 2;

let cuerpo = redondear(grupoSol[1])
  .replace(/\s+id="[^"]*"/g, '')
  /*
   * ⚠️ SE QUITAN TODAS LAS ETIQUETAS `<g>`, y esto arregla un bug que generó
   * un SVG ROTO durante un rato.
   *
   * El grupo del medallón contiene otro grupo anidado (la palmera). La regex
   * que lo extrae termina en `</g></g>`, así que se comía el cierre del
   * interno y dejaba el cuerpo con un `<g>` abierto sin cerrar. El archivo
   * resultante no era XML válido: librsvg lo rechazaba con «corrupt header»,
   * y el navegador simplemente no dibujaba nada — sin error en consola.
   *
   * Se podría balancear contando etiquetas, pero es innecesario: verificado
   * sobre el export, **ninguno de los dos grupos internos lleva `transform`,
   * `clip-path`, `mask` ni `style`**. Sólo agrupan. Sacarlos deja el mismo
   * dibujo con menos nodos y sin forma de desbalancearse.
   *
   * ⚠️ El `clip-path` del marco EXTERIOR también se descarta, y a propósito:
   * recortaba al lienzo original de 2176×233 y acá el medallón se re-encuadra
   * con su propio `viewBox`. Dejarlo puesto lo haría desaparecer.
   */
  .replace(/<\/?g[^>]*>/g, '')
  /*
   * Los colores del Figma a los del sitio, con el VALOR LITERAL y no con
   * `var(--color-*)`.
   *
   * ⚠️ Y es obligatorio así: las CSS variables NO cruzan la frontera de un
   * `<img>`. Un SVG cargado como imagen es un documento aparte y no ve el
   * `:root` de la página, así que un `var(--color-deep)` adentro se resuelve
   * siempre a su fallback. Poner la variable sería escribir algo que parece
   * dinámico y nunca lo es — peor que el hex, porque miente.
   *
   * Es el mismo trato que ya tiene `public/brand/tile-pattern.svg`: arte de
   * marca con su color horneado. Lo que NO puede pasar es que estos valores se
   * desincronicen de la paleta, así que salen de `COLORS` de `lib/brand.ts` y
   * no escritos a mano acá.
   */
  .replace(/#003A3A/gi, COLORS.deep)
  .replace(/#FFF7ED/gi, COLORS.cream)
  .replace(/>\s+</g, '><')
  .trim();

/*
 * ⚠️ LLEVA `width` Y `height` ADEMÁS DEL `viewBox`, y no es redundante: es lo
 * que le da al archivo un TAMAÑO INTRÍNSECO.
 *
 * Sin ellos, `next/image` devuelve una imagen que el navegador reporta como
 * `naturalWidth: 0` y no dibuja nada. Medido: el `<img>` existía, `complete`
 * era `true`, la caja tenía 163×163px, y la imagen era 0×0.
 *
 * Y el modo de fallar fue el peor: no hay error de consola, no hay 404, la
 * respuesta es 200. Simplemente no se ve. Estuvo así hasta que lo medí en el
 * navegador — dos veces creí que el problema era el z-index.
 *
 * La comparación que lo delató: `public/brand/isotype-truck.svg`, que sí
 * renderiza con `next/image`, trae `width="552" height="390"`. Los SVG que
 * exporta Figma los traen; los que genero yo, hasta acá, no.
 */
const svgSol = `<svg xmlns="http://www.w3.org/2000/svg" width="${lado.toFixed(0)}" height="${lado.toFixed(0)}" viewBox="${(cx - r - margen).toFixed(1)} ${(cy - r - margen).toFixed(1)} ${lado.toFixed(1)} ${lado.toFixed(1)}" fill="none">${cuerpo}</svg>`;

/*
 * ⚠️ GUARD DE VALIDEZ, y existe porque este script YA generó un SVG roto.
 *
 * La regex de extracción se comía el `</g>` del grupo anidado y dejaba el
 * cuerpo con una etiqueta abierta. El resultado no era XML válido, y el modo
 * en que falló es el peligroso: **el navegador no dibuja nada y no reporta
 * nada**. No hay error de consola, no hay 404, no hay warning. La imagen
 * simplemente no está.
 *
 * Lo descubrí de casualidad porque `sharp` sí protesta («corrupt header») al
 * intentar rasterizarlo para una hoja de contactos. Sin ese rodeo, el medallón
 * habría quedado invisible en producción.
 *
 * Así que el script se niega a escribir un archivo desbalanceado.
 */
for (const t of ['svg', 'g']) {
  const abre = (svgSol.match(new RegExp(`<${t}[ >]`, 'g')) ?? []).length;
  const cierra = (svgSol.match(new RegExp(`</${t}>`, 'g')) ?? []).length;
  if (abre !== cierra) {
    console.error(
      `❌ el SVG del medallón quedó desbalanceado: <${t}> abre ${abre} veces y cierra ${cierra}.\n` +
        '   No se escribe el archivo. Un SVG inválido no dibuja NADA y no avisa.',
    );
    process.exit(1);
  }
}

writeFileSync(SALIDA_SOL, svgSol);

const pesoOla = statSync(SALIDA_OLA).size;
const pesoSol = statSync(SALIDA_SOL).size;
console.log(`entrada           ${(antes / 1024).toFixed(1)} KB`);
console.log(`${SALIDA_OLA}  ${(pesoOla / 1024).toFixed(1)} KB  (inline)`);
console.log(`${SALIDA_SOL}          ${(pesoSol / 1024).toFixed(1)} KB  (archivo, cacheado)`);
console.log(
  `total ${((pesoOla + pesoSol) / 1024).toFixed(1)} KB  (−${(100 - ((pesoOla + pesoSol) / antes) * 100).toFixed(0)} %), y de eso sólo ${(pesoOla / 1024).toFixed(1)} KB viajan en el HTML`,
);
