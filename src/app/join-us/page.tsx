import type { Metadata } from 'next';
import JoinSwitch, { parseLane } from '@/components/sections/JoinSwitch';
import { ArtistForm, JobForm } from '@/components/sections/JoinForms';
import { ButtonLink } from '@/components/shared/Button';
import FormSlab from '@/components/shared/FormSlab';
import PlateHero from '@/components/shared/PlateHero';
import { GUTTER } from '@/components/shared/Section';
import SoftWave from '@/components/shared/SoftWave';
import { Eyebrow, Heading } from '@/components/shared/Type';
import { entertainmentPhrase } from '@/content/entertainment';
import { getJobPostings } from '@/content/jobs';
import { getVenue } from '@/lib/venue';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  route: '/join-us',
  image: {
    url: '/og/join-us.jpg',
    width: 1200,
    height: 630,
    alt: 'A singer on the stage in the yard at Rooftop at Riverside in the afternoon',
  },
});

const PDF = '/docs/rooftop-at-riverside-job-application.pdf';

export default async function JoinUsPage({
  searchParams,
}: {
  readonly searchParams: Promise<{ apply?: string }>;
}) {
  const lane = parseLane((await searchParams).apply);
  const venue = await getVenue();
  const longMusic = await entertainmentPhrase();
  const openings = lane === 'team' ? await getJobPostings() : [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(breadcrumbJsonLd([{ name: 'Join Us', path: '/join-us' }])),
        }}
      />
      <PlateHero
        question="Looking for a bar job or a stage in Bonita Springs?"
        title={'Work here, '}
        titleAccent="play here"
        photo="/images/venue/join-stage-day-wide.webp"
        photoAlt="A singer on the stage in the yard at Rooftop at Riverside in the afternoon"
      />
      <SoftWave from="bone" to="paper" className="relative -mb-px" />

      <div className={`grain bg-paper pt-12 md:pt-16 lg:pt-20 ${GUTTER}`}>
        <div className="page-box text-center">
          <Heading level={2} id="apply-title" className="mx-auto max-w-[18ch] text-balance text-band">
            How Can We <span className="text-sunset-deep">Work Together?</span>
          </Heading>
          <p className="subhead mx-auto mt-gap-subhead max-w-[56ch] font-body text-lead font-light">
            {lane === 'team'
              ? 'If you’ve got a can-do attitude, enjoy working with a team, and take pride in creating a great experience for our guests, we’d love to hear from you. Submit your resume or reach out below.'
              : `We book ${longMusic.toLowerCase()}. A person reads what comes in.`}
          </p>
        </div>
      </div>

      <JoinSwitch lane={lane} />

      {lane === 'team' ? (
        <FormSlab
          id="work"
          eyebrow="Join the team"
          eyebrowTone="deep"
          title="Work here"
          titleId="work-title"
          lead="It is a rooftop bar over a yard of gourmet food trucks, with a stage and live music most nights. Busy, outdoors, and never the same shift twice."
          aside={
            <div className="flex flex-col gap-6">
              {openings.length > 0 ? (
                <div>
                  <Heading level={3} role="label">
                    Open right now
                  </Heading>
                  <ul className="mt-[16px] flex list-none flex-col gap-[20px] p-0">
                    {openings.map((v) => (
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
                null
              )}

              <div className="rounded-shell bg-mint p-6">
                <Eyebrow tone="deep">Rather use a pen?</Eyebrow>
                <Heading level={3} role="card" className="mt-2.5">
                  The same form, on paper
                </Heading>
                <p className="mt-2.5 max-w-[46ch] font-body text-base font-light leading-[1.7] text-ink/80">
                  Print it, fill it in and hand it to the management team with your resume.
                </p>
                <div className="mt-5">
                  <ButtonLink
                    href={PDF}
                    variant="primary"
                    size="md"
                    external
                    className="w-full justify-center"
                  >
                    Download the form
                  </ButtonLink>
                  <p className="mt-2 text-center font-body text-micro font-medium text-ink/70">
                    PDF
                  </p>
                </div>
              </div>
            </div>
          }
          footer={
            <>
              Prefer to send a resume by mail?{' '}
              <a href={`mailto:${venue.emailHiring}`} className="link-text break-words font-bold">
                {venue.emailHiring}
              </a>
            </>
          }
        >
          <JobForm />
        </FormSlab>
      ) : (
        <FormSlab
          id="artists"
          eyebrow="Artists and performers"
          eyebrowTone="terra"
          title="Play here"
          titleId="artists-title"
          lead={`${longMusic}: solo acts, bands, DJs. There is a stage in the yard with sound already on it, so you are not carrying a PA up two flights.`}
          aside={
            <div className="flex flex-col gap-6">
              <div>
                <Heading level={3} role="label">
                  What we need from you
                </Heading>
                <ul className="mt-[16px] flex list-none flex-col gap-[10px] p-0">
                  {[
                    'A video link, or the social account where we can hear you',
                    'Your band name and your genre',
                    'A logo and a photo, if you have them, for the calendar',
                    'A phone number, because booking happens fast',
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
              <div className="rounded-card border border-ink/15 bg-bone p-[20px]">
                <Eyebrow tone="deep">Already on the calendar?</Eyebrow>
                <p className="mt-[8px] max-w-[42ch] text-[16px] leading-[1.7] text-body/80">
                  If you already have a date with us and something is unclear, write to{' '}
                  <a href={`mailto:${venue.email}`} className="link-text font-bold break-words">
                    {venue.email}
                  </a>
                  .
                </p>
              </div>
            </div>
          }
        >
          <ArtistForm />
        </FormSlab>
      )}
    </>
  );
}
