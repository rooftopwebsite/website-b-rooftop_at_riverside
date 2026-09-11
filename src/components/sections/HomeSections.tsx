import Link from 'next/link';
import { Marquee, RevealItem, StaggerGroup } from '@/components/shared/Motion';
import Section, { GUTTER } from '@/components/shared/Section';
import { SectionHead } from '@/components/shared/Type';
import { ArrowRight } from '@/components/shared/Icon';

/* ==========================================================================
   How this place works — el módulo que desarma la confusión
   ========================================================================== */

/**
 * «Five businesses, one set of stairs.»
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ESTE MÓDULO SE PARTIÓ EN DOS — rediseño `food-truck-club`.
 *
 * Antes acá vivían el titular Y los tres pasos, en el mismo componente y en
 * la misma sección. Ahora son dos:
 *
 *   · Este, que es el ENUNCIADO: el titular, el párrafo que lo explica y el
 *     link al plano del yard.
 *   · `sections/YardSteps.tsx`, que son los tres tickets con el detalle.
 *
 * No es una separación de archivos por tamaño. Es que el enunciado y el
 * detalle tienen ritmos distintos: el enunciado es un bloque de dos columnas
 * que se lee en cinco segundos y el detalle son tres tarjetas que se leen si
 * uno quiere. Metidos en una sección, el titular quedaba a 128px de aire
 * arriba de sus propias tarjetas y el conjunto se leía como una sola cosa muy
 * larga. Separados, alguien puede llevarse la idea sin leer los tickets — que
 * es lo que va a hacer la mayoría.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ «FIVE BUSINESSES» SON CINCO Y ESTÁ BIEN CONTADO: los cuatro camiones más
 * la barra. Es el número que corrige el malentendido, y por eso está en el
 * titular y no en el cuerpo. La gente entra pensando que es un restaurante
 * con varias cocinas; son cinco negocios distintos compartiendo una escalera.
 *
 * ⚠️ EL PÁRRAFO NO SE SUAVIZA. Dice «no hay servicio de mesa» sin rodeos,
 * porque es la queja número uno de las reseñas y llega siempre igual: alguien
 * se sentó a esperar que lo atiendan. Escrito acá, arriba, en la home, deja
 * de ser una sorpresa en el lugar.
 *
 * ⚠️ Se monta con un margen negativo que LEE `--radius-band`, así que es
 * exactamente el radio de la banda a cualquier ancho. Era `-mt-22` —88px
 * escritos a mano— y desde que el radio es fluido eso ya no servía: en mobile
 * el arco mide 36 y el margen seguía subiendo la sección 88.
 * La sección de arriba (`WhatsOn`, oscura) termina recta y esta se le monta
 * encima con su arco: el resultado es que la superficie clara emerge sobre la
 * oscura en lugar de apoyarse contra ella. Los dos números están atados — si
 * cambia `--radius-band`, cambia este margen.
 */
