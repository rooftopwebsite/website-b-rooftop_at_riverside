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
      className="inline-flex items-center gap-[6px] rounded-btn border border-dashed border-terra/60 bg-terra/5 px-[8px] py-[2px] align-middle font-body text-[12px] font-bold uppercase tracking-[0.12em] text-terra"
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
    <div className="rounded-card border border-dashed border-terra/50 bg-terra/[0.04] p-[24px]">
      <p className="eyebrow text-terra">Pending · {title}</p>
      <div className="mt-[10px] max-w-[60ch] text-[15px] leading-[1.6] text-body/75">
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
export function PhotoPending({
  brief,
  ratio = 'aspect-[4/3]',
  className = '',
}: {
  /** Qué toma va acá. Concreto: «El truck abierto, de noche, con gente en la ventanilla». */
  readonly brief: string;
  readonly ratio?: string;
  readonly className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`Image placeholder — ${brief}`}
      className={[
        ratio,
        'relative flex flex-col items-center justify-center gap-[12px] overflow-hidden',
        'rounded-card border border-dashed border-ink/25 bg-ink/[0.06] p-[24px] text-center',
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
        className="shrink-0 text-ink/35"
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

      <p className="eyebrow text-ink/65">Image missing</p>

      {/* El brief de la toma. Es lo único que hace útil a este placeholder. */}
      <p className="max-w-[34ch] font-body text-[13px] leading-[1.5] text-ink/60">{brief}</p>
    </div>
  );
}
