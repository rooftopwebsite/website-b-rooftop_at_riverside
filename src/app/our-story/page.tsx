import Link from 'next/link';
import type { Metadata } from 'next';
import Image from 'next/image';
import AboutStory from '@/components/sections/AboutStory';
import FindUs from '@/components/sections/FindUs';
import HowToOrder from '@/components/sections/HowToOrder';
import VenueTabs from '@/components/sections/VenueTabs';
import { Reveal, RevealItem, StaggerGroup } from '@/components/shared/Motion';
import { PhotoPending } from '@/components/shared/PendingData';
import PlateHero from '@/components/shared/PlateHero';
import Section from '@/components/shared/Section';
import SoftWave from '@/components/shared/SoftWave';
import { Heading } from '@/components/shared/Type';
import { PEOPLE } from '@/content/people';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';
import { getVenue } from '@/lib/venue';

export const metadata: Metadata = pageMeta({
  route: '/our-story',
  image: {
    url: '/og/our-story.jpg',
    width: 1200,
    height: 630,
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
/**
 * ⚠️ ACÁ VIVÍA `NUMEROS`, LA TIRA DE CIFRAS, y se borró el 2026-09-22. Camila,
 * sobre la captura: «esta parte borrémosla, porque los lugares, que es lo más
 * importante, ya se nombra después».
 *
 * Eran cuatro: 4 años de planificación, 5 lugares en dos plantas, 4 cocinas
 * independientes y 1 barra propia. Los cuatro se siguen diciendo en la misma
 * página y con más contexto: los años en el primer párrafo de `AboutStory`,
 * los cinco lugares en `VenueTabs` —que es la sección a la que Camila apunta—,
 * y las cocinas y la barra en `HowToOrder`.
 *
 * ⚠️ CON ELLA SE VA EL ÚNICO USO DE `SpecSlab` EN ESTA PÁGINA. El componente
 * sigue vivo: lo usa `/game-truck`.
 */

/** La persona cuya frase abre la sección de la cita. Ver `content/people.ts`. */
const CHRIS = PEOPLE[0];

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

        ⚠️ EL HERO YA NO LLEVA BAJADA. La tenía y decía los mismos hechos que
        el párrafo de `AboutStory`, una pantalla más abajo: la familia local,
        la esquina de Old 41, el parque enfrente. Camila, 2026-09-22: «unifica
        el párrafo con la bajada del hero para unirlas y tratarlo como en
        "Dentro del camión" de la página game truck».

        Así que el texto no se borró, se mudó: es el segundo párrafo de
        `AboutStory`, que ahora abre la página. `/game-truck` recibió el mismo
        movimiento el mismo día y `/sunset-bar` ya abría así.

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
        title={'A Magnus '}
        titleAccent="family project"
        photo="/images/venue/story-yard-day-wide.webp"
        photoAlt="The yard at Rooftop at Riverside seen from the rooftop: picnic tables and umbrellas on the turf, with the building's roof edge on the right"
      />

      {/* ══ 2. El relato ══════════════════════════════════════════════════ */}

      <AboutStory />

      {/* ══ 3. La frase ═══════════════════════════════════════════════════ */}

      {/*
        ══════════════════════════════════════════════════════════════════
        LA CITA DE CHRIS MAGNUS, EN UNA SECCIÓN PROPIA.

        Camila, 2026-09-22, sobre la captura: «la frase pongámosla en una
        sección separada, con fondo distintivo y que tenga mucho espacio para
        que destaque».

        Estaba adentro de `AboutStory`, como un `<figure>` con filete naranja
        entre el párrafo de arriba y el programa de donaciones de abajo: o sea
        la única declaración de intenciones del dueño, del tamaño de un
        subtítulo, apretada entre dos bloques de prosa.

        Las tres cosas que pidió, y cómo se cumplen:

          · SECCIÓN SEPARADA — es un `<Section>` propio, entre el relato y el
            equipo, y por eso el equipo quedó justo después: «que el equipo
            vaya luego de la frase», mismo pedido.
          · FONDO DISTINTIVO — `cream`, el amarillo del brand book. Es el
            único lugar donde aparece en esta página, así que la banda se
            reconoce sola.
          · MUCHO ESPACIO — `band="xl"`, el paso más alto del ritmo (96px en
            celular, 160 en desktop), con la cita sola y centrada en una caja
            de 24 caracteres de medida.

        ⚠️ EL CUERPO ES DE TITULAR Y NO DE CITA. `d3/d2` es el tamaño con el
        que la página escribe sus `h2`: acá el texto ES el titular de la banda,
        no una nota al pie de otra cosa. Por eso tampoco lleva un `h2` propio
        —sería un título arriba de un texto del mismo tamaño— y la sección se
        rotula con un `aria-label`.

        ⚠️ SIGUE SIENDO UN `<blockquote>` CON SU `<cite>`, como cuando vivía en
        `AboutStory`: es palabra de una persona identificada y la estructura
        tiene que decirlo. El texto es TEXTUAL de `/this-is-us`.

        ⚠️ LAS COMILLAS SE DIBUJAN. Sin ellas, un bloque de 58px centrado sobre
        amarillo se lee como el eslogan del venue y no como algo que alguien
        dijo. Van en `sunset-deep`, aparte del texto y con `aria-hidden`: un
        lector de pantalla ya sabe que esto es una cita por el `<blockquote>`.

        ⚠️ `cream` ES «PÍLDORAS Y BOTONES, NO FONDOS GRANDES» según el token, y
        ésta es la excepción que ya tenía el sitio: el cierre de `/our-story`
        era una banda `cream` entera hasta que se borró ese mismo día. La banda
        no desaparece de la página, cambia de contenido.
        ══════════════════════════════════════════════════════════════════
      */}
      {/* ⚠️ LA OLA ENTRE EL RELATO (`bone`) Y LA CITA (`cream`), desde el
          2026-09-23. Camila: «faltan olas acá». Era el único cambio de
          superficie de la página que cortaba en recto. */}
      <SoftWave from="bone" to="cream" className="relative -mb-px" />
      <Section tone="cream" band="xl" aria-label="What this place is for">
        <Reveal>
          <figure className="m-0 text-center">
            <span
              aria-hidden="true"
              className="block font-display text-d1 font-extrabold leading-[0.6] text-sunset-deep"
            >
              &ldquo;
            </span>
            <blockquote className="m-0">
              {/* 28 / 36 / 46 / 58 desde el 2026-09-23; arrancaba en 46. Camila: «en
                  mobile esta frase debe ser más chica». A 46 eran diez renglones
                  en un teléfono, o sea una pantalla entera de cita. */}
              {/* ⚠️ Desde `md` la cita va al ancho de la caja (2026-09-23). Camila: «en
                  tablet y desk haz que la frase se adapte al max ancho». Con
                  24ch quedaban siete renglones angostos en el medio de la banda. */}
              <p className="m-0 mx-auto max-w-[24ch] text-balance font-display text-d5 font-extrabold uppercase leading-[1.05] text-ink sm:text-d4 md:max-w-none md:text-d3 lg:text-d2">
                {CHRIS.quote}
              </p>
            </blockquote>
            <figcaption className="mt-8 font-body text-caption font-bold uppercase tracking-eyebrow text-deep">
              <cite className="not-italic">{CHRIS.name}</cite>, {CHRIS.role}
            </figcaption>
          </figure>
        </Reveal>
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
        ⚠️ LA OLA VA `cream → deep` PORQUE ARRIBA ESTÁ LA BANDA DE LA CITA. La
        ola se dibuja del color de la sección de ARRIBA, así que este valor se
        mueve cada vez que algo cambia de lugar en la página: con el color
        equivocado se ve un escalón justo en el corte. Es la misma trampa que
        `CompareSlab` documenta con su prop `from`.

        ⚠️ Y ES LA TERCERA VEZ QUE SE MUEVE: fue `bone` cuando arriba estaba la
        tira de cifras en hueso, `paper` cuando esa tira pasó a papel, y `cream`
        desde el 2026-09-22, cuando la tira se borró y la cita ocupó su lugar.
        Ese día se quedó en `paper` un rato y lo agarró
        `npm run check:surfaces`, que desde el mismo día también mira las olas.
      */}
      <SoftWave from="cream" to="deep" className="relative -mb-px" />

      <Section tone="deep" band="lg" labelledBy="people-title">
        <div className="text-center">
          <Heading level={2} id="people-title" className="text-banda">
            Meet <span className="text-sunset">the team</span>
          </Heading>
          {/*
            ⚠️ ACÁ IBA «TWO OF THEM RUN THE PLACE» Y SE FUE EL 2026-09-22.
            Camila, sobre la captura: «saca el "Dos de ellos dirigen el lugar"».

            Venía de calcar el renglón de conteo de la referencia —allá dice «90
            gepassioneerde foodtruckers»— y con dos personas no contaba nada:
            debajo se ven exactamente dos tarjetas. Y encima se leía raro, como
            si hubiera un equipo más grande del que estos dos fueran una parte.

            ⚠️ VUELVE UNA BAJADA, PERO QUE NO CUENTA, desde el 2026-09-23.
            Camila: «a esta sección le falta una bajada». Dice quiénes son los
            dos —la familia que armó el lugar y quien lo corre— sin prometer un
            equipo más grande, que era el problema de la anterior.
          */}
          <p className="bajada mx-auto mt-gap-bajada max-w-[46ch] text-paper/85">
            The family that dreamed the place up, and the person who runs it every night.
          </p>
        </div>

        {/*
          ══════════════════════════════════════════════════════════════════
          LAS TARJETAS DE PLACA, QUE ANTES ERAN RETRATOS CENTRADOS.

          Camila, 2026-09-22, con el prompt y la imagen pegados en el
          feedback: «dales otro estilo a las cards, que sean así como te dejo
          en el prompt y la imagen debajo».

          Lo que describe ese prompt, punto por punto: tarjetas verticales 3/4,
          imagen a sangre, y una PLACA clara al pie posicionada en absoluto que
          en reposo está desplazada hacia abajo mostrando sólo el título; al
          hacer hover la placa sube, el cuerpo pasa de opacidad 0 a 1 y la placa
          cambia a fondo de acento. Sólo `transform` y `opacity`, 160ms, y tiene
          que funcionar también con tap.

          ⚠️ EL DESPLAZAMIENTO ES `translate-y-19` (76px) Y ESO ES UNA SUMA:
          los 56 del cajón más los 20 del `p-5` de abajo. Ésa es toda la
          mecánica: la placa baja lo que mide lo que hay que esconder, así que
          en reposo se ve el nombre y nada más.

          ⚠️ LA PRIMERA VERSIÓN BAJABA 56 Y SE VEÍA MAL: sin contar el padding
          inferior, el rol asomaba debajo del nombre. Si el cajón cambia de alto
          —una tercera línea, otro cuerpo— o cambia el padding de la placa, este
          número se mueve con ellos o queda un recorte a mitad de renglón.

          ⚠️ EL CAMBIO DE COLOR ES UNA CAPA CON `opacity`, NO UN
          `background-color` QUE TRANSICIONA. La regla de motion del repo es
          «sólo transform y opacity» (`docs/layout-motion.md`), y el prototipo
          de Camila resuelve exactamente igual con un `::before`. Acá es un
          `<span>` absoluto porque necesita quedar DEBAJO del texto, y un
          pseudo-elemento de Tailwind no se ordena tan cómodo.

          ⚠️ EL ACENTO PASÓ A `mint` EL 2026-09-23. Camila: «no le pongas naranja
          en el hover o en mobile a cada card, vibra mucho y compite; usemos uno
          de los verdes o celeste secundario». Sobre la banda `deep`, dos
          placas naranjas eran lo más fuerte de la página. `ink` sobre `mint`
          da 15:1. Lo de abajo queda de historia:

          ⚠️ EL ACENTO ERA `sunset` CON TEXTO `ink`, y el prompt pedía «texto
          blanco». No se puede: el token lo dice en su propia línea —«el texto
          encima va NEGRO: blanco da 2.54:1»—. El prompt venía de otro sistema
          de color, donde el naranja de hover es #CC4700 y el blanco encima da
          4.70:1. Con el naranja de ESTA marca, el que pasa es el negro.

          ⚠️ EN PANTALLAS SIN HOVER LA PLACA ESTÁ SIEMPRE ARRIBA. El
          `max-lg:translate-y-0` es lo que cumple el «debe funcionar también con
          tap» sin un `useState`: en un teléfono no hay estado de reposo que
          valga la pena, porque nadie va a descubrir que la tarjeta esconde algo.
          Y de paso no queda el hover pegado después de tocar, que es el bug
          clásico de esta pieza.

          ⚠️ SE DISPARA TAMBIÉN CON `focus-within`: adentro de la placa hay un
          mail que es un link real, así que tabulando hasta él la tarjeta se
          abre sola. Sin eso, el foco caería sobre algo invisible.

          ⚠️ EL `grayscale` SE FUE. Estaba puesto para cuando llegaran los
          retratos —copiaba la referencia— y llegaron el 2026-09-22, del propio
          `/this-is-us` del cliente. En blanco y negro, la foto de Chris (que es
          su familia entera con las remeras del venue) pierde justo lo que la
          hace valer. Ver `content/people.ts`.
          ══════════════════════════════════════════════════════════════════
        */}
        <StaggerGroup
          as="ul"
          className="mx-auto mt-bloque grid max-w-[46rem] list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2"
        >
          {PEOPLE.map((persona) => (
            <RevealItem as="li" key={persona.name}>
              <article className="group relative aspect-[3/4] overflow-hidden rounded-shell bg-deeper sombra-card">
                {persona.photo ? (
                  <Image
                    src={persona.photo}
                    alt={persona.photoAlt ?? persona.name}
                    fill
                    sizes="(min-width: 640px) 340px, 90vw"
                    className="object-cover"
                  />
                ) : (
                  <PhotoPending
                    brief={`Retrato de ${persona.name}, vertical 3:4, en el local.`}
                    ratio="aspect-[3/4]"
                    tone="dark"
                  />
                )}

                {/* La placa. Ver la nota de arriba: baja 56px, que es lo que
                    mide el cajón de abajo. */}
                <div className="absolute inset-x-0 bottom-0 translate-y-19 bg-paper p-5 transition-transform duration-200 ease-brand max-lg:translate-y-0 group-hover:translate-y-0 group-focus-within:translate-y-0">
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-mint opacity-0 transition-opacity duration-200 ease-brand max-lg:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100"
                  />

                  <div className="relative">
                    <Heading level={3} className="text-d6 leading-none text-ink">
                      {persona.name}
                    </Heading>

                    {/* El cajón. Alto FIJO de 56px: es lo que permite que la
                        placa se desplace en vez de crecer. */}
                    <div className="mt-3 h-14 overflow-hidden">
                      <p className="m-0 font-body text-caption font-bold uppercase tracking-eyebrow text-ink/70">
                        {persona.role}
                      </p>
                      {persona.email ? (
                        <p className="m-0 mt-1.5 font-body text-base leading-[1.4]">
                          <Link
                            href={`mailto:${persona.email}`}
                            className="link-texto break-all text-ink"
                          >
                            {persona.email}
                          </Link>
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
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

      {/* ══ 7. Dónde queda ════════════════════════════════════════════════ */}

      {/*
        ══════════════════════════════════════════════════════════════════
        ⚠️ ES EL BLOQUE DE LA HOME, TRAÍDO TAL CUAL. Camila, 2026-09-22, sobre
        la captura de esta sección: «duplica aquí el layout de la home, tráelo
        tal cual. Si en otra página también va, haz lo mismo» — y el mismo día,
        sobre `/contact`, pidió lo mismo. Las tres páginas montan ahora
        `sections/FindUs`.

        Lo que se fue era una versión propia del mismo contenido: un titular
        «In the centre, across from the park», una columna con dirección,
        teléfono y mail en display grande, y un `MapEmbed` al lado. Decía lo
        mismo que la home con otra forma, y en la home además están los
        horarios y las redes.

        ⚠️ SE VA CON ÉL EL ÚLTIMO `MapEmbed` DE ESTA PÁGINA. Después `/market`
        también lo dejó, y el componente se borró el 2026-09-23.
        ══════════════════════════════════════════════════════════════════
      */}
      <FindUs />

      {/*
        ══════════════════════════════════════════════════════════════════
        ⚠️ ACÁ IBA EL CIERRE «COME SEE IT ON A WEDNESDAY» Y SE BORRÓ EL
        2026-09-22. Camila, sobre la captura: «borremos esta parte».

        Era el bloque K del kit —panel crema con filete punteado, el medallón
        del brand book en una esquina, titular, bajada y dos botones: «See the
        calendar» y «Plan an event»—, y el kit lo declara obligatorio en las
        nueve internas. Se saca igual, y conviene entender por qué no rompe
        nada: `FindUs` ES un cierre, y uno más útil. Trae la dirección, el mapa,
        los horarios, el teléfono, el mail, las redes y un botón de indicaciones.
        Lo que el bloque K aportaba encima eran dos links a páginas que ya están
        en el header.

        ⚠️ ES LA MISMA DECISIÓN QUE EN `/market` Y `/game-truck`, que recibieron
        el mismo pedido el mismo día sobre sus propios cierres.

        ⚠️ Y CAMBIA EL RITMO DE SUPERFICIES DE LA PÁGINA, que ahora es: hero y
        relato en `bone` · la cita en `cream` · el equipo en `deep` · `VenueTabs`
        · `HowToOrder` en `paper` · `FindUs` en `bone`, entrando con su arco. Una
        sola oscura, ninguna repetida pegada a sí misma, que es lo que pide
        `npm run check:surfaces`.
        ══════════════════════════════════════════════════════════════════
      */}
    </>
  );
}
