'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Dispatch, RefObject, SetStateAction } from 'react';
import { NAV_CTA, NAV_MORE_FEATURED, NAV_PRIMARY, type NavLink as NavLinkData } from '@/lib/nav';
import { ButtonLink } from '../Button';
import { GUTTER } from '../Section';

interface MobileMenuProps {
  readonly drawerOpen: boolean;
  readonly setDrawerOpen: Dispatch<SetStateAction<boolean>>;
  readonly drawerCloseRef: RefObject<HTMLButtonElement | null>;
  readonly isCurrent: (href: string) => boolean;
  readonly moreLinks: readonly NavLinkData[];
}

export default function MobileMenu({
  drawerOpen,
  setDrawerOpen,
  drawerCloseRef,
  isCurrent,
  moreLinks,
}: MobileMenuProps) {
  return (
    <div
      id="mobile-nav"
      inert={!drawerOpen}
      className={[
        'fixed inset-0 z-[110] desk:hidden',
        drawerOpen ? 'visible' : 'invisible pointer-events-none',
      ].join(' ')}
    >
      <div
        aria-hidden="true"
        onClick={() => setDrawerOpen(false)}
        className={[
          'absolute inset-0 hidden bg-ink/45 transition-opacity duration-300 ease-brand md:block',
          drawerOpen ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={[
          'absolute inset-0 flex flex-col bg-bone grain md:left-auto md:w-[min(480px,100%)] md:shadow-float',
          'transition-[opacity,transform] duration-300 ease-brand',
          drawerOpen
            ? 'translate-y-0 opacity-100 md:translate-x-0'
            : '-translate-y-2 opacity-0 md:translate-x-8 md:translate-y-0',
        ].join(' ')}
      >
        <div className={`flex h-header-sm shrink-0 items-center justify-between ${GUTTER}`}>
          <Image
            src="/brand/logo-primary.svg"
            alt=""
            width={110}
            height={116}
            className="h-10 w-auto"
          />
          <button
            ref={drawerCloseRef}
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="grid h-11 w-11 place-items-center"
          >
            <span className="sr-only">Close menu</span>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>
        <nav aria-label="Site" className={`flex-1 overflow-y-auto pb-6 ${GUTTER}`}>
          <ul className="flex flex-col border-t border-ink/12">
            {([
              ...NAV_PRIMARY,
              ...moreLinks,
              ...([...NAV_PRIMARY, ...moreLinks].some((l) => l.href === NAV_MORE_FEATURED.href)
                ? []
                : [NAV_MORE_FEATURED]),
            ] as readonly NavLinkData[]).map(({ label, href, external }) => (
              <li key={href}>
                <Link
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : null)}
                  onClick={() => setDrawerOpen(false)}
                  aria-current={isCurrent(href) ? 'page' : undefined}
                  className="flex items-center justify-between gap-4 border-b border-ink/12 py-3.75"
                >
                  <span
                    className={[
                      'font-body text-d5 font-bold',
                      isCurrent(href) ? 'text-ink' : 'text-ink/85',
                    ].join(' ')}
                  >
                    {label}
                    {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
                  </span>
                  <svg
                    width="16"
                    height="10"
                    viewBox="0 0 16 10"
                    fill="none"
                    aria-hidden="true"
                    className="shrink-0 text-ink/40"
                  >
                    <path
                      d="M0 5h14M10 1l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div
          className={`shrink-0 border-t border-ink/12 bg-bone grain pt-4 pb-[calc(16px+env(safe-area-inset-bottom))] ${GUTTER}`}
        >
          <div className="flex flex-col gap-2.5">
            <ButtonLink
              href={NAV_CTA.primary.href}
              variant="primary"
              size="lg"
              onClick={() => setDrawerOpen(false)}
            >
              {NAV_CTA.primary.label}
            </ButtonLink>
            <ButtonLink
              href={NAV_CTA.stayInTouch.href}
              variant="secondary"
              size="lg"
              onClick={() => setDrawerOpen(false)}
            >
              {NAV_CTA.stayInTouch.label}
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
