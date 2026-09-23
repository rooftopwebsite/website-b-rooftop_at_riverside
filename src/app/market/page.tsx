import type { Metadata } from 'next';
import Image from 'next/image';
import MarketVendorForm from '@/components/sections/MarketVendorForm';
import { PROVIDES, SHOTS, STEPS, TERMS } from '@/content/market';
import { getVenue } from '@/lib/venue';
import { ButtonLink } from '@/components/shared/Button';
import FormSlab from '@/components/shared/FormSlab';
import { RevealItem, StaggerGroup } from '@/components/shared/Motion';
import PlateHero from '@/components/shared/PlateHero';
import Section from '@/components/shared/Section';
import SoftWave from '@/components/shared/SoftWave';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

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
    url: '/og/market.jpg',
    width: 1200,
    height: 630,
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
 * afirmarse en ningún lado.
 *
 * ⚠️ LAS FECHAS IBAN COMO `PendingData` A LA VISTA Y YA NO. Camila tachó esa
 * celda el 2026-09-22 (ver la tarjeta del stand). El dato sigue faltando —ítem
 * 19 de `docs/pedido-al-cliente.md`— y el pie de esa tarjeta lo sigue diciendo
 * en prosa: «we have not published the next market days here yet».
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
        title={'Meet the '}
        titleAccent="makers"
        lead="An afternoon of handmade things in the yard, with the trucks cooking and the bar open upstairs. And if you are the one who makes the thing, this is where you set up a table."
        photo="/images/market/hero-yard-wide.webp"
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
      {/*
        ⚠️ `width="full"` Y EL ENCABEZADO EN SU PROPIA `caja`, desde el
        2026-09-23. Camila: «que el carru llegue al borde de la pantalla, que
        no se corte». Con la caja de la sección, a 1559px la tira frenaba en
        los 1280 de contenido y se cortaba antes del vidrio. Es la salida que
        ya usa el estante de `/game-truck` (ver la nota en `GameShelf`): la
        sección mide el viewport y sólo el encabezado se encaja.

        ⚠️ EN DESKTOP LA BAJADA VA AL COSTADO DEL TITULAR, y en el mismo pedido:
        «en desk la bajada quiero que esté al lateral, no debajo». Abajo de `lg`
        sigue debajo.
      */}
      <Section tone="deep" band="lg" labelledBy="wall-title" width="full">
        <div className="caja lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
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
        />
          <p className="bajada m-0 mt-gap-bajada max-w-[52ch] text-paper/85 lg:mt-0 lg:pb-2">
            Jewelry, prints, plants, clothes, homeware and food, set out by the people who made
            them. These are past markets in the yard.
          </p>
        </div>

        {/*
          ══════════════════════════════════════════════════════════════════
          ⚠️ ES UN CARRUSEL INFINITO Y ERA UNA PARED DE SEIS TILES. Camila,
          2026-09-22: «la galería que sea un carrusel infinito como el del
          home».

          El de la home es el de `PhotoDivider`: una tira de fotos que se
          desplaza sola, con el set REPETIDO DOS VECES porque la animación
          corre el 50 % y vuelve al origen — la segunda copia es la que tapa el
          hueco en el punto de reinicio. Sin ella se ve el corte. Acá es lo
          mismo con `rt-marquee-rev`, la misma clase y el mismo sentido.

          ⚠️ EL `overflow-hidden` VA CON `py-13` Y NO ES AIRE: los tiles llevan
          `sombra-card`, que baja 50px, y el recorte de la tira la cortaba al
          ras. Es la misma cuenta que está escrita en `PhotoDivider`, con el
          mismo origen: `scripts/check-sombras.mjs`.

          ⚠️ LOS TILES PASAN A ALTO FIJO Y ANCHO PROPIO. En la pared cada uno
          tenía su `aspect-ratio` y la grilla los dejaba desparejos a lo alto,
          que era el efecto buscado ahí; en una tira horizontal lo que tiene que
          ser parejo es el ALTO, o la fila se ve rota. El ancho lo sigue
          decidiendo la proporción de cada foto, así que la tira mantiene el
          ritmo irregular de la pared en el otro eje.

          ⚠️ LA TIRA ES `aria-hidden` ENTERA Y LA SECCIÓN NO PIERDE NADA: lo
          que las seis fotos dicen ya está escrito en la bajada —«jewelry,
          prints, plants, clothes, homeware and food»—, que es texto de verdad.
          Una lista de seis `alt` duplicados por el bucle no le sirve a nadie.

          ⚠️ SE SALE DE LA CAJA CON MÁRGENES NEGATIVOS. Un carrusel que arranca y
          termina dentro del ancho de lectura no se lee como infinito: se lee
          como una fila que no entró. Los `-mx` anulan el gutter de la
          `Section` —16px en celular, 32 desde `md`— y la tira llega al vidrio,
          que es lo que hace el de la home. No hay utilidad de sangrado en el
          repo: las otras secciones que sangran lo resuelven al revés, dejando
          el gutter sólo en su encabezado (ver la nota de `caja-ancha`).
          ══════════════════════════════════════════════════════════════════
        */}
        {/* ⚠️ `mt-2 pt-6` Y NO `mt-bloque` + `py-13` arriba (2026-09-23): «achicá los
            espacios entre carru y título». Arriba la sombra casi no sube, así que
            el colchón de 52px sólo hace falta abajo. */}
        <div aria-hidden="true" className="-mx-gutter mt-2 overflow-hidden pt-6 pb-13 md:-mx-gutter-lg">
          <div className="rt-marquee-rev flex w-max items-center gap-4 lg:gap-6">
            {[...SHOTS, ...SHOTS].map((s, i) => (
              <div
                key={`${s.src}-${i}`}
                className="relative h-[240px] w-[190px] shrink-0 overflow-hidden rounded-ticket bg-fog sombra-card lg:h-[340px] lg:w-[270px] lg:rounded-shell"
              >
                <Image
                  src={s.src}
                  alt=""
                  fill
                  sizes="(max-width: 1023px) 190px, 270px"
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
              </div>
            ))}
          </div>
        </div>
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
          align="center"
          eyebrow="Set up with us"
          eyebrowTone="plum"
          id="steps-title"
          title={
            <>
              Somewhere your work <span className="text-sunset-deep">gets seen</span>
            </>
          }
          lead="Your table goes in the yard, next to the crowd that is already here for the trucks and the bar. They came for lunch, and they leave knowing what you make."
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
                <span className="font-body text-caption font-medium uppercase tracking-[0.18em] text-muted">
                  {s.kicker}
                </span>
                {/*
                  ⚠️ EL PISO DE DOS RENGLONES SE FUE EL 2026-09-22, y con él el
                  problema que lo pedía. Era un `lg:min-h-[1.96em]` —dos veces
                  la interlínea— porque de los tres pasos sólo «Start with the
                  form» se partía en dos, y sin el piso la bajada de esa tarjeta
                  arrancaba 35px más arriba que las de sus vecinas.

                  Camila lo atacó por el otro lado, que es el correcto: «haz que
                  los títulos o tengan todos dos líneas o todos una». Con los
                  tres en un renglón —ver `content/market.ts`— no hay nada que
                  emparejar y el piso sería un hueco debajo de los tres.
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
                <h3 className="m-0 max-w-[16ch] font-display text-d4 font-bold uppercase leading-[0.98] text-ink lg:text-h3">
                  {s.title}
                </h3>
                <p className="m-0 max-w-[34ch] font-body text-base font-light text-ink">{s.body}</p>

                {/*
                  ⚠️ ACÁ IBAN LAS ETIQUETAS Y SE FUERON EL 2026-09-22 (Camila:
                  «elimina de cada paso los tags»). Eran ocho chips al pie de las
                  tres tarjetas repitiendo el párrafo que tenían encima. El
                  porqué, largo, está en `content/market.ts`.

                  ⚠️ CON ELLAS SE FUE EL `mt-auto`, que era lo que emparejaba el
                  alto de las tres tarjetas empujando los pies al piso. Sin un
                  pie que empujar, las tres miden lo que mide su párrafo, que a
                  este ancho son dos renglones en las tres.
                */}
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

        {/*
          ══════════════════════════════════════════════════════════════════
          ⚠️ LA BARRA DE DATOS SE METIÓ ADENTRO DE LA TARJETA Y LA TARJETA «WE
          BRING» SE BORRÓ. Camila, 2026-09-22, sobre la captura: tachó la
          celda de «Next dates» y la tarjeta entera de «On us / We bring», y
          encerró en un círculo la barra de datos con una flecha apuntando al
          lugar de esa tarjeta: «elimina lo que te taché y pon los que te
          encierro en un círculo en la card donde ahora dice "por nuestra
          cuenta"».

          Y cierra bien: los cuatro renglones de «We bring» eran el espacio
          10×10, la electricidad, la gente que ya está en el patio y la
          aprobación al llegar. El primero es literalmente la celda «Space» de
          la barra, el cuarto es la última oración del pie, y el tercero es la
          bajada del `SectionHead` de esta misma sección —«the crowd… are
          ours»—. Tres de cuatro estaban dichos dos veces a 200px de distancia.

          ⚠️ LA ELECTRICIDAD ERA EL ÚNICO DATO QUE SÓLO VIVÍA AHÍ, así que se
          mudó al pie de la tarjeta. No se pierde nada.

          ⚠️ «NEXT DATES» SE VA DE LA PANTALLA PERO NO DEL PEDIDO. Era una celda
          con `PendingData`, o sea el hueco declarado a la vista. El dato sigue
          faltando —ítem 19 de `docs/pedido-al-cliente.md`— y el pie de la
          tarjeta lo sigue diciendo con todas las letras: «we have not published
          the next market days here yet». Lo que se fue es el marcador, no la
          honestidad.

          ⚠️ EL PAR DEJA DE SER «NOSOTROS / USTEDES» Y PASA A SER «EL STAND /
          LO QUE TRAÉS», que es lo que la sección pregunta de verdad. Por eso el
          filete de la izquierda sigue siendo `teal600` y el de la derecha
          `terra`: son los dos lados del mismo trato, como en `CompareSlab`.
          ══════════════════════════════════════════════════════════════════
        */}
        <div className="mt-bloque grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* ── El stand: lo que era la barra de datos ──────────────────── */}
          <article className="relative flex h-full flex-col rounded-shell bg-bone p-8 lg:p-10">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-3.5 rounded-shell border border-dashed border-teal600/55"
            />

            <div className="relative flex h-full flex-col">
              <Eyebrow tone="deep">The stand</Eyebrow>
              <Heading level={3} className="mt-gap-kicker">
                What a table costs
              </Heading>

              {/*
                ⚠️ LOS TRES DATOS PASAN DE FILA A COLUMNA. En la barra iban uno
                al lado del otro con filetes punteados verticales, porque tenía
                el ancho de la sección; adentro de media tarjeta, tres celdas en
                fila dejan «First come» en dos renglones de cinco letras. Como
                lista, cada dato tiene su renglón y el valor alinea a la derecha,
                que es la forma en que el sitio publica cualquier tabla de
                precios (ver los fees de `/events`).

                ⚠️ EL VALOR SIGUE EN `deep` Y NO EN `sunset-deep`. Son datos y
                no precios de conversión: el naranja de esta página está en los
                puntos de las listas y en el botón del formulario.
              */}
              <dl className="m-0 mt-7 flex list-none flex-col border-t border-ink/15 p-0 pt-6">
                {TERMS.map((t) => (
                  <div
                    key={t.label}
                    className="flex items-baseline justify-between gap-6 border-b border-dashed border-ink/15 py-3.5 last:border-b-0 last:pb-0"
                  >
                    <dt className="font-body text-caption font-medium uppercase tracking-eyebrow text-muted">
                      {t.label}
                    </dt>
                    <dd className="m-0 font-display text-d5 font-extrabold leading-none tabular-nums text-deep">
                      {t.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="m-0 mt-6 font-body text-dato font-light leading-[1.65] text-body/75">
                Ten by ten feet is the standard space, there is electricity if you ask for it
                ahead, and the last approval happens at check-in on the day. We have not published
                the next market days here yet, so write the ones you want into the form and we come
                back to you with what is open.
              </p>
            </div>
          </article>

          {/* ── Lo que trae el vendor ───────────────────────────────────── */}
          {/*
            ⚠️ LA TARJETA LLEVA EL TROQUEL PUNTEADO, que es LA forma de tarjeta
            de este sitio: el filete interior a `inset-3.5` con `rounded-shell`,
            el mismo número que tienen las columnas de `CompareSlab`, las losas
            de tipo de evento de `/events`, el panel de `FormSlab`, la tarjeta de
            happy hour de `/sunset-bar` y el banner de `/food-trucks`.

            ⚠️ EL PADDING ES 8/10 Y NO ES CAPRICHO: el troquel se come 14px por
            lado, así que con `p-7` el texto quedaba a 14px del filete en vez de
            respirar. Es el mismo ajuste que tienen las otras troqueladas.
          */}
          <article className="relative flex h-full flex-col rounded-shell bg-bone p-8 lg:p-10">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-3.5 rounded-shell border border-dashed border-terra/45"
            />

            <div className="relative flex h-full flex-col">
              <Eyebrow tone="terra">On you</Eyebrow>
              <Heading level={3} className="mt-gap-kicker">
                You bring
              </Heading>
              {/* El filete lleno separa el anuncio de la lista, igual que el
                  `hr` que parte la columna izquierda de `FormSlab`. */}
              <ul className="mt-7 flex list-none flex-col gap-3.5 border-t border-ink/15 p-0 pt-6">
                {PROVIDES.vendor.map((i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 font-body text-lead font-light leading-[1.5] text-body/85"
                  >
                    {/* El punto naranja es el mismo separador que llevan las
                        etiquetas de los tickets: uno de los pocos lugares donde
                        el `sunset` aparece fuera de un CTA. */}
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
        /*
          ⚠️ LA BAJADA YA NO CUENTA CAMPOS. Camila, 2026-09-22, sobre la
          captura: «ojo con todas las bajadas: siempre deben explicar o dar
          indicios del contenido, pero no explicar qué hacer. En este caso creo
          que tanto la bajada como el "tenlo listo" deben revisarse y pueden
          unificarse».

          Decía «Eleven fields, and most of them are one line», que es una
          descripción del formulario que se ve al lado, y debajo un bloque
          «Have it ready» enumeraba lo que ese mismo formulario pide, campo por
          campo. Dos textos sobre el mismo formulario, uno arriba del otro.

          Unificados queda una sola idea —qué mirar de tu trabajo y cuándo
          contestamos— y la columna baja de cuatro bloques a dos.
        */
        lead="Show us your work and tell us which market days you are after. A person reads it and answers within one business day."
        aside={
          /*
            ⚠️ ACÁ ARRIBA HABÍA UN BLOQUE «HAVE IT READY» con lo que el
            formulario pide, y un rótulo «Or skip the form» encima del mail.
            Los dos se fueron el 2026-09-22: el primero se fundió en la bajada
            (ver arriba) y el segundo lo tachó Camila en la captura, igual que
            en `/events` y en `/join-us`. Estaba al lado de un formulario y lo
            primero que hacía era ofrecer no usarlo.

            ⚠️ EL MAIL Y EL TELÉFONO SE QUEDAN. No son una alternativa que haya
            que anunciar: son los datos de contacto del venue, y quien prefiere
            escribir en vez de llenar once campos los tiene a la vista sin que
            la página se lo sugiera.
          */
          <div className="flex flex-col gap-1.5">
            <a href={`mailto:${venue.email}`} className="link-texto font-body text-base">
              {venue.email}
            </a>
            <a href={venue.phoneHref} className="link-texto font-body text-base">
              {venue.phone}
            </a>
          </div>
        }
      >
        <MarketVendorForm />
      </FormSlab>

      {/*
        ══════════════════════════════════════════════════════════════════
        ⚠️ ACÁ IBA EL CIERRE «THE TRUCKS COOK WHILE YOU SHOP» Y SE BORRÓ EL
        2026-09-22. Camila, sobre la captura: «elimina esta sección».

        Era el bloque K del kit: banda `cream` montada con `banda-arco`, el
        azulejo del brand book como calcomanía, titular, bajada, dos botones
        —«Food trucks» y «Sunset Bar»— y la dirección con el teléfono. Es la
        misma pieza que se sacó el mismo día de `/our-story` y `/game-truck`, y
        por el mismo motivo: los dos links están en el header de todas las
        páginas y la dirección en el footer.

        ⚠️ ESO DEJA AL FORMULARIO COMO ÚLTIMO BLOQUE, que es lo correcto en una
        página cuyo trabajo es que alguien pida una mesa. El cierre le ponía
        detrás una invitación a hacer otra cosa.

        ⚠️ Y CAMBIA QUÉ PINTA LAS ESQUINAS DEL FOOTER. El footer monta con
        `banda-arco` y lo que se ve en sus dos esquinas es el fondo del hermano
        anterior: era esta banda crema y ahora es el `paper` de la losa del
        formulario.
        ══════════════════════════════════════════════════════════════════
      */}
    </>
  );
}
