import { ButtonLink } from '@/components/shared/Button';
import { RevealItem, StaggerGroup } from '@/components/shared/Motion';
import PageHero from '@/components/shared/PageHero';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
import { SPACES } from '@/content/spaces';
import { PendingData } from '@/components/shared/PendingData';

/**
 * Template de las páginas de vertical de eventos: corporate, celebrations,
 * holiday-parties, fundraisers.
 *
 * Un solo componente para las cuatro. Cambian el copy y las fotos, no la
 * estructura — y el día que haya que agregar una quinta vertical no se
 * reescribe nada.
 */

export interface VerticalConfig {
  readonly eyebrow: string;
  readonly title: string;
  readonly lead: string;
  readonly image: string;
  readonly imageAlt: string;
  readonly crumbName: string;
  readonly crumbPath: string;
  /** Tres o cuatro cosas concretas que este tipo de evento necesita. */
  readonly highlights: readonly { title: string; body: string }[];
  /** Los formatos típicos. Chips. */
  readonly formats: readonly string[];
  /** Cierre específico de la vertical. */
  readonly closingTitle: string;
  readonly closingBody: string;
}

export default function EventVertical({ config }: { readonly config: VerticalConfig }) {
  return (
    <>
      <PageHero
        eyebrow={config.eyebrow}
        title={config.title}
        lead={config.lead}
        image={config.image}
        imageAlt={config.imageAlt}
        crumbs={[
          { name: 'Events', path: '/events' },
          { name: config.crumbName, path: config.crumbPath },
        ]}
      >
        <div className="flex flex-wrap gap-[12px]">
          <ButtonLink href="/events/inquire" variant="primary" size="lg">
            Request a proposal
          </ButtonLink>
          <ButtonLink href="/events/spaces" variant="secondary" size="lg">
            See the spaces
          </ButtonLink>
        </div>
      </PageHero>

      <Section band="lg" labelledBy="highlights-title">
        <SectionHead
          eyebrow="Why here"
          eyebrowTone="deep"
          id="highlights-title"
          title="What makes this work"
        />
        <StaggerGroup as="ul" className="mt-bloque grid gap-[28px] md:grid-cols-3">
          {config.highlights.map((h) => (
            <RevealItem as="li" key={h.title} className="border-t-2 border-ink pt-[18px]">
              <Heading level={3}>{h.title}</Heading>
              <p className="mt-[10px] text-[16px] leading-[1.65] text-body/75">{h.body}</p>
            </RevealItem>
          ))}
        </StaggerGroup>
      </Section>

      <Section tone="cream" band="md" labelledBy="formats-title">
        <div className="grid gap-[28px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-[64px]">
          <Heading level={2} id="formats-title" className="text-d5 lg:text-d4">
            Formats we run
          </Heading>
          <ul className="flex flex-wrap gap-[10px]">
            {config.formats.map((f) => (
              <li
                key={f}
                className="rounded-pill border border-ink/25 bg-paper px-[16px] py-[8px] text-[16px]"
              >
                {f}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Los espacios, con sus TBD. Un planificador entra a esta página
          buscando capacidades: no puede tener que ir a buscarlas a otra. */}
      <Section band="lg" labelledBy="spaces-title">
        <SectionHead
          eyebrow="Capacities"
          eyebrowTone="terra"
          id="spaces-title"
          title="Where it happens"
          lead="Numbers are pending. We're not estimating them."
        />
        <div className="mt-[32px] overflow-x-auto" tabIndex={0} role="region" aria-label="Space capacities, scrollable">
          <table className="w-full min-w-[560px] border-collapse text-[16px]">
            <caption className="sr-only">Event space capacities at Rooftop at Riverside</caption>
            <thead>
              <tr className="border-b-2 border-ink">
                <th scope="col" className="py-[10px] pr-[16px] text-left eyebrow text-body/75">
                  Space
                </th>
                <th scope="col" className="py-[10px] pr-[16px] text-left eyebrow text-body/75">
                  Standing
                </th>
                <th scope="col" className="py-[10px] pr-[16px] text-left eyebrow text-body/75">
                  Seated
                </th>
                <th scope="col" className="py-[10px] text-left eyebrow text-body/75">
                  Minimum
                </th>
              </tr>
            </thead>
            <tbody>
              {SPACES.map((s) => (
                <tr key={s.slug} className="border-b border-ink/12">
                  <th scope="row" className="py-[14px] pr-[16px] text-left font-bold">
                    {s.name}
                  </th>
                  <td className="py-[14px] pr-[16px]">
                    {s.standing ?? <PendingData />}
                  </td>
                  <td className="py-[14px] pr-[16px]">{s.seated ?? <PendingData />}</td>
                  <td className="py-[14px]">{s.minimum ?? <PendingData />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section band="md">
        <div className="rounded-card bg-sunset px-[24px] py-[40px] text-ink lg:px-[56px]">
          <div className="flex flex-col gap-[20px] lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[560px]">
              <Eyebrow tone="ink">Next step</Eyebrow>
              <Heading level={2} className="mt-gap-kicker text-d4 lg:text-d3">
                {config.closingTitle}
              </Heading>
              <p className="mt-gap-bajada text-lead">{config.closingBody}</p>
            </div>
            <ButtonLink href="/events/inquire" variant="dark" size="lg">
              Request a proposal
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
