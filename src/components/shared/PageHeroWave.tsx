import type { ReactNode } from 'react';
import { Reveal } from './Motion';
import SoftWave from './SoftWave';
import { SURFACE_BG, type Surface } from './WaveBorder';
import { Eyebrow } from './Type';

/**
 * El encabezado CENTRADO que termina en onda.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ES EL HERO DE defoodtruckclub.nl/diensten, CALCADO. Camila, 2026-09-16:
 * «quitá esto y ponele este diseño de header centrado y con la onda que permite
 * cambio de color para luego tener las cards».
 *
 * La anatomía de allá, que es toda la pieza:
 *
 *   · título de display enorme, centrado, solo en la pantalla;
 *   · una bajada corta debajo, centrada y mucho más chica;
 *   · nada más arriba: ni migas, ni foto, ni botones;
 *   · y abajo una ONDA que cambia el color de fondo, con lo cual lo que sigue
 *     —las tarjetas— se apoya en otra superficie.
 *
 * ⚠️ LA ONDA NO ES DECORACIÓN, ES LO QUE HACE FUNCIONAR EL BLOQUE SIGUIENTE.
 * Sin ella el encabezado y las tarjetas comparten fondo y el hero deja de
 * leerse como una portada: se lee como el primer párrafo de una lista. La onda
 * es el corte. Por eso el componente recibe `from` y `to` y no un color solo.
 *
 * ⚠️ SE VAN LAS MIGAS, y en `PageHero` estaban. Camila las tachó en la captura.
 * Es defendible en estas páginas: son de primer nivel —`/food-trucks`,
 * `/sunset-bar`— así que la miga decía «Home / Food Trucks», o sea un solo
 * salto que la nav de arriba ya resuelve. En una página de segundo nivel las
 * migas sí hacen falta y ahí se usa `PageHero`.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ NO REEMPLAZA A `PageHero`, CONVIVE CON ÉL. Aquel lleva foto, migas y
 * botonera y sirve para las páginas que abren con una imagen. Este es para las
 * que abren con una afirmación. El día que todas usen éste, aquel se borra.
 *
 * ⚠️ EL TÍTULO VA EN `text-banda`, que son 112px: el techo de la escala, el
 * mismo de «Not a restaurant. Three of them» en la home. Es el cuerpo que la
 * referencia usa acá y es lo que sostiene un encabezado sin imagen.
 */
export default function PageHeroWave({
  eyebrow,
  title,
  accent,
  lead,
  from = 'paper',
  to = 'bone',
  children,
}: {
  readonly eyebrow?: string;
  readonly title: ReactNode;
  /**
   * La parte del titular que va en el acento, antes del resto.
   *
   * ⚠️ VA EN `sunset-deep` Y NO EN `sunset`. Sobre `paper` el naranja de marca
   * da 2.35:1 y ni siquiera pasa el umbral de texto grande, que es 3:1. El tono
   * diez puntos más oscuro da 3.28:1 sobre `bone` y 3.55:1 sobre `paper`. Es la
   * misma regla que rige el titular de `ThreeDoors` en la home, y está
   * argumentada entera ahí.
   */
  readonly accent?: string;
  readonly lead?: ReactNode;
  /** La superficie del encabezado. */
  readonly from?: Surface;
  /** La superficie de lo que sigue. La onda la dibuja. */
  readonly to?: Surface;
  readonly children?: ReactNode;
}) {
  /*
    ⚠️ EL FONDO SALE DE `SURFACE_BG` Y NO DE `bg-${from}`. `from` es una prop
    en runtime, así que `bg-${from}` no existiría en el CSS emitido: Tailwind
    sólo genera las clases que encuentra escritas literalmente en el código.
    Hasta el 2026-09-23 esto se resolvía con `style`; el mapa de `WaveBorder`
    tiene las clases enteras y evita el estilo en línea.
  */
  return (
    <section aria-labelledby="page-title" className={`grano relative ${SURFACE_BG[from]}`}>
      {/*
        ⚠️ EL `pb` ES GRANDE PORQUE LA ONDA SE COME EL PIE. La ola mide 104px en
        mobile y 168 en desktop, y se apoya en el borde de abajo de la sección:
        sin aire, la bajada queda montada sobre la cresta.

        ⚠️ ES EL ALTO ENTERO DE LA OLA MÁS UN PELO, Y TIENE QUE SERLO. La franja
        de la ola trae fondo propio y opaco —el color de llegada—, así que todo
        lo que le quede debajo desaparece: con un `pb` más chico que la ola, la
        bajada del hero se borraba entera. Por eso los tres valores van atados a
        los tres altos del dibujo: 104 → `pb-28`, 136 → `pb-36`, 168 → `pb-44`.

        ⚠️ Y NI UN PÍXEL MÁS. Camila, 2026-09-21: «que se vean las cards al
        entrar». Cada píxel de aire que se agregue acá es un píxel que las
        tarjetas bajan, y esta página abre justamente para mostrarlas.
      */}
      <div className="caja-ancha pt-14 pb-28 text-center sm:pb-36 lg:pt-16 lg:pb-44">
        <Reveal>
          {eyebrow ? (
            <Eyebrow tone="deep" className="justify-center">
              {eyebrow}
            </Eyebrow>
          ) : null}

          {/*
            `text-balance` reparte las palabras entre renglones en vez de
            llenar el primero: en un titular centrado de dos líneas, el reparto
            disparejo es lo que más se nota.
          */}
          <h1
            id="page-title"
            className="m-0 mx-auto mt-4 max-w-[18ch] text-balance font-display text-banda font-extrabold uppercase leading-[0.9] text-ink"
          >
            {accent ? (
              <>
                <span className="text-sunset-deep">{accent}</span>{' '}
              </>
            ) : null}
            {title}
          </h1>

          {lead ? (
            <p className="mx-auto mt-7 max-w-[62ch] font-body text-lead font-light leading-[1.55] text-body">
              {lead}
            </p>
          ) : null}

          {children ? (
            <div className="mt-9 flex flex-wrap justify-center gap-3">{children}</div>
          ) : null}
        </Reveal>
      </div>

      {/*
        ⚠️ LA ONDA VA `absolute` SOBRE EL BORDE DE ABAJO y no en flujo. En flujo
        sumaría su alto al de la sección y el `pb` de arriba tendría que
        recalcularse cada vez que cambie la cenefa. Apoyada encima, el pie de la
        sección es siempre el mismo y la ola sólo lo tapa.

        El `-bottom-px` es el mismo píxel de siempre: en pantallas con DPR
        fraccional (1,25 y 1,5 de Windows) el redondeo deja una línea del fondo
        asomando entre la cenefa y lo que sigue.

        ⚠️ ES `SoftWave` Y ERA `WaveBorder`, o sea la ondulación larga y no la
        cenefa de rulos. Camila, 2026-09-21: «que las olas sean como la de
        sunset bar, no estas». Es el mismo corte que ya aprobó ahí, así que las
        dos páginas que abren con ola abren con la misma.

        ⚠️ Y POR ESO EL `pb` CRECIÓ. La cenefa medía ~90px y ésta mide 168 en
        desktop: con el pie de antes la curva le comía el último renglón a la
        bajada. El `pb` es el alto de la ola más el aire, y por eso cambia en
        los mismos cortes que el alto de la ola.
      */}
      <SoftWave from={from} to={to} className="pointer-events-none absolute inset-x-0 -bottom-px" />
    </section>
  );
}
