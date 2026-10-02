import type { Metadata } from 'next';
import Image from 'next/image';
import { ButtonLink } from '@/components/shared/Button';
import SoftWave from '@/components/shared/SoftWave';
import MenuSheets from '@/components/sections/MenuSheets';
import FeaturedEventCard, { dealsNombrados } from '@/components/shared/FeaturedEventCard';
import PlateHero from '@/components/shared/PlateHero';
import Section from '@/components/shared/Section';
import { Heading } from '@/components/shared/Type';
import { getVenueEvents } from '@/content/events';
import { GAME_DAY_DEALS, GAME_DAY_LABEL, GAME_DAY_NOTE } from '@/content/game-day';
import { cartaDelBar } from '@/content/menus';
import { getHappyHour } from '@/content/happy-hour';
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

export default async function SunsetBarPage() {
  const happyHour = await getHappyHour();

  const carta = await cartaDelBar();

  const promosDelBar = (await getVenueEvents()).filter(
    (e) => e.space === 'Sunset Bar' && dealsNombrados(e, GAME_DAY_DEALS).length > 0,
  );

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
        lead="Bring your family or your friends for great food and cold drinks. Feel the breeze up on the roof, watch downtown Bonita Springs go by, and stay for the view. All of it at the only rooftop bar in Bonita Springs."
        photo="/images/venue/bar-cocktails-wide.webp"
        photoAlt="Four cocktails on a table on the rooftop at golden hour, with the bar and the umbrellas behind"
      >
        <ButtonLink href="#carta-title" variant="primary" size="lg">
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
            <span className="sticker-oscuro rt-flotar block">
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
            <span className="sticker-oscuro rt-flotar-2 block">
              <Image
                src="/brand/emblem.svg"
                alt=""
                width={260}
                height={260}
                className="block h-auto w-full"
              />
            </span>
          </span>

          <Heading level={2} id="hh-title" className="text-banda text-paper">
            Happy hour
          </Heading>
          <p className="mt-5 inline-block whitespace-nowrap rounded-btn border border-dashed border-cream/60 px-4 py-2 text-center font-display text-d7 uppercase tracking-[0.06em] text-cream sm:px-6 sm:py-2.5 sm:tracking-eyebrow lg:px-7 lg:py-3 lg:text-d6 desk:text-d5">
            <span>{happyHour.days}</span>
            <span aria-hidden="true">
              {' '}
              ·{' '}
            </span>
            <span>{happyHour.time}</span>
          </p>
          <div className="relative mt-9 rounded-frame bg-bone grano px-6 py-9 sm:px-10 lg:mt-11">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-3.5 rounded-shell border border-dashed border-teal600/55"
            />
            <ul className="relative m-0 flex list-none flex-col divide-y divide-dashed divide-ink/20 p-0 sm:flex-row sm:divide-x sm:divide-y-0">
              {happyHour.deals.map((d) => (
                <li
                  key={d.price}
                  className="flex flex-1 flex-col items-center justify-start gap-1 py-4 text-center sm:px-4 desk:flex-auto desk:flex-row desk:items-baseline desk:justify-center desk:gap-3 desk:py-2 desk:text-left"
                >
                  <span className="font-display text-d4 leading-none whitespace-nowrap tabular-nums text-sunset-deep sm:text-d3 lg:text-d2">
                    {d.price}
                  </span>
                  <span className="font-body text-d7 text-ink sm:text-d6 desk:text-d5">{d.what}</span>
                </li>
              ))}
            </ul>
            {happyHour.note ? (
              <p className="relative m-0 mt-5 text-center font-body text-base font-light text-ink/75">
                {happyHour.note}
              </p>
            ) : null}
          </div>
          <div className="mt-8 flex justify-center">
            <ButtonLink href="/whats-on" variant="onDark" size="lg">
              See what&rsquo;s on this week
            </ButtonLink>
          </div>
          {promosDelBar.length > 0 ? (
            <div id="nfc-north-hq" className="mt-11 flex scroll-mt-28 flex-col gap-7 lg:mt-14 lg:gap-9">
              {promosDelBar.map((ev) => {
                const promos = dealsNombrados(ev, GAME_DAY_DEALS);
                return (
                  <div key={ev.slug}>
                    {promos.length > 0 ? (
                      <p className="m-0 mx-auto mb-5 max-w-[52ch] font-body text-base font-light text-bone/85">
                        {GAME_DAY_NOTE}
                      </p>
                    ) : null}

                    <FeaturedEventCard
                      event={ev}
                      deals={GAME_DAY_DEALS}
                      dealsLabel={GAME_DAY_LABEL}
                      headingLevel={3}
                    />
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </Section>
      <MenuSheets pdfUrl={carta?.pdfUrl ?? null} />
    </>
  );
}

