'use client';

import { motion, useInView, useReducedMotion } from 'motion/react';
import type { CSSProperties, ElementType, ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * El vocabulario de movimiento. Un mecanismo por TIPO de contenido, y nada
 * fuera de ellos.
 *
 * ⚠️ LOS TOKENS YA NO VIVEN ACÁ. Están en `src/lib/motion.ts`, que es donde
 * corresponde: los consumen también `PageTransition` y `Preloader`. Este
 * archivo los re-exporta con los nombres viejos —`EASE_BRAND`, `DURATION`,
 * `REVEAL_OFFSET`, `STAGGER`, `REVEAL_AMOUNT`— para no romper call sites.
 *
 * ⚠️ UN MECANISMO POR TIPO DE CONTENIDO, y esto es la regla de diseño del
 * archivo, no un detalle. El mismo fade + slide-up en las ocho secciones es la
 * firma de una web autogenerada. El reparto es:
 *
 *   titulares grandes     `MaskedLines`   reveal por líneas con máscara
 *   imágenes a sangre     `RevealMedia`   `clip-path` que se abre
 *   grillas y filas       `StaggerGroup`  desfasaje entre hijos
 *   media en contenedor   `ScaleMedia`    escala sutil
 *   bloques de texto      `Reveal`        fade + desplazamiento corto
 *   secciones designadas  `ScrollExit`    salida ligada al progreso
 *
 * ⚠️ Todos cortocircuitan con `useReducedMotion()` devolviendo el tag PLANO,
 * no una animación de duración 0: una animación de 0ms igual dispara trabajo
 * de composición. Y con el movimiento apagado el layout queda IDÉNTICO —
 * ningún componente usa la animación para posicionar nada. Lo verifica
 * `npm run check:motion`.
 *
 * ⚠️ Nada de parallax sobre fotos de comida o de gente, y nada de scroll
 * hijacking. El scroll suave de Lenis es una interpolación de la rueda, no un
 * secuestro: no cambia a dónde llegás ni cuánto scrolleás.
 */

import { clip, dist, dur, ease, stagger, viewport } from '@/lib/motion';

export { clip, dist, dur, ease, stagger, viewport };

/* ── Alias de compatibilidad ────────────────────────────────────────────────
   Los nombres viejos, para que los call sites existentes sigan compilando.
   ⚠️ En código nuevo usá los tokens de `@/lib/motion` directamente. */
export const EASE_BRAND = ease.out;
export const DURATION = { fast: dur.micro, base: dur.ui, slow: dur.reveal } as const;
export const REVEAL_OFFSET = dist.text;
export const STAGGER = stagger;
export const REVEAL_AMOUNT = 0.2;

/*
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ POR QUÉ CADA RAMA DE `reduced` TIENE QUE PISAR EL `style` A MANO.
 *
 * Bug encontrado el 2026-09-15, y era grave: con `prefers-reduced-motion`
 * puesto, 26 elementos de la home y 24 de `/events` quedaban en
 * `opacity: 0`. O sea que la persona que activa «reducir movimiento» —por
 * mareo, migraña o vértigo— veía huecos en blanco donde va el contenido.
 * Justo al revés de lo que la preferencia pide.
 *
 * La causa: el SERVIDOR no puede saber la preferencia, así que renderiza
 * siempre la rama animada y emite `style="opacity:0;transform:translateY(32px)"`
 * en el HTML. En el cliente `useReducedMotion()` ya devuelve `true` en el
 * primer render, así que React hidrata un `<li>` plano contra un `<li>` que
 * en el DOM tiene ese style. **React no borra atributos que están en el DOM
 * servido y no en el vnode**: los da por buenos y sigue. El style queda pegado
 * para siempre y nada vuelve a tocarlo, porque ya no hay motor de animación.
 *
 * Por eso no alcanza con devolver el tag sin animar: hay que ESCRIBIR el
 * estado final. Con `style` presente React sí lo aplica y pisa lo que vino
 * del servidor.
 *
 * ⚠️ `clipPath` va incluido porque `ClipReveal` y `ScrollExit` recortan con
 * `inset()`, y un `inset(0 0 100% 0)` pegado esconde igual que un opacity 0.
 * ══════════════════════════════════════════════════════════════════════════
 */
const SIN_MOVIMIENTO = { opacity: 1, transform: 'none', clipPath: 'none' } as const;

const revealVariants = {
  hidden: { opacity: 0, y: dist.text },
  visible: { opacity: 1, y: 0, transition: { duration: dur.reveal, ease: ease.out } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: 0.04 } },
};

