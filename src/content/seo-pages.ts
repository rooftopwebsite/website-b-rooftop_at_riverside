/**
 * H1, `<title>` y descripción de cada página, en un solo lugar.
 *
 * Vive junto porque así la tabla del brief es AUDITABLE: `npm run check:seo`
 * compara lo que se renderiza contra esto. Repartido en veinte archivos, un
 * título cambiado a mano no lo nota nadie hasta que baja el tráfico.
 *
 * ⚠️ Los `title` son **absolutos**: ya traen el nombre de la marca donde
 * corresponde, así que evitan el `template` del layout raíz. Vinieron así en la
 * tabla del brief y el orden de las palabras importa para el SEO local — el
 * término de búsqueda va primero en la mayoría.
 *
 * ⚠️ `keywords` NO se emite como meta tag: Google lo ignora desde 2009 y es una
 * pista gratis para la competencia. Está acá como documentación de la intención
 * de búsqueda de cada página, para que el copy no se aleje de ella.
 */

export interface PageSeo {
  /** El H1. Uno solo por página. */
  readonly h1: string;
  /** `<title>` absoluto: no pasa por el template del layout. */
  readonly title: string;
  readonly description: string;
  /** Intención de búsqueda. Documental, no se emite. */
  readonly keywords: readonly string[];
}

