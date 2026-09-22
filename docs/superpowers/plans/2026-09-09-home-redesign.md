# Rediseño de la home + tipografía + footer — plan de implementación

> ## ✅ EJECUTADO — 9 de septiembre de 2026
>
> **Las 14 tareas están hechas y comiteadas.** Los checkboxes de abajo quedaron
> sin marcar: el registro real de qué se hizo son los commits, que explican cada
> decisión con sus mediciones. Este documento se conserva como el razonamiento
> PREVIO, no como una lista de pendientes.
>
> | Fase | Commits |
> |---|---|
> | 1 · Tipografía | `dca3cbe` `31666db` |
> | 2 · PromoBar y sticky | `927d245` `56b173f` `c2f629e` |
> | 3 · Hero y muro | `5e69f8d` `3f58ece` |
> | 4 · Secciones | `512225a` `fbfb51d` `0ddcf44` `bc97b3b` |
> | 5 · Footer | `b4aa399` |
> | 6 · Documentación | `4dd01fb` |
>
> **Lo que salió en el camino y NO estaba en el plan**, porque apareció al
> medir:
>
> - `fd34cf7` — el preloader reescrito en CSS. Se colgaba: la cortina la pinta
>   el servidor y sólo el JS podía levantarla (medido: 12.4s en arranque frío).
> - `1cc40f6` `9ba10bd` — las **tres** familias del brand book reemplazadas por
>   licencia, no por diseño. El plan sólo anticipaba dos.
> - `927d245` — `Button` unía clases con `join(' ')`, así que un `hidden` por
>   props no pisaba al `inline-flex` de base. El header desbordaba en mobile
>   desde siempre, invisible porque era `fixed`.
> - `8eb5fb0` — la franja de horarios no era alcanzable con teclado (luego se
>   eliminó por pedido de Camila).
>
> **Dos desvíos del plan, decididos con Camila:**
>
> 1. §4.1 decía «recalcular el `top` del header». Al medirlo, el arreglo real
>    era pasar el bloque superior a `sticky` en flujo — con `fixed` el banner
>    era imposible.
> 2. La franja de estado («Closed now…») se eliminó entera. No estaba en el
>    plan.
>
> **Pendiente y fuera de alcance:** los 12 videos del muro y las páginas
> legales.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rehacer la home de Rooftop at Riverside con la forma de Superside (hero con muro de videos, cards de eventos, «Our difference», banner de eventos), corregir la tipografía de display, y reestructurar el footer con la estructura de la agencia.

**Architecture:** Next.js 16 App Router con React 19. Todo server component salvo lo que necesita saber la hora en `America/New_York` o mantener estado de UI. El acordeón de horarios usa `<details name>` nativo, sin JavaScript. El muro del hero reusa el patrón de `Marquee` con una variante que permite scroll manual bajo `prefers-reduced-motion`.

**Tech Stack:** Next 16.3.4 (Turbopack), React 19.2.8, Tailwind CSS v4, motion 13, Playwright + axe-core para los guards.

**Spec:** [`docs/superpowers/specs/2026-09-09-home-redesign-design.md`](../specs/2026-09-09-home-redesign-design.md)

## Global Constraints

- **No hay framework de tests unitarios.** El ciclo de verificación de cada tarea son los guards del proyecto: `npm run build`, `npm run check:css`, `npm run check:surfaces`, `npm run contrast`, `npm run a11y`, `npm run check:motion`. No inventar Jest ni Vitest.
- **`a11y` y `check:motion` corren contra el build de producción**, en el puerto **3114**: `npm run build && npx next start --port 3114` y en otra terminal el script. Dev inyecta el overlay de Next y ensucia el reporte.
- **Prohibido `localStorage`, `sessionStorage` y cualquier API de storage del navegador.** Es una restricción del brief y ya hay precedente: `Preloader.tsx` guarda su bandera en un módulo en memoria.
- **Ninguna animación pasa de 600ms.** Los loops continuos (marquee) no cuentan, pero deben apagarse con `prefers-reduced-motion`.
- **`prefers-reduced-motion` no puede cambiar el layout.** `check:motion` compara la caja de cada elemento con `id` o encabezado en los dos modos y falla si no coinciden.
- **Ritmo de superficies** (`check:surfaces`): máximo **dos** secciones `cream` por página, máximo **una** `deep`, y **nunca dos secciones de color seguidas**. Cuenta los `tone=` de los `<Section>`. Una card oscura *dentro* de una `Section tone="paper"` no cuenta — es el truco que ya usa `ForEventPlanners`.
- **Texto sobre `sunset` va en NEGRO** (8.26:1). Blanco da 2.54:1.
- **`sunset` y `river` nunca como color de texto sobre claro.** Sobre `paper` dan 2.48:1 y 2.43:1.
- **Acento de titular**: `terra` #a62000 sobre superficies claras, `sunset` #f58521 sobre `deep`.
- **No inventar datos.** Lo que falta se marca con `<PendingData>` o `<PhotoPending>` de `shared/PendingData.tsx`.
- **Comentarios y docs en español**, como el resto del repo. Los comentarios explican POR QUÉ, no QUÉ.
- **Trabajar directo en `main`.** Sin ramas nuevas.
- **Un commit por tarea**, al final de la tarea.

---

## File Structure

**Nuevos**

| Archivo | Responsabilidad |
|---|---|
| `src/components/shared/PromoBar.tsx` | Los cuatro hechos, fila fija arriba del header. Server component. |
| `src/components/shared/VideoWall.tsx` | Dos filas de tiles 3:4 en loop opuesto, con placeholder «video». |
| `src/components/shared/AgencyBar.tsx` | Barra «powered by Resto Experience». Portada de the-orient. |
| `src/components/sections/WhatsOn.tsx` | Fusión de `TonightAtTheYard` + `ThisWeek`, cards Superside. |
| `src/components/sections/ThreeDoors.tsx` | Las tres unidades en forma «Our difference». |
| `src/components/sections/EventsBanner.tsx` | Banner de eventos en forma «Our global team». |
| `src/components/sections/FindUs.tsx` | Mapa + acordeón `<details>` de los siete días. |

**Modificados**

| Archivo | Cambio |
|---|---|
| `src/app/globals.css` | Escala de tracking, token de acento, clase del muro, offsets del top. |
| `src/components/shared/Type.tsx` | `Heading` en Regular; `h4`/card salen de Steelfish; acento. |
| `src/components/shared/Header.tsx` | Header + StatusBar pasan de `fixed` a `sticky` en flujo. |
| `src/components/shared/PageHero.tsx` | Padding superior recalculado. |
| `src/components/sections/Hero.tsx` | Rediseño; pierde foto, `FACTS` e `INTENTS`. |
| `src/components/shared/Footer.tsx` | Estructura de la agencia; sin datos, sin newsletter, sin last call. |
| `src/components/sections/HomeSections.tsx` | Se van `FeaturesMarquee`, `ThreeVerticals`, `ForEventPlanners`, `ThisWeek`, `StoryTeaser`, `FindUs`. |
| `src/app/page.tsx` | Composición nueva. |
| `src/app/layout.tsx` | Monta `PromoBar`, desmonta `BrandTrail`. |
| `src/app/actions.ts` | Se va `subscribeToNewsletter`. |
| `src/app/events/page.tsx` | Recibe los tres pasos del proceso. |
| `src/lib/brand.ts` | Constante `AGENCY`. |
| `scripts/contrast.mjs` | Pares nuevos. |

