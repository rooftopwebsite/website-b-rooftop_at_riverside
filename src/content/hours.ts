import type { Hours } from '@/types/content';
import horario from './hours.json';

type Tramo = { readonly open: string; readonly close: string } | 'closed';
type Semana = Readonly<Record<(typeof DIAS)[number], Tramo>>;

const DIAS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

function reloj(t: string): string {
  const [hRaw, m] = t.split(':');
  const h = Number(hRaw);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m} ${ampm}`;
}

const rango = (t: Tramo): string =>
  t === 'closed' ? 'Closed' : `${reloj(t.open)} – ${reloj(t.close)}`;

const bar = horario.bar as Semana;
const trucks = horario.trucks as Semana;

export const HOURS: readonly Hours[] = DIAS.map((d) => ({
  day: d.charAt(0).toUpperCase() + d.slice(1),
  bar: rango(bar[d]),
  trucks: rango(trucks[d]),
}));

export const todayIndex = (): number => {
  const now = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
  );
  return (now.getDay() + 6) % 7;
};
