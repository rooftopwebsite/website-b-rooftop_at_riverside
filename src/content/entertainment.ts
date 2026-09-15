import { getVenueEvents } from './events';

/**
 * CUÁNTAS NOCHES HAY ENTRETENIMIENTO. El claim, sin dar por cierto lo que no
 * está confirmado.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ EL CLIENTE PIDIÓ QUE «FREE ENTERTAINMENT 5 NIGHTS A WEEK» NO SE DÉ POR
 * DEFINITIVO hasta confirmarlo con los event coordinators. Pedido del
 * 2026-09-15, y tenía razón en dudar.
 *
 * ⚠️ PORQUE LOS DATOS DEL PROPIO DASHBOARD DICEN OTRA COSA. Contados los
 * eventos recurrentes cargados en RestoExp al 2026-09-15:
 *
 *     NFC North HQ              domingo    deportes
 *     Wooftop Wednesdays        miércoles  perros, happy hour
 *     Bingo Night               miércoles  bingo
 *     Ross Brown                jueves     música en vivo
 *     La Noche · DJ David Cast  sábado     DJ
 *
 * Son CUATRO noches distintas con algo, y sólo DOS con música. No cinco. El
 * «five nights a week» aparecía en doce lugares del sitio, incluido el pill
 * del hero y tres descriptions de SEO.
 *
 * ⚠️ MIENTRAS NO ESTÉ CONFIRMADO, EL SITIO NO DICE UN NÚMERO. Dice lo que el
 * calendario puede sostener, y el calendario es la fuente: si el cliente carga
 * una quinta noche mañana, el texto la cuenta sola. Un número escrito a mano
 * en doce archivos es lo que nos puso en esta situación.
 *
 * ⚠️ CÓMO SE ACTIVA EL CLAIM: los coordinadores confirman, se pone
 * `CONFIRMADO = true` y `NOCHES_CONFIRMADAS` con el número real. Nada más.
 * ══════════════════════════════════════════════════════════════════════════
 */

/** Lo pone en `true` el cliente, no nosotros. */
export const CONFIRMADO = false;

/**
 * El número que el cliente quiere comunicar, a la espera de confirmación.
 * No se renderiza mientras `CONFIRMADO` sea `false`.
 */
export const NOCHES_CLAIM = 5;

/** Cuántas noches distintas de la semana tienen algo cargado hoy. */
export async function nochesConEventos(): Promise<number> {
  const eventos = await getVenueEvents();
  const dias = new Set(
    eventos.filter((e) => e.kind === 'recurring' && e.weekday !== null).map((e) => e.weekday),
  );
  return dias.size;
}

/** De esas, cuántas tienen música o DJ. */
export async function nochesConMusica(): Promise<number> {
  const eventos = await getVenueEvents();
  const dias = new Set(
    eventos
      .filter(
        (e) =>
          e.kind === 'recurring' &&
          e.weekday !== null &&
          e.tags.some((t) => ['live-music', 'dj', 'music'].includes(t)),
      )
      .map((e) => e.weekday),
  );
  return dias.size;
}

const PALABRA = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven'] as const;

/**
 * La frase para el copy, en inglés.
 *
 * Confirmado: «Live music five nights a week».
 * Sin confirmar: lo que el calendario sostiene, contado en vivo.
 */
export async function fraseEntretenimiento(): Promise<string> {
  if (CONFIRMADO) return `Live music ${PALABRA[NOCHES_CLAIM]} nights a week`;
  const n = await nochesConMusica();
  if (n === 0) return 'Live music on the calendar';
  if (n === 1) return 'Live music every week';
  return `Live music ${PALABRA[n]} nights a week`;
}

/** La versión corta, para la píldora del hero (cabe en 22 caracteres). */
export async function fraseCorta(): Promise<string> {
  if (CONFIRMADO) return `Live music ${PALABRA[NOCHES_CLAIM]} nights`;
  const n = await nochesConMusica();
  return n >= 2 ? `Live music ${PALABRA[n]} nights` : 'Live music this week';
}

/**
 * La frase de «qué pasa en la semana», que no habla sólo de música.
 *
 * ⚠️ NO DICE «free». Que la entrada sea libre está verificado para los
 * recurrentes cargados —ninguno tiene `ticketUrl`— pero «free entertainment»
 * como promesa general es parte de lo mismo que el cliente quiere confirmar.
 */
export async function fraseSemana(): Promise<string> {
  const n = await nochesConEventos();
  if (n === 0) return 'Something on most weeks';
  return `Something on ${PALABRA[n]} nights a week`;
}
