import Image from 'next/image';
import Link from 'next/link';
import { SITE_LEGAL_DOCS } from '@/content/legal-docs';
import { BRAND } from '@/lib/brand';
import { CAJA_ALTA_CLS } from '@/lib/flags';
import { sinBlog } from '@/lib/nav';
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
/**
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LOS TRES GRUPOS DEL FOOTER SON EL MISMO MAPA QUE EL MEGA-MENÚ, y eso era
 * el defecto que había que arreglar.
 *
 * Camila, revisando la navegación: «las opciones del footer deben estar todas
 * en el hero o mega menú también». Estaban desalineados: el footer tenía seis
 * destinos que el mega-menú no —Event Spaces, Corporate, Holiday Parties,
 * Events Packet, FAQ, Careers— y el mega-menú tenía una tarjeta destacada que
 * el footer no. Dos navegaciones que describen dos sitios distintos.
 *
 * Ahora las dos listan las MISMAS diez páginas, agrupadas igual:
 *
 *     The place        Sunset Bar · Food Trucks · The Yard · What's On · Market
 *     Events           Private Events · Request a Proposal
 *     Get to know us   About · Contact · Join Us · Gift Cards
 *
 * ⚠️ LAS ANCLAS DE EVENTS NO SON PÁGINAS Y POR ESO NO ESTÁN. Corporate, Holiday
 * Parties y Event Spaces dejaron de ser rutas: son secciones de `/events`.
 * Listarlas acá como si fueran destinos propios volvería a contar un sitio de
 * quince páginas que ya no existe. Se llega por la página, que es donde el
 * argumento se lee entero.
 *
 * ⚠️ «Request a Proposal» SÍ SE QUEDA aunque también sea un ancla: es la
 * acción, no una sección. Es el único link del footer que pide algo.
 * ══════════════════════════════════════════════════════════════════════════
 */
const LINKS_LUGAR: readonly FooterLink[] = [
  { label: 'Sunset Bar', href: '/sunset-bar' },
  { label: 'Food Trucks', href: '/food-trucks' },
  { label: "What's On", href: '/whats-on' },
  { label: 'The Market', href: '/market' },
];

/** La vertical que factura: la página y la acción. */
const LINKS_EVENTOS: readonly FooterLink[] = [
  { label: 'Private Events', href: '/events' },
  { label: 'Request a Proposal', href: '/events#inquire' },
] as const;

/**
 * Conocernos, y la única venta directa del sitio.
 *
 * ⚠️ `Gift Cards` SE MUDÓ ACÁ DESDE «The place» y ahora está también en el
 * mega-menú. Camila lo pidió en los dos lados: es una venta y estaba escondida
 * al fondo de la página, mezclada entre las secciones del local.
 */
