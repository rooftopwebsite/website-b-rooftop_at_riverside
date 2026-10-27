import Link from 'next/link';
import type { ComponentType, SVGProps } from 'react';
import { ArrowRight, ArrowUpRight, Balloons, Martini, Truck } from '@/components/shared/Icon';
import { Reveal, RevealItem, StaggerGroup } from '@/components/shared/Motion';

interface Door {
  readonly title: string;
  readonly body: string;
  readonly link: string;
  readonly href: string;
  readonly field: string;
  readonly ink: string;
  readonly iconInk: string;
  readonly Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const DOORS: readonly Door[] = [
  {
    title: 'Big flavors in the yard',
    body: 'Mexican street food, fresh seafood, American comfort classics and tropical fusion, each from its own chef. Come hungry and try a little of everything.',
    link: 'Meet the trucks',
    href: '/food-trucks',
    field: 'bg-deep',
    ink: 'text-paper',
    iconInk: 'text-cream',
    Icon: Truck,
  },
  {
    title: 'The bar with the sunset view',
    body: 'Craft cocktails made daily, local drafts, and the best west-facing seat in Bonita Springs.',
    link: 'See the bar',
    href: '/sunset-bar',
    field: 'bg-sunset',
    ink: 'text-ink',
    iconInk: 'text-ink',
    Icon: Martini,
  },
  {
    title: 'The home for your legendary party',
    body: 'Why settle for a stuffy banquet hall? Reserve a section of the outdoor patio, the whole second floor or the entire venue, right in the buzz of downtown. We host, we clean up. You go enjoy the party!',
    link: 'Plan an event',
    href: '/events',
    field: 'bg-cream',
    ink: 'text-ink',
    iconInk: 'text-deep',
    Icon: Balloons,
  },
];

export default function ThreeDoors() {
  return (
    <section
      aria-labelledby="doors-title"
      className="relative z-[3] band-arc bg-bone grain pt-16 pb-closing md:pt-20 lg:pt-24 desk:pt-32"
    >
      <div className="page-box-wide">
        <Reveal>
          <h2
            id="doors-title"
            className="mx-auto max-w-[18ch] text-center font-display text-band font-extrabold uppercase"
          >
            <span className="text-ink">Eat, drink and</span>{' '}
            <span className="text-sunset-deep">celebrate here</span>
          </h2>
          <p className="mx-auto mt-6 max-w-[60ch] text-center font-body text-lead font-light text-ink">
            A rooftop bar with a view, gourmet food trucks in the yard and a venue made for
            parties. Every visit turns into a different night.
          </p>
        </Reveal>
        <StaggerGroup as="ul" className="mt-block grid list-none grid-cols-1 gap-12 p-0 md:gap-5 lg:grid-cols-3 lg:gap-6">
          {DOORS.map(({ title, body, link, href, field, ink, iconInk, Icon }) => (
            <RevealItem as="li" key={href} className="h-full">
              <Link href={href} className="group flex h-full flex-col gap-3 md:flex-row md:gap-7 lg:flex-col lg:gap-3">
                <div className="relative mb-2.5 h-64 md:mb-0 md:h-56 md:w-75 md:shrink-0 lg:mb-2.5 lg:h-80 lg:w-auto">
                  <div
                    className={`bite flex size-full flex-col justify-between overflow-hidden rounded-door p-6 lg:p-7 ${field}`}
                  >
                    <Icon
                      className={`size-11 shrink-0 origin-top-left transition-transform duration-300 ease-brand group-hover:scale-106 lg:size-13 ${iconInk}`}
                    />
                    <h3
                      className={`m-0 mt-5 max-w-[13ch] text-balance pr-14 font-display text-d4 font-bold uppercase leading-[0.92] lg:text-d3 ${ink}`}
                    >
                      {title}
                    </h3>
                  </div>
                  <span
                    aria-hidden="true"
                    className={`absolute right-1 bottom-1 grid size-13.25 place-items-center rounded-pill ring-1 ring-ink/12 transition-colors duration-300 ease-brand group-hover:bg-ink group-hover:text-paper ${field} ${iconInk}`}
                  >
                    <ArrowUpRight />
                  </span>
                </div>

                <div className="contents md:flex md:flex-col md:justify-center md:gap-3 lg:contents">
                <p className="m-0 font-body text-data font-light text-ink md:max-w-[40ch] md:text-base lg:max-w-none lg:text-data">{body}</p>
                <span className="mt-auto inline-flex w-fit md:mt-0 lg:mt-auto items-center gap-2.25 border-b-2 border-sunset pt-2 pb-0.75 font-body text-base font-medium text-ink transition-colors duration-200 group-hover:text-sunset-deep">
                  {link}
                  <ArrowRight className="size-3.5 text-sunset-deep transition-transform duration-200 group-hover:translate-x-1" />
                </span>
                </div>
              </Link>
            </RevealItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
