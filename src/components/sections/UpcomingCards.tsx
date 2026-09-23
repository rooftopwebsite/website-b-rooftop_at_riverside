import { EventDialogProvider, VerMas } from '@/components/sections/EventDialogProvider';
import { EventPhoto, EventWhen, SpacePill } from '@/components/shared/EventCardParts';
import {
  cuerpoSinPrecios,
  dealsNombrados,
  type FeaturedDeal,
} from '@/components/shared/FeaturedEventCard';
import { ArrowSquareOut } from '@/components/shared/Icon';
import { isTicketed } from '@/content/events';
import type { Occurrence } from '@/lib/calendar';
import { eventDot, eventTypeLabel } from '@/lib/event-color';

export default function UpcomingCards({
  items,
  today,
  deals,
  dealsLabel,
}: {
  readonly items: readonly Occurrence[];
  readonly today: string;
  readonly deals?: readonly FeaturedDeal[];
  readonly dealsLabel?: string;
}) {
  return (
    <EventDialogProvider>
    <ul className="mt-[28px] grid list-none grid-cols-1 gap-[12px] p-0 sm:grid-cols-2 sm:gap-[20px] lg:grid-cols-3">
      {items.map((item) => (
        <li key={`${item.event.slug}-${item.date}`}>
          <UpcomingCard item={item} today={today} deals={deals} dealsLabel={dealsLabel} />
        </li>
      ))}
    </ul>
    </EventDialogProvider>
  );
}

const RENGLON_PRECIO = /^(\$\d+(?:\.\d{1,2})?(?:\s+off)?)\s+(.+)$/i;

const RENGLON_PASO = /^\d+[.)]\s+(.+)$/;

type BloqueCuerpo =
  | { readonly tipo: 'parrafo'; readonly texto: string }
  | { readonly tipo: 'pasos'; readonly items: readonly string[] };

function preciosDelCuerpo(parrafos: readonly string[]): {
  readonly bloques: readonly BloqueCuerpo[];
  readonly promos: readonly FeaturedDeal[];
} {
  const bloques: BloqueCuerpo[] = [];
  const promos: FeaturedDeal[] = [];

  const empujarPaso = (item: string) => {
    const ultimo = bloques[bloques.length - 1];
    if (ultimo && ultimo.tipo === 'pasos') {
      bloques[bloques.length - 1] = { tipo: 'pasos', items: [...ultimo.items, item] };
      return;
    }
    bloques.push({ tipo: 'pasos', items: [item] });
  };

  for (const parrafo of parrafos) {
    for (const renglon of parrafo
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)) {
      const m = RENGLON_PRECIO.exec(renglon);
      if (m) {
        promos.push({ price: m[1], name: m[2].charAt(0).toUpperCase() + m[2].slice(1), how: '' });
        continue;
      }

      const paso = RENGLON_PASO.exec(renglon);
      if (paso) empujarPaso(paso[1]);
      else bloques.push({ tipo: 'parrafo', texto: renglon });
    }
  }

  return { bloques, promos };
}

function UpcomingCard({
  item,
  today,
  deals,
  dealsLabel,
}: {
  readonly item: Occurrence;
  readonly today: string;
  readonly deals?: readonly FeaturedDeal[];
  readonly dealsLabel?: string;
}) {
  const { event, date } = item;
  const tipo = eventTypeLabel(event);

  const curadas = dealsNombrados(event, deals);
  const { bloques, promos: escritas } = preciosDelCuerpo(cuerpoSinPrecios(event, curadas));
  const promos = [...curadas, ...escritas];

  const primero = bloques[0];
  const hayMas =
    bloques.length > 1 ||
    promos.length > 0 ||
    (primero !== undefined && (primero.tipo === 'pasos' || primero.texto.length > 60));

  return (
    <article className="grano relative grid h-full grid-cols-[112px_minmax(0,1fr)] overflow-hidden rounded-card sm:flex sm:flex-col border border-ink/12 bg-paper transition-colors hover:border-ink/30">
      <EventPhoto
        event={event}
        sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 112px"
        brief={`Afiche de ${event.title} en ${event.space}.`}
        fondo="bg-bone"
        ventana="max-sm:aspect-auto max-sm:h-full max-sm:min-h-28"
      >
        <span className="max-sm:hidden">
          <SpacePill>{event.space}</SpacePill>
          {tipo ? (
            <SpacePill lado="der">
              <span className={`size-[8px] shrink-0 rounded-pill ${eventDot(event)}`} aria-hidden="true" />
              {tipo}
            </SpacePill>
          ) : null}
        </span>
      </EventPhoto>

      <div className="flex min-w-0 grow flex-col p-[14px] sm:p-[18px] lg:p-[20px]">
        <EventWhen event={event} date={date} isToday={date === today} />

        <h3 className="mt-2 font-display text-d6 font-semibold uppercase leading-[1.05] text-ink sm:mt-3.5 sm:text-d5 lg:text-d4">
          {event.title}
        </h3>
        <div className="mt-[8px] flex flex-col gap-[8px] text-[16px] leading-[1.55] text-body/80">
          {bloques.map((b, i) =>
            b.tipo === 'parrafo' ? (
              <p
                key={b.texto}
                className={i === 0 ? 'max-sm:line-clamp-2 max-sm:text-[15px] max-sm:leading-[1.5]' : 'max-sm:hidden'}
              >
                {b.texto}
              </p>
            ) : (
              <ol key={b.items[0]} className="m-0 flex list-none flex-col gap-[6px] p-0 max-sm:hidden">
                {b.items.map((paso, i) => (
                  <li key={paso} className="flex gap-[8px] text-[15px] leading-[1.5]">
                    <span className="w-[1.2em] shrink-0 font-bold tabular-nums text-deep">
                      {i + 1}.
                    </span>
                    <span>{paso}</span>
                  </li>
                ))}
              </ol>
            ),
          )}
        </div>
        {promos.length > 0 ? (
          <div className="max-sm:hidden">
            {dealsLabel && curadas.length > 0 ? (
              <p className="mt-[14px] text-caption font-bold uppercase tracking-[0.1em] text-deep">
                {dealsLabel}
              </p>
            ) : null}
            <ul className="m-0 mt-[8px] flex list-none flex-col gap-[6px] p-0">
              {promos.map((d) => (
                <li key={d.price} className="flex gap-[8px] text-[15px] leading-[1.5] text-body/80">
                  <span
                    aria-hidden="true"
                    className="mt-[8px] size-[5px] shrink-0 rounded-pill bg-sunset-deep"
                  />
                  <span>
                    <strong className="font-bold text-ink">
                      {d.price} {d.name}
                    </strong>
                    {d.how ? <> · {d.how}</> : null}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <VerMas event={event} date={date} visible={hayMas} className={hayMas ? 'mt-[10px] sm:hidden' : 'sm:hidden'} />
        {isTicketed(event) && event.ticketUrl ? (
          <p className="relative z-10 m-0 mt-auto pt-[14px]">
            <a
              href={event.ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-[7px] rounded-pill bg-sunset px-[16px] py-[8px] text-caption font-bold uppercase tracking-[0.1em] text-ink transition-colors hover:bg-sunset-hover"
            >
              Get tickets
              <ArrowSquareOut className="size-[14px] shrink-0" aria-hidden="true" />
              <span className="sr-only">for {event.title} on Eventbrite (opens in a new tab)</span>
            </a>
          </p>
        ) : null}
      </div>
    </article>
  );
}
