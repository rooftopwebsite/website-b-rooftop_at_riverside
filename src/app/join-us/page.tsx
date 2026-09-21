import type { Metadata } from 'next';
import Link from 'next/link';
import { ArtistForm, JobForm } from '@/components/sections/JoinForms';
import { ButtonLink } from '@/components/shared/Button';
import FormSlab from '@/components/shared/FormSlab';
import PlateHero from '@/components/shared/PlateHero';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading } from '@/components/shared/Type';
import { fraseEntretenimiento } from '@/content/entertainment';
import { getJobPostings } from '@/lib/restoexp';
import { getVenue } from '@/lib/venue';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  route: '/join-us',
  image: {
    url: '/images/venue/join-stage-day-wide.jpg',
    width: 2576,
    height: 1364,
    alt: 'A singer on the stage in the yard at Rooftop at Riverside in the afternoon',
  },
});

/**
 * `/join-us` — DOS carriles: trabajo y artistas.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ REDISEÑADA EL 2026-09-21, y era la que estaba más atrás de todas: seguía
 * con `PageHero` de dos columnas —sin pregunta, sin foto, sin placa y con el
 * titular monocromo—, los dos formularios pegados al costado de su texto sin
 * panel ni troquel, y píxeles escritos a mano en vez de tokens.
 *
 * Camila, 2026-09-21: «contemplando cómo hiciste el formulario en plan an
 * event y cómo son los heros, diseñá las páginas de join us y contact».
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠️ EL HERO PASA A `PlateHero`, igual que `/contact` en el mismo commit, y
 * los dos anclajes se van de donde estaban —una `<nav>` adentro del hero
 * viejo— al hueco de CTA que `PlateHero` deja DEBAJO de la foto, que es donde
 * `/events` pone los suyos.
 *
 * ⚠️ EL H1 CAMBIÓ Y ESO TOCÓ `content/seo-pages.ts`. Era «Two ways in» y no
 * parte en dos renglones, que es el contrato duro de este hero. Ahora es «Work
 * here, play here», o sea los dos títulos de sección que la página ya tenía.
 * El porqué largo está en la entrada de `seo-pages.ts`.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠️ LOS DOS CARRILES PASAN A SER DOS `FormSlab`, la pieza que se sacó del
 * cierre de `/events` en este mismo commit: a la izquierda el argumento, un
 * filete y los datos; a la derecha el formulario dentro del panel troquelado.
 *
 * ⚠️ EL FORMULARIO VA DEL MISMO LADO EN LOS DOS. Espejar el segundo era la
 * otra opción y se descartó: con el panel saltando de lado, el segundo carril
 * se lee como otra página en vez de como el hermano del primero.
 *
 * ⚠️ SIGUEN SIENDO DOS SECCIONES ANCLADAS Y NO TABS. `#work` y `#artists` son
 * URLs que se pueden compartir —un músico recibe el link directo a su
 * formulario— y funcionan sin JavaScript. Unos tabs esconden la mitad de la
 * página, no se pueden enlazar y obligan a reimplementar el teclado.
 *
 * ⚠️ DOS CARRILES Y NO TRES. Había un tercero, «Food truck owners · Pitch your
 * truck», que NOSOTROS inventamos: el sitio actual no tiene formulario de alta
 * de trucks en ninguna de sus 23 rutas y el cliente nunca lo pidió. Se eliminó
 * el 2026-09-15 por decisión de Camila.
 *
 * ⚠️ LAS VACANTES SALEN DE LA BASE. `job_postings` existe en el dashboard de
 * RestoExp con título, descripción, requisitos, tipo de empleo y rango
 * salarial. Hoy está VACÍA para este restaurante, así que la página muestra
 * aplicación abierta. Cuando el cliente cargue una búsqueda aparece listada,
 * sin tocar código y sin deploy.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠️ EL RITMO DE SUPERFICIES:
 *
 *     hero        bone   (la placa y la foto)
 *     #work       paper  ← el panel va en bone, que es lo que sostiene los campos
 *     #artists    bone
 *     cierre      DEEP   ← única oscura
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

      {/* ══ El hero ═══════════════════════════════════════════════════════ */}

      {/*
        ⚠️ LA FOTO ES EL ESCENARIO DE DÍA y muestra el carril de artistas, no
        el de trabajo. Es una decisión y está argumentada en su entrada de
        `scripts/build-media.mjs`: es la única toma de música en vivo con luz
        de día de toda la entrega, y el carril de trabajo lo sostiene el copy,
        que es lo que un aviso de empleo necesita.

        ⚠️ EL TEXTO PLANO DEL TITULAR TIENE QUE DAR «Work here, play here»,
        que es lo que fija `PAGE_SEO` y lo que compara `npm run check:seo`.
      */}
      <PlateHero
        question="Looking for a bar job or a stage in Bonita Springs?"
        title={
          <>
            {'Work here, '}
            <span className="block text-sunset-deep">play here</span>
          </>
        }
        lead={`We are hiring when we are hiring, and we book ${musicaLarga.toLowerCase()}. Both of those start on this page, and a person reads what comes in.`}
        photo="/images/venue/join-stage-day-wide.jpg"
        photoAlt="A singer on the stage in the yard at Rooftop at Riverside in the afternoon"
      >
        {/*
          Los dos anclajes. No son tabs: son links a las dos secciones, así que
          se pueden compartir y funcionan sin JavaScript.
        */}
        <ButtonLink href="#work" variant="primary" size="lg">
          Work here
        </ButtonLink>
        <ButtonLink href="#artists" variant="secondary" size="lg">
          Play here
        </ButtonLink>
      </PlateHero>

      {/* ══ 1. Trabajo ═══════════════════════════════════════════════════ */}

      <FormSlab
        id="work"
        eyebrow="Join the team"
        eyebrowTone="deep"
        title="Work here"
        titleId="work-title"
        lead="It is a rooftop bar over four food trucks, open five days a week, with a stage in the yard. Busy, outdoors, and never the same shift twice."
        aside={
          <div className="flex flex-col gap-6">
            {/*
              ⚠️ LAS VACANTES O LA APLICACIÓN ABIERTA, según lo que haya en la
              base. Las dos ramas son estados normales, no un error: la mayor
              parte del año un lugar así no tiene búsquedas publicadas y recibe
              currículums igual.
            */}
            {vacantes.length > 0 ? (
              <div>
                <Heading level={3} role="label">
                  Open right now
                </Heading>
                <ul className="mt-[16px] flex list-none flex-col gap-[20px] p-0">
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
              </div>
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

            {/*
              ⚠️ EL MAIL VA ACÁ Y NO AL PIE DEL FORMULARIO. Es la regla de
              `FormSlab`: quien prefiere mandar un mail con el CV adjunto tiene
              la salida a la vista ANTES de empezar a llenar campos.
            */}
            <div className="flex flex-col gap-1.5">
              <p className="eyebrow text-body/75">Or skip the form</p>
              <a
                href={`mailto:${venue.emailHiring}`}
                className="link-texto break-all font-body text-base"
              >
                {venue.emailHiring}
              </a>
            </div>
          </div>
        }
      >
        <JobForm />
      </FormSlab>

      {/* ══ 2. Artistas ══════════════════════════════════════════════════ */}

      {/*
        ⚠️ ACÁ EL PANEL VA EN `paper` Y EN `#work` VA EN `bone`, y no es un
        descuido: la regla de `FormSlab` es que el panel NUNCA sea del color de
        su sección, y esta sección es la que lleva el escalón de hueso para
        separar el segundo carril del primero. Con el default, panel y sección
        quedaban del mismo color y el troquel flotaba sobre nada.

        El efecto lateral es bueno: entre los dos carriles se invierte el par
        —claro sobre hueso, hueso sobre claro— y eso los lee como hermanos y no
        como la misma losa repetida.
      */}
      <FormSlab
        id="artists"
        tone="bone"
        panelTone="paper"
        eyebrow="Artists and performers"
        eyebrowTone="terra"
        title="Play here"
        titleId="artists-title"
        lead={`${musicaLarga}: solo acts, bands, DJs. There is a stage in the yard with sound already on it, so you are not carrying a PA up two flights.`}
        aside={
          <div className="flex flex-col gap-6">
            <div>
              <Heading level={3} role="label">
                What we need from you
              </Heading>
              {/*
                ⚠️ ESTA LISTA SALE DEL FORMULARIO QUE EL CLIENTE YA TIENE VIVO
                en `/entertainment`: nombre, mail, teléfono, band name, link de
                redes, género, link de video, logo y foto. No es una lista
                nuestra de buenas prácticas.
              */}
              <ul className="mt-[16px] flex list-none flex-col gap-[10px] p-0">
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

            <div className="rounded-card border border-ink/15 bg-paper p-[20px]">
              <Eyebrow tone="deep">Already on the calendar?</Eyebrow>
              <p className="mt-[8px] max-w-[42ch] text-[16px] leading-[1.7] text-body/80">
                If you are playing here and want to check the date or the set time, the{' '}
                <Link href="/whats-on" className="link-texto font-bold">
                  calendar
                </Link>{' '}
                has it, and{' '}
                {/*
                  ⚠️ `break-words` Y NO `break-all`. Iba con `break-all`, que
                  parte en CUALQUIER letra, y como acá el mail va embebido en
                  una frase y la columna es angosta, salía cortado al medio:
                  «info@eatdrinkp / aradise.com». Con `break-words` el mail se
                  va entero al renglón de abajo y sólo se parte si no entra ni
                  solo, que en esta columna no pasa.
                */}
                <a href={`mailto:${venue.email}`} className="link-texto font-bold break-words">
                  {venue.email}
                </a>{' '}
                is faster than this form.
              </p>
            </div>
          </div>
        }
      >
        <ArtistForm />
      </FormSlab>

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
