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
  route: '/our-story',
  image: {
    url: '/images/venue-story.jpg',
    width: 2000,
    height: 1333,
    alt: 'Rooftop at Riverside in downtown Bonita Springs',
  },
});

/**
 * /our-story — el activo narrativo principal.
 *
 * Es la única página que ningún competidor de la zona puede copiar: la familia,
 * el pueblo y las reliquias en las paredes son de acá y de nadie más.
 *
 * ⚠️ La cita de Chris Magnus es LITERAL, de `/this-is-us`. El resto está
 * escrito de cero: el copy viejo refuerza la lectura de restaurante.
 *
 * ⚠️ Los emails personales que publica `/this-is-us` (cmagnus@ y ahayes@) NO se
 * republican. Ver docs/current-site-inventory.md §6.
 *
 * ⚠️ Nada inventado. El Bonita Springs Brio es un cóctel REAL de la carta de
 * enero 2026; no se nombran otros «cócteles con nombre local» sin tenerlos a la
 * vista, porque sería inventar producto.
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
        title="A Magnus family project"
        lead="The Magnuses are Bonitians. This corner of Old 41 was an idea in their kitchen for four years before it was a rooftop."
        image="/images/venue-story.jpg"
        imageAlt="The yard and rooftop at Rooftop at Riverside in downtown Bonita Springs"
        crumbs={[{ name: 'Our Story', path: '/our-story' }]}
      />

      <Section band="lg" width="prose">
        <p className="text-intro leading-[1.5] text-body/90">
          The Magnus family are from here. After four years of planning they got to build the
          thing they kept talking about: somewhere the whole town could end up on the same night.
        </p>

        <div className="mt-[32px] flex flex-col gap-[16px] text-lead leading-[1.7] text-body/85">
          <p>
            They could have opened a restaurant. Hire a chef, print a menu, hope the town likes it.
            They did the opposite. They built a yard four independent food businesses could park in,
            and put a bar on the roof above it.
          </p>
          <p>
            Every truck keeps its own margin. We keep the bar. It means a family that can&rsquo;t
            agree on dinner doesn&rsquo;t have to, and it means four small businesses get a downtown
            corner none of them could rent alone.
          </p>
        </div>

        <blockquote className="mt-bloque border-l-2 border-sunset pl-[24px]">
          {/* Cita literal del cliente. */}
          <p className="text-intro leading-[1.45] text-body/85">
            &ldquo;We hope this park will be a staple for families in the community, a symbol for up
            and coming entrepreneurs and business owners, and a landmark our kids would be proud
            of.&rdquo;
          </p>
          <footer className="mt-[16px] eyebrow text-body/75">
            Chris Magnus, Founder &amp; Operator
          </footer>
        </blockquote>
      </Section>

      {/* ── La historia en las paredes ─────────────────────────────────── */}
      <Section tone="cream" band="lg" labelledBy="history-title">
        <div className="grid gap-[36px] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-[64px]">
          <div>
            <Eyebrow tone="deep">Bonita on the walls</Eyebrow>
            <Heading level={2} id="history-title" className="mt-gap-kicker text-d4 lg:text-d3">
              Borrowed from the Historical Society
            </Heading>
            <div className="mt-gap-bajada flex flex-col gap-[14px] text-[16px] leading-[1.7] text-body/80">
              <p>
                The pieces hanging around the bar came from the Bonita Springs Historical Society.
                Real relics from this town, a few steps from the river they came off.
              </p>
              <p>
                It started as a way to fill the walls with something other than shiplap and a neon
                sign. It turned into the thing people photograph. Somebody&rsquo;s grandfather is
                usually in one of them.
              </p>
              <p>
                The drinks do the same job. Order a Bonita Springs Brio and you&rsquo;re drinking
                the name of the place you&rsquo;re standing in.
              </p>
            </div>
            <div className="mt-[24px]">
              <ButtonLink href="/sunset-bar" variant="secondary">
                See the bar menu
              </ButtonLink>
            </div>
          </div>

          <Reveal className="relative aspect-[4/3] overflow-hidden rounded-card bg-mint">
            <Image
              src="/images/venue-rooftop.jpg"
              alt="The rooftop bar at Rooftop at Riverside, with seating overlooking the Imperial River"
              fill
              sizes="(max-width: 1023px) 100vw, 40vw"
              className="object-cover"
            />
          </Reveal>
        </div>
      </Section>

      {/* ── Los espacios ───────────────────────────────────────────────── */}
      <Section band="lg" labelledBy="places-title">
        <SectionHead
          eyebrow="The place"
          eyebrowTone="plum"
          id="places-title"
          title="What got built"
        />
        <div className="mt-bloque grid gap-[28px] sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Sunset Bar', 'The rooftop, facing west over the Imperial River. Ours.'],
            ['The Yard', 'Where the trucks park and the stage goes up. Being gated.'],
            ['The Patio', 'Between the two. In renovation, name not final.'],
            ['Game Lounge', 'A gaming truck, air conditioned. First in Southwest Florida.'],
          ].map(([title, body]) => (
            <div key={title} className="border-t-2 border-ink pt-[16px]">
              <Heading level={3} role="label">
                {title}
              </Heading>
              <p className="mt-[8px] text-[16px] leading-[1.6] text-body/75">{body}</p>
            </div>
          ))}
        </div>

        <p className="mt-[32px] max-w-[62ch] text-[16px] leading-[1.65] text-body/75">
          It shut for about six months in each of the last two years while the work got done. The
          point of all of it was to make the place feel less like a lot with tables on it: warmer,
          softer, somewhere you stay past sunset.
        </p>
      </Section>

      {/* ── Charity Partner Program ────────────────────────────────────
          Contenido real de /giveback, que el brief no contemplaba. */}
      <Section band="lg" bandTop="none" labelledBy="giveback-title">
        <div className="grid gap-[32px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-[64px]">
          <Reveal className="relative aspect-[4/3] overflow-hidden rounded-card bg-mint">
            <Image
              src="/images/venue-park.jpg"
              alt="A busy evening in the yard at Rooftop at Riverside"
              fill
              sizes="(max-width: 1023px) 100vw, 42vw"
              className="object-cover"
            />
          </Reveal>

          <div>
            <Eyebrow tone="terra">Charity Partner Program</Eyebrow>
            <Heading level={2} id="giveback-title" className="mt-gap-kicker text-d5 lg:text-d4">
              A dollar at a time
            </Heading>
            <div className="mt-gap-bajada flex flex-col gap-[14px] text-[16px] leading-[1.7] text-body/80">
              <p>
                Close your tab and you can add a dollar, three or five. All of the net proceeds go
                to a different local organisation every month.
              </p>
              <p>
                Past partners include the Wonder Gardens down the road, which has been showing this
                town tropical plants and birds for nearly ninety years.
              </p>
            </div>
            <div className="mt-[24px]">
              <PendingBlock title="Current charity partner">
                This lived on <code className="text-[13px]">/giveback</code>, a page the brief
                didn&rsquo;t account for. It&rsquo;s folded in here for now, and the partner shown on
                the old site is stale. Tell us whether this belongs on its own route or inside
                this section, and who the current partner is.
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
