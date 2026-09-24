'use client';

import { useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { DURATION } from './tokens';

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
