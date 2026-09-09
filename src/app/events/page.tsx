import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ButtonLink } from '@/components/shared/Button';
import { CountUp, RevealItem, StaggerGroup } from '@/components/shared/Motion';
import PageHero from '@/components/shared/PageHero';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  route: "/events",
  image: {
    url: '/images/events/event-a.jpg',
    width: 1800,
    height: 1200,
    alt: 'Guests at a private event at Rooftop at Riverside',
  },
});

const VERTICALS = [
  {
    href: '/events/corporate',
    title: 'Corporate',
    body: 'Client nights, team outings, sales kickoffs and quarterly dinners.',
    photo: '/images/events/event-b.jpg',
    alt: 'A corporate gathering on the rooftop at Rooftop at Riverside',
  },
  {
    href: '/events/holiday-parties',
    title: 'Holiday parties',
    body: 'December fills first. The whole place, closed to the public, for your company.',
    photo: '/images/events/event-c.jpg',
    alt: 'A large group celebrating at Rooftop at Riverside',
  },
  {
    href: '/events/celebrations',
    title: 'Celebrations',
    body: 'Milestone birthdays, engagements, showers and reunions.',
    photo: '/images/events/event-d.jpg',
    alt: 'Guests raising glasses at a celebration at Rooftop at Riverside',
  },
  {
    href: '/events/fundraisers',
    title: 'Fundraisers',
    body: 'Spirit nights, nonprofit galas and school events, with the yard as the room.',
    photo: '/images/venue-guests.jpg',
    alt: 'A crowd gathered in the yard at Rooftop at Riverside',
  },
] as const;

/**
 * Los tres pasos del proceso. VIENEN DE LA HOME: eran `PLANNER_STEPS` en
 * `HomeSections.tsx` y sólo existían allá, así que al reducir el bloque de
 * eventos de la home a un banner se mudaron acá en vez de borrarse.
 */
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

const WHAT_WE_DO = [
  {
    title: 'We coordinate the trucks',
    body: 'You pick a food tier, we line up the kitchens and the timing. You deal with one person, not four vendors.',
  },
  {
    title: 'The bar is ours',
    body: 'Cocktails, drafts, wine. Open bar, drink tickets or consumption — however you want to run it.',
  },
  {
    title: 'The space is yours',
    body: 'The rooftop, the yard, the patio, or the entire venue with the gates closed.',
  },
] as const;

/**
 * /events — la puerta de la vertical prioritaria.
 *
 * ⚠️ No promete catering propio. El venue no tiene cocina: la comida la sirven
 * los trucks y el venue coordina. Está dicho explícitamente en «What we
 * actually do», porque es la confusión que más caro sale en una venta.
 */
