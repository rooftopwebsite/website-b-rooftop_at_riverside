import Image from 'next/image';
import { ButtonLink } from '@/components/shared/Button';
import { HeroFadeUp, MaskedLines } from '@/components/shared/Motion';
import { GUTTER } from '@/components/shared/Section';
import { Heading } from '@/components/shared/Type';
import VideoWall from '@/components/shared/VideoWall';

/**
 * Hero del home — texto a la izquierda, muro de videos a la derecha.
 *
 * ⚠️ QUINTA versión, y ésta sale de un boceto a mano de Camila: el titular, la
 * frase y el CTA en una columna a la izquierda, y la grilla de clips verticales
 * ocupando la columna derecha.
 *
 * Las cuatro anteriores, para que no vuelvan por inercia:
 *   1. dos paneles con la tipografía a la izquierda — rechazado
 *   2. pila centrada sobre blanco con la foto en una tarjeta — «no se asemeja
 *      en nada a nuestros proyectos»
 *   3. foto a sangre con velo y el titular encima — era Showdown, no Superside
 *   4. centrado con el muro a lo ancho debajo — la forma de Superside, pero el
 *      muro quedaba asomando al pie en vez de ser parte del hero
 *
 * Lo que gana la versión de dos columnas: el muro deja de ser una cinta al pie
 * y pasa a ser la mitad del hero, que es lo que Camila dibujó. Y el titular
 * alineado a la izquierda le da un eje al bloque de texto que el centrado no
 * tenía.
 *
 * ⚠️ En MOBILE vuelve a apilarse: texto arriba, muro abajo a sangre. Dos
 * columnas en 390px darían una de 170px, donde no entra ni el titular ni un
 * tile legible.
 *
 * ⚠️ Sin foto de fondo. Con los clips al lado, una foto detrás compite por la
 * misma atención. Queda `deep` sólido, continuo con el header — y de paso el
 * texto no depende de un velo para tener contraste: `paper` sobre `deep` da
 * 15.4:1.
 */
