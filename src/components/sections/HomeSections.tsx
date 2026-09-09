import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { ArrowLink, ButtonLink } from '@/components/shared/Button';
import { Marquee, Reveal, RevealItem, StaggerGroup } from '@/components/shared/Motion';
import { PhotoPending } from '@/components/shared/PendingData';
import PinnedList, { type PinnedItem } from '@/components/shared/PinnedList';
import Section, { GUTTER } from '@/components/shared/Section';
import TilePattern from '@/components/shared/TilePattern';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
import { HAPPY_HOUR, addressLine, mapsUrl, BRAND } from '@/lib/brand';
import { recurringEvents, whenLabel } from '@/content/events';

/* ==========================================================================
   How this place works — el módulo que desarma la confusión
   ========================================================================== */

/**
 * ⚠️ Las etiquetas de cada paso son datos YA confirmados en otro lado del
 * sitio: los cuatro camiones, el happy hour de `HAPPY_HOUR`, las cinco noches
 * de música. No hay ni un dato nuevo acá. Este módulo explica, no anuncia.
 */
const STEPS: readonly PinnedItem[] = [
  {
    n: '01',
    title: 'Order at whichever window you want',
    body: 'Four trucks park in the yard and each one is somebody’s own business. You order at the window, you pay that truck. Separate line, separate card, separate receipt.',
    tags: ['Four independent kitchens', 'Order at the window', 'A tab per truck', 'No table service'],
  },
  {
    n: '02',
    title: 'Get your drinks upstairs',
    body: 'The Sunset Bar on the roof is ours. Cocktails made that morning, drafts from breweries twenty minutes away. It’s the one tab we run, and the only menu on this site with prices.',
    tags: ['Cocktails made daily', 'Local drafts', `Happy hour ${HAPPY_HOUR.days}, ${HAPPY_HOUR.time}`, 'The one tab we run'],
  },
  {
    n: '03',
    title: 'Stay for whoever’s playing',
    body: 'Live music five nights a week, Bingo on Wednesdays, DJ sets late on Saturdays. Almost all of it is free and none of it needs a ticket.',
    tags: ['Live music five nights', 'Bingo Wednesdays', 'DJ sets Saturdays', 'No ticket, no cover'],
  },
];

/**
 * El módulo que desarma la confusión, contado con el scroll.
 *
 * ⚠️ Cambia la FORMA, no el contenido: eran tres columnas que se leían de un
 * vistazo y ahora es una lista fijada que se abre de a un paso. La razón es que
 * el orden importa —primero pedís, después subís, después te quedás— y tres
 * columnas en paralelo no dicen que hay una secuencia. Ver `PinnedList` para
 * el mecanismo y para qué pasa sin JS.
 *
 * ⚠️ El `Section` va sin `band`: el alto lo pone `PinnedList`, y un padding
 * vertical grande encima del recorrido de varias pantallas sólo agrega vacío.
 */
export function HowThisPlaceWorks() {
  return (
    <Section bandTop="lg" bandBottom="sm" labelledBy="how-title">
      <PinnedList
        items={STEPS}
        head={
          <SectionHead
            eyebrow="How this place works"
            eyebrowTone="deep"
            id="how-title"
            title={
              <>
                Five businesses, <br className="hidden sm:block" />
                one set of stairs.
              </>
            }
            lead="It catches people out the first time, so here it is plainly."
          >
            {/* La columna izquierda queda fijada varias pantallas: sin una
                salida, es mucho aire sostenido sin nada que hacer. El enlace
                va ACÁ y no dentro de los ítems, que se pliegan — un enlace
                enfocable dentro de un bloque con `overflow: hidden` recibe
                foco en una zona que no se ve. */}
            <ArrowLink href="/the-yard" className="mt-[26px]">
              See how the yard is laid out
            </ArrowLink>
          </SectionHead>
        }
      />
    </Section>
  );
}

/* ==========================================================================
   Reviews — ESCRITO Y SIN USAR, a propósito
   ========================================================================== */

/**
 * ⚠️ NO SE MONTA. El brief: «No montes módulo de reviews. Los ratings del
 * cliente no están confirmados. Dejá el componente escrito y sin usar.»
 *
 * Queda acá listo para cuando se confirmen. No se importa en ninguna página.
 * El día que se use hay que traer las reviews de una fuente real —Google o
 * Yelp— y nunca escribirlas a mano.
 */
export function ReviewsMarquee({
  reviews,
}: {
  readonly reviews: readonly { quote: string; author: string; source: string }[];
}) {
  if (reviews.length === 0) return null;

  return (
    <Section band="lg" labelledBy="reviews-title" width="full" className="px-0">
      <div className={GUTTER}>
        <div className="caja">
          <SectionHead
            eyebrow="What people say"
            id="reviews-title"
            title="Don't take our word for it"
          />
        </div>
      </div>
      <Marquee durationSeconds={45} className="mt-[40px]" itemClassName="gap-[20px] pr-[20px]">
        {reviews.map((r, i) => (
          <figure
            key={i}
            className="flex w-[340px] shrink-0 flex-col rounded-card border border-ink/12 p-[24px]"
          >
            <blockquote className="flex-1 text-[16px] leading-[1.65]">{r.quote}</blockquote>
            <figcaption className="mt-[16px] eyebrow text-body/75">
              {r.author} · {r.source}
            </figcaption>
          </figure>
        ))}
      </Marquee>
    </Section>
  );
}

/** Re-export para que `PhotoPending` esté disponible donde se arma la home. */
export { PhotoPending };
