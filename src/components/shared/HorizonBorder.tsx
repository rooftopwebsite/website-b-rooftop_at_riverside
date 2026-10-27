'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { dur, ease, viewport } from '@/lib/motion';
import { HORIZON } from './horizon-wave';

export default function HorizonBorder({
  to = 'deep',
  from = 'paper',
  className = '',
}: {
  readonly to?: 'deep' | 'bone' | 'paper';
  readonly from?: 'deep' | 'bone' | 'paper';
  readonly className?: string;
}) {
  const reduced = useReducedMotion();

  const BACKGROUND = { paper: 'bg-paper', bone: 'bg-bone', deep: 'bg-deep' } as const;
  const INK = { paper: 'text-paper', bone: 'text-bone', deep: 'text-deep' } as const;

  return (
    <div
      aria-hidden="true"
      className={`grain-layer relative isolate w-full overflow-hidden ${BACKGROUND[from]} ${className}`}
    >
      <svg
        viewBox={HORIZON.viewBox}
        preserveAspectRatio="none"
        className={`block h-23 w-full lg:h-33 ${INK[to]}`}
      >
        {HORIZON.waves.map((d, i) => (
          <path key={i} d={d} fill="currentColor" />
        ))}
      </svg>
      <motion.div
        className="absolute top-[14.2%] left-1/2 z-10 aspect-square h-[98.6%] -translate-x-1/2"
        initial={reduced ? undefined : { y: 26, opacity: 0 }}
        whileInView={reduced ? undefined : { y: 0, opacity: 1 }}
        viewport={viewport}
        transition={{ duration: dur.reveal, ease: ease.out }}
      >
        <Image
          unoptimized
          src="/brand/sun-palm.svg"
          alt=""
          width={230}
          height={230}
          className="rt-sun block h-full w-full"
        />
      </motion.div>
    </div>
  );
}
