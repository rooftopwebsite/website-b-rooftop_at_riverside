/**
 * Revisa —y, si la base lo permite, arregla— las imágenes de los eventos.
 *
 *   node --env-file=.env.local scripts/propagar-banner-evento.mjs --todos
 *   node --env-file=.env.local scripts/propagar-banner-evento.mjs "Gayborhood"
 *
 * ══════════════════════════════════════════════════════════════════════════
 * QUÉ COMPRUEBA, que es lo que pidió Camila el 2026-09-22: «si tenemos repetido
 * el mismo evento tenga misma imagen, y dos eventos nunca la misma foto».
 *
 *   · que todas las fechas de un mismo título usen la MISMA imagen;
 *   · que dos títulos distintos NO compartan imagen;
 *   · qué fechas siguen sin ninguna.
 *
 * En `location_events` un evento que se repite son VARIAS FILAS, una por
 * fecha: Gayborhood tiene siete y DJ AKA Throwback Friday cuatro. El dashboard
 * sube la imagen a la fila que estés editando, así que sin este chequeo es muy
 * fácil terminar con el mismo evento mostrando cosas distintas según el mes.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠️ LA ANON KEY NO ESCRIBE EN ESTA TABLA, Y ESTE SCRIPT LO COMPRUEBA EN CADA
 * FILA EN VEZ DE CONFIARSE.
 *
 * La primera versión daba por hecho que sí, con una prueba mal hecha: un PATCH
 * que escribía EL MISMO valor que la fila ya tenía. Devolvió 204 y lo di por
 * bueno. No prueba nada — escribir lo mismo y no escribir son indistinguibles
 * desde afuera.
 *
 * Lo que pasa de verdad es que la RLS deja pasar el UPDATE pero no matchea
 * ninguna fila, así que PostgREST contesta 2xx con CERO filas modificadas. El
 * script llegó a reportar veinte escrituras con la base intacta.
 *
 * ⚠️ POR ESO VA `Prefer: return=representation` Y SE CUENTAN LAS FILAS QUE
 * VUELVEN. Un 2xx con `[]` es un rechazo silencioso y acá se trata como el
 * error que es. Si algún día la política cambia y la anon key puede escribir,
 * este mismo script empieza a arreglar solo, sin tocarle una línea.
 *
 * Mientras tanto las imágenes se cargan POR EL DASHBOARD, con sesión, fecha
 * por fecha, y esto sirve para saber cuáles faltan.
 *
 * ⚠️ NO INVENTA IMÁGENES: propaga la que ya tiene alguna fecha del mismo
 * título. Si ninguna la tiene, lo dice y sigue.
 * ══════════════════════════════════════════════════════════════════════════
 */
const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const RESTAURANT_ID = process.env.NEXT_PUBLIC_SUPABASE_RESTAURANT_ID;

if (!URL_BASE || !ANON || !RESTAURANT_ID) {
  console.error('Faltan las variables de Supabase. Corré con --env-file=.env.local');
  process.exit(1);
}

const cabeceras = { apikey: ANON, Authorization: `Bearer ${ANON}` };
const archivoDe = (url) => (url ? url.split('/').pop().split('?')[0] : null);

const eventos = await (
  await fetch(
    `${URL_BASE}/rest/v1/location_events?select=id,title,start_date,banner_url&restaurant_id=eq.${RESTAURANT_ID}&order=start_date.asc`,
    { headers: cabeceras },
  )
).json();

/** Título → sus filas. */
const porTitulo = new Map();
for (const e of eventos) {
  if (!porTitulo.has(e.title)) porTitulo.set(e.title, []);
  porTitulo.get(e.title).push(e);
}

const arg = process.argv[2];
if (!arg) {
  console.error('Pasá el título del evento, o `--todos`.');
  process.exit(1);
}
const titulos = arg === '--todos' ? [...porTitulo.keys()].sort() : [arg];

/* ── 1 · Intentar completar las fechas que faltan ───────────────────────── */
let escritas = 0;
let rechazadas = 0;
const pendientes = [];

for (const titulo of titulos) {
  const filas = porTitulo.get(titulo);
  if (!filas) {
    console.error(`⚠️  No existe el evento «${titulo}»`);
    continue;
  }

  const modelo = filas.find((f) => f.banner_url);
  if (!modelo) {
    console.log(`—  ${titulo.padEnd(28)} ninguna de sus ${filas.length} fechas tiene imagen`);
    pendientes.push({ titulo, fechas: filas.map((f) => f.start_date), imagen: null });
    continue;
  }

  const faltan = filas.filter((f) => f.banner_url !== modelo.banner_url);
  if (faltan.length === 0) {
    console.log(`✅ ${titulo.padEnd(28)} sus ${filas.length} fechas comparten imagen`);
    continue;
  }

  let ok = 0;
  const sinPoder = [];
  for (const f of faltan) {
    const r = await fetch(`${URL_BASE}/rest/v1/location_events?id=eq.${f.id}`, {
      method: 'PATCH',
      headers: {
        ...cabeceras,
        'Content-Type': 'application/json',
        // Ver la nota del encabezado: sin esto, un rechazo de RLS pasa por éxito.
        Prefer: 'return=representation',
      },
      body: JSON.stringify({ banner_url: modelo.banner_url }),
    });
    const tocadas = r.ok ? await r.json() : [];
    if (Array.isArray(tocadas) && tocadas.length > 0) ok += 1;
    else sinPoder.push(f.start_date);
  }

  escritas += ok;
  rechazadas += sinPoder.length;

  if (sinPoder.length === 0) {
    console.log(`✅ ${titulo.padEnd(28)} ${ok} fechas más ahora usan la misma imagen`);
  } else {
    console.log(
      `⛔ ${titulo.padEnd(28)} faltan ${sinPoder.length} de ${filas.length}: ${sinPoder.join(', ')}`,
    );
    pendientes.push({ titulo, fechas: sinPoder, imagen: archivoDe(modelo.banner_url) });
  }
}

/* ── 2 · Que dos eventos no compartan foto ──────────────────────────────── */
const dueño = new Map();
const choques = [];
for (const [titulo, filas] of porTitulo) {
  for (const a of new Set(filas.map((f) => archivoDe(f.banner_url)).filter(Boolean))) {
    if (dueño.has(a) && dueño.get(a) !== titulo) choques.push(`${dueño.get(a)} + ${titulo} → ${a}`);
    else dueño.set(a, titulo);
  }
}

console.log('');
if (choques.length > 0) {
  console.log('❌ DOS EVENTOS COMPARTEN FOTO:');
  for (const c of choques) console.log('   ' + c);
} else {
  console.log('✅ Ningún par de eventos comparte foto.');
}

if (pendientes.length > 0) {
  console.log('\n⛔ HAY QUE CARGARLAS POR EL DASHBOARD (la anon key no escribe):\n');
  for (const p of pendientes) {
    console.log(`   ${p.titulo} — ${p.fechas.length} fecha(s): ${p.fechas.join(', ')}`);
    if (p.imagen) console.log(`      usar la misma que ya tiene: ${p.imagen}`);
  }
}

console.log(`\n${escritas} filas escritas · ${rechazadas} rechazadas por la base.`);
