'use client';

import Image from 'next/image';
import { useReducedMotion } from 'motion/react';

export default function WallVideo({
  src,
  poster,
}: {
  readonly src: string;
  readonly poster: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <Image
        src={poster}
        alt=""
        aria-hidden="true"
        width={480}
        height={640}
        sizes="(max-width: 1343px) 33vw, 240px"
        className="h-full w-full object-cover"
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
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      className="h-full w-full object-cover"
    />
  );
}
