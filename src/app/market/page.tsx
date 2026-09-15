import type { Metadata } from 'next';
import Link from 'next/link';
import MarketVendorForm from '@/components/sections/MarketVendorForm';
import { PROVIDES, STEPS } from '@/content/market';
import { getVenue } from '@/lib/venue';
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
    url: '/images/venue/venue-aerial.jpg',
    width: 1000,
    height: 667,
    alt: 'The yard at Rooftop at Riverside seen from the rooftop',
  },
});

/** /market — Neighborhood Market. Copy del cliente, de /neighborhood-market. */
export default async function MarketPage() {
  const venue = await getVenue();

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
        image={null}
        imageBrief="Un día de feria: los puestos de artesanos armados en el patio, con gente recorriendo. Horizontal."
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
            more, whether you&rsquo;re looking for a gift, treating yourself, or just enjoying the
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

        <div className="mt-bloque grid gap-[28px] lg:grid-cols-2 lg:gap-[56px]">
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

          {/*
            QUÉ PONE CADA UNO. Es la pregunta que un vendor hace primero y la
            que decide si se anota: si tiene que traer mesa, si puede llevar
            carpa, si hay luz. Todo esto sale del sitio vigente.
          */}
          <div className="grid gap-[28px] sm:grid-cols-2 lg:grid-cols-1 lg:gap-[32px]">
            {[
              { titulo: 'We bring', items: PROVIDES.venue },
              { titulo: 'You bring', items: PROVIDES.vendor },
            ].map(({ titulo, items }) => (
              <div key={titulo}>
                <Heading level={3} role="label">
                  {titulo}
                </Heading>
                <ul className="mt-[14px] flex list-none flex-col gap-[10px]">
                  {items.map((i) => (
                    <li key={i} className="flex items-start gap-[10px] text-[16px] leading-[1.6]">
                      <span
                        aria-hidden="true"
                        className="mt-[8px] size-[6px] shrink-0 rounded-pill bg-sunset"
                      />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/*
        ══════════════════════════════════════════════════════════════════
        BLOQUE D: los pasos, numerados.

        ⚠️ ACÁ SÍ VAN NUMERADOS y en el resto del sitio no. Pedir un puesto es
        una SECUENCIA —enviás, contestamos, pagás y venís— y el orden importa.
        Una lista de bullets dejaría a alguien creyendo que puede pagar antes
        de que le confirmen el lugar.
        ══════════════════════════════════════════════════════════════════
      */}
      <Section band="lg" labelledBy="steps-title">
        <SectionHead
          eyebrow="How to get a spot"
          eyebrowTone="plum"
          id="steps-title"
          title="Three steps, and the first one takes two minutes"
        />
        <ol className="mt-[48px] grid list-none gap-[32px] lg:grid-cols-3 lg:gap-[48px]">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <p
                aria-hidden="true"
                className="font-display text-titan uppercase leading-[0.8] tabular-nums text-sunset"
              >
                {String(i + 1).padStart(2, '0')}
              </p>
              <Heading level={3} role="card" className="mt-[12px]">
                <span className="sr-only">Step {i + 1}: </span>
                {s.title}
              </Heading>
              <p className="mt-[10px] max-w-[42ch] text-[16px] leading-[1.7] text-body/80">
                {s.body}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ══ El formulario ═══════════════════════════════════════════════ */}

      <Section
        tone="bone"
        band="lg"
        labelledBy="apply-title"
        id="apply"
        className="scroll-mt-24"
      >
        <div className="grid gap-[48px] lg:grid-cols-[1fr_1.1fr] lg:gap-[72px]">
          <div>
            <SectionHead
              eyebrow="Apply"
              eyebrowTone="terra"
              id="apply-title"
              title="Tell us what you make"
              lead="Eleven fields, and most of them are one line. We answer within one business day."
            />
            <p className="mt-[24px] max-w-[46ch] text-[16px] leading-[1.7] text-body/80">
              If your question is not about a booth, the{' '}
              <Link href="/contact" className="link-texto font-bold">
                contact form
              </Link>{' '}
              goes to the same people and asks for less.
            </p>
          </div>
          <MarketVendorForm />
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
