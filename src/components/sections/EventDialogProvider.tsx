'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import EventDialog, { type EventoAbierto } from '@/components/sections/EventDialog';
import { ArrowRight } from '@/components/shared/Icon';
import type { VenueEvent } from '@/content/events';

/**
 * ══════════════════════════════════════════════════════════════════════════
 * UN SOLO DIÁLOGO PARA TODA LA GRILLA DE `/whats-on`.
 *
 * ⚠️ EXISTE PARA EL «SEE MORE» DE LA TARJETA COMPACTA DE MOBILE. Camila,
 * 2026-09-23: en mobile la tarjeta del calendario se corta al tamaño de la más
 * chica —foto, fecha, hora, título y dos renglones— y cuando necesita más, lleva
 * «un CTA tipo link de ver más o saber más, que abra el pop up que configuramos
 * ayer». Ese pop-up es `EventDialog`, el mismo que abre la vista calendario.
 *
 * ⚠️ ES UN PROVEEDOR Y NO UN DIÁLOGO POR TARJETA. La grilla tiene hasta
 * cuarenta tarjetas en un mes: montar cuarenta `<dialog>` para que se abra uno
 * es cuarenta veces el mismo árbol. Acá hay uno solo, y cada botón le pasa qué
 * evento y qué fecha mostrar.
 *
 * ⚠️ `UpcomingCards` SIGUE SIENDO DE SERVIDOR. Lo único que baja al cliente es
 * este archivo: el proveedor envuelve la lista y `VerMas` es una hoja. El
 * `VenueEvent` que cruza es el mismo objeto plano que ya recibe `MonthCalendar`.
 * ══════════════════════════════════════════════════════════════════════════
 */
const AbrirEvento = createContext<((a: EventoAbierto) => void) | null>(null);

export function EventDialogProvider({ children }: { readonly children: ReactNode }) {
  const [abierto, setAbierto] = useState<EventoAbierto | null>(null);
  return (
    <AbrirEvento.Provider value={setAbierto}>
      {children}
      <EventDialog abierto={abierto} onClose={() => setAbierto(null)} />
    </AbrirEvento.Provider>
  );
}

/**
 * El link de «See more». Es un `<button>` porque no navega: abre el diálogo.
 *
 * ⚠️ Y ABRE CON LA TARJETA ENTERA, desde el 2026-09-23. Camila: «que el pop
 * up se abra tocando toda la card, no sólo el CTA». Es el patrón del link
 * estirado: el `::after` del botón cubre la tarjeta (que tiene que ser
 * `relative`), así que un toque en cualquier parte cae en él. Es UN solo
 * control por tarjeta —no un `onClick` en el `<article>`—, así que el
 * teclado y el lector de pantalla siguen viendo un botón con nombre.
 *
 * ⚠️ POR ESO NO LLEVA `toque`: esa utilidad también usa el `::after`, y acá
 * el área ya es la tarjeta entera. Lo que tenga que quedar tocable por
 * encima —el «Get tickets»— va con `relative z-10`.
 *
 * ⚠️ `visible={false}` deja el botón sólo para el lector de pantalla: la
 * tarjeta que ya muestra todo no promete «más», pero igual se abre al tocarla.
 *
 * ⚠️ LLEVA EL TÍTULO EN `sr-only`. Con cuarenta «See more» iguales en la
 * página, la lista de controles de un lector de pantalla sería cuarenta veces
 * la misma frase sin decir de qué evento.
 */
export function VerMas({
  event,
  date,
  className = '',
  visible = true,
}: {
  readonly event: VenueEvent;
  readonly date: string;
  readonly className?: string;
  readonly visible?: boolean;
}) {
  const abrir = useContext(AbrirEvento);
  if (!abrir) return null;
  /*
    ⚠️ SIN LINK VISIBLE, EL BOTÓN ES ÉL MISMO LA CAPA (`absolute inset-0`) y
    no usa `sr-only`: esa clase recorta todo lo que cae fuera de la caja del
    botón, `::after` incluido, y la tarjeta quedaba sin área que tocar.
  */
  if (!visible) {
    return (
      <button type="button" onClick={() => abrir({ event, date })} className={`absolute inset-0 ${className}`}>
        <span className="sr-only">See more about {event.title}</span>
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={() => abrir({ event, date })}
      className={`group inline-flex w-fit items-center gap-2 border-b-2 border-sunset pb-0.5 font-body text-dato font-medium text-ink transition-colors after:absolute after:inset-0 after:content-[''] hover:text-sunset-deep ${className}`}
    >
      See more
      <span className="sr-only"> about {event.title}</span>
      <ArrowRight
        className="size-3.5 text-sunset-deep transition-transform duration-200 group-hover:translate-x-1"
        aria-hidden="true"
      />
    </button>
  );
}
