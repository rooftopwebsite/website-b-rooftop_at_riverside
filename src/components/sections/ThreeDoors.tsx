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
  readonly tinta: string;
  readonly tintaIcono: string;
  readonly Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const DOORS: readonly Door[] = [
  {
    title: 'Four kitchens in the yard',
    body: 'Four independent kitchens under the rooftop, each one its own business. You order at the truck. The bar upstairs is ours.',
    link: 'Meet the trucks',
    href: '/food-trucks',
    field: 'bg-deep',
    tinta: 'text-paper',
    tintaIcono: 'text-cream',
    Icon: Truck,
  },
  {
    title: 'The bar over the river',
    body: 'Craft cocktails made daily, local drafts, and the best west-facing seat in Bonita Springs.',
    link: 'See the bar',
    href: '/sunset-bar',
    field: 'bg-sunset',
    tinta: 'text-ink',
    tintaIcono: 'text-ink',
    Icon: Martini,
  },
  {
    title: 'The whole place, closed',
    body: 'The rooftop, the yard, the patio, or the entire venue with the gates shut, and one person coordinating all of it.',
    link: 'Plan an event',
    href: '/events',
    field: 'bg-cream',
    tinta: 'text-ink',
    tintaIcono: 'text-deep',
    Icon: Balloons,
  },
];

export default function ThreeDoors() {
  return (
    <section
      aria-labelledby="doors-title"
      className="relative bg-bone grano pt-16 pb-cierre md:pt-20 lg:pt-24 desk:pt-30"
    >
      <div className="caja-ancha">
        <Reveal>
          <h2
            id="doors-title"
            className="mx-auto max-w-[18ch] text-center font-display text-banda font-extrabold uppercase"
          >
            <span className="text-ink">Not a restaurant.</span>{' '}
            <span className="text-sunset-deep">Three of them</span>
          </h2>
          <p className="mx-auto mt-6 max-w-[60ch] text-center font-body text-lead font-light text-ink">
            A rooftop bar, a yard of independent kitchens, and a venue you can rent. Same address,
            three different nights.
          </p>
        </Reveal>
        <StaggerGroup as="ul" className="mt-bloque grid list-none grid-cols-1 gap-12 p-0 md:gap-5 lg:grid-cols-3 lg:gap-6">
          {DOORS.map(({ title, body, link, href, field, tinta, tintaIcono, Icon }) => (
            <RevealItem as="li" key={href} className="h-full">
              <Link href={href} className="group flex h-full flex-col gap-3 md:flex-row md:gap-7 lg:flex-col lg:gap-3">
                <div className="relative mb-2.5 h-64 md:mb-0 md:h-56 md:w-75 md:shrink-0 lg:mb-2.5 lg:h-80 lg:w-auto">
                  <div
                    className={`mordisco flex size-full flex-col justify-between overflow-hidden rounded-door p-6 lg:p-7 ${field}`}
                  >
                    <Icon
                      className={`size-11 shrink-0 origin-top-left transition-transform duration-300 ease-brand group-hover:scale-106 lg:size-13 ${tintaIcono}`}
                    />
                    <h3
                      className={`m-0 mt-5 max-w-[13ch] text-balance pr-14 font-display text-d4 font-bold uppercase leading-[0.92] lg:text-d3 ${tinta}`}
                    >
                      {title}
                    </h3>
                  </div>
                  <span
                    aria-hidden="true"
                    className={`absolute right-1 bottom-1 grid size-13.25 place-items-center rounded-pill ring-1 ring-ink/12 transition-colors duration-300 ease-brand group-hover:bg-ink group-hover:text-paper ${field} ${tintaIcono}`}
                  >
                    <ArrowUpRight />
                  </span>
                </div>

                <div className="contents md:flex md:flex-col md:justify-center md:gap-3 lg:contents">
                <p className="m-0 font-body text-dato font-light text-ink md:max-w-[40ch] md:text-base lg:max-w-none lg:text-dato">{body}</p>
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
