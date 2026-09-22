import Image from 'next/image';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading } from '@/components/shared/Type';
import { TIPOS_EVENTO } from '@/content/event-types';
import { TAG } from '@/lib/tag';

/**
 * ══════════════════════════════════════════════════════════════════════════
 * LOS CUATRO TIPOS DE EVENTO, EN LOSAS HORIZONTALES SOBRE MENTA.
 *
 * ⚠️ LA FORMA ES LA DEL DESTACADO DE `/sunset-bar`, EN CLARO. Camila,
 * 2026-09-21: «estas cards las quiero como el destacado de NFC North en Sunset,
 * pero clarito con su imagen».
 *
 * Ese destacado es `shared/FeaturedEventCard.tsx` y su geometría son cuatro
 * cosas, que son las cuatro que están acá:
 *
 *   · una losa `rounded-shell` con `overflow-hidden` y `sombra-card`, partida
 *     en DOS MITADES iguales a partir de `lg`;
 *   · la mitad de contenido con `justify-center`, `gap-4` y `p-7 lg:p-12`;
 *   · rótulo, titular de display en caja alta, y bajada de `lead` liviana;
 *   · la otra mitad a sangre completa, con `aspect-[16/10]` en mobile y
 *     `h-full min-h-[22rem]` en desktop.
 *
 * ⚠️ LO QUE CAMBIA ES LA SUPERFICIE Y ESO ES TODO EL PEDIDO. El destacado va
 * en `deeper` con la plancha de precios en `ink`; acá la losa es `paper` sobre
 * la banda menta y el contraste entre las dos mitades lo hace la foto, que es
 * lo que el destacado pone cuando el evento SÍ tiene imagen (su rama `else`).
 *
 * ⚠️ LA FOTO ABRE LA TARJETA EN MOBILE Y VA A LA DERECHA EN DESKTOP, que es
 * exactamente el orden del destacado: `lg:order-2` en la foto y `lg:order-1`
 * en el texto. El motivo está escrito allá y vale igual acá: una foto es lo que
 * hace la tarjeta reconocible de un scroll.
 *
 * ⚠️ LAS CUATRO VAN CON LA FOTO DEL MISMO LADO Y NO ALTERNADAS. La versión
 * anterior de este archivo las daba vuelta en los impares para que no se
 * leyeran como plantilla, y eso tenía sentido cuando eran secciones a sangre
 * sin borde entre una y otra. Como losas separadas por 24px de menta, la
 * repetición de la geometría es lo que las hace leer como un set — y es la
 * forma que se pidió, que es una sola.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ QUÉ SE FUE DE ESTE ARCHIVO Y NO VUELVE.
 *
 * 1. LOS TRECE DESTACADOS (`tipo.highlights`). Eran tres o cuatro párrafos por
 *    tipo, en dos columnas. La mitad repetía a la otra mitad: «four menus, zero
 *    dietary drama» en corporate y «food nobody complains about» en
 *    holiday-parties son la misma frase. Ese argumento ahora lo carga la losa
 *    oscura de `CompareSlab`, en cuatro renglones comparados.
 *
 * 2. LA SECCIÓN «THREE KINDS OF NIGHT» de la página, que listaba
 *    `EVENT_FAMILIES`. Era la TERCERA taxonomía: los cuatro tipos de acá, esas
 *    tres familias y los ocho `EVENT_TYPES` del formulario. `EVENT_FAMILIES` NO
 *    se borró: sigue generando `EVENT_SUBTYPES`, que valida el desplegable de
 *    `InquiryForm` en el servidor.
 *
 * 3. EL LINK POR TARJETA. Cuatro «Ask about a <tipo> event» que iban los cuatro
 *    a `#inquire`, el mismo destino que el CTA del hero y el del cierre. Las
 *    losas informan; la página tiene un solo lugar donde se pide.
 *
 * ⚠️ CADA TIPO LLEVA SU `id` Y NO SE PUEDE RENOMBRAR. Las cuatro rutas viejas
 * —`/events/corporate` y compañía— redirigen con 301 a `/events#<id>`, y
 * `lib/nav.ts` linkea a `/events#corporate`. Un `id` distinto rompe un link que
 * puede estar en un mail que el cliente mandó el mes pasado.
 * ══════════════════════════════════════════════════════════════════════════
 */
