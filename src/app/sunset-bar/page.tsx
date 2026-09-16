import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/shared/Button";
import PlateHero from "@/components/shared/PlateHero";
import Section from "@/components/shared/Section";
import { Heading, SectionHead } from "@/components/shared/Type";
import {
  CARTAS_FALLBACK,
  MENU_LEGAL,
  cartasFromGroups,
  formatPrice,
  type MenuItem,
  type MenuSection,
} from "@/content/bar-menu";
import { getMenu } from "@/lib/restoexp";
import { HAPPY_HOUR } from "@/content/happy-hour";
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  route: "/sunset-bar",
  image: {
    url: "/images/venue/wall-cocktails-rooftop.jpg",
    width: 540,
    height: 720,
    alt: "Drinks on a table on the rooftop at Rooftop at Riverside",
  },
});

/**
 * /sunset-bar
 *
 * El único menú del sitio con ítems y precios, porque es lo único que cobra el
 * venue. Va en HTML con jerarquía de headings y texto seleccionable.
 * Prohibido publicarlo como imagen o como PDF — que es exactamente lo que hace
 * hoy `/drink`, con dos JPG dentro de un slider.
 *
 * ⚠️ Es una de las dos únicas páginas donde el brief permite la superficie
 * oscura `deep`. Se usa en la banda de happy hour, no en toda la página: el
 * sitio sigue siendo blanco.
 */
