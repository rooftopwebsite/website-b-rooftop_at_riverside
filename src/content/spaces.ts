export interface Space {
  readonly slug: string;
  readonly name: string;
  readonly kicker: string;
  readonly description: string;
  readonly standing: number | null;
  readonly seated: number | null;
  readonly minimum: number | null;
  readonly bestFor: readonly string[];
  readonly photo: string | null;
  readonly photoAlt: string | null;
  readonly photoBrief: string;
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
    photo: null,
    photoAlt: null,
    photoBrief:
      "La terraza al atardecer, mirando al oeste sobre el río, con la barra y las mesas en cuadro.",
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
    photo: null,
    photoAlt: null,
    photoBrief:
      "El patio desde arriba con los cuatro trucks estacionados y el escenario armado, tomada desde la terraza.",
    status: 'available',
  },
  {
    slug: 'patio',
    name: 'The Patio',
    kicker: 'Currently in renovation',
    description:
      'A covered patio between the yard and the bar. Under renovation. Name and layout not final.',
    standing: null,
    seated: null,
    minimum: null,
    bestFor: ['Smaller gatherings', 'Breakout space for larger events'],
    photo: null,
    photoAlt: null,
    photoBrief:
      "El patio cubierto una vez terminada la reforma. Plano general que muestre cómo conecta el patio con la barra.",
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
    photo: null,
    photoAlt: null,
    photoBrief:
      "Un evento privado en curso, con la terraza y el patio llenos los dos, tomada desde la vereda.",
    status: 'available',
  },
];

export const spaceBySlug = (slug: string) => SPACES.find((s) => s.slug === slug);

export const BUYOUT_OPTIONS = [
  {
    slug: 'full-venue',
    label: 'Full venue',
    title: 'The whole place',
    body: 'The rooftop bar, the patio, the yard and the trucks, closed to the public and yours for the night.',
  },
  {
    slug: 'upstairs',
    label: 'Upstairs',
    title: 'The second floor',
    body: 'The Sunset Bar and the rooftop patio, private, with the four kitchens cooking in the yard below.',
  },
  {
    slug: 'patio',
    label: 'Patio',
    title: 'The rooftop patio',
    body: 'The open air patio next to the bar, for a smaller group that still wants the view.',
  },
] as const;

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

export const GUEST_RANGES = [
  'Under 25',
  '25 – 50',
  '50 – 100',
  '100 – 200',
  '200 – 350',
  '350+',
] as const;

export const FOOD_TIERS = [
  {
    value: 'Food Truck Spread',
    label: 'Food Truck Spread',
    hint: 'Your guests order from the trucks on the night.',
  },
  {
    value: 'Small Bites',
    label: 'Small Bites',
    hint: 'The trucks send out small bites for the whole group.',
  },
] as const;

export const BAR_TIERS = [
  'Drink tickets',
  'Wristband tab',
  'Open bar',
  'Not sure yet',
] as const;

export const REFERRAL_SOURCES = [
  'Social media',
  'Radio',
  'Referral',
  'Email',
  'Walked by',
  'Google search',
  'Other',
] as const;

export interface EventFamily {
  readonly id: string;
  readonly label: string;
  readonly title: string;
  readonly lead: string;
  readonly subtypes: readonly string[];
}

export const EVENT_FAMILIES: readonly EventFamily[] = [
  {
    id: 'social',
    label: 'Social',
    title: 'Birthdays, showers and the ones that come with a toast',
    lead: 'The rooftop faces west, so the light does the work for you around seven. Kids and dogs are fine in the yard, and nobody has to find a sitter.',
    subtypes: ['Birthday or milestone', 'Celebration', 'Class reunion', 'Wedding or shower'],
  },
  {
    id: 'corporate',
    label: 'Corporate',
    title: 'Meetings, mixers and the fundraiser you have to fill',
    lead: 'Four kitchens means nobody argues about the catering, and one point of contact means you are not chasing five vendors. The yard can be gated, so a ticketed door works.',
    subtypes: [
      'Corporate event',
      'Networking',
      'Fundraiser or benefit',
      'School gala',
      'Holiday party',
    ],
  },
  {
    id: 'entertainment',
    label: 'Entertainment',
    title: 'Shows, game days and parties with a stage',
    lead: 'There is a stage in the yard with sound already on it, and screens upstairs. Live music, a watch party or a full production all work without renting equipment in.',
    subtypes: ['Live music', 'Sports viewing', 'Party or activation', 'Full buyout'],
  },
];

export const EVENT_SUBTYPES = EVENT_FAMILIES.flatMap((f) =>
  f.subtypes.map((s) => `${f.label}: ${s}`),
) as [string, ...string[]];

export const BUDGET_RANGES = [
  'Under $1,500',
  '$1,500 – $3,000',
  '$3,000 – $6,000',
  '$6,000 – $12,000',
  'Over $12,000',
  'Not sure yet',
] as const;

export const AREAS_OF_INTEREST = [
  { value: 'rooftop', label: 'The rooftop bar' },
  { value: 'patio', label: 'The rooftop patio' },
  { value: 'yard', label: 'The Yard, gated' },
  { value: 'stage', label: 'The stage and sound' },
  { value: 'trucks', label: 'The food trucks' },
  { value: 'game-truck', label: 'The gaming truck' },
  { value: 'buyout', label: 'The whole place' },
] as const;
