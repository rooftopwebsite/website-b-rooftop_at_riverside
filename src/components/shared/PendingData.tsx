/**
 * Marcadores de dato o asset que TODAVÍA NO TENEMOS.
 *
 * El brief: «usá TBD visible en un componente <PendingData> para que no se me
 * pase. No inventes capacidades.»
 *
 * La regla de estos componentes: se ven. Un hueco silencioso se publica sin que
 * nadie lo note; un bloque marcado no.
 *
 * ⚠️ Antes de salir a producción no puede quedar ninguno.
 */

import type { ReactNode } from 'react';

/**
 * Un dato puntual que falta: una capacidad, un mínimo, un horario.
 * Se renderiza en línea, donde iría el número.
 *
 * ⚠️ TIENE DOS TONOS DESDE EL 2026-09-16, Y ES EL MISMO DEFECTO QUE YA SE
 * ARREGLÓ DOS VECES EN ESTE ARCHIVO, primero en `PendingBlock` y después en
 * `PhotoPending`: el único juego de colores que había estaba calibrado para
 * superficie clara, y en cuanto un marcador cayó en una banda `deep` dejó de
 * verse.
 *
 * Pasó con la ficha técnica de `/game-truck`: el `TBD` de las unidades por
 * consola es `terra` (#A62000, un rojo oscuro) con relleno al 5 % sobre verde
 * casi negro. El filo punteado se adivinaba y la palabra no se leía.
 *
 * El par oscuro usa los mismos tokens que eligió `PendingBlock`, así que los
 * tres marcadores de pendiente hablan el mismo idioma en las dos superficies:
 *
 *     claro   filo y texto `terra`         7.43:1 sobre paper
 *     oscuro  filo y texto `tomato-soft`   5.60:1 sobre deep
 */
const TONOS_DATO = {
  light: 'border-terra/60 bg-terra/5 text-terra',
  dark: 'border-tomato-soft/50 bg-paper/[0.06] text-tomato-soft',
} as const;

