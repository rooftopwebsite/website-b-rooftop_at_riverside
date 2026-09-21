import SoftWave from './SoftWave';
import type { Surface } from './WaveBorder';
import Image from 'next/image';
import Section from './Section';
import { Eyebrow, Heading } from './Type';

/**
 * BLOQUE E DEL KIT: la tabla comparativa sobre losa oscura.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ES EL ÚNICO BLOQUE OSCURO DE LA PÁGINA QUE LO USE. `deep` en este sitio
 * es puntuación, no fondo: la home tiene dos apariciones en 8.300px y la
 * proporción medida es 70–75 % claro. Dos losas seguidas rompen eso.
 *
 * ⚠️ NO ES UNA `<table>`, y es a propósito. Una tabla HTML declara que las
 * celdas se cruzan —fila por columna— y acá no se cruzan: son dos listas
 * paralelas que se leen de arriba abajo, cada una con su encabezado. Con
 * `<table>` un lector de pantalla anunciaría coordenadas que no significan
 * nada. Son dos `<ul>` con su `<h3>`.
 *
 * ⚠️ LA COLUMNA NUESTRA VA PRIMERO EN EL DOM. En mobile las dos columnas se
 * apilan, y la que se lee primero tiene que ser la del argumento propio.
 *
 * ⚠️ EL ✓ Y EL ✗ LLEVAN `aria-hidden` Y SU TEXTO AL LADO. Un lector que sólo
 * anuncia «marca de verificación» no dice de qué lado está.
 * ══════════════════════════════════════════════════════════════════════════
 */

export interface CompareColumn {
  readonly label: string;
  readonly rows: readonly string[];
}

/**
 * El hueco que la sección SIGUIENTE tiene que dejar arriba para que las
 * tarjetas puedan sobresalir: los 128px que sobresalen (`-mb-32`) más 80 de
 * aire.
 *
 * ⚠️ SE EXPORTA PARA QUE EL NÚMERO EXISTA UNA SOLA VEZ. Si el margen negativo
 * cambia y este no, las tarjetas se montan sobre el contenido de abajo.
 *
 * ⚠️ VA EN EL `innerClassName` DE LA SECCIÓN, NO EN EL `className`, y la
 * sección de abajo tiene que llevar además `bandTop="none"`. Puesto en el
 * `className` conviven dos utilidades `padding-top` en el mismo elemento y cuál
 * gana lo decide el ORDEN DEL CSS EMITIDO, no el orden en que se escriben: el
 * hueco salía distinto según qué clase compilara Tailwind primero. Con el
 * padding adentro y la banda en cero, hay un solo `pt` y es el que se ve.
 */
export const PADDING_CRUCE = 'pt-52';

