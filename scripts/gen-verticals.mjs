import fs from 'node:fs/promises';

/**
 * Genera las cuatro páginas de vertical de eventos desde un único template.
 *
 * Existe para que las cuatro no se puedan desincronizar: la estructura vive en
 * `components/sections/EventVertical.tsx` y el copy vive acá. Correr:
 *   node scripts/gen-verticals.mjs
 */

const V = [
  {
    slug: 'corporate',
    metaTitle: 'Corporate Events',
    metaDesc:
      'Client nights, team outings and company dinners in downtown Bonita Springs. A rooftop bar, a gated yard and four food trucks, with one coordinator handling all of it.',
    eyebrow: 'Corporate',
    title: 'A work night nobody tries to leave early',
    lead: 'Four kitchens means nobody gets handed a plate they did not choose. That alone solves the hardest part of feeding a room of colleagues.',
    image: '/images/events/event-b.jpg',
    imageAlt: 'A corporate group gathered on the rooftop at Rooftop at Riverside',
    crumbName: 'Corporate',
    highlights: [
      [
        'Four menus, zero dietary drama',
        'Tacos, seafood, smashburgers and Caribbean, all in one yard. Vegetarians, picky eaters and the person who only eats chicken all get sorted without a single email.',
      ],
      [
        'Indoor-outdoor, in Florida',
        'The rooftop is covered and the yard is open. December through April that is the whole pitch: your team is outside, in January, comfortably.',
      ],
      [
        'One invoice, one contact',
        'You do not chase four vendors. We coordinate the trucks and the bar, and you get a single point of contact from the first email to load-out.',
      ],
    ],
    formats: [
      'Client appreciation nights',
      'Team outings',
      'Sales kickoffs',
      'Quarterly dinners',
      'Networking mixers',
      'Board and partner dinners',
      'Conference after-parties',
      'Brand activations',
    ],
    closingTitle: 'Tell us the headcount',
    closingBody:
      'Send the date and the size, and the events packet comes back within one business day.',
  },
  {
    slug: 'holiday-parties',
    metaTitle: 'Holiday Parties',
    metaDesc:
      'Company holiday parties in Bonita Springs. Take the rooftop, the yard, or the entire venue with the gates closed. December books first.',
    eyebrow: 'Holiday parties',
    title: 'December fills first',
    lead: 'High season here runs December through April, and the holiday calendar goes before anything else. If you are reading this in the fall, you are on time. Barely.',
    image: '/images/events/event-c.jpg',
    imageAlt: 'A large group celebrating at Rooftop at Riverside',
    crumbName: 'Holiday parties',
    highlights: [
      [
        'The whole place, gates closed',
        'A full buyout gives you the rooftop, the yard, the patio and the trucks, with the public locked out for the night.',
      ],
      [
        'Outdoors, in December',
        'This is Southwest Florida. Your holiday party can be outside, under lights, with nobody wearing a coat.',
      ],
      [
        'Food nobody complains about',
        'Four trucks running at once beats a chafing dish of the same three entrees. Everyone eats what they actually want.',
      ],
    ],
    formats: [
      'Company holiday parties',
      'Team dinners',
      'Client holiday receptions',
      'End-of-year awards nights',
      'Family holiday gatherings',
      'New Year celebrations',
    ],
    closingTitle: 'Hold a December date',
    closingBody:
      'Weekend dates in December go early. Send the request and we will hold it while we talk.',
  },
  {
    slug: 'celebrations',
    metaTitle: 'Birthdays, Milestones & Celebrations',
    metaDesc:
      'Milestone birthdays, engagements, showers and reunions at a rooftop bar over a food truck park in downtown Bonita Springs.',
    eyebrow: 'Celebrations',
    title: 'The good ones run late',
    lead: 'Fortieths, engagements, showers, reunions. The rooftop holds a party that starts at sunset and does not really have a plan for when it ends.',
    image: '/images/events/event-d.jpg',
    imageAlt: 'Guests raising glasses at a celebration at Rooftop at Riverside',
    crumbName: 'Celebrations',
    highlights: [
      [
        'Sunset over the river',
        'The rooftop faces west over the Imperial River. Time the toast for seven and the sky does the work.',
      ],
      [
        'Kids and dogs welcome',
        'The yard is open, dog friendly and has room to run. Nobody has to find a sitter to come to your party.',
      ],
      [
        'Late on weekends',
        'The bar runs to midnight on Friday and 2am on Saturday. The party does not get cut short at ten.',
      ],
    ],
    formats: [
      'Milestone birthdays',
      'Engagement parties',
      'Bridal and baby showers',
      'Rehearsal dinners',
      'Graduations',
      'Class reunions',
      'Retirement parties',
      'Anniversaries',
    ],
    closingTitle: 'Pick a Saturday',
    closingBody:
      'Tell us the date and roughly how many people, and the packet goes out the same day.',
  },
  {
    slug: 'fundraisers',
    metaTitle: 'Fundraisers & Nonprofit Events',
    metaDesc:
      'Spirit nights, nonprofit galas and school fundraisers in the gated yard at Rooftop at Riverside, Bonita Springs.',
    eyebrow: 'Fundraisers',
    title: 'A room the whole town walks past',
    lead: 'The yard sits on Old 41 in the middle of downtown, across from Riverside Park. For a community fundraiser that visibility is half the job done.',
    image: '/images/venue-guests.jpg',
    imageAlt: 'A crowd gathered in the yard at Rooftop at Riverside',
    crumbName: 'Fundraisers',
    highlights: [
      [
        'Downtown foot traffic',
        'Riverside Park is across the street and Old 41 runs right past the gate. People find your event without a single ad.',
      ],
      [
        'Gated for ticketed entry',
        'The yard closes off, so you can run a ticketed door and count who comes through it.',
      ],
      [
        'A stage that already exists',
        'Sound and a stage are part of the yard. Live music, an auction or a speaker all work without renting anything in.',
      ],
    ],
    formats: [
      'Spirit nights',
      'Nonprofit galas',
      'School fundraisers',
      'Charity auctions',
      'Awareness events',
      'Community benefit concerts',
    ],
    closingTitle: 'Let us hear the cause',
    closingBody:
      'Send the date and what you are raising for, and we will come back with what we can do.',
  },
];

