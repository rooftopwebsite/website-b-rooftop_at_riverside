/**
 * EL NEIGHBORHOOD MARKET.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LAS CONDICIONES SON TEXTUALES DEL SITIO VIGENTE, volcadas en
 * `content/_source/neighborhood-market.md` el 2026-09-15: fee de $30, espacio
 * de 10×10 salvo aprobación, orden de llegada con aprobación al check-in,
 * carpas pop-up permitidas y electricidad a pedido.
 *
 * ⚠️ LO QUE NO SABEMOS NO SE INVENTA. Faltan tres cosas que un vendor
 * pregunta antes de anotarse, y ninguna está en el sitio ni en el brief:
 *   · cada cuánto se hace el market (¿mensual? ¿semanal?)
 *   · cuánta gente pasa
 *   · qué rubros busca el cliente y cuáles no
 * Van como pendiente visible, no como estimación. Publicar «cientos de
 * visitantes» sin dato es prometerle público a alguien que paga por estar.
 * TODO: confirmar con cliente frecuencia, público estimado y rubros buscados.
 * ══════════════════════════════════════════════════════════════════════════
 */

export interface VendorTerm {
  readonly label: string;
  readonly value: string;
}

/** Bloque J: las condiciones duras. Todas verificadas. */
export const TERMS: readonly VendorTerm[] = [
  { label: 'Booth fee', value: '$30' },
  { label: 'Space', value: '10 × 10' },
  { label: 'Spots', value: 'First come' },
];

/** Qué pone el venue y qué trae el vendor. Sitio vigente. */
export const PROVIDES = {
  venue: [
    'The space in the yard, 10 by 10',
    'Electricity, if you ask for it ahead',
    'The crowd that is already here for the trucks and the bar',
    'Approval at check-in on the day',
  ],
  vendor: [
    'Your table, your display and your own change',
    'A pop-up tent if you want one, they are allowed',
    'Anything bigger than 10 by 10 needs approval first',
  ],
} as const;

/**
 * Los pasos. Esto SÍ es una secuencia, así que va numerado.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ CADA PASO TIENE `kicker` Y `tags` DESDE EL REDISEÑO DE LA PÁGINA, y es
 * porque cambió la forma que los muestra: son los TICKETS de la home, la misma
 * pieza que `YardSteps`, y ese ticket tiene cuatro renglones —rótulo, título,
 * párrafo y etiquetas—. Sin los dos campos nuevos la tarjeta queda con un
 * tercio de aire abajo y deja de parecerse a su hermana.
 *
 * ⚠️ NI UNA ETIQUETA DICE ALGO QUE NO DIGA YA SU PROPIO `body`. Son un resumen
 * de lo que el paso pide o entrega, no datos nuevos: acá no hay frecuencia, ni
 * público, ni rubros, que son las tres cosas que seguimos sin saber.
 *
 * ⚠️ EL TERCER PASO SE LLAMABA «Pay and show up» Y AHORA SE LLAMA «Bring your
 * table». No es un retoque de estilo: es el pedido de Camila del 2026-09-22 de
 * dejar de vender esta página desde el pago —«no hables de pagar dándole mucha
 * importancia, vendamos desde el lado de ayudar a exponer su trabajo»—.
 *
 * El precio NO se esconde, que sería el error opuesto: sigue en el `body` del
 * paso, con todas las letras, y sigue en la fila de datos de la sección de
 * logística. Lo que cambió es que ya no ES el nombre del paso ni el titular de
 * una banda oscura a 112px. Un vendor que llega a esta página tiene que
 * enterarse del fee sin que el fee sea lo primero que le decimos.
 *
 * ⚠️ Y POR ESO TAMBIÉN SE CAYÓ LA ETIQUETA «$30 a booth» del tercer ticket: el
 * dato quedaba dicho dos veces dentro de la MISMA tarjeta, en el párrafo y en
 * el chip de abajo. En su lugar va «Ten by ten», que es la otra pregunta que un
 * vendor hace antes de anotarse y que no estaba en ningún chip.
 * ══════════════════════════════════════════════════════════════════════════
 */
export interface MarketStep {
  /** El rótulo chico de arriba del título: cuánto tarda o cuándo pasa. */
  readonly kicker: string;
  readonly title: string;
  readonly body: string;
  readonly tags: readonly string[];
}

/**
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LOS TRES PASOS PERDIERON SUS ETIQUETAS EL 2026-09-22, y los títulos se
 * emparejaron a UN renglón. Camila, sobre la captura: «elimina de cada paso
 * los tags, y además haz que los títulos o tengan todos dos líneas o todos una
 * para que no quede con espacios en blanco y desproporcionados».
 *
 * LAS ETIQUETAS. Eran ocho chips al pie de las tres tarjetas y los ocho decían
 * lo mismo que el párrafo que tenían arriba: «What you make» debajo de «tell us
 * what you make», «Ten by ten» debajo de «set up your ten by ten». Un resumen
 * de dos renglones no se resume en tres chips.
 *
 * LOS TÍTULOS. «Start with the form» era el único de los tres que se partía en
 * dos renglones, así que las otras dos tarjetas compensaban con un piso de
 * `min-h` calculado en `em` — un parche escrito para un desfase de 35px. Ahora
 * los tres entran en uno solo («Fill in the form», «We write back», «Bring your
 * table») y el piso se fue del JSX.
 *
 * ⚠️ SI ALGUNO VUELVE A DOS RENGLONES, VUELVEN LOS TRES O VUELVE EL PISO. Es la
 * regla que dejó Camila y es la que evita el escalón. El techo medido a este
 * cuerpo son ~19 caracteres.
 *
 * ⚠️ `tags` SIGUE EN EL TIPO `MarketStep` y las tres lo traen vacío. Se deja el
 * campo porque el tipo lo comparten otros bloques del kit; lo que se sacó es el
 * contenido y el renderizado.
 * ══════════════════════════════════════════════════════════════════════════
 */
