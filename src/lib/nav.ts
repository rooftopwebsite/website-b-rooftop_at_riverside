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
  /**
   * Pastilla al lado del título, sólo en el mega-menú.
   *
   * ⚠️ ES UN DATO Y NO UN ESTILO, y por eso vive acá y no en el componente:
   * «New» caduca. Cuando el Game Lounge deje de ser lo último que abrió se
   * borra esta línea y la pastilla desaparece sin tocar el Header.
   */
  readonly badge?: string;
  /** Abre en otra pestaña. Se anuncia por texto además del icono. */
  readonly external?: boolean;
}

/**
 * Un bloque del mega-menú: un rótulo de categoría y los links que cuelgan.
 *
 * ⚠️ EL RÓTULO NO ES UN LINK y no tiene que serlo. No existe una página «The
 * Place» ni «Work With Us»: son etiquetas que agrupan, no destinos. El día
 * que una categoría gane su propia página, se le suma un `href` acá.
 */
export interface NavGroup {
  readonly label: string;
  readonly links: readonly NavLink[];
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

/**
 * El mega-menú «More», en tres bloques rotulados.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ DEJÓ DE SER UNA LISTA PLANA. Eran ocho links del mismo peso en una
 * grilla de cuatro columnas, y ocho cosas sin jerarquía no son un menú: son
 * un índice. El orden de lectura tampoco decía nada, porque la grilla era
 * `auto-fit` y repartía por ancho de pantalla — «Contact» podía terminar
 * arriba de «Our Story» según el monitor.
 *
 * Los tres bloques responden a las tres razones por las que alguien abre este
 * menú: quiere saber QUÉ ES esto, quiere venir, o quiere trabajar con
 * nosotros. Cada bloque es una columna fija, así que el orden es siempre el
 * mismo y se aprende.
 *
 * ⚠️ EL ORDEN DE LOS BLOQUES ES EL DEL EMBUDO — curiosidad, visita, vínculo.
 * No es alfabético ni por cantidad de items.
 * ══════════════════════════════════════════════════════════════════════════
 */
export const NAV_MORE_GROUPS: readonly NavGroup[] = [
  {
    label: 'The Place',
    links: [
      {
        label: 'Our Story',
        href: '/our-story',
        hint: 'The Magnus family and four years of planning.',
      },
      {
        label: 'The Experience',
        href: '/the-experience',
        hint: "The Game Lounge and Southwest Florida's first gaming truck.",
        badge: 'New',
      },
      { label: 'Market', href: '/market', hint: 'Local vendors and handmade goods in the yard.' },
    ],
  },
  {
    label: 'Plan Your Visit',
    links: [
      { label: 'Visit', href: '/visit', hint: 'Hours, parking and directions.' },
      { label: 'FAQ', href: '/faq', hint: 'Parking, dogs, kids and how ordering works.' },
      {
        label: 'Events Packet',
        href: '/events/inquire',
        hint: 'Spaces, capacities and food tiers, as a PDF.',
      },
    ],
  },
  {
    label: 'Work With Us',
    links: [
      { label: 'Join Us', href: '/join-us', hint: 'Play here, park a truck here, work here.' },
      { label: 'Contact', href: '/contact', hint: 'Three inboxes, so you reach the right one.' },
    ],
  },
];

/**
 * La pieza destacada del mega-menú: la cuarta columna.
 *
 * ⚠️ POR QUÉ ESTA PÁGINA. `/nfc-north-hq` existe, está en el sitemap y no la
 * linkeaba NADIE — ni la nav, ni el footer, ni el mega-menú viejo. Era una
 * página huérfana. La tarjeta le da la única puerta de entrada que tiene, y
 * de paso le da al menú algo que mirar que no sea una grilla de texto.
 *
 * ⚠️ EL LABEL ES EL MISMO QUE EL BREADCRUMB de la página, a propósito. Esa
 * página tiene la restricción legal más dura del proyecto (ver su encabezado)
 * y acá no se inventa una forma nueva de nombrarla.
 *
 * ⚠️ SE ROTA. Es un solo objeto justamente para que cambiarlo sea cambiar
 * cuatro strings: cuando arranque la temporada de eventos, acá va otra cosa.
 */
export const NAV_MORE_FEATURED = {
  eyebrow: 'Featured',
  label: 'NFC North HQ',
  href: '/nfc-north-hq',
  hint: "Sundays in season. Sound on, screens up, and a rooftop that turns into somebody's hometown bar.",
  cta: 'See Sundays',
} as const;

/**
 * El mega-menú aplanado.
 *
 * ⚠️ SE DERIVA, NO SE ESCRIBE. Lo consumen el drawer de mobile —que va en una
 * sola lista— y el chequeo de «¿estoy parado en una página del More?» del
 * Header. Si fuera una segunda lista escrita a mano, el día que un link
 * cambie de bloque uno de los dos lados se queda viejo y nadie se entera.
 */
export const NAV_MORE: readonly NavLink[] = NAV_MORE_GROUPS.flatMap((g) => g.links);

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
