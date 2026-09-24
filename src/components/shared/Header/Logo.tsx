'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BRAND } from '@/lib/brand';

export default function Logo() {
  return (
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
  );
}
