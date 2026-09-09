import fs from 'node:fs/promises';

/**
 * Guard del CSS. Corre DESPUÉS del build.
 *
 * ⚠️ Existe por un fallo real que costó caro: un comentario CSS anidado dentro
 * del bloque de `@font-face` cerró el comentario antes de tiempo, dejó un `*​/`
 * suelto, y Tailwind dejó de emitir **todas** las utilidades de tema. El build
 * pasó sin un solo warning, la página se sirvió sin estilos, y sólo se detectó
 * bisecando contra el commit anterior.
 *
 * Dos chequeos:
 *   1. Comentarios anidados o cierres sueltos en globals.css — la causa.
 *   2. Que el CSS emitido contenga un puñado de utilidades canario. Es el
 *      chequeo que de verdad importa: no supone nada sobre POR QUÉ se rompió,
 *      sólo mira si el resultado sirve.
 *
 *   npm run build && npm run check:css
 */

const SOURCE = 'src/app/globals.css';

/**
 * Utilidades que TIENEN que existir en el CSS emitido. Se eligieron porque
 * cada una viene de un namespace distinto del tema: color, espaciado, tamaño
 * de texto, radio, sombra y tracking. Si el tema deja de registrarse, caen
 * todas juntas.
 */
const CANARIES = [
  'bg-cream',
  'text-ink',
  'px-gutter',
  'text-d4',
  'rounded-pill',
  'shadow-btn',
  /* ⚠️ Era `tracking-display`, el token de tracking del display, que se
     eliminó al pasar a la escala óptica de `--text-*--letter-spacing`. El
     canario de tracking ahora es `tracking-eyebrow`, que sigue siendo un
     token propio del tema y cubre el mismo namespace. */
  'tracking-eyebrow',
  'caja',
  'eyebrow',
];

/** Piso razonable: el CSS sano ronda los 50 KB; roto bajaba a 33 KB. */
const MIN_BYTES = 42_000;

let failed = false;

/* ── 1. Comentarios ─────────────────────────────────────────────────────── */
const css = await fs.readFile(SOURCE, 'utf8');
let depth = 0;
let line = 1;
const commentProblems = [];

for (let i = 0; i < css.length - 1; i++) {
  if (css[i] === '\n') line += 1;
  if (css[i] === '/' && css[i + 1] === '*') {
    if (depth > 0) commentProblems.push(`comentario ANIDADO abierto en la línea ${line}`);
    depth += 1;
    i += 1;
  } else if (css[i] === '*' && css[i + 1] === '/') {
    depth -= 1;
    i += 1;
    if (depth < 0) {
      commentProblems.push(`cierre de comentario SUELTO en la línea ${line}`);
      depth = 0;
    }
  }
}
if (depth > 0) commentProblems.push('hay un comentario SIN CERRAR al final del archivo');

if (commentProblems.length) {
  failed = true;
  console.log(`❌ ${SOURCE}`);
  for (const p of commentProblems) console.log(`   ${p}`);
  console.log('   Los comentarios CSS no se anidan. Esto rompe el @theme en silencio.');
} else {
  console.log(`✅ ${SOURCE} — comentarios bien balanceados, sin anidados`);
}

/* ── 2. Canarios en el CSS emitido ──────────────────────────────────────── */
async function findBuiltCss() {
  const dir = '.next/static/chunks';
  try {
    const files = await fs.readdir(dir);
    return files.filter((f) => f.endsWith('.css')).map((f) => `${dir}/${f}`);
  } catch {
    return [];
  }
}

const built = await findBuiltCss();
if (built.length === 0) {
  console.log('⚠️  No hay CSS compilado. Corré `npm run build` antes que esto.');
  process.exitCode = 1;
} else {
  const all = (await Promise.all(built.map((f) => fs.readFile(f, 'utf8')))).join('');
  const bytes = all.length;

  const missing = CANARIES.filter((c) => !all.includes(c));
  if (missing.length) {
    failed = true;
    console.log(`❌ CSS emitido: faltan ${missing.length} utilidades canario`);
    console.log(`   ${missing.join(', ')}`);
    console.log('   Señal de que el @theme no se registró o el escaneo no encontró las fuentes.');
  } else {
    console.log(`✅ CSS emitido — las ${CANARIES.length} utilidades canario están presentes`);
  }

  if (bytes < MIN_BYTES) {
    failed = true;
    console.log(`❌ CSS emitido pesa ${bytes} bytes, por debajo del piso de ${MIN_BYTES}`);
  } else {
    console.log(`✅ CSS emitido — ${bytes.toLocaleString('es')} bytes`);
  }
}

if (failed) process.exitCode = 1;
