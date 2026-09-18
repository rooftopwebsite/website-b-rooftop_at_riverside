'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from '@/components/shared/Icon';
import { Heading } from '@/components/shared/Type';

/**
 * LA CARTA COMO LÁMINAS: las páginas del menú impreso, de a una y ampliables.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ESTO REEMPLAZA A LA CARTA DIGITAL, Y ES UN PASO ATRÁS TOMADO A
 * CONCIENCIA. Camila, 2026-09-17: «por el momento el menú del bar no lo
 * tendremos digital como pensé; colocaremos el PDF que está en la web en la
 * mejor calidad posible, en lugar de nuestro menú digital».
 *
 * ⚠️ NO HAY PDF. El sitio vigente publica el menú como DOS IMÁGENES dentro de
 * un slider en `/drink` —está auditado en `docs/current-site-inventory.md`— y
 * se verificó otra vez el 2026-09-17: en el HTML de esa página no hay ningún
 * `_files/ugd/*.pdf`. Lo que hay son dos JPG de 1294×2000, y pedirle a Wix el
 * archivo sin transformar devuelve exactamente lo mismo, así que ésa ES la
 * máxima calidad que existe del material.
 *
 * ⚠️ LO QUE SE PIERDE, para que quede escrito y se pueda revertir sabiendo qué
 * se recupera:
 *
 *   · El menú deja de ser TEXTO. No se puede seleccionar, no lo lee un lector
 *     de pantalla y Google no lo indexa. La página perdió las 50 filas de
 *     producto que tenía.
 *   · Dejan de llegar los cambios del dashboard. La carta digital se
 *     actualizaba sola; una lámina se actualiza cuando el cliente manda una
 *     imagen nueva.
 *
 * ⚠️ VOLVER CUESTA UNA LÍNEA. `BarMenu` sigue en el árbol y `getBarMenu()`
 * también: la página cambia `<MenuSheets />` por `<BarMenu grupos={carta} />` y
 * la carta de la base vuelve entera. No se borró nada.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ SON DOS VISTAS Y LAS DOS MUESTRAN UNA HOJA POR VEZ, con las mismas
 * flechas y el mismo índice. La chica hojea la carta dentro de la página; la
 * grande la deja leer.
 *
 * ⚠️ LA VISTA GRANDE ESTUVO APILADA Y SE DESARMÓ. Camila la había pedido así
 * —«que salga una bajo la otra, como un PDF»— y la idea dependía de que el
 * diálogo scrolleara. Falló dos veces seguidas por el mismo motivo: el scroll
 * se escapaba a la página de atrás. El pedido que la reemplaza es del mismo
 * día: «necesito que se puedan leer las dos hojas; si no, que al hacer clic se
 * abra en grande pero que la segunda no esté debajo sino que estén las flechas
 * para cambiar de una a otra».
 *
 * ⚠️ Y ADEMÁS SACA EL PROBLEMA DE RAÍZ. Con una hoja por vez, encuadrada a la
 * pantalla, NO HAY NADA QUE SCROLLEAR: el scroll aparece sólo cuando se
 * amplía, que es donde uno lo espera. La solución no fue tapar el bug, fue
 * quitarle el terreno.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LA AMPLIACIÓN ES UN `<dialog>` NATIVO y no una librería ni un `div` con
 * `position:fixed`. Sale gratis lo que importa: cierra con Escape, atrapa el
 * foco mientras está abierto, lo anuncia como diálogo modal y el fondo queda
 * inerte. Lo único que hay que escribir es el clic en el telón, que el
 * elemento no trae.
 *
 * ⚠️ Y EL QUE SCROLLEA ES EL PROPIO `<dialog>`. La primera versión le sacaba el
 * tope de alto y ponía el `overflow` en un div de adentro: sin alto fijo, el
 * diálogo crecía hasta los 2000px de la lámina y no quedaba nada que
 * scrollear. Camila: «abro la foto y no puedo scrollear en ella». Con `h-dvh`
 * mide exactamente la pantalla y el contenido se pasa.
 *
 * ⚠️ LA IMAGEN AMPLIADA VA SIN `next/image` Y A PROPÓSITO: acá la gracia es el
 * archivo entero a 1294×2000 para poder leer la letra chica, y el optimizador
 * serviría una versión al ancho de la caja. Es el mismo criterio que la foto
 * del dashboard en `DishCard`.
 * ══════════════════════════════════════════════════════════════════════════
 */

