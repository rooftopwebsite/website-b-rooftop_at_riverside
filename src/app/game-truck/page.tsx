import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import GameShelf from '@/components/sections/GameShelf';
import SpecSlab from '@/components/sections/SpecSlab';
import { ButtonLink } from '@/components/shared/Button';
import { Balloons, GridFour, Ticket } from '@/components/shared/Icon';
import { Reveal, RevealItem, StaggerGroup } from '@/components/shared/Motion';
import { PendingData } from '@/components/shared/PendingData';
import PlateHero from '@/components/shared/PlateHero';
import Section from '@/components/shared/Section';
import SoftWave from '@/components/shared/SoftWave';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
import {
  CONSOLES,
  GAMES,
  GAMES_TOTAL,
  PACKAGES,
  PACKAGE_INCLUDES,
  RATES,
  SCREENS,
} from '@/content/game-truck';
import { LEGAL_DOCS } from '@/content/legal-docs';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';
import { getVenue, venueAddressLine } from '@/lib/venue';

export const metadata: Metadata = pageMeta({ route: '/game-truck' });

/**
 * `/game-truck` — la segunda página con precios del sitio.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ REDISEÑADA EL 2026-09-22, junto con `/our-story`. Camila: «en base a los
 * layouts y diseños que ya hicimos en este proyecto rediseñá la página de
 * gaming y about, seguí la línea estética al 100 %, usá los componentes que ya
 * tenemos, el hero como corresponde».
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠️ EL HERO PASA A `PlateHero` Y DEJA `DiscHero`, que era el calco de la
 * ficha de camión de `defoodtruckclub.nl/foodtrucks/pizza-foodtruck`: el
 * nombre gigante sobre un disco crema con la foto apoyada en el centro.
 *
 * `DiscHero` no era malo, era el ÚLTIMO hero suelto del sitio junto con el de
 * `/our-story`. Las cinco internas grandes ya abrían con la placa, y el propio
 * archivo de `DiscHero` dejó escrito el camino: «si algún día molesta que no
 * haya una sola forma de abrir una interna, el camino es llevar ESE hero a las
 * demás, no volver éste atrás». Con este commit las siete abren igual.
 *
 * Y de paso arregla lo que el disco no cumplía: el titular iba MONOCROMO, en
 * dos cuerpos de tinta, y la regla del repo es que en todo hero al menos una
 * palabra del titular va en color.
 *
 * ⚠️ `DiscHero.tsx` NO SE BORRA. A diferencia de `AboutHero`, que se fue con
 * `/our-story` porque era una pieza de una sola página, el disco es el
 * template que quedó guardado al unificar los cuatro food trucks («se reutiliza
 * en /game-truck», dice ese commit). Sigue en `shared/` sin call sites, igual
 * que `StepStair`.
 *
 * ⚠️ EL H1 NO CAMBIA NI UN CARÁCTER. `PAGE_SEO` fija «Southwest Florida's first
 * gaming truck» y `npm run check:seo` lo compara literal. Lo único que cambia
 * es dónde parte el renglón: `DiscHero` lo partía en dos CUERPOS distintos
 * —chico arriba, 112px abajo— porque el disco no tolera cuatro renglones de
 * titular; `PlateHero` lo parte en dos RENGLONES del mismo cuerpo, que es su
 * contrato. Ver la nota del hero, abajo.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠️ LA TIRA DE CUATRO FOTOS SE FUE, Y ERAN TRES HUECOS Y UNA FOTO DE STOCK.
 * Del gaming truck no hay una sola foto en la entrega del cliente: la única
 * imagen usable es el joystick de stock, y `/images/game-truck.jpg` es el
 * flyer de Instagram con el logo quemado. Cuatro casillas de las que tres eran
 * rectángulos grises no marcan un pendiente, se leen como una página a medio
 * terminar.
 *
 * ⚠️ EL PEDIDO NO SE PIERDE: queda UN hueco, el del hero, con el brief de la
 * toma que de verdad hace falta. Un marcador que se ve es el que se pide;
 * cuatro seguidos son decoración.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠️ SEGUNDA PASADA, EL MISMO DÍA, DESPUÉS DE AUDITAR EL REFERENTE ENTERO.
 * Camila pidió revisar el trabajo contra las páginas de `defoodtruckclub.nl`
 * («todas las páginas de nuestro mayor referente») y aplicar lo que saliera.
 * Se auditaron seis: la home, `/over-ons`, `/foodtrucks/pizza-foodtruck`,
 * `/diensten/bbq-catering`, `/inspiratie/italiaanse-catering` y `/faq`.
 *
 * Cuatro cosas cambiaron acá, y las cuatro salieron de esa comparación:
 *
 * 1. VOLVIÓ EL BLOQUE B, el relato. En la primera pasada lo había fundido con
 *    la ficha técnica para sacar la duplicación de las consolas, y eso dejó la
 *    página SIN UN SOLO PÁRRAFO: placa → tabla → lista de juegos → lista de
 *    precios → tarjetas de reglas. El referente hace lo contrario: sus páginas
 *    de producto ponen dos o tres bloques de prosa ANTES de la ficha técnica.
 *    Ver la sección 2.
 *
 * 2. LOS PRECIOS PASARON DE TRES CAJAS A UNA BIFURCACIÓN. Ver la sección 5.
 *
 * 3. LAS POLÍTICAS PASARON AL BLOQUE D, y ese bloque duró un día: el mismo
 *    2026-09-22, más tarde, la sección entera se cambió por tres links. Ver
 *    la sección 6.
 *
 * 4. APARECIÓ EL BLOQUE H, el carrusel de cross-sell hacia las otras internas,
 *    y VOLVIÓ A SALIR el mismo día. Camila, viéndolo montado: «esta parte
 *    borrémosla».
 *
 *    Queda anotado porque el argumento para ponerlo era bueno y alguien lo va
 *    a volver a proponer: el kit lo declara obligatorio para las nueve, el
 *    referente lo repite en todas sus páginas de producto, y esta página
 *    terminaba sin ninguna salida. El argumento en contra es más fuerte y se
 *    ve en pantalla: cuatro tarjetas con foto, rótulo, título, bajada y flecha
 *    son una sección entera, y puesta entre las políticas y el cierre convertía
 *    el final de la página en dos bloques de navegación seguidos. El cierre ya
 *    manda a `/events` y a `/food-trucks`, y el header tiene el resto del sitio
 *    arriba, fijo, en todo momento.
 *
 * Y una quinta que no es de layout: los dos CTA de conversión llevaban a
 * `/events#inquire` pelado, o sea al formulario de eventos privados sin
 * ninguna referencia al camión. Ahora llevan `?area=game-truck` y la casilla
 * correspondiente llega tildada.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠️ ES UN CAMIÓN Y NO UNA SALA, y por eso la ruta no es `/game-room`. El
 * copy del propio cliente dice «right in our specially designed truck» y
 * titula «SWFL's First Gaming Truck Has Arrived».
 *
 * ⚠️ TODOS LOS NÚMEROS SALEN DEL SITIO VIGENTE. Ver `content/game-truck.ts`.
 * Lo único que NO se publica son las cantidades por consola, porque el sitio
 * y el brief se contradicen.
 *
 * ⚠️ LAS POLÍTICAS NO SE RESUMEN ACÁ, SE LINKEAN. Los tres documentos del
 * camión son tres páginas nuestras desde el 2026-09-22 —`/gaming-truck-policies`,
 * `/game-zone-waiver` y `/bar-games-waiver`—, con el texto del cliente
 * TEXTUAL. Esta página pone tres links y una línea. Ver la sección 6.
 *
 * ⚠️ `id="packages"` ES EL DESTINO DEL CTA DEL HERO Y DEL DE `/events`: no se
 * renombra sin tocar los dos.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠️ EL RITMO DE SUPERFICIES:
 *
 *     hero        bone   (la placa y la foto)
 *     el relato   bone   ← comparte la superficie del hero, como la referencia
 *     la ficha    DEEP   ← única oscura, y se entra por la ola
 *     los juegos  paper  ← entra por el arco y sale por la ola
 *     precios     bone
 *     documentos  paper  ← tres links y una línea, sin titular de display
 *     cierre      CREAM  con arco
 *
 * Una sola oscura, una sola crema y ninguna banda de color pegada a otra, que
 * es lo que audita `npm run check:surfaces`.
 */
