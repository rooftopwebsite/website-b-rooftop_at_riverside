import type { ReactNode } from 'react';

/**
 * BLOQUE G DEL KIT: la marquesina.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ES CSS PURO, SIN UNA LÍNEA DE JAVASCRIPT. Es la regla del proyecto: los
 * loops infinitos van en CSS y `motion` queda para lo que responde al scroll o
 * al puntero. Una animación de bucle en JS corre un callback por frame para
 * siempre, incluso cuando nadie la está mirando.
 *
 * ⚠️ EL CONTENIDO SE DUPLICA Y LA COPIA VA `aria-hidden`. Es lo que hace que
 * el bucle no tenga costura: cuando la primera tira termina de salir, la
 * segunda ya está en su lugar. La copia es puramente visual, así que un lector
 * de pantalla leería la lista dos veces si no se la esconde.
 *
 * ⚠️ RESPETA `prefers-reduced-motion`. Una tira de texto desplazándose sin
 * parar es exactamente lo que marea a quien activa esa preferencia. Con la
 * preferencia puesta la animación se detiene y la tira queda quieta, legible,
 * en su posición inicial. La regla vive en `globals.css`.
 *
 * ⚠️ `pausa` detiene el movimiento al pasar el puntero. No es decoración: si
 * la tira lleva nombres que alguien quiere leer, tiene que poder leerlos.
 * ══════════════════════════════════════════════════════════════════════════
 */
export default function Marquee({
  children,
  /** Segundos que tarda una pasada completa. Más largo = más lento. */
  duracion = 32,
  className = '',
  label,
}: {
  readonly children: ReactNode;
  readonly duracion?: number;
  readonly className?: string;
  /** Qué dice la tira, para el lector de pantalla. */
  readonly label: string;
}) {
  return (
    <div
      className={['relative flex overflow-hidden', className].filter(Boolean).join(' ')}
      aria-label={label}
      role="group"
    >
      <div
        className="marquesina flex shrink-0 items-center gap-[48px] pr-[48px]"
        style={{ animationDuration: `${duracion}s` }}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className="marquesina flex shrink-0 items-center gap-[48px] pr-[48px]"
        style={{ animationDuration: `${duracion}s` }}
      >
        {children}
      </div>
    </div>
  );
}