export default function Hero() {
  /*
    ⚠️ ALTO COMPLETO DE PANTALLA. Camila: «hero full alto de pantalla».

    Se descuenta el bloque pegado de arriba —promo 37 + header 64 en mobile,
    37 + 76 desde `desk`— porque está EN EL FLUJO: sin descontarlo, el hero
    empujaría esos píxeles fuera de la pantalla y la primera vista quedaría
    cortada.

    `svh` y no `vh`: en un teléfono, `100vh` cuenta el alto SIN la barra del
    navegador, así que el hero se corta justo cuando la barra está visible, que
    es exactamente al cargar la página.
  */
  return (
    <section
      aria-labelledby="hero-title"
      /* `relative` es lo que ancla el muro: desde `desk` va posicionado contra
         ESTA caja, que es el hero entero de borde a borde de pantalla. */
      className="relative flex h-[calc(100svh-101px)] min-h-[620px] overflow-hidden bg-deep desk:h-[calc(100svh-113px)] desk:min-h-[640px]"
    >
      {/*
        ⚠️ NINGÚN PADDING VERTICAL ACÁ. Lo tenía —40px arriba y abajo— y era lo
        que hacía que el muro se viera «recortado», que es como lo describió
        Camila: los tiles terminaban contra un colchón de verde en vez de
        contra el borde del hero, y eso lee como una galería metida en una
        caja. El padding se mudó a la columna de TEXTO, que es la única que lo
        necesita. Así el muro toma el alto completo de la sección.
      */}
      <div className={`${GUTTER} flex w-full`}>
        {/*
          ⚠️ La caja NO envuelve al muro. El texto va dentro de la caja de 1280
          y el muro sale de ella para llegar al borde derecho de la pantalla:
          una cinta que se corta en el borde se lee como que sigue, y contenida
          se leería como una galería que termina.
        */}
        <div className="caja flex w-full flex-col">
          {/*
            ⚠️ MOBILE Y DESKTOP SON DISTINTOS, y Camila lo marcó. En mobile es
            una pila: texto arriba, muro abajo tomando el alto que sobra. Desde
            `desk` son dos columnas de alto completo. Por eso `flex-col` con un
            `desk:grid` encima, y no una sola grilla responsive.
          */}
          <div className="flex min-h-0 flex-1 flex-col">
            {/* ── La columna de texto ──────────────────────────────────────
                Acá SÍ va el padding vertical: el muro de al lado va a sangre
                de arriba abajo y el texto no puede tocar los bordes.

                `desk:max-w-[48%]` es lo que le deja el aire al muro. El muro
                desde `desk` sale del flujo, así que ya no hay una grilla que
                reserve la columna: el ancho del texto es lo único que impide
                que se le meta debajo. Medido en 1344 —el mínimo de `desk`—
                quedan ~105px entre el final del texto y el primer tile. */}
            <div className="flex shrink-0 flex-col items-center pt-[40px] pb-[26px] text-center desk:h-full desk:max-w-[48%] desk:items-start desk:justify-center desk:py-[52px] desk:text-left">
              <HeroFadeUp>
                <Image
                  src="/brand/isotype-truck.svg"
                  alt=""
                  width={552}
                  height={390}
                  priority
                  className="w-[58px] lg:w-[68px]"
                />
              </HeroFadeUp>

              <Heading level={1} role="hero" id="hero-title" className="mt-[18px] text-paper">
                {/* `accentOn="dark"` va escrito aunque sea el default: es la
                    superficie la que decide el color del acento, y dejarlo
                    implícito invita a copiar esto a una sección clara, donde
                    `sunset` da 2.48:1 y no pasa. */}
                <MaskedLines
                  lines={['Bonita comes', 'together']}
                  delay={0.08}
                  accentLast
                  accentOn="dark"
                />
              </Heading>

              <HeroFadeUp delay={0.26} className="mt-[18px]">
                <p className="max-w-[30ch] text-[19px] leading-[1.4] text-paper/85 lg:text-[22px]">
                  Rooftop bar. Four kitchens. Walk in.
                </p>
              </HeroFadeUp>

              <HeroFadeUp delay={0.34} className="mt-[28px]">
                <ButtonLink href="/whats-on" variant="primary" size="lg">
                  What&rsquo;s on tonight
                </ButtonLink>
              </HeroFadeUp>
            </div>

            {/* ── El muro ──────────────────────────────────────────────────
                ⚠️ DESDE `desk` SALE DEL FLUJO: `absolute inset-y-0 right-0`
                contra la sección. Es lo que pidió Camila —«que lleguen al
                borde de arriba y de abajo del hero» y «no respetar el margen
                derecho, como en superside»— y las dos cosas salen de la misma
                línea: `inset-y-0` lo pega a los dos bordes horizontales del
                hero, `right-0` al borde derecho de la PANTALLA.

                ⚠️ Antes esto era una columna de grid con `-mr-gutter-lg`, y no
                alcanzaba: ese margen sólo se comía los 32px del gutter, así que
                en cualquier pantalla más ancha que 1344 el muro terminaba en el
                borde de la caja de 1280 y quedaba una franja de verde muerta a
                la derecha.

                ⚠️ Y NO se resuelve con un margen negativo en porcentaje
                (`mr-[calc(50%-50vw)]`): dentro de una grilla, el porcentaje de
                un margen se resuelve contra la PISTA del ítem, no contra la
                caja, así que la cuenta da cualquier cosa. Posicionarlo contra
                la sección no tiene esa ambigüedad.

                ⚠️ `min-w-0` y `min-h-0` NO son opcionales mientras está en
                flujo. Un ítem de flex trae `min-width`/`min-height: auto`, que
                le permite crecer más allá de su caja cuando el contenido es más
                grande — y el track del muro mide miles de píxeles. Sin esto el
                `overflow:hidden` no recorta nada: medido antes de ponerlo, la
                columna se estiraba a 7.560px.

                En mobile sigue en flujo: `flex-1` le da el alto que sobra
                después del texto y va a sangre por los dos lados. */}
            <div className="-mx-gutter min-h-0 min-w-0 flex-1 md:-mx-gutter-lg desk:absolute desk:inset-y-0 desk:right-0 desk:mx-0 desk:w-[46%]">
              <VideoWall />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
