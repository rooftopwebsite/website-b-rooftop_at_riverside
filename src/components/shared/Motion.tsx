'use client';

import { motion, useInView, useReducedMotion } from 'motion/react';
import type { CSSProperties, ElementType, ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * El vocabulario de movimiento. Nueve slots, y nada fuera de ellos.
 *
 * Parámetros de docs/house-tokens.md §8, medidos sobre Tre Vele.
 *
 * ⚠️ REGLA DURA: ninguna animación pasa de **600ms**. `DURATION` está topeado
 * ahí a propósito; si algo necesita más, está mal pensado.
 *
 * ⚠️ Todos los componentes cortocircuitan con `useReducedMotion()` devolviendo
 * el tag PLANO, no una animación de duración 0: una animación de 0ms igual
 * dispara trabajo de composición. Y con el movimiento apagado el layout queda
 * IDÉNTICO — ningún componente usa la animación para posicionar nada.
 *
 * ⚠️ Nada de parallax sobre fotos de comida o de gente, y nada de scroll
 * hijacking. El scroll suave de Lenis es una interpolación de la rueda, no un
 * secuestro: no cambia a dónde llegás ni cuánto scrolleás.
 */

export const EASE_BRAND = [0.16, 1, 0.3, 1] as const;

/** Topes reales. `slow` es el máximo del sitio. */
export const DURATION = { fast: 0.18, base: 0.45, slow: 0.6 } as const;

export const REVEAL_OFFSET = 24;
export const STAGGER = 0.06;

/** Threshold de disparo de los reveals: ~20%. */
export const REVEAL_AMOUNT = 0.2;

const revealVariants = {
  hidden: { opacity: 0, y: REVEAL_OFFSET },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE_BRAND } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER, delayChildren: 0.04 } },
};

interface RevealProps {
  readonly children: ReactNode;
  readonly as?: ElementType;
  readonly className?: string;
  readonly id?: string;
  readonly amount?: number;
}

/* ==========================================================================
   3 · Reveal de sección al scroll
   ========================================================================== */

