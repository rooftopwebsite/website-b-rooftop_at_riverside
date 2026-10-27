import { getVenueEvents, type VenueEvent } from './events';
import { todayInVenue } from '@/lib/calendar';

const inSeason = (e: VenueEvent, today: string): boolean =>
  e.from <= today && (e.until === null || e.until >= today);

export const CONFIRMED = false;

export const NIGHTS_CLAIM = 5;

export async function nightsWithEvents(): Promise<number> {
  const events = await getVenueEvents();
  const today = todayInVenue();
  const days = new Set(
    events
      .filter((e) => e.kind === 'recurring' && inSeason(e, today))
      .flatMap((e) => e.weekdays),
  );
  return days.size;
}

export async function nightsWithMusic(): Promise<number> {
  const events = await getVenueEvents();
  const today = todayInVenue();
  const days = new Set(
    events
      .filter(
        (e) =>
          e.kind === 'recurring' &&
          inSeason(e, today) &&
          e.tags.some((t) => ['live-music', 'dj', 'music'].includes(t)),
      )
      .flatMap((e) => e.weekdays),
  );
  return days.size;
}

const WORD = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven'] as const;

export async function entertainmentPhrase(): Promise<string> {
  if (CONFIRMED) return `Live music ${WORD[NIGHTS_CLAIM]} nights a week`;
  const n = await nightsWithMusic();
  if (n === 0) return 'Live music on the calendar';
  if (n === 1) return 'Live music every week';
  return `Live music ${WORD[n]} nights a week`;
}

export async function shortPhrase(): Promise<string> {
  if (CONFIRMED) return `Live music ${WORD[NIGHTS_CLAIM]} nights`;
  const n = await nightsWithMusic();
  return n >= 2 ? `Live music ${WORD[n]} nights` : 'Live music this week';
}

export async function weekPhrase(): Promise<string> {
  const n = await nightsWithEvents();
  if (n === 0) return 'Something on most weeks';
  return `Something on ${WORD[n]} nights a week`;
}