export default function EventTypes() {
  return (
    <Section tone="mint" band="lg" labelledBy="tipos-title">
      {/*
        ══════════════════════════════════════════════════════════════════════
        ⚠️ EL TITULAR NO HABLABA DE LO QUE CUENTA LA SECCIÓN. Camila,
        2026-09-22, sobre la captura: «este título de sección no va con lo que
        cuenta la sección; debería hablar de los tipos de eventos que puedes
        armar, siempre disfrutando de todos los espacios o algo así».

        Decía «Four kinds of night. One yard», y abajo hay cuatro losas que son
        corporativo, celebraciones, recaudaciones y fiestas navideñas. Ninguna
        de las cuatro es «una noche»: dos de ellas pasan de día —un fundraiser
        de escuela, un almuerzo de equipo— y ninguna es «el yard», porque lo que
        se alquila es el segundo piso entero. El titular describía una cosa que
        la sección no dice.

        Ahora nombra lo que la sección sí tiene: cuatro clases de evento, y el
        lugar completo en las cuatro.

        ⚠️ «THE WHOLE PLACE» NO ES UNA PROMESA NUEVA: es lo que ya dice el
        propio contenido del cliente en holiday-parties —«a full buyout gives
        you the rooftop, the yard, the patio and the trucks»— y lo que publica
        el bloque de alquiler de más abajo.

        ⚠️ LA PALABRA EN COLOR SE CONSERVA. Ningún titular de esta casa va
        monocromo; la regla vale para los heros y para las bandas.
        ══════════════════════════════════════════════════════════════════════
      */}
      <h2
        id="tipos-title"
        className="mx-auto max-w-[18ch] text-center font-display text-banda font-extrabold uppercase"
      >
        <span className="text-ink">Four kinds of event,</span>{' '}
        <span className="text-sunset-deep">the whole place</span>
      </h2>
      <p className="mx-auto mt-6 max-w-[60ch] text-center font-body text-lead font-light text-ink">
        Whatever you are throwing, you get the rooftop bar, the yard and the four kitchens. What
        changes is how the day is built around them.
      </p>

      {/*
        ══════════════════════════════════════════════════════════════════════
        ⚠️ LAS CUATRO LOSAS SE APILAN AL SCROLLEAR. Camila, 2026-09-21: «me
        gustaría que al scrolear se apilen una sobre la otra».

        Es `position: sticky` por tarjeta, con el `top` creciendo 24px por
        índice: la primera se pega bajo el header, la segunda sube por encima y
        se pega 24px más abajo, y así. Lo que queda a la vista de cada tarjeta
        ya pegada es esa franja de 24px, que es lo que hace leer la pila.

        ⚠️ EL `top` VA EN `style` Y NO EN UNA CLASE. Tailwind sólo emite las
        clases que encuentra ESCRITAS en el código, así que un `top-[${n}px]`
        calculado en runtime no existiría en el CSS. Es el mismo motivo por el
        que `PageHeroWave` pinta su fondo con `style`.

        ⚠️ LOS 102px SON UNA CUENTA: 78 de alto del header —que es `sticky
        top-0`, medido en el navegador— más 24 de aire. Si el header cambia de
        alto, este número se mueve con él.

        ⚠️ SE APILAN RECIÉN DESDE `lg`. En un teléfono cada losa mide más de
        700px —la foto en 16:10 más el texto— y sobre una pantalla de 844
        quedaría una sola tarjeta ocupando todo con una pila que no se ve. En
        mobile van en flujo normal, una abajo de la otra.

        ⚠️ SE FUERON `StaggerGroup` Y `RevealItem`, Y NO ES UN DESCUIDO. Los
        dos son elementos de `motion` y lo que animan es el `transform` del
        `<li>`. Un `transform` sobre el propio elemento pegajoso pelea con el
        `sticky`, y además la pila YA ES la animación de este bloque: sumarle
        un fade de entrada a cada tarjeta es un segundo gesto haciendo el mismo
        trabajo. El zoom de la foto en hover sigue, que vive en el `group`.

        ⚠️ LA OCLUSIÓN LA DA EL FONDO OPACO. `bg-paper` más `sombra-card` es lo
        que hace que la tarjeta de arriba tape a la de abajo en vez de
        transparentarse; sin fondo propio la pila no se leería. El orden de
        pintado lo da el DOM —la última va encima— así que no hace falta
        `z-index`.
        ══════════════════════════════════════════════════════════════════════
      */}
      <ul className="mt-bloque flex list-none flex-col gap-6 p-0">
        {TIPOS_EVENTO.map((tipo, i) => (
          <li key={tipo.id} className="lg:sticky" style={{ top: `${102 + i * 24}px` }}>
            <article
              id={tipo.id}
              className="group relative grid scroll-mt-24 overflow-hidden rounded-shell bg-paper text-left sombra-card lg:grid-cols-2"
            >
              {/* El troquel, de punta a punta de la losa. `inset-3.5` son los
                  14px que lo despegan del borde, el mismo número que en
                  `CompareSlab`, en la losa de happy hour y en el banner de
                  `/food-trucks`. El `z-10` lo deja por encima de las dos
                  mitades; no tapa nada porque los 14px caen entre el borde y
                  el padding de 28/48 que tienen las dos. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-3.5 z-10 rounded-shell border border-dashed border-deep/35"
              />

              {/*
                ⚠️ EL FILETE PUNTEADO DA LA VUELTA ENTERA Y LA FOTO VA METIDA
                HACIA ADENTRO. Camila, 2026-09-21, marcando la tarjeta con dos
                cajas: «el punteado de punta a punta y la imagen adentro con
                márgenes».

                Las dos cosas se resuelven juntas y una habilita a la otra. El
                primer intento tenía el filete SÓLO en la mitad de texto,
                justamente porque la foto llegaba al borde y un filete de
                `deep/35` cruzándola se veía sobre la del yoga y desaparecía
                sobre la del bajista. Con la foto despegada del borde, el
                troquel corre siempre sobre papel y se lee igual en las cuatro.

                ⚠️ EL MARGEN DE LA FOTO ES EL MISMO PADDING QUE EL TEXTO —`p-7
                lg:p-12`— y tiene que serlo: son las dos mitades de la misma
                losa, y si una respira 28px y la otra 48 el eje del medio deja
                de estar en el medio.
              */}
              <div className="p-7 lg:order-2 lg:p-12">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-ticket bg-fog lg:aspect-auto lg:h-full lg:min-h-[20rem]">
                  <Image
                    src={tipo.image}
                    alt={tipo.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-brand group-hover:scale-104"
                  />
                </div>
              </div>

              <div className="flex flex-col justify-center gap-4 p-7 lg:order-1 lg:p-12">
                <Eyebrow tone="terra" as="span">
                  {tipo.eyebrow}
                </Eyebrow>

                {/*
                  ⚠️ EL TITULAR VA UN ESCALÓN MÁS ABAJO QUE EL DEL DESTACADO,
                  que es `text-d3 lg:text-d2`. Allá el título es «NFC NORTH HQ»,
                  tres palabras cortas; acá son oraciones de nueve —«Take the
                  team somewhere they'll actually want to go»— y a `d2` ocupan
                  cinco renglones de media losa. `d4 lg:d3` es el cuerpo que ya
                  tenían estos mismos títulos antes del rediseño.
                */}
                <Heading level={3} className="m-0 text-d4 leading-[0.98] text-ink lg:text-d3">
                  {tipo.title}
                </Heading>

                <p className="m-0 max-w-[46ch] font-body text-lead font-light text-body">
                  {tipo.lead}
                </p>

                {/*
                  ⚠️ LOS FORMATOS SON ETIQUETAS Y TIENEN QUE PARECERLO: fondo
                  tenue, radio de la familia y texto en `muted`. En píldora con
                  contorno se leerían como botones apagados. Letra y acolchado
                  salen de `TAG`, el molde común de los tags del sitio.
                */}
                <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
                  {tipo.formats.map((f) => (
                    <li
                      key={f}
                      className={`inline-flex items-center gap-1.75 rounded-btn bg-bone ${TAG} text-muted`}
                    >
                      <span aria-hidden="true" className="size-1 shrink-0 rounded-pill bg-river" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </Section>
  );
}
