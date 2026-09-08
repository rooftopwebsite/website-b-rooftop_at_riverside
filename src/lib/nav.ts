/**
 * Navegación.
 *
 * El patrón de la casa, verificado en The Orient y Showdown Social: pocos
 * destinos a la vista y el resto en un desplegable «More» con label + subtítulo.
 * Ver docs/house-tokens.md §5.
 *
 * El orden de los items visibles NO es alfabético ni casual: sigue las cuatro
 * fuentes de ingreso, de la más consultada a la más rentable.
 *   Food Trucks → Sunset Bar → What's On → Events
 */

export interface NavLink {
  readonly label: string;
  readonly href: string;
  /** Sólo en el mega-menú: la línea que explica qué hay adentro. */
  readonly hint?: string;
}

export const NAV_MAIN: readonly NavLink[] = [
  { label: 'Food Trucks', href: '/food-trucks' },
  { label: 'Sunset Bar', href: '/sunset-bar' },
  { label: "What's On", href: '/whats-on' },
  { label: 'Events', href: '/events' },
  { label: 'Visit', href: '/visit' },
];

export const NAV_MORE: readonly NavLink[] = [
  { label: 'The Yard', href: '/the-yard', hint: 'Ticketed events in the gated yard.' },
  { label: 'The Experience', href: '/the-experience', hint: 'Game Lounge and the gaming truck.' },
  { label: 'Event Spaces', href: '/events/spaces', hint: 'Capacities, minimums and layouts.' },
  { label: 'NFC North HQ', href: '/nfc-north-hq', hint: 'Where the north watches the game.' },
  { label: 'Market', href: '/market', hint: 'Local vendors, handmade goods.' },
  { label: 'Our Story', href: '/our-story', hint: 'The Magnus family and the park.' },
  { label: 'Join Us', href: '/join-us', hint: 'Play here, work here, vend here.' },
  { label: 'FAQ', href: '/faq', hint: 'Parking, dogs, kids, ordering.' },
];

/**
 * Los dos CTA fijos del header.
 *
 * ⚠️ Acá el patrón de la casa se DESVÍA a propósito. En Showdown el primario es
 * «Book Now» y en The Orient «Order Online»: los dos son transacciones. En
 * Rooftop no hay reservas ni pedidos —es walk-in— así que el lugar del primario
 * lo ocupa la vertical que más deja, que son los eventos privados.
 */
export const NAV_CTA = {
  primary: { label: 'Plan an Event', href: '/events/inquire' },
  secondary: { label: "What's On", href: '/whats-on' },
} as const;

/** Columnas del footer. Repiten y amplían lo del header, que es el patrón medido. */
export const FOOTER_NAV: readonly { title: string; links: readonly NavLink[] }[] = [
  {
    title: 'Come by',
    links: [
      { label: 'Food Trucks', href: '/food-trucks' },
      { label: 'Sunset Bar', href: '/sunset-bar' },
      { label: 'The Yard', href: '/the-yard' },
      { label: 'The Experience', href: '/the-experience' },
      { label: 'NFC North HQ', href: '/nfc-north-hq' },
      { label: 'Market', href: '/market' },
    ],
  },
  {
    title: 'Host with us',
    links: [
      { label: 'Private Events', href: '/events' },
      { label: 'Event Spaces', href: '/events/spaces' },
      { label: 'Corporate', href: '/events/corporate' },
      { label: 'Holiday Parties', href: '/events/holiday-parties' },
      { label: 'Fundraisers', href: '/events/fundraisers' },
      { label: 'Request a Proposal', href: '/events/inquire' },
    ],
  },
  {
    title: 'Get to know us',
    links: [
      { label: "What's On", href: '/whats-on' },
      { label: 'Our Story', href: '/our-story' },
      { label: 'Visit', href: '/visit' },
      { label: 'Contact', href: '/contact' },
      { label: 'Join Us', href: '/join-us' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
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
