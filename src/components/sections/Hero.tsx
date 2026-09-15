'use client';

import Image from 'next/image';
import { useVenue } from '@/components/shared/VenueProvider';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ButtonLink } from '@/components/shared/Button';
import { ArrowUpRight, Martini, Moon, MusicNote, SunHorizon } from '@/components/shared/Icon';
import { venueStatus } from '@/lib/hours';

/**
 * El hero de la home.
 *
 * Tres bloques apilados: el titular partido en dos placas con el pill de
 * estado al lado, el marco de foto con el recorte, y la bajada con los dos
 * CTAs.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ EL MECANISMO — la placa, el marco y el recorte.
 *
 * Es lo único no evidente del archivo, así que va explicado entero.
 *
 * El titular es «BONITA COMES / TOGETHER» partido en dos elementos. El
 * segundo, «TOGETHER», NO está en el flujo: es una placa posicionada en
 * absoluto que se monta sobre la esquina superior izquierda del marco de la
 * foto, corrida un 56 % de su propio alto hacia arriba.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LA PLACA VA EN `sunset` (NARANJA) Y NO EN `terra`, POR DECISIÓN DE
 * CAMILA TOMADA SOBRE LA PÁGINA. Queda escrito con el número al lado porque
 * es la única excepción viva a la ley del color del repo, y quien la lea
 * mañana tiene que saber que no es un descuido.
 *
 *     #F58521 sobre #FAF6EA  →  2.35:1
 *     mínimo WCAG AA para texto grande  →  3:1
 *
 * Yo la había pasado a `terra` (7.43:1) junto con los otros tres lugares
 * donde el prototipo usa naranja como tinta sobre claro. Camila revisó y
 * pidió el naranja de vuelta ACÁ y sólo acá: los otros tres —«Three of
 * them», «Across from Riverside Park» y los hovers de la nav— se quedan en
 * `terra`.
 *
 * ⚠️ `npm run a11y` NO lo va a marcar nunca, y eso es lo peligroso: la placa
 * es `aria-hidden` porque el h1 ya dice la frase completa, así que axe la
 * saltea. El guard va a seguir dando verde con esto roto para quien ve la
 * página. Si algún día se audita el contraste a ojo, este es el nodo.
 *
 * Lo que lo hace defendible: es un titular de 144px en caja alta y peso 800
 * sobre una placa de fondo propio, o sea el texto más grande y más aislado
 * de todo el sitio. No hay ningún dato que dependa de leerlo —«Bonita comes
 * together» es la marca, no información— y el h1 real lo dice igual para
 * quien no lo ve.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Si la placa se apoyara encima de la foto, el naranja quedaría sobre la
 * imagen y el titular sería ilegible sobre cualquier foto clara. La solución
 * del diseño es un RECORTE: un rectángulo del color del fondo (`bone`) pegado
 * a la esquina del marco, con el radio de 44px espejado abajo a la derecha.
 * La placa cae dentro de ese recorte y la foto arranca donde la placa
 * termina. Se lee como si el marco estuviera mordido.
 *
 * ⚠️ EL RECORTE SE MIDE, NO SE ESCRIBE. Su ancho es «dónde termina la placa,
 * más 26px de aire» y su alto «dónde termina la placa, más 14». Esos dos
 * números dependen del ancho del texto, y el texto está en una condensada
 * variable a un `clamp` de 9vw: cambia con el viewport, con el idioma y con
 * si la fuente ya cargó o todavía está la Arial ajustada de respaldo.
 * Escribirlo como porcentaje da bien en una medida y mal en las otras.
 *
 * Por eso se mide con `getBoundingClientRect` y se re-mide en tres momentos:
 * al montar, en cada resize, y cuando `document.fonts.ready` resuelve. El
 * tercero es el que importa y el que es fácil olvidar — sin él, el recorte
 * queda dimensionado para la fuente de respaldo y al llegar Big Shoulders la
 * placa (que es un 10 % más ancha, ver la nota de `globals.css`) se sale del
 * recorte por la derecha.
 *
 * ⚠️ Hay un valor de arranque en porcentaje (`38%` / `76px`) para el primer
 * pintado y para cuando JS no corre. No es el valor correcto, es el que hace
 * que el hero se vea razonable sin medir: un recorte de más es aire, uno de
 * menos es texto naranja sobre foto.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ ES CLIENT, y por dos motivos independientes: el recorte se mide en el
 * navegador y el pill de estado depende de la hora en Bonita Springs. Los dos
 * arrancan sin resolver y se completan después de montar, que es lo que evita
 * el mismatch de hidratación y que se publique un «Open until 8 PM» viejo
 * desde una página cacheada.
 */

