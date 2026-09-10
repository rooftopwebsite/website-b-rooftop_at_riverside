# Tokens de la casa — Rooftop at Riverside

Valores **medidos**, no aproximados. Son la ley del proyecto: la escala tipográfica y
de espaciado de Rooftop sale de acá, no de los defaults de Tailwind ni de una escala nueva.

**Prioridad de fuentes** (según el brief, cuando dos referencias difieren):

1. **Repos locales** — es código real de la casa
2. **Showdown Social** — https://showdown-social.vercel.app/
3. El resto

**Método**

| Fuente | Cómo se midió | Fecha |
|---|---|---|
| The Orient | Lectura de `src/app/globals.css` (2113 líneas, tokens documentados) | 2026-09-08 |
| Tre Vele | Lectura de `src/app/globals.css` + `components/shared/motion/config.ts` | 2026-09-08 |
| Zakia · Santa María · YAVA | Conteo de frecuencia de clases Tailwind sobre `components/` y `app/` | 2026-09-08 |
| Showdown Social | `getComputedStyle` vía Playwright, 1440×900 y 390×844 | 2026-09-08 |

> **Nota de stack.** Ninguno de los cinco repos tiene `tailwind.config.*`. Los cinco son
> **Tailwind v4**, con el tema en CSS (`@theme` en `globals.css`). Rooftop sigue lo mismo.
> El brief pide "extendé `tailwind.config.ts`": en v4 ese archivo no existe y el equivalente
> es el bloque `@theme` de `globals.css`. Ver §9.

---

## 1. Quién tiene sistema de tokens y quién no

Esto condiciona todo lo que sigue, así que va primero.

| Repo | Sistema de tokens | Qué aporta |
|---|---|---|
| **The Orient** | ✅ Completo y documentado en `@theme static` | **La escala. Es la fuente primaria.** |
| **Tre Vele** | ✅ Parcial (`@theme`: color, motion, radios) | **Motion, radios, estructura de página.** |
| Santa María | ❌ Sólo `--background`/`--foreground` de Next | Frecuencias de uso |
| YAVA | ❌ Ídem | Frecuencias de uso |
| Zakia | ❌ Ídem | Frecuencias de uso |

Santa María, YAVA y Zakia escriben valores arbitrarios inline (`text-[38px]`, `py-20`).
Sirven para **confirmar convergencia**, no para definir la escala.

---

## 2. Contenedor y gutter

### Ancho máximo de contenido — **1280px, unánime**

| Fuente | Valor | Evidencia |
|---|---|---|
| The Orient | `--container-site: 1280px` | token |
| Zakia | 1280px | `max-w-[1280px]` ×26 (el más usado) |
| Santa María | 1280px | `max-w-[1280px]` ×28 (el más usado) |
| YAVA | 1280px | `max-w-[1280px]` ×30 (el más usado) |
| Tre Vele | 1280px | `max-w-7xl` ×25 (= 80rem) |
| Showdown Social | 1280px | medido, `max-width: 1280px` |

**→ Rooftop: `--container-site: 1280px`.** Sin divergencias.

### Escalones intermedios (sólo The Orient los formaliza)

```
--container-mobile:  780px   /* hasta 768 */
--container-tablet:  880px   /* 768 – 1344 */
--container-site:   1280px   /* desde 1344 */
--container-wide:   1420px   /* excepción: galerías a sangre */
```

El salto a 1280 va en **1344px** (= 1280 + 32×2 de gutter), no en el breakpoint de layout.
The Orient documenta el porqué: a 1024px la caja declaraba 1280 pero la pantalla no llegaba,
así que el tope no actuaba y el contenido se estiraba.

### Gutter lateral

| Fuente | Mobile | Desktop |
|---|---|---|
| The Orient | **16px** (`--spacing-gutter`) | **32px** (`--spacing-gutter-lg`) |
| Zakia | 16px (`px-4` ×46) | 40px (`px-10` ×38) |
| Santa María | 24px (`px-6` ×42) | 32px (`px-8` ×32) |
| YAVA | 24px (`px-6` ×45) | 40px (`px-10` ×37) |
| Tre Vele | 20px (`px-5` ×47) | 32px (`px-8` ×34) |
| Showdown Social | **20px** (medido) | **56px** (medido) |