export default async function SunsetBarPage() {
  /*
   * ⚠️ LA CARTA SALE DE LA BASE. El menú «Sunset Bar» está cargado entero en
   * el dashboard de RestoExp: nueve categorías, 50 ítems con precio y
   * descripción. Descubierto el 2026-09-15; hasta entonces estaba transcrito
   * a mano en `content/bar-menu.ts` porque el sitio viejo lo publica como dos
   * JPG y nadie había mirado la base.
   *
   * ⚠️ `CARTAS_FALLBACK` es el respaldo. Si la base no contesta se sirve la
   * transcripción: una carta desactualizada es mala, una carta vacía es peor.
   */
  const grupos = await getMenu();
  const cartas = grupos ? cartasFromGroups(grupos) : CARTAS_FALLBACK;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            breadcrumbJsonLd([{ name: "Sunset Bar", path: "/sunset-bar" }]),
          ),
        }}
      />

      {/*
        ⚠️ ESTA PÁGINA ABRE CON `PlateHero` Y NO CON `PageHero`, que es el hero
        de las otras internas. Pedido de Camila, 2026-09-16, señalando una
        página de `defoodtruckclub.nl`: «copiemos este hero para Sunset Bar».
        El mecanismo y qué se copió de la referencia están en el componente.

        ⚠️ EL H1 NO CAMBIA: sigue siendo «Bonita's only rooftop», que es lo que
        dice `PAGE_SEO` y lo que compara `npm run check:seo`. Lo único que se
        agrega es DÓNDE CORTA el renglón, porque el solapamiento de la placa
        está calculado para dos. El `span` va con `block` y no hay un `<br>`
        justamente para que el `textContent` conserve el espacio y el guard
        siga viendo la misma frase.

        ⚠️ LA FOTO YA NO ES UN HUECO, y no porque haya llegado material nuevo:
        estaba en la entrega y nadie la había recortado en apaisado. Camila:
        «pongamos la imagen de los tragos, estoy muy segura que tenemos foto de
        tragos o del bar». La tenía: `_RCZ4830` son cuatro tragos en la mesa
        del rooftop a contraluz, y ya se servía —recortada en vertical— en el
        muro de la home. Acá va la misma toma en 17:9.

        ⚠️ SE ELIGIÓ ENTRE CUATRO Y SOBRE LA PÁGINA, no sobre miniaturas: las
        cuatro fotos de barra que tiene la entrega se montaron en este mismo
        hero, en una ruta de muestras que ya se borró. Ganó ésta y con el
        recorte corrido para arriba —«que se vea menos la base de los vasos y
        más la deco de estos»—. El número y las dos franjas medidas están en
        la entrada de `scripts/build-media.mjs`.

        ⚠️ SE FUERON LAS MIGAS Y LA BAJADA, tachadas por Camila sobre la
        captura. El JSON-LD de breadcrumb NO se fue: sigue arriba, en el
        `<script>` de la página, que es lo que lee Google. Lo que se sacó es la
        fila de texto, que en un hero centrado entraba por la izquierda y
        rompía el eje.

        ══════════════════════════════════════════════════════════════════════
        ⚠️ «ROOFTOP» VA EN COLOR, Y ESO NO ES DE ESTA PÁGINA: ES LEY DEL SITIO.
        Camila, 2026-09-16: «recuerda siempre al menos una palabra en los heros
        destacar con color». O sea que ningún hero lleva el titular entero en
        tinta oscura, acá ni en las otras.

        ⚠️ ES `sunset-deep` Y NO `sunset`. El acento de la home —«TOGETHER»—
        va en `sunset` sobre `bone` y es la única excepción viva a la ley del
        color del repo (2.35:1, decisión de Camila tomada sobre la página). No
        se replica: `sunset-deep` es el mismo naranja diez puntos más oscuro,
        existe justamente para ser tinta sobre claro
        (`BRAND.headlineAccent.onLight`) y da 3.28:1 sobre `bone` (3.54 sobre blanco), que pasa para texto
        grande. A 112px lo es de sobra.

        ⚠️ Y LA PALABRA ES «ROOFTOP» Y NO OTRA: es la que la página vende y la
        que alguien busca. Además ya estaba sola en su renglón, así que el
        color no obliga a ningún corte nuevo.
        ══════════════════════════════════════════════════════════════════════
      */}
      <PlateHero
        question="Looking for a rooftop bar in Bonita Springs?"
        title={
          <>
            {"Bonita's only "}
            <span className="block text-sunset-deep">rooftop</span>
          </>
        }
        photo="/images/venue/bar-cocktails-wide.jpg"
        photoAlt="Four cocktails on a table on the rooftop at golden hour, with the bar and the umbrellas behind"
      />

      {/* ── Happy hour ───────────────────────────────────────────────────
          ══════════════════════════════════════════════════════════════════
          ⚠️ ESTA SECCIÓN SE REHÍZO TRES VECES EN EL MISMO DÍA, y la versión
          que quedó es la tercera. Vale dejar las tres escritas porque cada
          una se cayó por un motivo distinto.

            1. Una fila sobre verde: el titular a la izquierda y los tres
               precios como tres frases sueltas a la derecha, todas del mismo
               cuerpo y el mismo color.
            2. Dos columnas sobre verde, con los precios en lista y el número
               en display. Camila: «démosle otro diseño a los tres precios,
               el número en grande y color y al lado el nombre más chico».
            3. Centrada y sobre el fondo claro de la página, sin olas y sin
               banda oscura: «me imagino algo así, el happy hour bien grande y
               el día y horario en una pastilla llamativa, los nombres de cada
               ítem más grandes y centrados».
            4. Ésta. Lo centrado, el titular grande y la pastilla se quedan de
               la 3; vuelve la ola y vuelve el verde, y los precios se mudan
               adentro de una tarjeta: «debajo del hero esté la ola como en la
               home pero sin el sticker redondo con hoja de palmera; luego de
               las olas, fondo verde oscuro con el título y la info de los días
               y horarios, y debajo los tres precios en una card como las de
               How this works; los 3 precios con su nombre en horizontal».

          ⚠️ O SEA QUE LA BANDA OSCURA VOLVIÓ, y la página vuelve a tener su
          única superficie `deep` —la que el brief le permite— acá.

          ⚠️ «HAPPY HOUR» PASÓ DE RÓTULO A TITULAR. Era un `Eyebrow` —micro en
          caja alta arriba del h2— y el h2 lo ocupaban los días. Ahora el h2 es
          la frase que la gente busca y los días bajan a la pastilla, que es
          donde se leen de un golpe.
          ══════════════════════════════════════════════════════════════════ */}
      {/*
        ══════════════════════════════════════════════════════════════════════
        ⚠️ LA OLA ES `wave-only.svg`, LA DE LA HOME, Y NO LA CENEFA DE RULOS.
        En el repo hay TRES olas distintas y es fácil agarrar la que no es:

          · `WaveBorder`   la cenefa de rulos chiquitos, uno al lado del otro.
                           Es la que estuvo acá hasta recién y la que Camila
                           descartó: «me refería a estas olas», señalando la
                           otra.
          · `HorizonBorder` los dos paths grandes del brand book, con el
                           medallón de sol y palmera encima. El medallón es
                           justamente el «sticker redondo» que pidió sacar.
          · `wave-only.svg` ésta: UNA sola ondulación suave, en `bone`. Es la
                           que usa `PhotoDivider` en la home, y ahí el emblema
                           va aparte, en su propio div. O sea que el archivo ya
                           viene sin sticker: no hay nada que quitarle.

        ⚠️ VA DADA VUELTA. En la home la ola cierra la banda oscura por ABAJO
        —oscuro arriba, claro abajo— y acá hace lo contrario: el hero es hueso
        y lo que emerge es el verde. `-scale-y-100` la espeja; sin eso la
        curva sale al revés y el corte se lee como un error de recorte.

        ⚠️ EL FONDO DEL ENVOLTORIO ES `deep` Y EL DIBUJO ES `bone`, los dos
        fijos: el SVG trae el color adentro (#FAF6EA), así que este bloque sólo
        funciona entre un hueso arriba y un verde abajo. Si alguna de las dos
        superficies cambia, esto se rompe en silencio.

        ⚠️ `grano-capa` Y NO `grano`: la ola es un `<img>`, así que el grano no
        puede ir de fondo. Es la misma nota que tiene `PhotoDivider`.

        ⚠️ VA INLINE Y NO COMO COMPONENTE porque es el primer uso. Si una
        segunda página pide este mismo corte, sube a `shared/` — es la regla
        que ya está escrita en `YardSteps`.
        ══════════════════════════════════════════════════════════════════════
      */}
      <div
        aria-hidden="true"
        className="grano-capa relative -mb-px w-full overflow-hidden bg-deep"
      >
        <Image
          src="/brand/wave-only.svg"
          alt=""
          width={1570}
          height={169}
          className="block w-full -scale-y-100"
        />
      </div>
      <Section tone="deep" band="md" labelledBy="hh-title">
        <div className="text-center">
          <Heading level={2} id="hh-title" className="text-banda text-paper">
            Happy hour
          </Heading>

          {/*
            ⚠️ LA PASTILLA ES `cream`. Sobre el verde el candidato obvio sería
            `sunset`, pero en este sitio la píldora naranja ES el botón —el CTA
            del header, el de los heroes—, así que una pastilla naranja que no
            se toca promete algo que no cumple. El crema es el tratamiento que
            el repo ya usa para el DATO destacado (la píldora del horario en
            las cards de eventos). `deep` sobre `cream` da 9.44:1.
          */}
          <p className="mt-5 inline-block rounded-pill bg-cream px-6 py-2.5 font-display text-d5 uppercase tracking-eyebrow text-deep lg:px-7 lg:py-3">
            {HAPPY_HOUR.days} · {HAPPY_HOUR.time}
          </p>

          {/*
            ══════════════════════════════════════════════════════════════════
            ⚠️ ESTA TARJETA ES LA DE `CompareSlab`, LA DE «HOW THIS WORKS» DE
            `/food-trucks`. Pedido textual: «una card como las usadas en How
            this works en la página de food truck, exactamente ese componente
            de card». Lo que la define son tres cosas y están las tres: plancha
            `bone` con `grano` sobre la banda oscura, `rounded-frame`, y el
            filete PUNTEADO interior en `teal600` a 3.5 de inset con
            `rounded-shell`.

            ⚠️ LO ÚNICO QUE NO SE COPIA ES EL STICKER del borde de arriba. Allá
            son dos tarjetas que se comparan y el sticker dice de cuál es cada
            una —el isotipo del truck contra «A regular restaurant»—; acá hay
            una sola y no hay nada que distinguir. Por eso también baja el `pt`:
            los 56/64px de allá son el aire que el sticker necesita para no
            pisar el primer renglón.

            ⚠️ ES LA SEGUNDA COPIA DE ESTE CHROME Y NO SE ABSTRAE TODAVÍA, que
            es la regla que ya está escrita en `YardSteps` y en
            `NewsletterSignup`: dos copias que comparten forma pero viven en
            contextos distintos no justifican un componente. SI APARECE UNA
            TERCERA, sube a `shared/` en el mismo commit.
            ══════════════════════════════════════════════════════════════════
          */}
          <div className="relative mt-9 rounded-frame bg-bone grano px-6 py-9 sm:px-10 lg:mt-11">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-3.5 rounded-shell border border-dashed border-teal600/55"
            />

            {/*
              ⚠️ LOS TRES VAN EN FILA Y ANTES IBAN APILADOS. Camila: «los 3
              precios con su nombre pasarán a estar en horizontal no vertical».
              El filete punteado que los separa gira con ellos: era `divide-y`
              y ahora es `divide-x`, o sea dos filetes verticales entre tres
              columnas.

              ⚠️ EN MOBILE VUELVEN A APILARSE, y el filete vuelve a ser
              horizontal. Tres precios en fila a 390px dejan «House drinks» en
              tres renglones de cuatro letras. `sm:` es el corte.
            */}
            <ul className="relative m-0 flex list-none flex-col divide-y divide-dashed divide-ink/20 p-0 sm:flex-row sm:divide-x sm:divide-y-0">
              {HAPPY_HOUR.deals.map((d) => (
                <li
                  key={d.price}
                  className="flex flex-1 items-baseline justify-center gap-3 py-4 sm:px-4 sm:py-2"
                >
                  {/*
                    ⚠️ EL NÚMERO VA EN `sunset-deep` Y NO EN `sunset`. La
                    tarjeta es clara, y el naranja de marca como tinta sobre
                    claro es lo único que la ley del color del repo prohíbe sin
                    excepción: 2.35:1 sobre `bone`. `sunset-deep` es el mismo
                    tono diez puntos más oscuro, existe para esto
                    (`BRAND.headlineAccent.onLight`) y da 3.28:1 sobre `bone`, que pasa para
                    texto grande. A 58px lo es de sobra.
                  */}
                  <span className="font-display text-d2 leading-none tabular-nums text-sunset-deep">
                    {d.price}
                  </span>
                  <span className="font-body text-d6 text-ink sm:text-d5">
                    {d.what}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ── Cócteles ───────────────────────────────────────────────────── */}
      {/*
        ══════════════════════════════════════════════════════════════════
        LAS CARTAS. Bloque I del kit: nombre en display, descripción en
        cuerpo, precio a la derecha y filete punteado en el medio.

        ⚠️ ALTERNAN `paper` Y `cream`, y ninguna es `deep`. La única
        superficie oscura de la página es la banda de happy hour de arriba:
        cuatro listas de precios sobre verde serían la mitad de la página en
        oscuro, y la regla es 70–75 % claro.

        ⚠️ EL NÚMERO DE CARTAS NO ESTÁ ESCRITO ACÁ. Si el cliente agrega una
        categoría en el dashboard, aparece una columna más. Si desactiva
        todos los ítems de una, la carta no se renderiza vacía.
        ══════════════════════════════════════════════════════════════════
      */}
      {cartas.map((carta, n) => (
        <Section
          key={carta.id}
          tone={n % 2 === 0 ? "paper" : "cream"}
          band="lg"
          labelledBy={`carta-${carta.id}`}
        >
          <SectionHead
            eyebrow={carta.eyebrow}
            eyebrowTone={n % 2 === 0 ? "deep" : "plum"}
            id={`carta-${carta.id}`}
            title={carta.title}
            {...(carta.lead ? { lead: carta.lead } : {})}
          />

          {carta.columnas.length === 1 ? (
            <div className="mt-[36px] max-w-[760px]">
              {carta.columnas[0].items.map((item) => (
                <MenuRow key={item.name} item={item} detailed />
              ))}
            </div>
          ) : (
            <div className="mt-[36px] grid gap-[40px] md:grid-cols-2 lg:gap-[56px]">
              {carta.columnas.map((col) => (
                <MenuColumn key={col.id} section={col} />
              ))}
            </div>
          )}
        </Section>
      ))}

      {/* ── Pie legal + cierre ─────────────────────────────────────────── */}
      <Section band="md">
        <div className="flex flex-col gap-[24px] border-t border-ink/15 pt-[28px] lg:flex-row lg:items-start lg:justify-between">
          <p className="max-w-[52ch] text-[15px] leading-[1.6] text-body/75">
            {MENU_LEGAL}
          </p>
          <div className="flex flex-col gap-[12px] sm:flex-row">
            <ButtonLink href="/food-trucks" variant="secondary">
              See the food trucks
            </ButtonLink>
            <ButtonLink href="/whats-on" variant="primary">
              What&rsquo;s on tonight
            </ButtonLink>
          </div>
        </div>
        {/*
          ⚠️ ACÁ DECÍA «we don't have a kitchen» y se sacó el 2026-09-15: el
          PDF «Events Packages» del propio cliente ofrece «specialty menus
          provided by in house catering». Lo que sí está verificado es que los
          trucks cobran aparte, que es el dato que la gente necesita.
          TODO: confirmar con cliente qué es el catering in house.
        */}
        <p className="mt-[20px] max-w-[60ch] text-[15px] leading-[1.6] text-body/75">
          Food comes from the trucks in the yard, and each one takes its own
          orders and its own payment. This list is the one tab that is ours.
        </p>
      </Section>
    </>
  );
}

