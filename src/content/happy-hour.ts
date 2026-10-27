import type { HappyHour } from '@/types/content';
import { formatTime, getVenueEvents, weekdaysLabel, type VenueEvent } from './events';

export const HAPPY_HOUR: HappyHour = {
  days: 'Saturday – Sunday',
  daysShort: 'Sat – Sun',
  time: '12 PM – 6 PM',
  deals: [
    { price: '$1 off', what: 'Drafts, bottles and cans' },
    { price: '$8', what: "Tito's, Captain, Crown's" },
    { price: '$10', what: 'Margaritas' },
  ],
  note: 'Superior Light Beer is the featured pour.',
};

const OFFER_LINE = /^(\$\d+(?:\.\d{1,2})?(?:\s+off)?)\s+(.+)$/i;

function fromEvent(e: VenueEvent): HappyHour {
  const lines = e.body.flatMap((p) => p.split('\n')).map((l) => l.trim()).filter(Boolean);

  const deals: { price: string; what: string }[] = [];
  const loose: string[] = [];

  for (const line of lines) {
    const m = OFFER_LINE.exec(line);
    if (m) {
      deals.push({ price: m[1], what: m[2].charAt(0).toUpperCase() + m[2].slice(1) });
    } else {
      loose.push(line);
    }
  }

  return {
    days: weekdaysLabel(e.weekdays),
    daysShort: weekdaysLabel(e.weekdays, true),
    time: `${formatTime(e.startTime)} – ${formatTime(e.endTime)}`,
    deals: deals.length > 0 ? deals : HAPPY_HOUR.deals,
    note: loose.slice(1).join(' ') || null,
  };
}

export async function getHappyHour(): Promise<HappyHour> {
  const events = await getVenueEvents();
  const event = events.find((e) => /happy\s*hour/i.test(e.title));
  return event ? fromEvent(event) : HAPPY_HOUR;
}

const PILL_CAP = 22;

export async function happyHourPhrase(): Promise<string> {
  const events = await getVenueEvents();
  const title = events.find((e) => /happy\s*hour/i.test(e.title))?.title;
  if (title && title.length <= PILL_CAP) return title;
  return 'Happy hour';
}
