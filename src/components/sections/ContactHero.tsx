import { Reveal } from '@/components/shared/Motion';
import WaveBorder, { type Surface } from '@/components/shared/WaveBorder';
import { Instagram } from '@/components/shared/Icon';
import { Eyebrow } from '@/components/shared/Type';

/**
 * El encabezado de `/contact`: un COLLAGE, no un titular con bajada.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ES EL ENCABEZADO DE `defoodtruckclub.nl/contact`, CALCADO. Allá el
 * titular no está solo arriba de la página con un párrafo debajo: está
 * ENTRELAZADO con los datos de contacto, y los datos son piezas del mismo alto
 * que las letras. Una píldora enorme con el mail, un círculo con el link a
 * Instagram, otra píldora con el teléfono, y las palabras del titular
 * repartidas entre ellas.
 *
 * ⚠️ ESO ES LO QUE HACE EL BLOQUE, y es lo contrario de una columna de datos:
 * el teléfono deja de ser un renglón de 16px abajo a la derecha y pasa a ser
 * la segunda cosa más grande de la pantalla. En una página de contacto, donde
 * la mitad de la gente viene a llamar, el peso está bien puesto.
 *
 * ⚠️ ACÁ VA SÓLO EL TELÉFONO Y EL INSTAGRAM, no los tres buzones. Decisión de
 * Camila, 2026-09-16: los mails son tres y como tres piezas gigantes se
 * pelearían entre sí y con el titular. Van completos, con su etiqueta y para
 * qué es cada uno, en la columna de la izquierda de la losa del formulario,
 * que es donde la referencia pone sus datos fiscales.
 *
 * ⚠️ EL H1 NO SE PARTE. En la referencia las palabras del titular están en
 * renglones distintos con las piezas en el medio, lo que tienta a escribir un
 * `<h1>` por palabra: serían dos encabezados que no dicen nada sueltos. Acá el
 * h1 es uno solo, «Say hello», y ocupa la primera columna de una grilla de dos
 * filas; las piezas ocupan las otras celdas. El collage se arma con la grilla,
 * no partiendo el marcado.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ TERMINA EN ONDA, como `/food-trucks` y `/sunset-bar`. Es la cenefa que
 * cambia la superficie, para que la losa del formulario se apoye en otro
 * fondo. Ver `PageHeroWave`, que hace lo mismo para los encabezados centrados.
 */
export default function ContactHero({
  eyebrow,
  title,
  lead,
  phone,
  phoneHref,
  instagram,
  handle,
  from = 'bone',
  to = 'paper',
}: {
  readonly eyebrow: string;
  readonly title: readonly [string, string];
  readonly lead: string;
  readonly phone: string;
  readonly phoneHref: string;
  readonly instagram: string;
  readonly handle: string;
  readonly from?: Surface;
  readonly to?: Surface;
}) {
  return (
    <section
      aria-labelledby="page-title"
      className="grano relative"
      style={{ backgroundColor: `var(--color-${from})` }}
    >
      {/* El `pb` grande es el que deja pasar la cenefa. Ver `PageHeroWave`. */}
      <div className="caja-ancha pt-12 pb-24 lg:pt-16 lg:pb-28">
        <Reveal>
          <Eyebrow tone="deep">{eyebrow}</Eyebrow>

          {/*
            La grilla del collage: dos filas y tres columnas en desktop.

              ┌─────────┬──────────────────────┬──────┐
              │  SAY    │  (239) 268-0080      │  IG  │
              │  HELLO  │  la bajada, chica    │      │
              └─────────┴──────────────────────┴──────┘

            El h1 ocupa la columna 1 entera y las piezas caen a su derecha,
            centradas contra las dos líneas del titular. En mobile la grilla se
            desarma sola: una columna, y el orden del marcado ya es el correcto.
          */}
          <div className="mt-6 grid items-center gap-x-8 gap-y-6 lg:mt-8 lg:grid-cols-[auto_1fr_auto] lg:gap-y-8">
            {/*
              ⚠️ ACÁ EL TITULAR VA EN `text-titan` (144px) Y NO EN `text-banda`
              (112px), que es el techo del encabezado centrado de las otras
              internas. El motivo es este bloque y no una escalada de tamaños:
              al lado hay una píldora de 104px de alto que ocupa media
              pantalla, y con el titular en 112 la píldora ganaba la portada.
              En la referencia las palabras son siempre lo más grande; acá, con
              144 y dos renglones, el h1 mide lo mismo que la píldora y la
              bajada juntas y las dos columnas quedan parejas.
            */}
            <h1
              id="page-title"
              className="m-0 font-display text-banda font-extrabold uppercase leading-[0.82] text-ink lg:row-span-2 lg:text-titan"
            >
              {title[0]}
              <br />
              {title[1]}
            </h1>

            {/*
              ⚠️ ESTE `div` DESAPARECE EN DESKTOP (`lg:contents`), y existe sólo
              para el teléfono. En mobile la grilla es una sola columna, así que
              la píldora y el círculo caían uno abajo del otro y el círculo se
              quedaba solo en un renglón de 88px con medio ancho de pantalla
              vacío al lado. Agrupados, comparten renglón. En desktop
              `display: contents` los devuelve a la grilla como celdas sueltas,
              que es donde tienen que estar para caer en las columnas 2 y 3.

              ⚠️ EL TELÉFONO ES UN `<a href="tel:">` DE VERDAD, no un número
              pintado grande. La pieza mide 88px de alto y toda ella es el
              área de toque, que es bastante más que los 44px del mínimo.

              ⚠️ VA EN `mint` Y NO EN `sunset`. El naranja es del CTA primario
              y en esta pantalla el CTA es el formulario; además una píldora
              naranja de este tamaño se comería al titular. `mint` es el token
              de las formas grandes de acento y la tinta encima queda en `ink`,
              o sea el mismo 15:1 de siempre.
            */}
            <div className="flex items-center gap-4 lg:contents">
              <a
                href={phoneHref}
                className="flex h-[88px] flex-1 items-center justify-center rounded-pill border-2 border-dashed border-ink/30 bg-mint px-6 font-display text-d5 font-semibold uppercase leading-none text-ink transition-colors hover:bg-river/30 sm:text-d4 lg:h-[104px] lg:px-8 lg:text-d2"
              >
                {phone}
              </a>

              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-[88px] shrink-0 items-center justify-center rounded-full border-2 border-dashed border-ink/30 bg-cream text-ink transition-colors hover:bg-sunset lg:size-[104px]"
              >
                <Instagram className="size-8 lg:size-10" aria-hidden="true" />
                <span className="sr-only">{handle} on Instagram (opens in a new tab)</span>
              </a>
            </div>

            {/*
              La bajada va en la segunda fila, debajo de la píldora y alineada
              con ella: es la explicación de las piezas, no del titular.
            */}
            <p className="max-w-[46ch] font-body text-lead font-light leading-[1.55] text-body lg:col-span-2">
              {lead}
            </p>
          </div>
        </Reveal>
      </div>

      <WaveBorder from={from} to={to} className="pointer-events-none absolute inset-x-0 -bottom-px" />
    </section>
  );
}
