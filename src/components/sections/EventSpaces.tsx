import { PADDING_CRUCE } from '@/components/shared/CompareSlab';
import { Car, Martini, MusicNote, Truck, UserCircle } from '@/components/shared/Icon';
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
        innerClassName={PADDING_CRUCE}
        labelledBy="buyout-title"
        className="banda-arco z-[2] pb-cierre"
      >
        <h2
          id="buyout-title"
          className="mx-auto max-w-[14ch] text-center font-display text-banda font-extrabold uppercase"
        >
          <span className="text-ink">Pick how much</span>{' '}
          <span className="text-sunset-deep">of the place</span>
        </h2>
        <p className="bajada mx-auto mt-gap-bajada max-w-[56ch] text-center text-body/80">
          Three ways to book it. Know which one you want before you send the form, and the quote
          comes back faster.
        </p>
        <StaggerGroup as="ul" className="mt-bloque grid list-none gap-5 p-0 md:grid-cols-3">
          {BUYOUT_OPTIONS.map((o) => (
            <RevealItem as="li" key={o.slug} className="h-full">
              <article className="relative flex h-full flex-col gap-2.5 rounded-shell bg-paper p-7 sombra-card lg:p-9">
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
          id="incluye-title"
          className="mx-auto mt-band-sm max-w-[14ch] lg:mt-band text-center font-display text-banda font-extrabold uppercase"
        >
          <span className="text-ink">What comes with</span>{' '}
          <span className="text-sunset-deep">every booking</span>
        </h2>
        <StaggerGroup
          as="ul"
          className="mt-bloque grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 md:grid-cols-6 desk:grid-cols-5"
        >
          {INCLUIDO.map((item, i) => (
            <RevealItem
              as="li"
              key={item.label}
              className={[
                'h-full desk:col-span-1',
                i < 3 ? 'md:col-span-2' : 'md:col-span-3',
                i === INCLUIDO.length - 1 && INCLUIDO.length % 2 === 1 ? 'sm:col-span-2' : '',
              ].join(' ')}
            >
              <article className="flex h-full flex-col gap-2.5 rounded-ticket bg-paper p-6 sombra-card transition-transform duration-300 ease-brand hover:-translate-y-1.5">
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

const INCLUIDO = [
  {
    label: 'The bar',
    title: 'The Sunset Bar is ours',
    body: 'Our own team pours it. Open bar, drink tickets or consumption.',
    Icon: Martini,
  },
  {
    label: 'The trucks',
    title: 'We coordinate the kitchens',
    body: 'You pick a tier, we handle the vendors and the timing.',
    Icon: Truck,
  },
  {
    label: 'The stage',
    title: 'Sound is already here',
    body: 'For live music or a DJ, on the stage that lives in the yard.',
    Icon: MusicNote,
  },
  {
    label: 'Getting here',
    title: 'Come in your own car',
    body: 'Street parking on Old 41, plus the public lots around Riverside Park.',
    Icon: Car,
  },
  {
    label: 'The planning',
    title: 'One point of contact',
    body: 'The same person, from the first email through load-out.',
    Icon: UserCircle,
  },
] as const;
