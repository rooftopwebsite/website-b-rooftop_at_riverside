import { type Step } from '@/components/shared/StepStair';
import { HAPPY_HOUR } from '@/lib/brand';

/**
 * Los tres pasos del yard, como TICKETS.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ES LA QUINTA FORMA DE ESTE CONTENIDO, y conviene dejar la lista escrita
 * para que nadie vuelva a una que ya se descartó:
 *
 *   1. `PinnedList`   un paso abierto por vez, los otros plegados con scroll.
 *                     Se llevaba 2,3 pantallas para tres párrafos cortos.
 *   2. `StepStair`    la escalera en diagonal con el filete en L. Sigue en el
 *                     árbol (`shared/StepStair.tsx`) y sigue siendo buena;
 *                     salió porque el rediseño no tiene dónde poner una
 *                     diagonal de tres celdas sin romper la grilla de bandas.
 *   3. Tres cuadros de color (`cream` / `sunset` / `deep`), uno por hora del
 *                     día. La idea era buena y el presupuesto de superficie
 *                     estaba medido, pero con las bandas nuevas la home ya
 *                     tiene su relato de color y estos tres competían.
 *   4. La grilla de tarjetas planas, intermedia y sin carácter.
 *   5. Los tickets. Acá.
 *
 * ⚠️ POR QUÉ TICKETS, que es lo único que justifica el recurso. El contenido
 * de esta sección es literalmente «cómo se ordena y quién te cobra»: cuatro
 * mostradores, cuatro tickets, cuatro recibos. La forma dice lo mismo que el
 * texto. No es una tarjeta con el borde raro — si mañana el contenido deja de
 * ser sobre pagar en ventanillas, el troquel se va con él.
 *
 * ⚠️ Y ADEMÁS resuelve un problema real que las cuatro formas anteriores
 * tenían: el número de paso. En la escalera y en los cuadros el «01» era un
 * dígito grande arriba del título, o sea otro elemento tipográfico compitiendo
 * con el h3. Acá vive en la lengüeta, fuera de la tarjeta, y deja de competir.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ El contenido NO se toca: es el mismo `STEPS` que ya vivía en
 * `HomeSections.tsx`, con los mismos textos y las mismas etiquetas, todas
 * datos ya confirmados en otro lado del sitio. Lo único que se agrega es el
 * `kicker` —«The yard», «Sunset Bar», «What's on»—, que dice a qué unidad de
 * negocio pertenece cada paso. Es lo que le faltaba a las formas anteriores:
 * el paso 1 y el 2 los cobran personas distintas, y eso es justo lo que la
 * sección existe para explicar.
 *
 * ⚠️ Server component. No hay estado ni medición: los tres tickets están
 * abiertos desde el primer pintado.
 */

/** El `Step` del repo más el rótulo de unidad que agrega el rediseño. */
interface TicketStep extends Step {
  readonly kicker: string;
}

const STEPS: readonly TicketStep[] = [
  {
    n: '01',
    kicker: 'The yard',
    title: 'Order at whichever window you want',
    body: 'Four trucks park in the yard and each one is somebody’s own business. You order at the window, you pay that truck. Separate line, separate card, separate receipt.',
    tags: [
      'Four independent kitchens',
      'Order at the window',
      'A tab per truck',
      'No table service',
    ],
  },
  {
    n: '02',
    kicker: 'Sunset Bar',
    title: 'Get your drinks upstairs',
    body: 'The Sunset Bar on the roof is ours. Cocktails made that morning, drafts from breweries twenty minutes away. It’s the one tab we run, and the only menu on this site with prices.',
    tags: [
      'Cocktails made daily',
      'Local drafts',
      `Happy hour ${HAPPY_HOUR.days}, ${HAPPY_HOUR.time}`,
      'The one tab we run',
    ],
  },
  {
    n: '03',
    kicker: 'What’s on',
    title: 'Stay for whoever’s playing',
    body: 'Live music five nights a week, Bingo on Wednesdays, DJ sets late on Saturdays. Almost all of it is free and none of it needs a ticket.',
    tags: ['Live music five nights', 'Bingo Wednesdays', 'DJ sets Saturdays', 'No ticket, no cover'],
  },
];

export default function YardSteps() {
  return (
    <section id="yard" aria-label="How ordering works" className="bg-bone pt-6 pb-14 lg:pt-12 lg:pb-26">
      {/*
        ⚠️ Es una LISTA (`ol`) y no tres `article` sueltos, y con el rediseño
        pasa a importar más que antes: el orden es el contenido. Antes la
        escalera lo decía visualmente con la diagonal; tres tarjetas en fila
        no dicen nada de secuencia salvo por el número de la lengüeta, que es
        un dato visual. Un `ol` lo dice en la estructura, que es donde lo lee
        quien no ve la página.
      */}
      <ol className="caja-ancha grid list-none grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 p-0">
        {STEPS.map((step) => (
          <li
            key={step.n}
            /* La sombra va acá y no en la tarjeta. Ver la nota de `troquel`. */
            className="relative flex pt-9.5 [filter:drop-shadow(0_12px_26px_rgba(10,31,30,0.14))]"
          >
            <span className="lengueta absolute top-0 left-1/2 z-30 flex w-15.5 -translate-x-1/2 flex-col items-center gap-0.5 bg-cream pt-2.5 pb-4">
              <span className="font-body text-[8px] font-medium uppercase tracking-[0.18em] text-muted">
                Step
              </span>
              <span className="font-display text-d5 font-extrabold leading-none text-ink">
                {step.n}
              </span>
            </span>

            <div className="troquel relative flex flex-1 flex-col items-center gap-3.5 rounded-ticket bg-paper px-5.5 pt-12 pb-13 text-center lg:px-8 lg:pt-15 lg:pb-16">
              <span className="font-body text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                {step.kicker}
              </span>
              <h3 className="m-0 max-w-[16ch] font-display text-d4 font-bold uppercase leading-[0.98] text-ink lg:text-h3">
                {step.title}
              </h3>
              <p className="m-0 max-w-[34ch] font-body text-base font-light text-ink">{step.body}</p>

              <ul className="mt-auto flex list-none flex-wrap justify-center gap-1.5 p-0 pt-5">
                {step.tags.map((tag) => (
                  <li
                    key={tag}
                    /* ⚠️ Borde PUNTEADO, y en `teal600`. Es el único borde
                       punteado del sitio que no marca un dato faltante —eso
                       lo hace `PhotoPending`—, así que se distingue por el
                       color: los huecos van en `fog`, estas etiquetas en el
                       teal de marca. */
                    className="rounded-pill border border-dashed border-teal600 px-3 py-1.25 font-body text-caption text-ink"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
