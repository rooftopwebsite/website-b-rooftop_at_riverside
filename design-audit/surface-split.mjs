/**
 * Reparto de superficies MEDIDO sobre el píxel del screenshot full-page.
 *   node design-audit/surface-split.mjs <png>
 * Clasifica cada píxel al token de paleta más cercano y reporta el %.
 */
import sharp from 'sharp';

const TOKENS = {
  'paper (blanco/hueso)': ['#FFFFFF','#FDFCF7','#FCFBF2'],
  'cream / bone (claro cálido)': ['#F7F1E3','#FAF6EA','#F4F1EA'],
  'cream-deep (amarillo)': ['#FDF0B4'],
  'deep + deeper (verde oscuro)': ['#014545','#013434','#0A1F1E','#0d3b3a','#1a4f4e'],
  'sunset (naranja)': ['#F58521','#E0741A'],
  'river / mint (teal claro)': ['#0EB6B8','#C4F2EC'],
  'terra / tomato (rojo)': ['#A62000','#EB452C'],
};
const REF = [];
for (const [name, hexes] of Object.entries(TOKENS))
  for (const h of hexes) REF.push([name, [1,3,5].map((i)=>parseInt(h.slice(i-1+1-1+1,0)||'0',16))]);
// parse correcto
REF.length = 0;
for (const [name, hexes] of Object.entries(TOKENS))
  for (const h of hexes) {
    const s = h.replace('#','');
    REF.push([name, [0,2,4].map(i=>parseInt(s.slice(i,i+2),16))]);
  }

const file = process.argv[2];
const img = sharp(file);
const { width, height } = await img.metadata();
const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
const ch = info.channels;

const tally = new Map();
let otros = 0, total = 0;
// Muestreo cada 3 px: 1/9 de los píxeles, error muy por debajo de 1 punto.
for (let y = 0; y < info.height; y += 3) {
  for (let x = 0; x < info.width; x += 3) {
    const o = (y * info.width + x) * ch;
    const p = [data[o], data[o+1], data[o+2]];
    let best = null, bd = Infinity;
    for (const [name, c] of REF) {
      const d = (p[0]-c[0])**2 + (p[1]-c[1])**2 + (p[2]-c[2])**2;
      if (d < bd) { bd = d; best = name; }
    }
    total++;
    // 42² ≈ tolerancia de ~24 por canal. Más lejos que eso es foto, mapa o gris.
    if (bd > 1800) { otros++; continue; }
    tally.set(best, (tally.get(best) ?? 0) + 1);
  }
}

console.log(`\n${file} — ${width}×${height}, ${total.toLocaleString()} píxeles muestreados\n`);
console.log('| superficie | % de la página |');
console.log('|---|---:|');
const rows = [...tally].sort((a,b)=>b[1]-a[1]);
for (const [name, n] of rows) console.log(`| ${name} | **${(n/total*100).toFixed(1)}%** |`);
console.log(`| foto / mapa / gris sin token | ${(otros/total*100).toFixed(1)}% |`);

const claro = (tally.get('paper (blanco/hueso)')??0) + (tally.get('cream / bone (claro cálido)')??0);
const oscuro = tally.get('deep + deeper (verde oscuro)') ?? 0;
console.log(`\n**Claro (paper + cream): ${(claro/total*100).toFixed(1)}%**  ·  objetivo 70–75%`);
console.log(`**Oscuro (deep): ${(oscuro/total*100).toFixed(1)}%**  ·  objetivo 20–25%`);
console.log(`**cream-deep: ${((tally.get('cream-deep (amarillo)')??0)/total*100).toFixed(1)}%**  ·  objetivo ≤5%`);
console.log(`**sunset: ${((tally.get('sunset (naranja)')??0)/total*100).toFixed(1)}%**  ·  objetivo ≤5%`);