export default function EventsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(breadcrumbJsonLd([{ name: 'Events', path: '/events' }])),
        }}
      />

      <PageHero
        eyebrow="Private events"
        title="Your event, two stories up"
        lead="A rooftop bar, a gated yard and four independent kitchens — in downtown Bonita Springs, ten minutes from Naples and Estero."
        image="/images/events/event-a.jpg"
        imageAlt="Guests at a private event on the rooftop at Rooftop at Riverside"
        crumbs={[{ name: 'Events', path: '/events' }]}
      >
        <div className="flex flex-wrap gap-[12px]">
          <ButtonLink href="/events/inquire" variant="primary" size="lg">
            Request a proposal
          </ButtonLink>
          <ButtonLink href="/events/spaces" variant="secondary" size="lg">
            See the spaces
          </ButtonLink>
        </div>
      </PageHero>

      {/* ── Qué hacemos realmente ──────────────────────────────────────── */}
      <Section tone="cream" band="lg" labelledBy="what-title">
        <SectionHead
          eyebrow="How it works"
          eyebrowTone="deep"
          id="what-title"
          title="What we actually do"
          lead="We're a venue with a bar, not a caterer. Here's the honest split."
        />
        <StaggerGroup as="ul" className="mt-[40px] grid gap-[28px] md:grid-cols-3">
          {WHAT_WE_DO.map((w) => (
            <RevealItem as="li" key={w.title} className="border-t-2 border-ink pt-[18px]">
              <Heading level={3}>{w.title}</Heading>
              <p className="mt-[10px] text-[15px] leading-[1.65] text-body/75">{w.body}</p>
            </RevealItem>
          ))}
        </StaggerGroup>
        <p className="mt-[32px] max-w-[62ch] text-[15px] leading-[1.65] text-body/75">
          We don&rsquo;t have a kitchen of our own, and we don&rsquo;t pretend to. What you get
          instead is four different menus in one yard — which is a better problem to hand a room of
          two hundred people than one set entrée.
        </p>
      </Section>

      {/*
        ⚠️ Estos tres pasos VENÍAN DE LA HOME. Camila mandó el bloque de eventos
        de la home a ser sólo un banner: «que toda esa info esté en la página
        que le corresponda». Esta es esa página.

        No duplica a «What we actually do», que está justo arriba: ese dice QUÉ
        hacemos —el reparto entre el venue y los trucks— y esto dice CÓMO
        EMPIEZA. Son las dos preguntas que hace alguien que está evaluando el
        lugar, en ese orden.

        Va numerado, y acá la numeración sí informa: es una secuencia real. Se
        pide, llega el packet, se ven los espacios.
      */}
      <Section band="lg" labelledBy="process-title">
        <SectionHead
          eyebrow="Getting started"
          eyebrowTone="terra"
          id="process-title"
          title="Three steps, and the first one takes two minutes"
        />
        <StaggerGroup as="ol" className="mt-[40px] grid gap-[28px] md:grid-cols-3">
          {PLANNER_STEPS.map((s) => (
            <RevealItem as="li" key={s.n} className="flex flex-col border-t border-ink/20 pt-[18px]">
              <span aria-hidden="true" className="eyebrow text-terra">
                Step {s.n}
              </span>
              <Heading level={3} className="mt-[10px]">
                {s.title}
              </Heading>
              <p className="mt-[10px] flex-1 text-[15px] leading-[1.65] text-body/75">{s.body}</p>
              <div className="mt-[18px]">
                <ButtonLink href={s.href} variant="outline">
                  {s.cta}
                </ButtonLink>
              </div>
            </RevealItem>
          ))}
        </StaggerGroup>
      </Section>

      {/*
        Slot 8 del vocabulario de motion, y el ÚNICO contador del sitio.
        Un número que sube es un gesto caro: usado dos veces se vuelve un tic.
        Acá se gana el lugar porque es la prueba dura de que el venue mueve
        gente, y es el dato que decide una venta corporativa.
      */}
      <Section band="md" labelledBy="proof-title">
        <div className="grid gap-[28px] border-y border-ink/15 py-[40px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-center lg:gap-[64px]">
          <div>
            <Eyebrow tone="terra">Fourth of July</Eyebrow>
            <p className="mt-[10px] font-display text-hero leading-[0.9] text-ink">
              <CountUp to={25000} />
              <span aria-hidden="true">–</span>
              <CountUp to={30000} />
            </p>
            <p className="sr-only">Between 25,000 and 30,000 people.</p>
          </div>
          <div>
            <Heading level={2} id="proof-title" className="text-d5 lg:text-d4">
              People downtown for one night
            </Heading>
            <p className="mt-[12px] max-w-[52ch] text-[15px] leading-[1.65] text-body/75">
              That&rsquo;s what the Fourth of July pulled into downtown Bonita Springs. The yard sits
              in the middle of it, on Old 41, across from Riverside Park. For a brand activation or
              a fundraiser, that footfall is the room.
            </p>
          </div>
        </div>
      </Section>

      {/* ── Verticales ─────────────────────────────────────────────────── */}
      <Section band="lg" labelledBy="verticals-title">
        <SectionHead
          eyebrow="What we host"
          eyebrowTone="plum"
          id="verticals-title"
          title="Pick the night you're planning"
        />
        <StaggerGroup as="ul" className="mt-[48px] grid gap-[28px] sm:grid-cols-2">
          {VERTICALS.map((v) => (
            <RevealItem as="li" key={v.href}>
              <Link href={v.href} className="group flex h-full flex-col">
                <div className="relative aspect-[16/10] overflow-hidden rounded-card bg-mint">
                  <Image
                    src={v.photo}
                    alt={v.alt}
                    fill
                    sizes="(max-width: 639px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 ease-brand group-hover:scale-[1.03]"
                  />
                </div>
                <Heading level={3} className="mt-[18px]">
                  {v.title}
                </Heading>
                <p className="mt-[8px] flex-1 text-[15px] leading-[1.6] text-body/75">{v.body}</p>
                <span
                  aria-hidden="true"
                  className="mt-[14px] text-caption font-bold uppercase tracking-[0.14em] underline decoration-ink/45 decoration-1 underline-offset-4 transition-[text-decoration-color] group-hover:decoration-sunset group-hover:decoration-2"
                >
                  Learn more
                </span>
              </Link>
            </RevealItem>
          ))}
        </StaggerGroup>

        <div className="mt-[40px] grid gap-[20px] sm:grid-cols-2">
          <Link
            href="/events/game-truck"
            className="group flex items-center justify-between gap-[16px] rounded-card border border-ink/15 p-[24px] transition-colors hover:border-ink/40"
          >
            <span>
              <Eyebrow tone="terra">Add-on</Eyebrow>
              <Heading level={3} className="mt-[6px]">
                The gaming truck
              </Heading>
              <span className="mt-[6px] block text-[15px] text-body/75">
                Consoles, screens and a Game Coach, parked at your event.
              </span>
            </span>
          </Link>
          <Link
            href="/events/spaces"
            className="group flex items-center justify-between gap-[16px] rounded-card border border-ink/15 p-[24px] transition-colors hover:border-ink/40"
          >
            <span>
              <Eyebrow tone="terra">Capacities</Eyebrow>
              <Heading level={3} className="mt-[6px]">
                The spaces
              </Heading>
              <span className="mt-[6px] block text-[15px] text-body/75">
                Four rooms, from the rooftop to a full buyout.
              </span>
            </span>
          </Link>
        </div>
      </Section>

      {/* ── Cierre ─────────────────────────────────────────────────────── */}
      <Section band="md">
        <div className="rounded-card bg-sunset px-[24px] py-[40px] text-ink lg:px-[56px]">
          <div className="flex flex-col gap-[20px] lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[560px]">
              <Eyebrow tone="ink">Next step</Eyebrow>
              <Heading level={2} className="mt-gap-kicker text-d4 lg:text-d3">
                One screen, two minutes
              </Heading>
              <p className="mt-gap-bajada text-lead">
                Tell us the date and the headcount. The events packet comes back the moment you
                send it.
              </p>
            </div>
            <ButtonLink href="/events/inquire" variant="dark" size="lg">
              Request a proposal
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
