/**
 * Genera `design-audit/CONTRASTE.md` con los ratios WCAG 2.1 de cada par en uso.
 *
 *   node scripts/contrast.mjs          → escribe CONTRASTE.md
 *   node scripts/contrast.mjs --check  → sólo falla si algún par no pasa
 *
 * ⚠️ LA PALETA SE LEE DE `src/app/globals.css`, no está escrita acá.
 *
 * Es la corrección de un problema real que encontró la auditoría: la paleta de
 * `scripts/contrast.mjs` estaba copiada a mano, quedó vieja cuando el `@theme`
 * cambió, y por eso TODOS los ratios de `docs/contrast-audit.md` estaban
 * calculados contra colores que el sitio no pintaba. Un script que lee la
 * fuente no puede desincronizarse.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const CSS = readFileSync(new URL('../src/app/globals.css', import.meta.url), 'utf8');

/** Extrae los `--color-*` del bloque @theme. */
function leerPaleta() {
  const p = {};
  for (const m of CSS.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{3,8})\s*;/g)) {
    p[m[1]] = m[2].toUpperCase();
  }
  if (Object.keys(p).length === 0) throw new Error('no se encontró ningún --color-* en globals.css');
  return p;
}

const P = leerPaleta();

const hx = (h) => {
  h = h.replace('#', '');
  if (h.length === 3) h = [...h].map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
};
const lin = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const L = (h) => {
  const [r, g, b] = hx(h).map(lin);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const hex = (n) => P[n] ?? (n.startsWith('#') ? n.toUpperCase() : null);
function ratio(a, b) {
  const ha = hex(a), hb = hex(b);
  if (!ha) throw new Error(`token desconocido: ${a}`);
  if (!hb) throw new Error(`token desconocido: ${b}`);
  const x = L(ha), y = L(hb);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

/**
 * Los pares REALMENTE EN USO en la home rediseñada.
 * tipo: body (≥4.5) · large (≥3, texto ≥24px o ≥19px bold) · ui (≥3) · deco (exento)
 */
const PARES = [
  ['— Texto sobre las dos superficies claras —'],
  ['ink', 'paper', 'Títulos y cuerpo sobre la base', 'body'],
  ['ink', 'bone', 'Títulos y cuerpo sobre la segunda superficie', 'body'],
  ['body', 'paper', 'Cuerpo — mismo valor que `ink`, token separado', 'body'],
  ['muted', 'paper', '**La bajada** y el texto secundario', 'body'],
  ['muted', 'bone', 'La bajada sobre la segunda superficie', 'body'],
  ['muted', 'cream', 'La bajada sobre una píldora amarilla', 'body'],

  ['— Texto sobre la banda oscura —'],
  ['paper', 'deep', 'Títulos y cuerpo sobre la banda de Events y el footer', 'body'],
  ['muted-dark', 'deep', '**La bajada** sobre oscuro — el par que encontró `npm run a11y`', 'body'],
  ['cream', 'deep', 'Eyebrow y detalle sobre oscuro', 'body'],
  ['paper', 'deeper', 'Texto del header', 'body'],
  ['muted', 'deep', '❌ `muted` sobre oscuro — el bug que hubo que arreglar', 'body'],

  ['— Rellenos de marca: el texto encima va NEGRO —'],
  ['#000000', 'sunset', 'Texto del CTA primario', 'body'],
  ['#000000', 'river', 'Texto sobre relleno teal', 'body'],
  ['#000000', 'cream', 'Texto sobre la píldora amarilla', 'body'],
  ['deep', 'cream', 'Texto sobre botón crema (el CTA sobre oscuro)', 'body'],

  ['— El acento del titular, a dos colores según superficie —'],
  ['sunset-deep', 'paper', 'Acento sobre claro — sólo display, NO cuerpo', 'large'],
  ['sunset-deep', 'bone', 'Acento sobre la segunda superficie — sólo display', 'large'],
  ['sunset', 'deep', 'Acento sobre oscuro — sólo display, NO cuerpo', 'large'],

  ['— El rojo de error y de dato pendiente sobre claro —'],
  ['terra', 'paper', 'Error de formulario y marcador de pendiente', 'body'],
  ['terra', 'bone', 'Lo mismo sobre la segunda superficie', 'body'],

  ['— Eyebrows: sólo los tonos que pasan —'],
  ['deep', 'paper', 'Eyebrow y texto de color sobre claro', 'body'],
  ['deep', 'bone', 'Eyebrow sobre la segunda superficie', 'body'],
  ['plum', 'paper', 'Eyebrow alternativo', 'body'],
  ['plum', 'bone', 'Eyebrow alternativo', 'body'],
  ['magenta', 'paper', 'Eyebrow editorial', 'body'],
  ['magenta', 'bone', 'Eyebrow editorial', 'body'],

  ['— Anillo de foco (WCAG 1.4.11, 3:1) —'],
  ['ink', 'paper', 'Anillo sobre claro', 'ui'],
  ['ink', 'sunset', 'Anillo sobre el CTA naranja', 'ui'],
  ['cream', 'deep', 'Anillo sobre oscuro', 'ui'],

  ['— Filetes de 1px: decorativos, no son controles —'],
  ['fog', 'paper', 'El filete que reemplaza a las tarjetas', 'deco'],
  ['fog', 'bone', 'ídem sobre la segunda superficie', 'deco'],

  ['— PROHIBIDOS, medidos para que quede escrito por qué —'],
  ['sunset', 'paper', '❌ naranja como TEXTO sobre claro', 'body'],
  ['sunset', 'bone', '❌ ídem sobre la segunda superficie', 'body'],
  ['river', 'paper', '❌ teal medio como TEXTO sobre claro', 'body'],
  ['paper', 'sunset', '❌ blanco sobre el CTA naranja', 'body'],
  ['paper', 'river', '❌ blanco sobre relleno teal', 'body'],
  ['teal600', 'cream', '❌ teal600 sobre amarillo — el caso histórico', 'body'],
];

const minimo = (t) => (t === 'body' ? 4.5 : t === 'deco' ? 0 : 3);

const filas = [];
let fallas = 0;
for (const par of PARES) {
  if (par.length === 1) {
    filas.push({ seccion: par[0] });
    continue;
  }
  const [f, b, uso, tipo] = par;
  const r = ratio(f, b);
  const pasa = r >= minimo(tipo);
  const prohibido = uso.startsWith('❌');
  /* Un par prohibido que NO pasa es lo esperado: no cuenta como falla. */
  if (!pasa && !prohibido && tipo !== 'deco') fallas++;
  filas.push({ f, b, uso, tipo, r, pasa, prohibido });
}

const nombre = (n) => (n.startsWith('#') ? `\`${n}\`` : `\`${n}\``);
const valor = (n) => hex(n);

let md = `# Contraste medido — \`redesign/light-tropical\`

Generado por \`node scripts/contrast.mjs\`. **La paleta se lee de
\`src/app/globals.css\`**, no está escrita en el script: es la corrección del
problema que encontró la auditoría, donde \`scripts/contrast.mjs\` tenía la
paleta copiada a mano y había quedado vieja, así que todos los ratios
documentados estaban calculados contra colores que el sitio no pintaba.

Método: luminancia relativa WCAG 2.1. Mínimos: **4.5:1** para cuerpo,
**3:1** para texto grande (≥24px, o ≥19px en negrita) y para componentes de
interfaz no textuales (WCAG 1.4.11). Un filete decorativo no es un componente
de interfaz y no tiene mínimo.

## La paleta que se midió

| token | hex |
|---|---|
${Object.entries(P)
  .map(([k, v]) => `| \`${k}\` | \`${v}\` |`)
  .join('\n')}

