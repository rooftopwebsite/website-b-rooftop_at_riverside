'use client';

import Link from 'next/link';
import { SEASONAL } from '@/content/seasonal';
import { NAV_MORE_FEATURED, type NavGroup } from '@/lib/nav';
import TilePattern, { TileMark } from '../TilePattern';

interface MoreMenuProps {
  readonly moreOpen: boolean;
  readonly moreGroups: readonly NavGroup[];
  readonly isCurrent: (href: string) => boolean;
  readonly onLinkClick: () => void;
}

export default function MoreMenu({ moreOpen, moreGroups, isCurrent, onLinkClick }: MoreMenuProps) {
  const columns = moreGroups.reduce<NavGroup[][]>((cols, group) => {
    if (group.below && cols.length > 0) cols[cols.length - 1]!.push(group);
    else cols.push([group]);
    return cols;
  }, []);

  return (
    <div
      className={[
        'absolute inset-x-0 top-full border-b border-fog bg-bone grain',
        'transition-all duration-200',
        moreOpen
          ? 'visible translate-y-0 opacity-100'
          : 'invisible pointer-events-none -translate-y-1 opacity-0',
      ].join(' ')}
    >
      <div className="page-box-wide grid gap-x-10 gap-y-9 pt-11 pb-11 desk:grid-cols-[repeat(2,minmax(0,15rem))_1fr]">
        {columns.map((column) => (
          <div key={column[0]!.label}>
            {column.map((group, groupIndex) => (
              <div key={group.label} className={groupIndex > 0 ? 'mt-9' : undefined}>
                <p className="eyebrow text-deep">
                  {group.label}
                  <TileMark className="mt-1.5 block" />
                </p>

                <ul className="mt-3.5 flex flex-col">
                  {group.links.map(({ label, href, hint, badge, external }) => (
                    <li key={href} className="border-b border-fog last:border-b-0">
                      <Link
                        href={href}
                        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : null)}
                        onClick={onLinkClick}
                        aria-current={isCurrent(href) ? 'page' : undefined}
                        className="group block py-3.5"
                      >
                        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span
                            className={[
                              'font-body text-d7 font-bold leading-none',
                              'transition-colors duration-200',
                              isCurrent(href) ? 'text-terra' : 'text-ink group-hover:text-terra',
                            ].join(' ')}
                          >
                            {label}
                            {external ? (
                              <span className="sr-only"> (opens in a new tab)</span>
                            ) : null}
                          </span>
                          {badge ? (
                            <span className="eyebrow rounded-pill bg-sunset px-1.75 py-0.5 text-ink">
                              {badge}
                            </span>
                          ) : null}
                        </span>

                        {hint ? (
                          <span className="mt-1.5 block font-body text-data font-light leading-[1.5] text-muted">
                            {hint}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}

        {SEASONAL.NFC_NORTH_SUNDAYS ? (
          <Link
            href={NAV_MORE_FEATURED.href}
            onClick={onLinkClick}
            aria-current={isCurrent(NAV_MORE_FEATURED.href) ? 'page' : undefined}
            className="on-dark group flex flex-col overflow-hidden rounded-card bg-deep card-shadow"
          >
            <TilePattern height="h-18" />

            <span className="flex flex-1 flex-col p-5">
              <span className="eyebrow text-cream">{NAV_MORE_FEATURED.eyebrow}</span>

              <span className="mt-2.5 font-display text-d6 font-bold uppercase leading-[1.1] text-paper transition-colors duration-200 group-hover:text-cream">
                {NAV_MORE_FEATURED.label}
              </span>
              <span className="mt-2 font-body text-data font-light leading-[1.5] text-paper/85">
                {NAV_MORE_FEATURED.hint}
              </span>
              <span className="mt-3 flex flex-col gap-1.5">
                {NAV_MORE_FEATURED.points.map((dot) => (
                  <span key={dot} className="flex items-start gap-2 font-body text-data leading-[1.4] text-paper">
                    <span aria-hidden="true" className="mt-[7px] size-[5px] shrink-0 rounded-pill bg-sunset" />
                    {dot}
                  </span>
                ))}
              </span>
              <span className="mt-auto flex items-center gap-1.5 pt-4 font-body text-data font-medium text-cream">
                {NAV_MORE_FEATURED.cta}
                <svg
                  width="14"
                  height="9"
                  viewBox="0 0 14 9"
                  fill="none"
                  aria-hidden="true"
                  className="transition-transform duration-200 ease-brand group-hover:translate-x-0.5"
                >
                  <path
                    d="M0 4.5h12M8.5 1l3.5 3.5-3.5 3.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </span>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
