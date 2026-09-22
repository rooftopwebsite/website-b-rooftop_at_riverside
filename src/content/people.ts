import type { Person } from '@/types/content';

/**
 * Las dos personas que el cliente publica con nombre y cara.
 *
 * ⚠️ FUENTE: `/this-is-us` del sitio vigente, verificado el 2026-09-15 sobre
 * `content/_source/this-is-us.md`. De ahí salen los tres datos de cada uno
 * —nombre, rol y mail— y la cita de Chris, textual.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LAS FOTOS LLEGARON EL 2026-09-22 Y SALEN DE `/this-is-us`. Camila, sobre
 * la captura del equipo: «las imágenes puedes sacarlas de la web original y usa
 * la info que tenemos; lo que no tengamos no va en este caso, no dejes
 * pendientes en esta landing».
 *
 * Las dos estaban publicadas en la página del cliente y se bajaron de ahí. Lo
 * que se versiona es el DERIVADO, no el original: recortadas a 3:4 vertical,
 * 900×1200, JPEG de calidad 82. Es la misma regla de §5b de INVARIANTES.
 *
 * ⚠️ LA DE CHRIS NO ES UN RETRATO: es la familia Magnus entera, con las remeras
 * del venue, en la esquina antes de que existiera el lugar. Es la única que el
 * cliente publica de él y cuenta la página mejor que un retrato — «a Magnus
 * family project» es el H1. El recorte 3:4 sale del centro del grupo.
 *
 * ⚠️ LA DE ANTHONY YA ERA VERTICAL y está tomada detrás de la barra, sirviendo
 * un trago. Sólo se reencuadró a 3:4 anclando arriba, que es donde está la
 * cara.
 *
 * ⚠️ NO VAN EN BLANCO Y NEGRO, aunque el diseño de la sección lo pedía cuando
 * los huecos estaban vacíos: en gris, la foto de Chris pierde las remeras
 * naranjas, que son lo que la hace valer. La clase se sacó del render.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ LAS BIOS SIGUEN SIN EXISTIR Y NO SE INVENTAN. El sitio actual no publica
 * ni una línea sobre ninguno de los dos. Los dos `bio` quedan en `null` y la
 * página NO dibuja un marcador de pendiente: Camila pidió expreso que esta
 * landing no deje huecos a la vista. La tarjeta se cae con gracia —nombre,
 * cargo y mail— y el pedido vive en `docs/pedido-al-cliente.md`.
 *
 * ⚠️ LOS MAILS SON PERSONALES Y ESTÁN PUBLICADOS HOY en la web del cliente.
 * Se conservan porque ya son públicos, no porque los hayamos sacado de ningún
 * material interno.
 */
export const PEOPLE: readonly Person[] = [
  {
    name: 'Chris Magnus',
    role: 'Founder and operator',
    email: 'cmagnus@eatdrinkparadise.com',
    // TODO: confirmar con cliente. Bio corta de Chris, 2 o 3 frases.
    bio: null,
    photo: '/images/venue/person-chris-magnus.jpg',
    photoAlt:
      'The Magnus family in Rooftop at Riverside shirts, on the Old 41 corner before the venue was built',
    quote:
      'We hope this park will be a staple for families in the community, a symbol for up and coming entrepreneurs and business owners, and a landmark our kids would be proud of.',
  },
  {
    name: 'Anthony Hayes',
    role: 'General manager',
    email: 'ahayes@eatdrinkparadise.com',
    // TODO: confirmar con cliente. Bio corta de Anthony, 2 o 3 frases.
    bio: null,
    photo: '/images/venue/person-anthony-hayes.jpg',
    photoAlt: 'Anthony Hayes behind the bar at Rooftop at Riverside, serving a cocktail',
    quote: null,
  },
];

/**
 * La línea con la que el sitio actual abre `/this-is-us`, reescrita.
 *
 * El original dice: «After 4 years of planning, the "Bonitian" locals, the
 * Magnus family get to fulfill their dreams of bringing life, community fun,
 * and legacy to Bonita Springs». Los hechos (cuatro años, familia local,
 * Bonita Springs) se conservan; la sintaxis se arregla.
 */
export const STORY_LEAD =
  'Four years of planning, one local family, and a corner of Old 41 that was an idea in their kitchen long before it was a rooftop.';
