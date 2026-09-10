'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from '@/components/shared/Icon';
import { PhotoPending } from '@/components/shared/PendingData';
import { activeTrucks } from '@/content/trucks';
import {
  type VenueEvent,
  type Weekday,
  recurringEvents,
  weekdayLabel,
  whenLabel,
} from '@/content/events';
import { HAPPY_HOUR } from '@/lib/brand';

/**
 * «What's on» — la primera banda oscura de la home.
 *
 * Un carrusel de los eventos recurrentes, con el de HOY marcado, y debajo el
 * bloque de los camiones que están en el yard.
 *
 * ⚠️ Es la FUSIÓN de dos secciones que se pisaban, y eso no cambia con el
 * rediseño. Camila: «no entiendo la diferencia entre la sección Esta noche en
 * el Yard y Esta semana, ¿no debería ser toda una?». `TonightAtTheYard` y
 * `ThisWeek` leían la misma lista de recurrentes y la mostraban dos veces. Lo
 * que se conserva de la fusión es la inmediatez: la card de hoy va primera y
 * con el tag «Tonight».
 *
 * ⚠️ Client component, y no por gusto: necesita saber qué día es en Bonita
 * Springs. El servidor no puede — una página cacheada mostraría el jueves un
 * martes. El servidor pinta la semana completa, que ya es útil, y al montar se
 * reordena poniendo hoy adelante. Sin esto hay mismatch de hidratación y, peor,
 * se publica un dato que puede estar mal.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ PASÓ DE TRACK CON STAGGER A CARRUSEL CON CONTROLES — rediseño
 * `food-truck-club`. Es la cuarta forma de esta sección (tres tarjetas con
 * sombra → grilla asimétrica → track que sangra → carrusel), así que conviene
 * dejar escrito qué la hace distinta y no repetir la vuelta.
 *
 * Lo que cambia no es la fila, que ya sangraba: son los CONTROLES. Antes la
 * fila se arrastraba y nada decía que hubiera más de cuatro tarjetas — en
 * desktop, con el mouse, un `overflow-x` sin barra visible es contenido
 * invisible. Ahora hay flechas y puntos, y los puntos además dicen CUÁNTAS
 * son, que es la mitad del trabajo.
 *
 * ⚠️ Las flechas NO son decoración duplicada del scroll: son el único acceso
 * por teclado que no depende de tabular tarjeta por tarjeta. El contenedor
 * scrollea igual con rueda, trackpad y touch.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ El TOPE de tarjetas se queda. Hoy `recurringEvents()` devuelve cuatro,
 * pero si el cliente carga diez la home no puede convertirse en un catálogo:
 * para eso está `/whats-on`, que es adonde va el CTA.
 */

/**
 * Cuántas tarjetas de evento entran en la home antes de mandar al calendario.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ HOY EL CARRUSEL MUESTRA CUATRO, Y NO ES UN LÍMITE DEL COMPONENTE: ES
 * QUE NO HAY MÁS. Conviene tenerlo escrito porque «faltan tarjetas» parece un
 * bug y no lo es.
 *
 * El dashboard devuelve exactamente cuatro recurrentes —Wooftop Wednesdays,
 * Bingo Night, Ross Brown y La Noche · DJ David Cast— y la auditoría del
 * sitio viejo (`docs/current-site-inventory.md` §9) ya dejó constancia de que
 * los otros que nombra el brief, «Sunset Saturdays» y «Jazz Wednesdays», NO
 * EXISTEN en los datos del calendario. Inventarlos para llenar el carrusel
 * sería publicar eventos que no pasan.
 *
 * La lista canónica de recurrentes es la pregunta abierta #8 del pedido al
 * cliente. El tope está en 8 para que el día que lleguen no haya que tocar
 * nada: se cargan en el dashboard, `npm run sync:events`, y aparecen.
 * ══════════════════════════════════════════════════════════════════════════
 */
const MAX_CARDS = 8;

/** El aire entre tarjetas, en px. Lo necesita el cálculo del scroll. */
const CARD_GAP = 24;

function venueWeekday(): Weekday {
  const label = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
  }).format(new Date());
  const map: Record<string, Weekday> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return map[label] ?? 0;
}

/** Lunes y martes el lugar está cerrado. Dato del brief, no inventado. */
const CLOSED_DAYS: readonly Weekday[] = [1, 2];

