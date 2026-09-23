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
    titulo: 'You order at the window',
    lineas: [
      'Four independent kitchens, each one its own business.',
      'You order at the window and you pay that truck.',
      'Separate line, separate card, separate receipt.',
      'No table service, and no single check for the yard.',
    ],
    Icon: Truck,
    caja: 'bg-paper',
    tinta: 'text-ink',
    punto: 'bg-sunset',
    filete: 'border-fog',
  },
  {
    rotulo: 'At the Sunset Bar',
    titulo: 'The one tab we run',
    lineas: [
      'The bar on the roof is ours, and it is the only tab we keep.',
      'Cocktails made that morning and drafts from breweries twenty minutes away.',
      'It is the only menu on this site with prices, because it is the only one that is ours.',
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
              Two windows, <span className="text-sunset-deep">two ways to pay</span>
            </>
          }
          id={id}
          lead="It looks like one restaurant and it is not."
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
                    All four trucks
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
