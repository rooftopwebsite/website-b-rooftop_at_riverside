/** Measured WCAG 2.1 contrast. No numbers from memory. */
const hx = (h) => { h = h.replace('#',''); if(h.length===3) h=[...h].map(c=>c+c).join(''); return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16)/255); };
const lin = (c) => (c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4));
const L = (h) => { const [r,g,b] = hx(h).map(lin); return 0.2126*r + 0.7152*g + 0.0722*b; };
export const ratio = (a,b) => { const x=L(a), y=L(b); return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05); };

const rgb2hex = (r,g,b) => '#' + [r,g,b].map(v=>Math.round(v).toString(16).padStart(2,'0')).join('').toUpperCase();
/* HSL helpers to desaturate cream-deep in a controlled way. */
function hex2hsl(h){const [r,g,b]=hx(h);const mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;let hh=0;
 if(d){if(mx===r)hh=((g-b)/d)%6;else if(mx===g)hh=(b-r)/d+2;else hh=(r-g)/d+4;hh*=60;if(hh<0)hh+=360;}
 const l=(mx+mn)/2;const s=d?d/(1-Math.abs(2*l-1)):0;return[hh,s,l];}
function hsl2hex(hh,s,l){const c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs(((hh/60)%2)-1)),m=l-c/2;
 let [r,g,b]=[0,0,0];const i=Math.floor(hh/60)%6;
 if(i===0)[r,g,b]=[c,x,0];else if(i===1)[r,g,b]=[x,c,0];else if(i===2)[r,g,b]=[0,c,x];
 else if(i===3)[r,g,b]=[0,x,c];else if(i===4)[r,g,b]=[x,0,c];else[r,g,b]=[c,0,x];
 return rgb2hex((r+m)*255,(g+m)*255,(b+m)*255);}

const CREAM_DEEP = '#FDF0B4';
const [ch, cs, cl] = hex2hsl(CREAM_DEEP);
console.log(`cream-deep ${CREAM_DEEP} → H${ch.toFixed(0)} S${(cs*100).toFixed(0)}% L${(cl*100).toFixed(0)}%\n`);

console.log('## `cream` candidates by desaturating cream-deep (same H, S and L moved)\n');
console.log('| candidate | S | L | vs #FFFFFF | vs #FDFCF7 | approx ΔL* |');
console.log('|---|---:|---:|---:|---:|---:|');
for (const [s,l] of [[0.30,0.94],[0.28,0.95],[0.25,0.95],[0.22,0.955],[0.30,0.955],[0.35,0.95],[0.40,0.94]]) {
  const c = hsl2hex(ch, s, l);
  console.log(`| \`${c}\` | ${(s*100).toFixed(0)}% | ${(l*100).toFixed(1)}% | ${ratio(c,'#FFFFFF').toFixed(3)}:1 | ${ratio(c,'#FDFCF7').toFixed(3)}:1 | ${(Math.abs(L(c)-L('#FFFFFF'))*100).toFixed(1)} |`);
}

console.log('\n## SUBHEAD token: sweep from #3F6664, looking for ≥4.5:1 on the two light surfaces\n');
console.log('| candidate | vs #FFFFFF | vs #FAF6EA | vs #FDF0B4 | AA on all three |');
console.log('|---|---:|---:|---:|---|');
const DEEP='#014545';
const [dh,ds,dl]=hex2hsl(DEEP);
const cands = ['#3F6664','#3C6260','#3A5F5D','#375A58','#345553','#325150','#2F4C4B','#2C4746','#294241'];
for (const c of cands) {
  const a=ratio(c,'#FFFFFF'), b=ratio(c,'#FAF6EA'), d=ratio(c,'#FDF0B4');
  const ok = a>=4.5 && b>=4.5 && d>=4.5;
  console.log(`| \`${c}\` | ${a.toFixed(2)}:1 | ${b.toFixed(2)}:1 | ${d.toFixed(2)}:1 | ${ok?'✅':'❌'} |`);
}

console.log('\n## The brief\'s hard constraints, verified\n');
console.log('| pair | ratio | verdict |');
console.log('|---|---:|---|');
const checks = [
  ['#F58521','#FFFFFF','sunset as text on paper'],
  ['#F58521','#FAF6EA','sunset as text on cream'],
  ['#0EB6B8','#FFFFFF','river as text on paper'],
  ['#000000','#F58521','black on sunset (CTA)'],
  ['#FFFFFF','#F58521','white on sunset'],
  ['#000000','#0EB6B8','black on river'],
  ['#FFFFFF','#0EB6B8','white on river'],
  ['#014545','#FFFFFF','deep as text on paper'],
  ['#014545','#FAF6EA','deep as text on cream'],
  ['#014545','#FDF0B4','deep as text on cream-deep'],
  ['#A62000','#FFFFFF','terra (headline accent) on paper'],
  ['#A62000','#FAF6EA','terra on cream'],
  ['#FFFFFF','#014545','paper on deep'],
  ['#FDF0B4','#014545','cream-deep on deep'],
  ['#F58521','#014545','sunset (headline accent) on deep'],
  ['#0A1F1E','#FFFFFF','current ink on pure white'],
  ['#0A1F1E','#FAF6EA','current ink on proposed cream'],
];
for (const [f,b,u] of checks) console.log(`| ${u} — \`${f}\` / \`${b}\` | **${ratio(f,b).toFixed(2)}:1** | ${ratio(f,b)>=4.5?'AA body':(ratio(f,b)>=3?'large text / UI only':'FAILS everything')} |`);