⚠️ **Divergencia.** Mobile va de 16 a 24; desktop de 32 a 56.
**→ Rooftop toma The Orient: 16px mobile / 32px desktop.** Es el único valor tokenizado
y es coherente con el 1344 del contenedor (1280 + 32×2). Showdown a 56px es el outlier.

---

## 3. Escala tipográfica

### Tamaños — The Orient (fuente primaria)

Un solo eje de display, `d1`–`d7`, más tres pasos de texto.

| Token | Tamaño | Line-height | Uso |
|---|---|---|---|
| `d1` | 72px | 0.94 | hero |
| `d2` | 58px | 0.96 | h1 desktop |
| `d3` | 46px | 1.00 | h1 tablet · h2 desktop |
| `d4` | 36px | 1.08 | h1 mobile · h2 tablet |
| `d5` | 28px | 1.18 | h2 mobile · h3 desktop |
| `d6` | 22px | 1.25 | h3 mobile · título de card |
| `d7` | 18px | 1.30 | rótulo de columna de footer |
| `intro` | 25px | 1.40 | bajada de sección desktop |
| `lead` | `clamp(16px, 16px + (100vw − 390px) × 0.005128, 18px)` | 1.60 | copy de sección |
| `base` | 16px | 1.65 | **el 92% del texto del sitio** |
| `cta` | 16px | 1.20 | botones |
| `caption` | 13px | 1.45 | kickers, etiquetas, pies |

⚠️ `lead` va en `:root`, **no** en `@theme`: Tailwind v4 evalúa `@theme` en tiempo de
compilación y un `clamp()` con `100vw` ahí compila mudo en 18px. Está medido y documentado
en The Orient. Es el tropiezo más caro de repetir.

### Mapa responsive de headings (The Orient, `heading.tsx`)

```
h1   text-d4 md:text-d3 lg:text-d2      36 → 46 → 58
h2   text-d5 md:text-d4 lg:text-d3      28 → 36 → 46
h3   text-d6            lg:text-d5      22 →      28
h4   text-[20px]        lg:text-d6      20 →      22
card                    text-d6/d5      22 →      28
```

### Showdown Social — medido

| Elemento | Desktop 1440 | Mobile 390 |
|---|---|---|
| h1 | 84px / 82.32 / −1.68 / 700 / UPPER | 38px / 37.24 / −0.76 |
| h2 | 72px / 72 / −1.44 / 700 / UPPER | 34px / 34 / −0.68 |
| h2 (secundario) | 54px / 52.92 / −0.54 | 31px / 32.55 / −0.31 |
| h3 | 51.84px / 50.80 / −0.52 | 30px / 29.4 / −0.30 |
| body | 15px / 24 / normal / 400 | 16px / 24.8 |
| small | 16px / 25.6 | — |
| botón | 13px / −  / **+1.82px** / 600 / UPPER | 13px / +1.82 |

Ratio desktop→mobile ≈ **0.45** en h1 (84→38). The Orient es más conservador: 58→36 ≈ **0.62**.

⚠️ **Divergencia grande.** Showdown escala mucho más agresivo y usa tracking **negativo**
en headings (−0.02em). The Orient no define tracking negativo.

**→ Rooftop toma The Orient** (repo local gana). Pero la marca de Rooftop usa **Steelfish**,
una condensada de caja alta: es una tipografía que aguanta cuerpos más grandes que la
Lusitana de The Orient. Sugerencia a validar en Fase 1: mantener los escalones de The Orient
y evaluar subir sólo el `d1` del hero.

### Tracking

| Fuente | Eyebrow / kicker |
|---|---|
| The Orient | **0.24em** (`--tracking-kicker`) |
| Tre Vele | 0.22em (×19), 0.24em (×9), 0.18em (×8) |
| Zakia | 0.20em (×13), 0.30em (×10) |
| Santa María | 0.25em (×8) |
| YAVA | 0.45em (×23), 0.15em (×10) |
| Showdown | +1.82px sobre 13px = **0.14em** |

