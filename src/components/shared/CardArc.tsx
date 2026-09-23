'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { dur, ease } from '@/lib/motion';
import WallVideo from './WallVideo';
import { WALL, type Slot } from './wall-slots';

/**
 * El ARCO de cards del hero: una fila de piezas verticales inclinadas sobre una
 * curva, sangrando por los dos costados.
 *
 * Sale de un mockup de Camila y de una referencia que mandó: el titular
 * centrado arriba y debajo un abanico de cards apoyado en un arco.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ REEMPLAZA AL MURO VERTICAL (`VideoWall`) EN EL HERO, y es la séptima forma
 * de este bloque. `VideoWall` NO se borra: sigue en el árbol con sus tres
 * columnas y su loop CSS, y sigue siendo la forma correcta para un hero de dos
 * columnas. Lo que cambia es que el hero pasó a ser centrado, y un muro de
 * columnas verticales al costado de un titular centrado no tiene dónde ir.
 *
 * Las dos comparten el material: los doce slots viven en `wall-slots.ts`, así
 * que volver a la otra forma no implica reasignar fotos.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ── La geometría del arco ─────────────────────────────────────────────────
 *
 * Cada card se coloca en un ángulo y se corrige su altura para que el conjunto
 * apoye en una curva:
 *
 *     ángulo_i  = (i − centro) × PASO
 *     subida_i  = RADIO × (1 − cos(ángulo_i))
 *
 * `1 − cos` es cero en el centro y crece hacia los extremos, así que las cards
 * de las puntas SUBEN y la del medio queda abajo: el conjunto se lee apoyado
 * en el borde inferior de un círculo grande cuyo centro está arriba de la
 * pantalla. Es lo que hace que un abanico se vea como un abanico y no como una
 * fila con cards torcidas al azar.
 *
 * ⚠️ El ángulo y la subida salen de la MISMA cuenta, y ahí está el truco. Con
 * la rotación puesta a ojo y la subida a ojo por separado, el arco nunca cierra
 * — es el error que hace que estos abanicos se vean amateur.
 *
 * ⚠️ `transform-origin: bottom center` y no el centro de la card. Girando desde
 * la base, el pie de cada card se queda sobre la curva; girando desde el medio,
 * las puntas se hunden y hay que compensarlo con otro número inventado.
 */

/** Cuántos grados separan una card de la siguiente. */
const PASO = 4.2;
/** El radio de la curva, en píxeles. Más grande = arco más plano. */
const RADIO = 1150;

function Card({ slot, index, total }: { readonly slot: Slot; readonly index: number; readonly total: number }) {
  const reduced = useReducedMotion();

  const angulo = (index - (total - 1) / 2) * PASO;
  const subida = RADIO * (1 - Math.cos((angulo * Math.PI) / 180));

  return (
    <motion.li
      className="w-[16.5vw] min-w-30.5 shrink-0 origin-bottom"
      /* La entrada: las cards suben desde abajo con desfasaje del centro hacia
         afuera, así el abanico se abre en lugar de aparecer de izquierda a
         derecha. `Math.abs` del índice relativo es lo que produce ese orden.

         ⚠️ EL GIRO Y LA SUBIDA VAN EN `initial`/`animate` Y NO EN `style`,
         desde el 2026-09-23: los aplica framer y el JSX no lleva estilo en
         línea. Con reduced-motion los dos estados son el mismo y no hay
         animación. */
      initial={reduced ? { rotate: angulo, y: -subida } : { opacity: 0, rotate: angulo, y: -subida + 40 }}
      animate={{ opacity: 1, rotate: angulo, y: -subida }}
      transition={{
        duration: dur.reveal,
        ease: ease.out,
        delay: 0.35 + Math.abs(index - (total - 1) / 2) * 0.06,
      }}
    >
      <div className="aspect-[3/4] w-full overflow-hidden rounded-[14px] bg-bone shadow-photo">
        {slot.tipo === 'video' ? (
          <WallVideo src={slot.src} poster={slot.poster} />
        ) : (
          /* `alt=""` y `aria-hidden`: el arco es ATMÓSFERA. Nueve piezas
             decorativas del lugar; describirlas obligaría a un lector de
             pantalla a escuchar nueve descripciones antes del titular. */
          <Image
            src={slot.src}
            alt=""
            aria-hidden="true"
            width={540}
            height={720}
            sizes="17vw"
            className="h-full w-full object-cover"
          />
        )}
      </div>
    </motion.li>
  );
}

export default function CardArc({ className = '' }: { readonly className?: string }) {
  /*
    ⚠️ NUEVE cards y no las doce. El arco tiene que SANGRAR por los dos
    costados —las de las puntas se cortan, y eso es lo que dice que la fila
    sigue— pero con doce a 16,5vw el ángulo acumulado llega a 46° y las de los
    extremos quedan casi acostadas. Con nueve el barrido total es de 34°, que
    es un abanico y no un derrumbe.
  */
  const cards = WALL.slice(0, 9);

  return (
    <div
      className={`pointer-events-none w-full overflow-hidden ${className}`}
      /* El `pb` negativo del hijo empuja las cards fuera del borde inferior:
         se cortan abajo, así que se leen como que siguen bajando. */
    >
      <ul className="flex w-full items-end justify-center gap-[1.1vw] px-[2vw]">
        {cards.map((slot, i) => (
          <Card key={slot.src} slot={slot} index={i} total={cards.length} />
        ))}
      </ul>
    </div>
  );
}
