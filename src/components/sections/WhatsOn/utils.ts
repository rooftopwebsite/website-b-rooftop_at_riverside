import { type Weekday } from '@/content/events';

export const MAX_CARDS = 8;

export const gapTrack = (track: HTMLElement) => parseFloat(getComputedStyle(track).columnGap) || 0;

export const bordeTrack = (track: HTMLElement) => parseFloat(getComputedStyle(track).paddingLeft) || 0;

export const ANCHO = 'w-[calc(100%-20px)] md:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)]';

export const VISIBLES = [
  { mq: '(min-width: 1024px)', n: 3 },
  { mq: '(min-width: 768px)', n: 2 },
] as const;

export function venueToday(): { readonly weekday: Weekday; readonly date: string } {
  const label = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
  }).format(new Date());
  const map: Record<string, Weekday> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const date = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  return { weekday: map[label] ?? 0, date };
}

export const CLOSED_DAYS: readonly Weekday[] = [1, 2];
