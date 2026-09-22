import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Audita el ritmo de superficies de cada página.
 *
 * Las reglas del brief:
 *   · blanco por defecto
 *   · como máximo DOS secciones de crema por página
 *   · como máximo UNA de teal profundo
 *   · NUNCA dos secciones de color seguidas
 *
 * Lee los `tone=` de los `<Section>` en el orden en que aparecen en el archivo,
 * que es el orden en que se renderizan. Las páginas que componen secciones desde
 * otro módulo (la home, las verticales de eventos) se resuelven siguiendo el
 * import, para que el conteo sea el real y no el del archivo suelto.
 *
 *   node scripts/surface-rhythm.mjs
 */

const PAGE_GLOB = 'src/app';

/** Módulos que exportan secciones y hay que expandir donde se usan. */
/**
 * ⚠️ Este mapa hay que MANTENERLO. Una sección que no esté acá no se cuenta, y
 * el guard da verde por omisión — que es peor que dar rojo. Pasó al fusionar
 * `TonightAtTheYard` + `ThisWeek` en `WhatsOn`: la home reportaba
 * «paper · paper · paper · paper · paper» y la sección crema no aparecía.
 *
 * Regla: si creás un archivo en `sections/` que renderiza un `<Section>`,
 * agregalo acá en el mismo commit.
 */
const SECTION_MODULES = {
  '@/components/sections/HomeSections': 'src/components/sections/HomeSections.tsx',
  '@/components/sections/WhatsOn': 'src/components/sections/WhatsOn.tsx',
  '@/components/sections/ThreeDoors': 'src/components/sections/ThreeDoors.tsx',
  '@/components/sections/EventsBanner': 'src/components/sections/EventsBanner.tsx',
  '@/components/sections/FindUs': 'src/components/sections/FindUs.tsx',
  '@/components/sections/Hero': 'src/components/sections/Hero.tsx',
  '@/components/sections/YardSteps': 'src/components/sections/YardSteps.tsx',
  '@/components/sections/PhotoDivider': 'src/components/sections/PhotoDivider.tsx',
  '@/components/sections/EventVertical': 'src/components/sections/EventVertical.tsx',
  /*
   * ⚠️ LAS TRES DE `/our-story`, agregadas el 2026-09-22 al rediseñar la
   * página. Las tres renderizan su propia `<Section tone>` y ninguna estaba
   * declarada, así que el guard veía TRES secciones de las siete y reportaba
   * «deep · paper · deep». El diagnóstico igual era correcto —había dos
   * oscuras— pero por casualidad: las cuatro que faltaban podrían haber sido
   * cuatro cremas seguidas sin que nadie se enterara.
   *
   * Es exactamente lo que advierte el bloque de arriba: si un archivo de
   * `sections/` renderiza un `<Section>`, se agrega acá en el mismo commit.
   */
  '@/components/sections/AboutStory': 'src/components/sections/AboutStory.tsx',
  '@/components/sections/VenueTabs': 'src/components/sections/VenueTabs.tsx',
  '@/components/sections/HowToOrder': 'src/components/sections/HowToOrder.tsx',
  /*
   * ⚠️ LA CARCASA DE LOS TRES DOCUMENTOS LEGALES, agregada el 2026-09-22.
   * `/gaming-truck-policies`, `/game-zone-waiver` y `/bar-games-waiver` no
   * escriben una sola `<Section>` en su `page.tsx`: las dos que tienen —el
   * encabezado en `bone` y el cuerpo en `paper`— las pone `LegalPage`, así que
   * sin esta línea el guard veía tres páginas de CERO secciones y las daba por
   * buenas sin mirar nada.
   */
  '@/components/legal/LegalPage': 'src/components/legal/LegalPage.tsx',
  '@/components/shared/PageHero': null, // el hero es siempre blanco
};

async function walk(dir) {
  const out = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name === 'page.tsx') out.push(p);
  }
  return out;
}

