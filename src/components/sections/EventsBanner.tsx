import Image from 'next/image';
import { ButtonLink } from '@/components/shared/Button';
import { Reveal } from '@/components/shared/Motion';
import Section from '@/components/shared/Section';
import { Accent, Eyebrow, Heading } from '@/components/shared/Type';

/**
 * El banner de eventos privados — foto de fondo desenfocada, dos columnas.
 *
 * ⚠️ SEGUNDA versión. La primera tomaba la forma «Our global team» de
 * superside.com/our-creative-talent: card oscura con la foto inset arriba y el
 * texto debajo. Camila la cambió en el boceto: «foto fondo blur y info como
 * sección mercado de superside».
 *
 * Qué gana el cambio: la foto pasa de ser una franja ilustrativa arriba del
 * texto a ser el AMBIENTE del bloque. Es un banner de eventos privados — lo que
 * se vende es el lugar lleno de gente de noche—, y desenfocada cumple ese
 * trabajo sin competir con el titular, que es exactamente lo que hacía cuando
 * estaba nítida y a 21:9.
 *
 * ⚠️ Los tres pasos del proceso que vivían acá (request a proposal → get the
 * packet → see the spaces) NO se borraron: se mudaron a `/events`, que es la
 * página que les corresponde. Eran contenido que sólo existía en la home.
 *
 * ⚠️ La card va oscura DENTRO de una `Section tone="bone"`, y no como
 * `Section tone="deep"`. `check:surfaces` permite UNA sola sección deep por
 * página y la usa «How this place works».
 *
 * ── El velo, que es lo único delicado acá ─────────────────────────────────
 *
 * ⚠️ El velo es `deep/90` y ese 90 es un PISO calculado, no un gusto. Sobre una
 * foto, el contraste del texto depende de qué píxel le toque debajo, y el peor
 * caso posible es una foto blanca pura. Con el velo al 90%:
 *
 *     luminancia máxima = 0.9 × L(deep) + 0.1 × 1.0 = 0.142
 *     paper sobre eso   = 5.3:1     cream sobre eso = 4.8:1
 *
 * O sea que ni con la foto más clara imaginable el texto baja de AA. Bajar el
 * velo a 80% deja el peor caso en 3.9:1 y ahí ya depende de la foto — que es
 * justo lo que no se puede verificar una sola vez, porque la foto la cambia el
 * cliente.
 *
 * ⚠️ El desenfoque AYUDA al contraste además de al ambiente: promedia los
 * píxeles, así que desaparecen los brillos puntuales que son los que rompen la
 * legibilidad de una línea suelta.
 *
 * ⚠️ `scale-110` no es decorativo. Un `filter: blur()` difumina también contra
 * el borde del elemento y deja los cuatro cantos semitransparentes; agrandar la
 * foto un 10% saca esos bordes fuera del recorte.
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
    <Section tone="bone" bandTop="lg" bandBottom="sm" labelledBy="events-banner-title">
      <Reveal className="relative overflow-hidden rounded-card shadow-float">
        {/* La foto, de fondo y desenfocada. `alt=""` porque acá ya no informa
            nada: es la atmósfera del bloque, y describirla obligaría a un
            lector de pantalla a escuchar una foto que no aporta al mensaje. */}
        <Image
          src="/images/events/event-a.jpg"
          alt=""
          fill
          sizes="(max-width: 1023px) 100vw, 1280px"
          className="scale-110 object-cover blur-[22px]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-deep/90" />

        <div className="relative grid gap-[34px] p-[26px] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:items-center lg:gap-[56px] lg:p-[56px]">
          {/* ── La columna del mensaje ───────────────────────────────── */}
          <div>
            <Eyebrow tone="cream">Planning a work event?</Eyebrow>

            <Heading level={2} id="events-banner-title" className="mt-gap-kicker text-paper">
              We close the whole place <Accent on="dark">for you</Accent>
            </Heading>

            <p className="mt-gap-bajada max-w-[46ch] text-lead text-paper/85">
              Holiday parties, client nights, fundraisers and reunions. You get the rooftop, the
              yard and four kitchens — and one person coordinating all of it.
            </p>

            <div className="mt-[28px]">
              <ButtonLink href="/events" variant="onDark" size="lg">
                Plan your event
              </ButtonLink>
            </div>
          </div>

          {/* ── Los tres puntos ──────────────────────────────────────────
              Van en tarjetas translúcidas y no en barras `deeper` como en la
              versión anterior: sobre una foto, un relleno opaco vuelve a tapar
              el fondo y el bloque pierde justo lo que se ganó al ponerla.
              `paper/10` con un filo al 20% se lee como vidrio y deja pasar el
              ambiente. */}
          <ul className="flex flex-col gap-[10px]">
            {ITEMS.map((item) => (
              <li
                key={item}
                className="rounded-card bg-paper/10 px-[20px] py-[16px] text-[16px] leading-[1.5] text-paper/90 ring-1 ring-paper/20"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