interface RevealProps {
  readonly children: ReactNode;
  readonly as?: ElementType;
  readonly className?: string;
  readonly id?: string;
  readonly amount?: number;
  /**
   * ⚠️ Existe para la GEOMETRÍA que no se puede escribir como clase. El caso
   * que lo trajo es `StepStair`: la grilla tiene tantas columnas como pasos
   * haya, y `grid-cols-${n}` armada con una plantilla no existe en el CSS
   * emitido porque Tailwind no la ve al escanear el fuente.
   *
   * No es una puerta para estilar por inline lo que ya hay como clase: hay que
   * pasar por acá sólo lo que depende de un valor que el componente recibe.
   */
  readonly style?: CSSProperties;
  /**
   * ⚠️ Existen para hacer ALCANZABLE una región que se scrollea.
   *
   * Una región con `overflow-x-auto` y sin nada enfocable adentro es contenido
   * que existe y no se puede llegar con teclado — lo marca
   * `npm run a11y` como `scrollable-region-focusable`, y pasó con el track de
   * los tres cuadros de «How this place works», donde las cards son texto y no
   * links.
   *
   * El remedio es `tabIndex={0}` más un `aria-label` que diga qué es la
   * región. Es el mismo que ya usan las columnas de `VideoWall`.
   */
  readonly tabIndex?: number;
  readonly 'aria-label'?: string;
}

/* ==========================================================================
   3 · Reveal de sección al scroll
   ========================================================================== */

export function Reveal({ children, as = 'div', className, id, amount = REVEAL_AMOUNT, style }: RevealProps) {
  const reduced = useReducedMotion();
  const MotionTag = useMemo(() => motion.create(as), [as]);

  if (reduced) {
    const Tag = as;
    return (
      <Tag id={id} data-reveal="" className={className} style={{ ...SIN_MOVIMIENTO, ...style }}>
        {children}
      </Tag>
    );
  }

  return (
    <MotionTag
      id={id}
      data-reveal=""
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      /* ⚠️ El default usa el token `viewport` de `lib/motion`, que dispara con
         `margin: -20%` en vez de `amount: 0.2`. La diferencia: `amount`
         esperaba que el 20 % del elemento estuviera visible, lo que en una
         sección alta significa scrollear media pantalla más. El margen
         negativo dispara cuando le falta un 20 % del viewport para entrar.
         Un `amount` explícito sigue funcionando para los casos que lo pidan. */
      viewport={amount === REVEAL_AMOUNT ? viewport : { once: true, amount }}
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
  style,
  tabIndex,
  'aria-label': ariaLabel,
}: RevealProps) {
  const reduced = useReducedMotion();
  const MotionTag = useMemo(() => motion.create(as), [as]);

  if (reduced) {
    const Tag = as;
    return (
      <Tag
        id={id}
        className={className}
        style={{ ...SIN_MOVIMIENTO, ...style }}
        tabIndex={tabIndex}
        aria-label={ariaLabel}
      >
        {children}
      </Tag>
    );
  }

  return (
    <MotionTag
      id={id}
      data-reveal=""
      className={className}
      style={style}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      initial="hidden"
      whileInView="visible"
      viewport={amount === REVEAL_AMOUNT ? viewport : { once: true, amount }}
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
  style,
}: {
  readonly children: ReactNode;
  readonly as?: ElementType;
  readonly className?: string;
  readonly style?: CSSProperties;
}) {
  const reduced = useReducedMotion();
  const MotionTag = useMemo(() => motion.create(as), [as]);

  if (reduced) {
    const Tag = as;
    return (
      <Tag data-reveal="" className={className} style={{ ...SIN_MOVIMIENTO, ...style }}>
        {children}
      </Tag>
    );
  }
  return (
    <MotionTag data-reveal="" className={className} style={style} variants={revealVariants}>
      {children}
    </MotionTag>
  );
}

/* ==========================================================================
   Imágenes a sangre — el `clip-path` que se abre
   ========================================================================== */

