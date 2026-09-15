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

/** Lo que traen los dos paquetes, igual en ambos. Sitio vigente. */
export const PACKAGE_INCLUDES: readonly string[] = [
  'Two hours in the truck',
  'A Game Coach on site the whole time',
  'Xbox Series X, PlayStation 5 and Nintendo Switch 2',
  'Over 30 games, from E-rated to M-rated',
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
export const SCREENS = 6;
export const CONSOLES: readonly string[] = [
  'Xbox Series X',
  'PlayStation 5',
  'Nintendo Switch 2',
];

export interface Policy {
  readonly title: string;
  readonly body: string;
  /** De dónde sale. `null` = no tiene fuente y no se publica. */
  readonly source: string | null;
}

/**
 * LAS POLÍTICAS.
 *
 * ⚠️ SALEN DE LOS DOS WAIVERS QUE EL CLIENTE YA PUBLICA, no de lo que suele
 * poner un lugar así. `/game-zone-waiver` son 19.097 caracteres de documento
 * legal y `/bar-games-waiver` otros 8.525: lo de abajo es el resumen legible
 * de lo que esos documentos dicen, con el link al texto completo.
 *
 * ⚠️ LO QUE NO ESTÁ EN LOS WAIVERS NO SE INVENTA. Faltan tres cosas que un
 * visitante pregunta: la edad mínima para jugar, si se puede entrar con comida
 * y bebida, y si hace falta reservar. Ninguna aparece. Van con `source: null`
 * y no se renderizan.
 */
export const POLICIES: readonly Policy[] = [
  {
    title: 'Kids are welcome, and they are your responsibility',
    body: 'The truck has a Game Coach running the games, not a babysitter. Rooftop at Riverside does not supervise minors, and staff are not responsible for a game played by anyone younger than that game rating. Somebody in your party has to be the adult.',
    source:
      'Waiver del gaming truck, textual: «No Adult Supervision by Rooftop at Riverside, LLC» y «are in no way responsible for any games played by any party attendee who may be younger than the age rating of any game».',
  },
  {
    title: 'Break it and it gets charged',
    body: 'Controllers are $125 each, a console is $750, a game is $125 and the handheld is $500. Damage to the trailer, the wiring, the lighting or the sound is quoted on repair cost, and can include lost business. This covers you and any child you signed for, on purpose or not.',
    source:
      'Waiver del gaming truck, textual: «Controllers, $125 each, gaming systems $750, video games $125 each, Toast Handheld $500, Damage to Game Trailer/Wiring/Lighting/Sound Systems, etc to be determined by quoted repair costs and may include reasonable charges for loss of business».',
  },
  {
    title: 'How people behave in there',
    body: 'Bad language, threats, disrespect or aggression towards staff or other guests are not tolerated. We can ask an adult from the booking party to step in, ask anyone to leave, or end the session with no refund.',
    source:
      'Waiver del gaming truck, textual: «does not tolerate bad language, threatening, disrespectful or aggressive behavior towards our staff or other event attendees» y «reserve the right to request the removal of anyone from the premises as necessary, or end the event at any time without refunds».',
  },
  {
    title: 'Photos',
    body: 'We take pictures during parties. If you or your kids would rather not be photographed, tell the Game Coach on site and we will not photograph your party.',
    source:
      'Waiver del gaming truck, textual: «if you or your child/children prefer not to be photographed, please contact notify the game coach on site, and we will not photograph your party».',
  },
  {
    title: 'Minimum age to play',
    body: '',
    // TODO: confirmar con cliente la edad mínima. Los dos waivers hablan de
    // menores acompañados pero ninguno fija una edad. El «21 and up» del otro
    // waiver es de los bar games, que son otra cosa.
    source: null,
  },
  {
    title: 'Food and drink inside the truck',
    body: '',
    // TODO: confirmar con cliente si se puede entrar con comida o bebida.
    source: null,
  },
  {
    title: 'Do I need to book ahead',
    body: '',
    // TODO: confirmar con cliente si el juego por persona necesita reserva o
    // es por orden de llegada. Los paquetes de fiesta sí se reservan.
    source: null,
  },
];

export const publishedPolicies = (): readonly Policy[] => POLICIES.filter((p) => p.source !== null);

/** Los dos waivers que el cliente publica hoy. */
export const WAIVERS = [
  { label: 'Gaming truck waiver', href: 'https://www.eatdrinkparadise.com/game-zone-waiver' },
  { label: 'Bar games waiver', href: 'https://www.eatdrinkparadise.com/bar-games-waiver' },
] as const;
