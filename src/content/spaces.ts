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

/**
 * Los tres paquetes de barra, más la salida de quien todavía no sabe.
 *
 * ⚠️ ESTA PREGUNTA FALTABA Y EL CLIENTE YA LA HACE. Su formulario de
 * `/hostanevent` tiene «Do you need drink package? Yes / No / Maybe» desde
 * siempre, y el nuestro preguntaba por la comida y nada por la bebida.
 *
 * ⚠️ NO SE COPIA EL «SÍ / NO / QUIZÁS», y es una mejora, no un capricho. Un
 * «sí» no dice nada: hay que volver a escribir para saber cuál de los tres
 * paquetes. Como `/events` ahora los publica con precio justo arriba del
 * formulario, se puede preguntar directamente CUÁL, y la respuesta ya sirve
 * para cotizar.
 *
 * ⚠️ LAS ETIQUETAS SON LAS DE `DRINK_OPTIONS` en `content/events-pricing.ts`,
 * escritas igual a propósito: quien acaba de leer las tarjetas tiene que
 * reconocer la opción en el desplegable sin traducir nada.
 */
export const BAR_TIERS = [
  'Drink tickets',
  'Wristband tab',
  'Open bar',
  'Not sure yet',
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

/* ==========================================================================
   LAS TRES FAMILIAS DE EVENTO

   ⚠️ REEMPLAZAN LA LISTA PLANA DE OCHO TIPOS de `EVENT_TYPES`, que sigue
   existiendo porque la lee el formulario viejo. Ocho opciones sin agrupar
   obligan a leerlas todas; tres familias con subtipo se eligen de un vistazo.

   ⚠️ LAS TRES SON LAS QUE PIDIÓ CAMILA el 2026-09-15: social, corporativo y
   entretenimiento. Los subtipos son los que ella enumeró, más «Full buyout»,
   que es un producto real del PDF del cliente y no encaja en ninguna de las
   tres: se alquila el lugar entero, sea para lo que sea.
   ========================================================================== */

export interface EventFamily {
  readonly id: string;
  readonly label: string;
  /** Lo que se muestra en la página. */
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

/** Todos los subtipos, planos, para validar el desplegable en el servidor. */
export const EVENT_SUBTYPES = EVENT_FAMILIES.flatMap((f) =>
  f.subtypes.map((s) => `${f.label}: ${s}`),
) as [string, ...string[]];

/**
 * Rangos de presupuesto.
 *
 * ⚠️ SON RANGOS Y NO UN CAMPO ABIERTO, y está discutido en el brief: Chris
 * propuso un dropdown por cabeza, y «Madeline y Tony advirtieron que los
 * campos de presupuesto abierto traen respuestas poco realistas». Los cortes
 * salen del piso real: el segundo piso arranca en $1.500 (dos horas a $750).
 */
export const BUDGET_RANGES = [
  'Under $1,500',
  '$1,500 – $3,000',
  '$3,000 – $6,000',
  '$6,000 – $12,000',
  'Over $12,000',
  'Not sure yet',
] as const;

/** Qué parte del lugar le interesa. Casillas, porque suelen ser varias. */
export const AREAS_OF_INTEREST = [
  { value: 'rooftop', label: 'The rooftop bar' },
  { value: 'patio', label: 'The rooftop patio' },
  { value: 'yard', label: 'The Yard, gated' },
  { value: 'stage', label: 'The stage and sound' },
  { value: 'trucks', label: 'The food trucks' },
  { value: 'game-truck', label: 'The gaming truck' },
  { value: 'buyout', label: 'The whole place' },
] as const;
