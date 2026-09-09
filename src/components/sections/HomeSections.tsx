import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { ArrowLink, ButtonLink } from '@/components/shared/Button';
import { Marquee, Reveal, RevealItem, StaggerGroup } from '@/components/shared/Motion';
import { PhotoPending } from '@/components/shared/PendingData';
import StepStair, { type Step } from '@/components/shared/StepStair';
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
const STEPS: readonly Step[] = [
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
 * El módulo que desarma la confusión, contado como una ESCALERA.
 *
 * ⚠️ TERCERA forma. Fueron tres columnas en paralelo, después una lista fijada
 * que abría un paso por vez con el scroll, y ahora una escalera con los tres
 * pasos abiertos. La referencia la mandó Camila: for-living.it, el bloque «We
 * handle all the complexity».
 *
 * Por qué la escalera gana a la lista fijada, que es lo que reemplaza:
 *
 *   · **El orden se ve de una.** Primero pedís, después subís, después te
 *     quedás. Una escalera dice «esto va en orden» de un vistazo; la lista
 *     fijada obligaba a scrollear tres pantallas para descubrir que había un
 *     orden.
 *   · **Devuelve 2,3 pantallas.** A 42vh por paso la sección medía 2.226px en
 *     un viewport de 900 — casi un tercio del recorrido de la home para tres
 *     párrafos cortos.
 *
 * Ver `StepStair` para la geometría y para qué pasa en mobile.
 *
 * ⚠️ VERDE OSCURO. Está marcado así en el boceto de Camila, y es la única losa
 * oscura de la home aparte del hero.
 *
 * ⚠️ Las bandas de toda la home dependen de esto. `check:surfaces` prohíbe dos
 * secciones de color seguidas, y las vecinas —`WhatsOn` y `ThreeDoors`— eran
 * las dos `bone`. Quedó `paper · deep · paper · bone · paper`: el verde entra y
 * sale contra blanco, que es lo que lo hace pegar.
 *
 * ⚠️ El encabezado ya NO va en una columna al costado. Con la lista fijada eran
 * dos columnas —el título quieto a la izquierda, los pasos a la derecha—
 * porque el título tenía que acompañar tres pantallas de recorrido. La escalera
 * necesita el ancho completo para desplegar la diagonal, así que el título pasa
 * arriba, que es además como está en la referencia.
 */
export function HowThisPlaceWorks() {
  return (
    <Section tone="deep" bandTop="lg" bandBottom="lg" labelledBy="how-title">
      <div className="caja">
        <SectionHead
          eyebrow="How this place works"
          /* `cream` y no `deep`: sobre la losa oscura el eyebrow en `deep`
             daría 1:1. Crema sobre deep da 9.44:1. */
          eyebrowTone="cream"
          id="how-title"
          title={
            <>
              Five businesses, <br className="hidden sm:block" />
              one set of stairs.
            </>
          }
          lead="It catches people out the first time, so here it is plainly."
        />

        <StepStair items={STEPS} className="mt-[52px] lg:mt-[68px]" />

        {/* El enlace va al pie de la escalera y no dentro de un paso: los
            peldaños son la secuencia y meter una salida en el medio invita a
            abandonarla antes de terminar de leerla. */}
        <ArrowLink href="/the-yard" className="mt-[44px]">
          See how the yard is laid out
        </ArrowLink>
      </div>
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