function EventCard({ event, isToday }: { readonly event: VenueEvent; readonly isToday: boolean }) {
  return (
    <article className="group flex w-65 shrink-0 snap-start flex-col overflow-hidden rounded-shell bg-deeper transition-transform duration-300 ease-brand hover:-translate-y-1.5 lg:w-[30vw] lg:max-w-100">
      <div className="relative h-50 bg-ink lg:h-[20vw] lg:max-h-70">
        {event.image === null ? (
          /* ⚠️ El brief va en INGLÉS. Es texto VISIBLE, no un comentario: el
             hueco se publica marcado a propósito para que no pase callado. El
             borde punteado es lo que distingue «acá va algo» de «esto falló». */
          <PhotoPending
            brief={`${event.title} at ${event.space}, at night, with people`}
            ratio=""
            tone="dark"
            className="h-full rounded-none border-0 border-dashed"
          />
        ) : (
          <Image
            src={event.image}
            alt={event.imageAlt ?? ''}
            fill
            sizes="(min-width: 1024px) 400px, 260px"
            className="object-cover transition-transform duration-500 ease-brand group-hover:scale-104"
          />
        )}

        {isToday ? (
          <span className="absolute top-4 left-4 z-10 rounded-pill bg-sunset px-3.5 py-2 font-body text-caption font-medium uppercase tracking-eyebrow text-ink">
            Tonight
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 px-6 pt-5.5 pb-6.5">
        <span className="font-body text-caption font-medium uppercase tracking-eyebrow text-muted-dark">
          {event.weekday !== null ? weekdayLabel(event.weekday) : whenLabel(event)}
        </span>
        <h3 className="m-0 font-display text-d4 font-bold uppercase leading-none text-paper">
          {event.title}
        </h3>
        <p className="m-0 font-body text-base font-light text-paper/92">{event.summary}</p>
        <span className="mt-auto pt-3.5 font-body text-micro uppercase tracking-cta text-muted-dark">
          {event.space}
        </span>
      </div>
    </article>
  );
}

/**
 * La última tarjeta del carrusel: el CTA al calendario completo.
 *
 * ⚠️ ES UNA TARJETA Y NO UN BOTÓN AL COSTADO, y ese es el punto. Un carrusel
 * que se termina en seco no dice qué hay después; uno que termina en una
 * tarjeta del mismo tamaño que las otras convierte el final del recorrido en
 * el destino. Quien llegó scrolleando hasta el final es exactamente quien
 * quiere ver más — y se lo encuentra sin volver arriba a buscar el botón.
 *
 * ⚠️ VA EN `sunset` Y NO EN `deeper` COMO LAS OTRAS. Es la única tarjeta que
 * no es un evento, así que no puede parecerse a las que sí lo son: si fuera
 * del mismo color, el ojo la cuenta como un quinto evento y recién al leerla
 * descubre que no. El naranja la separa de un vistazo.
 *
 * ⚠️ Texto NEGRO sobre el naranja. 8.26:1. Blanco daría 2.54:1 y está
 * prohibido en todo el sitio — es el error que más veces estuvo a punto de
 * colarse.
 */
function CalendarCard() {
  return (
    <Link
      href="/whats-on"
      className="group flex w-65 shrink-0 snap-start flex-col justify-between gap-8 rounded-shell bg-sunset p-7 text-ink transition-colors duration-300 ease-brand hover:bg-sunset-hover lg:w-[30vw] lg:max-w-100 lg:p-9"
    >
      {/*
        ⚠️ `text-ink` OPACO y no `text-ink/70`. La primera versión bajaba la
        opacidad para que el rótulo pesara menos que el titular, y axe lo
        midió en 4.01:1 contra el 4.5:1 que pide un texto de 12px: sobre un
        campo de color, una opacidad no aclara el texto, lo MEZCLA con el
        naranja — el resultado (#513E1F) es un marrón que no está en la
        paleta y que nadie eligió.

        La jerarquía la hace el tamaño y la caja alta, que para eso está el
        eyebrow. Es la misma razón por la que existe el token `muted`.
      */}
      <span className="font-body text-caption font-medium uppercase tracking-eyebrow text-ink">
        Every week
      </span>

      <span>
        <span className="block font-display text-d2 font-extrabold uppercase leading-[0.9]">
          See the whole calendar
        </span>
        <span className="mt-4 block max-w-[26ch] font-body text-base font-light">
          Live music five nights a week, Bingo on Wednesdays and DJ sets late on Saturdays. Almost
          all of it is free.
        </span>
      </span>

      <span className="grid size-13 place-items-center rounded-pill bg-ink text-sunset transition-transform duration-300 ease-brand group-hover:translate-x-1.5">
        <ArrowRight className="size-5" />
      </span>
    </Link>
  );
}

export default function WhatsOn() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [today, setToday] = useState<Weekday | null>(null);
  const [index, setIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => setToday(venueWeekday()), []);

  const week = recurringEvents();

  /*
   * El orden: hoy primero, después el resto en su orden natural. Antes de
   * montar `today` es `null` y la lista sale sin reordenar — que es la semana
   * completa, información correcta y útil por sí sola.
   */
  const events = (
    today === null
      ? week
      : [...week.filter((e) => e.weekday === today), ...week.filter((e) => e.weekday !== today)]
  ).slice(0, MAX_CARDS);

  const isClosedToday = today !== null && CLOSED_DAYS.includes(today);

  /* Un punto por diapositiva, y la última es la tarjeta del calendario. El
     texto va al `sr-only` del botón: «ir a la tarjeta 3» no dice nada, el
     título del evento sí. */
  const slides = [...events.map((e) => e.title), 'See the whole calendar'];

  /*
   * ⚠️ EL PASO SE MIDE, no se guarda. El ancho de tarjeta es
   * `clamp(260px,30vw,400px)`, así que cambia con el viewport y con el zoom
   * del navegador. Leerlo del DOM en cada uso es más barato que mantener un
   * estado sincronizado con un `resize`.
   */
  const step = () => {
    const card = trackRef.current?.firstElementChild;
    return card ? card.getBoundingClientRect().width + CARD_GAP : 320;
  };

  const scrollByCard = useCallback((dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * step(), behavior: 'smooth' });
  }, []);

  const scrollToCard = useCallback((i: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * step(), behavior: 'smooth' });
  }, []);

  /*
   * ⚠️ `canPrev`/`canNext` salen de la POSICIÓN DEL SCROLL y no del índice.
   * Con `justify-center-safe`, cuando las tarjetas entran enteras no hay
   * scroll posible y el índice se queda en 0 para siempre: si las flechas
   * dependieran del índice, «siguiente» quedaría habilitada apuntando a una
   * tarjeta que ya está a la vista. Midiendo el scroll, las dos se apagan
   * solas cuando no hay nada que correr.
   *
   * El margen de 1px absorbe el redondeo sub-píxel de los DPR fraccionales
   * (1.25 y 1.5 de Windows): sin él, `scrollLeft` llega a 811.5 contra un
   * máximo de 812 y la flecha nunca se apaga.
   */
  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setIndex(Math.round(el.scrollLeft / step()));
    setCanPrev(el.scrollLeft > 1);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  /* Al montar y en cada resize hay que recalcular: el ancho de tarjeta es
     fluido, así que un carrusel que desbordaba a 1440 puede entrar a 1920. */
  useEffect(() => {
    onScroll();
    window.addEventListener('resize', onScroll, { passive: true });
    return () => window.removeEventListener('resize', onScroll);
  }, [onScroll]);

  /*
   * ══════════════════════════════════════════════════════════════════════
   * ⚠️ VUELTA AL PRINCIPIO CUANDO CAMBIA EL ORDEN, y sin esto el carrusel
   * abre mostrando la SEGUNDA tarjeta. Medido: `scrollLeft: 424` —un ancho
   * de tarjeta más el gap— apenas termina de hidratar.
   *
   * La causa es la combinación de dos cosas que por separado están bien. El
   * servidor pinta los eventos en su orden natural; al montar, `today` deja
   * de ser `null` y la lista se REORDENA para poner el de hoy adelante. Ese
   * reordenamiento cambia los hijos de un contenedor con `snap-mandatory`, y
   * ahí el navegador está obligado a re-anclar: recalcula, y aterriza en el
   * punto de anclaje más cercano a donde estaba el contenido que antes tenía
   * enfrente, que ya no es el primero.
   *
   * Es un efecto y no un `key` en el contenedor a propósito: remontar el
   * track entero para corregir el scroll tiraría también el foco de quien
   * esté tabulando por las tarjetas.
   *
   * Corre en el montaje (`today === null`) y otra vez cuando se resuelve, o
   * sea dos veces y nunca más. No pelea con el visitante: para cuando
   * alguien puede llegar a scrollear, ya pasó.
   * ══════════════════════════════════════════════════════════════════════
   */
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollLeft = 0;
    onScroll();
  }, [today, onScroll]);

  /*
   * ⚠️ El titular cambia con el estado del lugar y no es un detalle de copy.
   * Un lunes, «This week in the yard» encabezando cuatro tarjetas de eventos
   * hace que alguien salga de casa. El lugar está cerrado lunes y martes.
   */
  const headline = isClosedToday
    ? { a: 'Closed today,', b: 'back Wednesday' }
    : { a: 'This week', b: 'in the yard' };

  const trucks = activeTrucks();

  return (
    <section
      id="whats-on"
      aria-labelledby="whats-on-title"
      className="relative z-[2] rounded-t-band bg-deep pt-14 pb-14 text-bone on-dark lg:pt-[110px] lg:pb-24"
    >
      <div className="caja-ancha">
        <h2
          id="whats-on-title"
          className="mx-auto max-w-[16ch] text-center font-display text-banda font-extrabold uppercase"
        >
          <span className="block text-paper">{headline.a}</span>
          <span className="block text-sunset">{headline.b}</span>
        </h2>

        <div className="mt-6.5 flex justify-center lg:mt-10">
          <Link
            href="/whats-on"
            className="group flex min-h-11 items-center gap-2.5 rounded-pill bg-sunset px-8 py-4 font-body text-dato font-medium text-ink transition-all duration-300 ease-brand hover:bg-sunset-hover active:scale-95"
          >
            Full calendar
            <ArrowRight className="size-4 transition-transform duration-300 ease-brand group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* ── El carrusel ──────────────────────────────────────────────────
          ══════════════════════════════════════════════════════════════════
          ⚠️ VA CENTRADO, y antes sangraba por la derecha. El diseño lo
          componía con el padding izquierdo alineado a la página y el derecho
          mucho más grande (`clamp(16px,10vw,190px)`) para dejar ver que había
          más tarjetas. Se veía descolgado: con cuatro tarjetas la fila
          arrancaba pegada al borde izquierdo y dejaba 190px de aire a la
          derecha, o sea el bloque entero corrido respecto del titular
          centrado que tiene arriba y de los controles centrados que tiene
          abajo. Pedido de Camila.

          ⚠️ `justify-center-safe` y NO `justify-center` a secas. En un
          contenedor que scrollea, el centrado normal recorta el principio del
          contenido cuando desborda: los primeros píxeles quedan del lado
          negativo del scroll y no hay forma de llegar a ellos, ni con las
          flechas ni arrastrando. El modificador `safe` centra sólo mientras
          entre y vuelve a alinear al inicio cuando desborda, que es
          exactamente lo que hace falta acá — con cuatro tarjetas desborda en
          desktop y con una sola no.
          ══════════════════════════════════════════════════════════════════ */}
      <div className="mt-8 lg:mt-15">
        {/*
          ⚠️ `tabIndex={0}` + `role="group"` + label, y los tres son
          obligatorios. axe lo marcó como `scrollable-region-focusable`: un
          contenedor que scrollea y no recibe foco es contenido que alguien
          navegando con teclado no puede alcanzar — las flechas del teclado
          no mueven un `overflow-x` que no está enfocado, y tabular entra a
          las tarjetas pero no scrollea el track.

          Con foco, las flechas ← → del teclado scrollean el carrusel, que es
          el comportamiento nativo y no hace falta escribirlo.
        */}
        <div
          ref={trackRef}
          onScroll={onScroll}
          tabIndex={0}
          role="group"
          aria-label="This week’s events"
          /*
            ⚠️ `scroll-px-borde` ES OBLIGATORIO Y NO ES COSMÉTICO. Sin él, el
            carrusel arrancaba mostrando la SEGUNDA tarjeta: medido, el track
            se montaba con `scrollLeft: 480` en vez de 0.

            El motivo es la pelea entre el padding y el snap. Las tarjetas son
            `snap-start`, y un punto de anclaje «start» alinea el borde de la
            tarjeta con el borde del CONTENEDOR, no con su caja de contenido.
            Con 56px de `padding-left`, la primera tarjeta empieza en 56 — o
            sea que `scrollLeft: 0` NO era un punto de anclaje válido, y con
            `snap-mandatory` el navegador está obligado a saltar al más
            cercano que sí lo sea.

            `scroll-padding-left` le dice al snap dónde está el borde útil.
            Con los dos en 56, el anclaje de la primera tarjeta pasa a ser
            `scrollLeft: 0` y el carrusel abre donde tiene que abrir.
          */
          className="flex snap-x snap-mandatory justify-center-safe gap-6 overflow-x-auto scroll-px-borde px-borde py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {events.map((event) => (
            <EventCard key={event.slug} event={event} isToday={today !== null && event.weekday === today} />
          ))}

          {/* La última: el CTA al calendario. Ver `CalendarCard`. */}
          <CalendarCard />
        </div>

        <div className="caja-ancha flex items-center justify-center gap-5 pt-6.5">
          {/*
            ⚠️ Las flechas se DESHABILITAN en los extremos en vez de quedar
            activas sin hacer nada. Un control que responde al hover, se
            aprieta y no pasa nada se lee como que el carrusel está roto;
            apagado se lee como que no hay más. `disabled` además lo saca del
            recorrido del tabulador y lo anuncia como no disponible.
          */}
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            className="grid size-13 place-items-center rounded-pill text-bone ring-1 ring-muted-dark transition-all duration-300 ease-brand hover:bg-bone hover:text-deep active:scale-95 disabled:pointer-events-none disabled:opacity-30"
          >
            <span className="sr-only">Previous events</span>
            <ArrowLeft />
          </button>

          {/*
            ⚠️ LOS PUNTOS AHORA SON BOTONES Y NO ADORNO. Estaban como `span`
            con `aria-hidden`, razonando que «dicen cuántas tarjetas hay y eso
            ya lo tiene quien tabula». Era verdad a medias: decían en cuál
            estás, que es información que nadie más da, y encima parecen
            clickeables — un punto relleno al lado de puntos vacíos, debajo de
            un carrusel, es un control en cualquier sitio del mundo. Que no
            respondiera era el bug.
          */}
          <div className="flex gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide}
                type="button"
                onClick={() => scrollToCard(i)}
                aria-current={i === index ? 'true' : undefined}
                className="group grid size-6 place-items-center rounded-pill"
              >
                <span className="sr-only">{slide}</span>
                <span
                  className={[
                    'block size-2.25 rounded-pill transition-all duration-300 ease-brand',
                    'group-hover:scale-140',
                    i === index ? 'bg-sunset' : 'bg-muted-dark/40 group-hover:bg-muted-dark',
                  ].join(' ')}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            className="grid size-13 place-items-center rounded-pill text-bone ring-1 ring-muted-dark transition-all duration-300 ease-brand hover:bg-bone hover:text-deep active:scale-95 disabled:pointer-events-none disabled:opacity-30"
          >
            <span className="sr-only">Next events</span>
            <ArrowRight />
          </button>
        </div>
      </div>

      {/* ── Los camiones que están hoy ───────────────────────────────── */}
      <div
        id="trucks"
        className="caja-ancha mt-12 border-t border-muted-dark/35 pt-7 pb-14 lg:mt-22 lg:pt-11 lg:pb-28"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-5">
          <span className="font-body text-caption font-medium uppercase tracking-eyebrow text-muted-dark">
            In the yard
          </span>
          <Link
            href="/food-trucks"
            className="group flex items-center gap-2 font-body text-base text-cream transition-colors duration-200 hover:text-paper"
          >
            All {trucks.length === 4 ? 'four' : trucks.length} trucks
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/*
          ⚠️ Los nombres salen de `activeTrucks()` y NO están escritos acá. En
          el prototipo eran cuatro props de texto (`truckOne`… `truckFour`)
          porque un mockup no tiene de dónde leerlos. El roster ROTA: es el
          dato del sitio que más cambia, y transcribirlo a un componente es
          garantizar que en dos meses la home nombre un camión que ya no está.
        */}
        <p className="mt-4.5 max-w-[62ch] font-body text-lead font-light text-paper">
          {trucks.map((t) => t.name).join(' · ')}. The roster rotates, and each truck takes its own
          orders and its own payment.
        </p>
        <p className="mt-3.5 font-body text-base text-cream lg:text-dato">
          <strong className="font-semibold">Happy hour</strong> {HAPPY_HOUR.days},{' '}
          {HAPPY_HOUR.time} — {HAPPY_HOUR.deals.join(' · ')}
        </p>
      </div>
    </section>
  );
}
