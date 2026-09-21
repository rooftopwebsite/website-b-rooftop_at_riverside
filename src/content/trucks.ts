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
   * La bajada de la tarjeta. Una sola frase.
   *
   * ══════════════════════════════════════════════════════════════════════
   * ⚠️ EXISTE PARA QUE LA TARJETA NO TERMINE EN PUNTOS SUSPENSIVOS. Camila,
   * 2026-09-16: «acortá las descripciones para no necesitar los …».
   *
   * A cuatro columnas la tarjeta mide 266px y entran unos 30 caracteres por
   * renglón. Las historias del cliente miden entre 135 y 290, así que el
   * `line-clamp` las cortaba SIEMPRE, y una tarjeta que corta a mitad de frase
   * hace pensar que falta algo. El tope es 70 caracteres: tres renglones
   * completos sin recorte.
   *
   * ⚠️ NO ES TEXTO NUEVO, ES LA FRASE DEL PROPIO TRUCK RECORTADA. Cada bajada
   * sale de su `story`, quedándose con la oración que dice qué cocinan y
   * tirando la que repite el nombre y la ciudad. No se agrega un solo hecho.
   *
   * `null` cae de vuelta en `story`, que es lo que hacía antes.
   * ══════════════════════════════════════════════════════════════════════
   */
  readonly blurb: string | null;
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
    blurb: null,
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
    blurb: null,
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
    blurb:
      'Authentic street tacos, fresh salsas and traditional Mexican plates.',
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
    blurb:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
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
    /*
      ⚠️ SALIÓ DEL ROSTER EL 2026-09-21 Y NO ES UN TRUCK QUE SE FUE: NUNCA FUE
      ESTE TRUCK. El cuarto lugar del yard lo ocupa Tropical Fusion, que estaba
      acá abajo marcado como retirado. Camila, sobre la tarjeta que publicaba
      «Name unconfirmed»: «el de name unconfirmed es Tropical Fusion,
      actualizalo». Lo confirma la base: las cuatro cartas que el cliente subió
      el mismo día son El Chilango MX, Sea me on wheels, Prime Carvery y
      Tropical Fusion. Reggae Kitchen no tiene ninguna.

      ⚠️ LA FICHA NO SE BORRA. El nombre salió del listado viejo de Wix como
      «posiblemente Reggae Kitchen» y estuvo publicado como hueco todo este
      tiempo; si mañana aparece, vuelve con `active: true` y su 301 nunca dejó
      de existir.
    */
    active: false,
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
    blurb:
      'American classics, made with a focus on quality and flavor.',
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
    blurb:
      'Traditional recipes with a twist, from the Florida coast.',
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
    blurb: null,
    schedule: null,
    instagram: null,
    photo: '/images/trucks/tropical-1.jpg',
    photoAlt: 'A plated dish from the Tropical Fusion food truck',
    photoBrief: 'El truck por fuera, con el cartel legible y un plato servido.',
    menuImage: null,
    gallery: [],
    nameConfirmed: true,
    /*
      ⚠️ VUELVE AL ROSTER EL 2026-09-21, y ocupa el lugar que hasta hoy tenía
      «Name unconfirmed». Camila: «el de name unconfirmed es Tropical Fusion,
      actualizalo». Su carta está cargada en la base desde el mismo día, así que
      la tarjeta abre el PDF como las otras tres. Ver `menuDeTruck`.
    */
    active: true,
  },
];

export const activeTrucks = (): readonly Truck[] => TRUCKS.filter((t) => t.active);

/**
 * El nombre que se PUBLICA. No siempre es `truck.name`.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ SI EL NOMBRE NO ESTÁ CONFIRMADO, NO SE PUBLICA: se publica que falta.
 * Camila, 2026-09-16: «quitá lo de name unconfirmed, a lo sumo ponelo en el
 * nombre; en lugar de Reggae Kitchen poné name unconfirmed».
 *
 * Antes el nombre salía igual y al lado iba una chapita roja que avisaba. Esto
 * es más honesto y además más limpio: si no sabemos cómo se llama, escribir
 * «Reggae Kitchen» en grande y desmentirlo en chico al lado es publicar el dato
 * y taparlo con una nota al pie. Así el hueco ES el título.
 *
 * ⚠️ EL NOMBRE SUPUESTO NO SE BORRA DEL ARCHIVO. `truck.name` sigue diciendo
 * «Reggae Kitchen», que es la mejor pista que tenemos y la que hay que
 * confirmar. Lo único que cambia es que no se muestra hasta que alguien diga
 * que sí.
 *
 * ⚠️ USARLO EN TODOS LADOS, no sólo en la tarjeta. Hoy son tres: la tarjeta, la
 * marquesina de `/food-trucks` y `TruckHero`. Si aparece un cuarto lugar que
 * imprima `truck.name` directo, el aviso se pierde ahí.
 * ══════════════════════════════════════════════════════════════════════════
 */
export const nombreVisible = (t: Truck): string =>
  t.nameConfirmed ? t.name : 'Name unconfirmed';

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

/**
 * ══════════════════════════════════════════════════════════════════════════
 * LA CARTA DE CADA TRUCK, DESDE LA BASE.
 *
 * ⚠️ EL EMPAREJAMIENTO ES POR NOMBRE Y NO POR UN ID, y es a propósito: el
 * dashboard no tiene campo para atar una carta a un truck —los `menus` son del
 * RESTAURANTE— así que lo único que las relaciona es cómo las nombró el
 * cliente. Es el mismo criterio que ya usa `content/happy-hour.ts` con el
 * evento del happy hour: el dato manda sobre la etiqueta.
 *
 * ⚠️ SE COMPARA NORMALIZANDO, que es lo que hace que funcione de verdad: el
 * cliente cargó «Sea me on wheels» y el roster dice «Sea Me on Wheels». Se
 * bajan mayúsculas, se sacan acentos y todo lo que no sea letra o número, así
 * que «El Chilango MX» y «el-chilango mx.» son la misma carta.
 *
 * ⚠️ SI NADIE COINCIDE, DEVUELVE `null` Y LA TARJETA CAE A `menuImage`, el JPG
 * bajado a mano. Y si tampoco hay, el botón queda deshabilitado, que es el
 * comportamiento que ya tenía. Nada de esto rompe si la base no contesta.
 * ══════════════════════════════════════════════════════════════════════════
 */
const normalizar = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

/**
 * La ficha del roster que corresponde a un nombre de carta.
 *
 * ⚠️ BUSCA EN TODOS LOS TRUCKS, ACTIVOS Y RETIRADOS. Desde que las tarjetas las
 * decide el dashboard —ver `content/menus.ts`—, que un truck esté marcado como
 * activo en este archivo ya no es lo que lo publica: lo publica tener una carta
 * cargada. Si el cliente sube la carta de un truck que acá figura retirado, la
 * tarjeta sale igual y con su foto, que es lo correcto: el dato de que está
 * sirviendo es más fresco que este archivo.
 */
export const truckPorNombre = (nombre: string): Truck | undefined =>
  TRUCKS.find((t) => normalizar(t.name) === normalizar(nombre));

export const menuDeTruck = (
  t: Truck,
  cartas: readonly { readonly name: string; readonly pdfUrl: string }[],
): string | null =>
  cartas.find((c) => normalizar(c.name) === normalizar(t.name))?.pdfUrl ?? t.menuImage;
