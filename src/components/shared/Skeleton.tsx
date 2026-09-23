/**
 * LAS PANTALLAS DE CARGA. Las usan los `loading.tsx` de `src/app/`.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ DIBUJAN LA FORMA DE LA PÁGINA QUE VIENE, NO UN SPINNER. El hero de placa
 * (`PlateHero`) lo usan ocho de las diez páginas, así que el esqueleto arranca
 * con su silueta: migas, bajada, titular centrado y la foto grande con las
 * mismas proporciones por escalón (4/5 → 4/3 → 16/9 → 17/9). Cuando llega la
 * página, el contenido cae donde ya estaba el bloque gris y no hay salto.
 *
 * ⚠️ CUÁNDO SE VEN. Las páginas estáticas vienen prefetcheadas y casi nunca
 * lo muestran. Las que se arman por request —`/whats-on` (lee la base),
 * `/events` y `/join-us` (leen la URL)— sí: al navegar hacia ellas, esto es
 * lo que se ve mientras el servidor contesta, en vez de la página anterior
 * congelada sin señal de que el clic hizo algo.
 *
 * ⚠️ ACCESIBILIDAD. Los bloques van `aria-hidden`: un lector de pantalla no
 * tiene nada que leer en un rectángulo gris. Lo que sí se anuncia es UNA
 * línea, «Loading», en un `role="status"`.
 * ══════════════════════════════════════════════════════════════════════════
 */

/** Un bloque del esqueleto. La forma la ponen las clases. */
export function Bone({
  className = '',
  style,
}: {
  readonly className?: string;
  readonly style?: React.CSSProperties;
}) {
  return <span aria-hidden="true" className={`esqueleto block ${className}`} style={style} />;
}

/** Un renglón de texto: alto de línea, radio de píldora. */
function Linea({ className = '' }: { readonly className?: string }) {
  return <Bone className={`h-[14px] rounded-pill ${className}`} />;
}

/** La silueta de `PlateHero`. */
function HeroSkeleton() {
  return (
    <div className="bg-bone pt-[34px] pb-[48px] lg:pt-[46px] lg:pb-[64px]">
      <div className="caja-ancha">
        {/* Migas */}
        <Linea className="mb-[20px] w-[140px]" />
        {/* Bajada: dos renglones centrados */}
        <div className="mx-auto flex max-w-[40ch] flex-col items-center gap-[10px]">
          <Linea className="w-full" />
          <Linea className="w-3/4" />
        </div>
        {/* Titular: dos renglones del alto de `text-banda` */}
        <div className="mx-auto mt-5 flex flex-col items-center gap-[0.18em] text-banda lg:mt-7">
          <Bone className="h-[0.82em] w-[min(92%,9em)] rounded-card" />
          <Bone className="h-[0.82em] w-[min(70%,6em)] rounded-card" />
        </div>
        {/* La foto, con las proporciones del hero por escalón */}
        <Bone className="mt-[28px] aspect-[4/5] w-full rounded-frame sm:aspect-[4/3] md:aspect-[16/9] lg:aspect-[17/9] lg:max-h-[calc(100svh-378px)]" />
      </div>
    </div>
  );
}

/** Una tarjeta: foto 16/9 y tres renglones. */
function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card border border-ink/10 bg-paper">
      <Bone className="aspect-video w-full rounded-none" />
      <div className="flex flex-col gap-[12px] p-6">
        <Linea className="w-1/3" />
        <Bone className="h-[26px] w-4/5 rounded-card" />
        <Linea className="w-full" />
        <Linea className="w-2/3" />
      </div>
    </div>
  );
}

/** El cuerpo genérico: titular de sección, bajada y una fila de tres tarjetas. */
function BodySkeleton() {
  return (
    <div className="caja-ancha py-16 lg:py-24">
      <Linea className="w-[120px]" />
      <Bone className="mt-4 h-[44px] w-[min(100%,520px)] rounded-card" />
      <div className="mt-5 flex max-w-[52ch] flex-col gap-[10px]">
        <Linea className="w-full" />
        <Linea className="w-5/6" />
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <CardSkeleton />
        <CardSkeleton />
        <div className="hidden lg:block">
          <CardSkeleton />
        </div>
      </div>
    </div>
  );
}

/** `/whats-on`: filtros en píldora, la barra del mes y la grilla de fechas. */
function CalendarSkeleton() {
  return (
    <div className="caja-ancha py-12 lg:py-16">
      <div className="flex flex-wrap gap-3">
        {[88, 72, 104, 80, 96].map((w) => (
          <Bone key={w} className="h-10.5 rounded-pill" style={{ width: w }} />
        ))}
      </div>
      <div className="mt-8 flex items-center justify-between gap-4">
        <Bone className="size-10.5 rounded-pill" />
        <Bone className="h-[34px] w-[200px] rounded-card" />
        <Bone className="size-10.5 rounded-pill" />
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className={i >= 2 ? 'hidden sm:block' : ''}>
            <CardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}

/** `/events` y `/join-us`: la losa del formulario, texto a la izquierda y panel. */
function FormSkeleton() {
  return (
    <div className="caja-ancha py-16 lg:py-24">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.5fr)] lg:gap-16">
        <div>
          <Linea className="w-[120px]" />
          <Bone className="mt-4 h-[44px] w-4/5 rounded-card" />
          <div className="mt-5 flex flex-col gap-[10px]">
            <Linea className="w-full" />
            <Linea className="w-5/6" />
            <Linea className="w-2/3" />
          </div>
        </div>
        <div className="rounded-frame bg-bone px-5 py-9 sm:px-9 sm:py-11">
          <div className="flex flex-col gap-[16px]">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="grid gap-[16px] sm:grid-cols-2">
                {[0, 1].map((j) => (
                  <div key={j} className="flex flex-col gap-[8px]">
                    <Linea className="w-2/5" />
                    <Bone className="h-10.5 w-full rounded-pill" />
                  </div>
                ))}
              </div>
            ))}
            <Bone className="mt-[12px] h-10.5 w-full rounded-pill" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PageSkeleton({
  variant = 'page',
}: {
  readonly variant?: 'page' | 'calendar' | 'form';
}) {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Loading</span>
      <HeroSkeleton />
      {variant === 'calendar' ? (
        <CalendarSkeleton />
      ) : variant === 'form' ? (
        <FormSkeleton />
      ) : (
        <BodySkeleton />
      )}
    </div>
  );
}
