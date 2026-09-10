import { HOURS } from './brand';

/**
 * ¿Está abierto AHORA?
 *
 * ⚠️ ESTO VIVÍA ADENTRO DE `OpenStatus.tsx` y salió porque el rediseño le
 * agregó dos consumidores más: el pill de estado del hero y el badge en vivo
 * de `FindUs`. Tres copias de un parser de horarios con la vuelta de
 * medianoche del sábado es exactamente la clase de duplicación que se
 * desincroniza sin que nada avise — y el que se desincroniza publica un
 * «Open now» falso, que es peor que no publicar nada.
 *
 * ⚠️ TODO ESTO ES CLIENT-ONLY POR DISEÑO. El servidor no sabe qué hora es en
 * Bonita Springs para el visitante, y una página cacheada serviría un estado
 * viejo. Quien lo use tiene que pintar primero SIN estado y resolverlo después
 * de montar; si no, hay mismatch de hidratación y se publica un dato que puede
 * estar mal. Ver cómo lo hacen `OpenStatus` y `Hero`.
 */

interface Now {
  readonly dayIndex: number;
  readonly minutes: number;
}

/** La hora actual en America/New_York, sin librerías. */
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
  // HOURS arranca en lunes, así que el índice es el mismo.
  const dayIndex = days.indexOf(String(parts.weekday));
  const hour = Number(parts.hour) % 24;
  return { dayIndex, minutes: hour * 60 + Number(parts.minute) };
}

/** `3:00 PM` → minutos desde medianoche. */
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
  // Cierra después de medianoche (2 AM el sábado): se suma un día.
  if (close <= open) close += 24 * 60;
  return { open, close };
}

export interface VenueStatus {
  /** Abierto ahora mismo. */
  readonly isOpen: boolean;
  /** El rango de hoy, tal cual está escrito en `HOURS` («3:00 PM – 8:00 PM»). */
  readonly today: string;
  /** Índice de hoy en `HOURS`, que arranca en lunes. */
  readonly dayIndex: number;
  /**
   * A qué hora cierra hoy, en formato corto («8 PM»). `null` si está cerrado.
   * Es lo que se muestra en el pill del hero: «Open until 8 PM».
   */
  readonly closesAt: string | null;
  /**
   * El próximo día que abre, cuando hoy está cerrado («Wednesday»). `null` si
   * está abierto.
   */
  readonly reopensOn: string | null;
}

/** `20:00` → `8 PM`. Sin `:00` cuando la hora es redonda, que es como se lee. */
function shortTime(minutes: number): string {
  const m = minutes % (24 * 60);
  const h24 = Math.floor(m / 60);
  const min = m % 60;
  const suffix = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return min === 0 ? `${h12} ${suffix}` : `${h12}:${String(min).padStart(2, '0')} ${suffix}`;
}

/**
 * El estado del venue para un set de horarios.
 *
 * ⚠️ `which` importa: la barra y los camiones NO comparten horario. La barra
 * abre a las 3 y los camiones a las 4, y el sábado la barra cierra a las 2 AM
 * mientras los camiones cierran a las 11 PM. El default es `bar` porque es lo
 * que define si «el lugar» está abierto.
 */
export function venueStatus(which: 'bar' | 'trucks' = 'bar'): VenueStatus | null {
  const { dayIndex, minutes } = nowInVenueTz();
  if (dayIndex < 0) return null;

  const pick = (i: number) => (which === 'bar' ? HOURS[i].bar : HOURS[i].trucks);

  const today = pick(dayIndex);
  const parsed = parseRange(today);

  // Puede seguir abierto de ayer: el sábado cierra a las 2 AM del domingo.
  const carry = parseRange(pick((dayIndex + 6) % 7));
  const stillOpenFromYesterday = carry ? carry.close - 24 * 60 > minutes : false;

  const openNow = parsed
    ? minutes >= parsed.open && minutes < parsed.close
    : stillOpenFromYesterday;
  const isOpen = openNow || stillOpenFromYesterday;

  let reopensOn: string | null = null;
  if (!isOpen) {
    // Se busca hacia adelante el primer día con un rango parseable. El bucle
    // arranca en HOY porque puede estar cerrado por la hora y no por el día:
    // un martes a las 10 AM reabre «today», no el miércoles.
    for (let step = 0; step < 7; step += 1) {
      const i = (dayIndex + step) % 7;
      const r = parseRange(pick(i));
      if (!r) continue;
      if (step === 0 && minutes >= r.open) continue;
      reopensOn = step === 0 ? 'today' : HOURS[i].day;
      break;
    }
  }

  return {
    isOpen,
    today,
    dayIndex,
    closesAt: isOpen && parsed ? shortTime(parsed.close) : null,
    reopensOn,
  };
}
