'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
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
 * ⚠️ La placa va en `terra` y no en `sunset` como el prototipo. El naranja
 * sobre `bone` da 2.35:1 y no pasa AA ni a 144px. Acá axe NO lo marca —la
 * placa es `aria-hidden`, porque el h1 ya dice el texto completo— así que el
 * guard no habría avisado nunca: el problema es para quien VE la página. El
 * razonamiento completo está en el encabezado de `ThreeDoors.tsx`.
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
const STATUS_MS = 3400;

export default function Hero() {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const plateRef = useRef<HTMLParagraphElement | null>(null);
  const [notch, setNotch] = useState<{ w: number; h: number } | null>(null);

  const [statusIdx, setStatusIdx] = useState(0);
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
    setStatus(venueStatus('bar'));
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
  const HAPPY = { text: 'Happy hour Wed – Fri, 3–6 PM', Icon: Martini };
  const MUSIC = { text: 'Live music five nights', Icon: MusicNote };

  const messages = status
    ? status.isOpen
      ? [
          {
            text: status.closesAt ? `Open until ${status.closesAt}` : 'Open now',
            Icon: SunHorizon,
          },
          HAPPY,
          MUSIC,
        ]
      : [
          {
            text:
              status.reopensOn && status.reopensOn !== 'today'
                ? `Closed — back ${status.reopensOn}`
                : 'Closed right now',
            Icon: Moon,
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
    <section className="bg-bone pt-9 lg:pt-18">
      <div className="caja-ancha">
      {/* ── Titular, primera mitad + pill ─────────────────────────────── */}
      <div className="relative flex flex-wrap items-end justify-between gap-6">
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
        <p
          aria-live="polite"
          className="mb-1.5 flex min-h-20 flex-1 basis-85 items-center gap-3.5 rounded-pill bg-mint py-2 pr-2 pl-6.5 lg:mb-4.5"
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
          */}
          <span
            key={`icono-${message.text}`}
            className="rt-roll grid size-20 shrink-0 place-items-center rounded-pill bg-sunset"
          >
            {/* `strokeWidth` uniforme para los cuatro: `Martini` se dibuja en
                1.4 porque en «Three doors» va a 104px, y a 26px ese trazo se
                ve más liviano que el resto del juego. */}
            <message.Icon className="size-6.5 text-ink" strokeWidth="1.8" />
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
          className="pointer-events-none absolute top-0 -left-3.5 z-30 m-0 rounded-door bg-bone px-3.5 pt-[0.06em] pb-[0.1em] font-display text-titan font-extrabold uppercase text-terra lg:px-7"
        >
          Together
        </p>

        <div
          ref={frameRef}
          className="relative h-75 w-full overflow-hidden rounded-frame bg-fog lg:h-[46vw] lg:max-h-150"
        >
          <Image
            src="/images/venue/venue-aerial.jpg"
            alt="The rooftop at sunset, with the food truck yard below"
            fill
            priority
            sizes="(min-width: 1400px) 1288px, 100vw"
            className="object-cover"
          />

          {/*
            El recorte. `bg-bone` tiene que ser EL MISMO color que el fondo de
            la sección o se ve el rectángulo.
          */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 z-20 rounded-br-frame bg-bone"
            style={{
              width: notch ? `${notch.w}px` : '38%',
              height: notch ? `${notch.h}px` : '76px',
            }}
          />
        </div>
      </div>

      {/* ── Bajada + CTAs ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-end justify-between gap-8 pt-6.5 pb-12 lg:pt-11 lg:pb-24">
        <p className="m-0 max-w-[16ch] font-body text-intro font-light leading-[1.35] text-ink">
          Rooftop bar. Four kitchens. Walk in.
        </p>
        <div className="flex flex-wrap items-center gap-3.5">
          {/*
            ⚠️ Los dos CTA del hero NO usan `<ButtonLink>`, y es la única
            excepción del sitio. El componente compone en caja alta con
            tracking de señalética —que es el registro correcto para un botón
            de 15px suelto en una barra— y acá los dos botones miden 17px y
            viven debajo de un titular de 144. En caja alta a ese cuerpo
            compiten con el titular; en caja baja se leen como lo que son, el
            pie del hero. El resto —relleno `sunset`, texto NEGRO, píldora,
            44px de alto mínimo— es idéntico y sigue las mismas reglas.
          */}
          <Link
            href="/whats-on"
            className="flex min-h-11 items-center gap-2.5 rounded-pill bg-sunset px-7.5 py-4 font-body text-dato font-medium text-ink transition-colors duration-200 hover:bg-sunset-hover"
          >
            What&rsquo;s on tonight
            <ArrowUpRight className="size-4" />
          </Link>
          <Link
            href="/the-yard"
            className="flex min-h-11 items-center rounded-pill px-7.5 py-4 font-body text-dato font-medium text-ink ring-1 ring-ink transition-colors duration-200 hover:bg-ink hover:text-bone"
          >
            See the yard
          </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
