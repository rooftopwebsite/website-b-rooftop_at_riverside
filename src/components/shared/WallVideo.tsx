'use client';

import Image from 'next/image';
import { useReducedMotion } from 'motion/react';

/**
 * Un clip del muro del hero, que se apaga con `prefers-reduced-motion`.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ POR QUÉ ES UN ARCHIVO APARTE Y UN COMPONENTE CLIENTE.
 *
 * `VideoWall` es un server component a propósito: los doce tiles y el loop de
 * las columnas no necesitan JavaScript —el desplazamiento es CSS puro— y
 * hacerlo cliente mandaría el array entero al bundle sin ganar nada.
 *
 * Pero un `<video autoPlay>` **no se apaga con CSS**. El
 * `@media (prefers-reduced-motion: reduce)` de `.rt-wall` detiene la animación
 * del track, y eso es lo único que puede hacer: el video sigue reproduciéndose
 * abajo. Un loop de 6 segundos repitiéndose para siempre es exactamente el
 * tipo de movimiento que la preferencia pide apagar.
 *
 * `useReducedMotion()` sólo existe en el cliente, y una directiva `'use
 * client'` aplica a todo el módulo — no se puede marcar una función sola. Así
 * que el clip vive en su propio archivo y `VideoWall` sigue siendo server: lo
 * único que cruza al bundle es este componente.
 *
 * ⚠️ Con el movimiento reducido se muestra el PÓSTER, no un hueco. El póster es
 * un frame real del clip, así que el muro sigue diciendo lo mismo —doce piezas
 * del lugar— sólo que quieto. El layout es idéntico: mismo recorte, misma
 * proporción, mismo tamaño de caja.
 * ══════════════════════════════════════════════════════════════════════════
 */
export default function WallVideo({
  src,
  poster,
}: {
  readonly src: string;
  readonly poster: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <Image
        src={poster}
        alt=""
        aria-hidden="true"
        width={480}
        height={640}
        sizes="(max-width: 1343px) 33vw, 240px"
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    /*
      ⚠️ `autoPlay` + `muted` + `playsInline` son los TRES obligatorios para que
      un video arranque solo. Faltaba `autoPlay` en la versión anterior, así que
      el muro habría mostrado un primer frame quieto incluso con los clips
      puestos — el movimiento venía sólo del loop CSS de la columna.

      ⚠️ `poster` no es opcional: sin él el tile queda en el color de espera
      hasta que el video tiene datos, y en una columna que ya se está
      desplazando eso se ve como un hueco que aparece y desaparece.

      ⚠️ `preload="none"`. Son dos clips de ~500 KB en la primera pantalla; con
      `metadata` el navegador abre las dos conexiones antes de que el hero
      termine de pintar. El póster cubre el primer frame.

      ⚠️ `tabIndex={-1}` porque es decorativo: sin esto un `<video>` entra en el
      orden de tabulación y quien navega con teclado tropieza con dos controles
      que no controlan nada.
    */
    <video
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      className="h-full w-full object-cover"
    />
  );
}
