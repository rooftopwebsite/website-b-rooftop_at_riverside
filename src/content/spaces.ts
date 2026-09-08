/**
 * Los espacios alquilables. Alimenta `/events/spaces`, la página que más plata deja.
 *
 * ⚠️ Las capacidades y los mínimos están TODOS en `null` a propósito. El brief:
 * «Los números todavía no los tengo: usá TBD visible en un componente
 * <PendingData> para que no se me pase. No inventes capacidades.»
 *
 * Un `null` acá se renderiza como un bloque TBD visible, no como un hueco.
 */

export interface Space {
  readonly slug: string;
  readonly name: string;
  /** Una línea: qué es. */
  readonly kicker: string;
  /** Para qué sirve. Dos o tres frases. */
  readonly description: string;
  /** Capacidad de pie. `null` → TBD visible. */
  readonly standing: number | null;
  /** Capacidad sentada. `null` → TBD visible. */
  readonly seated: number | null;
  /** Mínimo de invitados. `null` → TBD visible. */
  readonly minimum: number | null;
  /** Para qué tipo de evento se recomienda. */
  readonly bestFor: readonly string[];
  readonly photo: string | null;
  readonly photoAlt: string | null;
  /** Qué toma hace falta cuando `photo` es null. Se muestra en el placeholder. */
  readonly photoBrief: string;
  /** Si el espacio está operativo. El patio está en obra. */
  readonly status: 'available' | 'renovating';
}

export const SPACES: readonly Space[] = [
  {
    slug: 'sunset-bar',
    name: 'Sunset Bar',
    kicker: 'The rooftop',
    description:
      'The rooftop bar, with the Imperial River on one side and the park on the other. Our own bar, our own team. The room people ask for by name.',
    standing: null,
    seated: null,
    minimum: null,
    bestFor: ['Cocktail receptions', 'Corporate mixers', 'Milestone birthdays'],
    photo: '/images/venue-rooftop.jpg',
    photoAlt: 'The rooftop bar at Rooftop at Riverside with seating and string lights',
    photoBrief: "The rooftop at golden hour, looking west over the river, bar and seating in frame.",
    status: 'available',
  },
  {
    slug: 'the-yard',
    name: 'The Yard',
    kicker: 'The ground floor',
    description:
      'The open yard where the trucks park and the stage goes up. Being gated for ticketed entry, which also makes it the space for a full-scale private party.',
    standing: null,
    seated: null,
    minimum: null,
    bestFor: ['Live music', 'Fundraisers', 'Brand activations', 'Festivals'],
    photo: '/images/venue-truck-line.jpg',
    photoAlt: 'Food trucks lined up in the yard at Rooftop at Riverside',
    photoBrief: "The yard from above with all four trucks parked and the stage set, shot from the rooftop.",
    status: 'available',
  },
  {
    slug: 'patio',
    name: 'The Patio',
    kicker: 'Currently in renovation',
    description:
      'A covered patio between the yard and the bar. Under renovation — name and layout not final.',
    standing: null,
    seated: null,
    minimum: null,
    bestFor: ['Smaller gatherings', 'Breakout space for larger events'],
    photo: null,
    photoAlt: null,
    photoBrief: "The patio once the renovation is done — wide shot showing how it links the yard to the bar.",
    status: 'renovating',
  },
  {
    slug: 'full-buyout',
    name: 'Full Buyout',
    kicker: 'The whole place',
    description:
      'The rooftop, the yard, the patio and the trucks. Everything closed to the public and yours for the night.',
    standing: null,
    seated: null,
    minimum: null,
    bestFor: ['Holiday parties', 'Weddings and rehearsals', 'Company-wide events'],
    photo: '/images/venue-guests.jpg',
    photoAlt: 'Guests gathered at Rooftop at Riverside during a private event',
    photoBrief: "A private event in progress: rooftop and yard both busy, shot from the street side.",
    status: 'available',
  },
];

export const spaceBySlug = (slug: string) => SPACES.find((s) => s.slug === slug);

/** Tipos de evento del dropdown de `/events/inquire`. Cerrado, según el brief. */
export const EVENT_TYPES = [
  'Corporate event',
  'Holiday party',
  'Birthday or milestone',
  'Wedding or shower',
  'Fundraiser',
  'Brand activation',
  'Class reunion',
  'Full buyout',
] as const;

/** Rangos de invitados. El brief pide rangos, no un número libre. */
export const GUEST_RANGES = [
  'Under 25',
  '25 – 50',
  '50 – 100',
  '100 – 200',
  '200 – 350',
  '350+',
] as const;

/** Los tres tiers de comida. */
export const FOOD_TIERS = [
  {
    value: 'Food Truck Spread',
    label: 'Food Truck Spread',
    hint: 'Your guests order from the trucks on the night.',
  },
  {
    value: 'Catered',
    label: 'Catered',
    hint: 'A set menu, plated or buffet, coordinated with the trucks.',
  },
  {
    value: "Chef's Table",
    label: "Chef's Table",
    hint: 'A custom menu built with the truck owners for your event.',
  },
] as const;

/** Reutilizado tal cual del formulario actual de /hostanevent. */
export const REFERRAL_SOURCES = [
  'Social media',
  'Radio',
  'Referral',
  'Email',
  'Walked by',
  'Google search',
  'Other',
] as const;
