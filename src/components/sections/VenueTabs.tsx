'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useId, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from '@/components/shared/Icon';
import { PhotoPending } from '@/components/shared/PendingData';
import Section from '@/components/shared/Section';
import { SectionHead } from '@/components/shared/Type';
import { VENUE_AREAS } from '@/content/venue-areas';

/**
 * «Two floors, five places to be», como ACORDEÓN DE IMÁGENES.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ES LA ESTRUCTURA QUE PASÓ CAMILA, 2026-09-22, con un componente de
 * referencia armado: cinco paneles de foto en una fila, el elegido se estira y
 * los otros quedan como franjas angostas, con flechas de paso y el texto de lo
 * elegido debajo. «Esto así no me gusta, creo que podríamos hacerlo así.»
 *
 * Lo que se toma de la referencia, que es la mecánica entera:
 *
 *   · una fila de paneles con `flex-grow` distinto según el estado, y la
 *     transición en `flex-grow` para que el que abre EMPUJE a los otros;
 *   · el hover agranda un poco el panel que se está por elegir;
 *   · flechas de anterior y siguiente, y flechas del teclado;
 *   · debajo, el texto de la pieza elegida y el link para ir a verla.
 *
 * ⚠️ LO QUE NO SE TOMA ES LA PIEL. La referencia venía con sus propias
 * variables —`--rx-*`, Phosphor icons, radios de 6/10/14, una barra de puntos
 * de 4px—. Acá va el vocabulario del sitio: `bone` de fondo, `rounded-ticket`
 * en los paneles —el mismo radio que el hueco de foto de `EventTypes`—, el
 * velo `ink` de `PhotoDivider`, los chips del molde `TAG`, las flechas
 * redondas de los carruseles de la home y la display en caja alta.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ NO HAY RÓTULO SOBRE EL PANEL ABIERTO, y estuvo puesto. Era una plancha
 * verde apoyada abajo a la izquierda con el piso y el nombre del lugar, calcada
 * de la referencia. Camila la tachó, 2026-09-22: «estás repitiendo info, sólo
 * dejá el título de abajo». Tiene razón y es literal: el nombre estaba dos
 * veces en la misma pantalla, a 60px de distancia, una vez sobre la foto y otra
 * como `<h3>` justo debajo. La foto abierta queda limpia.
 *
 * ⚠️ TAMPOCO HAY BARRA DE PISO NI CONTADOR «01 / 05». Los dos también salieron
 * tachados en el mismo pase. Eran la barra de rótulo que tenía el panel de la
 * versión de pestañas, mudada arriba del acordeón, y con el acordeón a la vista
 * no informaban nada que no se viera: cuál está abierto lo dice el panel que
 * mide seis veces más que los otros, y cuántos hay se cuentan.
 *
 * ⚠️ EL PISO NO SE PIERDE: pasa a ser el EYEBROW del bloque de texto de abajo,
 * arriba del nombre. Es el único dato de los tres que no se lee solo mirando la
 * fila —una foto no dice en qué piso fue sacada— y es el dato que le da sentido
 * al titular de la sección, que habla de dos pisos. Ahí además queda en la
 * pareja que el sitio usa en todos lados: rótulo chico arriba, título abajo.
 *
 * ⚠️ LAS FLECHAS SUBIERON A LA LÍNEA DE LA BAJADA, pedido del mismo pase con la
 * flecha dibujada hacia arriba. Al irse la barra quedaban sueltas sobre el
 * acordeón; alineadas al pie del encabezado, la fila entera —rótulo, titular,
 * bajada y los dos controles— cierra con un solo filete y el acordeón arranca
 * enseguida.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ ACÁ HABÍA UNA LISTA DE PESTAÑAS CON PANEL FIJO, y se fue. Era la
 * estructura que Camila misma había pasado el 2026-09-16 —lista a la izquierda
 * con filete y barra de acento, panel sticky con la foto a la derecha— y
 * funcionaba, pero tenía un problema que sólo se ve en pantalla: la foto era la
 * mitad chica de la sección y las otras cuatro no existían hasta que las
 * clickeabas. Un lugar que se vende por cómo se ve necesita que las cinco fotos
 * estén a la vista.
 *
 * Lo que la lista hacía bien y ACÁ SE CONSERVA: que el resto quede ATENUADO
 * —era un cambio de color de texto, ahora es el velo sobre las fotos cerradas—,
 * una sola descripción a la vez y nunca las cinco apiladas, y el link del área
 * activa más «Rent any of it», que es fijo.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ EN CELULAR EL ACORDEÓN ES VERTICAL Y NO HORIZONTAL, y no es un detalle de
 * gusto. A 390px, cinco paneles en fila dejan al abierto en 210px y a los otros
 * cuatro en 38: cuatro tiras de foto de 38px no se leen como nada. Apilado,
 * cada panel cerrado es una franja de ~54px de alto y ancho completo, así que
 * ahí sí entra el NOMBRE al lado del número, que es exactamente lo que hacía la
 * lista de pestañas vieja. La misma mecánica, la forma que entra.
 *
 * ⚠️ EL ALTO DE LA CAJA ESCALA EN CINCO PASOS y no en dos. Es la regla de la
 * casa para todo valor responsive, y acá hace falta de verdad porque el alto
 * cambia de significado en el medio: hasta `md` es la suma de cinco franjas
 * apiladas, y de `md` para arriba es el alto de una foto apaisada.
 *
 *     base   460px   vertical, el panel abierto queda en ~268
 *     sm     540px   vertical con más aire
 *     md     300px   pasa a horizontal, apaisado
 *     lg     380px
 *     desk   440px
 *
 * ⚠️ ROLES ARIA DE VERDAD: `tablist` / `tab` / `tabpanel`. Los cinco paneles son
 * las pestañas y el bloque de texto de abajo es el panel. Sin eso, un lector de
 * pantalla anuncia cinco botones sueltos y un párrafo que cambia solo.
 *
 * ⚠️ CADA BOTÓN SE NOMBRA CON `aria-label` Y LA FOTO VA CON `alt=""`. Adentro
 * del botón, la foto es decoración: lo que hay que anunciar es «Sunset Bar,
 * Second floor», no la descripción de la imagen. El `photoAlt` sigue en
 * `venue-areas.ts` para quien use esas fotos en otro lado.
 *
 * ⚠️ ES CLIENT COMPONENT, y es el único de esta página. Necesita estado para
 * saber qué panel está abierto y cuál tiene el mouse encima. Nada más viaja al
 * bundle: el contenido sale de `VENUE_AREAS`, que es un módulo estático.
 */

