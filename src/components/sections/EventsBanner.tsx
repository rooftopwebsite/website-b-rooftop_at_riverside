import Image from 'next/image';
import { ButtonLink } from '@/components/shared/Button';
import { Reveal } from '@/components/shared/Motion';
import ScrollExit from '@/components/shared/ScrollExit';
import Section from '@/components/shared/Section';
import { Accent, Heading } from '@/components/shared/Type';

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
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ES LA BANDA OSCURA DE LA HOME — `redesign/light-tropical`.
 *
 * Antes era una card `deep/90` DENTRO de una `Section tone="bone"`, porque la
 * única sección oscura permitida la usaba «How this place works». Ahora es al
 * revés: esa sección pasó a clara y el corte oscuro se mudó acá.
 *
 * Por qué acá y no en otro lado, con tres razones concretas:
 *
 *   · **Es la vertical que más factura.** El único énfasis fuerte de la página
 *     le corresponde al bloque que vende.
 *   · **Mide una banda, no una losa.** Contra los 1.430px que ocupaba la
 *     escalera, esto es una franja: un corte, no un fondo.
 *   · **Una card oscura dentro de una sección clara hacía que la sección
 *     entera leyera oscura sin serlo.** Medido sobre el píxel, era uno de los
 *     cinco focos que sumaban el 55,4 % de verde de la home. Como banda a
 *     sangre el oscuro está declarado en vez de disimulado.
 *
 * Es el movimiento de `IMG_2909` del moodboard: página clara entera, UNA losa
 * saturada, y el resto callado.
 *
 * ⚠️ Se cayeron la `rounded-card` y la `shadow-float`. Una banda a sangre no
 * lleva radio ni sombra: es una superficie, no un objeto apoyado encima.
 * ══════════════════════════════════════════════════════════════════════════
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
    /* `tone="deep"` pinta la sección ENTERA, de borde a borde de pantalla, y
       el contenido sigue dentro de la caja de 1280. `on-dark` viene con el
       tono: es lo que invierte el anillo de foco y lo que hace que la bajada
       resuelva a `muted-dark` sin que este archivo lo diga. */
    <Section tone="deep" band="lg" labelledBy="events-banner-title">
      {/* La foto, de fondo y desenfocada, a lo ancho de la banda. `alt=""`
          porque acá no informa nada: es la atmósfera del bloque, y describirla
          obligaría a un lector de pantalla a escuchar una foto que no aporta al
          mensaje.

          ⚠️ Es la AÉREA del patio entero, de la entrega nueva. Reemplaza a
          `event-a.jpg`, que era una foto de un evento particular: para un
          bloque que dice «cerramos el lugar completo para vos», la toma que
          corresponde es la que muestra el lugar completo.

          ⚠️ El archivo es de 1000×667 y eso es DELIBERADO, no un descuido: el
          `blur-[22px]` de abajo destruye todo el detalle, así que una imagen
          grande acá sería peso puro. 96 KB para una banda a todo el ancho. */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <Image
          src="/images/venue/venue-aerial.jpg"
          alt=""
          fill
          sizes="100vw"
          className="scale-110 object-cover blur-[22px]"
        />
        <div className="absolute inset-0 bg-deep/90" />
      </div>

      {/* ⚠️ La SEGUNDA y última salida del sitio, y va sobre el contenido y no
          sobre la banda: si se moviera la sección, las dos cenefas que la
          enmarcan quedarían separadas de su propio color. La banda oscura se
          queda quieta; lo que se despide es el mensaje. Ver `ScrollExit.tsx`.

          ⚠️ `Reveal` adentro y `ScrollExit` afuera, en ese orden: la entrada la
          resuelve el `whileInView` del reveal y la salida el progreso del
          scroll. Al revés, el transform de la salida sería el ancestro del
          reveal y los dos escribirían el mismo `y`. */}
      <ScrollExit>
      <Reveal className="relative grid gap-8.5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:items-center lg:gap-14">
        {/* ── La columna del mensaje ───────────────────────────────── */}
        <div>
          {/* ⚠️ Sin eyebrow. «Planning a work event?» era una pregunta que el
              h2 ya contesta, y era uno de los 14 eyebrows que tenía la home. */}
          <Heading level={2} id="events-banner-title" className="text-paper">
            We close the whole place <Accent on="dark">for you</Accent>
          </Heading>

          {/* ⚠️ `bajada` en lugar de `text-paper/85`. La utilidad lee
              `--lead-ink`, que dentro de `.on-dark` vale `muted-dark` —5.95:1
              medido contra `deep`—. Con la opacidad el color dependía de lo que
              hubiera detrás, que acá es una FOTO: imposible de auditar. */}
          <p className="mt-gap-bajada max-w-[46ch] text-lead bajada">
            Holiday parties, client nights, fundraisers and reunions. You get the rooftop, the yard
            and four kitchens — and one person coordinating all of it.
          </p>

          <div className="mt-7">
            <ButtonLink href="/events" variant="onDark" size="lg">
              Plan your event
            </ButtonLink>
          </div>
        </div>

        {/* ── Los tres puntos ──────────────────────────────────────────
            ⚠️ FILAS SEPARADAS POR FILETE, no tres tarjetas. Eran tres cajas
            `bg-paper/10` con el mismo radio y el mismo filo — o sea el kit de
            tarjetas idénticas otra vez, tres veces en la misma pantalla.

            El filete de 1px es el lenguaje que ya usa `ThreeDoors` (el mandato
            de WeWork) y acá gana algo más: sin relleno translúcido, la foto de
            fondo se ve pasar por detrás del texto en lugar de quedar tapada por
            tres rectángulos. El contraste no depende de eso — el velo al 90 %
            ya garantiza el piso. */}
        <ul className="flex flex-col">
          {ITEMS.map((item, i) => (
            <li
              key={item}
              className={`text-base leading-[1.5] text-paper ${
                i === 0 ? 'pb-4' : 'border-t border-paper/25 py-4 last:pb-0'
              }`}
            >
              {item}
            </li>
          ))}
        </ul>
      </Reveal>
      </ScrollExit>
    </Section>
  );
}
