import type { Metadata } from 'next';
import { ButtonLink } from '@/components/shared/Button';
import PageHero from '@/components/shared/PageHero';
import { PendingData } from '@/components/shared/PendingData';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
import { BRAND } from '@/lib/brand';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  route: "/market",
  image: {
    url: '/images/venue-park.jpg',
    width: 2000,
    height: 1333,
    alt: 'The yard at Rooftop at Riverside set up for the Neighborhood Market',
  },
});

/** /market — Neighborhood Market. Copy del cliente, de /neighborhood-market. */
export default function MarketPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(breadcrumbJsonLd([{ name: 'Market', path: '/market' }])),
        }}
      />

      <PageHero
        eyebrow="Neighborhood Market"
        title="The Neighborhood Market"
        lead="A curated set of local makers showing handmade goods, with the trucks cooking and the bar open the whole time."
        image="/images/venue-park.jpg"
        imageAlt="Vendors and visitors in the yard at Rooftop at Riverside"
        crumbs={[{ name: 'Market', path: '/market' }]}
      >
        <ButtonLink href="/whats-on" variant="primary" size="lg">
          Next market date
        </ButtonLink>
      </PageHero>

      <Section band="lg" width="prose">
        <div className="flex flex-col gap-[16px] text-lead leading-[1.7] text-body/85">
          <p>
            Explore a curated selection of local vendors showing unique goods, handmade crafts and
            more — whether you&rsquo;re looking for a gift, treating yourself, or just enjoying the
            atmosphere.
          </p>
          <p>
            While you shop, eat from the trucks, get a drink from the bar and catch whoever&rsquo;s
            playing. It&rsquo;s a way to spend an afternoon supporting people who live here.
          </p>
        </div>
      </Section>

      {/* ── Ser vendor ─────────────────────────────────────────────────── */}
      <Section tone="cream" band="lg" labelledBy="vendor-title">
        <SectionHead
          eyebrow="Sell with us"
          eyebrowTone="deep"
          id="vendor-title"
          title="Vendor spots"
          lead="First come, first served. Approved at check-in."
        />

        <div className="mt-[40px] grid gap-[28px] lg:grid-cols-2 lg:gap-[56px]">
          <dl className="flex flex-col divide-y divide-ink/15 border-y border-ink/15">
            <div className="flex items-baseline justify-between gap-[16px] py-[16px]">
              <dt className="eyebrow text-body/75">Fee</dt>
              <dd className="font-display text-d5 tabular-nums">$30</dd>
            </div>
            <div className="flex items-baseline justify-between gap-[16px] py-[16px]">
              <dt className="eyebrow text-body/75">Space</dt>
              <dd className="text-[16px] font-bold">10 × 10 ft</dd>
            </div>
            <div className="flex items-baseline justify-between gap-[16px] py-[16px]">
              <dt className="eyebrow text-body/75">Pop-up tents</dt>
              <dd className="text-[16px] font-bold">Allowed</dd>
            </div>
            <div className="flex items-baseline justify-between gap-[16px] py-[16px]">
              <dt className="eyebrow text-body/75">Power</dt>
              <dd className="text-[16px] font-bold">On request</dd>
            </div>
            <div className="flex items-baseline justify-between gap-[16px] py-[16px]">
              <dt className="eyebrow text-body/75">Next dates</dt>
              <dd>
                <PendingData detail="Upcoming market dates not supplied yet" />
              </dd>
            </div>
          </dl>

          <div className="flex flex-col gap-[14px] text-[16px] leading-[1.7] text-body/80">
            <p>
              Spots are first come, first served and get approved at check-in. Anything bigger than
              10 × 10 needs the OK ahead of time.
            </p>
            <p>
              If you make something and want a corner of the yard for an afternoon, send a note with
              your business name, what you sell and your social handles.
            </p>
            <div className="mt-[8px] flex flex-wrap gap-[12px]">
              <ButtonLink href={`mailto:${BRAND.contact.email}?subject=Neighborhood%20Market%20vendor`} variant="primary">
                Apply as a vendor
              </ButtonLink>
              <ButtonLink href="/contact" variant="secondary">
                Ask a question
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      <Section band="md">
        <div className="flex flex-col items-start gap-[20px] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Eyebrow tone="terra">While you&rsquo;re here</Eyebrow>
            <Heading level={2} className="mt-[8px] text-d5 lg:text-d4">
              The trucks and the bar run all day
            </Heading>
          </div>
          <div className="flex flex-wrap gap-[12px]">
            <ButtonLink href="/food-trucks" variant="secondary">
              Food trucks
            </ButtonLink>
            <ButtonLink href="/sunset-bar" variant="secondary">
              Sunset Bar
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