const LINKS_CONOCERNOS: readonly FooterLink[] = [
  { label: 'About', href: '/our-story' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
  { label: 'Join Us', href: '/join-us' },
  { label: 'Gift Cards', href: BRAND.giftCards, external: true },
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
 * que se monte el banner, en la misma fila y con ese texto exacto. Es lo único
 * de esta fila que sigue faltando.
 *
 * ⚠️ YA SON LINKS. Esta nota decía que no lo eran, porque las páginas no
 * existían y un `<a>` a un 404 es una promesa rota. El 2026-09-22 se crearon
 * las cuatro y los `<span>` pasaron a `<Link>`.
 *
 * ⚠️ LAS CUATRO PÁGINAS SON BORRADORES CON CUERPO DE LOREM, y aun así el link
 * va. Son dos problemas distintos: que el documento esté escrito es cosa del
 * cliente y de su abogado; que el rótulo del pie lleve a alguna parte es cosa
 * nuestra. La página abre, dice en su primer bloque que es un borrador y lleva
 * `noindex`, que es exactamente lo que un borrador tiene que hacer. El porqué
 * completo está en `content/legal/borradores.ts`.
 *
 * ⚠️ LOS `href` SALEN DE `SITE_LEGAL_DOCS` Y NO ESTÁN ESCRITOS ACÁ. Esa lista
 * es también la que arma la navegación del pie de cada documento, y con las
 * rutas escritas en los dos lados alcanzaba con renombrar una para que el pie
 * del sitio y el pie del documento apuntaran a lugares distintos.
 * ══════════════════════════════════════════════════════════════════════════
 */
const LEGALES = SITE_LEGAL_DOCS;

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
  `block py-1.75 font-body text-base font-bold leading-[1.4] text-paper/70 transition-colors duration-200 hover:text-paper ${CAJA_ALTA_CLS}`;

/** `hasBlog`: si el feed tiene al menos una nota. Sin notas el link no se ve, ver `sinBlog`. */
export default function Footer({ hasBlog }: { readonly hasBlog: boolean }) {
  const columnas = hasBlog ? COLUMNAS : COLUMNAS.map((c) => ({ ...c, links: sinBlog(c.links) }));

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
    <footer className="relative z-[4] banda-arco bg-deep grano text-paper on-dark">
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

      {/*
        ⚠️ EL FOOTER USA `caja-ancha` COMO EL RESTO DEL SITIO, Y ANTES NO.
        Llevaba el par `GUTTER` + `caja`, que es el contenedor viejo: 1280px de
        ancho máximo con el gutter de 16/32px puesto por fuera. El resto de las
        páginas usa `caja-ancha`, que es 1280 con el gutter ADENTRO —de 24 a
        56px según el ancho—.

        Medido a 1598px: el contenido de la home arrancaba en 215 y el del
        footer en 159. Cincuenta y seis píxeles de diferencia, o sea
        exactamente el padding que `caja-ancha` tiene y `caja` no. Camila lo
        marcó con dos líneas verticales sobre la captura: «el footer no está
        respetando el ancho máximo».

        ⚠️ LAS DOS COSAS NO SE COMBINAN. `caja-ancha` reemplaza al par entero,
        no se le suma: poner las dos deja el contenido 88px adentro en desktop.
        Está dicho en la definición de la utilidad, en globals.css.
      */}
      <div className="relative z-[1]">
        {/*
          La tarjeta del newsletter abre el footer. Va DENTRO del mismo `GUTTER`
          y la misma `caja` que las columnas de abajo: así su título y el logo
          arrancan del mismo margen, que es lo que el componente antes tenía que
          replicar a mano.
        */}
        <div className="caja-ancha pt-14 desk:pt-20">
          <NewsletterSignup />
        </div>

        <div className="caja-ancha grid gap-12 py-16 desk:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] desk:gap-16 desk:py-20">
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

            <ButtonLink href="/events#inquire" variant="onDark">
              Plan an event
            </ButtonLink>

            <SocialLinks />
          </div>

          {/* ── Las tres columnas de links ─────────────────────────────

              ⚠️ EN MOBILE VAN DE A DOS Y NO APILADAS, desde el 2026-09-23. En
              una sola columna centrada el pie medía unos 1.000px de alto en un
              teléfono: diez links en fila india después del newsletter. Es la
              grilla de Santa María y Yava. La tercera columna ocupa el renglón
              entero y queda centrada, para que la fila de abajo no cuelgue de
              un solo lado. */}
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 sm:gap-6"
          >
            {columnas.map(({ titulo, links }, i) => (
              <div
                key={titulo}
                className={[
                  'flex flex-col items-center text-center sm:items-start sm:text-left',
                  i === columnas.length - 1 && columnas.length % 2 === 1 ? 'col-span-2 sm:col-span-1' : '',
                ].join(' ')}
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
      {/*
          ⚠️ `data-pie-cierre` MARCA DÓNDE ARRANCA LA ZONA QUE NO SE PUEDE
          PISAR, y la lee `BackToTop` para frenar antes de llegar. De acá para
          abajo van la fila legal, el copyright y la barra de la agencia: lo que
          cierra el sitio y no admite nada flotando encima.

          ⚠️ Es un atributo de datos y no un `id` a propósito: no es un ancla,
          nadie navega hasta acá, y un `id` en el footer aparecería en los
          scripts de auditoría como si fuera un destino. Si algún día se renombra
          hay que tocar también `alzaDelPie()` en `BackToTop.tsx`; el botón cae
          a su piso en silencio si no lo encuentra.
      */}
      <div data-pie-cierre className="relative z-[1] border-t border-paper/15">
        <div>
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
          <div className="caja-ancha flex flex-col items-center justify-between gap-4 py-5 text-micro text-paper/60 lg:flex-row">
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
              {LEGALES.map((doc, i) => (
                <span key={doc.href} className="inline-flex items-center">
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
                    es otro pedido del template. El alto ya estaba puesto de
                    cuando esto era un `<span>` muerto, así que el paso a
                    `<Link>` no movió una fila.

                    ⚠️ EL HOVER SUBRAYA Y ACLARA, NO PINTA DE ACENTO. Cuatro
                    rótulos de 13px a `paper/70` sobre el bloque oscuro del pie
                    están un escalón debajo de las columnas de navegación, que
                    es donde el template los quiere: son el piso legal, no un
                    destino que se ofrece. Un dorado acá compite con la barra de
                    la agencia que viene justo abajo.

                    ⚠️ NO HAY `aria-current` EN ESTA FILA, y sí lo hay en el pie
                    de cada documento. Acá el pie se renderiza igual en las 24
                    rutas y marcar la actual exigiría volver cliente al footer
                    entero para leer el pathname. El que está en la página ya lo
                    sabe: lo dice el h1 arriba de todo.
                  */}
                  <Link
                    href={doc.href}
                    className="px-1 py-1.5 text-paper/70 transition-colors hover:text-paper hover:underline focus-visible:text-paper"
                  >
                    {doc.label}
                  </Link>
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

