'use client';

import { useState } from 'react';
import { venueAddressLine } from '@/lib/venue';
import { useVenue } from './VenueProvider';
import { ArrowSquareOut } from './Icon';

/**
 * El mapa, que NO se carga hasta que alguien lo pide.
 *
 * ⚠️ POR QUÉ DIFERIDO Y NO UN `<iframe>` SUELTO. Un embed de Google Maps baja
 * del orden de un megabyte de JavaScript de terceros, abre conexiones a cuatro
 * dominios y planta cookies antes de que nadie lo haya mirado. En una página
 * de contacto eso compite por ancho de banda justo con lo único que la persona
 * vino a buscar, que es la dirección y el teléfono en texto.
 *
 * Así que la dirección, el teléfono y el link a indicaciones están SIEMPRE en
 * HTML plano, sin depender de nada, y el mapa entra recién al apretar. Quien
 * nunca lo aprieta no paga nada.
 *
 * ⚠️ El botón es un `<button>` de verdad, no un div con onClick: entra en el
 * orden de tabulación y se dispara con Enter y con espacio sin que tengamos
 * que escribir un solo manejador de teclado.
 *
 * ⚠️ El `<iframe>` lleva `title`: para un lector de pantalla un iframe sin
 * título es «marco», y no hay forma de saber qué contiene.
 */
export default function MapEmbed({
  className = '',
  label = 'Show the map',
}: {
  readonly className?: string;
  readonly label?: string;
}) {
  const [shown, setShown] = useState(false);
  const venue = useVenue();
  const direccion = venueAddressLine(venue);
  const src = `https://www.google.com/maps?q=${encodeURIComponent(direccion)}&output=embed`;

  return (
    <div className={className}>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card border border-ink/12 bg-bone sm:aspect-[16/9]">
        {shown ? (
          <iframe
            src={src}
            title={`Map showing ${venue.name} at ${direccion}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-gutter">
            {/*
              El fondo es la greca del sistema, no una captura del mapa: una
              captura sería otra imagen que bajar para tapar una que no bajó.

              ⚠️ EL TEXTO VA SOBRE UN PANEL OPACO Y NO SOBRE LA GRECA. Medido
              con axe: la greca al 35 % sobre `bone` da un fondo efectivo de
              #A6ABA3, y encima de eso el cuerpo quedaba en 4.32:1 y la línea
              chica en 3.19:1, o sea las dos por debajo del 4.5:1 de AA. Sobre
              `paper` el mismo texto da 17.11:1. El panel no es decoración.
            */}
            <span aria-hidden="true" className="greca absolute inset-0 opacity-[0.35]" />
            <div className="relative flex max-w-[34ch] flex-col items-center gap-[14px] rounded-card bg-paper px-[24px] py-[22px] text-center sombra-card">
              <p className="font-body text-[16px] leading-[1.6] text-body">{direccion}</p>
              <button
                type="button"
                onClick={() => setShown(true)}
                className="inline-flex h-10.5 items-center justify-center rounded-pill bg-ink px-[24px] font-body text-cta font-bold tracking-cta text-paper transition-colors hover:bg-ink/85"
              >
                {label}
              </button>
              <p className="text-[14px] leading-[1.5] text-muted">
                Loads Google Maps only when you ask for it.
              </p>
            </div>
          </div>
        )}
      </div>

      <p className="mt-[14px] text-[16px]">
        <a
          href={venue.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="link-texto inline-flex items-center gap-[6px] font-bold"
        >
          Get directions
          <ArrowSquareOut className="size-3.5" aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </p>
    </div>
  );
}
