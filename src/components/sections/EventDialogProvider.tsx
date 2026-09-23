'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import EventDialog, { type EventoAbierto } from '@/components/sections/EventDialog';
import { ArrowRight } from '@/components/shared/Icon';
import type { VenueEvent } from '@/content/events';

const AbrirEvento = createContext<((a: EventoAbierto) => void) | null>(null);

export function EventDialogProvider({ children }: { readonly children: ReactNode }) {
  const [abierto, setAbierto] = useState<EventoAbierto | null>(null);
  return (
    <AbrirEvento.Provider value={setAbierto}>
      {children}
      <EventDialog abierto={abierto} onClose={() => setAbierto(null)} />
    </AbrirEvento.Provider>
  );
}

export function VerMas({
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
  const abrir = useContext(AbrirEvento);
  if (!abrir) return null;
  if (!visible) {
    return (
      <button type="button" onClick={() => abrir({ event, date })} className={`absolute inset-0 ${className}`}>
        <span className="sr-only">See more about {event.title}</span>
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={() => abrir({ event, date })}
      className={`group inline-flex w-fit items-center gap-2 border-b-2 border-sunset pb-0.5 font-body text-dato font-medium text-ink transition-colors after:absolute after:inset-0 after:content-[''] hover:text-sunset-deep ${className}`}
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
