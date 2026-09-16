'use client';

import { useReducedMotion } from 'motion/react';
import Image from 'next/image';
import Marquee from '@/components/shared/Marquee';
import { CaretDown } from '@/components/shared/Icon';

/**
 * El encabezado de `/our-story`: el video a sangre con el titular cruzándolo.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ES EL CALCO DEL HERO DE defoodtruckclub.nl/over-ons, PEDIDO ASÍ. Camila,
 * 2026-09-16: «hacemos aún más parecidos a los links que te mandé, debe ser una
 * copia literalmente de la estructura, adaptá nuestro contenido a la
 * estructura. Podés usar el video que teníamos ayer en about».
 *
 * La anatomía de allá, que es la que se copia:
 *
 *   · un video a sangre dentro de un marco redondeado, ocupando casi la
 *     pantalla entera;
 *   · el titular CRUZÁNDOLO en marquee, repetido y corriendo de derecha a
 *     izquierda, en cuerpo de display y a la altura del medio;
 *   · una pieza centrada encima del video;
 *   · y una flecha de scroll abajo, centrada, montada sobre el borde.
 *
 * ⚠️ EL VIDEO ES EL QUE SE DESCARTÓ AYER PARA LA HOME, y vuelve acá por pedido
 * expreso. Es el de `/hostanevent` del cliente, cortado para sacar los tramos
 * donde los televisores delataban la fecha, con los dos tramos limpios unidos a
 * 1,45× de velocidad: 15 segundos y 1,5 MB. El porqué del corte está en el
 * historial de `Hero.tsx`.
 *
 * ⚠️ NO LLEVA BOTÓN DE PLAY, y en la referencia sí. El de ellos abre un video
 * en un modal; el nuestro se reproduce solo, en bucle y sin sonido —el archivo
 * ni siquiera tiene pista de audio, se exportó con `-an`—. Un botón de play
 * encima de algo que ya se está reproduciendo, y que no tiene sonido que
 * activar, es un control que miente. La píldora «ver video» se cae por lo mismo.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ REEMPLAZA A `StoryHero`, QUE SIGUE EN EL ÁRBOL. Aquel es el corte del
 * edificio: la foto del rooftop arriba, la del yard abajo y el titular en el
 * entrepiso, con su argumento entero escrito en el archivo. No se borra —es el
 * mismo trato que tuvo `StepStair` cuando salió de la home— por si esta versión
 * no queda.
 *
 * ⚠️ `useReducedMotion` HACE DOS COSAS ACÁ, no una: cambia el video por el
 * póster y además el marquee se frena solo, porque `.marquesina` ya tiene su
 * propio corte en `globals.css`. Con la preferencia puesta queda una foto fija
 * con el titular quieto encima, que sigue diciendo todo lo que tiene que decir.
 */

/** El titular. Se repite en el marquee, así que va corto y sin puntuación final. */
const TITULAR = 'One family, one corner of Old 41';

