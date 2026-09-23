import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { CAJA_ALTA_CLS } from '@/lib/flags';

/**
 * Botones y CTAs.
 *
 * ⚠️ SE FUERON LAS PÍLDORAS. Eran «la firma del sistema» cuando la referencia
 * era visitors.now, y resultaron ser justo lo que alejaba el sitio de la casa:
 * ninguna de las cuatro referencias que Camila fijó como máximas —Showdown
 * Social, WeWork, Superside, Stripe— usa píldoras. Las cuatro usan radios
 * chicos. Ahora el botón es `rounded-btn`, que son 8px.
 *
 * ⚠️ LO QUE NO CAMBIA, y es lo más importante del archivo: **sobre naranja el
 * texto va en NEGRO.** `sunset` es un tono medio; blanco encima
 * da 2.54:1 y no pasa AA en ningún tamaño. Negro da 8.26:1. Showdown puede
 * poner texto blanco sobre su azul porque su azul es oscuro; el nuestro no.
 * Es el error que más veces estuvo a punto de colarse.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LA ETIQUETA VA EN CAJA BAJA Y EN NEGRITA. Iba en CAJA ALTA con 0.06em de
 * tracking y en peso 500, con el argumento de que así el botón «se lee como
 * señalética y no como un control de aplicación».
 *
 * Se cae por dos motivos, y el segundo es el que manda:
 *
 *   1. No era cierto en todo el sitio. Cuatro CTA estaban escritos a mano sin
 *      pasar por este archivo —el del hero, el de la banda de eventos, el del
 *      calendario y el de FindUs— y tres de ellos ya iban en caja baja y en
 *      peso 500 a 15px. O sea que la «señalética» convivía con su contrario en
 *      la misma pantalla: el CTA del hero decía «Plan an event» y el de abajo
 *      «PLAN AN EVENT». Eso no es jerarquía, es descuido.
 *
 *   2. Camila fijó UN criterio para todo lo que se navega o se toca: la letra
 *      del cuerpo, en negrita, un escalón más grande. Vale para la nav, el
 *      mega-menú, el drawer, el footer y los botones. Ver el bloque de
 *      `NAV_ITEM` en `Header.tsx`, que es donde está escrita la regla.
 *
 * Los cuatro CTA a mano se borraron: ahora son `ButtonLink` como los otros 60.
 * Si aparece uno nuevo, va por acá.
 *
 * ⚠️ Sin caja alta, el tracking se va con ella. Los 0.06em existían para que
 * las mayúsculas no se apretaran; en caja baja separan lo que no hay que
 * separar y hacen que la etiqueta se lea deshilachada.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Variantes:
 *   primary    relleno naranja, texto NEGRO. El CTA de conversión.
 *   secondary  filo de 1px sobre el hueso. Acompaña al primario.
 *   outline    filo más marcado, sin relleno. Terciario.
 *   dark       relleno tinta, texto papel. Para usar SOBRE el naranja o la crema.
 *   onDark     relleno crema, texto deep. Para dentro de una losa oscura.
 *   ghostDark  filo claro sin relleno, dentro de una losa oscura.
 */

const VARIANTS = {
  primary: 'bg-sunset text-ink hover:bg-sunset-hover',
  secondary: 'bg-paper text-ink ring-1 ring-fog hover:ring-ink/35',
  outline: 'bg-transparent text-ink ring-1 ring-ink/25 hover:ring-ink/55',
  dark: 'bg-ink text-paper hover:bg-ink/85',
  onDark: 'bg-cream text-deep hover:bg-paper',
  ghostDark: 'bg-transparent text-paper ring-1 ring-paper/35 hover:ring-paper/70',
} as const;

