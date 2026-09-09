'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Heading } from './Type';

/**
 * Lista fijada que se va contando sola con el scroll.
 *
 * Es la dinámica de agencefoudre.com: las dos columnas se pegan con
 * `position: sticky`, la sección de atrás mide varias pantallas, y a medida
 * que bajás se va abriendo un ítem por vez. En vez de tres bloques que ya
 * están todos ahí, el sitio te los va contando de a uno.
 *
 * Lo medido en la referencia, para dejar constancia de qué se tomó y qué no:
 *
 *   · sección `relative` de 3600px con la ventana en 900px → 4 pantallas de
 *     recorrido para 3 ítems
 *   · las DOS columnas en `sticky; top: 0`
 *   · el ítem activo abre su bloque con `min-height` y
 *     `cubic-bezier(.23, 1, .32, 1)` a 0.8s
 *   · el título activo pasa al color de marca; los demás quedan apagados
 *
 * Lo que NO se tomó:
 *
 *   · **El recorrido es más corto.** Cuatro pantallas para tres ítems se
 *     siente a secuestro de scroll. Acá cada ítem vale ~55vh.
 *   · **Las etiquetas no van en naranja lleno.** La referencia pone texto
 *     blanco sobre su rosa de marca. Sunset Orange es un tono medio: blanco
 *     encima da 2.54:1. Las etiquetas van neutras y el naranja queda para el
 *     número activo y el riel, que son marcas, no texto.
 *   · **Se suma un riel de progreso.** Si la promesa es «te lo voy contando»,
 *     tiene que verse cuánto falta.
 *
 * ⚠️ PROGRESIÓN, no dependencia. El estado por defecto —sin JS, antes de
 * hidratar, en móvil, o con `prefers-reduced-motion`— es la lista COMPLETA y
 * abierta, en flujo normal. El plegado y el pineado se activan después. Al
 * revés (arrancar plegado y abrir con JS) dos tercios del contenido quedarían
 * invisibles para un crawler y para cualquiera con el JS caído.
 *
 * ⚠️ Por eso mismo el alto de varias pantallas se aplica INLINE y sólo cuando
 * `enhanced`. Si fuera una clase, sin JS quedaría un socavón vacío de 265vh.
 *
 * ⚠️ Nada enfocable dentro del bloque que se pliega. El plegado es
 * `overflow: hidden`, y un enlace ahí adentro recibiría foco en una zona que
 * no se ve. Si algún día hace falta un enlace por ítem, va FUERA del bloque.
 *
 * ⚠️ El texto plegado sigue en el árbol de accesibilidad a propósito: es el
 * contenido real, no adorno. Con lector de pantalla se leen los tres ítems
 * enteros, que es justamente lo que corresponde.
 */

export interface PinnedItem {
  readonly n: string;
  readonly title: string;
  readonly body: string;
  readonly tags: readonly string[];
}

/** Cuánto scroll vale cada ítem, en unidades de viewport. */
const VH_PER_ITEM = 55;

