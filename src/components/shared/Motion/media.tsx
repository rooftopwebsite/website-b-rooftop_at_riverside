'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ElementType, ReactNode } from 'react';
import { useMemo } from 'react';
import { clip, dur, ease, viewport } from './tokens';
import { quieto } from './quieto';

export function RevealMedia({
  children,
  as = 'div',
  className,
  delay = 0,
  from = 'bottom',
}: {
  readonly children: ReactNode;
  readonly as?: ElementType;
  readonly className?: string;
  readonly delay?: number;
  readonly from?: 'bottom' | 'right' | 'left';
}) {
  const reduced = useReducedMotion();
  const MotionTag = useMemo(() => motion.create(as), [as]);

  if (reduced) {
    const Tag = as;
    return (
      <Tag data-reveal="" className={quieto(className)}>
        {children}
      </Tag>
    );
  }

  const cerrado =
    from === 'right'
      ? 'inset(0% 0% 0% 100%)'
      : from === 'left'
        ? 'inset(0% 100% 0% 0%)'
        : clip.hidden;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={{
        hidden: { clipPath: cerrado },
        visible: {
          clipPath: clip.visible,
          transition: { duration: dur.reveal, ease: ease.out, delay },
        },
      }}
    >
      {children}
    </MotionTag>
  );
}

export function ScaleMedia({
  children,
  className,
  delay = 0,
}: {
  readonly children: ReactNode;
  readonly className?: string;
  readonly delay?: number;
}) {
  const reduced = useReducedMotion();

  if (reduced) return <div data-reveal="" className={quieto(className)}>{children}</div>;

  return (
    <motion.div
      data-reveal=""
      className={className}
      initial={{ scale: 1.04, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={viewport}
      transition={{ duration: dur.reveal, ease: ease.out, delay }}
    >
      {children}
    </motion.div>
  );
}