export function HowThisPlaceWorks() {
  return (
    <section
      aria-labelledby="how-title"
      /*
        ⚠️ SIN PADDING ABAJO, y no es un olvido: esta sección NO TERMINA acá.
        `YardSteps` viene pegada, sobre el MISMO hueso y sin titular propio
        —su `aria-label` no se ve—, así que en pantalla los tres tickets son
        el contenido de este encabezado y no otra sección. El aire entre los
        dos lo pone `YardSteps` con `pt-bloque`, que es el token del par
        «encabezado → su contenido». Si acá quedara un `pb`, se sumaría al
        de allá y el par mediría 120px en vez de 48: el doble del mismo
        espacio en «Three of them», cinco secciones más abajo.
      */
      className="relative z-[3] [margin-top:calc(var(--radius-band)*-1)] rounded-t-band bg-bone pt-16 lg:pt-32"
    >
      {/*
        ══════════════════════════════════════════════════════════════════
        ⚠️ LAS DOS COLUMNAS CIERRAN A LA MISMA ALTURA, y eso lo sostienen
        TRES cosas juntas. Si se toca una, se rompe el remate:

          1. La grilla NO lleva `items-start`. Sin eso las dos celdas miden
             lo que mide su contenido y la derecha termina donde se le
             ocurre; con el estiramiento por defecto las dos miden lo mismo
             que la fila, que es el alto del titular.
          2. La columna derecha es `flex-col justify-between`. El párrafo
             queda arriba, contra la primera línea del titular, y el CTA cae
             al piso de la celda, o sea a la última línea del titular.
          3. EL COPY ESTÁ ESCRITO PARA ESA ALTURA. El titular son dos
             renglones de `text-h2` (79,2px cada uno = 158px) y la derecha
             tiene que entrar en eso: párrafo de TRES renglones de `lead`
             (34,1px = 102px) + los 29px del CTA + el aire entre los dos.
             Un renglón más de párrafo y la columna derecha pasa al titular.
          4. El `gap-4` de esa celda es un PISO, no una medida. Mientras la
             columna derecha mida menos que el titular, el `justify-between`
             abre ese aire hasta donde haga falta (27px a 1600) y el 16 no se
             ve nunca. Cuando la pantalla se achica sí se ve, y por eso es
             chico: es lo que absorbe el desfasaje de abajo.

        ⚠️ EL REMATE ES EXACTO DE 1440 PARA ARRIBA, y abajo de eso afloja: 2px
        a 1280, 8px a 1100, 27px a 900. No es un bug que se pueda tapar con un
        número. El titular y el párrafo son `clamp` con `vw` y encogen juntos,
        pero el CTA mide 29px FIJOS —`text-dato` no es fluido— así que cuanto
        más chica la pantalla, más pesa el CTA dentro de la columna. Para que
        cerrara a 900 habría que hacer fluido un token de cuerpo que usa medio
        sitio, y eso es mucho peor que 27px en un ancho donde las dos columnas
        ya miden 400px. Medido en el navegador, no estimado.

        ⚠️ EL PÁRRAFO NO PUEDE CRECER. La columna mide 608px y el `lead`
        entra a ~57 caracteres por renglón, así que el techo son ~165
        caracteres. Medido: la cuenta de renglones no cambia entre 1100 y
        1920px, porque la columna y el cuerpo escalan con el mismo `vw` —
        lo que se escriba acá tiene el mismo alto en todo el rango.

        ⚠️ Lo que se fue del párrafo para llegar a tres renglones: «It
        catches people out the first time, so here it is plainly» —que era
        comentario sobre el texto y no el texto— y «it is the one tab we
        run», que lo dice el ticket 02 de `YardSteps`, 48px más abajo.
        ══════════════════════════════════════════════════════════════════ */}
      {/*
        ══════════════════════════════════════════════════════════════════
        ⚠️ DOS COLUMNAS EXPLÍCITAS, Y APILADO HASTA `lg`. Antes era
        `grid-cols-[repeat(auto-fit,minmax(320px,1fr))]`, y el `auto-fit` era
        el bug: el número de tracks lo decidía el ancho disponible, no el
        diseño. Medido en el navegador, la columna del titular daba 435px a
        1024, 553 a 1280 y 548 de 1440 para arriba —el `auto-fit` llegaba a
        armar TRES tracks y dejar el tercero en 0—. Como `--text-h2` sigue
        creciendo hasta su tope de 88px mientras la columna se achicaba,
        arriba de 1440 «one set of stairs.» dejaba de entrar y el titular se
        partía en TRES renglones: exactamente el remate que la nota de abajo
        dice que hay que sostener.

        Con `grid-cols-2` las dos columnas miden lo mismo y crecen con la
        caja, que es lo que la composición asume.

        ⚠️ Y APILA EN MOBILE Y TABLET, sin pasar por un estado intermedio.
        Pedido de Camila: «que se adapte bien a mobile y tablet, en esos
        casos se apilan y ya». A 768 el `auto-fit` metía dos columnas de
        339px y el titular entraba a cinco renglones contra un párrafo de
        cuatro: dos columnas angostas y ninguna legible. Apilado, el titular
        usa el ancho entero y el párrafo debajo también.
        ══════════════════════════════════════════════════════════════════
      */}
      <StaggerGroup className="caja-ancha grid grid-cols-1 gap-7 lg:grid-cols-2 lg:gap-18">
        <RevealItem>
          {/*
            ⚠️ EL CUERPO SE TOPEA EN 79,2px Y NO EN LOS 88 DE `text-h2`, y el
            número no es arbitrario: es el que la nota de abajo declara como el
            del diseño —«dos renglones de `text-h2` (79,2px cada uno = 158px)»—,
            o sea `6vw` a 1320px, que es donde se compuso.

            `--text-h2` es `clamp(2.5rem, 6vw, 5.5rem)`: abajo de 1320 esto da
            exactamente lo mismo que el token, y arriba deja de crecer. Sin el
            tope, de 1440 para arriba el titular llega a 88px mientras su
            columna se queda en 548 —la `caja-ancha` topea en 1168 y el
            `lg:gap-18` se lleva 72—, «one set of stairs.» pide 597 y el
            titular se parte en TRES renglones. Medido en el navegador a 1440,
            1568 y 1920.

            ⚠️ Es un `clamp` propio y no un token nuevo porque el problema no es
            de la escala sino de ESTA composición: `text-h2` a 88px está bien
            en un titular que usa el ancho entero. Acá vive en media caja.
          */}
          <h2
            id="how-title"
            className="m-0 font-display text-[clamp(2.5rem,6vw,4.95rem)] font-extrabold uppercase leading-[0.9] text-ink"
          >
            Five businesses,
            <br />
            one set of stairs.
          </h2>
        </RevealItem>

        <RevealItem className="flex flex-col justify-between gap-4">
          <p className="m-0 font-body text-lead font-light text-ink">
            Four independent kitchens park in the yard, each one its own business. You order at the
            window and pay that truck. No table service, and the bar upstairs is ours.
          </p>

          {/*
            ⚠️ El subrayado es un BORDE de 2px en `sunset` y no un
            `text-decoration`, y no es lo mismo: el naranja no puede ser el
            color del TEXTO sobre claro —da 2.54:1 y no pasa AA en ningún
            tamaño— pero sí puede ser el de una línea decorativa debajo. Así
            el acento de marca aparece en el link sin que el link dependa de
            él para leerse.

            ⚠️ Y VIVE ACÁ, en la columna del texto, y no debajo del titular.
            Abajo del titular quedaba colgando en una columna que ya había
            terminado, y dejaba el bloque de la derecha sin salida: se leía
            el párrafo y no había adónde ir. Acá cierra el texto que lo pide
            y, de paso, es lo que hace que las dos columnas rematen parejas.
            Sin `mt`: el `justify-between` de la celda pone ese aire, y un
            margen fijo encima pelearía con él.
          */}
          <Link
            href="/the-yard"
            className="group inline-flex w-fit items-center gap-2.5 border-b-2 border-sunset pb-1 font-body text-dato font-medium text-ink transition-colors duration-200 hover:border-ink"
          >
            See how the yard is laid out
            <ArrowRight className="size-3.75 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </RevealItem>
      </StaggerGroup>
    </section>
  );
}

