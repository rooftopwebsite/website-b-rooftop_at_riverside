import type { Metadata } from 'next';
import IntroSplit from '@/components/shared/IntroSplit';
import Image from 'next/image';
import Link from 'next/link';
import GameShelf from '@/components/sections/GameShelf';
import SpecSlab from '@/components/sections/SpecSlab';
import { ButtonLink } from '@/components/shared/Button';
import { Balloons, GridFour, Ticket } from '@/components/shared/Icon';
import { RevealItem, StaggerGroup } from '@/components/shared/Motion';
import { PendingData } from '@/components/shared/PendingData';
import PlateHero from '@/components/shared/PlateHero';
import Section from '@/components/shared/Section';
import SoftWave from '@/components/shared/SoftWave';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
import {
  CONSOLES,
  GAMES,
  GAMES_TOTAL,
  PACKAGES,
  PACKAGE_INCLUDES,
  RATES,
  SCREENS,
} from '@/content/game-truck';
import { LEGAL_DOCS } from '@/content/legal-docs';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';
import { getVenue, venueAddressLine } from '@/lib/venue';

export const metadata: Metadata = pageMeta({ route: '/game-truck' });

export default async function GameTruckPage() {
  const venue = await getVenue();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(breadcrumbJsonLd([{ name: 'Gaming Truck', path: '/game-truck' }])),
        }}
      />
      <PlateHero
        question="Looking for a gaming truck party in Bonita Springs?"
        title={'Game night '}
        titleAccent="on wheels"
        photo="/images/game-truck/truck-inside-wide.webp"
        photoAlt="A player at the screens inside the Rooftop gaming truck"
      />
      <IntroSplit id="inside-title" title="Inside " accent="the truck">
              <p className="m-0 max-w-[52ch] font-body text-intro font-light text-ink">
                Three consoles, {SCREENS} screens and a Game Coach, in an air conditioned trailer
                parked in the yard. Ten dollars gets you on a controller.
              </p>

              <p className="m-0 mt-3 max-w-[52ch] font-body text-intro font-light text-ink">
                The venue built the trailer for this. Get on for half an hour without booking
                anything, or take the whole truck for two hours and bring your own crowd. The Game
                Coach stays on board the whole time: sets up the screens, changes the game when the
                room gets bored of it, and keeps the controllers in circulation. You do not book a
                console, you book the truck.
              </p>
              <div className="mt-gap-cta flex flex-wrap gap-3.5">
                <ButtonLink href="/events?area=game-truck#inquire" variant="primary" size="lg">
                  Book a party
                </ButtonLink>
                <ButtonLink href="#games" variant="secondary" size="lg">
                  See the games
                </ButtonLink>
              </div>
      </IntroSplit>
      <SoftWave from="bone" to="deep" className="relative -mb-px" />

      <Section tone="deep" band="lg" labelledBy="specs-title">
        <SpecSlab
          id="specs-title"
          title={
            <>
              The truck, <span className="text-sunset">on paper</span>
            </>
          }
          figure={{ value: String(SCREENS), label: 'high definition screens' }}
          figureIcon={GridFour}
          second={{
            value: GAMES_TOTAL,
            label: 'games on board',
            note: `${GAMES.length} of them are published. E rated through M rated.`,
          }}
          secondIcon={Ticket}
          invertedText={
            <>
              There is a <strong className="font-semibold text-deep">Game Coach</strong> on board
              for the <strong className="font-semibold text-deep">whole session</strong>, and these
              are the consoles they run.
            </>
          }
          invertedDetail={CONSOLES}
          data={[
            ['Where', 'The yard, under the rooftop'],
            ['Climate', 'Air conditioned'],
          ]}
        />
      </Section>
      <Section
        band="lg"
        bandBottom="none"
        labelledBy="games-title"
        id="games"
        width="full"
        className="band-arc z-[2] scroll-mt-24"
      >
        <GameShelf
          footer={
            <p className="mx-auto max-w-[62ch] font-body text-base leading-[1.65] text-body/80">
              The truck carries {GAMES_TOTAL} titles.
            </p>
          }
          wave={<SoftWave from="paper" to="bone" className="absolute inset-x-0 bottom-0" />}
        >
          <div className="flex justify-center">
            <Image
              src="/brand/isotype-truck.svg"
              alt=""
              aria-hidden="true"
              width={552}
              height={390}
              className="w-20 lg:w-24"
            />
          </div>

          <SectionHead
            align="center"
            eyebrow="The library"
            eyebrowTone="deep"
            id="games-title"
            title={
              <>
                What is on <span className="text-sunset-deep">the shelf</span>
              </>
            }
            lead="Sports, shooters, racing and everything Nintendo. The coach can put any of these up, and the rating is on you."
            className="mt-8"
          />
          <div className="mt-gap-cta flex justify-center">
            <ButtonLink href="/events?area=game-truck#inquire" variant="primary" size="lg">
              Book a party
            </ButtonLink>
          </div>
        </GameShelf>
      </Section>
      <Section tone="bone" band="lg" labelledBy="rates-title" id="packages" className="scroll-mt-24">
        <SectionHead
          align="center"
          eyebrow="What it costs"
          eyebrowTone="deep"
          id="rates-title"
          title={
            <>
              Jump in, <span className="text-sunset-deep">or book the whole truck</span>
            </>
          }
          lead="Two ways to get on. One takes no planning at all, and the other hands you the whole trailer for two hours."
        />
        <StaggerGroup
          as="ul"
          className="mt-block grid list-none grid-cols-1 items-stretch gap-6 p-0 md:grid-cols-2"
        >
          <RevealItem as="li" className="h-full">
            <div className="flex h-full flex-col rounded-shell bg-paper p-7 text-ink card-shadow lg:p-9">
              <div className="flex items-center gap-3.5">
                <Ticket className="size-8 shrink-0" />
                <span className="font-body text-caption font-bold uppercase tracking-eyebrow">
                  Walk up
                </span>
              </div>

              <Heading level={3} className="mt-5 max-w-[16ch] text-d5 lg:text-d4">
                Get on a controller
              </Heading>

              <dl className="m-0 mt-6 flex list-none flex-col border-t border-fog p-0 pt-6">
                {RATES.map((r) => (
                  <div
                    key={r.label}
                    className="flex flex-col gap-1.5 border-b border-dashed border-ink/15 py-4 last:border-b-0 last:pb-0 desk:flex-row desk:items-baseline desk:justify-between desk:gap-6"
                  >
                    <dt className="font-display text-d6 font-semibold uppercase leading-none text-ink">
                      {r.label}
                    </dt>
                    <dd className="m-0 shrink-0 font-display text-d5 font-semibold uppercase tabular-nums text-sunset-deep">
                      ${r.price}
                      <span className="ml-2 font-body text-base font-normal normal-case tracking-normal text-body/75">
                        {r.unit}
                        {r.note ? `, ${r.note}` : ''}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="m-0 pt-8 font-body text-base font-light leading-[1.5] text-body/80">
                No package, no booking, no minimum. Come up to the truck and get on.
              </p>
            </div>
          </RevealItem>
          <RevealItem as="li" className="h-full">
            <div className="flex h-full flex-col rounded-shell bg-deep p-7 text-paper card-shadow lg:p-9">
              <div className="flex items-center gap-3.5">
                <Balloons className="size-8 shrink-0" />
                <span className="font-body text-caption font-bold uppercase tracking-eyebrow">
                  Book the truck
                </span>
              </div>

              <Heading level={3} className="mt-5 max-w-[16ch] text-d5 lg:text-d4">
                Two hours, the whole trailer
              </Heading>
              <ul className="m-0 mt-6 flex list-none flex-col gap-3.5 border-t border-paper/20 p-0 pt-6">
                {PACKAGE_INCLUDES.slice(0, 2).map((i) => (
                  <li key={i} className="flex gap-3.5">
                    <span
                      aria-hidden="true"
                      className="mt-2.25 size-1.5 shrink-0 rounded-pill bg-cream"
                    />
                    <span className="font-body text-base font-light leading-[1.5]">{i}</span>
                  </li>
                ))}
                <li className="flex gap-3.5">
                  <span
                    aria-hidden="true"
                    className="mt-2.25 size-1.5 shrink-0 rounded-pill bg-cream"
                  />
                  <span className="font-body text-base font-light leading-[1.5]">
                    Nobody else on board: the screens and the games are all yours
                  </span>
                </li>
              </ul>

              <span className="mt-auto pt-8">
                <ButtonLink href="/events?area=game-truck#inquire" variant="onDark">
                  Ask about a party
                </ButtonLink>
              </span>
            </div>
          </RevealItem>
        </StaggerGroup>
        <div className="mt-block grid items-stretch gap-8 lg:grid-cols-2 lg:gap-10">
          {PACKAGES.map((pkg) => (
            <article
              key={pkg.slug}
              className="relative flex flex-col rounded-frame bg-paper px-6 pt-14 pb-10 text-center card-shadow sm:px-10 sm:pt-16"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-3.5 rounded-shell border border-dashed border-teal600/45"
              />
              <span
                aria-hidden="true"
                className="sticker absolute -top-px left-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
              >
                <span className="block rounded-pill bg-cream px-5 py-2.5">
                  <span className="block font-display text-d6 font-bold uppercase leading-none whitespace-nowrap text-deep">
                    {pkg.days}
                  </span>
                </span>
              </span>

              <div className="relative flex flex-1 flex-col">
                <Heading level={3} className="mt-6 text-d5 lg:text-d4">
                  {pkg.name}
                </Heading>
                <p className="m-0 mt-6 font-display text-d1 font-semibold uppercase tabular-nums text-ink">
                  ${pkg.price}
                </p>
                <p className="m-0 mt-2 font-body text-lead font-light text-body/80">
                  for {pkg.hours} hours, all in
                </p>
                <p className="m-0 mt-auto pt-8 font-body text-base text-body/80">
                  Each extra hour{' '}
                  <span className="font-display text-d6 font-semibold uppercase tabular-nums text-ink">
                    ${pkg.extraHour}
                  </span>
                </p>
              </div>
            </article>
          ))}
        </div>
      <div id="policies" className="mt-block scroll-mt-24">
        <div className="grid gap-x-12 gap-y-7 border-t border-ink/15 pt-8 lg:grid-cols-[minmax(0,24ch)_1fr]">
          <div>
            <Eyebrow tone="terra">The paperwork</Eyebrow>
            <h3
              id="policies-title"
              className="mt-gap-kicker font-body text-lead font-semibold text-ink"
            >
              The rules, in full
            </h3>
          </div>

          <ul className="m-0 grid list-none gap-0 p-0 sm:grid-cols-3 sm:gap-x-8">
            {LEGAL_DOCS.map((d) => (
              <li
                key={d.href}
                className="border-t border-ink/10 py-4 first:border-t-0 first:pt-0 sm:border-t-0 sm:py-0"
              >
                <Link
                  href={d.href}
                  className="link-text font-body text-base font-semibold text-ink"
                >
                  {d.label}
                </Link>
                <p className="mt-1.5 max-w-[34ch] font-body text-data leading-[1.6] text-muted">
                  {d.blurb}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      </Section>
    </>
  );
}
