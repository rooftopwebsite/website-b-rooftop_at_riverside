'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ElementType, ReactNode } from 'react';
import { DURATION, EASE_BRAND, dur, ease } from './tokens';
import { quieto } from './quieto';

export function MaskedLines({
  lines,
  as: Tag = 'span',
  className = '',
  delay = 0,
  accentLast = false,
  accentOn = 'dark',
}: {
  readonly lines: readonly string[];
  readonly as?: ElementType;
  readonly className?: string;
  readonly delay?: number;
  readonly accentLast?: boolean;
  readonly accentOn?: 'light' | 'dark';
}) {
  const reduced = useReducedMotion();
  const acento = accentOn === 'light' ? 'text-sunset-deep' : 'text-sunset';
  const tone = (i: number) => (accentLast && i === lines.length - 1 ? acento : undefined);

  const withSpace = (line: string, i: number) => (i < lines.length - 1 ? `${line} ` : line);

  if (reduced) {
    return (
      <Tag data-reveal="" className={quieto(className)}>
        {lines.map((line, i) => (
          <span key={i} className={['block', tone(i)].filter(Boolean).join(' ')}>
            {withSpace(line, i)}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className={['block', tone(i)].filter(Boolean).join(' ')}
            initial={{ y: '105%' }}
            animate={{ y: '0%' }}
            transition={{
              duration: dur.hero,
              ease: ease.out,
              delay: delay + i * 0.07,
            }}
          >
            {withSpace(line, i)}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

export function HeroFadeUp({
  children,
  delay = 0,
  className = '',
}: {
  readonly children: ReactNode;
  readonly delay?: number;
  readonly className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div data-reveal="" className={quieto(className)}>{children}</div>;

  return (
    <motion.div
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.base, ease: EASE_BRAND, delay }}
    >
      {children}
    </motion.div>
  );
}
