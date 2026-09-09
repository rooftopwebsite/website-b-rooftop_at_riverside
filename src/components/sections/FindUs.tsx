'use client';

import { useEffect, useRef } from 'react';
import { ArrowLink } from '@/components/shared/Button';
import Section, { GUTTER } from '@/components/shared/Section';
import TilePattern from '@/components/shared/TilePattern';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
import { BRAND, HOURS, addressLine, mapsUrl } from '@/lib/brand';

/**
 * «Find us» — el mapa y los siete días, cada uno desplegable.
 *
 * Camila: «quiero que sea como el de yava, cada día será clicqueable y con el
 * hover o el click se expande y muestra el horario de apertura y el de los
 * food».
 *
 * La estructura sale de `yava/app/components/LocationSection.tsx`: mapa a un
 * lado, panel de datos al otro, con el día de hoy destacado. Lo que se AGREGA
 * sobre yava es el acordeón — yava lista los siete días planos, sin desplegar.
 *
 * ⚠️ Es `<details name="hours">` NATIVO, no un acordeón hecho a mano. El
 * atributo `name` compartido hace que abrir uno cierre el otro **sin una línea
 * de JavaScript**, y trae gratis el foco, el teclado y el anuncio del estado a
 * los lectores de pantalla. Un acordeón propio necesitaría `aria-expanded`,
 * manejo de teclas y estado, y sería peor en las tres cosas.
 *
 * Donde el navegador no soporte `name` en `<details>` degrada a siete
 * desplegables independientes: se pueden abrir varios a la vez y nada más. Es
 * una degradación aceptable, no una rotura.
 *
 * ⚠️ HOVER NO. Camila dijo «con el hover o el click», y hay que elegir uno: en
 * táctil no hay hover, y los dos a la vez pelean —el panel se abre solo al
 * pasar el mouse camino a otra cosa—.
 *
 * ⚠️ Los siete días se renderizan en el SERVIDOR. Lo único que aporta el JS es
 * cuál arranca abierto, porque el día depende de `America/New_York` y el
 * servidor no lo sabe sin arriesgar una página cacheada con el día equivocado.
 * Sin JS, la información igual se lee: están todos, cerrados pero alcanzables.
 */

function venueWeekdayIndex(): number {
  const label = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'long',
  }).format(new Date());
  return HOURS.findIndex((h) => h.day === label);
}