const TOTAL = VENUE_AREAS.length;

const cifra = (n: number) => String(n).padStart(2, '0');

/**
 * Los tres pesos del acordeón. Salen de la referencia y el par que importa es
 * el primero: 5,6 contra 1 deja al panel abierto en el 58 % de la fila, que es
 * lo que lo vuelve una foto y no una franja más ancha.
 *
 * ⚠️ EL HOVER ES 1,35 Y EN LA REFERENCIA ERA 1,1. Con 1,1 el panel crece 13px
 * sobre 130: a ojo no pasa nada y el cursor no recibe respuesta. 1,35 son 45px
 * y se lee como «este se abre si hago clic», que es para lo que está.
 *
 * ⚠️ EL HOVER NO SE APLICA AL QUE YA ESTÁ ABIERTO. Multiplicarle 1,35 a 5,6 lo
 * empuja al 66 % y los otros cuatro se achican de golpe al pasar el mouse por
 * el panel que ya estás mirando, que es movimiento sin motivo.
 */
/* Como CLASES enteras y no un `flexGrow` en `style`: Tailwind sólo emite lo
   que lee literal. El `transition` del botón anima el cambio igual. */
const PESO = { abierto: 'grow-[5.6]', encima: 'grow-[1.35]', cerrado: 'grow' } as const;

/** Las dos flechas de paso. Son las de los carruseles de la home, un tamaño
 *  más chicas: 52px es el tamaño de un control que vive solo en el medio de una
 *  banda, y éstas viven al pie de un encabezado. 44 es además el piso de área
 *  táctil, así que no bajan de ahí. */
const FLECHA =
  'grid size-11 cursor-pointer place-items-center rounded-pill bg-deep text-cream ring-1 ring-deep transition-all duration-300 ease-brand hover:bg-sunset hover:text-ink active:scale-95';

