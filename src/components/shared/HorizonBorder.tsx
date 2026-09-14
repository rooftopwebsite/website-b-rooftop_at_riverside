'use client';

import { motion, useReducedMotion } from 'motion/react';
import { dur, ease, viewport } from '@/lib/motion';
import { HORIZONTE } from './horizonte-ola';

/**
 * El HORIZONTE: la ola del brand book con el medallón de sol y palmera
 * emergiendo de ella. Es la transición entre una superficie clara y la banda
 * oscura.
 *
 * Sale del Figma («Rooftop at Riverside (Copy)», nodo 2012:4491) y lo parte en
 * sus dos piezas `npm run horizonte`.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ REEMPLAZA A `WaveBorder` EN UN SOLO CORTE: la entrada a Events banner.
 *
 * `WaveBorder` —la cenefa de olas— sigue existiendo y sigue siendo el
 * separador general del brand book. Pero acá hay algo mejor: el corte de
 * ThreeDoors a Events banner es el ÚNICO salto de claro a oscuro de la home, y
 * este elemento lo dice literalmente. La ola es la superficie oscura que sube,
 * y el sol se pone detrás de ella.
 *
 * Y encaja con el concepto de la rama —el sitio es la HORA, no el lugar—: la
 * página va del mediodía a la noche, y éste es el atardecer, en el punto
 * exacto donde la página se oscurece.
 *
 * ⚠️ LA CENEFA DE SALIDA SE QUEDA. Entra por el horizonte y sale por la cenefa
 * de olas: dos piezas distintas para dos cortes distintos, en vez de la misma
 * dos veces. Era el riesgo que había anotado en la autocrítica —«dos
 * apariciones de la misma pieza a 50px pueden leerse como manierismo»— y esto
 * lo resuelve.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ── La animación ──────────────────────────────────────────────────────────
 *
 * Camila la pidió. Era un gesto y quedó UNO:
 *
 *   1. **El sol sube** al entrar en pantalla, una sola vez. Sale de detrás de
 *      la ola y se acomoda. Es un `y` corto con la curva de marca.
 *   2. ~~El disco gira~~ — **SACADO en la autocrítica final.** Era una
 *      rotación infinita de 90s, y era el único elemento del sitio que nunca
 *      se asentaba. La clase `rt-sol` se conserva como gancho vacío; el
 *      motivo completo está en `globals.css` y en
 *      `design-audit/AUTOCRITICA.md`.
 *
 * ⚠️ La ola NO se anima. Ya se mueve el sol; mover las dos cosas convierte una
 * transición en una escena. Superside es la referencia de moderación de la
 * rama: anima poco, en los momentos justos.
 *
 * ⚠️ Con `prefers-reduced-motion` no hay subida: el sol se dibuja en su lugar
 * final. El layout es idéntico —la animación sólo mueve el `y` de un
 * elemento posicionado— así que `check:motion` sigue dando el mismo alto.
 */