/**
 * Una fila de carta: nombre, filete de puntos y precio.
 *
 * ⚠️ El precio va dentro de un `<dd>`… no: va en un `<div>` con el nombre en
 * negrita, y no en una tabla, porque una carta es una LISTA de productos, no
 * datos tabulares. El precio se asocia por proximidad y por el orden del DOM.
 * El `aria-label` del contenedor no hace falta: el lector lee «Bomb Pop, 10
 * dollars, tequila, blue curaçao…», que es el orden correcto.
 */
function MenuRow({
  item,
  detailed = false,
}: {
  readonly item: MenuItem;
  readonly detailed?: boolean;
}) {
  const { whole, cents } = formatPrice(item.price);
  return (
    <div className="flex flex-col border-b border-ink/10 py-[16px] last:border-b-0">
      <div className="flex items-baseline gap-[10px]">
        <h3 className="font-display text-d6 uppercase lg:text-d5">
          {item.name}
        </h3>
        {item.house ? (
          <span className="rounded-btn bg-magenta px-[6px] py-[2px] text-[11px] font-bold uppercase tracking-[0.1em] text-paper">
            House
          </span>
        ) : null}
        {/* El filete de puntos ata visualmente el nombre con el precio.
            `aria-hidden` porque no es contenido. */}
        <span
          aria-hidden="true"
          className="mb-[4px] flex-1 border-b border-dotted border-ink/25"
        />
        <p className="shrink-0 font-display text-d6 tabular-nums lg:text-d5">
          <span className="sr-only">Price: </span>
          <span aria-hidden="true">$</span>
          {whole}
          {cents ? <sup className="text-[0.6em]">{cents}</sup> : null}
          <span className="sr-only"> dollars</span>
        </p>
      </div>
      {detailed && item.description ? (
        <p className="mt-[4px] max-w-[52ch] text-[16px] leading-[1.55] text-body/75">
          {item.description}
        </p>
      ) : null}
      {/* ⚠️ La cursiva se fue de la nota de abajo. El brand no la usa en
          ninguna parte y ésta era la única ocurrencia del sitio. La nota se
          distingue del cuerpo por tamaño (15px contra 16) y por color
          (`muted` contra `ink`), que es el mismo mecanismo que usa el resto
          del sistema. */}
      {detailed && item.note ? (
        <p className="mt-[2px] max-w-[52ch] text-[15px] leading-[1.5] text-muted">
          {item.note}
        </p>
      ) : null}
      {!detailed && item.description ? (
        <p className="mt-[2px] text-[13px] leading-[1.45] text-body/75">
          {item.description}
        </p>
      ) : null}
    </div>
  );
}

function MenuColumn({ section }: { readonly section: MenuSection }) {
  return (
    <div>
      <Heading level={3} role="label">
        {section.title}
      </Heading>
      <span
        aria-hidden="true"
        className="mt-[8px] block h-[2px] w-[28px] bg-river"
      />
      <div className="mt-[12px]">
        {section.items.map((item) => (
          <MenuRow key={item.name} item={item} />
        ))}
      </div>
    </div>
  );
}
