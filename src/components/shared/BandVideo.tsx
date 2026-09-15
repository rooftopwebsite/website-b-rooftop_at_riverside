'use client';

import Image from 'next/image';
import { useReducedMotion } from 'motion/react';

/**
 * Un clip a sangre para una banda ancha, que se apaga con
 * `prefers-reduced-motion`.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ POR QUÉ NO SE REUSA `WallVideo`. Ése está atado al muro del hero: recorte
 * vertical de 480×640, `sizes` de tile de 240px y `alt=""` porque el muro
 * entero es decorativo. Acá el clip es horizontal, ocupa el ancho de la
 * pantalla y SÍ es contenido, así que necesita texto alternativo de verdad.
 *
 * ⚠️ UN `<video autoPlay>` NO SE APAGA CON CSS. La media query puede detener
 * una animación, no una reproducción. Por eso el corte es en JavaScript y por
 * eso este componente es de cliente: `useReducedMotion()` no existe en el
 * servidor.
 *
 * ⚠️ CON MOVIMIENTO REDUCIDO SE MUESTRA EL PÓSTER, no un hueco. El póster es
 * un frame real del clip, así que la banda dice exactamente lo mismo, quieta.
 * Mismo recorte, misma proporción, misma altura: el layout no se mueve.
 *
 * ⚠️ `autoPlay` + `muted` + `playsInline` son los TRES obligatorios para que
 * arranque solo. Sin `muted` ningún navegador lo deja; sin `playsInline` iOS
 * lo abre en pantalla completa.
 *
 * ⚠️ `preload="metadata"` y no `auto`: el clip pesa un megabyte y no es lo
 * primero que alguien vino a ver. Con `auto` compite por ancho de banda con
 * el texto y las fotos de arriba.
 * ══════════════════════════════════════════════════════════════════════════
 */
export default function BandVideo({
  src,
  poster,
  alt,
  className = '',
}: {
  readonly src: string;
  readonly poster: string;
  /** Qué se ve. Va como `aria-label` del video y como `alt` del póster. */
  readonly alt: string;
  readonly className?: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <Image
        src={poster}
        alt={alt}
        fill
        sizes="100vw"
        className={['object-cover', className].filter(Boolean).join(' ')}
      />
    );
  }

  return (
    <video
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={alt}
      className={['absolute inset-0 h-full w-full object-cover', className]
        .filter(Boolean)
        .join(' ')}
    />
  );
}
