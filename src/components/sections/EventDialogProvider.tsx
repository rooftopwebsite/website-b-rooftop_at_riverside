'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import type { OpenedEvent } from '@/components/sections/EventDialog';
import { ArrowRight } from '@/components/shared/Icon';
import type { FeaturedDeal } from '@/components/shared/FeaturedEventCard';
import type { VenueEvent } from '@/content/events';

const EventDialog = dynamic(() => import('@/components/sections/EventDialog'), { ssr: false });

const OpenEventContext = createContext<((a: OpenedEvent) => void) | null>(null);

export function EventDialogProvider({
  children,
  deals,
  dealsLabel,
}: {
  readonly children: ReactNode;
  readonly deals?: readonly FeaturedDeal[];
  readonly dealsLabel?: string;
}) {
  const [isOpen, setIsOpen] = useState<OpenedEvent | null>(null);
  return (
    <OpenEventContext.Provider value={setIsOpen}>
      {children}
      {isOpen ? <EventDialog
          isOpen={isOpen}
          onClose={() => setIsOpen(null)}
          deals={deals}
          dealsLabel={dealsLabel}
        /> : null}
    </OpenEventContext.Provider>
  );
}

export function SeeMore({
  event,
  date,
  className = '',
  visible = true,
}: {
  readonly event: VenueEvent;
  readonly date: string;
  readonly className?: string;
  readonly visible?: boolean;
}) {
  const open = useContext(OpenEventContext);
  if (!open) return null;
  if (!visible) {
    return (
      <button type="button" onClick={() => open({ event, date })} className={`absolute inset-0 ${className}`}>
        <span className="sr-only">See more about {event.title}</span>
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={() => open({ event, date })}
      className={`group inline-flex w-fit items-center gap-2 border-b-2 border-sunset pb-0.5 font-body text-data font-medium text-ink transition-colors after:absolute after:inset-0 after:content-[''] hover:text-sunset-deep ${className}`}
    >
      See more
      <span className="sr-only"> about {event.title}</span>
      <ArrowRight
        className="size-3.5 text-sunset-deep transition-transform duration-200 group-hover:translate-x-1"
        aria-hidden="true"
      />
    </button>
  );
}