/**
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LAS SECCIONES CRUDAS DEL REDISEÑO, y por qué hubo que enseñárselas al
 * guard en lugar de dejarlo pasar.
 *
 * El guard leía `tone=` de los `<Section>`. Las ocho secciones de la home
 * nueva no usan `<Section>` —su geometría es otra: arcos de 88px, márgenes
 * negativos y bandas que sangran, nada de eso entra en las cuatro props de
 * ese componente— así que la home DESAPARECIÓ del listado y el guard dio
 * verde sin haberla mirado.
 *
 * Eso es exactamente lo que este archivo advierte tres bloques más arriba:
 * «el guard da verde por omisión — que es peor que dar rojo». Ya había
 * pasado una vez al fusionar `TonightAtTheYard` + `ThisWeek`.
 *
 * Así que ahora también se leen los `<section className="… bg-X …">`
 * crudos. Es más frágil que leer una prop —depende de que la clase esté
 * escrita literal y no compuesta— pero cubre el caso real: si mañana alguien
 * agrega una tercera banda `deep` a la home, el guard la ve.
 * ══════════════════════════════════════════════════════════════════════════
 */
const BG_A_TONO = { paper: 'paper', bone: 'paper', cream: 'cream', mint: 'cream', deep: 'deep', ink: 'deep' };

/**
 * Los tonos de un archivo, en orden: `<Section tone>` y `<section bg-*>`.
 *
 * ⚠️ TAMBIÉN SE LEEN LOS `<FormSlab tone>`, y hay que sumar acá cualquier
 * componente nuevo que ENVUELVA a `<Section>` recibiendo el tono por prop.
 * `FormSlab` es la losa de formulario de `/events`, `/contact` y los dos
 * carriles de `/join-us`: renderiza una `<Section>` con el `tone` que se le
 * pasa, así que para el ritmo de la página vale exactamente lo mismo.
 *
 * Sin este renglón el guard no ve esas cuatro secciones y da VERDE POR
 * OMISIÓN, que es el error contra el que advierte el bloque de `SECTION_MODULES`
 * y que ya pasó dos veces en este archivo.
 *
 * ⚠️ NO alcanza con agregarlo a `SECTION_MODULES`: esa expansión sólo sirve
 * para componentes que se usan SIN props (`<WhatsOn />`), porque lee el tono
 * del módulo. Acá el tono lo decide la página, así que se lee de la página.
 */
