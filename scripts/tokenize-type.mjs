/**
 * Convierte los tamaños de texto e interlíneas con valor arbitrario a tokens.
 *
 *   node scripts/tokenize-type.mjs --dry
 *   node scripts/tokenize-type.mjs
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ESTO NO ES SÓLO NOTACIÓN, y por eso va en un script separado del de
 * espaciado.
 *
 * `p-[24px]` → `p-6` es el mismo píxel con otro nombre. Acá hay REDONDEOS: en
 * la home y los globales había nueve tamaños de texto chico escritos a mano
 * —11, 12, 13, 14, 15, 16, 17, 20, 24px— y se colapsan a cuatro tokens. Cinco
 * de esos nueve se mueven un píxel.
 *
 * Los redondeos y por qué son seguros:
 *
 *     17px → base    (16px)  −1px · los datos de contacto de FindUs, en
 *                              `ink` sobre `paper` (17.11:1), sobran
 *     16px → base    (16px)   =
 *     15px → dato    (15px)   =
 *     14px → dato    (15px)  +1px · hacia arriba: menos contraste requerido
 *     13px → micro   (13px)   =
 *     12px → caption (12px)   =
 *     11px → caption (12px)  +1px · hacia arriba
 *
 * ⚠️ 20px y 24px NO se tocan: son el título de card de `Type.tsx`
 * (`FUERA_DE_DISPLAY`), que ya es un escalón declarado del sistema y vive en
 * un solo lugar.
 *
 * ⚠️ LAS INTERLÍNEAS SE BORRAN, no se convierten. Cada token de tamaño lleva
 * su `--text-*--line-height`, así que un `leading-[1.6]` al lado de
 * `text-base` está repitiendo lo que el token ya dice — y peor: si mañana
 * cambia la interlínea del token, ese `leading` suelto la ignora. Sólo se
 * borra cuando coincide con la del token; si difiere, se deja y hay que
 * mirarla.
 *
 * ⚠️ Después de correr esto, la comparación píxel a píxel va a mostrar
 * diferencias REALES en los cinco lugares que se movieron un píxel. Eso es lo
 * esperado. Lo que no puede pasar es que se mueva algo más.
 * ══════════════════════════════════════════════════════════════════════════
 */
import { readFileSync, writeFileSync } from 'node:fs';

const DRY = process.argv.includes('--dry');

/** px del corchete → token. */
const TAMANOS = {
  17: 'base',
  16: 'base',
  15: 'dato',
  14: 'dato',
  13: 'micro',
  12: 'caption',
  11: 'caption',
};

/** La interlínea que ya trae cada token: un `leading-` con ese valor sobra. */
const LH_DEL_TOKEN = {
  base: ['1.6'],
  dato: ['1.5'],
  micro: ['1.45'],
  caption: ['1.45'],
  lead: ['1.55'],
};

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
  'src/components/shared/StepStair.tsx',
  'src/components/shared/Social.tsx',
  'src/components/shared/PendingData.tsx',
];

let tamanos = 0;
let interlineas = 0;
const quedan = new Map();

for (const archivo of ARCHIVOS) {
  let s;
  try {
    s = readFileSync(archivo, 'utf8');
  } catch {
    continue;
  }
  const antes = s;
  const cambios = [];

  /* 1 · Los tamaños. */
  s = s.replace(/text-\[(\d+)px\]/g, (todo, px) => {
    const token = TAMANOS[Number(px)];
    if (!token) {
      quedan.set(todo, (quedan.get(todo) ?? 0) + 1);
      return todo;
    }
    cambios.push(`${todo} → text-${token}`);
    tamanos += 1;
    return `text-${token}`;
  });

  /*
   * 2 · Las interlíneas redundantes.
   *
   * ⚠️ Se busca la utilidad de tamaño en la MISMA cadena de clases, no en el
   * archivo entero: `leading-[1.6]` sobra al lado de `text-base` y NO sobra al
   * lado de `text-h2`. La ventana es el atributo `className` completo.
   */
  s = s.replace(/className=(?:\{?)([`"'])((?:[^`"'\\]|\\.)*)\1/g, (todo, q, clases) => {
    const token = Object.keys(LH_DEL_TOKEN).find((t) =>
      new RegExp(`(?:^|\\s)text-${t}(?:\\s|$)`).test(clases),
    );
    if (!token) return todo;
    let nuevas = clases;
    for (const lh of LH_DEL_TOKEN[token]) {
      const re = new RegExp(`\\s*leading-\\[${lh.replace('.', '\\.')}\\]`, 'g');
      if (re.test(nuevas)) {
        nuevas = nuevas.replace(re, '');
        cambios.push(`leading-[${lh}] borrado (ya lo trae text-${token})`);
        interlineas += 1;
      }
    }
    return nuevas === clases ? todo : todo.replace(clases, nuevas);
  });

  if (cambios.length) {
    console.log(`\n${archivo}  (${cambios.length})`);
    for (const c of cambios) console.log(`    ${c}`);
    if (!DRY && s !== antes) writeFileSync(archivo, s);
  }
}

console.log(`\n${'─'.repeat(70)}`);
console.log(`${DRY ? 'SE HARÍAN' : 'HECHOS'}: ${tamanos} tamaños · ${interlineas} interlíneas borradas`);
if (quedan.size) {
  console.log('\nTamaños SIN token, quedan como corchete:');
  for (const [k, v] of [...quedan].sort((a, b) => b[1] - a[1])) console.log(`    ${v}×  ${k}`);
}
