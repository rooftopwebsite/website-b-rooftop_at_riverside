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
  /**
   * Sólo en `NAV_PRIMARY`: en DESKTOP este destino no va en la nav de la
   * izquierda, va suelto a la derecha, pegado al CTA. En mobile no cambia
   * nada: el drawer los lista a todos en el mismo orden.
   *
   * ⚠️ ES UN DATO DE NAVEGACIÓN, no un estilo: dice de qué lado del medallón
   * cae el link, que es una decisión de jerarquía y de espacio. Por eso vive
   * acá y no en el Header. Ver el bloque de `NAV_PRIMARY`.
   */
  readonly side?: boolean;
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
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ SON CINCO DESTINOS PERO EN DESKTOP NO VAN LOS CINCO DEL MISMO LADO.
 * «What's On» sale marcado con `side` y el Header lo dibuja a la derecha del
 * medallón, en el lugar donde estaba «Contact».
 *
 * El motivo es de espacio y está medido en el `desk` más chico (1344px), que
 * es donde la nav horizontal recién aparece:
 *
 *                              nav → logo    logo → derecha
 *     los cinco a la izquierda     62px          334px
 *     con «What's On» del otro    147px          315px
 *
 * O sea que la barra estaba cargada de un solo lado: cinco items más «More»
 * terminaban a 62px de la caja del logo —a un ojo se lee como pegado— mientras
 * el otro lado tenía 334px de aire con un link de texto y el CTA. Moviendo uno
 * de los cinco, la izquierda más que duplica su aire y la derecha se llena.
 *
 * ⚠️ Las dos columnas se miden contra la CAJA del logo, que son 120px fijos
 * (`desk:size-30`), y no contra el dibujo. Contra la tinta del lockup —75px de
 * ancho— el aire de la izquierda es de 169px.
 *
 * ⚠️ Y EL QUE SE MUEVE ES «WHAT'S ON» Y NO OTRO. Los otros cuatro son los
 * cuatro espacios físicos del lugar —el bar, los trucks, los eventos, el
 * patio— y se leen como una lista. «What's On» no es un espacio: es la
 * agenda, y funciona igual de bien al lado del CTA porque las dos cosas son
 * «qué hago hoy acá». Es también el `NAV_CTA.secondary` de siempre.
 *
 * ⚠️ «CONTACT» NO SE PIERDE, cambia de lugar: queda en el bloque «Work With
 * Us» del mega-menú, en el footer y en los dos CTA del drawer. Ninguna de las
 * tres es nueva, ya estaba en las tres. Lo que se saca es la CUARTA copia, la
 * de la barra, que era la que menos hacía falta: nadie entra al sitio de un
 * restaurante buscando «Contact» en la nav, y el CTA naranja de al lado ya
 * lleva al formulario que importa.
 * ══════════════════════════════════════════════════════════════════════════
 */
export const NAV_PRIMARY: readonly NavLink[] = [
  { label: 'Sunset Bar', href: '/sunset-bar' },
  { label: 'Food Trucks', href: '/food-trucks' },
  { label: "What's On", href: '/whats-on', side: true },
  { label: 'Events', href: '/events' },
];

/**
 * Los dos lados de la barra de desktop. SE DERIVAN de `NAV_PRIMARY`, que es
 * la única lista escrita a mano: así el drawer de mobile —que los muestra a
 * todos seguidos— no puede quedar desfasado del desktop, y mover un link de
 * lado es cambiar una palabra en un solo lugar.
 *
 * ⚠️ `NAV_SIDE` es un ARRAY y no un objeto suelto, aunque hoy tenga un solo
 * item. El Header lo mapea igual que a `NAV_MAIN`, así que sale gratis marcar
 * un segundo link con `side` el día que haga falta, y no hace falta un `!`
 * para convencer a TypeScript de que el `find` encontró algo.
 */
export const NAV_MAIN: readonly NavLink[] = NAV_PRIMARY.filter((l) => !l.side);
export const NAV_SIDE: readonly NavLink[] = NAV_PRIMARY.filter((l) => l.side);

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
    label: 'Get to know us',
    links: [
      {
        label: 'About',
        href: '/our-story',
        hint: 'The Magnus family, what this place is, and the questions.',
      },
      { label: 'Join Us', href: '/join-us', hint: 'Play here, park a truck here, work here.' },
      { label: 'Contact', href: '/contact', hint: 'Three inboxes, hours, parking and the map.' },
    ],
  },
  {
    label: 'While you’re here',
    links: [
      {
        label: 'Gaming Truck',
        href: '/game-truck',
        hint: 'Three consoles, six screens and a Game Coach. Parties too.',
      },
      { label: 'Market', href: '/market', hint: 'Local vendors and handmade goods in the yard.' },
      {
        label: 'Gift Cards',
        href: 'GIFT_CARDS',
        external: true,
        hint: 'Any amount, good at the bar and every truck.',
      },
    ],
  },
];

/**
 * La pieza destacada del mega-menú: la cuarta columna.
 *
 * ⚠️ APUNTA AL CALENDARIO Y YA NO A UNA PÁGINA PROPIA. Era `/nfc-north-hq`,
 * una landing de los domingos de fútbol que existía, estaba en el sitemap y no
 * la linkeaba nadie más que esta tarjeta.
 *
 * Revisando qué páginas secundarias tiene que tener el sitio, Camila la mandó
 * al calendario —«domingos de fútbol debería ser un evento recurrente del
 * calendario»— con una condición: «irán en calendario pero con un espacio o
 * card grande, mucho más destacada». Ahora es un evento con el tag
 * `featured`, y `FeaturedEvent` le da esa card grande al abrir `/whats-on`.
 *
 * ⚠️ SE ROTA. Es un solo objeto justamente para que cambiarlo sea cambiar
 * cuatro strings: cuando termine la temporada, acá va otra cosa.
 */
export const NAV_MORE_FEATURED = {
  eyebrow: 'Featured',
  label: 'NFC North HQ',
  href: '/whats-on',
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
  primary: { label: 'Plan an Event', href: '/events#inquire' },
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
  { label: 'Events Packet', href: '/events#inquire' },
  { label: 'Event Spaces', href: '/events#spaces' },
  { label: 'Corporate Events', href: '/events#corporate' },
  { label: 'Join Us', href: '/join-us' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Gift Cards', href: 'GIFT_CARDS', external: true },
  { label: 'Careers', href: '/join-us#work' },
];

export const ALL_ROUTES: readonly string[] = [
  '/',
  '/sunset-bar',
  '/food-trucks',
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
  '/game-truck',
  '/market',
  '/our-story',
  '/join-us',
  '/visit',
  '/contact',
];
