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
      {detail ? <span className="sr-only">— {detail}</span> : null}
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
  dark: {
    caja: 'border-muted-dark/40 bg-paper/[0.07]',
    icono: 'text-muted-dark/70',
    rotulo: 'text-muted-dark',
    /* Sobre la tarjeta `deeper`, `muted-dark` opaco da 5.4:1. No se usa
       `paper/70` —una opacidad sobre un fondo oscuro da un color distinto en
       cada superficie y no se puede auditar—, que es el mismo motivo por el
       que existe el token `muted-dark`. */
    brief: 'text-muted-dark',
  },
} as const;

export function PhotoPending({
  brief,
  ratio = 'aspect-[4/3]',
  className = '',
  tone = 'light',
}: {
  /** Qué toma va acá. Concreto: «El truck abierto, de noche, con gente en la ventanilla». */
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
      aria-label={`Image placeholder — ${brief}`}
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

      <p className={`eyebrow ${t.rotulo}`}>Image missing</p>

      {/* El brief de la toma. Es lo único que hace útil a este placeholder.
          Los colores de los dos tonos —y sus ratios medidos— están en
          `TONOS_HUECO`, arriba. */}
      <p className={`max-w-[34ch] font-body text-micro leading-[1.5] ${t.brief}`}>{brief}</p>
    </div>
  );
}
