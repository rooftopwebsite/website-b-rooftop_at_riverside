import type { ReactNode } from 'react';
import Section, { type SectionBand, type SectionTone } from '@/components/shared/Section';
import { Eyebrow, Heading } from '@/components/shared/Type';

/**
 * LA LOSA DE FORMULARIO: dos columnas, el texto y los datos a la izquierda, un
 * PANEL TROQUELADO con el formulario a la derecha.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ES LA ESTRUCTURA DEL FORMULARIO DE CONTACTO DE `defoodtruckclub.nl`, que
 * Camila pasó el 2026-09-16: «quiero que tenga esta estructura y estilo». De
 * ahí salen las tres cosas que la definen:
 *
 *   · dos columnas, con el titular, la bajada, un filete y los datos de
 *     contacto en la angosta de la izquierda;
 *   · un PANEL grande a la derecha, con el formulario adentro;
 *   · y un FILETE PUNTEADO por dentro del panel, separado del borde, que es lo
 *     que lo vuelve una etiqueta troquelada y no una caja.
 *
 * ⚠️ ESTO NACIÓ ESCRITO A MANO EN `/events` Y ACÁ SE VUELVE UNA PIEZA. El
 * 2026-09-21 la misma construcción tenía que repetirse tres veces más —una en
 * `/contact` y dos en `/join-us`, una por carril—, y cuatro copias del mismo
 * `grid` con el mismo `inset-3.5` es como se rompe un lenguaje: alcanza con
 * que una de las cuatro no reciba el próximo ajuste. `/events` pasó a usar
 * esta pieza en el mismo commit, así que copias no quedan.
 *
 * ⚠️ EL TROQUEL NO SE INVENTÓ ACÁ: es el mismo `inset-3.5` + `rounded-shell`
 * de `CompareSlab`, de la losa de happy hour de `/sunset-bar` y de las
 * tarjetas de tipo de `/events`.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ EL PANEL Y LA SECCIÓN NUNCA SON DEL MISMO COLOR, y de las dos
 * combinaciones posibles una es mejor que la otra. Los campos son `bg-paper`,
 * o sea blancos:
 *
 *   · sección `paper` + panel `bone` → la píldora de cada campo se recorta
 *     contra el panel y el formulario se lee a un metro de la pantalla;
 *   · sección `bone` + panel `paper` → el panel se ve, pero los campos quedan
 *     sostenidos SÓLO por su borde de 1px y a distancia se deshacen.
 *
 * Por eso el default es `bone` y las tres losas nuevas —`/contact` y los dos
 * carriles de `/join-us`— van así.
 *
 * ⚠️ `/events` ES LA EXCEPCIÓN Y PASA `panelTone="paper"`, no por gusto: su
 * sección TIENE que ser `bone` porque es la que lleva `banda-arco` y el arco se
 * dibuja del color de la sección. Cambiarla a `paper` la pega con la galería,
 * que ya es `paper`, y `npm run check:surfaces` lo marca como «color seguido».
 * Es una deuda chica y anotada: si algún día el arco se despega del color de la
 * sección, esa losa vuelve al default y el problema se va.
 *
 * ⚠️ `items-start` NO ES COSMÉTICO. Sin él las dos columnas son igual de altas
 * y, como la izquierda suele ser más larga, el panel se estira hasta su altura:
 * quedan doscientos y pico de píxeles de fondo vacío debajo del botón de
 * enviar, con el filete punteado corriendo por el costado de la nada. El panel
 * tiene que terminar donde termina el formulario.
 *
 * ⚠️ LA GRILLA ES 0,78 / 1,5 Y LA COLUMNA DEL FORMULARIO ES LA ANCHA. Es la
 * proporción que ya tenía `/events`. La izquierda es texto corto con medida de
 * lectura propia; la derecha tiene que alojar campos de a dos por renglón sin
 * que la píldora quede tan corta que no se lea qué se escribe adentro.
 */
/**
 * Los dos fondos que puede tomar el panel. No hay un tercero a propósito: el
 * panel siempre es una de las dos superficies claras del sitio, y la que va es
 * la que NO tiene la sección. Ver la nota de arriba.
 */
const PANEL = {
  bone: 'bg-bone',
  paper: 'bg-paper',
} as const;

