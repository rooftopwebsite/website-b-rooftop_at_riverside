import type { Metadata } from 'next';
import Link from 'next/link';
import { ArtistForm, JobForm } from '@/components/sections/JoinForms';
import { ButtonLink } from '@/components/shared/Button';
import PageHero from '@/components/shared/PageHero';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
import { fraseEntretenimiento } from '@/content/entertainment';
import { getJobPostings } from '@/lib/restoexp';
import { getVenue } from '@/lib/venue';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  route: '/join-us',
});

/**
 * `/join-us` — DOS carriles: trabajo y artistas.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ DOS Y NO TRES. Había un tercer carril, «Food truck owners · Pitch your
 * truck», que NOSOTROS inventamos: el sitio actual no tiene formulario de alta
 * de trucks en ninguna de sus 23 rutas y el cliente nunca lo pidió. Se eliminó
 * el 2026-09-15 por decisión de Camila.
 *
 * ⚠️ SON DOS SECCIONES ANCLADAS Y NO TABS. `#work` y `#artists` son URLs que
 * se pueden compartir —un músico recibe el link directo a su formulario— y
 * funcionan sin JavaScript. Unos tabs esconden la mitad de la página, no se
 * pueden enlazar y obligan a reimplementar el teclado.
 *
 * ⚠️ LAS VACANTES SALEN DE LA BASE. `job_postings` existe en el dashboard de
 * RestoExp con título, descripción, requisitos, tipo de empleo y rango
 * salarial. Hoy está VACÍA para este restaurante, así que la página muestra
 * aplicación abierta. Cuando el cliente cargue una búsqueda aparece listada,
 * sin tocar código y sin deploy.
 *
 * ⚠️ RITMO: bone (hero) → paper (trabajo) → bone (artistas) → deep (cierre).
 * ══════════════════════════════════════════════════════════════════════════
 */