**Borrados**

`src/components/shared/BrandTrail.tsx`, `src/components/shared/NewsletterForm.tsx`, `src/components/sections/TonightAtTheYard.tsx`.

---

# Fase 1 — Tipografía

Va primero porque toca las 23 rutas y cambia cómo se ve todo lo demás. Hacerla al final obligaría a revisar dos veces cada sección nueva.

### Task 1: Escala óptica de tracking y peso Regular

**Files:**
- Modify: `src/app/globals.css:284-295` (escala de display), `src/app/globals.css:365` (token viejo)
- Modify: `src/components/shared/Type.tsx:20-30`, `src/components/shared/Type.tsx:57`
- Modify: `src/components/sections/Hero.tsx:94`, `src/components/sections/Hero.tsx:149`

**Interfaces:**
- Consumes: nada.
- Produces: `Heading` sigue exportando la misma firma (`level`, `role`, `className`, `id`, `children`). Los escalones `text-hero`, `text-d1`…`text-d4` ganan `letter-spacing` propio. `ROLES.card` y `SIZES[4]` dejan de ser Steelfish.

- [ ] **Step 1: Agregar el letter-spacing a la escala de display**

En `src/app/globals.css`, dentro del mismo `@theme` donde ya viven `--text-d1` y `--text-d1--line-height`, agregar un sub-token de tracking por escalón. Es el mismo mecanismo que ya usa el line-height, así que cada utilidad se lleva su tracking a todos los breakpoints sin tocar componentes:

```css
  /* ── Tracking de display — escala ÓPTICA, no un valor único ──────────────
     Steelfish es una condensada de caja alta: a menor cuerpo se cierra más y
     necesita MÁS aire. Un solo número deja el d3 apretado o el d1 desarmado.

     ⚠️ Reemplaza a `--tracking-display: -0.02em`, que era NEGATIVO y venía
     heredado de The Orient — que usa Lusitana, una serif. Un tracking
     negativo sobre una condensada de caja alta es exactamente lo que la
     apelmaza. Ver docs/house-tokens.md.

     ⚠️ d5, d6 y d7 NO llevan tracking acá: de ese cuerpo para abajo los usa
     Futura y no Steelfish. Su tracking va explícito en la clase. */
  --text-hero--letter-spacing: 0.02em;
  --text-d1--letter-spacing: 0.02em;
  --text-d2--letter-spacing: 0.03em;
  --text-d3--letter-spacing: 0.035em;
  --text-d4--letter-spacing: 0.04em;
```

- [ ] **Step 2: Eliminar el token viejo y sus dos usos**

Borrar `--tracking-display: -0.02em;` de `globals.css:365`. Quitar la clase `tracking-display` de `Hero.tsx:94` y de `Hero.tsx:149` — ahora el tracking lo pone el escalón de tamaño.

Verificar que no quede ningún uso:

```bash
grep -rn "tracking-display" src/
```

Esperado: sin resultados.

- [ ] **Step 3: Heading en Regular, y Steelfish sólo en h1–h3**

En `src/components/shared/Type.tsx`, cambiar la línea 57 y los mapas de tamaño:

```tsx
const SIZES: Record<HeadingLevel, string> = {
  1: 'text-d4 md:text-d3 lg:text-d2',
  2: 'text-d5 md:text-d4 lg:text-d3',
  3: 'text-d6 lg:text-d5',
  /* ⚠️ h4 sale de Steelfish. Camila: «solo para títulos grandes, o sea h1, h2
     y h3». Va en Futura PT Medium en caja MIXTA: a este cuerpo la condensada
     de caja alta se lee como una etiqueta, no como un título. */
  4: 'font-body font-medium text-[20px] leading-[1.3] tracking-[0.01em] normal-case lg:text-[24px]',
};

const ROLES = {
  section: null,
  hero: 'text-hero',
  /* Mismo criterio que h4: los títulos de card van en Futura Medium. No en
     Bronx, que es caja alta con tracking abierto por definición —es la de los
     eyebrows— y en un título de dos líneas se vuelve ilegible. */
  card: 'font-body font-medium text-[20px] leading-[1.3] tracking-[0.01em] normal-case lg:text-[24px]',
  label: 'text-d7',
} as const;
```

Y en el `className` del `Tag`, cambiar el peso:

```tsx
        // ⚠️ Regular, NUNCA peso alto. Camila: «en regular nunca en peso
        // alto». Estaba en `font-bold` en TODOS los niveles, que junto con el
        // tracking negativo era la causa de que se viera apelmazada.
        //
        // `uppercase` y `font-display` los ponen los escalones que siguen
        // siendo Steelfish; h4 y card los apagan con `normal-case` y
        // `font-body`.
        'font-display font-normal uppercase',
```

- [ ] **Step 4: Build y guard de CSS**

```bash
npm run build && npm run check:css
```

Esperado: build OK y `check:css` sin fallos. Este guard existe por un fallo real donde Tailwind dejó de emitir todas las utilidades de tema sin un solo warning — si el `@theme` quedó mal escrito, salta acá.

- [ ] **Step 5: Verificar a ojo que el tracking llegó**

```bash
npx next start --port 3114
```

En otra terminal:

```bash
node -e "const{chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('http://localhost:3114/');await p.evaluate(()=>document.fonts.ready);for(const s of ['h1','h2']){const el=await p.$(s);if(!el)continue;const r=await el.evaluate(n=>{const c=getComputedStyle(n);return{tag:n.tagName,ls:c.letterSpacing,fw:c.fontWeight,ff:c.fontFamily.split(',')[0]}});console.log(r)}await b.close()})()"
```

Esperado: `letterSpacing` positivo (no `-1.xx px`), `fontWeight` `400`, `fontFamily` `Steelfish`.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css src/components/shared/Type.tsx src/components/sections/Hero.tsx
git commit -m "Tipografia de display: escala optica de tracking y peso Regular"
```

---

### Task 2: Acento de titular en color

**Files:**
- Modify: `src/components/shared/Type.tsx` (nuevo export `Accent`)
- Modify: `src/components/shared/Motion.tsx` (`MaskedLines`, prop de color de acento)
- Modify: `scripts/contrast.mjs` (pares nuevos)

**Interfaces:**
- Consumes: `Heading` de la Task 1.
- Produces:
  - `Accent({ on, children }: { on: 'light' | 'dark'; children: ReactNode }): JSX.Element` — exportado desde `shared/Type.tsx`. `on="light"` pinta `terra`, `on="dark"` pinta `sunset`.
  - `MaskedLines` acepta `accentOn?: 'light' | 'dark'` (default `'dark'`) además del `accentLast` que ya tiene.

- [ ] **Step 1: Agregar los pares nuevos al guard de contraste**

En `scripts/contrast.mjs`, dentro de `PAIRS`, agregar:

```js
 ['terra','paper','Acento de titular sobre claro','large'],
 ['terra','cream','Acento de titular sobre crema','large'],
 ['sunset','deep','Acento de titular sobre oscuro','large'],
