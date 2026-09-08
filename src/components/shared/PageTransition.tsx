'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DURATION, EASE_BRAND } from './Motion';

/**
 * Transición de página: una cortina corta, del mismo color y con la misma
 * curva que la salida del preloader. Los dos gestos tienen que leerse como uno.
 *
 * ⚠️ La cortina sube y se va — NO tapa la navegación mientras carga. El App
 * Router ya pintó la página nueva cuando esto corre; la cortina sólo cubre el
 * salto. Por eso `pointer-events-none`: nunca bloquea un click.
 *
 * ⚠️ Con reduced-motion no se monta nada.
 *
 * ⚠️ `lastPath` vive en el módulo, no en storage: el brief prohíbe storage del
 * navegador. Sirve para no disparar la cortina en la PRIMERA carga, donde ya
 * está el preloader haciendo ese trabajo.
 */

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
          className="pointer-events-none fixed inset-0 z-[105] bg-deep"
          initial={{ y: 0 }}
          animate={{ y: '-100%' }}
          transition={{ duration: DURATION.slow, ease: EASE_BRAND }}
          onAnimationComplete={() => setShow(false)}
        />
      ) : null}
    </AnimatePresence>
  );
}
