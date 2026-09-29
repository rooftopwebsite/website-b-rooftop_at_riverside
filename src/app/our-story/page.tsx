import type { Metadata } from 'next';
import Image from 'next/image';
import AboutStory from '@/components/sections/AboutStory';
import FindUs from '@/components/sections/FindUs';
import HowToOrder from '@/components/sections/HowToOrder';
import VenueTabs from '@/components/sections/VenueTabs';
import { Reveal } from '@/components/shared/Motion';
import { PhotoPending } from '@/components/shared/PendingData';
import PlateHero from '@/components/shared/PlateHero';
import Section from '@/components/shared/Section';
import SoftWave from '@/components/shared/SoftWave';
import { Eyebrow, Heading } from '@/components/shared/Type';
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
        <Reveal>
          <div className="mx-auto grid max-w-[60rem] items-center gap-9 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-12 lg:gap-16">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-[24rem] overflow-hidden rounded-shell bg-deeper sombra-card md:max-w-none">
              {CHRIS.photo ? (
                <Image
                  src={CHRIS.photo}
                  alt={CHRIS.photoAlt ?? CHRIS.name}
                  fill
                  sizes="(min-width: 960px) 420px, (min-width: 768px) 42vw, 384px"
                  className="object-cover"
                />
              ) : (
                <PhotoPending
                  brief={`Retrato de ${CHRIS.name}, vertical 3:4, en el local.`}
                  ratio="aspect-[3/4]"
                  tone="dark"
                />
              )}
            </div>

            <div className="flex flex-col max-md:text-center">
              <Eyebrow tone="cream" className="max-md:justify-center">
                {CHRIS.role}
              </Eyebrow>
              <Heading level={2} id="people-title" className="mt-gap-kicker text-banda">
                Meet <span className="text-sunset">the founder</span>
              </Heading>
              <p className="bajada mt-gap-bajada max-w-[46ch] text-paper/85 max-md:mx-auto">
                The Magnus family spent four years planning Rooftop at Riverside, and Chris is still
                the one running it. The photo is the family on the Old 41 corner, before the
                building went up.
              </p>
              <div className="mt-bloque border-t border-dashed border-bone/25 pt-5">
                <p className="m-0 font-display text-d5 font-extrabold uppercase leading-none text-paper">
                  {CHRIS.name}
                </p>
                {CHRIS.email ? (
                  <p className="m-0 mt-3 font-body text-base leading-[1.4]">
                    <a href={`mailto:${CHRIS.email}`} className="link-texto break-all text-paper">
                      {CHRIS.email}
                    </a>
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </Reveal>
      </Section>
      <VenueTabs />
      <HowToOrder />
      <FindUs />
    </>
  );
}
