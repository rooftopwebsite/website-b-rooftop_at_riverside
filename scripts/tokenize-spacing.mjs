/**
 * Convierte utilidades de espaciado con valor arbitrario a la escala de Tailwind.
 *
 *   node scripts/tokenize-spacing.mjs --dry     lista lo que haría
 *   node scripts/tokenize-spacing.mjs           lo aplica
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ QUÉ CONVIERTE Y QUÉ NO, que es lo único importante de este archivo.
 *
 * La escala de Tailwind tiene base 4px (`--spacing: 0.25rem`), así que
 * `p-[24px]` y `p-6` producen EXACTAMENTE el mismo CSS: `padding: calc(var
 * (--spacing) * 6)` = 24px. La conversión es un cambio de notación, no de
 * diseño, y por eso se puede hacer a máquina.
 *
 * CONVIERTE sólo si:
 *   · la utilidad es de espaciado o de medida (`p`, `m`, `gap`, `w`, `h`,
 *     `top`, `inset`, …),
 *   · el valor está en **px**,
 *   · y es un número entero de píxeles.
 *
 * El paso puede ser fraccionario: `gap-[10px]` → `gap-2.5`. Ver la nota en el
 * cuerpo sobre por qué eso funciona en v4 y cómo se verificó.
 *
 * NO CONVIERTE, y cada exclusión tiene su motivo:
 *   · **`text-`, `leading-`, `tracking-`** — son tipografía. Su escala es
 *     semántica (`text-lead`, `text-h2`) y mapearlos por número sería perder
 *     la intención. Se revisan aparte.
 *   · **`max-w-[60ch]`, `w-[46%]`, `h-[100svh]`, `w-[16.5vw]`** — unidades
 *     relativas. No hay escala que las cubra.
 *   · **`rounded-`, `z-`, `aspect-`, `duration-`, `blur-`** — otras escalas.
 *   · **`AgencyBar.tsx`** — el archivo lleva escrito el pedido de que NO siga
 *     los tokens del sitio, porque tiene que verse igual en todos los
 *     proyectos de la casa. Está excluido explícitamente.
 *
 * ⚠️ VERIFICACIÓN OBLIGATORIA: después de correr esto, las capturas tienen que
 * ser IDÉNTICAS píxel a píxel. Si algo cambió, la conversión estuvo mal.
 * ══════════════════════════════════════════════════════════════════════════
 */
import { readFileSync, writeFileSync } from 'node:fs';

const DRY = process.argv.includes('--dry');

/** Prefijos de utilidad que aceptan la escala de espaciado. */
const PREFIJOS = [
  'p', 'px', 'py', 'pt', 'pb', 'pl', 'pr', 'ps', 'pe',
  'm', 'mx', 'my', 'mt', 'mb', 'ml', 'mr', 'ms', 'me',
  'gap', 'gap-x', 'gap-y',
  'space-x', 'space-y',
  'w', 'h', 'size', 'min-w', 'min-h',
  'top', 'right', 'bottom', 'left', 'inset', 'inset-x', 'inset-y',
  'translate-x', 'translate-y',
];

/** Los archivos del alcance acordado: la home y los componentes globales. */
const ARCHIVOS = [
  'src/app/page.tsx',
  'src/components/sections/Hero.tsx',
  'src/components/sections/WhatsOn.tsx',
  'src/components/sections/HomeSections.tsx',
  'src/components/sections/ThreeDoors.tsx',
  'src/components/sections/EventsBanner.tsx',
  'src/components/sections/FindUs.tsx',
  'src/components/shared/Header.tsx',
  'src/components/shared/Footer.tsx',
  'src/components/shared/Button.tsx',
  'src/components/shared/Card.tsx',
  'src/components/shared/Section.tsx',
  'src/components/shared/Type.tsx',
  'src/components/shared/StepStair.tsx',
  'src/components/shared/CardArc.tsx',
  'src/components/shared/VideoWall.tsx',
  'src/components/shared/Social.tsx',
  'src/components/shared/PendingData.tsx',
  'src/components/shared/HorizonBorder.tsx',
];

