import { ButtonLink } from '@/components/shared/Button';
import Section from '@/components/shared/Section';
import { Heading, SectionHead } from '@/components/shared/Type';
import { Reveal, RevealItem, StaggerGroup } from '@/components/shared/Motion';
import { Martini, Truck } from '@/components/shared/Icon';

interface Ventanilla {
  readonly rotulo: string;
  readonly titulo: string;
  readonly lineas: readonly string[];
  readonly Icon: typeof Truck;
  readonly caja: string;
  readonly tinta: string;
  readonly punto: string;
  readonly filete: string;
}

const VENTANILLAS: readonly Ventanilla[] = [
  {
    rotulo: 'At the trucks',
    titulo: 'Follow your appetite',
    lineas: [
      'Gourmet food trucks, each with its own chef and its own specialties.',
      'Walk up to the window, talk to the chef and order what looks good.',
      'Self service: grab any seat you like, upstairs or in the yard.',
    ],
    Icon: Truck,
    caja: 'bg-paper',
    tinta: 'text-ink',
    punto: 'bg-sunset',
    filete: 'border-fog',
  },
  {
    rotulo: 'At the Sunset Bar',
    titulo: 'Start your night here',
    lineas: [
      'Cocktails made fresh every day, with fresh juice and house syrups.',
      'Local drafts from the breweries down the road.',
      'Ask the bartenders about tonight’s specials and who is on stage.',
      'A 22% gratuity is applied to unsigned bar tabs.',
    ],
    Icon: Martini,
    caja: 'bg-deep',
    tinta: 'text-paper',
    punto: 'bg-cream',
    filete: 'border-paper/20',
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
        className="mt-bloque grid list-none grid-cols-1 items-stretch gap-6 p-0 md:grid-cols-2"
      >
        {VENTANILLAS.map(({ rotulo, titulo, lineas, Icon, caja, tinta, punto, filete }) => (
          <RevealItem as="li" key={rotulo} className="h-full">
            <div
              className={`flex h-full flex-col rounded-shell p-7 sombra-card lg:p-9 ${caja} ${tinta}`}
            >
              <div className="flex items-center gap-3.5">
                <Icon className="size-8 shrink-0" />
                <span className="font-body text-caption font-bold uppercase tracking-eyebrow">
                  {rotulo}
                </span>
              </div>

              <Heading level={3} className="mt-5 max-w-[16ch] text-d5 lg:text-d4">
                {titulo}
              </Heading>

              <ul className={`m-0 mt-6 flex list-none flex-col gap-3.5 border-t p-0 pt-6 ${filete}`}>
                {lineas.map((linea) => (
                  <li key={linea} className="flex gap-3.5">
                    <span
                      aria-hidden="true"
                      className={`mt-2.25 size-1.5 shrink-0 rounded-pill ${punto}`}
                    />
                    <span className="font-body text-base font-light leading-[1.5]">{linea}</span>
                  </li>
                ))}
              </ul>
              {caja === 'bg-deep' ? (
                <span className="mt-auto pt-8">
                  <ButtonLink href="/sunset-bar" variant="onDark">
                    See the bar menu
                  </ButtonLink>
                </span>
              ) : (
                <span className="mt-auto pt-8">
                  <ButtonLink href="/food-trucks" variant="secondary">
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