export const PAGE_SEO = {
  '/': {
    h1: 'Bonita comes together',
    title: 'Rooftop at Riverside | Rooftop Bar & Food Truck Park in Bonita Springs, FL',
    description:
      "A rooftop bar over four food trucks in downtown Bonita Springs. Live music most nights, happy hour Wednesday to Friday, dogs welcome in the yard. No reservations — just come up.",
    keywords: ['rooftop bar bonita springs', 'food truck park'],
  },

  '/sunset-bar': {
    h1: "Bonita's only rooftop",
    title: 'Sunset Bar | The Only Rooftop Bar in Bonita Springs',
    description:
      'Craft cocktails, local drafts and the best west-facing seat in town. Happy hour Wednesday to Friday, 3 to 6: $4 drafts, $5 house wines, $6 house drinks.',
    keywords: ['rooftop bar', 'happy hour bonita springs'],
  },

  '/food-trucks': {
    h1: 'Four kitchens. One yard.',
    title: 'Food Trucks | Bonita Springs Food Truck Park',
    description:
      'Four independent food trucks park in the yard at Rooftop at Riverside. Seafood, smashburgers, street tacos and Caribbean — order at whichever window you want.',
    keywords: ['food trucks bonita springs', 'where to eat downtown'],
  },

  '/the-yard': {
    h1: 'The Yard is open',
    title: 'The Yard | Outdoor Event & Concert Space, Downtown Bonita Springs',
    description:
      'The open yard under the rooftop: a stage, four food trucks and room to move. Free most nights, gated for ticketed shows, and available to rent.',
    keywords: ['outdoor event space', 'live music bonita springs'],
  },

  '/whats-on': {
    h1: "What's on this week",
    title: 'Events & Live Music | Rooftop at Riverside',
    description:
      'Live music, Bingo Night and Wooftop Wednesdays in downtown Bonita Springs. See the full calendar by month or by list, and add it to your own.',
    keywords: ['live music bonita springs tonight', 'things to do'],
  },

  '/events': {
    h1: 'Your event, two stories up',
    title: 'Private Event Venue in Bonita Springs | Rooftop at Riverside',
    description:
      'Rent the rooftop, the yard, or the whole place. Four food trucks, our own bar, and one person coordinating all of it. Downtown Bonita Springs.',
    keywords: ['private event venue bonita springs'],
  },

  '/events/spaces': {
    h1: 'Pick your corner of paradise',
    title: 'Event Spaces | Rooftop at Riverside, Bonita Springs',
    description:
      'Four spaces to rent in downtown Bonita Springs: the rooftop Sunset Bar, the gated Yard, the patio, or a full buyout of the whole place.',
    keywords: ['event space rental bonita springs'],
  },

  '/events/corporate': {
    h1: "Take the team somewhere they'll actually want to go",
    title: 'Corporate Event Venue in Bonita Springs, FL',
    description:
      'Client nights, team outings and company dinners on a rooftop in downtown Bonita Springs. Four kitchens means nobody gets a plate they did not pick.',
    keywords: ['corporate event venue bonita springs'],
  },

  '/events/holiday-parties': {
    h1: 'Trade the ballroom for the rooftop',
    title: 'Holiday Party Venue in Bonita Springs, FL',
    description:
      'Company holiday parties outdoors, in December, with nobody in a coat. Take the rooftop, the yard, or the whole place with the gates closed.',
    keywords: ['holiday party venue bonita springs'],
  },

  '/events/celebrations': {
    h1: 'Every milestone deserves a view',
    title: 'Birthday & Celebration Venue in Bonita Springs, FL',
    description:
      'Birthdays, quinceañeras, engagements, showers and reunions on a rooftop over the Imperial River. Kids and dogs welcome, and the bar runs late on weekends.',
    keywords: ['birthday party venue', 'quinceañera venue'],
  },

  '/events/fundraisers': {
    h1: 'Raise more, spend less on the room',
    title: 'Fundraiser & Nonprofit Event Venue in Bonita Springs',
    description:
      'Spirit nights, galas and school fundraisers in a gated yard on Old 41, across from Riverside Park. The stage and the sound are already there.',
    keywords: ['fundraiser venue bonita springs'],
  },

  '/events/game-truck': {
    h1: 'The party arrives on wheels',
    title: 'Video Game Truck Rental | Rooftop at Riverside',
    description:
      "Southwest Florida's first gaming truck: consoles, screens, a Game Coach and air conditioning. Two hours from $400, here or at your place.",
    keywords: ['game truck rental bonita springs'],
  },

  '/nfc-north-hq': {
    h1: 'Sunday belongs to the rooftop',
    title: 'Football Watch Parties in Bonita Springs | Rooftop at Riverside',
    description:
      'Half of Bonita came down from somewhere with real winter, and on Sunday it shows. Doors at 11, sound on the big game, four kitchens open the whole time.',
    keywords: ['football watch party bonita springs'],
  },

  '/the-experience': {
    h1: 'More than a bar with a view',
    title: 'The Experience | Games, Live Music & Family Nights',
    description:
      "Live music, Bingo, dog nights and Southwest Florida's first gaming truck. Things to do in downtown Bonita Springs, most of them free.",
    keywords: ['things to do bonita springs', 'game lounge'],
  },

  '/market': {
    h1: 'The Neighborhood Market',
    title: 'Neighborhood Market | Rooftop at Riverside',
    description:
      'Local makers set up in the yard with handmade goods, while the trucks cook and the bar stays open. Vendor spots are $30.',
    keywords: ['market bonita springs'],
  },

  '/our-story': {
    h1: 'A Magnus family project',
    title: 'Our Story | Rooftop at Riverside, Downtown Bonita Springs',
    description:
      'Four years of planning by a Bonita family. How a corner of Old 41 became a rooftop bar over four independent kitchens — with the town’s own history on the walls.',
    keywords: [],
  },

  '/join-us': {
    h1: 'Bring your truck to the yard',
    title: 'Food Truck & Live Music Opportunities | Rooftop at Riverside',
    description:
      'Four trucks run the yard on revenue share — you keep your own margin and your own register. We also book live music five nights a week.',
    keywords: ['food truck spots bonita springs'],
  },

  '/faq': {
    h1: 'How this place works',
    title: 'FAQ | Rooftop at Riverside',
    description:
      'Delivery, takeout, outside food, catering, reservations, paying the trucks, dogs, age limits, parking and rain. The short answers.',
    keywords: [],
  },

  '/visit': {
    h1: 'Find us across from Riverside Park',
    title: 'Visit | Hours, Directions & Parking, Bonita Springs',
    description:
      'Rooftop at Riverside is at 27333 Old 41 Rd, downtown Bonita Springs. Hours for the bar and the trucks, where to park, and how to get here.',
    keywords: ['rooftop bar bonita springs hours'],
  },

  '/contact': {
    h1: 'Say hello',
    title: 'Contact | Rooftop at Riverside',
    description:
      'Three inboxes so your message reaches the person who can answer it: general questions, private events, and working with us.',
    keywords: [],
  },
} as const satisfies Record<string, PageSeo>;

export type SeoRoute = keyof typeof PAGE_SEO;

export const seo = (route: SeoRoute): PageSeo => PAGE_SEO[route];
