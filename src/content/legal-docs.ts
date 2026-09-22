/**
 * LOS TRES DOCUMENTOS LEGALES DEL GAMING TRUCK: el índice y la forma del texto.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ EL TEXTO DE LOS TRES ES VERBATIM Y NO SE EDITA. Son documentos que la
 * gente firma: lo que se publica es la transcripción del original, con su
 * numeración, sus mayúsculas, sus comillas rectas y sus erratas —«construe»
 * por «construed», «Excuplation» por «Exculpation», «Signonr» por «Signor»—.
 * Corregirlas sería reescribir un papel firmado.
 *
 * Lo ÚNICO que ponemos nosotros es la estructura: qué es un título, qué es un
 * párrafo y qué es un ítem de lista. Ninguna palabra cambia de lugar.
 *
 * ⚠️ POR ESO EL TEXTO VIVE EN DATOS Y NO EN JSX. Con 22.000 caracteres de
 * documento escritos a mano dentro de un `page.tsx`, cada `&rsquo;` y cada
 * `&ldquo;` es una oportunidad de cambiar el original sin darse cuenta, y
 * revisar que el texto siga intacto se vuelve imposible. Acá el texto es una
 * cadena y se puede comparar contra el volcado de `_source/` con un diff.
 *
 * ⚠️ DE DÓNDE SALE CADA UNO:
 *
 *   · `game-zone-waiver`  → `_source/game-zone-waiver.md` (scrapeado el
 *     2026-09-15 del sitio viejo).
 *   · `bar-games-waiver`  → `_source/bar-games-waiver.md` (ídem).
 *   · `gaming-truck-policies` → el PDF «Policies and Procedures» que el sitio
 *     viejo colgaba desde `/game-lounge`. NO tenía página: era un archivo
 *     suelto, así que esta es la primera vez que el documento es una URL.
 *
 * ⚠️ LOS DOS WAIVERS CORTAN DONDE EMPIEZA EL FORMULARIO. El original sigue con
 * «Month / Day / Year / Submit», que son los campos de la firma electrónica de
 * Wix. Eso es la UI del formulario, no el documento, y acá no hay formulario:
 * la firma se hace en el lugar. Lo último que se publica es el párrafo de
 * reconocimiento.
 * ══════════════════════════════════════════════════════════════════════════
 */

/**
 * Un bloque del documento. La estructura es nuestra; el texto, del cliente.
 *
 * ⚠️ NO HAY `kind: 'html'` NI NADA QUE ACEPTE MARCADO. Es a propósito: si un
 * bloque pudiera traer HTML, el texto legal y la maqueta volverían a mezclarse
 * y se podría colar una edición del original disfrazada de estilo.
 */
export type LegalBlock =
  /** El aviso en caja alta del original. Se muestra destacado, no gritado. */
  | { readonly kind: 'aviso'; readonly text: string }
  /** Un título de sección numerada. El número va en el texto, como el original. */
  | { readonly kind: 'titulo'; readonly text: string }
  | { readonly kind: 'parrafo'; readonly text: string }
  /**
   * Una cláusula con rótulo: «4. Property Damage.» y abajo su cuerpo, que en
   * los waivers puede ser más de un párrafo.
   */
  | {
      readonly kind: 'clausula';
      readonly rotulo: string;
      readonly cuerpo: readonly string[];
    }
  /**
   * Una lista. Cada ítem puede traer rótulo propio («Eligibility: ...»), que es
   * como viene en el waiver de los juegos de barra.
   */
  | {
      readonly kind: 'lista';
      readonly orden?: 'letras';
      readonly items: readonly { readonly rotulo?: string; readonly texto: string }[];
    };

export interface LegalDoc {
  readonly href: string;
  /** El nombre corto: el del link, el del pie y el de la sección de /game-truck. */
  readonly label: string;
  /** Una línea NUESTRA que dice para qué sirve. No es parte del texto legal. */
  readonly blurb: string;
}

/**
 * El índice de los tres. Manda el orden en que aparecen en `/game-truck` y en
 * el pie de cada documento.
 *
 * ⚠️ HASTA HOY LOS TRES VIVÍAN EN `eatdrinkparadise.com`: los dos waivers eran
 * páginas del sitio viejo con una 301 puesta en `next.config.ts`, y las
 * políticas eran un PDF colgado de Wix. O sea que los papeles que firma un
 * cliente seguían en el dominio que estamos reemplazando. Ahora son tres rutas
 * nuestras y los links externos se fueron.
 */
export const LEGAL_DOCS: readonly LegalDoc[] = [
  {
    href: '/gaming-truck-policies',
    label: 'Policies and procedures',
    blurb: 'Booking, deposits, cancellations, weather and behavior.',
  },
  {
    href: '/game-zone-waiver',
    label: 'Game zone waiver',
    blurb: 'What you sign before anyone gets in the truck.',
  },
  {
    href: '/bar-games-waiver',
    label: 'Bar games waiver',
    blurb: 'For the games upstairs, at the bar. 21 and over.',
  },
];

/**
 * ══════════════════════════════════════════════════════════════════════════
 * LOS CUATRO DEL PIE: LA OTRA FAMILIA DE DOCUMENTOS, Y ESTÁ SEPARADA A
 * PROPÓSITO.
 *
 * `LEGAL_DOCS` son los papeles del camión: se firman, se llega a ellos desde
 * `/game-truck` y no están en ningún menú. Estos cuatro son los del sitio: los
 * lista la fila legal del pie, en todas las páginas, y son los que el template
 * de la agencia exige. No comparten lista porque no comparten navegación: el
 * pie de un waiver manda a los otros dos waivers, no a la política de cookies.
 *
 * ⚠️ EL ORDEN ES EL DEL FIGMA DE RESTO EXPERIENCE —nodo 1255:11114—, que es el
 * mismo que ya está escrito en `Footer.tsx`. Si cambia, cambia en los dos.
 *
 * ⚠️ LOS CUATRO ESTÁN EN BORRADOR: el cuerpo es lorem, las páginas van
 * `noindex` y no entran al sitemap. Todo el porqué está en
 * `content/legal/borradores.ts`.
 * ══════════════════════════════════════════════════════════════════════════
 */
export const SITE_LEGAL_DOCS: readonly LegalDoc[] = [
  {
    href: '/privacy-policy',
    label: 'Privacy Policy',
    blurb: 'What we collect, why, and what we never do with it.',
  },
  {
    href: '/terms-of-service',
    label: 'Terms of Service',
    blurb: 'The rules for using this site and for booking with us.',
  },
  {
    href: '/cookie-policy',
    label: 'Cookie Policy',
    blurb: 'Which cookies this site sets and how to say no.',
  },
  {
    href: '/accessibility',
    label: 'Accessibility',
    blurb: 'What we build for, what we test, and what still needs work.',
  },
];