export default function CompareSlab({
  eyebrow,
  title,
  /** La palabra o frase del titular que va en el acento. Ver la nota de abajo. */
  accent,
  lead,
  id,
  ours,
  theirs,
  from = 'bone',
}: {
  readonly eyebrow: string;
  readonly title: string;
  readonly accent?: string;
  readonly lead?: string;
  readonly id: string;
  readonly ours: CompareColumn;
  readonly theirs: CompareColumn;
  /** La superficie de la sección de ARRIBA. De ahí sale la onda. */
  readonly from?: Surface;
}) {
  return (
    <>
      {/*
        ══════════════════════════════════════════════════════════════════
        ⚠️ ERA UN `HorizonBorder` Y AHORA ES LA ONDA. Camila, 2026-09-16:
        «quedémonos con las ondas verdes pero sin el sticker de la palmera,
        sólo las ondas, y animémoslas como en el home».

        El horizonte es una curva suave con el sol y la palmera montados
        encima; la onda es la cenefa festoneada, sin pieza. Dos cosas distintas
        y la que se pidió es la segunda.

        ⚠️ Y ADEMÁS ARREGLA UNA COSTURA QUE ESTABA MAL. El horizonte venía con
        `from="paper"` escrito a mano, pero en `/food-trucks` la sección de
        arriba es `bone`: la curva salía del color equivocado y se veía un
        escalón de 1.08:1 justo antes del corte. Ahora el color de partida es
        una prop y lo pasa quien usa el componente.

        ⚠️ Y DESDE EL 2026-09-21 ES `SoftWave`, LA ONDULACIÓN LARGA, y ya no la
        cenefa de rulos. Camila, sobre esta misma costura: «pon acá también las
        olas». Es el mismo corte que ya estaba aprobado en `/sunset-bar` y en
        el hero de esta página, así que las tres olas de `/food-trucks` son
        ahora la misma: dos cenefas distintas en una página se leían como dos
        marcas.
        ══════════════════════════════════════════════════════════════════
      */}
      <SoftWave from={from} to="deep" className="relative" />
      {/*
        ⚠️ `bandBottom="none"` NO ES UN DESCUIDO: es lo que deja que las
        tarjetas crucen. El `-mb-32` del grid tira 128px hacia abajo, pero el
        `pb` de la banda los sumaba de vuelta, así que las tarjetas terminaban
        justo AL RAS del borde verde en vez de pisarlo. Sin `pb`, el margen
        negativo es lo único que decide cuánto sobresalen.
      */}
      {/*
        ⚠️ LA BANDA DE ARRIBA ES `sm` Y ERA `lg`. Camila, 2026-09-21, sobre el
        hueco entre la ola y «How this works»: «necesito que este espacio sea
        más bajo». Los 128px de `lg` son el aire que una sección necesita
        cuando lo que tiene encima es otra sección; acá lo que tiene encima es
        la ola, que ya termina en unos 100px de verde liso. Sumados eran 230px
        de nada antes del rótulo.

        ⚠️ EL `pb` NO SE TOCA: sigue en `none` por lo de abajo.
      */}
      <Section tone="deep" band="lg" bandTop="sm" bandBottom="none" labelledBy={id}>
        {/*
          ══════════════════════════════════════════════════════════════════
          ⚠️ EL ENCABEZADO VA CENTRADO Y ANTES IBA A LA IZQUIERDA. Camila,
          2026-09-16: «"Voordelen van werken met De Foodtruck Club" es nuestra
          referencia visual para "One yard, five registers"».

          De esa sección se toman cuatro cosas, y son las cuatro que hacen que
          el bloque se lea como una comparación y no como dos listas:

            · titular centrado, con la primera palabra en el acento;
            · las dos columnas son TARJETAS CLARAS sobre la losa oscura, no
              texto suelto;
            · cada tarjeta lleva un FILETE PUNTEADO POR DENTRO, y el color del
              filete es el que dice de qué lado está: el nuestro en el acento,
              el otro en rojo;
            · cada renglón es un icono más un título, centrado.

          ⚠️ LO QUE NO SE COPIA ES EL TONO. Allá la columna de la derecha son
          «los caterings comunes» y las cruces rojas dicen que son peores. Acá
          la derecha es UN RESTAURANTE, que no es peor: es otra cosa. El texto
          ya estaba escrito así y no se toca; lo único que cambia es la forma.
          ══════════════════════════════════════════════════════════════════
        */}
        <div className="mx-auto max-w-[46rem] text-center">
          <Eyebrow tone="cream" className="justify-center">
            {eyebrow}
          </Eyebrow>
          <Heading level={2} id={id} className="mt-gap-kicker">
            {accent ? (
              <>
                <span className="text-sunset">{accent}</span>{' '}
              </>
            ) : null}
            {title}
          </Heading>
          {lead ? <p className="bajada mx-auto mt-gap-bajada text-paper/85">{lead}</p> : null}
        </div>

        {/*
          ⚠️ `items-stretch` PARA QUE LAS DOS TARJETAS MIDAN LO MISMO. El
          contraste del bloque es tarjeta contra tarjeta: si una es más alta,
          el par deja de leerse como un par. La nuestra lleva además el CTA
          abajo, así que sin esto siempre sería la más alta.
        */}
        {/*
          ⚠️ LAS DOS TARJETAS PISAN EL CAMBIO DE FONDO. Camila: «que las dos
          cards pisen el cambio de fondo verde al blanco».

          El margen negativo las saca de la losa oscura y las apoya sobre lo que
          viene abajo. Es el mismo recurso con el que el sticker pisa el borde de
          la tarjeta, una escala más arriba: la pieza cruza la costura en vez de
          respetarla, y eso ata las dos superficies.

          ⚠️ EL `z-10` NO SOBRA. Sin él la sección siguiente, que viene después
          en el DOM, pinta su fondo encima de la mitad que sobresale.

          ⚠️ Y LA SECCIÓN DE ABAJO TIENE QUE DEJARLES LUGAR. Lo hace
          `PADDING_CRUCE`, que se exporta de acá para que el número viva en un
          solo archivo: si cambia el margen negativo, cambia el hueco.
        */}
        {/*
          ⚠️ EL AIRE DE ARRIBA ES MAYOR QUE `bloque` Y NO PUEDE NO SERLO, que es
          la única excepción a ese token en todo el sitio. Camila, 2026-09-17,
          marcó este hueco: el «más espacio» del pedido.

          El motivo es el sticker. `bloque` mide el aire entre una bajada y el
          BORDE de lo que viene abajo, pero acá lo que viene abajo no empieza en
          su borde: el sticker se le monta encima y sobresale media altura, unos
          26px. Con `mt-bloque` el aire real entre el último renglón de la bajada
          y el sticker quedaba en 22px, o sea la mitad del que declara el token.
          72/88 devuelve esos 26px y deja arriba el aire que `bloque` promete.
        */}
        <div className="relative z-10 mt-18 -mb-32 grid items-stretch gap-8 lg:mt-22 lg:grid-cols-2 lg:gap-10">
          {[
            { col: ours, nuestro: true },
            { col: theirs, nuestro: false },
          ].map(({ col, nuestro }) => (
            <div
              key={col.label}
              /*
                ⚠️ EL `pt` BAJÓ DE 56/64 A 44/48. Camila, 2026-09-17, marcó este
                hueco como «menos espacio». El número viejo reservaba lugar para un
                sticker entero, y el sticker entero no está adentro: la mitad de
                arriba cuelga afuera. Lo que hay que reservar es su MITAD, unos 26px,
                más el aire que la separa del primer ítem.

                44px dejan 18px libres bajo el sticker de los trucks. El de la otra
                tarjeta está rotado 4°, que sobre 210px de ancho le agrega 7px de
                alto por esquina: con 48 en `sm` —que es donde ese sticker ya mide
                todo lo que va a medir— le quedan 15px. Ninguno de los dos toca el
                primer ítem, y por debajo de esto sí lo tocarían.
              */
              className="relative flex flex-col rounded-frame bg-bone grano px-6 pt-11 pb-10 text-center sm:px-10 sm:pt-12"
            >
              {/*
                EL FILETE PUNTEADO INTERIOR. El color es el que dice de qué
                lado está la tarjeta, que es exactamente lo que hace la
                referencia con su verde y su rojo.

                Ratios sobre `bone`: `teal600` 4.62:1 y `terra` 7.19:1. Es un
                filete y no texto, así que no necesitaba pasar; pasa igual.
              */}
              <span
                aria-hidden="true"
                className={[
                  'pointer-events-none absolute inset-3.5 rounded-shell border border-dashed',
                  nuestro ? 'border-teal600/55' : 'border-terra/45',
                ].join(' ')}
              />

              {/*
                ══════════════════════════════════════════════════════════
                ⚠️ LA MARCA ES UN STICKER QUE PISA EL BORDE DE ARRIBA, mitad
                adentro y mitad afuera. Camila, 2026-09-16: «los stickers del
                logo y el "a regular restaurant" pongámoslos literalmente como
                sticker, como en el header o los 3 pasos de la home, que pisen
                mitad card mitad no».

                Es la misma construcción que el sticker de los pasos 01/02/03
                de la home: `absolute` sobre el borde, centrado, con
                `-translate-y-1/2` que lo parte exactamente en el filo, y la
                clase `.sticker` que le da la sombra de dos pasadas.

                ⚠️ LA SOMBRA ES LO QUE LO HACE LEER COMO PEGADO, y es la razón
                por la que hay una plancha `bone` detrás de cada uno. Sin
                relleno propio, `drop-shadow` sigue el alfa del dibujo y la
                sombra sale por dentro de las letras en vez de por el contorno
                de la pieza. El logo del header hace lo mismo con `.plancha`.

                ⚠️ EL `pt` DE LA TARJETA SUBIÓ A 56/64px. El sticker ocupa la
                mitad de su alto dentro de la tarjeta, así que sin ese aire el
                primer renglón de la lista le quedaba debajo.
                ══════════════════════════════════════════════════════════
              */}
              <Heading level={3} className="sr-only">
                {col.label}
              </Heading>

              <span
                aria-hidden="true"
                className="sticker absolute -top-px left-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
              >
                {nuestro ? (
                  <span className="block rounded-pill bg-bone px-5 py-3">
                    <Image
                      src="/brand/isotype-truck.svg"
                      alt=""
                      width={552}
                      height={390}
                      className="h-10 w-auto"
                    />
                  </span>
                ) : (
                  <span className="-rotate-4 block rounded-pill bg-bone px-5 py-2.5 ring-2 ring-terra/65 ring-inset">
                    <span className="block font-display text-d6 font-bold uppercase leading-none whitespace-nowrap text-terra">
                      A regular restaurant
                    </span>
                  </span>
                )}
              </span>

              <div className="relative flex flex-1 flex-col">
                {/* El `mt` acompaña al `pt` de la tarjeta: los dos formaban el hueco
                  que Camila marcó, así que bajar uno solo dejaba la mitad del
                  problema en pie. 32 → 24. */}
                <ul className="mt-6 flex list-none flex-col gap-6 p-0">
                  {col.rows.map((r) => (
                    <li key={r} className="flex flex-col items-center gap-2.5">
                      <span
                        aria-hidden="true"
                        className={[
                          'grid size-5.5 shrink-0 place-items-center rounded-pill text-[12px] font-bold',
                          nuestro ? 'bg-teal600 text-paper' : 'bg-terra text-paper',
                        ].join(' ')}
                      >
                        {nuestro ? '✓' : '✕'}
                      </span>
                      <span className="max-w-[34ch] font-body text-base leading-[1.5] text-ink">
                        <span className="sr-only">{nuestro ? 'Yes: ' : 'No: '}</span>
                        {r}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* ⚠️ ACÁ HABÍA UN CTA Y SE FUE, tachado por Camila. La página ya
                    cierra con el banner de la rotación cuatro secciones más
                    abajo, que es donde la acción corresponde. Esta sección
                    explica, no convierte. */}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