export default function AboutHero() {
  const reducido = useReducedMotion();

  return (
    <section aria-labelledby="page-title" className="bg-bone grano pt-4 pb-cierre lg:pt-6">
      <div className="caja-ancha">
        <div className="relative overflow-hidden rounded-frame bg-deeper">
          {/*
            ⚠️ LA ALTURA VA EN `vh` CON TOPE, y no en proporción fija. La
            referencia ocupa casi la pantalla; con `aspect-video` en un monitor
            ancho el bloque mediría 660px y en un teléfono 210, o sea que el
            mismo gesto sería un cine arriba y una franja abajo. Con `vh` el
            encabezado ocupa lo mismo en los dos y el `max-h` evita que en una
            pantalla muy alta se coma la página entera.
          */}
          <div className="relative h-[62vh] max-h-[40rem] min-h-[22rem] w-full">
            {reducido ? (
              <Image
                src="/videos/hero-rooftop.jpg"
                alt="The building at Rooftop at Riverside seen from above, with the rooftop patio and the food trucks in the yard below"
                fill
                priority
                sizes="(min-width: 1400px) 1288px, 100vw"
                className="object-cover"
              />
            ) : (
              <video
                src="/videos/hero-rooftop.mp4"
                poster="/videos/hero-rooftop.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="The building at Rooftop at Riverside filmed from above: the rooftop patio with its umbrellas, the food trucks in the yard and Old 41 running past below"
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}

            {/*
              ══════════════════════════════════════════════════════════════
              ⚠️ EL VELO NO ES DECORACIÓN: ES LO QUE HACE LEGIBLE EL TITULAR.
              El texto va en `paper` encima de un video cuyo contenido cambia
              cuadro a cuadro, y el material incluye cielo, techos blancos y
              autos claros. Sin velo, el contraste del blanco depende de qué
              esté pasando en ese segundo, que es exactamente lo que no puede
              pasar con un titular.

              ⚠️ ES LA EXCEPCIÓN QUE `StoryHero` EVITABA A PROPÓSITO. Ese
              encabezado pone el texto sobre `bone` justamente para no necesitar
              velo, y su nota lo argumenta. Acá el titular tiene que CRUZAR la
              imagen —es la estructura que se pidió calcar— así que el velo pasa
              de defecto a requisito.

              ⚠️ NO HAY UN RATIO MEDIDO ACÁ, Y NO SE VA A INVENTAR UNO. Con un
              video de fondo el peor caso depende del cuadro, y una medición
              sobre diez muestras no prueba nada sobre los otros trescientos.
              Por eso el titular NO se apoya sólo en el velo: `text-shadow`
              dibuja su propio contorno oscuro pegado a la letra, que es lo único
              que sostiene el contraste aunque debajo pase un techo blanco.
              ══════════════════════════════════════════════════════════════
            */}
            <div aria-hidden="true" className="absolute inset-0 bg-ink/45" />

            {/*
              EL TITULAR EN MARQUEE, cruzando el video a media altura.

              ══════════════════════════════════════════════════════════════
              ⚠️ EL `<h1>` ES INVISIBLE Y EL MARQUEE ES DECORATIVO, y son dos
              elementos separados a propósito. Primero estaba el marquee DENTRO
              del `<h1>`, y eso rompe dos cosas a la vez:

                · marcado inválido. Un encabezado admite contenido de frase, y
                  `Marquee` devuelve tres `<div>`, que es contenido de flujo.

                · el texto repetido. El marquee duplica su contenido para que el
                  bucle no muestre un hueco, así que el nombre accesible del
                  encabezado quedaba sujeto a cuántas copias hubiera.

              Así, el `<h1>` dice una vez lo que la página es y la tira que
              cruza el video es lo que es: una repetición tipográfica. El texto
              visible y el anunciado son el mismo, sólo que uno se lee y el otro
              se mira.
              ══════════════════════════════════════════════════════════════
            */}
            <h1 id="page-title" className="sr-only">
              {TITULAR}
            </h1>

            <div aria-hidden="true" className="absolute inset-x-0 top-1/2 -translate-y-1/2">
              <Marquee label={TITULAR} duracion={38} className="w-full">
                <span className="font-display text-banda font-extrabold uppercase whitespace-nowrap text-paper [text-shadow:0_2px_18px_rgba(10,31,30,0.75)]">
                  {TITULAR}
                </span>
                <span className="font-display text-banda font-extrabold uppercase text-sunset">
                  &middot;
                </span>
              </Marquee>
            </div>
          </div>

          {/*
            LA FLECHA DE SCROLL, centrada y montada sobre el borde de abajo. En
            la referencia es un círculo claro con una flecha hacia abajo.

            ⚠️ ES UN LINK Y NO UN BOTÓN. Lleva al ancla de la sección siguiente,
            así que el destino existe en la URL y funciona con el teclado sin una
            línea de JavaScript. `aria-label` porque adentro sólo hay un dibujo.
          */}
          <a
            href="#story-title"
            aria-label="Skip to the story"
            className="absolute bottom-5 left-1/2 grid size-13 -translate-x-1/2 place-items-center rounded-pill bg-bone text-deep transition-colors duration-200 ease-brand hover:bg-paper"
          >
            <CaretDown className="size-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
