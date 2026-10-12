import type { Metadata } from 'next';
import Image from 'next/image';
import MarketVendorForm from '@/components/sections/MarketVendorForm';
import { PROVIDES, SHOTS, STEPS, TERMS } from '@/content/market';
import { getVenue } from '@/lib/venue';
import { ButtonLink } from '@/components/shared/Button';
import FormSlab from '@/components/shared/FormSlab';
import { RevealItem, StaggerGroup } from '@/components/shared/Motion';
import PlateHero from '@/components/shared/PlateHero';
import Section from '@/components/shared/Section';
import SoftWave from '@/components/shared/SoftWave';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  route: '/market',
  image: {
    url: '/og/market.jpg',
    width: 1200,
    height: 630,
    alt: 'Stalls and pop-up tents set up in the yard on a market day',
  },
});

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
      <PlateHero
        question="Looking for a local makers market in Bonita Springs?"
        title={'Meet the '}
        titleAccent="makers"
        lead="An afternoon of handmade things in the yard, with the trucks cooking and the bar open upstairs. And if you are the one who makes the thing, this is where you set up a table."
        photo="/images/market/hero-yard-wide.webp"
        photoAlt="Stalls and pop-up tents in the yard on a market day, with racks of clothes and two vendors at their stand"
      >
        <ButtonLink href="#apply" variant="primary" size="lg">
          Book a booth
        </ButtonLink>
        <ButtonLink href="/whats-on" variant="secondary" size="lg">
          See what&rsquo;s on
        </ButtonLink>
      </PlateHero>
      <SoftWave from="bone" to="deep" className="relative -mb-px" />
      <Section tone="deep" band="lg" labelledBy="wall-title" width="full">
        <div className="caja lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
        <SectionHead
          eyebrow="A market day"
          eyebrowTone="cream"
          id="wall-title"
          title={
            <>
              Every table here is{' '}
              <span className="text-sunset">somebody&rsquo;s work</span>
            </>
          }
        />
          <div className="lg:pb-2">
            <p className="bajada m-0 mt-gap-bajada max-w-[52ch] text-paper/85 lg:mt-0">
              Jewelry, prints, plants, clothes, homeware and food, set out by the people who made
              them. These are past markets in the yard.
            </p>
            <div className="mt-gap-cta">
              <ButtonLink href="#apply" variant="onDark" size="lg">
                Book a booth
              </ButtonLink>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="-mx-gutter mt-2 overflow-hidden pt-6 pb-13 md:-mx-gutter-lg">
          <div className="rt-marquee-rev flex w-max items-center gap-4 lg:gap-6">
            {[...SHOTS, ...SHOTS].map((s, i) => (
              <div
                key={`${s.src}-${i}`}
                className="relative h-[240px] w-[190px] shrink-0 overflow-hidden rounded-ticket bg-fog sombra-card lg:h-[340px] lg:w-[270px] lg:rounded-shell"
              >
                <Image
                  src={s.src}
                  alt=""
                  fill
                  sizes="(max-width: 1023px) 190px, 270px"
                  className="object-cover"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-2.5 rounded-[8px] border border-dashed border-paper/85 [filter:drop-shadow(0_1px_1px_rgb(0_0_0/0.35))] lg:inset-3.5 lg:rounded-ticket"
                />
              </div>
            ))}
          </div>
        </div>
      </Section>
      <Section tone="bone" band="lg" labelledBy="steps-title" className="banda-arco z-[2]">
        <SectionHead
          align="center"
          eyebrow="Set up with us"
          eyebrowTone="plum"
          id="steps-title"
          title={
            <>
              Somewhere your work <span className="text-sunset-deep">gets seen</span>
            </>
          }
          lead="Your table goes in the yard, next to the crowd that is already here for the trucks and the bar. They came for lunch, and they leave knowing what you make."
        />
        <div className="mt-gap-cta flex justify-center">
          <ButtonLink href="#apply" variant="primary" size="lg">
            Apply for a booth
          </ButtonLink>
        </div>
        <StaggerGroup
          as="ol"
          aria-label="How to get a market booth, step by step"
          className="mx-auto mt-bloque grid max-w-[560px] list-none gap-6 p-0 pt-2 pb-7 lg:max-w-none lg:grid-cols-3"
        >
          {STEPS.map((s, i) => (
            <RevealItem
              key={s.title}
              as="li"
              className="relative flex pt-12.5 [filter:drop-shadow(0_1px_2px_rgba(10,31,30,0.10))_drop-shadow(0_8px_16px_rgba(10,31,30,0.16))]"
            >
              <span className="sticker absolute top-0 left-1/2 z-30 grid size-20 -translate-x-1/2 place-items-center rounded-pill bg-paper p-1">
                <span className="grid size-full place-items-center rounded-pill bg-sunset p-1.25">
                  <span className="grid size-full place-items-center content-center rounded-pill bg-cream">
                    <span className="font-body text-[14px] font-bold uppercase tracking-[0.14em] text-deep">
                      Step
                    </span>
                    <span className="font-display text-d5 font-extrabold leading-none text-deep">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </span>
                </span>
              </span>
              <div className="troquel relative flex flex-1 flex-col items-center gap-3.5 rounded-ticket bg-paper px-5.5 pt-12 pb-13 text-center lg:px-8 lg:pt-15 lg:pb-14">
                <span className="font-body text-caption font-medium uppercase tracking-[0.18em] text-muted">
                  {s.kicker}
                </span>
                <h3 className="m-0 max-w-[16ch] font-display text-d4 font-bold uppercase leading-[0.98] text-ink lg:text-h3">
                  {s.title}
                </h3>
                <p className="m-0 max-w-[34ch] font-body text-base font-light text-ink">{s.body}</p>
              </div>
            </RevealItem>
          ))}
        </StaggerGroup>
      </Section>
      <Section band="lg" labelledBy="bring-title">
        <SectionHead
          eyebrow="Before the day"
          eyebrowTone="deep"
          id="bring-title"
          title={
            <>
              What we set out, and <span className="text-sunset-deep">what you bring</span>
            </>
          }
          lead="The yard, the power and the crowd are ours. The table and everything on it is yours."
        />
        <div className="mt-gap-cta">
          <ButtonLink href="#apply" variant="primary" size="lg">
            Save your spot
          </ButtonLink>
        </div>
        <div className="mt-bloque grid gap-6 lg:grid-cols-2 lg:gap-8">
          <article className="relative flex h-full flex-col rounded-shell bg-bone p-8 lg:p-10">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-3.5 rounded-shell border border-dashed border-teal600/55"
            />

            <div className="relative flex h-full flex-col">
              <Eyebrow tone="deep">The stand</Eyebrow>
              <Heading level={3} className="mt-gap-kicker">
                What a table costs
              </Heading>
              <dl className="m-0 mt-7 flex list-none flex-col border-t border-ink/15 p-0 pt-6">
                {TERMS.map((t) => (
                  <div
                    key={t.label}
                    className="flex items-baseline justify-between gap-6 border-b border-dashed border-ink/15 py-3.5 last:border-b-0 last:pb-0"
                  >
                    <dt className="font-body text-caption font-medium uppercase tracking-eyebrow text-muted">
                      {t.label}
                    </dt>
                    <dd className="m-0 font-display text-d5 font-extrabold leading-none tabular-nums text-deep">
                      {t.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="m-0 mt-6 font-body text-dato font-light leading-[1.65] text-body/75">
                Ten by ten feet is the standard space, there is electricity if you ask for it
                ahead, and the last approval happens at check-in on the day. We have not published
                the next market days here yet, so write the ones you want into the form and we come
                back to you with what is open.
              </p>
            </div>
          </article>
          <article className="relative flex h-full flex-col rounded-shell bg-bone p-8 lg:p-10">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-3.5 rounded-shell border border-dashed border-terra/45"
            />

            <div className="relative flex h-full flex-col">
              <Eyebrow tone="terra">On you</Eyebrow>
              <Heading level={3} className="mt-gap-kicker">
                You bring
              </Heading>
              <ul className="mt-7 flex list-none flex-col gap-3.5 border-t border-ink/15 p-0 pt-6">
                {PROVIDES.vendor.map((i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 font-body text-lead font-light leading-[1.5] text-body/85"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2.75 size-1.75 shrink-0 rounded-pill bg-sunset"
                    />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </Section>
      <FormSlab
        id="apply"
        eyebrow="Apply"
        eyebrowTone="terra"
        title={
          <>
            Tell us <span className="text-sunset-deep">what you make</span>
          </>
        }
        titleId="apply-title"
        lead="Show us your work and tell us which market days you are after. A person reads it and answers within one business day."
        aside={
          <div className="flex flex-col gap-1.5">
            <a href={`mailto:${venue.email}`} className="link-texto font-body text-base">
              {venue.email}
            </a>
            <a href={venue.phoneHref} className="link-texto font-body text-base">
              {venue.phone}
            </a>
          </div>
        }
      >
        <MarketVendorForm />
      </FormSlab>
    </>
  );
}
