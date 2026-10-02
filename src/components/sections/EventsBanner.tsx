import Image from 'next/image';
import { ButtonLink } from '@/components/shared/Button';
import { ArrowRight } from '@/components/shared/Icon';
import { Reveal, RevealItem, StaggerGroup } from '@/components/shared/Motion';

const CARDS = [
  {
    tag: 'The trucks',
    title: 'The trucks are yours',
    body: 'We coordinate every truck, so you deal with one person from start to finish.',
    src: '/images/venue/truck-window-night.webp',
    alt: 'A food truck window in the yard at night',
  },
  {
    tag: 'The bar',
    title: 'The bar is yours',
    body: 'Open bar, drink tickets or consumption, however you want to run it.',
    src: '/images/venue/wall-bartender.webp',
    alt: 'A bartender making cocktails at the Sunset Bar',
  },
  {
    tag: 'The venue',
    title: 'The whole place is yours',
    body: 'The rooftop, the yard, the patio, or the entire venue just for your guests.',
    src: '/images/venue/wall-dancing-night.webp',
    alt: 'Guests dancing at a private party at Rooftop at Riverside',
  },
] as const;

export default function EventsBanner() {
  return (
    <section
      id="events"
      aria-labelledby="events-banner-title"
      className="banda-arco relative z-[3] bg-deep grano pt-14 pb-cierre-arco text-bone on-dark md:pt-18 lg:pt-22 desk:pt-28"
    >
      <div className="caja-ancha relative">
        <Reveal className="relative">
          <h2
            id="events-banner-title"
            className="m-0 text-balance font-display text-banda font-extrabold uppercase text-paper"
          >
            The whole place <span className="text-sunset">is{' '}
            <span className="whitespace-nowrap">
              yours
              <Image
                src="/brand/badge-sun-teal.svg"
                alt=""
                width={113}
                height={113}
                className="ml-[0.15em] inline-block size-[0.8em] align-[-0.06em]"
              />
            </span></span>
          </h2>
          <p className="mt-gap-bajada max-w-[62ch] font-body text-lead font-light text-paper">
            Holiday parties, client nights, fundraisers and reunions. You get the rooftop, the yard
            and the food trucks, and one person coordinating all of it.
          </p>

        </Reveal>
        <ButtonLink href="/events#inquire" variant="onDark" size="lg" className="mt-7 lg:mt-11">
          Plan your event
          <ArrowRight className="size-4" />
        </ButtonLink>
        <StaggerGroup as="ul" className="mt-bloque flex list-none flex-col gap-6 p-0 md:grid md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6">
          {CARDS.map(({ tag, title, body, src, alt }, i) => (
            <RevealItem
              as="li"
              key={src}
              className={i === 0 ? 'md:col-span-2 lg:col-span-1' : undefined}
            >
              <div className={`group relative isolate flex aspect-square flex-col justify-end overflow-hidden rounded-shell bg-deeper sombra-card ${i === 0 ? 'md:aspect-[16/8]' : 'md:aspect-[4/5]'} lg:aspect-[4/5]`}>
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes={i === 0 ? '(min-width: 1024px) 420px, 100vw' : '(min-width: 1024px) 420px, (min-width: 768px) 50vw, 100vw'}
                  className="-z-20 object-cover transition-transform duration-500 ease-brand group-hover:scale-104"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 -z-10 h-[72%] bg-linear-to-t from-ink/95 via-ink/70 to-transparent"
                />

                <div className="flex flex-col gap-2.5 p-6.5">
                  <span className="eyebrow text-cream">{tag}</span>

                  <h3 className="m-0 font-display text-d5 font-bold uppercase leading-[1.02] text-paper">
                    {title}
                  </h3>
                  <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-brand motion-reduce:transition-none lg:grid-rows-[0fr] lg:group-hover:grid-rows-[1fr] motion-reduce:lg:grid-rows-[1fr]">
                    <div className="overflow-hidden">
                      <p className="m-0 max-w-[34ch] font-body text-dato font-light text-bone">
                        {body}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </RevealItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
