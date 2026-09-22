import type { ComponentType, ReactNode } from 'react';
import type { IconProps } from '@/components/shared/Icon';
import { Heading } from '@/components/shared/Type';
import { RevealItem, StaggerGroup } from '@/components/shared/Motion';

/**
 * LA FICHA TÉCNICA, COMO COLLAGE DE DOS COLUMNAS DESFASADAS.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ CALCADA DEL CÓDIGO DE LA REFERENCIA, que Camila pasó entero el
 * 2026-09-22: «esta sección debe mejorar, te dejo el código de la referencia,
 * copialo. Elimina los datos que no tenemos, la foto integrala al contenido o
 * quitala, colocándola directamente en el hero ya que no tenemos imagen aún».
 *
 * De ese archivo se copian las MEDIDAS, que es lo que antes estaba a ojo:
 *
 *     grilla        `minmax(0,1fr) minmax(0,1fr)` con `align-items:start`
 *     desfase       columna izquierda 0, columna derecha 64px
 *     ancho         el bloque se topa en 1080 y va centrado
 *     hueco         clamp(16px, 2vw, 24px)
 *     acolchado     clamp(20px, 2.5vw, 32px)
 *     cifra         clamp(40px, 5vw, 68px), tabular
 *     explicación   14px, medida de 34ch
 *     tiles         56px, uno arriba a la izquierda y otro arriba a la derecha
 *     reveal        escalonado, 0 / 40 / 80 / 120 ms
 *
 * ⚠️ LA CIFRA BAJÓ DE 144px A 72. Estaba en `text-titan`, que es el cuerpo más
 * grande del sitio: el doble de lo que pide la referencia. A ese tamaño el
 * número no era un dato, era un titular, y se comía la tarjeta.
 *
 * ⚠️ EL ANCHO SE TOPA EN `max-w-head` (1040) Y NO EN EL CONTENEDOR. La
 * referencia cierra el bloque en 1080 y por eso sus tarjetas se leen como un
 * collage y no como una grilla a todo lo ancho. 1040 es el token que el sitio
 * ya tiene para eso, así que no se escribe un número nuevo.
 *
 * ⚠️ LO QUE NO SE COPIA es su sistema visual —Geist, `#E55100`, radios de
 * 6/10/14, Phosphor— ni sus cursivas: la marca no tiene itálica y el acento
 * del titular lo da el color. Eso ya está decidido en `Type.tsx`.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LA INVERSIÓN ESTÁ DADA VUELTA RESPECTO DEL ORIGINAL, y es a propósito.
 * Allá las tarjetas son claras sobre fondo claro y la rara es OSCURA; acá la
 * banda es la única losa `deep` de la página, así que las tarjetas son
 * `deeper` y la rara es CLARA. La idea es la misma —una tarjeta que rompe el
 * par— y el ritmo de superficies de la página no se toca.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LAS DOS TARJETAS DE CITA CON RETRATO NO EXISTEN ACÁ. En la referencia son
 * testimonios: cita, foto de la persona, nombre, cargo y hueco de logo. De
 * este negocio no hay ni una reseña verificada ni un retrato, y el kit lo dice
 * para el bloque F: «sólo donde haya reseñas reales; si no hay, el bloque no
 * se usa».
 *
 * Sus dos ranuras las ocupan las dos tarjetas de DATO que la ficha ya tenía, y
 * conservan la anatomía de las de cita: un bloque de texto arriba y una fila
 * de detalle abajo, separada por un filete.
 *
 * ⚠️ SE FUE «UNITS OF EACH», que era el marcador `TBD`. Pedido del mismo
 * mensaje: «eliminá los datos que no tenemos». El pendiente NO se pierde: el
 * `TODO` sigue escrito en `content/game-truck.ts`, que es donde se audita. Lo
 * que desaparece es la casilla vacía en la página.
 *
 * ⚠️ Y SE FUE LA FOTO. Era el joystick de stock y ahora está en el hero, que
 * es lo que se pidió: «colocándola directamente en el hero ya que no tenemos
 * imagen aún». Esta sección se queda sólo con datos.
 *
 * ⚠️ NO TRAE SU `<Section>`, Y SIGUE SIENDO A PROPÓSITO. La envuelve el call
 * site para que el guard de superficies vea el tono escrito en la página: sólo
 * expande componentes usados sin props, y éste lleva varias.
 */

