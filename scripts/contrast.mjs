const P={sunset:'#F58521',river:'#0EB6B8',cream:'#FDF0B4',mint:'#C4F2EC',deep:'#014545',
teal600:'#028382',tomato:'#EB452C',terra:'#A62000',plum:'#402639',magenta:'#A24584',
ink:'#000000',paper:'#FFFFFF',body:'#0A0A0A',ink45:'#8C8C8C'};
const hx=h=>{h=h.replace('#','');return[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)/255)};
const ln=c=>c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);
const L=h=>{const[r,g,b]=hx(h).map(ln);return 0.2126*r+0.7152*g+0.0722*b};
const R=(a,b)=>{const x=L(P[a]||a),y=L(P[b]||b);return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05)};
// [fg, bg, uso, tipo]  tipo: body(4.5) | large(3) | ui(3)
const PAIRS=[
 ['body','paper','Cuerpo de texto — el 92% del sitio','body'],
 ['ink','paper','Títulos, nav, todo encabezado','body'],
 ['ink','sunset','Texto del CTA primario','body'],
 ['ink','river','Texto sobre relleno teal','body'],
 ['ink','cream','Texto sobre la superficie crema','body'],
 ['ink','mint','Texto sobre mint','body'],
 ['deep','paper','Eyebrow y texto de color sobre blanco','body'],
 ['plum','paper','Texto de color alternativo','body'],
 ['terra','paper','Alertas y precios destacados','body'],
 ['magenta','paper','Acento editorial','body'],
 ['teal600','paper','Texto de color sobre BLANCO','body'],
 ['deep','cream','Eyebrow sobre crema','body'],
 ['plum','cream','Texto de color sobre crema','body'],
 ['terra','cream','Acento sobre crema','body'],
 ['magenta','cream','Acento sobre crema','body'],
 ['teal600','cream','⚠️ PROHIBIDO — no llega a AA','body'],
 ['paper','deep','Texto sobre la superficie oscura','body'],
 ['cream','deep','Texto y eyebrow sobre oscuro','body'],
 ['mint','deep','Detalle sobre oscuro','body'],
 ['sunset','deep','Acento GRANDE sobre oscuro','large'],
 ['river','deep','Acento GRANDE sobre oscuro','large'],
 ['ink','paper','Anillo de foco sobre blanco','ui'],
 ['ink','sunset','Anillo de foco sobre el CTA','ui'],
 ['cream','deep','Anillo de foco sobre oscuro','ui'],
 ['ink45','paper','Subrayado de link en REPOSO (identifica el link)','ui'],
 ['sunset','paper','Subrayado en HOVER — redundante con el grosor','deco'],
];
const need=t=>t==='body'?4.5:(t==='deco'?0:3);
const rows=PAIRS.map(([f,b,u,t])=>{const r=R(f,b);return{f,b,u,t,r,pass:r>=need(t)}});
console.log('| Par | Uso | Ratio | Mínimo | Estado |');
console.log('|---|---|---:|---:|---|');
for(const x of rows){
  const min=x.t==='deco'?'n/a':need(x.t)+':1';
  const st=x.t==='deco'?'✅ exento — decorativo':(x.pass?(x.t==='body'&&x.r>=7?'✅ AAA':'✅ AA'):'❌ FALLA');
  console.log(`| \`${x.f}\` sobre \`${x.b}\` | ${x.u} | **${x.r.toFixed(2)}:1** | ${min} | ${st} |`);
}
const bad=rows.filter(x=>!x.pass);
console.error('\nPares que NO pasan: '+bad.length);
bad.forEach(x=>console.error('  '+x.f+' / '+x.b+' = '+x.r.toFixed(2)+'  ('+x.u+')'));
