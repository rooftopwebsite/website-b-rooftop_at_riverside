'use client';

import Link from 'next/link';
import { useState } from 'react';
import EventDialog, { type EventoAbierto } from '@/components/sections/EventDialog';
import { Ticket } from '@/components/shared/Icon';
import { formatTime, isTicketed, standsOut, type VenueEvent } from '@/content/events';
import { dayNumber, monthDay, weekdayLong } from '@/lib/calendar';
import { colorKey, eventDot } from '@/lib/event-color';

/**
 * ══════════════════════════════════════════════════════════════════════════
 * EL CALENDARIO DEL MES.
 *
 * ⚠️ ERA UNA TABLA DE 860px DE ANCHO MÍNIMO QUE SCROLLEABA DE COSTADO, con
 * chips grises todos iguales, y encima estaba escondida detrás de un
 * conmutador cuya opción por defecto era una lista de texto. Camila,
 * 2026-09-17: «quiero que el calendario sea más visual, no en una lista como
 * tenemos ahora, necesito que sea más fácil de visualizar»; y sobre qué
 * mostrar en cada día: «solo con día, hora y el título del evento o el dato
 * más relevante, medio como hace el calendario de Google».
 *
 * ⚠️ UN MES POR VEZ, con las flechas que dibuja la página. Decisión de Camila
 * el mismo día, sobre la alternativa de apilar el mes actual y el siguiente.
 * La navegación sigue siendo por query string (`?month=2026-10`): cada mes es
 * una URL que se comparte y que Google puede rastrear, que es la mitad del
 * arreglo por el que esta página existe.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ EN MOBILE NO HAY GRILLA. Camila, 2026-09-22, sobre la captura: «en mobile
 * la vista calendario no tendrá el calendario en sí, sino que enlistaremos
 * cada uno de los eventos colocando día de la semana y debajo una card
 * horizontal con su hora, día y título; cada día tendrá su título de día y
 * luego el listado de eventos que le toca. Los días que no hay eventos no se
 * mencionan».
 *
 * Hasta el 2026-09-22 el teléfono mostraba LAS DOS COSAS: la grilla de siete
 * columnas reducida a un mapa de puntos —el número del día y un punto de color
 * por evento, sin texto— y debajo la agenda con el detalle. O sea que para
 * saber qué pasaba un día había que contar puntos arriba y después buscar el
 * día abajo. La grilla de puntos no contestaba ninguna pregunta sola.
 *
 * Ahora:
 *
 *   · Hasta `lg`, SÓLO la agenda: un encabezado por día con eventos y debajo
 *     sus tarjetas horizontales. Los días vacíos no existen, que es lo que
 *     hace que la lista mida lo que mide el mes y no 30 renglones.
 *   · Desde `lg`, SÓLO la grilla, con los chips de hora y título en cada
 *     celda.
 *
 * ⚠️ EL `hidden` ES `display: none`, así que en cada ancho hay exactamente una
 * de las dos formas viva, también para un lector de pantalla: nadie escucha el
 * mes dos veces.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠️ CADA EVENTO ABRE SU FICHA. Mismo pedido, misma captura: «de cada evento
 * haz una vista previa tipo pop up». El chip y la tarjeta son `<button>` y
 * abren `EventDialog`, que es donde se lee el horario completo, el espacio y
 * la descripción que el cliente carga en el dashboard y que hasta ahora no se
 * publicaba en ninguna parte de esta página.
 *
 * ⚠️ POR ESO ESTE COMPONENTE ES CLIENTE. Era servidor y no tenía estado. Lo
 * único que se manda de más al bundle es este archivo y el diálogo: los
 * eventos ya viajaban, porque `/whats-on` los renderiza en el HTML.
 *
 * ⚠️ EL CHIP CON ENTRADA SIGUE SIENDO UN `<a>` A EVENTBRITE, y es la única
 * excepción. Ahí el click ya tenía un destino que la persona quiere —comprar—
 * y meterle un diálogo en el medio agrega un paso a la única acción que esta
 * página puede convertir. La ficha de esos eventos se abre igual desde la
 * agenda de mobile, que no linkea.
 * ══════════════════════════════════════════════════════════════════════════
 */

const WEEKDAY_HEADERS = [
  { corto: 'Sun', largo: 'Sunday' },
  { corto: 'Mon', largo: 'Monday' },
  { corto: 'Tue', largo: 'Tuesday' },
  { corto: 'Wed', largo: 'Wednesday' },
  { corto: 'Thu', largo: 'Thursday' },
  { corto: 'Fri', largo: 'Friday' },
  { corto: 'Sat', largo: 'Saturday' },
] as const;

