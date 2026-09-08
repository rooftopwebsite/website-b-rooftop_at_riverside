import Image from 'next/image';
import Link from 'next/link';
import { ArrowLink, ButtonLink } from '@/components/shared/Button';
import { Marquee, Reveal, RevealItem, StaggerGroup } from '@/components/shared/Motion';
import { PhotoPending } from '@/components/shared/PendingData';
import PinnedList, { type PinnedItem } from '@/components/shared/PinnedList';
import Section, { GUTTER } from '@/components/shared/Section';
import TilePattern from '@/components/shared/TilePattern';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
import { HAPPY_HOUR, addressLine, mapsUrl, BRAND } from '@/lib/brand';
import { recurringEvents, whenLabel } from '@/content/events';

/* ==========================================================================
   Marquee de features
   ========================================================================== */

const FEATURES = [
  'Rooftop',
  '4 Food Trucks',
  'Live Music',
  'Happy Hour',
  'Dog Friendly',
  'Private Events',
] as const;

export function FeaturesMarquee() {
  return (
    <div className="border-y border-ink/12 bg-paper py-[18px]">
      {/* El marquee es decorativo y repite lo que ya dicen las secciones, así
          que `aria-hidden`: leer seis palabras sueltas en bucle no aporta nada
          a alguien con lector de pantalla. */}
      <div aria-hidden="true">
        <Marquee durationSeconds={40}>
          {FEATURES.map((f) => (
            <span
              key={f}
              className="flex items-center gap-[28px] px-[14px] font-display text-d6 uppercase whitespace-nowrap lg:text-d5"
            >
              {f}
              <span className="inline-block h-[7px] w-[7px] rotate-45 bg-river" />
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  );
}

/* ==========================================================================
   How this place works — el módulo que desarma la confusión
   ========================================================================== */

/**
 * ⚠️ Las etiquetas de cada paso son datos YA confirmados en otro lado del
 * sitio: los cuatro camiones, el happy hour de `HAPPY_HOUR`, las cinco noches
 * de música. No hay ni un dato nuevo acá. Este módulo explica, no anuncia.
 */
const STEPS: readonly PinnedItem[] = [
  {
    n: '01',
    title: 'Order at whichever window you want',
    body: 'Four trucks park in the yard and each one is somebody’s own business. You order at the window, you pay that truck. Separate line, separate card, separate receipt.',
    tags: ['Four independent kitchens', 'Order at the window', 'A tab per truck', 'No table service'],
  },
  {
    n: '02',
    title: 'Get your drinks upstairs',
    body: 'The Sunset Bar on the roof is ours. Cocktails made that morning, drafts from breweries twenty minutes away. It’s the one tab we run, and the only menu on this site with prices.',
    tags: ['Cocktails made daily', 'Local drafts', `Happy hour ${HAPPY_HOUR.days}, ${HAPPY_HOUR.time}`, 'The one tab we run'],
  },
  {
    n: '03',
    title: 'Stay for whoever’s playing',
    body: 'Live music five nights a week, Bingo on Wednesdays, DJ sets late on Saturdays. Almost all of it is free and none of it needs a ticket.',
    tags: ['Live music five nights', 'Bingo Wednesdays', 'DJ sets Saturdays', 'No ticket, no cover'],
  },
];

/**
 * El módulo que desarma la confusión, contado con el scroll.
 *
 * ⚠️ Cambia la FORMA, no el contenido: eran tres columnas que se leían de un
 * vistazo y ahora es una lista fijada que se abre de a un paso. La razón es que
 * el orden importa —primero pedís, después subís, después te quedás— y tres
 * columnas en paralelo no dicen que hay una secuencia. Ver `PinnedList` para
 * el mecanismo y para qué pasa sin JS.
 *
 * ⚠️ El `Section` va sin `band`: el alto lo pone `PinnedList`, y un padding
 * vertical grande encima del recorrido de varias pantallas sólo agrega vacío.
 */
export function HowThisPlaceWorks() {
  return (
    <Section bandTop="lg" bandBottom="sm" labelledBy="how-title">
      <PinnedList
        items={STEPS}
        head={
          <SectionHead
            eyebrow="How this place works"
            eyebrowTone="deep"
            id="how-title"
            title={
              <>
                Five businesses, <br className="hidden sm:block" />
                one set of stairs.
              </>
            }
            lead="It catches people out the first time, so here it is plainly."
          >
            {/* La columna izquierda queda fijada varias pantallas: sin una
                salida, es mucho aire sostenido sin nada que hacer. El enlace
                va ACÁ y no dentro de los ítems, que se pliegan — un enlace
                enfocable dentro de un bloque con `overflow: hidden` recibe
                foco en una zona que no se ve. */}
            <ArrowLink href="/the-yard" className="mt-[26px]">
              See how the yard is laid out
            </ArrowLink>
          </SectionHead>
        }
      />
    </Section>
  );
}

/* ==========================================================================
   Los tres verticales
   ========================================================================== */

const VERTICALS = [
  {
    href: '/food-trucks',
    eyebrow: 'The yard',
    title: 'Food Trucks',
    body: 'Four rotating kitchens, each one its own business. Tacos, seafood, smashburgers, Caribbean.',
    photo: '/images/venue-truck-line.jpg',
    alt: 'Food trucks lined up in the yard at Rooftop at Riverside at dusk',
  },
  {
    href: '/sunset-bar',
    eyebrow: 'The roof',
    title: 'Sunset Bar',
    body: 'Our bar. Craft cocktails made daily, local drafts, and the best seat over the Imperial River.',
    photo: '/images/venue-rooftop.jpg',
    alt: 'The rooftop bar at Rooftop at Riverside overlooking the river',
  },
  {
    href: '/events',
    eyebrow: 'The whole place',
    title: 'Private Events',
    body: 'Corporate nights, holiday parties, fundraisers and full buyouts. We coordinate the trucks for you.',
    photo: '/images/events/event-a.jpg',
    alt: 'Guests at a private event at Rooftop at Riverside',
  },
] as const;

export function ThreeVerticals() {
  return (
    <Section band="lg" labelledBy="verticals-title" tone="paper">
      <SectionHead
        eyebrow="Three ways in"
        eyebrowTone="plum"
        id="verticals-title"
        title="Pick your night"
      />

      <StaggerGroup as="ul" className="mt-[48px] grid gap-[28px] md:grid-cols-3">
        {VERTICALS.map((v) => (
          <RevealItem as="li" key={v.href}>
            <Link href={v.href} className="group flex h-full flex-col">
              <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-mint">
                <Image
                  src={v.photo}
                  alt={v.alt}
                  fill
                  sizes="(max-width: 767px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-brand group-hover:scale-[1.03]"
                />
              </div>
              <Eyebrow tone="deep" className="mt-[18px]">
                {v.eyebrow}
              </Eyebrow>
              <Heading level={3} className="mt-[6px]">
                {v.title}
              </Heading>
              <p className="mt-[10px] flex-1 text-[15px] leading-[1.65] text-body/75">{v.body}</p>
              <span
                aria-hidden="true"
                className="mt-[16px] inline-flex items-center gap-[8px] text-caption font-bold uppercase tracking-[0.14em]"
              >
                <span className="underline decoration-ink/45 decoration-1 underline-offset-4 transition-[text-decoration-color] group-hover:decoration-sunset group-hover:decoration-2">
                  See more
                </span>
                <svg width="15" height="10" viewBox="0 0 16 10" fill="none">
                  <path
                    d="M0 5h14M10 1l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform duration-250 group-hover:translate-x-[3px]"
                  />
                </svg>
              </span>
            </Link>
          </RevealItem>
        ))}
      </StaggerGroup>
    </Section>
  );
}

/* ==========================================================================
   For event planners — el bloque que más plata deja del home
   ========================================================================== */

const PLANNER_STEPS = [
  {
    n: '01',
    href: '/events/inquire',
    title: 'Request a proposal',
    body: 'One screen, two minutes. You get the events packet the moment you send it.',
    cta: 'Start the request',
  },
  {
    n: '02',
    href: '/events/inquire',
    title: 'Get the events packet',
    body: 'Spaces, food tiers, what we coordinate and what the trucks handle. A PDF, immediately.',
    cta: 'Download the packet',
  },
  {
    n: '03',
    href: '/events/spaces',
    title: 'See the spaces',
    body: 'The rooftop, the yard, the patio, or the whole place with the doors closed.',
    cta: 'View spaces',
  },
] as const;

export function ForEventPlanners() {
  return (
    <Section tone="paper" band="lg" labelledBy="planners-title">
      {/* Este es el ÚNICO bloque de acento naranja de la home. El brief
          permite uno por página, y le corresponde a la vertical que factura
          entre $10.000 y $30.000 por evento. */}
      {/*
        Slot 6 del vocabulario de motion: el texto queda STICKY mientras pasan
        los tres pasos.

        ⚠️ Hecho con `position: sticky` puro, sin JS y sin scroll-jacking. El
        scroll sigue siendo el del navegador: no se secuestra, no se pinea la
        página, no se cambia la velocidad. Sólo un elemento que se queda quieto
        dentro de su contenedor, que es exactamente para lo que existe `sticky`.

        ⚠️ Sólo desde `lg`. En un teléfono no hay ancho para dos columnas y el
        sticky no tendría contra qué quedarse fijo: ahí el bloque se apila y
        listo. El layout es el mismo con o sin animación.
      */}
      <div className="rounded-card bg-sunset px-[24px] py-[40px] text-ink lg:px-[56px] lg:py-[56px]">
        <div className="grid gap-[40px] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-[64px]">
          <div className="lg:sticky lg:top-[calc(var(--spacing-header)+34px+48px)] lg:self-start">
            {/* Sobre naranja el texto va en NEGRO. 8.26:1. Nunca en blanco. */}
            <Eyebrow tone="ink">Planning a work event?</Eyebrow>
            <Heading level={2} id="planners-title" className="mt-gap-kicker">
              We close the whole place for you
            </Heading>
            <p className="mt-gap-bajada max-w-[46ch] text-lead">
              Holiday parties, client nights, fundraisers and reunions. You get the rooftop, the
              yard and four kitchens — and one person coordinating all of it.
            </p>
          </div>

          <ol className="flex flex-col gap-[28px]">
            {PLANNER_STEPS.map((s) => (
              <li key={s.n} className="flex flex-col border-t-2 border-ink/30 pt-[18px]">
                <span aria-hidden="true" className="eyebrow text-ink/80">
                  Step {s.n}
                </span>
                <Heading level={3} className="mt-[10px]">
                  {s.title}
                </Heading>
                <p className="mt-[8px] max-w-[46ch] text-[15px] leading-[1.6] text-ink/85">
                  {s.body}
                </p>
                <div className="mt-[18px]">
                  <ButtonLink href={s.href} variant="dark">
                    {s.cta}
                  </ButtonLink>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}

/* ==========================================================================
   This week
   ========================================================================== */

export function ThisWeek() {
  const events = recurringEvents();

  return (
    <Section tone="cream" band="lg" labelledBy="week-title">
      <div className="flex flex-col gap-[10px] sm:flex-row sm:items-end sm:justify-between">
        <SectionHead
          eyebrow="This week"
          eyebrowTone="deep"
          id="week-title"
          title="Every week, on repeat"
          lead="The standing lineup. One-off shows and festivals live on the calendar."
        />
        <ArrowLink href="/whats-on" className="shrink-0 text-deep">
          All events
        </ArrowLink>
      </div>

      <StaggerGroup as="ul" className="mt-[40px] grid gap-[20px] sm:grid-cols-2">
        {events.map((e) => (
          <RevealItem as="li" key={e.slug}>
            <Link
              href={`/whats-on/${e.slug}`}
              className="group flex h-full flex-col rounded-card border border-ink/12 bg-paper p-[24px] transition-colors duration-250 hover:border-ink/35"
            >
              <Eyebrow tone="terra">{whenLabel(e)}</Eyebrow>
              <Heading level={3} className="mt-[10px]">
                {e.title}
              </Heading>
              <p className="mt-[10px] flex-1 text-[15px] leading-[1.6] text-body/75">{e.summary}</p>
              <span className="mt-[16px] text-caption font-bold uppercase tracking-[0.14em] text-body/70">
                {e.space} · {e.price === null ? 'Free' : `$${e.price}`}
              </span>
            </Link>
          </RevealItem>
        ))}
      </StaggerGroup>

      <p className="mt-[28px] text-[15px] text-body/70">
        <span className="eyebrow text-deep">Happy hour</span>{' '}
        <span className="ml-[6px]">
          {HAPPY_HOUR.days}, {HAPPY_HOUR.time} — {HAPPY_HOUR.deals.join(' · ')}
        </span>
      </p>
    </Section>
  );
}

/* ==========================================================================
   Our story — teaser
   ========================================================================== */

export function StoryTeaser() {
  return (
    <Section band="lg" labelledBy="story-title">
      <div className="grid items-center gap-[40px] lg:grid-cols-2 lg:gap-[72px]">
        <Reveal className="relative aspect-[4/3] overflow-hidden rounded-card bg-mint">
          <Image
            src="/images/venue-story.jpg"
            alt="The Rooftop at Riverside park in downtown Bonita Springs"
            fill
            sizes="(max-width: 1023px) 100vw, 50vw"
            className="object-cover"
          />
        </Reveal>

        <div>
          <Eyebrow tone="plum">Our story</Eyebrow>
          <Heading level={2} id="story-title" className="mt-gap-kicker">
            Four years of planning, by people from here
          </Heading>
          {/* Cita real del cliente, de /this-is-us. Nada generado. */}
          <blockquote className="mt-gap-bajada border-l-2 border-sunset pl-[20px]">
            <p className="text-intro leading-[1.4] text-body/85">
              &ldquo;We hope this park will be a staple for families in the community, a symbol for
              up and coming entrepreneurs and business owners, and a landmark our kids would be
              proud of.&rdquo;
            </p>
            <footer className="mt-[14px] eyebrow text-body/60">
              Chris Magnus — Founder &amp; Operator
            </footer>
          </blockquote>
          <div className="mt-[28px]">
            <ArrowLink href="/our-story">Read the story</ArrowLink>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ==========================================================================
   Find us
   ========================================================================== */

export function FindUs() {
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
        <div className="caja grid gap-[32px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-[48px]">
          <div className="flex flex-col gap-[24px]">
            <div>
              <Eyebrow tone="terra">Address</Eyebrow>
              <address className="mt-[8px] text-lead not-italic">
                {addressLine()}
                <br />
                <a
                  href={mapsUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-texto text-[15px]"
                >
                  Open in Google Maps
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </address>
            </div>

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
              <p className="mt-[8px] text-[15px] leading-[1.65] text-body/75">
                Street parking on Old 41 and public lots around Riverside Park.
              </p>
              <div className="mt-[12px]">
                <ArrowLink href="/visit#parking">Parking details</ArrowLink>
              </div>
            </div>
          </div>

          {/*
            Mapa embebido. `loading="lazy"` porque está bien abajo de la página
            y un iframe de Google pesa; `title` porque un iframe sin título es
            un fallo de WCAG 4.1.2.
          */}
          <div className="overflow-hidden rounded-card border border-ink/12">
            <iframe
              title={`Map showing ${BRAND.name} at ${addressLine()}`}
              src={`https://www.google.com/maps?q=${BRAND.address.mapsQuery}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[340px] w-full border-0 lg:h-[420px]"
            />
          </div>
        </div>
      </div>

      <TilePattern className="mt-[56px]" />
    </Section>
  );
}

/* ==========================================================================
   Reviews — ESCRITO Y SIN USAR, a propósito
   ========================================================================== */

/**
 * ⚠️ NO SE MONTA. El brief: «No montes módulo de reviews. Los ratings del
 * cliente no están confirmados. Dejá el componente escrito y sin usar.»
 *
 * Queda acá listo para cuando se confirmen. No se importa en ninguna página.
 * El día que se use hay que traer las reviews de una fuente real —Google o
 * Yelp— y nunca escribirlas a mano.
 */
export function ReviewsMarquee({
  reviews,
}: {
  readonly reviews: readonly { quote: string; author: string; source: string }[];
}) {
  if (reviews.length === 0) return null;

  return (
    <Section band="lg" labelledBy="reviews-title" width="full" className="px-0">
      <div className={GUTTER}>
        <div className="caja">
          <SectionHead
            eyebrow="What people say"
            id="reviews-title"
            title="Don't take our word for it"
          />
        </div>
      </div>
      <Marquee durationSeconds={45} className="mt-[40px]" itemClassName="gap-[20px] pr-[20px]">
        {reviews.map((r, i) => (
          <figure
            key={i}
            className="flex w-[340px] shrink-0 flex-col rounded-card border border-ink/12 p-[24px]"
          >
            <blockquote className="flex-1 text-[15px] leading-[1.65]">{r.quote}</blockquote>
            <figcaption className="mt-[16px] eyebrow text-body/60">
              {r.author} · {r.source}
            </figcaption>
          </figure>
        ))}
      </Marquee>
    </Section>
  );
}

/** Re-export para que `PhotoPending` esté disponible donde se arma la home. */
export { PhotoPending };