export default function FormSlab({
  id,
  tone = 'paper',
  panelTone = 'bone',
  band = 'lg',
  className,
  eyebrow,
  eyebrowTone = 'terra',
  title,
  titleId,
  lead,
  aside,
  footer,
  children,
}: {
  readonly id?: string;
  readonly tone?: SectionTone;
  /** El fondo del panel. Tiene que ser distinto al de la sección. */
  readonly panelTone?: keyof typeof PANEL;
  readonly band?: SectionBand;
  readonly className?: string;
  readonly eyebrow: string;
  readonly eyebrowTone?: 'deep' | 'terra' | 'plum' | 'cream';
  readonly title: ReactNode;
  /** El `id` del H2. Es el destino del `aria-labelledby` de la sección. */
  readonly titleId: string;
  readonly lead?: ReactNode;
  /**
   * Lo que va DEBAJO del filete en la columna izquierda: los mails, el
   * teléfono, las vacantes. Es lo que cambia entre las cuatro losas.
   *
   * ⚠️ VA ACÁ Y NO AL PIE DEL FORMULARIO, que es donde estaba antes en las dos
   * páginas. Es el lugar que le da la referencia y además resuelve algo real:
   * quien no quiere llenar el formulario tiene la salida A LA VISTA antes de
   * empezar, no después de scrollear los quince campos.
   */
  readonly aside?: ReactNode;
  /**
   * Una línea DENTRO del panel, debajo del formulario.
   *
   * ══════════════════════════════════════════════════════════════════════
   * ⚠️ NACIÓ EL 2026-09-22 PARA `/join-us`. Camila, sobre la captura del
   * carril de trabajo: «el main ponlo dentro de la card de formulario».
   *
   * Ese mail vivía en la columna izquierda, bajo un rótulo «Or skip the
   * form» que ella tachó en la misma captura. La nota de `aside` defiende
   * justamente esa posición —la salida a la vista ANTES de llenar campos— y
   * sigue valiendo para el teléfono y los buzones de `/contact` y `/events`.
   * No vale para éste: no es una alternativa al formulario, es la vía para
   * mandar un CV adjunto, que es un archivo que el formulario no recibe.
   * Adentro del panel y debajo del botón es donde alguien se entera de eso
   * en el momento en que lo necesita.
   *
   * ⚠️ NO ES UN `<p>` HECHO ACÁ CON EL TEXTO POR PROP: es un `ReactNode`
   * entero, porque adentro va un link y cada losa escribe su frase.
   * ══════════════════════════════════════════════════════════════════════
   */
  readonly footer?: ReactNode;
  readonly children: ReactNode;
}) {
  return (
    <Section
      id={id}
      tone={tone}
      band={band}
      labelledBy={titleId}
      className={['scroll-mt-24', className].filter(Boolean).join(' ')}
    >
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.5fr)] lg:gap-16">
        <div>
          <Eyebrow tone={eyebrowTone}>{eyebrow}</Eyebrow>
          <Heading level={2} id={titleId} className="mt-gap-kicker text-d4 lg:text-d3">
            {title}
          </Heading>
          {lead ? (
            <p className="mt-gap-bajada max-w-[42ch] font-body text-lead font-light text-body/80">
              {lead}
            </p>
          ) : null}

          {aside ? (
            <>
              {/* El filete de la referencia: separa el argumento de los datos. */}
              <hr className="mt-9 w-full border-0 border-t border-ink/15" />
              <div className="mt-6">{aside}</div>
            </>
          ) : null}
        </div>

        {/*
          ⚠️ SON DOS CAJAS, UNA ADENTRO DE LA OTRA, y así está hecha la de la
          referencia: la de afuera pone el color y el radio grande, la de
          adentro pone el filete punteado y el aire. Con una sola caja, un borde
          punteado sobre el radio de 44px queda pegado al contenido justo en las
          esquinas, que es donde la curva se come el padding.

          El filete va en `absolute` y no como borde del contenedor del
          formulario para que el aire de adentro no dependa de él: el panel
          respira con su propio padding y el troquel flota encima.
        */}
        <div
          className={`relative rounded-frame ${PANEL[panelTone]} px-5 py-9 sm:px-9 sm:py-11`}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-3.5 rounded-shell border border-dashed border-deep/35"
          />
          <div className="relative">
            {children}
            {footer ? (
              /* El filete lo separa del botón de enviar sin sacarlo del panel:
                 es parte del formulario, no una sección aparte. */
              <p className="mt-7 border-t border-ink/12 pt-6 font-body text-base font-light leading-[1.6] text-body/80">
                {footer}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </Section>
  );
}
