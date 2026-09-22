import type { Metadata } from 'next';
import Image from 'next/image';
import MarketVendorForm from '@/components/sections/MarketVendorForm';
import { PROVIDES, SHOTS, STEPS, TERMS } from '@/content/market';
import { getVenue, venueAddressLine } from '@/lib/venue';
import { ButtonLink } from '@/components/shared/Button';
import FormSlab from '@/components/shared/FormSlab';
import { RevealItem, StaggerGroup } from '@/components/shared/Motion';
import { PendingData } from '@/components/shared/PendingData';
import PlateHero from '@/components/shared/PlateHero';
import Section from '@/components/shared/Section';
import SoftWave from '@/components/shared/SoftWave';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';
import { TAG } from '@/lib/tag';

export const metadata: Metadata = pageMeta({
  route: '/market',
  /*
    ⚠️ ERA `venue-aerial.jpg`, LA AÉREA DEL PATIO VACÍO, y cambió el mismo día
    que la página consiguió fotos del market. Esta imagen es la que sale en la
    tarjeta de WhatsApp, Facebook y el buscador: una aérea sin gente no dice
    «feria de artesanos» en ningún lado, y ahora hay una foto que sí.

    Y de paso arregla una medida: `venue-aerial` se genera a 1000×667 para ir
    DESENFOCADA de fondo del banner de eventos. Mostrada nítida en una tarjeta
    de 1200px de ancho era la misma foto chica estirada que el archivo de
    medios critica en el hero viejo de la home.
  */
  image: {
    url: '/images/market/hero-yard-wide.jpg',
    width: 2048,
    height: 1084,
    alt: 'Stalls and pop-up tents set up in the yard on a market day',
  },
});

/**
 * /market — Neighborhood Market.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LA PÁGINA TIENE DOS PÚBLICOS Y SE ORDENÓ ENTERA ALREDEDOR DE ESO el
 * 2026-09-22. Quien compra necesita saber qué es, qué se ve y que las cocinas
 * y el bar están abiertos; quien VENDE necesita el precio, la medida, cómo se
 * pide un puesto y el formulario.
 *
 * Antes la página se repartía mal: el hero hablaba al comprador y ACTO SEGUIDO
 * venía una banda oscura con «THIRTY DOLLARS, TEN BY TEN» a 112px. O sea que
 * el segundo golpe de vista de una página de captación era el precio. Pedido
 * de Camila: «no hables de pagar dándole mucha importancia, vendamos desde el
 * lado de ayudar a exponer su trabajo y que mucha gente lo conozca».
 *
 * El orden nuevo, y qué hace cada pieza para cuál de los dos públicos:
 *
 *   1. HERO           las dos mitades en la bajada, y un CTA para cada una
 *   2. EL MURO        seis fotos de market days. Le sirve a los DOS: el que
 *                     compra ve a dónde va, el que vende ve la compañía
 *   3. EL ARGUMENTO   «somewhere your work gets seen» + los tres pasos
 *   4. LA LETRA CHICA el fee, la medida, las fechas y quién pone qué
 *   5. EL FORMULARIO
 *   6. EL CIERRE      vuelve el que viene a comprar
 *
 * El precio NO se esconde —eso sería el error opuesto y deja a un vendor
 * enterándose del fee después de llenar once campos—: está en el tercer paso
 * con todas las letras y otra vez en la fila de datos del punto 4. Lo que
 * cambió es que dejó de ser el TITULAR de la página.
 *
 * ⚠️ TODO EL COPY SALE DE `content/market.ts`, que a su vez sale del sitio
 * vigente. Lo que no sabemos —frecuencia, público y rubros buscados— sigue sin
 * afirmarse en ningún lado, y las FECHAS van como `PendingData` a la vista.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ EL H1 NO ES «The Neighborhood Market», y el motivo está medido. Este hero
 * es `PlateHero`, que tiene un contrato escrito: el titular va en DOS
 * renglones. «NEIGHBORHOOD» sola mide 248px a 320 de viewport y 258 a 360,
 * contra una placa que ahí adentro puede medir 232 y 272 — o sea que en un
 * teléfono se partía en tres renglones y la foto le tapaba el último.
 *
 * El nombre no se pierde: sigue en el `<title>`, en la miga y en el cierre.
 * `PAGE_SEO` tiene el mismo H1, que es lo que compara `npm run check:seo`.
 */
