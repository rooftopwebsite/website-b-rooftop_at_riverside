import Image from 'next/image';
import { ButtonLink } from '@/components/shared/Button';
import { Reveal } from '@/components/shared/Motion';
import Section from '@/components/shared/Section';
import { Accent, Eyebrow, Heading } from '@/components/shared/Type';

/**
 * El banner de eventos privados — forma «Our global team» de Superside.
 *
 * Camila: «el ¿Estás planeando un evento de trabajo? quiero que sea sólo un
 * banner, que toda esa info esté en la página que le corresponda, no en la
 * home. Tomemos el diseño del banner OUR GLOBAL TEAM de
 * superside.com/our-creative-talent».
 *
 * Estructura medida en esa página: card oscura con la imagen ARRIBA —inset,
 * con radio—, y debajo eyebrow, titular con acento, bajada y tres barras de
 * una línea con lo más importante.
 *
 * ⚠️ Los tres pasos del proceso que vivían acá (request a proposal → get the
 * packet → see the spaces) NO se borraron: se mudaron a `/events`, que es la
 * página que les corresponde. Eran contenido que sólo existía en la home.
 *
 * ⚠️ La card va `deep` DENTRO de una `Section tone="paper"`, y no como
 * `Section tone="deep"`. `check:surfaces` permite UNA sola sección deep por
 * página y hay que dejarla libre; es el mismo truco que usaba el bloque
 * anterior con su card naranja.
 */

/**
 * Los tres items. Son los ya confirmados en `/events`, no promesas nuevas.
 *
 * ⚠️ «We coordinate the trucks» es el que más importa y por eso va primero: el
 * venue NO tiene cocina, la comida la sirven los trucks y nosotros
 * coordinamos. Es la confusión que más caro sale en una venta.
 */
const ITEMS = [
  'We coordinate the trucks, so you deal with one person and not four vendors',
  'The bar is ours: open bar, drink tickets or consumption, however you want to run it',
  'The rooftop, the yard, the patio — or the entire venue with the gates shut',
] as const;

export default function EventsBanner() {
  return (
    <Section tone="paper" band="lg" labelledBy="events-banner-title">
      <Reveal className="overflow-hidden rounded-card bg-deep p-[20px] shadow-float lg:p-[28px]">
        {/* La imagen arriba, inset y con su propio radio. Es lo que separa esta
            forma de una losa a sangre: la card respira alrededor de la foto. */}
        <div className="relative aspect-[16/9] overflow-hidden rounded-card shadow-photo lg:aspect-[21/9]">
          <Image
            src="/images/events/event-a.jpg"
            alt="Guests at a private event at Rooftop at Riverside"
            fill
            sizes="(max-width: 1023px) 100vw, 1280px"
            className="object-cover"
          />
        </div>

        <div className="px-[6px] pt-[28px] pb-[10px] lg:px-[14px] lg:pt-[36px]">
          <Eyebrow tone="cream">Planning a work event?</Eyebrow>

          <Heading level={2} id="events-banner-title" className="mt-gap-kicker text-paper">
            We close the whole place <Accent on="dark">for you</Accent>
          </Heading>

          <p className="mt-gap-bajada max-w-[62ch] text-lead text-paper/80">
            Holiday parties, client nights, fundraisers and reunions. You get the rooftop, the yard
            and four kitchens — and one person coordinating all of it.
          </p>

          {/* Las tres barras. Van en `deeper` sobre `deep`: se leen como
              renglones levantados y no como tarjetas sueltas dentro de la card,
              que es lo que hace la referencia. */}
          <ul className="mt-[28px] flex flex-col gap-[8px]">
            {ITEMS.map((item) => (
              <li
                key={item}
                className="rounded-btn bg-deeper px-[18px] py-[14px] text-[16px] leading-[1.5] text-paper/90"
              >
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-[28px]">
            <ButtonLink href="/events" variant="onDark" size="lg">
              Plan your event
            </ButtonLink>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
