'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ElementType, ReactNode } from 'react';
import { useMemo } from 'react';
import { REVEAL_AMOUNT, revealVariants, staggerContainer, viewport } from './tokens';
import { still } from './still';

interface RevealProps {
  readonly children: ReactNode;
  readonly as?: ElementType;
  readonly className?: string;
  readonly id?: string;
  readonly amount?: number;
  readonly tabIndex?: number;
  readonly 'aria-label'?: string;
}

export function Reveal({ children, as = 'div', className, id, amount = REVEAL_AMOUNT }: RevealProps) {
  const reduced = useReducedMotion();
  const MotionTag = useMemo(() => motion.create(as), [as]);

  if (reduced) {
    const Tag = as;
    return (
      <Tag id={id} data-reveal="" className={still(className)}>
        {children}
      </Tag>
    );
  }

  return (
    <MotionTag
      id={id}
      data-reveal=""
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={amount === REVEAL_AMOUNT ? viewport : { once: true, amount }}
      variants={revealVariants}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerGroup({
  children,
  as = 'div',
  className,
  id,
  amount = REVEAL_AMOUNT,
  tabIndex,
  'aria-label': ariaLabel,
}: RevealProps) {
  const reduced = useReducedMotion();
  const MotionTag = useMemo(() => motion.create(as), [as]);

  if (reduced) {
    const Tag = as;
    return (
      <Tag
        id={id}
        className={still(className)}
        tabIndex={tabIndex}
        aria-label={ariaLabel}
      >
        {children}
      </Tag>
    );
  }

  return (
    <MotionTag
      id={id}
      data-reveal=""
      className={className}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      initial="hidden"
      whileInView="visible"
      viewport={amount === REVEAL_AMOUNT ? viewport : { once: true, amount }}
      variants={staggerContainer}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({
  children,
  as = 'div',
  className,
}: {
  readonly children: ReactNode;
  readonly as?: ElementType;
  readonly className?: string;
}) {
  const reduced = useReducedMotion();
  const MotionTag = useMemo(() => motion.create(as), [as]);

  if (reduced) {
    const Tag = as;
    return (
      <Tag data-reveal="" className={still(className)}>
        {children}
      </Tag>
    );
  }
  return (
    <MotionTag data-reveal="" className={className} variants={revealVariants}>
      {children}
    </MotionTag>
  );
}
