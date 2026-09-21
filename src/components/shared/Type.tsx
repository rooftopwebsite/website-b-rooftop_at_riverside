/**
 * Las primitivas tipográficas: Heading, Eyebrow y SectionHead.
 *
 * Existen para que la escala no se pueda romper desde una página. Los tamaños
 * salen de docs/house-tokens.md y el mapa responsive es el de The Orient.
 */

import type { ReactNode } from 'react';

export type HeadingLevel = 1 | 2 | 3 | 4;

/**
 * ⚠️ LA ESCALA ES FLUIDA Y YA NO HAY MAPA DE BREAKPOINTS.
 *
 * Antes cada nivel se armaba con tres clases —`text-d5 md:text-d4 lg:text-d3`—
 * y eso daba tres saltos visibles al redimensionar. Ahora cada nivel es UN
 * token con `clamp()`, definido en globals.css, y la progresión es continua.
 *
 * Los cuatro escalones y de dónde a dónde van:
 *
 *   hero   56 → 144px   el h1 del home, y sólo ése
 *   h1     44 → 104px   el h1 de las 22 internas, vía `PageHero`
 *   h2     40 →  88px   todo título de sección
 *   h3     28 →  40px   subtítulo dentro de una sección
 *
 * ⚠️ El h2 pasó de 46px a 88px en desktop, y es EL cambio del rediseño. La
 * relación h2/bajada estaba en 2,6× —por debajo del 3,5× donde la jerarquía se
 * empieza a leer— y ahora está en 4,0×. Ver `design-audit/AUDIT.md` §4.
 */
/**
 * ⚠️ La condensada llega hasta h3 y NO MÁS. Camila: «usémosla sólo para
 * títulos grandes, o sea h1, h2 y h3». El h4 y los títulos de card pasan a la
 * geométrica en peso Medium y caja MIXTA, y eso es lo que hace
 * `FUERA_DE_DISPLAY`.
 *
 * El motivo no es sólo gusto, y ahora además es una regla dura del brief: **la
 * condensada nunca por debajo de 24px**. A 20–24px una condensada de caja alta
 * se lee como una ETIQUETA y no como un título, así que competía con los
 * eyebrows —que son literalmente eso— en vez de encabezar el bloque.
 *
 * Va en caja MIXTA y a peso 500, que es lo que lo separa del eyebrow: los dos
 * comparten familia, así que la diferencia la hacen la caja y el tracking. Un
 * título de card en caja alta con tracking abierto sería un eyebrow grande, no
 * un título.
 */
const FUERA_DE_DISPLAY =
  'font-body font-medium text-[20px] leading-[1.3] normal-case lg:text-[24px]';

/**
 * `label` — rótulo de columna del footer y encabezados de bloque chico.
 *
 * ⚠️ ERA `text-d7`, o sea la CONDENSADA A 18px, y eso violaba el piso de 24px
 * del brief: a ese cuerpo una condensada de caja alta pierde el contraste de
 * trazo que la hace funcionar y se vuelve ilegible. Lo usan seis call sites
 * —el footer, /faq, /join-us, /our-story, /sunset-bar y /events/game-truck—
 * así que era una violación repetida, no un caso aislado.
 *
 * Pasa a la geométrica en caja alta a 15/16px con tracking medio. Queda en un
 * escalón propio entre el eyebrow (12px, 0.12em) y el título de card (20/24px,
 * caja mixta): se lee como rótulo y no compite con ninguno de los dos.
 */
const LABEL =
  'font-subhead font-medium text-[15px] leading-[1.3] tracking-label uppercase lg:text-[16px]';

const SIZES: Record<HeadingLevel, string> = {
  1: 'text-h1',
  2: 'text-h2',
  3: 'text-h3',
  4: FUERA_DE_DISPLAY,
};

const ROLES = {
  section: null,
  hero: 'text-hero',
  card: FUERA_DE_DISPLAY,
  label: LABEL,
} as const;

export type HeadingRole = keyof typeof ROLES;

