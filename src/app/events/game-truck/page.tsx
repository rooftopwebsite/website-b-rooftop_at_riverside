import type { Metadata } from 'next';
import Image from 'next/image';
import { ButtonLink } from '@/components/shared/Button';
import PageHero from '@/components/shared/PageHero';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  route: "/events/game-truck",
  image: {
    url: '/images/game-truck.jpg',
    width: 1800,
    height: 1200,
    alt: 'The gaming truck at Rooftop at Riverside',
  },
});

const GOOD_FOR = [
  'Kids and teen birthdays',
  'Team nights and offsites',
  'School and church events',
  'Add-on for a private buyout',
  'Fundraiser activations',
  'Anything with a room full of people who do not know each other yet',
] as const;

/** /events/game-truck — el camión de gaming como producto de eventos. */
export default function GameTruckPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            breadcrumbJsonLd([
              { name: 'Events', path: '/events' },
              { name: 'Gaming truck', path: '/events/game-truck' },
            ]),
          ),
        }}
      />

      <PageHero
        eyebrow="Events add-on"
        title="The party arrives on wheels"
        lead="Two hours, a Game Coach, and a truck full of consoles with the air conditioning running. It parks at your event here, or drives to it."
        image="/images/game-truck.jpg"
        imageAlt="The gaming truck parked and open at Rooftop at Riverside"
        crumbs={[
          { name: 'Events', path: '/events' },
          { name: 'Gaming truck', path: '/events/game-truck' },
        ]}
      >
        <ButtonLink href="/events/inquire" variant="primary" size="lg">
          Request a proposal
        </ButtonLink>
      </PageHero>

      <Section band="lg" labelledBy="pricing-title">
        <SectionHead
          eyebrow="Packages"
          eyebrowTone="deep"
          id="pricing-title"
          title="Two hours, then by the hour"
        />

        <div className="mt-bloque overflow-x-auto" tabIndex={0} role="region" aria-label="Gaming truck pricing, scrollable">
          <table className="w-full min-w-[520px] border-collapse text-[16px]">
            <caption className="sr-only">Gaming truck party pricing</caption>
            <thead>
              <tr className="border-b-2 border-ink">
                <th scope="col" className="py-[12px] pr-[16px] text-left eyebrow text-body/75">
                  When
                </th>
                <th scope="col" className="py-[12px] pr-[16px] text-left eyebrow text-body/75">
                  Two hours
                </th>
                <th scope="col" className="py-[12px] text-left eyebrow text-body/75">
                  Each extra hour
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-ink/12">
                <th scope="row" className="py-[16px] pr-[16px] text-left font-bold">
                  Monday – Thursday
                </th>
                <td className="py-[16px] pr-[16px] font-display text-d5 tabular-nums">$400</td>
                <td className="py-[16px] font-display text-d5 tabular-nums">$200</td>
              </tr>
              <tr className="border-b border-ink/12">
                <th scope="row" className="py-[16px] pr-[16px] text-left font-bold">
                  Friday – Sunday
                </th>
                <td className="py-[16px] pr-[16px] font-display text-d5 tabular-nums">$500</td>
                <td className="py-[16px] font-display text-d5 tabular-nums">$250</td>
              </tr>
              <tr>
                <th scope="row" className="py-[16px] pr-[16px] text-left font-bold">
                  Consoles on board
                </th>
                <td className="py-[16px] pr-[16px]" colSpan={2}>
                  {/* Del brief. La decisión de publicar los números del brief y no
                      los del sitio viejo es del 2026-09-11: ver el encabezado de
                      /the-experience. */}
                  <span className="text-[16px] font-bold">
                    4 PlayStation 5 · 4 Xbox Series X · 2 Nintendo Switch 2
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-[32px] grid gap-[28px] lg:grid-cols-2 lg:gap-[56px]">
          <div>
            <Heading level={2} role="label">
              What&rsquo;s included
            </Heading>
            <span aria-hidden="true" className="mt-[8px] block h-[2px] w-[28px] bg-river" />
            <ul className="mt-[14px] flex flex-col gap-[8px] text-[16px] leading-[1.65] text-body/80">
              <li className="border-b border-ink/12 pb-[8px]">A Game Coach for the full session</li>
              <li className="border-b border-ink/12 pb-[8px]">
                Ten consoles: PlayStation 5, Xbox Series X and Nintendo Switch 2
              </li>
              <li className="border-b border-ink/12 pb-[8px]">
                The physical library plus subscription catalogues
              </li>
              <li className="border-b border-ink/12 pb-[8px]">
                Titles rated E for Everyone through M for Mature
              </li>
              <li>Air conditioning</li>
            </ul>
          </div>

          <div>
            <Heading level={2} role="label">
              Good for
            </Heading>
            <span aria-hidden="true" className="mt-[8px] block h-[2px] w-[28px] bg-river" />
            <ul className="mt-[14px] flex flex-wrap gap-[8px]">
              {GOOD_FOR.map((g) => (
                <li
                  key={g}
                  className="rounded-pill border border-ink/20 px-[14px] py-[7px] text-[15px]"
                >
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="cream" band="md">
        <div className="grid gap-[28px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-[64px]">
          <Heading level={2} className="text-d5 lg:text-d4">
            Before you book
          </Heading>
          <div className="flex flex-col gap-[12px] text-[16px] leading-[1.7] text-body/80">
            <p>
              Every player signs a waiver. For under-18s a parent or guardian signs, and we can send
              it ahead so nobody fills in paperwork at the door.
            </p>
            <p>
              If the truck is coming to you rather than staying here, tell us the address and the
              parking situation in the request. It changes what we can bring.
            </p>
            <p className="text-body/75">
              Pricing carried over from the current site. Confirm before booking.
            </p>
            <div className="mt-[8px]">
              <ButtonLink href="/events/inquire" variant="primary">
                Request a proposal
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
