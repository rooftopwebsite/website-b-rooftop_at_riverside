'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { CSSProperties, ElementType, ReactNode } from 'react';
import { useMemo } from 'react';

/**
 * El lenguaje de movimiento. Parámetros de docs/house-tokens.md §8, medidos
 * sobre Tre Vele — que es el repo más nuevo de la casa.
 *
 * ⚠️ Todos los componentes cortocircuitan con `useReducedMotion()` devolviendo
 * el tag PLANO, no una animación de duración 0. Es el patrón de la casa y el
 * correcto: una animación de 0ms sigue disparando trabajo de composición.
 */

export const EASE_BRAND = [0.16, 1, 0.3, 1] as const;
export const DURATION = { fast: 0.18, base: 0.6, slow: 0.9 } as const;
export const REVEAL_OFFSET = 24;
export const STAGGER = 0.08;

const revealVariants = {
  hidden: { opacity: 0, y: REVEAL_OFFSET },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_BRAND },
  },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER, delayChildren: 0.04 } },
};

interface RevealProps {
  readonly children: ReactNode;
  readonly as?: ElementType;
  readonly className?: string;
  readonly id?: string;
  /** Cuánto del elemento tiene que entrar para disparar. Default 0.3. */
  readonly amount?: number;
}

export function Reveal({ children, as = 'div', className, id, amount = 0.3 }: RevealProps) {
  const reduced = useReducedMotion();
  const MotionTag = useMemo(() => motion.create(as), [as]);

  if (reduced) {
    const Tag = as;
    return (
      <Tag id={id} className={className}>
        {children}
      </Tag>
    );
  }

  return (
    <MotionTag
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={revealVariants}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerGroup({ children, as = 'div', className, id, amount = 0.2 }: RevealProps) {
  const reduced = useReducedMotion();
  const MotionTag = useMemo(() => motion.create(as), [as]);

  if (reduced) {
    const Tag = as;
    return (
      <Tag id={id} className={className}>
        {children}
      </Tag>
    );
  }

  return (
    <MotionTag
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
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
    return <Tag className={className}>{children}</Tag>;
  }
  return (
    <MotionTag className={className} variants={revealVariants}>
      {children}
    </MotionTag>
  );
}

/**
 * Marquee horizontal. CSS puro —no JS— así que corre en el compositor y no
 * cuesta nada. Se detiene con `prefers-reduced-motion` (ver globals.css).
 *
 * El contenido se duplica: la segunda copia va `aria-hidden` para que el lector
 * de pantalla no lea todo dos veces.
 */
export function Marquee({
  children,
  durationSeconds = 35,
  className = '',
  itemClassName = '',
}: {
  readonly children: ReactNode;
  readonly durationSeconds?: number;
  readonly className?: string;
  readonly itemClassName?: string;
}) {
  const style = { '--marquee-duration': `${durationSeconds}s` } as CSSProperties;
  return (
    <div className={['overflow-hidden', className].filter(Boolean).join(' ')}>
      <div className="rt-marquee flex w-max" style={style}>
        <div className={['flex shrink-0', itemClassName].filter(Boolean).join(' ')}>{children}</div>
        <div className={['flex shrink-0', itemClassName].filter(Boolean).join(' ')} aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
