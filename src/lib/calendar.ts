import { type VenueEvent, type Weekday } from '@/content/events';
import { BRAND } from './brand';

export interface Occurrence {
  readonly event: VenueEvent;
  readonly date: string;
}

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

export type CalendarView = 'grid' | 'calendar';

export const parseView = (param: string | undefined): CalendarView =>
  param === 'calendar' ? 'calendar' : 'grid';

export const monthKey = (year: number, month: number) =>
  `${year}-${String(month).padStart(2, '0')}`;

export function monthLabel(year: number, month: number): string {
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function monthLabelShort(year: number, month: number): string {
  return new Date(Date.UTC(year, month - 1, 1))
    .toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
    .toUpperCase();
}

export function shiftMonth(year: number, month: number, delta: number) {
  const d = new Date(Date.UTC(year, month - 1 + delta, 1));
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1 };
}

const iso = (y: number, m: number, d: number) =>
  `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

export const weekdayOf = (date: string) =>
  new Date(`${date}T12:00:00Z`).getUTCDay() as Weekday;

export function diaSiguiente(date: string): string {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return iso(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
}

export function todayInVenue(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: BRAND.address.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

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
    out.push(...delDia.sort(byDateThenTime).slice(0, limit - out.length));
    day.setUTCDate(day.getUTCDate() + 1);
  }

  return out;
}

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

export function upcomingInMonth(
  events: readonly VenueEvent[],
  year: number,
  month: number,
  from: string,
): readonly Occurrence[] {
  return occurrencesInMonth(events, year, month).filter((o) => o.date >= from);
}

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

const parte = (date: string, opts: Intl.DateTimeFormatOptions) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', { ...opts, timeZone: 'UTC' });

export const weekdayShort = (date: string) => parte(date, { weekday: 'short' }).toUpperCase();

export const weekdayLong = (date: string) => parte(date, { weekday: 'long' });

export const monthShort = (date: string) => parte(date, { month: 'short' }).toUpperCase();

export const monthDay = (date: string) => parte(date, { month: 'short', day: 'numeric' });
