'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from '@/components/shared/Icon';
import { RevealItem, StaggerGroup } from '@/components/shared/Motion';
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
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ DEJÓ DE SER SERVER COMPONENT, y conviene saber qué se pagó por qué.
 *
 * Era server y la nota de acá decía «no hay estado ni medición». Ahora hay las
 * dos cosas: en mobile y tablet los tickets son un CARRUSEL, que necesita
 * medir el scroll y saber cuántas tarjetas entran. Pedido de Camila: «esto en
 * tablet quiero que sea carrusel para que tenga el tamaño de la card normal».
 *
 * El problema que resuelve: apilados a una columna, en una tablet de 834px el
 * ticket medía 767px de ancho para un párrafo de 34 caracteres. No es que
 * quedara feo, es que dejaba de ser una tarjeta. Y dos columnas no son opción
 * —está argumentado más abajo: tres elementos en una grilla de dos siempre
 * dejan una huérfana—.
 *
 * Lo que NO cambia: en `lg` entran las tres, así que `maxIndex` es 0, los
 * controles no se renderizan y la fila se ve exactamente como la grilla de
 * tres columnas de antes. El desktop no se enteró.
 *
 * ⚠️ ES LA SEGUNDA COPIA DE ESTA MECÁNICA. La otra está en `WhatsOn`, y las
 * dos son iguales: ancho de tarjeta como fracción del contenedor, un punto por
 * POSICIÓN y controles que no existen si entra todo. Se dejan duplicadas por
 * la regla que ya está escrita en `NewsletterSignup` sobre `INPUT_BASE`: dos
 * copias que hoy comparten forma pero viven en contextos distintos no
 * justifican una abstracción. SI APARECE UNA TERCERA, hay que subir esto a
 * `shared/` en el mismo commit.
 * ══════════════════════════════════════════════════════════════════════════
 */

/**
 * El ancho de ticket, como fracción del contenedor. Espeja `VISIBLES`: si acá
 * entran tres y allá dice dos, los puntos cuentan mal. Es el mismo sistema que
 * usa el carrusel de `WhatsOn`, con el mismo `gap-6` (24px).
 */
const ANCHO = 'w-full md:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)]';

/** Cuántos tickets entran por vista en cada breakpoint. Espeja `ANCHO`. */
const VISIBLES = [
  { mq: '(min-width: 1024px)', n: 3 },
  { mq: '(min-width: 768px)', n: 2 },
] as const;

