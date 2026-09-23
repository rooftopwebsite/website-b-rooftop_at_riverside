'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { ButtonLink } from '@/components/shared/Button';
import { Ticket, X } from '@/components/shared/Icon';
import { Eyebrow } from '@/components/shared/Type';
import { isTicketed, timeRange, weekdaysLabel, type VenueEvent } from '@/content/events';
import { weekdayLong } from '@/lib/calendar';
import { eventDot, eventTypeLabel } from '@/lib/event-color';

export interface EventoAbierto {
  readonly event: VenueEvent;
  readonly date: string;
}

export default function EventDialog({
  abierto,
  onClose,
}: {
  readonly abierto: EventoAbierto | null;
  readonly onClose: () => void;
}) {
  const event = abierto?.event ?? null;
  const ref = useRef<HTMLDialogElement>(null);
  const previo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !event) return;
    const activo = document.activeElement;
    if (activo instanceof HTMLElement && !el.contains(activo)) previo.current = activo;
    if (!el.open) el.showModal();
    return () => {
      el.close();
      previo.current?.focus({ preventScroll: true });
    };
  }, [event]);

  if (!abierto || !event) return null;

  const tipo = eventTypeLabel(event);
  const cuando = `${weekdayLong(abierto.date)}, ${new Date(
    `${abierto.date}T12:00:00Z`,
  ).toLocaleDateString('en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' })}`;
  const repite =
    event.kind === 'recurring' && event.weekdays.length > 0
      ? `Every ${weekdaysLabel(event.weekdays)}`
      : null;

  const cuerpo = event.body.length > 0 ? event.body : event.summary === event.title ? [] : [event.summary];

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target !== e.currentTarget) return;
        const r = e.currentTarget.getBoundingClientRect();
        const afuera =
          e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
        if (afuera) e.currentTarget.close();
      }}
      aria-labelledby="event-dialog-title"
      className="ficha-evento w-[min(92vw,34rem)] rounded-frame border border-ink/12 bg-paper p-0 text-ink sombra-card"
    >
      {event.image ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-t-frame bg-bone">
          <Image
            src={event.image}
            alt={event.imageAlt ?? ''}
            fill
            sizes="(min-width: 640px) 34rem, 92vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="relative p-6 lg:p-8">
        <button
          type="button"
          onClick={() => ref.current?.close()}
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-pill text-body/70 transition-colors hover:bg-ink/8 hover:text-ink"
        >
          <X className="size-4.5" aria-hidden="true" />
          <span className="sr-only">Close</span>
        </button>

        {tipo ? (
          <p className="m-0 flex items-center gap-2">
            <span className={`size-2 shrink-0 rounded-pill ${eventDot(event)}`} aria-hidden="true" />
            <Eyebrow tone="deep" as="span">
              {tipo}
            </Eyebrow>
          </p>
        ) : null}

        <h2
          id="event-dialog-title"
          className="m-0 mt-2.5 max-w-[22ch] pr-10 font-display text-d5 font-bold uppercase leading-[1.05] text-ink lg:text-d4"
        >
          {event.title}
        </h2>
        <dl className="m-0 mt-5 grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-2.5 border-t border-ink/12 pt-5 text-[15px] leading-[1.5]">
          <dt className="font-body text-caption font-medium uppercase tracking-eyebrow text-body/60">
            Date
          </dt>
          <dd className="m-0 text-ink">
            {cuando}
            {repite ? <span className="block text-body/70">{repite}</span> : null}
          </dd>

          <dt className="font-body text-caption font-medium uppercase tracking-eyebrow text-body/60">
            Time
          </dt>
          <dd className="m-0 tabular-nums text-ink">{timeRange(event)}</dd>

          <dt className="font-body text-caption font-medium uppercase tracking-eyebrow text-body/60">
            Where
          </dt>
          <dd className="m-0 text-ink">{event.space}</dd>

          {event.price !== null ? (
            <>
              <dt className="font-body text-caption font-medium uppercase tracking-eyebrow text-body/60">
                Price
              </dt>
              <dd className="m-0 tabular-nums text-ink">${event.price}</dd>
            </>
          ) : null}
        </dl>

        {cuerpo.length > 0 ? (
          <div className="mt-5 flex flex-col gap-3">
            {cuerpo.map((p) => (
              <p key={p} className="m-0 font-body text-[16px] font-light leading-[1.65] text-body">
                {p}
              </p>
            ))}
          </div>
        ) : null}

        {isTicketed(event) && event.ticketUrl ? (
          <div className="mt-6">
            <ButtonLink href={event.ticketUrl} external variant="primary">
              <Ticket className="size-4" aria-hidden="true" />
              Get tickets
            </ButtonLink>
          </div>
        ) : null}
      </div>
    </dialog>
  );
}
