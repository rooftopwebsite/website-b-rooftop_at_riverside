import HorizonBorder from './HorizonBorder';
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

export default function CompareSlab({
  eyebrow,
  title,
  /** La palabra o frase del titular que va en el acento. Ver la nota de abajo. */
  accent,
  lead,
  id,
  ours,
  theirs,
}: {
  readonly eyebrow: string;
  readonly title: string;
  readonly accent?: string;
  readonly lead?: string;
  readonly id: string;
  readonly ours: CompareColumn;
  readonly theirs: CompareColumn;
}) {
  return (
    <>
      <HorizonBorder from="paper" to="deep" />
      <Section tone="deep" band="lg" labelledBy={id}>
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
        <div className="mt-bloque grid items-stretch gap-8 lg:grid-cols-2 lg:gap-10">
          {[
            { col: ours, nuestro: true },
            { col: theirs, nuestro: false },
          ].map(({ col, nuestro }) => (
            <div
              key={col.label}
              className="relative flex flex-col rounded-frame bg-bone grano px-6 pt-10 pb-10 text-center sm:px-10"
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

              <div className="relative flex flex-1 flex-col">
                {/*
                  ══════════════════════════════════════════════════════════
                  ⚠️ EL RÓTULO ES UNA MARCA VISUAL Y NO UN TÍTULO DE TEXTO.
                  Camila, 2026-09-16: «cambiá el "aquí" y "un restaurante", poné
                  algo más visual, quizá el logo de Rooftop pero sólo el camión,
                  y del otro lado algo que represente un restaurante común, o
                  creemos un sticker que diga "restaurante común"».

                  De un lado va el isotipo del camión, que es el logo del
                  cliente reducido a la pieza que corresponde acá. Del otro, un
                  sello: píldora de filo punteado en rojo, en caja alta y con
                  una inclinación de 4 grados, que es el idioma de un sello de
                  goma. No existe un icono de «restaurante común» y dibujar uno
                  sería inventarle un símbolo a algo que no es una marca.

                  ⚠️ EL `<h3>` NO DESAPARECE, SE VUELVE INVISIBLE. La columna
                  necesita nombre en el árbol de encabezados: sin él, quien
                  navega por títulos encuentra un `<h2>` y después cinco
                  renglones sueltos sin saber de qué lado están. El dibujo es
                  para el ojo; el `<h3>` es para todo lo demás.
                  ══════════════════════════════════════════════════════════
                */}
                <Heading level={3} className="sr-only">
                  {col.label}
                </Heading>

                <div aria-hidden="true" className="flex h-16 items-center justify-center">
                  {nuestro ? (
                    <Image
                      src="/brand/isotype-truck.svg"
                      alt=""
                      width={552}
                      height={390}
                      className="h-13 w-auto"
                    />
                  ) : (
                    <span className="-rotate-4 rounded-pill border-2 border-dashed border-terra/65 px-5 py-1.5 font-display text-d6 font-bold uppercase leading-none text-terra">
                      A regular restaurant
                    </span>
                  )}
                </div>

                <ul className="mt-8 flex list-none flex-col gap-6 p-0">
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