/*
 * ⚠️ LOS TRES SUBIERON UN ESCALÓN LARGO: 12/13/15 pasaron a 15/16/18. El
 * pedido fue literal —«la font de los CTA está muy muy chica»— y tenía razón
 * medida: el CTA del header iba en `micro`, que son 13px, el mismo tamaño que
 * la letra chica del pie de página. El botón más importante del sitio estaba
 * compuesto como una nota al pie.
 *
 * Los altos NO cambian. `md` son 46px de alto con 16px de texto y `lg` 54 con
 * 18: en los dos casos queda holgura de sobra, y tocarlos movería la altura de
 * la barra del header y de todos los bloques de CTA del sitio.
 *
 * `d7` es el token de 18px. Es de la escala de títulos y acá se usa sólo por
 * su tamaño; el interlineado no interviene porque el botón es de una línea y
 * centra por flex.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LOS ALTOS BAJARON Y AHORA TOPEAN EN 42px. Pedido de Camila, con el número
 * puesto: «máximo quiero que tengan 42px».
 *
 * Medidos antes del cambio: `sm` 38, `md` 46 y `lg` 54. Los dos que se usan
 * pasaban el tope —`md` es el default y lo toman 125 call sites, `lg` está
 * escrito en 32—, así que el cambio se ve en todo el sitio.
 *
 * Ahora son 36 / 40 / 42. Se mantiene la escala de tres escalones en vez de
 * aplastar los tres a 42: un botón chico y uno grande tienen que seguir
 * distinguiéndose, y lo que el pedido fija es el TECHO.
 *
 * ⚠️ LOS CUERPOS NO CAMBIAN: 15 / 16 / 18px. Es el pedido anterior de Camila
 * —«la font de los CTA está muy muy chica»— y sigue valiendo. A 18px dentro de
 * 42 quedan 12px de aire arriba y abajo, que alcanza de sobra: la Jost tiene
 * una altura de mayúscula de 0,73em, o sea 13px de los 18.
 *
 * ⚠️ ESTO NO MUEVE LA ALTURA DEL HEADER, que es lo que la nota anterior temía.
 * La barra tiene `min-h-19.5` (78px) propio y el CTA nunca fue lo que la
 * definía; con 40px en vez de 46 el mínimo sigue mandando. Verificado en el
 * navegador.
 * ══════════════════════════════════════════════════════════════════════════
 */
const SIZES = {
  sm: 'h-9 px-4 text-dato',
  md: 'h-10 px-5.5 text-base',
  lg: 'h-10.5 px-7 text-d7',
} as const;

export type ButtonVariant = keyof typeof VARIANTS;

const BASE = [
  'inline-flex items-center justify-center gap-2.25',
  /* El área táctil llega a 44 sin tocar el alto de 42. Ver `toque` en globals.css. */
  'toque',
  /*
    ══════════════════════════════════════════════════════════════════════════
    ⚠️ LA ETIQUETA NUNCA SE PARTE EN DOS RENGLONES. Camila, 2026-09-21:
    «cuidado con los CTA largos, nunca deben quedar CTA con texto en dos
    líneas». Lo disparó «Follow for the new trucks» en /food-trucks, que a
    375px partía en «FOLLOW FOR THE NEW / TRUCKS» y dejaba la píldora con
    forma de losa.

    Y hay un motivo mecánico además del visual: el `Rodillo` del hover apila
    dos caras del mismo texto y las desplaza una altura de línea. Con dos
    renglones, esa altura deja de ser la del bloque y el texto rodado queda a
    mitad de camino. O sea que un CTA en dos líneas no sólo se ve mal: también
    rompe la animación de todo el sistema.

    ⚠️ ESTO CONVIERTE EL PROBLEMA EN DESBORDE, y es a propósito. Sin
    `nowrap` una etiqueta larga se acomoda sola en dos renglones y nadie se
    entera; con `nowrap` la píldora se pasa del ancho del contenedor y salta a
    la vista en la primera revisión en celular. El error ruidoso se arregla, el
    silencioso queda publicado.

    ⚠️ EL PRESUPUESTO ES DE ~20 CARACTERES. En el contenedor más angosto del
    sitio —una losa con `px-7` dentro del margen de 16px, o sea ~287px a
    375px— la píldora gasta 44px de `px-5.5`, y 21 más si el CTA es externo y
    lleva el ícono. Quedan ~222px para la etiqueta, que a 16px semibold en caja
    alta son unos 20 caracteres. Si no entra, se acorta el copy: no se achica
    el botón ni se le pone `text-wrap`.
    ══════════════════════════════════════════════════════════════════════════
  */
  'whitespace-nowrap',
  /*
    ⚠️ PESO 600 Y NO 700, y es un cambio pedido: «los veo muy pesados».

    La Jost es variable 100–900, así que 600 es un peso real de la fuente y no
    un falso intermedio sintetizado por el navegador. A 15/16/18px —los tres
    tamaños de `SIZES`— el salto de 700 a 600 se nota sobre todo en el naranja
    del primario, donde el texto negro sobre un fondo claro engorda de por sí.

    ⚠️ NO contradice la regla de `NAV_ITEM`. Esa regla dice «la letra del cuerpo,
    en negrita, un escalón más grande» y sigue valiendo para lo que se NAVEGA:
    nav, mega-menú, drawer y footer siguen en 700. Acá cambia lo que se APRIETA,
    que es lo que ya venía con más peso visual por tener relleno y píldora.
    Si algún día se quiere unificar, se cambia `NAV_ITEM` en el mismo commit.
  */
  'font-body font-semibold',
  /* La prueba de caja alta. Vive entera en `CAJA_ALTA` (`lib/flags.ts`), que
     explica qué revierte y cómo se apaga. Acá es una clase más. */
  CAJA_ALTA_CLS,
  /*
    ⚠️ PÍLDORA, y sólo acá. Camila lo pidió en el boceto: «CTAs redondos».

    Es una vuelta atrás deliberada — las píldoras se habían sacado porque
    ninguna de las cuatro referencias que ella misma había fijado las usaba. Lo
    que cambió es el contexto: ahora TODO el sitio está en 10px, así que un
    control completamente redondo ya no es «el lenguaje general», es la
    excepción que marca qué se puede tocar.

    ⚠️ Va en el COMPONENTE y no en el token `--radius-btn`. Ese token lo usan
    también badges, celdas del calendario de /whats-on, las barras de info del
    banner de eventos y el skip link: volverlo píldora redondearía todo eso, y
    una barra de texto de 18px de padding en píldora se lee como una cápsula de
    medicamento. Acá el radio pertenece al botón, no a la familia de radios.
  */
  'rounded-pill',
  /*
    `rueda` es el disparador del texto rodante: el hover se escucha acá, en
    el control entero, y el movimiento pasa adentro del `Rodillo`. Ver la
    utilidad `rodillo` en globals.css.
  */
  'rueda',
  'transition-colors duration-200',
  'disabled:opacity-50 disabled:pointer-events-none',
].join(' ');

