import type { Metadata } from 'next';
import Image from 'next/image';
import AboutStory from '@/components/sections/AboutStory';
import FindUs from '@/components/sections/FindUs';
import HowToOrder from '@/components/sections/HowToOrder';
import VenueTabs from '@/components/sections/VenueTabs';
import { Reveal, RevealItem, StaggerGroup } from '@/components/shared/Motion';
import { PhotoPending } from '@/components/shared/PendingData';
import PlateHero from '@/components/shared/PlateHero';
import Section from '@/components/shared/Section';
import SoftWave from '@/components/shared/SoftWave';
import { Heading } from '@/components/shared/Type';
import { PEOPLE } from '@/content/people';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';
import { getVenue } from '@/lib/venue';

export const metadata: Metadata = pageMeta({
  route: '/our-story',
  image: {
    url: '/og/our-story.jpg',
    width: 1200,
    height: 630,
    alt: 'The yard at Rooftop at Riverside seen from the rooftop, with the picnic tables and the umbrellas',
  },
});

const CHRIS = PEOPLE[0];

export default async function OurStoryPage() {
  const venue = await getVenue();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(breadcrumbJsonLd([{ name: 'Our story', path: '/our-story' }])),
        }}
      />
      <PlateHero
        question="Who is behind the rooftop in Bonita Springs?"
        title={'A Magnus '}
        titleAccent="family project"
        photo="/images/venue/story-yard-day-wide.webp"
        photoAlt="The yard at Rooftop at Riverside seen from the rooftop: picnic tables and umbrellas on the turf, with the building's roof edge on the right"
      />
      <AboutStory />
      <SoftWave from="bone" to="teal600" className="relative -mb-px" />
      <Section tone="teal" band="xl" aria-label="What this place is for">
        <Reveal>
          <figure className="m-0 text-center">
            <span
              aria-hidden="true"
              className="block font-display text-d1 font-extrabold leading-[0.6] text-cream"
            >
              &ldquo;
            </span>
            <blockquote className="m-0">
              <p className="m-0 mx-auto max-w-[24ch] text-balance font-display text-d5 font-extrabold uppercase leading-[1.05] text-paper sm:text-d4 md:max-w-none md:text-d3 lg:text-d2">
                {CHRIS.quote?.replace(/ (\S+) (\S+)$/, ' $1 $2')}
              </p>
            </blockquote>
            <figcaption className="mt-8 font-body text-caption font-bold uppercase tracking-eyebrow text-paper">
              <cite className="not-italic">{CHRIS.name}</cite>, {CHRIS.role}
            </figcaption>
          </figure>
        </Reveal>
      </Section>
      <SoftWave from="teal600" to="deep" className="relative -mb-px" />

      <Section tone="deep" band="lg" labelledBy="people-title">
        <div className="text-center">
          <Heading level={2} id="people-title" className="text-banda">
            Meet <span className="text-sunset">the team</span>
          </Heading>
          <p className="bajada mx-auto mt-gap-bajada max-w-[46ch] text-paper/85">
            The family that dreamed the place up, and the person who runs it every night.
          </p>
        </div>
        <StaggerGroup
          as="ul"
          className="mx-auto mt-bloque grid max-w-[46rem] list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2"
        >
          {PEOPLE.map((persona) => (
            <RevealItem as="li" key={persona.name}>
              <article className="group relative aspect-[3/4] overflow-hidden rounded-shell bg-deeper sombra-card">
                {persona.photo ? (
                  <Image
                    src={persona.photo}
                    alt={persona.photoAlt ?? persona.name}
                    fill
                    sizes="(min-width: 640px) 340px, 90vw"
                    className="object-cover"
                  />
                ) : (
                  <PhotoPending
                    brief={`Retrato de ${persona.name}, vertical 3:4, en el local.`}
                    ratio="aspect-[3/4]"
                    tone="dark"
                  />
                )}

                <div className="absolute inset-x-0 bottom-0 translate-y-19 bg-paper p-5 transition-transform duration-200 ease-brand max-lg:translate-y-0 group-hover:translate-y-0 group-focus-within:translate-y-0">
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-mint opacity-0 transition-opacity duration-200 ease-brand max-lg:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100"
                  />

                  <div className="relative">
                    <Heading level={3} className="text-d6 leading-none text-ink">
                      {persona.name}
                    </Heading>
                    <div className="mt-3 h-14 overflow-hidden">
                      <p className="m-0 font-body text-caption font-bold uppercase tracking-eyebrow text-ink/70">
                        {persona.role}
                      </p>
                      {persona.email ? (
                        <p className="m-0 mt-1.5 font-body text-base leading-[1.4]">
                          <a
                            href={`mailto:${persona.email}`}
                            className="link-texto break-all text-ink"
                          >
                            {persona.email}
                          </a>
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            </RevealItem>
          ))}
        </StaggerGroup>
      </Section>
      <VenueTabs />
      <HowToOrder />
      <FindUs />
    </>
  );
}