/**
 * El renglón de la referencia, que ahora lo usan tres entradas distintas.
 *
 * ⚠️ ESTÁ EN UNA CONSTANTE Y NO REPETIDO TRES VECES: las tres son la misma
 * fila y tienen que verse igual. Si un día una se separa, que sea por una
 * decisión y no porque alguien tocó una y se olvidó de las otras.
 */
const LEYENDA =
  'flex items-center gap-[7px] text-caption font-bold uppercase tracking-[0.08em] text-body/70';

interface DayEvents {
  readonly date: string;
  readonly events: readonly { readonly event: VenueEvent }[];
}

export default function MonthCalendar({
  grid,
  eventsByDate,
  label,
  today,
  venueName,
}: {
  readonly grid: readonly (string | null)[][];
  readonly eventsByDate: ReadonlyMap<string, readonly { readonly event: VenueEvent }[]>;
  readonly label: string;
  /** Hoy en el huso del venue. Ver `todayInVenue()`. */
  readonly today: string;
  readonly venueName: string;
}) {
  const delMes = [...eventsByDate.values()].flatMap((l) => l.map((o) => o.event));
  const referencia = colorKey(delMes);
  /*
   * ⚠️ CADA MARCA SE EXPLICA SÓLO SI ESTE MES LA USA, que es la regla que ya
   * traía la referencia de colores: explicar algo que no está en pantalla es
   * ruido. Ver `colorKey()`.
   */
  const hayDestacados = delMes.some(standsOut);
  const hayEntradas = delMes.some(isTicketed);

  /*
   * La agenda del celular: los días con algo, en orden. Sale del MISMO mapa
   * que la grilla, así que no puede contradecirla. Es la misma lección que
   * está anotada en `lib/calendar.ts`: cuando dos bloques de esta pantalla
   * leían dos fuentes, se contradecían en producción.
   */
  const agenda: readonly DayEvents[] = grid
    .flat()
    .filter((d): d is string => d !== null)
    .map((date) => ({ date, events: eventsByDate.get(date) ?? [] }))
    .filter((d) => d.events.length > 0);

  /*
    ⚠️ EL EVENTO ABIERTO ES UN ESTADO Y NO UNA RUTA. Las fichas por evento
    (`/whats-on/<slug>`) existieron y se eliminaron el 2026-09-15 — ver
    `app/sitemap.ts` —, así que esto no las resucita por la ventana: la URL no
    cambia, no hay nada nuevo que indexar y la navegación del mes sigue siendo
    la del query string.
  */
  const [abierto, setAbierto] = useState<EventoAbierto | null>(null);

  return (
    <div className="mt-[28px]">
      <EventDialog abierto={abierto} onClose={() => setAbierto(null)} />

      {/*
        ⚠️ LA TABLA ARRANCA EN `lg`. Ver la nota del encabezado: abajo de eso
        la grilla era un mapa de puntos sin texto y la reemplaza la agenda.
      */}
      <table className="hidden w-full table-fixed border-collapse lg:table">
        <caption className="sr-only">
          Events at {venueName} in {label}
        </caption>
        <thead>
          <tr>
            {WEEKDAY_HEADERS.map((d) => (
              <th
                key={d.corto}
                scope="col"
                className="pb-[8px] text-center text-caption font-bold uppercase tracking-[0.08em] text-body/70 lg:text-left lg:tracking-[0.12em]"
              >
                {/* El nombre entero para quien escucha, las tres letras para quien mira. */}
                <span aria-hidden="true">{d.corto}</span>
                <span className="sr-only">{d.largo}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grid.map((week, wi) => (
            <tr key={wi}>
              {week.map((date, di) => {
                const events = date ? eventsByDate.get(date) : undefined;
                const esHoy = date === today;

                return (
                  <td
                    key={date ?? `empty-${wi}-${di}`}
                    className={[
                      'border-b border-r border-ink/10 p-[4px] align-top lg:p-[8px]',
                      di === 0 ? 'border-l' : '',
                      date ? '' : 'bg-ink/[0.02]',
                    ].join(' ')}
                  >
                    {date ? (
                      /*
                        La altura mínima vive acá y no en la celda: `min-height`
                        sobre un `<td>` lo ignoran varios motores, sobre un
                        bloque adentro funciona en todos.
                      */
                      <div className="flex min-h-[54px] flex-col lg:min-h-[116px]">
                        {/*
                          EL NÚMERO DEL DÍA. Hoy va en un círculo naranja, que
                          es la única marca de la grilla que no es un evento:
                          sin ella, un mes cualquiera no dice en qué punto del
                          mes está parada la persona que lo mira.
                        */}
                        <span
                          className={[
                            'grid size-[26px] shrink-0 place-items-center font-display text-d6 tabular-nums lg:size-[30px]',
                            esHoy ? 'rounded-pill bg-sunset font-semibold text-ink' : 'text-body/75',
                          ].join(' ')}
                        >
                          {esHoy ? <span className="sr-only">Today, </span> : null}
                          {dayNumber(date)}
                        </span>

                        {events && events.length > 0 ? (
                          <ul className="mt-[5px] flex list-none flex-col gap-[3px]">
                            {events.map(({ event }) => (
                              <li key={`chip-${date}-${event.slug}`}>
                                <Chip event={event} date={date} onOpen={setAbierto} />
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    ) : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/*
        LA REFERENCIA DE COLORES.

        ⚠️ SÓLO LOS TIPOS QUE ESTE MES TIENE. Ver `colorKey()`. Y con un solo
        color no se dibuja: una referencia de un ítem no explica nada.
      */}
      {/*
        ⚠️ LA GRILLA TIENE TRES MARCAS Y CADA UNA DICE UNA COSA DISTINTA: el
        punto dice de qué TIPO es el evento, el fondo crema dice que no va a
        estar siempre y el ticket dice que se paga. Sin esta fila, dos de las
        tres son adorno.
      */}
      {referencia.length > 1 || hayDestacados ? (
        <ul className="mt-[16px] flex list-none flex-wrap gap-x-[18px] gap-y-[8px]">
          {referencia.length > 1
            ? referencia.map((c) => (
                <li key={c.id} className={LEYENDA}>
                  <span className={`size-[9px] shrink-0 rounded-pill ${c.dot}`} aria-hidden="true" />
                  {c.label}
                </li>
              ))
            : null}

          {hayDestacados ? (
            <li className={LEYENDA}>
              {/* La muestra ES un chip chiquito: se reconoce porque se parece a
                  lo que hay que reconocer, no porque lo diga el texto. */}
              <span
                className="h-[14px] w-[22px] shrink-0 rounded-[5px] bg-cream"
                aria-hidden="true"
              />
              Limited run or ticketed
            </li>
          ) : null}

          {hayEntradas ? (
            <li className={LEYENDA}>
              <Ticket className="size-[13px] shrink-0" aria-hidden="true" />
              Tickets on Eventbrite
            </li>
          ) : null}
        </ul>
      ) : null}

      {/*
        ══════════════════════════════════════════════════════════════════
        ── LA AGENDA, HASTA `lg`. Es TODO el calendario en un teléfono.

        ⚠️ ERA UNA COLUMNA DE 46px CON EL DÍA AL COSTADO y ahora el día es un
        encabezado de ancho completo con el listado debajo. Camila, sobre la
        captura: «cada día tendrá su título de día y luego el listado de
        eventos que le toca».

        La diferencia práctica es el ancho: con la placa del día a la
        izquierda, al título del evento le quedaban ~250px en un teléfono de
        360 y entraba truncado. Con el día arriba, la tarjeta usa el renglón
        entero.

        ⚠️ LOS DÍAS SIN EVENTOS NO EXISTEN ACÁ, y es parte del mismo pedido:
        `agenda` ya viene filtrada. Un mes son 30 renglones y ~14 tienen algo;
        publicar los 16 vacíos es hacer scrollear por nada.

        ⚠️ HOY SE MARCA EN EL ENCABEZADO Y NO EN CADA TARJETA. Es el mismo
        círculo naranja de la grilla —la única marca que no es un evento— y
        acá alcanza con que esté una vez por día.
        ══════════════════════════════════════════════════════════════════
      */}
      <div className="mt-[24px] lg:hidden">
        <h3 className="sr-only">Day by day in {label}</h3>
        <ul className="flex list-none flex-col gap-[22px] p-0">
          {agenda.map(({ date, events }) => (
            <li key={`agenda-${date}`}>
              <h4 className="m-0 flex items-baseline gap-[8px] border-b border-ink/15 pb-[8px]">
                <span className="font-display text-d6 font-bold uppercase leading-none tracking-[0.02em] text-ink">
                  {weekdayLong(date)}
                </span>
                <span
                  className={[
                    'grid min-w-[24px] place-items-center rounded-pill px-[6px] py-[2px] font-body text-caption font-bold tabular-nums leading-none',
                    date === today ? 'bg-sunset text-ink' : 'text-body/60',
                  ].join(' ')}
                >
                  {date === today ? <span className="sr-only">Today, </span> : null}
                  {monthDay(date)}
                </span>
              </h4>

              <ul className="mt-[10px] flex list-none flex-col gap-[8px] p-0">
                {events.map(({ event }) => (
                  <li key={`agenda-${date}-${event.slug}`}>
                    <AgendaCard event={event} date={date} onOpen={setAbierto} />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * ══════════════════════════════════════════════════════════════════════════
 * LA TARJETA HORIZONTAL DE LA AGENDA: hora, día y título.
 *
 * Camila, 2026-09-22: «debajo una card horizontal con su hora, día y título».
 *
 * ⚠️ LOS TRES DATOS EN DOS RENGLONES: arriba la hora y la fecha en cuerpo
 * chico, abajo el título en display. La hora primero porque es lo que se
 * compara cuando ya se decidió el día — que es justo lo que alguien acaba de
 * hacer al leer el encabezado de arriba.
 *
 * ⚠️ LA FECHA SE REPITE A PROPÓSITO, aunque el encabezado del día la diga tres
 * renglones más arriba. Es lo que pidió Camila y además es lo que hace que la
 * tarjeta se entienda sola: son las que alguien fotografía o manda por
 * WhatsApp, y recortada del grupo una tarjeta sin fecha no sirve para nada.
 *
 * ⚠️ ES UN `<button>` Y NO UN `<div onClick>`. Entra en el tabulador, se
 * dispara con Enter y con Espacio, y el lector de pantalla lo anuncia como lo
 * que es. Un div clickeable no hace ninguna de las tres.
 *
 * ⚠️ EL FONDO CREMA MARCA LO MISMO QUE EN LA GRILLA —lo que no va a estar
 * siempre— y lo decide `standsOut()`, no esta tarjeta. Ver la nota de `Chip`.
 * ══════════════════════════════════════════════════════════════════════════
 */
function AgendaCard({
  event,
  date,
  onOpen,
}: {
  readonly event: VenueEvent;
  readonly date: string;
  readonly onOpen: (a: EventoAbierto) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen({ event, date })}
      className={[
        'flex w-full items-start gap-[10px] rounded-card border border-ink/12 px-[12px] py-[10px] text-left transition-colors hover:border-ink/30',
        standsOut(event) ? 'bg-cream' : 'bg-paper',
      ].join(' ')}
    >
      <span
        className={`mt-[7px] size-[8px] shrink-0 rounded-pill ${eventDot(event)}`}
        aria-hidden="true"
      />
      <span className="flex min-w-0 flex-col">
        <span className="flex flex-wrap items-baseline gap-x-[8px] font-body text-caption font-bold uppercase tracking-[0.06em] tabular-nums text-body/70">
          {formatTime(event.startTime)}
          <span className="font-medium tracking-[0.04em] text-body/55">{monthDay(date)}</span>
        </span>
        <span className="mt-[3px] font-display text-d6 uppercase leading-[1.1] text-ink">
          {event.title}
        </span>
      </span>
      {isTicketed(event) ? (
        <Ticket className="mt-[6px] ml-auto size-[15px] shrink-0 text-body/70" aria-hidden="true" />
      ) : null}
      <span className="sr-only">— see details</span>
    </button>
  );
}

/**
 * Un evento dentro de una celda de la grilla: punto, hora, título truncado.
 *
 * ⚠️ EL COLOR VA EN EL PUNTO Y NO EN EL FONDO DEL CHIP. El porqué está entero
 * en `lib/event-color.ts`: con el punto, el título queda en `ink` sobre
 * `paper` y no hay ni una combinación de contraste que verificar.
 *
 * ⚠️ AHORA SIEMPRE ES CLICKEABLE, Y ANTES LO ERA SÓLO CON ENTRADA. La regla
 * vieja —«un evento clickeable que no lleva a ninguna parte es peor que uno
 * que no lo es»— valía mientras no hubiera adónde llevar: las fichas por
 * evento se habían eliminado el 2026-09-15. Desde el 2026-09-22 hay adónde, y
 * es el diálogo. Ver la nota del encabezado.
 *
 * ⚠️ CON ENTRADA SIGUE SIENDO UN `<a>` A EVENTBRITE. Es la única excepción y
 * está explicada arriba: ahí el click ya tenía un destino que la persona
 * quiere.
 *
 * ⚠️ `suelto` MURIÓ CON LA AGENDA VIEJA. Era la variante de dos renglones que
 * usaba la lista de mobile; esa lista ahora tiene su propio componente,
 * `AgendaCard`, porque además del formato cambió el comportamiento.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ EL FONDO CREMA MARCA LO QUE NO VA A ESTAR SIEMPRE. Camila, 2026-09-21:
 * «quiero que las que son únicas se destaquen con fondito». Quién decide cuáles
 * es `standsOut()`, no este componente, y el porqué de sus dos condiciones está
 * entero en su nota: la regla es «tiene fin cargado o tiene entrada».
 *
 * ⚠️ EL PADDING LO LLEVAN TODOS LOS CHIPS Y EL FONDO SÓLO EL DESTACADO. Si el
 * padding viniera junto con el fondo, en una celda con dos eventos el destacado
 * arrancaría 5px más adentro que el otro y la columna se vería desprolija. Con
 * el padding parejo, lo único que cambia entre un chip y otro es el color.
 *
 * ⚠️ `cream` ES EL COLOR DE PÍLDORA DEL BRAND BOOK y acá es exactamente eso: un
 * chip. Da 14.9:1 con la tinta y 9.4:1 con `deep`, que es el color del título
 * cuando el evento linkea. Contra el blanco de la celda es 1.15:1 —poco como
 * número, evidente como amarillo—: alcanza para que salte y no tanto como para
 * taparle el trabajo al punto de color, que sigue diciendo de qué TIPO es.
 *
 * ⚠️ EL ICONO ES UN TICKET Y ERA LA FLECHA DE «ABRE EN OTRA PESTAÑA». Camila, el
 * mismo día: «si tiene entrada debe mostrarse eso de alguna forma, quizá un
 * iconito de ticket». La flecha decía cómo se abre el link; el ticket dice qué
 * hay del otro lado, que es el dato que sirve al elegir a qué ir. Que abre en
 * otra pestaña lo sigue diciendo el texto `sr-only` de más abajo, que es donde
 * esa advertencia tiene que estar.
 * ══════════════════════════════════════════════════════════════════════════
 */
function Chip({
  event,
  date,
  onOpen,
}: {
  readonly event: VenueEvent;
  /** El día de la celda. Ver la nota de `EventoAbierto`. */
  readonly date: string;
  readonly onOpen: (a: EventoAbierto) => void;
}) {
  const cuerpo = (
    <>
      <span
        className={`mt-[5px] size-[7px] shrink-0 rounded-pill ${eventDot(event)}`}
        aria-hidden="true"
      />
      <span className="flex min-w-0 items-baseline gap-[5px]">
        <span className="shrink-0 font-bold tabular-nums">{formatTime(event.startTime)}</span>
        <span className="truncate">{event.title}</span>
      </span>
      {isTicketed(event) ? (
        <Ticket className="mt-[3px] size-[13px] shrink-0" aria-hidden="true" />
      ) : null}
    </>
  );

  const clases = [
    'flex w-full gap-[6px] rounded-[5px] px-[5px] py-[3px] text-left text-[12px] leading-[1.35]',
    standsOut(event) ? 'bg-cream' : '',
    isTicketed(event) ? 'text-deep underline underline-offset-2 hover:text-terra' : 'text-ink',
  ]
    .filter(Boolean)
    .join(' ');

  if (isTicketed(event) && event.ticketUrl) {
    return (
      <Link href={event.ticketUrl} target="_blank" rel="noopener noreferrer" className={clases}>
        {cuerpo}
        <span className="sr-only">
          Buy tickets for {event.title} on Eventbrite (opens in a new tab)
        </span>
      </Link>
    );
  }

  /*
    ⚠️ `hover:bg-ink/6` SÓLO EN EL CHIP SIN FONDO. Sobre el crema del
    destacado, un gris translúcido encima da un beige sucio: ahí la señal de
    que se puede clickear la da el cursor y el `focus-visible` del tema.
  */
  return (
    <button
      type="button"
      onClick={() => onOpen({ event, date })}
      className={`${clases} ${standsOut(event) ? '' : 'hover:bg-ink/6'} transition-colors`}
    >
      {cuerpo}
      <span className="sr-only">— see details</span>
    </button>
  );
}