/**
 * La imagen se revela abriendo un `inset()` de abajo hacia arriba, sin
 * desplazarse. Es el mecanismo de las imágenes grandes, y es DISTINTO del fade
 * + slide de `Reveal` a propósito: una foto a sangre que se desliza arrastra
 * todo el bloque con ella y se lee pesado; una que se descubre se lee como que
 * estaba ahí.
 *
 * ⚠️ Anima `clipPath`, no `height` ni `scale`. `clip-path` no reflowea: la
 * imagen ocupa su caja final desde el primer frame, así que no hay CLS y el
 * texto de al lado no se mueve.
 *
 * ⚠️ Las dos puntas del `inset` salen del token `clip`. Si divergen entre
 * componentes, la imagen salta al terminar la animación.
 *
 * ⚠️ Con reduced-motion se renderiza sin recorte y sin transición. No hay
 * versión «sólo opacidad» acá porque un fade sobre una foto a sangre es
 * exactamente el efecto que marea a quien pide menos movimiento.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ SE DECLARA CON `variants`, NO CON OBJETOS EN `initial`/`whileInView`, y
 * ése es el detalle que lo hace funcionar anidado.
 *
 * `motion` PROPAGA variantes a los descendientes motion por CONTEXTO, no por
 * DOM — un `<div>` o un `<li>` plano en medio no corta la propagación. Un
 * `StaggerGroup` declara `initial="hidden"` / `whileInView="visible"` como
 * ETIQUETAS, así que todo descendiente motion pasa a ser controlado por ese
 * árbol y su `whileInView` propio deja de dispararse.
 *
 * La primera versión de este componente usaba objetos literales. Metido dentro
 * de un `StaggerGroup` en `WhatsOn`, el `clip-path` **se quedó en su estado
 * inicial para siempre** y la imagen no apareció nunca. Sin error y sin
 * warning: el elemento existía en el DOM con su tamaño correcto. Sólo se vio
 * midiendo el estilo computado, que devolvía `inset(0% 0% 100%)`.
 *
 * Declarándolo con `variants` usando las MISMAS etiquetas que propaga el grupo,
 * funciona en los dos escenarios: suelto lo dispara su propio `whileInView`, y
 * anidado la etiqueta que llega del padre resuelve contra estas variantes.
 * ══════════════════════════════════════════════════════════════════════════
 */
