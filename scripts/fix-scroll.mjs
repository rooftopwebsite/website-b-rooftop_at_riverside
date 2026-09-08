import fs from 'node:fs/promises';
/**
 * `scrollable-region-focusable`: un contenedor con scroll que no es alcanzable
 * por teclado deja su contenido inaccesible para quien no usa mouse.
 * El arreglo estándar es `tabIndex={0}` más un `role="region"` con nombre, para
 * que el lector de pantalla lo anuncie como una zona con la que se puede interactuar.
 */
const E = [
  ['src/app/events/game-truck/page.tsx',
   '<div className="mt-[40px] overflow-x-auto">',
   '<div className="mt-[40px] overflow-x-auto" tabIndex={0} role="region" aria-label="Gaming truck pricing, scrollable">'],
  ['src/app/visit/page.tsx',
   '<div className="mt-[32px] overflow-x-auto">',
   '<div className="mt-[32px] overflow-x-auto" tabIndex={0} role="region" aria-label="Opening hours, scrollable">'],
  ['src/app/whats-on/page.tsx',
   '<div className="mt-[32px] overflow-x-auto">',
   '<div className="mt-[32px] overflow-x-auto" tabIndex={0} role="region" aria-label="Month calendar, scrollable">'],
  ['src/components/sections/EventVertical.tsx',
   '<div className="mt-[32px] overflow-x-auto">',
   '<div className="mt-[32px] overflow-x-auto" tabIndex={0} role="region" aria-label="Space capacities, scrollable">'],
  ['src/components/shared/Footer.tsx',
   '<div className="mt-[20px] overflow-x-auto">',
   '<div className="mt-[20px] overflow-x-auto" tabIndex={0} role="region" aria-label="Opening hours, scrollable">'],
];
for (const [f, from, to] of E) {
  const s = await fs.readFile(f, 'utf8');
  if (!s.includes(from)) { console.log('NO MATCH ' + f); continue; }
  await fs.writeFile(f, s.split(from).join(to), 'utf8');
  console.log('  ' + f);
}
