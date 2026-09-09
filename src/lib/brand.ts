/**
 * Tokens de marca y datos del negocio de Rooftop at Riverside.
 *
 * Fuente de los colores: **brand book de Rooftop at Riverside**, página 10
 * («Expanded Palette»). Los 12 valores verificados uno a uno contra el libro.
 * Fuente de los datos: auditoría de eatdrinkparadise.com del 2026-09-08,
 * cruzada contra el brief. Ver `docs/current-site-inventory.md`.
 *
 * ⚠️ LA LEY DEL COLOR. El sitio es blanco, el texto es negro y el color es
 * puntuación, no superficie. Esta paleta lista colores AUTORIZADOS, no
 * obligatorios. Las restricciones duras están abajo, en COLOR_RULES, y los
 * ratios verificados en `docs/contrast-audit.md`.
 */

export const COLORS = {
  /** «Sunset Orange». CTA primario (texto NEGRO encima), hover de links, un bloque de acento por página. */
  sunset: '#F58521',
  /** «River Teal». Isotipo, iconografía, patrón gráfico. Nunca como texto. */
  river: '#0EB6B8',
  /** La única superficie de color grande permitida. Una o dos secciones por página. */
  cream: '#FDF0B4',
  mint: '#C4F2EC',
  /** La única superficie oscura permitida: sección del Sunset Bar y footer. */
  deep: '#014545',
  teal600: '#028382',
  tomato: '#EB452C',
  terra: '#A62000',
  plum: '#402639',
  magenta: '#A24584',
  /** «Nightlife Black». */
  ink: '#000000',
  /** «Cloud White». */
  paper: '#FFFFFF',
  /** Cuerpo de texto. El brief autoriza #0A0A0A además del negro puro. */
  body: '#0A0A0A',
} as const;

/**
 * Restricciones de accesibilidad, verificadas con cálculo de luminancia
 * relativa (WCAG 2.1). Los números están en `docs/contrast-audit.md`.
 *
 * El problema de fondo: `sunset` y `river` son tonos medios con luminancia casi
 * idéntica — 2.54:1 y 2.50:1 sobre blanco. Ninguno llega a AA como texto sobre
 * fondo claro, en ningún tamaño.
 */
export const COLOR_RULES = {
  /** Nunca como color de TEXTO sobre fondo claro. Sí como superficie. */
  neverAsTextOnLight: ['sunset', 'river'],
  /** Sobre naranja o sobre teal, el texto va en NEGRO (8.26:1 y 8.40:1). Nunca en blanco. */
  textOnBrandFill: COLORS.ink,
  /** Texto de color admitido sobre BLANCO. */
  colorTextOnWhite: ['deep', 'plum', 'terra', 'teal600', 'magenta'],
  /**
   * Texto de color admitido sobre CREMA.
   * ⚠️ `teal600` SALE de esta lista: sobre crema da 4.00:1, no llega al 4.5:1
   * de AA para cuerpo. El 4.59:1 que lo habilita es sobre blanco, no sobre crema.
   */
  colorTextOnCream: ['deep', 'plum', 'terra', 'magenta'],
  /** Sobre `deep` el texto va en blanco o en crema. */
  textOnDeep: [COLORS.paper, COLORS.cream],
} as const;

export interface Hours {
  readonly day: string;
  readonly bar: string;
  readonly trucks: string;
}

/** Los dos sets. La barra y los food trucks tienen horarios distintos. */
export const HOURS: readonly Hours[] = [
  { day: 'Monday', bar: 'Closed', trucks: 'Closed' },
  { day: 'Tuesday', bar: 'Closed', trucks: 'Closed' },
  { day: 'Wednesday', bar: '3:00 PM – 8:00 PM', trucks: '4:00 PM – 8:00 PM' },
  { day: 'Thursday', bar: '3:00 PM – 8:00 PM', trucks: '4:00 PM – 8:00 PM' },
  { day: 'Friday', bar: '3:00 PM – 12:00 AM', trucks: '4:00 PM – 11:00 PM' },
  { day: 'Saturday', bar: '11:00 AM – 2:00 AM', trucks: '12:00 PM – 11:00 PM' },
  { day: 'Sunday', bar: '11:00 AM – 8:00 PM', trucks: '12:00 PM – 8:00 PM' },
];

