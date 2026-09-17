import { type VenueEvent, type Weekday } from '@/content/events';
import { BRAND } from './brand';

/**
 * Expansión del calendario: de un puñado de eventos a las fechas concretas.
 *
 * Todo esto corre EN EL SERVIDOR. Es la diferencia central con el sitio actual:
 * el calendario de Wix es un iframe de `calendar.boomte.ch` y no devuelve un
 * solo nombre de evento en el HTML. Acá cada ocurrencia está en el HTML servido
 * y la lee Google.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ACÁ ABAJO VIVÍA `buildICal()` Y SE FUE EL 2026-09-17, junto con la ruta
 * `/whats-on/calendar.ics` y los dos botones que la linkeaban. Camila: «¿esto
 * lo tenía la página vieja? si no, sacalo, me parece rarísimo».
 *
 * No lo tenía —`current-site-inventory.md` §9: «no hay `Event` en JSON-LD, no
 * hay iCal»—, y sin los botones eran 130 líneas y una ruta sirviendo a nadie.
 * Lo que sí queda, y es la parte que importaba, es el JSON-LD `Event` que
 * emite `/whats-on`: eso es lo que hace que los eventos existan para Google.
 *
 * Si algún día vuelve: los recurrentes tienen que salir como `RRULE` con
 * `BYDAY` de varios días y `UNTIL` cuando el evento tiene fin de temporada, no
 * como cientos de ocurrencias sueltas.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LOS EVENTOS ENTRAN POR PARÁMETRO Y ANTES SALÍAN DE `EVENTS_FALLBACK`.
 * Ese respaldo es el volcado versionado en `events.json`, o sea la foto de la
 * base del día que alguien corrió el sync por última vez.
 *
 * El costo era concreto y estaba en producción: la tira de la semana leía la
 * base en vivo y la GRILLA DEL MES leía el JSON, así que los dos bloques de
 * `/whats-on` podían contradecirse en la misma pantalla. Verificado el
 * 2026-09-17: en la base Wooftop Wednesdays y Bingo Night estaban cargados
 * como NO recurrentes y en el JSON seguían como semanales. La tira los
 * escondía y el mes los mostraba.
 *
 * Pedido de Camila, 2026-09-17: «en el calendario deben estar los de la base,
 * todos los eventos deben levantarse de ahí». Este módulo ya no importa
 * eventos: se los pasa quien los leyó, que es siempre una página server.
 * ══════════════════════════════════════════════════════════════════════════
 */

export interface Occurrence {
  readonly event: VenueEvent;
  /** Fecha ISO `YYYY-MM-DD` de esta ocurrencia concreta. */
  readonly date: string;
}

/** `2026-09` → `{ year: 2026, month: 9 }`. Devuelve el mes actual si no parsea. */
export function parseMonth(param: string | undefined): { year: number; month: number } {
  const m = param?.match(/^(\d{4})-(\d{2})$/);
  if (m) {
    const year = Number(m[1]);
    const month = Number(m[2]);
    if (month >= 1 && month <= 12 && year >= 2024 && year <= 2100) return { year, month };
  }
  const now = new Date();
  return { year: now.getUTCFullYear(), month: now.getUTCMonth() + 1 };
}

export const monthKey = (year: number, month: number) =>
  `${year}-${String(month).padStart(2, '0')}`;

export function monthLabel(year: number, month: number): string {
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function shiftMonth(year: number, month: number, delta: number) {
  const d = new Date(Date.UTC(year, month - 1 + delta, 1));
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1 };
}

