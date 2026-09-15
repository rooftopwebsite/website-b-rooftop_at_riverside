import type { Metadata } from 'next';
import { getVenue, venueAddressLine } from '@/lib/venue';
import Image from 'next/image';
import Link from 'next/link';
import StoryHero from '@/components/sections/StoryHero';
import { ButtonLink } from '@/components/shared/Button';
import MapEmbed from '@/components/shared/MapEmbed';
import { RevealItem, StaggerGroup } from '@/components/shared/Motion';
import { PendingBlock, PhotoPending } from '@/components/shared/PendingData';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
import { PEOPLE } from '@/content/people';
import { VENUE_AREAS } from '@/content/venue-areas';
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
 * ⚠️ RITMO DE SUPERFICIE. Cinco secciones, UNA sola oscura y es la última:
 * bone (hero) → paper → bone → paper → deep. Es la proporción de la home
 * (70–75 % claro) y la regla de que `deep` es puntuación, no fondo.
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

/** Los dos pisos, en el orden en que se recorren. */
const FLOORS = ['Second floor', 'Ground floor'] as const;

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

      <StoryHero />

      {/* ══ 2. De qué está hecho ══════════════════════════════════════════ */}

      <Section band="lg" labelledBy="place-title">
        <SectionHead
          eyebrow="The place"
          eyebrowTone="plum"
          id="place-title"
          title="Two floors, five places to be"
          lead="One property, built in layers. The bar went on the roof because that is where the sunset is, and everything else grew underneath it."
        />

        {FLOORS.map((floor) => {
          const areas = VENUE_AREAS.filter((a) => a.floor === floor);
          if (areas.length === 0) return null;
          const fid = `floor-${floor.replace(/\s+/g, '-').toLowerCase()}`;

          return (
            <div key={floor} className="mt-[56px] first:mt-[48px]">
              <div className="flex items-baseline gap-[16px]">
                <Heading level={3} id={fid} role="label">
                  {floor}
                </Heading>
                <span aria-hidden="true" className="h-[2px] flex-1 bg-ink/12" />
              </div>

              <StaggerGroup
                as="ul"
                className="mt-[28px] flex list-none flex-col gap-[40px] lg:gap-[56px]"
                aria-label={`${floor}: ${areas.map((a) => a.name).join(', ')}`}
              >
                {areas.map((area, i) => (
                  <RevealItem as="li" key={area.slug}>
                    <article
                      className={[
                        'grid items-center gap-[20px] lg:grid-cols-2 lg:gap-[48px]',
                        // Alterna el lado de la foto. En mobile siempre arriba.
                        i % 2 === 1 ? 'lg:[&>figure]:order-2' : '',
                      ].join(' ')}
                    >
                      <figure className="relative m-0 aspect-[4/3] w-full overflow-hidden">
                        {area.photo ? (
                          <Image
                            src={area.photo}
                            alt={area.photoAlt ?? area.name}
                            fill
                            sizes="(min-width: 1024px) 50vw, 100vw"
                            className="object-cover"
                          />
                        ) : (
                          <PhotoPending brief={area.photoBrief} ratio="aspect-[4/3]" />
                        )}
                      </figure>

                      <div>
                        <Heading level={4}>{area.name}</Heading>
                        <p className="mt-[12px] max-w-[46ch] text-[16px] leading-[1.7] text-body/80">
                          {area.body}
                        </p>
                        {area.href ? (
                          <p className="mt-[16px]">
                            <Link href={area.href} className="link-texto font-bold">
                              {area.name === 'The stage'
                                ? 'See what is on'
                                : `More about ${area.name}`}
                            </Link>
                          </p>
                        ) : null}
                      </div>
                    </article>
                  </RevealItem>
                ))}
              </StaggerGroup>
            </div>
          );
        })}
      </Section>

      {/* ══ 3. La gente ═══════════════════════════════════════════════════ */}

      <Section tone="bone" band="lg" labelledBy="people-title">
        <SectionHead
          eyebrow="The people"
          eyebrowTone="deep"
          id="people-title"
          title="Two of them run it"
          lead="A family from Bonita Springs and the person who opens the place. Both of their inboxes are below, and both of them read them."
        />

        {/*
          ⚠️ TRATAMIENTO EDITORIAL, NO DOS TARJETAS IGUALES. El fundador tiene
          una cita publicada y el gerente no, así que darles la misma caja
          sería inventarle una voz al segundo o desperdiciar la del primero.
          Chris va en ancho de artículo con la cita como pieza tipográfica;
          Anthony va en una entrada más corta al costado.
        */}
        <div className="mt-[48px] grid gap-[48px] lg:grid-cols-[1.35fr_1fr] lg:gap-[64px]">
          {PEOPLE.map((p, i) => (
            <article key={p.name} className={i === 0 ? '' : 'lg:pt-[56px]'}>
              <div className="flex items-start gap-[20px]">
                <div className="w-[104px] shrink-0 lg:w-[132px]">
                  {p.photo ? (
                    <Image
                      src={p.photo}
                      alt={p.photoAlt ?? p.name}
                      width={132}
                      height={176}
                      sizes="132px"
                      className="aspect-[3/4] w-full object-cover"
                    />
                  ) : (
                    <PhotoPending
                      brief={`Retrato de ${p.name}, vertical, en el local.`}
                      ratio="aspect-[3/4]"
                      tone="light"
                    />
                  )}
                </div>

                <div className="min-w-0">
                  <Heading level={3} className={i === 0 ? 'text-d5 lg:text-d4' : 'text-d6 lg:text-d5'}>
                    {p.name}
                  </Heading>
                  <Eyebrow tone="plum" className="mt-[8px]">
                    {p.role}
                  </Eyebrow>
                  {p.email ? (
                    <p className="mt-[10px] text-[16px]">
                      <a href={`mailto:${p.email}`} className="link-texto break-all">
                        {p.email}
                      </a>
                    </p>
                  ) : null}
                </div>
              </div>

              {p.bio ? (
                <p className="mt-[20px] max-w-[52ch] text-[16px] leading-[1.7] text-body/80">
                  {p.bio}
                </p>
              ) : (
                <div className="mt-[20px] max-w-[52ch]">
                  <PendingBlock title={`Short bio for ${p.name}`}>
                    Two or three sentences in their own words. Nothing here is written by AI, so
                    this stays empty until they send it.
                  </PendingBlock>
                </div>
              )}

              {p.quote ? (
                <figure className="mt-[28px] border-l-2 border-sunset pl-[20px] lg:pl-[28px]">
                  <blockquote>
                    <p className="font-display text-d5 uppercase leading-[1.15] lg:text-d4">
                      {p.quote}
                    </p>
                  </blockquote>
                  <figcaption className="mt-[14px] eyebrow text-body/75">
                    {p.name}, {p.role}
                  </figcaption>
                </figure>
              ) : null}
            </article>
          ))}
        </div>
      </Section>

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