export default function VenueTabs({ id = 'place-title' }: { readonly id?: string }) {
  const [activo, setActivo] = useState(0);
  const [encima, setEncima] = useState<number | null>(null);
  /* El carrusel de mobile: qué tarjeta está a la vista, para los puntos. */
  const [vista, setVista] = useState(0);
  const tira = useRef<HTMLUListElement | null>(null);
  const alScroll = () => {
    const t = tira.current;
    const card = t?.firstElementChild as HTMLElement | null;
    if (!t || !card) return;
    const paso = card.getBoundingClientRect().width + 16;
    setVista(Math.min(TOTAL - 1, Math.round(t.scrollLeft / paso)));
  };
  const irA = (i: number) => {
    const t = tira.current;
    const card = t?.firstElementChild as HTMLElement | null;
    if (!t || !card) return;
    t.scrollTo({ left: i * (card.getBoundingClientRect().width + 16), behavior: 'smooth' });
  };
  const base = useId();
  const area = VENUE_AREAS[activo]!;

  const tabId = (i: number) => `${base}-tab-${i}`;
  const panelId = `${base}-panel`;

  /** Mueve la selección y le lleva el foco, que es lo que pide el patrón. */
  const mover = (paso: number) => {
    const siguiente = (activo + paso + TOTAL) % TOTAL;
    setActivo(siguiente);
    document.getElementById(tabId(siguiente))?.focus();
  };

  /*
   * ⚠️ VA EN `bone` Y NO EN `paper`. No es un cambio de gusto: en `/our-story`
   * el relato, esta sección y las dos ventanillas eran tres bandas claras
   * seguidas, y sin alternancia de fondo una página larga se lee como un
   * documento. `bone` contra `paper` mide 1.08:1, o sea que el corte se ve sin
   * meter un campo de color. Es la nota del tono en `Section`.
   *
   * ⚠️ EL TONO VA ESCRITO ACÁ Y NO SE RECIBE POR PROP, a propósito:
   * `npm run check:surfaces` sólo expande los componentes que la página usa
   * SIN props (`<VenueTabs />`). Con un `tone=` en el call site, la sección se
   * volvería invisible para el guard, que es justo el «verde por omisión»
   * contra el que ese archivo advierte.
   */
  return (
    <Section tone="bone" band="lg" labelledBy={id}>
      {/*
        El encabezado y los dos controles en la misma fila, cerrados por un solo
        filete. `items-end` es lo que apoya las flechas en el último renglón de
        la bajada, que es donde Camila las dibujó.
      */}
      <div className="flex flex-col gap-6 border-b border-fog pb-7 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <SectionHead
          eyebrow="The place"
          eyebrowTone="plum"
          id={id}
          title={
            <>
              Two floors, <span className="text-sunset-deep">five places</span> to be
            </>
          }
          lead="One property, built in layers. The bar went on the roof because that is where the sunset is, and everything else grew underneath it."
        />

        {/*
          ⚠️ NO SE APAGAN EN LAS PUNTAS: el recorrido es circular, del último
          vuelve al primero. Con cinco paneles a la vista no hay un «final» que
          avisar, y una flecha apagada en una fila que se ve entera confunde más
          de lo que informa.
        */}
        <div className="flex shrink-0 gap-2 max-md:hidden">
          <button type="button" onClick={() => mover(-1)} className={FLECHA}>
            <span className="sr-only">Previous place</span>
            <ArrowLeft className="size-4" />
          </button>
          <button type="button" onClick={() => mover(1)} className={FLECHA}>
            <span className="sr-only">Next place</span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>

      {/*
        ══════════════════════════════════════════════════════════════════
        ── EN MOBILE: UN CARRUSEL COMÚN, desde el 2026-09-23.

        Camila: «en mobile esto debería ser un carrusel común, no así,
        carrusel horizontal». El acordeón apilado dejaba un panel abierto y
        cuatro franjas de 52px con el nombre, y la descripción suelta abajo:
        se leía como una lista rota. Acá cada lugar es una tarjeta entera
        —foto, placa con piso y nombre, y su texto debajo— y la siguiente
        asoma 20px, con los puntos abajo. Es la misma regla que los
        carruseles de la home. Desde `md` sigue el acordeón.

        ⚠️ ES MARCADO DUPLICADO Y NO EL MISMO CON OTRAS CLASES: el acordeón es
        un `tablist` con un solo panel, y un carrusel son cinco artículos con
        su texto cada uno. El que no se ve va con `hidden` y el árbol de
        accesibilidad no lo lee.
        ══════════════════════════════════════════════════════════════════
      */}
      <div className="mt-6 md:hidden">
        <ul
          ref={tira}
          onScroll={alScroll}
          className="-mx-gutter flex snap-x snap-mandatory list-none gap-4 overflow-x-auto px-gutter pb-1 scroll-px-gutter [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {VENUE_AREAS.map((a) => (
            <li key={a.slug} className="w-[calc(100%-20px)] shrink-0 snap-start">
              <div className="relative aspect-[4/5] overflow-hidden rounded-ticket bg-fog">
                {a.photo ? (
                  <Image src={a.photo} alt={a.photoAlt ?? ''} fill sizes="90vw" className="object-cover" />
                ) : (
                  <PhotoPending brief={a.photoBrief} ratio="" className="absolute inset-0 h-full rounded-none border-0" />
                )}
                <span className="absolute bottom-3 left-3 flex max-w-[calc(100%-1.5rem)] flex-col gap-1 rounded-btn bg-bone px-3.5 py-2.5">
                  <span className="font-body text-caption font-bold uppercase tracking-eyebrow text-deep">{a.floor}</span>
                  <span className="font-display text-d6 font-bold uppercase leading-none text-deep">{a.name}</span>
                </span>
              </div>
              <p className="bajada m-0 mt-4 font-body text-base font-light">{a.body}</p>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex justify-center gap-2">
          {VENUE_AREAS.map((a, i) => (
            <button
              key={a.slug}
              type="button"
              onClick={() => irA(i)}
              aria-current={i === vista ? 'true' : undefined}
              className="grid size-11 place-items-center"
            >
              <span className="sr-only">{a.name}</span>
              <span
                aria-hidden="true"
                className={`size-2.5 rounded-pill transition-colors ${i === vista ? 'bg-sunset-deep' : 'bg-deep/30'}`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* ── El acordeón, desde `md` ─────────────────────────────────── */}
      <div
        role="tablist"
        aria-label="Places in the building"
        onMouseLeave={() => setEncima(null)}
        className="mt-6 hidden md:flex md:h-[300px] md:flex-row md:gap-2 lg:h-[380px] lg:gap-3 desk:h-[440px]"
      >
        {VENUE_AREAS.map((a, i) => {
          const abierta = i === activo;
          const peso = abierta ? PESO.abierto : encima === i ? PESO.encima : PESO.cerrado;

          return (
            <button
              key={a.slug}
              type="button"
              role="tab"
              id={tabId(i)}
              aria-selected={abierta}
              aria-controls={panelId}
              /* Sólo la pestaña abierta entra en el orden de tabulación; entre
                 ellas se navega con las flechas, que es lo que el patrón pide. */
              tabIndex={abierta ? 0 : -1}
              aria-label={`${a.name}, ${a.floor}`}
              onMouseEnter={() => setEncima(i)}
              onClick={() => setActivo(i)}
              onKeyDown={(e) => {
                /* Las cuatro flechas, y no dos: la fila es horizontal en
                   desktop y vertical en celular, así que las dos parejas
                   tienen que hacer lo mismo. */
                const paso =
                  e.key === 'ArrowRight' || e.key === 'ArrowDown'
                    ? 1
                    : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
                      ? -1
                      : 0;
                if (paso === 0) return;
                e.preventDefault();
                mover(paso);
              }}
              /*
                ⚠️ `basis-0` MÁS `flexGrow` ES LO QUE HACE EL ACORDEÓN. Con
                `basis-auto` el ancho de partida sería el del contenido —una
                foto `fill` no tiene— y el reparto dejaría de ser proporcional.

                ⚠️ LOS MÍNIMOS SON DISTINTOS POR EJE: apilado, un panel cerrado
                no puede bajar de 52px de ALTO o el chip con el nombre no entra;
                en fila, no puede bajar de 44px de ANCHO, que es el piso de área
                táctil. Cada mínimo vale en su orientación y no en la otra.

                ⚠️ LA TRANSICIÓN VA SÓLO EN `flex-grow`. Poniéndola en `all`
                también anima el color del velo y la sombra del foco, y el
                anillo de foco tiene que aparecer al instante.
              */
              className={`group relative min-h-[52px] shrink basis-0 cursor-pointer overflow-hidden rounded-ticket border-0 bg-fog p-0 transition-[flex-grow] duration-300 ease-brand md:min-h-0 md:min-w-[44px] ${peso}`}
            >
              {a.photo ? (
                <Image
                  src={a.photo}
                  alt=""
                  fill
                  /* El panel abierto se lleva el 58 % de la fila; los cerrados
                     son franjas. Un solo `sizes` para los dos estados pediría
                     siempre la grande, así que se declara el caso ancho. */
                  sizes="(min-width: 768px) 60vw, 92vw"
                  className="object-cover"
                />
              ) : null}

              {/*
                ⚠️ EL HUECO DE FOTO SÓLO SE DIBUJA EN EL PANEL ABIERTO. El
                marcador de `PhotoPending` lleva rótulo y brief en español
                adentro de un filete punteado: en una franja de 44px de ancho se
                recorta y queda un rectángulo con letras cortadas, que se lee
                como un error y no como un pendiente. Cerrado queda el `bg-fog`
                del panel, y el pendiente aparece entero al abrirlo.
                TODO: confirmar con cliente la foto del patio de arriba.
              */}
              {!a.photo && abierta ? (
                <PhotoPending
                  brief={a.photoBrief}
                  ratio=""
                  className="absolute inset-0 h-full rounded-none border-0"
                />
              ) : null}

              {/*
                ⚠️ EL VELO ES LO QUE ATENÚA LO QUE NO ESTÁ ABIERTO, y es el
                trabajo que en la versión de pestañas hacía el color del texto.
                Es `ink` y no negro, que es el mismo velo de `PhotoDivider`: cae
                al verde casi negro del resto de la página en vez de a un gris.

                ⚠️ 50 % Y NO 60 % como allá. En `PhotoDivider` el velo tiene que
                dejar leer texto blanco encima de una hoja con mucho contraste;
                acá encima sólo va un chip con su propio fondo, y lo único que
                el velo tiene que hacer es mandar la foto un paso atrás.

                ⚠️ EN HOVER BAJA A 25 %, o sea que la foto ASOMA antes de que la
                elijas. Es la otra mitad de la respuesta al cursor: el panel
                crece y además se aclara.

                ⚠️ NO SE DIBUJA SOBRE EL PANEL SIN FOTO. Ahí abajo no hay
                imagen: hay `bg-fog`, que es el color de hueco de foto del
                sitio. Velado quedaba un verde oliva sucio que no es ningún
                token, y encima mentía: parecía una foto oscura en vez del lugar
                vacío que es.
              */}
              {a.photo ? (
                <span
                  aria-hidden="true"
                  className={[
                    'pointer-events-none absolute inset-0 transition-colors duration-300 ease-brand',
                    abierta ? 'bg-transparent' : 'bg-ink/50 group-hover:bg-ink/25',
                  ].join(' ')}
                />
              ) : null}

              {/*
                ⚠️ EL CHIP ES EL MOLDE DE LOS TAGS: radio de familia, fondo
                `bone` y texto `deep`, o sea 10.03:1 medido y no «depende de la
                foto». Y va SÓLO EN LOS CERRADOS: sobre el abierto sería el
                rótulo que Camila tachó.

                ⚠️ LLEVA EL NOMBRE HASTA `md`, DONDE SE VA. Apilado hay 358px de
                ancho y el nombre entra entero, que es lo que convierte a la
                franja en el renglón de una lista. En fila el panel mide 130px y
                no entra ni «The Yard»: queda el número. El nombre no se pierde
                para quien no ve la pantalla: está en el `aria-label`.
              */}
              {abierta ? (
                /*
                  ══════════════════════════════════════════════════════════
                  ⚠️ LA PLACA DEL PANEL ABIERTO ENTRÓ EL 2026-09-22 y es la
                  mitad de lo que acortó la sección. Camila: «necesitamos hacer
                  más corta esta sección, así que el nombre del lugar pisará la
                  imagen, sacaremos los CTA y la descripción irá pegada a la
                  imagen».

                  Antes el nombre y el piso vivían debajo del acordeón, en el
                  bloque de texto: rótulo, h3 y párrafo, o sea tres alturas
                  apiladas bajo una imagen que ya medía 440px. Con el nombre
                  encima de la foto, abajo queda una sola línea de texto.

                  ⚠️ VA SOBRE UN PLATO SÓLIDO Y NO SUELTO SOBRE LA FOTO. Es la
                  regla de contraste del repo —nada de texto claro directo sobre
                  una imagen— y además el panel abierto NO lleva velo, así que
                  no hay nada que garantice qué hay detrás. El plato es bone con
                  tinta deep: 10.03:1 medido, sin depender de la foto.

                  ⚠️ ES EL MISMO MOLDE QUE EL CHIP DE LOS CERRADOS, un escalón
                  más grande: mismo fondo, misma tinta, mismo radio. Los dos son
                  el mismo objeto en dos estados, no dos piezas.

                  ⚠️ ACÁ SÍ VA EL PISO Y EN LOS CERRADOS NO. Es el dato que la
                  franja no tiene lugar para mostrar y el que contesta «¿esto
                  dónde queda?», que es la pregunta de la sección entera.
                  ══════════════════════════════════════════════════════════
                */
                <span className="pointer-events-none absolute bottom-3 left-3 flex max-w-[calc(100%-1.5rem)] flex-col gap-1 rounded-btn bg-bone px-3.5 py-2.5 lg:bottom-5 lg:left-5">
                  <span className="font-body text-caption font-bold uppercase tracking-eyebrow text-deep">
                    {a.floor}
                  </span>
                  <span className="truncate font-display text-d6 font-bold uppercase leading-none text-deep lg:text-d5">
                    {a.name}
                  </span>
                </span>
              ) : (
                <span className="absolute bottom-3 left-3 flex max-w-[calc(100%-1.5rem)] items-center gap-2 rounded-btn bg-bone px-2.5 py-1">
                  <span className="font-body text-caption font-bold tabular-nums tracking-eyebrow text-deep">
                    {cifra(i + 1)}
                  </span>
                  <span className="truncate font-display text-d7 font-bold uppercase leading-none text-deep md:hidden">
                    {a.name}
                  </span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/*
        ══════════════════════════════════════════════════════════════════
        ── EL PANEL: LA DESCRIPCIÓN DE LO QUE ESTÁ ABIERTO, Y NADA MÁS.

        ⚠️ SE FUERON EL RÓTULO, EL TITULAR Y LOS DOS LINKS el 2026-09-22.
        Camila: «necesitamos hacer más corta esta sección, así que el nombre del
        lugar pisará la imagen, sacaremos los CTA y la descripción irá pegada a
        la imagen».

        Qué era cada cosa y adónde fue:

          · el rótulo del piso y el `h3` con el nombre → la placa que ahora
            pisa la foto del panel abierto. No se perdió el dato; cambió de
            lugar y de paso dejó de haber una imagen enorme sin nada escrito.
          · «Go to <lugar>» → se fue. Dos de los cinco lugares no tenían página
            propia, así que el link aparecía y desaparecía según qué panel
            estuviera abierto: un control que existe a veces.
          · «Rent any of it» → se fue. Manda a `/events`, que está en el header
            de todas las páginas y en el CTA naranja de la barra.

        ⚠️ Y CON ELLOS SE FUE LA GRILLA DE DOS COLUMNAS: sin links a la derecha,
        lo que queda es un párrafo. `mt-5` en vez de `mt-8` es el «pegada a la
        imagen» del pedido.

        ⚠️ EL `role="tabpanel"` SE QUEDA Y ES OBLIGATORIO. Las pestañas de
        arriba lo apuntan con `aria-controls`, así que sin él el patrón ARIA
        queda a medias: cinco `role="tab"` controlando un panel que no declara
        serlo.

        ⚠️ EL NOMBRE DEL LUGAR YA NO ESTÁ EN EL PANEL, y eso importa para quien
        escucha: el panel se rotula con `aria-labelledby` contra la pestaña
        activa, que lleva `aria-label="<nombre>, <piso>"`. El dato sigue
        anunciándose al cambiar de panel.
        ══════════════════════════════════════════════════════════════════
      */}
      <div role="tabpanel" id={panelId} aria-labelledby={tabId(activo)} className="mt-5 max-md:hidden">
        {/*
          ⚠️ VA EN `text-base` Y NO EN `text-lead`, o sea UN ESCALÓN POR DEBAJO
          de la bajada del encabezado de la sección. Pedido de Camila,
          2026-09-22: «hagamos más chica la font de bajada, creo que debería ser
          más chica que la bajada del título principal de esta sección». Iban
          las dos en `text-lead` —17 a 22px— y dos bajadas del mismo cuerpo en
          la misma sección se leen como dos titulares de la misma jerarquía.

          ⚠️ EL COLOR SALE DE `bajada` Y NO DE UNA OPACIDAD. Es el token que lee
          `--lead-ink`, que está medido sobre las tres superficies (5.36:1 en
          `paper`, 4.96:1 en `bone`, 5.95:1 en `deep`); con `text-body/85` el
          contraste real cambiaba con el fondo de atrás y dejaba de poder
          auditarse.

          ⚠️ Y LOS CINCO TEXTOS SE ACORTARON A DOS RENGLONES, en el mismo
          pedido: «que el copy de cada uno no supere las dos líneas en desk». A
          62ch y en `text-base` eso son unos 140 caracteres, y los cinco entran.
          Lo que se recortó está anotado en `content/venue-areas.ts`.
        */}
        <p className="bajada m-0 max-w-[62ch] font-body text-base font-light">{area.body}</p>
      </div>
    </Section>
  );
}
