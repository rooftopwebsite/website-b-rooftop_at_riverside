'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { BRAND } from '@/lib/brand';
import { NAV_CTA, NAV_MAIN, NAV_MORE, NAV_MORE_FEATURED, NAV_MORE_GROUPS } from '@/lib/nav';
import { ButtonLink } from './Button';
import { CaretDown } from './Icon';
import { GUTTER } from './Section';

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

/** La clase de un item de la nav. Se comparte con el botón «More». */
const NAV_ITEM = [
  'font-display text-nav font-bold uppercase tracking-[0.02em]',
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

            ⚠️ EL CÍRCULO ES EL «ESPACIO REDONDO» y cuelga por debajo de la
            barra a propósito. Es `bone` opaco —el mismo color del header y
            del hero— así que tapa el filete de `fog` justo donde pasa, y lo
            que se ve es la línea entrando y saliendo de un medallón. Si
            fuera transparente o del mismo tamaño que la barra, el filete lo
            cruzaría por el medio y el efecto se pierde.

            ⚠️ El `ring` va en `fog`, el mismo token del filete que corta: es
            lo que hace que el círculo se lea como una continuación de la
            barra y no como una pieza pegada encima.

            ⚠️ Los dos grupos de los costados llevan `pr`/`pl` en `desk` para
            no meterse debajo del medallón. Sin eso, el último item de la nav
            pasa por atrás del círculo en las pantallas donde la nav crece.
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
            aria-label={`${BRAND.name} — home`}
            className="group absolute top-1 left-1/2 z-30 grid size-25 -translate-x-1/2 place-items-center rounded-pill bg-bone ring-1 ring-fog transition-shadow duration-300 ease-brand hover:shadow-btn desk:size-30"
          >
            <Image
              src="/brand/logo-primary.svg"
              alt=""
              width={240}
              height={254}
              priority
              className="h-13 w-auto transition-transform duration-300 ease-brand group-hover:scale-105 desk:h-16"
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
              ⚠️ «Contact» va como TEXTO PLANO y no como botón, y es lo que
              deja respirar la barra. Con dos botones —era «What's On» en
              `outline` + «Plan an Event» en relleno— el extremo derecho tenía
              dos cajas compitiendo y el CTA real perdía. Un link de texto al
              lado de una píldora naranja tiene una jerarquía que se lee de
              una: uno es la salida de servicio, el otro es la acción.
            */}
            <Link
              href="/contact"
              className="hidden font-body text-dato text-ink transition-colors duration-200 hover:text-terra desk:block"
            >
              Contact
            </Link>
            <ButtonLink
              href={NAV_CTA.primary.href}
              variant="primary"
              className="hidden normal-case tracking-normal sm:inline-flex"
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

          ⚠️ SE FUERON LOS FILETES POR ITEM. Cada link tenía un `border-t` en
          `fog`, y con ocho links del mismo peso ese filete era lo único que
          armaba grilla. Ahora la estructura la dan los rótulos, y ocho
          filetes más tres rótulos son dos sistemas de agrupación peleando por
          decir lo mismo. El único filete que queda es el que cierra la banda
          contra la página.

          ⚠️ LA CUARTA COLUMNA ES LA ÚNICA CAJA DEL PANEL. Va en `bone` sobre
          `paper` — el mismo escalón de 1.08:1 que en la barra se evitó a
          propósito, pero acá se busca: es un rectángulo chico, con radio y
          con `ring` en `fog`, así que se lee como tarjeta y no como un
          cambio de fondo. Es lo que la separa de las tres columnas de texto.

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
            'absolute inset-x-0 top-full border-b border-fog bg-paper',
            'transition-all duration-200',
            moreOpen
              ? 'visible translate-y-0 opacity-100'
              : 'invisible pointer-events-none -translate-y-1 opacity-0',
          ].join(' ')}
        >
          {/*
            ⚠️ EL `pt-16` NO ES AIRE DE DISEÑO: ES LA SOMBRA DEL MEDALLÓN. El
            logo mide 120px (`desk:size-30`) y arranca en `top-1` sobre una
            barra de 78px, así que cuelga 46px POR DEBAJO del filete — justo
            encima de donde empieza el panel, y justo en el centro de la
            página, que es donde cae la tercera columna. Con el `pt-9` que
            tenía la grilla vieja, el rótulo de esa columna quedaba tapado por
            el círculo, que es opaco y va en `z-30`.

            Los 64px dejan 18px de aire entre el borde de abajo del medallón y
            la primera línea de texto. Si el medallón cambia de tamaño, este
            número cambia con él.
          */}
          <div className="caja-ancha grid gap-x-10 gap-y-9 pt-16 pb-11 desk:grid-cols-[repeat(3,minmax(0,1fr))_21rem]">
            {NAV_MORE_GROUPS.map((group) => (
              <div key={group.label}>
                {/* El rótulo NO es un link: es una etiqueta. Ver `nav.ts`. */}
                <p className="eyebrow text-muted">{group.label}</p>

                <ul className="mt-4.5 flex flex-col gap-4.5">
                  {group.links.map(({ label, href, hint, badge }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={() => setMoreOpen(false)}
                        aria-current={isCurrent(href) ? 'page' : undefined}
                        className="group block"
                      >
                        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          {/*
                            ⚠️ `d7` (18px) y no `d5` (28px), que es lo que tenían.
                            Con un rótulo arriba, el título del link ya no carga
                            solo con marcar dónde empieza cada cosa; y a 28px,
                            tres bloques de links no entran en la altura de la
                            tarjeta sin que el panel mida media pantalla.
                          */}
                          <span
                            className={[
                              'font-display text-d7 font-bold uppercase leading-none',
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
              className="group flex flex-col rounded-card bg-bone p-5 ring-1 ring-fog transition-shadow duration-300 ease-brand hover:shadow-btn"
            >
              <span className="eyebrow text-muted">{NAV_MORE_FEATURED.eyebrow}</span>

              <span className="mt-2.5 font-display text-d6 font-bold uppercase leading-[1.1] text-ink transition-colors duration-200 group-hover:text-terra">
                {NAV_MORE_FEATURED.label}
              </span>

              <span className="mt-2 font-body text-dato font-light leading-[1.5] text-muted">
                {NAV_MORE_FEATURED.hint}
              </span>

              {/* `mt-auto`: el CTA se apoya en el piso de la tarjeta aunque la
                  bajada mida dos renglones o tres. */}
              <span className="mt-auto flex items-center gap-1.5 pt-4 font-body text-dato font-medium text-terra">
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

          {/* La lista scrollea; los CTAs quedan fijos abajo. */}
          <nav aria-label="Site" className={`flex-1 overflow-y-auto pb-6 ${GUTTER}`}>
            <ul className="flex flex-col border-t border-ink/12">
              {[...NAV_MAIN, ...NAV_MORE, NAV_MORE_FEATURED].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setDrawerOpen(false)}
                    aria-current={isCurrent(href) ? 'page' : undefined}
                    className="flex items-center justify-between gap-4 border-b border-ink/12 py-3.75"
                  >
                    <span
                      className={[
                        'font-display text-d5 font-bold uppercase',
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
