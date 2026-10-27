import { CROSS_PADDING } from '@/components/shared/CompareSlab';
import { Martini, MusicNote, Truck, UserCircle } from '@/components/shared/Icon';
import { RevealItem, StaggerGroup } from '@/components/shared/Motion';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading } from '@/components/shared/Type';
import { BUYOUT_OPTIONS } from '@/content/spaces';

export default function EventSpaces() {
  return (
    <div id="spaces" className="scroll-mt-24">
      <Section
        tone="cream"
        band="lg"
        bandTop="none"
        innerClassName={CROSS_PADDING}
        labelledBy="buyout-title"
        className="band-arc z-[2] pb-closing"
      >
        <h2
          id="buyout-title"
          className="mx-auto max-w-[14ch] text-center font-display text-band font-extrabold uppercase"
        >
          <span className="text-ink">Pick the space</span>{' '}
          <span className="text-sunset-deep">that fits</span>
        </h2>
        <p className="subhead mx-auto mt-gap-subhead max-w-[56ch] text-center text-body/80">
          Whatever the occasion, we have a space to make it yours. Choose from our Full Upstairs,
          Rooftop Patio, or Full Venue Rental options, giving you the flexibility to create the
          perfect setting for celebrations, gatherings, corporate events, and everything in between.
        </p>
        <StaggerGroup as="ul" className="mt-block grid list-none gap-5 p-0 md:grid-cols-3">
          {BUYOUT_OPTIONS.map((o) => (
            <RevealItem as="li" key={o.slug} className="h-full">
              <article className="relative flex h-full flex-col gap-2.5 rounded-shell bg-paper p-7 card-shadow lg:p-9">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-3.5 rounded-shell border border-dashed border-deep/35"
                />
                <Eyebrow tone="terra">{o.label}</Eyebrow>
                <Heading level={3} className="m-0 text-d5 leading-[1.02] text-ink">
                  {o.title}
                </Heading>
                <p className="m-0 font-body text-base font-light leading-[1.6] text-body/80">
                  {o.body}
                </p>
              </article>
            </RevealItem>
          ))}
        </StaggerGroup>

        <h2
          id="includes-title"
          className="mx-auto mt-band-sm max-w-[14ch] lg:mt-band text-center font-display text-band font-extrabold uppercase"
        >
          <span className="text-ink">What comes with</span>{' '}
          <span className="text-sunset-deep">every booking</span>
        </h2>
        <StaggerGroup
          as="ul"
          className="mt-block grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 desk:grid-cols-4"
        >
          {INCLUDED.map((item) => (
            <RevealItem as="li" key={item.label} className="h-full">
              <article className="flex h-full flex-col gap-2.5 rounded-ticket bg-paper p-6 card-shadow transition-transform duration-300 ease-brand hover:-translate-y-1.5">
                <item.Icon aria-hidden="true" className="size-8 text-sunset-deep" />
                <Eyebrow tone="terra" className="mt-1.5">
                  {item.label}
                </Eyebrow>
                <h3 className="m-0 font-display text-d6 font-bold uppercase leading-[1.05] text-ink">
                  {item.title}
                </h3>
                <p className="m-0 font-body text-base font-light leading-[1.6] text-body/80">
                  {item.body}
                </p>
              </article>
            </RevealItem>
          ))}
        </StaggerGroup>
      </Section>
    </div>
  );
}

const INCLUDED = [
  {
    label: 'The bar',
    title: 'The Sunset Bar',
    body: 'Our own team pours it. Open bar, drink tickets or consumption.',
    Icon: Martini,
  },
  {
    label: 'The food',
    title: 'We coordinate the kitchens',
    body: "From food trucks to preferred caterers, we'll help you find the right fit for your event.",
    Icon: Truck,
  },
  {
    label: 'The stage',
    title: 'Sound is already here',
    body: '2 stages that live upstairs and in the Yard for ultimate entertainment.',
    Icon: MusicNote,
  },
  {
    label: 'The planning',
    title: 'One point of contact',
    body: 'The same person, from the first email through load-out.',
    Icon: UserCircle,
  },
] as const;
