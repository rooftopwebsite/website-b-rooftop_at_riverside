import type { Metadata } from 'next';
import Image from 'next/image';
import AboutStory from '@/components/sections/AboutStory';
import HowToOrder from '@/components/sections/HowToOrder';
import VenueTabs from '@/components/sections/VenueTabs';
import { ButtonLink } from '@/components/shared/Button';
import MapEmbed from '@/components/shared/MapEmbed';
import { RevealItem, StaggerGroup } from '@/components/shared/Motion';
import { PendingBlock, PhotoPending } from '@/components/shared/PendingData';
import PlateHero from '@/components/shared/PlateHero';
import Section from '@/components/shared/Section';
import SoftWave from '@/components/shared/SoftWave';
import { Heading, SectionHead } from '@/components/shared/Type';
import { PEOPLE } from '@/content/people';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';
import { getVenue } from '@/lib/venue';

export const metadata: Metadata = pageMeta({
  route: '/our-story',
  image: {
    url: '/images/venue/story-yard-day-wide.jpg',
    width: 2576,
    height: 1364,
    alt: 'The yard at Rooftop at Riverside seen from the rooftop, with the picnic tables and the umbrellas',
  },
});

/**
 * Las cuatro cifras del bloque J.
 *
 * ⚠️ LAS CUATRO ESTÁN PUBLICADAS EN ESTA MISMA PÁGINA y ninguna se calculó
 * acá. `4` sale de `STORY_LEAD` («Four years of planning»), `5` del titular de
 * `VenueTabs` («Two floors, five places to be»), y `4` y `1` de `HowToOrder`
 * («Four independent kitchens, each one its own business» y «The bar on the
 * roof is ours, and it is the only tab we keep»).
 *
 * ⚠️ NO SE AGREGA UNA QUINTA. Las candidatas obvias —el aforo y la fecha de
 * apertura— no se publican: el aforo sigue en `PendingData` en `/events` y la
 * fecha está en el brief pero la decisión escrita en `AboutStory` es no usarla.
 * Una cifra estimada en una tira de cifras contamina a las otras tres.
 */
const NUMEROS = [
  { value: '4', label: 'years of planning before it opened' },
  { value: '5', label: 'places to be, across two floors' },
  { value: '4', label: 'independent kitchens in the yard' },
  /* ⚠️ «and the only tab we keep» y no «and it is the only tab we keep», que
     es como lo dice `HowToOrder`. Es el único de los cuatro rótulos que
     partía en dos renglones en desktop, y una tira de cifras con tres
     etiquetas de un renglón y una de dos se lee desprolija. El hecho es el
     mismo; se cae el verbo. */
  { value: '1', label: 'bar upstairs, and the only tab we keep' },
] as const;