const iso = (y: number, m: number, d: number) =>
  `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

export const weekdayOf = (date: string) =>
  new Date(`${date}T12:00:00Z`).getUTCDay() as Weekday;

/**
 * Hoy en el huso del venue, como `YYYY-MM-DD`.
 *
 * ⚠️ NO ES `new Date().toISOString()`. El servidor de Vercel corre en UTC: a
 * las 9 de la noche en Bonita Springs allá ya es el día siguiente, así que el
 * evento de esta noche desaparecería de «lo que viene» cuatro horas antes de
 * empezar. `en-CA` se usa porque formatea justo `YYYY-MM-DD`.
 */
export function todayInVenue(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: BRAND.address.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

/**
 * ¿Este evento pasa este día?
 *
 * ⚠️ UN RECURRENTE NO ES ETERNO: se repite en su día de la semana, pero
 * solamente entre `from` y `until`. Sin ese corte, un evento de temporada se
 * publica todo el año y una promo que terminó sigue prometida en el
 * calendario, que es peor que no tenerla.
 *
 * ⚠️ UN PUNTUAL ES UNA FECHA Y NADA MÁS. Es el caso de todo lo que tiene
 * agenda irregular, y desde el 2026-09-17 es el caso por defecto: el
 * dashboard sólo sabe guardar UN día de la semana como recurrencia, así que
 * algo que pasa «un miércoles al mes» cargado como semanal es directamente un
 * dato falso. Lo correcto es una fila por fecha.
 */
export function happensOn(event: VenueEvent, date: string): boolean {
  if (event.kind !== 'recurring') return event.date === date;
  if (!event.weekdays.includes(weekdayOf(date))) return false;
  if (date < event.from) return false;
  return event.until === null || date <= event.until;
}

const byDateThenTime = (a: Occurrence, b: Occurrence) =>
  a.date === b.date
    ? a.event.startTime.localeCompare(b.event.startTime)
    : a.date.localeCompare(b.date);

/**
 * Todas las ocurrencias de un mes, ordenadas por fecha y hora.
 *
 * Los recurrentes se expanden sobre cada día del mes que cae en su día de la
 * semana y está dentro de su temporada. Los puntuales entran por su fecha.
 */
export function occurrencesInMonth(
  events: readonly VenueEvent[],
  year: number,
  month: number,
): readonly Occurrence[] {
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const out: Occurrence[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = iso(year, month, day);
    for (const event of events) {
      if (happensOn(event, date)) out.push({ event, date });
    }
  }

  return out.sort(byDateThenTime);
}

/**
 * LO QUE VIENE: las próximas N fechas reales, contando desde hoy.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ES LA LISTA QUE LA HOME NECESITA Y NO TENÍA. La home mostraba la
 * PROGRAMACIÓN SEMANAL —los recurrentes, con el nombre del día— y esa lista
 * tiene dos agujeros: deja afuera todo lo que tiene fecha propia, que es
 * justo lo que el cliente carga mes a mes, y no sabe decir «el sábado que
 * viene» sino «los sábados».
 *
 * Pedido de Camila, 2026-09-17: «en la home mostrar los próximos 8 para luego
 * llevarte a ver el calendario». Ocho es lo que ya entraba en el carrusel
 * (`MAX_CARDS`), así que el tope no cambia: cambia QUÉ se cuenta.
 *
 * ⚠️ MEZCLA LOS DOS TIPOS EN UNA SOLA LISTA ORDENADA POR FECHA, que es la
 * única forma de que «lo próximo» sea cierto. Un recurrente de mañana va
 * antes que un puntual de la semana que viene, y al revés.
 *
 * ⚠️ EL HORIZONTE ESTÁ ACOTADO A 120 DÍAS. Sin tope, un calendario vacío
 * haría girar el bucle para siempre buscando ocho fechas que no existen.
 * Cuatro meses es más que suficiente: el cliente entrega el calendario del
 * mes siguiente el día 10.
 * ══════════════════════════════════════════════════════════════════════════
 */
export function upcomingOccurrences(
  events: readonly VenueEvent[],
  from: string,
  limit: number,
): readonly Occurrence[] {
  const HORIZONTE = 120;
  const out: Occurrence[] = [];
  const day = new Date(`${from}T12:00:00Z`);

  for (let i = 0; i < HORIZONTE && out.length < limit; i++) {
    const date = day.toISOString().slice(0, 10);
    const delDia: Occurrence[] = [];
    for (const event of events) {
      if (happensOn(event, date)) delDia.push({ event, date });
    }
    // Un día puede tener más de un evento: entran ordenados por hora, y si
    // el cupo se agota en el medio, se corta ahí. Mejor ocho fechas ciertas
    // que nueve para emparejar un día.
    out.push(...delDia.sort(byDateThenTime).slice(0, limit - out.length));
    day.setUTCDate(day.getUTCDate() + 1);
  }

  return out;
}

/** Las ocurrencias agrupadas por día, para la vista de lista. */
export function groupByDay(occ: readonly Occurrence[]) {
  const map = new Map<string, Occurrence[]>();
  for (const o of occ) {
    const list = map.get(o.date);
    if (list) list.push(o);
    else map.set(o.date, [o]);
  }
  return [...map.entries()].map(([date, events]) => ({ date, events }));
}

/**
 * La grilla del mes: semanas de 7 celdas empezando en domingo, con las celdas
 * de relleno del mes anterior y el siguiente en `null`.
 */
export function monthGrid(year: number, month: number) {
  const first = new Date(Date.UTC(year, month - 1, 1));
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const leading = first.getUTCDay();

  const cells: (string | null)[] = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => iso(year, month, i + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (string | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export const dayNumber = (date: string) => Number(date.slice(8, 10));

export function longDate(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