/** El gap del track, en px. Lo necesita la medición del paso. */
const GAP = 24;

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
  /*
   * ⚠️ EL REF VA EN UN ENVOLTORIO Y NO EN EL TRACK. El track es un
   * `StaggerGroup`, que no reenvía `ref` —su firma sólo acepta `as`,
   * `className`, `id`, `style`, `tabIndex` y `aria-label`—, así que el nodo se
   * toma del envoltorio. Es el único hijo, de ahí el `firstElementChild`.
   *
   * La alternativa era agregarle `ref` a `StaggerGroup`, que lo usan otras
   * doce secciones: tocar un componente compartido para un caso es más caro
   * que estas dos líneas.
   */
  const cajaRef = useRef<HTMLDivElement | null>(null);
  const track = () => (cajaRef.current?.firstElementChild as HTMLElement | null) ?? null;

  const [visibles, setVisibles] = useState(1);
  const [index, setIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  /* Arranca en 1 por el mismo motivo que en `WhatsOn`: el servidor no sabe el
     ancho de la pantalla, y de esto dependen los puntos. */
  useEffect(() => {
    const mqs = VISIBLES.map((v) => ({ ...v, m: window.matchMedia(v.mq) }));
    const aplicar = () => setVisibles(mqs.find((v) => v.m.matches)?.n ?? 1);
    aplicar();
    mqs.forEach((v) => v.m.addEventListener('change', aplicar));
    return () => mqs.forEach((v) => v.m.removeEventListener('change', aplicar));
  }, []);

  const maxIndex = Math.max(0, STEPS.length - visibles);
  const maxIndexRef = useRef(0);
  maxIndexRef.current = maxIndex;

  const paso = () => {
    const t = track();
    const card = t?.firstElementChild;
    return card ? card.getBoundingClientRect().width + GAP : 320;
  };

  const medir = useCallback(() => {
    const t = track();
    if (!t) return;
    setIndex(Math.min(maxIndexRef.current, Math.round(t.scrollLeft / paso())));
    setCanPrev(t.scrollLeft > 1);
    setCanNext(t.scrollLeft < t.scrollWidth - t.clientWidth - 1);
  }, []);

  /*
   * ⚠️ EL LISTENER DE SCROLL SE ATA A MANO. No se puede poner `onScroll` en el
   * `StaggerGroup` —no acepta esa prop— ni en el envoltorio, porque el evento
   * `scroll` no burbujea. Se ata al nodo del track, que es el que scrollea.
   */
  useEffect(() => {
    const t = track();
    if (!t) return;
    medir();
    t.addEventListener('scroll', medir, { passive: true });
    window.addEventListener('resize', medir, { passive: true });
    return () => {
      t.removeEventListener('scroll', medir);
      window.removeEventListener('resize', medir);
    };
  }, [medir]);

  /* Al cambiar de breakpoint el paso cambia, así que hay que re-medir: si no,
     los puntos se quedan marcando una posición que ya no existe. */
  useEffect(() => medir(), [visibles, medir]);

  const irA = (i: number) => {
    const t = track();
    if (!t) return;
    t.scrollTo({ left: Math.max(0, Math.min(maxIndex, i)) * paso(), behavior: 'smooth' });
  };

  const correr = (dir: 1 | -1) => {
    const t = track();
    if (!t) return;
    t.scrollBy({ left: dir * paso(), behavior: 'smooth' });
  };

  return (
    <section
      id="yard"
      aria-label="How ordering works"
      /*
        ⚠️ EL `pt-bloque` ES EL PAR DE «Five businesses, one set of stairs.» —
        el bloque de arriba, que cierra con `pb` cero justamente para esto.

        Son dos `<section>` en el DOM porque son dos ideas —el malentendido y
        cómo se ordena— pero comparten el hueso y esta no tiene titular
        visible, así que en pantalla los tres tickets se leen como el
        contenido de aquel encabezado. El espacio que los une tiene que ser el
        mismo que separa cualquier otro encabezado de su grilla, y no la suma
        de dos bandas: eran 72 + 48 = 120px, o sea el doble del par de «Three
        of them», cinco secciones más abajo.

        ⚠️ El `pt` llega hasta la LENGÜETA y no hasta la tarjeta: el número va
        `absolute top-0` sobre el `<li>`, y los 38px de `pt-9.5` del `<li>`
        son el hueco que le deja debajo. El borde de arriba del bloque es la
        lengüeta, no el troquel.
      */
      /*
    Lleva `grano` como todas las superficies planas del sitio — la utilidad
    está documentada en globals.css. Las secciones que pasan por `<Section>` lo
    reciben solas; ésta está escrita a mano, así que lo escribe a mano.
      */
      className="grano relative bg-bone pt-bloque pb-cierre"
    >
      {/*
        ⚠️ Es una LISTA (`ol`) y no tres `article` sueltos, y con el rediseño
        pasa a importar más que antes: el orden es el contenido. Antes la
        escalera lo decía visualmente con la diagonal; tres tarjetas en fila
        no dicen nada de secuencia salvo por el número de la lengüeta, que es
        un dato visual. Un `ol` lo dice en la estructura, que es donde lo lee
        quien no ve la página.
      */}
      {/*
        ⚠️ ENTRAN EN CASCADA Y NO LAS TRES JUNTAS, y acá el escalonado dice
        algo: los tickets son PASOS numerados, así que aparecer 01, 02, 03 en
        ese orden repite con el movimiento lo que dice el contenido. Es el
        único lugar de la home donde el stagger no es decoración.

        `StaggerGroup` + `RevealItem` ya resuelven `prefers-reduced-motion`:
        con movimiento reducido renderizan la etiqueta pelada, sin `motion`.
      */}
      {/*
        ══════════════════════════════════════════════════════════════════
        ⚠️ 1 COLUMNA Y DESPUÉS 3, SIN PASAR POR 2. Vale para las cuatro
        grillas de tres de la home y es la convención de la casa —casa-pirul
        usa `grid-cols-1 md:grid-cols-3` en el mismo caso—.

        El motivo: con `auto-fit minmax(300px,1fr)`, a 768px entraban DOS
        columnas y la tercera tarjeta caía sola en la fila de abajo, a media
        página de ancho. Tres elementos en una grilla de dos siempre dejan
        una huérfana, y una huérfana se lee como que falta contenido.

        ⚠️ ACÁ EL SALTO ES EN `lg` Y NO EN `md` COMO EN LAS OTRAS TRES. Los
        tickets son la tarjeta más cargada de la home: rótulo, título de dos
        renglones, párrafo de 34ch y cuatro etiquetas en píldora. A 768px
        tres columnas dan 209px cada una, y ahí «Happy hour Wednesday –
        Friday, 3–6 PM» ocupa cuatro renglones él solo. Apiladas a ancho
        completo se leen; en tres columnas de 209 no.
        ══════════════════════════════════════════════════════════════════
      */}
      {/*
        ⚠️ EL ENVOLTORIO EXISTE PARA EL REF, Y NADA MÁS. Ver la nota de
        `cajaRef` arriba: el `StaggerGroup` no reenvía `ref`, así que el nodo
        del track se toma de acá.

        ⚠️ LA `caja-ancha` SE MUDÓ AL TRACK, Y ES EL ARREGLO DE LA SOMBRA.
        Vivía acá, en el envoltorio, con esta nota al lado: «el padding tiene
        que quedar FUERA del contenedor que scrollea, porque si no el primer
        punto de anclaje deja de ser `scrollLeft: 0` y `snap-mandatory` abre el
        carrusel en la segunda tarjeta».

        El diagnóstico era cierto, pero el remedio dejaba la sombra afuera: con
        el padding en el envoltorio, el borde del `ol` —que es el que recorta—
        cae EXACTAMENTE sobre el borde de la primera y de la última tarjeta, y
        los 26px de sombra de los costados se los come. En pantalla se veía
        como un rectángulo gris cortado a pico alrededor de los tres tickets.

        Con `scroll-px-borde` el padding puede volver adentro: ese scroll
        padding corre el snapport los mismos píxeles que el padding, así que el
        primer anclaje vuelve a ser `scrollLeft: 0`. Es la pareja que el track
        ya tenía antes y que se había ido junto con el padding.

        La cuenta del carrusel no se mueve: el ancho de CONTENIDO del `ol` es
        el mismo que tenía el envoltorio, así que `ANCHO` sigue dando lo mismo
        y `paso()` también. Lo único que cambia de tamaño es la caja que
        RECORTA.
      */}
      <div ref={cajaRef}>
        <StaggerGroup
          as="ol"
          tabIndex={0}
          aria-label="How ordering works, step by step"
          /*
            ⚠️ LOS PADDINGS SON LA SOMBRA, NO SON AIRE. El `<li>` proyecta su
            sombra con `filter: drop-shadow` —tiene que ser drop-shadow y no
            box-shadow, ver la nota del troquel—, y declarar `overflow-x: auto`
            computa el `overflow-y` a `auto` también: este track recorta arriba
            y abajo aunque nadie haya pedido scroll vertical.

            La sombra —ver la nota de la clase del `<li>`— sube 8px (16 de
            blur menos 8 de desplazamiento) y baja 24. De ahí `pt-2` y `pb-7`,
            con un par de píxeles de sobra abajo. Los números salen medidos por
            `npm run check:sombras`, no a ojo: con `pt-1.5` el guard marcaba
            que faltaban 2px arriba.

            ⚠️ A LOS COSTADOS LOS PONE `caja-ancha`, y el track los tiene
            ADENTRO —no en el envoltorio— con `scroll-px-borde` al lado para
            que el snap no se corra. Acá sí conviene, al revés que en
            `WhatsOn`: en `lg` entran los tres tickets y el track NO scrollea,
            así que no hay tarjeta siguiente que pueda asomar por el hueco. Lo
            único que entra en esos 56px es la sombra.
          */
          className="caja-ancha scroll-px-borde flex snap-x snap-mandatory list-none gap-6 overflow-x-auto pt-2 pb-7 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
        {STEPS.map((step) => (
          <RevealItem
            key={step.n}
            as="li"
            /*
              La sombra va acá y no en la tarjeta. Ver la nota de `troquel`.

              ══════════════════════════════════════════════════════════════
              ⚠️ SON DOS SOMBRAS CHICAS Y NO UNA GRANDE, y el motivo es que una
              sola grande dejaba de leerse como sombra.

              Era `drop-shadow(0 12px 26px rgba(10,31,30,0.14))`: 26px de blur
              se extienden 26px A CADA LADO, y el gap entre tickets es de 24.
              O sea que la sombra de cada tarjeta llegaba MÁS LEJOS que su
              vecina: las tres se fundían en una sola mancha gris continua y el
              bloque entero se leía como un rectángulo de fondo distinto detrás
              de las tarjetas. Camila: «no le pongas content frame».

              ⚠️ Medido con perfil de píxeles, no a ojo: la luminancia bajaba
              de 246 a 230 a lo largo de 52px a cada lado, sin un solo salto
              duro. No estaba recortada — era así de grande.

              Ahora son dos capas, que es como está armada `--shadow-card` para
              el resto del sitio:

                  0 1px 2px  / 0.10   el contacto, que apoya la tarjeta
                  0 8px 16px / 0.16   la caída, que le da altura

              El alcance lateral queda en 16px contra los 24 del gap, así que
              entre dos tickets vuelve a haber fondo limpio y cada tarjeta
              tiene su propia sombra.

              ⚠️ `drop-shadow` NO TIENE SPREAD, que es como `--shadow-card` se
              contiene (`-12px`). Acá el único control es el blur, y por eso
              hay dos capas en vez de una: la de contacto da el filo que el
              spread negativo daría, y la de caída da la altura.
              ══════════════════════════════════════════════════════════════
            */
            className={`relative flex shrink-0 snap-start pt-9.5 [filter:drop-shadow(0_1px_2px_rgba(10,31,30,0.10))_drop-shadow(0_8px_16px_rgba(10,31,30,0.16))] ${ANCHO}`}
          >
            <span className="lengueta absolute top-0 left-1/2 z-30 flex w-15.5 -translate-x-1/2 flex-col items-center gap-0.5 bg-cream pt-2.5 pb-4">
              <span className="font-body text-[8px] font-medium uppercase tracking-[0.18em] text-muted">
                Step
              </span>
              <span className="font-display text-d5 font-extrabold leading-none text-ink">
                {step.n}
              </span>
            </span>

            {/*
              ⚠️ EL HOVER VA EN ESTE `div` Y NO EN EL `<li>` DE AFUERA, aunque
              ahí quedaría mejor con la sombra. El `<li>` es un `RevealItem`,
              o sea un elemento de `motion` que escribe `transform` INLINE
              para su entrada: una clase `hover:-translate-y` de Tailwind
              pierde contra el estilo inline y no hace nada. Vale para todas
              las tarjetas de la home que entran con reveal.
            */}
            <div className="troquel relative flex flex-1 flex-col items-center gap-3.5 rounded-ticket bg-paper px-5.5 pt-12 pb-13 text-center transition-transform duration-300 ease-brand hover:-translate-y-1.5 lg:px-8 lg:pt-15 lg:pb-16">
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
                    /*
                      ══════════════════════════════════════════════════════
                      ⚠️ SON ETIQUETAS Y TIENEN QUE PARECERLO. Eran píldoras
                      con borde punteado en `teal600`, y Camila las leyó como
                      lo que parecían: «los tags/chips de cards five business
                      parecen botones, ctas, y no deberían; parecen ctas
                      desactivados».

                      Tenía razón y el motivo es acumulativo. Traían las TRES
                      señales de control del sistema a la vez —píldora (que en
                      este sitio significa «esto se toca», ver `Button.tsx`),
                      contorno cerrado, y texto en `ink` al mismo peso que el
                      cuerpo—; y encima el punteado, que en cualquier interfaz
                      lee como «inactivo». Cuatro de esas debajo de un párrafo
                      son cuatro botones apagados.

                      Ahora no hay ninguna de las tres:

                        · `rounded-btn` (10px) y no píldora — el radio de la
                          familia, no el del control.
                        · fondo tenue en vez de contorno. Un tag es una mancha
                          de color con texto, no una caja con filo.
                        · `text-muted` y no `ink`: es metadato, va por debajo
                          del párrafo que acompaña.
                        · un punto de color al principio, que es el gesto que
                          termina de decir «tag» y que ningún botón del sitio
                          tiene.

                      ⚠️ EL FONDO ES `bone` Y NO UN TINTE DEL TEAL. `bone` es
                      el color de la sección: el chip se lee como un recorte de
                      la página apoyado sobre la tarjeta blanca, y no suma un
                      color nuevo. Medido, `muted` sobre `bone` da 4.91:1, que
                      pasa AA para el cuerpo de 13px.

                      ⚠️ EL PUNTO VA EN `river`, que es el teal brillante y es
                      `aria-hidden`. `river` tiene prohibido ser texto —2.50:1—
                      pero acá no es texto: es un cuadrado de 4px decorativo, y
                      el dato lo dice la palabra de al lado.
                      ══════════════════════════════════════════════════════
                    */
                    className="inline-flex items-center gap-1.75 rounded-btn bg-bone px-2.5 py-1.25 font-body text-caption font-medium text-muted"
                  >
                    <span aria-hidden="true" className="size-1 shrink-0 rounded-pill bg-river" />
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </RevealItem>
        ))}
        </StaggerGroup>
      </div>

      {/*
        ⚠️ LOS CONTROLES NO EXISTEN SI ENTRAN LOS TRES TICKETS. En `lg` entran
        las tres tarjetas, `maxIndex` da 0 y acá no se renderiza nada: el
        desktop queda igual que con la grilla de tres columnas que había antes.
        Es la misma regla que en `WhatsOn`, y el mismo motivo — un punto solo,
        relleno, debajo de una fila que no scrollea no informa nada.
      */}
      {maxIndex > 0 ? (
        <div className="caja-ancha flex items-center justify-center gap-5 pt-2">
          {/*
            ══════════════════════════════════════════════════════════════
            ⚠️ LAS FLECHAS VAN RELLENAS Y NO DE FILO. Iban `ring-ink/25` sobre
            el hueso y eso da 1.70:1 medido — WCAG 1.4.11 pide 3:1 para el
            borde de un control, así que no era una impresión: el control
            estaba por debajo del mínimo y se perdía. Camila lo marcó.

            Rellenas en `deep` la silueta da 10.03:1 contra el hueso y la
            flecha de adentro 9.44:1 sobre el relleno.

            ⚠️ NO ES UN INVENTO PARA ESTA SECCIÓN: es exactamente el círculo
            que ya usan los links de redes de `FindUs`, que viven sobre el
            mismo hueso —`bg-deep text-cream`, hover a naranja—. Un control
            redondo sobre superficie clara ya tenía forma en el sitio.

            ⚠️ EL `ring-deep` NO ES REDUNDANTE con el relleno: sostiene el
            borde en el HOVER. Al pasar a `bg-sunset`, el naranja contra el
            hueso da 2.35:1 y la silueta se desdibujaría justo cuando el
            control está activo; con el anillo en `deep` el contorno se queda
            en 10:1 en los dos estados. El texto de adentro tampoco sufre:
            `ink` sobre `sunset` da 6.73:1.

            Las flechas de `WhatsOn` no cambian: viven sobre `deep`, donde
            `ring-muted-dark` sí pasa.
            ══════════════════════════════════════════════════════════════
          */}
          <button
            type="button"
            onClick={() => correr(-1)}
            disabled={!canPrev}
            className="grid size-13 place-items-center rounded-pill bg-deep text-cream ring-1 ring-deep transition-all duration-300 ease-brand hover:bg-sunset hover:text-ink active:scale-95 disabled:pointer-events-none disabled:opacity-30"
          >
            <span className="sr-only">Previous step</span>
            <ArrowLeft />
          </button>

          <div className="flex gap-2">
            {STEPS.slice(0, maxIndex + 1).map((step, i) => (
              <button
                key={step.n}
                type="button"
                onClick={() => irA(i)}
                aria-current={i === index ? 'true' : undefined}
                /* El área táctil mide 44 y el punto 9, igual que en `WhatsOn`:
                   se agranda el blanco, no el dibujo. */
                className="group -mx-1 grid size-11 place-items-center rounded-pill"
              >
                <span className="sr-only">{step.title}</span>
                <span
                  className={[
                    'block size-2.25 rounded-pill transition-all duration-300 ease-brand',
                    'group-hover:scale-140',
                    /* ⚠️ El punto apagado sube de `ink/25` a `ink/45`: al 25%
                       daba 1.70:1 sobre el hueso, el mismo número que tenía el
                       anillo de las flechas, y por el mismo motivo se perdía.
                       Al 45% da 2.84:1 — sigue siendo un indicador de bajo
                       énfasis, que es lo que tiene que ser, pero ahora se ve.
                       El activo se queda en `sunset`, igual que en `WhatsOn`. */
                    i === index ? 'bg-sunset' : 'bg-ink/45 group-hover:bg-ink/75',
                  ].join(' ')}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => correr(1)}
            disabled={!canNext}
            className="grid size-13 place-items-center rounded-pill bg-deep text-cream ring-1 ring-deep transition-all duration-300 ease-brand hover:bg-sunset hover:text-ink active:scale-95 disabled:pointer-events-none disabled:opacity-30"
          >
            <span className="sr-only">Next step</span>
            <ArrowRight />
          </button>
        </div>
      ) : null}
    </section>
  );
}
