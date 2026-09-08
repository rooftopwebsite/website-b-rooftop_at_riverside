'use client';

import { useEffect, useState } from 'react';
import { HOURS } from '@/lib/brand';

/**
 * «Hoy: 3 PM – 8 PM · Open now». Va bajo el hero y en el footer.
 *
 * ⚠️ Por qué es client y por qué arranca sin estado. El servidor no sabe qué
 * hora es en Bonita Springs para EL VISITANTE, y una página cacheada
 * renderizaría un «Open now» viejo. Así que el servidor pinta sólo la fila de
 * horarios —que es información estable y útil por sí sola— y el badge de
 * abierto/cerrado aparece después de montar. Sin esto hay mismatch de
 * hidratación, y además se publicaría un dato que puede estar mal.
 *
 * ⚠️ Nada de esto usa storage del navegador. El brief lo prohíbe.
 */

interface Now {
  readonly dayIndex: number;
  readonly minutes: number;
}

/** La hora actual en America/New_York, sin librerías. */
function nowInVenueTz(): Now {
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

function parseRange(range: string): { open: number; close: number } | null {
  if (/closed/i.test(range)) return null;
  const [a, b] = range.split('–').map((s) => s.trim());
  const open = toMinutes(a);
  let close = toMinutes(b);
  if (open === null || close === null) return null;
  // Cierra después de medianoche (2 AM el sábado): se suma un día.
  if (close <= open) close += 24 * 60;
  return { open, close };
}

export default function OpenStatus({
  which = 'bar',
  className = '',
}: {
  readonly which?: 'bar' | 'trucks';
  readonly className?: string;
}) {
  const [state, setState] = useState<{ today: string; isOpen: boolean } | null>(null);

  useEffect(() => {
    const { dayIndex, minutes } = nowInVenueTz();
    if (dayIndex < 0) return;

    const row = HOURS[dayIndex];
    const range = which === 'bar' ? row.bar : row.trucks;
    const parsed = parseRange(range);

    // Puede seguir abierto de ayer: el sábado cierra a las 2 AM del domingo.
    const yesterday = HOURS[(dayIndex + 6) % 7];
    const carry = parseRange(which === 'bar' ? yesterday.bar : yesterday.trucks);
    const stillOpenFromYesterday = carry ? carry.close - 24 * 60 > minutes : false;

    const isOpen = parsed
      ? minutes >= parsed.open && minutes < parsed.close
      : stillOpenFromYesterday;

    setState({ today: range, isOpen: isOpen || stillOpenFromYesterday });
  }, [which]);

  const label = which === 'bar' ? 'Bar' : 'Food trucks';

  return (
    <p
      className={['flex flex-wrap items-center gap-x-[10px] gap-y-[4px] text-caption', className]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="eyebrow">Today</span>
      <span className="font-bold">
        {label} {state ? state.today : '—'}
      </span>
      {state ? (
        <span className="inline-flex items-center gap-[6px]">
          {/* El punto es decorativo: el estado lo dice el TEXTO de al lado.
              Sin esto el dato dependería del color, que es lo que WCAG 1.4.1
              no permite. */}
          <span
            aria-hidden="true"
            className={[
              'inline-block h-[7px] w-[7px] rounded-pill',
              state.isOpen ? 'bg-teal600' : 'bg-terra',
            ].join(' ')}
          />
          <span className="font-bold uppercase tracking-[0.14em]">
            {state.isOpen ? 'Open now' : 'Closed now'}
          </span>
        </span>
      ) : null}
    </p>
  );
}