export default async function GameTruckPage() {
  const venue = await getVenue();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(breadcrumbJsonLd([{ name: 'Gaming Truck', path: '/game-truck' }])),
        }}
      />

      {/* ══ 1. El hero ════════════════════════════════════════════════════ */}

      {/*
        ══════════════════════════════════════════════════════════════════
        ⚠️ EL CORTE DEL TITULAR ES «Southwest Florida's» / «first gaming
        truck», y las dos mitades están elegidas por ANCHO, no por sentido.

        `PlateHero` topea la placa en `100% − 2×--radius-frame`, o sea 1192px
        con el contenedor al máximo. A 112px de cuerpo, el h1 entero en un
        renglón mide del orden de 1200: partido después de «first» el primer
        renglón se pasaría y el titular caería en tres, que es exactamente lo
        que rompe el contrato de dos renglones del que depende el
        solapamiento de `-0.94em`.

        Partido antes de «first», los dos renglones quedan en unos 900 y 870,
        con aire de sobra para las dos esquinas inversas.

        ⚠️ EN CELULAR CAE EN CINCO RENGLONES Y ESTÁ ACEPTADO. A 390px el cuerpo
        baja a unos 51px por el `clamp` de `text-banda` y la placa se topa en
        255px útiles, así que ninguna de las dos mitades entra entera. No es un
        defecto de esta página: `/events` hace lo mismo con «two stories up» y
        cae en tres. Lo que la placa garantiza es que el titular queda ENTERO
        encima de la foto —el solapamiento es `-0.94em` y no depende de cuántos
        renglones haya—, así que lo que cambia es el alto del bloque, no la
        composición.

        La otra salida era acortar el h1, que es lo que hizo `/market`. Acá no
        se hace: «Southwest Florida's first» es la afirmación del propio cliente
        —su sitio titula «SWFL's First Gaming Truck Has Arrived»— y es el único
        diferenciador que tiene la página. Se prefiere un titular alto en
        celular antes que perderla.

        ⚠️ APÓSTROFO RECTO Y NO `&rsquo;`. Es el que tiene el h1 declarado en
        `seo-pages.ts`, y `npm run check:seo` los compara carácter por
        carácter. Es además la convención de los otros titulares del sitio:
        ver `{"Bonita's only rooftop"}` en `/sunset-bar`.

        ⚠️ EL ESPACIO VA ADENTRO DEL PRIMER STRING y no suelto entre los dos
        nodos: entre dos elementos `block`, un nodo de texto suelto arma una
        caja anónima con su propio renglón; pegado al string se colapsa al
        pintar y sigue estando en el texto del h1, que es lo que audita el
        check.

        ⚠️ EL COLOR ES `sunset-deep` Y NO `sunset`. La placa es `bone`, o sea
        superficie clara: el naranja de marca da 2.35:1 ahí y no llega ni al
        3:1 de texto grande. `sunset-deep` da 3.28:1 sobre hueso, que es la
        barra que corresponde porque esto es un titular de display. La regla
        entera está en `Accent`, en `Type.tsx`.
        ══════════════════════════════════════════════════════════════════
      */}
      {/*
        ⚠️ EL HERO VA SIN FOTO Y CON EL HUECO MARCADO, y es el único de las
        siete internas que abre así. No es una omisión: de las 36 fotos y los 5
        videos que entregó el cliente no hay NINGUNA del gaming truck. La única
        imagen del repo que lo nombra, `/images/game-truck.jpg`, es el flyer de
        Instagram con el logo y el texto quemados encima, o sea lo que
        `docs/media.md` lista como material que no sirve.

        La regla del proyecto es que un hueco marcado es lo que hace que la foto
        se pida, y que una foto de stock en un hero es peor que el hueco: le
        miente al visitante y encima disimula que falta. Ese criterio ya sacó
        cuatro heroes de stock el 2026-09-08.

        ⚠️ SE PROBÓ SACARLE UNA FOTO AL REEL DEL CLIENTE Y SE DESCARTÓ MIRÁNDOLA
        EN LA PÁGINA, que es la parte que conviene dejar escrita para que nadie
        la vuelva a probar. `public/multimedia/Gaming Truck.mp4` es la única
        pieza que existe del camión, y `docs/media.md` la descarta como VIDEO
        —es un reel con rótulo quemado y alguien hablando a cámara—, pero un
        FOTOGRAMA suelto no arrastra ninguno de esos dos problemas. Se
        revisaron los 23 segundos cuadro por cuadro:

          · los planos del EXTERIOR están todos desenfocados, porque el plano de
            foco es la presentadora que pasa por delante;
          · los del INTERIOR están nítidos pero son PANTALLAS: recortados a
            17:9 quedan Fortnite y Minecraft ocupando el marco entero. Montado
            en el hero se lee como una captura de un videojuego, no como el
            camión;
          · y el archivo mide 1440px de ancho contra los 2576 del marco, así
            que además entra blando.

        O sea que el hueco no está por falta de intento: no hay una foto del
        camión y la que se podía fabricar decía otra cosa.
        TODO: pedir al cliente las fotos del gaming truck (ver el brief del hueco).
      */}
      <PlateHero
        question="Looking for a gaming truck party in Bonita Springs?"
        title={
          <>
            {"Southwest Florida's "}
            <span className="block text-sunset-deep">first gaming truck</span>
          </>
        }
        /*
          ⚠️ LA FOTO DEL HERO ES LA DEL JOYSTICK, Y ES UNA DECISIÓN DE CAMILA
          DEL 2026-09-22: «la foto integrala al contenido o quitala,
          colocándola directamente en el hero ya que no tenemos imagen aún».

          Antes acá iba el hueco marcado y la foto estaba en la ficha técnica.
          El motivo de aquello sigue anotado y sigue siendo cierto —en una
          tarjeta una foto de stock ilustra, en un hero afirma—, pero la
          alternativa medida era peor: la página abría con un rectángulo gris
          de 1288×590, que es lo primero que se ve de la ruta.

          ⚠️ EL `alt` DICE LO QUE SE VE Y NO LO QUE NOS GUSTARÍA. No afirma que
          esté sacada adentro del camión, porque no lo sabemos: es un joystick
          de stock, el mismo que usa `/events` en su franja del camión.

          ⚠️ EL ARCHIVO ES 3:2 Y EL MARCO 17:9, así que `object-cover` recorta
          arriba y abajo: de 1201px de alto sobrevive la banda del medio, que
          es donde está el joystick. Por los costados no se pierde nada, que es
          lo que importa en esta toma.
          TODO: pedir al cliente las fotos del gaming truck. Sigue siendo el
          pendiente número uno de esta página.
        */
        photo="/images/game-controller.jpg"
        photoAlt="Hands on a PlayStation controller in front of a screen"
      />

      {/* ══ 2. El relato ═════════════════════════════════════════════════ */}

      {/*
        ══════════════════════════════════════════════════════════════════
        EL BLOQUE B DEL KIT: el relato. Titular corto de medida a la izquierda,
        la prosa a la derecha.

        ⚠️ VUELVE DESPUÉS DE HABERSE IDO, y conviene dejar escrito el ida y
        vuelta. El 2026-09-22, al rediseñar la página, fundí «What is in there»
        dentro de la ficha técnica porque las consolas estaban dichas dos veces.
        Eso arregló la duplicación y rompió otra cosa: la página se quedó SIN UN
        SOLO PÁRRAFO. Quedaba placa → tabla de datos → lista de 23 juegos →
        lista de precios → tarjetas de reglas, o sea tres listas seguidas y una
        apertura en oscuro.

        El kit asigna el bloque B a tres páginas y ésta es una («B → Our Story,
        Market, Game Room»). Así que vuelve, pero como PROSA y no como la grilla
        de píldoras que era: las consolas siguen viviendo una sola vez, en la
        fila «Consoles» de la ficha de abajo.

        ⚠️ LA GEOMETRÍA ES LA DE `AboutStory`, un tercio y dos tercios. Es la
        proporción de la referencia y es la que hace que el titular se lea como
        rótulo del bloque en vez de como una columna de contenido. Es la segunda
        vez que aparece en el repo; si una tercera página la pide, sube a
        `shared/` como pasó con `SoftWave` y con `FormSlab`.

        ⚠️ LOS DOS PÁRRAFOS SON LOS QUE YA ESTABAN, textuales: el del trailer
        —que vivía al pie de `SpecSlab` antes del rediseño— y el del Game Coach.
        No se escribió una palabra nueva.

        ⚠️ EL PRIMER PÁRRAFO VA UN ESCALÓN MÁS GRANDE (`lead`, 22px) y el
        segundo en cuerpo. Es el recurso de la referencia y es lo que le da al
        bloque una entrada en vez de un muro.
        ══════════════════════════════════════════════════════════════════
      */}
      {/*
        ══════════════════════════════════════════════════════════════════
        ⚠️ VA EN `bone`, LA MISMA SUPERFICIE DEL HERO, Y ESO ES EL PEDIDO.
        Camila, 2026-09-22, con la captura de
        `defoodtruckclub.nl/diensten/foodtruck-festivals` al lado: «esta sección
        me gustaría que la pongas igual que la refe, debajo de los heros».

        En la referencia la foto del hero y este bloque comparten el mismo panel
        claro: la foto tiene las esquinas redondeadas y el texto cae abajo sin
        que cambie el fondo, así que las dos cosas se leen como UNA portada. Con
        el bloque en `paper` había un escalón de superficie justo debajo de la
        foto y el relato se leía como otra sección.

        ⚠️ Y POR ESO LA OLA VUELVE A `bone → deep`. La ola se dibuja del color
        de la sección de arriba: estuvo en `paper` mientras este bloque lo fue.
        Los dos valores se mueven juntos.

        ⚠️ EL TITULAR ES CORTO A PROPÓSITO. En la referencia la columna
        izquierda es el NOMBRE del bloque en dos renglones —«FOODTRUCK /
        FESTIVALS»—, no una oración. Acá decía «A trailer built for this,
        parked in the yard», que a este cuerpo son cinco renglones y deja de
        leerse como rótulo. Lo que decía no se pierde: es la primera frase de
        la prosa de al lado, textual.

        ⚠️ LA PROSA SUBE A `intro` (25px) Y VA TODA AL MISMO CUERPO. En la
        referencia el bloque es UN párrafo grande, no tres escalones. Antes
        había 22px, 16px y una tercera frase separada por un filete: tres pesos
        distintos en cuatro renglones de texto. El aire acondicionado se fue
        adentro del segundo párrafo, que es donde estaba antes de que yo lo
        separara.
        ══════════════════════════════════════════════════════════════════
      */}
      <Section tone="bone" band="lg" labelledBy="inside-title">
        <Reveal>
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.9fr)] lg:gap-20">
            <Heading level={2} id="inside-title" className="max-w-[9ch] text-d3 lg:text-d2">
              Inside the truck
            </Heading>

            <div>
              {/*
                ⚠️ EL PRIMER PÁRRAFO ERA LA BAJADA DEL HERO. Camila, 2026-09-22:
                «integremos estos dos textos, me parece mucho mejor el cortito
                de arriba; la idea es poder eliminar el de arriba integrando lo
                que dice y los ctas al de abajo para que quede tal cual nuestra
                refe».

                Tiene razón y se ve en la captura: la bajada decía en dos
                renglones lo que abajo tardaba nueve, y las dos estaban a una
                pantalla de distancia diciendo lo mismo. Ahora abre el bloque.

                ⚠️ NO SE PERDIÓ UN SOLO HECHO. Lo que el párrafo corto no dice
                —que el trailer lo construyó el venue, las dos formas de subirse
                y qué hace exactamente el Game Coach— está entero en el segundo.
                Lo que sí se fue es la repetición: «parked in the yard» y «air
                conditioned» se decían dos veces, una en cada texto.

                ⚠️ Y EL HERO QUEDA SIN BAJADA Y SIN CTA, que es la forma de la
                referencia: foto, y el texto recién abajo. No es un caso nuevo
                en el repo —`/sunset-bar` abre igual, con `PlateHero` sin bajada
                ni botones— así que el componente ya lo contempla: los dos
                huecos son condicionales.
              */}
              <p className="m-0 max-w-[52ch] font-body text-intro font-light text-ink">
                Three consoles, {SCREENS} screens and a Game Coach, in an air conditioned trailer
                parked in the yard. Ten dollars gets you on a controller.
              </p>

              <p className="m-0 mt-8 max-w-[52ch] font-body text-intro font-light text-ink">
                The venue built the trailer for this. Get on for half an hour without booking
                anything, or take the whole truck for two hours and bring your own crowd. The Game
                Coach stays on board the whole time: sets up the screens, changes the game when the
                room gets bored of it, and keeps the controllers in circulation. You do not book a
                console, you book the truck.
              </p>

              {/*
                ⚠️ LOS CTA BAJAN ACÁ DESDE EL HERO, en el mismo pedido. Van
                debajo de la prosa y no al lado del titular: en la columna
                angosta de la izquierda una píldora de 42px queda suelta bajo un
                titular de 58, y el orden de lectura es titular, texto, acción.

                ⚠️ `mt-gap-cta` ES EL TOKEN DEL AIRE ENTRE UN PÁRRAFO Y SU
                BOTÓN —24px en celular, 32 en desktop— y no un número escrito a
                mano. Es el mismo que usa `PlateHero` para el hueco del que
                vienen.
              */}
              <div className="mt-gap-cta flex flex-wrap gap-3.5">
                <ButtonLink href="#packages" variant="primary" size="lg">
                  Book a party
                </ButtonLink>
                <ButtonLink href="#games" variant="secondary" size="lg">
                  See the games
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ══ 3. La ficha técnica, en la única banda oscura ═════════════════ */}

      {/*
        ⚠️ LA OLA VA `bone → deep` PORQUE ARRIBA ESTÁ EL RELATO, que comparte
        la superficie del hero. Estuvo un rato en `paper`, mientras ese bloque
        lo fue: la ola se dibuja del color de la sección de ARRIBA y con el
        valor equivocado se ve un escalón justo en el corte. Es la misma trampa
        que `CompareSlab` documenta con su prop `from`, y en esta página ya se
        movió dos veces: si el relato cambia de superficie, esto cambia con él.
      */}
      <SoftWave from="bone" to="deep" className="relative -mb-px" />

      <Section tone="deep" band="lg" labelledBy="specs-title">
        {/*
          ⚠️ SE FUE LA FILA «UNITS OF EACH» CON SU `TBD`. Camila, 2026-09-22,
          junto con el código de la referencia: «eliminá los datos que no
          tenemos». El pendiente no se pierde: el `TODO` sigue escrito en
          `content/game-truck.ts`, que es donde se audita. Lo que desaparece es
          la casilla vacía en la página.

          ⚠️ Y SE FUE LA FOTO DE ESTA SECCIÓN. Ahora está en el hero, que es lo
          que se pidió en el mismo mensaje: «colocándola directamente en el hero
          ya que no tenemos imagen aún».
        */}
        <SpecSlab
          id="specs-title"
          title={
            <>
              The truck, <span className="text-sunset">on paper</span>
            </>
          }
          cifra={{ value: String(SCREENS), label: 'high definition screens' }}
          cifraIcon={GridFour}
          segunda={{
            value: GAMES_TOTAL,
            label: 'games on board',
            note: `${GAMES.length} of them are published. E rated through M rated.`,
          }}
          segundaIcon={Ticket}
          /*
            ⚠️ ERA UN `1` A 72px Y AHORA ES UN PÁRRAFO. Camila, 2026-09-22: «el
            1 no es para destacar, prefiero que eso esté en un párrafo común
            destacando algunas palabras». El porqué está arriba de la prop.

            ⚠️ LAS PALABRAS DESTACADAS VAN EN `deep` Y EN SEMIBOLD, no en el
            naranja de los titulares: `sunset-deep` existe sólo para una palabra
            dentro de un titular de display y no pasa contraste como cuerpo.
            `deep` sobre hueso da 10.03:1.

            ⚠️ NO DICE «THREE CONSOLES». El listado sale de `CONSOLES` y hoy
            tiene tres; escribir el número acá lo dejaría desincronizado el día
            que el cliente sume una. La frase entrega el listado sin contarlo.
          */
          invertidaTexto={
            <>
              There is a <strong className="font-semibold text-deep">Game Coach</strong> on board
              for the <strong className="font-semibold text-deep">whole session</strong>, and these
              are the consoles they run.
            </>
          }
          invertidaDetalle={CONSOLES}
          datos={[
            ['Where', 'The yard, under the rooftop'],
            ['Climate', 'Air conditioned'],
          ]}
        />
        {/*
          ⚠️ LA FICHA YA NO LLEVA PÁRRAFO AL PIE, y es la contracara de haber
          devuelto el bloque B. Ahí abajo vivían el relato del trailer y el del
          Game Coach; ahora son los dos párrafos de la sección de arriba, que es
          donde un relato corresponde. Una ficha técnica que termina en prosa es
          una ficha que no confía en sus propios datos.

          ⚠️ Y POR ESO «Climate» SE ACORTÓ A «Air conditioned»: la coletilla
          «which in Florida is not a detail» pasó a ser el remate del bloque B.
          Estaba dicha dos veces, con una pantalla de distancia.
        */}
      </Section>

      {/* ══ 4. El menú: los juegos ═══════════════════════════════════════ */}

      {/*
        ⚠️ LA SALIDA DE LA LOSA OSCURA ES EL ARCO Y NO UNA SEGUNDA OLA. La
        regla del kit es que se entra por una pieza y se sale por otra: dos
        cenefas iguales en la misma página se leen como un patrón de fondo y no
        como un gesto. Acá entra la ola y sale el arco, que es el radio grande
        de la casa y el mismo corte que la home hace entre sus bandas.

        ⚠️ EL `z-[2]` ES OBLIGATORIO. La sección oscura viene ANTES en el DOM,
        así que sin índice propio pinta su fondo encima de los 88px de arco que
        se montan sobre ella. La página queda en 2 (acá) → 3 (el cierre) → 4
        (el footer), que es el orden ascendente que documenta `globals.css`.
      */}
      <Section
        band="lg"
        /*
          ⚠️ SIN ACOLCHADO ABAJO: la ola ahora vive anclada al pie de la caja
          pegajosa, adentro de esta sección. Con el acolchado de abajo de la
          banda quedarían 128px de aire entre la ola y los precios, y el corte
          volvería a leerse recto, que es justo lo que se vino a arreglar.
        */
        bandBottom="none"
        labelledBy="games-title"
        id="games"
        /*
          ⚠️ `width="full"` Y NO LA CAJA DE SIEMPRE, y es lo que hace que el
          estante llegue al borde de la pantalla. Camila, 2026-09-22: «quiero
          que llegue al borde de la pantalla, no que se corte el frame».

          Con la caja normal el contenido topa en 1280 y el recorte del
          carrusel caía ahí: en un monitor de 1440 la fila se cortaba 80px
          antes del borde. Con `full` la sección entrega todo su ancho y
          `GameShelf` cancela el gutter por dentro para llegar al filo.

          ⚠️ EL ENCABEZADO NO SE SUELTA: `GameShelf` lo vuelve a meter en `caja`
          por dentro, así que el isotipo y el titular siguen midiendo lo mismo
          que en el resto de la página. Lo único que sale a sangre es la fila.
        */
        width="full"
        className="banda-arco z-[2] scroll-mt-24"
      >
        {/*
          ⚠️ EL ISOTIPO ARRIBA DEL TÍTULO SALE DE LA REFERENCIA: su «Het menu»
          abre con el logo de la marca del truck centrado y el listado debajo.
          Acá va el isotipo del camión, que es la pieza de marca que el sitio
          usa para hablar de los trucks.
        */}

        {/*
          ══════════════════════════════════════════════════════════════════
          ⚠️ ACÁ HABÍA UNA MARQUESINA CON LOS 23 NOMBRES Y SE FUE. La tira
          pasaba los títulos en 22px, en loop, y era lo único que la página
          decía de los juegos.

          En la referencia el listado de producto es una LISTA: se lee de
          arriba abajo, se busca el que uno quiere y ahí termina. Es lo que un
          padre que está eligiendo dónde hacer el cumpleaños necesita hacer con
          esta sección, y una tira en movimiento es exactamente lo contrario.

          Y las dos cosas juntas no van: serían los mismos 23 nombres dichos
          dos veces en la misma página, con cuatro renglones de distancia.
          ══════════════════════════════════════════════════════════════════
        */}
        {/*
          ══════════════════════════════════════════════════════════════════
          ⚠️ LOS 23 TÍTULOS PASARON DE UNA LISTA A UN ESTANTE. Camila,
          2026-09-22: «esto podríamos ponerlo diferente, como un carrusel de
          cartas, pero cartas temáticas, que parezcan algo de videojuego (…) y
          que el carrusel con el scroll vaya pasando», con un spec de layout
          adjunto.

          El mecanismo, la forma de la tarjeta, por qué la caja no inventa
          metadatos y por qué esto NO contradice la decisión de sacar la
          marquesina están todos en el encabezado de `GameShelf`.

          ⚠️ LA SECCIÓN SIGUE SIENDO CLARA. Las tarjetas son `deep` pero son
          TARJETAS: el guard de superficies cuenta bandas, no `article`. Es lo
          mismo que hacen `HowToOrder` y la bifurcación de precios de esta
          misma página.
          ══════════════════════════════════════════════════════════════════
        */}
        <GameShelf
          /*
            ⚠️ LA ACLARACIÓN SE ACORTÓ A UNA FRASE. Camila, 2026-09-22: «que
            diga sólo que el camión tiene más de 30 títulos de juegos, lo demás
            sacalo».

            Decía además que 23 son los publicados y llevaba el marcador `TBD`
            de la lista que falta. Los dos eran ruido debajo de un carrusel que
            acaba de mostrar los 23: quien los contó no necesita que se los
            digan, y quien no, no vino a auditar la lista.

            ⚠️ EL PENDIENTE NO SE PIERDE, se muda: el `TODO` de pedirle al
            cliente la lista completa sigue escrito en `content/game-truck.ts`,
            que es donde se audita. Es el mismo trato que tuvo el `TBD` de las
            unidades por consola.
          */
          pie={
            <p className="mx-auto max-w-[62ch] font-body text-base leading-[1.65] text-body/80">
              The truck carries {GAMES_TOTAL} titles.
            </p>
          }
          /*
            ⚠️ LA OLA VIAJA ADENTRO DEL `sticky`, anclada a su pie, para que
            asome durante todo el pegado y no sólo al final. El porqué largo
            está arriba de la prop, en `GameShelf`.
          */
          ola={<SoftWave from="paper" to="bone" className="absolute inset-x-0 bottom-0" />}
        >
          <div className="flex justify-center">
            <Image
              src="/brand/isotype-truck.svg"
              alt=""
              aria-hidden="true"
              width={552}
              height={390}
              className="w-20 lg:w-24"
            />
          </div>

          <SectionHead
            align="center"
            eyebrow="The library"
            eyebrowTone="deep"
            id="games-title"
            title={
              <>
                What is on <span className="text-sunset-deep">the shelf</span>
              </>
            }
            lead="Sports, shooters, racing and everything Nintendo. The coach can put any of these up, and the rating is on you."
            className="mt-8"
          />
        </GameShelf>
      </Section>

      {/* ══ 5. Los precios: la bifurcación y los dos paquetes ════════════ */}

      <Section tone="bone" band="lg" labelledBy="rates-title" id="packages" className="scroll-mt-24">
        <SectionHead
          align="center"
          eyebrow="What it costs"
          eyebrowTone="deep"
          id="rates-title"
          title={
            <>
              Ten dollars, <span className="text-sunset-deep">or the whole truck</span>
            </>
          }
          lead="Two ways to get on. One takes no planning at all, and the other hands you the whole trailer for two hours."
        />

        {/*
          ══════════════════════════════════════════════════════════════════
          LA BIFURCACIÓN: DOS TARJETAS ENFRENTADAS, UNA CLARA Y UNA OSCURA.

          ⚠️ ES LA GEOMETRÍA DE `HowToOrder`, a propósito. Ese bloque explica
          las DOS ventanillas del negocio con una tarjeta clara y una oscura
          enfrentadas, sin tildes ni cruces, porque ninguna de las dos es la
          mala. Acá el problema es idéntico: el camión tiene dos modos —te subís
          sin avisar, o lo reservás— y hasta el 2026-09-22 la página los
          mezclaba en una sola banda de TRES cajas apiladas: una tira de
          tarifas, dos tarjetas de paquete y un panel de «incluye».

          Tres cajas para dos preguntas. Ahora la bifurcación va arriba y las
          dos preguntas se contestan de un vistazo; el detalle de los dos
          paquetes queda debajo.

          ⚠️ LA TIRA DE TARIFAS SE DISOLVIÓ ADENTRO DE LA TARJETA CLARA y el
          panel de «incluye» adentro de la oscura. No se perdió un dato: los
          dos precios de `RATES` y los cinco ítems de `PACKAGE_INCLUDES` se
          siguen leyendo de contenido, no escritos a mano.

          ⚠️ LA TARJETA OSCURA ES UNA TARJETA Y NO UNA BANDA, así que no cuenta
          como segunda superficie `deep` de la página. Es exactamente lo que ya
          hace `HowToOrder` dentro de una sección clara: el guard de superficies
          mide el tono de las secciones y el `bg-` de las secciones crudas, no
          los `div` de adentro.

          ⚠️ Y POR ESO ESTE COMENTARIO NO ESCRIBE EL NOMBRE DE ESA ETIQUETA
          ENTRE SIGNOS. `scripts/surface-rhythm.mjs` la busca con una expresión
          regular sobre el archivo entero, comentarios incluidos: nombrarla acá
          le inventaba a la página una octava sección de color `paper` que no
          existe. El guard daba verde igual, pero listaba una banda de más.

          ⚠️ EL CTA VA SÓLO EN LA OSCURA. La clara no tiene a dónde mandar a
          nadie: subirse cuesta diez dólares y no se reserva. Es el mismo
          criterio con el que `HowToOrder` pone botón en una sola de sus dos.
          ══════════════════════════════════════════════════════════════════
        */}
        <StaggerGroup
          as="ul"
          className="mt-bloque grid list-none grid-cols-1 items-stretch gap-6 p-0 md:grid-cols-2"
        >
          {/* 1 · SIN RESERVAR. Los dos precios de `RATES`, tal cual. */}
          <RevealItem as="li" className="h-full">
            <div className="flex h-full flex-col rounded-shell bg-paper p-7 text-ink sombra-card lg:p-9">
              <div className="flex items-center gap-3.5">
                <Ticket className="size-8 shrink-0" />
                <span className="font-body text-caption font-bold uppercase tracking-eyebrow">
                  Walk up
                </span>
              </div>

              <Heading level={3} className="mt-5 max-w-[16ch] text-d5 lg:text-d4">
                Get on a controller
              </Heading>

              <dl className="m-0 mt-6 flex list-none flex-col border-t border-fog p-0 pt-6">
                {RATES.map((r) => (
                  <div
                    key={r.label}
                    className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-dashed border-ink/15 py-4 last:border-b-0 last:pb-0"
                  >
                    <dt className="font-display text-d6 font-semibold uppercase leading-none text-ink">
                      {r.label}
                    </dt>
                    {/*
                      ⚠️ EL MONTO VA EN `sunset-deep` Y ACÁ SÍ PASA, al revés
                      que la hora extra de las tarjetas de abajo. El naranja
                      oscuro da 3.54:1 sobre blanco, que es el umbral de TEXTO
                      GRANDE: a `d5` son 28px y entra; a 22px no. La regla
                      entera está en la nota de `Accent`, en `Type.tsx`.
                    */}
                    <dd className="m-0 shrink-0 font-display text-d5 font-semibold uppercase tabular-nums text-sunset-deep">
                      ${r.price}
                      <span className="ml-2 font-body text-dato font-normal normal-case tracking-normal text-body/75">
                        {r.unit}
                        {r.note ? `, ${r.note}` : ''}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="m-0 mt-auto pt-8 font-body text-base font-light leading-[1.5] text-body/80">
                No package, no booking, no minimum. Come up to the truck and get on.
              </p>
            </div>
          </RevealItem>

          {/* 2 · RESERVANDO. Lo que trae el paquete, y el único CTA. */}
          <RevealItem as="li" className="h-full">
            <div className="flex h-full flex-col rounded-shell bg-deep p-7 text-paper sombra-card lg:p-9">
              <div className="flex items-center gap-3.5">
                <Balloons className="size-8 shrink-0" />
                <span className="font-body text-caption font-bold uppercase tracking-eyebrow">
                  Book the truck
                </span>
              </div>

              <Heading level={3} className="mt-5 max-w-[16ch] text-d5 lg:text-d4">
                Two hours, the whole trailer
              </Heading>

              <ul className="m-0 mt-6 flex list-none flex-col gap-3.5 border-t border-paper/20 p-0 pt-6">
                {PACKAGE_INCLUDES.map((i) => (
                  <li key={i} className="flex gap-3.5">
                    {/* El punto va a la altura de la primera línea del texto,
                        no centrado en el renglón. Es la misma viñeta que
                        `HowToOrder` usa en su tarjeta oscura. */}
                    <span
                      aria-hidden="true"
                      className="mt-2.25 size-1.5 shrink-0 rounded-pill bg-cream"
                    />
                    <span className="font-body text-base font-light leading-[1.5]">{i}</span>
                  </li>
                ))}
              </ul>

              <span className="mt-auto pt-8">
                {/*
                  ⚠️ EL LINK LLEVA `?area=game-truck` Y ESO NO ES COSMÉTICO.
                  Antes iba a `/events#inquire` pelado, o sea al formulario de
                  eventos privados —quince campos, fechas, presupuesto— sin una
                  sola mención del camión: quien venía a reservar dos horas para
                  un cumpleaños tenía que adivinar cuál de las seis casillas de
                  «áreas» era la suya. Con el parámetro, «The gaming truck»
                  llega tildada. El porqué largo está en `InquiryForm`.
                */}
                <ButtonLink href="/events?area=game-truck#inquire" variant="onDark">
                  Ask about a party
                </ButtonLink>
              </span>
            </div>
          </RevealItem>
        </StaggerGroup>

        {/*
          ══════════════════════════════════════════════════════════════════
          LOS DOS PAQUETES, EN EL TRATAMIENTO DE LA COMPARATIVA DE LA
          REFERENCIA: dos tarjetas claras, filete punteado por dentro y el
          rótulo montado como sticker sobre el borde de arriba.

          ⚠️ EL STICKER LLEVA LOS DÍAS Y NO EL NOMBRE DEL PAQUETE, porque los
          días SON la diferencia. Los dos paquetes se llaman «weeknight» y
          «weekend», que es decir lo mismo dos veces: puesto el rango arriba,
          el nombre del paquete queda libre para el titular y la tarjeta se
          entiende de un vistazo.

          ⚠️ LA ÚNICA OTRA DIFERENCIA ES LA HORA EXTRA, y va sola en su
          renglón. Todo lo demás es idéntico en los dos, así que se dice UNA
          vez y arriba, adentro de la tarjeta oscura de la bifurcación.
          Repetir los cinco ítems en cada tarjeta era el error original:
          parecería que hay dos ofertas distintas cuando hay una con dos
          precios.

          ⚠️ ESTAS DOS TARJETAS SON EL DETALLE, NO LA DECISIÓN. La decisión
          —subirse o reservar— la toma la bifurcación de arriba; acá abajo sólo
          se contesta cuánto sale cada uno de los dos días. Por eso no llevan
          CTA propio: el único de la sección está en la tarjeta oscura.

          ⚠️ LAS TARJETAS VAN EN `paper` SOBRE `bone`. En `CompareSlab` son
          `bone` sobre la losa oscura; acá la sección ya es `bone`, así que la
          tarjeta tiene que ser el tono de más arriba o no se despega: bone
          sobre bone es 1:1.
          ══════════════════════════════════════════════════════════════════
        */}
        <div className="mt-bloque grid items-stretch gap-8 lg:grid-cols-2 lg:gap-10">
          {PACKAGES.map((pkg) => (
            <article
              key={pkg.slug}
              className="relative flex flex-col rounded-frame bg-paper px-6 pt-14 pb-10 text-center sombra-card sm:px-10 sm:pt-16"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-3.5 rounded-shell border border-dashed border-teal600/45"
              />

              {/*
                El sticker, con la misma construcción que los de `CompareSlab`
                y los pasos de la home: `absolute` sobre el borde, partido
                exactamente en el filo por `-translate-y-1/2`, y la plancha de
                color propia detrás para que la sombra siga el contorno de la
                pieza y no el de las letras.
              */}
              <span
                aria-hidden="true"
                className="sticker absolute -top-px left-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
              >
                <span className="block rounded-pill bg-cream px-5 py-2.5">
                  <span className="block font-display text-d6 font-bold uppercase leading-none whitespace-nowrap text-deep">
                    {pkg.days}
                  </span>
                </span>
              </span>

              <div className="relative flex flex-1 flex-col">
                <Heading level={3} className="mt-6 text-d5 lg:text-d4">
                  {pkg.name}
                </Heading>

                <p className="m-0 mt-6 font-display text-titan font-semibold uppercase leading-[0.85] tabular-nums text-ink">
                  ${pkg.price}
                </p>
                <p className="m-0 mt-2 font-body text-lead font-light text-body/80">
                  for {pkg.hours} hours, all in
                </p>

                {/*
                  ⚠️ EL MONTO DE LA HORA EXTRA VA EN `ink` Y NO EN
                  `sunset-deep`, y lo decidió `npm run a11y`. El naranja oscuro
                  da 3.54:1 sobre blanco: alcanza para TEXTO GRANDE, que es lo
                  que son los $10 y los $5 de la tira de arriba a 28px, pero
                  acá el monto va en 22px y a ese cuerpo la barra es 4.5:1. Axe
                  lo marcó `serious` en las dos anchuras.

                  Está dicho en la nota de `Accent`, en `Type.tsx`: este color
                  existe para una palabra dentro de un titular de display y no
                  para acentuar cuerpo.
                */}
                <p className="m-0 mt-auto pt-8 font-body text-base text-body/80">
                  Each extra hour{' '}
                  <span className="font-display text-d6 font-semibold uppercase tabular-nums text-ink">
                    ${pkg.extraHour}
                  </span>
                </p>
              </div>
            </article>
          ))}
        </div>

        {/*
          ⚠️ ACÁ ABAJO HABÍA UN TERCER PANEL —«Both packages include», con los
          cinco ítems en dos columnas y el CTA— y se fue el 2026-09-22. Era la
          tercera caja de la banda, y decía lo que los dos paquetes tienen EN
          COMÚN justo debajo de las dos tarjetas que muestran en qué se
          diferencian: el orden estaba al revés.

          Los cinco ítems y el CTA están arriba, adentro de la tarjeta oscura de
          la bifurcación, que es donde alguien decide si reserva. Ni un dato se
          perdió: los dos bloques leían el mismo `PACKAGE_INCLUDES`.
        */}
      </Section>

      {/* ══ 6. Los documentos ════════════════════════════════════════════ */}

      {/*
        ══════════════════════════════════════════════════════════════════
        ⚠️ ACÁ HABÍA UNA SECCIÓN ENTERA DE POLÍTICAS Y SE FUE EL 2026-09-22.
        Camila, mirando la página: «esta también [borrémosla], solo pongamos
        los tres links de las reglas o políticas pero sin dar tanto
        protagonismo».

        Era el bloque D del kit con siete reglas numeradas en dos columnas
        —supervisión, daños, conducta, comida, juegos M, reserva y
        cancelación— más los tres links al pie. Ocupaba una pantalla entera
        entre los precios y el cierre, y decía el RESUMEN de tres documentos
        que ahora están publicados enteros.

        ⚠️ Y ESE RESUMEN ERA EL PROBLEMA, no su largo. Mientras los documentos
        vivían en el sitio viejo, el resumen era lo único que teníamos; con los
        tres publicados en `/gaming-truck-policies`, `/game-zone-waiver` y
        `/bar-games-waiver`, tener siete reglas parafraseadas acá es tener dos
        versiones de un texto legal en el mismo sitio. El día que el cliente
        cambie una, la que queda vieja es la de la página bonita, que es la que
        todo el mundo lee.

        ⚠️ EL DATO NO SE PERDIÓ: las siete reglas salían de esos tres
        documentos y las tres páginas los publican TEXTUALES, no resumidos.
        Donde antes había una paráfrasis de la política de cancelación, ahora
        están los $25, los $100 y los 14 días con las palabras del cliente.

        ⚠️ ESTA SECCIÓN NO LLEVA `SectionHead`. Es la única de la página sin
        titular de display, y es a propósito: «sin tanto protagonismo» quiere
        decir que no compita con los precios que tiene arriba ni con el cierre
        que tiene abajo. Un rótulo, una línea y tres links.

        ⚠️ EL `id="policies"` SE MANTIENE aunque ya no sea destino de ninguna
        301 —las dos que apuntaban acá se fueron de `next.config.ts` cuando los
        waivers pasaron a ser páginas—. Queda porque es a donde apunta el link
        del pie de los paquetes y porque es la palabra por la que alguien
        busca esto dentro de la página.
        ══════════════════════════════════════════════════════════════════
      */}
      <Section band="md" labelledBy="policies-title" id="policies" className="scroll-mt-24">
        <div className="grid gap-x-12 gap-y-7 border-t border-ink/15 pt-8 lg:grid-cols-[minmax(0,24ch)_1fr]">
          <div>
            <Eyebrow tone="terra">The paperwork</Eyebrow>
            {/*
              ⚠️ EL h2 NO VA EN LA CONDENSADA. La sección existe para no
              llamar la atención, y la display en caja alta es justamente lo
              que hace que un bloque grite. Va en la geométrica al cuerpo de
              `lead`, que es el mismo recurso que usa `.prose-legal h3` para
              un subtítulo que tiene que ordenar sin pesar.

              Se escribe a mano y no con `<Heading role="label">` porque ese
              rol hoy no gana la especificidad contra la display: está
              anotado aparte y se arregla en `Type.tsx`, no acá.
            */}
            <h2
              id="policies-title"
              className="mt-gap-kicker font-body text-lead font-semibold text-ink"
            >
              The rules, in full
            </h2>
          </div>

          <ul className="m-0 grid list-none gap-0 p-0 sm:grid-cols-3 sm:gap-x-8">
            {LEGAL_DOCS.map((d) => (
              <li
                key={d.href}
                /*
                  El filete separa los tres en celular, donde van apilados, y
                  desaparece en la grilla de tres columnas, donde el espacio
                  ya los separa. Es el mismo criterio que la lista de horarios
                  del pie.
                */
                className="border-t border-ink/10 py-4 first:border-t-0 first:pt-0 sm:border-t-0 sm:py-0"
              >
                <Link
                  href={d.href}
                  className="link-texto font-body text-base font-semibold text-ink"
                >
                  {d.label}
                </Link>
                <p className="mt-1.5 max-w-[34ch] font-body text-dato leading-[1.6] text-muted">
                  {d.blurb}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ══ 7. El cierre ═════════════════════════════════════════════════ */}

      {/*
        ══════════════════════════════════════════════════════════════════
        EL BLOQUE K DEL KIT: el cierre, obligatorio en las nueve internas. Es
        el cierre de la referencia —«Trek gekregen?» y «Vragen?», el llamado y
        los datos de contacto uno debajo del otro— con la forma que
        `/food-trucks` ya usa para su banner: panel de esquinas muy
        redondeadas, filete punteado por dentro separado del borde, y el
        isotipo apoyado en una esquina.

        ⚠️ ANTES ERA UNA SEGUNDA BANDA `deep` Y POR ESO LA PÁGINA DABA ROJO en
        `npm run check:surfaces`: con la ficha técnica en oscuro serían dos
        oscuras, y el guard admite una sola cada tres secciones. La crema es la
        otra superficie de color del sitio y acá no compite con nada: la
        sección de arriba es blanca.

        ⚠️ `banda-arco` SE AGREGÓ EL 2026-09-22 y monta este bloque sobre el de
        las políticas con el radio grande de la casa. El hueco que la sección
        anterior necesita lo pone la regla `:has(+ .banda-arco)` de
        `globals.css`; el `z-[2]` no sobra, porque sin él la sección anterior
        —que viene antes en el DOM— pinta su fondo encima de la parte del arco
        que se monta. Es el mismo par que usan el cierre de `/events` y el de
        `/our-story`.

        ⚠️ Y DE PASO PINTA LAS ESQUINAS DEL FOOTER. El footer también monta con
        `banda-arco`, y lo que se ve en sus dos esquinas es el fondo del hermano
        anterior: ahora es esta banda crema.
        ══════════════════════════════════════════════════════════════════
      */}
      <Section tone="cream" band="lg" labelledBy="gt-next" className="banda-arco z-[3]">
        <div className="relative px-2 py-2 text-center sm:px-8 sm:py-6">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-shell border border-dashed border-deep/35"
          />

          <Image
            src="/brand/isotype-truck.svg"
            alt=""
            aria-hidden="true"
            width={552}
            height={390}
            className="pointer-events-none absolute right-8 bottom-8 hidden w-24 opacity-30 sm:block lg:right-12 lg:bottom-10 lg:w-32"
          />

          <div className="relative px-4 py-10 sm:py-12">
            <Heading
              level={2}
              id="gt-next"
              className="mx-auto max-w-[20ch] text-balance text-d3 lg:text-d2"
            >
              It is parked <span className="text-sunset-deep">in the yard</span>
            </Heading>
            <p className="mx-auto mt-5 max-w-[52ch] font-body text-lead font-light leading-[1.5] text-ink">
              Same address as everything else. Come up, play half an hour, and go get something to
              eat from whichever truck smells best.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/events?area=game-truck#inquire" variant="dark">
                Book a party
              </ButtonLink>
              <ButtonLink href="/food-trucks" variant="outline">
                See the food trucks
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