export default async function JoinUsPage() {
  const venue = await getVenue();
  const vacantes = await getJobPostings();
  // Ver `content/entertainment.ts`: el número de noches no está confirmado.
  const musicaLarga = await fraseEntretenimiento();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(breadcrumbJsonLd([{ name: 'Join Us', path: '/join-us' }])),
        }}
      />

      <PageHero
        eyebrow="Join us"
        title="Two ways in"
        lead={`We are hiring when we are hiring, and we book ${musicaLarga.toLowerCase()}. Both of those start here.`}
        crumbs={[{ name: 'Join Us', path: '/join-us' }]}
      >
        {/*
          Los dos anclajes, arriba. No son tabs: son links a las dos secciones,
          así que se pueden compartir y funcionan sin JavaScript.
        */}
        <nav aria-label="The two ways in" className="flex flex-wrap gap-[12px]">
          <ButtonLink href="#work" variant="primary">
            Work here
          </ButtonLink>
          <ButtonLink href="#artists" variant="secondary">
            Play here
          </ButtonLink>
        </nav>
      </PageHero>

      {/* ══ 1. Trabajo ═══════════════════════════════════════════════════ */}

      <Section band="lg" labelledBy="work-title" id="work" className="scroll-mt-24">
        <div className="grid gap-[48px] lg:grid-cols-[1fr_1.1fr] lg:gap-[72px]">
          <div>
            <SectionHead
              eyebrow="Join the team"
              eyebrowTone="deep"
              id="work-title"
              title="Work here"
              lead="It is a rooftop bar over four food trucks, open five days a week, with a stage in the yard. Busy, outdoors, and never the same shift twice."
            />

            {/*
              ⚠️ LAS VACANTES O LA APLICACIÓN ABIERTA, según lo que haya en la
              base. Las dos ramas son estados normales, no un error: la mayor
              parte del año un lugar así no tiene búsquedas publicadas y recibe
              currículums igual.
            */}
            <div className="mt-[32px]">
              {vacantes.length > 0 ? (
                <>
                  <Heading level={3} role="label">
                    Open right now
                  </Heading>
                  <ul className="mt-[16px] flex list-none flex-col gap-[20px]">
                    {vacantes.map((v) => (
                      <li key={v.id} className="border-t border-ink/12 pt-[16px]">
                        <p className="font-display text-d6 uppercase lg:text-d5">{v.title}</p>
                        <p className="mt-[6px] flex flex-wrap gap-x-[14px] gap-y-[4px] text-caption font-bold uppercase tracking-[0.1em] text-body/70">
                          {v.department ? <span>{v.department}</span> : null}
                          {v.employment_type ? <span>{v.employment_type}</span> : null}
                          {v.salary_min !== null ? (
                            <span className="tabular-nums">
                              ${v.salary_min}
                              {v.salary_max !== null ? ` – $${v.salary_max}` : ''}
                              {v.salary_type ? ` ${v.salary_type}` : ''}
                            </span>
                          ) : null}
                        </p>
                        {v.description ? (
                          <p className="mt-[8px] max-w-[52ch] text-[16px] leading-[1.7] text-body/80">
                            {v.description}
                          </p>
                        ) : null}
                        {v.requirements ? (
                          <p className="mt-[8px] max-w-[52ch] text-[15px] leading-[1.6] text-muted">
                            {v.requirements}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <div className="rounded-card border border-ink/15 bg-bone p-[24px]">
                  <Heading level={3} role="card">
                    No posted openings today
                  </Heading>
                  <p className="mt-[10px] max-w-[46ch] text-[16px] leading-[1.7] text-body/80">
                    That happens most of the year, and we still read what comes in. Send it and it
                    sits with us for when a shift opens up, which in season happens fast.
                  </p>
                </div>
              )}
            </div>

            <p className="mt-[24px] max-w-[46ch] text-[16px] leading-[1.7] text-body/80">
              Applications go to{' '}
              <a href={`mailto:${venue.emailHiring}`} className="link-texto font-bold break-all">
                {venue.emailHiring}
              </a>
              , and the form below goes to the same place.
            </p>
          </div>

          <JobForm />
        </div>
      </Section>

      {/* ══ 2. Artistas ══════════════════════════════════════════════════ */}

      <Section
        tone="bone"
        band="lg"
        labelledBy="artists-title"
        id="artists"
        className="scroll-mt-24"
      >
        <div className="grid gap-[48px] lg:grid-cols-[1fr_1.1fr] lg:gap-[72px]">
          <div>
            <SectionHead
              eyebrow="Artists and performers"
              eyebrowTone="terra"
              id="artists-title"
              title="Play here"
              lead={`${musicaLarga}: solo acts, bands, DJs. There is a stage in the yard with sound already on it, so you are not carrying a PA up two flights.`}
            />

            <div className="mt-[32px]">
              <Heading level={3} role="label">
                What we need from you
              </Heading>
              {/*
                ⚠️ ESTA LISTA SALE DEL FORMULARIO QUE EL CLIENTE YA TIENE
                VIVO en `/entertainment`: nombre, mail, teléfono, band name,
                link de redes, género, link de video, logo y foto. No es una
                lista nuestra de buenas prácticas.
              */}
              <ul className="mt-[16px] flex list-none flex-col gap-[10px]">
                {[
                  'Something we can listen to or watch',
                  'Your band name and your genre',
                  'How long a set runs and how many of you there are',
                  'Which nights generally work',
                ].map((i) => (
                  <li key={i} className="flex items-start gap-[10px] text-[16px] leading-[1.6]">
                    <span
                      aria-hidden="true"
                      className="mt-[8px] size-[6px] shrink-0 rounded-pill bg-sunset"
                    />
                    {i}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-[28px] rounded-card border border-ink/15 bg-paper p-[20px]">
              <Eyebrow tone="deep">Already on the calendar?</Eyebrow>
              <p className="mt-[8px] max-w-[42ch] text-[16px] leading-[1.7] text-body/80">
                If you are playing here and want to check the date or the set time, the{' '}
                <Link href="/whats-on" className="link-texto font-bold">
                  calendar
                </Link>{' '}
                has it, and{' '}
                <a href={`mailto:${venue.email}`} className="link-texto font-bold break-all">
                  {venue.email}
                </a>{' '}
                is faster than this form.
              </p>
            </div>
          </div>

          <ArtistForm />
        </div>
      </Section>

      {/* ══ Cierre ═══════════════════════════════════════════════════════ */}

      <Section tone="deep" band="md" labelledBy="join-next">
        <div className="flex flex-col items-start gap-[24px] lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Heading level={2} id="join-next" className="max-w-[20ch] text-d4 lg:text-d3">
              Not what you were looking for?
            </Heading>
            <p className="mt-[12px] max-w-[46ch] text-[16px] leading-[1.7] text-paper/80">
              Makers looking for a booth go to the market page. Everything else goes to the contact
              form, and a person reads it.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-[12px]">
            <ButtonLink href="/market#apply" variant="primary">
              Market booths
            </ButtonLink>
            <ButtonLink href="/contact" variant="ghostDark">
              Contact
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
