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
 *   · LAS COLUMNAS VAN 1.15 : 1 desde `lg`. Con 1 : 1.9 el titular tenía un
 *     tercio del ancho y se partía en renglones de una palabra.
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
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-20">
          <Heading level={2} id={id} className="text-balance text-d4 md:text-d3 lg:text-d2">
            {title}
            <span className="text-sunset-deep">{accent}</span>
          </Heading>
          <div>{children}</div>
        </div>
      </Reveal>
    </Section>
  );
}
