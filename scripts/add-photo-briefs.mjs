import fs from 'node:fs/promises';

/**
 * Agrega `photoBrief` a cada entrada de trucks y spaces: qué toma concreta
 * falta. Ese texto es lo que se muestra dentro del placeholder gris, así que
 * tiene que servirle a quien va a sacar la foto.
 *
 * Procesa línea por línea, siguiendo el `slug` actual, porque los objetos
 * tienen campos multilínea y un regex sobre el archivo entero es frágil.
 */

const TRUCKS = {
  'ocn-seafood-co':
    'The OCN Seafood Co. truck open and serving, at dusk, window lit, people ordering.',
  'butchers-blvd':
    "The Butcher's Blvd truck parked in the yard, plus one close-up of a smashburger on the pass.",
  'el-chilango': 'Truck exterior with signage readable.',
  'reggae-kitchen':
    'The Reggae Kitchen truck with its signage readable, and one plated dish showing the colour.',
  'prime-carvery': 'Truck exterior. Retired from the roster.',
  'sea-me-on-wheels': 'Truck exterior. Retired from the roster.',
  'tropical-fusion': 'Truck exterior. Retired from the roster.',
};

const SPACES = {
  'sunset-bar':
    'The rooftop at golden hour, looking west over the river, bar and seating in frame.',
  'the-yard':
    'The yard from above with all four trucks parked and the stage set, shot from the rooftop.',
  patio:
    'The patio once the renovation is done — wide shot showing how it links the yard to the bar.',
  'full-buyout':
    'A private event in progress: rooftop and yard both busy, shot from the street side.',
};

async function inject(file, briefs) {
  const lines = (await fs.readFile(file, 'utf8')).split('\n');
  const out = [];
  let current = null;
  let injected = 0;

  for (const line of lines) {
    out.push(line);

    const slug = line.match(/^\s+slug: '([^']+)',/);
    if (slug) {
      current = slug[1];
      continue;
    }

    // El `photoAlt` cierra el bloque de imagen: el brief va justo después.
    // Se excluye la línea de la interfaz (lleva `readonly`).
    if (current && /^\s+photoAlt: .*,\s*$/.test(line) && !line.includes('readonly')) {
      const brief = briefs[current];
      if (brief) {
        out.push(`    photoBrief: ${JSON.stringify(brief)},`);
        injected += 1;
      }
      current = null;
    }
  }

  await fs.writeFile(file, out.join('\n'), 'utf8');
  return injected;
}

console.log('trucks:', await inject('src/content/trucks.ts', TRUCKS));
console.log('spaces:', await inject('src/content/spaces.ts', SPACES));
