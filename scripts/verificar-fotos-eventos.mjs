/**
 * Verifica las fotos de los eventos contra las tres reglas que fijó Camila.
 *
 *   node --env-file=.env.local scripts/verificar-fotos-eventos.mjs
 *
 * ══════════════════════════════════════════════════════════════════════════
 * LAS TRES REGLAS (2026-09-22):
 *
 *   1. Ningún evento sin foto.
 *   2. Un evento que se repite lleva LA MISMA foto en todas sus fechas.
 *   3. Dos eventos distintos NUNCA comparten foto.
 *
 * ⚠️ COMPARA EL CONTENIDO, NO EL NOMBRE DEL ARCHIVO, y esa es toda la razón
 * por la que este script existe aparte.
 *
 * El dashboard sube una copia NUEVA cada vez: cargar la misma foto en las
 * siete fechas de Gayborhood deja siete archivos distintos en el storage
 * —`1790106838139_gwq86g.webp`, `1790106864855_ej5w69.webp`…— con el mismo
 * contenido. Un verificador que mire el nombre los ve como siete fotos
 * distintas y grita que la regla 2 está rota cuando no lo está.
 *
 * Así que baja cada banner una vez, le saca un sha1 y agrupa por ese hash.
 * Son ~18 descargas y corre en unos segundos.
 *
 * ⚠️ NO ESCRIBE NADA. Es sólo lectura: la anon key no puede escribir en esta
 * tabla (ver `propagar-banner-evento.mjs`) y las fotos se cargan por el
 * dashboard, con sesión.
 * ══════════════════════════════════════════════════════════════════════════
 */
import { createHash } from 'node:crypto';

const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const RESTAURANT_ID = process.env.NEXT_PUBLIC_SUPABASE_RESTAURANT_ID;

if (!URL_BASE || !ANON || !RESTAURANT_ID) {
  console.error('Faltan las variables de Supabase. Corré con --env-file=.env.local');
  process.exit(1);
}

const eventos = await (
  await fetch(
    `${URL_BASE}/rest/v1/location_events?select=title,start_date,banner_url&restaurant_id=eq.${RESTAURANT_ID}&order=start_date.asc`,
    { headers: { apikey: ANON, Authorization: `Bearer ${ANON}` } },
  )
).json();

/* ── Bajar cada banner UNA vez y quedarse con el hash de su contenido ────── */
const hashPorUrl = new Map();
const urls = [...new Set(eventos.map((e) => e.banner_url).filter(Boolean))];

process.stdout.write(`Bajando ${urls.length} imágenes para comparar contenido… `);
for (const u of urls) {
  try {
    const res = await fetch(u);
    const buf = Buffer.from(await res.arrayBuffer());
    hashPorUrl.set(u, createHash('sha1').update(buf).digest('hex').slice(0, 12));
  } catch {
    hashPorUrl.set(u, null);
  }
}
console.log('listo.\n');

const porTitulo = new Map();
for (const e of eventos) {
  if (!porTitulo.has(e.title)) porTitulo.set(e.title, []);
  porTitulo.get(e.title).push(e);
}

let problemas = 0;

/* ── Regla 1 y 2 ─────────────────────────────────────────────────────────── */
for (const [titulo, filas] of [...porTitulo].sort()) {
  const sinFoto = filas.filter((f) => !f.banner_url);
  const hashes = new Set(filas.map((f) => hashPorUrl.get(f.banner_url)).filter(Boolean));

  if (sinFoto.length > 0) {
    console.log(`❌ ${titulo.padEnd(28)} ${sinFoto.length} de ${filas.length} fechas sin foto`);
    problemas += 1;
  } else if (hashes.size > 1) {
    console.log(`❌ ${titulo.padEnd(28)} sus ${filas.length} fechas usan ${hashes.size} fotos distintas`);
    problemas += 1;
  } else {
    const copias = new Set(filas.map((f) => f.banner_url)).size;
    const nota = copias > 1 ? ` (${copias} copias del mismo archivo en el storage)` : '';
    console.log(`✅ ${titulo.padEnd(28)} ${filas.length} fecha(s), una sola foto${nota}`);
  }
}

/* ── Regla 3 ─────────────────────────────────────────────────────────────── */
const dueño = new Map();
const choques = [];
for (const [titulo, filas] of porTitulo) {
  for (const h of new Set(filas.map((f) => hashPorUrl.get(f.banner_url)).filter(Boolean))) {
    if (dueño.has(h) && dueño.get(h) !== titulo) choques.push(`${dueño.get(h)} + ${titulo}`);
    else dueño.set(h, titulo);
  }
}

console.log('');
if (choques.length > 0) {
  console.log('❌ DOS EVENTOS CON LA MISMA FOTO:');
  for (const c of choques) console.log('   ' + c);
  problemas += choques.length;
} else {
  console.log(`✅ Las ${dueño.size} fotos son distintas entre sí: ningún evento repite la de otro.`);
}

console.log(
  problemas === 0
    ? '\n✅ Las tres reglas se cumplen.'
    : `\n❌ ${problemas} problema(s). Se cargan por el dashboard.`,
);
