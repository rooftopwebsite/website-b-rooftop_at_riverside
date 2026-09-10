'use client';

import { useEffect, useState } from 'react';
import { venueStatus } from '@/lib/hours';

/**
 * «Hoy: 3 PM – 8 PM · Open now». Va bajo el hero y en el footer.
 *
 * ⚠️ Por qué es client y por qué arranca sin estado. El servidor no sabe qué
 * hora es en Bonita Springs para EL VISITANTE, y una página cacheada
 * renderizaría un «Open now» viejo. Así que el servidor pinta sólo la fila de
 * horarios —que es información estable y útil por sí sola— y el badge de
 * abierto/cerrado aparece después de montar. Sin esto hay mismatch de
 * hidratación, y además se publicaría un dato que puede estar mal.
 *
 * ⚠️ Nada de esto usa storage del navegador. El brief lo prohíbe.
 */

export default function OpenStatus({
  which = 'bar',
  className = '',
}: {
  readonly which?: 'bar' | 'trucks';
  readonly className?: string;
}) {
  const [state, setState] = useState<{ today: string; isOpen: boolean } | null>(null);

  useEffect(() => {
    // ⚠️ El parser se mudó a `lib/hours.ts`: lo comparten este componente, el
    // pill del hero y el badge en vivo de `FindUs`. Ver la nota de ese archivo.
    const status = venueStatus(which);
    if (status) setState({ today: status.today, isOpen: status.isOpen });
  }, [which]);

  const label = which === 'bar' ? 'Bar' : 'Food trucks';

  return (
    <p
      className={['flex flex-wrap items-center gap-x-[10px] gap-y-[4px] text-caption', className]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="eyebrow">Today</span>
      <span className="font-bold">
        {label} {state ? state.today : '—'}
      </span>
      {state ? (
        <span className="inline-flex items-center gap-[6px]">
          {/* El punto es decorativo: el estado lo dice el TEXTO de al lado.
              Sin esto el dato dependería del color, que es lo que WCAG 1.4.1
              no permite. */}
          <span
            aria-hidden="true"
            className={[
              'inline-block h-[7px] w-[7px] rounded-pill',
              state.isOpen ? 'bg-teal600' : 'bg-terra',
            ].join(' ')}
          />
          <span className="font-bold uppercase tracking-[0.14em]">
            {state.isOpen ? 'Open now' : 'Closed now'}
          </span>
        </span>
      ) : null}
    </p>
  );
}
