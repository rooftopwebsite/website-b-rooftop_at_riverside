'use client';

import { useEffect, useState } from 'react';
import { HOURS } from '@/lib/brand';

/**
 * La barra de estado que va pegada debajo del header.
 *
 * Una línea: abierto o cerrado ahora, más el horario de hoy de la barra Y de
 * los trucks. Es la pregunta que más se hace del negocio y la confusión número
 * uno —los dos horarios son distintos—, y cuesta 32px de alto.
 *
 * ⚠️ Client component, y arranca sin estado. El servidor no sabe qué hora es en
 * Bonita Springs para el visitante, y una página cacheada mostraría un «Open
 * now» viejo. Antes de montar se pinta la fila de horarios —que ya es útil por
 * sí sola— y el estado aparece después. Sin esto hay mismatch de hidratación y,
 * peor, se publica un dato que puede estar mal.
 *
 * ⚠️ Sin storage del navegador: el brief lo prohíbe.
 */

interface Now {
  readonly dayIndex: number;
  readonly minutes: number;
}

/** La hora actual en America/New_York, sin librerías. */
function nowInVenueTz(): Now {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    })
      .formatToParts(new Date())
      .map((p) => [p.type, p.value]),
  );
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return {
    dayIndex: days.indexOf(String(parts.weekday)),
    minutes: (Number(parts.hour) % 24) * 60 + Number(parts.minute),
  };
}

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
  // Cierra después de medianoche (2 AM el sábado): se le suma un día.
  if (close <= open) close += 24 * 60;
  return { open, close };
}

function isOpenNow(range: string, carryRange: string, now: Now): boolean {
  const today = parseRange(range);
  const yesterday = parseRange(carryRange);
  // Puede seguir abierto de ayer: el sábado cierra a las 2 AM del domingo.
  const stillOpen = yesterday ? yesterday.close - 24 * 60 > now.minutes : false;
  if (stillOpen) return true;
  return today ? now.minutes >= today.open && now.minutes < today.close : false;
}

interface State {
  readonly bar: string;
  readonly trucks: string;
  readonly barOpen: boolean;
  readonly trucksOpen: boolean;
}

export default function StatusBar() {
  const [state, setState] = useState<State | null>(null);

  useEffect(() => {
    const now = nowInVenueTz();
    if (now.dayIndex < 0) return;
    const today = HOURS[now.dayIndex];
    const yesterday = HOURS[(now.dayIndex + 6) % 7];
    setState({
      bar: today.bar,
      trucks: today.trucks,
      barOpen: isOpenNow(today.bar, yesterday.bar, now),
      trucksOpen: isOpenNow(today.trucks, yesterday.trucks, now),
    });
  }, []);

  const anyOpen = state ? state.barOpen || state.trucksOpen : false;

  return (
    // Píldora, no franja: acompaña al nav sin volver a dibujar un borde.
    <div className="flex max-w-full items-center gap-[12px] overflow-x-auto rounded-pill bg-cream px-[16px] py-[7px] whitespace-nowrap ring-1 ring-ink/[0.06]">
      <div className="flex items-center gap-[12px]">
        {/*
          El estado. El punto es decorativo: lo que informa es el TEXTO de al
          lado. Sin eso el dato dependería del color, que WCAG 1.4.1 no permite.
        */}
        <span className="flex shrink-0 items-center gap-[7px]">
          <span
            aria-hidden="true"
            className={[
              'inline-block h-[7px] w-[7px] rounded-pill',
              state ? (anyOpen ? 'bg-teal600' : 'bg-terra') : 'bg-ink/25',
            ].join(' ')}
          />
          <span className="font-body text-[12px] font-medium text-ink">
            {state ? (anyOpen ? 'Open now' : 'Closed now') : 'Today'}
          </span>
        </span>

        <span aria-hidden="true" className="h-[12px] w-px shrink-0 bg-ink/20" />

        {/* ⚠️ Las etiquetas «Bar» y «Trucks» se distinguen por PESO, no por
            color. Tenían `text-body/55`, que sobre el crema de la píldora
            (#fdf0b4) da 4.27:1 y no llega al 4.5:1 que pide un texto de 12px.
            Bajar el color para jerarquizar es justo lo que rompe el contraste
            en textos chicos; el peso hace el mismo trabajo gratis. */}
        <p className="flex shrink-0 items-center gap-[12px] font-body text-[12px] text-body/80">
          <span>
            <span className="font-medium">Bar</span>{' '}
            <span className="tabular-nums">{state ? state.bar : '—'}</span>
          </span>
          <span aria-hidden="true" className="h-[12px] w-px bg-ink/20" />
          <span>
            <span className="font-medium">Trucks</span>{' '}
            <span className="tabular-nums">{state ? state.trucks : '—'}</span>
          </span>
        </p>
      </div>
    </div>
  );
}

/** Alto de la barra. Lo consume el layout para compensar el header fijo. */
export const STATUS_BAR_HEIGHT = 34;
