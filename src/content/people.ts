import type { Person } from '@/types/content';

/**
 * Las dos personas que el cliente publica con nombre y cara.
 *
 * ⚠️ FUENTE: `/this-is-us` del sitio vigente, verificado el 2026-09-15 sobre
 * `content/_source/this-is-us.md`. De ahí salen los tres datos de cada uno
 * —nombre, rol y mail— y la cita de Chris, textual.
 *
 * ⚠️ NO HAY BIO NI FOTO DE NINGUNO DE LOS DOS, y no se inventan. El sitio
 * actual los muestra con nombre, cargo y mail y nada más. Los dos campos
 * quedan en `null` y la página los renderiza como pendiente visible, que es lo
 * que hace que el hueco se note y se pida, en vez de rellenarlo con una
 * descripción verosímil.
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
    // TODO: confirmar con cliente. Retrato de Chris, vertical, 3:4.
    photo: null,
    photoAlt: null,
    quote:
      'We hope this park will be a staple for families in the community, a symbol for up and coming entrepreneurs and business owners, and a landmark our kids would be proud of.',
  },
  {
    name: 'Anthony Hayes',
    role: 'General manager',
    email: 'ahayes@eatdrinkparadise.com',
    // TODO: confirmar con cliente. Bio corta de Anthony, 2 o 3 frases.
    bio: null,
    // TODO: confirmar con cliente. Retrato de Anthony, vertical, 3:4.
    photo: null,
    photoAlt: null,
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
