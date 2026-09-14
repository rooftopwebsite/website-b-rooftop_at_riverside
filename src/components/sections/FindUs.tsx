import Link from 'next/link';
import { ButtonLink } from '@/components/shared/Button';
import HoursCard from '@/components/shared/HoursCard';
import { Reveal, RevealItem, StaggerGroup } from '@/components/shared/Motion';
import { Facebook, Google, Instagram } from '@/components/shared/Icon';
import { BRAND, addressLine, mapsUrl } from '@/lib/brand';

/**
 * «Downtown, across from Riverside Park» — la conversión física.
 *
 * Cierra la home: dónde queda, cómo se llega, a qué hora abre y cómo se
 * contacta. Es la última sección clara antes del footer.
 *
 * ⚠️ YA NO ES CLIENT COMPONENT. Lo era entera por una sola cosa —saber qué
 * día es hoy para resaltar la fila de horarios— y eso ahora vive en
 * `shared/HoursCard.tsx`. Todo lo demás se renderiza en el servidor. Ver la
 * nota de ese archivo.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ EL TITULAR ESTÁ PARTIDO EN DOS Y ES UNA SOLA FRASE: «Downtown, / across
 * from Riverside Park». La primera mitad a la izquierda con las redes al
 * lado, la segunda alineada a la derecha y en naranja.
 *
 * Es el mismo mecanismo del titular de eventos, y está a propósito: son las
 * dos últimas secciones de la home y el eco las emparenta. Pero acá la frase
 * dice una dirección, no un argumento — «Downtown» es el dato que la mitad de
 * la gente busca y por eso va primero, grande y solo.
 *
 * ⚠️ La segunda mitad va en `sunset-deep` y no en `sunset` como el prototipo:
 * el naranja de marca sobre superficie clara da 2.35:1 y no pasa AA ni como
 * titular. `sunset-deep` es ese mismo naranja —mismo hue, misma saturación—
 * diez puntos más oscuro, y sobre el `bone` de esta sección da 3.28:1. El
 * razonamiento completo está en el encabezado de `ThreeDoors.tsx`, que es
 * donde vive esa decisión para toda la home.
 *
 * ⚠️ ACÁ ESTUVO `terra` Y SE FUE junto con el de `ThreeDoors`, en el mismo
 * commit y por el mismo motivo: pasaba contraste de sobra pero se leía rojo
 * ladrillo, y el acento de titular de esta home es naranja.
 *
 * ⚠️ LAS REDES VAN ACÁ ADEMÁS DE EN LA BARRA DE SERVICIO, y no es
 * duplicación por descuido. Arriba son tres iconos de 17px en una franja de
 * servicio: están para quien ya los busca. Acá son tres círculos de 62px en
 * la sección donde alguien decide si va — que es exactamente el momento en
 * que se quiere ver fotos recientes del lugar antes de salir de casa.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ La grilla es de TRES columnas iguales y el mapa es la del medio. Con el
 * mapa a un costado, las dos tarjetas verdes quedaban pegadas y se leían como
 * un solo bloque de 800px de verde. En el medio, cada tarjeta tiene su
 * respiro y el mapa hace de separador.
 *
 * ⚠️ Se monta con un margen negativo que lee `--radius-band` sobre la banda de
 * eventos, igual que
 * `HowThisPlaceWorks` sobre la de What's On. Los dos arcos son el mismo
 * gesto: la superficie clara emerge sobre la oscura.
 */

const SOCIAL = [
  { label: 'Instagram', href: BRAND.social.instagram, Icon: Instagram },
  { label: 'Facebook', href: BRAND.social.facebook, Icon: Facebook },
  { label: 'Google', href: BRAND.social.google, Icon: Google },
] as const;

