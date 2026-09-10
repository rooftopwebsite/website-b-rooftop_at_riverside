'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HORIZONTE } from './horizonte-ola';
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
          /* `h-[110vh]` desde el borde de arriba: 100vh de relleno más los 10vh
             de la ola, que quedan por DEBAJO del viewport en reposo. */
          className="pointer-events-none fixed inset-x-0 top-0 z-[105] flex h-[110vh] flex-col"
          initial={{ y: 0 }}
          animate={{ y: '-110vh' }}
          transition={{ duration: DURATION.slow, ease: EASE_BRAND }}
          onAnimationComplete={() => setShow(false)}
        >
          {/*
            ══════════════════════════════════════════════════════════════════
            ⚠️ LA CORTINA DIBUJA UNA FORMA, no es un telón liso.

            Era un rectángulo `bg-deep` subiendo. El brief lo tenía pendiente
            desde el mandato de ronnsquare.fr: «la transición de página que
            dibuja una forma en vez de un telón liso».

            La forma es la CENEFA DE OLAS del brand book, y no un adorno
            inventado: es el mismo dibujo que separa las secciones y el mismo
            que emerge en el horizonte. Reutiliza los paths que ya extrae
            `npm run horizonte`, así que no suma ni un byte de arte nuevo.

            Leído en la página: la superficie verde se retira como una marea.
            Es la misma metáfora del horizonte —la ola que sube y baja— aplicada
            al cambio de página.

            ⚠️ LA OLA VA ABAJO Y VOLTEADA, y esto fue un error que cometí y
            corregí: la puse arriba primero, y ahí NO SE VE NUNCA. La cortina
            SUBE, así que el borde que barre la pantalla es el de abajo; el de
            arriba se va fuera de cuadro en el primer cuadro de la animación.

            Y volteada con `scaleY(-1)` porque el dibujo tiene las crestas hacia
            arriba —está hecho para que una superficie EMERJA—. Acá la
            superficie se RETIRA, así que las crestas apuntan hacia abajo.

            ⚠️ El relleno arriba y la ola abajo, sin hueco entre los dos: si
            quedara un píxel de separación se vería una línea de la página nueva
            cruzando la cortina.

            ⚠️ El color se queda en `deep`, y eso es el resultado de la revisión
            que pedía el brief —«revisá que el color de la forma acompañe la
            paleta clara»—. Una cortina tiene que TAPAR: con el sitio en 74 %
            claro, una cortina clara sería invisible y no cubriría el salto.
            El verde de marca es lo único que contrasta contra las dos páginas.
            ══════════════════════════════════════════════════════════════════
          */}
          {/* `flex-1` y no `h-full`: el relleno toma lo que sobra después de la
              ola. Con `h-full` tomaría el 110vh completo del padre y se pasaría
              justo el alto de la ola. */}
          <div className="flex-1 bg-deep" />
          <svg
            viewBox={HORIZONTE.viewBox}
            preserveAspectRatio="none"
            className="block h-[10vh] w-full -scale-y-100"
            style={{ color: 'var(--color-deep)' }}
          >
            {HORIZONTE.olas.map((d, i) => (
              <path key={i} d={d} fill="currentColor" />
            ))}
          </svg>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