const q = (s) => JSON.stringify(s);

for (const v of V) {
  const src = [
    "import type { Metadata } from 'next';",
    "import EventVertical, { type VerticalConfig } from '@/components/sections/EventVertical';",
    "import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';",
    '',
    '/** Generado por scripts/gen-verticals.mjs. Editá el script, no este archivo. */',
    'export const metadata: Metadata = pageMeta({',
    `  title: ${q(v.metaTitle)},`,
    `  description: ${q(v.metaDesc)},`,
    `  path: '/events/${v.slug}',`,
    '  image: {',
    `    url: ${q(v.image)},`,
    '    width: 1800,',
    '    height: 1200,',
    `    alt: ${q(v.imageAlt)},`,
    '  },',
    '});',
    '',
    'const CONFIG: VerticalConfig = {',
    `  eyebrow: ${q(v.eyebrow)},`,
    `  title: ${q(v.title)},`,
    `  lead: ${q(v.lead)},`,
    `  image: ${q(v.image)},`,
    `  imageAlt: ${q(v.imageAlt)},`,
    `  crumbName: ${q(v.crumbName)},`,
    `  crumbPath: '/events/${v.slug}',`,
    '  highlights: [',
    ...v.highlights.map(([t, b]) => `    { title: ${q(t)}, body: ${q(b)} },`),
    '  ],',
    '  formats: [',
    ...v.formats.map((f) => `    ${q(f)},`),
    '  ],',
    `  closingTitle: ${q(v.closingTitle)},`,
    `  closingBody: ${q(v.closingBody)},`,
    '};',
    '',
    'export default function Page() {',
    '  return (',
    '    <>',
    '      <script',
    '        type="application/ld+json"',
    '        dangerouslySetInnerHTML={{',
    '          __html: jsonLdScript(',
    '            breadcrumbJsonLd([',
    "              { name: 'Events', path: '/events' },",
    '              { name: CONFIG.crumbName, path: CONFIG.crumbPath },',
    '            ]),',
    '          ),',
    '        }}',
    '      />',
    '      <EventVertical config={CONFIG} />',
    '    </>',
    '  );',
    '}',
    '',
  ].join('\n');

  const file = `src/app/events/${v.slug}/page.tsx`;
  await fs.mkdir(`src/app/events/${v.slug}`, { recursive: true });
  await fs.writeFile(file, src, 'utf8');
  console.log('escrito ' + file);
}
