import type { Hours } from '@/types/content';

/**
 * Los horarios, en un solo lugar.
 *
 * ⚠️ FUENTE: el pie de página del sitio vigente (eatdrinkparadise.com),
 * verificado el 2026-09-15 sobre `content/_source/home.md`, y confirmado por
 * el cuestionario de onboarding del cliente, que trae la misma grilla:
 *
 *     Wednesday   Bar 3pm-8pm  · Food Trucks 4pm-8pm
 *     Thursday    Bar 3pm-8pm  · Food Trucks 4pm-8pm
 *     Friday      Bar 3pm-12am · Food Trucks 4pm-11pm
 *     Saturday    Bar 11am-2am · Food Trucks 12pm-11pm
 *     Sunday      Bar 11am-8pm · Food Trucks 12pm-8pm
 *
 * ⚠️ SON DOS SETS Y NO UNO. La barra y los food trucks abren y cierran a horas
 * distintas TODOS los días, y la diferencia no es trivial: el sábado la barra
 * sigue tres horas después de que cerró la última ventanilla. Publicar un solo
 * horario significa que alguien llega a la una de la mañana buscando comida.
 *
 * ⚠️ Vivía en `lib/brand.ts`. Se mudó acá el 2026-09-15: es contenido, no
 * identidad de marca, y `brand.ts` no es un archivo de contenido. Lo leen el
 * footer, la barra de utilidad, la tarjeta de horarios, `/contact` y el
 * JSON-LD.
 */
export const HOURS: readonly Hours[] = [
  { day: 'Monday', bar: 'Closed', trucks: 'Closed' },
  { day: 'Tuesday', bar: 'Closed', trucks: 'Closed' },
  { day: 'Wednesday', bar: '3:00 PM – 8:00 PM', trucks: '4:00 PM – 8:00 PM' },
  { day: 'Thursday', bar: '3:00 PM – 8:00 PM', trucks: '4:00 PM – 8:00 PM' },
  { day: 'Friday', bar: '3:00 PM – 12:00 AM', trucks: '4:00 PM – 11:00 PM' },
  { day: 'Saturday', bar: '11:00 AM – 2:00 AM', trucks: '12:00 PM – 11:00 PM' },
  { day: 'Sunday', bar: '11:00 AM – 8:00 PM', trucks: '12:00 PM – 8:00 PM' },
];

/**
 * Los mismos horarios en formato ISO 8601 para el JSON-LD (`openingHours`).
 *
 * El sábado cierra a las 2 AM del domingo; schema.org lo acepta como 02:00 en
 * la fila del sábado, que es la convención que usa Google.
 */
export const HOURS_SCHEMA = [
  'We 15:00-20:00',
  'Th 15:00-20:00',
  'Fr 15:00-24:00',
  'Sa 11:00-02:00',
  'Su 11:00-20:00',
] as const;

/** El día de hoy en la zona del local, para destacar su fila. */
export const todayIndex = (): number => {
  const now = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
  );
  // `HOURS` arranca en lunes; `getDay()` arranca en domingo.
  return (now.getDay() + 6) % 7;
};
