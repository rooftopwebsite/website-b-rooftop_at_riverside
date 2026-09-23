import type { Hours } from '@/types/content';

interface Now {
  readonly dayIndex: number;
  readonly minutes: number;
}

export function nowInVenueTz(): Now {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });
  const parts = Object.fromEntries(fmt.formatToParts(new Date()).map((p) => [p.type, p.value]));
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dayIndex = days.indexOf(String(parts.weekday));
  const hour = Number(parts.hour) % 24;
  return { dayIndex, minutes: hour * 60 + Number(parts.minute) };
}

function toMinutes(label: string): number | null {
  const m = label.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;
  let h = Number(m[1]) % 12;
  if (/pm/i.test(m[3])) h += 12;
  return h * 60 + Number(m[2]);
}

export function parseRange(range: string): { open: number; close: number } | null {
  if (/closed/i.test(range)) return null;
  const [a, b] = range.split('–').map((s) => s.trim());
  const open = toMinutes(a);
  let close = toMinutes(b);
  if (open === null || close === null) return null;
  if (close <= open) close += 24 * 60;
  return { open, close };
}

export interface VenueStatus {
  readonly isOpen: boolean;
  readonly today: string;
  readonly dayIndex: number;
  readonly closesAt: string | null;
  readonly reopensOn: string | null;
  readonly reopensAt: string | null;
}

function shortTime(minutes: number): string {
  const m = minutes % (24 * 60);
  const h24 = Math.floor(m / 60);
  const min = m % 60;
  const suffix = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return min === 0 ? `${h12} ${suffix}` : `${h12}:${String(min).padStart(2, '0')} ${suffix}`;
}

export function venueStatus(
  hours: readonly Hours[],
  which: 'bar' | 'trucks' = 'bar',
): VenueStatus | null {
  const { dayIndex, minutes } = nowInVenueTz();
  if (dayIndex < 0) return null;

  const pick = (i: number) => (which === 'bar' ? hours[i].bar : hours[i].trucks);

  const today = pick(dayIndex);
  const parsed = parseRange(today);

  const carry = parseRange(pick((dayIndex + 6) % 7));
  const stillOpenFromYesterday = carry ? carry.close - 24 * 60 > minutes : false;

  const openNow = parsed
    ? minutes >= parsed.open && minutes < parsed.close
    : stillOpenFromYesterday;
  const isOpen = openNow || stillOpenFromYesterday;

  let reopensOn: string | null = null;
  let reopensAt: string | null = null;
  if (!isOpen) {
    for (let step = 0; step < 7; step += 1) {
      const i = (dayIndex + step) % 7;
      const r = parseRange(pick(i));
      if (!r) continue;
      if (step === 0 && minutes >= r.open) continue;
      reopensOn = step === 0 ? 'today' : hours[i].day;
      reopensAt = shortTime(r.open);
      break;
    }
  }

  return {
    isOpen,
    today,
    dayIndex,
    closesAt: isOpen && parsed ? shortTime(parsed.close) : null,
    reopensOn,
    reopensAt,
  };
}
