'use client';

import { useEffect, useState } from 'react';
import { HOURS } from '@/lib/brand';
import { venueStatus } from '@/lib/hours';
import { CaretDown, CaretUp, Dot } from './Icon';

/**
 * La tarjeta de horarios, con el día de HOY abierto.
 *
 * ⚠️ ESTÁ SEPARADA DE `FindUs` PARA QUE `FindUs` NO SEA CLIENT. La sección
 * entera —los dos titulares, las redes, la tarjeta de contacto y el mapa— es
 * contenido estático que puede renderizarse en el servidor. Lo único que
 * necesita el navegador es esto: cuál es hoy y si está abierto ahora.
 *
 * Antes `FindUs` llevaba `'use client'` arriba de todo y arrastraba la
 * sección completa al bundle. Son ~7 KB de markup estático que no tenían por
 * qué viajar como JavaScript.
 *
 * ⚠️ ARRANCA SIN «HOY», y no es un detalle de implementación: el servidor no
 * sabe qué hora es en Bonita Springs para el visitante, y una página cacheada
 * publicaría un «today» equivocado — que en una tarjeta de horarios es el
 * peor error posible. En el primer pintado las siete filas se ven iguales, y
 * eso ya es información completa y correcta. El resaltado y el badge en vivo
 * aparecen al montar.
 *
 * ⚠️ Los carets son DECORATIVOS. Marcan cuál fila está desplegada, pero no
 * son controles: la fila de hoy no se puede plegar y las otras no se pueden
 * abrir. Es a propósito — las siete filas ya están todas a la vista, y un
 * acordeón que sólo tiene un panel y no se puede cerrar es un control que
 * miente. Por eso van con `aria-hidden` y la fila no es un `<button>`.
 */
export default function HoursCard() {
  const [status, setStatus] = useState<ReturnType<typeof venueStatus>>(null);

  useEffect(() => setStatus(venueStatus('bar')), []);

  const todayIdx = status?.dayIndex ?? -1;

  return (
    <div className="flex flex-col rounded-shell bg-deep p-6.5 text-bone on-dark lg:p-9">
      <h3 className="m-0 mb-5.5 font-display text-d5 font-bold uppercase leading-none tracking-[0.02em] text-paper">
        Hours
      </h3>

      <dl className="m-0">
        {HOURS.map((row, i) => {
          const isToday = i === todayIdx;
          return (
            /*
              ⚠️ EL `dt` Y LOS `dd` VAN COMO HIJOS DIRECTOS DE ESTE `div`, y
              no envueltos en otro. La primera versión tenía la fila metida en
              un `<div className="flex">` adentro de este: dos niveles de div
              entre el `<dl>` y el `<dt>`. axe lo marcó 28 veces con dos
              reglas distintas —`dlitem` y `definition-list`— porque el HTML
              admite UN `div` de agrupación, no dos.

              Por eso el layout de la fila (el `flex` que separa el día de la
              hora) vive en este mismo elemento y el desglose de hoy es un
              SEGUNDO `dd` a ancho completo, que es válido: un `dt` puede
              tener varios `dd`.
            */
            <div
              key={row.day}
              className="flex flex-wrap items-center justify-between gap-x-4 border-b border-muted-dark/30 py-3"
            >
              <dt
                className={[
                  'font-body text-base',
                  isToday ? 'font-medium text-cream' : 'text-paper',
                ].join(' ')}
              >
                {row.day}
                {isToday ? ' · today' : ''}
              </dt>
              <dd className="m-0 flex items-center gap-3">
                <span
                  className={[
                    'font-body text-dato whitespace-nowrap tabular-nums',
                    isToday ? 'text-cream' : 'text-paper',
                  ].join(' ')}
                >
                  {row.bar}
                </span>
                {isToday ? (
                  <CaretUp aria-hidden="true" className="size-3.25 text-muted-dark" />
                ) : (
                  <CaretDown aria-hidden="true" className="size-3.25 text-muted-dark" />
                )}
              </dd>

              {/*
                ⚠️ El desglose sólo aparece en HOY, y es la única fila donde la
                distinción importa de verdad: la barra abre a las 3 y los
                camiones a las 4, así que alguien que llega a las 3:30 se
                encuentra el bar abierto y ninguna cocina. Mostrar los dos
                horarios en las siete filas duplicaría catorce datos para
                resolver una pregunta que sólo se hace sobre hoy.
              */}
              {isToday ? (
                <dd className="m-0 grid w-full grid-cols-[auto_1fr] gap-x-5 gap-y-1.5 pt-3">
                  <span className="font-body text-caption text-muted-dark">Bar</span>
                  <span className="font-body text-dato tabular-nums text-paper">{row.bar}</span>
                  <span className="font-body text-caption text-muted-dark">Trucks</span>
                  <span className="font-body text-dato tabular-nums text-paper">{row.trucks}</span>
                </dd>
              ) : null}
            </div>
          );
        })}
      </dl>

      {status ? (
        <p className="mt-6.5 m-0">
          <span className="inline-flex items-center gap-2.5 rounded-pill px-5.5 py-3 font-body text-micro font-medium uppercase tracking-cta text-cream ring-1 ring-muted-dark">
            {/* El punto es decorativo: el estado lo dice el TEXTO de al lado.
                Sin eso el dato dependería del color, que es lo que WCAG 1.4.1
                no permite. */}
            <Dot aria-hidden="true" className="size-2" />
            {status.isOpen
              ? status.closesAt
                ? `Open · closes ${status.closesAt}`
                : 'Open now'
              : status.reopensOn && status.reopensOn !== 'today'
                ? `Closed · opens ${status.reopensOn}`
                : 'Closed right now'}
          </span>
        </p>
      ) : null}
    </div>
  );
}
