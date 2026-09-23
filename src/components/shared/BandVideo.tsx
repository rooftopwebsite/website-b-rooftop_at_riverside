'use client';

import Image from 'next/image';
import { useReducedMotion } from 'motion/react';

export default function BandVideo({
  src,
  poster,
  alt,
  className = '',
}: {
  readonly src: string;
  readonly poster: string;
  readonly alt: string;
  readonly className?: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <Image
        src={poster}
        alt={alt}
        fill
        sizes="100vw"
        className={['object-cover', className].filter(Boolean).join(' ')}
      />
    );
  }

  return (
    <video
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={alt}
      className={['absolute inset-0 h-full w-full object-cover', className]
        .filter(Boolean)
        .join(' ')}
    />
  );
}
