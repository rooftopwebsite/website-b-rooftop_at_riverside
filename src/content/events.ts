import raw from './events.json';
import { BRAND } from '@/lib/brand';
import { withoutEmDash } from '@/lib/em-dash';

export type EventKind = 'recurring' | 'one-off' | 'festival';
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface RawEvent {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly bannerUrl: string | null;
  readonly startDate: string;
  readonly endDate: string | null;
  readonly startTime: string;
  readonly endTime: string | null;
  readonly isRecurring: boolean;
  readonly recurrenceType: string | null;
  readonly recurrenceDays: string | null;
  readonly price: number | string | null;
  readonly tags: readonly string[];
  readonly ticketUrl?: string | null;
  readonly imageAlt?: string | null;
}

export interface VenueEvent {
  readonly slug: string;
  readonly title: string;
  readonly kind: EventKind;
  readonly summary: string;
  readonly body: readonly string[];
  readonly weekdays: readonly Weekday[];
  readonly date: string | null;
  readonly from: string;
  readonly until: string | null;
  readonly startTime: string;
  readonly endTime: string;
  readonly endsNextDay: boolean;
  readonly space: 'Sunset Bar' | 'The Yard' | 'Game Lounge' | 'Venue-wide';
  readonly ticketUrl: string | null;
  readonly price: number | null;
  readonly image: string | null;
  readonly imageAlt: string | null;
  readonly tags: readonly string[];
}

function slugify(title: string): string {
  return title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const hhmm = (t: string | null): string => (t ?? '').slice(0, 5);

function spaceFromTags(tags: readonly string[]): VenueEvent['space'] {
  if (tags.includes('sunset-bar')) return 'Sunset Bar';
  if (tags.includes('the-yard')) return 'The Yard';
  if (tags.includes('game-lounge')) return 'Game Lounge';
  return 'Venue-wide';
}

function parseWeekdays(days: string | null): readonly Weekday[] {
  if (!days) return [];
  try {
    const arr = JSON.parse(days);
    if (!Array.isArray(arr)) return [];
    return arr
      .map(Number)
      .filter((n): n is Weekday => Number.isInteger(n) && n >= 0 && n <= 6)
      .sort((a, b) => a - b);
  } catch {
    return [];
  }
}

const ALT: Readonly<Record<string, string>> = {
  'ross-brown':
    'Event poster reading “Live Entertainment: Ross Brown”, with Ross Brown singing into a microphone in a palm-print shirt',
  'la-noche-dj-david-cast':
    'Event poster reading “La Noche: every Saturday 10 PM to 2 AM, Latin music from DJ David Cast, free dance classes”',
};

const TICKETS: Readonly<Record<string, string>> = {
  ...(BRAND.eventbrite
    ? {
        'ross-brown': BRAND.eventbrite,
        'la-noche-dj-david-cast': BRAND.eventbrite,
      }
    : {}),
};

const IS_ITEM = /^(?:\d+[.)]|\$\d)/;

function subheadOf(paragraphs: readonly string[]): string | null {
  const prose = paragraphs.find((p) => !IS_ITEM.test(p.trim()));
  if (!prose) return paragraphs[0] ?? null;
  return prose.split(/(?<=\.)\s/)[0] ?? prose;
}

function adapt(r: RawEvent): VenueEvent {
  const weekdays = r.isRecurring ? parseWeekdays(r.recurrenceDays) : [];
  const start = hhmm(r.startTime);
  const end = hhmm(r.endTime) || start;
  const title = withoutEmDash(r.title);
  const paragraphs = withoutEmDash(r.description ?? '')
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  const price = r.price === null ? null : Number(r.price);
  const slug = slugify(title);

  return {
    slug,
    title,
    kind: r.isRecurring ? 'recurring' : 'one-off',
    summary: subheadOf(paragraphs) ?? r.title,
    body: paragraphs,
    weekdays,
    date: r.isRecurring ? null : r.startDate,
    from: r.startDate,
    until: r.endDate,
    startTime: start,
    endTime: end,
    endsNextDay: end < start,
    space: spaceFromTags(r.tags),
    ticketUrl: r.ticketUrl ?? TICKETS[slug] ?? null,
    price: price !== null && Number.isFinite(price) && price > 0 ? price : null,
    image: r.bannerUrl,
    imageAlt: r.bannerUrl ? (r.imageAlt ?? ALT[slug] ?? `Poster for ${title}`) : null,
    tags: r.tags,
  };
}

