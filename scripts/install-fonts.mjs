import fs from 'node:fs/promises';
import path from 'node:path';
import { compress } from 'wawoff2';

/**
 * Toma las tipografías tal como las manda el cliente y las deja instaladas.
 *
 *   npm run fonts
 *
 * Qué hace:
 *   1. lee todo lo que haya en `public/fonts/_drop/` (.otf .ttf .woff .woff2)
 *   2. adivina qué cara es cada archivo por su nombre
 *   3. convierte a WOFF2 lo que no lo sea
 *   4. lo deja en `public/fonts/` con el nombre exacto que espera globals.css
 *   5. descomenta el bloque de `@font-face`, sólo con las caras que llegaron
 *   6. informa qué falta
 *
 * ⚠️ El paso 5 es el que importa y es el que a mano sale mal. El bloque de
 * `@font-face` vive COMENTADO en `globals.css`, y descomentarlo entero cuando
 * faltan caras deja `src` apuntando a archivos inexistentes: un 404 por cara,
 * la consola llena y el puntaje de Best Practices de Lighthouse por el piso,
 * que es criterio de aceptación de la Fase 4. Así que se emite sólo lo que de
 * verdad está en disco.
 *
 * ⚠️ El bloque se escribe entre dos marcas y se regenera entero cada vez. NO
 * se edita el que ya está: los comentarios CSS no se anidan y editar a mano
 * ahí adentro ya rompió el `@theme` una vez, en silencio y con el build en
 * verde. Ver `scripts/check-css.mjs`.
 */

const DROP = 'public/fonts/_drop';
const OUT = 'public/fonts';
const CSS = 'src/app/globals.css';

const START = '/* ===== FUENTES DE MARCA — generado por `npm run fonts`. NO EDITAR A MANO. ===== */';
const END = '/* ===== FIN FUENTES DE MARCA ===== */';

/**
 * Las caras del brand book. `match` corre sobre el nombre del archivo en
 * minúsculas y sin separadores, así que `Steelfish-Bold.otf`, `steelfish bold`
 * y `SteelfishBd` caen todos en la misma.
 *
 * ⚠️ El ORDEN importa: se prueba de arriba abajo y gana la primera. Por eso
 * «extrabold» va antes que «bold» — si no, todo extrabold entraría como bold.
 */
/* Los archivos vienen con las abreviaturas de la fundición —«Steelfish Bd It»,
   «Steelfish Eb»— así que hay que reconocer tanto la palabra entera como la
   abreviatura. `\b` no sirve porque el nombre ya viene sin separadores; se
   comprueba contra la cola del nombre. */
const isItalic = (n) => n.endsWith('it') || n.includes('italic') || n.includes('oblique');
const hasFace = (n, ...tokens) => tokens.some((t) => n.includes(t));

const FACES = [
  // Steelfish — display. La outline es decorativa y va aparte.
  { file: 'steelfish-outline.woff2', family: 'Steelfish Outline', weight: 400, style: 'normal', match: (n) => n.includes('steelfish') && n.includes('outline') },

  { file: 'steelfish-extrabold-italic.woff2', family: 'Steelfish', weight: 800, style: 'italic', match: (n) => n.includes('steelfish') && hasFace(n, 'extrabold', 'xbold', 'eb') && isItalic(n) },
  { file: 'steelfish-extrabold.woff2', family: 'Steelfish', weight: 800, style: 'normal', match: (n) => n.includes('steelfish') && hasFace(n, 'extrabold', 'xbold', 'eb') },

  { file: 'steelfish-bold-italic.woff2', family: 'Steelfish', weight: 700, style: 'italic', match: (n) => n.includes('steelfish') && hasFace(n, 'bold', 'bd') && isItalic(n) },
  { file: 'steelfish-bold.woff2', family: 'Steelfish', weight: 700, style: 'normal', match: (n) => n.includes('steelfish') && hasFace(n, 'bold', 'bd') },

  { file: 'steelfish-italic.woff2', family: 'Steelfish', weight: 400, style: 'italic', match: (n) => n.includes('steelfish') && isItalic(n) },
  { file: 'steelfish-regular.woff2', family: 'Steelfish', weight: 400, style: 'normal', match: (n) => n.includes('steelfish') },

  /* ⚠️ Acá había una entrada de Bronx y seis de «Futura PT», y NO se pueden
     volver a agregar. Las dos familias salieron del proyecto por licencia:
     Bronx llegó como `Bronx_PersonalUse.otf` (uso personal, sin un solo
     metadato de copyright) y los archivos de Futura eran en realidad Futura
     Cyrillic de ParaType, con EULA comercial adentro del archivo.

     Las reemplaza **Jost**, que es una variable de Google Fonts (OFL) y por lo
     tanto NO pasa por este script: se baja ya en woff2 y vive versionada en
     `public/fonts/jost-variable.woff2`. Este script existe para convertir los
     .otf/.ttf que suelta el cliente, y Jost no es eso.

     Si algún día alguien vuelve a soltar un `bronx.otf` o un `futura.otf` en
     `_drop/`, el script los va a ignorar por diseño y va a avisar que quedaron
     afuera. Es lo correcto: entrarían sin licencia. */
];

