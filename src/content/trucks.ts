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
 * ⚠️ EL ROSTER LO CONFIRMÓ CAMILA EL 2026-09-16, y NO era el que estaba.
 *
 * Lo que había salía de los cuatro logos al pie de la página 2 del menú de
 * barra de enero 2026, que era el dato más nuevo que publicaba el propio
 * sitio. Este archivo ya avisaba que estaba sin confirmar, y con razón: dos de
 * esos cuatro no están en el patio.
 *
 *     entra   Prime Carvery         carnes
 *     entra   Sea Me on Wheels      mariscos
 *     queda   El Chilango MX        mexicana
 *     queda   el cuarto             jamaiquina, NOMBRE SIN CONFIRMAR
 *
 *     sale    OCN Seafood Co.       nunca estuvo
 *     sale    Butcher's Blvd        nunca estuvo
 *
 * ⚠️ LOS DOS QUE ENTRAN ESTABAN COMO «RETIRADOS», así que ya traían historia y
 * foto verificadas del sitio viejo. Los dos que salen no tenían ni una ni otra:
 * eran nombres leídos de un logo. O sea que la corrección no sólo arregla el
 * dato, mejora lo que hay.
 *
 * ⚠️ LOS TRES `active: false` SIGUEN ACÁ para que el 301 exista. Con OCN y
 * Butcher's adentro, esas dos URLs ahora redirigen en vez de dar 404, que es lo
 * correcto: estuvieron publicadas en el preview.
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
  /**
   * Cuándo está en el park.
   *
   * ⚠️ `null` YA NO SIGNIFICA «NO LO TENEMOS». Camila, 2026-09-16: «el horario
   * es el mismo para todos los food trucks y sí lo tenemos, lo tenemos con los
   * horarios del espacio en sí».
   *
   * Y el dato ya estaba en el repo: `content/hours.ts` guarda DOS sets, barra y
   * trucks, porque el sitio viejo los publica separados en cada ficha. Los
   * trucks abren una hora después que la barra todos los días.
   *
   * Así que `null` ahora quiere decir «los del patio», y la UI los muestra en
   * vez de mandar al calendario. El campo se queda para el día que un truck
   * tenga un horario propio.
   */
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
  /**
   * La carta, como imagen. `null` si el truck todavía no la dio.
   *
   * ⚠️ SON IMÁGENES Y NO PDF, y conviene saberlo antes de buscar el PDF. El
   * sitio vigente publica la carta de cada truck como una IMAGEN dentro de su
   * página, no como archivo descargable. Los únicos tres PDF del sitio son el
   * mapa de estacionamiento, el del game lounge y el de eventos.
   *
   * Bajadas y guardadas en `public/menus/` el 2026-09-16. Una imagen abre en
   * cualquier teléfono y se hace zoom con dos dedos, que es mejor que un PDF
   * para una carta de una página. El día que el cliente mande PDF se cambia la
   * ruta y nada más.
   */
  readonly menuImage: string | null;

  /** Galería adicional. Puede estar vacía. */
  readonly gallery: readonly { src: string; alt: string }[];
  /**
   * ¿El NOMBRE está confirmado por el cliente?
   *
   * ⚠️ EXISTE POR UN CASO REAL Y CONCRETO. El cuarto truck es de comida
   * jamaiquina y Camila lo pasó así, 2026-09-16: «posiblemente Reggae Kitchen,
   * pero el nombre aún no está confirmado». Publicar un nombre propio que
   * nadie confirmó es inventar, aunque sea la mejor suposición que tenemos.
   *
   * Con `false`, la ficha y la grilla muestran un marcador visible al lado del
   * nombre. No se esconde el truck: existe, está en el patio y tiene su página.
   * Lo único que está en duda es cómo se llama.
   */
  readonly nameConfirmed: boolean;

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
    menuImage: null,
    gallery: [],
    nameConfirmed: true,
    active: false,
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
    menuImage: null,
    gallery: [],
    nameConfirmed: true,
    active: false,
  },
  {
    slug: 'el-chilango',
    // ⚠️ «MX» VA EN EL NOMBRE. Camila lo pasó así el 2026-09-16 y además está
    // escrito en el arte del propio truck, que es la imagen de esta ficha.
    // El slug NO cambia: una URL que ya existe no se mueve por un sufijo.
    name: 'El Chilango MX',
    cuisine: 'Mexican',
    specialty: 'Street tacos and fresh salsas',
    // Texto del cliente, tomado de /el-chilango. No generado.
    story:
      'El Chilango brings the vibrant flavors of Mexico to Rooftop at Riverside. Authentic street tacos, fresh salsas and traditional Mexican favorites, right in the heart of Bonita Springs.',
    schedule: null,
    // Está impreso en su propia carta, junto con el teléfono (239) 595-5713.
    instagram: 'https://www.instagram.com/el_chilango_mx/',
    photo: '/images/trucks/el-chilango-1.jpg',
    photoAlt: 'Tacos being plated at the El Chilango truck window at Rooftop at Riverside',
    photoBrief: "El truck por fuera, con el cartel legible.",
    // Bajada de su propia página del sitio vigente. Ver la nota del campo.
    menuImage: '/menus/el-chilango-mx.jpg',
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
    nameConfirmed: true,
    active: true,
  },
  {
    slug: 'reggae-kitchen',
    name: 'Reggae Kitchen',
    // Camila, 2026-09-16: «cuarto truck de comida jamaiquina». Es más preciso
    // que el «Caribbean» que traía el sitio viejo, y jamaiquino es caribeño.
    cuisine: 'Jamaican',
    // ⚠️ ERA «Caribbean and international flavors» Y SALÍA DE LA MISMA FUENTE
    // QUE EL NOMBRE: el listado viejo de Wix. Si el nombre no está confirmado,
    // la especialidad tampoco, así que se reemplaza por lo único verificado
    // que tenemos de este truck, que es lo que pasó Camila: cocina jamaiquina.
    specialty: 'Jamaican food',
    // ⚠️ ES LOREM A PROPÓSITO, PEDIDO POR CAMILA EL 2026-09-16: «para la
    // descripción del nuevo pongamos un texto lorem».
    //
    // Es la única excepción a la regla de no rellenar, y funciona justamente
    // porque el lorem NO SE PUEDE CONFUNDIR con contenido real: nadie lo lee y
    // piensa que el cliente lo escribió. Un párrafo verosímil en inglés sí se
    // publicaría sin que nadie lo note, que es lo que la regla evita.
    //
    // Se reemplaza en cuanto el truck mande su descripción.
    story:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    schedule: null,
    instagram: null,
    photo: null,
    photoAlt: null,
    photoBrief:
      "El truck de Reggae Kitchen con el cartel legible, y un plato servido que muestre el color de la comida.",
    menuImage: null,
    gallery: [],
    // El cliente lo pasó como «posiblemente Reggae Kitchen». Ver la nota del campo.
    nameConfirmed: false,
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
    // Los DOS párrafos de su página del sitio vigente, textuales. Antes estaba
    // sólo el primero.
    story:
      'Prime Carvery American Kitchen redefines American classics with a focus on quality and flavor. Known for their high-quality offerings, they take pride in crafting dishes that leave taste buds rejoicing. Every dish reflects a commitment to elevating classic American comfort food to new heights.',
    schedule: null,
    instagram: null,
    photo: '/images/trucks/prime-carvery-1.jpg',
    photoAlt: 'A burger with melted cheese served from the Prime Carvery truck',
    photoBrief: "El truck por fuera, con el cartel legible, abierto y atendiendo.",
    menuImage: null,
    gallery: [],
    nameConfirmed: true,
    active: true,
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
    photoBrief: "El truck por fuera, con el cartel legible, abierto y atendiendo.",
    // Bajada de su propia página del sitio vigente. 13 platos con precio.
    menuImage: '/menus/sea-me-on-wheels.jpg',
    gallery: [],
    nameConfirmed: true,
    active: true,
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
    menuImage: null,
    gallery: [],
    nameConfirmed: true,
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
/**
 * Los 301 de las URLs de truck.
 *
 * ⚠️ AHORA REDIRIGEN TODAS, activas incluidas, y antes sólo las retiradas. El
 * 2026-09-16 se sacaron las fichas por truck: hay una sola página con las
 * cuatro tarjetas. O sea que `/food-trucks/el-chilango` ya no existe para
 * NINGÚN truck, no sólo para los que se fueron.
 *
 * Se conserva el nombre de la función para no tocar `next.config.ts`, pero lo
 * que hace cambió: son todos los slugs del archivo.
 */
export function retiredTruckRedirects() {
  return TRUCKS.map((t) => ({
    source: `/food-trucks/${t.slug}`,
    destination: '/food-trucks',
    statusCode: 301,
  }));
}
