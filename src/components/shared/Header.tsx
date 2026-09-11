'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { BRAND } from '@/lib/brand';
import {
  NAV_CTA,
  NAV_MAIN,
  NAV_MORE,
  NAV_MORE_FEATURED,
  NAV_MORE_GROUPS,
  NAV_PRIMARY,
  NAV_SIDE,
} from '@/lib/nav';
import { ButtonLink } from './Button';
import { CaretDown } from './Icon';
import { GUTTER } from './Section';
import TilePattern, { TileMark } from './TilePattern';

/**
 * Header.
 *
 * Nav reducida de 5 + mega-menú «More» —tres bloques rotulados de links con
 * una línea de descripción cada uno, más una tarjeta destacada—, un link de
 * contacto y un CTA. Debajo de la barra de servicio (`UtilityBar`).
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ DEJÓ DE SER `fixed` Y VOLVIÓ AL FLUJO — rediseño `food-truck-club`.
 *
 * Fue `fixed`, pasó a `sticky` cuando se sumó el `PromoBar`, volvió a `fixed`
 * cuando el banner salió, y ahora es estático. No es ir y venir: cada vez el
 * motivo fue el mismo —qué necesita el elemento que está arriba de todo— y
 * esta vez arriba hay dos cosas nuevas.
 *
 * La razón concreta es el HERO. El diseño apoya el hero en un mecanismo que
 * con un header flotante no funciona: el titular «TOGETHER» es una placa
 * naranja sobre fondo `bone` que se monta sobre el marco de la foto, y el
 * marco tiene un recorte (el «notch») que se calcula midiendo dónde termina
 * esa placa. Las tres piezas —placa, notch y marco— tienen que estar en el
 * mismo sistema de coordenadas del documento. Con el header encima flotando
 * y translúcido, la placa pasa por debajo de la barra al scrollear y el
 * naranja se mezcla con el blur: el recorte queda dibujado contra un color
 * que ya no es el del fondo.
 *
 * Y el beneficio que se pierde ya no existía. El header era translúcido con
 * `backdrop-blur` para verse SOBRE el hero verde a pantalla completa; con el
 * hero claro y en flujo, no hay nada que difuminar — el blur estaba activo
 * en cada frame sin dibujar nada.
 *
 * ⚠️ CONSECUENCIA, y hay que tenerla presente: los heroes ya NO compensan la
 * altura del header. `Hero.tsx` (home) y `PageHero.tsx` (las 22 internas)
 * tenían un `pt` con los 77px sumados a mano; ese padding se sacó. Si algún
 * día el header vuelve a flotar, vuelve también ahí.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ EL HEADER ES `bone` Y NO `paper`. Es la misma superficie que arranca el
 * hero, así que entre la barra y el contenido no hay corte de color: el único
 * corte es el filete de 1px en `fog`. Con `paper` había un escalón de 1.08:1
 * justo debajo de la nav, y a lo ancho de la pantalla ese escalón se lee como
 * una segunda línea.
 *
 * ⚠️ El corte del nav es `desk:` (1344) y NO `lg:` (922). Entre 768 y 1344 no
 * entran logo + 5 items + More + contacto + CTA. Regla de la casa: si el logo
 * tuviera que achicarse para entrar, ya va el header mobile.
 *
 * ⚠️ EL DRAWER DE MOBILE NO SALE DEL DISEÑO Y SE CONSERVA TAL CUAL ESTABA. El
 * prototipo tiene el botón de menú en `display:none` y no dibuja panel: en
 * Claude Design se compuso sólo el desktop. Lo que había acá funciona y está
 * auditado —foco atrapado, `inert`, scroll bloqueado, Escape—, así que se
 * mantiene y sólo se le actualizó la tipografía de los items para que sea la
 * misma condensada que la nav de desktop. No se inventó un mobile nuevo.
 *
 * ⚠️ EL HOVER DE LA NAV ES `terra` Y NO EL NARANJA DEL PROTOTIPO. `#E0741A`
 * sobre `#FAF6EA` da 2.90:1 y el mínimo para texto grande en negrita es 3:1 —
 * `npm run a11y` lo marcó en las 8 páginas del mega-menú, donde el botón
 * «More» queda en estado activo. Falla por una décima, pero falla, y un
 * estado de hover que no se lee es un estado que no comunica. `terra` da
 * 7.43:1 y es el mismo naranja quemado de la familia. Ver el encabezado de
 * `ThreeDoors.tsx`.
 *
 * ⚠️ El subrayado de la página actual SÍ se queda en `sunset`: es una línea
 * decorativa de 2px, no texto, y el ítem activo ya se distingue por el `ink`
 * contra el resto. Un borde no tiene que pasar el umbral de tinta.
 *
 * ⚠️ Comportamiento del «More», copiado de The Orient porque ya está resuelto:
 * abre por hover Y por click · `aria-expanded` + `aria-haspopup` · cierra con
 * Escape y con click afuera · el panel vive siempre en el DOM y se oculta con
 * `invisible`, que además lo saca del recorrido del tabulador.
 */