/**
 * `/our-story` — de dónde salió el lugar, de qué está hecho y quién lo maneja.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ REDISEÑADA EL 2026-09-22, junto con `/game-truck`. Camila: «en base a los
 * layouts y diseños que ya hicimos en este proyecto rediseñá la página de
 * gaming y about, seguí la línea estética al 100 %, usá los componentes que ya
 * tenemos, el hero como corresponde».
 *
 * Eran las dos últimas internas que abrían con un hero propio. Con ésta, las
 * SIETE internas grandes abren igual.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠️ EL HERO PASA A `PlateHero` Y SE VA `AboutHero`, que era el calco del
 * encabezado de `defoodtruckclub.nl/over-ons`: el video a sangre con el
 * titular cruzándolo en marquesina. Era una pieza buena y el motivo de sacarla
 * no es ése, son tres cosas medidas:
 *
 *   1. EL TITULAR IBA MONOCROMO. La regla del repo es que en todo hero al
 *      menos una palabra del titular va en color, y la marquesina iba entera
 *      en `paper` con un punto naranja de separación. Una palabra en color
 *      dentro de una tira en loop no es lo mismo: pasa de largo.
 *
 *   2. EL H1 NO ERA EL DECLARADO. `PAGE_SEO` fija «A Magnus family project» y
 *      la marquesina decía «One family, one corner of Old 41», o sea que
 *      `npm run check:seo` comparaba dos strings distintos. Ahora el h1 es el
 *      de la tabla, carácter por carácter.
 *
 *   3. LA PÁGINA ESTABA FUERA DE REGLA DE SUPERFICIE. `npm run check:surfaces`
 *      la marcaba en rojo: «2 secciones oscuras (máx. 1 en 3)». La banda del
 *      equipo y el cierre eran las dos `deep`. El cierre pasa a `cream` y la
 *      cuenta vuelve a una sola.
 *
 * ⚠️ EL VIDEO NO SE BORRA. `public/videos/hero-rooftop.mp4` sigue en el repo,
 * con su póster, y `shared/BandVideo.tsx` sigue siendo la pieza para montarlo
 * a sangre. Es el corte de `/hostanevent` del cliente, 15 s y 1,5 MB, y el
 * porqué de ese corte está en el historial de `Hero.tsx`. Si algún día vuelve,
 * vuelve como banda dentro de la página y no como encabezado.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠️ HIZO FALTA FABRICAR LA FOTO DEL HERO. El marco de `PlateHero` es 17:9 y
 * las cinco derivadas de esa proporción que había ya son el hero de
 * `/sunset-bar`, `/whats-on`, `/events`, `/contact` y `/join-us`. La sexta es
 * `story-yard-day-wide.jpg` y sale de `_RCZ8015`: el patio visto desde arriba,
 * que es el único plano de la entrega que muestra la planta entera. El porqué
 * de esa toma, del recorte y de la finalista descartada está en su entrada de
 * `scripts/build-media.mjs`.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠️ LOS BLOQUES NO SE REESCRIBIERON, Y NO POR INERCIA. El relato
 * (`AboutStory`), las pestañas del lugar (`VenueTabs`), la banda del equipo y
 * las dos ventanillas (`HowToOrder`) son piezas verificadas y pedidas una por
 * una. Lo que cambió es el ORDEN y la SUPERFICIE.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠️ SEGUNDA PASADA, EL MISMO DÍA, DESPUÉS DE AUDITAR EL REFERENTE ENTERO.
 * Camila pidió revisar el trabajo contra las páginas de `defoodtruckclub.nl`
 * y aplicar lo que saliera. Tres cosas cambiaron acá:
 *
 * 1. EL EQUIPO SUBIÓ DE LA POSICIÓN 4 A LA 3 y las pestañas bajaron. Lo dicen
 *    las dos fuentes: en `/over-ons` «Meet the team» es el bloque siguiente al
 *    relato, y en nuestro repo la losa oscura va temprano —`/sunset-bar` en la
 *    2, `/market` en la 2, `/events` en la 3—. Ésta la tenía más tarde que
 *    ninguna. El porqué largo está arriba de `VenueTabs`, en la sección 5.
 *
 * 2. ENTRÓ EL BLOQUE J, la tira de cuatro cifras. Ver la sección 3.
 *
 * 3. SE DEJÓ DE REPETIR LA DIRECCIÓN. Estaba en el bloque del mapa y otra vez
 *    en el panel del cierre, a 600px. El referente separa el llamado del
 *    bloque de datos y no repite ninguno. Ver las secciones 7 y 8.
 *
 * ⚠️ NO LLEVA CARRUSEL DE CROSS-SELL, aunque el kit lo pida para «las 9» y
 * `/game-truck` sí lo tenga. Es deliberado y sale de la misma auditoría: las
 * dos páginas institucionales del referente —`/over-ons` y `/faq`— son
 * justamente las únicas que NO lo llevan; cierran con el bloque de contacto.
 * Ésta es nuestro `/over-ons`.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠️ EL RITMO DE SUPERFICIES:
 *
 *     hero         bone   (la placa y la foto)
 *     el relato    bone   ← comparte la superficie del hero, como la referencia
 *     los números  paper
 *     el equipo    DEEP   ← única oscura, y se entra por la ola
 *     el lugar     bone
 *     cómo se pide paper
 *     dónde queda  bone
 *     cierre       CREAM  ← era deep, que es lo que rompía la regla
 *
 * ⚠️ NO HAY SECCIÓN DE PREGUNTAS FRECUENTES. Decisión de Camila del
 * 2026-09-15: «mejor no pongamos preguntas frecuentes». Los datos siguen en
 * `content/faq.ts`, sin renderizar, y `/faq` redirige a esta página entera.
 *
 * ⚠️ `/giveback` TAMBIÉN ATERRIZA ACÁ y sigue teniendo sentido: el Charity
 * Partner Program se renderiza dentro de `AboutStory`.
 *
 * ⚠️ MOTION: los reveals del sistema y nada más. `AboutHero` era el único
 * lugar de la página con una idea de movimiento propia y se fue con él; lo que
 * queda ya cortocircuita solo con `prefers-reduced-motion`.
 */
