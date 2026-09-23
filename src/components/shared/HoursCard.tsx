'use client';

import { useEffect, useState } from 'react';
import { useVenue } from './VenueProvider';
import type { Hours } from '@/types/content';
import { venueStatus } from '@/lib/hours';
import { CaretDown } from './Icon';

const FILA = 'flex items-center justify-between gap-x-4 py-3';

const BORDE = 'border-b border-muted-dark/30';

export default function HoursCard({ hours }: { readonly hours?: readonly Hours[] } = {}) {
  const venue = useVenue();
  const filas = hours ?? venue.hours;
  const [status, setStatus] = useState<ReturnType<typeof venueStatus>>(null);

  useEffect(() => setStatus(venueStatus(filas, 'bar')), [filas]);

  const todayIdx = status?.dayIndex ?? -1;

  return (
    <div className="flex flex-col rounded-shell bg-deep p-6.5 text-bone on-dark sombra-card lg:p-9">
      <h3 className="m-0 mb-5.5 font-display text-d5 font-bold uppercase leading-none tracking-[0.02em] text-paper">
        Hours
      </h3>
      <div className="m-0">
        {filas.map((row, i) => {
          const isToday = i === todayIdx;
          const cerrado = /closed/i.test(row.bar);

          const dia = (
            <span
              className={[
                'font-body text-base',
                isToday ? 'font-medium text-cream' : 'text-paper',
              ].join(' ')}
            >
              {row.day}
              {isToday ? ' · today' : ''}
            </span>
          );

          const hora = (
            <span
              className={[
                'font-body text-dato whitespace-nowrap tabular-nums',
                isToday ? 'text-cream' : 'text-paper',
              ].join(' ')}
            >
              {row.bar}
            </span>
          );

          if (cerrado) {
            return (
              <div key={row.day} className={`${FILA} ${BORDE}`}>
                {dia}
                <span className="flex items-center gap-3">
                  {hora}
                  <span aria-hidden="true" className="size-3.25" />
                </span>
              </div>
            );
          }

          return (
            <details key={row.day} open={isToday} className={`group ${BORDE}`}>
              <summary
                className={`${FILA} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}
              >
                {dia}
                <span className="flex items-center gap-3">
                  {hora}
                  <CaretDown
                    aria-hidden="true"
                    className="size-3.25 text-muted-dark transition-transform duration-200 group-open:rotate-180"
                  />
                </span>
              </summary>
              <div className="grid grid-cols-[auto_1fr] gap-x-5 pb-3">
                <span className="font-body text-caption text-muted-dark">Trucks</span>
                <span className="font-body text-dato tabular-nums text-paper">{row.trucks}</span>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