## Los pares

| Par | Uso | Ratio | Mínimo | Estado |
|---|---|---:|---:|---|
`;

for (const x of filas) {
  if (x.seccion) {
    md += `| **${x.seccion}** | | | | |\n`;
    continue;
  }
  const min = x.tipo === 'deco' ? '—' : `${minimo(x.tipo)}:1`;
  let estado;
  if (x.prohibido) estado = x.pasa ? '⚠️ pasa pero está prohibido por otra razón' : '🚫 **prohibido, y por esto**';
  else if (x.tipo === 'deco') estado = '➖ exento — decorativo';
  else if (!x.pasa) estado = '❌ **FALLA**';
  else if (x.tipo === 'body' && x.r >= 7) estado = '✅ AAA';
  else estado = '✅ AA';
  md += `| ${nombre(x.f)} \`${valor(x.f)}\` sobre ${nombre(x.b)} \`${valor(x.b)}\` | ${x.uso} | **${x.r.toFixed(2)}:1** | ${min} | ${estado} |\n`;
}

md += `
## Las reglas duras que salen de la tabla

1. **El naranja y el teal medio no son colores de texto sobre claro.** Dan
   ${ratio('sunset', 'paper').toFixed(2)}:1 y ${ratio('river', 'paper').toFixed(2)}:1 sobre la base, y sobre la segunda superficie
   todavía menos (${ratio('sunset', 'bone').toFixed(2)}:1). No pasan ni el mínimo de texto grande, en
   ningún tamaño. Por eso el acento del titular es **a dos colores según la
   superficie**: \`sunset-deep\` sobre claro, \`sunset\` sobre oscuro. Los dos
   son el MISMO tono (28.3°) y la misma saturación; entre ellos sólo cambia la
   luminosidad, y por eso el acento se lee naranja en las dos superficies.
2. **Sobre relleno naranja o teal, el texto va negro.** El blanco da
   ${ratio('paper', 'sunset').toFixed(2)}:1 y ${ratio('paper', 'river').toFixed(2)}:1; el negro da ${ratio('#000000', 'sunset').toFixed(2)}:1 y ${ratio('#000000', 'river').toFixed(2)}:1.
3. **El acento del titular es sólo para display, de los dos lados.** \`sunset\`
   sobre \`deep\` da ${ratio('sunset', 'deep').toFixed(2)}:1, y \`sunset-deep\` sobre \`paper\` da
   ${ratio('sunset-deep', 'paper').toFixed(2)}:1 (sobre \`bone\`, ${ratio('sunset-deep', 'bone').toFixed(2)}:1). Los dos pasan el 3:1 de
   texto grande y ninguno el 4.5:1 de cuerpo: sirven para una palabra de un
   titular de 88px, no para una bajada. El rojo \`terra\` —${ratio('terra', 'paper').toFixed(2)}:1— es el
   que sí puede ir en cuerpo, y es el de los errores de formulario.
4. **La bajada tiene un token opaco y no una opacidad.** \`muted\`
   \`${P.muted}\` pasa AA en las tres superficies claras
   (${ratio('muted', 'paper').toFixed(2)}:1 · ${ratio('muted', 'bone').toFixed(2)}:1 · ${ratio('muted', 'cream').toFixed(2)}:1). Con \`text-body/75\` el color
   resultante cambiaba según lo que hubiera detrás, así que no se podía medir.
5. **El anillo de foco se invierte sobre oscuro.** \`ink\` sobre \`deep\` sería
   ${ratio('ink', 'deep').toFixed(2)}:1 — invisible. La regla \`.on-dark\` de globals.css lo pasa a
   \`cream\`, que da ${ratio('cream', 'deep').toFixed(2)}:1.

## Colores compuestos — lo que esta tabla NO puede prever

Un color translúcido sobre otro translúcido sobre una foto no se puede resolver
acá: sólo se ve midiendo el píxel renderizado. El caso conocido es el rótulo
\`video\` del muro del hero, que es \`paper\` translúcido sobre un relleno
translúcido. **Se verifica con \`npm run a11y\` sobre la página servida**, no en
esta tabla.

Con la dirección clara ese rótulo pasa a ser \`muted\` opaco sobre \`paper\`
opaco, o sea ${ratio('muted', 'paper').toFixed(2)}:1 medible acá — que es una de las razones por las que
conviene que el muro deje de apoyarse en opacidades.
`;

if (process.argv.includes('--check')) {
  console.log(fallas === 0 ? '✅ todos los pares en uso pasan su mínimo' : `❌ ${fallas} par(es) por debajo del mínimo`);
  process.exit(fallas === 0 ? 0 : 1);
}

writeFileSync(new URL('../design-audit/CONTRASTE.md', import.meta.url), md);
console.log(`CONTRASTE.md escrito · ${Object.keys(P).length} tokens leídos de globals.css · ${filas.filter((f) => !f.seccion).length} pares medidos`);
console.log(fallas === 0 ? '✅ todos los pares en uso pasan su mínimo' : `❌ ${fallas} par(es) por debajo del mínimo`);