export default async function OurStoryPage() {
  const venue = await getVenue();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(breadcrumbJsonLd([{ name: 'Our story', path: '/our-story' }])),
        }}
      />

      {/* ══ 1. El hero ════════════════════════════════════════════════════ */}

      {/*
        ⚠️ EL TITULAR PARTE EN DOS RENGLONES Y ESO ES UN CONTRATO, no un
        detalle de escritura: el solapamiento de `PlateHero` es `-0.94em`, que
        es exactamente media placa de DOS renglones. Con uno solo, la foto le
        pasa por encima al titular entero.

        ⚠️ Y EL TEXTO PLANO TIENE QUE DAR «A Magnus family project», que es el
        H1 que fija `PAGE_SEO` y lo que compara `npm run check:seo`. El `<span>`
        parte el renglón y pinta el color; no agrega ni saca una palabra.

        ⚠️ LA BAJADA NO PUEDE SER `STORY_LEAD`, que es lo primero que uno
        escribe acá. Ese párrafo abre `AboutStory`, o sea la sección que viene
        justo abajo: puesto también en el hero, la página arrancaría diciendo
        lo mismo dos veces con una pantalla de distancia. Esta bajada dice los
        mismos hechos con las otras palabras que ya usa el sitio, y ninguno es
        nuevo: la familia es local (`/this-is-us`), la esquina es Old 41
        (`STORY_LEAD`), el parque enfrente es el dato que ya usa `/events`, y
        los cuatro camiones independientes son el negocio.

        ⚠️ NO SE PUBLICA LA FECHA DE APERTURA. Está en el brief, pero la
        decisión escrita en `AboutStory` es no usarla mientras el relato
        funcione sin ella, y acá funciona.

        ⚠️ SIN CTA. `PlateHero` deja el hueco debajo de la foto y acá queda
        vacío a propósito: los dos destinos de esta página son el calendario y
        eventos, y los dos están en el bloque de cierre. Un par de botones
        arriba que llevan a lo mismo que los de abajo es el índice de anclas que
        `/events` ya sacó de su hero.

        ⚠️ SIN MIGAS VISIBLES, igual que `/sunset-bar`, `/whats-on`, `/events`,
        `/contact` y `/join-us`. `PlateHero` las acepta y ninguna de las seis se
        las pasa: arriba del titular hay una pregunta, y una tira de navegación
        entre la pregunta y la placa parte el bloque en dos. El
        `BreadcrumbList` de JSON-LD se sigue emitiendo para Google, que es
        quien lo lee.
      */}
      <PlateHero
        question="Who is behind the rooftop in Bonita Springs?"
        title={
          <>
            {'A Magnus '}
            <span className="block text-sunset-deep">family project</span>
          </>
        }
        lead="One local family, a corner of Old 41 across from Riverside Park, and a bar built on the roof of a yard with four independent kitchens."
        photo="/images/venue/story-yard-day-wide.jpg"
        photoAlt="The yard at Rooftop at Riverside seen from the rooftop: picnic tables and umbrellas on the turf, with the building's roof edge on the right"
      />

      {/* ══ 2. El relato ══════════════════════════════════════════════════ */}

      <AboutStory />

      {/* ══ 3. Los números ════════════════════════════════════════════════ */}

      {/*
        ══════════════════════════════════════════════════════════════════
        EL BLOQUE J DEL KIT: los datos duros. Número grande, etiqueta chica.

        ⚠️ ENTRÓ EL 2026-09-22, al auditar el trabajo contra el referente. La
        home de `defoodtruckclub.nl` cierra con cuatro cifras —«12 Foodtrucks ·
        90 Teamleden · 375+ Cateringen · 400+ Festivals»— y su `/over-ons`
        apoya el relato en «un equipo de 90». Nosotros teníamos la pieza
        (`SpecSlab`, que la usa `/game-truck`) y no la usábamos en la página de
        marca, que es justamente donde una cifra hace de prueba.

        ⚠️ LOS CUATRO NÚMEROS YA ESTABAN PUBLICADOS EN ESTA MISMA PÁGINA y no
        se calculó ninguno: los cuatro años salen de `STORY_LEAD`, los cinco
        lugares del titular de `VenueTabs`, las cuatro cocinas y la barra
        propia de `HowToOrder`. Es el mismo criterio con el que el renglón del
        equipo dice «dos» y no un número redondo: acá no se inventa una métrica
        porque quede bien.

        ⚠️ Y POR ESO NO HAY UN QUINTO. El referente puede poner «375+
        cateringen» porque los contó; nosotros no tenemos ni aforo confirmado
        —sigue en `PendingData` en `/events`— ni fecha de apertura publicada.
        Cuatro cifras verdaderas valen más que seis con una estimada.

        ⚠️ VA EN `paper` Y NO EN UNA BANDA DE COLOR. Es un escalón, no un
        campo: la página ya gasta su única crema en el cierre. Y `band="md"`
        porque son cuatro renglones de texto: con `lg` la banda mide más que
        su contenido.
        ══════════════════════════════════════════════════════════════════
      */}
      <Section band="md" labelledBy="numeros-title">
        <h2 id="numeros-title" className="sr-only">
          Rooftop at Riverside in numbers
        </h2>

        {/*
          ⚠️ EL `<dt>` VA PRIMERO EN EL DOM Y EL NÚMERO SE SUBE CON
          `flex-col-reverse`. Es la misma construcción que `SpecSlab`, y no es
          maquetación: la regla `definition-list` de axe exige que adentro de un
          `<dl>` cada grupo sea un `<dt>` seguido de su `<dd>`. Con el número
          escrito primero el informe da `serious`.
        */}
        <StaggerGroup
          as="dl"
          className="m-0 grid grid-cols-2 gap-x-8 gap-y-10 p-0 lg:grid-cols-4 lg:gap-x-12"
        >
          {NUMEROS.map((n) => (
            <RevealItem key={n.label} className="flex flex-col-reverse border-t border-ink/15 pt-5">
              <dt className="mt-2.5 font-body text-base leading-[1.4] text-body/80">{n.label}</dt>
              {/*
                ⚠️ LA CIFRA VA EN `sunset-deep` Y PASA CONTRASTE PORQUE ES
                GRANDE: 3.54:1 sobre claro es el umbral de texto grande, y acá
                el número arranca en 46px. La regla está en la nota de `Accent`,
                en `Type.tsx`.
              */}
              <dd className="m-0 font-display text-d3 font-extrabold leading-none tabular-nums text-sunset-deep lg:text-d2">
                {n.value}
              </dd>
            </RevealItem>
          ))}
        </StaggerGroup>
      </Section>

      {/* ══ 4. La gente ═══════════════════════════════════════════════════ */}

      {/*
        ══════════════════════════════════════════════════════════════════
        ⚠️ ES «MEET THE TEAM» DE defoodtruckclub.nl/over-ons, CALCADO DE LA
        CAPTURA QUE MANDÓ CAMILA. Pedido literal, 2026-09-16: «para la parte de
        Meet the team copiá esta parte que te dejo en foto tal cual».

        La anatomía de la captura, elemento por elemento:

            banda oscura
            titular centrado, display, caja alta
            renglón de conteo debajo, centrado, en el color de acento
            fila de retratos en blanco y negro, esquinas redondeadas
            el nombre debajo de cada uno, centrado y en caja alta

        ⚠️ EL RENGLÓN DE CONTEO NO PUEDE DECIR UN NÚMERO INVENTADO. Allá dice
        «90 gepassioneerde foodtruckers». Acá el único número verdadero es dos:
        son las dos personas que el cliente publica con nombre y cargo en
        `/this-is-us`. Dice eso y nada más.

        ⚠️ VA EN `cream` Y NO EN `sunset`, aunque el acento de la captura sea el
        rosa de su marca. Medido: `sunset` sobre `deep` da 4.26:1 y este renglón
        es texto normal de 22px, que necesita 4.5. `cream` da 11.87:1 y es el
        acento que el sitio ya usa sobre losa oscura.

        ⚠️ SIN FLECHA DE CARRUSEL. En la captura la fila sigue más allá del
        borde derecho y hay un botón redondo para avanzar. Con DOS personas no
        hay nada a lo que avanzar: una flecha que no lleva a ningún lado es el
        control roto que este proyecto ya sacó de otros lados.

        ⚠️ ES LA ÚNICA BANDA OSCURA DE LA PÁGINA desde el 2026-09-22, y por eso
        entra por la ola. Antes el cierre era una segunda `deep` y
        `npm run check:surfaces` daba rojo.

        ⚠️ LA PALABRA EN COLOR DEL TITULAR VA EN `sunset` Y NO EN
        `sunset-deep`, al revés que en el hero: sobre la losa oscura el naranja
        de marca da 4.26:1 y el oscuro no llega. Es la regla de `Accent` en
        `Type.tsx`, y acá se aplica a mano porque el titular ya lleva su `id`.
        ══════════════════════════════════════════════════════════════════
      */}
      {/*
        ⚠️ LA OLA VA `bone → deep` PORQUE ARRIBA ESTÁ LA TIRA DE NÚMEROS, que
        es `bone`. La ola se dibuja del color de la sección de ARRIBA, así que
        este valor se mueve cada vez que algo cambia de lugar en la página: con
        el color equivocado se ve un escalón justo en el corte. Es la misma
        trampa que `CompareSlab` documenta con su prop `from`.
      */}
      <SoftWave from="paper" to="deep" className="relative -mb-px" />

      <Section tone="deep" band="lg" labelledBy="people-title">
        <div className="text-center">
          <Heading level={2} id="people-title" className="text-d3 lg:text-d2">
            Meet <span className="text-sunset">the team</span>
          </Heading>
          <p className="m-0 mt-4 font-body text-lead font-light text-cream">
            Two of them run the place
          </p>
        </div>

        {/*
          ⚠️ LA FILA TIENE ANCHO TOPE Y VA CENTRADA. En la captura son nueve
          retratos y la fila llena la banda; con dos, sueltos al ancho de la
          caja cada uno mediría 572px y la sección se leería como dos fotos
          enormes de dos desconocidos. El tope los deja en ~340px, que es la
          medida a la que un retrato 3:4 funciona.
        */}
        <StaggerGroup
          as="ul"
          className="mx-auto mt-bloque grid max-w-[46rem] list-none grid-cols-1 gap-10 p-0 sm:grid-cols-2 sm:gap-8"
        >
          {PEOPLE.map((p) => (
            <RevealItem as="li" key={p.name}>
              <article className="text-center">
                {p.photo ? (
                  /*
                    ⚠️ `grayscale` ESTÁ PUESTO Y HOY NO SE VE, porque ninguno de
                    los dos tiene retrato. Va igual: es parte de lo que se pidió
                    copiar tal cual, y dejarlo escrito ahora significa que el día
                    que lleguen las fotos la sección ya se ve como la referencia
                    en vez de descubrirse en ese momento que faltaba.

                    Si con las fotos delante el blanco y negro no funciona, se
                    saca una clase.
                  */
                  <div className="relative aspect-[3/4] overflow-hidden rounded-shell bg-deeper sombra-card">
                    <Image
                      src={p.photo}
                      alt={p.photoAlt ?? p.name}
                      fill
                      sizes="(min-width: 640px) 340px, 90vw"
                      className="object-cover grayscale"
                    />
                  </div>
                ) : (
                  <PhotoPending
                    brief={`Retrato de ${p.name}, vertical 3:4, en el local. Va en blanco y negro.`}
                    ratio="aspect-[3/4]"
                    tone="dark"
                  />
                )}

                {/* El nombre debajo del retrato, centrado y en caja alta, como
                    la captura. El cargo va un escalón abajo: la referencia no
                    lo muestra, pero sin él «Anthony Hayes» no dice nada. */}
                <Heading level={3} className="mt-6 text-d5">
                  {p.name}
                </Heading>
                <p className="m-0 mt-2 font-body text-caption font-bold uppercase tracking-eyebrow text-muted-dark">
                  {p.role}
                </p>
                {p.email ? (
                  <p className="m-0 mt-3.5 font-body text-base">
                    <a href={`mailto:${p.email}`} className="link-texto break-all text-cream">
                      {p.email}
                    </a>
                  </p>
                ) : null}

                {p.bio ? (
                  <p className="m-0 mt-5 font-body text-base font-light leading-[1.65] text-paper/90">
                    {p.bio}
                  </p>
                ) : (
                  <div className="mt-6 text-left">
                    <PendingBlock tone="dark" title={`Short bio for ${p.name}`}>
                      Faltan dos o tres frases en sus propias palabras. Nada de este sitio lo
                      escribe una máquina, así que esto queda vacío hasta que las manden.
                    </PendingBlock>
                  </div>
                )}
              </article>
            </RevealItem>
          ))}
        </StaggerGroup>
      </Section>

      {/* ══ 5. De qué está hecho ══════════════════════════════════════════ */}

      {/*
        ⚠️ ERA UNA GRILLA AGRUPADA POR PISO Y AHORA SON PESTAÑAS. La estructura
        la eligió Camila, 2026-09-16, y el porqué de cada decisión está arriba de
        `VenueTabs`. Los cinco textos y las cinco fotos son los mismos.

        ══════════════════════════════════════════════════════════════════
        ⚠️ BAJÓ UN LUGAR EL 2026-09-22 Y EL EQUIPO SUBIÓ, al auditar la página
        contra el referente. Antes el orden era relato → el lugar → la gente;
        ahora es relato → la gente → el lugar.

        Lo dicen las dos fuentes a la vez:

          · `defoodtruckclub.nl/over-ons` son cuatro bloques y «Meet the team»
            es el TERCERO, inmediatamente después del relato. Es su página
            institucional y pone a la gente antes que a la infraestructura.

          · Y el resto de nuestro repo pone su losa oscura temprano:
            `/sunset-bar` en la posición 2, `/market` en la 2, `/events` en la
            3. Ésta la tenía en la 4 de 7, más tarde que ninguna.

        El orden nuevo además se lee mejor de corrido: de dónde salió, quién lo
        maneja, de qué está hecho, cómo se pide, dónde queda.

        ⚠️ SIGUE EN `bone`, pero por otro motivo que antes. Antes era porque el
        relato, esta sección y las dos ventanillas eran tres bandas claras
        seguidas; ahora es porque cae entre la losa oscura y `HowToOrder`, que
        es `paper`. La alternancia es la misma y el tono no se movió.

        ⚠️ VA SIN PROPS para que `npm run check:surfaces` pueda expandirla: el
        guard sólo sigue los componentes que se usan `<Así />`.
        ══════════════════════════════════════════════════════════════════
      */}
      <VenueTabs />

      {/* ══ 6. Cómo se pide ═══════════════════════════════════════════════ */}

      {/*
        ══════════════════════════════════════════════════════════════════
        ⚠️ EL BLOQUE DE DOS TARJETAS ENFRENTADAS, que en la referencia es
        «ventajas de trabajar con nosotros» y acá es «cómo se pide». El
        reemplazo lo decidió Camila el 2026-09-16 y el porqué entero está
        arriba de `HowToOrder`.

        ⚠️ ES EL MISMO COMPONENTE QUE USAN LAS CUATRO FICHAS DE TRUCK, a
        propósito: la referencia también repite su comparativo en las dos
        páginas. Y en este caso la repetición trabaja, porque lo que explica es
        el malentendido de raíz del negocio.

        ⚠️ Y ES LA SALIDA DE LA LOSA OSCURA. Su tarjeta de la derecha es
        `bg-deep`, o sea que el verde de la banda de arriba baja un escalón más
        y reaparece del tamaño de una tarjeta. Es un corte duro y no una ola: el
        sitio entra a la oscura con la cenefa y sale sin ella, que es lo que ya
        hacen `/events` y `/food-trucks`.
        ══════════════════════════════════════════════════════════════════
      */}
      <HowToOrder />

      {/* ══ 7. Dónde queda: el bloque L ═══════════════════════════════════ */}

      {/*
        ══════════════════════════════════════════════════════════════════
        EL BLOQUE L DEL KIT: el contacto de cierre. Mail y teléfono grandes y
        clickeables, dirección y mapa.

        ⚠️ HASTA EL 2026-09-22 ESTA PÁGINA DECÍA LA DIRECCIÓN Y EL TELÉFONO DOS
        VECES, acá y otra vez en el panel del cierre, a unos 600px de distancia.
        Salió al comparar con el referente: `defoodtruckclub.nl` separa el
        llamado («Trek gekregen?») del bloque de datos («Vragen?») y cada dato
        aparece en uno solo de los dos.

        Así que el reparto queda: ACÁ los datos —dirección, teléfono, mail y
        mapa— y ABAJO sólo el llamado. El cierre perdió su renglón de
        dirección.

        ⚠️ EL MAIL QUE VA ES EL GENERAL Y NO `events@`. La regla está en
        `docs/layout-motion.md` y es de negocio, no de diseño: una consulta de
        $20.000 no puede caer en el mismo buzón que una pregunta sobre el
        horario, así que `events@` vive sólo en el hub de eventos y en
        `/contact`. Es el mismo criterio con el que el footer publica `info@` y
        nada más.
        ══════════════════════════════════════════════════════════════════
      */}
      <Section tone="bone" band="lg" labelledBy="where-title">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div>
            <SectionHead
              eyebrow="Getting here"
              eyebrowTone="deep"
              id="where-title"
              title="Downtown, across from the park"
            />

            <address className="mt-gap-bajada not-italic">
              <p className="text-lead leading-[1.5]">
                {venue.street}
                <br />
                {venue.locality}, {venue.region} {venue.postalCode}
              </p>
              <p className="mt-3 font-body text-base text-body/80">{venue.neighborhood}</p>
            </address>

            {/*
              ⚠️ EL TELÉFONO Y EL MAIL VAN EN DISPLAY Y NO EN CUERPO DE 16px.
              El kit los pide «grandes y clickeables» y el motivo es de uso: en
              un bloque de contacto la mitad de la gente viene a llamar o a
              escribir, no a leer la dirección. Es el mismo tratamiento que
              `/contact` le da a sus tres buzones.

              ⚠️ Y SON `<a>` DE VERDAD, con `tel:` y `mailto:`, no números
              pintados grandes: el alto de la línea a `d5` son 28px de área de
              toque más el padding del renglón.
            */}
            <dl className="m-0 mt-7 flex flex-col gap-5 border-t border-ink/15 pt-7">
              <div>
                <dt className="eyebrow text-body/75">Call</dt>
                <dd className="m-0 mt-2">
                  <a
                    href={venue.phoneHref}
                    className="link-texto font-display text-d5 font-semibold uppercase leading-none text-ink"
                  >
                    {venue.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-body/75">Write</dt>
                <dd className="m-0 mt-2">
                  <a
                    href={`mailto:${venue.email}`}
                    className="link-texto font-display text-d5 font-semibold uppercase leading-none break-all text-ink"
                  >
                    {venue.email}
                  </a>
                </dd>
              </div>
            </dl>

            {/*
              ⚠️ ACÁ IBA UN PÁRRAFO DE ESTACIONAMIENTO Y SE SACÓ EL 2026-09-15.
              Decía «street parking on Old 41, y los lotes públicos de Riverside
              Park, los dos gratis». Ninguna de esas tres afirmaciones tenía
              fuente, y en particular la de «gratis» sigue sin tenerla.

              El mapa apareció el 2026-09-22 y hoy vive dibujado en la sección
              `#parking` de `/contact`, que es la página que manda en cómo
              llegar. Acá NO se repite: este bloque es el cierre de una página
              que cuenta quiénes somos, no la ficha de visita. Si alguna vez se
              decide que el estacionamiento también va acá, va como link a esa
              sección y no como un párrafo gemelo que después se desincroniza.
            */}
          </div>

          <MapEmbed />
        </div>
      </Section>

      {/* ══ 8. Cierre: el bloque K ════════════════════════════════════════ */}

      {/*
        ══════════════════════════════════════════════════════════════════
        EL BLOQUE K DEL KIT: el cierre, obligatorio en las nueve internas.

        ⚠️ ERA UNA SEGUNDA BANDA `deep` Y POR ESO LA PÁGINA DABA ROJO en
        `npm run check:surfaces`: con la banda del equipo en oscuro eran dos, y
        el guard admite una sola cada tres secciones. La crema es la otra
        superficie de color del sitio y acá no compite con nada, porque lo que
        tiene encima es hueso.

        ⚠️ LA FORMA ES LA MISMA QUE LA DEL CIERRE DE `/game-truck`: panel de
        esquinas muy redondeadas, filete punteado por dentro separado del borde,
        y una pieza del brand book apoyada en una esquina. Que las dos páginas
        cierren igual es lo correcto, no una repetición: el kit declara este
        bloque como fijo para las nueve.

        ⚠️ LA PIEZA ES `emblem.svg`, EL MEDALLÓN REDONDO DEL BRAND BOOK, y no el
        isotipo del camión que usa `/game-truck`. Allá el camión es de lo que
        habla la página; acá lo que cierra es la marca entera.

        ⚠️ `banda-arco` MONTA ESTE BLOQUE SOBRE EL DE ARRIBA con el radio grande
        de la casa. El hueco que la sección anterior necesita para no quedar
        tapada lo pone la regla `:has(+ .banda-arco)` de `globals.css`, y el
        `z-[2]` no sobra: sin él la sección del mapa, que viene antes en el DOM,
        pinta su fondo encima de la parte del arco que se monta. Es el mismo par
        que usa el cierre de `/events`.
        ══════════════════════════════════════════════════════════════════
      */}
      <Section tone="cream" band="lg" labelledBy="next-title" className="banda-arco z-[2]">
        <div className="relative px-2 py-2 text-center sm:px-8 sm:py-6">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-shell border border-dashed border-deep/35"
          />

          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-8 bottom-8 hidden w-24 rotate-6 sm:block lg:right-12 lg:bottom-10 lg:w-32"
          >
            <span className="sticker rt-flotar block">
              <Image
                src="/brand/emblem.svg"
                alt=""
                width={260}
                height={260}
                className="block h-auto w-full"
              />
            </span>
          </span>

          <div className="relative px-4 py-10 sm:py-12">
            {/*
              ⚠️ `text-balance` Y NO UN `max-w` MÁS CHICO. Sin él el titular
              partía en «COME SEE IT ON / A WEDNESDAY» y dejaba el artículo
              solo al principio del segundo renglón, que en display de caja
              alta se lee como un error de maquetación. Balanceado parte en
              «COME SEE IT ON / A WEDNESDAY» con los dos renglones parejos.
            */}
            <Heading
              level={2}
              id="next-title"
              className="mx-auto max-w-[20ch] text-balance text-d3 lg:text-d2"
            >
              Come see it on a <span className="text-sunset-deep">Wednesday</span>
            </Heading>
            <p className="mx-auto mt-5 max-w-[52ch] font-body text-lead font-light leading-[1.5] text-ink">
              The calendar is the honest version of this page. Or, if you are the one throwing the
              party, we close the whole place.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/whats-on" variant="dark">
                See the calendar
              </ButtonLink>
              <ButtonLink href="/events" variant="outline">
                Plan an event
              </ButtonLink>
            </div>
            {/*
              ⚠️ ACÁ IBA LA DIRECCIÓN Y EL TELÉFONO Y SE FUERON EL 2026-09-22.
              Los dos datos están en la sección de arriba, a unos 600px, con el
              mapa al lado: repetirlos acá no era énfasis, era ruido. El
              referente separa el llamado del bloque de datos y no repite. Ver
              la nota del bloque L.

              Este panel queda como el bloque K puro: titular, una línea y dos
              destinos. Es lo único que un cierre tiene que hacer.
            */}
          </div>
        </div>
      </Section>
    </>
  );
}
