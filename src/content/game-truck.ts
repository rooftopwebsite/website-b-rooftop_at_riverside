/**
 * EL GAMING TRUCK.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ TODO ESTO SALE DEL SITIO VIGENTE DEL CLIENTE, volcado en
 * `content/_source/game-lounge.md` y `content/_source/game-zone-waiver.md` el
 * 2026-09-15. Los precios, los paquetes, la lista de juegos y los montos de
 * reposición son textuales. Nada está estimado.
 *
 * ⚠️ ES UN CAMIÓN, NO UNA SALA. El copy del cliente dice «right in our
 * specially designed truck» y titula «SWFL's First Gaming Truck Has Arrived».
 * Por eso la ruta es `/game-truck` y no `/game-room`.
 *
 * ⚠️ LAS CANTIDADES DE CONSOLAS NO SE PUBLICAN. El sitio dice «six
 * high-definition TVs» con Xbox Series X, PS5 y Switch 2 sin contar unidades;
 * el brief dice «4 PS5, 4 Xbox Series X, 2 Switch 2». No coinciden, así que
 * `pantallas` y `consolas` van con lo que dice el SITIO y el conteo por
 * consola queda afuera hasta que el cliente confirme.
 * TODO: confirmar con cliente cuántas consolas y cuántas pantallas hay.
 * ══════════════════════════════════════════════════════════════════════════
 */

export interface GameTruckRate {
  readonly label: string;
  readonly price: number;
  readonly unit: string;
  readonly note: string | null;
}

export interface PartyPackage {
  readonly slug: string;
  readonly name: string;
  readonly days: string;
  readonly hours: number;
  readonly price: number;
  readonly extraHour: number;
  /** Lo que lo diferencia del otro paquete. Ver la nota de abajo. */
  readonly diferencias: readonly string[];
}

/** Lo que cuesta jugar sin reservar. Sitio vigente, textual. */
export const RATES: readonly GameTruckRate[] = [
  { label: 'First 30 minutes', price: 10, unit: 'per person', note: 'plus tax' },
  { label: 'Every 15 minutes after that', price: 5, unit: 'per person', note: null },
];

/**
 * Los dos paquetes de fiesta.
 *
 * ⚠️ LA COMPARACIÓN MUESTRA LAS DIFERENCIAS REALES y no dos tarjetas iguales
 * con otro precio. Pedido de Camila. Y las diferencias son exactamente dos:
 * QUÉ DÍAS y CUÁNTO CUESTA LA HORA EXTRA. Todo lo demás —las dos horas, el
 * Game Coach, los juegos, las pantallas— es idéntico, y decirlo así es más
 * honesto que inventarle beneficios distintos a cada uno.
 */
export const PACKAGES: readonly PartyPackage[] = [
  {
    slug: 'weeknight',
    name: 'Weeknight party',
    days: 'Monday – Thursday',
    hours: 2,
    price: 400,
    extraHour: 200,
    diferencias: ['Monday through Thursday', 'Extra hour at $200'],
  },
  {
    slug: 'weekend',
    name: 'Weekend party',
    days: 'Friday – Sunday',
    hours: 2,
    price: 500,
    extraHour: 250,
    diferencias: ['Friday through Sunday', 'Extra hour at $250'],
  },
];

/**
 * Las pantallas del camión. Sitio vigente: «six high-definition TVs».
 *
 * ⚠️ SE DECLARA ACÁ ARRIBA Y NO ABAJO CON EL RESTO DE LAS CIFRAS, y no es
 * cosmético: `PACKAGE_INCLUDES` la interpola, y un `const` de módulo usado
 * antes de su declaración queda en la zona muerta temporal. TypeScript lo
 * marca —TS2448, «used before its declaration»— pero si se le escapara, el
 * error saldría recién al cargar la página, con un 500.
 */
export const SCREENS = 6;

/**
 * Lo que traen los dos paquetes, igual en ambos.
 *
 * ⚠️ LOS CUATRO PRIMEROS SON LA LISTA «INCLUDES» DEL SITIO VIGENTE, ítem por
 * ítem. El quinto, el aire acondicionado, NO está en esa lista: sale del brief,
 * y hasta el 2026-09-22 este comentario decía que todo venía del sitio, que era
 * falso. Queda porque el dato es real y está verificado; queda anotado de dónde
 * viene porque es lo que permite auditarlo.
 *
 * ⚠️ «Physical games plus the subscription libraries» SE HABÍA PERDIDO. Es el
 * cuarto ítem de la lista del cliente —«Physical Game Inventory, PLUS
 * Subscription Inventory»— y no estaba en ningún lado del sitio nuevo. Lo
 * encontró la auditoría del 2026-09-22 comparando contra `_source/game-lounge.md`
 * y contra la página en vivo, que coinciden.
 *
 * ⚠️ EL CONTEO DE TELEVISORES VUELVE A ESTA LISTA. El cliente lo pone acá
 * —«6 TVs – Xbox Series X, PS6, Switch 2»— y nosotros lo teníamos sólo en la
 * ficha técnica. Es el mismo número de `SCREENS`, leído de ahí y no escrito dos
 * veces.
 *
 * ⚠️ «PS6» ES UN ERROR DE TIPEO DEL CLIENTE y no se copia: la descripción de su
 * propia página dice «PlayStation 5» tres párrafos más arriba, y el PDF de
 * políticas repite la errata. Publicamos la consola que existe.
 */
