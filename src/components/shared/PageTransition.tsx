'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HORIZON } from './horizon-wave';
import { DURATION, EASE_BRAND } from './Motion';

let lastPath: string | null = null;

export default function PageTransition() {
  const reduced = useReducedMotion();
  const pathname = usePathname();
  const isNavigation = lastPath !== null && lastPath !== pathname;
  const [show, setShow] = useState(isNavigation);

  useEffect(() => {
    lastPath = pathname;
  }, [pathname]);

  useEffect(() => {
    if (!isNavigation) return;
    setShow(true);
  }, [isNavigation, pathname]);

  if (reduced) return null;

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key={`curtain-${pathname}`}
          aria-hidden="true"
          className="pointer-events-none fixed inset-x-0 top-0 z-[105] flex h-[110vh] flex-col"
          initial={{ y: 0 }}
          animate={{ y: '-110vh' }}
          transition={{ duration: DURATION.slow, ease: EASE_BRAND }}
          onAnimationComplete={() => setShow(false)}
        >
          <div className="flex-1 bg-deep" />
          <svg
            viewBox={HORIZON.viewBox}
            preserveAspectRatio="none"
            className="block h-[10vh] w-full -scale-y-100 text-deep"
          >
            {HORIZON.waves.map((d, i) => (
              <path key={i} d={d} fill="currentColor" />
            ))}
          </svg>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