/**
 * Las páginas, con lo que hay EN CADA UNA.
 *
 * ⚠️ EL `alt` DESCRIBE EL CONTENIDO Y NO DICE «foto del menú». Es lo único que
 * le queda a quien usa un lector de pantalla, así que al menos tiene que decir
 * de qué se trata cada lámina.
 *
 * ⚠️ SON DOS HOY Y EL COMPONENTE NO LO SABE: las flechas, el contador y la pila
 * del diálogo salen del largo de esta lista. Si mañana el menú tiene tres
 * páginas, se agrega acá y no se toca nada más.
 */
const PAGINAS = [
  {
    src: '/menus/sunset-bar-1.jpg',
    rotulo: 'Cocktails and specials',
    alt: 'Page one of the Sunset Bar menu: signature cocktails with their ingredients and prices, and the specials.',
  },
  {
    src: '/menus/sunset-bar-2.jpg',
    rotulo: 'Beer, wine and happy hour',
    alt: 'Page two of the Sunset Bar menu: bottled beer, draft beer, seltzers and canned beer, wine by the glass, and the happy hour box.',
  },
] as const;

const ANCHO = 1294;
const ALTO = 2000;

/**
 * El control redondo de las flechas DENTRO DEL VISOR, el mismo que usa el
 * carrusel de la home. Va claro porque atrás tiene el telón negro del diálogo.
 */
const FLECHA =
  'grid size-12 shrink-0 place-items-center rounded-pill bg-bone text-deep shadow-md transition-all duration-300 ease-brand hover:bg-paper active:scale-95 disabled:pointer-events-none disabled:opacity-40 lg:size-13';

/**
 * ══════════════════════════════════════════════════════════════════════════
 * LAS FLECHAS DE LA SECCIÓN, QUE NO SON LAS DEL VISOR Y POR ESO SON OTRA COSA.
 *
 * ⚠️ ERAN INVISIBLES, LITERALMENTE. `FLECHA` es `bg-bone` y esta banda TAMBIÉN
 * es `bg-bone`: el botón era un círculo del mismo color que el fondo, con una
 * sombra suave por todo contraste. Camila, 2026-09-17: «hace un rato probó otra
 * persona la web y la flecha pasó completamente desapercibida, no la veía y no
 * sabía cómo cambiar de página». No es una cuestión de gusto: era un control
 * que existía y que nadie encontraba.
 *
 * ⚠️ AHORA VAN EN `deep` SOBRE `bone`, que es el contraste más fuerte que tiene
 * la paleta sin usar el naranja. El naranja queda descartado a propósito: en
 * este sitio la píldora `sunset` ES el CTA —el del header, el de los heroes— y
 * dos píldoras naranjas en la misma pantalla se pelean por el mismo clic.
 *
 * ⚠️ EL ANILLO Y LA SOMBRA LARGA SON PARTE DEL ARREGLO, no decoración: separan
 * el botón del papel de la banda para que se lea como algo que se toca.
 *
 * ⚠️ LA DESHABILITADA SIGUE VIÉNDOSE. A 0.3 de opacidad no invita al clic pero
 * sigue estando, y es la mitad de la pista: dos flechas, una apagada, dicen
 * «hay otra página» sin que nadie lo explique.
 * ══════════════════════════════════════════════════════════════════════════
 */
