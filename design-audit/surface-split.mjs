import sharp from 'sharp';

const TOKENS = {
  'paper (white/bone)': ['#FFFFFF','#FDFCF7','#FCFBF2'],
  'cream / bone (warm light)': ['#F7F1E3','#FAF6EA','#F4F1EA'],
  'cream-deep (yellow)': ['#FDF0B4'],
  'deep + deeper (dark green)': ['#014545','#013434','#0A1F1E','#0d3b3a','#1a4f4e'],
  'sunset (orange)': ['#F58521','#E0741A'],
  'river / mint (light teal)': ['#0EB6B8','#C4F2EC'],
  'terra / tomato (red)': ['#A62000','#EB452C'],
};
const REF = [];
for (const [name, hexes] of Object.entries(TOKENS))
  for (const h of hexes) REF.push([name, [1,3,5].map((i)=>parseInt(h.slice(i-1+1-1+1,0)||'0',16))]);
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
let others = 0, total = 0;
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
    if (bd > 1800) { others++; continue; }
    tally.set(best, (tally.get(best) ?? 0) + 1);
  }
}

console.log(`\n${file} — ${width}×${height}, ${total.toLocaleString()} pixels sampled\n`);
console.log('| surface | % of the page |');
console.log('|---|---:|');
const rows = [...tally].sort((a,b)=>b[1]-a[1]);
for (const [name, n] of rows) console.log(`| ${name} | **${(n/total*100).toFixed(1)}%** |`);
console.log(`| photo / map / gray with no token | ${(others/total*100).toFixed(1)}% |`);

const light = (tally.get('paper (white/bone)')??0) + (tally.get('cream / bone (warm light)')??0);
const dark = tally.get('deep + deeper (dark green)') ?? 0;
console.log(`\n**Light (paper + cream): ${(light/total*100).toFixed(1)}%**  ·  target 70–75%`);
console.log(`**Dark (deep): ${(dark/total*100).toFixed(1)}%**  ·  target 20–25%`);
console.log(`**cream-deep: ${((tally.get('cream-deep (yellow)')??0)/total*100).toFixed(1)}%**  ·  target ≤5%`);
console.log(`**sunset: ${((tally.get('sunset (orange)')??0)/total*100).toFixed(1)}%**  ·  target ≤5%`);
