import { ButtonLink } from '@/components/shared/Button';
import Section from '@/components/shared/Section';
import { Heading, SectionHead } from '@/components/shared/Type';
import { Reveal, RevealItem, StaggerGroup } from '@/components/shared/Motion';
import { Martini, Truck } from '@/components/shared/Icon';

interface ServiceWindow {
  readonly label: string;
  readonly title: string;
  readonly lines: readonly string[];
  readonly Icon: typeof Truck;
  readonly box: string;
  readonly ink: string;
  readonly dot: string;
  readonly rule: string;
}

const SERVICE_WINDOWS: readonly ServiceWindow[] = [
  {
    label: 'At the trucks',
    title: 'Follow your appetite',
    lines: [
      'Gourmet food trucks, each with its own chef and its own specialties.',
      'Walk up to the window, talk to the chef and order what looks good.',
      'Self service: grab any seat you like, upstairs or in the yard.',
    ],
    Icon: Truck,
    box: 'bg-paper',
    ink: 'text-ink',
    dot: 'bg-sunset',
    rule: 'border-fog',
  },
  {
    label: 'At the Sunset Bar',
    title: 'Start your night here',
    lines: [
      'Cocktails made fresh every day, with fresh juice and house syrups.',
      'Local drafts from the breweries down the road.',
      'Ask the bartenders about tonight’s specials and who is on stage.',
      'A 22% gratuity is applied to unsigned bar tabs.',
    ],
    Icon: Martini,
    box: 'bg-deep',
    ink: 'text-paper',
    dot: 'bg-cream',
    rule: 'border-paper/20',
  },
];

export default function HowToOrder({ id = 'order-title' }: { readonly id?: string }) {
  return (
    <Section tone="paper" band="lg" labelledBy={id}>
      <Reveal>
        <SectionHead
          eyebrow="How it works"
          eyebrowTone="plum"
          title={
            <>
              Grab a drink, <span className="text-sunset-deep">find your flavor</span>
            </>
          }
          id={id}
          lead="Here is how a night at the rooftop usually goes."
        />
      </Reveal>
      <StaggerGroup
        as="ul"
        className="mt-block grid list-none grid-cols-1 items-stretch gap-6 p-0 md:grid-cols-2"
      >
        {SERVICE_WINDOWS.map(({ label, title, lines, Icon, box, ink, dot, rule }) => (
          <RevealItem as="li" key={label} className="h-full">
            <div
              className={`flex h-full flex-col rounded-shell p-7 card-shadow lg:p-9 ${box} ${ink}`}
            >
              <div className="flex items-center gap-3.5">
                <Icon className="size-8 shrink-0" />
                <span className="font-body text-caption font-bold uppercase tracking-eyebrow">
                  {label}
                </span>
              </div>

              <Heading level={3} className="mt-5 max-w-[16ch] text-d5 lg:text-d4">
                {title}
              </Heading>

              <ul className={`m-0 mt-6 flex list-none flex-col gap-3.5 border-t p-0 pt-6 ${rule}`}>
                {lines.map((line) => (
                  <li key={line} className="flex gap-3.5">
                    <span
                      aria-hidden="true"
                      className={`mt-2.25 size-1.5 shrink-0 rounded-pill ${dot}`}
                    />
                    <span className="font-body text-base font-light leading-[1.5]">{line}</span>
                  </li>
                ))}
              </ul>
              {box === 'bg-deep' ? (
                <span className="mt-auto pt-8">
                  <ButtonLink href="/sunset-bar" variant="onDark">
                    See the bar menu
                  </ButtonLink>
                </span>
              ) : (
                <span className="mt-auto pt-8">
                  <ButtonLink href="/food-trucks" variant="primary">
                    Meet the trucks
                  </ButtonLink>
                </span>
              )}
            </div>
          </RevealItem>
        ))}
      </StaggerGroup>
    </Section>
  );
}
