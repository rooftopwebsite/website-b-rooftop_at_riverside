'use client';

import { motion, useInView, useReducedMotion } from 'motion/react';
import type { ElementType, ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import estilos from './Motion.module.css';

import { clip, dist, dur, ease, stagger, viewport } from '@/lib/motion';

export { clip, dist, dur, ease, stagger, viewport };

export const EASE_BRAND = ease.out;
export const DURATION = { fast: dur.micro, base: dur.ui, slow: dur.reveal } as const;
export const REVEAL_OFFSET = dist.text;
export const STAGGER = stagger;
export const REVEAL_AMOUNT = 0.2;

const quieto = (className?: string) => [className, estilos.quieto].filter(Boolean).join(' ');

const revealVariants = {
  hidden: { opacity: 0, y: dist.text },
  visible: { opacity: 1, y: 0, transition: { duration: dur.reveal, ease: ease.out } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: 0.04 } },
};

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
      <Tag id={id} data-reveal="" className={quieto(className)}>
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
        className={quieto(className)}
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
      <Tag data-reveal="" className={quieto(className)}>
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

export function Marquee({
  children,
  durationClassName = '',
  className = '',
  itemClassName = '',
}: {
  readonly children: ReactNode;
  readonly durationClassName?: string;
  readonly className?: string;
  readonly itemClassName?: string;
}) {
  return (
    <div className={['group/marquee overflow-hidden', className].filter(Boolean).join(' ')}>
      <div
        className={[
          'rt-marquee flex w-max group-hover/marquee:[animation-play-state:paused] group-focus-within/marquee:[animation-play-state:paused]',
          durationClassName,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className={['flex shrink-0', itemClassName].filter(Boolean).join(' ')}>{children}</div>
        <div className={['flex shrink-0', itemClassName].filter(Boolean).join(' ')} aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

export function DragCarousel({
  children,
  className = '',
  label,
}: {
  readonly children: ReactNode;
  readonly className?: string;
  readonly label: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let startX = 0;
    let startScroll = 0;
    let active = false;

    const down = (e: PointerEvent) => {
      if (e.button !== 0) return;
      active = true;
      startX = e.clientX;
      startScroll = el.scrollLeft;
    };
    const move = (e: PointerEvent) => {
      if (!active) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) < 6) return;
      setDragging(true);
      el.scrollLeft = startScroll - dx;
    };
    const up = () => {
      active = false;
      requestAnimationFrame(() => setDragging(false));
    };

    el.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, []);

  return (
    <div className={className}>
      <div
        ref={ref}
        role="region"
        aria-label={label}
        tabIndex={0}
        onClickCapture={(e) => {
          if (dragging) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        className={[
          'flex snap-x snap-mandatory gap-[20px] overflow-x-auto',
          'pt-6 -mt-6 pb-21 -mb-21',
          'scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          dragging ? 'cursor-grabbing select-none' : 'cursor-grab',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </div>
    </div>
  );
}

export function CountUp({
  to,
  duration = DURATION.slow,
  className = '',
  format = (n: number) => n.toLocaleString('en-US'),
}: {
  readonly to: number;
  readonly duration?: number;
  readonly className?: string;
  readonly format?: (n: number) => string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [value, setValue] = useState(to);

  useEffect(() => {
    if (reduced) return;
    if (!inView) {
      setValue(0);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setValue(Math.round(to * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, to, duration]);

  return (
    <span ref={ref} className={['tabular-nums', className].filter(Boolean).join(' ')}>
      {format(reduced ? to : value)}
    </span>
  );
}
