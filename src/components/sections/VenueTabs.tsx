'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useId, useState } from 'react';
import { ArrowRight } from '@/components/shared/Icon';
import { PhotoPending } from '@/components/shared/PendingData';
import Section from '@/components/shared/Section';
import { SectionHead } from '@/components/shared/Type';
import { VENUE_AREAS } from '@/content/venue-areas';

/**
 * «Two floors, five places to be», como lista de pestañas con panel fijo.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ES LA ESTRUCTURA QUE PASÓ CAMILA, 2026-09-16: «para nombrar los Two
 * floors, five places to be creo que podríamos usar esta estructura», con el
 * spec de una sección de feature con tabs.
 *
 * Lo que se toma del spec, que es la mecánica entera:
 *
 *   · dos columnas;
 *   · izquierda, la lista de pestañas como BOTONES separados por filetes de
 *     1px, cada uno con índice en cifras tabulares, título, y una barra
 *     vertical de acento de 2px en el activo;
 *   · el activo despliega su descripción y el resto queda atenuado;
 *   · botones de acción debajo de la lista;
 *   · derecha, panel STICKY a 88px con una barra de rótulo arriba y la imagen
 *     en 4/3 que cambia con la pestaña.
 *
 * ⚠️ LO QUE NO SE TOMA ES LA PIEL, y es el propio pedido: «con el UI y la
 * necesidad de este proyecto, obvio». El spec venía con Geist, #E55100, grilla
 * de 4px y radios de 6/10/14. Nada de eso entra: acá van Big Shoulders y Jost,
 * el acento es `sunset`, los radios son los del tema y el filete es `fog`.
 *
 * ⚠️ Y HAY UNA COSA DEL SPEC QUE SE CAMBIÓ A PROPÓSITO: LA BARRA DE VENTANA
 * FALSA. El original pide «barra de ventana falsa» con tres puntitos, que es el
 * idioma de una captura de producto SaaS. En la página de un bar, tres puntos
 * de macOS arriba de una foto del patio dicen «esto es un screenshot de una
 * app», que es exactamente lo que no es. Se conserva la BARRA —mismos 36px,
 * mismo filete, mismo rótulo en cifras chicas— y adentro va lo que sí es cierto:
 * el piso a la izquierda y el nombre del lugar a la derecha. La composición es
 * idéntica y deja de mentir sobre qué se está mirando.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ REEMPLAZA A LA GRILLA AGRUPADA POR PISO, que es lo que había antes: dos
 * encabezados de piso y debajo las tarjetas de cada uno. Funcionaba, pero
 * mostraba las cinco descripciones a la vez, o sea 900 palabras apiladas en la
 * sección del medio de la página. Con pestañas se lee una por vez y el piso no
 * se pierde: va en el rótulo del panel y en el renglón de cada pestaña.
 *
 * ⚠️ ES CLIENT COMPONENT, y es el único de esta página. Necesita estado para
 * saber qué pestaña está activa. Nada más viaja al bundle: el contenido sale de
 * `VENUE_AREAS`, que es un módulo estático.
 *
 * ⚠️ ROLES ARIA DE VERDAD, no `<div>` con `onClick`. Es un patrón de pestañas
 * reconocido y tiene marcado propio: `tablist` / `tab` / `tabpanel`, con
 * `aria-selected` y `aria-controls`. Sin eso, un lector de pantalla anuncia
 * cinco botones sueltos y un párrafo que cambia solo.
 */