export default async function MarketPage() {
  const venue = await getVenue();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(breadcrumbJsonLd([{ name: 'Market', path: '/market' }])),
        }}
      />

      {/*
        ⚠️ SIN MIGAS VISIBLES, igual que las otras cinco páginas terminadas.
        `PlateHero` las sabe dibujar y ninguna se las pasa: la fila de «Home /
        Market» quedaba justo debajo de la barra fija y era lo único que la
        página tenía y las demás no. La miga de SEO no se pierde: es el
        `BreadcrumbList` en JSON-LD de acá arriba, que es el que lee Google.
      */}
      {/*
        ⚠️ LA BAJADA TIENE DOS FRASES Y CADA UNA ES PARA UN PÚBLICO, en ese
        orden. Primero el que compra —que es quien puede llegar acá sin saber
        qué es esto— y después, en una frase que empieza con «And if you are
        the one who makes it», el que vende. Los dos CTA repiten el mismo
        reparto: el primario manda al formulario y el secundario al calendario.

        Antes la bajada era una sola frase de comprador y el único guiño al
        vendor era el botón. Un vendor que entra por Google a «market bonita
        springs vendor» tiene que ver su mitad ARRIBA DEL PLIEGUE, no después
        de dos secciones.

        ⚠️ LA FOTO ES NUEVA Y ANTES ACÁ HABÍA UN `photoBrief` —el marcador de
        foto pendiente—. Sale de la galería del sitio vigente, no de la entrega
        del cliente, y el porqué está en `scripts/build-media.mjs`: la entrega
        de 36 fotos no tiene ni una del market.
      */}
      <PlateHero
        question="Looking for a local makers market in Bonita Springs?"
        title={
          <>
            {'Meet the '}
            <span className="block text-sunset-deep">makers</span>
          </>
        }
        lead="An afternoon of handmade things in the yard, with the trucks cooking and the bar open upstairs. And if you are the one who makes the thing, this is where you set up a table."
        photo="/images/market/hero-yard-wide.jpg"
        photoAlt="Stalls and pop-up tents in the yard on a market day, with racks of clothes and two vendors at their stand"
      >
        <ButtonLink href="#apply" variant="primary" size="lg">
          Book a booth
        </ButtonLink>
        <ButtonLink href="/whats-on" variant="secondary" size="lg">
          See what&rsquo;s on
        </ButtonLink>
      </PlateHero>

      {/*
        ══════════════════════════════════════════════════════════════════
        EL MURO: SEIS FOTOS DE MARKET DAYS.

        ⚠️ ES LA ÚNICA SUPERFICIE OSCURA DE LA PÁGINA —la ley de color del
        repo— y hasta hoy se la llevaba el precio del puesto. Se la queda esto,
        y el cambio de inquilino es el pedido entero de Camila resumido en una
        decisión: la pieza más visible de una página de captación muestra el
        trabajo de la gente, no cuánto cuesta la mesa.

        ⚠️ Y ADEMÁS ES LA SECCIÓN QUE LES SIRVE A LOS DOS PÚBLICOS. Al que
        compra le contesta «¿qué voy a encontrar?» sin una sola frase; al que
        vende le contesta la pregunta que de verdad decide, que es «¿quién más
        pone puesto acá?». Ninguna de las dos se contesta con texto.

        ⚠️ EL TRATAMIENTO DE CADA TILE ES EL DE `PhotoDivider`, a propósito y
        sin inventar nada: caja redondeada con `sombra-card`, y ADENTRO el
        recuadro punteado blanco separado del borde. El sitio ya tiene una
        forma de mostrar una foto sobre oscuro; ésta es esa forma, quieta.

        ⚠️ NO ES CARRUSEL. `PhotoDivider` corre porque es decoración pura y va
        `aria-hidden`; acá las seis fotos tienen `alt` que dicen algo y son el
        contenido de la sección. Un marquee las convierte en fondo.
        ══════════════════════════════════════════════════════════════════
      */}
      <SoftWave from="bone" to="deep" className="relative -mb-px" />
      <Section tone="deep" band="lg" labelledBy="wall-title">
        <SectionHead
          eyebrow="A market day"
          eyebrowTone="cream"
          id="wall-title"
          title={
            <>
              Every table here is{' '}
              <span className="text-sunset">somebody&rsquo;s work</span>
            </>
          }
          /*
            ⚠️ LA BAJADA ENUMERA LO QUE SE VE EN LAS SEIS FOTOS y nada más, y
            la diferencia importa: decir «jewelry, prints, plants» describe el
            material que está ahí abajo, no anuncia qué rubros busca el cliente
            —que es una de las tres cosas que seguimos sin saber—. Por eso
            termina en «these are past markets», en pasado.
          */
          lead="Jewelry, prints, plants, clothes, homeware and food, set out by the people who made them. These are past markets in the yard."
        />

        {/*
          ⚠️ `items-start` NO SOBRA Y ES LO QUE HACE LA PARED. Por defecto una
          celda de grilla se estira al alto de su fila, y una celda estirada
          IGNORA el `aspect-[4/5]` del tile: las tres fotos de la fila salían
          del mismo alto y la pieza se leía como un catálogo. Con `start` cada
          tile conserva su proporción y la fila queda despareja, que es
          exactamente lo que se busca. Ver la nota de `SHOTS`.

          ⚠️ LOS DOS DESFASAJES —`lg:mt-14` en la columna del medio y `lg:mt-7`
          en la tercera— son el segundo tramo del mismo efecto, y van SÓLO en
          `lg`. Abajo de ahí la grilla es de dos columnas y un margen superior
          en una de ellas no se lee como un tendal: se lee como una foto que no
          cargó.

          ⚠️ EL RADIO ES CHICO EN CELULAR Y GRANDE EN ESCRITORIO, y el recuadro
          de adentro lo sigue. Son concéntricos, así que los dos números están
          atados: 18 de caja menos 10 de separación da 8 de radio interno, y 32
          menos 14 da 18. Cambiar uno sin el otro despega las esquinas. Un
          `rounded-shell` de 32px sobre un tile de 170px de ancho —que es lo
          que mide a 390 de viewport— se come la foto.
        */}
        <StaggerGroup
          as="ul"
          className="mt-bloque grid list-none grid-cols-2 items-start gap-4 p-0 lg:grid-cols-3 lg:gap-6"
        >
          {SHOTS.map((s, i) => (
            <RevealItem
              as="li"
              key={s.src}
              className={[
                'relative overflow-hidden rounded-ticket bg-fog sombra-card lg:rounded-shell',
                s.ratio,
                i % 3 === 1 ? 'lg:mt-14' : '',
                i % 3 === 2 ? 'lg:mt-7' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <Image
                src={s.src}
                alt={s.alt}
                fill
                sizes="(max-width: 1023px) 50vw, 420px"
                className="object-cover"
              />

              {/*
                El recuadro punteado, POR DENTRO de la foto. Blanco al 85 % y
                con un pixel de sombra, que es la receta de `PhotoDivider`: el
                trazo tiene que sobrevivir a seis fondos distintos, del mantel
                negro de la joyería al cielo del mediodía.
              */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-2.5 rounded-[8px] border border-dashed border-paper/85 [filter:drop-shadow(0_1px_1px_rgb(0_0_0/0.35))] lg:inset-3.5 lg:rounded-ticket"
              />
            </RevealItem>
          ))}
        </StaggerGroup>
      </Section>

      {/*
        ══════════════════════════════════════════════════════════════════
        EL ARGUMENTO, Y DEBAJO LOS TRES PASOS.

        ⚠️ ESTA SECCIÓN ES LA QUE REEMPLAZA A LA BANDA DEL PRECIO. Lo que un
        vendor tiene que leer primero no es cuánto sale la mesa: es qué se
        lleva por ponerla. Y lo que se lleva acá es gente que ya estaba en el
        patio por otra cosa, que es el único argumento de esta página que no
        depende de un dato que no tenemos.

        ⚠️ «the crowd that is already here for the trucks and the bar» ES
        TEXTUAL DEL CLIENTE: sale de `PROVIDES.venue`, que se transcribió del
        sitio vigente. Es a propósito que el argumento se apoye ahí y no en un
        número: NO SABEMOS cuánta gente va a un market day, y una página que le
        cobra a alguien por exponer no puede prometerle público inventado.

        ⚠️ EL ENCABEZADO Y LOS PASOS COMPARTEN SECCIÓN y antes eran dos. El
        argumento sin los pasos es una declaración sin qué hacer después, y los
        pasos sin el argumento son un trámite. Juntos, el `h2` es el motivo y
        los tres tickets son el cómo.
        ══════════════════════════════════════════════════════════════════
      */}
      {/*
        ⚠️ `banda-arco` ES LO QUE SACA A LA PÁGINA DE LA BANDA OSCURA. Sin él,
        el verde terminaba en una línea recta de punta a punta: el único corte
        duro que le quedaba a la página y el único que no existe en ninguna otra
        del sitio. Con el arco, esta sección MONTA sobre el verde con el radio
        grande de la casa, que es el mismo gesto con el que `FindUs` sale de
        `EventsBanner` en la home y con el que `MenuSheets` sale de la banda de
        happy hour en `/sunset-bar`.

        ⚠️ EL HUECO QUE LA SECCIÓN DE ARRIBA NECESITA NO SE ESCRIBE: lo pone la
        regla `:has(+ .banda-arco)` de `globals.css`, que le agrega un borde
        inferior transparente del alto del radio.

        ⚠️ EL `z-[2]` NO SOBRA. Sin él la banda oscura, que viene antes en el
        DOM, pinta su fondo encima de la parte del arco que se monta y el
        redondeo no se ve. Es el mismo par que usan los cierres de `/events`,
        `/our-story` y `/game-truck`.
      */}
      <Section tone="bone" band="lg" labelledBy="steps-title" className="banda-arco z-[2]">
        <SectionHead
          eyebrow="Set up with us"
          eyebrowTone="plum"
          id="steps-title"
          title={
            <>
              Somewhere your work <span className="text-sunset-deep">gets seen</span>
            </>
          }
          lead="Your table goes in the yard, next to the crowd that is already here for the trucks and the bar. They came for lunch, and they leave knowing what you make. Three steps to get one, and the first takes two minutes."
        />

        {/*
          ══════════════════════════════════════════════════════════════════
          LOS TRES PASOS, COMO TICKETS.

          ⚠️ ES LA MISMA PIEZA QUE «HOW THIS PLACE WORKS» DE LA HOME, y se usa
          acá por el mismo motivo por el que se eligió allá: el contenido ES
          una secuencia y el número de paso tiene dónde vivir sin competir con
          el título. Tres cosas la definen y están las tres: la banda `bone`,
          el troquel de la tarjeta con su sombra de dos capas, y el sticker
          redondo del número montado a caballo del borde de arriba, con la
          construcción del logo del header —filo, aro naranja, campo crema—.

          ⚠️ ACÁ NO ES CARRUSEL Y EN LA HOME SÍ. El carrusel de `YardSteps`
          existe porque en una tablet un ticket a ancho completo medía 767px
          para un párrafo de 34 caracteres y dejaba de ser una tarjeta. Se
          resuelve con `max-w`: hasta `lg` la columna se topa en 560px y queda
          centrada, que da la misma medida de tarjeta sin sumar estado ni un
          componente cliente.

          ⚠️ LOS PADDINGS DEL `ol` SON LA SOMBRA Y NO SON AIRE. El `<li>`
          proyecta con `drop-shadow` —tiene que ser `drop-shadow` y no
          `box-shadow`, porque el `troquel` es una máscara y una sombra de caja
          se dibujaría sobre los dientes—. Sube 8px y baja 24. Los mide
          `npm run check:sombras`.
          ══════════════════════════════════════════════════════════════════
        */}
        <StaggerGroup
          as="ol"
          aria-label="How to get a market booth, step by step"
          className="mx-auto mt-bloque grid max-w-[560px] list-none gap-6 p-0 pt-2 pb-7 lg:max-w-none lg:grid-cols-3"
        >
          {STEPS.map((s, i) => (
            <RevealItem
              key={s.title}
              as="li"
              className="relative flex pt-9.5 [filter:drop-shadow(0_1px_2px_rgba(10,31,30,0.10))_drop-shadow(0_8px_16px_rgba(10,31,30,0.16))]"
            >
              {/*
                ⚠️ EL STICKER DEL NÚMERO ES EL DEL HEADER, EN TRES CAPAS Y EN
                ESTE ORDEN: el troquel blanco que despega la pieza, el aro
                naranja y el campo crema con el dato. La nota larga de por qué
                es así vive en `YardSteps`, que es donde nació.

                ⚠️ «STEP» VA EN `deep` Y NO EN `sunset-deep`, y el cambio entró
                con esta página: el naranja sobre el crema del campo da 3.08:1 a
                8px en negrita y AA pide 4.5. Lo marcó axe acá, y se corrigió en
                los dos lados —`YardSteps` y esta página— en el mismo commit,
                porque son el mismo objeto.
              */}
              <span className="sticker absolute top-0 left-1/2 z-30 grid size-17 -translate-x-1/2 place-items-center rounded-pill bg-paper p-1">
                <span className="grid size-full place-items-center rounded-pill bg-sunset p-1.25">
                  <span className="grid size-full place-items-center content-center rounded-pill bg-cream">
                    <span className="font-body text-[8px] font-bold uppercase tracking-[0.14em] text-deep">
                      Step
                    </span>
                    <span className="font-display text-d5 font-extrabold leading-none text-deep">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </span>
                </span>
              </span>

              {/*
                ⚠️ LOS CUATRO RENGLONES SON LOS DE LA HOME Y EN EL MISMO ORDEN:
                rótulo chico, título en display condensada, párrafo y etiquetas
                al pie con `mt-auto`. El `mt-auto` es lo que empareja el ALTO de
                las tres tarjetas sin un número escrito a mano: el sobrante se
                va al hueco de arriba de las etiquetas, así que los tres pies
                cierran a la misma altura mida lo que mida cada párrafo.

                ⚠️ EL TÍTULO ES UN `<h3>` A MANO Y NO `<Heading role="card">`.
                `card` es la tipografía de tarjeta CHICA —geométrica, 20/24px—
                y acá va la condensada grande, que es la que tienen los tickets
                de la home. Mismo elemento, misma jerarquía, otra letra.
              */}
              <div className="troquel relative flex flex-1 flex-col items-center gap-3.5 rounded-ticket bg-paper px-5.5 pt-12 pb-13 text-center lg:px-8 lg:pt-15 lg:pb-14">
                <span className="font-body text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                  {s.kicker}
                </span>
                {/*
                  ⚠️ EL TÍTULO RESERVA DOS RENGLONES AUNQUE OCUPE UNO, y es lo
                  que alinea los tres párrafos. De los tres pasos sólo «Start
                  with the form» se parte en dos: sin el piso, la bajada de esa
                  tarjeta arrancaba 35px más arriba que las de sus vecinas y las
                  tres tarjetas se leían desfasadas. En los tickets de la home
                  no hace falta porque los tres títulos son de dos renglones.

                  ⚠️ VA EN `em` Y NO EN PÍXELES: son dos veces la interlínea de
                  0.98, medida contra el propio cuerpo del título, que es un
                  `clamp` de 36 a 40px. En píxeles daría bien en una medida y
                  mal en la otra. Y sólo desde `lg`, que es donde las tarjetas
                  van lado a lado y hay algo que alinear; apiladas, el piso
                  sería un hueco debajo de dos de los tres títulos.
                */}
                {/*
                  ⚠️ SIN UN «Step N:» EN `sr-only`, y estuvo puesto un rato. El
                  sticker de arriba NO es decorativo: dice «Step» y «01» en
                  texto de verdad, sin `aria-hidden`, así que ya está en el
                  árbol de accesibilidad. Con las dos cosas, un lector de
                  pantalla leía «Step 01, Step 1, Start with the form» en cada
                  una de las tres tarjetas. Es la misma razón por la que los
                  tickets de la home tampoco lo llevan.
                */}
                <h3 className="m-0 max-w-[16ch] font-display text-d4 font-bold uppercase leading-[0.98] text-ink lg:min-h-[1.96em] lg:text-h3">
                  {s.title}
                </h3>
                <p className="m-0 max-w-[34ch] font-body text-base font-light text-ink">{s.body}</p>

                {/* Las etiquetas son el molde de los tickets de la home: radio
                    de familia y no píldora, fondo `bone` —el color de esta
                    sección, así que el chip se lee como un recorte de la página
                    apoyado en la tarjeta— y el punto `river` decorativo. La
                    letra sale de `TAG`. */}
                <ul className="mt-auto flex list-none flex-wrap justify-center gap-1.5 p-0 pt-5">
                  {s.tags.map((tag) => (
                    <li
                      key={tag}
                      className={`inline-flex items-center gap-1.75 rounded-btn bg-bone ${TAG} text-muted`}
                    >
                      <span aria-hidden="true" className="size-1 shrink-0 rounded-pill bg-river" />
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealItem>
          ))}
        </StaggerGroup>
      </Section>

      {/*
        ══════════════════════════════════════════════════════════════════
        LA LETRA CHICA: LOS NÚMEROS Y QUIÉN PONE QUÉ.

        ⚠️ ACÁ VIVEN AHORA LOS DATOS QUE ANTES ERAN EL TITULAR DE LA PÁGINA, y
        el cambio es de jerarquía, no de contenido: el fee, la medida, el orden
        de llegada y las fechas siguen enteros y siguen ANTES del formulario.
        Lo que ya no hacen es abrir la página en display de 112px.

        ⚠️ LA FILA DE DATOS ES LA MISMA PIEZA QUE ERA, en claro y en chico: tres
        celdas de la tarjeta de happy hour de `/sunset-bar` separadas por
        filetes PUNTEADOS, que se apilan en celular y ahí el filete vuelve a ser
        horizontal. Lo que cambia es la superficie —`bone` sobre `paper`, que es
        el par de `EventSpaces`— y el cuerpo del valor, que baja de `d2` a `d5`.

        ⚠️ Y AHORA SON CUATRO CELDAS Y NO TRES. La cuarta es el hueco de las
        fechas, y sigue estando A LA VISTA aunque la pieza se haya achicado: era
        la condición para bajarle el volumen a esta sección. Un pendiente
        escondido se publica sin que nadie lo note. Las fechas del market no
        están en el sitio vigente ni en el brief.
        TODO: confirmar las fechas con el cliente.

        ⚠️ LAS DOS TARJETAS DE ABAJO SON LA PREGUNTA QUE DECIDE DESPUÉS DEL
        PRECIO: si hay que traer mesa, si se puede llevar carpa, si hay luz. Las
        dos listas son textuales del sitio vigente y acá es donde vive ese dato.
        ══════════════════════════════════════════════════════════════════
      */}
      <Section band="lg" labelledBy="bring-title">
        <SectionHead
          eyebrow="Before the day"
          eyebrowTone="deep"
          id="bring-title"
          title={
            <>
              What we set out, and <span className="text-sunset-deep">what you bring</span>
            </>
          }
          lead="The yard, the power and the crowd are ours. The table and everything on it is yours."
        />

        <div className="mt-bloque rounded-shell bg-bone p-6 lg:px-9 lg:py-7">
          {/*
            ⚠️ EN CELULAR SE APILA Y EL FILETE GIRA CON LA FILA: es `divide-y`
            abajo y `divide-x` desde `sm`. Cuatro celdas en fila a 390px dejarían
            «Booth fee» en tres renglones de cuatro letras, que es el mismo
            número con el que se cortó la tarjeta de happy hour.
          */}
          <dl className="m-0 flex list-none flex-col divide-y divide-dashed divide-ink/15 p-0 sm:flex-row sm:flex-wrap sm:divide-x sm:divide-y-0">
            {TERMS.map((t) => (
              <div
                key={t.label}
                className="flex-auto py-4 first:pt-0 sm:px-7 sm:py-0 sm:first:pl-0"
              >
                <dt className="font-body text-caption font-medium uppercase tracking-eyebrow text-muted">
                  {t.label}
                </dt>
                {/*
                  ⚠️ EL VALOR VA PELADO, SIN LA UNIDAD COLGADA AL LADO. Estuvo
                  un rato con un «ft» chico detrás del 10 × 10, como el «/ hour»
                  de las tarifas de `/events`, y ahí funciona porque es una
                  unidad de una palabra contra un número de cuatro dígitos. Acá
                  el número ya tiene un símbolo adentro y la sigla se leía como
                  un punto suelto al final. Los pies los dice el pie de la
                  tarjeta, con todas las letras.
                */}
                <dd className="m-0 mt-2 font-display text-d5 font-extrabold leading-none tabular-nums text-deep">
                  {t.value}
                </dd>
              </div>
            ))}

            <div className="flex-auto py-4 last:pb-0 sm:px-7 sm:py-0 sm:last:pr-0">
              <dt className="font-body text-caption font-medium uppercase tracking-eyebrow text-muted">
                Next dates
              </dt>
              {/*
                ⚠️ EL MARCADOR VA EN EL RENGLÓN DEL VALOR Y NO DEBAJO DEL
                PÁRRAFO. Las cuatro celdas tienen que leerse como la misma fila
                de datos: tres con su dato y una con el hueco declarado. Con el
                `mt` alineado al de los `dd` de al lado, el filo punteado del
                `TBD` cae a la altura de la línea de mayúsculas de los valores.
              */}
              <dd className="m-0 mt-2.5">
                <PendingData detail="Upcoming market dates not supplied yet" />
              </dd>
            </div>
          </dl>

          {/*
            ⚠️ EL FILETE VA EN EL ENVOLTORIO Y EL TOPE DE MEDIDA EN EL PÁRRAFO,
            y no los dos en el mismo nodo. El filete es un SEPARADOR: tiene que
            cruzar la tarjeta entera, igual que los punteados verticales de la
            fila de arriba. El párrafo, en cambio, suelto a 1440 se iba a 95
            caracteres por renglón, medio renglón más que el tope de lectura que
            usa el resto del sitio. Juntos en el `<p>`, el `max-w` le cortaba el
            filete a dos tercios y se leía como un subrayado.
          */}
          <div className="mt-6 border-t border-dashed border-ink/15 pt-5">
            <p className="m-0 max-w-[78ch] font-body text-dato font-light leading-[1.65] text-body/75">
              {/* ⚠️ ACÁ DECÍA TAMBIÉN «anything bigger than that needs approval
                  first» y se fue: es textual de `PROVIDES.vendor`, o sea que ya
                  se publica dos tarjetas más abajo en «You bring». Lo único que
                  este pie tiene que agregar es la UNIDAD —el valor de arriba no
                  la lleva— y qué pasa con las fechas. */}
              Ten by ten feet is the standard space, and the last approval happens at check-in on
              the day. We have not published the next market days here yet, so write the ones you
              want into the form and we come back to you with what is open.
            </p>
          </div>
        </div>

        {/*
          ══════════════════════════════════════════════════════════════════
          ⚠️ LAS DOS TARJETAS LLEVAN EL TROQUEL PUNTEADO, que es LA forma de
          tarjeta de este sitio: el filete interior a `inset-3.5` con
          `rounded-shell`, el mismo número que tienen las columnas de
          `CompareSlab`, las losas de tipo de evento de `/events`, el panel de
          `FormSlab`, la tarjeta de happy hour de `/sunset-bar` y el banner de
          `/food-trucks`. Sin él son dos rectángulos redondeados, que es la
          única caja que el sitio NO usa.

          ⚠️ EL COLOR DEL FILETE DICE DE QUÉ LADO ESTÁ CADA TARJETA, y eso no lo
          inventé acá: es exactamente lo que hace `CompareSlab` con sus dos
          columnas, `teal600` la nuestra y `terra` la otra. Acá el par es el
          mismo tipo de par —lo que pone el venue contra lo que pone el vendor—
          así que hereda los dos colores y el rótulo que ya los nombraba.
          Ratios sobre `bone`: `teal600` 4.62:1 y `terra` 7.19:1; son filetes y
          no texto, así que no necesitaban pasar, y pasan igual.

          ⚠️ EL PADDING SUBE A 8/10 Y NO ES CAPRICHO: el troquel se come 14px por
          lado, así que con `p-7` el texto quedaba a 14px del filete en vez de
          respirar. Es el mismo ajuste que tienen las otras tarjetas troqueladas.
          ══════════════════════════════════════════════════════════════════
        */}
        <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-2 lg:gap-8">
          {[
            {
              rotulo: 'On us',
              tono: 'deep' as const,
              filete: 'border-teal600/55',
              titulo: 'We bring',
              items: PROVIDES.venue,
            },
            {
              rotulo: 'On you',
              tono: 'terra' as const,
              filete: 'border-terra/45',
              titulo: 'You bring',
              items: PROVIDES.vendor,
            },
          ].map(({ rotulo, tono, filete, titulo, items }) => (
            <article
              key={titulo}
              className="relative flex h-full flex-col rounded-shell bg-bone p-8 lg:p-10"
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-3.5 rounded-shell border border-dashed ${filete}`}
              />

              <div className="relative flex h-full flex-col">
                <Eyebrow tone={tono}>{rotulo}</Eyebrow>
                <Heading level={3} className="mt-gap-kicker">
                  {titulo}
                </Heading>
                {/* El filete lleno separa el anuncio de la lista, igual que el
                    `hr` que parte la columna izquierda de `FormSlab`. */}
                <ul className="mt-7 flex list-none flex-col gap-3.5 border-t border-ink/15 p-0 pt-6">
                  {items.map((i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 font-body text-lead font-light leading-[1.5] text-body/85"
                    >
                      {/* El punto naranja es el mismo separador que llevan las
                          etiquetas de los tickets: uno de los pocos lugares
                          donde el `sunset` aparece fuera de un CTA. */}
                      <span
                        aria-hidden="true"
                        className="mt-2.75 size-1.75 shrink-0 rounded-pill bg-sunset"
                      />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/*
        ⚠️ EL FORMULARIO VA EN `FormSlab`, que es la losa que comparten
        `/events`, `/contact` y los dos carriles de `/join-us`. El panel es
        `bone` sobre sección `paper`, que es el default y el par que hace que
        la píldora blanca de cada campo se recorte contra el panel.

        ⚠️ EL `aside` NO MANDA A `/contact`. La salida alternativa es el mail y
        el teléfono directos, y sigue siendo así aunque `/contact` ya navegue:
        el motivo que queda en pie es que el formulario de contacto pide menos
        de lo que un vendor ya vino a contar. (El otro motivo era la tranca de
        navegación, que se borró entera el 2026-09-22.)
      */}
      <FormSlab
        id="apply"
        eyebrow="Apply"
        eyebrowTone="terra"
        title={
          <>
            Tell us <span className="text-sunset-deep">what you make</span>
          </>
        }
        titleId="apply-title"
        lead="Eleven fields, and most of them are one line. A person reads what comes in and answers within one business day."
        aside={
          /*
            ⚠️ SON DOS BLOQUES Y NO UNO, que es la forma que tiene el `aside` de
            `/events`. El de los contactos solo dejaba la columna izquierda en
            339px contra un panel de 1.250: la más corta de las cuatro losas del
            sitio, con novecientos píxeles de fondo al costado del formulario.

            ⚠️ EL BLOQUE NUEVO NO INVENTA NADA: enumera lo que el propio
            formulario de al lado pide como obligatorio. Es la pregunta que hace
            cualquiera antes de empezar a llenar quince campos —«¿qué me va a
            pedir?»— y se contesta ANTES, no scrolleando.
          */
          <div className="flex flex-col gap-9">
            <div className="flex flex-col gap-2.5">
              <p className="eyebrow text-body/75">Have it ready</p>
              <p className="max-w-[40ch] font-body text-base font-light leading-[1.7] text-body/80">
                A link or an @handle where we can see your work, a sentence about what you make, and
                the market dates you are after. The rest is your name and how to reach you.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <p className="eyebrow text-body/75">Or skip the form</p>
              <a href={`mailto:${venue.email}`} className="link-texto font-body text-base">
                {venue.email}
              </a>
              <a href={venue.phoneHref} className="link-texto font-body text-base">
                {venue.phone}
              </a>
            </div>
          </div>
        }
      >
        <MarketVendorForm />
      </FormSlab>

      {/*
        ══════════════════════════════════════════════════════════════════
        EL CIERRE, Y ACÁ VUELVE EL QUE VIENE A COMPRAR.

        ⚠️ ES EL BLOQUE DE CIERRE DEL KIT, EL MISMO QUE CIERRAN `/our-story` Y
        `/game-truck`, y no una pieza nueva: banda `cream` que monta con
        `banda-arco`, un troquel punteado a `inset-0` por dentro del contenido,
        una pieza del brand book apoyada en la esquina de abajo a la derecha,
        titular con su palabra en acento, bajada, dos CTA y el renglón de la
        dirección con el teléfono. Que las páginas cierren igual es lo correcto,
        no una repetición: el kit declara este bloque como fijo para las nueve.

        ⚠️ ACÁ HABÍA UN PANEL CREMA SOBRE UNA SECCIÓN BLANCA, con el troquel a
        `inset-3.5` y el radio de marco. Era el banner de rotación de
        `/food-trucks` copiado, que es OTRO bloque: ése cierra una sección en
        medio de la página, no la página. Se veía bien y estaba en el lugar
        equivocado del vocabulario, y además dejaba la página terminando en dos
        secciones blancas seguidas.

        ⚠️ LA PIEZA ES `seal.svg`, EL AZULEJO. `/our-story` cierra con el
        medallón —lo que cierra ahí es la marca entera— y `/game-truck` con el
        isotipo del camión, que es de lo que habla su página. Acá lo que se
        vende es hecho a mano, así que va el azulejo.

        ⚠️ `z-[3]` Y NO `z-[2]`, porque en esta página el arco de más arriba ya
        se llevó el `[2]`: entre secciones con el mismo z-index decide el orden
        del DOM, y ahí ésta ya gana. El número sube igual para dejar escrito
        cuál monta sobre cuál, que es la misma escalera que tiene la home.

        ⚠️ Y DE PASO PINTA LAS ESQUINAS DEL FOOTER, que también monta con
        `banda-arco`: lo que se ve en sus dos esquinas es el fondo del hermano
        anterior, o sea esta banda crema.
        ══════════════════════════════════════════════════════════════════
      */}
      <Section tone="cream" band="lg" labelledBy="while-title" className="banda-arco z-[3]">
        <div className="relative px-2 py-2 text-center sm:px-8 sm:py-6">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-shell border border-dashed border-deep/35"
          />

          {/*
            ⚠️ VA COMO CALCOMANÍA Y NO COMO MARCA DE AGUA, que es el
            tratamiento de `/our-story` y no el de `/game-truck`. Los dos
            cierres del kit son válidos, pero el azulejo es literalmente una
            pieza troquelada del brand book —viene con su filo crema— y al 30 %
            de opacidad ese filo se deshace y queda una mancha. Con `.sticker`
            recupera la sombra de dos pasadas que lo hace leer apoyado, que es
            la misma clase del logo del header y de los números de los pasos.

            ⚠️ LA ROTACIÓN VA EN EL ENVOLTORIO Y EL FLOTE ADENTRO. Los dos son
            `transform`: juntos en un nodo, los keyframes de `rt-flotar` le
            pisan la inclinación y la pieza se endereza al arrancar el ciclo.
            Es la misma trampa anotada en los stickers de `/sunset-bar`.
          */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-8 bottom-8 hidden w-24 rotate-6 sm:block lg:right-12 lg:bottom-10 lg:w-32"
          >
            <span className="sticker rt-flotar block">
              <Image
                src="/brand/seal.svg"
                alt=""
                width={260}
                height={260}
                className="block h-auto w-full"
              />
            </span>
          </span>

          <div className="relative px-4 py-10 sm:py-12">
            <Heading
              level={2}
              id="while-title"
              className="mx-auto max-w-[20ch] text-balance text-d3 lg:text-d2"
            >
              The trucks cook <span className="text-sunset-deep">while you shop</span>
            </Heading>
            <p className="mx-auto mt-5 max-w-[52ch] font-body text-lead font-light leading-[1.5] text-ink">
              {/* ⚠️ «people who live here» ES DEL CLIENTE y por eso está
                  textual: el sitio vigente cierra la página del market con
                  «supporting people who live here». Estuvo un rato como «who
                  live twenty minutes away», que suena mejor y es un dato que
                  nadie nos dio: los veinte minutos son de las cervecerías del
                  Sunset Bar, no de los artesanos. */}
              The kitchens are open and the bar is upstairs the whole time you are here. It is an
              afternoon spent on people who live here.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/food-trucks" variant="dark">
                Food trucks
              </ButtonLink>
              <ButtonLink href="/sunset-bar" variant="outline">
                Sunset Bar
              </ButtonLink>
            </div>
            <p className="mt-8 font-body text-base text-body/80">
              {venueAddressLine(venue)} &middot;{' '}
              <a href={venue.phoneHref} className="link-texto font-semibold">
                {venue.phone}
              </a>
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