```

- [ ] **Step 2: Correr el guard y ver que pasan**

```bash
npm run contrast
```

Esperado: los tres pares nuevos en verde. `terra`/`paper` da 7.23:1, `terra`/`cream` 6.47:1 y `sunset`/`deep` 4.26:1, todos sobre el mínimo de 3:1 del texto grande.

- [ ] **Step 3: Escribir el componente `Accent`**

En `src/components/shared/Type.tsx`:

```tsx
/**
 * El acento tipográfico dentro del titular.
 *
 * ⚠️ Va en COLOR y no en itálica. Camila: «usar cambio de color no itálica,
 * porque el brand no usa itálica». La referencia (wework, superside) lo hace
 * con una serif itálica de otra familia; acá no hay serif y la identidad
 * quedó cerrada, así que el contraste lo da el color.
 *
 * ⚠️ DOS colores, según la superficie, y no uno. `sunset` sobre claro da
 * 2.48:1 — no alcanza ni el 3:1 que pide el texto grande. Sobre `deep` sí
 * (4.26:1). Sobre claro va `terra`, que además es el color que ya usan los
 * eyebrows, así que no entra un color nuevo a la paleta.
 */
export function Accent({
  on,
  children,
}: {
  readonly on: 'light' | 'dark';
  readonly children: ReactNode;
}) {
  return <span className={on === 'dark' ? 'text-sunset' : 'text-terra'}>{children}</span>;
}
```

- [ ] **Step 4: Que `MaskedLines` acepte el acento por superficie**

En `src/components/shared/Motion.tsx`, en `MaskedLines`, agregar la prop y usarla donde hoy hardcodea el color del acento:

```tsx
  readonly accentOn?: 'light' | 'dark';
```

Con default `'dark'` (el hero, que es la única llamada actual) y aplicando `text-sunset` o `text-terra` según el valor. Buscar la clase de acento actual:

```bash
grep -n "accentLast" -A 12 src/components/shared/Motion.tsx
```

- [ ] **Step 5: Build**

```bash
npm run build && npm run check:css
```

Esperado: OK.

- [ ] **Step 6: Commit**

```bash
git add src/components/shared/Type.tsx src/components/shared/Motion.tsx scripts/contrast.mjs
git commit -m "Acento de titular en color: terra sobre claro, sunset sobre oscuro"
```

---

# Fase 2 — PromoBar y el top del sitio

### Task 3: PromoBar y el paso a sticky

⚠️ **Esta tarea refina la §4.1 de la spec.** La spec decía «recalcular el `top` del header». Al medir el código el arreglo resultó ser otro y hay que decirlo: el header es `fixed top-0` (`Header.tsx:98`) y la `StatusBar` es `fixed top-[64px]` (`Header.tsx:268`), con los heroes compensando con `padding-top`. Un banner **no sticky** arriba de un header **fixed** es imposible sin JS: el header lo taparía de entrada, y al scrollear quedaría un hueco.

La solución sin JS es que el bloque superior viva **en el flujo**: el PromoBar estático y el header + status en un `sticky top-0`. El promo se va con el scroll porque está en flujo, el header se queda pegado, y desaparecen los `padding-top` mágicos de los heroes. De paso el header `bg-deep` y el hero `bg-deep` quedan continuos, que es justo lo que hace Superside.

**Files:**
- Create: `src/components/shared/PromoBar.tsx`
- Modify: `src/components/shared/Header.tsx:98`, `src/components/shared/Header.tsx:268`
- Modify: `src/app/layout.tsx`
- Modify: `src/components/shared/PageHero.tsx:50`
- Modify: `src/components/sections/Hero.tsx:78`
- Modify: `src/app/globals.css:662`, `src/app/globals.css:667`

**Interfaces:**
- Consumes: nada.
- Produces: `PromoBar(): JSX.Element` (default export). El bloque superior deja de ser `fixed`, así que **ningún hero necesita compensar la altura del header**.

- [ ] **Step 1: Escribir el PromoBar**

`src/components/shared/PromoBar.tsx`:

```tsx
import { BRAND } from '@/lib/brand';

/**
 * Banner promocional: los cuatro hechos del lugar, arriba del header.
 *
 * Venían de la fila `FACTS` del hero. Camila los quiso arriba, «como hoy está
 * el Closed now pero arriba, como un banner promocional» — y como la
 * `StatusBar`, va en el layout, así que aparece en las 23 rutas.
 *
 * ⚠️ NO es sticky: está en el flujo y se va con el scroll. Es lo que decidió
 * Camila y es también la razón por la que el header pasó a `sticky` — ver la
 * nota de Header.tsx.
 *
 * ⚠️ Es una <ul> y no una fila de <span>: son cuatro hechos independientes y
 * un lector de pantalla tiene que poder contarlos. Las viñetas van
 * `aria-hidden`: la lista ya se anuncia como lista.
 */
const FACTS = [
  'Four food trucks',
  'Rooftop bar',
  'Live music five nights',
  'Walk in, no reservations',
] as const;

