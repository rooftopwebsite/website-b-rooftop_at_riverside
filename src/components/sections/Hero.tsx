import Image from 'next/image';
import { ButtonLink } from '@/components/shared/Button';
import { HeroFadeUp, MaskedLines } from '@/components/shared/Motion';
import { GUTTER } from '@/components/shared/Section';
import { Heading } from '@/components/shared/Type';
import VideoWall from '@/components/shared/VideoWall';

/**
 * Hero del home — forma Superside: titular, una frase, un CTA y el muro.
 *
 * ⚠️ CUARTA versión. Las tres anteriores, para que no se repitan:
 *   1. dos paneles con la tipografía a la izquierda — rechazado
 *   2. pila centrada sobre blanco con la foto en una tarjeta — «no se asemeja
 *      en nada a nuestros proyectos»
 *   3. foto a sangre con velo `deep` al 72% y el titular encima — funcionó,
 *      pero era el hero de Showdown Social, no el de Superside
 *
 * Camila fijó Superside como la forma de este hero: «colocaremos muchos videos
 * cortos del lugar, de la experiencia. Por lo que necesitamos acortar el texto
 * del hero. Que vaya más al grano, que sea una frase contundente, de impacto».
 *
 * ⚠️ SE FUE LA FOTO DE FONDO, y no por descuido. Con el muro de videos abajo,
 * la foto y los clips compiten por la misma atención; Superside apoya sus
 * tiles sobre fondo plano justamente por eso. Queda `deep` sólido, que además
 * se continúa con el header —también `deep`— en un solo campo oscuro.
 *
 * Y de paso se cae el problema que la foto obligaba a resolver: el velo al 72%
 * existía para garantizar contraste sobre una imagen que no controlamos. Sobre
 * `deep` sólido, `paper` da 15.4:1 sin depender de nada.
 *
 * ⚠️ UN SOLO CTA. «Plan an event» ya está en el header como píldora naranja en
 * todas las páginas, así que acá era la segunda puerta al mismo lugar. Es
 * también la forma de la referencia: Superside abre con un botón.
 *
 * ⚠️ Los cuatro hechos (`FACTS`) se fueron al `PromoBar`, arriba del header. El
 * selector de intención (`INTENTS`) se fue a `ThreeDoors`, donde se funde con
 * las tres losas oscuras que decían lo mismo más abajo.
 */
export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="bg-deep pb-[52px] lg:pb-[64px]">
      <div className={`${GUTTER} pt-[52px] lg:pt-[66px]`}>
        <div className="mx-auto flex max-w-[860px] flex-col items-center text-center">
          <HeroFadeUp>
            <Image
              src="/brand/isotype-truck.svg"
              alt=""
              width={552}
              height={390}
              priority
              className="w-[62px] lg:w-[74px]"
            />
          </HeroFadeUp>

          <Heading level={1} role="hero" id="hero-title" className="mt-[20px] text-paper">
            {/* `accentOn="dark"` es el default, pero va escrito: es la
                superficie la que decide el color del acento y dejarlo
                implícito invita a copiar esto a una sección clara, donde
                `sunset` da 2.48:1 y no pasa. */}
            <MaskedLines lines={['Bonita comes', 'together']} delay={0.08} accentLast accentOn="dark" />
          </Heading>

          {/*
            Una línea, tres hechos, tres golpes. Reemplaza al párrafo de 24
            palabras que había: contesta la confusión de «restaurante» sin
            explicarla, que es lo que pedía «que vaya más al grano».
          */}
          <HeroFadeUp delay={0.26} className="mt-[18px]">
            <p className="text-[19px] leading-[1.4] text-paper/85 lg:text-[23px]">
              Rooftop bar. Four kitchens. Walk in.
            </p>
          </HeroFadeUp>

          <HeroFadeUp delay={0.34} className="mt-[28px]">
            <ButtonLink href="/whats-on" variant="primary" size="lg">
              What&rsquo;s on tonight
            </ButtonLink>
          </HeroFadeUp>
        </div>
      </div>

      {/* El muro va A SANGRE: sin gutter y sin caja. Es lo que hace que se lea
          como una cinta que sigue más allá de la pantalla, y no como una
          galería contenida. */}
      <div className="mt-[40px] lg:mt-[52px]">
        <VideoWall />
      </div>
    </section>
  );
}
