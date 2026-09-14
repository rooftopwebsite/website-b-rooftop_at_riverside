/**
 * Tokens de marca y datos del negocio de Rooftop at Riverside.
 *
 * Fuente de los colores: **brand book de Rooftop at Riverside**, página 10
 * («Expanded Palette»), más los tokens de superficie y texto que agregó el
 * sistema de diseño. Fuente de los datos: auditoría de eatdrinkparadise.com
 * del 2026-09-08, cruzada contra el brief. Ver `docs/current-site-inventory.md`.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ DÓNDE VIVE DE VERDAD LA PALETA, y por qué esto no es una copia suelta.
 *
 * Lo que RENDERIZA es el bloque `@theme` de `src/app/globals.css`. Tailwind v4
 * es CSS-first —no existe `tailwind.config.ts`— y no se puede importar un `.ts`
 * dentro de `@theme`, así que el archivo que pinta es ése y no éste.
 *
 * Este objeto existe para que la paleta sea legible desde TypeScript y para
 * documentar las reglas de uso, que el CSS no puede expresar. Y para que no se
 * vuelva a desincronizar, **`npm run check:tokens` falla si los dos archivos
 * divergen**.
 *
 * Ese guard se agregó porque la divergencia ya había pasado, en silencio y con
 * consecuencias: este objeto declaraba `paper: '#FFFFFF'` e `ink: '#000000'`
 * mientras el sitio pintaba `#FDFCF7` y `#0A1F1E`, y `scripts/contrast.mjs`
 * arrastraba la misma copia vieja — así que TODOS los ratios documentados
 * estaban calculados contra colores que el sitio no usaba. Ver
 * `design-audit/AUDIT.md` §3.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ LA LEY DEL COLOR, revisada en `redesign/light-tropical`: el sitio es
 * MAYORMENTE CLARO, el texto es el verde de marca llevado a casi negro, y el
 * oscuro es la excepción —dos zonas en toda la home, nunca dos seguidas—. Los
 * ratios medidos están en `design-audit/CONTRASTE.md`, que los genera leyendo
 * `globals.css`.
 */

export const COLORS = {
  /** «Sunset Orange». CTA primario, con texto NEGRO encima. Nunca como texto sobre claro. */
  sunset: '#F58521',
  /** Un paso más oscuro, sólo para el hover del CTA primario. */
  'sunset-hover': '#E0741A',
  /** «River Teal». Isotipo, iconografía, patrón gráfico. Nunca como texto. */
  river: '#0EB6B8',
  /** El amarillo del brand book. Píldoras y botones sobre oscuro. NO fondos grandes. */
  cream: '#FDF0B4',
  mint: '#C4F2EC',
  /** La superficie oscura: la banda de Events y el footer. Y nada más en la home. */
  deep: '#014545',
  /** Un peldaño más oscuro, para capas dentro de una losa. El header. */
  deeper: '#013434',
  teal600: '#028382',
  tomato: '#EB452C',
  /** Rojo de error y de dato pendiente sobre superficie clara. 7.43:1 sobre `paper`. */
  terra: '#A62000',
  /**
   * Acento de titular sobre superficie clara. Es `sunset` con el mismo tono y
   * la misma saturación, 10 puntos más oscuro: 3.54:1 sobre `paper`.
   * ⚠️ Sólo dentro de un titular de display — pasa texto grande, no cuerpo.
   */
  'sunset-deep': '#D66A0A',
  /** El rojo de error sobre superficie OSCURA. 6.14:1 sobre `deeper`, 4.88:1 sobre `deep`. */
  'tomato-soft': '#FF8F7A',
  plum: '#402639',
  magenta: '#A24584',
  /** Titulares sobre claro. Es `deep` llevado a casi negro: el texto pertenece a la marca. */
  ink: '#0A1F1E',
  /** Cuerpo de texto. MISMO valor que `ink`; los dos tokens se mantienen separados. */
  body: '#0A1F1E',
  /** La base. Blanco puro. */
  paper: '#FFFFFF',
  /** Segunda superficie clara. Es `cream` desaturado: 1.08:1 contra `paper`. */
  bone: '#FAF6EA',
  /** Bajadas y texto secundario. El más claro que aún pasa AA en las tres superficies claras. */
  muted: '#487270',
  /**
   * El mismo rol que `muted`, pero sobre la banda oscura: 5.95:1 contra `deep`.
   * ⚠️ Un token opaco no se adapta a la superficie, así que la bajada necesita
   * los dos valores. Se eligen solos vía `--lead-ink` / `.on-dark`.
   */
  'muted-dark': '#A8C6C4',
  /** Filetes y bordes de 1px. Calibrado sobre blanco. */
  fog: '#DED8C7',
} as const;

