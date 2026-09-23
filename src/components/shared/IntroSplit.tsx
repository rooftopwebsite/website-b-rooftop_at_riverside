import type { ReactNode } from 'react';
import { Reveal } from '@/components/shared/Motion';
import Section from '@/components/shared/Section';
import { Heading } from '@/components/shared/Type';

/**
 * ══════════════════════════════════════════════════════════════════════════
 * LA PRIMERA SECCIÓN DESPUÉS DEL HERO: titular a la izquierda, texto a la
 * derecha.
 *
 * ⚠️ ES UN COMPONENTE DESDE EL 2026-09-23 porque estaba escrito dos veces —
 * «A rooftop built over a food truck park» en `/our-story` e «Inside the
 * truck» en `/game-truck`— y un arreglo en una no llegaba a la otra. Camila:
 * «acá aplica lo mismo que aplicamos en otra página; esto debería ser un
 * componente, así que debería haber cambiado acá al igual que en la otra».
 *
 * Lo que fija, para las dos:
 *
 *   · ARRIBA VA UN ESCALÓN MÁS CHICO (`bandTop="sm"`). «Reducí el espacio
 *     entre esta sección y el hero, que estén casi pegados, sólo que no se vea
 *     apenas entrás a la página.»
 *   · EL TITULAR LLENA SU COLUMNA, sin tope en `ch`, en `text-balance`, en el
 *     escalón 2 de titular de sección (36 / 46 / 58). Con `max-w-[9ch]` o
 *     `[12ch]` caía en cuatro renglones con media columna vacía al lado.
 *   · LLEVA UNA PARTE EN COLOR: `accent` es obligatorio. Ningún titular de
 *     la casa va monocromo.
 *   · EN DESKTOP LA COLUMNA DEL TITULAR MIDE LO QUE EL TITULAR (`auto`, con
 *     tope de 20ch) y el texto se queda con el resto, a 48px. Camila: «achicá
 *     el espacio, que no sea una división 50 % de la pantalla, que la bajada
 *     ocupe más para acercarse al título». Con dos fracciones fijas quedaba un
 *     hueco de 200px entre el titular y el texto.
 *   · EL AIRE ENTRE PÁRRAFOS ES MENOR QUE EL DEL TITULAR AL TEXTO, regla de todo
 *     el sitio: apilado el titular separa con `gap-y-7` (28px, ~23 visibles
 *     porque la interlínea 0.9 del display se come el resto), y
 *     los párrafos de `children` llevan `mt-3` (12px). Nunca `mt-8`.
 * ══════════════════════════════════════════════════════════════════════════
 */
export default function IntroSplit({
  id,
  title,
  accent,
  children,
}: {
  readonly id: string;
  /** La parte del titular en tinta. Termina en espacio si sigue `accent`. */
  readonly title: ReactNode;
  /** La parte en color. */
  readonly accent: ReactNode;
  /** El texto de la columna derecha: párrafos, CTA, lo que haga falta. */
  readonly children: ReactNode;
}) {
  return (
    <Section tone="bone" band="lg" bandTop="sm" labelledBy={id}>
      <Reveal>
        <div className="grid items-start gap-y-7 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-x-12">
          <Heading level={2} id={id} className="text-balance text-d4 md:text-d3 lg:max-w-[20ch] lg:text-d2">
            {title}
            <span className="text-sunset-deep">{accent}</span>
          </Heading>
          <div>{children}</div>
        </div>
      </Reveal>
    </Section>
  );
}