export default function FindUs() {
  return (
    <section
      id="find-us"
      aria-labelledby="find-us-title"
      className="grano relative z-[3] banda-arco bg-bone pt-16 pb-cierre lg:pt-32"
    >
      <div className="caja-ancha">
        {/*
          ══════════════════════════════════════════════════════════════════
          ⚠️ LAS REDES SE ANCLAN EN EL HUECO DEL TITULAR, Y ES LA MISMA LÓGICA
          QUE YA USA `EventsBanner`. Pedido de Camila, sobre la captura: las
          redes suben y el titular llega hasta el margen derecho.

          El mecanismo es el de allá, calcado: el titular ocupa la CAJA ENTERA
          y la pieza de al lado se posiciona `absolute` dentro del hueco que
          el titular deja libre. En `EventsBanner` el titular es largo arriba y
          corto abajo, así que la bajada se ancla `bottom-0 left-0`; acá es al
          revés —«Downtown,» es corto y «Across from Riverside Park» largo— así
          que las redes se anclan `top-0 right-0`.

          Lo que se gana es lo que Camila marcó con las dos flechas:

            · Las redes suben al renglón de «Downtown,», que es el hueco real.
              Antes iban en flujo y centradas contra el ALTO del h2, o sea a la
              altura del corte entre los dos renglones.
            · El titular recupera los 222px que las redes le comían del
              renglón, así que «Across from Riverside Park» llega al margen
              derecho de la caja en vez de frenar antes.

          ⚠️ ES `absolute` Y NO UN `flex` CON `items-start`. Con flex las redes
          siguen siendo una columna del renglón y le siguen restando ancho al
          titular: subirían, pero el titular no llegaría al margen. Las dos
          mitades del pedido se resuelven con lo mismo, sacarlas del flujo.
          ══════════════════════════════════════════════════════════════════

          ⚠️ APILADO HASTA `desk`, y no es sólo el pedido de «en mobile y tablet
          se apilan y ya»: arregla algo que el `flex-wrap` anterior no
          resolvía. El reparto dependía de si el `<ul>` entraba o no en el
          renglón, y no entraba igual en todos los anchos. Medido: a 390 las
          redes bajaban solas y el titular se quedaba con los 358px enteros,
          pero a 430 —una pantalla MÁS ancha— entraban justo, se llevaban 192px
          y al titular le quedaban 204: «Across from Riverside Park» pasaba de
          dos renglones a CUATRO. Un layout que empeora cuando la pantalla
          crece es el síntoma de que el corte lo está decidiendo el wrap y no
          el diseño.
        */}
        <Reveal className="relative flex flex-col items-start gap-6 desk:block desk:gap-0">
          {/*
            ⚠️ EL CUERPO SE TOPEA EN 88px Y NO EN LOS 112 DE `text-banda`.
            `--text-banda` es `clamp(2.8rem, 7vw, 7rem)`, o sea que abajo de
            1257px esto da exactamente lo mismo que el token; arriba deja de
            crecer.

            Con las redes fuera del flujo el titular SÍ tiene toda la caja,
            que topea en 1168px. Aun así el tope hace falta: «Across from
            Riverside Park» mide 10,5em, o sea 1176px a los 112 de `text-banda`
            —ocho más que la caja— y el renglón se partiría igual. A 105,6px da
            1109, con 59px de holgura. Es el mismo tope que `EventsBanner`, y
            por la misma razón.

            Antes de anclar las redes el tope tenía que ser todavía más bajo
            (88px), porque los iconos le comían 222px al renglón: entra por
            15px a 1280 y NO entra de 1440 para arriba, donde
            el cuerpo llega a 101 y después a 112. Ahí la segunda mitad se
            partía en dos y el titular pasaba a TRES renglones, con las redes
            —centradas contra el alto del h2— cayendo al lado de «Across
            from». Medido a 1440, 1568 y 1920.

            A 88px el texto mide 920 contra los 946 disponibles.

            ⚠️ El tope hay que recalcularlo si cambia el TEXTO del titular o el
            tamaño de los iconos. Las dos cosas están en este mismo archivo.
          */}
          {/*
            ⚠️ EL `pr-6` EXTRA EN MOBILE NO REEMPLAZA AL GUTTER, SE LE SUMA.
            Pedido de Camila: «esto debe estar marginado a la derecha en
            mobile».

            El gutter ya estaba —24px medidos a 360, 390 y 430—, así que no era
            que faltara margen: es que 24px contra una Big Shoulders de 45px en
            caja alta no alcanzan. La mitad de abajo va alineada a la DERECHA y
            en un teléfono cae en dos renglones, así que los dos terminan
            clavados en la misma línea a 24px del vidrio y el bloque se lee
            pegado al borde. En desktop el problema no existe: el renglón es
            uno solo y sobra caja.

            Con los 24 del gutter más estos 24 el titular respira 48 del lado
            derecho, que es el lado por el que se lee.

            ⚠️ Se apaga en `sm`. De ahí para arriba el segundo renglón deja de
            tocar el borde por su cuenta y el padding sólo le robaría ancho a un
            titular que ya entra justo.
          */}
          <h2
            id="find-us-title"
            className="m-0 pr-6 font-display text-[clamp(2.8rem,7vw,6.6rem)] font-extrabold uppercase leading-[0.88] text-ink sm:pr-0"
          >
            {/* Las dos mitades, un solo h2. Ver la nota del encabezado. */}
            <span className="block">Downtown,</span>
            {/*
              ⚠️ LAS DOS MITADES ALINEAN A LA IZQUIERDA. La segunda iba
              `text-right` —era el diseño de origen: «Downtown,» arriba a la
              izquierda y el resto empujado al otro borde, como un bloque en
              diagonal—. Camila lo marcó sobre la página: las dos líneas al
              margen izquierdo.

              El motivo práctico se ve en mobile, que es donde ella lo marcó:
              ahí la segunda mitad cae en DOS renglones, y alineados a la
              derecha los tres quedan en tres puntos de partida distintos. Una
              dirección se lee de corrido, no en zigzag.
            */}
            <span className="mt-1 block text-sunset-deep">Across from Riverside Park</span>
          </h2>

          {/* ⚠️ Sin `order-*`: las redes van DESPUÉS del titular en el DOM, que
              es el orden en que se leen. Tenían `order-first` y quedaban a la
              izquierda de «Downtown,», que es al revés que el diseño.

              ⚠️ `top-0` y no un desplazamiento a mano: el borde de arriba del
              h2 y el de los iconos son el mismo, y los 88px del círculo contra
              los ~93 que mide la mayúscula de «DOWNTOWN,» a este cuerpo dejan
              los dos bloques ópticamente al ras. Si el titular cambia de
              cuerpo, esto sigue solo.

              ⚠️ El `absolute` arranca en `desk`. Abajo de ahí las redes van en
              flujo, debajo del titular, que es lo que pidió Camila para mobile
              y tablet. Ver el bloque de arriba. */}
          {/*
            ⚠️ EL `w-full` ES LO QUE MANDA LAS REDES A LA DERECHA. El
            `justify-end` ya estaba, pero un `<ul>` con `display: flex` dentro
            de un contenedor que no lo estira mide SU CONTENIDO: medido a
            393px, la lista arrancaba en 0 y terminaba 165px antes del borde
            derecho, o sea pegada a la izquierda, y `justify-end` no tenía
            espacio sobrante que repartir. Con el ancho completo, los tres
            círculos se van al margen derecho, que es donde Camila los marcó.

            ⚠️ En `desk` el `absolute` lo deja sin flujo y el `w-full` no
            interviene: ahí la posición la fijan `top-0` y `right-0`.
          */}
          <ul className="flex w-full list-none flex-wrap items-center justify-end gap-3 p-0 desk:absolute desk:top-0 desk:right-0 desk:w-auto">
            {SOCIAL.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-13 place-items-center rounded-pill bg-deep text-cream transition-colors duration-200 hover:bg-sunset hover:text-ink lg:size-15.5"
                >
                  <Icon className="size-5.5 lg:size-6.5" />
                  <span className="sr-only">{label} (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        {/*
          ══════════════════════════════════════════════════════════════════
          ⚠️ EN MOBILE Y TABLET EL ORDEN ES OTRO: mapa, horarios y recién
          después la tarjeta de contacto. Pedido de Camila.

          Y tiene sentido de lectura: apiladas, las tres tarjetas se recorren
          de arriba abajo, así que la primera tiene que contestar la pregunta
          con la que alguien llega a esta sección —«dónde queda»—. El contacto
          es la más larga de las tres y empujaba al mapa y a los horarios abajo
          del pliegue.

          En desktop las tres se ven a la vez, así que el orden visual no manda
          y vuelve el del DOM: contacto, mapa, horarios.

          ⚠️ SE HACE CON `order-*` Y NO MOVIENDO EL JSX, a propósito. El orden
          del DOM es el que leen el lector de pantalla y el tabulador, y ahí
          contacto → mapa → horarios es correcto en las dos disposiciones: la
          tarjeta de contacto lleva el nombre del lugar y encabeza la sección.
          `order` cambia lo que se VE, no lo que se lee.
          ══════════════════════════════════════════════════════════════════
        */}
        <StaggerGroup className="mt-bloque grid grid-cols-1 items-stretch gap-7 md:grid-cols-2 lg:grid-cols-3">
          {/* ── Contacto ─────────────────────────────────────────────── */}
          <RevealItem className="order-3 flex flex-col gap-6.5 rounded-shell bg-deep p-6.5 text-bone on-dark sombra-card lg:order-1 lg:p-9">
            <h3 className="m-0 font-display text-d5 font-bold uppercase leading-none tracking-[0.02em] text-paper">
              {BRAND.name}
            </h3>

            <div>
              <span className="mb-2.5 block font-body text-caption font-medium uppercase tracking-eyebrow text-cream">
                Contact
              </span>
              <a
                href={BRAND.contact.phoneHref}
                className="block font-body text-dato leading-[1.6] text-paper transition-colors duration-200 hover:text-cream"
              >
                {BRAND.contact.phone}
              </a>
              <a
                href={`mailto:${BRAND.contact.email}`}
                className="block font-body text-dato leading-[1.6] text-paper transition-colors duration-200 hover:text-cream"
              >
                {BRAND.contact.email}
              </a>
            </div>

            <div>
              <span className="mb-2.5 block font-body text-caption font-medium uppercase tracking-eyebrow text-cream">
                Location
              </span>
              <address className="m-0 font-body text-dato leading-[1.6] text-paper not-italic">
                {addressLine()}
              </address>
            </div>

            <div>
              <span className="mb-2.5 block font-body text-caption font-medium uppercase tracking-eyebrow text-cream">
                Parking
              </span>
              <p className="m-0 font-body text-dato font-light leading-[1.6] text-paper">
                Street parking on Old 41 and public lots around Riverside Park.{' '}
                <Link href="/visit#parking" className="border-b border-cream text-cream">
                  Details
                </Link>
              </p>
            </div>

            {/* ⚠️ Era un `<a>` con las clases del botón copiadas a mano, y de
                los cuatro CTA sueltos que había era el único que sí imitaba la
                caja alta de `Button` — con lo cual en la misma home convivían
                «GET DIRECTIONS» y «Plan your event». Ahora es el componente, y
                de paso `external` le pone solo el `target`, el `rel`, el icono
                de salida y el aviso para lector de pantalla. */}
            <ButtonLink
              href={mapsUrl()}
              external
              variant="onDark"
              size="lg"
              className="mt-auto w-fit"
            >
              Get directions
            </ButtonLink>
          </RevealItem>

          {/* ── Mapa ─────────────────────────────────────────────────── */}
          {/* ⚠️ `loading="lazy"` es obligatorio y no una optimización: el
              embed de Maps trae su propio bundle y se carga incluso cuando la
              sección está tres pantallas más abajo. Es el recurso más pesado
              de la home. */}
          {/*
            ⚠️ EN TABLET EL MAPA OCUPA LAS DOS COLUMNAS y las otras dos
            tarjetas se reparten la fila de abajo. Pedido de Camila.

            El reparto no es caprichoso: de las tres, el mapa es la única que
            gana con el ancho —es una imagen— y las otras dos son listas de
            datos que a 613px de ancho dejaban medio renglón de aire a la
            derecha de cada dato. Puestas en dos columnas de 300 se leen como
            tarjetas y no como tablas estiradas.

            En `lg` vuelven las tres columnas y el mapa deja de expandirse.
          */}
          <RevealItem className="order-1 min-h-80 overflow-hidden rounded-shell border border-fog sombra-card md:col-span-2 lg:order-2 lg:col-span-1 lg:min-h-110">
            <iframe
              title={`Map showing ${BRAND.name} at ${addressLine()}`}
              src={`https://maps.google.com/maps?q=${BRAND.address.mapsQuery}&z=15&output=embed`}
              loading="lazy"
              className="block size-full min-h-80 border-0 lg:min-h-110"
            />
          </RevealItem>

          {/* ── Horarios ─────────────────────────────────────────────── */}
          <RevealItem className="order-2 lg:order-3">
            <HoursCard />
          </RevealItem>
        </StaggerGroup>
      </div>
    </section>
  );
}
