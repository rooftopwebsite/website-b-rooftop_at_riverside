import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from '@/components/shared/Icon';
import { Eyebrow, Heading } from '@/components/shared/Type';
import { type VenueEvent, timeRange, weekdaysLabel } from '@/content/events';

export interface FeaturedDeal {
  readonly name: string;
  readonly how: string;
  readonly price: string;
  readonly aliases?: readonly string[];
}

const flat = (text: string) => text.replace(/[‘’]/g, "'").toLowerCase();

const namesDeal = (text: string, deal: FeaturedDeal) =>
  [deal.name, ...(deal.aliases ?? [])].some((n) => flat(text).includes(flat(n)));

const paragraphsOf = (event: VenueEvent) =>
  event.body.length > 0 ? event.body : event.summary === event.title ? [] : [event.summary];

const isDealsParagraph = (paragraph: string, deals: readonly FeaturedDeal[]) =>
  deals.filter((d) => namesDeal(paragraph, d)).length >= Math.min(2, deals.length);

export const namedDeals = (
  event: VenueEvent | null,
  deals: readonly FeaturedDeal[] = [],
): readonly FeaturedDeal[] => {
  if (event === null || deals.length === 0) return [];
  const paragraphs = paragraphsOf(event).filter((p) => isDealsParagraph(p, deals));
  return deals.filter((d) => paragraphs.some((p) => namesDeal(p, d)));
};

export const bodyWithoutPrices = (
  event: VenueEvent,
  promos: readonly FeaturedDeal[],
): readonly string[] =>
  promos.length === 0
    ? paragraphsOf(event)
    : paragraphsOf(event).filter((p) => !isDealsParagraph(p, promos));

function Wrapper({
  link,
  className,
  children,
}: {
  readonly link: boolean;
  readonly className: string;
  readonly children: ReactNode;
}) {
  if (!link) return <div className={className}>{children}</div>;

  return (
    <Link href="/whats-on" className={className}>
      {children}
    </Link>
  );
}

export default function FeaturedEventCard({
  event,
  deals,
  dealsLabel,
  headingLevel = 2,
  headingId,
  linkToCalendar = true,
}: {
  readonly event: VenueEvent;
  readonly deals?: readonly FeaturedDeal[];
  readonly dealsLabel?: string;
  readonly headingLevel?: 2 | 3 | 4;
  readonly headingId?: string;
  readonly linkToCalendar?: boolean;
}) {
  const when =
    event.kind === 'recurring' && event.weekdays.length > 0 ? weekdaysLabel(event.weekdays) : null;

  const promos = namedDeals(event, deals);
  const body = bodyWithoutPrices(event, promos);

  return (
    <Wrapper
      link={linkToCalendar}
      className="group relative grid overflow-hidden rounded-shell bg-deeper text-left card-shadow lg:grid-cols-2"
    >
      {promos.length > 0 ? (
        <div className="relative order-2 flex flex-col justify-center bg-ink grain p-7 lg:min-h-[22rem] lg:p-12">
          {dealsLabel ? (
            <Eyebrow tone="cream" as="p">
              {dealsLabel}
            </Eyebrow>
          ) : null}

          <ul className="m-0 mt-5 flex list-none flex-col p-0">
            {promos.map((d) => (
              <li
                key={d.name}
                className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-dashed border-bone/25 py-4.5 last:border-b"
              >
                <span className="min-w-[3ch] font-display text-d3 leading-none tabular-nums text-sunset">
                  {d.price}
                </span>
                <span className="font-display text-d5 uppercase tracking-eyebrow text-paper">
                  {d.name}
                </span>
                <span className="basis-full font-body text-base font-light text-bone/85">
                  {d.how}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="relative aspect-[16/10] w-full bg-ink lg:order-2 lg:aspect-auto lg:h-full lg:min-h-[22rem]">
          {event.image ? (
            <Image
              src={event.image}
              alt={event.imageAlt ?? ''}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 ease-brand group-hover:scale-104"
            />
          ) : null}
        </div>
      )}

      <div className="flex flex-col justify-center gap-4 p-7 lg:order-1 lg:p-12">
        <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
          <Eyebrow tone="cream" as="span">
            {when ? `Every ${when}` : 'Every week'}
          </Eyebrow>
          {when ? (
            <span className="rounded-pill bg-cream px-2.5 py-0.75 font-body text-caption font-bold whitespace-nowrap text-deep">
              {timeRange(event)}
            </span>
          ) : null}
        </span>

        <Heading
          level={headingLevel}
          {...(headingId ? { id: headingId } : {})}
          className="m-0 font-display text-d3 font-bold uppercase leading-[0.98] text-paper lg:text-d2"
        >
          {event.title}
        </Heading>
        {body.map((paragraph, i) => (
          <p
            key={paragraph}
            className={
              i === 0
                ? 'm-0 max-w-[46ch] font-body text-lead font-light text-bone'
                : 'm-0 max-w-[52ch] font-body text-base font-light text-bone/85'
            }
          >
            {paragraph}
          </p>
        ))}

        {linkToCalendar ? (
          <span className="mt-2 inline-flex w-fit items-center gap-2.5 font-body text-base font-semibold text-cream">
            See What’s Happening
            <ArrowRight className="size-4 transition-transform duration-300 ease-brand group-hover:translate-x-1" />
          </span>
        ) : null}
      </div>
    </Wrapper>
  );
}