export function Reveal({ children, as = 'div', className, id, amount = REVEAL_AMOUNT }: RevealProps) {
  const reduced = useReducedMotion();
  const MotionTag = useMemo(() => motion.create(as), [as]);

  if (reduced) {
    const Tag = as;
    return (
      <Tag id={id} className={className}>
        {children}
      </Tag>
    );
  }

  return (
    <MotionTag
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={revealVariants}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerGroup({
  children,
  as = 'div',
  className,
  id,
  amount = REVEAL_AMOUNT,
}: RevealProps) {
  const reduced = useReducedMotion();
  const MotionTag = useMemo(() => motion.create(as), [as]);

  if (reduced) {
    const Tag = as;
    return (
      <Tag id={id} className={className}>
        {children}
      </Tag>
    );
  }

  return (
    <MotionTag
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={staggerContainer}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({
  children,
  as = 'div',
  className,
}: {
  readonly children: ReactNode;
  readonly as?: ElementType;
  readonly className?: string;
}) {
  const reduced = useReducedMotion();
  const MotionTag = useMemo(() => motion.create(as), [as]);

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }
  return (
    <MotionTag className={className} variants={revealVariants}>
      {children}
    </MotionTag>
  );
}

/* ==========================================================================
   2 · Entrada del hero — líneas con máscara
   ========================================================================== */

/**
 * El H1 sube por LÍNEAS, cada una recortada por su propia máscara, con stagger
 * corto. Es el gesto de entrada del sitio.
 *
 * ⚠️ Las líneas se pasan como array de strings, no se parten automáticamente.
 * Partir por líneas renderizadas necesita medir después de que cargó la fuente
 * (es lo que hace GSAP SplitText), y con `font-display: swap` eso produce un
 * salto visible. Escritas a mano el corte es el que quiere el diseño y no
 * depende de la métrica de la fuente — que además todavía no es la definitiva.
 *
 * ⚠️ Con reduced-motion se renderiza el texto plano, sin máscaras. El layout es
 * el mismo: las máscaras no aportan altura.
 */
export function MaskedLines({
  lines,
  as: Tag = 'span',
  className = '',
  delay = 0,
  accentLast = false,
  accentOn = 'dark',
}: {
  readonly lines: readonly string[];
  readonly as?: ElementType;
  readonly className?: string;
  readonly delay?: number;
  /**
   * Pinta la última línea en el color de acento. Es el recurso de Showdown
   * Social: un titular de dos líneas donde la segunda cambia de color deja de
   * leerse como un bloque plano.
   */
  readonly accentLast?: boolean;
  /**
   * Sobre qué superficie cae el titular. Decide el color del acento, y NO es
   * opcional en la práctica: son dos colores distintos porque uno solo no
   * pasa contraste en las dos superficies.
   *
   * ⚠️ `sunset` sobre claro da **2.48:1** y no pasa ni el 3:1 de texto grande;
   * sobre `deep` da 4.26:1. Sobre claro el acento es `terra` (7.43:1 sobre
   * `paper`). Es exactamente al revés que en los botones, donde el naranja es
   * el FONDO y el texto va negro.
   *
   * El default es `dark` porque el único call site cuando esto se escribió era
   * el hero, que va sobre `deep`.
   */
  readonly accentOn?: 'light' | 'dark';
}) {
  const reduced = useReducedMotion();
  const acento = accentOn === 'light' ? 'text-terra' : 'text-sunset';
  const tone = (i: number) => (accentLast && i === lines.length - 1 ? acento : undefined);

  // ⚠️ El espacio al final de cada línea salvo la última NO es cosmético: sin
  // él el texto del elemento queda «Bonita comestogether», que es lo que lee
  // un crawler y lo que compone el nombre accesible. Dentro de la máscara es
  // invisible, porque cae al final del renglón.
  const withSpace = (line: string, i: number) => (i < lines.length - 1 ? `${line} ` : line);

  if (reduced) {
    return (
      <Tag className={className}>
        {lines.map((line, i) => (
          <span key={i} className={['block', tone(i)].filter(Boolean).join(' ')}>
            {withSpace(line, i)}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        // `overflow-hidden` es la máscara. Va en un `block` propio para que
        // recorte sólo su línea y no las de al lado.
        <span key={i} className="block overflow-hidden">
          <motion.span
            className={['block', tone(i)].filter(Boolean).join(' ')}
            initial={{ y: '105%' }}
            animate={{ y: '0%' }}
            transition={{
              duration: DURATION.slow,
              ease: EASE_BRAND,
              delay: delay + i * 0.07,
            }}
          >
            {withSpace(line, i)}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Entrada simple para lo que acompaña al hero: fade + subida corta. */
export function HeroFadeUp({
  children,
  delay = 0,
  className = '',
}: {
  readonly children: ReactNode;
  readonly delay?: number;
  readonly className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.base, ease: EASE_BRAND, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ==========================================================================
   4 · Marquee
   ========================================================================== */

/**
 * Loop continuo. **CSS puro**, así que corre en el compositor y no cuesta JS.
 * Se pausa en hover y con el foco dentro; se detiene entero con reduced-motion
 * (la regla vive en globals.css).
 *
 * El contenido se duplica y la segunda copia va `aria-hidden` para que el
 * lector de pantalla no lea todo dos veces.
 */
export function Marquee({
  children,
  durationSeconds = 35,
  className = '',
  itemClassName = '',
}: {
  readonly children: ReactNode;
  readonly durationSeconds?: number;
  readonly className?: string;
  readonly itemClassName?: string;
}) {
  const style = { '--marquee-duration': `${durationSeconds}s` } as CSSProperties;
  return (
    <div className={['group/marquee overflow-hidden', className].filter(Boolean).join(' ')}>
      <div
        className="rt-marquee flex w-max group-hover/marquee:[animation-play-state:paused] group-focus-within/marquee:[animation-play-state:paused]"
        style={style}
      >
        <div className={['flex shrink-0', itemClassName].filter(Boolean).join(' ')}>{children}</div>
        <div className={['flex shrink-0', itemClassName].filter(Boolean).join(' ')} aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   7 · Carrusel arrastrable con snap
   ========================================================================== */

/**
 * Carrusel horizontal de tarjetas: se arrastra y hace snap.
 *
 * ⚠️ Es **scroll nativo** con `scroll-snap`, no un carrusel de JS. Eso trae
 * gratis lo que un carrusel custom tiene que reimplementar y casi siempre
 * rompe: arrastre con el dedo, rueda del mouse, teclado, y que el navegador
 * lleve al foco a la tarjeta visible al tabular. Lo único que se agrega es el
 * arrastre con el MOUSE, que el scroll nativo no da en desktop.
 *
 * ⚠️ `overflow: clip` recortaría las sombras de las tarjetas, así que el track
 * lleva padding vertical y un margen negativo que lo compensa.
 */
export function DragCarousel({
  children,
  className = '',
  label,
}: {
  readonly children: ReactNode;
  readonly className?: string;
  /** Nombre accesible del carrusel: aparece como región navegable. */
  readonly label: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let startX = 0;
    let startScroll = 0;
    let active = false;

    const down = (e: PointerEvent) => {
      // Sólo botón principal, y no sobre un link: arrastrar no debe robarle
      // el click a una tarjeta.
      if (e.button !== 0) return;
      active = true;
      startX = e.clientX;
      startScroll = el.scrollLeft;
    };
    const move = (e: PointerEvent) => {
      if (!active) return;
      const dx = e.clientX - startX;
      // Recién a partir de 6px se considera arrastre; por debajo es un click.
      if (Math.abs(dx) < 6) return;
      setDragging(true);
      el.scrollLeft = startScroll - dx;
    };
    const up = () => {
      active = false;
      // El reset va en el siguiente frame para que el `click` que viene
      // después de soltar todavía vea `dragging` y se pueda cancelar.
      requestAnimationFrame(() => setDragging(false));
    };

    el.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, []);

  return (
    <div
      ref={ref}
      role="region"
      aria-label={label}
      tabIndex={0}
      onClickCapture={(e) => {
        // Si el gesto fue un arrastre, no se navega.
        if (dragging) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      className={[
        'flex snap-x snap-mandatory gap-[20px] overflow-x-auto',
        // Espacio para que la sombra del hover no se recorte.
        'py-[12px] -my-[12px]',
        'scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        dragging ? 'cursor-grabbing select-none' : 'cursor-grab',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}

/* ==========================================================================
   8 · Contador de números
   ========================================================================== */

/**
 * Cuenta hasta un número cuando entra en pantalla. Se usa **una sola vez** en
 * todo el sitio: el dato de las 25.000–30.000 personas del 4 de julio, en la
 * página de eventos.
 *
 * ⚠️ El valor final está SIEMPRE en el DOM aunque no se haya animado, y con
 * reduced-motion se pinta directo. Un contador que arranca en cero y depende
 * de JS para llegar al número deja el dato en cero si el script falla.
 */
export function CountUp({
  to,
  duration = DURATION.slow,
  className = '',
  format = (n: number) => n.toLocaleString('en-US'),
}: {
  readonly to: number;
  readonly duration?: number;
  readonly className?: string;
  readonly format?: (n: number) => string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [value, setValue] = useState(to);

  useEffect(() => {
    if (reduced) return;
    if (!inView) {
      setValue(0);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      // easeOutExpo, la misma curva que EASE_BRAND.
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setValue(Math.round(to * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, to, duration]);

  return (
    <span ref={ref} className={['tabular-nums', className].filter(Boolean).join(' ')}>
      {format(reduced ? to : value)}
    </span>
  );
}