export default function PinnedList({
  items,
  head,
  className = '',
}: {
  readonly items: readonly PinnedItem[];
  /** Columna izquierda: el encabezado de la sección. */
  readonly head: ReactNode;
  readonly className?: string;
}) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [enhanced, setEnhanced] = useState(false);
  const [active, setActive] = useState(0);

  /* El pineado se activa sólo en escritorio y sólo si no piden menos
     movimiento. En móvil las dos columnas no entran, y pegar una lista al
     viewport en una pantalla chica es peor que dejarla scrollear. */
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1024px)');
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setEnhanced(wide.matches && !calm.matches);
    sync();
    wide.addEventListener('change', sync);
    calm.addEventListener('change', sync);
    return () => {
      wide.removeEventListener('change', sync);
      calm.removeEventListener('change', sync);
    };
  }, []);

  useEffect(() => {
    if (!enhanced) {
      setActive(0);
      return;
    }
    const el = sectionRef.current;
    if (!el) return;

    let frame = 0;
    let ticking = false;
    let last = -1;

    const measure = () => {
      ticking = false;
      const rect = el.getBoundingClientRect();
      const runway = rect.height - window.innerHeight;
      if (runway <= 0) return;
      const p = Math.min(1, Math.max(0, -rect.top / runway));
      const idx = Math.min(items.length - 1, Math.floor(p * items.length));
      if (idx !== last) {
        last = idx;
        setActive(idx);
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [enhanced, items.length]);

  const fill = enhanced ? ((active + 1) / items.length) * 100 : 100;

  return (
    <div
      ref={sectionRef}
      /* Marca para `scripts/reduced-motion.mjs`. Esta sección es la única que
         cambia de alto a propósito según la preferencia de movimiento, y el
         guard necesita saberlo para verificar lo correcto en vez de comparar
         alturas que TIENEN que diferir. */
      data-pinned={enhanced ? 'on' : 'off'}
      className={`relative ${className}`}
      style={enhanced ? { height: `calc(100vh + ${items.length * VH_PER_ITEM}vh)` } : undefined}
    >
      <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center">
        <div className="grid w-full gap-[48px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-[80px]">
          <div>{head}</div>

          <ol className="relative pl-[26px]">
            {/* Riel de progreso. Decorativo: el número de cada ítem ya dice
                dónde estás, así que anunciarlo sería repetir. */}
            {/* ⚠️ 1px y no 2px. A 2px el riel competía con los filetes de los
                pasos y el bloque se leía como una tabla. Camila pidió «más
                sutil, más actual y de identidad sofisticado», y en una lista
                fijada lo que tiene que llevar el ojo es el título activo, no el
                riel. */}
            <span
              aria-hidden="true"
              className="absolute top-[6px] bottom-[6px] left-0 w-px rounded-pill bg-fog"
            >
              <span
                className="block w-full rounded-pill bg-terra/70 transition-[height] duration-500 ease-brand"
                style={{ height: `${fill}%` }}
              />
            </span>

            {items.map((item, i) => {
              const open = !enhanced || i === active;
              return (
                <li key={item.n} className={i === 0 ? '' : 'mt-[36px] border-t border-fog pt-[36px]'}>
                  <div className="flex items-start gap-[16px]">
                    {/* ⚠️ El número es TEXTO en `terra`, no una píldora rellena.
                        Era una píldora naranja porque Sunset Orange como texto
                        sobre blanco da 2.54:1 y no llega ni al 3:1 — la píldora
                        resolvía el contraste invirtiendo. Pero tres píldoras
                        naranjas apiladas eran justo lo que hacía que el bloque
                        se leyera pesado.

                        `terra` sí puede ser texto sobre claro: 7.43:1 sobre
                        `paper`. Es además el acento que el sitio ya usa en
                        superficies claras, así que el módulo deja de tener su
                        propio color. */}
                    <span
                      aria-hidden="true"
                      className={[
                        'mt-[6px] shrink-0 font-display text-[15px] tabular-nums tracking-[0.08em]',
                        'transition-colors duration-300',
                        /* ⚠️ El apagado llega hasta `/65` y no más: a 15px el
                           mínimo es 4.5:1, y `/65` da 4.57. `/45` daba 2.61 y
                           axe lo marcó — y lo marca AUNQUE el span sea
                           `aria-hidden`, con razón: sigue siendo texto visible
                           para quien ve, aunque no lo lea un lector. */
                        open ? 'text-terra' : 'text-body/65',
                      ].join(' ')}
                    >
                      {item.n}
                    </span>
                    {/* ⚠️ El apagado del inactivo llega hasta `/50` y no más.
                        Es texto real, no adorno: a 28px en negrita el mínimo
                        es 3:1, y `/35` daba 2.43:1. */}
                    <Heading
                      level={3}
                      className={['transition-colors duration-300', open ? 'text-ink' : 'text-ink/50'].join(' ')}
                    >
                      {item.title}
                    </Heading>
                  </div>

                  {/* Plegado con grid 0fr→1fr: anima el alto sin medirlo a mano
                      y sin un `max-height` inventado, que siempre termina
                      recortando el texto en el ancho equivocado. */}
                  <div
                    data-pinned-body={open ? 'open' : 'closed'}
                    className="grid transition-[grid-template-rows] duration-500 ease-brand"
                    style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <p className="pt-[12px] text-[15px] leading-[1.65] text-body/75 lg:text-[16px]">
                        {item.body}
                      </p>
                      {/* ⚠️ Las etiquetas dejaron de ser CHIPS rellenos. Cuatro
                          píldoras grises por paso, doce en la sección, hacían
                          que el bloque pareciera un panel de filtros. Ahora son
                          texto separado por una viñeta: la misma información,
                          sin doce cajas.

                          Es el criterio de las referencias que fijó Camila —
                          wework y superside separan con filetes y aire, no con
                          tarjetas. */}
                      <ul className="mt-[16px] flex flex-wrap items-center gap-x-[10px] gap-y-[6px]">
                        {item.tags.map((tag, t) => (
                          <li key={tag} className="flex items-center gap-[10px]">
                            {t > 0 ? (
                              <span
                                aria-hidden="true"
                                className="h-[3px] w-[3px] rounded-pill bg-terra/50"
                              />
                            ) : null}
                            <span className="font-body text-[13px] font-medium tracking-[0.02em] text-body/75">
                              {tag}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