export const PACKAGE_INCLUDES: readonly string[] = [
  'Two hours in the truck',
  'A Game Coach on site the whole time',
  `${SCREENS} TVs with Xbox Series X, PlayStation 5 and Nintendo Switch 2`,
  'Over 30 games, from E-rated to M-rated',
  'Physical games plus the subscription libraries',
  'Air conditioning',
];

/**
 * Los juegos, tal como los lista el cliente.
 *
 * ⚠️ SON LOS 23 QUE PUBLICA, y el sitio dice «30+». No se completan los que
 * faltan: la lista es la que hay.
 * TODO: confirmar con cliente la lista completa de juegos.
 */
export const GAMES: readonly string[] = [
  'NBA 2K26',
  'Madden 26',
  'College Football 26',
  'EA Sports FC 25',
  'PGA Tour 2K25',
  'MLB The Show 25',
  'NHL 25',
  'UFC 5',
  'Star Wars Outlaws',
  'Call of Duty Modern Warfare III',
  'Call of Duty Black Ops 6',
  'GTA V',
  'Mortal Kombat 11',
  'F1 25',
  'Big Buck Hunter',
  'Donkey Kong Bonanza',
  'Kirby and the Forgotten Land',
  'Mario Golf',
  'Switch Sports',
  'Super Smash Bros',
  'Mario World',
  'Fortnite',
  'Minecraft',
];

export const GAMES_TOTAL = '30+';
export const CONSOLES: readonly string[] = [
  'Xbox Series X',
  'PlayStation 5',
  'Nintendo Switch 2',
];

/*
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ACÁ VIVÍAN `POLICIES`, `publishedPolicies()` Y `WAIVERS`, Y SE FUERON EL
 * 2026-09-22 CON LA SECCIÓN QUE LOS RENDERIZABA.
 *
 * `POLICIES` eran siete reglas RESUMIDAS por nosotros a partir de los dos
 * waivers y del PDF de políticas del cliente, cada una con su cita textual en
 * el campo `source`. `WAIVERS` eran los tres links, los tres al dominio viejo
 * —`eatdrinkparadise.com`—, con un TODO escrito acá que decía «migrar los dos
 * waivers y el PDF de políticas al dominio nuevo».
 *
 * ⚠️ ESE TODO ES LO QUE SE HIZO, y por eso el resumen sobra. Los tres
 * documentos ahora son tres páginas nuestras con el texto del cliente TEXTUAL:
 *
 *     /gaming-truck-policies   ← el PDF, que antes ni siquiera tenía URL
 *     /game-zone-waiver        ← el del camión
 *     /bar-games-waiver        ← el de los juegos de la barra
 *
 * El texto vive en `content/legal/` y el índice en `content/legal-docs.ts`.
 *
 * ⚠️ Y UN RESUMEN AL LADO DEL ORIGINAL ES UNA TRAMPA. Mientras los documentos
 * estaban en el sitio viejo, parafrasearlos era la única forma de que el
 * visitante supiera a qué se compromete. Con los tres publicados enteros, las
 * siete reglas eran una segunda versión de un texto legal, más corta, más
 * linda y sin valor: el día que el cliente cambie una cláusula, la que queda
 * vieja es la de la página que todo el mundo lee.
 *
 * Ni un dato se perdió. Los $25, los $100, los 14 días, los $125 del joystick
 * y la regla de los juegos M están en las tres páginas nuevas con las palabras
 * del cliente, no con las nuestras.
 * ══════════════════════════════════════════════════════════════════════════
 */

/*
 * ⚠️ EL ÚNICO HUECO QUE SIGUE ABIERTO: LA EDAD MÍNIMA PARA JUGAR.
 *
 * Era la séptima entrada de `POLICIES`, con `source: null` y el cuerpo vacío
 * para que no se renderizara. La lista se fue, pero la pregunta no está
 * contestada y por eso queda anotada acá:
 *
 * TODO: confirmar con el cliente la edad mínima para jugar en el camión. Ni
 * los dos waivers ni el PDF de políticas fijan una edad. Lo más cerca que
 * está el waiver del camión es «we recommend that the youngest age group we
 * accept party bookings for is age 6. However, we will accept younger parties
 * if requested», que es una recomendación para RESERVAR una fiesta, no un
 * mínimo para jugar. El «21 and over» del otro waiver es de los juegos de la
 * barra, que son otra cosa. Está en `docs/pedido-al-cliente.md`.
 */