const FLECHA_CARTA =
  'grid size-12 shrink-0 place-items-center rounded-pill bg-deep text-paper shadow-lg ring-1 ring-ink/15 transition-all duration-300 ease-brand hover:bg-deeper hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-30 lg:size-14';

export default function MenuSheets() {
  const [indice, setIndice] = useState(0);
  const [abierto, setAbierto] = useState(false);
  /** Qué lámina está ampliada, si hay alguna. Se resetea al cerrar el visor. */
  const [zoom, setZoom] = useState<string | null>(null);
  const dialogoRef = useRef<HTMLDialogElement | null>(null);

  const pagina = PAGINAS[indice];
  const cerrar = useCallback(() => dialogoRef.current?.close(), []);

  /*
   * ══════════════════════════════════════════════════════════════════════════
   * ⚠️ HAY QUE BLOQUEAR EL SCROLL DEL DOCUMENTO A MANO. `showModal()` deja la
   * página de atrás INERTE para el teclado y el clic, pero NO le frena el
   * scroll: la rueda sigue llegando al documento, así que con el visor abierto
   * se movía la página de abajo en vez de la lámina. Camila: «si hago scroll
   * veo que se mueve la página de atrás, no puedo scrollear para ver la imagen
   * 2».
   *
   * ⚠️ ES EL MISMO RECURSO QUE EL DRAWER DEL HEADER —guardar el valor previo,
   * poner `hidden`, restaurar al cerrar— y se copia a propósito: dos formas
   * distintas de bloquear el scroll en el mismo sitio es cómo aparecen los
   * saltos de layout que después nadie sabe de dónde salen.
   *
   * ⚠️ Y SE RESTAURA EN EL `return`, no en el `close`. Si el componente se
   * desmonta con el visor abierto —una navegación con el diálogo arriba— el
   * `body` quedaría trabado para siempre y la página siguiente no scrollearía.
   * ══════════════════════════════════════════════════════════════════════════
   */
  useEffect(() => {
    const d = dialogoRef.current;
    if (!d) return;
    if (abierto && !d.open) d.showModal();
    if (!abierto && d.open) d.close();

    if (!abierto) return;
    /* ⚠️ VAN LOS DOS, `html` Y `body`. Con el `body` solo se seguía escapando:
       en este sitio el elemento que scrollea es el `documentElement`, así que
       taparle el desborde al `body` no alcanzaba. Camila lo reportó dos veces
       —«sigue haciendo scroll por detrás»— y ése era el motivo. */
    const raiz = document.documentElement;
    const previoRaiz = raiz.style.overflow;
    const previoBody = document.body.style.overflow;
    raiz.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      raiz.style.overflow = previoRaiz;
      document.body.style.overflow = previoBody;
    };
  }, [abierto]);

  return (
    <section
      aria-labelledby="carta-title"
      className="banda-arco relative z-[2] bg-bone grano pb-cierre"
    >
      {/*
        ══════════════════════════════════════════════════════════════════════
        ⚠️ EL ENCABEZADO VA CENTRADO Y SIN RÓTULO, y las dos cosas son el mismo
        pedido de Camila, 2026-09-17: «centrá el título, dale más estética de la
        marca, no pongas "the list" que no sé ni qué me indica eso, andá al
        grano, que se entienda qué estoy viendo».

        ⚠️ SE FUE EL EYEBROW «THE LIST». Un rótulo arriba del titular sirve
        cuando CLASIFICA —«Right now», «By the glass»— y acá no clasificaba
        nada: era una etiqueta vaga delante de un titular que tampoco decía qué
        era. Dos líneas para no decir «menú».

        ⚠️ Y EL TITULAR DEJÓ DE SER «EVERYTHING WE POUR». Está bien de voz y es
        exactamente el problema: suena a eslogan y no nombra la cosa. Quien
        llega a esta altura de la página necesita saber en una palabra que está
        mirando la carta.

        ⚠️ EL CUERPO ES `text-banda`, EL MISMO DEL TITULAR DE HAPPY HOUR. Las
        dos secciones quedan una debajo de la otra y ahora se leen como un par:
        mismo tamaño, mismo eje, una arriba de la ola y otra abajo.
        ══════════════════════════════════════════════════════════════════════
      */}
      <div className="caja-ancha pt-14 text-center lg:pt-20">
        <Heading level={2} id="carta-title" className="text-banda text-ink">
          The bar menu
        </Heading>
        <p className="mx-auto mt-gap-bajada max-w-[58ch] text-lead text-body/80">
          Cocktails made daily with fresh juice and house syrups, upstairs, by us. Drafts from
          breweries down the road, and the cans everybody actually orders.
        </p>

        {/*
          ══════════════════════════════════════════════════════════════════
          ⚠️ LAS FLECHAS YA NO SE MONTAN SOBRE LA LÁMINA: LA FLANQUEAN. Estaban
          a caballo del borde, medio botón sobre el menú y medio afuera. Camila,
          2026-09-17: «poné estas flechas por fuera de la imagen, no
          pisándolas». Sobre una lámina que es puro dibujo y texto chico, un
          círculo encima tapa ingredientes y precios, y además el botón perdía
          su forma contra lo que tuviera debajo.

          ⚠️ SIGUEN A MEDIA ALTURA Y NO AL PIE, que es lo que ya estaba resuelto
          y no se toca: la lámina mide 866px de alto, así que con las flechas
          abajo hay que scrollear la hoja entera para pasar de página.

          ⚠️ ES UNA GRILLA DE TRES COLUMNAS Y DOS FILAS, Y LOS BOTONES SON LOS
          MISMOS EN LOS DOS TAMAÑOS. Lo único que cambia es en qué celda cae
          cada cosa: en desktop las flechas van a los costados y el contador
          abajo; en pantalla angosta no hay margen para sacarlas afuera —a 390px
          la lámina ya ocupa todo— así que suben a una fila propia ARRIBA de la
          imagen, con el contador en el medio: «← Page 1 of 2 →». Dos juegos de
          botones habrían sido dos controles duplicados para un lector de
          pantalla.

          ⚠️ ARRIBA Y NO ABAJO EN MOBILE por el mismo motivo de siempre: abajo
          quedan a una hoja de distancia. Arriba se ven antes que la lámina.

          ⚠️ EL `max-w` DE LA LÁMINA ES LO QUE EVITA QUE SE VUELVA UN CARTEL. A
          todo el ancho del contenedor la página mediría 1168 de ancho y 1806
          de alto: una sola lámina ocuparía dos pantallas y el carrusel dejaría
          de tener sentido. Por eso la columna del medio topa en 560 y el
          contenedor crece sólo lo que necesitan las flechas.
          ══════════════════════════════════════════════════════════════════
        */}
        <div className="mx-auto mt-9 grid w-full max-w-[560px] grid-cols-[auto_minmax(0,1fr)_auto] items-center justify-items-center gap-x-3 gap-y-5 md:max-w-[720px] md:grid-cols-[auto_minmax(0,560px)_auto] md:gap-x-5 lg:mt-12 lg:max-w-[760px]">
          <button
            type="button"
            onClick={() => setIndice((i) => Math.max(0, i - 1))}
            disabled={indice === 0}
            aria-label="Previous page of the menu"
            className={`${FLECHA_CARTA} col-start-1 row-start-1`}
          >
            <ArrowLeft className="size-5 lg:size-6" />
          </button>

          {/*
            ⚠️ EL CONTADOR ES TEXTO Y NO PUNTITOS. Con dos páginas, dos puntos
            no dicen cuál es cuál; «Page 1 of 2» lo dice, y además lo lee un
            lector de pantalla sin que haya que explicarle nada.

            ⚠️ Y AHORA ADEMÁS HACE DE RÓTULO DE LAS FLECHAS. En pantalla angosta
            queda entre las dos, así que el control se lee entero de una:
            flecha, «Page 1 of 2», flecha. Era la otra mitad del problema que
            reportó Camila —no sólo no se veía el botón, tampoco se entendía que
            la lámina tuviera una segunda página—.

            ⚠️ `aria-live` PORQUE EL CAMBIO NO MUEVE EL FOCO: quien pasa de
            página con las flechas se queda en el botón, así que sin esto nada
            le avisa que la lámina cambió.
          */}
          <p
            aria-live="polite"
            className="col-start-2 row-start-1 m-0 text-center font-body text-caption font-semibold tracking-eyebrow text-ink/70 uppercase md:col-span-3 md:col-start-1 md:row-start-2"
          >
            Page {indice + 1} of {PAGINAS.length}
          </p>

          <button
            type="button"
            onClick={() => setIndice((i) => Math.min(PAGINAS.length - 1, i + 1))}
            disabled={indice === PAGINAS.length - 1}
            aria-label="Next page of the menu"
            className={`${FLECHA_CARTA} col-start-3 row-start-1`}
          >
            <ArrowRight className="size-5 lg:size-6" />
          </button>

          <div className="col-span-3 col-start-1 row-start-2 w-full md:col-span-1 md:col-start-2 md:row-start-1">
            <button
              type="button"
              onClick={() => setAbierto(true)}
              aria-label={`Enlarge the menu: ${pagina.rotulo}`}
              className="group block w-full cursor-zoom-in overflow-hidden rounded-shell bg-paper sombra-card transition-transform duration-300 ease-brand hover:-translate-y-1"
            >
              <Image
                key={pagina.src}
                src={pagina.src}
                alt={pagina.alt}
                width={ANCHO}
                height={ALTO}
                priority={indice === 0}
                sizes="(min-width: 640px) 560px, 92vw"
                className="block h-auto w-full"
              />
              {/*
              ⚠️ ACÁ ESTABA EL RÓTULO DE LA HOJA —«Cocktails and specials»— Y SE
              FUE. Camila lo tachó sobre la página: la lámina ya dice en grande
              qué es, con el titular impreso del propio menú, así que el rótulo
              repetía en cuerpo chico lo que se lee en cuerpo grande justo
              arriba.

              ⚠️ EL RÓTULO SIGUE EXISTIENDO EN LOS DATOS y no es un olvido: es
              lo que arma el `aria-label` del botón —«Enlarge the menu:
              Cocktails and specials»—, que es la única forma de saber QUÉ se
              está por ampliar si no se ve la imagen.

              ⚠️ Y LA AYUDA QUEDÓ CENTRADA. Sola contra el borde derecho se
              leía como el pie de una tarjeta a la que le falta la otra mitad.
            */}
              <span className="block px-5 py-4 text-center font-body text-caption font-medium text-muted transition-colors duration-200 group-hover:text-terra">
                Tap to enlarge
              </span>
            </button>
          </div>
        </div>
      </div>

      {/*
        ⚠️ EL TELÓN SE CIERRA CON CLIC, y por eso el `onClick` va en el propio
        `<dialog>` comparando el target: el elemento ocupa toda la pantalla y su
        pseudo-elemento `::backdrop` no recibe eventos propios. Si el clic viene
        de adentro de una lámina, el target es otro y no cierra.
      */}
      <dialog
        ref={dialogoRef}
        onClose={() => {
          setAbierto(false);
          setZoom(null);
        }}
        onClick={(e) => {
          if (e.target === dialogoRef.current) cerrar();
        }}
        aria-label="Sunset Bar menu"
        className="h-dvh max-h-dvh w-dvw max-w-dvw overflow-auto overscroll-contain bg-transparent p-0 backdrop:bg-ink/85 backdrop:backdrop-blur-sm"
      >
        {abierto ? (
          <>
            {/*
              ══════════════════════════════════════════════════════════════
              ⚠️ EN EL VISOR SE VE UNA HOJA POR VEZ, Y ESTUVO APILADO UN RATO.
              La versión anterior ponía las dos una abajo de la otra «como un
              PDF» y dependía de que el diálogo scrolleara. Falló dos veces por
              el mismo motivo —el scroll se escapaba a la página de atrás— y
              Camila cortó por lo sano: «necesito que se puedan leer las dos
              hojas; si no, que al hacer clic se abra en grande pero que la
              segunda no esté debajo sino que estén las flechas para cambiar de
              una a otra».

              Y es mejor por algo más que el bug: la hoja SIEMPRE entra entera
              en la pantalla, así que no hay nada que scrollear ni que
              descubrir. El scroll queda sólo para cuando se amplía, que es
              donde se espera.

              ⚠️ EL ÍNDICE ES EL MISMO QUE EL DE AFUERA. Se abre en la hoja que
              estabas mirando y al cerrar el carrusel queda donde la dejaste:
              son la misma lectura en dos tamaños, no dos navegaciones.

              ⚠️ CAMBIAR DE HOJA APAGA EL ZOOM. Si no, la página 2 abría
              ampliada y recortada por donde había quedado la 1.
              ══════════════════════════════════════════════════════════════
            */}
            <div className="flex min-h-full w-full items-center justify-center p-4 sm:p-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={pagina.src}
                src={pagina.src}
                alt={pagina.alt}
                width={ANCHO}
                height={ALTO}
                onClick={() => setZoom(zoom ? null : pagina.src)}
                className={[
                  'block rounded-shell bg-paper shadow-2xl',
                  zoom
                    ? 'w-[1294px] max-w-none cursor-zoom-out'
                    : 'h-auto max-h-[86dvh] w-auto max-w-full cursor-zoom-in',
                ].join(' ')}
              />
            </div>

            {/*
              ⚠️ LAS FLECHAS DEL VISOR VAN `fixed` Y NO `absolute`: el contenido
              del diálogo se mueve cuando la hoja está ampliada, y unas flechas
              que se van de cuadro al hacer zoom no sirven para nada.
            */}
            <button
              type="button"
              onClick={() => {
                setIndice((i) => Math.max(0, i - 1));
                setZoom(null);
              }}
              disabled={indice === 0}
              aria-label="Previous page of the menu"
              className={`${FLECHA} fixed top-1/2 left-3 z-10 -translate-y-1/2 sm:left-6`}
            >
              <ArrowLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setIndice((i) => Math.min(PAGINAS.length - 1, i + 1));
                setZoom(null);
              }}
              disabled={indice === PAGINAS.length - 1}
              aria-label="Next page of the menu"
              className={`${FLECHA} fixed top-1/2 right-3 z-10 -translate-y-1/2 sm:right-6`}
            >
              <ArrowRight className="size-5" />
            </button>

            {/*
              ⚠️ EL PIE DICE DÓNDE ESTÁS Y QUÉ PODÉS HACER. Sin él, en un
              teléfono no hay ninguna pista de que la lámina se amplía: no hay
              cursor que lo insinúe y el gesto de pellizcar no funciona adentro
              de un modal.
            */}
            <p className="pointer-events-none fixed bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-pill bg-ink/80 px-4 py-2 font-body text-caption font-medium text-paper sm:bottom-6">
              Page {indice + 1} of {PAGINAS.length} · {zoom ? 'Tap to fit it back' : 'Tap to zoom in'}
            </p>

            <button
              type="button"
              onClick={cerrar}
              className="fixed top-4 right-4 z-10 flex items-center gap-2 rounded-pill bg-bone px-4 py-2.5 font-body text-base font-semibold text-ink shadow-lg sm:top-6 sm:right-6"
            >
              Close
              {/* La misma X del drawer del header: dos trazos, sin sumar un
                  icono al set de dieciséis que tiene el sitio. */}
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </>
        ) : null}
      </dialog>
    </section>
  );
}
