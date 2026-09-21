import { getVenueEvents, type VenueEvent } from './events';
import { todayInVenue } from '@/lib/calendar';

/**
 * ¿Este recurrente está corriendo HOY?
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ANTES NO SE MIRABA Y LA CUENTA SE INFLABA. Las funciones de abajo
 * contaban los días de la semana de TODOS los recurrentes, sin fijarse en su
 * temporada, así que un evento que arranca en diciembre ya sumaba una noche
 * en septiembre.
 *
 * Se notó el 2026-09-17 con Ross Brown, que pasó a ser una residencia de
 * cuatro jueves de diciembre: sin este filtro el sitio seguía diciendo «live
 * music two nights a week» durante los tres meses en que la única noche con
 * música es el sábado.
 *
 * Es el mismo criterio de `happensOn` en `lib/calendar.ts`, aplicado a la
 * temporada en vez de a un día puntual.
 * ══════════════════════════════════════════════════════════════════════════
 */
const enTemporada = (e: VenueEvent, hoy: string): boolean =>
  e.from <= hoy && (e.until === null || e.until >= hoy);

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
 * ⚠️ ACTUALIZADO EL 2026-09-21: **Wooftop Wednesdays dejó de ser semanal.**
 * Pasó a ser Wooftop Fest, el tercer miércoles de cada mes, según el mail de
 * Madeline Powers del 17 de septiembre y su confirmación del 18. El miércoles
 * NO sale de la cuenta porque Bingo Night sigue siendo semanal ese día.
 *
 * Son CUATRO noches distintas con algo, y sólo DOS con música. No cinco. El
 * «five nights a week» aparecía en doce lugares del sitio, incluido el pill
 * del hero y tres descriptions de SEO.
 *
 * ⚠️ ACTUALIZADO EL 2026-09-17: **Ross Brown dejó de ser semanal.** Pasó a ser
 * una residencia de cuatro jueves de diciembre (10, 17, 24 y 31), según el
 * calendario de Google del cliente. O sea que hasta el 10 de diciembre la
 * única noche con música es el sábado, y las cuentas de abajo lo reflejan
 * solas gracias a `enTemporada`.
 *
 * ⚠️ Y CONTRADICE AL CALENDARIO PÚBLICO DE WIX, que el 2026-09-11 mostraba a
 * Ross Brown los jueves 17 y 24 de septiembre. Se eligió el de Google porque
 * es el que el venue usa para operar y el de Wix es la fuente que este
 * proyecto viene a reemplazar por desactualizada. **Es pregunta abierta al
 * cliente**, y si confirma que sigue semanal se borra el `end_date` en el
 * dashboard y listo. Detalle en `_interno/calendario-google-2026-09-17.md`.
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
  const hoy = todayInVenue();
  // `flatMap`: un evento puede caer en varios días (el happy hour es sábado
  // y domingo), y lo que se cuenta son DÍAS distintos, no eventos.
  const dias = new Set(
    eventos
      .filter((e) => e.kind === 'recurring' && enTemporada(e, hoy))
      .flatMap((e) => e.weekdays),
  );
  return dias.size;
}

/** De esas, cuántas tienen música o DJ. */
export async function nochesConMusica(): Promise<number> {
  const eventos = await getVenueEvents();
  const hoy = todayInVenue();
  const dias = new Set(
    eventos
      .filter(
        (e) =>
          e.kind === 'recurring' &&
          enTemporada(e, hoy) &&
          e.tags.some((t) => ['live-music', 'dj', 'music'].includes(t)),
      )
      .flatMap((e) => e.weekdays),
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