export default function FindUs() {
  const lista = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const i = venueWeekdayIndex();
    if (i < 0) return;
    const hoy = lista.current?.querySelectorAll('details')[i];
    if (!hoy) return;
    hoy.open = true;
    hoy.dataset.hoy = 'true';
  }, []);

  return (
    <Section tone="paper" band="lg" labelledBy="find-title" width="full" className="px-0">
      <div className={GUTTER}>
        <div className="caja">
          <SectionHead
            eyebrow="Find us"
            eyebrowTone="deep"
            id="find-title"
            title="Downtown, across from Riverside Park"
          />
        </div>
      </div>

      <div className={`${GUTTER} mt-[40px]`}>
        <div className="caja grid gap-[32px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-[48px]">
          {/* ── El panel de datos ────────────────────────────────────── */}
          <div className="flex flex-col gap-[26px]">
            <div>
              <Eyebrow tone="terra">Hours</Eyebrow>
              {/* ⚠️ Los días y los rótulos Bar/Trucks NO son versalitas.
                  Lo fueron, y eran 21 de los 26 eyebrows de esta sección — más
                  que cualquier otra del sitio. Una versalita es una ETIQUETA de
                  bloque; siete días seguidos y catorce términos de un <dl> son
                  DATOS, y en versalita a 13px se leían como un panel de control.
                  Quedan las cuatro de verdad: Hours, Address, Phone, Parking. */}
              <div ref={lista} className="mt-[12px] border-t border-ink/12">
                {HOURS.map((fila) => (
                  <details
                    key={fila.day}
                    name="hours"
                    className="group border-b border-ink/12 data-[hoy]:border-terra/40"
                  >
                    <summary
                      className="flex cursor-pointer list-none items-center justify-between gap-[14px] py-[13px] transition-colors duration-200 hover:text-deep [&::-webkit-details-marker]:hidden"
                    >
                      <span className="font-body text-[16px] font-medium text-ink group-data-[hoy]:text-terra">
                        {fila.day}
                        {/* El «hoy» se marca con TEXTO y no sólo con color:
                            WCAG 1.4.1 no permite que el color sea el único
                            portador de un dato. */}
                        <span className="hidden group-data-[hoy]:inline"> · today</span>
                      </span>

                      <span className="flex items-center gap-[12px]">
                        {/* El resumen de una línea, para no obligar a abrir
                            los siete días sólo para saber si hoy abren. */}
                        <span className="text-caption tabular-nums text-body/70">
                          {fila.bar === 'Closed' ? 'Closed' : fila.bar}
                        </span>
                        <svg
                          width="11"
                          height="7"
                          viewBox="0 0 11 7"
                          fill="none"
                          aria-hidden="true"
                          className="shrink-0 text-body/50 transition-transform duration-200 group-open:rotate-180"
                        >
                          <path
                            d="M1 1l4.5 4.5L10 1"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </summary>

                    {/* Los dos horarios del día. Van como `<dl>` porque son
                        exactamente eso: pares de término y definición. */}
                    <dl className="grid grid-cols-[auto_1fr] gap-x-[16px] gap-y-[6px] pt-[2px] pb-[16px] pl-[2px]">
                      {/* ⚠️ `body/70` y no `/60`. axe lo midió: al 60% da
                          3.92:1 contra el 4.5:1 que pide un texto de 13px. Al
                          70% da 5.30:1. Un rótulo apagado no puede estarlo
                          tanto que deje de leerse. */}
                      <dt className="font-body text-[15px] font-medium text-body/70">Bar</dt>
                      <dd className="text-[16px] tabular-nums">{fila.bar}</dd>
                      <dt className="font-body text-[15px] font-medium text-body/70">Trucks</dt>
                      <dd className="text-[16px] tabular-nums">{fila.trucks}</dd>
                    </dl>
                  </details>
                ))}
              </div>
            </div>

            <div>
              <Eyebrow tone="terra">Address</Eyebrow>
              <address className="mt-[8px] text-lead not-italic">
                {addressLine()}
                <br />
                <a
                  href={mapsUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-texto text-[16px]"
                >
                  Open in Google Maps
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </address>
            </div>

            <div className="grid gap-[26px] sm:grid-cols-2 lg:grid-cols-1">
              <div>
                <Eyebrow tone="terra">Phone</Eyebrow>
                <p className="mt-[8px] text-lead">
                  <a href={BRAND.contact.phoneHref} className="link-texto">
                    {BRAND.contact.phone}
                  </a>
                </p>
              </div>

              <div>
                <Eyebrow tone="terra">Parking</Eyebrow>
                <p className="mt-[8px] text-[16px] leading-[1.65] text-body/75">
                  Street parking on Old 41 and public lots around Riverside Park.
                </p>
                <div className="mt-[12px]">
                  <ArrowLink href="/visit#parking">Parking details</ArrowLink>
                </div>
              </div>
            </div>
          </div>

          {/*
            Mapa embebido. `loading="lazy"` porque está bien abajo de la página
            y un iframe de Google pesa; `title` porque un iframe sin título es
            un fallo de WCAG 4.1.2.
          */}
          <div className="overflow-hidden rounded-card shadow-photo">
            <iframe
              title={`Map showing ${BRAND.name} at ${addressLine()}`}
              src={`https://www.google.com/maps?q=${BRAND.address.mapsQuery}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[380px] w-full border-0 lg:h-full lg:min-h-[520px]"
            />
          </div>
        </div>
      </div>

      <TilePattern className="mt-[56px]" />
    </Section>
  );
}
