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
      className="flex h-[calc(100svh-101px)] min-h-[620px] overflow-hidden bg-deep desk:h-[calc(100svh-113px)] desk:min-h-[640px]"
    >
      <div className={`${GUTTER} flex w-full pt-[40px] pb-[40px] lg:pt-[52px] lg:pb-[52px]`}>
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
          <div className="flex min-h-0 flex-1 flex-col gap-[28px] desk:grid desk:grid-cols-[minmax(0,0.78fr)_minmax(0,1fr)] desk:items-stretch desk:gap-[56px]">
            {/* ── La columna de texto ──────────────────────────────────── */}
            <div className="flex shrink-0 flex-col items-center text-center desk:items-start desk:justify-center desk:text-left">
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
                `desk:-mr-gutter-lg` lo saca de la caja por la derecha para que
                los tiles se corten contra el borde de la pantalla.

                En mobile se apila debajo y va a sangre por los dos lados, que
                es lo que hacía la versión anterior. */}
            {/*
              ⚠️ `min-w-0` y `min-h-0` NO son opcionales. Un ítem de grid y uno
              de flex traen `min-width`/`min-height: auto`, que les permite
              crecer más allá de su pista cuando el contenido es más grande — y
              el track del muro mide miles de píxeles. Sin esto el
              `overflow:hidden` de la columna no recorta nada: medido antes de
              ponerlo, la columna se estiraba a 7.560px y reventaba la grilla.

              En mobile `flex-1` le da el alto que sobra después del texto;
              desde `desk` toma el alto de la fila, que es el del hero.
            */}
            <div className="min-h-0 min-w-0 flex-1 -mx-gutter md:-mx-gutter-lg desk:mx-0 desk:-mr-gutter-lg desk:h-full">
              <VideoWall />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
