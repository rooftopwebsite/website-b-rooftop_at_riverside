/**
 * Guard de sincronía entre las dos declaraciones de la paleta.
 *
 *   npm run check:tokens
 *
 * ⚠️ POR QUÉ EXISTE. La paleta está escrita en dos lados y tiene que estarlo:
 *
 *   · `src/app/globals.css`, bloque `@theme` → es lo que RENDERIZA. Tailwind v4
 *     es CSS-first, no hay `tailwind.config.ts` y no se puede importar un `.ts`
 *     dentro de `@theme`.
 *   · `src/lib/brand.ts`, objeto `COLORS` → es lo que se puede LEER desde
 *     TypeScript y desde los scripts, y donde viven las reglas de uso.
 *
 * Sin un guard, las dos copias se separan sin que nada avise. Ya pasó: durante
 * meses `brand.ts` declaró `paper: '#FFFFFF'` e `ink: '#000000'` mientras el
 * sitio pintaba `#FDFCF7` y `#0A1F1E`. `scripts/contrast.mjs` leía la copia
 * vieja, así que la auditoría de contraste entera estaba calculada contra
 * colores que el sitio no usaba y los ratios documentados no eran los reales.
 * Nadie lo notó porque el build pasaba.
 *
 * Este script compara token por token y falla con el detalle de la diferencia.
 */
import { readFileSync } from 'node:fs';

const raiz = new URL('../', import.meta.url);
const CSS = readFileSync(new URL('src/app/globals.css', raiz), 'utf8');
const TS = readFileSync(new URL('src/lib/brand.ts', raiz), 'utf8');

/** Los `--color-*: #hex;` del CSS. Los que son `var(...)` son alias y se saltean. */
function paletaCss() {
  const p = new Map();
  const alias = new Set();
  for (const m of CSS.matchAll(/--color-([a-z0-9-]+):\s*([^;]+);/g)) {
    const [, nombre, valor] = m;
    const v = valor.trim();
    if (v.startsWith('var(')) alias.add(nombre);
    else if (/^#[0-9a-fA-F]{3,8}$/.test(v)) p.set(nombre, v.toUpperCase());
  }
  return { paleta: p, alias };
}

/** El objeto `COLORS` de brand.ts. Acepta clave con y sin comillas. */
function paletaTs() {
  const bloque = TS.match(/export const COLORS = \{([\s\S]*?)\n\} as const;/);
  if (!bloque) throw new Error('no se encontró `export const COLORS` en src/lib/brand.ts');
  const p = new Map();
  for (const m of bloque[1].matchAll(/^\s*'?([a-zA-Z0-9-]+)'?:\s*'(#[0-9a-fA-F]{3,8})'/gm)) {
    p.set(m[1], m[2].toUpperCase());
  }
  return p;
}

const { paleta: css, alias } = paletaCss();
const ts = paletaTs();

const problemas = [];

for (const [nombre, valor] of ts) {
  if (alias.has(nombre)) continue;
  if (!css.has(nombre)) {
    problemas.push(`· \`${nombre}\` está en brand.ts (${valor}) y NO en el @theme de globals.css`);
  } else if (css.get(nombre) !== valor) {
    problemas.push(
      `· \`${nombre}\` DIVERGE — globals.css pinta ${css.get(nombre)}, brand.ts declara ${valor}`,
    );
  }
}

/* Al revés sólo se avisa: el @theme puede tener tokens que TypeScript no
   necesite ver, y forzar la simetría total sería ruido. */
const soloCss = [...css.keys()].filter((n) => !ts.has(n) && !alias.has(n));

console.log(`check:tokens — ${css.size} colores en globals.css, ${ts.size} en brand.ts`);
if (alias.size) console.log(`  alias (se saltean): ${[...alias].join(', ')}`);
if (soloCss.length) console.log(`  ⓘ sólo en globals.css, sin espejo en brand.ts: ${soloCss.join(', ')}`);

if (problemas.length) {
  console.error(`\n❌ ${problemas.length} problema(s) de sincronía:\n${problemas.join('\n')}`);
  console.error('\nArreglalo en `src/lib/brand.ts` para que espeje `globals.css`, que es lo que renderiza.');
  process.exit(1);
}

console.log('✅ las dos declaraciones coinciden');
