import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ButtonLink } from '@/components/shared/Button';
import { RevealItem, StaggerGroup } from '@/components/shared/Motion';
import PageHero from '@/components/shared/PageHero';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Private & Corporate Events in Bonita Springs',
  description:
    'Rent a rooftop bar, a gated yard and four food trucks in downtown Bonita Springs. Corporate nights, holiday parties, fundraisers, celebrations and full buyouts — one coordinator for all of it.',
  path: '/events',
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
        title="Take the whole place"
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
        <p className="mt-[32px] max-w-[62ch] text-[15px] leading-[1.65] text-body/70">
          We don&rsquo;t have a kitchen of our own, and we don&rsquo;t pretend to. What you get
          instead is four different menus in one yard — which is a better problem to hand a room of
          two hundred people than one set entrée.
        </p>
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
              <span className="mt-[6px] block text-[15px] text-body/70">
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
              <span className="mt-[6px] block text-[15px] text-body/70">
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