const grupo = `(?:${PREFIJOS.map((p) => p.replace('-', '\\-')).join('|')})`;
/*
 * `-?` captura los negativos: `-mx-[16px]` → `-mx-4`.
 *
 * ⚠️ Y `(?:[a-z][a-z0-9-]*:)*` captura los PREFIJOS DE VARIANTE. Sin eso la
 * primera pasada se salteó todo lo que tuviera `desk:`, `lg:`, `sm:` o `md:`
 * adelante —27 utilidades— porque el patrón exigía que la clase empezara justo
 * después de un espacio o una comilla, y ahí el carácter anterior es `:`.
 *
 * Se descubrió contando lo que quedaba: los 27 restantes eran todos
 * convertibles, así que el filtro no era el criterio sino el patrón.
 */
const RE = new RegExp(
  `(^|[\\s"'\`])((?:[a-z][a-z0-9-]*:)*)(-?)(${grupo})-\\[(\\d+)px\\]`,
  'g',
);

let convertidos = 0;
let salteados = new Map();

for (const archivo of ARCHIVOS) {
  let s;
  try {
    s = readFileSync(archivo, 'utf8');
  } catch {
    console.error(`  ✗ no existe: ${archivo}`);
    continue;
  }

  const antes = s;
  const cambios = [];

  s = s.replace(RE, (todo, pre, variantes, neg, util, px) => {
    const n = Number(px);
    /*
     * ⚠️ ACEPTA CUARTOS DE PASO, no sólo múltiplos de 4px.
     *
     * Tailwind v4 no tiene una lista fija de escalones: la escala es un
     * MULTIPLICADOR sobre `--spacing` (0.25rem). O sea que `gap-2.5` emite
     * `calc(var(--spacing) * 2.5)` = 10px, y `p-2.25` = 9px. Cualquier valor
     * con paso de 1px es expresable como `n/4`.
     *
     * Eso convierte los 87 valores que la primera pasada había dejado afuera
     * —10px, 9px, 22px, 26px, 38px…— sin cambiar un solo píxel.
     *
     * ⚠️ Verificado EMPÍRICAMENTE y no leyendo la doc: si la clase no se
     * emitiera, el espaciado colapsaría a 0 y la comparación píxel a píxel
     * contra la captura anterior lo mostraría de inmediato. Es la única forma
     * de estar seguro con un motor que genera utilidades on demand.
     */
    if (n % 1 !== 0) {
      const clave = `${util}-[${px}px]`;
      salteados.set(clave, (salteados.get(clave) ?? 0) + 1);
      return todo;
    }
    const paso = n / 4;
    cambios.push(`${variantes}${neg}${util}-[${px}px] → ${variantes}${neg}${util}-${paso}`);
    return `${pre}${variantes}${neg}${util}-${paso}`;
  });

  if (cambios.length) {
    convertidos += cambios.length;
    console.log(`\n${archivo}  (${cambios.length})`);
    for (const c of cambios) console.log(`    ${c}`);
    if (!DRY && s !== antes) writeFileSync(archivo, s);
  }
}

console.log(`\n${'─'.repeat(70)}`);
console.log(`${DRY ? 'SE CONVERTIRÍAN' : 'CONVERTIDOS'}: ${convertidos}`);

if (salteados.size) {
  const total = [...salteados.values()].reduce((a, b) => a + b, 0);
  console.log(`\nSALTEADOS por no ser múltiplo de 1px: ${total} en ${salteados.size} valores distintos`);
  console.log('Hay que mirarlos a mano: o tienen motivo geométrico, o hay que redondearlos.');
  for (const [k, v] of [...salteados].sort((a, b) => b[1] - a[1])) {
    console.log(`    ${String(v).padStart(3)}×  ${k}`);
  }
}

if (!DRY) {
  console.log('\n⚠️ AHORA VERIFICÁ QUE LAS CAPTURAS SEAN IDÉNTICAS PÍXEL A PÍXEL.');
  console.log('   La conversión es un cambio de notación: si algo se movió, está mal.');
}
