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

/** Cuántas tarjetas entran en la home antes de mandar al calendario. */
const MAX_CARDS = 6;

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
    <article className="flex w-65 shrink-0 snap-start flex-col overflow-hidden rounded-shell bg-deeper lg:w-[30vw] lg:max-w-100">
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
            className="object-cover"
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

export default function WhatsOn() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [today, setToday] = useState<Weekday | null>(null);
  const [index, setIndex] = useState(0);

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

  const scrollByCard = useCallback((dir: 1 | -1) => {
    const el = trackRef.current;
    const card = el?.firstElementChild;
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + CARD_GAP), behavior: 'smooth' });
  }, []);

  const onScroll = useCallback(() => {
    const el = trackRef.current;
    const card = el?.firstElementChild;
    if (!el || !card) return;
    const step = card.getBoundingClientRect().width + CARD_GAP;
    setIndex(Math.round(el.scrollLeft / step));
  }, []);

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
            className="flex min-h-11 items-center gap-2.5 rounded-pill bg-sunset px-8 py-4 font-body text-dato font-medium text-ink transition-colors duration-200 hover:bg-sunset-hover"
          >
            Full calendar
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      {/* ── El carrusel ──────────────────────────────────────────────────
          ⚠️ NO va envuelto en `caja-ancha`: la fila tiene que poder irse por
          el borde derecho. El padding izquierdo la alinea con el resto de la
          página y el derecho, mucho más grande, deja ver que hay más. */}
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
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto py-2 pl-borde [scrollbar-width:none] pr-[clamp(16px,10vw,190px)] [&::-webkit-scrollbar]:hidden"
        >
          {events.map((event) => (
            <EventCard key={event.slug} event={event} isToday={today !== null && event.weekday === today} />
          ))}
        </div>

        <div className="caja-ancha flex items-center justify-center gap-5 pt-6.5">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            className="grid size-13 place-items-center rounded-pill text-bone ring-1 ring-muted-dark transition-colors duration-200 hover:bg-bone hover:text-deep"
          >
            <span className="sr-only">Previous events</span>
            <ArrowLeft />
          </button>

          {/* Los puntos son DECORATIVOS: dicen cuántas tarjetas hay, y esa
              información ya la tiene quien recorre la lista con el teclado.
              Anunciarlos sería ruido. */}
          <div aria-hidden="true" className="flex gap-2">
            {events.map((event, i) => (
              <span
                key={event.slug}
                className={[
                  'block size-2.25 rounded-pill transition-colors duration-200',
                  i === index ? 'bg-sunset' : 'bg-muted-dark/40',
                ].join(' ')}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollByCard(1)}
            className="grid size-13 place-items-center rounded-pill text-bone ring-1 ring-muted-dark transition-colors duration-200 hover:bg-bone hover:text-deep"
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