export default function HorizonBorder({
  /**
   * El color de la ola: la superficie de ABAJO, la que emerge.
   *
   * ⚠️ Es la misma regla que `WaveBorder`, y por el mismo motivo: el dibujo
   * tiene la base abajo y las crestas hacia arriba, así que pintado del color
   * de arriba quedaría colgando del techo dado vuelta.
   */
  to = 'deep',
  from = 'paper',
  className = '',
}: {
  readonly to?: 'deep' | 'bone' | 'paper';
  readonly from?: 'deep' | 'bone' | 'paper';
  readonly className?: string;
}) {
  const reduced = useReducedMotion();

  const SUPERFICIES = {
    paper: 'var(--color-paper)',
    bone: 'var(--color-bone)',
    deep: 'var(--color-deep)',
  } as const;

  return (
    <div
      aria-hidden="true"
      /* `grano-capa` y no `grano`: el color de llegada lo pintan los paths
         del SVG. Ver su nota en globals.css. */
      className={`grano-capa relative isolate w-full overflow-hidden ${className}`}
      style={{ backgroundColor: SUPERFICIES[from] }}
    >
      {/* ── La ola ───────────────────────────────────────────────────────
          `preserveAspectRatio="none"` la estira a lo ancho de la pantalla sin
          crecer de alto: es una banda, no un dibujo con proporción. Y
          `block` saca el espacio fantasma que un SVG inline deja debajo por
          ser `inline` por defecto. */}
      <svg
        viewBox={HORIZONTE.viewBox}
        preserveAspectRatio="none"
        className="block h-23 w-full lg:h-33"
        style={{ color: SUPERFICIES[to] }}
      >
        {HORIZONTE.olas.map((d, i) => (
          <path key={i} d={d} fill="currentColor" />
        ))}
      </svg>

      {/* ── El medallón ──────────────────────────────────────────────────
          Centrado y apoyado en la línea de la ola. `bottom-0` con el
          `translate-y` parcial lo deja mordiendo la ola, que es como está
          dibujado en el Figma.

          ⚠️ Va como `<img>` y no inline: son 56 KB de trazado a mano —los
          dientes del sol son cientos de formitas— y como archivo se cachea una
          vez en lugar de viajar en el HTML de la home. Sus colores están
          horneados desde `lib/brand.ts` por el script, porque las CSS
          variables no cruzan la frontera de un `<img>`. */}
      {/*
        ⚠️ LA GEOMETRÍA SALE DEL ORIGINAL, no de números a ojo, y eso importa
        porque la ola se estira con `preserveAspectRatio="none"` y el medallón
        NO puede estirarse. Del export del Figma (lienzo 2176×233):

            centro del disco   x 1088,1 → 50,0 % del ancho  → centrado
                               y   147,9 → 63,5 % del alto
            diámetro con dientes  229,8 → 98,6 % del alto

        Como el alto del contenedor es fijo (92px en mobile, 132px en desktop)
        y el ancho es el de la pantalla, TODO se expresa como porcentaje del
        ALTO: así el medallón mantiene su proporción y su posición relativa a
        la línea de la ola en cualquier ancho.

            top = 63,5 % − 98,6 %/2 = 14,2 %

        ⚠️ El disco se corta contra el borde inferior, y es fiel: en el original
        el círculo llega a y=245 sobre un lienzo de 233. Está dibujado para
        morder el borde.

        ⚠️ VA POR ENCIMA DE LA OLA (`z-10`), no por debajo. Lo tenía en `-z-10`
        y el medallón quedó **invisible**: la ola es un relleno opaco y lo
        tapaba entero. En el original el disco se superpone a la ola —es lo que
        hace que la palmera crema se vea sobre el verde—.
      */}
      <motion.div
        className="absolute left-1/2 z-10 aspect-square h-[98.6%] -translate-x-1/2"
        style={{ top: '14.2%' }}
        initial={reduced ? undefined : { y: 26, opacity: 0 }}
        whileInView={reduced ? undefined : { y: 0, opacity: 1 }}
        viewport={viewport}
        transition={{ duration: dur.reveal, ease: ease.out }}
      >
        {/*
          ══════════════════════════════════════════════════════════════════
          ⚠️ ES UN `<img>` PLANO Y NO `next/image`, y esto fue un bug de dos
          horas que conviene dejar escrito.

          Medido en el navegador, el mismo archivo:

              /brand/sun-palm.svg                    → natural 230×230  ✅
              /_next/image?url=…sun-palm.svg&w=256   → natural   0×0    ❌

          El optimizador de Next devuelve un 200, con `Content-Type:
          image/svg+xml` y los 57 KB completos, pero el navegador reporta la
          imagen como 0×0 y no dibuja nada. Sin error de consola, sin 404. El
          `<img>` existía, `complete` era `true`, la caja medía 160×160, y no
          había imagen.

          Perseguí el z-index dos veces y el `viewBox` una antes de medirlo.

          ⚠️ Y LA DECISIÓN CORRECTA NO ES PELEARLE AL OPTIMIZADOR: es no
          pasarle vectores. `next/image` no puede hacer NADA por un SVG —no
          redimensiona, no convierte a WebP, no genera srcset útil—. Todo lo
          que agrega es la ruta que lo rompe, más la dependencia de
          `dangerouslyAllowSVG` y del CSP con `sandbox` que el config le pone
          encima.

          ⚠️ MISMO PROBLEMA LATENTE en el isotipo del hero y en el lockup del
          header, que también pasan por `next/image`. Hoy renderizan, pero por
          caché: pedidos con un ancho nuevo devuelven la misma respuesta con
          `Content-Disposition: attachment`. Se migran igual.
          ══════════════════════════════════════════════════════════════════
        */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/sun-palm.svg"
          alt=""
          width={230}
          height={230}
          /* `rt-sol` quedó como gancho sin animación. Ver globals.css. */
          className="rt-sol block h-full w-full"
        />
      </motion.div>
    </div>
  );
}
