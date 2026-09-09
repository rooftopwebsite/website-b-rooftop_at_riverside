import type { Metadata } from 'next';
import Link from 'next/link';
import { ButtonLink, ExternalIcon } from '@/components/shared/Button';
import { RevealItem, StaggerGroup } from '@/components/shared/Motion';
import PageHero from '@/components/shared/PageHero';
import { PendingBlock } from '@/components/shared/PendingData';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
import { EVENTS, timeRange, whenLabel } from '@/content/events';
import { BRAND } from '@/lib/brand';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  route: "/the-yard",
  image: {
    url: '/images/venue-truck-line.jpg',
    width: 2000,
    height: 1333,
    alt: 'The yard at Rooftop at Riverside with food trucks and a stage',
  },
});

/**
 * /the-yard — el recinto con reja, eventos con entrada paga.
 *
 * ⚠️ NO se construye checkout. El ticketing es de Eventbrite y lo gestiona el
 * cliente. Cada card linkea afuera con `rel="noopener noreferrer"`, un icono
 * visible y un aviso en texto de que abre en otra pestaña.
 *
 * ⚠️ La URL de Eventbrite todavía NO la tenemos (`BRAND.eventbrite` es null).
 * Mientras no esté, el bloque de tickets muestra un `PendingBlock` en vez de un
 * botón que no lleva a ningún lado.
 */
export default function TheYardPage() {
  const yardEvents = EVENTS.filter((e) => e.space === 'The Yard');
  const ticketed = yardEvents.filter((e) => e.ticketUrl);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(breadcrumbJsonLd([{ name: 'The Yard', path: '/the-yard' }])),
        }}
      />

      <PageHero
        eyebrow="The ground floor"
        title="The Yard is open"
        lead="The open yard where the trucks park and the stage goes up. It is being gated for ticketed entry, which turns it into the room for a festival, a benefit, or a show you sell seats to."
        image="/images/venue-truck-line.jpg"
        imageAlt="Food trucks and string lights in the yard at Rooftop at Riverside"
        crumbs={[{ name: 'The Yard', path: '/the-yard' }]}
      >
        <div className="flex flex-wrap gap-[12px]">
          <ButtonLink href="/whats-on" variant="primary" size="lg">
            See the calendar
          </ButtonLink>
          <ButtonLink href="/events/inquire" variant="secondary" size="lg">
            Book the yard
          </ButtonLink>
        </div>
      </PageHero>

      {/* ── Eventos con entrada ────────────────────────────────────────── */}
      <Section band="lg" labelledBy="ticketed-title">
        <SectionHead
          eyebrow="Ticketed shows"
          eyebrowTone="terra"
          id="ticketed-title"
          title="Buy a ticket, walk through the gate"
          lead="Tickets are sold through Eventbrite. You leave this site to buy them, and the ticket comes back to your inbox."
        />

        {ticketed.length > 0 ? (
          <StaggerGroup as="ul" className="mt-[40px] grid gap-[20px] sm:grid-cols-2">
            {ticketed.map((e) => (
              <RevealItem as="li" key={e.slug}>
                <article className="flex h-full flex-col rounded-card border border-ink/12 p-[24px]">
                  <Eyebrow tone="terra">{whenLabel(e)}</Eyebrow>
                  <Heading level={3} className="mt-[10px]">
                    {e.title}
                  </Heading>
                  <p className="mt-[10px] flex-1 text-[15px] leading-[1.6] text-body/75">
                    {e.summary}
                  </p>
                  <p className="mt-[12px] text-caption font-bold tabular-nums text-body/75">
                    {timeRange(e)} · {e.price === null ? 'Free' : `$${e.price}`}
                  </p>
                  <div className="mt-[18px] flex flex-wrap gap-[10px]">
                    {/* Link EXTERNO: rel noopener, icono e indicador en texto. */}
                    <ButtonLink href={e.ticketUrl as string} variant="primary" external>
                      Tickets on Eventbrite
                    </ButtonLink>
                    <Link
                      href={`/whats-on/${e.slug}`}
                      className="inline-flex min-h-[44px] items-center text-caption font-bold uppercase tracking-[0.14em] link-texto"
                    >
                      Details
                    </Link>
                  </div>
                </article>
              </RevealItem>
            ))}
          </StaggerGroup>
        ) : (
          /* Fallback elegante: no hay nada con entrada cargado todavía. */
          <div className="mt-[40px] flex flex-col gap-[24px]">
            <p className="max-w-[62ch] text-lead text-body/75">
              Nothing ticketed on the books right now. Everything else in the yard this week is free
              and you just walk in.
            </p>
            <div className="flex flex-wrap gap-[12px]">
              <ButtonLink href="/whats-on" variant="primary">
                What&rsquo;s on this week
              </ButtonLink>
            </div>
          </div>
        )}

        {!BRAND.eventbrite ? (
          <div className="mt-[32px]">
            <PendingBlock title="Eventbrite link">
              The client runs ticketing through Eventbrite, but we don&rsquo;t have the organiser
              URL yet. Until it lands, this page can&rsquo;t point anywhere for tickets. Send the
              link and it drops into{' '}
              <code className="rounded-btn bg-ink/5 px-[5px] py-[1px] text-[13px]">
                BRAND.eventbrite
              </code>
              .
            </PendingBlock>
          </div>
        ) : null}
      </Section>

      {/* ── Lo que pasa gratis ─────────────────────────────────────────── */}
      <Section tone="cream" band="md" labelledBy="free-title">
        <div className="flex flex-col gap-[10px] sm:flex-row sm:items-end sm:justify-between">
          <Heading level={2} id="free-title" className="text-d5 lg:text-d4">
            Free in the yard
          </Heading>
          <Link href="/whats-on" className="text-caption font-bold uppercase tracking-[0.14em] link-texto">
            Full calendar
          </Link>
        </div>
        <ul className="mt-[24px] flex flex-col">
          {yardEvents
            .filter((e) => !e.ticketUrl)
            .map((e) => (
              <li key={e.slug}>
                <Link
                  href={`/whats-on/${e.slug}`}
                  className="group flex flex-col gap-[4px] border-b border-ink/12 py-[16px] sm:flex-row sm:items-baseline sm:justify-between sm:gap-[24px]"
                >
                  <span className="font-display text-d5 uppercase transition-colors group-hover:text-deep">
                    {e.title}
                  </span>
                  <span className="shrink-0 text-caption font-bold tabular-nums text-body/75">
                    {whenLabel(e)}
                  </span>
                </Link>
              </li>
            ))}
        </ul>
      </Section>

      {/* ── Alquilar el yard ───────────────────────────────────────────── */}
      <Section band="md">
        <div className="grid gap-[28px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-[64px]">
          <Heading level={2} className="text-d5 lg:text-d4">
            Or take the yard yourself
          </Heading>
          <div className="flex flex-col gap-[14px] text-[15px] leading-[1.7] text-body/80">
            <p>
              The gate means the yard can be closed off and run as its own room — a ticketed door, a
              private festival, a fundraiser with a headcount you actually control.
            </p>
            <p>
              Stage and sound are already there. So are the trucks, and the bar upstairs.
            </p>
            <div className="mt-[8px] flex flex-wrap gap-[12px]">
              <ButtonLink href="/events/inquire" variant="primary">
                Request a proposal
              </ButtonLink>
              <ButtonLink href="/events/spaces" variant="secondary">
                Capacities
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