export default function VenueTabs({ id = 'place-title' }: { readonly id?: string }) {
  const [activo, setActivo] = useState(0);
  const base = useId();
  const area = VENUE_AREAS[activo]!;

  const tabId = (i: number) => `${base}-tab-${i}`;
  const panelId = (i: number) => `${base}-panel-${i}`;

  return (
    <Section band="lg" labelledBy={id}>
      <SectionHead
        eyebrow="The place"
        eyebrowTone="plum"
        id={id}
        title="Two floors, five places to be"
        lead="One property, built in layers. The bar went on the roof because that is where the sunset is, and everything else grew underneath it."
      />

      {/*
        ⚠️ `items-start` ES LO QUE HACE FUNCIONAR EL STICKY. Con la alineación
        por defecto —`stretch`— la columna derecha mide lo mismo que la
        izquierda y un `position: sticky` adentro de una caja que ya es tan alta
        como su hermana no tiene recorrido: se queda quieto y parece roto.
      */}
      <div className="mt-bloque grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
        {/* ── La lista de pestañas ─────────────────────────────────────── */}
        <div>
          <div role="tablist" aria-label="Places in the building" className="flex flex-col">
            {VENUE_AREAS.map((a, i) => {
              const activa = i === activo;
              return (
                <button
                  key={a.slug}
                  type="button"
                  role="tab"
                  id={tabId(i)}
                  aria-selected={activa}
                  aria-controls={panelId(i)}
                  tabIndex={activa ? 0 : -1}
                  onClick={() => setActivo(i)}
                  onKeyDown={(e) => {
                    /* Flechas para moverse entre pestañas: es lo que el patrón
                       espera y es la única forma de recorrerlas con teclado,
                       porque las inactivas tienen `tabIndex -1`. */
                    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
                    e.preventDefault();
                    const paso = e.key === 'ArrowDown' ? 1 : -1;
                    const siguiente = (i + paso + VENUE_AREAS.length) % VENUE_AREAS.length;
                    setActivo(siguiente);
                    document.getElementById(tabId(siguiente))?.focus();
                  }}
                  className="flex cursor-pointer items-stretch gap-4 border-t border-fog bg-transparent py-5 text-left"
                >
                  {/*
                    LA BARRA DE ACENTO DE 2px. Ocupa el alto del ítem y sólo se
                    pinta en el activo; en los demás queda transparente y sigue
                    ocupando su lugar, así que el texto no salta al cambiar.
                  */}
                  <span
                    aria-hidden="true"
                    className={`w-0.5 shrink-0 rounded-pill transition-colors duration-200 ease-brand ${
                      activa ? 'bg-sunset' : 'bg-transparent'
                    }`}
                  />

                  <span className="flex min-w-0 flex-col gap-1.5">
                    <span className="flex items-baseline gap-2.5">
                      <span className="font-body text-micro font-medium tabular-nums tracking-label text-muted">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={`font-display text-d5 font-bold uppercase leading-none transition-colors duration-200 ease-brand ${
                          activa ? 'text-ink' : 'text-muted'
                        }`}
                      >
                        {a.name}
                      </span>
                    </span>

                    {/*
                      ⚠️ LA DESCRIPCIÓN SÓLO EXISTE EN LA PESTAÑA ACTIVA, y no
                      está escondida con `hidden` en las otras cuatro: si
                      estuvieran todas en el DOM, un lector de pantalla leería
                      las cinco descripciones seguidas y el patrón de pestañas
                      dejaría de significar nada.
                    */}
                    {activa ? (
                      <span className="flex flex-col gap-2.5 pt-1">
                        <span className="font-body text-micro font-bold uppercase tracking-cta text-muted">
                          {a.floor}
                        </span>
                        <span className="max-w-[46ch] font-body text-base font-light leading-[1.6] text-body">
                          {a.body}
                        </span>
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>

          {/*
            Los botones de acción debajo de la lista, como pide el spec. El
            primero es el del área activa y cambia con ella; el segundo es fijo.
          */}
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-fog pt-6">
            {area.href ? (
              <Link
                href={area.href}
                className="group inline-flex items-center gap-2.25 border-b-2 border-sunset pb-0.75 font-body text-base font-semibold text-ink transition-colors duration-200 hover:text-sunset-deep"
              >
                Go to {area.name}
                <ArrowRight className="size-3.5 text-sunset-deep transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            ) : null}
            <Link
              href="/events"
              className="group inline-flex items-center gap-2.25 font-body text-base font-medium text-muted transition-colors duration-200 hover:text-ink"
            >
              Rent any of it
              <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* ── El panel fijo ────────────────────────────────────────────── */}
        <div
          role="tabpanel"
          id={panelId(activo)}
          aria-labelledby={tabId(activo)}
          className="overflow-hidden rounded-shell border border-fog bg-paper lg:sticky lg:top-22"
        >
          {/* La barra de rótulo. Ver la nota del encabezado sobre por qué no
              lleva los tres puntos de ventana falsa. */}
          <div className="flex h-9 items-center justify-between gap-4 border-b border-fog bg-bone px-4">
            <span className="font-body text-micro font-bold uppercase tracking-cta text-muted">
              {area.floor}
            </span>
            <span className="truncate font-body text-micro font-medium tabular-nums text-muted">
              {String(activo + 1).padStart(2, '0')} / {String(VENUE_AREAS.length).padStart(2, '0')}
            </span>
          </div>

          <div className="relative aspect-[4/3] bg-fog">
            {area.photo ? (
              <Image
                key={area.slug}
                src={area.photo}
                alt={area.photoAlt ?? area.name}
                fill
                sizes="(min-width: 1024px) 600px, 92vw"
                className="object-cover"
              />
            ) : (
              <PhotoPending brief={area.photoBrief} ratio="aspect-[4/3]" className="h-full" />
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
