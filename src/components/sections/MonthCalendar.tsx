import { ArrowSquareOut } from '@/components/shared/Icon';
import { formatTime, isTicketed, type VenueEvent } from '@/content/events';
import { dayNumber, weekdayShort } from '@/lib/calendar';
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
 * ⚠️ LAS DOS FORMAS DE LA MISMA GRILLA, Y POR QUÉ SON DOS.
 *
 * Siete columnas en un teléfono de 360px dan celdas de 48px. Ahí no entra
 * «6 PM Ross Brown» ni truncado: entra el número del día y poco más. Las dos
 * salidas posibles eran dejar el scroll horizontal, que es exactamente lo que
 * vinimos a sacar, o partir la información:
 *
 *   · Hasta `lg`, la celda es un MAPA: el número del día y un punto de color
 *     por evento. Se ve el mes entero de un vistazo, sin scroll de costado, y
 *     se entiende dónde hay algo y de qué tipo. Debajo va la agenda con el
 *     texto completo.
 *   · Desde `lg`, la celda lleva los chips con hora y título y la agenda se
 *     apaga.
 *
 * ⚠️ EL TEXTO ESTÁ DOS VECES EN EL HTML Y UNA SOLA EN PANTALLA. `hidden` es
 * `display: none`, así que en cada ancho hay exactamente una de las dos formas
 * viva, también para un lector de pantalla: nadie escucha el mes dos veces. Lo
 * que se paga son unas veinte líneas repetidas en el HTML servido, que al lado
 * de un calendario que no se puede leer en el teléfono no es un costo.
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

  return (
    <div className="mt-[28px]">
      <table className="w-full table-fixed border-collapse">
        <caption className="sr-only">
          Events at {venueName} in {label}
        </caption>
        <thead>
          <tr>
            {WEEKDAY_HEADERS.map((d) => (
              <th
                key={d.corto}
                scope="col"
                className="pb-[8px] text-center text-[11px] font-bold uppercase tracking-[0.08em] text-body/70 lg:text-left lg:text-caption lg:tracking-[0.12em]"
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
                          <>
                            {/* ── El mapa, hasta `lg` ──────────────────── */}
                            <span
                              className="mt-[4px] flex flex-wrap justify-center gap-[3px] px-[2px] lg:hidden"
                              aria-hidden="true"
                            >
                              {events.map(({ event }) => (
                                <span
                                  key={`dot-${date}-${event.slug}`}
                                  className={`size-[7px] rounded-pill ${eventDot(event)}`}
                                />
                              ))}
                            </span>

                            {/* ── Los chips, desde `lg` ────────────────── */}
                            <ul className="mt-[5px] hidden list-none flex-col gap-[3px] lg:flex">
                              {events.map(({ event }) => (
                                <li key={`chip-${date}-${event.slug}`}>
                                  <Chip event={event} />
                                </li>
                              ))}
                            </ul>
                          </>
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
      {referencia.length > 1 ? (
        <ul className="mt-[16px] flex list-none flex-wrap gap-x-[18px] gap-y-[8px]">
          {referencia.map((c) => (
            <li
              key={c.id}
              className="flex items-center gap-[7px] text-caption font-bold uppercase tracking-[0.08em] text-body/70"
            >
              <span className={`size-[9px] shrink-0 rounded-pill ${c.dot}`} aria-hidden="true" />
              {c.label}
            </li>
          ))}
        </ul>
      ) : null}

      {/* ── La agenda, hasta `lg`. Ver la nota del encabezado. ──────────── */}
      <div className="mt-[24px] border-t border-ink/15 lg:hidden">
        <h3 className="sr-only">Day by day in {label}</h3>
        <ul className="flex list-none flex-col">
          {agenda.map(({ date, events }) => (
            <li
              key={`agenda-${date}`}
              className="grid grid-cols-[46px_minmax(0,1fr)] gap-[12px] border-b border-ink/10 py-[12px]"
            >
              <p className="flex flex-col items-center leading-none">
                <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-body/60">
                  {weekdayShort(date)}
                </span>
                <span
                  className={[
                    'mt-[4px] grid size-[28px] place-items-center font-display text-d6 tabular-nums',
                    date === today ? 'rounded-pill bg-sunset font-semibold text-ink' : 'text-ink',
                  ].join(' ')}
                >
                  {dayNumber(date)}
                </span>
              </p>
              <ul className="flex list-none flex-col gap-[8px] pt-[2px]">
                {events.map(({ event }) => (
                  <li key={`agenda-${date}-${event.slug}`}>
                    <Chip event={event} suelto />
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
 * Un evento dentro de una celda o dentro de la agenda: punto, hora, título.
 *
 * ⚠️ EL COLOR VA EN EL PUNTO Y NO EN EL FONDO DEL CHIP. El porqué está entero
 * en `lib/event-color.ts`: con el punto, el título queda en `ink` sobre
 * `paper` y no hay ni una combinación de contraste que verificar.
 *
 * ⚠️ ES UN LINK SÓLO SI HAY ENTRADA QUE COMPRAR, y entonces sale a Eventbrite.
 * Es la misma regla que rige el resto del calendario desde que las fichas por
 * evento se eliminaron el 2026-09-15. Un evento clickeable que no lleva a
 * ninguna parte es peor que un evento que no es clickeable.
 *
 * ⚠️ `suelto` ES LA VERSIÓN DE LA AGENDA, donde hay ancho de sobra: la hora y
 * el título van en dos renglones y el título en la display. En la celda de la
 * grilla van en uno solo y truncados, que es lo único que entra.
 */
function Chip({ event, suelto = false }: { readonly event: VenueEvent; readonly suelto?: boolean }) {
  const cuerpo = (
    <>
      <span
        className={`mt-[5px] size-[7px] shrink-0 rounded-pill ${eventDot(event)}`}
        aria-hidden="true"
      />
      <span className={suelto ? 'flex min-w-0 flex-col' : 'flex min-w-0 items-baseline gap-[5px]'}>
        <span className="shrink-0 font-bold tabular-nums">{formatTime(event.startTime)}</span>
        <span className={suelto ? 'font-display text-d6 uppercase leading-[1.1]' : 'truncate'}>
          {event.title}
        </span>
      </span>
      {isTicketed(event) ? (
        <ArrowSquareOut className="mt-[4px] size-[12px] shrink-0" aria-hidden="true" />
      ) : null}
    </>
  );

  const clases = [
    'flex gap-[6px] text-[12px] leading-[1.35]',
    isTicketed(event) ? 'text-deep underline underline-offset-2 hover:text-terra' : 'text-ink',
  ].join(' ');

  if (!isTicketed(event) || !event.ticketUrl) return <span className={clases}>{cuerpo}</span>;

  return (
    <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer" className={clases}>
      {cuerpo}
      <span className="sr-only">
        Buy tickets for {event.title} on Eventbrite (opens in a new tab)
      </span>
    </a>
  );
}
