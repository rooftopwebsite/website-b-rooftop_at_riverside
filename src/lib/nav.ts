/**
 * Navegación.
 *
 * El patrón de la casa (The Orient + Showdown, ver docs/house-tokens.md §5):
 * nav reducida más un mega-menú «More» con una línea de descripción por link.
 * Con 23 rutas es la única forma de no romper la jerarquía.
 */

export interface NavLink {
  readonly label: string;
  readonly href: string;
  /** Sólo en el mega-menú: la línea que explica qué hay adentro. */
  readonly hint?: string;
  /** Abre en otra pestaña. Se anuncia por texto además del icono. */
  readonly external?: boolean;
}

/**
 * Los cinco visibles. El orden NO es casual: sigue las cuatro fuentes de
 * ingreso, de la que factura el venue hacia la que factura el vendor.
 *   Sunset Bar (nuestro) → Food Trucks → What's On → Events → The Yard
 */
export const NAV_MAIN: readonly NavLink[] = [
  { label: 'Sunset Bar', href: '/sunset-bar' },
  { label: 'Food Trucks', href: '/food-trucks' },
  { label: "What's On", href: '/whats-on' },
  { label: 'Events', href: '/events' },
  { label: 'The Yard', href: '/the-yard' },
];

export const NAV_MORE: readonly NavLink[] = [
  { label: 'Our Story', href: '/our-story', hint: 'The Magnus family and four years of planning.' },
  {
    label: 'The Experience',
    href: '/the-experience',
    hint: "The Game Lounge and Southwest Florida's first gaming truck.",
  },
  { label: 'Market', href: '/market', hint: 'Local vendors and handmade goods in the yard.' },
  {
    label: 'Events Packet',
    href: '/events/inquire',
    hint: 'Spaces, capacities and food tiers, as a PDF.',
  },
  { label: 'Join Us', href: '/join-us', hint: 'Play here, park a truck here, work here.' },
  { label: 'FAQ', href: '/faq', hint: 'Parking, dogs, kids and how ordering works.' },
  { label: 'Visit', href: '/visit', hint: 'Hours, parking and directions.' },
  { label: 'Contact', href: '/contact', hint: 'Three inboxes, so you reach the right one.' },
];

/**
 * Los dos CTA fijos, con jerarquía distinta.
 *
 * ⚠️ NO hay «Book Now». El venue es walk-in y no toma reservas de mesa; el
 * lugar del primario lo ocupa la vertical que más factura.
 */
export const NAV_CTA = {
  primary: { label: 'Plan an Event', href: '/events/inquire' },
  secondary: { label: "What's On", href: '/whats-on' },
} as const;

/**
 * Footer en cuatro columnas.
 *
 * ⚠️ `events@eatdrinkparadise.com` NO va en el footer. Vive sólo en el hub de
 * eventos y en /contact, para no mezclar canales: una consulta de $20.000 no
 * puede caer en el mismo buzón que una pregunta sobre estacionamiento.
 */
export const FOOTER_QUICK_LINKS: readonly NavLink[] = [
  { label: 'Events Packet', href: '/events/inquire' },
  { label: 'Event Spaces', href: '/events/spaces' },
  { label: 'Corporate Events', href: '/events/corporate' },
  { label: 'Join Us', href: '/join-us' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Gift Cards', href: 'GIFT_CARDS', external: true },
  { label: 'Careers', href: '/join-us#work' },
];

export const ALL_ROUTES: readonly string[] = [
  '/',
  '/sunset-bar',
  '/food-trucks',
  '/the-yard',
  '/the-experience',
  '/whats-on',
  '/events',
  '/events/spaces',
  '/events/corporate',
  '/events/celebrations',
  '/events/holiday-parties',
  '/events/fundraisers',
  '/events/game-truck',
  '/events/inquire',
  '/nfc-north-hq',
  '/market',
  '/our-story',
  '/join-us',
  '/faq',
  '/visit',
  '/contact',
];
