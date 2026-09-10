/**
 * Colapsa los `letter-spacing` con valor arbitrario a los tres tokens de rol.
 *
 *   node scripts/tokenize-tracking.mjs --dry
 *   node scripts/tokenize-tracking.mjs
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ En la home y los globales había SIETE valores escritos con corchetes
 * —0.01, 0.02, 0.06, 0.08, 0.1, 0.12 y 0.14em— para lo que son TRES roles.
 * Siete valores dentro de un rango de 0.13em no es una escala: es cada bloque
 * eligiendo por su cuenta.
 *
 *     eyebrow  0.12em   versalitas chicas, 12-13px   ← 0.14 y 0.1 caen acá
 *     label    0.08em   versalitas medianas, 15-16px
 *     cta      0.06em   botones
 *
 * A menor cuerpo, más aire: la misma lógica óptica que tenía la escala de
 * display, con tres escalones en vez de ocho.
 *
 * ⚠️ 0.01em y 0.02em SE BORRAN en lugar de tokenizarse. Estaban sobre texto en
 * caja MIXTA —el título de card y las etiquetas de la escalera—, donde el
 * tracking abierto no aporta nada: a 0.01em sobre 20px son 0,2px por letra. El
 * valor honesto ahí es `normal`.
 *
 * ⚠️ Cambia el ancho del texto, así que después hay que verificar que nada
 * reflowee — en particular el nav del header, que es lo más apretado del sitio.
 * ══════════════════════════════════════════════════════════════════════════
 */
import { readFileSync, writeFileSync } from 'node:fs';

const DRY = process.argv.includes('--dry');

const MAPA = {
  '0.14em': 'tracking-eyebrow',
  '0.12em': 'tracking-eyebrow',
  '0.1em': 'tracking-eyebrow',
  '0.08em': 'tracking-label',
  '0.06em': 'tracking-cta',
};

const BORRAR = ['0.02em', '0.01em'];

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

/**
 * ⚠️ Se usa `split`/`join` con la cadena LITERAL en lugar de una expresión
 * regular, y a propósito: el valor trae un punto y corchetes, o sea tres
 * caracteres que hay que escapar. Con `split` no hay nada que escapar y no hay
 * forma de equivocarse — que es exactamente lo que pasó en el primer intento,
 * donde el `[0.06em]` escapado a medias se interpretó como una clase de
 * caracteres y no matcheó nada.
 */
let convertidos = 0;
let borrados = 0;

for (const archivo of ARCHIVOS) {
  let s;
  try {
    s = readFileSync(archivo, 'utf8');
  } catch {
    continue;
  }
  const antes = s;
  const cambios = [];

  /* Primero los que se borran: si no, `0.02em` podría quedar mapeado. */
  for (const v of BORRAR) {
    const conEspacio = ` tracking-[${v}]`;
    const n = s.split(conEspacio).length - 1;
    if (n) {
      s = s.split(conEspacio).join('');
      borrados += n;
      cambios.push(`${n}× tracking-[${v}] borrado (caja mixta)`);
    }
  }

  /* `0.12em` antes que `0.1em`: si `0.1em` fuera primero, no tocaría a
     `0.12em` porque el patrón incluye el corchete de cierre — pero el orden
     explícito deja la intención clara. */
  for (const v of ['0.14em', '0.12em', '0.1em', '0.08em', '0.06em']) {
    const literal = `tracking-[${v}]`;
    const n = s.split(literal).length - 1;
    if (n) {
      s = s.split(literal).join(MAPA[v]);
      convertidos += n;
      cambios.push(`${n}× ${literal} → ${MAPA[v]}`);
    }
  }

  if (cambios.length) {
    console.log(`\n${archivo}`);
    for (const c of cambios) console.log(`    ${c}`);
    if (!DRY && s !== antes) writeFileSync(archivo, s);
  }
}

console.log(`\n${'─'.repeat(70)}`);
console.log(`${DRY ? 'SE HARÍAN' : 'HECHOS'}: ${convertidos} a token · ${borrados} borrados`);