export async function getVenueEvents(): Promise<readonly VenueEvent[]> {
  const { sanityEvents } = await import('@/lib/sanity-events');
  return ((await sanityEvents()) ?? (raw as readonly RawEvent[])).map(adapt);
}

export const featuredEvent = async () =>
  (await getVenueEvents()).find((e) => e.tags.includes('featured')) ?? null;

export const eventBySlug = async (slug: string) =>
  (await getVenueEvents()).find((e) => e.slug === slug);

const WEEKDAY_LABEL = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

export const weekdayLabel = (d: Weekday) => WEEKDAY_LABEL[d];

export function formatTime(hm: string): string {
  const [h, m] = hm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour} ${suffix}` : `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
}

export function timeRange(e: VenueEvent): string {
  if (e.endTime === e.startTime) return formatTime(e.startTime);
  return `${formatTime(e.startTime)} – ${formatTime(e.endTime)}`;
}

export function shortDate(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function weekdaysLabel(days: readonly Weekday[], short = false): string {
  const name = (d: Weekday) => (short ? weekdayLabel(d).slice(0, 3) : weekdayLabel(d));

  if (days.length === 0) return '';
  if (days.length === 1) return name(days[0]);

  const weekend = days.length === 2 && days[0] === 0 && days[1] === 6;
  if (weekend) return `${name(6)} – ${name(0)}`;

  const consecutive = days.every((d, i) => i === 0 || d === days[i - 1] + 1);
  if (consecutive) return `${name(days[0])} – ${name(days[days.length - 1])}`;

  const names = days.map(name);
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

export function whenLabel(e: VenueEvent): string {
  const time = timeRange(e);
  if (e.kind === 'recurring' && e.weekdays.length > 0) {
    return `Every ${weekdaysLabel(e.weekdays)} · ${time}`;
  }
  if (e.date) {
    const label = new Date(`${e.date}T12:00:00Z`).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    });
    return `${label} · ${time}`;
  }
  return time;
}

export async function eventsOnWeekday(day: Weekday): Promise<readonly VenueEvent[]> {
  return (await getVenueEvents()).filter(
    (e) => e.kind === 'recurring' && e.weekdays.includes(day),
  );
}

export interface EventFilter {
  readonly id: string;
  readonly label: string;
  readonly tags: readonly string[];
}

export const EVENT_FILTERS: readonly EventFilter[] = [
  { id: 'music', label: 'Live music', tags: ['live-music', 'dj', 'music'] },
  { id: 'sports', label: 'Sports', tags: ['sports'] },
  { id: 'themed', label: 'Themed nights', tags: ['bingo', 'themed', 'trivia', 'karaoke'] },
  { id: 'festival', label: 'Festivals', tags: ['festival'] },
  { id: 'family', label: 'Family and dogs', tags: ['dog-friendly', 'family', 'kids'] },
];

export const matchesFilter = (e: VenueEvent, id: string | null): boolean => {
  if (!id) return true;
  const f = EVENT_FILTERS.find((x) => x.id === id);
  if (!f) return true;
  return e.tags.some((t) => f.tags.includes(t)) || (id === 'festival' && e.kind === 'festival');
};

// Pills hidden until there is enough programming. The events stay under Everything and on the
// calendar, and the ids stay in EVENT_FILTERS for event colors.
const HIDDEN_FILTER_IDS: readonly string[] = ['themed', 'festival'];

export const activeFilters = (events: readonly VenueEvent[]): readonly EventFilter[] =>
  EVENT_FILTERS.filter(
    (f) => !HIDDEN_FILTER_IDS.includes(f.id) && events.some((e) => matchesFilter(e, f.id)),
  );

export const isTicketed = (e: VenueEvent): boolean => e.ticketUrl !== null;

export const isLimitedRun = (e: VenueEvent): boolean =>
  e.kind !== 'recurring' || e.until !== null;

export const standsOut = (e: VenueEvent): boolean => isLimitedRun(e) || isTicketed(e);
