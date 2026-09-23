'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { dur, ease } from '@/lib/motion';
import WallVideo from './WallVideo';
import { WALL, type Slot } from './wall-slots';

const PASO = 4.2;
const RADIO = 1150;

function Card({ slot, index, total }: { readonly slot: Slot; readonly index: number; readonly total: number }) {
  const reduced = useReducedMotion();

  const angulo = (index - (total - 1) / 2) * PASO;
  const subida = RADIO * (1 - Math.cos((angulo * Math.PI) / 180));

  return (
    <motion.li
      className="w-[16.5vw] min-w-30.5 shrink-0 origin-bottom"
      initial={reduced ? { rotate: angulo, y: -subida } : { opacity: 0, rotate: angulo, y: -subida + 40 }}
      animate={{ opacity: 1, rotate: angulo, y: -subida }}
      transition={{
        duration: dur.reveal,
        ease: ease.out,
        delay: 0.35 + Math.abs(index - (total - 1) / 2) * 0.06,
      }}
    >
      <div className="aspect-[3/4] w-full overflow-hidden rounded-[14px] bg-bone shadow-photo">
        {slot.tipo === 'video' ? (
          <WallVideo src={slot.src} poster={slot.poster} />
        ) : (
          <Image
            src={slot.src}
            alt=""
            aria-hidden="true"
            width={540}
            height={720}
            sizes="17vw"
            className="h-full w-full object-cover"
          />
        )}
      </div>
    </motion.li>
  );
}

export default function CardArc({ className = '' }: { readonly className?: string }) {
  const cards = WALL.slice(0, 9);

  return (
    <div
      className={`pointer-events-none w-full overflow-hidden ${className}`}
    >
      <ul className="flex w-full items-end justify-center gap-[1.1vw] px-[2vw]">
        {cards.map((slot, i) => (
          <Card key={slot.src} slot={slot} index={i} total={cards.length} />
        ))}
      </ul>
    </div>
  );
}
