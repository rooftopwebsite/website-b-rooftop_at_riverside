import fs from 'node:fs/promises';

/**
 * Migra cada página a la tabla de `content/seo-pages.ts`:
 *
 *   · reemplaza el bloque `pageMeta({ title, description, path })` por
 *     `pageMeta({ route })`, conservando el `image` si lo tenía;
 *   · pisa el `title` del `<PageHero>` con el H1 de la tabla.
 *
 * Se corre una sola vez y queda versionado como registro de qué se cambió.
 * De acá en más el título y el H1 se editan en la tabla, no en la página.
 */

/** ruta de archivo → clave de la tabla */
const PAGES = {
  'src/app/page.tsx': '/',
  'src/app/sunset-bar/page.tsx': '/sunset-bar',
  'src/app/food-trucks/page.tsx': '/food-trucks',
  'src/app/the-yard/page.tsx': '/the-yard',
  'src/app/whats-on/page.tsx': '/whats-on',
  'src/app/events/page.tsx': '/events',
  'src/app/events/spaces/page.tsx': '/events/spaces',
  'src/app/events/corporate/page.tsx': '/events/corporate',
  'src/app/events/holiday-parties/page.tsx': '/events/holiday-parties',
  'src/app/events/celebrations/page.tsx': '/events/celebrations',
  'src/app/events/fundraisers/page.tsx': '/events/fundraisers',
  'src/app/events/game-truck/page.tsx': '/events/game-truck',
  'src/app/nfc-north-hq/page.tsx': '/nfc-north-hq',
  'src/app/the-experience/page.tsx': '/the-experience',
  'src/app/market/page.tsx': '/market',
  'src/app/our-story/page.tsx': '/our-story',
  'src/app/join-us/page.tsx': '/join-us',
  'src/app/faq/page.tsx': '/faq',
  'src/app/visit/page.tsx': '/visit',
  'src/app/contact/page.tsx': '/contact',
};

/** El H1 de cada ruta, copiado de la tabla del brief. */
const H1 = {
  '/': 'Bonita comes together',
  '/sunset-bar': "Bonita's only rooftop",
  '/food-trucks': 'Four kitchens. One yard.',
  '/the-yard': 'The Yard is open',
  '/whats-on': "What's on this week",
  '/events': 'Your event, two stories up',
  '/events/spaces': 'Pick your corner of paradise',
  '/events/corporate': "Take the team somewhere they'll actually want to go",
  '/events/holiday-parties': 'Trade the ballroom for the rooftop',
  '/events/celebrations': 'Every milestone deserves a view',
  '/events/fundraisers': 'Raise more, spend less on the room',
  '/events/game-truck': 'The party arrives on wheels',
  '/nfc-north-hq': 'Sunday belongs to the rooftop',
  '/the-experience': 'More than a bar with a view',
  '/market': 'The Neighborhood Market',
  '/our-story': 'A Magnus family project',
  '/join-us': 'Bring your truck to the yard',
  '/faq': 'How this place works',
  '/visit': 'Find us across from Riverside Park',
  '/contact': 'Say hello',
};

const q = (s) => JSON.stringify(s);

/** Extrae el bloque `image: { ... }` del pageMeta actual, si lo hay. */
function keepImage(metaBlock) {
  const m = metaBlock.match(/image:\s*\{[\s\S]*?\n {2}\},/);
  return m ? `\n  ${m[0].trim()}` : '';
}

let changed = 0;

for (const [file, route] of Object.entries(PAGES)) {
  let src;
  try {
    src = await fs.readFile(file, 'utf8');
  } catch {
    console.log(`  (falta ${file})`);
    continue;
  }

  // 1 — pageMeta({...}) → pageMeta({ route })
  const metaStart = src.indexOf('pageMeta({');
  if (metaStart !== -1) {
    const open = src.indexOf('{', metaStart);
    let depth = 0;
    let end = open;
    for (; end < src.length; end++) {
      if (src[end] === '{') depth++;
      else if (src[end] === '}') {
        depth--;
        if (depth === 0) break;
      }
    }
    const block = src.slice(open, end + 1);
    const img = keepImage(block);
    src = `${src.slice(0, metaStart)}pageMeta({\n  route: ${q(route)},${img}\n})${src.slice(end + 1)}`;
  }

  // 2 — el `title` del PageHero pasa a ser el H1 de la tabla.
  const h1 = H1[route];
  src = src.replace(/(<PageHero[\s\S]{0,400}?\n\s+title=)(\{[^}]*\}|"[^"]*")/, (_m, pre) => {
    const value = h1.includes("'") || h1.includes('"') ? `{${q(h1)}}` : `"${h1}"`;
    return pre + value;
  });

  await fs.writeFile(file, src, 'utf8');
  changed += 1;
  console.log(`  ${route}`);
}

console.log(`\n${changed} páginas migradas a la tabla.`);
