import Image from 'next/image';
import { ButtonLink } from '@/components/shared/Button';
import StackWithHead from '@/components/sections/StackWithHead';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading } from '@/components/shared/Type';
import { EVENT_KINDS } from '@/content/event-types';

const STACK_CAP = [
  'top-[calc(78px+var(--head))]',
  'top-[calc(102px+var(--head))]',
  'top-[calc(126px+var(--head))]',
  'top-[calc(150px+var(--head))]',
  'top-[calc(174px+var(--head))]',
  'top-[calc(198px+var(--head))]',
];

export default function EventTypes() {
  return (
    <Section tone="mint" band="lg" labelledBy="event-types-title">
      <StackWithHead
        background="bg-mint grain"
        head={
          <>
      <h2
        id="event-types-title"
        className="mx-auto max-w-[18ch] text-center font-display text-band font-extrabold uppercase"
      >
        <span className="text-ink">Every reason</span>{' '}
        <span className="text-sunset-deep">to celebrate</span>
      </h2>
      <p className="mx-auto mt-6 max-w-[60ch] text-center font-body text-lead font-light text-ink">
        Company nights, birthdays, fundraisers, holiday parties and everything in between. Tell
        us what you have in mind and we build the day around it, from the first toast to the
        last song.
      </p>
          </>
        }
      >
      <ul className="flex list-none flex-col gap-6 p-0">
        {EVENT_KINDS.map((type, i) => (
          <li key={type.id} className={`sticky ${STACK_CAP[Math.min(i, STACK_CAP.length - 1)]}`}>
            <article
              id={type.id}
              className="group relative grid scroll-mt-24 overflow-hidden rounded-shell bg-paper text-left card-shadow md:grid-cols-[minmax(0,1fr)_42%] lg:grid-cols-2"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-3.5 z-10 rounded-shell border border-dashed border-deep/35"
              />
              <div className="p-7 max-md:pb-0 md:order-2 md:pl-0 lg:p-12">
                <div className="relative aspect-[2/1] w-full overflow-hidden rounded-ticket bg-fog md:aspect-auto md:h-full md:min-h-64 lg:min-h-[20rem]">
                  <Image
                    src={type.image}
                    alt={type.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 50vw, (min-width: 768px) 42vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-brand group-hover:scale-104"
                  />
                </div>
              </div>

              <div className="flex flex-col justify-center gap-4 p-7 md:order-1 lg:p-12">
                <Eyebrow tone="terra" as="span">
                  {type.eyebrow}
                </Eyebrow>
                <Heading level={3} className="m-0 text-d4 leading-[0.98] text-ink lg:text-d3">
                  {type.title}
                </Heading>

                <p className="m-0 max-w-[46ch] font-body text-lead font-light text-body">
                  {type.lead}
                </p>
                <div className="relative z-20 mt-2">
                  <ButtonLink href="#inquire" variant="primary">
                    Book now
                  </ButtonLink>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
      </StackWithHead>
    </Section>
  );
}
