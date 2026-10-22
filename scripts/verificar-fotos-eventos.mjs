import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';

const eventos = JSON.parse(readFileSync('src/content/events.json', 'utf8'));

const huella = (ruta) => {
  const archivo = `public${ruta.split('?')[0]}`;
  if (!existsSync(archivo)) return null;
  return createHash('sha1').update(readFileSync(archivo)).digest('hex');
};

const sinFoto = [];
const rotas = [];
const porTitulo = new Map();
const porHuella = new Map();

for (const e of eventos) {
  if (!e.bannerUrl) {
    sinFoto.push(`${e.title} (${e.startDate})`);
    continue;
  }
  const h = huella(e.bannerUrl);
  if (!h) {
    rotas.push(`${e.title} (${e.startDate}) → ${e.bannerUrl}`);
    continue;
  }
  if (!porTitulo.has(e.title)) porTitulo.set(e.title, new Set());
  porTitulo.get(e.title).add(h);
  if (!porHuella.has(h)) porHuella.set(h, new Set());
  porHuella.get(h).add(e.title);
}

const distintas = [...porTitulo].filter(([, hs]) => hs.size > 1).map(([t, hs]) => `${t}: ${hs.size} fotos`);
const compartidas = [...porHuella.values()].filter((ts) => ts.size > 1).map((ts) => [...ts].join(' / '));

const bloques = [
  ['Sin foto', sinFoto],
  ['Archivo que no existe en public/', rotas],
  ['Mismo evento con fotos distintas', distintas],
  ['Eventos distintos con la misma foto', compartidas],
];

let fallas = 0;
for (const [titulo, lista] of bloques) {
  if (lista.length === 0) continue;
  fallas += lista.length;
  console.log(`\n${titulo} (${lista.length})`);
  for (const l of lista) console.log(`  · ${l}`);
}

console.log(fallas === 0 ? `${eventos.length} eventos, todo en regla.` : `\n${fallas} problemas.`);
process.exit(fallas === 0 ? 0 : 1);
