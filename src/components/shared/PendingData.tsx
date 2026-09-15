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
 */
export function PendingData({
  label = 'TBD',
  detail,
}: {
  readonly label?: string;
  readonly detail?: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-btn border border-dashed border-terra/60 bg-terra/5 px-2 py-0.5 align-middle font-body text-caption font-bold uppercase tracking-eyebrow text-terra"
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
export function PendingBlock({
  title,
  children,
}: {
  readonly title: string;
  readonly children: ReactNode;
}) {
  return (
    <div className="rounded-card border border-dashed border-terra/50 bg-terra/[0.04] p-6">
      <p className="eyebrow text-terra">Pending · {title}</p>
      <div className="mt-2.5 max-w-[60ch] text-base text-body/75">
        {children}
      </div>
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
   * ⚠️ EL TONO OSCURO ES CÁLIDO Y NO GRIS, y es un cambio pedido: «ponele a
   * las fotos que no están otro color así se ven sobre el verde».
   *
   * Era `paper/[0.07]`, o sea blanco al 7% sobre la tarjeta: un gris apenas
   * más claro que el verde de abajo —1.06:1— que a simple vista no se
   * distinguía de una foto oscura. El componente existe para que un hueco NO
   * pase callado, así que casi-invisible es el peor resultado posible.
   *
   * ⚠️ EL COLOR ES `sunset` Y NO SE ELIGIÓ A DEDO. Los otros dos marcadores de
   * pendiente del archivo —`PendingData` y `PendingBlock`— van en `terra`, y
   * `terra` sobre oscuro es ilegible (#A62000 sobre `deeper` da 1.9:1). El
   * repo ya tiene escrita cuál es su contraparte: `BRAND.headlineAccent` mapea
   * `onLight: 'terra'` → `onDark: 'sunset'`. Así que los tres marcadores de
   * pendiente hablan el mismo idioma en las dos superficies.
   *
   * ⚠️ EL RÓTULO PASA A `cream` Y NO QUEDA EN `sunset`. Con el relleno al 18%
   * el campo sube a #2D4331 y ahí `sunset` da 4.22:1 — por debajo del 4.5 que
   * pide un texto de 13px. `cream` da 9.34:1 y `muted-dark` 5.89:1. El naranja
   * se queda en el ícono, que es `aria-hidden` y no le debe contraste a nadie.
   *
   * Medido sobre la tarjeta `deeper` (#013434), que es la única superficie
   * donde hoy cae este tono: el relleno da 1.27:1 contra la tarjeta, o sea que
   * se ve como un campo aparte y no como una foto que salió oscura.
   */
  dark: {
    caja: 'border-sunset/50 bg-sunset/[0.18]',
    icono: 'text-sunset',
    rotulo: 'text-cream',
    brief: 'text-muted-dark',
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
