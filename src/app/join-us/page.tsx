import type { Metadata } from 'next';
import { ButtonLink } from '@/components/shared/Button';
import PageHero from '@/components/shared/PageHero';
import { PendingBlock } from '@/components/shared/PendingData';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
import { BRAND } from '@/lib/brand';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Join Us — Play, Work or Vend Here',
  description:
    'Musicians, food truck owners, market vendors and staff: three ways to work with Rooftop at Riverside in Bonita Springs.',
  path: '/join-us',
});

/**
 * /join-us — el destino del 301 de `/entertainment`.
 *
 * ⚠️ `/entertainment` en el sitio actual NO es una página de programación: es
 * un formulario de reclutamiento de músicos («Calling All Entertainers»). Por
 * eso el brief lo manda acá y no a `/whats-on`. Verificado en la auditoría.
 *
 * Esta página junta las TRES formas de sumarse, que hoy viven repartidas en
 * tres páginas distintas del sitio de Wix.
 */

const TRACKS = [
  {
    id: 'play',
    eyebrow: 'Musicians and performers',
    title: 'Play here',
    body: "We book live music five nights a week — solo acts, bands, DJs. Send a link to something we can listen to and a photo we can use.",
    what: ['A link to your music or a video', 'Band name and genre', 'Your social handles', 'A photo and a logo if you have them'],
    cta: 'Send your material',
    mailto: `mailto:${BRAND.contact.email}?subject=Booking%20-%20live%20music`,
  },
  {
    id: 'cook',
    eyebrow: 'Food truck owners',
    title: 'Park here',
    body: 'Four trucks run the yard on a revenue share. You keep your own margin, your own menu and your own register — we bring the crowd, the seating and the bar.',
    what: ['What you cook and how long you have been doing it', 'Your truck size and power needs', 'Your health permit status', 'Your Instagram'],
    cta: 'Pitch your truck',
    mailto: `mailto:${BRAND.contact.email}?subject=Food%20truck%20-%20partnership`,
  },
  {
    id: 'work',
    eyebrow: 'Bar and floor staff',
    title: 'Work here',
    body: 'Bartenders, barbacks, servers and event staff. High season runs December through April, and that is when we hire hardest.',
    what: ['A resume', 'Which role you are after', 'Your availability, including weekends'],
    cta: 'Send a resume',
    mailto: `mailto:${BRAND.contact.hiring}?subject=Application`,
  },
] as const;

export default function JoinUsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(breadcrumbJsonLd([{ name: 'Join Us', path: '/join-us' }])),
        }}
      />

      <PageHero
        eyebrow="Join us"
        title="Play here, park here, work here"
        lead="Three ways in, depending on what you do. All of them start with an email."
        crumbs={[{ name: 'Join Us', path: '/join-us' }]}
      />

      <Section band="lg" labelledBy="tracks-title">
        <SectionHead
          eyebrow="Pick your lane"
          eyebrowTone="deep"
          id="tracks-title"
          title="What are you bringing?"
        />

        <div className="mt-[48px] flex flex-col gap-[32px]">
          {TRACKS.map((t) => (
            <article
              key={t.id}
              id={t.id}
              className="grid gap-[24px] rounded-card border border-ink/12 p-[24px] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-[48px] lg:p-[40px]"
            >
              <div>
                <Eyebrow tone="terra">{t.eyebrow}</Eyebrow>
                <Heading level={2} className="mt-[8px] text-d4 lg:text-d3">
                  {t.title}
                </Heading>
                <p className="mt-[14px] max-w-[52ch] text-[15px] leading-[1.7] text-body/80">
                  {t.body}
                </p>
                <div className="mt-[24px]">
                  <ButtonLink href={t.mailto} variant="primary">
                    {t.cta}
                  </ButtonLink>
                </div>
              </div>

              <div>
                <Heading level={3} role="label">
                  What to include
                </Heading>
                <span aria-hidden="true" className="mt-[8px] block h-[2px] w-[28px] bg-river" />
                <ul className="mt-[14px] flex flex-col gap-[8px] text-[15px] leading-[1.6] text-body/80">
                  {t.what.map((w) => (
                    <li key={w} className="border-b border-ink/10 pb-[8px] last:border-0">
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-[40px]">
          <PendingBlock title="Application forms">
            The current site runs three separate upload forms — musician material, vendor details
            and resumes — with a 15 MB file upload each. Until a form backend and a file store are
            picked, this page routes to email instead, which is honest and works today.
          </PendingBlock>
        </div>
      </Section>

      <Section tone="cream" band="md">
        <div className="grid gap-[28px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-[64px]">
          <Heading level={2} className="text-d5 lg:text-d4">
            Selling handmade goods?
          </Heading>
          <div className="flex flex-col gap-[12px] text-[15px] leading-[1.7] text-body/80">
            <p>
              That&rsquo;s the Neighborhood Market, and it works differently — a $30 spot for the
              afternoon rather than an ongoing arrangement.
            </p>
            <div className="mt-[4px]">
              <ButtonLink href="/market" variant="secondary">
                Vendor details
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
