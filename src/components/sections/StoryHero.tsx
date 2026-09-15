'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import Image from 'next/image';
import { useRef } from 'react';
import { Eyebrow, Heading } from '@/components/shared/Type';
import { STORY_LEAD } from '@/content/people';

/*
 * ══════════════════════════════════════════════════════════════════════════
 * EL ENCABEZADO DE `/our-story`. LA IDEA VISUAL: EL TITULAR ES LA JUNTA.
 *
 * El negocio es literalmente un rooftop construido ARRIBA de un food truck
 * park, en la misma propiedad. Así que la página abre con esa sección en
 * corte: la foto del rooftop arriba, la foto de los camiones abajo, y entre
 * las dos una banda clara donde va el texto. Se lee como un edificio de dos
 * pisos con la historia escrita en el entrepiso.
 *
 * ⚠️ POR QUÉ EL TEXTO NO VA ENCIMA DE LA FOTO. Un h1 sobre una imagen a sangre
 * es exactamente lo que este encabezado NO tiene que ser: es la forma
 * predeterminada, la usa el sitio viejo, y además obliga a un velo oscuro para
 * llegar a contraste AA, que apaga la foto. Acá el texto va sobre `bone`, o
 * sea 15.83:1, sin velo y sin pelear con nada.
 *
 * ⚠️ EL ARCO DE ABAJO ES EL DEL SISTEMA. `rounded-t-band` es el mismo
 * `--radius-band` —clamp(36px, 9vw, 88px)— con el que la home corta sus dos
 * bandas teal. No es un radio elegido para esta página.
 *
 * ⚠️ MOTION: UNA SOLA IDEA, y es ésta. Las dos fotos se separan levemente al
 * scrollear, en sentidos opuestos, así que la junta se ABRE y el texto entra
 * en foco. No hay fade-up en ninguna otra sección de la página; el resto usa
 * los reveals del sistema una sola vez.
 *
 * El recorrido es de 40px en total repartido entre las dos, que es deliberado:
 * a más que eso el borde de la foto de arriba deja ver el fondo de la sección
 * y se lee como un error de layout, no como un gesto.
 *
 * ⚠️ `useReducedMotion()` corta el efecto de raíz: con la preferencia puesta
 * las dos `y` quedan en 0 y el componente renderiza estático. No se anima la
 * opacidad de nada, así que no hay nada que quede invisible.
 * ══════════════════════════════════════════════════════════════════════════
 */

/*
 * ⚠️ LAS DOS FOTOS SALEN DE `public/images/venue/`, QUE ES LA ENTREGA REAL DEL
 * CLIENTE (36 fotos, 2026-09-10, derivadas por `npm run media`). NO se usan las
 * `public/images/venue-*.jpg` de la raíz: ésas son placeholders del primer
 * commit y son fotos de stock. `venue-truck-line.jpg`, por ejemplo, es un
 * camión rojo llamado «The Food Stop» con un pizarrón en portugués.
 */
const ROOF = {
  src: '/images/venue/wall-cocktails-rooftop.jpg',
  alt: 'Four drinks on a table on the rooftop at Rooftop at Riverside, with the tables and the bar behind them in late afternoon light',
};
const YARD = {
  src: '/images/venue/venue-aerial.jpg',
  alt: 'The yard at Rooftop at Riverside seen from the rooftop, with the food trucks parked along the back and umbrellas over the picnic tables',
};

export default function StoryHero() {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const upY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -24]);
  const downY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 16]);

  return (
    <section ref={ref} aria-labelledby="page-title" className="bg-bone">
      {/* ── El piso de arriba ──────────────────────────────────────────── */}
      <motion.div
        style={{ y: upY }}
        className="relative h-[38vh] min-h-[240px] w-full overflow-hidden lg:h-[46vh] lg:min-h-[360px]"
      >
        <Image
          src={ROOF.src}
          alt={ROOF.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_62%]"
        />
      </motion.div>

      {/* ── El entrepiso: acá va el texto ──────────────────────────────── */}
      <div className="caja px-gutter py-[40px] md:px-gutter-lg lg:py-[64px]">
        <div className="max-w-[20ch]">
          <Eyebrow tone="deep">Our story</Eyebrow>
        </div>
        <Heading level={1} id="page-title" className="mt-gap-kicker max-w-[16ch]">
          A Magnus family project
        </Heading>
        <p className="bajada mt-gap-bajada max-w-[52ch]">{STORY_LEAD}</p>
      </div>

      {/* ── El piso de abajo ───────────────────────────────────────────── */}
      <motion.div
        style={{ y: downY }}
        className="relative h-[34vh] min-h-[220px] w-full overflow-hidden rounded-t-band lg:h-[42vh] lg:min-h-[320px]"
      >
        <Image
          src={YARD.src}
          alt={YARD.alt}
          fill
          sizes="100vw"
          className="object-cover object-[center_55%]"
        />
      </motion.div>
    </section>
  );
}
