import type { Metadata } from 'next';
import Image from 'next/image';
import { ButtonLink } from '@/components/shared/Button';
import SoftWave from '@/components/shared/SoftWave';
import MenuSheets from '@/components/sections/MenuSheets';
import NfcNorthSundays from '@/components/sections/NfcNorthSundays';
import PlateHero from '@/components/shared/PlateHero';
import Section from '@/components/shared/Section';
import { Heading } from '@/components/shared/Type';
import { SEASONAL } from '@/content/seasonal';
import { HAPPY_HOUR_GROUPS } from '@/content/happy-hour';
import { getBarMenu } from '@/lib/sanity-bar-menu';
import { getSeasonalCocktails } from '@/lib/sanity-seasonal-cocktails';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  route: '/sunset-bar',
  image: {
    url: '/og/sunset-bar.jpg',
    width: 1200,
    height: 630,
    alt: 'Four cocktails on a table on the rooftop at golden hour, with the bar and the umbrellas behind',
  },
});

export const revalidate = 300;

export default async function SunsetBarPage() {
  const menu = await getBarMenu();
  const hasSeasonalCocktails = (await getSeasonalCocktails()).length > 0;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(breadcrumbJsonLd([{ name: 'Sunset Bar', path: '/sunset-bar' }])),
        }}
      />
      <PlateHero
        question="Looking for somewhere special to get together?"
        title={"Bonita's only "}
        titleAccent="rooftop"
        lead="Gather your family and friends for chef-driven street eats and ice-cold drinks. Catch the breeze from the roof, watch the energy of downtown Bonita Springs unfold below, and stay for the view. Rise above it all at the city’s only rooftop bar."
        photo="/images/venue/bar-cocktails-wide.webp"
        photoAlt="Four cocktails on a table on the rooftop at golden hour, with the bar and the umbrellas behind"
      >
        <ButtonLink href="#bar-menu-title" variant="primary" size="lg">
          See the menu
        </ButtonLink>
        <ButtonLink href="/whats-on" variant="secondary" size="lg">
          What&rsquo;s on tonight
        </ButtonLink>
      </PlateHero>
      <SoftWave from="bone" to="deep" className="relative -mb-px" />
      <Section tone="deep" band="md" labelledBy="hh-title">
        <div className="relative text-center">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-[-104px] left-0 w-[76px] -rotate-6 sm:top-[-150px] sm:w-[118px] desk:top-[-236px] desk:w-[184px]"
          >
            <span className="sticker-dark rt-float block">
              <Image
                src="/brand/seal.svg"
                alt=""
                width={260}
                height={260}
                className="block h-auto w-full"
              />
            </span>
          </span>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-[-88px] right-0 w-[68px] rotate-6 sm:top-[-120px] sm:w-[104px] desk:top-[-172px] desk:w-[164px]"
          >
            <span className="sticker-dark rt-float-2 block">
              <Image
                src="/brand/emblem.svg"
                alt=""
                width={260}
                height={260}
                className="block h-auto w-full"
              />
            </span>
          </span>

          <Heading level={2} id="hh-title" className="text-band text-paper">
            Happy hour
          </Heading>
          <div className="mt-9 grid gap-6 lg:mt-11 lg:grid-cols-2 lg:gap-7">
            {HAPPY_HOUR_GROUPS.map((g) => (
              <article
                key={g.id}
                aria-labelledby={`hh-${g.id}-title`}
                className="relative flex flex-col items-center rounded-frame bg-bone grain px-6 py-9 text-center sm:px-10"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-3.5 rounded-shell border border-dashed border-teal600/55"
                />
                <Heading level={3} id={`hh-${g.id}-title`} className="relative text-d4 text-ink lg:text-d3">
                  {g.title}
                </Heading>
                <p className="relative mt-4 flex w-fit max-w-full flex-col items-center rounded-btn border border-dashed border-ink/40 px-4 py-2 text-center font-display text-d7 uppercase tracking-[0.06em] text-deep sm:flex-row sm:gap-[0.5ch] sm:px-5 sm:tracking-eyebrow lg:text-d6">
                  <span className="whitespace-nowrap">{g.days}</span>
                  <span aria-hidden="true" className="hidden sm:inline">
                    ·
                  </span>
                  <span className="whitespace-nowrap">{g.time}</span>
                </p>
                <ul className="relative m-0 mt-6 flex w-full list-none flex-col divide-y divide-dashed divide-ink/20 p-0">
                  {g.deals.map((d) => (
                    <li
                      key={d.what}
                      className="flex flex-col items-center gap-1 py-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-3 sm:gap-y-0 sm:py-3.5"
                    >
                      <span className="font-display text-d4 leading-none whitespace-nowrap tabular-nums text-sunset-deep lg:text-d3">
                        {d.price}
                      </span>
                      <span className="font-body text-d7 text-ink sm:text-d6">{d.what}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <ButtonLink href="/whats-on" variant="onDark" size="lg">
              See what&rsquo;s on this week
            </ButtonLink>
          </div>
          {SEASONAL.NFC_NORTH_SUNDAYS ? <NfcNorthSundays /> : null}
        </div>
      </Section>
      <MenuSheets menu={menu} />
      {hasSeasonalCocktails ? (
        <Section tone="bone" band="sm" bandTop="none" labelledBy="seasonal-promo-title">
          <div className="text-center">
            <Heading level={2} id="seasonal-promo-title" className="text-d4 text-ink lg:text-d3">
              What&rsquo;s Pouring This Season?
            </Heading>
            <div className="mt-6 flex justify-center">
              <ButtonLink href="/seasonal-cocktails" variant="primary" size="lg">
                See Seasonal Cocktails
              </ButtonLink>
            </div>
          </div>
        </Section>
      ) : null}
    </>
  );
}

