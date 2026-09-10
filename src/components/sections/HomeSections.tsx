import Link from 'next/link';
import { Marquee, RevealItem, StaggerGroup } from '@/components/shared/Motion';
import Section, { GUTTER } from '@/components/shared/Section';
import { SectionHead } from '@/components/shared/Type';
import { ArrowRight } from '@/components/shared/Icon';

/* ==========================================================================
   How this place works — el módulo que desarma la confusión
   ========================================================================== */

/**
 * «Five businesses, one set of stairs.»
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ESTE MÓDULO SE PARTIÓ EN DOS — rediseño `food-truck-club`.
 *
 * Antes acá vivían el titular Y los tres pasos, en el mismo componente y en
 * la misma sección. Ahora son dos:
 *
 *   · Este, que es el ENUNCIADO: el titular, el párrafo que lo explica y el
 *     link al plano del yard.
 *   · `sections/YardSteps.tsx`, que son los tres tickets con el detalle.
 *
 * No es una separación de archivos por tamaño. Es que el enunciado y el
 * detalle tienen ritmos distintos: el enunciado es un bloque de dos columnas
 * que se lee en cinco segundos y el detalle son tres tarjetas que se leen si
 * uno quiere. Metidos en una sección, el titular quedaba a 128px de aire
 * arriba de sus propias tarjetas y el conjunto se leía como una sola cosa muy
 * larga. Separados, alguien puede llevarse la idea sin leer los tickets — que
 * es lo que va a hacer la mayoría.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ «FIVE BUSINESSES» SON CINCO Y ESTÁ BIEN CONTADO: los cuatro camiones más
 * la barra. Es el número que corrige el malentendido, y por eso está en el
 * titular y no en el cuerpo. La gente entra pensando que es un restaurante
 * con varias cocinas; son cinco negocios distintos compartiendo una escalera.
 *
 * ⚠️ EL PÁRRAFO NO SE SUAVIZA. Dice «no hay servicio de mesa» sin rodeos,
 * porque es la queja número uno de las reseñas y llega siempre igual: alguien
 * se sentó a esperar que lo atiendan. Escrito acá, arriba, en la home, deja
 * de ser una sorpresa en el lugar.
 *
 * ⚠️ Se monta con `-mt-22` (−88px), que es EXACTAMENTE el radio de la banda.
 * La sección de arriba (`WhatsOn`, oscura) termina recta y esta se le monta
 * encima con su arco: el resultado es que la superficie clara emerge sobre la
 * oscura en lugar de apoyarse contra ella. Los dos números están atados — si
 * cambia `--radius-band`, cambia este margen.
 */
export function HowThisPlaceWorks() {
  return (
    <section
      aria-labelledby="how-title"
      className="relative z-[3] -mt-22 rounded-t-band bg-bone pt-16 pb-10 lg:pt-32 lg:pb-18"
    >
      <StaggerGroup className="caja-ancha grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-start gap-7 lg:gap-18">
        <RevealItem className="flex flex-col gap-3">
          <h2
            id="how-title"
            className="m-0 font-display text-h2 font-extrabold uppercase leading-[0.9] text-ink"
          >
            Five businesses,
            <br />
            one set of stairs.
          </h2>

          {/*
            ⚠️ El subrayado es un BORDE de 2px en `sunset` y no un
            `text-decoration`, y no es lo mismo: el naranja no puede ser el
            color del TEXTO sobre claro —da 2.54:1 y no pasa AA en ningún
            tamaño— pero sí puede ser el de una línea decorativa debajo. Así
            el acento de marca aparece en el link sin que el link dependa de
            él para leerse.
          */}
          <Link
            href="/the-yard"
            className="group mt-6.5 inline-flex w-fit items-center gap-2.5 border-b-2 border-sunset pb-1 font-body text-dato font-medium text-ink transition-colors duration-200 hover:border-ink"
          >
            See how the yard is laid out
            <ArrowRight className="size-3.75 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </RevealItem>

        <RevealItem as="p" className="m-0 font-body text-lead font-light text-ink">
          It catches people out the first time, so here it is plainly. Four independent kitchens
          park in the yard and each one is somebody’s own business — you order at the window and you
          pay that truck. The Sunset Bar on the roof is ours, and it is the one tab we run. There is
          no table service.
        </RevealItem>
      </StaggerGroup>
    </section>
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
      <Marquee durationSeconds={45} className="mt-10" itemClassName="gap-5 pr-5">
        {reviews.map((r, i) => (
          <figure
            key={i}
            className="flex w-85 shrink-0 flex-col rounded-card border border-ink/12 p-6"
          >
            <blockquote className="flex-1 text-base leading-[1.65]">{r.quote}</blockquote>
            <figcaption className="mt-4 eyebrow text-body/75">
              {r.author} · {r.source}
            </figcaption>
          </figure>
        ))}
      </Marquee>
    </Section>
  );
}

/*
 * ⚠️ Acá había un `export { PhotoPending }` — un re-export de conveniencia para
 * que la home pudiera importar el placeholder desde este archivo. Se fue: nadie
 * lo usaba por esta puerta, y un re-export sin consumidores es una dependencia
 * falsa entre dos módulos que no tienen nada que ver. Quien necesite
 * `PhotoPending` lo importa de `shared/PendingData`, que es donde vive.
 */
