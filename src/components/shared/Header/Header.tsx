'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { NAV_CTA, NAV_MORE, NAV_MORE_FEATURED, NAV_MORE_GROUPS, NAV_SIDE, sinBlog } from '@/lib/nav';
import { ButtonLink } from '../Button';
import { NAV_ITEM } from './constantes';
import Logo from './Logo';
import MenuMas from './MenuMas';
import MenuMovil from './MenuMovil';
import NavEscritorio from './NavEscritorio';
import { getRoute, isCurrentPath } from './utils';

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

  const route = getRoute(pathname);
  const isCurrent = (href: string) => isCurrentPath(route, href);
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
          <Logo />
          <NavEscritorio
            moreOpen={moreOpen}
            setMoreOpen={setMoreOpen}
            moreActive={moreActive}
            isCurrent={isCurrent}
          />
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
              href={NAV_CTA.stayInTouch.href}
              variant="outline"
              size="sm"
              className="hidden sm:h-10 sm:px-5.5 sm:text-base lg:inline-flex"
            >
              {NAV_CTA.stayInTouch.label}
            </ButtonLink>

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
        <MenuMas
          moreOpen={moreOpen}
          moreGroups={moreGroups}
          isCurrent={isCurrent}
          onLinkClick={() => setMoreOpen(false)}
        />
      </div>
      <MenuMovil
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        drawerCloseRef={drawerCloseRef}
        isCurrent={isCurrent}
        moreLinks={moreLinks}
      />
    </>
  );
}
