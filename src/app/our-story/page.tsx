import type { Metadata } from 'next';
import { getVenue, venueAddressLine } from '@/lib/venue';
import Image from 'next/image';
import AboutHero from '@/components/sections/AboutHero';
import AboutStory from '@/components/sections/AboutStory';
import HowToOrder from '@/components/sections/HowToOrder';
import { ButtonLink } from '@/components/shared/Button';
import MapEmbed from '@/components/shared/MapEmbed';
import { RevealItem, StaggerGroup } from '@/components/shared/Motion';
import { PendingBlock, PhotoPending } from '@/components/shared/PendingData';
import Section from '@/components/shared/Section';
import { Heading, SectionHead } from '@/components/shared/Type';
import { PEOPLE } from '@/content/people';
import VenueTabs from '@/components/sections/VenueTabs';
import { BRAND, addressLine } from '@/lib/brand';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  route: '/our-story',
  image: {
    url: '/images/venue/venue-aerial.jpg',
    width: 1000,
    height: 667,
    alt: 'The yard at Rooftop at Riverside seen from the rooftop',
  },
});

/**
 * `/our-story` — de dónde salió el lugar, de qué está hecho y quién lo maneja.
 *
 * ⚠️ TODO LO QUE SE AFIRMA ACÁ ESTÁ EN EL SITIO VIGENTE O EN EL BRIEF. Los
 * nombres y cargos de las dos personas salen de `/this-is-us`; la cita de
 * Chris es textual de ahí; el rebrand de la cancha a «the Yard» y del bar de
 * arriba a «Sunset Bar» lo confirmó el cliente en el check-in del 9 de
 * septiembre de 2026. Las bios y los retratos NO existen en ninguna fuente y
 * por eso salen como pendiente visible.
 *
 * ⚠️ RITMO DE SUPERFICIE. Siete secciones y DOS oscuras, y antes eran cinco
 * con una sola: bone (hero) → paper (el relato) → paper (los espacios) → deep
 * (el equipo) → paper (cómo se pide) → paper (el mapa) → deep (el cierre).
 *
 * Las dos oscuras no quedan pegadas, que era el riesgo, y la proporción sigue
 * en el 70 % claro de la home. Lo que cambió es que la banda del equipo ahora
 * es oscura: viene del calco de `/over-ons`, donde «meet the team» es la única
 * banda oscura de la página.
 *
 * ⚠️ NO HAY SECCIÓN DE PREGUNTAS FRECUENTES. Decisión de Camila del
 * 2026-09-15: «mejor no pongamos preguntas frecuentes». Los datos siguen en
 * `content/faq.ts`, sin renderizar. Ojo: `/faq` redirige con 301 a
 * `/our-story#faq`, un ancla que ya no existe.
 *
 * ⚠️ MOTION: la idea fuerte vive en `StoryHero` y en ningún otro lado. El
 * resto de la página usa `StaggerGroup`/`RevealItem`, que son los reveals del
 * sistema y ya cortocircuitan con `prefers-reduced-motion`.
 */

