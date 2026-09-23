import Image from 'next/image';
import type { ReactNode } from 'react';
import { PhotoPending } from '@/components/shared/PendingData';
import { shortDate, timeRange, type VenueEvent } from '@/content/events';
import { TAG } from '@/lib/tag';

export function SpacePill({ children, lado = 'izq' }: { readonly children: ReactNode; readonly lado?: 'izq' | 'der' }) {
  return (
    <span
      className={[
        'absolute top-4 z-20 flex items-center gap-[6px] rounded-pill bg-deep/85 ring-1 ring-cream/25 backdrop-blur-[3px]',
        TAG,
        'text-cream',
        lado === 'izq' ? 'left-4' : 'right-4',
      ].join(' ')}
    >
      {children}
    </span>
  );
}

export function EventPhoto({
  event,
  sizes,
  brief,
  tone = 'light',
  imgClassName = 'object-cover',
  fondo = '',
  ventana = '',
  children,
}: {
  readonly event: VenueEvent;
  readonly sizes: string;
  readonly brief: string;
  readonly tone?: 'light' | 'dark';
  readonly imgClassName?: string;
  readonly fondo?: string;
  readonly ventana?: string;
  readonly children?: ReactNode;
}) {
  return (
    <div className={`relative aspect-video w-full shrink-0 overflow-hidden ${fondo} ${ventana}`}>
      {event.image === null ? (
        <PhotoPending
          brief={brief}
          ratio=""
          tone={tone}
          className="absolute inset-0 h-full rounded-none border-0 border-dashed"
        />
      ) : (
        <Image
          src={event.image}
          alt={event.imageAlt ?? ''}
          fill
          sizes={sizes}
          className={imgClassName}
        />
      )}
      {children}
    </div>
  );
}

export function EventWhen({
  event,
  date,
  isToday = false,
  fecha = 'text-ink',
}: {
  readonly event: VenueEvent;
  readonly date: string;
  readonly isToday?: boolean;
  readonly fecha?: string;
}) {
  return (
    <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
      <span className={`font-body text-dato font-bold uppercase tracking-eyebrow ${fecha}`}>
        {isToday ? 'Today' : shortDate(date)}
      </span>
      <span className="rounded-pill bg-cream px-2.5 py-0.75 font-body text-caption font-bold whitespace-nowrap text-deep">
        {timeRange(event)}
      </span>
    </span>
  );
}
