import Image from 'next/image';
import Link from 'next/link';
import { BRAND } from '@/lib/brand';
import AgencyBar from './AgencyBar';
import { ButtonLink } from './Button';
import NewsletterSignup from './NewsletterSignup';
import { GUTTER } from './Section';
import { SocialLinks } from './Social';
import { Heading } from './Type';

/**
 * Footer con la estructura compartida de la casa (the-orient, santa-maria,
 * casa-pirul, pretty-hens): columna de identidad a la izquierda y columnas de
 * links a la derecha, con la barra de la agencia al pie.
 *
 * Camila: «el footer no tiene el tipo de estructura que trabajamos en la
 * agencia y falta el footer de la agencia, modifícalo, debe tener la estructura
 * de nuestros proyectos; los horarios y dirección, teléfonos, etc. no van
 * allí».
 *
 * ⚠️ SIN HORARIOS, SIN DIRECCIÓN Y SIN TELÉFONO. Es un pedido explícito y tiene
 * una consecuencia que Camila aceptó sabiéndola: en las 20 rutas que no son la
 * home, `/visit` ni `/contact`, esos datos ya no están en ninguna parte. Se le
 * ofreció la alternativa —convertir `FindUs` en un pre-footer global, como hace
 * the-orient— y eligió esto.
 *
 * ⚠️ SE FUE «Last call», la franja de cierre. Pedido de Camila.
 *
 * ⚠️ EL NEWSLETTER VOLVIÓ, Y AHORA SÍ VIVE ACÁ DENTRO. Se había ido del footer,
 * volvió al sitio como banda clara en el layout, y el 2026-09-11 entró
 * definitivamente al footer como tarjeta oscura. Pedido de Camila: «que esto
 * esté en una card más oscura dentro del footer, como pasa con Visit us en el
 * footer de the-orient».
 *
 * El componente sigue siendo `shared/NewsletterSignup.tsx` y ahí está el
 * detalle de por qué existe y qué le falta. Lo que importa desde este archivo:
 * ya NO se monta en `layout.tsx`. Si aparece en los dos lados, sale dos veces.
 *
 * ⚠️ LA FILA LEGAL YA ESTÁ, PERO TODAVÍA NO LINKEA A NINGÚN LADO. Es un
 * pedido explícito de Camila —«acá debe ir como en el resto de los footers de
 * la agencia, los CTA a políticas, cookies y demás (en este caso aún sin
 * linkear a ningún lado)»— y resuelve la objeción que esta misma nota tenía
 * antes: el problema no era mostrar los rótulos, era mandarlos a un 404.
 *
 * Por eso son `<span>` y no `<a>`. Ver el bloque de `LEGALES` más abajo, que
 * explica qué hay que cambiar el día que las páginas existan.
 */

type FooterLink = { label: string; href: string; external?: boolean };

/**
 * Lo que pasa EN el lugar: cómo comés, qué ves, qué alquilás.
 *
 * ⚠️ GIFT CARDS ENTRA ACÁ el 2026-09-11, y es una reparación: es el ÚNICO
 * enlace de comercio que tiene el negocio —Toast, el mismo POS— y en el sitio
 * nuevo había quedado en una sola línea de `/contact`. La `UtilityBar`, que
 * antes lo llevaba, pasó a ser el marquee de horarios y su comentario dice que
 * Gift Cards «queda en el footer»: no quedó. Ahora sí.
 */
const LINKS_LUGAR: readonly FooterLink[] = [
  { label: 'Sunset Bar', href: '/sunset-bar' },
  { label: 'Food Trucks', href: '/food-trucks' },
  { label: 'The Yard', href: '/the-yard' },
  { label: "What's On", href: '/whats-on' },
  { label: 'The Market', href: '/market' },
  { label: 'Gift Cards', href: BRAND.giftCards, external: true },
];