/**
 * ══════════════════════════════════════════════════════════════════════════
 * El texto que RUEDA en el hover. Es lo único que puede escribir las clases
 * `rodillo-*`; la mecánica y el porqué de cada número están en la utilidad
 * `rodillo` de `globals.css`.
 *
 * ⚠️ DUPLICA `children` ENTERO Y NO SÓLO EL TEXTO. Muchos CTA son etiqueta más
 * flecha —`Plan your event <ArrowRight />`— y separarlos obligaría a que cada
 * call site pasara dos props en vez de children. Duplicado entero, la flecha
 * rueda junto a la palabra, que además es como se ve en la referencia.
 *
 * ⚠️ LA COPIA VA CON `aria-hidden`. Es el mismo texto dos veces en el DOM: sin
 * esto, un lector de pantalla anuncia «Plan your event Plan your event» en los
 * sesenta CTA del sitio.
 *
 * ⚠️ NO SE PUEDE DUPLICAR CUALQUIER COSA. Vale para etiquetas cortas: texto,
 * un icono, una flecha. Si algún día un CTA lleva adentro algo con estado o
 * con `id` propio, esto lo clona y hay que sacarlo de acá.
 *
 * ⚠️ SE EXPORTA DESDE EL 2026-09-22, y lo pidió `BackToTop`: es un botón que no
 * pasa por `Button` —es un círculo de 44px fijo en pantalla, no un control de
 * la escala de `SIZES`— pero tiene que rodar en el hover igual que los otros
 * sesenta, porque si no se lee como una pieza pegada de otro sitio.
 *
 * Exportarlo NO afloja la regla del encabezado: sigue siendo el único lugar
 * que escribe las clases `rodillo-*`. Lo que se comparte es la mecánica, y de
 * eso hay una sola copia.
 * ══════════════════════════════════════════════════════════════════════════
 */
export function Rodillo({ children }: { readonly children: ReactNode }) {
  return (
    <span className="rodillo">
      <span className="rodillo-cara rodillo-base">{children}</span>
      <span aria-hidden="true" className="rodillo-cara rodillo-copia">
        {children}
      </span>
    </span>
  );
}