/**
 * Horarios en formato ISO 8601 para el JSON-LD (`openingHours`).
 * Sábado cierra a las 2 AM del domingo; schema.org lo acepta como 02:00
 * en la fila del sábado, que es la convención que usa Google.
 */
export const HOURS_SCHEMA = [
  'We 15:00-20:00',
  'Th 15:00-20:00',
  'Fr 15:00-24:00',
  'Sa 11:00-02:00',
  'Su 11:00-20:00',
] as const;

export const HAPPY_HOUR = {
  days: 'Wednesday – Friday',
  time: '3–6 PM',
  deals: ['$4 drafts', '$5 house wines', '$6 house drinks'],
} as const;

export const BRAND = {
  name: 'Rooftop at Riverside',
  shortName: 'Rooftop',
  group: 'Paradise Food Group',
  /** Lo que ES. No es un restaurante. */
  concept: 'Rooftop bar over a curated food truck park in downtown Bonita Springs',
  opened: 'January 2024',

  contact: {
    phone: '(239) 268-0080',
    phoneHref: 'tel:+12392680080',
    email: 'info@eatdrinkparadise.com',
    events: 'events@eatdrinkparadise.com',
    hiring: 'hiring@eatdrinkparadise.com',
  },

  address: {
    street: '27333 Old 41 Rd',
    locality: 'Bonita Springs',
    region: 'FL',
    postalCode: '34135',
    country: 'US',
    /** Downtown Bonita Springs, frente a Riverside Park. */
    neighborhood: 'Downtown Bonita Springs, across from Riverside Park',
    timezone: 'America/New_York',
    /**
     * Tomadas del Google Business Profile vía el dashboard interno, no estimadas.
     * El GBP está vinculado (maps.google.com/?cid=17116543045499348377).
     */
    geo: { lat: 26.3407274, lng: -81.778603 } as { lat: number; lng: number } | null,
    mapsQuery: '27333+Old+41+Rd,+Bonita+Springs,+FL+34135',
  },

  social: {
    instagram: 'https://www.instagram.com/rooftopatriverside/',
    facebook: 'https://www.facebook.com/people/Rooftop-at-Riverside/100075964505890/',
    /**
     * El Google Business Profile, por su `cid`. Sale del dashboard interno, que
     * lo tiene vinculado — no es una búsqueda armada a mano, así que apunta a
     * la ficha real y no a un resultado parecido.
     */
    google: 'https://maps.google.com/?cid=17116543045499348377',
    /** No tienen. No inventar handle. */
    tiktok: null,
  },

  /** Toast. Es el único enlace de comercio que existe hoy en el sitio. */
  giftCards:
    'https://www.toasttab.com/rooftop-and-riverside-new-27333-old-41-road/giftcards',

  /** ⚠️ Pendiente: el cliente gestiona el ticketing y todavía no pasó la URL. */
  eventbrite: null as string | null,

  credit: { label: 'Resto Experience', url: 'https://restoexp.com' },
} as const;

/**
 * La agencia, para la barra del pie.
 *
 * ⚠️ `BRAND.credit` ya tenía la etiqueta y la URL y se queda donde está: lo usa
 * el `<meta name="author">` del layout. Esto es lo que necesita ADEMÁS la barra
 * «powered by» —el tagline y el año—, que en los otros sitios de la casa vive
 * en su propia constante.
 *
 * El año se calcula al renderizar. Es un server component y el sitio se
 * regenera en cada build, así que no hay riesgo de que quede un año viejo
 * cacheado en el cliente.
 */
export const AGENCY = {
  url: 'https://restoexp.com',
  label: 'Resto Experience',
  tagline: 'Content, marketing & web design',
} as const;

export const SEO_LOCAL = {
  primary: 'Bonita Springs',
  secondary: ['Naples', 'Estero'],
} as const;

/** Dirección en una línea, para el footer y el JSON-LD. */
export function addressLine(): string {
  const a = BRAND.address;
  return `${a.street}, ${a.locality}, ${a.region} ${a.postalCode}`;
}

export function mapsUrl(): string {
  return `https://www.google.com/maps/search/?api=1&query=${BRAND.address.mapsQuery}`;
}
