import type { ReactNode } from 'react';
import { RevealItem, StaggerGroup } from './Motion';
import { Heading } from './Type';

/**
 * Los pasos en ESCALERA: cada uno un peldaño más abajo y más a la derecha, con
 * el filete conector en forma de L.
 *
 * Sale de una referencia que mandó Camila: for-living.it, el bloque «We handle
 * all the complexity». Cuatro pasos bajando en diagonal, con un filete que
 * corre por la izquierda de cada bloque y dobla en horizontal hasta el
 * arranque del siguiente.
 *
 * ⚠️ REEMPLAZA A `PinnedList`, y el cambio no es de piel: la lista fijada
 * mostraba UN paso por vez y los otros dos plegados, abriéndolos con el scroll.
 * Acá los tres están abiertos desde el primer momento. Es una decisión distinta
 * sobre el mismo contenido, y gana dos cosas:
 *
 *   · La sección pasa de 2.226px a lo que miden los tres bloques. Con 42vh por
 *     paso, la lista fijada se llevaba 2,3 pantallas de la home para tres
 *     párrafos cortos.
 *   · La secuencia se ve DE UNA. El orden importa —primero pedís, después
 *     subís, después te quedás— y una escalera dice «esto va en orden» sin
 *     obligar a scrollear para descubrirlo, que era justo lo que la lista
 *     fijada hacía trabajar de más.
 *
 * ⚠️ La geometría sale de una GRILLA, no de márgenes. Cada paso ocupa una celda
 * `(fila i, columna i)` de una grilla de N×N: la diagonal cae sola y el ancho
 * de la celda es exactamente la distancia hasta donde arranca el siguiente. Eso
 * es lo que hace que el filete horizontal termine justo en el arranque del
 * peldaño de abajo, sin un solo número calculado a mano.
 *
 * ⚠️ Sin `gap` vertical, y es obligatorio: el filete de abajo de un paso y el
 * de la izquierda del siguiente tienen que TOCARSE para que la L se lea como
 * una línea continua. Con `gap-y` quedaría cortada en cada peldaño.
 *
 * ⚠️ El último paso NO lleva filete inferior. No hay nada a lo que conectar, y
 * una línea que sale hacia la derecha y muere en el aire se lee como que falta
 * un peldaño.
 *
 * ⚠️ En MOBILE no hay escalera. En 390px, tres peldaños de un tercio darían
 * columnas de 130px. Se apila en una sola columna con el filete corrido por la
 * izquierda, que es la misma idea —una secuencia enhebrada— en el ancho que
 * hay.
 */

export interface Step {
  readonly n: string;
  readonly title: string;
  readonly body: string;
  readonly tags: readonly string[];
}

/*
 * La geometría de la escalera como CLASES ENTERAS, indexadas por cantidad de
 * pasos o por peldaño. Tailwind sólo emite lo que lee literal en el código.
 * Alcanza hasta seis pasos; con más, la escalera deja de leerse igual.
 */
const COLUMNAS: Record<number, string> = {
  1: 'desk:grid-cols-1',
  2: 'desk:grid-cols-2',
  3: 'desk:grid-cols-3',
  4: 'desk:grid-cols-4',
  5: 'desk:grid-cols-5',
  6: 'desk:grid-cols-6',
};

/** El media ocupa la columna 1 desde la fila 2 hasta el último peldaño. */
const ALTO_MEDIA: Record<number, string> = {
  1: 'desk:row-span-1',
  2: 'desk:row-span-2',
  3: 'desk:row-span-3',
  4: 'desk:row-span-4',
  5: 'desk:row-span-5',
};

/** Cada peldaño baja una fila y corre una columna: diagonal. */
const PELDAÑO = [
  'desk:col-start-1 desk:row-start-1',
  'desk:col-start-2 desk:row-start-2',
  'desk:col-start-3 desk:row-start-3',
  'desk:col-start-4 desk:row-start-4',
  'desk:col-start-5 desk:row-start-5',
  'desk:col-start-6 desk:row-start-6',
];

