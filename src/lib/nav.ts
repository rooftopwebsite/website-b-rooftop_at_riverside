import { BRAND } from '@/lib/brand';

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
   * cae el link, que es una decisión de jerarquía. Por eso vive acá y no en el
   * Header. Ver el bloque de `NAV_PRIMARY`.
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
 * Los tres visibles. El orden sigue las fuentes de ingreso, de la que factura
 * el venue hacia la que factura el vendor.
 *   Sunset Bar (nuestro) → Food Trucks → What's On
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ «EVENTS» YA NO ES UN ITEM DE LA BARRA, y no porque la página pierda
 * importancia: porque tenía DOS entradas pegadas a diez centímetros una de la
 * otra. El CTA naranja —«Plan an Event», el único botón del header— lleva a
 * `/events#inquire`, o sea a la misma página. Pedido de Camila, 2026-09-16:
 * «eliminemos Events del header dado que el CTA principal dirige a esa
 * página».
 *
 * Un link de texto que compite con el botón que está al lado suyo no suma un
 * destino, le resta peso al botón. `/events` sigue existiendo, sigue en el
 * sitemap, y se entra por el CTA, por los quick links del footer y por los
 * CTA del drawer.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ «WHAT'S ON» VA A LA DERECHA DEL MEDALLÓN, Y ESTE LINK CRUZÓ LA BARRA DOS
 * VECES EN EL MISMO DÍA. Vale dejar las dos razones escritas, porque son
 * distintas y la segunda es la que manda:
 *
 *   · 2026-09-16, a la izquierda: sacando «Events» la barra quedaba
 *     descompensada al revés, con la derecha vacía. Era un argumento de
 *     BALANCE, medido en píxeles de aire contra la caja del logo.
 *   · 2026-09-17, de vuelta a la derecha: «movamos el link este al otro lado
 *     para que el calendario y los eventos estén juntos». Es un argumento de
 *     SIGNIFICADO, y por eso gana: «What's On» es el calendario y el CTA lleva
 *     a eventos, así que las dos cosas que responden «qué pasa acá y cuándo»
 *     quedan pegadas, y la izquierda se queda con los lugares —el bar, los
 *     trucks— más el mega-menú.
 *
 * ⚠️ NO SE VUELVE A MOVER POR BALANCE. Si la barra queda cargada de un lado,
 * lo que se toca es el TAMAÑO de la letra (`--text-nav`, que tiene la tabla de
 * cuánto aire compra cada escalón) o se manda un destino a «More». Mover éste
 * rompe el par que se acaba de armar.
 * ══════════════════════════════════════════════════════════════════════════
 */
export const NAV_PRIMARY: readonly NavLink[] = [
  { label: 'Sunset Bar', href: '/sunset-bar' },
  { label: 'Food Trucks', href: '/food-trucks' },
  { label: "What's On", href: '/whats-on', side: true },
];

/**
 * Los dos lados de la barra de desktop. SE DERIVAN de `NAV_PRIMARY`, que es la
 * única lista escrita a mano: así el drawer de mobile —que los muestra a todos
 * seguidos— no puede quedar desfasado del desktop, y mover un link de lado es
 * cambiar una palabra en un solo lugar.
 *
 * ⚠️ `NAV_SIDE` ES UN ARRAY aunque hoy tenga un solo item. El Header lo mapea
 * igual que a `NAV_MAIN`, así que marcar un segundo link con `side` sale
 * gratis y no hace falta un `!` para convencer a TypeScript de que el `find`
 * encontró algo.
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
      { label: 'Blog', href: '/blog', hint: 'Stories from the rooftop, the trucks and the people.' },
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
        /* ⚠️ LA URL SALE DE `BRAND` Y NO SE ESCRIBE ACÁ. Hasta el 2026-09-22
           la `href` era el string literal `'GIFT_CARDS'`, o sea el nombre de
           la constante en vez de su valor: el único link del mega-menú que no
           navegaba a ningún lado, porque el Header lo pasa crudo a `<Link>` y
           Next lo resolvía como ruta relativa. El footer ya lo tomaba de
           `BRAND.giftCards`; ahora los dos leen el mismo lugar. */
        label: 'Gift Cards',
        href: BRAND.giftCards,
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
 * ⚠️ EL BLOG NO SE VE HASTA QUE HAYA UNA NOTA. Camila, 2026-09-23: «ocultemos
 * todo lo de blog hasta que haya al menos una nota». El layout pregunta al
 * feed y le baja `hasBlog` al Header y al Footer, que filtran sus links con
 * esto. `/blog` da 404 y sale del sitemap por el mismo motivo. El día que el
 * dashboard publica la primera nota, todo aparece solo en diez minutos.
 */
