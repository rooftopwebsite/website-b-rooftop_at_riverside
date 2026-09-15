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

/** Los pasos. Esto SÍ es una secuencia, así que va numerado. */
export const STEPS: readonly { readonly title: string; readonly body: string }[] = [
  {
    title: 'Send the form',
    body: 'Tell us what you make, where we can see it, and which market dates you want. It takes two minutes.',
  },
  {
    title: 'We come back to you',
    body: 'We look at what you sell and whether it fits alongside what is already booked, and answer within one business day.',
  },
  {
    title: 'Pay the $30 and show up',
    body: 'Spots go first come, and the final approval happens at check-in on the day. Bring your table and your tent.',
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
