'use client';

import { useEffect, useRef } from 'react';
import { ButtonLink } from '@/components/shared/Button';
import { Ticket, X } from '@/components/shared/Icon';
import { Eyebrow } from '@/components/shared/Type';
import { isTicketed, timeRange, weekdaysLabel, type VenueEvent } from '@/content/events';
import { weekdayLong } from '@/lib/calendar';
import { eventDot, eventTypeLabel } from '@/lib/event-color';

/**
 * ══════════════════════════════════════════════════════════════════════════
 * LA VISTA PREVIA DE UN EVENTO DEL CALENDARIO.
 *
 * Camila, 2026-09-22, sobre la captura de `/whats-on`: «de cada evento haz una
 * vista previa tipo pop up: al ver en modo calendario, si yo clikeo alguno se
 * me abra un pop up con la información de cada uno».
 *
 * Hasta acá el calendario publicaba, por evento, un chip de 12px con la hora y
 * el título truncado. Todo lo demás que el cliente carga en el dashboard —el
 * horario completo, el espacio, la descripción, el precio— no se veía en
 * ninguna parte de esta página. Las fichas por evento (`/whats-on/<slug>`) se
 * eliminaron el 2026-09-15 y no volvieron: este diálogo es lo que ocupa ese
 * lugar, sin agregar 36 rutas al sitemap.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠️ ES UN `<dialog>` NATIVO Y NO UN `<div role="dialog">`, y eso decide tres
 * cosas que de otro modo habría que escribir a mano y mantener:
 *
 *   · `showModal()` mete el foco adentro y lo devuelve al botón que lo abrió
 *     al cerrar. Un div hay que atraparlo con un ciclo de `Tab` propio.
 *   · Escape cierra, sin listener.
 *   · El resto de la página queda `inert` para el lector de pantalla, así que
 *     nadie se pierde tabulando por un calendario que no ve.
 *
 * ⚠️ EL `::backdrop` SE PINTA EN CSS y no con un div hermano. Ver
 * `globals.css`: un overlay propio quedaría DEBAJO del top layer del diálogo y
 * habría que pelearle el `z-index` a algo que no está en el flujo.
 *
 * ⚠️ CIERRA AL CLICKEAR AFUERA, y eso sí hay que escribirlo: el `<dialog>` no
 * lo trae. El truco conocido es comparar el punto del click contra la caja del
 * diálogo — el `::backdrop` reporta el click como si fuera del `<dialog>`, así
 * que no alcanza con mirar el target.
 *
 * ⚠️ NO SE MONTA SI NO HAY EVENTO. El estado vive en `MonthCalendar`; acá
 * llega el evento abierto o `null`, y con `null` no se dibuja nada. El diálogo
 * no recuerda el anterior mientras se cierra: con 36 eventos en el mes, una
 * animación de salida que muestre el evento equivocado es peor que no tener
 * animación.
 * ══════════════════════════════════════════════════════════════════════════
 */

/** Lo que el calendario abre: un evento Y el día de la celda desde la que se abrió. */
export interface EventoAbierto {
  readonly event: VenueEvent;
  /**
   * ⚠️ LA FECHA VIENE DE LA CELDA Y NO DEL EVENTO, y esa es toda la razón por
   * la que este tipo existe en vez de pasar el `VenueEvent` pelado.
   *
   * Un recurrente no tiene fecha propia: `event.date` es `null` para el bingo,
   * que pasa todos los miércoles. Pero el bingo se abrió desde el miércoles 23,
   * y decirle a alguien «Time: 7 PM – 9 PM» sin fecha, cuando acaba de
   * clickear un día concreto del calendario, es perder el único dato que lo
   * llevó a clickear.
   */
  readonly date: string;
}