export default function StepStair({
  items,
  media,
  className = '',
}: {
  readonly items: readonly Step[];
  /**
   * Lo que va en el TRIÁNGULO VACÍO de abajo a la izquierda.
   *
   * ⚠️ Existe porque la diagonal deja dos tercios de la grilla sin nada, y en
   * la versión oscura esos dos tercios eran 1.430px de verde muerto — el
   * agujero más grande de la home. La escalera se conserva (es la tercera forma
   * y sale de for-living.it), pero el hueco se llena.
   *
   * Se ocupa la celda `(columna 1, filas 2..n)`: es el bloque libre más grande
   * y el único cuya proporción no depende de cuántos pasos haya.
   *
   * ⚠️ Sólo desde `desk`. En mobile no hay escalera —es una columna— así que no
   * hay triángulo, y el media se oculta en lugar de apilarse: apilado sería una
   * foto suelta en el medio de una secuencia numerada.
   */
  readonly media?: ReactNode;
  readonly className?: string;
}) {
  return (
    <StaggerGroup
      as="ol"
      className={[
        'flex flex-col',
        /* La grilla se arma recién en `desk`, con tantas columnas como pasos.
           Sale de `COLUMNAS` y no de `grid-cols-${n}`: una clase armada con
           una plantilla no se genera nunca. Hasta el 2026-09-23 esto iba en
           `style`. */
        'desk:grid',
        COLUMNAS[items.length],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ⚠️ Va PRIMERO en el DOM pero se posiciona en la fila 2 con
          `gridRow`/`gridColumn`. En el orden de lectura queda antes de los
          pasos 2 y 3, y no molesta porque es decorativo: `aria-hidden` lo pone
          quien pasa el media. */}
      {media ? (
        <li
          className={`hidden desk:col-start-1 desk:row-start-2 desk:block desk:pr-8 desk:pt-9 ${ALTO_MEDIA[Math.max(items.length - 1, 1)]}`}
        >
          {media}
        </li>
      ) : null}

      {items.map((item, i) => {
        const ultimo = i === items.length - 1;
        return (
          <RevealItem
            key={item.n}
            as="li"
            className={[
              /* ⚠️ `fog` y no `paper/20`. La escalera pasó a superficie clara,
                 así que el filete tiene que ser un token calibrado sobre claro
                 y no una opacidad de blanco —que sobre `bone` desaparecería—. */
              'border-l border-fog pl-4.5',
              /* El filete inferior cierra la L hacia el peldaño siguiente.
                 En mobile no va nunca: la columna es una sola y el filete
                 izquierdo ya enhebra los tres. */
              ultimo ? 'pb-0' : 'pb-7.5 desk:border-b desk:border-fog desk:pb-14',
              'desk:pl-5.5',
              PELDAÑO[i],
            ].join(' ')}
          >
            <div className="grid grid-cols-[30px_minmax(0,1fr)] gap-x-2.5">
              {/*
                El número del peldaño. La secuencia SÍ es una secuencia —primero
                pedís, después subís, después te quedás— así que numerarla dice
                algo real y no es decoración.

                ⚠️ NO va en `font-display`. La condensada a 15px viola el piso
                de 24px del brief: a ese cuerpo pierde el contraste de trazo que
                la hace funcionar y se lee como una etiqueta borrosa. Pasa a la
                geométrica en 500 con cifras tabulares.

                ⚠️ Y el color es `muted` OPACO, no una opacidad. Antes era
                `paper/70` sobre `deep`, y ese mismo elemento ya había hecho
                fallar a axe una vez al 55 %. Ahora es un token medido: 5.36:1
                sobre `paper`, 4.96:1 sobre `bone`.
              */}
              <span
                aria-hidden="true"
                className="pt-1.75 font-body text-dato font-medium tabular-nums tracking-label text-muted"
              >
                {item.n}
              </span>

              <div>
                <Heading level={3}>{item.title}</Heading>

                <p className="mt-3 max-w-[38ch] text-base text-ink">
                  {item.body}
                </p>

                {/* Las etiquetas van como texto separado por viñetas y no como
                    chips rellenos: cuatro por paso, doce en la sección, harían
                    que el bloque pareciera un panel de filtros. */}
                <ul className="mt-3.5 flex flex-wrap items-center gap-x-2.25 gap-y-1.25">
                  {item.tags.map((tag, t) => (
                    <li key={tag} className="flex items-center gap-2.25">
                      {t > 0 ? (
                        /* Punto separador de 3px. Es decorativo —no transmite
                           información— así que el naranja no necesita pasar
                           contraste de texto acá. Es además uno de los dos o
                           tres detalles donde el `sunset` aparece fuera del CTA. */
                        <span aria-hidden="true" className="h-0.75 w-0.75 rounded-pill bg-sunset" />
                      ) : null}
                      <span className="font-body text-micro font-medium text-muted">
                        {tag}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </RevealItem>
        );
      })}
    </StaggerGroup>
  );
}