/**
 * Restricciones de accesibilidad. Todas MEDIDAS con luminancia relativa
 * (WCAG 2.1) por `design-audit/contraste.mjs`, que lee la paleta de
 * `globals.css`. La tabla completa está en `design-audit/CONTRASTE.md`.
 *
 * El problema de fondo: `sunset` y `river` son tonos medios con luminancia casi
 * idéntica — 2.54:1 y 2.50:1 sobre `paper`. Ninguno llega a AA como texto sobre
 * fondo claro, en ningún tamaño. Y sobre `bone` es todavía peor: 2.35:1.
 */
export const COLOR_RULES = {
  /** Nunca como color de TEXTO sobre fondo claro. Sí como superficie. */
  neverAsTextOnLight: ['sunset', 'river'],
  /** Sobre naranja o sobre teal, el texto va en NEGRO (8.26:1 y 8.40:1). Nunca en blanco. */
  textOnBrandFill: '#000000',
  /** Texto de color admitido sobre `paper`. */
  colorTextOnPaper: ['ink', 'body', 'muted', 'deep', 'plum', 'terra', 'magenta', 'teal600'],
  /**
   * Texto de color admitido sobre `bone`, la segunda superficie clara.
   * ⚠️ `teal600` SALE de esta lista: sobre `cream` da 4.00:1 y no llega al
   * 4.5:1 de AA para cuerpo. El valor que lo habilita es sobre `paper`.
   */
  colorTextOnBone: ['ink', 'body', 'muted', 'deep', 'plum', 'terra', 'magenta'],
  /** Sobre `deep` el texto va en `paper` o en `cream` (10.83:1 y 9.44:1). */
  textOnDeep: ['paper', 'cream'],
  /**
   * El acento del titular es a DOS colores según la superficie, y máximo en
   * dos titulares de la home.
   */
  headlineAccent: { onLight: 'sunset-deep', onDark: 'sunset' },
  /**
   * ⚠️ `sunset` sobre `deep` da 4.26:1: pasa el 3:1 de texto grande, NO el
   * 4.5:1 de cuerpo. Sirve para una palabra de un titular, no para una bajada.
   */
  displayOnly: ['sunset on deep', 'sunset-deep on paper', 'sunset-deep on bone'],
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

  /**
   * El perfil de organizador en Eventbrite.
   *
   * El ticketing lo gestiona el cliente —el cuestionario de onboarding lo deja
   * por escrito: «EventBrite se queda del lado del cliente para ticketing;
   * nosotros hacemos creative y promoción»—, así que el sitio NO construye
   * checkout: manda afuera y listo.
   *
   * ⚠️ LA URL LA ENCONTRAMOS NOSOTROS, no la pasó el cliente. Sale del HTML de
   * un evento suyo real (Freedom & Fireworks, 4 de julio) y el perfil responde
   * 200 con el nombre exacto del venue. **Confirmar con el cliente igual.**
   *
   * ⚠️ Y OJO CON EL COPY QUE LA USA: el perfil hoy dice «No upcoming events».
   * Usan Eventbrite para los eventos grandes y puntuales, no para los
   * recurrentes semanales, que son gratis. Un botón que prometa entradas para
   * cualquier noche manda a una página vacía.
   */
  eventbrite: 'https://www.eventbrite.com/o/rooftop-at-riverside-104153700851' as string | null,

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
