'use client';

import { useEffect, useState } from 'react';
import { useVenue } from './VenueProvider';
import type { Hours } from '@/types/content';
import { venueStatus } from '@/lib/hours';
import { CaretDown } from './Icon';

const ROW = 'flex items-center justify-between gap-x-4 py-3';

const BORDER = 'border-b border-muted-dark/30';

export default function HoursCard({ hours }: { readonly hours?: readonly Hours[] } = {}) {
  const venue = useVenue();
  const rows = hours ?? venue.hours;
  const [status, setStatus] = useState<ReturnType<typeof venueStatus>>(null);

  useEffect(() => setStatus(venueStatus(rows, 'bar')), [rows]);

  const todayIdx = status?.dayIndex ?? -1;

  return (
    <div className="flex flex-col rounded-shell bg-deep p-6.5 text-bone on-dark card-shadow lg:p-9">
      <h3 className="m-0 mb-5.5 font-display text-d5 font-bold uppercase leading-none tracking-[0.02em] text-paper">
        Hours
      </h3>
      <div className="m-0">
        {rows.map((row, i) => {
          const isToday = i === todayIdx;
          const closed = /closed/i.test(row.bar);
          const returns = closed
            ? rows.slice(i + 1).concat(rows.slice(0, i)).find((f) => !/closed/i.test(f.bar))?.day
            : undefined;

          const day = (
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

          const hour = (
            <span
              className={[
                'font-body text-data whitespace-nowrap tabular-nums',
                isToday ? 'text-cream' : 'text-paper',
              ].join(' ')}
            >
              {closed ? (returns ? `Back ${returns}` : '') : row.bar}
            </span>
          );

          if (closed) {
            return (
              <div key={row.day} className={`${ROW} ${BORDER}`}>
                {day}
                <span className="flex items-center gap-3">
                  {hour}
                  <span aria-hidden="true" className="size-3.25" />
                </span>
              </div>
            );
          }

          return (
            <details key={row.day} open={isToday} className={`group ${BORDER}`}>
              <summary
                className={`${ROW} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}
              >
                {day}
                <span className="flex items-center gap-3">
                  {hour}
                  <CaretDown
                    aria-hidden="true"
                    className="size-3.25 text-muted-dark transition-transform duration-200 group-open:rotate-180"
                  />
                </span>
              </summary>
              <div className="grid grid-cols-[auto_1fr] gap-x-5 pb-3">
                <span className="font-body text-caption text-muted-dark">Trucks</span>
                <span className="font-body text-data tabular-nums text-paper">
                  {/closed/i.test(row.trucks) ? 'Bar only' : row.trucks}
                </span>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
