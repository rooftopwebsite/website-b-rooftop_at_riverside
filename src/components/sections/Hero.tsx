import { ButtonLink } from '@/components/shared/Button';
import CardArc from '@/components/shared/CardArc';
import { HeroFadeUp, MaskedLines } from '@/components/shared/Motion';
import ScrollExit from '@/components/shared/ScrollExit';
import { GUTTER } from '@/components/shared/Section';
import { Heading } from '@/components/shared/Type';

/**
 * Hero del home — pila centrada con un abanico de cards al pie.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ SÉPTIMA versión, y sale de un mockup de Camila. Las seis anteriores, para
 * que no vuelvan por inercia:
 *
 *   1. dos paneles con la tipografía a la izquierda — rechazado
 *   2. pila centrada sobre blanco con la foto en una tarjeta — «no se asemeja
 *      en nada a nuestros proyectos»
 *   3. foto a sangre con velo y el titular encima — era Showdown, no Superside
 *   4. centrado con el muro a lo ancho debajo — la forma de Superside, pero el
 *      muro quedaba asomando al pie en vez de ser parte del hero
 *   5. dos columnas: titular a la izquierda, muro vertical a la derecha
 *   6. la 5 invertida a clave clara, con el muro en huecos rotulados
 *
 * ⚠️ La 2 también era una pila centrada y se rechazó. Qué es distinto acá: lo
 * que había debajo del titular era UNA foto en una tarjeta. Ahora es un
 * abanico de nueve piezas apoyado en un arco, sangrando por los dos costados
 * — o sea una composición, no una imagen suelta.
 *
 * ⚠️ `VideoWall` NO SE BORRA. Sigue en el árbol con sus tres columnas y su loop
 * CSS, y comparte el material con el abanico vía `wall-slots.ts`. Volver a la
 * forma 5 o 6 es cambiar un import.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ── Dos cosas del mockup que se resolvieron distinto ──────────────────────
 *
 * ⚠️ **EL ACENTO DEL TITULAR NO VA EN NARANJA.** En el mockup «TOGETHER» está
 * en `sunset`, y sobre superficie clara eso da **2.54:1**: no pasa el 4.5:1 de
 * cuerpo ni el 3:1 de texto grande, en ningún tamaño. Va en `terra`, el
 * rojo-naranja de la paleta, que da **7.43:1** sobre `paper` y 6.87:1 sobre
 * `bone` — es lo más cerca del naranja que se puede llegar sin romper el
 * contraste. Es la misma regla que ya aplica `Accent`, y está medida en
 * `design-audit/CONTRASTE.md`.
 *
 * ⚠️ **NO HAY CIELO DE ATARDECER.** El mockup tiene un fondo de nubes doradas.
 * En las 36 fotos entregadas no hay ni una de cielo, y menos de golden hour, y
 * el brief prohíbe explícitamente recrear en CSS lo que tendría que ser un
 * asset real. Así que el fondo es `bone` —la superficie clara cálida— y el
 * cielo queda pedido. Ver `docs/media.md`.
 */
export default function Hero() {
  return (
    /*
      ⚠️ NO es `100svh` como las versiones anteriores, y es a propósito. Con la
      pila centrada arriba y el abanico al pie, el alto lo define el contenido:
      forzar el alto de pantalla en un laptop de 720px dejaría el abanico
      pegado al titular, y en un monitor de 1400px dejaría un colchón vacío
      entre los dos. `min-h` pone el piso y el resto lo decide lo que hay.

      ⚠️ `overflow-hidden` es lo que hace que el abanico sangre: las cards de
      las puntas y el borde inferior se cortan contra esta caja, y un elemento
      que se corta en el borde se lee como que sigue.

      ⚠️ El `pt` lleva sumada la altura del header —77px, 67 en mobile— porque
      el header es `fixed` y flota encima; sin eso taparía el isotipo.
    */
    <section
      aria-labelledby="hero-title"
      className="relative flex min-h-160 flex-col overflow-hidden bg-bone pt-26 desk:min-h-190 desk:pt-33"
    >
      <div className={`${GUTTER} flex w-full flex-col`}>
        {/* ⚠️ Con la caja centrada, el titular necesita un TOPE DE MEDIDA: sin
            él, un titular centrado a 144px se estira hasta el ancho de la
            pantalla y deja de tener forma.

            ⚠️ `ScrollExit` es UNA de las dos salidas del sitio, y va sobre el
            bloque de TEXTO y no sobre la sección: envolver el hero entero lo
            movería con `y` y abriría un hueco contra What's on. Así el abanico
            se queda quieto y lo que se despide es el titular, que es lo que
            tiene algo que despedir. Ver `ScrollExit.tsx`. */}
        <ScrollExit className="mx-auto flex w-full max-w-[900px] flex-col items-center text-center">
          <HeroFadeUp>
            {/* ⚠️ `<img>` plano y no `next/image`: es un VECTOR, y el
                optimizador no puede hacer nada por un SVG salvo romperlo —
                devuelve una imagen que el navegador reporta como 0×0. La nota
                larga con la medición está en `HorizonBorder.tsx`.

                `fetchPriority="high"` reemplaza al `priority` de next/image:
                el isotipo está en la primera pantalla. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/isotype-truck.svg"
              alt=""
              width={552}
              height={390}
              fetchPriority="high"
              className="h-auto w-13.5 lg:w-15.5"
            />
          </HeroFadeUp>

          <Heading level={1} role="hero" id="hero-title" className="mt-3.5 text-ink">
            {/* ⚠️ `accentOn="light"` — es la superficie la que decide el color
                del acento, no el gusto. Ver la nota del encabezado sobre por
                qué acá no va el naranja del mockup. */}
            <MaskedLines
              lines={['Bonita comes', 'together']}
              delay={0.08}
              accentLast
              accentOn="light"
            />
          </Heading>

          <HeroFadeUp delay={0.26} className="mt-4">
            <p className="max-w-[42ch] text-lead bajada">Rooftop bar. Four kitchens. Walk in.</p>
          </HeroFadeUp>

          {/* ⚠️ DOS CTAs, como en el mockup, y el orden importa: el primario
              lleva a lo que alguien quiere saber ahora —qué hay hoy— y el
              secundario al lugar. El primario va en `sunset` con texto NEGRO
              (8.26:1); el naranja como RELLENO sí está permitido, es como
              TEXTO que no. */}
          <HeroFadeUp delay={0.34} className="mt-6.5">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <ButtonLink href="/whats-on" variant="primary" size="lg">
                What&rsquo;s on tonight
              </ButtonLink>
              <ButtonLink href="/the-yard" variant="secondary" size="lg">
                See the yard
              </ButtonLink>
            </div>
          </HeroFadeUp>
        </ScrollExit>
      </div>

      {/* ── El abanico ───────────────────────────────────────────────────
          ⚠️ Va FUERA de la caja con gutter y a lo ancho completo: el arco tiene
          que sangrar por los dos costados de la PANTALLA, no de la caja de
          1280. Y el `mb` negativo lo corta contra el borde inferior del hero.

          `mt-auto` lo empuja al pie cuando el hero es más alto que su
          contenido, que es lo que pasa en un monitor grande. */}
      <CardArc className="mt-auto -mb-[6vw] pt-11 desk:-mb-[4vw]" />
    </section>
  );
}
