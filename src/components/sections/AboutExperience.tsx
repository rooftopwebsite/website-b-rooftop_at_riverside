/**
 * «More than a bar with a view», como sección de About.
 *
 * ⚠️ ERA LA PÁGINA `/the-experience`. Camila, definiendo el mapa del sitio:
 * «the experience dentro de about». Y tiene sentido: la página no vendía un
 * servicio ni resolvía una pregunta, contaba QUÉ ES este lugar — que es
 * exactamente el trabajo de `/our-story`. Dos páginas para el mismo relato de
 * marca se reparten el tráfico y ninguna de las dos lo cuenta entero.
 *
 * ⚠️ EL TEXTO NO SE TOCÓ.
 *
 * ⚠️ EL `id="experience"` ES EL DESTINO DEL REDIRECT 301 de `/the-experience`.
 * No se renombra. Ver `next.config.ts`.
 */
import Image from 'next/image';
import { ButtonLink } from '@/components/shared/Button';
import { RevealItem, StaggerGroup } from '@/components/shared/Motion';
import { PendingData } from '@/components/shared/PendingData';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';


/**
 * /the-experience — Game Lounge y camión de gaming.
 *
 * ⚠️ CANTIDAD DE CONSOLAS: se publica LA DEL BRIEF —4 PS5, 4 Xbox Series X,
 * 2 Switch 2, con A/C—. Decisión de Camila del 2026-09-11 ante el conflicto de
 * fuentes: la página de Wix dice «6 TVs» sin desglosar consolas, y el brief sí
 * desglosa. Ver docs/auditoria-servicios.md §3.
 *
 * ⚠️ LA CANTIDAD DE PANTALLAS SIGUE PENDIENTE, y no es un olvido: el brief no
 * habla de pantallas, así que la decisión de «tomar lo del brief» no la cubre.
 * El único número que existe es el «6 TVs» de Wix, que no cierra con diez
 * consolas. Por eso tampoco se afirma que cada consola tenga su pantalla.
 *
 * ⚠️ Los precios SÍ están publicados en el sitio actual, así que se reutilizan
 * tal cual, con la nota de que hay que confirmar vigencia.
 */

const PLATFORMS = ['PlayStation 5', 'Xbox Series X', 'Nintendo Switch 2'] as const;

/** Del brief, sección Onboarding Call y cuestionario H5. */
const CONSOLES = '4 PlayStation 5 · 4 Xbox Series X · 2 Nintendo Switch 2';

export default function AboutExperience() {
  return (
    <div id="experience" className="scroll-mt-24">

      {/* ── Qué hay adentro ────────────────────────────────────────────── */}
      <Section band="lg" labelledBy="inside-title">
        <SectionHead
          eyebrow="Inside the truck"
          eyebrowTone="deep"
          id="inside-title"
          title="Air conditioning, which matters here"
          lead="Ten consoles, a library that runs from E to M, and someone whose whole job is making sure nobody sits out a round."
        />

        <div className="mt-bloque grid gap-[32px] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-[56px]">
          <div>
            <dl className="flex flex-col divide-y divide-ink/12 border-y border-ink/12">
              <div className="flex flex-wrap items-baseline justify-between gap-[12px] py-[16px]">
                <dt className="eyebrow text-body/75">Platforms</dt>
                <dd className="text-[16px] font-bold">{PLATFORMS.join(' · ')}</dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-[12px] py-[16px]">
                <dt className="eyebrow text-body/75">Consoles</dt>
                <dd>
                  <span className="text-[16px] font-bold">{CONSOLES}</span>
                </dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-[12px] py-[16px]">
                <dt className="eyebrow text-body/75">Screens</dt>
                <dd>
                  <PendingData detail="Screen count pending confirmation" />
                </dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-[12px] py-[16px]">
                <dt className="eyebrow text-body/75">Ratings</dt>
                <dd className="text-[16px]">E for Everyone through M for Mature</dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-[12px] py-[16px]">
                <dt className="eyebrow text-body/75">Staffed</dt>
                <dd className="text-[16px]">A Game Coach runs every session</dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-[12px] py-[16px]">
                <dt className="eyebrow text-body/75">Climate</dt>
                <dd className="text-[16px]">Air conditioned</dd>
              </div>
            </dl>

            <p className="mt-[20px] max-w-[60ch] text-[15px] leading-[1.6] text-body/75">
              The screen count is still pending: the sources we have don&rsquo;t agree, and we&rsquo;d
              rather show a gap than a wrong number.
            </p>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-mint sombra-card lg:aspect-auto">
            <Image
              src="/images/game-controller.jpg"
              alt="A game controller in hand inside the gaming truck"
              fill
              sizes="(max-width: 1023px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>
      </Section>

      {/* ── Precios ────────────────────────────────────────────────────── */}
      <Section tone="cream" band="lg" labelledBy="pricing-title">
        <SectionHead
          eyebrow="Walk up and play"
          eyebrowTone="terra"
          id="pricing-title"
          title="What it costs"
        />

        <StaggerGroup as="ul" className="mt-bloque grid gap-[24px] md:grid-cols-2">
          <RevealItem as="li" className="rounded-card border border-ink/15 bg-paper sombra-card p-[28px]">
            <Eyebrow tone="deep">Drop in</Eyebrow>
            <p className="mt-[10px] font-display text-d2 uppercase">
              $10<span className="text-d5"> / 30 min</span>
            </p>
            <p className="mt-[10px] text-[16px] leading-[1.6] text-body/75">
              Per person, plus tax. Keep going for $5 every extra 15 minutes.
            </p>
          </RevealItem>

          <RevealItem as="li" className="rounded-card border border-ink/15 bg-paper sombra-card p-[28px]">
            <Eyebrow tone="deep">Book the truck</Eyebrow>
            <p className="mt-[10px] font-display text-d2 uppercase">
              $400<span className="text-d5"> / 2 hrs</span>
            </p>
            <p className="mt-[10px] text-[16px] leading-[1.6] text-body/75">
              Monday to Thursday, extra hour $200. Friday to Sunday it&rsquo;s $500 for two hours,
              extra hour $250. Includes the Game Coach and the full library.
            </p>
          </RevealItem>
        </StaggerGroup>

        <p className="mt-[24px] max-w-[62ch] text-[15px] leading-[1.6] text-body/75">
          Pricing carried over from the current site. Confirm before booking. A waiver is required
          to play.
        </p>
      </Section>

      <Section band="md">
        <div className="rounded-card bg-sunset sombra-card px-[24px] py-[40px] text-ink lg:px-[56px]">
          <div className="flex flex-col gap-[20px] lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[560px]">
              <Eyebrow tone="ink">Add it to an event</Eyebrow>
              <Heading level={2} className="mt-gap-kicker text-d4 lg:text-d3">
                It comes to you
              </Heading>
              <p className="mt-gap-bajada text-lead">
                The truck can park at your event here, or roll out to a birthday, a team night or a
                school function.
              </p>
            </div>
            <ButtonLink href="/events#game-truck" variant="dark" size="lg">
              Book the gaming truck
            </ButtonLink>
          </div>
        </div>
      </Section>
    </div>
  );
}
