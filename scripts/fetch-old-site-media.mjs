/**
 * Baja TODAS las fotos que el sitio vigente del cliente publica hoy.
 *
 *   node scripts/fetch-old-site-media.mjs
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ POR QUÉ EXISTE. La entrega del cliente son 36 fotos —camiones, barra y
 * noches de música— y el sitio nuevo tiene huecos que ninguna de esas 36 puede
 * llenar: el market, el game lounge, los trucks que no están en la entrega, la
 * gente. Pero el cliente SÍ publica material para todo eso: está en las 23
 * rutas de `eatdrinkparadise.com`, que es su Wix.
 *
 * Camila, 2026-09-22: «baja todas las fotos de la web original y ponlas en una
 * carpeta del repo, junto con las que yo misma ya te he dado».
 *
 * ⚠️ LO QUE BAJA VA A `_interno/`, QUE NO SE VERSIONA. Es la regla §5b de
 * `docs/INVARIANTES.md`: el material del cliente no entra a git; lo que entra
 * es el DERIVADO —la imagen recortada y optimizada que el sitio sirve—. Este
 * script llena la carpeta de entrada; `scripts/build-media.mjs` es el que
 * produce lo que se publica.
 *
 * ⚠️ BAJA EL ORIGINAL Y NO LA VERSIÓN TRANSFORMADA. Wix sirve cada imagen con
 * un sufijo de recorte y calidad —`/v1/fill/w_640,h_480,q_80/…`— y esas son las
 * miniaturas que usa SU maqueta. La URL sin el sufijo devuelve el archivo tal
 * como lo subieron, que suele ser de 2000 a 4000px. Es lo único que sirve para
 * recortar de nuevo.
 *
 * ⚠️ NO TOCA `public/`. Nada de lo que este script baja se publica solo: hay
 * que elegirlo, recortarlo y escribirle un `alt`. Ese paso es a mano y a ojo.
 * ══════════════════════════════════════════════════════════════════════════
 */
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const BASE = 'https://www.eatdrinkparadise.com';
const SALIDA = '_interno/fotos/_originales-web';

/**
 * Las rutas del sitio vigente, sacadas de `docs/current-site-inventory.md`.
 *
 * ⚠️ ESTÁN LAS 23, INCLUIDAS LAS QUE NO USAMOS. `/blank` y `/blank-1` son
 * restos de plantilla y `/inquiry-services-page` es lorem de Wix, pero las tres
 * pueden tener fotos reales cargadas encima: el inventario dice que `/blank`
 * mezcla un formulario de vendors con la ficha de un cóctel. Bajar de más acá
 * no cuesta nada; descubrir dentro de un mes que faltaba una foto, sí.
 */
const RUTAS = [
  '/',
  '/this-is-us',
  '/eat',
  '/drink',
  '/calendar',
  '/hostanevent',
  '/neighborhood-market',
  '/entertainment',
  '/game-lounge',
  '/find-us',
  '/parking',
  '/giveback',
  '/tnt-sign-ups',
  '/primecarvery',
  '/tropicalfusion',
  '/seameonwheels',
  '/el-chilango',
  '/ocn',
  '/bar-games-waiver',
  '/game-zone-waiver',
  '/blank',
  '/blank-1',
  '/inquiry-services-page',
];

/*
 * ⚠️ EL USER-AGENT DE NAVEGADOR NO ES OPCIONAL. Wix contesta 403 a un fetch sin
 * él, y el error que devuelve es una página de HTML: sin esto el script baja 23
 * páginas de error y reporta cero imágenes, que es el peor modo de fallar.
 */
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

/**
 * Los IDs de media que aparecen en el HTML de una página.
 *
 * ⚠️ SE LEEN DEL HTML CRUDO Y NO DEL DOM RENDERIZADO, y alcanza: Wix mete el
 * catálogo entero de la página en un JSON embebido (`warmupData`), así que las
 * fotos que su maqueta carga por JavaScript igual están escritas en el texto
 * que llega en la primera respuesta.
 *
 * ⚠️ SE FILTRAN LOS ARCHIVOS SIN `~mv2`, que son los íconos de la plantilla de
 * Wix —flechas, logos de redes, el pin del mapa—. El patrón `<hash>~mv2.<ext>`
 * es el de un archivo que alguien SUBIÓ; los otros vienen con el tema.
 */
function mediaDe(html) {
  const ids = new Set();
  for (const m of html.matchAll(/static\.wixstatic\.com\/media\/([A-Za-z0-9~_.%-]+)/g)) {
    // Wix escapa la virgulilla en algunas apariciones del JSON.
    const archivo = decodeURIComponent(m[1]);
    if (!/~mv2\.(jpg|jpeg|png|webp|gif)$/i.test(archivo)) continue;
    ids.add(archivo);
  }
  return ids;
}

await mkdir(SALIDA, { recursive: true });

/** Dónde apareció cada archivo. Es la mitad del valor del inventario. */
const donde = new Map();
let fallos = 0;

for (const ruta of RUTAS) {
  const url = `${BASE}${ruta}`;
  let html = '';
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) {
      console.log(`⚠️  ${ruta} → HTTP ${res.status}`);
      fallos += 1;
      continue;
    }
    html = await res.text();
  } catch (e) {
    console.log(`⚠️  ${ruta} → ${e.message}`);
    fallos += 1;
    continue;
  }

  const encontrados = mediaDe(html);
  for (const a of encontrados) {
    if (!donde.has(a)) donde.set(a, []);
    donde.get(a).push(ruta);
  }
  console.log(`   ${ruta.padEnd(26)} ${encontrados.size} imágenes`);
}

console.log(`\n${donde.size} archivos únicos en ${RUTAS.length - fallos} rutas. Bajando…\n`);

let bajados = 0;
let saltados = 0;

for (const [archivo, rutas] of donde) {
  const destino = `${SALIDA}/${archivo}`;
  if (existsSync(destino)) {
    saltados += 1;
    continue;
  }
  try {
    const res = await fetch(`https://static.wixstatic.com/media/${archivo}`, {
      headers: { 'User-Agent': UA },
    });
    if (!res.ok) {
      console.log(`⚠️  ${archivo} → HTTP ${res.status}`);
      continue;
    }
    await writeFile(destino, Buffer.from(await res.arrayBuffer()));
    bajados += 1;
  } catch (e) {
    console.log(`⚠️  ${archivo} → ${e.message}`);
  }
  void rutas;
}

/*
 * El índice. Sin esto la carpeta son ochenta hashes de Wix y no se sabe cuál
 * salía de dónde, que es justamente el dato que hace falta para elegir.
 */
const indice = [
  '# Fotos del sitio vigente del cliente',
  '',
  `Bajadas de \`eatdrinkparadise.com\` el ${new Date().toISOString().slice(0, 10)} con`,
  '`node scripts/fetch-old-site-media.mjs`. **Esta carpeta no se versiona** (ver',
  '§5b de `docs/INVARIANTES.md`): lo que entra a git es el derivado optimizado,',
  'no el original.',
  '',
  '| archivo | aparece en |',
  '|---|---|',
  ...[...donde.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([a, rutas]) => `| \`${a}\` | ${rutas.join(', ')} |`),
  '',
].join('\n');

await writeFile(`${SALIDA}/INDICE.md`, indice);

console.log(`✅ ${bajados} bajados, ${saltados} ya estaban. Índice en ${SALIDA}/INDICE.md`);
void readFile;
