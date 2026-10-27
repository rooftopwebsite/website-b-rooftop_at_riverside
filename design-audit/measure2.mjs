import { ratio } from './measure.mjs';
const r = (a,b) => ratio(a,b).toFixed(2);

console.log('## How far does one surface separate from the other? (visible step ≈ ≥1.06:1)\n');
console.log('| surface pair | ratio | reading |');
console.log('|---|---:|---|');
const pairs = [
  ['#FFFFFF','#FAF6EA','pure paper / the brief\'s cream'],
  ['#FFFFFF','#F7F6F0','pure paper / cream desaturated via HSL'],
  ['#FDFCF7','#F7F1E3','paper / bone — the pair that ALREADY exists in the repo'],
  ['#FFFFFF','#FDF0B4','pure paper / cream-deep'],
  ['#FAF6EA','#FDF0B4','cream / cream-deep'],
  ['#FFFFFF','#FDFCF7','pure white / current paper'],
];
for (const [a,b,u] of pairs) console.log(`| \`${a}\` vs \`${b}\` — ${u} | **${r(a,b)}:1** | ${ratio(a,b)>=1.06?'the break shows':'barely distinguishable'} |`);

console.log('\n## Subhead token: looking for the LIGHTEST one that still passes 4.5:1 on the three light surfaces\n');
console.log('| candidate | vs #FFFFFF | vs #FAF6EA | vs #FDF0B4 | AA body on all 3 |');
console.log('|---|---:|---:|---:|---|');
for (const c of ['#4E7A77','#4B7674','#487270','#456E6C','#426A68','#3F6664']) {
  const a=ratio(c,'#FFFFFF'), b=ratio(c,'#FAF6EA'), d=ratio(c,'#FDF0B4');
  console.log(`| \`${c}\` | ${a.toFixed(2)}:1 | ${b.toFixed(2)}:1 | ${d.toFixed(2)}:1 | ${(a>=4.5&&b>=4.5&&d>=4.5)?'✅':'❌'} |`);
}

console.log('\n## Rule/border on each light surface (WCAG 1.4.11 asks for 3:1 only if it\'s UI; a decorative rule doesn\'t)\n');
console.log('| candidate | vs #FFFFFF | vs #FAF6EA |');
console.log('|---|---:|---:|');
for (const c of ['#E6E1D4','#DED8C7','#D6CFBA','#CFC7AE']) console.log(`| \`${c}\` | ${r(c,'#FFFFFF')}:1 | ${r(c,'#FAF6EA')}:1 |`);

console.log('\n## `deeper` for the header on `deep`, and the cream CTA on deep\n');
console.log('| pair | ratio |');
console.log('|---|---:|');
for (const [a,b,u] of [['#013434','#014545','deeper / deep'],['#014545','#FDF0B4','deep as TEXT on cream button'],['#014545','#F58521','deep as text on sunset'],['#000000','#FDF0B4','black on cream-deep']])
  console.log(`| ${u} | ${r(a,b)}:1 |`);
