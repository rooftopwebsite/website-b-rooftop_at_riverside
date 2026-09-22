/**
 * EL BANCO DE FOTOS: todo el material en una sola carpeta, sin repetidas.
 *
 *   node scripts/build-photo-bank.mjs
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ POR QUÉ EXISTE. Camila, 2026-09-22: «en una carpeta pon las que usamos en
 * nuestro rediseño y las que están en la web original, limpia las repetidas,
 * llena los huecos».
 *
 * Hasta hoy el material vivía en tres lugares que no se hablaban:
 *
 *   · `public/multimedia/` — la entrega del cliente (36 fotos y 5 videos), que
 *     es de donde sale todo lo que el sitio publica hoy;
 *   · `_interno/fotos/_originales-web/` — las 81 que el cliente publica en su
 *     Wix, bajadas con `fetch-old-site-media.mjs`;
 *   · `_interno/fotos/de-camila/` — lo que Camila sume a mano.
 *
 * Y se pisaban: varias de las 81 YA estaban en la entrega, porque el cliente
 * subió a su web las mismas fotos que nos pasó. Mirándolas de a una eso no se
 * ve; en una carpeta sola, sí.
 *
 * ⚠️ NO BORRA NADA DE LAS CARPETAS DE ORIGEN. El banco es una CUARTA carpeta
 * que las junta por copia. Si algo sale mal, se borra el banco y se vuelve a
 * generar; los originales no se tocan nunca.
 *
 * ⚠️ Y NO SE VERSIONA, como todo `_interno/` (§5b de INVARIANTES).
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠️ CÓMO DECIDE QUÉ ES UNA REPETIDA. Dos pasadas, y la segunda es la que
 * importa:
 *
 *   1. HASH EXACTO (sha1 del archivo). Agarra el mismo archivo subido dos
 *      veces. Es barato y no falla nunca.
 *   2. HUELLA PERCEPTUAL (dHash de 16×16 sobre la imagen en gris). Agarra la
 *      misma foto reexportada, recomprimida o redimensionada, que es el caso
 *      de verdad: la entrega del cliente y su Wix tienen las mismas fotos en
 *      dos tamaños.
 *
 * ⚠️ LO QUE NO AGARRA, Y HAY QUE SABERLO: dos tomas distintas del mismo
 * momento. Pasó en este proyecto —`live-band-crowd` y `wall-yard-night-crowd`
 * son el mismo cantante en la misma noche con dos encuadres— y ningún hash las
 * marca, porque como imágenes son distintas. Eso se ve mirando, no midiendo.
 * El índice las deja juntas para que se vean de a una.
 * ══════════════════════════════════════════════════════════════════════════
 */
import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import sharp from 'sharp';

const BANCO = '_interno/fotos/banco';

/** De dónde sale cada cosa, en orden de prioridad: la primera gana el nombre. */
const FUENTES = [
  { dir: 'public/multimedia', etiqueta: 'entrega del cliente', prefijo: '' },
  { dir: '_interno/fotos/de-camila', etiqueta: 'sumada por Camila', prefijo: 'cami-' },
  { dir: '_interno/fotos/_originales-web', etiqueta: 'web vigente', prefijo: 'web-' },
];

const ES_IMAGEN = /\.(jpe?g|png|webp|gif|avif)$/i;

/**
 * La huella perceptual: dHash de 16×16.
 *
 * ⚠️ COMPARA GRADIENTES, NO PÍXELES. Cada bit dice si un píxel es más claro
 * que el de su derecha, y eso sobrevive a que la imagen se reescale, se
 * recomprima o cambie de brillo — que es exactamente lo que le pasa a una foto
 * cuando Wix la vuelve a exportar.
 */
async function huella(ruta) {
  const px = await sharp(ruta)
    .rotate()
    .greyscale()
    .resize(17, 16, { fit: 'fill' })
    .raw()
    .toBuffer();
  let bits = '';
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      bits += px[y * 17 + x] > px[y * 17 + x + 1] ? '1' : '0';
    }
  }
  return bits;
}

/** Cuántos bits difieren. Menos de 12 sobre 256 es la misma foto. */
const distancia = (a, b) => {
  let d = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
  return d;
};

await mkdir(BANCO, { recursive: true });

