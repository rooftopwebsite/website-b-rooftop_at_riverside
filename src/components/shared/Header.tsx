'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { BRAND } from '@/lib/brand';
import { CAJA_ALTA_CLS } from '@/lib/flags';
import type { NavLink as NavLinkDato } from '@/lib/nav';
import {
  NAV_CTA,
  NAV_MAIN,
  NAV_SIDE,
  NAV_MORE,
  NAV_MORE_FEATURED,
  NAV_MORE_GROUPS,
  NAV_PRIMARY,
  sinBlog,
} from '@/lib/nav';
import { ButtonLink } from './Button';
import { CaretDown } from './Icon';
import { GUTTER } from './Section';
import TilePattern, { TileMark } from './TilePattern';

const NAV_ITEM = [
  'font-body text-nav font-bold',
  CAJA_ALTA_CLS,
  'whitespace-nowrap transition-colors duration-200',
].join(' ');

export default function Header({ hasBlog }: { readonly hasBlog: boolean }) {
  const moreGroups = hasBlog
    ? NAV_MORE_GROUPS
    : NAV_MORE_GROUPS.map((g) => ({ ...g, links: sinBlog(g.links) }));
  const moreLinks = hasBlog ? NAV_MORE : sinBlog(NAV_MORE);
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement | null>(null);
  const drawerCloseRef = useRef<HTMLButtonElement | null>(null);


  const route = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
  const isCurrent = (href: string) => route === href || route.startsWith(`${href}/`);
  const moreActive =
    moreLinks.some((l) => isCurrent(l.href)) || isCurrent(NAV_MORE_FEATURED.href);

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMoreOpen(false);
      setDrawerOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    drawerCloseRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  return (
    <>
      <div
        ref={moreRef}
        className="sticky top-0 z-50 border-b border-fog bg-bone grano"
        onMouseLeave={() => setMoreOpen(false)}
      >

        <header className="caja-ancha relative flex min-h-19.5 items-center gap-6">
          <Link
            href="/"
            aria-label={`${BRAND.name} home`}
            className="group z-30 grid size-16 shrink-0 place-items-center desk:absolute desk:top-1 desk:left-1/2 desk:size-25 desk:-translate-x-1/2"
          >
            <span className="sticker relative inline-flex transition-transform duration-300 ease-brand group-hover:scale-105">
              <span aria-hidden="true" className="plancha-filo" />
              <span aria-hidden="true" className="plancha" />
              <Image
                src="/brand/logo-primary.svg"
                alt=""
                width={240}
                height={254}
                loading="eager"
                className="relative h-13 w-auto desk:h-20"
              />
            </span>
            <span className="sr-only">{BRAND.name}</span>
          </Link>
          <nav
            aria-label="Main"
            className="hidden min-w-0 flex-1 items-center gap-x-4.5 gap-y-1.5 desk:flex desk:pr-20"
          >
            {NAV_MAIN.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                aria-current={isCurrent(href) ? 'page' : undefined}
                className={[
                  NAV_ITEM,
                  isCurrent(href)
                    ? 'text-ink underline decoration-sunset decoration-2 underline-offset-[10px]'
                    : 'text-ink hover:text-terra',
                ].join(' ')}
              >
                {label}
              </Link>
            ))}

            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              onMouseEnter={() => setMoreOpen(true)}
              aria-expanded={moreOpen}
              aria-haspopup="true"
              className={[
                NAV_ITEM,
                'flex items-center gap-1.25',
                moreActive ? 'text-terra' : 'text-ink hover:text-terra',
              ].join(' ')}
            >
              More
              <CaretDown
                className={`size-3 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`}
              />
            </button>
          </nav>
          <div className="flex min-w-0 flex-1 items-center justify-end gap-3 desk:gap-6 desk:pl-20">
            {NAV_SIDE.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                aria-current={isCurrent(href) ? 'page' : undefined}
                className={[
                  NAV_ITEM,
                  'hidden desk:block',
                  isCurrent(href)
                    ? 'text-ink underline decoration-sunset decoration-2 underline-offset-[10px]'
                    : 'text-ink hover:text-terra',
                ].join(' ')}
              >
                {label}
              </Link>
            ))}

            <ButtonLink
              href={NAV_CTA.primary.href}
              variant="primary"
              size="sm"
              className="sm:h-10 sm:px-5.5 sm:text-base"
            >
              {NAV_CTA.primary.label}
            </ButtonLink>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-expanded={drawerOpen}
              aria-controls="mobile-nav"
              className="grid h-11 w-11 place-items-center desk:hidden"
            >
              <span className="sr-only">Open menu</span>
              <svg width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden="true">
                <path d="M0 1h22M0 7h22M0 13h22" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </header>
        <div
          className={[
            'absolute inset-x-0 top-full border-b border-fog bg-bone grano',
            'transition-all duration-200',
            moreOpen
              ? 'visible translate-y-0 opacity-100'
              : 'invisible pointer-events-none -translate-y-1 opacity-0',
          ].join(' ')}
        >
          <div className="caja-ancha grid gap-x-10 gap-y-9 pt-11 pb-11 desk:grid-cols-[repeat(2,minmax(0,15rem))_1fr]">
            {moreGroups.map((group) => (
              <div key={group.label}>
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
                        onClick={() => setMoreOpen(false)}
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
                          <span className="mt-1.5 block font-body text-dato font-light leading-[1.5] text-muted">
                            {hint}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <Link
              href={NAV_MORE_FEATURED.href}
              onClick={() => setMoreOpen(false)}
              aria-current={isCurrent(NAV_MORE_FEATURED.href) ? 'page' : undefined}
              className="on-dark group flex flex-col overflow-hidden rounded-card bg-deep sombra-card"
            >
              <TilePattern height="h-18" />

              <span className="flex flex-1 flex-col p-5">
                <span className="eyebrow text-cream">{NAV_MORE_FEATURED.eyebrow}</span>

                <span className="mt-2.5 font-display text-d6 font-bold uppercase leading-[1.1] text-paper transition-colors duration-200 group-hover:text-cream">
                  {NAV_MORE_FEATURED.label}
                </span>
                <span className="mt-2 font-body text-dato font-light leading-[1.5] text-muted-dark">
                  {NAV_MORE_FEATURED.hint}
                </span>
                <span className="mt-auto flex items-center gap-1.5 pt-4 font-body text-dato font-medium text-cream">
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
          </div>
        </div>
      </div>
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
            'absolute inset-0 flex flex-col bg-bone grano md:left-auto md:w-[min(480px,100%)] md:shadow-float',
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
              ] as readonly NavLinkDato[]).map(({ label, href, external }) => (
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
            className={`shrink-0 border-t border-ink/12 bg-bone grano pt-4 pb-[calc(16px+env(safe-area-inset-bottom))] ${GUTTER}`}
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
                href="/contact"
                variant="secondary"
                size="lg"
                onClick={() => setDrawerOpen(false)}
              >
                Contact
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