export default function EventDialog({
  abierto,
  onClose,
}: {
  readonly abierto: EventoAbierto | null;
  readonly onClose: () => void;
}) {
  const event = abierto?.event ?? null;
  const ref = useRef<HTMLDialogElement>(null);
  /*
    ══════════════════════════════════════════════════════════════════════════
    ⚠️ QUIÉN TENÍA EL FOCO ANTES DE ABRIR, PARA DEVOLVÉRSELO AL CERRAR.

    Un `<dialog>` hace esto solo, y acá NO alcanza: el componente se DESMONTA
    al cerrarse —`abierto` vuelve a `null` y no se dibuja nada—, así que para
    cuando el navegador querría devolver el foco ya no hay diálogo del que
    devolverlo. Medido: después de Escape el foco quedaba en `<body>`, o sea
    que alguien navegando con teclado perdía su lugar en un calendario de 36
    eventos y tenía que tabular desde el principio.

    ⚠️ SE GUARDA AL ABRIR Y NO EN EL RENDER. El `ref` se llena adentro del
    efecto, justo antes de `showModal()`, que es el único momento en que
    `document.activeElement` todavía es el chip que se clickeó.
    ══════════════════════════════════════════════════════════════════════════
  */
  const previo = useRef<HTMLElement | null>(null);

  /*
    ⚠️ `showModal()` VA EN UN EFECTO Y NO EN EL `onClick` QUE ABRE. El elemento
    no existe hasta que React lo monta, así que llamarlo desde el handler
    apuntaría a un `ref` vacío en el primer evento que se abra.

    ⚠️ Y `close()` EN LA LIMPIEZA: si el componente se desmonta con el diálogo
    abierto —cambiar de mes, por ejemplo— el navegador se queda con un modal
    huérfano en el top layer y la página abajo inerte para siempre.
  */
  useEffect(() => {
    const el = ref.current;
    if (!el || !event) return;
    /*
      ⚠️ SÓLO SE GUARDA SI EL FOCO ESTÁ FUERA DEL DIÁLOGO, y ese `if` es el
      arreglo de un bug real que apareció probándolo: en desarrollo React monta
      dos veces (StrictMode), o sea setup → cleanup → setup. En el SEGUNDO
      setup `document.activeElement` ya es el botón de cerrar que el primer
      `showModal()` enfocó, así que sin la condición el `ref` se pisaba con un
      nodo que está por desaparecer y al cerrar el foco caía en la nada.

      Medido: el foco volvía a un `<button>` con el texto «Close» en vez de al
      chip del calendario.
    */
    const activo = document.activeElement;
    if (activo instanceof HTMLElement && !el.contains(activo)) previo.current = activo;
    if (!el.open) el.showModal();
    return () => {
      el.close();
      /*
        ⚠️ `preventScroll` PORQUE EL CHIP PUEDE HABERSE IDO DE PANTALLA. Con el
        diálogo abierto se puede cambiar de mes o scrollear; devolver el foco
        sin esto arrastraría la página de vuelta al chip, que es un salto que
        nadie pidió. El foco vuelve igual, la vista se queda donde está.
      */
      previo.current?.focus({ preventScroll: true });
    };
  }, [event]);

  if (!abierto || !event) return null;

  const tipo = eventTypeLabel(event);
  /*
    ⚠️ LA FECHA SALE DE LA CELDA CLICKEADA, SIEMPRE. Ver la nota de
    `EventoAbierto`: un recurrente no tiene `date` propio y hasta acá se
    quedaba sin fecha en la ficha.

    ⚠️ Y SI ES RECURRENTE SE DICE QUE LO ES, en el renglón de abajo. «Wednesday,
    September 23» a secas haría pasar el bingo semanal por un evento único, que
    es exactamente el error que documenta `shortDate()` en `content/events.ts`.
  */
  const cuando = `${weekdayLong(abierto.date)}, ${new Date(
    `${abierto.date}T12:00:00Z`,
  ).toLocaleDateString('en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' })}`;
  const repite =
    event.kind === 'recurring' && event.weekdays.length > 0
      ? `Every ${weekdaysLabel(event.weekdays)}`
      : null;

  /*
    ⚠️ EL CUERPO PUEDE ESTAR VACÍO Y ESO ESTÁ BIEN. El calendario de Google que
    el cliente sincroniza no trae descripciones: de los 36 eventos del mes, la
    mayoría llega con título, día y horario y nada más. El diálogo se dibuja
    igual —esos cuatro datos ya son más de lo que muestra el chip— y el hueco
    es la señal de que falta pedir la descripción. Ver `parrafosDe` en
    `FeaturedEventCard`, que resuelve lo mismo del otro lado.
  */
  const cuerpo = event.body.length > 0 ? event.body : event.summary === event.title ? [] : [event.summary];

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        /*
          El click del `::backdrop` llega con el `<dialog>` como target, así
          que la única forma de distinguirlo es geométrica: si el punto cae
          fuera de la caja del diálogo, fue el fondo.

          ⚠️ `e.target !== e.currentTarget` NO ALCANZA SOLO: un click sobre el
          padding del propio diálogo también cumple esa condición y cerraría
          la ficha mientras alguien intenta seleccionar texto.
        */
        if (e.target !== e.currentTarget) return;
        const r = e.currentTarget.getBoundingClientRect();
        const afuera =
          e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
        if (afuera) e.currentTarget.close();
      }}
      aria-labelledby="event-dialog-title"
      className="ficha-evento w-[min(92vw,34rem)] rounded-frame border border-ink/12 bg-paper p-0 text-ink sombra-card"
    >
      <div className="relative p-6 lg:p-8">
        {/*
          ⚠️ EL BOTÓN DE CERRAR ES `type="button"` Y LLAMA A `close()`. Un
          `<form method="dialog">` haría lo mismo con menos código, pero en una
          página que ya tiene formularios de verdad un `<form>` decorativo es
          una trampa para el que venga después.
        */}
        <button
          type="button"
          onClick={() => ref.current?.close()}
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-pill text-body/70 transition-colors hover:bg-ink/8 hover:text-ink"
        >
          <X className="size-4.5" aria-hidden="true" />
          <span className="sr-only">Close</span>
        </button>

        {tipo ? (
          <p className="m-0 flex items-center gap-2">
            <span className={`size-2 shrink-0 rounded-pill ${eventDot(event)}`} aria-hidden="true" />
            <Eyebrow tone="deep" as="span">
              {tipo}
            </Eyebrow>
          </p>
        ) : null}

        <h2
          id="event-dialog-title"
          className="m-0 mt-2.5 max-w-[22ch] pr-10 font-display text-d5 font-bold uppercase leading-[1.05] text-ink lg:text-d4"
        >
          {event.title}
        </h2>

        {/* ── Cuándo y dónde ──────────────────────────────────────────── */}
        <dl className="m-0 mt-5 grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-2.5 border-t border-ink/12 pt-5 text-[15px] leading-[1.5]">
          <dt className="font-body text-caption font-medium uppercase tracking-eyebrow text-body/60">
            Date
          </dt>
          <dd className="m-0 text-ink">
            {cuando}
            {repite ? <span className="block text-body/70">{repite}</span> : null}
          </dd>

          <dt className="font-body text-caption font-medium uppercase tracking-eyebrow text-body/60">
            Time
          </dt>
          <dd className="m-0 tabular-nums text-ink">{timeRange(event)}</dd>

          <dt className="font-body text-caption font-medium uppercase tracking-eyebrow text-body/60">
            Where
          </dt>
          <dd className="m-0 text-ink">{event.space}</dd>

          {event.price !== null ? (
            <>
              <dt className="font-body text-caption font-medium uppercase tracking-eyebrow text-body/60">
                Price
              </dt>
              <dd className="m-0 tabular-nums text-ink">${event.price}</dd>
            </>
          ) : null}
        </dl>

        {cuerpo.length > 0 ? (
          <div className="mt-5 flex flex-col gap-3">
            {cuerpo.map((p) => (
              <p key={p} className="m-0 font-body text-[16px] font-light leading-[1.65] text-body">
                {p}
              </p>
            ))}
          </div>
        ) : null}

        {isTicketed(event) && event.ticketUrl ? (
          <div className="mt-6">
            <ButtonLink href={event.ticketUrl} external variant="primary">
              <Ticket className="size-4" aria-hidden="true" />
              Get tickets
            </ButtonLink>
          </div>
        ) : null}
      </div>
    </dialog>
  );
}