export function Heading({
  level,
  role = 'section',
  className = '',
  id,
  children,
}: {
  readonly level: HeadingLevel;
  readonly role?: HeadingRole;
  readonly className?: string;
  readonly id?: string;
  readonly children: ReactNode;
}) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4';
  return (
    <Tag
      {...(id ? { id } : {})}
      className={[
        // La condensada va SIEMPRE en caja alta: es un display, y en caja baja
        // pierde el color de página que sostiene el diseño.
        //
        // ⚠️ PESO 600, decidido con Camila para esta rama. Es el punto medio
        // entre el 600–800 que pedía el brief y el `font-normal` que estaba
        // aprobado antes.
        //
        // Por qué se movió del 400: a 144px una condensada en Regular se lee
        // liviana, casi de línea, y en esta dirección el titular del hero es lo
        // ÚNICO grande de la primera pantalla —el muro se quedó en huecos
        // rotulados—, así que tiene que sostenerla solo.
        //
        // Por qué no 700 ni 800: es el peso con el que se rechazó la
        // condensada anterior. El 600 le da cuerpo de asta sin cerrar los
        // contornos.
        //
        // ⚠️ Y el tracking va en CERO, no negativo. El brief pedía -0.01em y es
        // exactamente el signo que ya se rechazó una vez sobre esta clase de
        // tipografía («se ve muy pegada»). Los ocho tokens
        // `--text-*--letter-spacing` que abrían cada escalón se fueron de
        // globals.css: existían para compensar un tracking negativo global que
        // ya no está, así que con el tracking en cero no hay nada que
        // compensar. Los escalones quedan en `letter-spacing: normal`.
        //
        // `font-display` y `uppercase` los apagan h4, `role="card"` y
        // `role="label"` con su propia familia y caja, que ganan por venir
        // después.
        'font-display font-semibold uppercase',
        ROLES[role] ?? SIZES[level],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Tag>
  );
}

/**
 * El acento tipográfico DENTRO del titular.
 *
 * ⚠️ Va en COLOR y no en itálica. Camila: «usar cambio de color no itálica,
 * porque el brand no usa itálica». La referencia —wework, superside— lo hace
 * con una serif itálica de otra familia; acá no hay serif y no vamos a sumar
 * una cuarta familia por un acento, así que el contraste lo da el color.
 *
 * ⚠️ DOS colores según la superficie, y no uno. `sunset` sobre claro da
 * **2.54:1** sobre `paper` y **2.35:1** sobre `bone`: no alcanza ni el 3:1 que
 * pide el texto grande (WCAG 1.4.3). Sobre `deep` sí, 4.26:1.
 *
 * ⚠️ SOBRE CLARO VA `sunset-deep` Y YA NO `terra`. El acento era `terra`
 * (#A62000), que pasaba de sobra —7.43:1— pero a esa luminosidad el tono se
 * lee como rojo ladrillo y no como el naranja de la marca. Camila: «las
 * palabras destacadas en los títulos deben estar en naranja no en rojo».
 *
 * `sunset-deep` es `sunset` con el mismo hue y la misma saturación y 10 puntos
 * menos de luminosidad: 3.54:1 sobre `paper` y 3.28:1 sobre `bone`. Pasa el
 * 3:1 de texto grande, que es la barra que corresponde porque este acento sólo
 * existe dentro de un titular de display. NO pasa cuerpo — si mañana alguien
 * quiere acentuar una palabra de una bajada, éste no es el color.
 *
 * ⚠️ MÁXIMO EN DOS TITULARES DE LA HOME, y en los dos la palabra acentuada
 * tiene que cargar significado: el h1 del hero y el h2 de Events banner. Un
 * acento en cada título es ruido, no jerarquía.
 *
 * Ratios medidos en `design-audit/CONTRASTE.md`. Descartados para claro:
 * `river` (falla), `tomato` (pasa raspando, sólo texto grande), `plum` y
 * `deep` (pasan, pero siendo oscuros como el titular no se leen como acento).
 */
export function Accent({
  on,
  children,
}: {
  /** La superficie sobre la que cae el titular, NO el color que se quiere. */
  readonly on: 'light' | 'dark';
  readonly children: ReactNode;
}) {
  return <span className={on === 'dark' ? 'text-sunset' : 'text-sunset-deep'}>{children}</span>;
}

/**
 * Eyebrow. La geométrica en 500, caja alta, 12px y 0.12em de tracking.
 *
 * ⚠️ El tracking bajó de 0.24em a 0.12em y el cuerpo de 13px a 12px. El 0.24em
 * existía para igualar la mancha de la caja alta de la familia que se fue por
 * licencia: era una corrección sin referente. Ver globals.css.
 *
 * ⚠️ NO VA UN EYEBROW ARRIBA DE CADA TÍTULO. En la home había **14** y el
 * brief permite 3. Se quedan los que CLASIFICAN un dato real —el día de cada
 * evento, las tres unidades del negocio, los rótulos de contacto— y se caen
 * los que sólo repetían en versalitas el título que venía abajo. Un eyebrow
 * por sección es cromo de plantilla.
 *
 * ⚠️ Los tonos son sólo los que PASAN AA. No hay `sunset` ni `river`: sobre la
 * base dan 2.54:1 y 2.50:1. Ratios medidos en `design-audit/CONTRASTE.md`.
 */
const EYEBROW_TONES = {
  deep: 'text-deep', // 10.83:1 sobre paper · 10.03:1 sobre bone
  plum: 'text-plum', // 13.51:1 · 12.50:1
  terra: 'text-terra', //  7.43:1 ·  6.87:1
  magenta: 'text-magenta', //  5.64:1 ·  5.22:1
  cream: 'text-cream', //  9.44:1 sobre deep
  ink: 'text-ink', // 17.11:1 · 15.83:1
} as const;

export function Eyebrow({
  children,
  tone = 'deep',
  className = '',
  as: Tag = 'p',
}: {
  readonly children: ReactNode;
  readonly tone?: keyof typeof EYEBROW_TONES;
  readonly className?: string;
  readonly as?: 'p' | 'span' | 'div';
}) {
  return (
    <Tag className={['eyebrow', EYEBROW_TONES[tone], className].filter(Boolean).join(' ')}>
      {children}
    </Tag>
  );
}

/**
 * El encabezado de sección completo: eyebrow + título + bajada.
 *
 * El ritmo interno sale de los tokens `gap-kicker` / `gap-bajada`, que ya
 * traen su escalón mobile. Ningún call site escribe un `lg:`.
 */
export function SectionHead({
  eyebrow,
  eyebrowTone,
  title,
  lead,
  level = 2,
  id,
  align = 'left',
  measure = 'head',
  className = '',
  children,
}: {
  readonly eyebrow?: string;
  readonly eyebrowTone?: keyof typeof EYEBROW_TONES;
  readonly title: ReactNode;
  readonly lead?: ReactNode;
  readonly level?: HeadingLevel;
  readonly id?: string;
  readonly align?: 'left' | 'center';
  /**
   * `head` —el default— corta el bloque en `max-w-head` (1040px), que es el
   * ancho al que un h2 de dos renglones se lee sin cansar.
   *
   * ⚠️ `full` lo suelta al ancho del CONTENEDOR, y existe para un solo caso:
   * cuando el título lleva una IMAGEN intercalada entre sus renglones. Ahí el
   * corte en 1040px deja la banda 240px más angosta que la grilla que viene
   * abajo, y dos medidas distintas apiladas se leen como un error de
   * maquetación, no como una decisión. Con `full`, la banda y las columnas
   * comparten la misma medida y la grilla editorial se mantiene.
   *
   * La bajada NO se afloja con esto: ya trae su propio `max-w-[60ch]`, que es
   * lo que gobierna la línea de lectura.
   */
  readonly measure?: 'head' | 'full';
  readonly className?: string;
  readonly children?: ReactNode;
}) {
  const centered = align === 'center';
  const ancho = measure === 'full' ? 'max-w-none' : 'max-w-head';
  return (
    <div
      /*
       * ⚠️ El ancho del bloque subió con la escala. Con el h2 en 46px, 820px
       * alcanzaban para dos renglones; a 88px un título de tres palabras ya
       * pide más de mil. `max-w-head` sale de los tokens de contenedor, no de
       * un número escrito acá.
       */
      className={[
        centered ? `mx-auto ${ancho} text-center` : ancho,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {eyebrow ? (
        <Eyebrow tone={eyebrowTone} className="mb-gap-kicker">
          {eyebrow}
        </Eyebrow>
      ) : null}
      <Heading level={level} id={id}>
        {title}
      </Heading>
      {lead ? (
        /*
         * ⚠️ `bajada` y NO `opacity-80` ni `text-muted` directo.
         *
         * La opacidad se fue porque el color resultante cambiaba según la
         * superficie de atrás: el mismo markup daba un contraste distinto
         * sobre `paper`, sobre `bone` y sobre una foto, así que no se podía
         * auditar.
         *
         * Pero `text-muted` a secas tampoco servía, y eso lo encontró
         * `npm run a11y` y no una tabla: `muted` es un verde medio calibrado
         * para fondos claros, y esta bajada también aparece dentro de la
         * sección oscura, donde daba **2.02:1**. Un token opaco no se adapta a
         * la superficie — eso era justo lo que la opacidad hacía bien.
         *
         * `bajada` resuelve las dos cosas: lee `--lead-ink`, que `.on-dark`
         * pisa, y los dos valores posibles son opacos y están medidos
         * (5.36:1 sobre `paper` · 4.96:1 sobre `bone` · 5.95:1 sobre `deep`).
         *
         * ⚠️ 60ch y no 62ch: es el valor del brief para la bajada. El cuerpo
         * corrido usa 75ch, que es otro componente.
         */
        /*
         * ⚠️ `mx-auto` CUANDO EL BLOQUE VA CENTRADO, y faltaba. El `text-center`
         * del contenedor centra los RENGLONES adentro del párrafo, pero el
         * párrafo mide 60ch y sin margen automático se apoyaba a la izquierda
         * de su caja: el eyebrow y el título quedaban en el centro de la
         * sección y la bajada 70px a la izquierda. Camila lo marcó rodeando la
         * bajada de `/whats-on` el 2026-09-21: «centrá la bajada».
         *
         * Va atado a `centered` y no puesto siempre porque en el bloque
         * alineado a la izquierda —el default— un `mx-auto` lo despegaría del
         * borde en cuanto la sección sea más ancha que 60ch.
         */
        <p
          className={[
            'mt-gap-bajada max-w-[60ch] text-lead bajada',
            centered ? 'mx-auto' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {lead}
        </p>
      ) : null}
      {children}
    </div>
  );
}
