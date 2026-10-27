'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Hours } from '@/types/content';
import { useVenue } from './VenueProvider';
import { venueStatus } from '@/lib/hours';

const COPIES = 2;

interface Segment {
  readonly label: string;
  readonly schedule: string;
  readonly first: string;
}

function groupByRange(hours: readonly Hours[]): readonly Segment[] {
  const out: { label: string; schedule: string; first: string }[] = [];

  hours.forEach((row) => {
    const last = out[out.length - 1];
    if (last && last.schedule === row.bar) {
      last.label = `${last.first} – ${row.day}`;
      return;
    }
    out.push({ label: row.day, schedule: row.bar, first: row.day });
  });

  return out;
}

export default function UtilityBar() {
  const venue = useVenue();
  const openItems = useMemo(
    () => venue.hours.filter((h) => !/closed/i.test(h.bar)),
    [venue.hours],
  );

  const [from, setFrom] = useState<string | null>(null);

  useEffect(() => {
    const s = venueStatus(venue.hours, 'bar');
    if (!s) return;
    const today = venue.hours[s.dayIndex]?.day ?? null;
    if (s.isOpen || s.reopensOn === 'today') setFrom(today);
    else if (s.reopensOn) setFrom(s.reopensOn);
  }, [venue.hours]);

  const SEGMENTS = useMemo(() => {
    const i = from ? openItems.findIndex((h) => h.day === from) : -1;
    const sorted = i > 0 ? [...openItems.slice(i), ...openItems.slice(0, i)] : openItems;
    return groupByRange(sorted);
  }, [openItems, from]);

  const renderRow = (copy: number) =>
    SEGMENTS.map((segment, i) => {
      const isUpcoming = from !== null && i === 0;
      return (
        <span
          key={`${copy}-${segment.label}`}
          className="flex shrink-0 items-center gap-2.5 font-body text-caption font-medium uppercase tracking-eyebrow"
        >
          <span className={isUpcoming ? 'text-cream' : 'text-muted-dark'}>
            {isUpcoming ? 'Open ' : ''}
            {segment.label}
          </span>
          <span className={isUpcoming ? 'text-paper' : 'text-bone/80'}>
            <span className="tabular-nums">{segment.schedule}</span>
          </span>
          <span aria-hidden="true" className="pl-4 text-muted-dark/40">
            /
          </span>
        </span>
      );
    });

  return (
    <div className="bg-deep grain">
      <div
        className="flex h-10 items-center overflow-x-auto px-edge sm:overflow-hidden sm:px-0"
        tabIndex={0}
        role="region"
        aria-label="Opening hours this week"
      >
        <div className="hours-strip flex w-max items-center gap-8 sm:pl-edge [--marquee-duration:38s]">
          <span className="sr-only">Opening hours this week</span>
          {Array.from({ length: COPIES }, (_, copy) => (
            <span
              key={copy}
              aria-hidden={copy > 0}
              className="flex shrink-0 items-center gap-8"
            >
              {renderRow(copy)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