export const STEPS: readonly MarketStep[] = [
  {
    kicker: 'Two minutes',
    title: 'Fill in the form',
    body: 'Tell us what you make, where we can see it, and which market days you are after. That is the whole thing.',
    tags: [],
  },
  {
    kicker: 'One business day',
    title: 'We write back',
    body: 'A person reads it and answers within one business day, with what is open and who else is set up that day.',
    tags: [],
  },
  {
    kicker: 'On the day',
    title: 'Bring your table',
    body: 'Pull in, check in with us and set up your ten by ten. The booth is $30 and spots go first come, so the earlier you write the better.',
    tags: [],
  },
];

/**
 * EL MURO DE FOTOS DE LA PÁGINA.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ SON FOTOS DEL SITIO VIGENTE Y NO DE LA ENTREGA DEL CLIENTE, porque la
 * entrega de 36 fotos no tiene NI UNA del market: son camiones, barra y noches
 * de música. Se bajaron de `eatdrinkparadise.com/neighborhood-market` el
 * 2026-09-22, que es la galería que el propio local publica de sus market
 * days. Qué archivo es cuál está en `scripts/build-media.mjs`.
 * TODO: pedirle al cliente el material original del market.
 *
 * ⚠️ LOS `alt` DESCRIBEN LO QUE SE VE Y NADA MÁS. No dicen cuánta gente va, ni
 * cada cuánto es, ni qué rubros busca el cliente, que son las tres cosas que
 * seguimos sin saber: un `alt` es texto publicado como cualquier otro.
 *
 * ⚠️ EL `ratio` NO ES MAQUETADO, ES EL ARCHIVO. `build-media.mjs` genera las
 * verticales a 880×1100 y las apaisadas a 900×675, así que la clase de acá
 * DECLARA la proporción de la derivada, no la elige. Si cambia una, cambian las
 * dos juntas o la foto se deforma.
 *
 * ⚠️ EL ORDEN ALTERNA VERTICAL Y APAISADA, y hay que conservarlo: la grilla es
 * de tres columnas, así que así queda una vertical al lado de una apaisada en
 * cada fila. Seis tiles del mismo alto son un catálogo; seis de altos distintos
 * son una pared. Es el mismo criterio del tendal de `PhotoDivider`.
 * ══════════════════════════════════════════════════════════════════════════
 */
export interface MarketShot {
  readonly src: string;
  readonly alt: string;
  readonly ratio: 'aspect-[4/5]' | 'aspect-[4/3]';
}

export const SHOTS: readonly MarketShot[] = [
  {
    src: '/images/market/stall-jewelry.jpg',
    alt: 'Three vendors standing behind a table of handmade necklaces and earrings',
    ratio: 'aspect-[4/5]',
  },
  {
    src: '/images/market/stall-picnic.jpg',
    alt: 'A vendor beside a low table set for a picnic, with cushions and baskets on the turf',
    ratio: 'aspect-[4/3]',
  },
  {
    src: '/images/market/stall-art.jpg',
    alt: 'Two vendors at a stand of framed paintings and prints of the coast',
    ratio: 'aspect-[4/5]',
  },
  {
    src: '/images/market/stall-flowers.jpg',
    alt: 'Two vendors at a flower stand, with buckets of cut stems and potted plants',
    ratio: 'aspect-[4/3]',
  },
  {
    src: '/images/market/vendor-boba.jpg',
    alt: 'A vendor in an apron handing an order across her counter',
    ratio: 'aspect-[4/5]',
  },
  {
    src: '/images/market/stall-home.jpg',
    alt: 'A long table laid with plates, candles and dried flowers at a homeware stand',
    ratio: 'aspect-[4/3]',
  },
];

/**
 * Los rubros del formulario.
 *
 * ⚠️ ESTA LISTA ES NUESTRA, no del cliente, y es a propósito: un desplegable
 * tiene que existir para que el formulario se pueda validar en el servidor. Lo
 * que NO hacemos es afirmar en el copy que el cliente busca estos rubros.
 * TODO: confirmar con cliente qué rubros quiere y cuáles no.
 */
export const PRODUCT_CATEGORIES = [
  'Handmade goods',
  'Art and prints',
  'Jewelry',
  'Clothing and accessories',
  'Home and candles',
  'Plants and flowers',
  'Packaged food',
  'Skincare and wellness',
  'Vintage and resale',
  'Something else',
] as const;

/** Lo que un puesto puede necesitar del venue. */
export const VENDOR_NEEDS = [
  { value: 'electricity', label: 'Electricity' },
  { value: 'table', label: 'A table' },
  { value: 'tent', label: 'Room for a pop-up tent' },
  { value: 'oversized', label: 'More than 10 by 10' },
] as const;
