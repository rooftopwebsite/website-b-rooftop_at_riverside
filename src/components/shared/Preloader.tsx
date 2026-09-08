'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { EASE_BRAND } from './Motion';

/**
 * Preloader con el isotipo del food truck y porcentaje.
 *
 * ⚠️ NO USA `sessionStorage`. El preloader de Tre Vele —el patrón de la casa—
 * guarda una bandera en `sessionStorage` para no repetirse. El brief de Rooftop
 * prohíbe explícitamente localStorage, sessionStorage y cualquier API de
 * storage del navegador, así que acá la bandera vive en un módulo EN MEMORIA.
 *
 * Qué cambia en la práctica: navegar entre páginas no vuelve a mostrarlo
 * (el módulo sobrevive a la navegación del App Router), pero recargar sí.
 * Es la diferencia aceptable — y la única forma de cumplir la restricción.
 *
 * ⚠️ `prefers-reduced-motion` lo salta entero: no muestra una versión más
 * lenta, no muestra nada. Es una pantalla que tapa el contenido.
 */

/** Vive en el módulo, no en el navegador. Se pierde al recargar, a propósito. */
let alreadyShown = false;

type Phase = 'loading' | 'exit' | 'hidden';

const FADE = 0.45;
const LIFT = 0.9;

export default function Preloader() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(() => (alreadyShown ? 'hidden' : 'loading'));
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reduced || alreadyShown) {
      alreadyShown = true;
      setPhase('hidden');
      return;
    }
    alreadyShown = true;

    const timers: number[] = [];
    let current = 0;

    // Incremento asintótico: rápido al principio, se frena cerca de 100.
    // Es el patrón de Tre Vele; da la sensación de carga real sin mentir
    // sobre un progreso que no estamos midiendo.
    const tick = window.setInterval(() => {
      current = Math.min(100, current + Math.ceil((100 - current) / 12) + 2);
      setProgress(current);
      if (current >= 100) {
        window.clearInterval(tick);
        timers.push(
          window.setTimeout(() => {
            setPhase('exit');
            timers.push(window.setTimeout(() => setPhase('hidden'), (FADE + LIFT) * 1000 + 120));
          }, 300),
        );
      }
    }, 80);

    // Corte de seguridad: pase lo que pase, a los 4s se va.
    const safety = window.setTimeout(() => {
      window.clearInterval(tick);
      setProgress(100);
      setPhase('exit');
      timers.push(window.setTimeout(() => setPhase('hidden'), (FADE + LIFT) * 1000 + 120));
    }, 4000);
    timers.push(safety);

    return () => {
      window.clearInterval(tick);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [reduced]);

  if (phase === 'hidden') return null;
  const exiting = phase === 'exit';

  return (
    <motion.div
      // `aria-hidden` + sin foco: es una cortina decorativa. El contenido real
      // ya está en el DOM debajo y el lector de pantalla lo lee directo.
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[120] flex flex-col items-center justify-center bg-paper"
      initial={{ y: 0 }}
      animate={{ y: exiting ? '-100%' : 0 }}
      transition={{ duration: LIFT, ease: EASE_BRAND, delay: exiting ? FADE : 0 }}
    >
      <motion.div
        className="flex flex-col items-center gap-[28px]"
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: FADE, ease: 'linear' }}
      >
        <Image
          src="/brand/isotype-truck.png"
          alt=""
          width={225}
          height={170}
          priority
          className="h-auto w-[120px] md:w-[160px]"
        />
        <div className="flex flex-col items-center gap-[12px]">
          {/* La barra: un filete que se llena. Va en tinta, no en naranja —
              es un elemento de interfaz y el naranja no llega a 3:1. */}
          <div className="h-[2px] w-[180px] overflow-hidden bg-ink/10">
            <div
              className="h-full bg-ink transition-[width] duration-150 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="eyebrow tabular-nums text-ink/60">{progress}%</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
