import HorizonBorder from './HorizonBorder';
import Section from './Section';
import { Eyebrow, Heading } from './Type';

/**
 * BLOQUE E DEL KIT: la tabla comparativa sobre losa oscura.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ES EL ÚNICO BLOQUE OSCURO DE LA PÁGINA QUE LO USE. `deep` en este sitio
 * es puntuación, no fondo: la home tiene dos apariciones en 8.300px y la
 * proporción medida es 70–75 % claro. Dos losas seguidas rompen eso.
 *
 * ⚠️ NO ES UNA `<table>`, y es a propósito. Una tabla HTML declara que las
 * celdas se cruzan —fila por columna— y acá no se cruzan: son dos listas
 * paralelas que se leen de arriba abajo, cada una con su encabezado. Con
 * `<table>` un lector de pantalla anunciaría coordenadas que no significan
 * nada. Son dos `<ul>` con su `<h3>`.
 *
 * ⚠️ LA COLUMNA NUESTRA VA PRIMERO EN EL DOM. En mobile las dos columnas se
 * apilan, y la que se lee primero tiene que ser la del argumento propio.
 *
 * ⚠️ EL ✓ Y EL ✗ LLEVAN `aria-hidden` Y SU TEXTO AL LADO. Un lector que sólo
 * anuncia «marca de verificación» no dice de qué lado está.
 * ══════════════════════════════════════════════════════════════════════════
 */

export interface CompareColumn {
  readonly label: string;
  readonly rows: readonly string[];
}

export default function CompareSlab({
  eyebrow,
  title,
  lead,
  id,
  ours,
  theirs,
}: {
  readonly eyebrow: string;
  readonly title: string;
  readonly lead?: string;
  readonly id: string;
  readonly ours: CompareColumn;
  readonly theirs: CompareColumn;
}) {
  return (
    <>
      <HorizonBorder from="paper" to="deep" />
      <Section tone="deep" band="lg" labelledBy={id}>
        <div className="max-w-[60ch]">
          <Eyebrow tone="cream">{eyebrow}</Eyebrow>
          <Heading level={2} id={id} className="mt-gap-kicker">
            {title}
          </Heading>
          {lead ? <p className="bajada mt-gap-bajada text-paper/85">{lead}</p> : null}
        </div>

        <div className="mt-[48px] grid gap-[32px] lg:grid-cols-2 lg:gap-[64px]">
          {[
            { col: ours, nuestro: true },
            { col: theirs, nuestro: false },
          ].map(({ col, nuestro }) => (
            <div key={col.label}>
              <Heading
                level={3}
                role="label"
                className={nuestro ? 'text-cream' : 'text-muted-dark'}
              >
                {col.label}
              </Heading>
              <span
                aria-hidden="true"
                className={[
                  'mt-[10px] block h-[2px] w-[36px]',
                  nuestro ? 'bg-sunset' : 'bg-paper/25',
                ].join(' ')}
              />
              <ul className="mt-[20px] flex list-none flex-col gap-[14px]">
                {col.rows.map((r) => (
                  <li key={r} className="flex items-start gap-[12px]">
                    <span
                      aria-hidden="true"
                      className={[
                        'mt-[3px] grid size-[20px] shrink-0 place-items-center rounded-pill text-[12px] font-bold',
                        nuestro ? 'bg-sunset text-ink' : 'bg-paper/15 text-paper/60',
                      ].join(' ')}
                    >
                      {nuestro ? '✓' : '✕'}
                    </span>
                    <span
                      className={[
                        'text-[16px] leading-[1.6]',
                        nuestro ? 'text-paper' : 'text-paper/70',
                      ].join(' ')}
                    >
                      <span className="sr-only">{nuestro ? 'Yes: ' : 'No: '}</span>
                      {r}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