/**
 * La clase de un item de la nav. Se comparte con el botón «More» y con el link
 * suelto de la derecha.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ES LA LETRA DEL CUERPO EN NEGRITA Y EN CAJA BAJA, no la condensada en
 * caja alta que había. El criterio lo fijó Camila y vale para TODO lo que se
 * navega o se toca: nav, mega-menú, drawer, footer y los botones. La regla, en
 * una línea:
 *
 *     destino o acción  →  `font-body` + `font-bold`, caja baja, sin tracking
 *     título            →  la condensada de siempre
 *
 * Antes convivían cuatro tratamientos para lo mismo: la nav en condensada alta
 * con 0.02em, el link de contacto en cuerpo regular caja baja, los botones en
 * cuerpo 500 en caja ALTA con 0.06em, y cuatro CTA escritos a mano que no
 * pasaban por `Button` y usaban dos criterios más. Un botón que dice «PLAN AN
 * EVENT» al lado de uno que dice «See the spaces» no se lee como dos niveles:
 * se lee como dos sitios.
 *
 * ⚠️ La caja alta NO desaparece del sitio, cambia de trabajo: queda para los
 * titulares y para los eyebrow, que son etiquetas. Lo que se saca es de los
 * elementos que se clickean, que es donde la caja alta cuesta legibilidad —una
 * palabra en mayúsculas se lee por forma de bloque, no por silueta— y donde
 * además obligaba a un tracking extra para no apretarse.
 * ══════════════════════════════════════════════════════════════════════════
 */
const NAV_ITEM = [
  'font-body text-nav font-bold',
  'whitespace-nowrap transition-colors duration-200',
].join(' ');