/** Una tarjeta de cifra: el número grande y qué mide. */
export interface SpecNumber {
  readonly value: string;
  readonly label: string;
  /** Una aclaración chica debajo. */
  readonly note?: ReactNode;
}

/*
 * Las medidas que se copian del archivo de la referencia. Van acá arriba y no
 * repetidas en cada tarjeta para que se vea de un golpe que son SUS números.
 */
const CAJA = 'rounded-shell p-5 lg:p-8';
const CIFRA = 'font-display text-d2 font-extrabold leading-none tabular-nums lg:text-d1';
const PIE = 'font-body text-dato leading-[1.5]';

/**
 * Los cuadraditos de color del listado de consolas.
 *
 * ⚠️ SON LOS MISMOS TRES PRIMEROS QUE LAS LOMERAS DE `GameShelf`, y en el
 * mismo orden. No clasifican nada —de una consola sólo tenemos el nombre—:
 * están repetidos a propósito para que este listado y las cajas del estante,
 * dos secciones más abajo, se lean como parte del mismo mueble.
 *
 * ⚠️ SON RELLENO Y NUNCA TEXTO, que es lo que habilita a `river`: el token
 * tiene anotado «NUNCA como texto» porque da 2.50:1 sobre claro, y como cuadro
 * de color no le debe contraste a nadie.
 */
const MARCAS = ['bg-sunset', 'bg-river', 'bg-deep'] as const;

/**
 * El tile de icono que se monta en la esquina.
 *
 * ⚠️ SOBRESALE MEDIA PIEZA: 56px de lado con 20 de vuelo, que es lo que dice
 * la referencia (`left:-20px; top:-20px`). Es el mismo criterio con el que el
 * sticker de `CompareSlab` pisa el borde de su tarjeta.
 *
 * ⚠️ EL VUELO SE MIDE CONTRA EL GUTTER DEL PADRE Y NO SE ELIGE. `Section`
 * tiene `px-gutter md:px-gutter-lg`, o sea **16px hasta `md` y 32 de ahí para
 * arriba**. Un tile que vuela 20 se sale 4 de la PÁGINA mientras el gutter mida
 * 16, y eso le mete scroll horizontal a todo el documento: medido a 320, a 390
 * y a 640. Por eso vuela 16 hasta `md` y 20 desde ahí.
 *
 * ⚠️ SOBRE `sunset` EL ICONO VA EN `ink` Y SOBRE `cream` EN `deep`. Es la regla
 * dura del repo —sobre relleno naranja el trazo va negro, nunca blanco— y acá
 * aplica igual aunque sea un dibujo: al 2.54:1 del blanco sobre naranja, un
 * trazo de 1,6px no se ve.
 */
function Tile({
  Icon,
  tone,
  lado,
}: {
  readonly Icon: ComponentType<IconProps>;
  readonly tone: 'sunset' | 'cream';
  readonly lado: 'left' | 'right';
}) {
  return (
    <span
      aria-hidden="true"
      className={[
        'absolute -top-4 z-10 grid size-14 place-items-center rounded-card md:-top-5',
        lado === 'left' ? '-left-4 md:-left-5' : '-right-4 md:-right-5',
        tone === 'sunset' ? 'bg-sunset text-ink' : 'bg-cream text-deep',
      ].join(' ')}
    >
      <Icon className="size-6" />
    </span>
  );
}

