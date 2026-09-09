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
  '@/components/sections/Hero': 'src/components/sections/Hero.tsx',
  '@/components/sections/EventVertical': 'src/components/sections/EventVertical.tsx',
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

/** Los tonos de los `<Section>` de un archivo, en orden. */
async function tonesIn(file) {
  const src = await fs.readFile(file, 'utf8');
  const tones = [];
  // `<Section ...>` hasta el primer `>`; si no declara tone, el default es paper.
  for (const m of src.matchAll(/<Section\b([^>]*)>/g)) {
    const attrs = m[1];
    const tone = attrs.match(/tone="(\w+)"/)?.[1] ?? 'paper';
    tones.push(tone);
  }
  return tones;
}

/** Expande los componentes de sección que la página importa y usa. */
async function pageTones(file) {
  const src = await fs.readFile(file, 'utf8');
  const own = await tonesIn(file);

  // Componentes de sección usados en el JSX, en orden de aparición.
  const used = [...src.matchAll(/<([A-Z][A-Za-z]*)\s*\/>/g)].map((m) => m[1]);
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
  return expanded.length > 0 ? [...expanded, ...own] : own;
}

const files = await walk(PAGE_GLOB);
let problems = 0;

for (const file of files.sort()) {
  const route = file.replace(/^src[\\/]app/, '').replace(/[\\/]page\.tsx$/, '') || '/';
  const tones = (await pageTones(file)).filter((t) => t !== 'none');
  if (tones.length === 0) continue;

  const cream = tones.filter((t) => t === 'cream').length;
  const deep = tones.filter((t) => t === 'deep').length;

  const adjacent = [];
  for (let i = 1; i < tones.length; i++) {
    const a = tones[i - 1];
    const b = tones[i];
    if (a !== 'paper' && b !== 'paper') adjacent.push(`${a}→${b} (posición ${i})`);
  }

  const issues = [];
  if (cream > 2) issues.push(`${cream} secciones crema (máx. 2)`);
  if (deep > 1) issues.push(`${deep} secciones deep (máx. 1)`);
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
