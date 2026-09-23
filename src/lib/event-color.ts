import { EVENT_FILTERS, matchesFilter, type VenueEvent } from '@/content/events';

const PUNTOS: Record<string, string> = {
  music: 'bg-sunset',
  sports: 'bg-teal600',
  themed: 'bg-magenta',
  festival: 'bg-tomato',
  family: 'bg-river',
};

const SIN_FAMILIA = 'bg-muted';

export function eventFilterId(e: VenueEvent): string | null {
  return EVENT_FILTERS.find((f) => matchesFilter(e, f.id))?.id ?? null;
}

export function eventDot(e: VenueEvent): string {
  const id = eventFilterId(e);
  return (id && PUNTOS[id]) || SIN_FAMILIA;
}

export interface ColorKey {
  readonly id: string;
  readonly label: string;
  readonly dot: string;
}

export function colorKey(events: readonly VenueEvent[]): readonly ColorKey[] {
  const claves: ColorKey[] = EVENT_FILTERS.filter((f) =>
    events.some((e) => eventFilterId(e) === f.id),
  ).map((f) => ({ id: f.id, label: f.label, dot: PUNTOS[f.id] ?? SIN_FAMILIA }));

  if (claves.length > 0 && events.some((e) => eventFilterId(e) === null)) {
    claves.push({ id: 'resto', label: 'Everything else', dot: SIN_FAMILIA });
  }

  return claves;
}

export function eventTypeLabel(e: VenueEvent): string | null {
  const id = eventFilterId(e);
  return EVENT_FILTERS.find((f) => f.id === id)?.label ?? null;
}