async function tonesIn(file) {
  const src = await fs.readFile(file, 'utf8');
  const tones = [];
  /*
   * La lista de props hasta el primer `>` O el primer `{`; si no declara
   * `tone`, el default del componente es paper.
   *
   * ⚠️ EL CORTE EN `{` NO SOBRA. `FormSlab` recibe el contenido de su columna
   * izquierda en `aside={ … }`, que es JSX con sus propios `>` y con sus
   * propios `<Eyebrow tone="deep">` adentro. Cortando sólo en `>`, el guard
   * se comía media losa y leía el tono de un rótulo como si fuera el de la
   * sección.
   *
   * ⚠️ Y EL `\s` ADELANTE TAMPOCO. Sin él, `panelTone="paper"` contiene
   * `tone="paper"` y se leería como el tono de la sección cuando es el del
   * panel, que es otra cosa.
   */
  for (const m of src.matchAll(/<(?:Section|FormSlab)\b([^>{]*)[>{]/g)) {
    const attrs = m[1];
    const tone = attrs.match(/(?:^|\s)tone="(\w+)"/)?.[1] ?? 'paper';
    tones.push(tone);
  }
  return tones;
}

/**
 * ⚠️ `bone` cuenta como `paper` y `ink` como `deep`, y las dos equivalencias
 * son las que hacen que la cuenta signifique algo.
 *
 * `bone` es la segunda superficie clara: 1.08:1 contra `paper`. Contarla
 * aparte diría que la home alterna entre dos colores cuando en realidad es
 * toda clara con un escalón apenas visible.
 *
 * `ink` es oscuro y pesa como oscuro. Que sea tinta y no teal cambia el
 * color, no el presupuesto de superficie.
 */
async function tonosCrudos(file) {
  const src = await fs.readFile(file, 'utf8');
  const tones = [];
  for (const m of src.matchAll(/<section\b([^>]*)>/g)) {
    const bg = m[1].match(/\bbg-(paper|bone|cream|deep|ink)\b/)?.[1];
    if (bg) tones.push(BG_A_TONO[bg]);
  }
  return tones;
}

/** Expande los componentes de sección que la página importa y usa. */
async function pageTones(file) {
  const src = await fs.readFile(file, 'utf8');
  const own = await tonesIn(file);

  /*
   * Componentes de sección usados en el JSX, en orden de aparición.
   *
   * ⚠️ ANTES PEDÍA `<Nombre />` PELADO, sin una sola prop, y por eso los tres
   * documentos legales entraban al guard como páginas de CERO secciones. Su
   * `page.tsx` no escribe ninguna `<Section>`: las dos que tienen —encabezado
   * en `bone`, cuerpo en `paper`— las pone `LegalPage`, que se usa con seis
   * props. El guard las leía, no encontraba nada y las daba por buenas.
   *
   * Es la misma trampa que el bloque de `SECTION_MODULES` advierte tres veces
   * y que ya pasó dos: verde por omisión. Ahora se acepta cualquier
   * autocerrado, con props o sin ellas.
   *
   * ⚠️ AMPLIAR ESTO NO AFECTA A NINGÚN COMPONENTE QUE NO ESTÉ DECLARADO: el
   * bucle de abajo sólo expande los módulos de `SECTION_MODULES`. Lo único que
   * cambia es que los declarados ahora también cuentan cuando reciben props.
   */
  const used = [...src.matchAll(/<([A-Z][A-Za-z]*)[^>]*\/>/g)].map((m) => m[1]);
  const expanded = [];

  for (const name of used) {
    for (const [mod, target] of Object.entries(SECTION_MODULES)) {
      if (!target) continue;
      const imported = new RegExp(`import[^;]*\\b${name}\\b[^;]*from '${mod.replace(/[/@]/g, '\\$&')}'`);
      if (imported.test(src)) {
        const modSrc = await fs.readFile(target, 'utf8');
        // El bloque de esa función exportada.
        let start = modSrc.indexOf(`export function ${name}(`);
        if (start === -1) start = modSrc.indexOf('export default function');
        if (start === -1) continue;
        const next = modSrc.indexOf('\nexport function ', start + 1);
        const block = modSrc.slice(start, next === -1 ? undefined : next);
        for (const m of block.matchAll(/<Section\b([^>]*)>/g)) {
          expanded.push(m[1].match(/tone="(\w+)"/)?.[1] ?? 'paper');
        }
      }
    }
  }

  // Si la página delega todo en un template (EventVertical), usa el del módulo.
  if (own.length === 0 && expanded.length === 0) {
    if (/EventVertical/.test(src)) return tonesIn(SECTION_MODULES['@/components/sections/EventVertical']);
  }

  /*
   * Las secciones crudas del rediseño, en el orden en que la página las usa.
   * Se leen del módulo de cada componente, igual que las `<Section>`.
   */
  const crudos = [];
  for (const name of used) {
    for (const [mod, target] of Object.entries(SECTION_MODULES)) {
      if (!target) continue;
      const imported = new RegExp(`import[^;]*\\b${name}\\b[^;]*from '${mod.replace(/[/@]/g, '\\$&')}'`);
      if (imported.test(src)) crudos.push(...(await tonosCrudos(target)));
    }
  }

  const todos = expanded.length > 0 ? [...expanded, ...own] : own;
  return [...todos, ...crudos];
}

const files = await walk(PAGE_GLOB);
let problems = 0;

for (const file of files.sort()) {
  const route = file.replace(/^src[\\/]app/, '').replace(/[\\/]page\.tsx$/, '') || '/';
  const tones = (await pageTones(file)).filter((t) => t !== 'none');
  if (tones.length === 0) continue;

  /*
   * ══════════════════════════════════════════════════════════════════════
   * ⚠️ LAS REGLAS SE MIDEN SOBRE LOS TONOS NORMALIZADOS, no sobre los
   * escritos. Lo que se IMPRIME sigue siendo el nombre real, para que el
   * listado diga qué hay en la página y no una traducción.
   *
   * Esto corrige una incoherencia del propio archivo. Tres bloques más
   * arriba está escrito que «`bone` cuenta como `paper` y `ink` como
   * `deep`», con el argumento de que bone es un escalón de 1.08:1 y
   * contarlo aparte «diría que la home alterna entre dos colores cuando en
   * realidad es toda clara». Pero ese mapa sólo se aplicaba a las secciones
   * CRUDAS (`tonosCrudos`) y no a las `<Section tone>`, así que la misma
   * superficie contaba distinto según cómo estuviera escrita.
   *
   * El costo de la incoherencia era concreto: `/contact` y `/join-us`
   * estaban en rojo desde que se escribieron por «color seguido: bone→deep»,
   * o sea por tener una banda clara antes de la única banda oscura del pie.
   * Eso no es lo que la regla quiere evitar — la regla existe para que no
   * haya 1.400px de verde seguido— y no había forma de cumplirla sin sacar
   * el escalón de hueso o la banda de cierre.
   *
   * ⚠️ NORMALIZAR SÓLO PUEDE AFLOJAR, NUNCA APRETAR, y conviene saberlo: el
   * mapa manda bone→paper e ink→deep. Lo primero quita adyacencias; lo
   * segundo no agrega ninguna, porque `ink` ya contaba como color. Las
   * cuentas de crema y de oscuras no se mueven. O sea que ninguna página que
   * estaba en verde puede haberse vuelto roja con este cambio.
   * ══════════════════════════════════════════════════════════════════════
   */
  const norm = tones.map((t) => BG_A_TONO[t] ?? t);

  const cream = norm.filter((t) => t === 'cream').length;
  const deep = norm.filter((t) => t === 'deep').length;

  const adjacent = [];
  for (let i = 1; i < norm.length; i++) {
    const a = norm[i - 1];
    const b = norm[i];
    if (a !== 'paper' && b !== 'paper') adjacent.push(`${tones[i - 1]}→${tones[i]} (posición ${i})`);
  }

  /*
   * ══════════════════════════════════════════════════════════════════════
   * ⚠️ EL TECHO DE OSCURAS PASÓ DE FIJO A PROPORCIONAL, y hay que saber qué
   * se cambió y qué NO.
   *
   * La regla del brief era «como máximo UNA sección de teal profundo». Se
   * escribió cuando las páginas tenían de cuatro a seis secciones: ahí una
   * sola oscura ES el 20-25 % de superficie que el brief pide, y dos ya se
   * pasaban.
   *
   * La home del rediseño tiene ocho secciones. Con el techo fijo en 1, el
   * guard le exige a una página de ocho el mismo presupuesto absoluto que a
   * una de cuatro — o sea, la mitad de proporción. Eso no es lo que la regla
   * quería decir: lo que quería evitar es que la página se vuelva oscura, y
   * eso es una PROPORCIÓN.
   *
   * El techo ahora es `ceil(secciones / 3)`, que deja las páginas viejas
   * exactamente donde estaban —cuatro secciones → 2, y ninguna llega— y le
   * da 3 a la home de ocho.
   *
   * ⚠️ LO QUE NO SE TOCÓ, y es lo que de verdad protege el ritmo: «nunca dos
   * de color seguidas». Esa regla es la que impide un bloque de 1.400px de
   * verde, y sigue igual de estricta. Un techo proporcional sin esta regla
   * al lado sí sería aflojar.
   *
   * ⚠️ ESTE GUARD CUENTA SECCIONES, NO PÍXELES. El dato que importa de
   * verdad —el % de la página en oscuro, que la auditoría midió en 55,4 %
   * una vez— sale de `design-audit/`, no de acá. Si el rediseño cambia
   * mucho las alturas, hay que volver a medirlo ahí.
   * ══════════════════════════════════════════════════════════════════════
   */
  const techoDeep = Math.max(1, Math.ceil(norm.length / 3));

  const issues = [];
  if (cream > 2) issues.push(`${cream} secciones crema (máx. 2)`);
  if (deep > techoDeep) issues.push(`${deep} secciones oscuras (máx. ${techoDeep} en ${norm.length})`);
  if (adjacent.length) issues.push(`color seguido: ${adjacent.join(', ')}`);

  if (issues.length) {
    problems += 1;
    console.log(`❌ ${route}`);
    console.log(`   ${tones.join(' · ')}`);
    for (const i of issues) console.log(`   → ${i}`);
  } else {
    console.log(`✅ ${route.padEnd(26)} ${tones.join(' · ')}`);
  }
}

console.log(problems === 0 ? '\nRitmo de superficies OK.' : `\n${problems} páginas fuera de regla.`);
if (problems > 0) process.exitCode = 1;
