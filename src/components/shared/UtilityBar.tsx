'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Hours } from '@/types/content';
import { useVenue } from './VenueProvider';
import { venueStatus } from '@/lib/hours';

const COPIAS = 2;

interface Tramo {
  readonly label: string;
  readonly horario: string;
  readonly primero: string;
}

function agrupar(hours: readonly Hours[]): readonly Tramo[] {
  const out: { label: string; horario: string; primero: string }[] = [];

  hours.forEach((row) => {
    const ultimo = out[out.length - 1];
    if (ultimo && ultimo.horario === row.bar) {
      ultimo.label = `${ultimo.primero} – ${row.day}`;
      return;
    }
    out.push({ label: row.day, horario: row.bar, primero: row.day });
  });

  return out;
}

export default function UtilityBar() {
  const venue = useVenue();
  const abiertos = useMemo(
    () => venue.hours.filter((h) => !/closed/i.test(h.bar)),
    [venue.hours],
  );

  const [desde, setDesde] = useState<string | null>(null);

  useEffect(() => {
    const s = venueStatus(venue.hours, 'bar');
    if (!s) return;
    const hoy = venue.hours[s.dayIndex]?.day ?? null;
    if (s.isOpen || s.reopensOn === 'today') setDesde(hoy);
    else if (s.reopensOn) setDesde(s.reopensOn);
  }, [venue.hours]);

  const TRAMOS = useMemo(() => {
    const i = desde ? abiertos.findIndex((h) => h.day === desde) : -1;
    const ordenados = i > 0 ? [...abiertos.slice(i), ...abiertos.slice(0, i)] : abiertos;
    return agrupar(ordenados);
  }, [abiertos, desde]);

  const fila = (copia: number) =>
    TRAMOS.map((tramo, i) => {
      const esProximo = desde !== null && i === 0;
      return (
        <span
          key={`${copia}-${tramo.label}`}
          className="flex shrink-0 items-center gap-2.5 font-body text-caption font-medium uppercase tracking-eyebrow"
        >
          <span className={esProximo ? 'text-cream' : 'text-muted-dark'}>
            {esProximo ? 'Open ' : ''}
            {tramo.label}
          </span>
          <span className={esProximo ? 'text-paper' : 'text-bone/80'}>
            <span className="tabular-nums">{tramo.horario}</span>
          </span>
          <span aria-hidden="true" className="pl-4 text-muted-dark/40">
            /
          </span>
        </span>
      );
    });

  return (
    <div className="bg-deep grano">
      <div
        className="flex h-10 items-center overflow-x-auto px-borde sm:overflow-hidden sm:px-0"
        tabIndex={0}
        role="region"
        aria-label="Opening hours this week"
      >
        <div className="tira-horarios flex w-max items-center gap-8 sm:pl-borde [--marquee-duration:38s]">
          <span className="sr-only">Opening hours this week</span>
          {Array.from({ length: COPIAS }, (_, copia) => (
            <span
              key={copia}
              aria-hidden={copia > 0}
              className="flex shrink-0 items-center gap-8"
            >
              {fila(copia)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