/** Cuánto aire queda entre el borde de la placa y el borde del recorte. */
const NOTCH_PAD_X = 26;
const NOTCH_PAD_Y = 14;

/** Cada cuánto rota el mensaje del pill. */
/*
 * ⚠️ SUBIÓ DE 3400 A 4600 ms. Pedido de Camila: «que el cambio entre uno y otro
 * tenga un efecto más vistoso y no tan rápido para que se vea un juego y se
 * aprecie que eso va cambiando».
 *
 * El número no es sólo «más lento»: la animación de entrada pasó de 420 a
 * 620ms, así que con 3400 el mensaje quedaba QUIETO apenas 2,8 segundos — que
 * es menos de lo que tarda un lector medio en leer «Live music five nights» y
 * mirar el icono. Con 4600 quedan 4 segundos de reposo, que es el tiempo en el
 * que el ojo alcanza a ir del texto al icono y volver.
 */
const STATUS_MS = 4600;

export default function Hero({ fraseMusica }: { readonly fraseMusica: string }) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const plateRef = useRef<HTMLParagraphElement | null>(null);
  const [notch, setNotch] = useState<{ w: number; h: number } | null>(null);

  const [statusIdx, setStatusIdx] = useState(0);
  const venue = useVenue();
  const [status, setStatus] = useState<ReturnType<typeof venueStatus>>(null);

  /* ── El recorte ──────────────────────────────────────────────────────── */

  const syncNotch = useCallback(() => {
    const frame = frameRef.current;
    const plate = plateRef.current;
    if (!frame || !plate) return;
    const f = frame.getBoundingClientRect();
    const p = plate.getBoundingClientRect();
    const w = Math.max(0, Math.round(p.right - f.left + NOTCH_PAD_X));
    const h = Math.max(0, Math.round(p.bottom - f.top + NOTCH_PAD_Y));
    setNotch((prev) => (prev && prev.w === w && prev.h === h ? prev : { w, h }));
  }, []);

  /*
   * ⚠️ `useLayoutEffect` y no `useEffect`. La medición tiene que ocurrir ANTES
   * del pintado: con `useEffect` el navegador alcanza a dibujar un frame con
   * el recorte del 38 % y después lo corrige, y ese salto se ve como un
   * parpadeo del bloque naranja justo en lo primero que mira el visitante.
   */
  useLayoutEffect(() => {
    syncNotch();

    const onResize = () => syncNotch();
    window.addEventListener('resize', onResize, { passive: true });

    /* El `ResizeObserver` cubre lo que el `resize` de window no ve: el marco
       cambia de alto por su propio `clamp(300px,46vw,600px)` y la placa por el
       reflow del titular. */
    const ro = new ResizeObserver(syncNotch);
    if (frameRef.current) ro.observe(frameRef.current);
    if (plateRef.current) ro.observe(plateRef.current);

    /* ⚠️ El tercero, el que se olvida. Ver el bloque de arriba. */
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) syncNotch();
    });

    return () => {
      cancelled = true;
      window.removeEventListener('resize', onResize);
      ro.disconnect();
    };
  }, [syncNotch]);

  /* ── El pill de estado ───────────────────────────────────────────────── */

  useEffect(() => {
    setStatus(venueStatus(venue.hours, 'bar'));
  }, []);

  useEffect(() => {
    const id = setInterval(() => setStatusIdx((i) => i + 1), STATUS_MS);
    return () => clearInterval(id);
  }, []);

  /*
   * ⚠️ Los mensajes salen del ESTADO REAL, no de una lista fija.
   *
   * En el prototipo las cuatro frases estaban escritas a mano («Open until
   * 8 PM», «Happy hour until 6»…) y un prop `venueState` decidía si mostrar
   * el set de abierto o el de cerrado. Acá el horario ya se conoce —`HOURS` en
   * `brand.ts`, y `lib/hours.ts` sabe leerlo— así que la hora de cierre se
   * calcula y no se transcribe. Es la diferencia entre un pill que dice la
   * verdad un martes a las 11 de la noche y uno que no.
   *
   * ⚠️ Mientras `status` es `null` —el primer pintado, antes de montar— el
   * pill muestra el mensaje que NO depende de la hora. Nunca queda vacío ni
   * salta de alto.
   */
  /*
   * ⚠️ CADA MENSAJE VIAJA CON SU ICONO, y el icono cambia con el texto. Antes
   * el círculo naranja tenía el sol clavado y rotaba sólo la frase: el sol
   * decía «atardecer» mientras el texto decía «música en vivo» o «cerrado,
   * volvemos el miércoles». Un icono fijo al lado de un texto que cambia no
   * es neutro — desmiente al texto tres de cada cuatro veces.
   *
   *     abierto      sol sobre el horizonte  (y es el Sunset Bar)
   *     cerrado      luna
   *     happy hour   copa
   *     música       corcheas
   */
  /*
   * ⚠️ CADA FRASE TIENE QUE ENTRAR EN UN SOLO RENGLÓN, y el renglón más
   * angosto NO es el del mobile: es el del monitor grande. Arriba de 1400px
   * la caja deja de crecer pero el h1 sigue —`titan` topea recién en 9rem—,
   * así que el pill se COMPRIME a medida que la pantalla se agranda. Medido
   * con el dev server abierto, el hueco de texto queda en:
   *
   *     390px    215px de texto a 17px
   *     1024px   309px de texto a 19.5px
   *     1280px   428px de texto a 24.3px   ← el más holgado
   *     1920px   288px de texto a 26px     ← el PEOR caso
   *
   * A 26px eso son ~22 caracteres. «Happy hour Wed – Fri, 3–6 PM» pedía 373px
   * (130 %) y caía en dos renglones; «Closed, back Wednesday» pedía 290 (101 %)
   * y también. Las frases de ahora miden, en ese mismo peor caso:
   *
   *     Happy hour Wed – Fri     262px   91 %
   *     Closed till Wednesday    255px   89 %   ← el día más largo de los siete
   *     Live music five nights   244px   85 %
   *     Open until 11 PM         198px   69 %
   *
   * ⚠️ Del happy hour se cayó la hora y NO los días. Entre los dos datos sólo
   * entra uno, y el que no se puede omitir es el de los días: «Happy hour
   * 3–6 PM» leído un sábado es falso. Los rangos completos —días y horas—
   * están en el pill de `/visit`, en `WhatsOn` y en `YardSteps`.
   */
  /*
   * ══════════════════════════════════════════════════════════════════════
   * ⚠️ CADA MENSAJE TRAE SU COLOR DE MEDALLA, y es el cambio que pidió Camila:
   * «icono de pastilla en hero cambiante de color, quiero que resalte más, que
   * se note el cambio, quizá otro color que vaya cambiando».
   *
   * Antes el círculo era `bg-paper` fijo y sólo rotaban el texto y el dibujo.
   * Un círculo blanco sobre el mint es un HUECO: no compite con nada, que era
   * exactamente el argumento con el que se había elegido —está escrito abajo,
   * en la nota del círculo— pero también es lo que hacía que el cambio pasara
   * desapercibido. Con el color rotando, lo primero que se ve de la primera
   * pantalla es que ahí hay algo vivo.
   *
   * ⚠️ ESTO PISA UNA REGLA DE COLOR QUE ESTABA ESCRITA, y conviene saberlo: la
   * nota del círculo argumenta que en esta home el naranja significa «algo en
   * lo que se hace clic». Sigue siendo cierto para los doce `bg-sunset` del
   * repo. La excepción es ésta y es deliberada, con el pedido de por medio.
   *
   * ⚠️ LOS CUATRO COLORES SON DE LA PALETA Y NINGUNO ES TEXTO. Son rellenos, y
   * el glifo de arriba lleva su par medido:
   *
   *     sunset  #F58521  →  ink     8.26:1   abierto
   *     deep    #014545  →  cream   9.44:1   cerrado
   *     cream   #FDF0B4  →  ink    15.55:1   happy hour
   *     river   #0EB6B8  →  ink     8.40:1   música
   *
   * `river` tiene prohibido ser TEXTO (2.50:1 sobre claro) y acá no lo es: es
   * el relleno de un círculo de 92px.
   *
   * ⚠️ LOS CUATRO SE DISTINGUEN ENTRE SÍ SOBRE EL MINT DEL PILL. Es lo que
   * hace que el cambio se lea: dos tonos vecinos rotando parecerían un
   * parpadeo de render. `mint` es #C4F2EC; naranja, verde oscuro, amarillo y
   * teal saltan los cuatro contra ese fondo.
   * ══════════════════════════════════════════════════════════════════════
   */
  const HAPPY = { text: 'Happy hour Wed – Fri', Icon: Martini, medalla: 'bg-cream text-ink' };
  /*
   * ⚠️ EL TEXTO VIENE POR PROPS Y ANTES ESTABA ESCRITO ACÁ. El cliente pidió
   * el 2026-09-15 no dar por definitivo «five nights a week» hasta
   * confirmarlo con los event coordinators, y los datos del dashboard dicen
   * DOS noches con música, no cinco. Ahora la frase la cuenta
   * `content/entertainment.ts` sobre el calendario real.
   */
  const MUSIC = { text: fraseMusica, Icon: MusicNote, medalla: 'bg-river text-ink' };

  const messages = status
    ? status.isOpen
      ? [
          {
            text: status.closesAt ? `Open until ${status.closesAt}` : 'Open now',
            Icon: SunHorizon,
            medalla: 'bg-sunset text-ink',
          },
          HAPPY,
          MUSIC,
        ]
      : [
          {
            text:
              status.reopensOn && status.reopensOn !== 'today'
                ? `Closed till ${status.reopensOn}`
                : 'Closed right now',
            Icon: Moon,
            medalla: 'bg-deep text-cream',
          },
          HAPPY,
          MUSIC,
        ]
    : [MUSIC];

  const message = messages[statusIdx % messages.length];

  return (
    /* ⚠️ El `bg-bone` va en la SECCIÓN y el ancho en el `div` de adentro. Si
       se juntan en un solo elemento, el fondo se recorta a los 1400px de la
       caja y en una pantalla de 1920 quedan dos franjas blancas a los lados.
       Vale para las nueve secciones de la home.

       ⚠️ Y va acá y no en el `<body>`: la superficie base de la HOME es el
       hueso, pero la de las 22 internas sigue siendo el blanco puro. El
       recorte del marco depende de que este color sea exactamente el mismo
       que el del bloque de arriba — ver el bloque del encabezado. */
    <section className="relative bg-bone grano pt-9 lg:pt-18">
      <div className="caja-ancha">
      {/* ── Titular, primera mitad + pill ─────────────────────────────── */}
      {/*
        ══════════════════════════════════════════════════════════════════
        ⚠️ `flex-wrap-reverse` Y NO `flex-wrap`, Y NO ES UN DETALLE.

        Es lo que pone el PILL ARRIBA del titular cuando los dos no entran en
        un renglón, que es lo que pidió Camila mirando el mobile.

        `wrap-reverse` invierte el eje transversal: el orden DENTRO de cada
        línea no cambia —el h1 sigue a la izquierda y el pill a la derecha
        cuando van al lado—, pero las LÍNEAS se apilan al revés. O sea que al
        envolverse, el pill (que es el segundo hijo) queda encima.

        ⚠️ POR QUÉ ESTO Y NO `order-first` CON UN BREAKPOINT. Medido con el
        server abierto, el titular y el pill dejan de apilarse entre los 760 y
        los 800px, y ese umbral NO es un breakpoint de Tailwind: sale de sumar
        el ancho del h1 más el `basis-85` del pill. Con `md:order-none` (768)
        quedaba una franja de ~12px donde el pill volvía abajo estando todavía
        apilado. Y clavar `min-[780px]` ataría el layout a un número que deja
        de valer el día que cambie el titular o el basis.

        `wrap-reverse` no se desincroniza nunca: la condición es exactamente
        «se envolvió», que es la misma que dispara el apilado.

        ⚠️ POR ESO `items-start` Y NO `items-end`. Con el eje transversal dado
        vuelta, `start` y `end` se invierten: `items-start` es lo que apoya el
        pill ABAJO, alineado con el titular, cuando van al lado. Leerlo como
        «arriba» es el error fácil acá.
        ══════════════════════════════════════════════════════════════════
      */}
      <div className="relative flex flex-wrap-reverse items-start justify-between gap-6">
        <h1 className="m-0 font-display text-titan font-extrabold uppercase text-ink">
          {/*
            ══════════════════════════════════════════════════════════════
            ⚠️ EL H1 DICE LA FRASE COMPLETA, «Bonita comes together», aunque
            en pantalla sólo se vea la primera mitad acá arriba.

            La segunda mitad es la placa que está más abajo, sacada del flujo
            con `absolute` para poder montarse sobre el marco de la foto. Un
            `<h1>` no puede contenerla sin perder ese posicionamiento, así
            que la placa va aparte y en `aria-hidden`, y el texto que le
            falta al encabezado se repone acá con `sr-only`.

            ⚠️ NO ES COSMÉTICA DE ACCESIBILIDAD. `npm run check:seo` compara
            el `textContent` del único h1 contra `PAGE_SEO['/'].h1` y falló
            con «esperado: Bonita comes together / real: Bonita Comes»: sin
            esto la home publica un h1 truncado, que es el elemento que más
            pesa en la página para un buscador.

            ⚠️ La minúscula del fuente es correcta y no hay que «arreglarla».
            La caja alta la pone el CSS (`uppercase`), así que en pantalla se
            lee BONITA COMES igual; lo que compara el guard es el texto del
            DOM, y ahí tiene que decir exactamente lo que dice `seo-pages.ts`.
            ══════════════════════════════════════════════════════════════
          */}
          Bonita comes
          <span className="sr-only"> together</span>
        </h1>

        {/*
          El pill de estado. `aria-live="polite"` porque el texto cambia solo:
          sin eso, alguien con lector de pantalla nunca se entera del cambio;
          con `assertive` lo interrumpiría cada 3,4 segundos, que es peor.
        */}
        {/*
          ⚠️ EL ALTO DEL PILL LO PONE SU TEXTO HASTA `lg`, Y ARRIBA DE AHÍ LA
          CAJA DE 80. Antes era 80 en todas las medidas y el resultado eran
          96px de pastilla —80 del círculo más el padding— alrededor de un
          texto de 17px: en mobile y tablet quedaba una cápsula tres veces más
          alta que lo que dice.

          El que mandaba el alto era el CÍRCULO, no el `min-h`. Por eso acá se
          tocan los dos: sin achicar el círculo, bajar el `min-h` no cambia
          nada.

              hasta lg    círculo 36   pastilla 48px   texto 17px
              lg y más    círculo 80   pastilla 96px   texto 19,5 a 26px

          De `lg` para arriba queda exactamente como estaba.
        */}
        {/*
          ══════════════════════════════════════════════════════════════════
          ⚠️ EL ALTO EN DESKTOP LO PONE `self-stretch` Y NO UN NÚMERO. Pedido
          de Camila: «la pastilla del hero debe tener mismo alto que la font
          del título, que encajen a la perfección».

          El pill y el h1 son los dos hijos de un flex row. Con
          `align-self: stretch` el pill toma el alto de SU LÍNEA del flex, y esa
          línea la define el h1, que es el elemento alto. O sea que el pill mide
          exactamente la caja de línea del titular —medido, 110px a 1440— sin
          que nadie tenga que escribir 110 en ningún lado. Si el titular cambia
          de cuerpo, de familia o de interlínea, el pill lo sigue solo.

          Tenía `min-h-20` (80px) contra una línea de 110: quedaba 30px más
          bajo y flotando, que es lo que se veía como que no encajaban.

          ⚠️ SE FUE EL `mb-4.5`. Existía para bajar el pill y que su base
          coincidiera más o menos con la del titular. Con `stretch` el ajuste
          lo hace el flex, y un margen ahí le RESTA alto al estirado: el pill
          volvía a quedar corto, ahora por 18px.

          ⚠️ EL `stretch` ARRANCA EN `sm` Y NO EN `lg`, Y ESTUVO MAL UNA VEZ.
          Lo que decide cuándo hace falta no es un breakpoint sino CUÁNDO EL
          PILL Y EL TITULAR COMPARTEN FILA, y eso pasa entre los 760 y los 800px
          —está medido en la nota de `flex-wrap-reverse`, más arriba—. Con el
          stretch en `lg` (1024) quedaba una franja de 224px de ancho de
          pantalla donde los dos iban al lado y el pill medía su contenido:
          medido a 834px, el titular 64px de alto y el pill 56. Camila: «en
          tablet la pastilla tiene mismo alto que la font? parece más chica».

          Por debajo de los 760 el pill se envuelve y queda solo en su línea,
          así que `stretch` ahí no hace nada: el alto de esa línea es el suyo.
          Por eso puede arrancar tan abajo como `sm` sin efecto colateral.
          ══════════════════════════════════════════════════════════════════
        */}
        <p
          aria-live="polite"
          className="mb-1.5 flex flex-1 basis-85 items-center gap-2.5 rounded-pill bg-mint py-1.5 pr-1.5 pl-5 sm:mb-0 sm:self-stretch lg:gap-3.5 lg:py-2 lg:pr-2 lg:pl-6.5"
        >
          <span className="min-w-0 flex-1 font-body text-pastilla font-medium text-ink">
            {/* La `key` es lo que reinicia la animación: sin ella React
                reusa el nodo, el texto cambia y no hay transición. */}
            <span key={message.text} className="rt-roll inline-block">
              {message.text}
            </span>
          </span>

          {/*
            ⚠️ El círculo lleva la MISMA `key` que el texto, así los dos
            entran juntos. Con la key sólo en el texto, la frase sube con su
            fundido y el icono cambia de golpe en el mismo instante: se ve
            como un parpadeo al lado de una transición, que es peor que no
            animar ninguno de los dos.

            ⚠️ VA EN `paper` Y NO EN `sunset`, y el cambio es de sistema, no de
            gusto. En esta home el naranja significa UNA sola cosa: algo en lo
            que se hace clic o una palabra que se subraya en un titular. Los
            otros doce `bg-sunset` del repo son botones, el CTA del hero, las
            badges de las cards y el hover de los iconos de `FindUs`.

            Este círculo no es ninguna de las dos: es el icono decorativo de un
            pill que sólo informa. Pintado de naranja era la mancha de color más
            fuerte de la primera pantalla —más que el propio CTA, que queda
            abajo del marco— y mandaba a mirar algo que no lleva a ningún lado.

            En blanco sigue siendo un círculo y sigue separando el icono del
            texto, pero se lee como un hueco dentro del mint. El icono queda en
            `ink`: 17.11:1 sobre `paper`.
          */}
          {/*
            ⚠️ EL CÍRCULO CRECIÓ Y EL DIBUJO DE ADENTRO MÁS: 36→44 en mobile y
            80→92 en desktop el círculo, 18→24 y 26→44 el glifo. Pedido de
            Camila: «más grandes los iconos». El que más cambia es el DIBUJO, y
            es a propósito: el círculo ya era grande —80px— pero el icono
            ocupaba 26 de esos 80, o sea un tercio, y se leía como una mota en
            el medio de un disco. A 44 sobre 92 ocupa la mitad, que es la
            proporción de un pictograma.

            ⚠️ LOS 92px SALEN DEL ALTO DEL PILL Y NO DE UN GUSTO. Con
            `self-stretch` el pill mide la línea del titular (110px) y lleva
            `py-2`: quedan 94 libres. 92 deja un pelo de aire y evita que el
            círculo empuje el alto si el titular se achica en algún ancho
            intermedio.

            ⚠️ `rt-medalla` Y NO `rt-roll`. El texto sube con un fundido, que
            para una frase está bien; el círculo entra girando y creciendo, con
            la curva de rebote. Son dos gestos distintos para dos cosas
            distintas, y juntos son lo que hace que el cambio se lea como «un
            juego» y no como un reemplazo. Ver `rt-medalla` en globals.css.

            ⚠️ La `key` es lo que reinicia las dos animaciones: sin ella React
            reusa el nodo, el contenido cambia y no hay transición. Tiene que
            ser la MISMA que la del texto para que los dos entren juntos.
          */}
          <span
            key={`icono-${message.text}`}
            className={`rt-medalla grid size-11 shrink-0 place-items-center rounded-pill lg:size-23 ${message.medalla}`}
          >
            {/* `strokeWidth` uniforme para los cuatro: `Martini` se dibuja en
                1.4 porque en «Three doors» va a 104px, y a este tamaño ese
                trazo se ve más liviano que el resto del juego. */}
            <message.Icon className="size-6 lg:size-11" strokeWidth="1.8" />
          </span>
        </p>
      </div>

      {/* ── Titular, segunda mitad + marco de foto ────────────────────── */}
      <div className="relative mt-3.5 lg:mt-6.5">
        {/*
          ⚠️ Es un `<p>` y no un `<h2>`. Visualmente es la segunda mitad del
          titular, pero un `h2` acá metería un nivel de encabezado falso entre
          el h1 y el primer h2 real de la página, y el índice de encabezados
          que arma un lector de pantalla diría «Together» como si fuera una
          sección. `aria-hidden` porque el texto ya lo anuncia el h1.
        */}
        <p
          ref={plateRef}
          aria-hidden="true"
          /*
            ══════════════════════════════════════════════════════════════
            ⚠️ NO LLEVA `translateY(-56%)`, Y EL FUENTE DEL DISEÑO SÍ LO
            DECLARA. Es deliberado y está verificado, no es una omisión.

            El prototipo escribe `transform: translateY(-56%)` en el style de
            esta placa, pero la placa además tiene `data-reveal`, y el script
            de reveal del propio prototipo hace esto al montar:

                nodes.forEach(n => { n.style.transform = 'translateY(28px)' })
                const show = n => { n.style.transform = 'none' }

            O sea que PISA el transform de la placa: primero con los 28px de
            la entrada y después con `none`. El −56 % declarado no se renderiza
            en ningún estado, ni antes ni después de la animación.

            Medido sobre el HTML compilado del bundle abierto a 1440px:

                original    placa.top = 327   marco.top = 327   → offset 0
                con −56 %   placa.top = 258   marco.top = 331   → −73px

            Con el −56 % la placa se sube 73px y se monta sobre «BONITA
            COMES»: el fondo `bone` de la placa tapa el tercio inferior de
            «COMES». No se lee como un cruce intencional, se lee como un
            bloque encimado.

            Así que se implementa lo que el diseño MUESTRA —que es lo que se
            revisó y aprobó en Claude Design— y no lo que su fuente declara y
            su propio runtime descarta. El recorte se mide igual, porque se
            calcula desde la posición real de la placa.
            ══════════════════════════════════════════════════════════════
          */
          /*
            ⚠️ EL PADDING ES ASIMÉTRICO EN MOBILE: 14px a la izquierda y 6 a la
            derecha. Pedido de Camila: «en mobile reducí este espacio», por el
            hueco entre la última letra de «TOGETHER» y el borde de la placa.

            Los dos lados hacen trabajos distintos y por eso no pueden medir lo
            mismo. El izquierdo COMPENSA el `-left-3.5`: la placa sobresale 14px
            de la caja para que el fondo llegue al borde, y esos mismos 14px de
            padding devuelven la primera letra a la alineación del h1 de arriba.
            El derecho no alinea con nada — es aire suelto, y a 56px de cuerpo
            se leía como que la placa era más ancha que su palabra.

            ⚠️ EL RECORTE DEL MARCO SE ACOMODA SOLO. El notch se calcula
            midiendo dónde termina esta placa (`plateRef` + `syncNotch`), así
            que al achicar el padding derecho el recorte se achica con él. No
            hay ningún número que actualizar del otro lado.

            ⚠️ EN `lg` VUELVEN A SER SIMÉTRICOS (28px). Ahí el cuerpo es de
            144px y la placa se monta sobre el marco de la foto: el aire de la
            derecha deja de leerse como sobra y pasa a ser el respiro que
            separa la palabra del borde del recorte.
          */
          className="pointer-events-none absolute top-0 -left-3.5 z-30 m-0 rounded-door bg-bone grano pr-1.5 pl-3.5 pt-[0.06em] pb-[0.1em] font-display text-titan font-extrabold uppercase text-sunset lg:px-7"
        >
          Together
        </p>

        <div
          ref={frameRef}
          className="relative h-75 w-full overflow-hidden rounded-frame bg-fog lg:h-[46vw] lg:max-h-150"
        >
          {/*
            ⚠️ LA FOTO SE ELIGIÓ Y SE RECORTÓ EN `scripts/build-media.mjs`, y el
            encabezado de esa entrada explica el porqué de la medida, de la
            proporción y del foco. Acá sólo importan tres cosas:

            · El archivo YA VIENE en 2576×1200, que es exactamente 2× el ancho
              tope del marco y su misma proporción. `object-cover` no recorta
              nada: la banda que se ve es la que se eligió.
            · `priority` porque es el LCP de la home.
            · El `alt` DESCRIBE LO QUE SE VE y no lo que vende la sección. El
              anterior decía «The rooftop at sunset, with the food truck yard
              below» sobre una aérea de una clase de yoga, o sea que era falso
              para quien usa lector de pantalla. La regla está en `docs/media.md`.
          */}
          {/*
            ══════════════════════════════════════════════════════════════
            ⚠️ ACÁ ESTUVO UN VIDEO DURANTE UNAS HORAS Y SE FUE. Conviene
            dejarlo escrito para que no vuelva por el mismo camino.

            El cliente preguntó si podíamos usar el video horizontal de su
            propia página `/hostanevent`. Se bajó, se cortó para sacar los
            tramos donde los televisores mostraban Tokio 2020 y playoffs de la
            Stanley Cup —o sea 2021, contra una apertura de enero de 2024— y
            se dejó en dos tramos limpios a 1,45× de velocidad: 15 segundos,
            1,5 MB.

            Camila lo bajó igual, 2026-09-15: «en la home mejor dejemos la
            foto que estaba antes, olvidemos este video, no lo usemos en
            ningún lado». La portada vuelve a ser la foto y el clip no se
            reubica en otra sección.

            ⚠️ SE FUE TAMBIÉN EL `useReducedMotion` DE ESTE ARCHIVO. Existía
            sólo para cambiar el video por la foto; sin video, el hero no
            tiene nada que respetar acá. Si algún día vuelve a haber
            movimiento en la portada, el hook vuelve con él.
            ══════════════════════════════════════════════════════════════
          */}
          <Image
            src="/images/venue/hero-truck-window.jpg"
            alt="Two guests ordering at a lit food truck window at night"
            fill
            priority
            sizes="(min-width: 1400px) 1288px, 100vw"
            className="object-cover"
          />

          {/*
            El recorte. `bg-bone` tiene que ser EL MISMO color que el fondo de
            la sección o se ve el rectángulo.

            ⚠️ Y POR ESO TAMBIÉN LLEVA `grano`: desde que el grano se pinta por
            superficie, «el mismo color» ya no alcanza. El fondo de la sección
            está granulado y este rectángulo, liso, se recorta contra él por
            los 3 niveles que el grano le corre a la media. El color y la
            textura son la misma condición.
          */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 z-20 rounded-br-frame bg-bone grano"
            style={{
              width: notch ? `${notch.w}px` : '38%',
              height: notch ? `${notch.h}px` : '76px',
            }}
          >
            {/*
              ⚠️ LAS DOS ESQUINAS INVERSAS. Camila las pasó dibujadas desde
              Figma con una flecha marcando el ángulo vivo: «aplicá este
              elemento acá, y en mobile y desk adaptá el tamaño para que se vea
              correctamente».

              El recorte tiene tres esquinas que dan a la foto. La de abajo a
              la derecha ya era curva —`rounded-br-frame`, hacia adentro— y las
              otras dos eran ángulos de 90°: donde el borde derecho del recorte
              toca el borde de arriba de la foto, y donde el borde de abajo
              toca el de la izquierda. Ahí el hueso ahora se curva y entra en la
              foto en vez de cortarse.

              ⚠️ VAN ADENTRO DEL RECORTE Y NO AL LADO, y por eso se posicionan
              con `top-full` / `left-full`: el recorte se mide en JS y cambia de
              tamaño con el titular, así que cualquier posición propia habría
              que volver a medirla. Colgadas de sus bordes se acomodan solas.

              ⚠️ EL TAMAÑO LO PONE `--radius-frame`: el mismo radio que las otras
              tres esquinas del marco. Ver la nota de `esquina-inversa` en
              globals.css, que cuenta por qué no es el del Figma.
            */}
            <span className="esquina-inversa top-0 left-full" />
            <span className="esquina-inversa top-full left-0" />
          </div>
        </div>
      </div>

      {/* ── Bajada + CTAs ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-end justify-between gap-8 pt-6.5 pb-cierre lg:pt-11">
        {/*
          ⚠️ UN SOLO RENGLÓN EN TODAS LAS MEDIDAS. Pedido de Camila: «la bajada
          del hero a una línea no a dos (menos en mobile que quizá es
          necesario)».

          El `max-w-[16ch]` de `lg` para arriba partía la frase en «Rooftop bar.
          Four / kitchens. Walk in.» a propósito: era un bloque de dos renglones
          que hacía de contrapeso a los dos CTA del otro lado. Lo que el pedido
          corrige es que ese contrapeso costaba la lectura — son tres frases de
          tres palabras, y partidas al medio la segunda arranca con «kitchens»
          colgando de la nada.

          ⚠️ EN MOBILE SE ENVUELVE IGUAL Y ESTÁ BIEN. A 390px no hay ancho para
          36 caracteres a 25px pase lo que pase: ahí el propio `text-hero-lead`
          es lo que la hace entrar en dos renglones largos en vez de cuatro
          cortos. El pedido ya lo contempla («menos en mobile»).

          ⚠️ NO LLEVA `whitespace-nowrap`. Forzar el no-corte en desktop es
          pedirle a la frase que desborde el flex y empuje a los CTA fuera de la
          caja en cuanto alguien edite el texto. Sin `max-w`, la frase ocupa lo
          que necesita —medido, 367px a 25px contra los ~700 que tiene
          disponibles— y se envuelve sola el día que crezca.

          La interlínea la trae el token (`--text-hero-lead--line-height`), así
          que se fue el `leading-[1.35]` de acá.
        */}
        <p className="m-0 max-w-none font-body text-hero-lead font-light text-ink">
          Rooftop bar. Four kitchens. Walk in.
        </p>
        <div className="flex flex-wrap items-center gap-3.5">
          {/*
            ⚠️ LOS DOS CTA DEL HERO YA SON `<ButtonLink>`. Estaban escritos a
            mano y este comentario decía que era «la única excepción del
            sitio», con el argumento de que `Button` componía en caja alta con
            tracking de señalética y que a este cuerpo eso competía con el
            titular de 144.

            El argumento era bueno y por eso el componente se cambió a él:
            ahora `Button` compone en caja baja para todo el sitio. La
            excepción dejó de tener motivo, y además eran tres —esta y las de
            `EventsBanner` y `WhatsOn`—, cada una con su propio tamaño y su
            propio peso. Ver el encabezado de `Button.tsx`.

            ⚠️ El secundario lleva `ring-ink` y el hover invertido, que no es lo
            que trae `outline`. Ese `ring-ink/25` está calibrado para tarjetas
            sobre blanco; acá el botón es lo último de la primera pantalla,
            sobre `bone`, y a 25 % el filo se despinta. Lo que se comparte es
            el sistema —tamaño, letra, alto, radio—, no el filo.
          */}
          <ButtonLink href="/whats-on" variant="primary" size="lg">
            What&rsquo;s on tonight
            <ArrowUpRight className="size-4" />
          </ButtonLink>
          <ButtonLink
            href="/events"
            variant="outline"
            size="lg"
            className="ring-ink hover:bg-ink hover:text-bone hover:ring-ink"
          >
            {/* ⚠️ Decía «See the yard» y apuntaba a `/the-yard`, que se eliminó
                el 2026-09-15. El destino es ahora `/events`, donde el patio se
                alquila, así que la etiqueta tiene que decir eso: un botón que
                promete ver el patio y abre una página de alquiler es un engaño
                chico pero es un engaño. */}
            Rent the place
          </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