export default function Header() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement | null>(null);
  const drawerCloseRef = useRef<HTMLButtonElement | null>(null);

  const route = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
  const isCurrent = (href: string) => route === href || route.startsWith(`${href}/`);
  const moreActive =
    NAV_MORE.some((l) => isCurrent(l.href)) || isCurrent(NAV_MORE_FEATURED.href);

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMoreOpen(false);
      setDrawerOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    drawerCloseRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  return (
    <>
      {/* `relative` + `z-40` para que el panel del «More», que es absoluto y
          se despliega a todo el ancho, quede por encima del hero. */}
      <div
        ref={moreRef}
        className="relative z-40 border-b border-fog bg-bone"
        onMouseLeave={() => setMoreOpen(false)}
      >
        <header className="caja-ancha relative flex min-h-19.5 items-center gap-6">
          {/*
            ══════════════════════════════════════════════════════════════
            ⚠️ EL LOGO VA CENTRADO Y EN UN MEDALLÓN, por pedido de Camila.

            Está `absolute` y no en el flujo, y esa es la única forma de que
            quede centrado respecto de la PÁGINA. Con el logo como primer
            item de un `justify-between`, el centro visual lo decide el ancho
            de los dos grupos que tiene al lado —cinco items de nav a la
            izquierda contra un link y un botón a la derecha— y el logo se
            corre del eje. Fuera del flujo, `left-1/2` es el eje real y no
            se mueve aunque mañana la nav tenga cuatro items o seis.

            ⚠️ NO HAY MEDALLÓN: EL MEDALLÓN ES EL LOGO. Hubo un círculo
            dibujado —fondo `bone` y `ring` en `fog`, de 120px— alrededor del
            lockup, y se fue por pedido de Camila. Primero se le sacó el
            casquete de arriba y quedó sólo el arco de abajo; viéndolo en
            pantalla, ese arco tampoco sumaba: eran dos líneas curvas que
            nacían de la nada al costado del logo y que no eran ni el logo ni
            la barra.

            Sin el círculo el efecto que se buscaba sigue estando, y lo hace
            solo: el lockup ES un badge redondo y opaco, así que TAPA el
            filete de `fog` en los 75px que ocupa y lo que se ve es la línea
            entrando y saliendo del logo. El círculo dibujado estaba repitiendo
            por fuera la forma que el logo ya tiene.

            ⚠️ Lo que sí quedó de esa caja es el `size-30` y el `top-1`: son
            los que fijan el CENTRO del logo —a 64px del borde de arriba, o
            sea 14px por encima del filete— y por eso el lockup cuelga un poco
            de la barra en vez de estar contenido. Si se cambia el `size`, el
            logo se corre en vertical.

            ⚠️ Los dos grupos de los costados llevan `pr`/`pl` en `desk` para
            no meterse debajo del logo. Sin eso, el último item de la nav pasa
            por atrás del lockup en las pantallas donde la nav crece.
            ══════════════════════════════════════════════════════════════

            ⚠️ EL LOCKUP EN SVG cierra una deuda anotada en este mismo
            archivo. Decía: «Es un PNG y no un SVG, y no es una elección: del
            lockup no hay versión vectorial en `public/brand`. Un logo raster
            en un header es lo único del sitio que no escala».

            El bundle de Claude Design lo trajo. `logo-primary.svg` es el mismo
            lockup full color, vectorial y 4× más liviano que el PNG (37 KB
            contra 152). El PNG sigue en `public/brand` porque lo usa el
            preloader, que lo pinta a un tamaño fijo.

            ⚠️ Va con `<Image>` y no con `<img>` aunque sea SVG: Next no
            optimiza SVG —lo sirve tal cual— pero sí emite el `width`/`height`
            que evita el CLS mientras baja.
          */}
          <Link
            href="/"
            aria-label={`${BRAND.name} home`}
            /*
              ══════════════════════════════════════════════════════════════
              ⚠️ EN MOBILE VA A LA IZQUIERDA Y EN EL FLUJO; EL MEDALLÓN
              CENTRADO ES SÓLO DE `desk` PARA ARRIBA. Pedido de Camila, y en
              un teléfono es además lo correcto por tres motivos concretos:

                · Un círculo de 100px colgando del centro de una barra de 78
                  se come 26px de la primera pantalla, que en 844 de alto es
                  aire que le falta al hero.
                · Con el logo en el centro, los dos lados quedan asimétricos:
                  a la izquierda no hay nada (la nav está oculta) y a la
                  derecha está la hamburguesa. El logo centrado sólo cierra
                  cuando tiene peso a los dos lados.
                · Es donde se lo busca. El logo arriba a la izquierda es la
                  convención de vuelta a la home en mobile, y acá encima es
                  el único link de navegación que queda visible.

              ⚠️ El orden del DOM ya lo deja primero, así que al pasar a
              `static` cae solo en el extremo izquierdo del flex. No hace
              falta ningún `order-*`.
              ══════════════════════════════════════════════════════════════
            */
            className="group z-30 flex shrink-0 items-center desk:absolute desk:top-1 desk:left-1/2 desk:grid desk:size-30 desk:-translate-x-1/2 desk:place-items-center"
          >
            {/*
              ⚠️ 80px EN DESKTOP Y NO 64. Creció un 25 % cuando se fue el
              círculo, y las dos cosas van juntas: adentro del medallón el
              lockup tenía que dejar aire contra el `ring` o se veía apretado,
              y sin `ring` ese aire no está reservando nada. El logo pasa a ser
              la pieza del centro en vez de su contenido.

              Los 80px son el techo de lo que entra. Medido: arriba deja 24px
              libres contra la `UtilityBar` —a 88 quedaban 20 y el lockup se
              leía encajado entre las dos barras— y abajo cuelga 26px del
              filete, un tercio de la barra, que es lo que lo mantiene montado
              sobre la página sin taparle nada al hero.

              ⚠️ En mobile sigue en 52px (`h-13`) y no se toca. Ahí el logo
              está EN EL FLUJO, a la izquierda y contra la hamburguesa, así que
              tiene que entrar dentro de la barra: no cuelga de nada y lo que
              creciera se lo comería al alto del header.
            */}
            <Image
              src="/brand/logo-primary.svg"
              alt=""
              width={240}
              height={254}
              priority
              className="h-13 w-auto transition-transform duration-300 ease-brand group-hover:scale-105 desk:h-20"
            />
            <span className="sr-only">{BRAND.name}</span>
          </Link>

          {/* ── Nav desktop ────────────────────────────────────────────── */}
          <nav
            aria-label="Main"
            className="hidden min-w-0 flex-1 items-center gap-x-4.5 gap-y-1.5 desk:flex desk:pr-20"
          >
            {NAV_MAIN.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                aria-current={isCurrent(href) ? 'page' : undefined}
                className={[
                  NAV_ITEM,
                  isCurrent(href)
                    ? 'text-ink underline decoration-sunset decoration-2 underline-offset-[10px]'
                    : 'text-ink hover:text-terra',
                ].join(' ')}
              >
                {label}
              </Link>
            ))}

            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              onMouseEnter={() => setMoreOpen(true)}
              aria-expanded={moreOpen}
              aria-haspopup="true"
              className={[
                NAV_ITEM,
                'flex items-center gap-1.25',
                moreActive ? 'text-terra' : 'text-ink hover:text-terra',
              ].join(' ')}
            >
              More
              <CaretDown
                className={`size-3 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`}
              />
            </button>
          </nav>

          {/* ── Contacto + CTA ───────────────────────────────────────────
              ⚠️ `flex-1` + `justify-end` y no `shrink-0`: con el logo fuera
              del flujo, los dos grupos tienen que repartirse el ancho en
              partes iguales o el eje del medallón deja de coincidir con el
              centro óptico de la barra. */}
          <div className="flex min-w-0 flex-1 items-center justify-end gap-3 desk:gap-6 desk:pl-20">
            {/*
              ⚠️ ACÁ VA UN LINK DE TEXTO Y NO UN SEGUNDO BOTÓN. Con dos
              botones —«What's On» en `outline` + «Plan an Event» en relleno—
              el extremo derecho tenía dos cajas compitiendo y el CTA real
              perdía. Un link de texto al lado de una píldora naranja tiene una
              jerarquía que se lee de una: uno es la salida de servicio, el
              otro es la acción.

              ⚠️ EL QUE OCUPA ESE LUGAR HOY ES «WHAT'S ON», que hasta recién
              estaba a la izquierda con los otros cuatro, y el que se fue es
              «Contact». El porqué —la barra estaba cargada de un solo lado y
              los números de las dos mediciones— está en `nav.ts`, arriba de
              `NAV_PRIMARY`. Acá sólo se dibuja lo que esa lista decide: el
              componente NO sabe cuál es el link de la derecha.

              ⚠️ USA `NAV_ITEM`, EL MISMO QUE LOS DE LA IZQUIERDA. Tuvo un
              estilo propio —cuerpo regular en 15px— mientras la nav estaba en
              condensada alta: ahí la diferencia servía para que no se leyera
              como un botón sin fondo al lado de la píldora. Con las dos cosas
              en la misma letra esa distinción desapareció sola, y mantenerla
              sería dejar un item de la nav con otro tamaño que los demás por
              estar del otro lado del logo.
            */}
            {NAV_SIDE.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                aria-current={isCurrent(href) ? 'page' : undefined}
                className={[
                  NAV_ITEM,
                  'hidden desk:block',
                  isCurrent(href)
                    ? 'text-ink underline decoration-sunset decoration-2 underline-offset-[10px]'
                    : 'text-ink hover:text-terra',
                ].join(' ')}
              >
                {label}
              </Link>
            ))}
            <ButtonLink
              href={NAV_CTA.primary.href}
              variant="primary"
              /* ⚠️ Ya no lleva `normal-case tracking-normal`: eran el parche
                 para que ESTE botón se saliera de la caja alta que `Button`
                 imponía a todos. Ahora la caja baja es la regla y el parche
                 sobra. `hidden sm:inline-flex` sí se queda: es lo que lo saca
                 de la barra en pantallas chicas. */
              className="hidden sm:inline-flex"
            >
              {NAV_CTA.primary.label}
            </ButtonLink>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-expanded={drawerOpen}
              aria-controls="mobile-nav"
              className="grid h-11 w-11 place-items-center desk:hidden"
            >
              <span className="sr-only">Open menu</span>
              <svg width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden="true">
                <path d="M0 1h22M0 7h22M0 13h22" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </header>

        {/*
          ── El panel del «More» ──────────────────────────────────────────
          ⚠️ ES UNA BANDA A TODO EL ANCHO, no la tarjeta flotante de 560px que
          había antes. Con ocho destinos, la tarjeta los apretaba en dos
          columnas de 260px y la línea de descripción caía en tres renglones.

          ⚠️ AHORA VA EN CUATRO COLUMNAS FIJAS Y ROTULADAS, no en una grilla
          `auto-fit` de ocho links sueltos: tres bloques con rótulo de
          categoría más una tarjeta destacada a la derecha. El porqué del
          agrupamiento —y de ese orden— está en `nav.ts`; lo que se resolvió
          acá es la forma.

          ⚠️ EL PANEL ES `bone`, EL MISMO COLOR QUE LA BARRA. Era `paper`, y
          al desplegarse se veían dos superficies distintas pegadas: la barra
          en hueso y abajo una lengua blanca. El escalón es de 1.08:1 —poco
          para llamarlo contraste, suficiente para que se lea un corte— y ese
          corte partía en dos algo que es UNA sola pieza: el menú sale de la
          barra, no aparece debajo. Ahora el único límite del panel es el
          filete de `fog` que lo cierra contra la página, igual que el del
          header.

          ⚠️ VUELVEN LOS FILETES POR ITEM, y es un cambio respecto de lo que
          decía este archivo. El argumento viejo era que ocho filetes más tres
          rótulos eran «dos sistemas de agrupación peleando por decir lo
          mismo», y con el rótulo de antes —tres palabras en gris, del mismo
          peso que todo lo demás— era cierto.

          Dejó de serlo cuando el rótulo pasó a ser un eyebrow de marca con la
          ola en teal: ahora los dos sistemas dicen cosas DISTINTAS. El rótulo
          abre un bloque, el filete separa dos destinos adentro del bloque. Es
          la estructura de los menús que pasó Camila como referencia
          (Superside): etiqueta de categoría arriba, y abajo una lista de
          renglones separados por un hilo, cada uno con su título y su línea
          de qué hay adentro. El filete va en `fog`, el mismo hilo del header,
          y no lleva el del último item: el aire cierra la columna.

          ⚠️ Y CADA RENGLÓN ES MÁS ALTO. Era un `gap` de 18px entre links;
          ahora cada uno tiene 14px arriba y 14 abajo de su propio aire, así
          que el hilo cae en el medio de 28px y el renglón se lee como una
          franja y no como dos líneas de texto sueltas. Es lo que hace que se
          pueda barrer la columna de un golpe de vista.

          ⚠️ LA CUARTA COLUMNA ES LA ÚNICA CAJA DEL PANEL, y ahora es la única
          superficie OSCURA. Era una tarjeta `bone` con `ring` sobre `paper`,
          o sea el mismo escalón de 1.08:1 de arriba usado a propósito; con el
          panel en `bone` ese truco ya no existe —la tarjeta desaparecía— y de
          paso nunca terminó de leerse como «destacado»: un rectángulo del
          mismo color con un borde fino es una caja, no una pieza.

          En `deep` sí. Es el verde de la marca, es el color de las otras dos
          piezas que en la home cierran una sección —la banda de Events y el
          footer—, y en un panel claro ordena la lectura sola: tres columnas
          de texto y un bloque. Arriba lleva el azulejo de la marca como
          banda, que es uno de los dos usos que el brand book autoriza (banda
          o detalle, nunca fondo) y que hasta hoy no estaba en ninguna
          pantalla: `TilePattern` existía exportado y sin un solo call site.
          Es lo que le da a la tarjeta una impronta que no es «caja con texto
          adentro».

          ⚠️ SU ANCHO ES FIJO (21rem) y las otras tres se reparten el resto. Si
          entrara al reparto, en 1400px la tarjeta se comería el mismo cuarto
          que un bloque de links y el destacado dejaría de leerse destacado.

          ⚠️ LA GRILLA ES `desk:` Y NADA MÁS. Abajo de 1344 no existe el botón
          que abre esto —la nav de desktop entera es `desk:`—, así que el
          panel no se muestra nunca en mobile. Los mismos links viven en el
          drawer, en una sola lista.
        */}
        <div
          className={[
            'absolute inset-x-0 top-full border-b border-fog bg-bone',
            'transition-all duration-200',
            moreOpen
              ? 'visible translate-y-0 opacity-100'
              : 'invisible pointer-events-none -translate-y-1 opacity-0',
          ].join(' ')}
        >
          {/*
            ⚠️ EL `pt-11` NO ES AIRE DE DISEÑO: ES LA SOMBRA DEL LOGO. El
            lockup cuelga por debajo del filete del header —cae justo encima
            de donde empieza el panel, y justo en el centro de la página, que
            es donde arranca la tercera columna—, y es opaco y va en `z-30`,
            así que lo que quede abajo lo tapa. Con el `pt-9` de la grilla
            vieja el rótulo de esa columna desaparecía debajo del logo.

            Los 44px dejan 18px de aire entre el borde de abajo del lockup y
            la primera línea de texto.

            ⚠️ BAJÓ DE 64px A 44 CUANDO SE FUE EL MEDALLÓN. El número no es
            una preferencia: es cuánto cuelga el logo más los 18 de aire. Con
            el círculo de 120px colgaban 46px; el lockup de 80px cuelga 26.
            Si el logo vuelve a cambiar de tamaño, este número cambia con él.
          */}
          <div className="caja-ancha grid gap-x-10 gap-y-9 pt-11 pb-11 desk:grid-cols-[repeat(3,minmax(0,1fr))_21rem]">
            {NAV_MORE_GROUPS.map((group) => (
              <div key={group.label}>
                {/*
                  El rótulo NO es un link: es una etiqueta. Ver `nav.ts`.

                  ⚠️ ES EL MISMO EYEBROW QUE ABRE UNA SECCIÓN EN LAS 22 PÁGINAS
                  INTERNAS: la ola de la marca en teal más el rótulo en `deep`.
                  Era gris (`text-muted`) y del mismo peso que la bajada de
                  cada link, así que la columna no tenía cabeza: se leían ocho
                  cosas del mismo tono y la categoría era una más.

                  El ejemplo que pasó Camila resuelve esto con una pastilla de
                  color por columna. Acá el trabajo ya lo hace una pieza que el
                  sitio tiene y usa en todas partes —`TileMark`, la ola del
                  `PageHero`—, así que el menú se alinea con el resto del sitio
                  en vez de estrenar un componente nuevo que diga lo mismo.

                  ⚠️ `text-deep` en el rótulo: 10.03:1 sobre `bone`. Es el mismo
                  tono que la tarjeta oscura de la cuarta columna, o sea que el
                  verde aparece dos veces en el panel y las dos veces significa
                  «acá empieza algo».
                */}
                {/*
                  ⚠️ LA OLA VA DEBAJO DEL RÓTULO Y NO AL COSTADO, al revés que
                  en el `PageHero`. Ahí el eyebrow es una línea suelta arriba de
                  un titular enorme y la ola lo acompaña de lado; acá el rótulo
                  encabeza una COLUMNA, y puesta al costado la ola empujaba el
                  texto hacia adentro y desalineaba las tres cabezas respecto de
                  los links que tienen abajo. Debajo, en cambio, arranca en el
                  mismo borde izquierdo que todo lo demás y hace de subrayado:
                  cierra el rótulo y abre la lista.
                */}
                <p className="eyebrow text-deep">
                  {group.label}
                  <TileMark className="mt-1.5 block" />
                </p>

                <ul className="mt-3.5 flex flex-col">
                  {group.links.map(({ label, href, hint, badge }) => (
                    <li key={href} className="border-b border-fog last:border-b-0">
                      <Link
                        href={href}
                        onClick={() => setMoreOpen(false)}
                        aria-current={isCurrent(href) ? 'page' : undefined}
                        className="group block py-3.5"
                      >
                        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          {/*
                            ⚠️ `d7` (18px) y no `d5` (28px), que es lo que tenían.
                            Con un rótulo arriba, el título del link ya no carga
                            solo con marcar dónde empieza cada cosa; y a 28px,
                            tres bloques de links no entran en la altura de la
                            tarjeta sin que el panel mida media pantalla.

                            ⚠️ Y va en la letra del cuerpo en negrita, no en la
                            condensada alta: son ocho DESTINOS, o sea la misma
                            cosa que los items de la barra, y siguen la regla
                            única de `NAV_ITEM`. El único texto del panel que
                            conserva la condensada es el título de la tarjeta
                            destacada, que no es un item de lista sino el
                            titular de una pieza.
                          */}
                          <span
                            className={[
                              'font-body text-d7 font-bold leading-none',
                              'transition-colors duration-200',
                              isCurrent(href) ? 'text-terra' : 'text-ink group-hover:text-terra',
                            ].join(' ')}
                          >
                            {label}
                          </span>

                          {/*
                            ⚠️ LA PASTILLA ES `sunset` CON TEXTO NEGRO, que es lo
                            que manda el token: en blanco da 2.54:1. Y va
                            rellena y no en outline porque mide 12px — un borde
                            de 1px a ese tamaño se lee como suciedad.
                          */}
                          {badge ? (
                            <span className="eyebrow rounded-pill bg-sunset px-1.75 py-0.5 text-ink">
                              {badge}
                            </span>
                          ) : null}
                        </span>

                        {hint ? (
                          <span className="mt-1.5 block font-body text-dato font-light leading-[1.5] text-muted">
                            {hint}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/*
              ⚠️ LA TARJETA ES UN SOLO LINK y no una caja con un link adentro.
              El «See Sundays» es texto dentro del mismo `<a>`: dos targets
              anidados al mismo destino le suman una parada al tabulador y un
              anuncio duplicado al lector de pantalla, sin sumar nada.
            */}
            <Link
              href={NAV_MORE_FEATURED.href}
              onClick={() => setMoreOpen(false)}
              aria-current={isCurrent(NAV_MORE_FEATURED.href) ? 'page' : undefined}
              /*
                ⚠️ `on-dark` NO ES DECORATIVO. Es la clase de la casa que da
                vuelta dos cosas que sobre oscuro quedarían mal: el anillo de
                foco pasa a `cream` —en `ink` desaparecería contra el `deep`— y
                `--lead-ink`, el color de las bajadas, pasa a `muted-dark`. La
                misma clase que aplica sola `Section tone="deep"`.

                ⚠️ `overflow-hidden` es lo que recorta el azulejo contra el
                radio de la tarjeta. Sin eso el patrón sale por las esquinas de
                arriba y la tarjeta deja de tener forma.
              */
              className="on-dark group flex flex-col overflow-hidden rounded-card bg-deep sombra-card"
            >
              {/*
                La banda del azulejo. Policroma y sin teñir: los cuatro colores
                son parte del dibujo. Ver `TilePattern.tsx`.

                ⚠️ 72px Y NO LOS 44 QUE TRAE POR DEFECTO. El default está
                calibrado para una banda que cruza la página entera; acá la
                banda mide 336px de ancho, y a 44 entraban siete celdas y media
                que a ese tamaño se leían como un friso de ruido. A 72 entran
                cinco y se reconoce el rombo con la estrella adentro, que es el
                motivo. La celda se ata al alto (`backgroundSize: auto 100%`),
                así que subir la banda es agrandar el dibujo, no repetirlo más.

                De paso ocupa la parte de arriba de una tarjeta que se estira a
                la altura de la columna: sin la banda, esos 72px eran verde
                vacío.
              */}
              <TilePattern height="h-18" />

              <span className="flex flex-1 flex-col p-5">
                {/* `cream` sobre `deep`: 9.44:1. */}
                <span className="eyebrow text-cream">{NAV_MORE_FEATURED.eyebrow}</span>

                <span className="mt-2.5 font-display text-d6 font-bold uppercase leading-[1.1] text-paper transition-colors duration-200 group-hover:text-cream">
                  {NAV_MORE_FEATURED.label}
                </span>

                {/*
                  ⚠️ `muted-dark` y no `muted`: el verde medio de las bajadas
                  está calibrado para fondos claros y sobre `deep` da 2.02:1.
                  Este da 5.95:1 y es el token que existe justamente para eso.
                */}
                <span className="mt-2 font-body text-dato font-light leading-[1.5] text-muted-dark">
                  {NAV_MORE_FEATURED.hint}
                </span>

                {/* `mt-auto`: el CTA se apoya en el piso de la tarjeta aunque la
                    bajada mida dos renglones o tres. */}
                <span className="mt-auto flex items-center gap-1.5 pt-4 font-body text-dato font-medium text-cream">
                  {NAV_MORE_FEATURED.cta}
                  <svg
                    width="14"
                    height="9"
                    viewBox="0 0 14 9"
                    fill="none"
                    aria-hidden="true"
                    className="transition-transform duration-200 ease-brand group-hover:translate-x-0.5"
                  >
                    <path
                      d="M0 4.5h12M8.5 1l3.5 3.5-3.5 3.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Menú full-screen de mobile ─────────────────────────────────── */}
      <div
        id="mobile-nav"
        inert={!drawerOpen}
        className={[
          'fixed inset-0 z-[110] desk:hidden',
          drawerOpen ? 'visible' : 'invisible pointer-events-none',
        ].join(' ')}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className={[
            'absolute inset-0 flex flex-col bg-bone',
            'transition-[opacity,transform] duration-300 ease-brand',
            drawerOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
          ].join(' ')}
        >
          <div className={`flex h-header-sm shrink-0 items-center justify-between ${GUTTER}`}>
            <Image
              src="/brand/logo-primary.svg"
              alt=""
              width={110}
              height={116}
              className="h-10 w-auto"
            />
            <button
              ref={drawerCloseRef}
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="grid h-11 w-11 place-items-center"
            >
              <span className="sr-only">Close menu</span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>

          {/* La lista scrollea; los CTAs quedan fijos abajo.

              ⚠️ ACÁ VA `NAV_PRIMARY` Y NO `NAV_MAIN`: en mobile no hay lados
              —el logo no está en el medio— así que los cinco destinos van
              seguidos y en el orden del embudo. Con `NAV_MAIN`, que ya viene
              filtrado, «What's On» desaparecía del drawer y quedaba sin
              ninguna puerta en teléfono. */}
          <nav aria-label="Site" className={`flex-1 overflow-y-auto pb-6 ${GUTTER}`}>
            <ul className="flex flex-col border-t border-ink/12">
              {[...NAV_PRIMARY, ...NAV_MORE, NAV_MORE_FEATURED].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setDrawerOpen(false)}
                    aria-current={isCurrent(href) ? 'page' : undefined}
                    className="flex items-center justify-between gap-4 border-b border-ink/12 py-3.75"
                  >
                    {/* Misma regla que el desktop: un destino va en la letra
                        del cuerpo, en negrita y en caja baja. Acá el tamaño es
                        `d5` (28px) y no `nav` porque el drawer es una lista a
                        pantalla completa, no una barra. */}
                    <span
                      className={[
                        'font-body text-d5 font-bold',
                        isCurrent(href) ? 'text-ink' : 'text-ink/85',
                      ].join(' ')}
                    >
                      {label}
                    </span>
                    {/* Flecha por ítem: el brief la pide, y además marca el
                        borde derecho del target táctil. */}
                    <svg
                      width="16"
                      height="10"
                      viewBox="0 0 16 10"
                      fill="none"
                      aria-hidden="true"
                      className="shrink-0 text-ink/40"
                    >
                      <path
                        d="M0 5h14M10 1l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div
            className={`shrink-0 border-t border-ink/12 bg-bone pt-4 pb-[calc(16px+env(safe-area-inset-bottom))] ${GUTTER}`}
          >
            <div className="flex flex-col gap-2.5">
              <ButtonLink
                href={NAV_CTA.primary.href}
                variant="primary"
                size="lg"
                onClick={() => setDrawerOpen(false)}
              >
                {NAV_CTA.primary.label}
              </ButtonLink>
              <ButtonLink
                href="/contact"
                variant="secondary"
                size="lg"
                onClick={() => setDrawerOpen(false)}
              >
                Contact
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
