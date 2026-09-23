import 'server-only';
import { BRAND } from './brand';

/**
 * A QUÉ BUZÓN VA CADA FORMULARIO. El único lugar del sitio que lo decide.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LOS DESTINOS SALEN DEL SITIO VIGENTE (eatdrinkparadise.com), verificado
 * el 2026-09-23 sobre el volcado de `src/content/_source/`:
 *
 *   · `info@`   → el buzón del pie de las 23 páginas. Es el único genérico que
 *                 publica el sitio, así que recibe todo lo que no tiene dueño
 *                 propio: contacto, market y músicos (`/entertainment` y
 *                 `/neighborhood-market` no publican otro mail).
 *   · `hiring@` → el del pie, al lado de `info@`, y el de «Interested in
 *                 joining our team?» en `/this-is-us`.
 *   · `events@` → NO está en el sitio. Sale de la lámina «Let's collaborate»
 *                 del PDF de eventos del cliente, junto a `mpowers@` (ver
 *                 `docs/pedido-al-cliente.md`, ítem 53).
 *
 * ⚠️ NO SE USAN LOS PERSONALES (`cmagnus@`, `ahayes@`, `mpowers@`) aunque
 * estén publicados. Un buzón personal se va con la persona; el genérico queda.
 * Si el cliente quiere copia a alguien, se agrega a la variable separado por
 * coma, sin tocar código.
 *
 * ⚠️ CADA DESTINO ES UNA VARIABLE DE ENTORNO CON RESPALDO EN `brand.ts`. La
 * variable permite cambiar a quién le llega sin un commit; el respaldo hace
 * que un deploy sin la variable siga entregando al buzón público y no a la
 * nada. Lo que NO hace es fallar en silencio: `sendMail` loguea el destino.
 * ══════════════════════════════════════════════════════════════════════════
 */

export type Inbox = 'contact' | 'events' | 'careers' | 'market' | 'booking';

const FALLBACK: Record<Inbox, string> = {
  contact: BRAND.contact.email,
  events: BRAND.contact.events,
  careers: BRAND.contact.hiring,
  market: BRAND.contact.email,
  booking: BRAND.contact.email,
};

/*
 * ⚠️ LOS NOMBRES SIGUEN LA CONVENCIÓN DE LA CASA (`MAIL_TO_*`), la misma de
 * the-orient y casa-pirul. Quien pasa de un proyecto a otro encuentra lo mismo.
 */
const ENV: Record<Inbox, string> = {
  contact: 'MAIL_TO_CONTACT',
  events: 'MAIL_TO_EVENTS',
  careers: 'MAIL_TO_CAREERS',
  market: 'MAIL_TO_MARKET',
  booking: 'MAIL_TO_BOOKING',
};

/** Una o varias direcciones separadas por coma. Las vacías se descartan. */
function parse(raw: string | undefined): string[] {
  return (raw ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function inboxFor(box: Inbox): string[] {
  const deEnv = parse(process.env[ENV[box]]);
  return deEnv.length > 0 ? deEnv : [FALLBACK[box]];
}

/**
 * El buzón que se le muestra a la persona cuando el envío falla, para que
 * tenga a dónde escribir. Siempre el primero de la lista.
 */
export function publicInbox(box: Inbox): string {
  return inboxFor(box)[0]!;
}
