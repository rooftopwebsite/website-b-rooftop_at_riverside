import type { Metadata } from 'next';
import Image from 'next/image';
import { ButtonLink } from '@/components/shared/Button';
import { Reveal } from '@/components/shared/Motion';
import PageHero from '@/components/shared/PageHero';
import { PendingBlock } from '@/components/shared/PendingData';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Our Story — The Magnus Family',
  description:
    'Four years of planning by locals. How the Magnus family turned a corner of downtown Bonita Springs into a rooftop bar over a food truck park.',
  path: '/our-story',
  image: {
    url: '/images/venue-story.jpg',
    width: 2000,
    height: 1333,
    alt: 'Rooftop at Riverside in downtown Bonita Springs',
  },
});

/**
 * /our-story
 *
 * ⚠️ Todo el copy de esta página sale del `/this-is-us` actual: son palabras
 * del cliente. El brief prohíbe texto generado por IA y ésta es la página
 * donde más tentaría escribirlo.
 *
 * ⚠️ Los emails personales de `/this-is-us` (cmagnus@ y ahayes@) NO se
 * republican: se dejan los buzones genéricos. Ver docs/current-site-inventory.md §6.
 */
export default function OurStoryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(breadcrumbJsonLd([{ name: 'Our Story', path: '/our-story' }])),
        }}
      />

      <PageHero
        eyebrow="Our story"
        title="Four years of planning, by people from here"
        lead="The Magnus family are Bonitians. This corner of Old 41 was an idea long before it was a rooftop."
        image="/images/venue-story.jpg"
        imageAlt="The park and rooftop at Rooftop at Riverside in downtown Bonita Springs"
        crumbs={[{ name: 'Our Story', path: '/our-story' }]}
      />

      <Section band="lg" width="prose">
        {/* Texto del cliente, literal. */}
        <p className="text-intro leading-[1.5] text-body/90">
          After four years of planning, the Magnus family — Bonitian locals — got to fulfill their
          dream of bringing life, community fun and legacy to Bonita Springs.
        </p>

        <blockquote className="mt-[32px] border-l-2 border-sunset pl-[24px]">
          <p className="text-intro leading-[1.45] text-body/85">
            &ldquo;We hope this park will be a staple for families in the community, a symbol for up
            and coming entrepreneurs and business owners, and a landmark our kids would be proud
            of.&rdquo;
          </p>
          <footer className="mt-[16px] eyebrow text-body/60">
            Chris Magnus — Founder &amp; Operator
          </footer>
        </blockquote>

        <div className="mt-[40px] flex flex-col gap-[16px] text-lead leading-[1.7] text-body/85">
          <p>
            The model is unusual on purpose. Rather than open a restaurant and hire a kitchen, they
            built a yard four independent food businesses could park in — and put a bar on the roof
            above it.
          </p>
          <p>
            Every truck keeps its own margin. The venue keeps the bar. It means a family that
            can&rsquo;t agree on dinner doesn&rsquo;t have to, and it means four small businesses
            get a downtown corner they couldn&rsquo;t rent on their own.
          </p>
        </div>
      </Section>

      {/* ── Los espacios ───────────────────────────────────────────────── */}
      <Section tone="cream" band="lg" labelledBy="places-title">
        <SectionHead
          eyebrow="The place"
          eyebrowTone="deep"
          id="places-title"
          title="What got built"
        />
        <div className="mt-[40px] grid gap-[28px] sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Sunset Bar', 'The rooftop, facing west over the Imperial River.'],
            ['The Yard', 'Where the trucks park and the stage goes up. Being gated.'],
            ['The Patio', 'Between the two, currently in renovation.'],
            ['Game Lounge', "A gaming truck — Southwest Florida's first."],
          ].map(([title, body]) => (
            <div key={title} className="border-t-2 border-ink pt-[16px]">
              <Heading level={3} role="label">
                {title}
              </Heading>
              <p className="mt-[8px] text-[15px] leading-[1.6] text-body/75">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Charity Partner Program ────────────────────────────────────
          Contenido real de /giveback, que el brief no contemplaba. */}
      <Section band="lg" labelledBy="giveback-title">
        <div className="grid gap-[32px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-[64px]">
          <Reveal className="relative aspect-[4/3] overflow-hidden rounded-card bg-mint">
            <Image
              src="/images/venue-park.jpg"
              alt="The yard at Rooftop at Riverside on a busy evening"
              fill
              sizes="(max-width: 1023px) 100vw, 42vw"
              className="object-cover"
            />
          </Reveal>

          <div>
            <Eyebrow tone="plum">Charity Partner Program</Eyebrow>
            <Heading level={2} id="giveback-title" className="mt-gap-kicker text-d5 lg:text-d4">
              A dollar at a time
            </Heading>
            <div className="mt-gap-bajada flex flex-col gap-[14px] text-[15px] leading-[1.7] text-body/80">
              <p>
                At the end of your tab you can add $1, $3 or $5. One hundred percent of the net
                proceeds go to a different local organisation every month.
              </p>
              <p>
                Past partners include the Wonder Gardens of Bonita Springs, which has been showing
                people tropical flora and fauna for nearly nine decades.
              </p>
            </div>
            <div className="mt-[24px]">
              <PendingBlock title="Current charity partner">
                This lived on <code className="text-[13px]">/giveback</code>, a page the brief
                didn&rsquo;t account for. It&rsquo;s folded in here for now, and the monthly partner
                shown on the old site is stale. Tell us where this should live — its own route or
                this section — and who the current partner is.
              </PendingBlock>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="deep" band="md">
        <div className="flex flex-col gap-[20px] lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[560px]">
            <Eyebrow tone="cream">Come see it</Eyebrow>
            <Heading level={2} className="mt-gap-kicker text-d4 lg:text-d3">
              Wednesday through Sunday
            </Heading>
            <p className="mt-gap-bajada text-lead text-paper/85">
              No reservations, no cover. Walk up the stairs and pick a seat.
            </p>
          </div>
          <div className="flex flex-wrap gap-[12px]">
            <ButtonLink href="/visit" variant="onDark" size="lg">
              Plan a visit
            </ButtonLink>
            <ButtonLink href="/whats-on" variant="primary" size="lg">
              What&rsquo;s on
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
