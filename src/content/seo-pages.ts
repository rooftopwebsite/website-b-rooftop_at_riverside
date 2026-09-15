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
      "A rooftop bar over four food trucks in downtown Bonita Springs. Live music on the calendar, happy hour Wednesday to Friday, dogs welcome in the yard. No reservations, just come up.",
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
      'Four independent food trucks park in the yard at Rooftop at Riverside. Seafood, smashburgers, street tacos and Caribbean. Order at whichever window you want.',
    keywords: ['food trucks bonita springs', 'where to eat downtown'],
  },

  '/whats-on': {
    h1: "What's on this week",
    title: 'Events & Live Music | Rooftop at Riverside',
    description:
      'Live music, Bingo Night and Wooftop Wednesdays in downtown Bonita Springs. See the calendar by month or by list, filter it, and add it to your own.',
    keywords: ['live music bonita springs tonight', 'things to do'],
  },

  '/events': {
    h1: 'Your event, two stories up',
    title: 'Private Event Venue in Bonita Springs | Rooftop at Riverside',
    description:
      'Rent the rooftop, the yard, or the whole place. Four food trucks, our own bar, and one person coordinating all of it. Downtown Bonita Springs.',
    keywords: ['private event venue bonita springs'],
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
      'Four years of planning by a Bonita family. How a corner of Old 41 became a rooftop bar over four independent kitchens, with the town’s own history on the walls.',
    keywords: [],
  },

  '/join-us': {
    // ⚠️ Cambió el 2026-09-15: el carril de food trucks se eliminó de
    // `/join-us` porque lo habíamos inventado. Quedan dos, y el H1 lo dice.
    h1: 'Two ways in',
    title: 'Jobs & Live Music Bookings | Rooftop at Riverside',
    description:
      'Two ways in: we hire through here, and we book live music for the stage in the yard. Both start with a form that a person reads.',
    keywords: ['bonita springs bar jobs', 'live music booking bonita springs'],
  },



  '/contact': {
    h1: 'Say hello',
    title: 'Contact | Rooftop at Riverside',
    description:
      'The address, the hours and a form that reaches the person who can answer it. Downtown Bonita Springs, across from Riverside Park.',
    keywords: [],
  },
  /**
   * ⚠️ RUTA NUEVA del 2026-09-15. Reemplaza al `/game-lounge` del sitio viejo,
   * que redirigía a un ancla dentro de `/our-story`. Es la segunda página con
   * precios del sitio y se llama `game-truck` porque el copy del cliente dice
   * «our specially designed truck», no una sala.
   */
  '/game-truck': {
    h1: "Southwest Florida's first gaming truck",
    title: 'Gaming Truck | Rooftop at Riverside, Bonita Springs',
    description:
      'Xbox Series X, PlayStation 5 and Nintendo Switch 2 on six screens with a Game Coach on site. $10 per person for 30 minutes, or a two hour party from $400.',
    keywords: [],
  },
} as const satisfies Record<string, PageSeo>;

export type SeoRoute = keyof typeof PAGE_SEO;

export const seo = (route: SeoRoute): PageSeo => PAGE_SEO[route];
