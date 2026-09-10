'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import type { ElementType, ReactNode } from 'react';
import { useMemo, useRef } from 'react';

/**
 * La SALIDA: el contenido se despide mientras su sección sale por arriba.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ES EL ÚNICO MECANISMO DEL SITIO LIGADO AL PROGRESO DEL SCROLL, y va en
 * DOS lugares nada más: el bloque de texto del hero y el contenido del Events
 * banner.
 *
 * No es `whileInView`. Los reveals de entrada disparan una vez y terminan;
 * esto lee la posición cuadro a cuadro y mapea el progreso a un desplazamiento.
 * Por eso es caro y por eso está acotado.
 *
 * ⚠️ POR QUÉ NO `once: false` EN LOS REVEALS, que sería lo fácil. Que todo se
 * desarme al scrollear para arriba se siente roto, no premium: el contenido
 * que ya leíste no debería volver a aparecer. La salida es otra cosa —es el
 * bloque despidiéndose en la dirección en que se va— y sólo tiene sentido
 * donde hay algo que despedir.
 *
 * ⚠️ SE APLICA AL CONTENIDO, NUNCA A LA SECCIÓN. Envolver la sección entera y
 * moverla con `y` abre un hueco entre ella y la de al lado —y en el Events
 * banner dejaría las dos cenefas separadas de su banda—. La superficie se
 * queda quieta; lo que sale es lo que está encima.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ── Los rangos, y por qué estos ───────────────────────────────────────────
 *
 * `offset: ['end end', 'end start']` cubre exactamente la fase de SALIDA: el
 * progreso va de 0 cuando el final de la sección toca el final del viewport
 * —o sea cuando la sección empieza a irse— a 1 cuando su final toca el borde
 * de arriba, ya fuera de pantalla. Antes de eso el progreso está en 0 y no
 * pasa nada, que es lo correcto: durante la lectura el bloque está quieto.
 *
 * ⚠️⚠️ NO ANIMA LA OPACIDAD, Y ESO ES UNA CORRECCIÓN, no un olvido.
 *
 * La primera versión mapeaba el progreso a `opacity` 1 → 0.35, que es lo que
 * pide el brief. `npm run a11y` lo reprobó: los dos bloques con salida
 * contienen CTAs, y a mitad del fundido el botón primario quedaba en
 * **3.3:1** — `#54615d` sobre `#f7a85f`, o sea `ink` y `sunset` a un tercio
 * de opacidad sobre el fondo claro.
 *
 * Y el contraste es el menor de los dos problemas. Un botón al 35 % de
 * opacidad **sigue siendo clickeable**: queda un control activo, enfocable con
 * teclado, que se ve apagado. Eso no es una salida elegante, es un control en
 * un estado que miente sobre si funciona.
 *
 * Se podría envolver sólo la parte tipográfica y dejar los CTAs afuera, pero un
 * titular que se desvanece con dos botones sólidos debajo se ve peor que no
 * hacer nada.
 *
 * Así que la salida es SÓLO desplazamiento. Sigue siendo una salida ligada al
 * progreso del scroll —que es lo que el brief pide— y no toca la legibilidad
 * de nada.
 *
 * ⚠️ `y` NEGATIVO y corto —70px—. Es el bloque acelerando hacia donde ya va,
 * no un parallax: si el desplazamiento fuera grande, el texto se despegaría de
 * su propio fondo y se vería como dos capas separadas.
 *
 * ⚠️ Con `prefers-reduced-motion` devuelve el tag plano. El layout es idéntico
 * —un `transform` no reflowea— así que `npm run check:motion` mide el mismo
 * alto con y sin movimiento. Verificado en las seis rutas que revisa.
 */
export default function ScrollExit({
  children,
  as = 'div',
  className,
}: {
  readonly children: ReactNode;
  readonly as?: ElementType;
  readonly className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const MotionTag = useMemo(() => motion.create(as), [as]);

  /*
    ⚠️ `useScroll` se llama SIEMPRE, aunque con reduced-motion no se use. Un
    hook dentro de un `if` rompe el orden de hooks de React, y el costo de
    dejarlo montado es leer una posición que nadie mira.
  */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['end end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -70]);

  if (reduced) {
    const Tag = as;
    return (
      <Tag ref={ref} className={className}>
        {children}
      </Tag>
    );
  }

  return (
    <MotionTag ref={ref} className={className} style={{ y }}>
      {children}
    </MotionTag>
  );
}
