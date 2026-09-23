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

const RENGLON_OFERTA = /^(\$\d+(?:\.\d{1,2})?(?:\s+off)?)\s+(.+)$/i;

function desdeEvento(e: VenueEvent): HappyHour {
  const renglones = e.body.flatMap((p) => p.split('\n')).map((l) => l.trim()).filter(Boolean);

  const deals: { price: string; what: string }[] = [];
  const sueltos: string[] = [];

  for (const renglon of renglones) {
    const m = RENGLON_OFERTA.exec(renglon);
    if (m) {
      deals.push({ price: m[1], what: m[2].charAt(0).toUpperCase() + m[2].slice(1) });
    } else {
      sueltos.push(renglon);
    }
  }

  return {
    days: weekdaysLabel(e.weekdays),
    daysShort: weekdaysLabel(e.weekdays, true),
    time: `${formatTime(e.startTime)} – ${formatTime(e.endTime)}`,
    deals: deals.length > 0 ? deals : HAPPY_HOUR.deals,
    note: sueltos.slice(1).join(' ') || null,
  };
}

export async function getHappyHour(): Promise<HappyHour> {
  const eventos = await getVenueEvents();
  const evento = eventos.find((e) => /happy\s*hour/i.test(e.title));
  return evento ? desdeEvento(evento) : HAPPY_HOUR;
}

const TOPE_PILL = 22;

export async function fraseHappyHour(): Promise<string> {
  const eventos = await getVenueEvents();
  const titulo = eventos.find((e) => /happy\s*hour/i.test(e.title))?.title;
  if (titulo && titulo.length <= TOPE_PILL) return titulo;
  return 'Happy hour';
}
