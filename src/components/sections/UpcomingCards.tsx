import { EventDialogProvider, SeeMore } from '@/components/sections/EventDialogProvider';
import ExpandableBody from '@/components/sections/ExpandableBody';
import { EventPhoto, EventWhen, SpacePill } from '@/components/shared/EventCardParts';
import {
  bodyWithoutPrices,
  namedDeals,
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

const PRICE_LINE = /^(\$\d+(?:\.\d{1,2})?(?:\s+off)?)\s+(.+)$/i;

const STEP_LINE = /^\d+[.)]\s+(.+)$/;

type BodyBlock =
  | { readonly type: 'paragraph'; readonly text: string }
  | { readonly type: 'steps'; readonly items: readonly string[] };

function bodyPrices(paragraphs: readonly string[]): {
  readonly blocks: readonly BodyBlock[];
  readonly promos: readonly FeaturedDeal[];
} {
  const blocks: BodyBlock[] = [];
  const promos: FeaturedDeal[] = [];

  const pushStep = (item: string) => {
    const last = blocks[blocks.length - 1];
    if (last && last.type === 'steps') {
      blocks[blocks.length - 1] = { type: 'steps', items: [...last.items, item] };
      return;
    }
    blocks.push({ type: 'steps', items: [item] });
  };

  for (const paragraph of paragraphs) {
    for (const line of paragraph
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)) {
      const m = PRICE_LINE.exec(line);
      if (m) {
        promos.push({ price: m[1], name: m[2].charAt(0).toUpperCase() + m[2].slice(1), how: '' });
        continue;
      }

      const step = STEP_LINE.exec(line);
      if (step) pushStep(step[1]);
      else blocks.push({ type: 'paragraph', text: line });
    }
  }

  return { blocks, promos };
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
  const type = eventTypeLabel(event);
  const bodyId = `body-${event.slug}-${date}`;

  const curated = namedDeals(event, deals);
  const { blocks, promos: written } = bodyPrices(bodyWithoutPrices(event, curated));
  const promos = [...curated, ...written];

  const first = blocks[0];
  const hasMore =
    blocks.length > 1 ||
    promos.length > 0 ||
    (first !== undefined && (first.type === 'steps' || first.text.length > 60));

  return (
    <article className="grain relative grid h-full grid-cols-[112px_minmax(0,1fr)] overflow-hidden rounded-card sm:flex sm:flex-col border border-ink/12 bg-paper transition-colors hover:border-ink/30">
      <EventPhoto
        event={event}
        sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 112px"
        brief={`Poster for ${event.title} at ${event.space}.`}
        background="bg-bone"
        windowClassName="max-sm:aspect-auto max-sm:h-full max-sm:min-h-28"
      >
        <span className="max-sm:hidden">
          <SpacePill>{event.space}</SpacePill>
          {type ? (
            <SpacePill side="right">
              <span className={`size-[8px] shrink-0 rounded-pill ${eventDot(event)}`} aria-hidden="true" />
              {type}
            </SpacePill>
          ) : null}
        </span>
      </EventPhoto>

      <div className="flex min-w-0 grow flex-col p-[14px] sm:p-[18px] lg:p-[20px]">
        <EventWhen event={event} date={date} isToday={date === today} />

        <h3 className="mt-2 font-display text-d6 font-semibold uppercase leading-[1.05] text-ink sm:mt-3.5 sm:text-d5 lg:text-d4">
          {event.title}
        </h3>
        <ExpandableBody
          id={bodyId}
          title={event.title}
          lines={promos.length > 0 ? 12 - promos.length - 2 : 12}
          after={
            promos.length > 0 ? (
            <div className="max-sm:hidden">
              {dealsLabel && curated.length > 0 ? (
                <p className="mt-[14px] text-caption font-bold uppercase tracking-[0.1em] text-deep">
                  {dealsLabel}
                </p>
              ) : null}
              <ul className="m-0 mt-[8px] flex list-none flex-col gap-[6px] p-0">
                {promos.map((d) => (
                  <li key={d.name} className="flex gap-[8px] text-[15px] leading-[1.5] text-body/80">
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
            ) : null
          }
        >
          {blocks.map((b, i) =>
            b.type === 'paragraph' ? (
              <p
                key={b.text}
                className={i === 0 ? 'max-sm:line-clamp-2 max-sm:text-[15px] max-sm:leading-[1.5]' : 'max-sm:hidden'}
              >
                {b.text}
              </p>
            ) : (
              <ol key={b.items[0]} className="m-0 flex list-none flex-col gap-[6px] p-0 max-sm:hidden">
                {b.items.map((step, i) => (
                  <li key={step} className="flex gap-[8px] text-[15px] leading-[1.5]">
                    <span className="w-[1.2em] shrink-0 font-bold tabular-nums text-deep">
                      {i + 1}.
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            ),
          )}
        </ExpandableBody>

        <SeeMore event={event} date={date} visible={hasMore} className={hasMore ? 'mt-[10px] sm:hidden' : 'sm:hidden'} />
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