/** La vertical que factura, con sus puertas de entrada. */
const LINKS_EVENTOS: readonly FooterLink[] = [
  { label: 'Private Events', href: '/events' },
  { label: 'Event Spaces', href: '/events/spaces' },
  { label: 'Corporate', href: '/events/corporate' },
  { label: 'Holiday Parties', href: '/events/holiday-parties' },
  { label: 'Request a Proposal', href: '/events/inquire' },
] as const;

/**
 * Conocernos y lo práctico.
 *
 * ⚠️ `/visit` y `/contact` están acá y NO en una columna de datos: los datos
 * salieron del footer, pero las páginas que los tienen siguen a un clic. Es la
 * única compensación honesta que admite el pedido.
 */
const LINKS_CONOCERNOS: readonly FooterLink[] = [
  { label: 'Our Story', href: '/our-story' },
  { label: 'The Experience', href: '/the-experience' },
  { label: 'Visit Us', href: '/visit' },
  { label: 'Contact', href: '/contact' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Join Us', href: '/join-us' },
] as const;

/**
 * ══════════════════════════════════════════════════════════════════════════
 * LOS RÓTULOS LEGALES DE LA FRANJA INFERIOR.
 *
 * ⚠️ SON LOS CUATRO DEL TEMPLATE DE LA AGENCIA, en este orden. No los elegí
 * yo: salen del Figma de Resto Experience —nodo 1255:11114, la fila legal del
 * footer— leído con el MCP antes de tocar este archivo, que es lo que manda la
 * skill `paginas-legales`. Ahí la fila es «Cookies preferences» a la izquierda
 * y estos cuatro a la derecha, separados por filetes verticales.
 *
 * ⚠️ «COOKIES PREFERENCES» NO ESTÁ, y es a propósito. En el template ese
 * control REABRE el banner de cookies, y este sitio no tiene banner. Un botón
 * que dice «preferencias» y no abre nada es peor que no tenerlo. Entra el día
 * que se monte el banner, en la misma fila y con ese texto exacto.
 *
 * ⚠️ NO SON LINKS TODAVÍA, Y ESO ES LO QUE HAY QUE CAMBIAR DESPUÉS. Las tres
 * páginas no existen —`/privacy-policy`, `/terms-of-service`,
 * `/cookie-policy`— así que los rótulos se renderizan como texto y no como
 * anclas: un `<a>` a un 404 es una promesa rota, y uno sin `href` no lo
 * anuncia como link ningún lector de pantalla. Cuando las páginas existan hay
 * que hacer DOS cosas acá: agregarles el `href` y cambiar el `<span>` por
 * `<Link>`. La skill `paginas-legales` tiene el procedimiento completo.
 * ══════════════════════════════════════════════════════════════════════════
 */
const LEGALES = [
  'Privacy Policy',
  'Terms of Service',
  'Cookie Policy',
  'Accessibility',
] as const;

const COLUMNAS = [
  { titulo: 'The place', links: LINKS_LUGAR },
  { titulo: 'Events', links: LINKS_EVENTOS },
  { titulo: 'Get to know us', links: LINKS_CONOCERNOS },
] as const;

/**
 * ⚠️ EN CAJA BAJA Y EN NEGRITA, COMO EL HEADER. Este comentario decía «en
 * MAYÚSCULAS, como el header, con el interletrado que las mayúsculas necesitan
 * para no apretarse», y sigue diciendo lo mismo: que el footer copia al header.
 * Lo que cambió es el header.
 *
 * La regla única, escrita en `NAV_ITEM` (`Header.tsx`): todo lo que se navega o
 * se toca va en la letra del cuerpo, en negrita y en caja baja. Estos son 18
 * destinos, o sea la misma cosa que los items de la nav.
 *
 * ⚠️ 16px y no 15. Un escalón más, como pidió Camila para la barra y los CTA.
 * Es además el tamaño del párrafo que tienen al lado —el de «A rooftop bar over
 * a curated food truck park»—, así que las dos columnas del footer quedan en la
 * misma medida.
 *
 * ⚠️ Se va `tracking-label`: esos 0.08em existían para que las mayúsculas
 * respiraran. En caja baja separan lo que no hay que separar.
 */
const LINK_BASE =
  'block py-1.75 font-body text-base font-bold leading-[1.4] text-paper/70 transition-colors duration-200 hover:text-paper';

export default function Footer() {
  return (
    /*
      ⚠️ `rounded-t-band` SE MUDÓ ACÁ desde `NewsletterSignup`. El arco de 88px
      es el remate superior de todo el bloque de cierre, y ese bloque ahora
      empieza en el footer. Sin esto el sitio perdía su arco en las 23 páginas.

      ⚠️ `on-dark` NO ES DECORATIVO y faltaba desde antes. Hace dos cosas que el
      footer necesita: invierte el anillo de foco a crema —en `ink` sobre `deep`
      es negro sobre verde oscuro, o sea que no se ve— y resuelve `--lead-ink`
      a `muted-dark`, que es de lo que depende la utilidad `bajada` de la
      tarjeta de newsletter. Ver globals.css.
    */
    /*
      ⚠️ EL MARGEN NEGATIVO ES LA OTRA MITAD DEL ARREGLO DEL ARCO. La regla
      `main > :last-child` de globals.css estira la última sección 88px hacia
      abajo; esto monta el footer encima de esos mismos 88. El resultado es
      que detrás de las esquinas redondeadas queda la sección anterior y no
      el blanco del `<body>`. Los dos números son el mismo token
      (`--radius-band`) y no se tocan de a uno.

      ⚠️ VA COMO PROPIEDAD ARBITRARIA Y NO COMO `-mt-band`. Son dos tokens
      distintos y se parecen demasiado: `--spacing-band` son 96px fijos —el
      ritmo vertical entre bandas— y `--radius-band` es `clamp(2.25rem, 9vw,
      5.5rem)`, el radio del arco. `-mt-band` compila contra el primero y
      dejaría el footer 96px arriba de donde tiene que estar en desktop y 60
      abajo en mobile. Es la misma sintaxis que ya usa `FindUs` para montarse
      sobre `EventsBanner`.

      ⚠️ EL `z-[4]` NO ES OPCIONAL Y ES LO QUE ROMPIÓ EL ARCO LA PRIMERA VEZ.
      Desde que el footer se monta 88px sobre la sección anterior, entra en
      disputa de pintado con ella — y varias de las últimas secciones del sitio
      llevan `z-index` propio para montarse a su vez sobre la que tienen
      arriba: `FindUs` en la home es `relative z-[3]`.

      Sin z-index, el footer es contenido normal y `z-[3]` le gana: la sección
      anterior se pinta ENCIMA de los 88px superiores del footer, que es
      exactamente la franja donde vive el arco. En pantalla el footer arrancaba
      con un borde recto de lado a lado y el radio no se veía por ningún lado.

      El 4 es el escalón siguiente al 3 de `FindUs`, y queda muy por debajo del
      `z-40` del header y del `z-[110]` del drawer: el footer tiene que tapar a
      la sección de arriba, no a la navegación.

      El porqué completo está en globals.css.
    */
    <footer className="grano relative z-[4] banda-arco bg-deep text-paper on-dark">
      {/*
        ══════════════════════════════════════════════════════════════════
        EL FONDO DEL FOOTER: NUBES + PALMERAS, LAS DOS PIEZAS DEL BRAND BOOK.

        Pedido de Camila, con las dos referencias de Figma a mano: «al footer
        agreguémosle algo de fondo, una textura con la palmera en grande con
        contraste bajo para que no moleste la lectura, pero en verde obvio».

        ⚠️ LA TEXTURA ES UNA FOTO DE NUBES, y eso no se adivina mirando el
        brand book: la portada parece una acuarela naranja, y lo que hay
        debajo es un cielo cubierto en escala de grises fundido contra el
        color. Bajada del nodo `2036-600` del archivo de marca.

        `clouds.webp` va en GRIS y con el contraste aplanado —`linear(0.55,
        70)` sobre la original de 4096px— para que el color lo ponga la losa
        y no el archivo. 16 KB.

        ⚠️ `mix-blend-mode: multiply` Y NO `soft-light`, QUE FUE EL PRIMER
        INTENTO. `soft-light` aclara y oscurece a la vez —se comporta como una
        luz— y sobre un verde oscuro lo que más se nota es lo que ACLARA: la
        losa perdía saturación y quedaba gris verdosa. Camila: «el fondo del
        footer mucho más oscuro, no tan grisado; que la imagen sea una textura
        sutil».

        `multiply` sólo puede oscurecer. Las nubes claras dejan el verde como
        está y las zonas medias lo hunden, así que la textura aparece como
        sombra y el footer termina MÁS oscuro que antes de tener fondo, no más
        claro. Es también lo que hace la portada del brand book contra su
        naranja.

        ⚠️ Y LA OPACIDAD BAJÓ DE 35 A 22. Con multiply, 35 ya era una nube
        dibujada; a 22 se lee el relieve y no la foto.

        ⚠️ LAS PALMERAS SON EL VECTOR DEL BRAND (`2036-604`), no un dibujo
        nuevo. Se guardaron en `public/brand/palms.svg` con el fill de marca
        —el tomate `#EB452C` de la portada— cambiado por `currentColor`.

        ⚠️ VAN COMO `mask` Y NO COMO `<img>`, y por eso pueden ser verdes. Un
        SVG servido por `<Image>` no hereda color: habría que duplicar el
        archivo por cada tono. Como máscara, el archivo define la SILUETA y el
        color lo pone `bg-deeper` — el verde un peldaño más oscuro que la losa,
        que es la relación que la portada tiene entre su palmera y su fondo.

        ⚠️ EL CONTRASTE ES DELIBERADAMENTE MÍNIMO Y HUBO QUE BAJARLO DOS
        VECES. `deeper` (#013434) sobre `deep` (#014545) ya mide 1.18:1, pero
        a opacidad plena —y con las nubes aclarando la losa por debajo— la
        silueta se leía como un dibujo y su borde cruzaba las dos columnas de
        links de la derecha. Camila pidió «contraste bajo para que no moleste
        la lectura», y el tamaño grande es parte del pedido: lo que se baja es
        la presencia, no la escala.

        Con `opacity-55` la mezcla da ~#013B3B contra el `deep` de la losa: a
        esa distancia el borde deja de recortarse contra las letras y la
        palmera pasa a leerse como profundidad.

        ⚠️ LA LEGIBILIDAD DEL TEXTO NO DEPENDE DE ESTO Y NO HAY QUE CONFUNDIR
        LAS DOS COSAS. Los links van en `paper/70` sobre una losa oscura: su
        ratio lo fija el par texto/fondo y la silueta sólo mueve el fondo entre
        dos verdes casi idénticos. Lo que molestaba no era el contraste del
        texto sino el CONTORNO cruzándolo.

        ⚠️ EL RECORTE VA EN ESTA CAPA Y NO EN EL `<footer>`. El footer no puede
        llevar `overflow-hidden`: adentro está la tarjeta del newsletter con
        `sombra-card`, y recortarla al borde dejaría la sombra cortada a pico
        —es lo que `npm run check:sombras` vigila—. Con el recorte acá, el
        fondo se contiene y la tarjeta no se entera.

        ⚠️ `rounded-t-band` EN LA CAPA: sin él, las nubes y la palmera se
        dibujarían sobre las dos esquinas redondeadas y taparían el arco.

        ══════════════════════════════════════════════════════════════════
        ⚠️ LA CAPA NO PUEDE LLEVAR `z-0`, Y ESO ROMPIÓ EL `multiply` SIN DAR
        NINGÚN ERROR. Lo tenía, para quedar por debajo del contenido.

        `z-index: 0` sobre un elemento posicionado CREA UN CONTEXTO DE
        APILAMIENTO, y un `mix-blend-mode` sólo se mezcla con lo que hay dentro
        de su contexto. Encerradas ahí, las nubes se mezclaban contra el fondo
        transparente de su propio contenedor —o sea contra nada— y terminaban
        dibujándose tal cual: gris claro al 22 % encima del verde. Medido con
        píxeles, la losa pasaba de #014545 a #306262: cuarenta y siete puntos
        de rojo de más. Eso era el «grisado» que marcó Camila, y no la
        opacidad.

        Con `z-index: auto` la capa no crea contexto, el blend alcanza al
        fondo del footer y multiply hace lo que tiene que hacer: oscurecer.

        ⚠️ SIGUE QUEDANDO POR DEBAJO DEL CONTENIDO, que es para lo que estaba
        el `z-0`. Lo resuelven los `relative z-[1]` de los tres bloques de
        contenido —las columnas, la franja legal y la barra de la agencia—: un
        elemento con `z-index: 1` gana contra uno en `auto` sin necesidad de
        que éste declare nada.
        ══════════════════════════════════════════════════════════════════
        ══════════════════════════════════════════════════════════════════
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-t-band"
      >
        <div className="absolute inset-0 bg-[url('/brand/clouds.webp')] bg-cover bg-center opacity-22 mix-blend-multiply" />
        <div className="absolute -right-16 bottom-0 aspect-[1100/1024] w-[34rem] bg-deeper opacity-55 [mask-image:url('/brand/palms.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] sm:w-[44rem] lg:-right-20 lg:w-[56rem]" />
      </div>

      <div className={`relative z-[1] ${GUTTER}`}>
        {/*
          La tarjeta del newsletter abre el footer. Va DENTRO del mismo `GUTTER`
          y la misma `caja` que las columnas de abajo: así su título y el logo
          arrancan del mismo margen, que es lo que el componente antes tenía que
          replicar a mano.
        */}
        <div className="caja pt-14 desk:pt-20">
          <NewsletterSignup />
        </div>

        <div className="caja grid gap-12 py-16 desk:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] desk:gap-16 desk:py-20">
          {/* ── Identidad ────────────────────────────────────────────── */}
          <div className="flex flex-col items-center gap-5 text-center desk:items-start desk:text-left">
            <Link href="/" aria-label={`${BRAND.name} home`}>
              <Image
                src="/brand/logo-reversed.svg"
                alt=""
                width={303}
                height={322}
                className="h-19 w-auto"
              />
              <span className="sr-only">{BRAND.name}</span>
            </Link>

            <p className="max-w-[34ch] text-base text-paper/80">
              A rooftop bar over a curated food truck park, in downtown Bonita Springs.
            </p>

            <ButtonLink href="/events/inquire" variant="onDark">
              Plan an event
            </ButtonLink>

            <SocialLinks />
          </div>

          {/* ── Las tres columnas de links ───────────────────────────── */}
          <nav
            aria-label="Footer"
            className="grid gap-9 sm:grid-cols-3 sm:gap-6"
          >
            {COLUMNAS.map(({ titulo, links }) => (
              <div
                key={titulo}
                className="flex flex-col items-center text-center sm:items-start sm:text-left"
              >
                <Heading level={2} role="label" className="text-paper">
                  {titulo}
                </Heading>
                {/* El filete corto bajo el rótulo: es el remate de la casa, y en
                    naranja porque es decorativo y no le debe contraste a nadie. */}
                <span aria-hidden="true" className="mt-2.5 block h-0.5 w-7 bg-sunset" />
                <ul className="mt-3 flex flex-col">
                  {links.map(({ label, href, external }) => (
                    <li key={href}>
                      {/* Gift Cards sale del sitio (Toast). Link externo: `rel`
                          completo y aviso para lector de pantalla, como en el
                          resto de las salidas del sitio. */}
                      {external ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={LINK_BASE}
                        >
                          {label}
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      ) : (
                        <Link href={href} className={LINK_BASE}>
                          {label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Franja inferior ──────────────────────────────────────────── */}
      {/* ⚠️ EL `relative z-[1]` ES OBLIGATORIO Y FALTABA. Esta franja está
          FUERA del envoltorio de contenido de arriba, así que sin su propio
          contexto quedaba al mismo nivel que el fondo: el tronco de la palmera
          le pasaba por encima y partía «Terms of Service» al medio. Todo lo
          que sea texto dentro del footer tiene que estar por encima del
          `z-0` de la capa decorativa. */}
      <div className="relative z-[1] border-t border-paper/15">
        <div className={GUTTER}>
          {/*
            ⚠️ LAS DOS PIEZAS SE PONEN EN FILA RECIÉN EN `lg`, Y NO EN `sm`.
            Con `sm:flex-row` el copyright y la fila legal se repartían el
            renglón, y a la fila legal le quedaban 279px a 640 y 355 a 834
            contra los 362 que necesita: se partía en dos renglones CON los
            separadores puestos, o sea un «|» colgado al principio de la
            segunda línea. Es exactamente el error que la skill
            `paginas-legales` marca en su tabla. Medido en seis anchos.

            Apiladas hasta `lg`, la fila legal se lleva el ancho entero y entra
            en una línea desde los 390px.
          */}
          <div className="caja flex flex-col items-center justify-between gap-4 py-5 text-micro text-paper/60 lg:flex-row">
            <p className="order-2 text-center lg:order-1 lg:text-left">
              © {new Date().getFullYear()} {BRAND.name}. {BRAND.group}. Bonita Springs, Florida.
            </p>

            {/*
              ⚠️ LA CIUDAD SE MUDÓ AL RENGLÓN DEL COPYRIGHT en vez de ocupar el
              extremo derecho. Ese extremo es el lugar que el template le da a
              la fila legal, y dos bloques peleando por el mismo borde dejaban
              el footer con tres cosas en una línea de 13px.

              ⚠️ `order-2` / `sm:order-1`: apilado, lo legal va ARRIBA del
              copyright. El copyright es la última línea del sitio en todos los
              proyectos de la casa y tiene que seguir siéndolo.
            */}
            <nav
              aria-label="Legal"
              className="order-1 flex flex-wrap items-center justify-center gap-x-1 gap-y-2 lg:order-2 lg:shrink-0 lg:justify-end"
            >
              {LEGALES.map((rotulo, i) => (
                <span key={rotulo} className="inline-flex items-center">
                  {/*
                    ⚠️ EL FILETE NUNCA ARRANCA UN RENGLÓN. Va ANTES de cada
                    rótulo menos el primero, y sólo existe a partir de 430px.

                    Ese número está medido, no elegido: los cuatro rótulos
                    miden 340px sueltos y 362 con los separadores puestos, y a
                    430px de pantalla la fila dispone de 382 —el ancho menos
                    los 24 de gutter de cada lado—. Abajo de eso los
                    separadores son justo lo que hace que la fila se parta, y
                    partida dejan un «|» colgado al principio de la segunda
                    línea: el error que la skill `paginas-legales` marca
                    explícitamente en su tabla.

                    ⚠️ NO es `sm` (640). Ese breakpoint llegaba tarde —la fila
                    ya entra en una línea desde 390— y además no era el que
                    decidía nada: el que rompía era el reparto del renglón con
                    el copyright, ya corregido arriba.
                  */}
                  {i > 0 ? (
                    <span aria-hidden="true" className="mr-1 hidden text-paper/30 min-[430px]:inline">
                      |
                    </span>
                  ) : null}
                  {/*
                    `py-1.5` para que el área táctil sea cómoda en mobile, que
                    es otro pedido del template. Hoy no se toca nada, pero el
                    alto tiene que estar puesto desde ahora: cuando pasen a ser
                    `<Link>` el layout no se mueve.
                  */}
                  <span className="px-1 py-1.5 text-paper/70">{rotulo}</span>
                </span>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* La barra de la agencia trae su propio fondo claro: cierra el sitio y
          no pertenece al bloque oscuro de arriba. */}
      <AgencyBar />
    </footer>
  );
}

