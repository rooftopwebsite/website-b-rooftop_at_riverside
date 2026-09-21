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

/**
 * Las ocurrencias indexadas por fecha, que es como las pide la grilla.
 *
 * ⚠️ REEMPLAZA A `groupByDay()`, que devolvía un arreglo de `{ date, events }`
 * y obligaba a quien lo usara a construir el `Map` igual. El único consumidor
 * era la vista de lista de `/whats-on`, que se eliminó el 2026-09-17 cuando el
 * calendario se volvió visual; la grilla y la agenda del celular necesitan
 * buscar por fecha, así que la forma correcta es el índice.
 */
export function occurrencesByDate(
  occ: readonly Occurrence[],
): ReadonlyMap<string, readonly Occurrence[]> {
  const map = new Map<string, Occurrence[]>();
  for (const o of occ) {
    const list = map.get(o.date);
    if (list) list.push(o);
    else map.set(o.date, [o]);
  }
  return map;
}

export interface NextUp {
  readonly event: VenueEvent;
  /** La PRIMERA fecha del evento dentro de la ventana. */
  readonly date: string;
  /** Las otras fechas del mismo evento dentro de la ventana, en orden. */
  readonly alsoOn: readonly string[];
}

/**
 * LO QUE VIENE, UNA TARJETA POR EVENTO.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ NO ES `upcomingOccurrences` CON OTRO NOMBRE, y la diferencia es el
 * motivo por el que existe. Aquella devuelve OCURRENCIAS: si el horizonte
 * abarca dos jueves, Ross Brown sale dos veces. Eso está bien en el carrusel
 * de la home, que es una tira corta de «las próximas ocho fechas», y está mal
 * en un muro de tarjetas con afiche: la misma foto grande repetida dos veces
 * en la misma pantalla se lee como un error de carga, no como un evento que
 * se repite.
 *
 * Pedido de Camila, 2026-09-17, al rediseñar `/whats-on`: «yo creo que debería
 * estar una sola vez cada evento de los próximos 15 días, si se repiten estar
 * una sola vez y que en la card debería entenderse que también está este mismo
 * evento esta x fecha».
 *
 * ⚠️ POR ESO LAS REPETICIONES NO SE TIRAN, SE GUARDAN. Van en `alsoOn`, y la
 * tarjeta las publica. Descartarlas sería mentir por omisión: alguien que no
 * puede el jueves 17 necesita saber que hay otro el 24, y ése es justamente el
 * dato que una lista de ocurrencias da gritando y una lista deduplicada
 * perdería.
 *
 * ⚠️ LA VENTANA SE CUENTA EN DÍAS, NO EN CANTIDAD DE EVENTOS. Son 15 días
 * corridos desde hoy: lo que la persona puede planear. El `limit` es un tope
 * de seguridad para que un mes de festival no publique treinta tarjetas, no el
 * criterio de corte.
 *
 * ⚠️ `from` TIENE QUE SER `todayInVenue()`. Ver la nota de esa función: con
 * `toISOString()` el servidor de Vercel, que corre en UTC, borra el evento de
 * esta noche cuatro horas antes de que empiece.
 * ══════════════════════════════════════════════════════════════════════════
 */
export function nextByEvent(
  events: readonly VenueEvent[],
  from: string,
  days: number,
  limit: number,
): readonly NextUp[] {
  const porSlug = new Map<string, { event: VenueEvent; date: string; alsoOn: string[] }>();
  const orden: string[] = [];
  const day = new Date(`${from}T12:00:00Z`);

  for (let i = 0; i < days; i++) {
    const date = day.toISOString().slice(0, 10);

    // Dentro de un mismo día manda la hora: el happy hour de las 3 va antes
    // que el bingo de las 7, igual que en la grilla del mes.
    const delDia = events
      .filter((e) => happensOn(e, date))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    for (const event of delDia) {
      const ya = porSlug.get(event.slug);
      if (ya) ya.alsoOn.push(date);
      else {
        porSlug.set(event.slug, { event, date, alsoOn: [] });
        orden.push(event.slug);
      }
    }

    day.setUTCDate(day.getUTCDate() + 1);
  }

  // `orden` ya está por fecha y hora de la PRIMERA aparición, que es el orden
  // en que se recorrió la ventana. No hace falta volver a ordenar.
  return orden.slice(0, limit).map((slug) => porSlug.get(slug)!);
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

/**
 * Las tres líneas de la placa de fecha de las tarjetas: `THU` / `17` / `SEP`.
 *
 * ⚠️ EL MES VA EN LA PLACA aunque la sección diga «los próximos 15 días». La
 * ventana cruza el fin de mes una de cada dos semanas, y una placa que dice
 * «THU 2» a fines de septiembre es una fecha que hay que adivinar.
 *
 * ⚠️ `timeZone: 'UTC'` con la hora clavada al mediodía, como en todo este
 * archivo: la fecha ya viene resuelta en el huso del venue y volver a
 * interpretarla en el del visitante la corre un día para medio planeta.
 */
const parte = (date: string, opts: Intl.DateTimeFormatOptions) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', { ...opts, timeZone: 'UTC' });

export const weekdayShort = (date: string) => parte(date, { weekday: 'short' }).toUpperCase();

export const monthShort = (date: string) => parte(date, { month: 'short' }).toUpperCase();

/** `2026-09-20` → `Sep 20`. Las repeticiones, en el renglón de la tarjeta. */
export const monthDay = (date: string) => parte(date, { month: 'short', day: 'numeric' });
