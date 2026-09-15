import { EVENTS_FALLBACK, type VenueEvent, type Weekday } from '@/content/events';
import { venueAddressLine, type Venue } from './venue';
import { BRAND } from './brand';
import { SITE_URL } from './seo';

/**
 * Expansión del calendario y exportación a iCal.
 *
 * Todo esto corre EN EL SERVIDOR. Es la diferencia central con el sitio actual:
 * el calendario de Wix es un iframe de `calendar.boomte.ch` y no devuelve un
 * solo nombre de evento en el HTML. Acá cada ocurrencia está en el HTML servido
 * y cada evento tiene su propia URL.
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

/**
 * Todas las ocurrencias de un mes, ordenadas por fecha y hora.
 *
 * Los recurrentes se expanden sobre cada día del mes que cae en su día de la
 * semana. Los puntuales entran si su fecha es de ese mes.
 */
export function occurrencesInMonth(year: number, month: number): readonly Occurrence[] {
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const out: Occurrence[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = iso(year, month, day);
    const weekday = new Date(`${date}T12:00:00Z`).getUTCDay() as Weekday;

    for (const event of EVENTS_FALLBACK) {
      if (event.kind === 'recurring' && event.weekday === weekday) {
        out.push({ event, date });
      } else if (event.date === date) {
        out.push({ event, date });
      }
    }
  }

  return out.sort((a, b) =>
    a.date === b.date
      ? a.event.startTime.localeCompare(b.event.startTime)
      : a.date.localeCompare(b.date),
  );
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

/* ==========================================================================
   iCal
   ========================================================================== */

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

/** RFC 5545 pide líneas de 75 octetos como máximo, plegadas con un espacio. */
function fold(line: string): string {
  if (line.length <= 73) return line;
  const parts: string[] = [];
  let rest = line;
  parts.push(rest.slice(0, 73));
  rest = rest.slice(73);
  while (rest.length > 72) {
    parts.push(` ${rest.slice(0, 72)}`);
    rest = rest.slice(72);
  }
  if (rest) parts.push(` ${rest}`);
  return parts.join('\r\n');
}

const RRULE_DAY = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'] as const;

/**
 * El calendario completo en iCal, con los recurrentes como RRULE en vez de
 * cientos de ocurrencias sueltas. Es lo que hace que el archivo pese 3 KB y no
 * 300, y que Google Calendar los muestre como serie.
 */
export function buildICal(venue: Venue): string {
  const now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${BRAND.name}//Events//EN`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${esc(BRAND.name)}`,
    `X-WR-TIMEZONE:${venue.timezone}`,
  ];

  for (const e of EVENTS_FALLBACK) {
    // Para los recurrentes hace falta una fecha de arranque: se usa la primera
    // ocurrencia a partir de hoy que caiga en su día de la semana.
    let startDate = e.date;
    if (!startDate && e.weekday !== null) {
      const d = new Date();
      while (d.getUTCDay() !== e.weekday) d.setUTCDate(d.getUTCDate() + 1);
      startDate = d.toISOString().slice(0, 10);
    }
    if (!startDate) continue;

    const dt = (day: string, hhmm: string) => `${day.replace(/-/g, '')}T${hhmm.replace(':', '')}00`;
    const endDay = e.endsNextDay
      ? new Date(new Date(`${startDate}T12:00:00Z`).getTime() + 86400000).toISOString().slice(0, 10)
      : startDate;

    lines.push(
      'BEGIN:VEVENT',
      `UID:${e.slug}@rooftopatriverside.com`,
      `DTSTAMP:${now}`,
      `DTSTART;TZID=${venue.timezone}:${dt(startDate, e.startTime)}`,
      `DTEND;TZID=${venue.timezone}:${dt(endDay, e.endTime)}`,
      fold(`SUMMARY:${esc(e.title)}`),
      fold(`DESCRIPTION:${esc(e.summary)}`),
      fold(`LOCATION:${esc(`${e.space}, ${venue.name}, ${venueAddressLine(venue)}`)}`),
      fold(`URL:${SITE_URL}/whats-on/${e.slug}`),
    );

    if (e.kind === 'recurring' && e.weekday !== null) {
      lines.push(`RRULE:FREQ=WEEKLY;BYDAY=${RRULE_DAY[e.weekday]}`);
    }

    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');
  // RFC 5545: los saltos son CRLF.
  return `${lines.join('\r\n')}\r\n`;
}
