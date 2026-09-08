/**
 * El patrón gráfico de la marca, como BANDA.
 *
 * ⚠️ ASSET PLACEHOLDER. El azulejo real de la marca todavía no lo tenemos.
 * Esto es una aproximación construida a partir de la onda del isotipo (el único
 * lugar donde la marca dibuja agua), para que se vea dónde y cómo va la banda.
 * Cuando llegue el SVG real se reemplaza el `<pattern>` de acá y nada más.
 *
 * ⚠️ El brief: «El patrón de azulejo se usa como banda o como detalle, nunca
 * como fondo de sección completa». Por eso este componente ES una banda de alto
 * fijo y no acepta usarse como background.
 *
 * ⚠️ Va en `river` #0EB6B8, que es uno de los dos usos autorizados del teal
 * (isotipo, iconografía y patrón). Como es decorativo y no transporta
 * información, no le aplica el mínimo de contraste: va `aria-hidden`.
 */

export default function TilePattern({
  height = 'h-[28px]',
  className = '',
  tone = 'river',
}: {
  readonly height?: string;
  readonly className?: string;
  readonly tone?: 'river' | 'cream' | 'deep';
}) {
  const stroke =
    tone === 'river' ? '#0EB6B8' : tone === 'cream' ? '#FDF0B4' : '#014545';

  return (
    <div
      aria-hidden="true"
      className={['w-full overflow-hidden', height, className].filter(Boolean).join(' ')}
    >
      <svg
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        viewBox="0 0 240 28"
        role="presentation"
      >
        <defs>
          <pattern id="rt-wave" width="60" height="28" patternUnits="userSpaceOnUse">
            {/* La onda del isotipo: dos crestas, la de abajo más abierta. */}
            <path
              d="M0 18 C 10 8, 20 8, 30 18 S 50 28, 60 18"
              fill="none"
              stroke={stroke}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M0 8 C 10 2, 20 2, 30 8 S 50 14, 60 8"
              fill="none"
              stroke={stroke}
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.5"
            />
          </pattern>
        </defs>
        <rect width="240" height="28" fill="url(#rt-wave)" />
      </svg>
    </div>
  );
}

/**
 * El mismo motivo como DETALLE chico: un separador de ~40px para acompañar un
 * eyebrow o cerrar un bloque. El otro uso que el brief autoriza.
 */
export function TileMark({ className = '' }: { readonly className?: string }) {
  return (
    <svg
      width="44"
      height="12"
      viewBox="0 0 44 12"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M1 8 C 6 3, 11 3, 16 8 S 26 13, 31 8 S 38 3, 43 6"
        stroke="#0EB6B8"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