export function RevealMedia({
  children,
  as = 'div',
  className,
  delay = 0,
  from = 'bottom',
}: {
  readonly children: ReactNode;
  readonly as?: ElementType;
  readonly className?: string;
  readonly delay?: number;
  /** Desde qué borde se abre. `left` es el de la escalera, `bottom` el default. */
  readonly from?: 'bottom' | 'right' | 'left';
}) {
  const reduced = useReducedMotion();
  const MotionTag = useMemo(() => motion.create(as), [as]);

  if (reduced) {
    const Tag = as;
    return (
      <Tag data-reveal="" className={className} style={SIN_MOVIMIENTO}>
        {children}
      </Tag>
    );
  }

  const cerrado =
    from === 'right'
      ? 'inset(0% 0% 0% 100%)'
      : from === 'left'
        ? 'inset(0% 100% 0% 0%)'
        : clip.hidden;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={{
        hidden: { clipPath: cerrado },
        visible: {
          clipPath: clip.visible,
          transition: { duration: dur.reveal, ease: ease.out, delay },
        },
      }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Media DENTRO de un contenedor con `overflow: hidden`: entra con una escala
 * mínima que se asienta, en lugar de recortarse.
 *
 * ⚠️ Es el mecanismo de la media contenida, no de la media a sangre. La
 * diferencia importa: un `clip-path` dentro de una caja que ya tiene borde
 * redondeado pelea con el recorte del contenedor y se ven los cantos.
 *
 * ⚠️ 1.04 y no más. Por encima de eso la imagen entra recortada de verdad y se
 * pierde parte del encuadre, que en una foto de un lugar es justamente lo que
 * hay que mostrar.
 */
export function ScaleMedia({
  children,
  className,
  delay = 0,
}: {
  readonly children: ReactNode;
  readonly className?: string;
  readonly delay?: number;
}) {
  const reduced = useReducedMotion();

  if (reduced) return <div data-reveal="" className={className} style={SIN_MOVIMIENTO}>{children}</div>;

  return (
    <motion.div
      data-reveal=""
      className={className}
      initial={{ scale: 1.04, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={viewport}
      transition={{ duration: dur.reveal, ease: ease.out, delay }}
    >
      {children}
    </motion.div>
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
   * ⚠️ `sunset` sobre claro da **2.54:1** y no pasa ni el 3:1 de texto grande;
   * sobre `deep` da 4.26:1. Sobre claro el acento es `sunset-deep` — el mismo
   * naranja con 10 puntos menos de luminosidad, 3.54:1 sobre `paper` —, que
   * reemplazó a `terra` cuando el acento pasó de rojo ladrillo a naranja. Ver
   * la nota de `Accent` en `Type.tsx`. Es exactamente al revés que en los
   * botones, donde el naranja es el FONDO y el texto va negro.
   *
   * El default es `dark` porque el único call site cuando esto se escribió era
   * el hero, que va sobre `deep`.
   */
  readonly accentOn?: 'light' | 'dark';
}) {
  const reduced = useReducedMotion();
  const acento = accentOn === 'light' ? 'text-sunset-deep' : 'text-sunset';
  const tone = (i: number) => (accentLast && i === lines.length - 1 ? acento : undefined);

  // ⚠️ El espacio al final de cada línea salvo la última NO es cosmético: sin
  // él el texto del elemento queda «Bonita comestogether», que es lo que lee
  // un crawler y lo que compone el nombre accesible. Dentro de la máscara es
  // invisible, porque cae al final del renglón.
  const withSpace = (line: string, i: number) => (i < lines.length - 1 ? `${line} ` : line);

  if (reduced) {
    return (
      <Tag data-reveal="" className={className} style={SIN_MOVIMIENTO}>
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
            /* ⚠️ `dur.hero` (1,1s) y no `dur.reveal`. Es la excepción declarada
               al tope de 600ms: corre una vez al cargar, no se repite, y es el
               momento memorable de la página. Ver la nota de `lib/motion.ts`.

               El stagger entre líneas es 0.07 y NO el `stagger` de 0.08 del
               token: dos líneas de un mismo titular tienen que leerse como UN
               gesto, no como dos elementos de una lista. */
            transition={{
              duration: dur.hero,
              ease: ease.out,
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
  if (reduced) return <div data-reveal="" className={className} style={SIN_MOVIMIENTO}>{children}</div>;

  return (
    <motion.div
      data-reveal=""
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
 * ⚠️ EL TRACK RECORTA LAS SOMBRAS DE LAS TARJETAS, Y POR ESO LLEVA PADDING EN
 * LOS CUATRO LADOS con un margen negativo que lo compensa. Un contenedor con
 * `overflow-x: auto` computa el `overflow-y` a `auto` también, así que recorta
 * arriba y abajo aunque uno sólo haya pedido scroll horizontal.
 *
 * Los números salen de `--shadow-card` y `--shadow-float`, que es la del hover,
 * calculados con el alcance REAL de la cola —`blur + spread`, no `blur / 2`—.
 * Ver el encabezado de `scripts/check-sombras.mjs`: la cuenta de la mitad da el
 * punto medio del degradé y deja un escalón recto visible en el borde.
 *
 * Con la cuenta buena, `shadow-float` baja 82px y sube 22. De ahí `pb-21` (84)
 * y `pt-6` (24). Eran 48 y 4, y el guard los marcaba.
 *
 * ⚠️ A LOS COSTADOS NO LLEVA NADA, Y ES A PROPÓSITO. El costado de un carrusel
 * es la ventana por la que se ve que hay más contenido: correrla hacia afuera
 * para que entre la sombra deja asomar media tarjeta siguiente dentro de la
 * caja, que se lee como un error de maquetación. En el eje en que un
 * contenedor scrollea, el recorte es diseño. El que hay que arreglar es el del
 * eje transversal, que es el de acá arriba.
 *
 * ⚠️ EL `className` DEL CONSUMIDOR VA EN UN ENVOLTORIO Y NO ACÁ. Los llamadores
 * pasan márgenes (`mt-bloque`), y un margen del consumidor contra el margen
 * negativo del track es una pelea que se resuelve por orden de aparición en el
 * CSS emitido, o sea por azar. Separados, cada uno manda en su elemento.
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
    <div className={className}>
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
          // El aire para que la sombra no se recorte. Ver el encabezado.
          'pt-6 -mt-6 pb-21 -mb-21',
          'scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          dragging ? 'cursor-grabbing select-none' : 'cursor-grab',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </div>
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
