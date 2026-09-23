import { getVenueEvents, type VenueEvent } from './events';
import { todayInVenue } from '@/lib/calendar';

const enTemporada = (e: VenueEvent, hoy: string): boolean =>
  e.from <= hoy && (e.until === null || e.until >= hoy);

export const CONFIRMADO = false;

export const NOCHES_CLAIM = 5;

export async function nochesConEventos(): Promise<number> {
  const eventos = await getVenueEvents();
  const hoy = todayInVenue();
  const dias = new Set(
    eventos
      .filter((e) => e.kind === 'recurring' && enTemporada(e, hoy))
      .flatMap((e) => e.weekdays),
  );
  return dias.size;
}

export async function nochesConMusica(): Promise<number> {
  const eventos = await getVenueEvents();
  const hoy = todayInVenue();
  const dias = new Set(
    eventos
      .filter(
        (e) =>
          e.kind === 'recurring' &&
          enTemporada(e, hoy) &&
          e.tags.some((t) => ['live-music', 'dj', 'music'].includes(t)),
      )
      .flatMap((e) => e.weekdays),
  );
  return dias.size;
}

const PALABRA = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven'] as const;

export async function fraseEntretenimiento(): Promise<string> {
  if (CONFIRMADO) return `Live music ${PALABRA[NOCHES_CLAIM]} nights a week`;
  const n = await nochesConMusica();
  if (n === 0) return 'Live music on the calendar';
  if (n === 1) return 'Live music every week';
  return `Live music ${PALABRA[n]} nights a week`;
}

export async function fraseCorta(): Promise<string> {
  if (CONFIRMADO) return `Live music ${PALABRA[NOCHES_CLAIM]} nights`;
  const n = await nochesConMusica();
  return n >= 2 ? `Live music ${PALABRA[n]} nights` : 'Live music this week';
}

export async function fraseSemana(): Promise<string> {
  const n = await nochesConEventos();
  if (n === 0) return 'Something on most weeks';
  return `Something on ${PALABRA[n]} nights a week`;
}
