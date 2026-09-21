import type { Metadata } from 'next';
import Image from 'next/image';
import SoftWave from '@/components/shared/SoftWave';
import MenuSheets from '@/components/sections/MenuSheets';
import FeaturedEventCard, { dealsNombrados } from '@/components/shared/FeaturedEventCard';
import PlateHero from '@/components/shared/PlateHero';
import Section from '@/components/shared/Section';
import { Heading } from '@/components/shared/Type';
import { getVenueEvents } from '@/content/events';
import { GAME_DAY_DEALS, GAME_DAY_LABEL, GAME_DAY_NOTE } from '@/content/game-day';
import { cartaDelBar } from '@/content/menus';
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

  /*
   * ══════════════════════════════════════════════════════════════════════════
   * ⚠️ LA CARTA SALE DE LA BASE DESDE EL 2026-09-21, y son las dos láminas JPG
   * del sitio viejo las que pasan a ser el respaldo. Camila: «tomá el PDF de ese
   * menú para la página correspondiente, actualizalo para que el menú se tome de
   * ahí y no sean las imágenes subidas desde el repo».
   *
   * ⚠️ EL RESPALDO NO ES DECORATIVO: si la base no contesta o si alguien borra
   * esa carta del dashboard, la página sigue publicando la carta que tenemos en
   * `public/menus/` en vez de quedarse sin menú, que es lo único que esta
   * página no puede hacer.
   *
   * ⚠️ CUÁL DE LAS CINCO CARTAS ES LA DEL BAR lo decide `content/menus.ts` por
   * el nombre, que es lo mismo que la deja FUERA de las tarjetas de
   * `/food-trucks`. Las dos reglas son la misma línea.
   * ══════════════════════════════════════════════════════════════════════════
   */
  const carta = await cartaDelBar();

  /*
   * ══════════════════════════════════════════════════════════════════════════
   * ESTA BANDA PUBLICA PROMOCIONES DE LA BARRA, NO LA CARTELERA DEL BAR. Es la
   * regla de Camila, 2026-09-18: «necesito que aparezcan en esta página sólo los
   * eventos de promoción, o sea los de live music no, el de happy y el de NFC,
   * los dos de DJ y Ross no».
   *
   * ⚠️ SON DOS FILTROS Y LOS DOS HACEN FALTA:
   *
   *   · `space === 'Sunset Bar'` — que pase acá arriba. Sin esto entraría
   *     cualquier promo del yard o del venue entero.
   *   · que el evento PUBLIQUE PRECIOS — que sea una promo y no un show. Es lo
   *     que deja afuera a Ross Brown y a La Noche, que son música en vivo: son
   *     del bar, pero no son una oferta de barra.
   *
   * ⚠️ «ES PROMO» SE DECIDE POR EL CONTENIDO DEL EVENTO, NO POR UN TAG, y eso es
   * a propósito. La versión del 2026-09-17 colgaba este bloque del tag
   * `featured` y Camila la frenó: «por eso no estaba de acuerdo con usar tags,
   * puede traer problemas si el cliente no conoce la lógica detrás». `featured`
   * no significa nada de su negocio, significa algo de NUESTRO layout, así que
   * sacándolo de un evento se le vaciaba media página sin ningún aviso.
   *
   * ⚠️ ES EL MISMO CRITERIO QUE YA USA `content/happy-hour.ts`, que identifica
   * al happy hour por su TÍTULO y no por el tag `happy-hour` —que hasta el
   * 2026-09-21 llevaba Wooftop Wednesdays, hoy Wooftop Fest y ya sin ese tag—.
   * El dato manda sobre la etiqueta. Acá el dato es que el texto del evento
   * nombra los precios de la temporada.
   *
   * ⚠️ EL HAPPY HOUR NO ENTRA EN ESTA LISTA Y NO ES UN OLVIDO: ya es la tarjeta
   * clara de arriba de esta misma banda, la que sale de `getHappyHour()`. Los
   * dos de la regla de Camila están, uno arriba del otro.
   *
   * ⚠️ AL CERRAR LA TEMPORADA ESTO SE APAGA SOLO. Se borra `content/game-day.ts`
   * con sus promos, ningún evento del bar publica precios y la lista queda
   * vacía: debajo del happy hour no se dibuja nada y no hay que acordarse de
   * sacar ningún bloque.
   * ══════════════════════════════════════════════════════════════════════════
   */
  const promosDelBar = (await getVenueEvents()).filter(
    (e) => e.space === 'Sunset Bar' && dealsNombrados(e, GAME_DAY_DEALS).length > 0,
  );

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

        ⚠️ YA NO VA INLINE: ES `shared/SoftWave`. Nació escrita a mano acá con
        la nota de que si una segunda página pedía el mismo corte subía a
        `shared/`, y el 2026-09-21 la pidió `/food-trucks` —«que las olas sean
        como la de sunset bar, no estas»—. Las trampas del dibujo (el pico del
        medio que hay que dejar fuera de cuadro, el espejo dentro del path, el
        110 % de ancho que hace posible la animación) están todas anotadas
        adentro del componente.

        ⚠️ ACÁ EL CORTE ES `bone` → `deep`: arriba el hueso del hero, abajo el
        verde que emerge. El SVG ya no trae el color adentro, los dos salen de
        las props.
        ══════════════════════════════════════════════════════════════════════
      */}
      <SoftWave from="bone" to="deep" className="relative -mb-px" />
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
          {/*
            ══════════════════════════════════════════════════════════════════
            ⚠️ EN MOBILE SE PARTE EN DOS RENGLONES A PROPÓSITO: los días
            arriba, el horario abajo. Pedido de Camila, 2026-09-17: «separa en
            dos líneas por un lado días y por otro horas, pero que sea a
            propósito para controlar que en mobile no quede cortado como
            ahora».

            ⚠️ EL PUNTO ESTÁ EN QUE EL CORTE SEA NUESTRO Y NO DEL WRAP. El
            texto es «Saturday – Sunday · 12 PM – 6 PM»: 34 caracteres en caja
            alta con `tracking-eyebrow` que no entran a 390px, así que la
            pastilla se envolvía sola y el corte caía donde tocara — a veces
            partiendo el rango de horas, que es el dato que alguien viene a
            leer. Con los dos `block` el renglón se corta donde tiene sentido
            y el rango nunca se parte.

            ⚠️ EL `·` SE VA EN MOBILE Y VUELVE EN `sm`. Un separador al final
            de un renglón cuelga sin nada que separar. Va en un `<span>` con
            `aria-hidden` porque es puntuación decorativa: para un lector de
            pantalla los dos datos ya son frases distintas.

            ⚠️ SIGUE SIENDO `rounded-pill` CON DOS RENGLONES. Una píldora de
            dos líneas no se deforma porque el radio es la mitad del alto: con
            `py-2.5` y dos renglones el borde es un semicírculo más alto, que
            es lo mismo que hace la píldora del horario en las cards de
            eventos cuando el texto es largo.
            ══════════════════════════════════════════════════════════════════
          */}
          <p className="mt-5 inline-block rounded-pill bg-cream px-6 py-2.5 text-center font-display text-d5 uppercase tracking-eyebrow text-deep lg:px-7 lg:py-3">
            <span className="block sm:inline">{happyHour.days}</span>
            <span aria-hidden="true" className="hidden sm:inline">
              {' '}
              ·{' '}
            </span>
            <span className="block sm:inline">{happyHour.time}</span>
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
                  /*
                    ══════════════════════════════════════════════════════════
                    ⚠️ EL PRECIO VA ARRIBA DEL TEXTO HASTA `lg`, Y AL LADO
                    RECIÉN EN DESKTOP. Camila, 2026-09-17, sobre la captura de
                    una tablet: «fíjate cómo se está viendo la card con los
                    ítems de promo, desastre, alinea los elementos para que se
                    vea bien, en mobile centrados».

                    ⚠️ QUÉ SE ROMPÍA Y POR QUÉ. Las tres columnas arrancaban en
                    `sm:`, o sea desde 640px, con el precio y el texto EN FILA.
                    A 820px cada columna queda en ~200px y ahí adentro «$1 off»
                    al lado de «Drafts, bottles and cans» no entra: el precio
                    se parte en dos renglones y el texto en tres, con la
                    baseline alineando la primera línea de cada uno. Se leía
                    «$1 / off | Drafts, / bottles / and cans», que es el
                    desastre de la captura.

                    ⚠️ APILADO ENTRA SIEMPRE porque cada pieza usa el ancho
                    completo de su columna: el precio en un renglón y el texto
                    en dos como mucho. Y de paso es la forma que ya pedía
                    mobile —«en mobile centrados»—, así que es la misma regla
                    en los dos tamaños en vez de dos arreglos distintos.

                    ⚠️ EN `lg` VUELVE A LA FILA, que es como se aprobó en
                    desktop: ahí la columna mide ~380px y el precio de 58px
                    junto al texto lee como una etiqueta de barra.

                    ⚠️ Y EN ESA FILA EL TEXTO VA CENTRADO CONTRA EL PRECIO, que
                    hasta el 2026-09-21 era `items-baseline`. Camila: «centra
                    los textos para que no quede desfasado». Con la baseline,
                    «Drafts, bottles and cans» apoyaba su PRIMER renglón en la
                    base del «$1 off» y el segundo colgaba por debajo del
                    número: el texto de esa columna arrancaba más abajo que el
                    de las otras dos, que son de un renglón. Con `items-center`
                    el texto se centra contra el precio mida uno o dos
                    renglones, y los tres pares leen a la misma altura.
                    ══════════════════════════════════════════════════════════
                  */
                  /*
                    ⚠️ `justify-start` MIENTRAS ESTÁ APILADO, y es lo que hace
                    que los tres precios queden A LA MISMA ALTURA. Con
                    `justify-center` cada columna centraba su propio contenido
                    en el eje vertical, así que «Margaritas» —que ocupa un
                    renglón contra los dos de las otras dos— empujaba su «$10»
                    unos píxeles más abajo que el «$1 off» y el «$8» de al
                    lado. Tres números grandes desalineados entre sí es
                    exactamente lo que se veía mal.

                    En `lg` vuelve a `center`, pero ahí el eje es el
                    HORIZONTAL —la fila— y lo que centra es el par precio más
                    texto dentro de su columna, que es otra cosa.
                  */
                  /*
                    ══════════════════════════════════════════════════════════
                    ⚠️ LA FILA ARRANCA EN `desk` (1344) Y ARRANCABA EN `lg`
                    (1024), Y ES POR EL ANCHO QUE PIDE EL TEXTO MÁS LARGO.
                    Camila, 2026-09-21, sobre «$1 off · Drafts, bottles and
                    cans»: «sigo viendo mal esto».

                    La cuenta: en fila, los tres pares miden ~1.030px sumados
                    —«$1 off» y sus 24 caracteres son el más ancho—. A 1024 de
                    pantalla la tarjeta deja 862 útiles, así que la primera
                    columna no entra y el texto se parte en dos renglones
                    mientras los otros dos quedan en uno: tres columnas que no
                    se parecen, que es lo que se veía mal. A 1344 sobran 120px.

                    ⚠️ Y LAS COLUMNAS DEJAN DE SER IGUALES: `flex-auto` en vez
                    de `flex-1`. Con tres columnas exactamente iguales, la más
                    angosta —«$10 Margaritas»— desperdicia el ancho que a la
                    primera le falta. Repartido por contenido, ninguna parte su
                    texto y los dos filetes punteados caen donde el contenido
                    cambia, que es lo que un separador tiene que marcar.

                    ⚠️ DEBAJO DE 1344 SIGUE APILADO, que es la forma que Camila
                    ya aprobó para mobile —«en mobile centrados»— y la que
                    entra siempre: el precio en un renglón y el texto en dos
                    como mucho, cada uno con el ancho entero de su columna.
                    ══════════════════════════════════════════════════════════
                  */
                  className="flex flex-1 flex-col items-center justify-start gap-1 py-4 text-center sm:px-4 desk:flex-auto desk:flex-row desk:items-baseline desk:justify-center desk:gap-3 desk:py-2 desk:text-left"
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
                  {/*
                    ⚠️ `whitespace-nowrap` PORQUE EL PRECIO NO SIEMPRE ES UN
                    NÚMERO SOLO. «$1 off» son dos palabras, y en la fila de
                    desktop se partía en «$1 / off»: dos renglones de 58px que
                    empujaban su columna más alta que las otras dos y dejaban
                    la fila con los tres precios a distinta altura.

                    El caso aparece sólo en la primera oferta y sólo en `lg`,
                    que es donde el precio comparte renglón con el texto y le
                    queda poco ancho. Es el mismo dato que en mobile entra
                    holgado, así que no es un problema de contenido: el precio
                    es una unidad y se rompía porque nadie se lo había dicho.
                  */}
                  <span className="font-display text-d2 leading-none whitespace-nowrap tabular-nums text-sunset-deep">
                    {d.price}
                  </span>
                  {/*
                    ⚠️ SUBE A `d5` EN `lg` Y NO EN `sm`, y viaja con el cambio
                    de forma de arriba: mientras el texto va APILADO debajo del
                    precio tiene el ancho entero de la columna y `d6` le da dos
                    renglones cómodos. En `sm:` el cuerpo grande era parte de
                    lo que no entraba.
                  */}
                  <span className="font-body text-d6 text-ink desk:text-d5">{d.what}</span>
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

            ⚠️ SON LA MISMA CARD QUE ABRE `/whats-on`, y hasta el 2026-09-17
            fueron un título propio con una lista de renglones. Camila: «esto
            así tal cual pongámoslo debajo de happy hour en sunset bar, porque
            ahora estamos nombrando el evento pero re diferente el diseño». Era
            exacto: el mismo domingo se publicaba en dos páginas con dos formas
            que no se parecían en nada, y la de acá ni siquiera nombraba al
            evento —decía «On football Sundays» y el evento se llama NFC North
            HQ—. Ahora las dos dibujan `FeaturedEventCard`.

            ⚠️ Y NO ES SÓLO ESTÉTICA: la card trae el día, el horario y el texto
            que el cliente escribió en el dashboard, que acá no estaban. El
            bloque viejo publicaba tres precios sin decir a qué noche
            pertenecían.

            ⚠️ ES UNA LISTA Y NO UNA CARD SUELTA, aunque hoy tenga un solo
            elemento. Lo que se dibuja acá lo arma `promosDelBar`, arriba: las
            promociones de la barra. Hoy la única es el domingo de fútbol, pero
            el día que el cliente sume otra oferta al bar aparece sola, sin
            tocar esto.

            ⚠️ NO LLEVA TÍTULO DE GRUPO, y lo tuvo por un rato. Con la lista
            filtrada a promociones, lo que hay debajo de «Happy hour» es más
            happy hour: un rótulo en el medio los separaría en dos cosas cuando
            el documento del cliente dice expreso que son la misma. La nota
            hace de puente y alcanza.

            ⚠️ SE APAGA SOLO AL CERRAR LA TEMPORADA. Sin `content/game-day.ts`
            ningún evento del bar publica precios, la lista queda vacía y acá
            no se dibuja nada. No hay bloque que acordarse de borrar.
            ══════════════════════════════════════════════════════════════════
          */}
          {promosDelBar.length > 0 ? (
            <div className="mt-11 flex flex-col gap-7 lg:mt-14 lg:gap-9">
              {promosDelBar.map((ev) => {
                const promos = dealsNombrados(ev, GAME_DAY_DEALS);
                return (
                  <div key={ev.slug}>
                    {/*
                      ⚠️ LA NOTA VA CON LA CARD QUE LE CORRESPONDE Y NO ARRIBA
                      DE TODAS. Es el único renglón del sitio que dice que el
                      happy hour de siempre NO se suspende los domingos, y el
                      texto del evento —que es lo que la card publica— no lo
                      dice. Habla del fútbol, así que se dibuja sólo sobre la
                      card que trae esas promos.
                    */}
                    {promos.length > 0 ? (
                      <p className="m-0 mx-auto mb-5 max-w-[52ch] font-body text-base font-light text-bone/85">
                        {GAME_DAY_NOTE}
                      </p>
                    ) : null}

                    <FeaturedEventCard
                      event={ev}
                      deals={GAME_DAY_DEALS}
                      dealsLabel={GAME_DAY_LABEL}
                      headingLevel={3}
                    />
                  </div>
                );
              })}
            </div>
          ) : null}
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
      {/*
        ⚠️ LA CARTA SE VE COMO LÁMINA Y SE ABRE COMO ARCHIVO. Estuvo media hora
        embebida en un visor de PDF dentro de la página y Camila lo frenó: «que
        no aparezca la preview así, que esté como antes; y que al hacer click no
        se abra un pop up con PDF dentro, sino el PDF suelto como archivo común
        externo, para que se vea lo más amplio posible y pueda hacerse zoom».

        Así que la vista previa vuelve a ser la imagen de la hoja —que es lo que
        había antes— y el PDF de la base es a dónde lleva el clic. El componente
        que embebía el visor, `sections/BarMenuPdf`, se borró en el mismo commit:
        no quedó nadie usándolo.
      */}
      <MenuSheets pdfUrl={carta?.pdfUrl ?? null} />

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