export default function SpecSlab({
  title,
  id,
  cifra,
  cifraIcon,
  segunda,
  segundaIcon,
  invertidaTexto,
  invertidaDetalle,
  datos,
}: {
  readonly title: ReactNode;
  readonly id: string;
  /** La cifra de arriba a la izquierda. Lleva el tile naranja. */
  readonly cifra: SpecNumber;
  readonly cifraIcon: ComponentType<IconProps>;
  /** La cifra de abajo a la derecha. Lleva el tile crema. */
  readonly segunda: SpecNumber;
  readonly segundaIcon: ComponentType<IconProps>;
  /**
   * El texto de la tarjeta CLARA, la que rompe el par.
   *
   * ⚠️ ES UN PÁRRAFO Y NO UNA CIFRA, Y ESO FUE UN PEDIDO. Estuvo con el `1` del
   * Game Coach en el mismo cuerpo que las otras dos tarjetas de número, y
   * Camila lo frenó el 2026-09-22: «el 1 no es para destacar, prefiero que eso
   * esté en un párrafo común destacando algunas palabras».
   *
   * Tiene razón y es un problema de jerarquía, no de estilo: `6` y `30+` son
   * cantidades que alguien compara, y `1` no. Un uno a 72px promete un dato y
   * entrega una obviedad.
   *
   * ⚠️ VA COMO `ReactNode` para que el call site pueda marcar las palabras. El
   * destacado es PESO Y COLOR `deep`, nunca `sunset-deep`: ese naranja existe
   * sólo para una palabra dentro de un titular de display y no pasa contraste
   * como cuerpo. `deep` sobre hueso da 10.03:1. La regla está en `Accent`, en
   * `Type.tsx`.
   */
  readonly invertidaTexto: ReactNode;
  /** El listado al pie de la tarjeta clara, bajo un filete. */
  readonly invertidaDetalle: readonly string[];
  /** Los pares rótulo/dato de la tarjeta de arriba a la derecha. */
  readonly datos: readonly (readonly [string, string])[];
}) {
  return (
    <div className="mx-auto max-w-head">
      {/*
        EL ENCABEZADO VA CENTRADO Y ARRIBA DEL COLLAGE, como en la referencia:
        rótulo chico y titular en dos renglones. La segunda mitad va en color y
        no en itálica, que es la regla del sitio: la marca no tiene cursiva.
      */}
      <Heading
        level={2}
        id={id}
        className="mx-auto max-w-[16ch] text-balance text-center text-d3 lg:text-d2"
      >
        {title}
      </Heading>

      {/*
        ⚠️ DOS COLUMNAS IGUALES Y EL DESFASE EN LA DERECHA, exactamente como el
        archivo: `minmax(0,1fr) minmax(0,1fr)`, `align-items:start`, y un
        `padding-top` de 64px sólo en la segunda.

        ⚠️ EL DESFASE NO SE APLICA ABAJO DE `lg`. Con una sola columna, 64px de
        aire arriba no son un desfase: son un hueco. La referencia hace lo mismo
        —pone el offset en `0px` cuando su media query no matchea— sólo que lo
        decide en JavaScript; acá lo decide el CSS, que es lo que su propio spec
        pedía («evita ramas de layout por matchMedia»).

        ⚠️ EL HUECO ES `gap-4 lg:gap-6`, o sea 16 → 24: el `clamp(16px, 2vw,
        24px)` del archivo, resuelto con los escalones que el sitio ya usa.
      */}
      <div className="mt-bloque grid items-start gap-4 lg:grid-cols-2 lg:gap-6">
        <StaggerGroup className="flex flex-col gap-4 lg:gap-6">
          {/* ── 1 · LA CIFRA CON EL TILE NARANJA ───────────────────────── */}
          <RevealItem>
            <article className={`relative bg-deeper ${CAJA}`}>
              <Tile Icon={cifraIcon} tone="sunset" lado="left" />
              <p className={`m-0 ${CIFRA} text-cream`}>{cifra.value}</p>
              <p className={`m-0 mt-3 max-w-[34ch] ${PIE} text-bone/85`}>{cifra.label}</p>
            </article>
          </RevealItem>

          {/*
            ══════════════════════════════════════════════════════════════
            2 · LA TARJETA QUE ROMPE EL PAR.

            ⚠️ CONSERVA LA ANATOMÍA DE SU TARJETA DE CITA: un bloque de texto
            arriba y, debajo, una fila de detalle separada. Allá esa fila es el
            retrato con el nombre y el cargo; acá son las tres consolas, que es
            el detalle que corresponde a «un Game Coach a bordo».

            ⚠️ LA CIFRA VA EN `sunset-deep` Y NO EN `sunset`. Esta tarjeta es
            clara: el naranja de marca da 2.35:1 sobre hueso y el oscuro 3.28:1,
            que es la barra de texto grande. A 72px entra de sobra. La regla
            entera está en `Accent`, en `Type.tsx`.
            ══════════════════════════════════════════════════════════════
          */}
          <RevealItem>
            <article className={`bg-bone grano text-body ${CAJA}`}>
              <p className="m-0 max-w-[34ch] font-body text-lead font-light leading-[1.5] text-ink">
                {invertidaTexto}
              </p>

              {/*
                ══════════════════════════════════════════════════════════
                EL LISTADO DE CONSOLAS, CON CARÁCTER.

                ⚠️ ERAN TRES RENGLONES DE CUERPO PLANO y Camila pidió lo
                contrario: «a las 3 plays poner más onda en el listadito».

                Lo que le da carácter son tres cosas que el sitio ya usa y que
                acá se juntan: el nombre en la DISPLAY en caja alta —que es
                como se escriben los nombres de producto en todo el repo—, un
                FILETE PUNTEADO entre renglones, y un cuadradito de color por
                consola.

                ⚠️ LOS TRES COLORES SON LOS MISMOS DE LAS LOMERAS DEL ESTANTE
                que viene dos secciones abajo, y en el mismo orden. No
                clasifican nada: son la misma decoración, repetida a propósito,
                para que las consolas de acá y las cajas de allá se lean como
                parte del mismo mueble.

                ⚠️ VAN CUADRADOS Y NO REDONDOS. Un punto redondo es la viñeta
                que el sitio usa en las listas de texto —`HowToOrder`, los
                incluidos del paquete—, y esto no es una viñeta: es una ficha.
                El cuadrado con el radio chico de la casa lo separa.
                ══════════════════════════════════════════════════════════
              */}
              <ul className="m-0 mt-6 flex list-none flex-col border-t border-ink/15 p-0 pt-2">
                {invertidaDetalle.map((d, i) => (
                  <li
                    key={d}
                    className="flex items-center gap-3 border-b border-dashed border-ink/15 py-3.5 last:border-b-0 last:pb-0"
                  >
                    <span
                      aria-hidden="true"
                      className={`size-2.5 shrink-0 rounded-[3px] ${MARCAS[i % MARCAS.length]}`}
                    />
                    <span className="font-display text-d6 font-bold uppercase leading-none text-ink">
                      {d}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          </RevealItem>
        </StaggerGroup>

        <StaggerGroup className="flex flex-col gap-4 lg:mt-16 lg:gap-6">
          {/*
            3 · LA TARJETA DE DATOS, en el lugar de su segunda cita: la única
            con filo de 1px, igual que allá.
          */}
          <RevealItem>
            <article className={`bg-deeper ring-1 ring-paper/15 ring-inset ${CAJA}`}>
              <dl className="m-0 flex flex-col gap-5">
                {datos.map(([rotulo, valor]) => (
                  <div key={rotulo}>
                    <dt className="font-body text-micro font-bold uppercase tracking-cta text-muted-dark">
                      {rotulo}
                    </dt>
                    <dd className="m-0 mt-1.5 font-body text-lead font-light leading-[1.4] text-paper">
                      {valor}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          </RevealItem>

          {/* ── 4 · LA SEGUNDA CIFRA, CON EL TILE CREMA ─────────────────── */}
          <RevealItem>
            <article className={`relative bg-deeper ${CAJA}`}>
              <Tile Icon={segundaIcon} tone="cream" lado="right" />
              <p className={`m-0 ${CIFRA} text-cream`}>{segunda.value}</p>
              <p className={`m-0 mt-3 max-w-[34ch] ${PIE} text-bone/85`}>{segunda.label}</p>
              {segunda.note ? (
                <p className={`m-0 mt-2 max-w-[34ch] ${PIE} text-muted-dark`}>{segunda.note}</p>
              ) : null}
            </article>
          </RevealItem>
        </StaggerGroup>
      </div>
    </div>
  );
}
