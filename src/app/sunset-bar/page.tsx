import type { Metadata } from 'next';
import Image from 'next/image';
import { OLA_SUAVE } from '@/lib/brand-art';
import MenuSheets from '@/components/sections/MenuSheets';
import PlateHero from '@/components/shared/PlateHero';
import Section from '@/components/shared/Section';
import { Heading } from '@/components/shared/Type';
import { GAME_DAY_DEALS, GAME_DAY_NOTE } from '@/content/game-day';
import { getHappyHour } from '@/content/happy-hour';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  route: '/sunset-bar',
  image: {
    url: '/images/venue/wall-cocktails-rooftop.jpg',
    width: 540,
    height: 720,
    alt: 'Drinks on a table on the rooftop at Rooftop at Riverside',
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
   * ══════════════════════════════════════════════════════════════════════════
   * ⚠️ ESTA PÁGINA YA NO LEE LA CARTA DE LA BASE, y estuvo a punto de hacerlo.
   * El 2026-09-17 se armó entera: `getBarMenu()` traía las nueve categorías y
   * los cincuenta ítems con su ficha completa, y `BarMenu` los dibujaba en
   * tarjetas con tabs. Camila lo dio de baja el mismo día: «por el momento el
   * menú del bar no lo tendremos digital como pensé; colocaremos el PDF que
   * está en la web».
   *
   * ⚠️ NO SE BORRÓ NADA DE ESE CAMINO. Siguen en el árbol `BarMenu`,
   * `respaldoComoGrupos()` y `getBarMenu()`, y volver es cambiar `<MenuSheets />`
   * por `<BarMenu grupos={carta} />` y descomentar estas dos líneas:
   *
   *     const deLaBase = await getBarMenu();
   *     const carta = deLaBase ?? respaldoComoGrupos();
   *
   * ⚠️ MIENTRAS TANTO LA CARTA NO SALE DE LA BASE, que es la otra cara de la
   * decisión: ni consulta, ni respaldo que mantener. Se actualiza cuando el
   * cliente manda una imagen nueva.
   *
   * ⚠️ EL HAPPY HOUR SÍ SALE DE LA BASE, desde el 2026-09-17, y es la única
   * lectura que hace esta página. No es una vuelta atrás de lo de arriba: la
   * carta es una lámina que el cliente manda por mail, y el happy hour es un
   * evento que el cliente carga en el dashboard. Pedido de Camila: «donde se
   * nombre happy hour y se exponga su info debe levantar la info de la base».
   * ══════════════════════════════════════════════════════════════════════════
   */
  const happyHour = await getHappyHour();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(breadcrumbJsonLd([{ name: 'Sunset Bar', path: '/sunset-bar' }])),
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

        ══════════════════════════════════════════════════════════════════════
        ⚠️ SE VE LA MITAD DEL DIBUJO, NO EL DIBUJO ENTERO, Y ESO ES LO QUE SACA
        EL PICO DEL MEDIO. El archivo son DOS caminos espejados que se
        encuentran en el centro del `viewBox` (x≈785 de 1570), y en esa junta
        las dos curvas no empalman: forman un vértice. Estirado a lo ancho de
        la pantalla, el vértice se lee como un pico justo en el medio. Camila:
        «cuidado, no quiero que tenga este pico».

        La salida es que la junta no entre en cuadro: con el dibujo al 200 % de
        ancho y pegado a la izquierda, lo que se ve es su mitad izquierda —dos
        lomas limpias— y el vértice queda afuera, a un ancho de pantalla de
        distancia.

        ⚠️ EL ALTO VA ESCRITO Y NO SALE DE LA PROPORCIÓN. Al 200 % de ancho el
        alto natural sería el doble: una franja de 400px. Con `h-*` el dibujo
        se estira sólo en vertical, que es lo que hacen todas las cenefas del
        repo — `WaveBorder` usa `preserveAspectRatio="none"` para lo mismo.

        ⚠️ `rt-wave` ES LA MISMA ANIMACIÓN QUE LA HOME: un vaivén de 11s que
        corre el dibujo un 3,5 % de su propio ancho. Pedido de Camila: «quiero
        que tenga movimiento, animación como en la home». Al 200 % de ancho ese
        corrimiento son 7 % de la pantalla, y como sobra dibujo para los dos
        lados no aparece borde en ningún momento del ciclo. Con
        `prefers-reduced-motion` se apaga sola: el corte global vive en
        `globals.css`.

        ⚠️ VA INLINE Y NO COMO COMPONENTE porque es el primer uso. Si una
        segunda página pide este mismo corte, sube a `shared/` — es la regla
        que ya está escrita en `YardSteps`.
        ══════════════════════════════════════════════════════════════════════
      */}
      <div aria-hidden="true" className="grano-capa relative -mb-px w-full overflow-hidden bg-deep">
        {/*
          ⚠️ EL ESPEJO VA ADENTRO DEL SVG Y NO EN CSS, y no es un capricho: la
          animación `rt-wave` escribe `transform: translateX(...)` sobre este
          mismo elemento, así que un `-scale-y-100` en la clase quedaría pisado
          y la ola se daría vuelta al arrancar el ciclo. Dentro del `<path>` el
          espejo es coordenadas, no CSS, y los dos conviven.

          ⚠️ EL 110 % DE ANCHO CON −5 % DE MARGEN ES LO QUE HACE POSIBLE LA
          ANIMACIÓN: el vaivén corre el dibujo un 3,5 % y el sobrante es lo que
          sigue tapando los dos bordes. Los dos números están atados — es el
          mismo truco que usa `PhotoDivider` en la home, con 114 y −7.
        */}
        <svg
          viewBox={OLA_SUAVE.viewBox}
          preserveAspectRatio="none"
          className="rt-wave -ml-[5%] block h-[104px] w-[110%] text-bone sm:h-[136px] lg:h-[168px]"
        >
          <path
            d={OLA_SUAVE.d}
            fill="currentColor"
            transform={`translate(0 ${OLA_SUAVE.alto}) scale(1 -1)`}
          />
        </svg>
      </div>
      <Section tone="deep" band="md" labelledBy="hh-title">
        <div className="relative text-center">
          {/*
            ══════════════════════════════════════════════════════════════════
            ⚠️ LOS DOS STICKERS LLENAN EL VACÍO DE LOS COSTADOS. Camila marcó
            sobre la página las dos zonas de verde liso a los lados del titular:
            «en esos espacios coloca stickers». La banda es ancha y el contenido
            está todo en una columna centrada, así que sin esto son dos terceras
            partes de superficie plana.

            ⚠️ SON PIEZAS DEL BRAND BOOK Y NO DIBUJOS NUEVOS: el azulejo
            (`seal.svg`) y el emblema redondo (`emblem.svg`). Los dos vienen ya
            troquelados con su filo crema, así que sobre el verde se leen como
            calcomanías pegadas y no como logos flotando.

            ⚠️ EL REDONDO ACÁ SÍ Y EN LA OLA NO, y no es contradicción: lo que
            Camila sacó fue el medallón montado SOBRE la cenefa, que ensuciaba
            el corte entre las dos superficies. Suelto sobre el verde no estorba
            a nada.

            ⚠️ VAN PEGADOS A LOS BORDES DE LA CAJA Y NO FUERA DE ELLA. Con un
            `-left-*` quedarían más cerca del borde de la pantalla —que es donde
            Camila los dibujó— pero a 1344px de ancho el margen es de 88px y se
            saldrían de cuadro. Anclados en `left-0`/`right-0` caen igual en la
            zona vacía y no dependen del ancho de la pantalla.

            ⚠️ DESDE `desk` PARA ARRIBA Y NADA ABAJO. En una pantalla angosta no
            hay vacío que llenar: el titular y la pastilla ocupan el ancho y los
            stickers se les montarían encima.

            ⚠️ `aria-hidden` Y `pointer-events-none`: son decoración pura. No
            dicen nada que el texto no diga y no tienen que aparecer en el árbol
            de accesibilidad ni comerse un clic.
            ══════════════════════════════════════════════════════════════════
          */}
          {/*
            ⚠️ LA ROTACIÓN VA EN EL ENVOLTORIO Y EL FLOTE ADENTRO, y no es un
            capricho: los dos son `transform`. Juntos en un nodo, los keyframes
            de `rt-flotar` le pisan la inclinación al sticker y la pieza se
            endereza al arrancar el ciclo. Es la misma trampa que la ola de más
            arriba, donde el espejo tuvo que mudarse adentro del SVG.

            ⚠️ EL SEGUNDO CORRE 1,4s Y DURA 1,5s MÁS. Sincronizados, los dos
            suben y bajan al mismo tiempo y la banda entera parece latir.
          */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-[-236px] left-0 hidden w-[184px] -rotate-6 desk:block"
          >
            <span className="sticker-oscuro rt-flotar block">
              <Image
                src="/brand/seal.svg"
                alt=""
                width={260}
                height={260}
                className="block h-auto w-full"
              />
            </span>
          </span>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-[-172px] right-0 hidden w-[164px] rotate-6 desk:block"
          >
            <span className="sticker-oscuro rt-flotar-2 block">
              <Image
                src="/brand/emblem.svg"
                alt=""
                width={260}
                height={260}
                className="block h-auto w-full"
              />
            </span>
          </span>

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
            {happyHour.days} · {happyHour.time}
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
              {happyHour.deals.map((d) => (
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
                  <span className="font-body text-d6 text-ink sm:text-d5">{d.what}</span>
                </li>
              ))}
            </ul>

            {/*
              ⚠️ LA NOTA SALE DEL MISMO EVENTO Y ES OPCIONAL. Hoy dice cuál es
              la cerveza destacada, que es un dato que el cliente mandó suelto
              y que no es un precio: no entra en la fila de tres y tampoco se
              puede tirar. Si el evento no la trae, no se dibuja nada.
            */}
            {happyHour.note ? (
              <p className="relative m-0 mt-5 text-center font-body text-base font-light text-ink/75">
                {happyHour.note}
              </p>
            ) : null}
          </div>

          {/*
            ══════════════════════════════════════════════════════════════════
            ⚠️ LAS PROMOS DE FÚTBOL VAN PEGADAS AL HAPPY HOUR Y NO EN UNA
            SECCIÓN PROPIA. El documento del cliente las define como «happy
            hour curado para días de fútbol, que incluye el happy hour regular
            como base»: son la misma barra el mismo día, una encima de la
            otra. Separarlas en dos bandas obligaría a leer dos veces para
            entender que no compiten.

            ⚠️ NO REUSA EL CHROME DE LA TARJETA DE ARRIBA, y es deliberado: la
            regla escrita tres comentarios más arriba dice que una TERCERA
            copia de esa plancha hay que subirla a `shared/` en el mismo
            commit. Este bloque no la necesita, porque no es lo mismo: arriba
            son tres precios pelados y acá cada promo tiene nombre, mecánica y
            precio. Un renglón por promo sobre la banda oscura alcanza.

            ⚠️ SE BORRA ENTERO CUANDO TERMINE LA TEMPORADA, junto con
            `content/game-day.ts`. Por eso es un bloque cerrado y no líneas
            sueltas metidas en la tarjeta de arriba.
            ══════════════════════════════════════════════════════════════════
          */}
          <div className="mt-11 lg:mt-14">
            <Heading level={3} className="text-d4 text-paper lg:text-d3">
              On football Sundays
            </Heading>

            <p className="mt-3.5 max-w-[52ch] font-body text-base font-light text-bone/85">
              {GAME_DAY_NOTE}
            </p>

            <ul className="m-0 mt-7 flex list-none flex-col gap-0 p-0">
              {GAME_DAY_DEALS.map((d) => (
                <li
                  key={d.name}
                  className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-dashed border-bone/25 py-4.5 last:border-b"
                >
                  {/*
                    ⚠️ EL PRECIO PRIMERO Y EN NARANJA. Sobre la banda `deep`
                    el `sunset` es legible de sobra (la ley del color del repo
                    sólo lo prohíbe como tinta sobre claro), y es el dato que
                    alguien busca cuando barre la lista con la vista.
                  */}
                  <span className="min-w-[3.5ch] font-display text-d4 leading-none tabular-nums text-sunset">
                    {d.price}
                  </span>
                  <span className="font-display text-d5 uppercase tracking-eyebrow text-paper">
                    {d.name}
                  </span>
                  <span className="basis-full font-body text-base font-light text-bone/85 sm:basis-auto sm:flex-1">
                    {d.how}
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
      <MenuSheets />

      {/*
        ══════════════════════════════════════════════════════════════════════
        ⚠️ ACÁ HABÍA UN BLOQUE DE CIERRE Y SE FUE ENTERO el 2026-09-17. Camila
        lo tachó sobre la captura: «elimina esta aclaración y CTAs haciendo que
        luego del menú esté el footer». Tenía tres cosas y ninguna se pierde de
        verdad:

          · La línea legal —impuestos incluidos y 22 % de propina en cuentas sin
            firmar— que ESTÁ IMPRESA EN LA PROPIA LÁMINA, al pie de la página 1.
            La teníamos duplicada en HTML al lado de la imagen que ya la dice.
          · «Food comes from the trucks in the yard…», que explica que la comida
            se paga aparte. Lo mismo lo dice el bloque «How this works» de
            `/food-trucks`, que es donde esa confusión corresponde.
          · Dos CTA a `/food-trucks` y `/whats-on`, que son los dos destinos que
            el header ya tiene arriba, fijos, en toda la página.

        ⚠️ Y ADEMÁS ARREGLA EL COLOR DE LAS ESQUINAS DEL FOOTER, que era el otro
        pedido del mismo mensaje. El footer monta con `banda-arco`: la regla
        `:has(+ .banda-arco)` de `globals.css` le pone al hermano anterior un
        borde inferior transparente del alto del radio, y lo que se ve en esas
        dos esquinas es el FONDO DE ESE HERMANO. Con este bloque en el medio era
        blanco; sin él, el hermano anterior pasa a ser el panel del menú, que es
        `bg-bone grano`. O sea que las esquinas quedan en hueso y con grano sin
        escribir una clase nueva.
        ══════════════════════════════════════════════════════════════════════
      */}
    </>
  );
}

