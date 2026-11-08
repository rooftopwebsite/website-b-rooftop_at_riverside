import Link from 'next/link';
import { CalendarGrid, GridFour } from '@/components/shared/Icon';
import { GUTTER } from '@/components/shared/Section';
import type { CalendarView } from '@/lib/calendar';

export interface MonthBarLink {
  readonly href: string;
  readonly label: string;
}

export interface MonthBarFilter {
  readonly id: string | null;
  readonly label: string;
  readonly href: string;
  readonly current: boolean;
}

const VIEWS: readonly {
  readonly id: CalendarView;
  readonly label: string;
  readonly Icon: typeof GridFour;
}[] = [
  { id: 'grid', label: 'Grid', Icon: GridFour },
  { id: 'calendar', label: 'Calendar', Icon: CalendarGrid },
];

const ACTIVE = 'bg-deep text-paper';

export default function MonthBar({
  label,
  labelShort,
  titleId,
  prev,
  next,
  view,
  viewHref,
  filters,
}: {
  readonly label: string;
  readonly labelShort: string;
  readonly titleId: string;
  readonly prev: MonthBarLink;
  readonly next: MonthBarLink;
  readonly view: CalendarView;
  readonly viewHref: (v: CalendarView) => string;
  readonly filters: readonly MonthBarFilter[];
}) {
  return (
    <div
      className={`grain sticky top-[79px] z-30 border-b border-ink/12 bg-paper py-[10px] lg:py-[14px] ${GUTTER}`}
    >
      <div className="page-box">
        <div className="flex items-center justify-between gap-[10px]">
          <div className="flex min-w-0 items-center gap-[6px] lg:gap-[10px]">
            <Arrow href={prev.href} label={prev.label} rel="prev" direction="back" />
            <h2
              id={titleId}
              className="m-0 min-w-0 truncate font-display text-d6 uppercase leading-none text-ink lg:text-d4"
            >
              <span className="sm:hidden" aria-hidden="true">
                {labelShort}
              </span>
              {' '}
              <span className="sr-only sm:not-sr-only">{label}</span>
            </h2>

            <Arrow href={next.href} label={next.label} rel="next" direction="forward" />
          </div>
          <nav aria-label="Switch calendar view" className="shrink-0">
            <ul className="m-0 flex list-none gap-[4px] rounded-pill border border-teal600/30 p-[3px]">
              {VIEWS.map((v) => {
                const active = v.id === view;
                return (
                  <li key={v.id}>
                    <Link
                      href={viewHref(v.id)}
                      scroll={false}
                      aria-current={active ? 'page' : undefined}
                      className={[
                        'hit-area flex min-w-11 items-center justify-center gap-[6px] whitespace-nowrap rounded-pill px-[10px] py-[7px] text-caption font-bold uppercase tracking-[0.1em] transition-colors lg:px-[14px]',
                        active ? ACTIVE : 'text-deep hover:bg-mint/60',
                      ].join(' ')}
                    >
                      <v.Icon className="size-[16px]" />
                      <span className="sr-only sm:not-sr-only">{v.label}</span>
                      <span className="sr-only sm:hidden"> view</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
        {filters.length > 1 ? (
          <nav
            aria-label="Filter events by type"
            className={`-mx-gutter mt-[2px] -mb-2 overflow-x-auto py-2 [scrollbar-width:none] md:-mx-gutter-lg lg:mt-[4px] [&::-webkit-scrollbar]:hidden ${GUTTER}`}
          >
            <ul className="m-0 flex w-max min-w-full list-none flex-nowrap gap-[6px] p-0 md:w-full md:flex-wrap md:gap-[8px]">
              {filters.map((f) => (
                <li key={f.id ?? 'all'} className="shrink-0">
                  <Link
                    href={f.href}
                    scroll={false}
                    aria-current={f.current ? 'true' : undefined}
                    className={[
                      'hit-area block whitespace-nowrap rounded-pill px-[13px] py-[5px] text-caption font-bold uppercase tracking-[0.08em] transition-colors',
                      f.current
                        ? ACTIVE
                        : 'border border-teal600/35 text-deep hover:border-teal600 hover:bg-mint/50',
                    ].join(' ')}
                  >
                    {f.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
    </div>
  );
}

function Arrow({
  href,
  label,
  rel,
  direction,
}: {
  readonly href: string;
  readonly label: string;
  readonly rel: 'prev' | 'next';
  readonly direction: 'back' | 'forward';
}) {
  return (
    <Link
      href={href}
      rel={rel}
      scroll={false}
      className="hit-area grid size-[34px] shrink-0 place-items-center rounded-btn border border-ink/20 transition-colors hover:border-ink hover:bg-ink hover:text-paper lg:size-[38px]"
    >
      <span className="sr-only">{label}</span>
      <svg width="9" height="14" viewBox="0 0 9 14" fill="none" aria-hidden="true">
        <path
          d={direction === 'back' ? 'M8 1L2 7l6 6' : 'M1 1l6 6-6 6'}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}
