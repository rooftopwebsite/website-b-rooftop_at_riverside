'use client';

import Link from 'next/link';
import type { Dispatch, SetStateAction } from 'react';
import { NAV_MAIN } from '@/lib/nav';
import { CaretDown } from '../Icon';
import { NAV_ITEM } from './constants';

interface DesktopNavProps {
  readonly moreOpen: boolean;
  readonly setMoreOpen: Dispatch<SetStateAction<boolean>>;
  readonly moreActive: boolean;
  readonly isCurrent: (href: string) => boolean;
}

export default function DesktopNav({
  moreOpen,
  setMoreOpen,
  moreActive,
  isCurrent,
}: DesktopNavProps) {
  return (
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
  );
}