export default async function OurStoryPage() {
  const venue = await getVenue();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(breadcrumbJsonLd([{ name: 'Our story', path: '/our-story' }])),
        }}
      />

      <AboutHero />

      {/* ══ 2. El relato ══════════════════════════════════════════════════ */}

      <AboutStory />

      {/* ══ 2. De qué está hecho ══════════════════════════════════════════ */}

      {/*
        ⚠️ ERA UNA GRILLA AGRUPADA POR PISO Y AHORA SON PESTAÑAS. La estructura
        la eligió Camila, 2026-09-16, y el porqué de cada decisión está arriba de
        `VenueTabs`. Los cinco textos y las cinco fotos son los mismos.
      */}
      <VenueTabs />
      {/* ══ 3. La gente ═══════════════════════════════════════════════════ */}

      {/*
        ══════════════════════════════════════════════════════════════════
        ⚠️ ES «MEET THE TEAM» DE defoodtruckclub.nl/over-ons, CALCADO DE LA
        CAPTURA QUE MANDÓ CAMILA. Pedido literal, 2026-09-16: «para la parte de
        Meet the team copiá esta parte que te dejo en foto tal cual».

        La anatomía de la captura, elemento por elemento:

            banda oscura
            titular centrado, display, caja alta
            renglón de conteo debajo, centrado, en el color de acento
            fila de retratos en blanco y negro, esquinas redondeadas
            el nombre debajo de cada uno, centrado y en caja alta

        ⚠️ EL RENGLÓN DE CONTEO NO PUEDE DECIR UN NÚMERO INVENTADO. Allá dice
        «90 gepassioneerde foodtruckers». Acá el único número verdadero es dos:
        son las dos personas que el cliente publica con nombre y cargo en
        `/this-is-us`. Dice eso y nada más.

        ⚠️ VA EN `cream` Y NO EN `sunset`, aunque el acento de la captura sea el
        rosa de su marca. Medido: `sunset` sobre `deep` da 4.26:1 y este renglón
        es texto normal de 22px, que necesita 4.5. `cream` da 11.87:1 y es el
        acento que el sitio ya usa sobre losa oscura.

        ⚠️ SIN FLECHA DE CARRUSEL. En la captura la fila sigue más allá del
        borde derecho y hay un botón redondo para avanzar. Con DOS personas no
        hay nada a lo que avanzar: una flecha que no lleva a ningún lado es el
        control roto que este proyecto ya sacó de otros lados.
        ══════════════════════════════════════════════════════════════════
      */}
      <Section tone="deep" band="lg" labelledBy="people-title">
        <div className="text-center">
          <Heading level={2} id="people-title" className="text-d3 lg:text-d2">
            Meet the team
          </Heading>
          <p className="m-0 mt-4 font-body text-lead font-light text-cream">
            Two of them run the place
          </p>
        </div>

        {/*
          ⚠️ LA FILA TIENE ANCHO TOPE Y VA CENTRADA. En la captura son nueve
          retratos y la fila llena la banda; con dos, sueltos al ancho de la
          caja cada uno mediría 572px y la sección se leería como dos fotos
          enormes de dos desconocidos. El tope los deja en ~340px, que es la
          medida a la que un retrato 3:4 funciona.
        */}
        <StaggerGroup
          as="ul"
          className="mx-auto mt-bloque grid max-w-[46rem] list-none grid-cols-1 gap-10 p-0 sm:grid-cols-2 sm:gap-8"
        >
          {PEOPLE.map((p) => (
            <RevealItem as="li" key={p.name}>
              <article className="text-center">
                {p.photo ? (
                  /*
                    ⚠️ `grayscale` ESTÁ PUESTO Y HOY NO SE VE, porque ninguno de
                    los dos tiene retrato. Va igual: es parte de lo que se pidió
                    copiar tal cual, y dejarlo escrito ahora significa que el día
                    que lleguen las fotos la sección ya se ve como la referencia
                    en vez de descubrirse en ese momento que faltaba.

                    Si con las fotos delante el blanco y negro no funciona, se
                    saca una clase.
                  */
                  <div className="relative aspect-[3/4] overflow-hidden rounded-shell bg-deeper sombra-card">
                    <Image
                      src={p.photo}
                      alt={p.photoAlt ?? p.name}
                      fill
                      sizes="(min-width: 640px) 340px, 90vw"
                      className="object-cover grayscale"
                    />
                  </div>
                ) : (
                  <PhotoPending
                    brief={`Retrato de ${p.name}, vertical 3:4, en el local. Va en blanco y negro.`}
                    ratio="aspect-[3/4]"
                    tone="dark"
                  />
                )}

                {/* El nombre debajo del retrato, centrado y en caja alta, como
                    la captura. El cargo va un escalón abajo: la referencia no
                    lo muestra, pero sin él «Anthony Hayes» no dice nada. */}
                <Heading level={3} className="mt-6 text-d5">
                  {p.name}
                </Heading>
                <p className="m-0 mt-2 font-body text-caption font-bold uppercase tracking-eyebrow text-muted-dark">
                  {p.role}
                </p>
                {p.email ? (
                  <p className="m-0 mt-3.5 font-body text-base">
                    <a href={`mailto:${p.email}`} className="link-texto break-all text-cream">
                      {p.email}
                    </a>
                  </p>
                ) : null}

                {p.bio ? (
                  <p className="m-0 mt-5 font-body text-base font-light leading-[1.65] text-paper/90">
                    {p.bio}
                  </p>
                ) : (
                  <div className="mt-6 text-left">
                    <PendingBlock tone="dark" title={`Short bio for ${p.name}`}>
                      Faltan dos o tres frases en sus propias palabras. Nada de este sitio lo
                      escribe una máquina, así que esto queda vacío hasta que las manden.
                    </PendingBlock>
                  </div>
                )}
              </article>
            </RevealItem>
          ))}
        </StaggerGroup>
      </Section>

      {/*
        ══════════════════════════════════════════════════════════════════
        ⚠️ EL BLOQUE DE DOS TARJETAS ENFRENTADAS, que en la referencia es
        «ventajas de trabajar con nosotros» y acá es «cómo se pide». El
        reemplazo lo decidió Camila el 2026-09-16 y el porqué entero está
        arriba de `HowToOrder`.

        ⚠️ ES EL MISMO COMPONENTE QUE USAN LAS CUATRO FICHAS DE TRUCK, a
        propósito: la referencia también repite su comparativo en las dos
        páginas. Y en este caso la repetición trabaja, porque lo que explica es
        el malentendido de raíz del negocio.
        ══════════════════════════════════════════════════════════════════
      */}
      <HowToOrder />

      {/* ══ 4. Dónde queda ════════════════════════════════════════════════ */}

      <Section band="lg" labelledBy="where-title">
        <div className="grid gap-[40px] lg:grid-cols-2 lg:gap-[64px]">
          <div>
            <SectionHead
              eyebrow="Getting here"
              eyebrowTone="deep"
              id="where-title"
              title="Downtown, across from the park"
            />

            <address className="mt-gap-bajada not-italic">
              <p className="text-lead leading-[1.5]">
                {venue.street}
                <br />
                {venue.locality}, {venue.region} {venue.postalCode}
              </p>
              <p className="mt-[12px] text-[16px] text-body/80">{venue.neighborhood}</p>
              <p className="mt-[16px] text-[16px]">
                <a href={venue.phoneHref} className="link-texto font-bold">
                  {venue.phone}
                </a>
              </p>
            </address>

            {/*
              ⚠️ ACÁ IBA UN PÁRRAFO DE ESTACIONAMIENTO Y SE SACÓ EL 2026-09-15.
              Decía «street parking on Old 41, y los lotes públicos de Riverside
              Park, los dos gratis». Ninguna de esas tres afirmaciones está en
              ninguna fuente: el sitio vigente tiene una página `/parking` con
              un PDF de mapa, pero el PDF es una imagen sin texto. Sabemos que
              hay un mapa, no sabemos qué dice.
              TODO: confirmar con cliente el contenido del mapa de parking.
            */}
          </div>

          <MapEmbed />
        </div>
      </Section>

      {/* ══ 5. Cierre ═════════════════════════════════════════════════════ */}

      <Section tone="deep" band="lg" labelledBy="next-title">
        <Heading level={2} id="next-title" className="max-w-[16ch]">
          Come see it on a Wednesday
        </Heading>
        <p className="bajada mt-gap-bajada max-w-[52ch] text-paper/85">
          The calendar is the honest version of this page. Or, if you are the one throwing the
          party, we close the whole place.
        </p>
        <div className="mt-gap-cta flex flex-wrap gap-[14px]">
          <ButtonLink href="/whats-on" variant="primary">
            See the calendar
          </ButtonLink>
          <ButtonLink href="/events" variant="ghostDark">
            Plan an event
          </ButtonLink>
        </div>
        <p className="mt-[28px] text-[16px] text-paper/70">
          {venueAddressLine(venue)} &middot;{' '}
          <a href={venue.phoneHref} className="link-texto text-paper">
            {venue.phone}
          </a>
        </p>
      </Section>
    </>
  );
}
