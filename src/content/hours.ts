import type { Hours } from '@/types/content';
import schedule from './hours.json';

type Segment = { readonly open: string; readonly close: string } | 'closed';
type Week = Readonly<Record<(typeof WEEK_DAYS)[number], Segment>>;

const WEEK_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

function clock(t: string): string {
  const [hRaw, m] = t.split(':');
  const h = Number(hRaw);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m} ${ampm}`;
}

const range = (t: Segment): string =>
  t === 'closed' ? 'Closed' : `${clock(t.open)} – ${clock(t.close)}`;

const bar = schedule.bar as Week;
const trucks = schedule.trucks as Week;

export const HOURS: readonly Hours[] = WEEK_DAYS.map((d) => ({
  day: d.charAt(0).toUpperCase() + d.slice(1),
  bar: range(bar[d]),
  trucks: range(trucks[d]),
}));

export const todayIndex = (): number => {
  const now = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
  );
  return (now.getDay() + 6) % 7;
};
