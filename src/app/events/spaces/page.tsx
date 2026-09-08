import type { Metadata } from 'next';
import Image from 'next/image';
import { ButtonLink } from '@/components/shared/Button';
import { RevealItem, StaggerGroup } from '@/components/shared/Motion';
import PageHero from '@/components/shared/PageHero';
import { PendingBlock, PendingData, PhotoPending } from '@/components/shared/PendingData';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
import { SPACES, type Space } from '@/content/spaces';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  route: "/events/spaces",
});

/**
 * /events/spaces — la página que más plata deja.
 *
 * ⚠️ TODAS las capacidades y mínimos van en `<PendingData>` con TBD VISIBLE.
 * El brief es explícito: «Los números todavía no los tengo (…) No inventes
 * capacidades.» Un número inventado en esta página es una promesa contractual
 * que después alguien tiene que cumplir con una grúa.
 */
export default function SpacesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            breadcrumbJsonLd([
              { name: 'Events', path: '/events' },
              { name: 'Spaces', path: '/events/spaces' },
            ]),
          ),
        }}
      />

      <PageHero
        eyebrow="Event spaces"
        title="Pick your corner of paradise"
        lead="A rooftop, a gated yard, a patio, and the option to take all of it. Every one of them comes with the bar and the trucks."
        crumbs={[
          { name: 'Events', path: '/events' },
          { name: 'Spaces', path: '/events/spaces' },
        ]}
      >
        <ButtonLink href="/events/inquire" variant="primary" size="lg">
          Request a proposal
        </ButtonLink>
      </PageHero>

      <Section band="lg" labelledBy="spaces-title">
        <SectionHead
          eyebrow="The rooms"
          eyebrowTone="deep"
          id="spaces-title"
          title="Pick your footprint"
        />

        <StaggerGroup as="ul" className="mt-[48px] flex flex-col gap-[32px]">
          {SPACES.map((s, i) => (
            <RevealItem as="li" key={s.slug}>
              <SpaceCard space={s} flipped={i % 2 === 1} />
            </RevealItem>
          ))}
        </StaggerGroup>

        {/* El aviso general, para que nadie lea los TBD como un error de maqueta. */}
        <div className="mt-[40px]">
          <PendingBlock title="Capacities, minimums and floor plans">
            Every capacity, seated count and guest minimum on this page is marked TBD because we
            don&rsquo;t have the numbers yet — and we&rsquo;re not going to estimate them. A
            capacity on a venue page is a promise. Send them over and they drop straight into{' '}
            <code className="rounded-btn bg-ink/5 px-[5px] py-[1px] text-[13px]">
              src/content/spaces.ts
            </code>
            ; the TBD markers disappear on their own.
          </PendingBlock>
        </div>
      </Section>

      <Section tone="cream" band="md">
        <div className="grid gap-[28px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-[64px]">
          <Heading level={2} className="text-d5 lg:text-d4">
            What comes with every space
          </Heading>
          <ul className="flex flex-col gap-[10px] text-[15px] leading-[1.7] text-body/80">
            <li className="border-b border-ink/12 pb-[10px]">
              The Sunset Bar and our team running it.
            </li>
            <li className="border-b border-ink/12 pb-[10px]">
              Coordination with the food trucks — you pick a tier, we handle the vendors.
            </li>
            <li className="border-b border-ink/12 pb-[10px]">
              Sound for live music or a DJ, and the stage in the yard.
            </li>
            <li className="border-b border-ink/12 pb-[10px]">
              Street parking on Old 41 and the public lots around Riverside Park.
            </li>
            <li>One point of contact from the first email to load-out.</li>
          </ul>
        </div>
      </Section>

      <Section band="md">
        <div className="rounded-card bg-sunset px-[24px] py-[40px] text-ink lg:px-[56px]">
          <div className="flex flex-col gap-[20px] lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[560px]">
              <Eyebrow tone="ink">Check a date</Eyebrow>
              <Heading level={2} className="mt-gap-kicker text-d4 lg:text-d3">
                December fills first
              </Heading>
              <p className="mt-gap-bajada text-lead">
                High season runs December through April. If you&rsquo;re planning a holiday party,
                the earlier the better.
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

function SpaceCard({ space, flipped }: { readonly space: Space; readonly flipped: boolean }) {
  return (
    <article className="grid gap-[24px] overflow-hidden rounded-card border border-ink/12 lg:grid-cols-2 lg:gap-0">
      <div className={['relative min-h-[240px] lg:min-h-[340px]', flipped ? 'lg:order-2' : ''].join(' ')}>
        {space.photo ? (
          <Image
            src={space.photo}
            alt={space.photoAlt ?? ''}
            fill
            sizes="(max-width: 1023px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <PhotoPending
            brief={space.photoBrief}
            ratio="h-full min-h-[240px]"
            className="rounded-none"
          />
        )}
      </div>

      <div className="flex flex-col p-[24px] lg:p-[40px]">
        <div className="flex flex-wrap items-center gap-[10px]">
          <Eyebrow tone="deep">{space.kicker}</Eyebrow>
          {space.status === 'renovating' ? (
            <span className="rounded-btn bg-cream px-[8px] py-[2px] text-[11px] font-bold uppercase tracking-[0.1em] text-plum">
              In renovation
            </span>
          ) : null}
        </div>

        <Heading level={3} className="mt-[8px] text-d4 lg:text-d3">
          {space.name}
        </Heading>

        <p className="mt-[12px] max-w-[52ch] text-[15px] leading-[1.65] text-body/75">
          {space.description}
        </p>

        {/* Los tres números. Todos TBD hasta que el cliente los pase. */}
        <dl className="mt-[24px] grid grid-cols-3 gap-[16px] border-y border-ink/12 py-[18px]">
          <div>
            <dt className="eyebrow text-body/65">Standing</dt>
            <dd className="mt-[6px]">
              {space.standing !== null ? (
                <span className="font-display text-d5 tabular-nums">{space.standing}</span>
              ) : (
                <PendingData detail="Standing capacity not supplied yet" />
              )}
            </dd>
          </div>
          <div>
            <dt className="eyebrow text-body/65">Seated</dt>
            <dd className="mt-[6px]">
              {space.seated !== null ? (
                <span className="font-display text-d5 tabular-nums">{space.seated}</span>
              ) : (
                <PendingData detail="Seated capacity not supplied yet" />
              )}
            </dd>
          </div>
          <div>
            <dt className="eyebrow text-body/65">Minimum</dt>
            <dd className="mt-[6px]">
              {space.minimum !== null ? (
                <span className="font-display text-d5 tabular-nums">{space.minimum}</span>
              ) : (
                <PendingData detail="Guest minimum not supplied yet" />
              )}
            </dd>
          </div>
        </dl>

        <div className="mt-[18px]">
          <p className="eyebrow text-body/65">Best for</p>
          <ul className="mt-[8px] flex flex-wrap gap-[8px]">
            {space.bestFor.map((b) => (
              <li
                key={b}
                className="rounded-pill border border-ink/20 px-[12px] py-[5px] text-[13px]"
              >
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-[24px]">
          <ButtonLink href="/events/inquire" variant="secondary">
            Ask about {space.name}
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
