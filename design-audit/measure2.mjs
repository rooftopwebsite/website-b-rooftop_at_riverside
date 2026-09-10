import { ratio } from './measure.mjs';
const r = (a,b) => ratio(a,b).toFixed(2);

console.log('## ¿Cuánto se separa una superficie de la otra? (paso visible ≈ ≥1.06:1)\n');
console.log('| par de superficies | ratio | lectura |');
console.log('|---|---:|---|');
const pares = [
  ['#FFFFFF','#FAF6EA','paper puro / cream del brief'],
  ['#FFFFFF','#F7F6F0','paper puro / cream desaturando por HSL'],
  ['#FDFCF7','#F7F1E3','paper / bone — el par que YA existe en el repo'],
  ['#FFFFFF','#FDF0B4','paper puro / cream-deep'],
  ['#FAF6EA','#FDF0B4','cream / cream-deep'],
  ['#FFFFFF','#FDFCF7','blanco puro / paper actual'],
];
for (const [a,b,u] of pares) console.log(`| \`${a}\` vs \`${b}\` — ${u} | **${r(a,b)}:1** | ${ratio(a,b)>=1.06?'se ve el corte':'apenas se distingue'} |`);

console.log('\n## Token de bajada: buscando el MÁS CLARO que aún pase 4.5:1 en las tres superficies claras\n');
console.log('| candidato | vs #FFFFFF | vs #FAF6EA | vs #FDF0B4 | AA cuerpo en las 3 |');
console.log('|---|---:|---:|---:|---|');
for (const c of ['#4E7A77','#4B7674','#487270','#456E6C','#426A68','#3F6664']) {
  const a=ratio(c,'#FFFFFF'), b=ratio(c,'#FAF6EA'), d=ratio(c,'#FDF0B4');
  console.log(`| \`${c}\` | ${a.toFixed(2)}:1 | ${b.toFixed(2)}:1 | ${d.toFixed(2)}:1 | ${(a>=4.5&&b>=4.5&&d>=4.5)?'✅':'❌'} |`);
}

console.log('\n## Filete/borde sobre cada superficie clara (WCAG 1.4.11 pide 3:1 sólo si es UI; un filete decorativo no)\n');
console.log('| candidato | vs #FFFFFF | vs #FAF6EA |');
console.log('|---|---:|---:|');
for (const c of ['#E6E1D4','#DED8C7','#D6CFBA','#CFC7AE']) console.log(`| \`${c}\` | ${r(c,'#FFFFFF')}:1 | ${r(c,'#FAF6EA')}:1 |`);

console.log('\n## `deeper` para el header sobre `deep`, y el CTA crema sobre deep\n');
console.log('| par | ratio |');
console.log('|---|---:|');
for (const [a,b,u] of [['#013434','#014545','deeper / deep'],['#014545','#FDF0B4','deep como TEXTO sobre botón crema'],['#014545','#F58521','deep como texto sobre sunset'],['#000000','#FDF0B4','negro sobre cream-deep']])
  console.log(`| ${u} | ${r(a,b)}:1 |`);