export const BLOG_HREF = '/blog';

export const sinBlog = <T extends { readonly href: string }>(links: readonly T[]): readonly T[] =>
  links.filter((l) => l.href !== BLOG_HREF);

/**
 * Los dos CTA fijos, con jerarquía distinta.
 *
 * ⚠️ NO hay «Book Now». El venue es walk-in y no toma reservas de mesa; el
 * lugar del primario lo ocupa la vertical que más factura.
 */
export const NAV_CTA = {
  /*
   * ⚠️ VA A `/events` ARRIBA Y NO A `#inquire`, desde el 2026-09-23. Camila:
   * «este CTA del header debe llevar a la página de eventos pero desde el hero,
   * no scrollear al form; los demás que invitan sí, porque queremos que vea y
   * complete directo el form». El header es navegación: quien lo aprieta
   * todavía no decidió, así que llega a la página y la lee. Los CTA de adentro
   * de las páginas —el hero de /events, las bandas de eventos— siguen yendo a
   * `#inquire`. Lo usan la barra y el botón del menú mobile.
   */
  primary: { label: 'Plan an Event', href: '/events' },
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
  '/game-truck',
  '/market',
  '/our-story',
  '/blog',
  '/join-us',
  '/contact',

  /*
   * ⚠️ HASTA EL 2026-09-23 ACÁ HABÍA NUEVE RUTAS MÁS —`/visit`,
   * `/nfc-north-hq` y siete `/events/*`— y las nueve son 301 en
   * `next.config.ts`. Mismo criterio que el de trucks y eventos en
   * `sitemap.ts`: una URL que redirige no va al sitemap. Antes de sumar una
   * línea acá, confirmar que no esté en `redirects()`.
   */

  /*
   * ⚠️ LOS TRES DOCUMENTOS DEL CAMIÓN NO ESTÁN EN NINGÚN MENÚ, y sí en esta
   * lista. No es una contradicción: `ALL_ROUTES` no es el menú, es el inventario
   * de rutas estáticas del que sale el `sitemap.ts`. El menú son `NAV_PRIMARY`
   * y `NAV_MORE`, y ahí no van: se llega a ellos desde `/game-truck`, que es
   * donde importan, y desde el pie de cada uno de los otros dos.
   *
   * Van al sitemap porque son las únicas páginas que contestan «¿hasta cuándo
   * puedo cancelar?» o «¿puedo llevar comida al camión?», que es lo que alguien
   * busca justo antes de reservar.
   */
  '/gaming-truck-policies',
  '/game-zone-waiver',
  '/bar-games-waiver',

  /*
   * ⚠️ FALTAN CUATRO RUTAS QUE SÍ EXISTEN, Y FALTAN A PROPÓSITO:
   * `/privacy-policy`, `/terms-of-service`, `/cookie-policy` y
   * `/accessibility`. Las cuatro están construidas y linkeadas desde la fila
   * legal del pie, pero su cuerpo todavía es lorem —el cliente no tiene esos
   * documentos escritos— así que van `noindex`.
   *
   * ⚠️ Y UNA RUTA `noindex` NO VA AL SITEMAP. El sitemap es una lista de URLs
   * que le pedimos a Google que indexe; incluir una que además le pide que no
   * la indexe es mandarle dos señales opuestas sobre la misma URL, que es el
   * mismo criterio que sacó de acá las rutas de trucks y eventos.
   *
   * El día que entre el texto real se sacan los `noIndex` de las cuatro
   * páginas y se agregan las cuatro líneas acá. Son los dos únicos cambios.
   */
];
