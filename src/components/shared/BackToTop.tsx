'use client';

import { useReducedMotion } from 'motion/react';
import { useRef, useSyncExternalStore } from 'react';
import { useCssVar } from '@/lib/css-var';
import { Roller } from './Button';
import { ArrowUp } from './Icon';

const AIR = 20;

function subscribe(onChange: () => void) {
  window.addEventListener('scroll', onChange, { passive: true });
  window.addEventListener('resize', onChange);
  return () => {
    window.removeEventListener('scroll', onChange);
    window.removeEventListener('resize', onChange);
  };
}

function pastOneScreen() {
  return window.scrollY > window.innerHeight;
}

function footerLift() {
  const zone = document.querySelector('[data-footer-end]');
  if (!zone) return 0;
  const peek = window.innerHeight - zone.getBoundingClientRect().top;
  return peek > 0 ? Math.round(peek) + AIR : 0;
}

export default function BackToTop() {
  const reducedMotion = useReducedMotion();

  const visible = useSyncExternalStore(subscribe, pastOneScreen, () => false);
  const lift = useSyncExternalStore(subscribe, footerLift, () => 0);
  const box = useRef<HTMLDivElement | null>(null);
  useCssVar(box, '--lift', `${lift}px`);

  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      ref={box}
      className={[
        'fixed right-[37px] bottom-[max(calc(72px+var(--footer-notice,0px)),var(--lift,0px))] z-[60]',
        'transition-[opacity,transform] duration-[450ms] ease-brand',
        visible
          ? 'translate-y-0 opacity-100'
          :
            `pointer-events-none opacity-0 ${reducedMotion ? '' : 'translate-y-2'}`,
      ].join(' ')}
    >
      <button
        type="button"
        aria-label="Back to top"
        tabIndex={visible ? undefined : -1}
        onClick={() => {
          window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
        }}
        className="wheel flex size-11 items-center justify-center rounded-pill bg-sunset text-ink shadow-card transition-colors duration-200 hover:bg-sunset-hover"
      >
        <Roller>
          <ArrowUp className="size-5" />
        </Roller>
      </button>
    </div>
  );
}
