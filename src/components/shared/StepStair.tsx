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

export default function StepStair({
  items,
  className = '',
}: {
  readonly items: readonly Step[];
  readonly className?: string;
}) {
  return (
    <StaggerGroup
      as="ol"
      className={[
        'flex flex-col',
        /* La grilla se arma recién en `desk`. `gridTemplateColumns` va inline
           porque el número de columnas depende de cuántos pasos haya, y una
           clase de Tailwind tiene que existir en el CSS emitido: `grid-cols-${n}`
           armada con una plantilla no se genera nunca. */
        'desk:grid',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
    >
      {items.map((item, i) => {
        const ultimo = i === items.length - 1;
        return (
          <RevealItem
            key={item.n}
            as="li"
            className={[
              'border-l border-paper/20 pl-[18px]',
              /* El filete inferior cierra la L hacia el peldaño siguiente.
                 En mobile no va nunca: la columna es una sola y el filete
                 izquierdo ya enhebra los tres. */
              ultimo ? 'pb-0' : 'pb-[30px] desk:border-b desk:pb-[56px]',
              'desk:pl-[22px]',
            ].join(' ')}
            style={{ gridColumn: i + 1, gridRow: i + 1 }}
          >
            <div className="grid grid-cols-[26px_minmax(0,1fr)] gap-x-[10px]">
              {/* ⚠️ El número al 70% y no menos. Es texto de 15px sobre `deep`:
                  al 55% da 4.34:1 contra el 4.5:1 que pide AA, y axe ya marcó
                  ese mismo error en la versión anterior de este módulo. Al 70%
                  da 8.05:1. */}
              <span
                aria-hidden="true"
                className="pt-[5px] font-display text-[15px] tabular-nums tracking-[0.08em] text-paper/70"
              >
                {item.n}
              </span>

              <div>
                <Heading level={3} className="text-paper">
                  {item.title}
                </Heading>

                <p className="mt-[12px] max-w-[38ch] text-[16px] leading-[1.6] text-paper/70">
                  {item.body}
                </p>

                {/* Las etiquetas van como texto separado por viñetas y no como
                    chips rellenos: cuatro por paso, doce en la sección, harían
                    que el bloque pareciera un panel de filtros. */}
                <ul className="mt-[14px] flex flex-wrap items-center gap-x-[9px] gap-y-[5px]">
                  {item.tags.map((tag, t) => (
                    <li key={tag} className="flex items-center gap-[9px]">
                      {t > 0 ? (
                        <span
                          aria-hidden="true"
                          className="h-[3px] w-[3px] rounded-pill bg-sunset/70"
                        />
                      ) : null}
                      <span className="font-body text-[13px] font-medium tracking-[0.02em] text-paper/70">
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
