/**
 * Calibra la opacidad de la trama de grecas cuadro por cuadro.
 *
 *   node design-audit/trama.mjs
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ POR QUÉ EXISTE. Los tres cuadros de «How this place works» llevan la
 * misma trama sobre tres campos distintos, y con la MISMA opacidad la trama no
 * pesa lo mismo en los tres: `deep` al 15 % sobre `cream` es un dibujo, y
 * `cream` al 20 % sobre `deep` es un susurro. Lo anoté en `AUTOCRITICA.md` §2
 * y ahí dije que la corrección correcta era una opacidad por cuadro, calibrada
 * contra su propio campo.
 *
 * Esto lo mide en lugar de estimarlo. La fuerza percibida de una textura no es
 * su opacidad: es cuánto se separa en CLARIDAD del fondo sobre el que está.
 * Así que el script compone la trama sobre su campo a una opacidad dada,
 * convierte las dos a **L\*** de CIELAB —que es una escala perceptual, a
 * diferencia de la luminancia relativa de WCAG— y devuelve el ΔL\*.
 *
 * El objetivo NO se elige a ojo: se toma de los dos cuadros que ya funcionan
 * (naranja y verde) y se resuelve la opacidad del tercero para que caiga en el
 * mismo ΔL\*.
 *
 * ⚠️ Los colores se leen de `globals.css`, que es lo que RENDERIZA. Es la
 * misma regla que `scripts/contrast.mjs`: la auditoría vieja estaba calculada
 * contra la copia de `brand.ts`, que decía otra cosa.
 * ══════════════════════════════════════════════════════════════════════════
 */
import { readFileSync } from 'node:fs';

const CSS = readFileSync(new URL('../src/app/globals.css', import.meta.url), 'utf8');

/** Los `--color-*: #hex;` del `@theme`. Los alias `var(...)` se saltean. */
function paleta() {
  const salida = {};
  for (const [, nombre, hex] of CSS.matchAll(/--color-([a-z-]+):\s*(#[0-9a-fA-F]{3,8})\s*;/g)) {
    salida[nombre] = hex;
  }
  return salida;
}

const P = paleta();

const rgb = (hex) => {
  const h = hex.replace('#', '');
  const n = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
};

/** Composición `source-over`: la trama a opacidad α sobre el campo opaco. */
const componer = (trama, campo, a) =>
  rgb(trama).map((c, i) => Math.round(c * a + rgb(campo)[i] * (1 - a)));

/** sRGB → CIELAB, D65. La linealización es la misma que usa WCAG. */
function lab([r, g, b]) {
  const lin = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  /* Matriz sRGB → XYZ D65, normalizada por el blanco de referencia. */
  const X = (0.4124 * lin[0] + 0.3576 * lin[1] + 0.1805 * lin[2]) / 0.95047;
  const Y = 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
  const Z = (0.0193 * lin[0] + 0.1192 * lin[1] + 0.9505 * lin[2]) / 1.08883;
  const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (841 / 108) * t + 4 / 29);
  return [116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))];
}

/**
 * ⚠️ SE MIDE ΔE Y NO SÓLO ΔL\*, y ése es el hallazgo de este script.
 *
 * Mi autocrítica decía que la trama gritaba en el cuadro crema porque el par
 * `deep`/`cream` mide 9.44:1 en WCAG. **Eso estaba mal razonado**: 9.44:1 es
 * una medida de LEGIBILIDAD de texto, y en claridad el cuadro crema resultó el
 * más suave de los tres (ΔL\* 9,9 contra 14,0 del verde).
 *
 * Lo que hace ruido ahí no es la claridad: es el TONO. `deep` es un teal
 * saturado y `cream` un amarillo saturado — están casi enfrentados en el
 * círculo, así que la espiral se separa del campo por color y no por sombra, y
 * eso es lo que la convierte en dibujo. ΔL\* no ve nada de eso; ΔE\*ab sí,
 * porque incluye los ejes a\* y b\*.
 */
const delta = (trama, campo, a) => {
  const A = lab(componer(trama, campo, a));
  const B = lab(rgb(campo));
  return Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]);
};

const deltaL = (trama, campo, a) => Math.abs(lab(componer(trama, campo, a))[0] - lab(rgb(campo))[0]);

const CUADROS = [
  { paso: '01 · Afternoon', campo: 'cream', trama: 'deep', actual: 0.15 },
  { paso: '02 · Golden hour', campo: 'sunset', trama: 'ink', actual: 0.15 },
  { paso: '03 · Night', campo: 'deep', trama: 'cream', actual: 0.2 },
];

console.log('\nLa trama contra su propio campo, con la opacidad de hoy\n');
console.log('  paso                trama         campo      ΔL*     ΔE');
for (const c of CUADROS) {
  console.log(
    `  ${c.paso.padEnd(18)} ${(c.trama + '/' + Math.round(c.actual * 100) + '%').padEnd(13)} ${c.campo.padEnd(10)} ${deltaL(P[c.trama], P[c.campo], c.actual).toFixed(1).padStart(4)}  ${delta(P[c.trama], P[c.campo], c.actual).toFixed(1).padStart(5)}`
  );
}

/* El objetivo sale de los dos cuadros que ya funcionan, no de un número
   inventado: naranja y verde leen como textura, así que su ΔE promedio ES la
   definición operativa de «textura» en esta paleta. */
const objetivo = (delta(P.ink, P.sunset, 0.15) + delta(P.cream, P.deep, 0.2)) / 2;
console.log(`\nObjetivo = ΔE promedio de los cuadros 02 y 03 → ${objetivo.toFixed(1)}\n`);

console.log('Opacidad que deja cada cuadro en el objetivo\n');
for (const c of CUADROS) {
  /* Barrido de 1 en 1 %: los modificadores de opacidad se escriben en
     centésimas, así que no hay resolución más fina que valga la pena buscar. */
  let mejor = 0.01;
  for (let a = 0.01; a <= 0.6; a += 0.01) {
    const d = (x) => Math.abs(delta(P[c.trama], P[c.campo], x) - objetivo);
    if (d(a) < d(mejor)) mejor = a;
  }
  const pct = Math.round(mejor * 100);
  const cambia = pct !== Math.round(c.actual * 100);
  console.log(
    `  ${c.paso.padEnd(18)} ${String(Math.round(c.actual * 100)).padStart(3)}% → ${String(pct).padStart(3)}%   ΔE ${delta(P[c.trama], P[c.campo], mejor).toFixed(1)}${cambia ? '   ← cambia' : ''}`
  );
}
console.log('');