export default function PromoBar() {
  return (
    <div className="bg-deep px-gutter md:px-gutter-lg">
      <ul className="caja flex flex-wrap items-center justify-center gap-x-[10px] gap-y-[4px] py-[9px]">
        {FACTS.map((fact, i) => (
          <li key={fact} className="flex items-center gap-[10px]">
            {i > 0 ? (
              <span aria-hidden="true" className="h-[3px] w-[3px] rounded-pill bg-sunset" />
            ) : null}
            {/* `paper` sobre `deep` da 15.4:1. */}
            <span className="eyebrow text-paper/80">{fact}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 2: Pasar el header y la status bar a sticky**

En `src/components/shared/Header.tsx`, línea 98, cambiar `fixed inset-x-0 top-0 z-[99]` por `sticky top-0 z-[99]` y agregar el comentario del por qué:

```tsx
      {/* ⚠️ `sticky` y no `fixed`. Era `fixed top-0`, y con el PromoBar nuevo
          arriba eso no funciona: un banner que se va con el scroll debajo de
          un header fijo queda tapado de entrada y deja un hueco después.
          En flujo + sticky el promo se va solo y el header se pega, sin JS.

          Consecuencia: el header YA OCUPA espacio, así que los heroes no
          compensan más su altura con padding-top. */}
      <div className="sticky top-0 z-[99] bg-deep">
```

⚠️ El `GUTTER` que estaba en ese div va al hijo, no al sticky, para que el fondo siga siendo a todo el ancho.

En la línea 268, la `StatusBar` deja de ser `fixed top-[64px]` y pasa a ser hermana en el mismo bloque sticky: `z-[98] bg-deeper` sin posicionamiento.

⚠️ Las dos —header y status— tienen que quedar **dentro del mismo contenedor sticky**, no ser dos sticky separados: si no, al scrollear se superponen.

- [ ] **Step 3: Montar el PromoBar en el layout**

En `src/app/layout.tsx`, importar y montar `PromoBar` **arriba** de `<Header />`, y **desmontar `BrandTrail`** (se elimina en la Task 11; acá sólo se saca del árbol):

```tsx
        <SmoothScroll />
        <Preloader />
        <PageTransition />
        <PromoBar />
        <Header />
```

- [ ] **Step 4: Recalcular los paddings de los heroes**

El bloque superior mide `64 + 34 = 98px` en mobile y `76 + 34 = 110px` desde `desk`. Como ahora ocupa flujo, hay que **restarlo** de los paddings:

- `Hero.tsx:78`: `pt-[150px]` → `pt-[52px]`, `lg:pt-[176px]` → `lg:pt-[66px]`
- `PageHero.tsx:50`: `pt-[132px]` → `pt-[34px]`, `lg:pt-[156px]` → `lg:pt-[46px]`

Y el `scroll-margin-top` de `globals.css:662` y `:667` pasa a la altura del bloque pegado más 16px de aire:

```css
  scroll-margin-top: 114px;      /* 64 header + 34 status + 16 aire */
```
```css
    scroll-margin-top: 126px;    /* 76 header + 34 status + 16 aire */
```

- [ ] **Step 5: Build y verificar las 23 rutas a ojo**

```bash
npm run build && npx next start --port 3114
```

En otra terminal, comprobar que en ninguna ruta el header tapa el primer encabezado:

```bash
node -e "const{chromium}=require('playwright');const R=['/','/visit','/events','/events/inquire','/events/spaces','/food-trucks','/whats-on','/market','/our-story','/faq','/contact','/join-us','/the-experience','/sunset-bar','/the-yard','/nfc-north-hq','/events/corporate','/events/celebrations','/events/fundraisers','/events/game-truck','/events/holiday-parties'];(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});for(const r of R){await p.goto('http://localhost:3114'+r);const bad=await p.evaluate(()=>{const h=document.querySelector('h1');if(!h)return 'sin h1';const t=h.getBoundingClientRect().top;return t<110?('h1 tapado, top='+Math.round(t)):null});if(bad)console.log(r,'->',bad)}console.log('listo');await b.close()})()"
```

Esperado: sólo `listo`. Cualquier ruta que imprima algo tiene el h1 debajo del bloque pegado.

- [ ] **Step 6: Guard de motion**

```bash
npm run check:motion
```

Esperado: OK. El paso de `fixed` a `sticky` cambia el layout de todo el sitio, así que este guard es el que detecta si alguna caja se movió sólo en uno de los dos modos.

- [ ] **Step 7: Commit**

```bash
git add src/components/shared/PromoBar.tsx src/components/shared/Header.tsx src/app/layout.tsx src/components/shared/PageHero.tsx src/components/sections/Hero.tsx src/app/globals.css
git commit -m "PromoBar arriba del header y bloque superior en flujo sticky"
```

---

# Fase 3 — Hero y muro de videos

### Task 4: VideoWall

**Files:**
- Create: `src/components/shared/VideoWall.tsx`
- Modify: `src/app/globals.css` (clase `rt-wall`)

**Interfaces:**
- Consumes: nada.
- Produces: `VideoWall(): JSX.Element` (default export). Sin props: los slots son internos hasta que lleguen los clips.

- [ ] **Step 1: La clase CSS del muro**

En `src/app/globals.css`, junto a `.rt-marquee`:

```css
/**
 * El muro del hero. Mismo loop que `.rt-marquee` pero con una diferencia que
 * importa: bajo `prefers-reduced-motion` la fila no queda congelada y
 * recortada —con los tiles de la derecha inalcanzables— sino que se vuelve
 * scrolleable a mano.
 *
 * ⚠️ El cambio es de `overflow`, no de tamaño ni de posición: las cajas de los
 * tiles miden lo mismo en los dos modos, que es lo que exige check:motion.
 */
.rt-wall {
  overflow: hidden;
}

.rt-wall > .rt-wall-track {
  display: flex;
  width: max-content;
  animation: rt-marquee var(--wall-duration, 60s) linear infinite;
  will-change: transform;
}

.rt-wall-reverse > .rt-wall-track {
  animation-direction: reverse;
}

@media (prefers-reduced-motion: reduce) {
  .rt-wall {
    overflow-x: auto;
  }
  .rt-wall > .rt-wall-track {
    animation: none;
  }
}
```

- [ ] **Step 2: Escribir el componente**

`src/components/shared/VideoWall.tsx`:

```tsx
/**
 * El muro del hero: dos filas de piezas cortas del lugar, en loop opuesto.
 *
 * Es la forma del hero de Superside, que Camila fijó como referencia: titular,
 * bajada corta, un CTA, y debajo dos filas de tiles que corren.
 *
 * ⚠️ TODAVÍA NO HAY VIDEOS. En `public/` no hay ni un `.mp4`. Cada slot es un
 * recuadro gris rotulado «video» —decisión de Camila: «poné los recuadros en
 * gris que digan video»— y el componente ya está cableado para el `<video>`:
 * cuando lleguen los clips se cambia `SLOTS` por sus rutas y no se toca nada
 * más.
 *
 * ⚠️ SON 12, seis por fila, y es un mínimo medido, no un número redondo: con
 * menos de seis por fila el loop repite el mismo tile en pantalla al mismo
 * tiempo. Lo ideal son 16.
 *
 * Especificación de los clips: 3:4 vertical, 4–8 s, sin audio, ~1–2 MB,
 * .mp4 H.264.
 */
const PER_ROW = 6;

/** Un tile. `src === null` mientras el clip no exista. */
function Tile({ src }: { readonly src: string | null }) {
  return (
    <div className="mr-[12px] aspect-[3/4] w-[150px] shrink-0 overflow-hidden rounded-card bg-body/25 lg:w-[190px]">
      {src === null ? (
        <div className="grid h-full place-items-center">
          {/* `paper/70` sobre `body/25` compuesto sobre `deep` — verificado con
              axe en el guard de a11y, que mide el píxel renderizado y no el
              par de paleta. */}
          <span className="eyebrow text-paper/70">video</span>
        </div>
      ) : (
        <video
          src={src}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}

function Row({ reverse }: { readonly reverse: boolean }) {
  const tiles = Array.from({ length: PER_ROW }, (_, i) => <Tile key={i} src={null} />);
  return (
    <div
      className={['rt-wall', reverse ? 'rt-wall-reverse' : ''].filter(Boolean).join(' ')}
      // La fila es scrolleable con reduced-motion, así que necesita ser
      // alcanzable por teclado y anunciarse. Sin esto es una trampa de foco
      // al revés: contenido que existe y no se puede llegar.
      tabIndex={0}
      role="group"
      aria-label={reverse ? 'Second row of clips from the venue' : 'Clips from the venue'}
    >
      <div className="rt-wall-track">
        {tiles}
        {/* La segunda copia es la que hace el loop continuo. `aria-hidden`
            porque es exactamente el mismo contenido. */}
        <div className="flex shrink-0" aria-hidden="true">
          {tiles}
        </div>
      </div>
    </div>
  );
}

export default function VideoWall() {
  return (
    <div className="flex flex-col gap-[12px]">
      <Row reverse={false} />
      <Row reverse />
    </div>
  );
}
```

- [ ] **Step 3: Build**

```bash
npm run build && npm run check:css
```

Esperado: OK.

- [ ] **Step 4: Commit**

```bash
git add src/components/shared/VideoWall.tsx src/app/globals.css
git commit -m "VideoWall: dos filas de tiles con placeholder de video"
```

---

### Task 5: Hero rediseñado

**Files:**
- Modify: `src/components/sections/Hero.tsx` (reescritura)

**Interfaces:**
- Consumes: `VideoWall` (Task 4), `Accent`/`MaskedLines` (Task 2).
- Produces: `Hero(): JSX.Element` (default export). **Ya no exporta ni monta `INTENTS`** — las tres puertas pasan a `ThreeDoors` (Task 7).

- [ ] **Step 1: Reescribir el hero**

Reemplazar todo `src/components/sections/Hero.tsx`. Los puntos que no se pueden perder:

- **Se va la foto de fondo y el velo.** Queda `bg-deep` plano. Con el muro debajo, foto y videos compiten; Superside apoya los tiles sobre fondo plano justamente por eso. Y el header `bg-deep` ahora es continuo con el hero.
- **Se va la fila `FACTS`** (está en el PromoBar) y **la sección `INTENTS`** (va a `ThreeDoors`).
- **Titular** con `MaskedLines lines={['Bonita comes', 'together']} accentLast accentOn="dark"`.
- **Bajada de una línea**: `Rooftop bar. Four kitchens. Walk in.`
- **Un CTA**: `What's on tonight` a `/whats-on`. «Plan an event» ya está en el header.
- El isotipo `/brand/isotype-truck.svg` se queda arriba del titular.
- `VideoWall` va después del CTA, a sangre — o sea **fuera** del `caja`/`max-w`, pero dentro de la sección.

```tsx
export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="bg-deep pb-[56px] lg:pb-[68px]">
      <div className={`${GUTTER} pt-[52px] lg:pt-[66px]`}>
        <div className="mx-auto flex max-w-[900px] flex-col items-center text-center">
          {/* isotipo, Heading role="hero", bajada, un ButtonLink */}
        </div>
      </div>

      {/* El muro va a sangre: sin gutter ni caja. */}
      <div className="mt-[44px] lg:mt-[56px]">
        <VideoWall />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Build**

```bash
npm run build
```

Esperado: OK. Si falla por `INTENTS` sin usar, borrar la constante.

- [ ] **Step 3: Guard de superficies**

```bash
npm run check:surfaces
```

Esperado: OK. El hero no es un `<Section>` con `tone`, así que no cuenta contra el máximo de una `deep` por página — pero conviene confirmarlo antes de agregar más secciones oscuras.

- [ ] **Step 4: Ver el hero**

```bash
npx next start --port 3114
```

```bash
node -e "const{chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:1000}});await p.goto('http://localhost:3114/');await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:'hero-check.png'});await b.close()})()"
```

Mirar `hero-check.png`: fondo oscuro continuo desde el header, titular en dos líneas con `together` en naranja, un solo botón, y las dos filas de recuadros grises rotulados «video». **Borrar el PNG antes de commitear.**

- [ ] **Step 5: Commit**

```bash
rm -f hero-check.png
git add src/components/sections/Hero.tsx
git commit -m "Hero: frase corta, un CTA y muro de videos"
```

---

# Fase 4 — Las secciones de la home

### Task 6: WhatsOn — fusión de Tonight y This week

**Files:**
- Create: `src/components/sections/WhatsOn.tsx`
- Delete: `src/components/sections/TonightAtTheYard.tsx`

**Interfaces:**
- Consumes: `EVENTS`, `type VenueEvent`, `type Weekday`, `timeRange` de `@/content/events`; `activeTrucks` de `@/content/trucks`; `recurringEvents`, `whenLabel` de `@/content/events`.
- Produces: `WhatsOn(): JSX.Element` (default export).

- [ ] **Step 1: Escribir la sección**

Una sola sección con las cards de Superside. Lo que hay que conservar del componente que reemplaza:

- **Client component.** Necesita el día en `America/New_York`. Reusar tal cual la función `venueWeekday()` y el patrón `const [today, setToday] = useState<Weekday | null>(null)` + `useEffect` de `TonightAtTheYard.tsx`: el servidor pinta un estado útil y el día real aparece al montar. Sin esto hay mismatch de hidratación y, peor, se publica un dato que puede estar mal.
- **`CLOSED_DAYS = [1, 2]`** (lunes y martes) se mantiene.
- **El fallback de trucks se mantiene textualmente**: la rotación diaria **no existe** como dato. La card de hoy no puede decir «hoy están estos cuatro». Muestra el roster y dice la verdad.
- **Card Superside**: foto arriba, bloque de color abajo con el tag y el título.
  - Card 1: `bg-sunset` con texto `ink` (8.26:1). **Nunca `paper` sobre `sunset`.**
  - Card 2: `bg-deep` con texto `paper`.
  - Card 3: `bg-chalk` con texto `ink`.
- **La primera card es la de hoy**, con el tag `Tonight`. El resto lleva su tag de día (`whenLabel(e)`).
- Hover: `scale(1.03)` sobre la imagen y nada más, 250ms. Es lo que le gustó de las cards de Superside.
- Sin foto real para un evento, `<PhotoPending>`.
- `Section tone="cream"` y un `ArrowLink` a `/whats-on`.

La card, que es el patrón que Camila señaló explícitamente:

```tsx
/* Los tres colores de bloque, en orden. El texto de cada uno NO es
   intercambiable: sobre `sunset` va `ink` (8.26:1) y blanco daría 2.54:1. */
const BLOCKS = [
  { surface: 'bg-sunset', text: 'text-ink', sub: 'text-ink/80' },
  { surface: 'bg-deep', text: 'text-paper', sub: 'text-paper/80' },
  { surface: 'bg-chalk', text: 'text-ink', sub: 'text-body/75' },
] as const;

function EventCard({
  href, photo, alt, tag, title, meta, block,
}: {
  readonly href: string;
  readonly photo: string | null;
  readonly alt: string;
  readonly tag: string;
  readonly title: string;
  readonly meta: string;
  readonly block: (typeof BLOCKS)[number];
}) {
  return (
    <Link href={href} className="group flex h-full flex-col overflow-hidden rounded-card">
      {/* La foto arriba. `overflow-hidden` acá y el zoom en la imagen: si el
          zoom va en la card entera, el bloque de color también escala. */}
      <div className="relative aspect-[4/3] overflow-hidden bg-body/10">
        {photo === null ? (
          <PhotoPending />
        ) : (
          <Image
            src={photo}
            alt={alt}
            fill
            sizes="(max-width: 639px) 100vw, 33vw"
            className="object-cover transition-transform duration-250 group-hover:scale-[1.03]"
          />
        )}
      </div>

      {/* El bloque de color abajo, con el tag y el título. */}
      <div className={`flex flex-1 flex-col ${block.surface} p-[22px]`}>
        <span
          className={`w-fit rounded-pill border border-current/30 px-[10px] py-[3px] eyebrow ${block.sub}`}
        >
          {tag}
        </span>
        <Heading level={3} role="card" className={`mt-[12px] ${block.text}`}>
          {title}
        </Heading>
        <span className={`mt-auto pt-[14px] eyebrow ${block.sub}`}>{meta}</span>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Sacar `ThisWeek` de `HomeSections.tsx`**

Borrar la función `ThisWeek` y, si quedan sin uso, sus imports (`recurringEvents`, `whenLabel`, `HAPPY_HOUR`). La línea de happy hour que estaba al pie de `ThisWeek` se mueve a `WhatsOn`.

- [ ] **Step 3: Borrar el componente viejo**

```bash
git rm src/components/sections/TonightAtTheYard.tsx
```

- [ ] **Step 4: Build**

```bash
npm run build && npm run check:surfaces
```

Esperado: OK, y el conteo de superficies de la home debe seguir dentro de dos `cream` y una `deep`.

- [ ] **Step 5: Commit**

```bash
git add -A src/components/sections src/app/page.tsx
git commit -m "WhatsOn: una sola seccion de eventos con hoy destacado"
```

---

### Task 7: ThreeDoors — forma «Our difference»

**Files:**
- Create: `src/components/sections/ThreeDoors.tsx`
- Modify: `src/components/sections/HomeSections.tsx` (borrar `ThreeVerticals`)

**Interfaces:**
- Consumes: `Accent` (Task 2), `Section`, `Eyebrow`, `Heading`, `ArrowLink`.
- Produces: `ThreeDoors(): JSX.Element` (default export).

- [ ] **Step 1: Escribir la sección**

Forma medida en la referencia «Our difference» de Superside: eyebrow centrado, titular grande con acento, y una fila de columnas con ícono chico + micro-etiqueta en versalitas + título + cuerpo, **separadas por filetes de 1px y no por tarjetas pesadas**. Es el gesto que `docs/design-references.md` tenía pendiente de aplicar de wework/superside.

Las tres puertas, con el contenido que ya existía en `INTENTS` y `ThreeVerticals`:

```tsx
/* ⚠️ El cuerpo de cada puerta dice un hecho verificado y no una promesa. El
   de «Eat» en particular es la corrección más importante del sitio: la comida
   no es nuestra, la sirven los trucks. Es la confusión que más caro sale. */
const DOORS = [
  {
    href: '/food-trucks',
    kicker: 'Eat',
    title: 'Four kitchens in the yard',
    body: 'Four independent kitchens under the rooftop. You order at the truck — the bar upstairs is ours.',
  },
  {
    href: '/whats-on',
    kicker: 'See',
    title: 'Music, bingo, DJ sets',
    body: 'Live music five nights a week, and a standing lineup you can plan around. Walk in, no reservations.',
  },
  {
    href: '/events',
    kicker: 'Rent',
    title: 'Buyouts and private nights',
    body: 'The rooftop, the yard, the patio — or the whole place with the gates closed, and one person coordinating it.',
  },
] as const;
```

- Titular con `<Accent on="light">` — la sección va sobre claro, así que el acento es `terra`.
- Los tres íconos se dibujan **SVG inline**, en el lenguaje de la marca: no hay íconos de bar, música ni eventos en `public/`. Trazo de 1.6, `currentColor`, `aria-hidden`.
- `Section tone="paper"`.

- [ ] **Step 2: Borrar `ThreeVerticals`**

Borrar la función completa de `HomeSections.tsx` y los imports que queden sin uso.

- [ ] **Step 3: Build**

```bash
npm run build && npm run check:surfaces
```

- [ ] **Step 4: Commit**

```bash
git add -A src/components/sections
git commit -m "ThreeDoors: las tres unidades en una sola seccion"
```

---

### Task 8: EventsBanner y la mudanza del proceso a /events

**Files:**
- Create: `src/components/sections/EventsBanner.tsx`
- Modify: `src/components/sections/HomeSections.tsx` (borrar `ForEventPlanners`)
- Modify: `src/app/events/page.tsx` (recibe los tres pasos)

**Interfaces:**
- Consumes: `Accent` (Task 2).
- Produces: `EventsBanner(): JSX.Element` (default export).

- [ ] **Step 1: Escribir el banner**

Forma medida en `superside.com/our-creative-talent` («OUR GLOBAL TEAM»): card oscura con la imagen arriba —inset, con radio—, y debajo eyebrow, titular con acento, bajada y tres barras de una línea con lo más importante.

⚠️ **La card va `deep` DENTRO de una `Section tone="paper"`**, no como `Section tone="deep"`. `check:surfaces` permite una sola sección `deep` por página y hay que dejarla libre; es el mismo truco que usaba `ForEventPlanners` con su card `sunset`.

- Imagen: `/images/events/event-a.webp`.
- Titular con `<Accent on="dark">` (`sunset`, 4.26:1 sobre `deep`).
- Los tres items son los ya confirmados: coordinamos los trucks, la barra es nuestra, el espacio es tuyo. Cada uno en una barra `bg-deeper` de una línea.
- Un CTA a `/events`.

- [ ] **Step 2: Mudar los tres pasos del proceso a /events**

`PLANNER_STEPS` (request a proposal → get the packet → see the spaces) es contenido que hoy **sólo existe en la home**. Moverlo a `src/app/events/page.tsx` como bloque de proceso, con la misma forma de lista numerada que ya tiene la página para `WHAT_WE_DO`. No duplicar: `WHAT_WE_DO` es «qué hacemos», esto es «cómo empieza».

- [ ] **Step 3: Borrar `ForEventPlanners`**

Borrar la función y `PLANNER_STEPS` de `HomeSections.tsx`.

- [ ] **Step 4: Build y guards**

```bash
npm run build && npm run check:surfaces && npm run contrast
```

- [ ] **Step 5: Commit**

```bash
git add -A src/components/sections src/app/events/page.tsx
git commit -m "EventsBanner en la home y el proceso de eventos a /events"
```

---

### Task 9: FindUs con acordeón nativo

**Files:**
- Create: `src/components/sections/FindUs.tsx`
- Modify: `src/components/sections/HomeSections.tsx` (borrar la `FindUs` vieja)

**Interfaces:**
- Consumes: `HOURS`, `BRAND`, `addressLine`, `mapsUrl` de `@/lib/brand`.
- Produces: `FindUs(): JSX.Element` (default export).

- [ ] **Step 1: Escribir la sección**

Estructura de `yava/app/components/LocationSection.tsx`: mapa a un lado, panel de datos al otro, el día de hoy destacado. Lo que se **agrega** sobre yava es el acordeón — yava lista los siete días planos.

```tsx
{HOURS.map((row) => (
  <details key={row.day} name="hours" className="...">
    <summary className="...">
      <span>{row.day}</span>
      {/* el resumen de una línea, para no obligar a abrir */}
    </summary>
    <dl>
      <dt>Bar</dt><dd>{row.bar}</dd>
      <dt>Trucks</dt><dd>{row.trucks}</dd>
    </dl>
  </details>
))}
```

⚠️ **El `name` compartido es lo que hace el acordeón exclusivo —abrir uno cierra el otro— sin una línea de JavaScript**, y trae gratis el foco, el teclado y el anuncio del estado. Donde el navegador no soporte `name` en `<details>` degrada a siete desplegables independientes: se pueden abrir varios a la vez y nada más. Es una degradación aceptable, no una rotura.

⚠️ Los siete días se renderizan en el **servidor**. Lo único que aporta el JS es cuál arranca abierto: un client component chico marca `open` en el día de hoy al montar, porque el día depende de `America/New_York` y el servidor no lo puede saber sin arriesgar una página cacheada con el día equivocado.

Se conservan de la versión vieja: dirección como link a Maps, teléfono, parking con su `ArrowLink` a `/visit#parking`, y el `<iframe>` del mapa con `loading="lazy"` y su `title` (un iframe sin título es un fallo de WCAG 4.1.2).

- [ ] **Step 2: Borrar la `FindUs` vieja de `HomeSections.tsx`**

- [ ] **Step 3: Build y a11y**

```bash
npm run build && npx next start --port 3114
```

En otra terminal:

```bash
npm run a11y
```

Esperado: cero violaciones. El acordeón es el elemento nuevo más expuesto a fallos de accesibilidad.

- [ ] **Step 4: Verificar que se lee sin JS**

```bash
node -e "const{chromium}=require('playwright');(async()=>{const b=await chromium.launch();const c=await b.newContext({javaScriptEnabled:false});const p=await c.newPage();await p.goto('http://localhost:3114/');const n=await p.locator('details[name=hours]').count();const txt=await p.locator('details[name=hours]').first().innerText();console.log('details:',n,'| primer bloque incluye horario:',/AM|PM|Closed/.test(txt));await b.close()})()"
```

Esperado: `details: 7` y `true`. Con JS apagado los siete días existen y su contenido es alcanzable.

- [ ] **Step 5: Commit**

```bash
git add -A src/components/sections
git commit -m "FindUs: mapa y acordeon nativo de los siete dias"
```

---

### Task 10: HowThisPlaceWorks más sutil

**Files:**
- Modify: `src/components/sections/HomeSections.tsx` (`HowThisPlaceWorks`)
- Modify: `src/components/shared/PinnedList.tsx`

**Interfaces:**
- Consumes: `PinnedList`, `type PinnedItem`.
- Produces: sin cambios de firma.

- [ ] **Step 1: Afinar el acabado**

Camila: «me gusta, pero rediseñemos un poco para hacerlo más sutil, más actual y de identidad sofisticado». **Se mantiene el mecanismo de `PinnedList`**; cambia sólo el acabado:

- Filetes de 1px en vez de 2px.
- Etiquetas de paso más chicas, en Bronx versalita, **sin relleno de color**.
- Título activo en Steelfish **Regular** con el tracking nuevo (ya viene de la Task 1), sin peso alto.
- Riel de progreso de 1px.
- Más aire entre paso y paso.

No tocar el recorrido de scroll (55vh por ítem) ni el `cubic-bezier`: son decisiones ya validadas y documentadas.

- [ ] **Step 2: Build y guard de motion**

```bash
npm run build && npm run check:motion
```

Esperado: OK. `PinnedList` hace trabajo de layout con el scroll, así que este guard es el que importa acá.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/HomeSections.tsx src/components/shared/PinnedList.tsx
git commit -m "How this place works: acabado mas sutil"
```

---

### Task 11: Eliminaciones y composición de la home

**Files:**
- Delete: `src/components/shared/BrandTrail.tsx`
- Modify: `src/components/sections/HomeSections.tsx` (borrar `StoryTeaser` y `FeaturesMarquee`)
- Modify: `src/app/page.tsx` (reescritura de la composición)

**Interfaces:**
- Consumes: todos los componentes de las Tasks 5–10.
- Produces: `HomePage(): JSX.Element`.

- [ ] **Step 1: Borrar `BrandTrail`**

```bash
git rm src/components/shared/BrandTrail.tsx
grep -rn "BrandTrail" src/
```

Esperado: sin resultados (el desmontaje del layout se hizo en la Task 3).

- [ ] **Step 2: Borrar `StoryTeaser` y `FeaturesMarquee`**

`StoryTeaser` sale porque «Nuestra historia» vive en `/our-story`. `FeaturesMarquee` sale porque dice lo mismo que el PromoBar nuevo en la misma pantalla — aprobado por Camila.

Borrar también `FEATURES` y los imports que queden sin uso (`Marquee` puede quedar usado por `ReviewsMarquee`; **no borrar `ReviewsMarquee`**, que está escrito y sin usar a propósito).

- [ ] **Step 3: Reescribir la composición**

`src/app/page.tsx`, con el comentario de orden actualizado:

```tsx
export default function HomePage() {
  return (
    <>
      <Hero />
      <WhatsOn />
      <HowThisPlaceWorks />
      <ThreeDoors />
      <EventsBanner />
      <FindUs />
    </>
  );
}
```

⚠️ Revisar los `<Scallop>`: el festón va **sólo donde la superficie cambia de verdad**, y con el orden nuevo los cortes son otros. Puesto en cada corte deja de ser un gesto de marca y pasa a ser un patrón de fondo.

- [ ] **Step 4: Build y los tres guards de página**

```bash
npm run build && npm run check:surfaces && npm run check:seo
```

Esperado: OK. `check:surfaces` resuelve la home siguiendo los imports, así que acá se ve el conteo real de superficies.

- [ ] **Step 5: Commit**

```bash
git add -A src
git commit -m "Home: composicion nueva y baja de BrandTrail, StoryTeaser y FeaturesMarquee"
```

---

# Fase 5 — Footer

### Task 12: AgencyBar

**Files:**
- Create: `src/components/shared/AgencyBar.tsx`
- Create: `public/images/agency/resto-experience.svg`
- Modify: `src/lib/brand.ts`

**Interfaces:**
- Consumes: `AGENCY` de `@/lib/brand`.
- Produces:
  - `AgencyBar(): JSX.Element` (default export).
  - `AGENCY: { url: string; label: string; tagline: string; year: string }` exportado desde `lib/brand.ts`.

- [ ] **Step 1: Traer el asset**

```bash
mkdir -p public/images/agency
cp "/c/Users/Cami/Desktop/RestoExp/the-orient/public/images/agency/resto-experience.svg" public/images/agency/
ls -la public/images/agency/
```

- [ ] **Step 2: La constante `AGENCY`**

En `src/lib/brand.ts`, junto a `BRAND.credit`, que hoy es sólo `{ label, url }`:

```ts
/**
 * La agencia. `credit` ya tenía label y url; la barra del footer necesita
 * además el tagline y el año, que en los otros sitios de la casa viven acá.
 */
export const AGENCY = {
  url: 'https://restoexp.com',
  label: 'Resto Experience',
  tagline: 'Content, marketing & web design',
  year: String(new Date().getFullYear()),
} as const;
```

- [ ] **Step 3: Portar el componente**

Copiar la estructura de `the-orient/src/components/shared/agency-bar.tsx`, adaptando:

- La fuente auxiliar: en the-orient es DM Sans; acá va `font-body` (Futura).
- El `GUTTER` va **en el envoltorio** y la `caja` adentro sin padding propio, para que la fila alinee por los extremos con el resto del footer.
- El `aria-label` del link **contiene el texto visible**, que es lo que exige WCAG 2.5.3 (Label in Name), y avisa de la pestaña nueva ahí y no en un `<span>` oculto: algunos checkers no leen texto con `clip`.
- Contrastes ya verificados en the-orient: `#5c5c5c` sobre `#f5f5f5` da 6.13:1.

- [ ] **Step 4: Build**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add public/images/agency src/components/shared/AgencyBar.tsx src/lib/brand.ts
git commit -m "AgencyBar: barra powered by Resto Experience"
```

---

### Task 13: Footer reestructurado

**Files:**
- Modify: `src/components/shared/Footer.tsx` (reescritura)
- Delete: `src/components/shared/NewsletterForm.tsx`
- Modify: `src/app/actions.ts`

**Interfaces:**
- Consumes: `AgencyBar` (Task 12), `AGENCY` y `BRAND`.
- Produces: `Footer(): JSX.Element`.

- [ ] **Step 1: Reestructurar**

Estructura compartida de la casa (the-orient, santa-maria, casa-pirul, pretty-hens): columna de identidad a la izquierda, columnas de links a la derecha.

- **Columna de identidad**: logo, una bajada corta y el CTA.
- ⚠️ **SIN dirección, SIN horarios, SIN teléfono.** Camila: «los horarios y dirección, teléfonos, etc. no van allí». Es una consecuencia aceptada: en las otras 20 rutas esos datos no quedan en ninguna parte. Viven en la home, `/visit` y `/contact`.
- **Tres columnas de links** adaptadas a las 23 rutas, más las redes. El corte de la casa es «lo que pasa en el lugar» / «el resto del sitio» / «conocernos».
- **Franja inferior**: copyright y links legales.
- **`<AgencyBar />` al final.**
- **Se va el bloque «Last call».**
- Conservar el helper `SocialLink` que ya está al pie del archivo.

- [ ] **Step 2: Borrar el newsletter**

No está en la web actual —no figura en `docs/current-site-inventory.md`— y el cliente no lo pidió. Camila: «si el cliente no lo pidió y la web actual no tiene nada similar, no lo pongamos».

```bash
git rm src/components/shared/NewsletterForm.tsx
```

En `src/app/actions.ts`, borrar `subscribeToNewsletter` y el tipo `ActionState` **sólo si no lo usa `submitEventInquiry`**.

⚠️ **NO TOCAR `submitEventInquiry` ni `lib/mail.ts`.** Comparten el envío con el formulario de eventos, que sí es una capacidad real del sitio.

```bash
grep -rn "subscribeToNewsletter\|NewsletterForm" src/
```

Esperado: sin resultados.

- [ ] **Step 3: Build**

```bash
npm run build && npm run check:css
```

- [ ] **Step 4: a11y sobre el footer nuevo**

```bash
npx next start --port 3114
```

```bash
npm run a11y
```

Esperado: cero violaciones. El footer aparece en las 23 rutas, así que un fallo acá se multiplica por 23.

- [ ] **Step 5: Commit**

```bash
git add -A src
git commit -m "Footer con la estructura de la agencia, sin datos ni newsletter"
```

---

# Fase 6 — Documentación y verificación final

### Task 14: Documentación y guards completos

**Files:**
- Modify: `docs/design-references.md`
- Modify: `docs/house-tokens.md`
- Modify: `docs/contrast-audit.md`

**Interfaces:**
- Consumes: todo lo anterior.
- Produces: nada de código.

- [ ] **Step 1: `docs/design-references.md`**

Dos correcciones:

- La tabla de la sección 5 documenta `BrandTrail` como el gesto adoptado de ronnsquare.fr. **Se eliminó** por pedido de Camila, así que de ronnsquare queda sólo `PageTransition`. Anotarlo con el motivo.
- «Pendiente de aplicar: el acento tipográfico dentro del titular (wework / superside) y las filas de ícono + versalita + título». **Los dos se aplicaron** — el acento en color (no en itálica) y las filas en `ThreeDoors`. Marcar como hecho y anotar que el acento va en color porque el brand no usa itálica y no hay serif en el sistema.

- [ ] **Step 2: `docs/house-tokens.md`**

La sección de Tracking fija el token heredado de The Orient. Registrar que `--tracking-display: -0.02em` se reemplazó por una escala óptica positiva, y por qué: The Orient usa Lusitana (serif) y Rooftop usa Steelfish (condensada de caja alta), donde un tracking negativo apelmaza.

- [ ] **Step 3: `docs/contrast-audit.md`**

Agregar los pares nuevos con sus valores medidos: `terra`/`paper` 7.23:1, `terra`/`cream` 6.47:1, `sunset`/`deep` 4.26:1. Y dejar anotado explícitamente que **`sunset` no puede ser acento de titular sobre claro** (2.48:1), que es la razón de que el acento tenga dos colores.

- [ ] **Step 4: La batería completa**

```bash
npm run build
npm run check:css
npm run check:surfaces
npm run check:seo
npm run contrast
```

Y con el server de producción arriba:

```bash
npx next start --port 3114
```

```bash
npm run a11y
npm run check:motion
```

Esperado: todos en verde.

- [ ] **Step 5: Revisión visual de las 23 rutas**

```bash
node -e "const{chromium}=require('playwright');const R=['/','/visit','/events','/events/inquire','/events/spaces','/events/corporate','/events/celebrations','/events/fundraisers','/events/game-truck','/events/holiday-parties','/food-trucks','/whats-on','/market','/our-story','/faq','/contact','/join-us','/the-experience','/sunset-bar','/the-yard','/nfc-north-hq'];(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});for(const r of R){await p.goto('http://localhost:3114'+r);await p.evaluate(()=>document.fonts.ready);const o=await p.evaluate(()=>{const h=document.querySelector('h1');return{h1Top:h?Math.round(h.getBoundingClientRect().top):null,overflow:document.documentElement.scrollWidth>window.innerWidth}});console.log(r.padEnd(26),o.h1Top,o.overflow?'OVERFLOW-X':'ok')}await b.close()})()"
```

Esperado: ningún `OVERFLOW-X` y ningún `h1Top` por debajo de 110.

- [ ] **Step 6: Commit**

```bash
git add docs
git commit -m "Docs: referencias, tokens y contrastes al dia con el rediseno"
```

---

## Lo que queda pendiente y NO lo cierra este plan

Anotado en la §8 de la spec:

1. **Licencia de Bronx** — el fuente es `Bronx_PersonalUse.otf`. Verificar antes de publicar, y confirmar contra la página 13 del brand book cuál de las tres tipografías llamadas Bronx es la correcta.
2. **`Futura PT` es Futura Cyrillic** — el `@font-face` declara una familia que no sirve. Corregir el nombre antes de publicar.
3. **Red de seguridad en CSS del `Preloader`** — cortina opaca cuya única salida es un timer de JS.
4. **Los 12 videos** — hasta que lleguen, el muro muestra recuadros grises rotulados «video». Especificación: 3:4 vertical, 4–8 s, sin audio, ~1–2 MB, `.mp4` H.264.
