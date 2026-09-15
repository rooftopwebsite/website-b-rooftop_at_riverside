import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from '@/components/shared/Icon';
import { Reveal } from '@/components/shared/Motion';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading } from '@/components/shared/Type';
import { featuredEvent, timeRange, weekdayLabel } from '@/content/events';

/**
 * ══════════════════════════════════════════════════════════════════════════
 * EL EVENTO DESTACADO DEL CALENDARIO, EN GRANDE.
 *
 * ⚠️ EXISTE PORQUE UNA PÁGINA SE CONVIRTIÓ EN UN EVENTO. `/nfc-north-hq` —los
 * domingos de fútbol— era una landing propia con su hero y sus 152 líneas.
 * Revisando qué páginas secundarias tiene que tener el sitio, Camila la mandó
 * al calendario: «domingos de fútbol debería ser un evento recurrente del
 * calendario». Y después puso la condición que hace que el cambio no sea una
 * degradación: «irán en calendario pero con un espacio o card grande, mucho
 * más destacada».
 *
 * Esto es esa card. Sin ella, el fútbol habría pasado de tener una página
 * entera a ser una fila más entre Bingo y el DJ.
 *
 * ⚠️ NO ES UNA LISTA, ES UNO SOLO. Si hubiera dos destacados a la vez, el
 * recurso deja de destacar: son dos cards grandes seguidas y el calendario
 * arranca con dos pantallas antes de la primera fecha. `featuredEvent()`
 * devuelve el PRIMERO que lleve el tag y nada más.
 *
 * ⚠️ QUIÉN ES EL DESTACADO SE DECIDE EN EL DASHBOARD, no acá: es el evento que
 * lleva el tag `featured`. El cliente puede cambiarlo sin tocar el código, que
 * es la razón por la que el dato vive en la base y no en un `const` de este
 * archivo.
 *
 * ⚠️ SI NADIE LLEVA EL TAG, ESTO NO RENDERIZA NADA. El calendario arranca
 * directamente por la lista, como antes. Un bloque vacío con un título sería
 * peor que no tener bloque.
 * ══════════════════════════════════════════════════════════════════════════
 */
export default async function FeaturedEvent() {
  const event = await featuredEvent();
  if (!event) return null;

  const cuando =
    event.kind === 'recurring' && event.weekday !== null
      ? `Every ${weekdayLabel(event.weekday)}`
      : null;

  return (
    <Section tone="deep" band="md" labelledBy="featured-title">
      <Reveal>
        <Link
          href={`/whats-on/${event.slug}`}
          className="group relative grid overflow-hidden rounded-shell bg-deeper sombra-card lg:grid-cols-2"
        >
          {/*
            ⚠️ LA FOTO VA PRIMERO EN EL DOM Y SEGUNDA EN PANTALLA EN DESKTOP
            (`lg:order-2`). En mobile la imagen abre la card, que es lo que la
            hace reconocible de un scroll; en desktop el texto va a la
            izquierda porque es donde cae la lectura. El orden del DOM se queda
            con el de mobile para que un lector de pantalla oiga el alt antes
            que el titular.
          */}
          <div className="relative aspect-[16/10] w-full bg-ink lg:order-2 lg:aspect-auto lg:h-full lg:min-h-[22rem]">
            {event.image ? (
              <Image
                src={event.image}
                alt={event.imageAlt ?? ''}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 ease-brand group-hover:scale-104"
              />
            ) : null}
          </div>

          <div className="flex flex-col justify-center gap-4 p-7 lg:order-1 lg:p-12">
            <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
              <Eyebrow tone="cream" as="span">
                Every week
              </Eyebrow>
              {cuando ? (
                <span className="rounded-pill bg-cream px-2.5 py-0.75 font-body text-caption font-bold whitespace-nowrap text-deep">
                  {cuando.replace('Every ', '')} · {timeRange(event)}
                </span>
              ) : null}
            </span>

            <Heading
              level={2}
              id="featured-title"
              className="m-0 font-display text-d3 font-bold uppercase leading-[0.98] text-paper lg:text-d2"
            >
              {event.title}
            </Heading>

            <p className="m-0 max-w-[46ch] font-body text-lead font-light text-bone">
              {event.summary}
            </p>

            <span className="mt-2 inline-flex w-fit items-center gap-2.5 font-body text-base font-semibold text-cream">
              See the night
              <ArrowRight className="size-4 transition-transform duration-300 ease-brand group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </Reveal>
    </Section>
  );
}