/**
 * ⚠️ Va con `cn` y NO con `join(' ')`. Con el join, una clase que venga por
 * props no PISA la de `BASE`: queda al lado, y en Tailwind el ganador lo
 * decide el orden del CSS emitido. Concretamente `className="hidden"` contra
 * el `inline-flex` de `BASE` perdía, así que el CTA del header no se ocultaba
 * en mobile y desbordaba la barra. Ver la nota de `lib/cn.ts`.
 */
function classes(variant: ButtonVariant, size: keyof typeof SIZES, className?: string) {
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
}

export function ButtonLink({
  href,
  variant = 'secondary',
  size = 'md',
  className,
  children,
  external = false,
  ...rest
}: {
  readonly href: string;
  readonly variant?: ButtonVariant;
  readonly size?: keyof typeof SIZES;
  readonly className?: string;
  readonly children: ReactNode;
  /** Abre en otra pestaña con `rel="noopener"` y lo avisa por texto. */
  readonly external?: boolean;
} & Omit<ComponentProps<typeof Link>, 'href' | 'className' | 'children'>) {
  const cls = classes(variant, size, className);

  if (external) {
    return (
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        {...(rest as ComponentProps<'a'>)}
      >
        <Rodillo>{children}</Rodillo>
        <ExternalIcon />
        <span className="sr-only">(opens in a new tab)</span>
      </Link>
    );
  }

  return (
    <Link href={href} className={cls} {...rest}>
      <Rodillo>{children}</Rodillo>
    </Link>
  );
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: {
  readonly variant?: ButtonVariant;
  readonly size?: keyof typeof SIZES;
  readonly className?: string;
  readonly children: ReactNode;
} & ComponentProps<'button'>) {
  return (
    <button className={classes(variant, size, className)} {...rest}>
      <Rodillo>{children}</Rodillo>
    </button>
  );
}

/**
 * El chip de anuncio: la píldora que va arriba del titular del hero.
 *
 * Estructura de la referencia — etiqueta de color + texto + flecha — pero la
 * etiqueta va en `terra` y no en el acento: sobre blanco, `sunset` daría
 * 2.54:1 como texto. `terra` da 7.43:1 y mantiene la familia cálida.
 */
export function AnnouncementChip({
  tag,
  children,
  href,
}: {
  readonly tag: string;
  readonly children: ReactNode;
  readonly href: string;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2.5 rounded-pill bg-paper py-1.75 pr-3.5 pl-2 shadow-btn ring-1 ring-fog transition-shadow duration-200 hover:ring-ink/20"
    >
      <span className="rounded-pill bg-cream px-2.25 py-0.75 font-body text-caption font-bold uppercase tracking-eyebrow text-terra">
        {tag}
      </span>
      <span className="font-body text-dato font-medium text-body">{children}</span>
      <svg
        width="13"
        height="9"
        viewBox="0 0 16 10"
        fill="none"
        aria-hidden="true"
        className="shrink-0 text-body/75 transition-transform duration-200 group-hover:translate-x-0.75"
      >
        <path
          d="M0 5h14M10 1l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}

/**
 * El indicador de «se abre en otra pestaña».
 *
 * ⚠️ Es un SVG y no un emoji: el brief prohíbe emojis como iconos, y un emoji
 * lo lee el lector de pantalla con un nombre que no dice nada útil.
 */
export function ExternalIcon({ className = '' }: { readonly className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className={['shrink-0', className].filter(Boolean).join(' ')}
    >
      <path
        d="M4.5 1.5H10.5V7.5M10.5 1.5L5 7M8 8.5V10.5H1.5V4H3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Link con flecha, para los CTA de texto. La flecha se desplaza en el hover. */
export function ArrowLink({
  href,
  children,
  className = '',
  external = false,
}: {
  readonly href: string;
  readonly children: ReactNode;
  readonly className?: string;
  readonly external?: boolean;
}) {
  const inner = (
    <>
      <span className="link-texto">{children}</span>
      <svg
        width="16"
        height="10"
        viewBox="0 0 16 10"
        fill="none"
        aria-hidden="true"
        className="shrink-0 transition-transform duration-200 group-hover:translate-x-1"
      >
        <path
          d="M0 5h14M10 1l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {external ? <span className="sr-only">(opens in a new tab)</span> : null}
    </>
  );

  const cls = ['group inline-flex items-center gap-2.25 font-body text-base font-medium', CAJA_ALTA_CLS, className]
    .filter(Boolean)
    .join(' ');

  return external ? (
    <Link href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </Link>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
