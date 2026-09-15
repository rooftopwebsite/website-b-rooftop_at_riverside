/**
 * Los food trucks. **Este archivo es el CMS.**
 *
 * Regla del proyecto: un truck se agrega o se saca editando ESTE archivo, sin
 * tocar una línea de código. `/food-trucks/[slug]` se genera desde acá con un
 * único template, y al pasar un truck a `active: false` el 301 a `/food-trucks`
 * se genera solo (ver `next.config.ts` y `retiredTruckRedirects()`).
 *
 * ⚠️ Por qué existe esta regla. En dos años y medio el roster rotó completo y el
 * sitio de Wix quedó con cuatro fichas escritas a mano: tres de trucks que ya no
 * están y una sola de las cuatro que sí. Ver `docs/current-site-inventory.md` §3.
 *
 * ⚠️ ESTADO DEL ROSTER — pendiente de confirmación del cliente.
 * Los cuatro activos salen del menú de barra de enero 2026, que es el dato más
 * nuevo que publica el propio sitio (los cuatro logos al pie de la página 2).
 * No están confirmados a hoy. Los tres `active: false` son las fichas viejas
 * de Wix, y se conservan para que el 301 exista.
 *
 * ⚠️ NO se publica carta con precios de los trucks. Los precios son del vendor,
 * no del venue. Sólo cobra el venue en el Sunset Bar.
 *
 * ⚠️ La rotación NO va en la ficha, va en el calendario. «Qué truck está hoy»
 * vive en el home y en /whats-on.
 */

export interface Truck {
  readonly slug: string;
  readonly name: string;
  /** Tipo de cocina. Una o dos palabras. */
  readonly cuisine: string;
  /** El plato o la categoría por la que se los conoce. */
  readonly specialty: string;
  /** Historia corta. 2 o 3 frases, del propio truck. Nunca generada. */
  readonly story: string | null;
  /** Cuándo está en el park. `null` = todavía no lo tenemos. */
  readonly schedule: string | null;
  readonly instagram: string | null;
  /** Foto verificada del truck. `null` renderiza un placeholder marcado. */
  readonly photo: string | null;
  readonly photoAlt: string | null;
  /**
   * Qué toma hace falta cuando `photo` es null. Se muestra dentro del
   * placeholder gris: es el pedido concreto para el fotógrafo, no un genérico.
   */
  readonly photoBrief: string;
  /** Galería adicional. Puede estar vacía. */
  readonly gallery: readonly { src: string; alt: string }[];
  /** `false` = ya no está en el park. Genera el 301 y sale de la grilla. */
  readonly active: boolean;
}

export const TRUCKS: readonly Truck[] = [
  {
    slug: 'ocn-seafood-co',
    name: 'OCN Seafood Co.',
    cuisine: 'Seafood',
    specialty: 'Gulf catch, poke bowls and seafood boils',
    story: null,
    schedule: null,
    instagram: null,
    photo: null,
    photoAlt: null,
    photoBrief:
      "El truck de OCN Seafood Co. abierto y atendiendo, al atardecer, con la ventanilla iluminada y gente pidiendo.",
    gallery: [],
    active: true,
  },
  {
    slug: 'butchers-blvd',
    name: "Butcher's Blvd",
    cuisine: 'American',
    specialty: 'Smashburgers and American kitchen classics',
    story: null,
    schedule: null,
    instagram: null,
    photo: null,
    photoAlt: null,
    photoBrief:
      "El truck de Butcher's Blvd estacionado en el patio, más un primer plano de una smashburger saliendo.",
    gallery: [],
    active: true,
  },
  {
    slug: 'el-chilango',
    name: 'El Chilango',
    cuisine: 'Mexican',
    specialty: 'Street tacos and fresh salsas',
    // Texto del cliente, tomado de /el-chilango. No generado.
    story:
      'El Chilango brings the vibrant flavors of Mexico to Rooftop at Riverside. Authentic street tacos, fresh salsas and traditional Mexican favorites, right in the heart of Bonita Springs.',
    schedule: null,
    instagram: null,
    photo: '/images/trucks/el-chilango-1.jpg',
    photoAlt: 'Tacos being plated at the El Chilango truck window at Rooftop at Riverside',
    photoBrief: "El truck por fuera, con el cartel legible.",
    gallery: [
      {
        src: '/images/trucks/el-chilango-2.jpg',
        alt: 'Close-up of street tacos with fresh salsa and lime from El Chilango',
      },
      {
        src: '/images/trucks/el-chilango-3.jpg',
        alt: 'The El Chilango food truck parked in the yard at Rooftop at Riverside',
      },
    ],
    active: true,
  },
  {
    slug: 'reggae-kitchen',
    name: 'Reggae Kitchen',
    cuisine: 'Caribbean',
    specialty: 'Caribbean and international flavors',
    story: null,
    schedule: null,
    instagram: null,
    photo: null,
    photoAlt: null,
    photoBrief:
      "El truck de Reggae Kitchen con el cartel legible, y un plato servido que muestre el color de la comida.",
    gallery: [],
    active: true,
  },

  /* ── Retirados ──────────────────────────────────────────────────────────
     Se quedan acá para que el 301 exista. No aparecen en ninguna grilla.
     Las fotos son reales y verificadas: se conservan por si el truck vuelve. */
  {
    slug: 'prime-carvery',
    name: 'Prime Carvery',
    cuisine: 'American',
    specialty: 'Elevated American comfort food',
    story:
      'Prime Carvery American Kitchen redefines American classics with a focus on quality and flavor, crafting dishes that leave taste buds rejoicing.',
    schedule: null,
    instagram: null,
    photo: '/images/trucks/prime-carvery-1.jpg',
    photoAlt: 'A burger with melted cheese served from the Prime Carvery truck',
    photoBrief: "El truck por fuera. Ya no está en el roster.",
    gallery: [],
    active: false,
  },
  {
    slug: 'sea-me-on-wheels',
    name: 'Sea Me on Wheels',
    cuisine: 'Seafood',
    specialty: 'Shrimp, ceviche and seafood boils',
    story:
      "Sea Me on Wheels crafts a menu blending traditional recipes with innovative twists, inspired by the flavors of Florida's coastal cuisine.",
    schedule: null,
    instagram: null,
    photo: '/images/trucks/seafood-1.jpg',
    photoAlt: 'A poke bowl with fresh fish and vegetables from Sea Me on Wheels',
    photoBrief: "El truck por fuera. Ya no está en el roster.",
    gallery: [],
    active: false,
  },
  {
    slug: 'tropical-fusion',
    name: 'Tropical Fusion',
    cuisine: 'Fusion',
    specialty: 'Tropical fusion plates',
    story: null,
    schedule: null,
    instagram: null,
    photo: '/images/trucks/tropical-1.jpg',
    photoAlt: 'A plated dish from the Tropical Fusion food truck',
    photoBrief: "El truck por fuera. Ya no está en el roster.",
    gallery: [],
    active: false,
  },
];

export const activeTrucks = (): readonly Truck[] => TRUCKS.filter((t) => t.active);

export const truckBySlug = (slug: string): Truck | undefined =>
  TRUCKS.find((t) => t.slug === slug);

/**
 * Los 301 de los trucks retirados. Se generan desde los datos, así que sacar un
 * truck del roster nunca deja una URL muerta.
 */
export function retiredTruckRedirects() {
  return TRUCKS.filter((t) => !t.active).map((t) => ({
    source: `/food-trucks/${t.slug}`,
    destination: '/food-trucks',
    statusCode: 301,
  }));
}