/* ── 1 · Juntar todo lo que hay ─────────────────────────────────────────── */
const archivos = [];
for (const f of FUENTES) {
  if (!existsSync(f.dir)) continue;
  for (const nombre of await readdir(f.dir)) {
    if (!ES_IMAGEN.test(nombre)) continue;
    archivos.push({ ruta: `${f.dir}/${nombre}`, nombre, fuente: f.etiqueta, prefijo: f.prefijo });
  }
}

console.log(`${archivos.length} imágenes en ${FUENTES.length} carpetas.\n`);

/* ── 2 · Medir cada una ─────────────────────────────────────────────────── */
for (const a of archivos) {
  const buf = await readFile(a.ruta);
  a.sha = createHash('sha1').update(buf).digest('hex');
  try {
    a.huella = await huella(a.ruta);
    const m = await sharp(a.ruta).rotate().metadata();
    a.w = m.width;
    a.h = m.height;
    a.px = m.width * m.height;
  } catch {
    a.roto = true;
  }
}

const buenas = archivos.filter((a) => !a.roto);

/* ── 3 · Agrupar repetidas ──────────────────────────────────────────────── */
const grupos = [];
for (const a of buenas) {
  const g = grupos.find(
    (gr) => gr[0].sha === a.sha || distancia(gr[0].huella, a.huella) < 12,
  );
  if (g) g.push(a);
  else grupos.push([a]);
}

/*
 * De cada grupo se queda LA MÁS GRANDE, no la primera encontrada: entre la
 * versión de la entrega y la que Wix reexportó, la que sirve para recortar es
 * la que tiene más píxeles.
 */
for (const g of grupos) g.sort((x, y) => y.px - x.px);

const repetidas = grupos.filter((g) => g.length > 1);

/* ── 4 · Copiar al banco ────────────────────────────────────────────────── */
let n = 0;
for (const g of grupos) {
  const a = g[0];
  const destino = `${BANCO}/${a.prefijo}${a.nombre}`;
  if (!existsSync(destino)) await copyFile(a.ruta, destino);
  a.destino = destino;
  n += 1;
}

/* ── 5 · Qué de esto se publica hoy ─────────────────────────────────────── */
const pipeline = await readFile('scripts/build-media.mjs', 'utf8');
const enUso = new Map();
for (const m of pipeline.matchAll(/src:\s*'([^']+)'[^}]*out:\s*'([^']+)'/g)) {
  if (!enUso.has(m[1])) enUso.set(m[1], []);
  enUso.get(m[1]).push(m[2].replace('public/', '/'));
}

/* ── 6 · El índice ──────────────────────────────────────────────────────── */
const filas = grupos
  .map((g) => {
    const a = g[0];
    const usos = enUso.get(a.nombre) ?? [];
    const otras = g.slice(1).map((x) => x.nombre);
    return {
      archivo: `${a.prefijo}${a.nombre}`,
      medida: `${a.w}×${a.h}`,
      fuente: a.fuente,
      usos,
      otras,
    };
  })
  .sort((x, y) => x.archivo.localeCompare(y.archivo));

const md = [
  '# El banco de fotos',
  '',
  `Generado el ${new Date().toISOString().slice(0, 10)} con`,
  '`node scripts/build-photo-bank.mjs`. **No se versiona** y **se puede borrar**:',
  'es una copia de las otras carpetas, no el original de nada.',
  '',
  `**${n} fotos distintas** de ${buenas.length} archivos. ${buenas.length - n} eran repetidas.`,
  '',
  '## Cómo leer esto',
  '',
  '- **En el sitio** dice a qué archivo publicado da origen. Vacío = está en el',
  '  banco y no se usa en ninguna página.',
  '- **Repetida de** lista las otras copias que se encontraron de la misma foto.',
  '  Del grupo se conserva la de mayor resolución.',
  '',
  '| archivo | medida | origen | en el sitio | repetida de |',
  '|---|---|---|---|---|',
  ...filas.map(
    (f) =>
      `| \`${f.archivo}\` | ${f.medida} | ${f.fuente} | ${f.usos.map((u) => `\`${u}\``).join(' ') || '—'} | ${f.otras.map((o) => `\`${o}\``).join(' ') || '—'} |`,
  ),
  '',
].join('\n');

await writeFile(`${BANCO}/INDICE.md`, md);

console.log(`✅ ${n} fotos distintas en ${BANCO}`);
console.log(`   ${repetidas.length} grupos de repetidas, ${buenas.length - n} archivos de más`);
for (const g of repetidas) {
  console.log(`   · ${g[0].nombre}  ←  ${g.slice(1).map((x) => x.nombre).join(', ')}`);
}