export function PendingData({
  label = 'TBD',
  detail,
  tone = 'light',
}: {
  readonly label?: string;
  readonly detail?: string;
  /** La superficie sobre la que cae. Ver `TONOS_DATO`. */
  readonly tone?: keyof typeof TONOS_DATO;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-btn border border-dashed px-2 py-0.5 align-middle font-body text-caption font-bold uppercase tracking-eyebrow ${TONOS_DATO[tone]}`}
      {...(detail ? { title: detail } : {})}
    >
      {label}
      {detail ? <span className="sr-only">. {detail}</span> : null}
    </span>
  );
}

/**
 * Un bloque entero pendiente: una sección de la que todavía no tenemos el
 * contenido. Explica QUÉ falta y de quién depende.
 */
/**
 * El recuadro de un dato que falta y que tiene que venir del cliente.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ TIENE DOS TONOS Y ANTES TENÍA UNO. El único que había estaba calibrado
 * para superficie CLARA —filo `terra`, relleno `terra` al 4 % y texto
 * `body/75`— y se rompió el 2026-09-16, cuando la banda del equipo de
 * `/our-story` pasó a `deep` por el calco de `/over-ons`.
 *
 * Sobre verde oscuro ese recuadro quedaba prácticamente invisible: `terra`
 * (#A62000) es un rojo OSCURO, pensado para leerse contra blanco, y el texto en
 * `body/75` es tinta negra al 75 % sobre un fondo casi negro. Se veía el filo
 * punteado y adentro no se leía nada.
 *
 * ⚠️ NO LO MARCÓ `npm run a11y`, y conviene saber por qué para no confiar de
 * más en la herramienta: axe no puede calcular el contraste cuando el fondo del
 * elemento es un color con alfa sobre otro fondo, así que saltea el nodo en vez
 * de fallarlo. El defecto se vio mirando la captura.
 *
 * El par oscuro usa los tokens que el sitio ya tiene para eso:
 *
 *     claro   filo y rótulo `terra`         7.43:1 sobre paper
 *     oscuro  filo y rótulo `tomato-soft`   5.60:1 sobre deep
 *
 * `tomato-soft` (#FF8F7A) es exactamente «el rojo de error PARA SUPERFICIE
 * OSCURA» del tema, y es el mismo que ya usan los errores del formulario de
 * newsletter, que vive en el footer.
 * ══════════════════════════════════════════════════════════════════════════
 */
const TONOS_PENDIENTE = {
  light: {
    caja: 'border-terra/50 bg-terra/[0.04]',
    rotulo: 'text-terra',
    cuerpo: 'text-body/75',
  },
  dark: {
    caja: 'border-tomato-soft/45 bg-paper/[0.06]',
    rotulo: 'text-tomato-soft',
    cuerpo: 'text-paper/85',
  },
} as const;

export function PendingBlock({
  title,
  tone = 'light',
  children,
}: {
  readonly title: string;
  readonly tone?: keyof typeof TONOS_PENDIENTE;
  readonly children: ReactNode;
}) {
  const t = TONOS_PENDIENTE[tone];
  return (
    <div className={`rounded-card border border-dashed p-6 ${t.caja}`}>
      <p className={`eyebrow ${t.rotulo}`}>Pending · {title}</p>
      <div className={`mt-2.5 max-w-[60ch] text-base ${t.cuerpo}`}>{children}</div>
    </div>
  );
}

/**
 * El hueco de una foto que no tenemos.
 *
 * ⚠️ Es un campo GRIS neutro con un texto que dice QUÉ FOTO va ahí — no una
 * imagen inventada, ni un ícono decorativo que se pueda confundir con diseño
 * final. Pedido de Camila: «deja un espacio gris donde iría con un texto en el
 * que me indique que tipo de imagen falta».
 *
 * `brief` es lo importante: describe la toma concreta que hay que conseguir,
 * no un genérico «falta foto». Es el texto que se le manda al fotógrafo.
 *
 * No usa `next/image` porque no hay imagen que optimizar.
 */
/**
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LOS DOS TONOS DEL HUECO, y por qué hubo que agregar el oscuro.
 *
 * El placeholder estaba escrito con un solo juego de colores —`ink` a
 * distintas opacidades— porque hasta el rediseño siempre caía sobre `paper` o
 * `bone`. Con el carrusel de `WhatsOn`, el hueco pasó a vivir DENTRO de una
 * tarjeta `deeper` sobre una banda `deep`: tinta al 6 % sobre tinta es tinta,
 * así que el hueco se publicaba como un rectángulo NEGRO con el brief
 * invisible adentro.
 *
 * Es el peor final posible para este componente: existe justamente para que
 * un hueco no pase callado, y ahí pasaba más callado que si no estuviera —
 * un cuadro negro se lee como una foto oscura, no como un pendiente.
 *
 * ⚠️ Y NO LO DETECTÓ `npm run a11y`. El nodo tiene `role="img"` con su
 * `aria-label`, así que axe no audita el contraste del texto de adentro: para
 * axe es una imagen. Esto sólo se ve mirando la página.
 * ══════════════════════════════════════════════════════════════════════════
 */
const TONOS_HUECO = {
  light: {
    caja: 'border-ink/25 bg-ink/[0.06]',
    icono: 'text-ink/35',
    rotulo: 'text-ink/65',
    /* `ink/70` y no `/60`: al unificar el color de texto del sitio en `ink`
       la luminancia bajó lo justo para que el brief dejara de pasar —axe lo
       midió en 4.33:1 sobre el gris del placeholder, contra el 4.5:1 que pide
       un texto de 13px—. Al 70 % da 5.98:1. */
    brief: 'text-ink/70',
  },
  /*
   * ══════════════════════════════════════════════════════════════════════
   * ⚠️ EL CAMPO ES CÁLIDO Y LO QUE VA ENCIMA ES GRIS. Son dos decisiones
   * distintas, tomadas en dos momentos distintos, y conviene no mezclarlas.
   *
   * EL CAMPO, y por qué no es gris: era `paper/[0.07]`, blanco al 7 % sobre
   * la tarjeta, o sea un gris apenas más claro que el verde de abajo —1.06:1—
   * que a simple vista no se distinguía de una foto oscura. El componente
   * existe para que un hueco NO pase callado, así que casi-invisible es el
   * peor resultado posible. Camila: «ponele a las fotos que no están otro
   * color así se ven sobre el verde». Con `sunset` al 18 % el campo sube a
   * #2D4331 —un marrón oliva— y da 1.27:1 contra la tarjeta: se lee como un
   * campo aparte y no como una foto que salió oscura.
   *
   * ⚠️ SIGUE ESCRITO `sunset` Y NO ES NARANJA. Al 18 % sobre verde oscuro lo
   * que se ve es ese marrón, y no hay token de marrón en la paleta: diluir el
   * naranja es la única forma de llegar a este color sin inventar uno. Lo que
   * se ve es lo que manda, y lo que se ve es marrón.
   *
   * ⚠️ LO QUE VA ENCIMA PASÓ A GRIS NEUTRO el 2026-09-16, y antes era el
   * ícono en `sunset`, el rótulo en `cream` y el brief en `muted-dark`.
   * Camila: «el placeholder de la foto pongámoslo sin color, que sea gris
   * sobre marrón, no quiero que tenga naranja ni amarillo». Tenía razón de
   * fondo: un marcador de pendiente no debería tener paleta propia, y tres
   * tintas de marca adentro de un hueco lo hacían parecer una pieza
   * terminada. Ahora es blanco a tres opacidades, que sobre el marrón da
   * gris.
   *
   * ⚠️ LAS TRES OPACIDADES SON DE CONTRASTE, no de gusto. Medidas sobre el
   * campo #2D4331:
   *
   *     rótulo   `paper/80`   7.52:1
   *     brief    `paper/60`   5.04:1   ← 13px, el mínimo es 4.5
   *     ícono    `paper/50`   4.01:1   ← `aria-hidden`, no le debe nada a nadie
   *
   * Bajar el brief a 50 lo deja en 4.01 y ya no pasa. Ése es el número que
   * no se toca.
   *
   * ⚠️ ESTE TONO YA NO HABLA EL IDIOMA DE LOS OTROS DOS MARCADORES del
   * archivo —`PendingData` y `PendingBlock` van en `terra` sobre claro y en
   * `tomato-soft` sobre oscuro—, y es a propósito: aquellos dos son texto
   * suelto en medio de contenido y necesitan el filo de color para que se
   * lean como una alarma. Éste es un rectángulo de 400px con borde punteado;
   * la forma ya dice que falta algo.
   * ══════════════════════════════════════════════════════════════════════
   */
  dark: {
    caja: 'border-paper/30 bg-sunset/[0.18]',
    icono: 'text-paper/50',
    rotulo: 'text-paper/80',
    brief: 'text-paper/60',
  },
} as const;

export function PhotoPending({
  brief,
  ratio = 'aspect-[4/3]',
  className = '',
  tone = 'light',
}: {
  /**
   * Qué toma va acá, EN ESPAÑOL y concreto: «El truck abierto, de noche, con
   * gente en la ventanilla».
   *
   * ⚠️ EL BRIEF VA EN ESPAÑOL aunque el copy del sitio sea en inglés. Pedido
   * de Camila el 2026-09-15: este cartel no es contenido, es un recado para
   * ella, que es quien sale a buscar la foto. Desaparece en cuanto la foto
   * llega, así que nunca lo va a leer un visitante.
   */
  readonly brief: string;
  readonly ratio?: string;
  readonly className?: string;
  /** La superficie sobre la que cae. Ver `TONOS_HUECO`. */
  readonly tone?: keyof typeof TONOS_HUECO;
}) {
  const t = TONOS_HUECO[tone];

  return (
    <div
      role="img"
      aria-label={`Foto pendiente: ${brief}`}
      className={[
        ratio,
        'relative flex flex-col items-center justify-center gap-3 overflow-hidden',
        'rounded-card border border-dashed p-6 text-center',
        t.caja,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <svg
        width="34"
        height="30"
        viewBox="0 0 34 30"
        fill="none"
        aria-hidden="true"
        className={`shrink-0 ${t.icono}`}
      >
        <rect x="1" y="1" width="32" height="28" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="10.5" cy="10" r="3" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M1 22l9-8 7 6 5-4 11 9"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>

      <p className={`eyebrow ${t.rotulo}`}>Falta la foto</p>

      {/* El brief de la toma. Es lo único que hace útil a este placeholder.
          Los colores de los dos tonos —y sus ratios medidos— están en
          `TONOS_HUECO`, arriba. */}
      <p className={`max-w-[34ch] font-body text-micro leading-[1.5] ${t.brief}`}>{brief}</p>
    </div>
  );
}