const normalise = (name) => path.parse(name).name.toLowerCase().replace(/[\s_\-.]/g, '');

/* ── 1. Leer lo que soltó el cliente ─────────────────────────────────────── */
let dropped;
try {
  dropped = (await fs.readdir(DROP)).filter((f) => /\.(otf|ttf|woff2?)$/i.test(f));
} catch {
  console.log(`No existe ${DROP}. Creala y dejá ahí las tipografías.`);
  process.exit(1);
}

if (dropped.length === 0) {
  console.log(`No hay tipografías en ${DROP}/`);
  console.log('Dejá ahí los archivos (.otf, .ttf, .woff o .woff2) y volvé a correr.');
  process.exit(1);
}

console.log(`Encontré ${dropped.length} archivo(s) en ${DROP}/\n`);

/* ── 2 y 3. Emparejar y convertir ────────────────────────────────────────── */
const installed = new Map();
const unmatched = [];

for (const name of dropped) {
  const key = normalise(name);
  const face = FACES.find((f) => f.match(key));

  if (!face) {
    unmatched.push(name);
    continue;
  }
  if (installed.has(face.file)) {
    console.log(`   · ${name} → ya había una para ${face.file}, se ignora`);
    continue;
  }

  const bytes = await fs.readFile(path.join(DROP, name));
  const isWoff2 = /\.woff2$/i.test(name);

  let out;
  if (isWoff2) {
    out = bytes;
  } else if (/\.woff$/i.test(name)) {
    console.log(`   ⚠️  ${name} es WOFF (v1). No se puede convertir a WOFF2 acá;`);
    console.log('       pedí el OTF/TTF o el WOFF2 directamente.');
    unmatched.push(name);
    continue;
  } else {
    out = Buffer.from(await compress(bytes));
  }

  await fs.writeFile(path.join(OUT, face.file), out);
  installed.set(face.file, face);

  const saved = isWoff2 ? '' : ` (${Math.round((1 - out.length / bytes.length) * 100)}% más liviano)`;
  console.log(`✅ ${name.padEnd(34)} → ${face.file}${saved}`);
}

if (unmatched.length) {
  console.log('\n⚠️  No pude identificar estos por el nombre:');
  for (const n of unmatched) console.log(`   ${n}`);
  console.log('   Renombralos incluyendo la familia y la cara (ej. "steelfish-bold.otf").');
}

/* ── 4. Regenerar el bloque de @font-face ────────────────────────────────── */
const rules = [...installed.values()]
  .map(
    (f) => `@font-face {
  font-family: '${f.family}';
  src: url('/fonts/${f.file}') format('woff2');
  font-weight: ${f.weight};
  font-style: ${f.style};
  font-display: swap;
}`,
  )
  .join('\n');

const block = `${START}\n${rules}\n${END}`;

let css = await fs.readFile(CSS, 'utf8');

if (css.includes(START)) {
  const from = css.indexOf(START);
  const to = css.indexOf(END) + END.length;
  css = css.slice(0, from) + block + css.slice(to);
} else {
  /* Primera vez: reemplaza el bloque comentado original. */
  const legacyStart = css.indexOf('/* ===== DESCOMENTAR CUANDO LOS WOFF2');
  const legacyEndMark = '===== FIN DEL BLOQUE A DESCOMENTAR ===== */';
  const legacyEnd = css.indexOf(legacyEndMark);
  if (legacyStart >= 0 && legacyEnd >= 0) {
    css = css.slice(0, legacyStart) + block + css.slice(legacyEnd + legacyEndMark.length);
  } else {
    console.log(`\n❌ No encontré dónde insertar el bloque en ${CSS}.`);
    process.exit(1);
  }
}

await fs.writeFile(CSS, css);

/* ── 5. Informe ──────────────────────────────────────────────────────────── */
console.log(`\n${installed.size} cara(s) instaladas y activadas en ${CSS}.`);

const missing = FACES.filter((f) => !installed.has(f.file));
if (missing.length) {
  console.log('\nFaltan (siguen cayendo en su respaldo):');
  for (const f of missing) console.log(`   ${f.family} ${f.weight}${f.style === 'italic' ? ' itálica' : ''}`);
}

/* Sólo Steelfish: el cuerpo lo pone Jost, que no pasa por este script porque
   viene de Google Fonts ya en woff2. Ver la nota de FACES. */
const critical = ['steelfish-regular.woff2'];
const missingCritical = critical.filter((c) => !installed.has(c));
if (missingCritical.length) {
  console.log('\n⚠️  Falta alguna de las dos caras que más se notan:');
  for (const c of missingCritical) console.log(`   ${c}`);
} else {
  console.log('\nLas dos caras que más se notan están. Corré `npm run dev` y mirá.');
}

console.log('\nDespués: npm run build && npm run check:css');
