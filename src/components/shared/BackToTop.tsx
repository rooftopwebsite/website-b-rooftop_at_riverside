'use client';

import { useReducedMotion } from 'motion/react';
import { useRef, useSyncExternalStore } from 'react';
import { useCssVar } from '@/lib/css-var';
import { Rodillo } from './Button';
import { ArrowUp } from './Icon';

const AIRE = 20;

function suscribir(alCambiar: () => void) {
  window.addEventListener('scroll', alCambiar, { passive: true });
  window.addEventListener('resize', alCambiar);
  return () => {
    window.removeEventListener('scroll', alCambiar);
    window.removeEventListener('resize', alCambiar);
  };
}

function pasoUnaPantalla() {
  return window.scrollY > window.innerHeight;
}

function alzaDelPie() {
  const zona = document.querySelector('[data-pie-cierre]');
  if (!zona) return 0;
  const asomo = window.innerHeight - zona.getBoundingClientRect().top;
  return asomo > 0 ? Math.round(asomo) + AIRE : 0;
}

export default function BackToTop() {
  const reducido = useReducedMotion();

  const visible = useSyncExternalStore(suscribir, pasoUnaPantalla, () => false);
  const alza = useSyncExternalStore(suscribir, alzaDelPie, () => 0);
  const caja = useRef<HTMLDivElement | null>(null);
  useCssVar(caja, '--alza', `${alza}px`);

  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      ref={caja}
      className={[
        'fixed right-[37px] bottom-[max(calc(72px+var(--aviso-pie,0px)),var(--alza,0px))] z-[60]',
        'transition-[opacity,transform] duration-[450ms] ease-brand',
        visible
          ? 'translate-y-0 opacity-100'
          :
            `pointer-events-none opacity-0 ${reducido ? '' : 'translate-y-2'}`,
      ].join(' ')}
    >
      <button
        type="button"
        aria-label="Back to top"
        tabIndex={visible ? undefined : -1}
        onClick={() => {
          window.scrollTo({ top: 0, behavior: reducido ? 'auto' : 'smooth' });
        }}
        className="rueda flex size-11 items-center justify-center rounded-pill bg-sunset text-ink shadow-card transition-colors duration-200 hover:bg-sunset-hover"
      >
        <Rodillo>
          <ArrowUp className="size-5" />
        </Rodillo>
      </button>
    </div>
  );
}
