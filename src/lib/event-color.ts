import { EVENT_FILTERS, matchesFilter, type VenueEvent } from '@/content/events';

const DOTS: Record<string, string> = {
  music: 'bg-sunset',
  sports: 'bg-teal600',
  themed: 'bg-magenta',
  festival: 'bg-tomato',
  family: 'bg-river',
};

const NO_FAMILY = 'bg-muted';

export function eventFilterId(e: VenueEvent): string | null {
  return EVENT_FILTERS.find((f) => matchesFilter(e, f.id))?.id ?? null;
}

export function eventDot(e: VenueEvent): string {
  const id = eventFilterId(e);
  return (id && DOTS[id]) || NO_FAMILY;
}

export interface ColorKey {
  readonly id: string;
  readonly label: string;
  readonly dot: string;
}

export function colorKey(events: readonly VenueEvent[]): readonly ColorKey[] {
  const keys: ColorKey[] = EVENT_FILTERS.filter((f) =>
    events.some((e) => eventFilterId(e) === f.id),
  ).map((f) => ({ id: f.id, label: f.label, dot: DOTS[f.id] ?? NO_FAMILY }));

  if (keys.length > 0 && events.some((e) => eventFilterId(e) === null)) {
    keys.push({ id: 'other', label: 'Everything else', dot: NO_FAMILY });
  }

  return keys;
}

export function eventTypeLabel(e: VenueEvent): string | null {
  const id = eventFilterId(e);
  return EVENT_FILTERS.find((f) => f.id === id)?.label ?? null;
}