/* ==========================================================================
   Reviews — ESCRITO Y SIN USAR, a propósito
   ========================================================================== */

/**
 * ⚠️ NO SE MONTA. El brief: «No montes módulo de reviews. Los ratings del
 * cliente no están confirmados. Dejá el componente escrito y sin usar.»
 *
 * Queda acá listo para cuando se confirmen. No se importa en ninguna página.
 * El día que se use hay que traer las reviews de una fuente real —Google o
 * Yelp— y nunca escribirlas a mano.
 */
export function ReviewsMarquee({
  reviews,
}: {
  readonly reviews: readonly { quote: string; author: string; source: string }[];
}) {
  if (reviews.length === 0) return null;

  return (
    <Section band="lg" labelledBy="reviews-title" width="full" className="px-0">
      <div className={GUTTER}>
        <div className="caja">
          <SectionHead
            eyebrow="What people say"
            id="reviews-title"
            title="Don't take our word for it"
          />
        </div>
      </div>
      <Marquee durationSeconds={45} className="mt-10" itemClassName="gap-5 pr-5">
        {reviews.map((r, i) => (
          <figure
            key={i}
            className="flex w-85 shrink-0 flex-col rounded-card border border-ink/12 p-6"
          >
            <blockquote className="flex-1 text-base leading-[1.65]">{r.quote}</blockquote>
            <figcaption className="mt-4 eyebrow text-body/75">
              {r.author} · {r.source}
            </figcaption>
          </figure>
        ))}
      </Marquee>
    </Section>
  );
}

/*
 * ⚠️ Acá había un `export { PhotoPending }` — un re-export de conveniencia para
 * que la home pudiera importar el placeholder desde este archivo. Se fue: nadie
 * lo usaba por esta puerta, y un re-export sin consumidores es una dependencia
 * falsa entre dos módulos que no tienen nada que ver. Quien necesite
 * `PhotoPending` lo importa de `shared/PendingData`, que es donde vive.
 */