**→ Rooftop: `--tracking-eyebrow: 0.24em`.** Convergen The Orient, Tre Vele y Santa María
en la franja 0.22–0.25. Es además lo que pedía el brief para Bronx ("caja alta con tracking
abierto"), y sigue valiendo con Jost, que la reemplazó.

### Tracking de display — REVISADO el 9 de septiembre de 2026

⚠️ Lo de arriba dice «Rooftop toma The Orient», y de ahí salió
`--tracking-display: -0.02em`. **Ese token se eliminó.** Camila rechazó el
resultado: «se ve muy pegada».

El razonamiento original estaba mal por un motivo concreto: The Orient usa
**Lusitana**, una serif de ancho normal, y Rooftop usa una **condensada de caja
alta**. Un tracking negativo sobre una condensada es exactamente lo que la
apelmaza. Y no era la única capa: `Heading` forzaba además `font-bold` en todos
los niveles, así que no había un solo título del sitio en Regular.

Encima el token sólo se aplicaba en **dos** lugares —el h1 del hero y unas mini
cards—, así que en el resto de los títulos el tracking era 0. El arreglo no era
cambiarle el signo: era hacerlo llegar a todos.

Lo reemplaza una **escala óptica** en los sub-tokens de la escala de tamaño,
que es el mismo mecanismo que ya usaba la interlínea:

| Escalón | Cuerpo | Tracking |
|---|---|---|
| `hero` | 72px+ | `0.02em` |
| `d1` | 72px | `0.02em` |
| `d2` | 58px | `0.03em` |
| `d3` | 46px | `0.035em` |
| `d4` | 36px | `0.04em` |
| `d5` | 28px | `0.045em` |
| `d6` | 22px | `0.05em` |
| `d7` | 18px | `0.05em` |

A menor cuerpo la condensada se cierra más y necesita **más** aire: por eso es
una escala y no un valor único.

⚠️ Los siete escalones llevan tracking, `d5`/`d6`/`d7` incluidos. El primer
intento los dejó afuera suponiendo que de ese cuerpo para abajo ya era la sans,
y es falso: los usan el h3, los precios con `tabular-nums` y los nombres del
menú, y todos son `font-display`. Medido en el navegador, el h3 quedaba en
`letter-spacing: normal`.

### Pesos

The Orient: 400 regular / 700 strong (100 thin, excepcional).

**Rooftop usa 400 en TODOS los títulos.** `Heading` iba en `font-bold` en todos
los niveles; pasó a `font-normal` por pedido de Camila —«en regular nunca en
peso alto»— y fue, junto con el tracking negativo, la causa de que la display se
viera apelmazada.

⚠️ Las familias cambiaron enteras el 9 de septiembre, y las tres por **licencia**
y no por diseño. Hoy son dos, las dos OFL de Google y las dos variables:
**Big Shoulders Display** en display y **Jost** en cuerpo (400) y eyebrows (500).
El detalle está en el encabezado de `globals.css` y en `public/fonts/_drop/LEEME.md`.

---

## 4. Ritmo vertical

### Bandas de sección — The Orient

```
--spacing-band-sm:   64px
--spacing-band:      96px
--spacing-band-lg:  128px
--spacing-band-xl:  160px
```

Aplicadas siempre como **par mobile/desktop** (`section.tsx`), nunca un valor único:

| Paso | Mobile | Desktop |
|---|---|---|
| `sm` | 48px | 64px |
| `md` | 64px | 96px |
| `lg` | 80px | 128px |
| `xl` | 96px | 160px |

Y **siempre simétrico** (mismo `pt` que `pb`). The Orient documenta que el original tenía
la mitad de las secciones con aire de un solo lado (144/0, 0/144, 194/64) y que eso fue
un bug a corregir, no un patrón.

### Convergencia en los otros repos

| Repo | Valores más usados |
|---|---|
| Zakia | `py-24` (96px) ×14, `py-28` (112) ×4, `py-20` (80) ×4 |
| Santa María | `py-16` (64) ×15, `py-20` (80) ×12, `py-[96px]` ×11 |
| YAVA | `py-20` (80) ×18, `py-28` (112) ×17, `py-24` (96) ×7 |
| Tre Vele | `py-14` (56) ×20, `py-28` (112) ×16, `py-24` (96) ×7 |
| **Showdown** | **120–128px desktop**, 70–120px mobile (medido) |

**→ Rooftop toma la escala de The Orient (64/96/128/160 con par mobile).** Es la única
tokenizada y cae dentro de la franja de todos. Showdown a 120/128 encaja en `lg`.

### Ritmo interno del encabezado de sección (The Orient)

| Token | Mobile | Desktop (≥922px) |
|---|---|---|
| `gap-kicker` | 8px | 12px |
| `gap-bajada` | 16px | 20px |
| `gap-parrafo` | 8px | 8px |
| `gap-cta` | 24px | 32px |

---

## 5. Header

| Fuente | Alto | Comportamiento |
|---|---|---|
| The Orient | **67px** compacto / **77px** desde 1344px | `fixed`, opaco siempre, sombra al scrollear (umbral 40px) |
| Showdown | **72px** desktop / **63px** mobile | `fixed`, `z-index: 200`, fondo transparente → sólido al salir del hero |
| Tre Vele | — | `fixed top-0 z-40` |
| Santa María / Zakia | — | `fixed top-0 z-50` |

**→ Rooftop: 67/77px (The Orient), `fixed`, `z-[99]`.**

### Arquitectura de nav — **el patrón de la casa, unánime**

Pocos destinos a la vista + desplegable **"More"**.

| | The Orient | Showdown |
|---|---|---|
| Items visibles | 5 (`HOME · MENU · ORDER ONLINE · PRIVATE EVENTS` + More) | 5 (`Home · Experience · Menu · Event Spaces · Happenings` + More) |
| Items en "More" | 5 (sólo label) | 8 (**label + subtítulo**) |
| CTAs | 1 + icono de Instagram | **2**: `Plan Event` (secundario) + `Book Now` (primario) |
| Mobile | drawer (hamburguesa) | drawer (hamburguesa) |
| Colapso de nav | `desk:` 1344px | — |

Detalles del comportamiento de "More" (The Orient, ya resueltos y vale copiarlos):
abre por hover **y** por click (sirve con mouse y con teclado) · `aria-expanded` +
`aria-haspopup` · cierra con `Escape` y con click afuera · el panel vive siempre en el DOM
y se oculta con `invisible` + `pointer-events-none` (sin `invisible` se podía tabular a
links que no se ven) · el filete de "página actual" **sólo** marca la ruta activa, el hover
únicamente cambia el color del texto.

**→ Rooftop: 5 visibles + "More" con label+subtítulo (Showdown), 2 CTAs.**
Con una diferencia obligada: **acá no hay reservas**. El CTA primario del patrón es
`Book Now`; en Rooftop ese lugar lo ocupa `Plan an Event`, y el secundario `What's On`.

---

## 6. Footer

| | The Orient | Showdown |
|---|---|---|
| Estructura | identidad (máx. 320px) + 3 columnas de nav | bloque "Last Call" + newsletter + contacto + links |
| Fondo | `ink` #1C1C1C | crema #FCFBF2 |
| Orden | filete → identidad+columnas → divisor → legal → barra de agencia | CTA de cierre → captura de email → contacto → columnas → agencia |
| Se repite | teléfono, dirección, horarios, redes | teléfono, email, redes |
| Barra de agencia | "Resto Experience" | "Resto Experience" |

Orden de links del footer de Showdown, medido:

```
Book Now · Plan an Event
Instagram · Google · Facebook
+1 (770) 676-7604 · contact@showdown.com
Blog · Corporate Events · Fundraisers · Event Kit · Event Spaces · Contact · Careers · Press · FAQ
Resto Experience
```

**→ Rooftop: Showdown** (su footer ya integra Last Call + newsletter, que es exactamente
lo que pide el brief para el home), con la barra de agencia de la casa.
Los dos sets de horarios (barra / trucks) van en el footer: es el dato que más se consulta.

---

## 7. Radios, sombras, bordes

| Fuente | Radios |
|---|---|
| The Orient | `pill: 30px` · `pill-lg: 150px` · `card: 10px` |
| Tre Vele | `pill: 999px` · `card: 22px` · `brand: 14px` |
| Santa María | `full` ×25 · `8px` ×19 · `16px` ×14 · `20px` ×11 |
| YAVA | `full` ×27 · **`none` ×18** |
| Zakia | `full` ×9 · `none` ×4 |
| Showdown | botones **0–2px** (casi recto) · cards 11px · 24px |

⚠️ **Divergencia real.** No hay consenso: va de 0px (Showdown, YAVA) a 22px (Tre Vele).

**→ Decisión para Rooftop: radios chicos, 0–4px en botones y ~10px en cards** (The Orient +
Showdown). Justificación: la marca es un rooftop con isotipo circular y patrón de azulejo;
el radio grande compite con el círculo del isotipo. **Marcado como decisión de Fase 1, a validar.**

Sombras — sólo The Orient las tokeniza:

```
--shadow-card:  0 2px 10px rgba(7,25,35,.16), 0 18px 44px -12px rgba(7,25,35,.34)
--shadow-photo: 0 3px 10px rgba(7,25,35,.09), 0 22px 48px -20px rgba(7,25,35,.24)
```

⚠️ Están tintadas en el navy de The Orient. Para Rooftop hay que retintarlas sobre
`deep` #014545. **No copiar el rgba tal cual.**

---

## 8. Motion

### Librerías por repo

| Repo | Stack |
|---|---|
| The Orient | `gsap` 3.15 · `lenis` 1.3.26 |
| Tre Vele | `motion` 12.23 · `gsap` 3.15 · `lenis` 1.3.25 · `embla-carousel` 8.6 |
| YAVA | `motion` 12.41 · `gsap` 3.15 · `locomotive-scroll` 5.0-beta |
| Zakia | `gsap` 3.15 · `lenis` 1.3.25 |
| Santa María | — (CSS puro) |

**→ Rooftop: `motion` + `gsap` + `lenis`** (el stack de Tre Vele, el más completo y el más nuevo).

### Parámetros — Tre Vele (`motion/config.ts`), la fuente más precisa

```ts
EASE_BRAND    = [0.16, 1, 0.3, 1]      // ease-out-expo
EASE_GSAP     = "expo.out"
EASE_HOVER    = "power2.out"
DURATION      = { fast: 0.18, base: 0.6, slow: 0.9, kenBurns: 1.8 }
REVEAL_OFFSET = 24        // px de translateY
STAGGER       = 0.08
viewport      = { once: true, amount: 0.3 }   // threshold de trigger
```

Segunda curva en la casa: `cubic-bezier(0.22, 1, 0.36, 1)` — The Orient (`--ease-salida`),
Zakia (`zk-enter`, 0.85s) y Tre Vele (`--ease-brand`). Las dos son ease-out-expo, casi idénticas.

Marquee: 30s (Zakia) · 28s (YAVA) · 40s por defecto (Tre Vele) · 30–45s (referencia Showdown).
**→ Rooftop: 35s**, y con `prefers-reduced-motion` apagado — los tres repos lo hacen.

Preloader (Tre Vele): fade 0.5s + puertas 1.1s con `cubic-bezier(0.37, 0, 0.63, 1)`,
corte de seguridad a 5s, contador de % con incremento asintótico cada 85ms.

> ⚠️ **El preloader de Tre Vele usa `sessionStorage`** para no repetirse por sesión.
> El brief de Rooftop **prohíbe toda API de storage del navegador**. Hay que reimplementarlo:
> el preloader corre en cada carga, o el "ya se mostró" vive en un módulo en memoria
> (se pierde al recargar, que es aceptable). **No copiar ese archivo tal cual.**

Todos los componentes de motion de la casa cortocircuitan con `useReducedMotion()`
devolviendo el tag plano, no una animación de duración 0. Es el patrón correcto y se copia.

---

## 9. Bloque `@theme` para Rooftop

Traducción directa de lo de arriba. Tailwind v4: esto va en `app/globals.css`.

```css
@theme static {
  /* Contenedor */
  --container-mobile:  780px;
  --container-tablet:  880px;
  --container-site:   1280px;
  --container-wide:   1420px;
  --breakpoint-desk:  1344px;

  /* Gutter */
  --spacing-gutter:     16px;
  --spacing-gutter-lg:  32px;

  /* Bandas */
  --spacing-band-sm:    64px;
  --spacing-band:       96px;
  --spacing-band-lg:   128px;
  --spacing-band-xl:   160px;

  /* Ritmo interno (desktop; mobile se pisa en :root) */
  --spacing-gap-kicker:  12px;
  --spacing-gap-bajada:  20px;
  --spacing-gap-parrafo:  8px;
  --spacing-gap-cta:     32px;

  /* Header */
  --spacing-header:     77px;
  --spacing-header-sm:  67px;

  /* Display */
  --text-d1: 72px;  --text-d1--line-height: 0.94;
  --text-d2: 58px;  --text-d2--line-height: 0.96;
  --text-d3: 46px;  --text-d3--line-height: 1;
  --text-d4: 36px;  --text-d4--line-height: 1.08;
  --text-d5: 28px;  --text-d5--line-height: 1.18;
  --text-d6: 22px;  --text-d6--line-height: 1.25;
  --text-d7: 18px;  --text-d7--line-height: 1.3;

  /* Texto */
  --text-intro:   25px;  --text-intro--line-height: 1.4;
  --text-lead:    18px;  --text-lead--line-height: 1.6;   /* :root lo hace fluido */
  --text-base:    16px;  --text-base--line-height: 1.65;
  --text-cta:     16px;  --text-cta--line-height: 1.2;
  --text-caption: 13px;  --text-caption--line-height: 1.45;

  --tracking-eyebrow: 0.24em;

  /* Motion */
  --ease-brand: cubic-bezier(0.16, 1, 0.3, 1);

  /* Radios — decisión de Fase 1, a validar */
  --radius-card: 10px;
  --radius-pill: 999px;
}

:root {
  --text-lead: clamp(16px, 16px + (100vw - 390px) * 0.005128, 18px);
  --spacing-gap-kicker:  8px;
  --spacing-gap-bajada: 16px;
  --spacing-gap-cta:    24px;
}
@media (min-width: 922px) {
  :root {
    --spacing-gap-kicker: 12px;
    --spacing-gap-bajada: 20px;
    --spacing-gap-cta:    32px;
  }
}
```

Los colores **no** están acá: los define la ley del color de la Fase 1 y van en `lib/brand.ts`.

---

## 10. Estructura del home de Showdown Social — medida, en orden

Con la función de cada sección y el mapeo a Rooftop que pide el brief.

| # | Showdown | Padding desktop | Función | → Rooftop |
|---|---|---|---|---|
| 1 | Hero "Good times are always social" + widget de reserva | 120/104 | captura la intención | Hero + **selector de intención de 3 vías** (no hay reservas) |
| 2 | **This week** | 120/120 | qué pasa ahora | **Tonight at the Yard** — el módulo diferencial |
| 3 | How it works — 3 pasos | — | desarma la confusión | **How this place works** — quién te cobra qué |
| 4 | The Showdown experience | — | ambientes | Los 3 verticales en 3 tarjetas |
| 5 | The Showdown Kitchen | 64/86 | comida | Food trucks (≠: acá el venue no cocina) |
| 6 | Banda promo "20% off" | — | oferta | Marquee de features |
| 7 | **Featured happenings** | 120/120 | grilla semanal | **This week** → `/whats-on` |
| 8 | Reviews en marquee | 126/126 | prueba social | ⛔ **No montar.** Ratings sin confirmar |
| 9 | **Find Us** — mapa + info | 128/128 | conversión física | Find us + los **dos** sets de horarios |
| 10 | Footer: Last Call + newsletter | — | cierre | Last call doble + newsletter de temporada |

El bloque **"Planning a work event?" con 3 acciones** (Request a Proposal / View Deck /
View Spaces) es el que el brief llama "el patrón de la casa" para *For event planners*.
Está en Showdown como sub-bloque; en Rooftop va como sección propia del home, porque
es la vertical prioritaria ($10k–$30k por ticket).

---

## 11. Resumen de divergencias

| Token | Divergencia | Resolución | Por qué |
|---|---|---|---|
| Contenedor | ninguna — 1280px en los 6 | 1280px | unánime |
| Gutter mobile | 16 (Orient/Zakia) ↔ 24 (SM/YAVA) | **16px** | repo local tokenizado |
| Gutter desktop | 32 (Orient/SM/TV) ↔ 40 (Zakia/YAVA) ↔ 56 (Showdown) | **32px** | coherente con el 1344 |
| Escala de h1 | 58px (Orient) ↔ 84px (Showdown) | **58px** | repo local; revisar `d1` por Steelfish |
| Tracking eyebrow | 0.14em (Showdown) ↔ 0.45em (YAVA) | **0.24em** | Orient + TV + SM convergen |
| Bandas | 64/96/128/160 ↔ 120/128 (Showdown) | **Orient** | única escala tokenizada |
| Header | 67/77 (Orient) ↔ 72/63 (Showdown) | **67/77** | repo local |
| Radios | 0px (Showdown/YAVA) ↔ 22px (Tre Vele) | **0–4 / 10px** | sin consenso → decisión de marca |
| Footer | Orient (3 col.) ↔ Showdown (Last Call + newsletter) | **Showdown** | es lo que pide el brief |
| Motion | dos ease-out-expo casi iguales | `[0.16,1,0.3,1]` | Tre Vele, el más nuevo |
| Preloader | Tre Vele usa `sessionStorage` | **reimplementar** | el brief prohíbe storage |
| Sombras | tintadas en navy (Orient) | **retintar en `deep`** | otra marca |

---

## 12. Deriva contra la casa — auditada en `redesign/light-tropical`

Las resoluciones de §11 se tomaron en Fase 1, antes de que existiera la rama de
rediseño. Esto es la comparación entre lo que ese cuadro decidió y **lo que la
rama efectivamente pinta**, leído de `globals.css` y de los componentes, no de
memoria.

| Token | §11 resolvió | La rama pinta | ¿Deriva? |
|---|---|---|---|
| Contenedor | 1280px | 1280px | — |
| Gutter mobile / desktop | 16 / 32px | `--spacing-gutter: 16px` · `-lg: 32px` | — |
| Bandas de sección | la escala de The Orient | la misma, tokenizada en `--spacing-band-*` | — |
| Sombras | retintar en `deep` | `rgba(1, 69, 69, …)` en `--shadow-card` y `--shadow-photo` | — |
| Motion ease | `[0.16, 1, 0.3, 1]` | `ease.out` en `lib/motion.ts`, ese valor | — |
| Preloader | reimplementar sin `sessionStorage` | reimplementado, sin storage | — |
| Radio de cards | ~10px | `--radius-card: 10px` | — |
| **Tracking eyebrow** | **0.24em** | **0.12em** | ✅ **sí, y a propósito** |
| **Radio de botones** | **0–4px** | **`rounded-pill`** | ✅ **sí, y a propósito** |

### Las dos derivas, con su razón

**Tracking eyebrow: 0.24em → 0.12em.** §11 lo resolvió en 0.24em porque The
Orient, Tre Vele y Santa María convergen ahí. El brief de esta rama pide 0.12em
de forma explícita, y `docs/prompt-claude-design.md` repite el mismo número. El
brief de la marca gana sobre la convergencia de la casa: 0.24em es un tracking
de versalita de sitio oscuro y editorial, y en un sitio claro con la condensada
en 88px la versalita muy abierta se lee como un sello de otra época. Medido en
el espécimen: a 12px, 0.24em son casi 3px de aire por letra y la etiqueta deja
de leerse como una palabra.

**Radio de botones: 0–4px → píldora.** §11 lo justificaba con que «el radio
grande compite con el círculo del isotipo», y quedó marcado como «decisión de
Fase 1, **a validar**». Se validó al revés: con el sitio en claro, un botón
casi recto sobre papel blanco se lee como un campo de formulario, no como un
control. La píldora es además lo que la marca ya usa en su propio material y lo
que el brief de la rama especifica para los CTA. El isotipo circular no compite:
está en el header, a 40px, y no comparte campo con ningún botón.

`--radius-btn: 10px` **sigue declarado y sin borrar**, con su comentario: los
nombres de radio dicen para qué es cada cosa aunque hoy compartan valor.

> ⚠️ Las dos derivas están en el CSS, no en un componente suelto, así que se
> revierten cambiando un token. Si alguna vez el sitio vuelve a la clave
> oscura, las dos hay que volver a discutirlas.
