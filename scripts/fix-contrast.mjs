import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Arregla los contrastes que encontró `scripts/a11y.mjs`.
 *
 * Dos causas de raíz, las dos invisibles para una auditoría de paleta:
 *
 *  1. `text-body/55` da 4.41:1 sobre blanco. Falla AA por 0.09. Sube a /65.
 *  2. `opacity-*` sobre TEXTO. La opacidad se multiplica con la del padre, así
 *     que un `opacity-60` dentro de un `opacity-70` deja el texto en 42% y baja
 *     a 2.88:1. Se reemplaza por clases de color explícitas, que no se componen.
 *
 * Se corre una sola vez; queda versionado para dejar registro de qué cambió.
 */

const EDITS = [
  // 1. /55 no llega a AA. /65 da ~6.4:1.
  { glob: 'all', from: /text-body\/55/g, to: 'text-body/65' },

  // 2. Opacidad sobre texto → color explícito.
  {
    file: 'src/components/shared/OpenStatus.tsx',
    from: '<span className="eyebrow opacity-60">Today</span>',
    to: '<span className="eyebrow">Today</span>',
  },
  {
    file: 'src/app/the-yard/page.tsx',
    from: 'className="mt-[12px] text-caption font-bold tabular-nums opacity-70"',
    to: 'className="mt-[12px] text-caption font-bold tabular-nums text-body/70"',
  },
  {
    file: 'src/app/whats-on/page.tsx',
    from: '<span className="ml-[8px] font-normal opacity-70">{event.space}</span>',
    to: '<span className="ml-[8px] font-normal text-body/70">{event.space}</span>',
  },
  {
    file: 'src/app/whats-on/page.tsx',
    from: '<span className="block font-normal opacity-70">',
    to: '<span className="block font-normal text-body/75">',
  },
  {
    file: 'src/components/sections/HomeSections.tsx',
    from: '<span aria-hidden="true" className="eyebrow opacity-70">',
    to: '<span aria-hidden="true" className="eyebrow text-ink/80">',
  },
  {
    file: 'src/components/sections/HomeSections.tsx',
    from: 'className="mt-[8px] flex-1 text-[15px] leading-[1.6] opacity-85"',
    to: 'className="mt-[8px] flex-1 text-[15px] leading-[1.6] text-ink/85"',
  },
  {
    file: 'src/components/sections/HomeSections.tsx',
    from: 'className="mt-[16px] text-caption font-bold uppercase tracking-[0.14em] opacity-60"',
    to: 'className="mt-[16px] text-caption font-bold uppercase tracking-[0.14em] text-body/70"',
  },
  {
    file: 'src/components/sections/TonightAtTheYard.tsx',
    from: 'className="shrink-0 text-caption font-bold tabular-nums opacity-70"',
    to: 'className="shrink-0 text-caption font-bold tabular-nums text-body/70"',
  },
  {
    file: 'src/components/sections/TonightAtTheYard.tsx',
    from: '<span className="shrink-0 text-caption opacity-60">{t.cuisine}</span>',
    to: '<span className="shrink-0 text-caption text-body/70">{t.cuisine}</span>',
  },

  // 3. El `opacity-70` que envolvía la línea de trucks creaba la opacidad
  //    ANIDADA. La distinción visual ya la da el propio texto («Food trucks»).
  { glob: 'all', from: /<OpenStatus which="trucks" className="opacity-70" \/>/g, to: '<OpenStatus which="trucks" />' },
  {
    glob: 'all',
    from: /<OpenStatus which="trucks" className="opacity-70 text-paper\/80" \/>/g,
    to: '<OpenStatus which="trucks" />',
  },
];

async function walk(dir) {
  const out = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (/\.tsx?$/.test(e.name)) out.push(p);
  }
  return out;
}

const files = await walk('src');
let changed = 0;

for (const edit of EDITS) {
  const targets = edit.glob === 'all' ? files : [edit.file];
  for (const f of targets) {
    let src;
    try {
      src = await fs.readFile(f, 'utf8');
    } catch {
      continue;
    }
    const next =
      typeof edit.from === 'string' ? src.split(edit.from).join(edit.to) : src.replace(edit.from, edit.to);
    if (next !== src) {
      await fs.writeFile(f, next, 'utf8');
      changed += 1;
      console.log(`  ${f}`);
    }
  }
}

console.log(`\n${changed} archivos tocados.`);
