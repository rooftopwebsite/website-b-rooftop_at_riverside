# Invariantes — lo que sobrevive a cualquier rediseño

**Escrito el 2026-09-10, al arrancar el diseño nuevo desde cero.**

El lenguaje visual se tira entero. Este documento es lo único que cruza al otro lado:
cómo tiene que **funcionar** la web, sus medidas, su SEO y lo que sabemos del cliente.
Si el diseño nuevo contradice algo de acá, **se discute antes de romperlo** — no se
rompe en silencio.

---

## 0. Qué se conserva y qué se descarta

| Se conserva | Se descarta |
|---|---|
| `src/content/*` — trucks, spaces, events, faq, bar-menu, seo-pages | `src/components/sections/*` — todas las secciones |
| `src/lib/seo.ts`, `nav.ts`, `calendar.ts`, `mail.ts` | `src/lib/brand-art.ts`, `motion.ts` — arte y motion de la fase anterior |
| `src/app/sitemap.ts`, `robots.ts`, `actions.ts`, `next.config.ts` | El bloque de color de `globals.css` y `lib/brand.ts` |
| Las 23 rutas y el mapa de 301 (§2) | `design-audit/` — auditoría del diseño viejo |
| `public/` — medios ya optimizados (681 MB → 1,9 MB) | La escalera diagonal, el horizonte, la cortina, el arco de cards |
| El sistema de medidas de §3 | Los tokens de color, radios y sombras concretos |
| Los marcadores de pendientes (§5) | `docs/design-references.md`, `MOODBOARD.md`, `DIRECCION-VISUAL.md` |

**Regla:** el contenido nunca se re-deriva. Está verificado contra el cliente y contra
el sitio viejo; volver a inferirlo es cómo se cuelan los datos falsos.

---

## 1. Qué es este negocio — y por qué condiciona el código

Rooftop at Riverside, Bonita Springs (FL). Sitio actual: `eatdrinkparadise.com` (Wix).

**El venue no tiene cocina.** La comida la sirven cuatro food trucks independientes que
cobran su propia venta. De ahí salen dos consecuencias que no son negociables:

- El schema es **`BarOrPub` + `EventVenue`**, nunca `Restaurant`. Está documentado en
  `src/lib/seo.ts` y es la decisión de SEO más importante del proyecto.
- **El roster rota.** Los trucks se dan de alta y de baja por datos desde
  `src/content/trucks.ts`, con template único y 301 automático al sacar uno. El sitio
  viejo se desactualizó exactamente por no tener esto: 3 de 4 fichas publicadas son de
  trucks que ya no están, y sólo 1 de los 4 vigentes tiene ficha.

Roster vigente (menú de ene-2026, **pendiente de confirmación del cliente**):
OCN Seafood Co. · Butcher's Blvd · El Chilango · Reggae Kitchen.
Obsoletos: Prime Carvery · Tropical Fusion · Sea Me on Wheels.

---

## 2. Rutas y redirecciones

23 rutas vivas en el sitio viejo, todas 200. El mapa completo está en
`docs/current-site-inventory.md`. Lo que el diseño nuevo no puede cambiar:

- Los 301 ya definidos (`/this-is-us` → `/our-story`, `/eat` → `/food-trucks`,
  `/drink` → `/sunset-bar`, `/calendar` → `/whats-on`, `/hostanevent` → `/events`,
  `/find-us` → `/visit`, `/parking` → `/visit#parking`, …).
- `/ocn` no es huérfana: es un truck vigente redirigido a la ficha de otro.
  Propuesta abierta: `/ocn` → `/food-trucks/ocn-seafood-co`.
- Los dos waivers (`/bar-games-waiver`, `/game-zone-waiver`) son documentos legales
  redactados, no relleno. Se conservan.

---

## 3. Sistema de medidas — márgenes, responsive, ritmo

Valores **medidos** sobre los repos de la casa, no elegidos. Detalle y método en
`docs/house-tokens.md`. Stack: **Tailwind v4**, tema en `@theme` dentro de
`globals.css`. No existe `tailwind.config.ts`.

### Contenedor y gutter

```
--container-mobile:  780px    /* hasta 768 */
--container-tablet:  880px    /* 768 - 1344 */
--container-site:   1280px    /* desde 1344 - unanime en los 6 repos */
--container-wide:   1420px    /* excepcion: galerias a sangre */

--spacing-gutter:     16px    /* mobile */
--spacing-gutter-lg:  32px    /* desktop */
```

El salto a 1280 va en **1344px** (= 1280 + 32×2 de gutter), no en el breakpoint de layout.

> ⚠️ **`--breakpoint-desk` va en `rem`, no en px.** Declarado como `1344px` mientras los
> de Tailwind vienen en rem, Tailwind no puede ordenar los media queries y emite `desk`
> **antes** que los defaults: `sm:grid-cols-2` le gana a `desk:grid-cols-4` en 1440px.
> Correcto: `84rem`. Afecta a todas las combinaciones `sm:`/`md:`/`lg:` + `desk:`.

### Escala tipográfica

Un solo eje de display `d1`–`d7` más tres pasos de texto:

| Token | px | line-height | Uso |
|---|---|---|---|
| `d1` | 72 | 0.94 | hero |
| `d2` | 58 | 0.96 | h1 desktop |
| `d3` | 46 | 1.00 | h1 tablet · h2 desktop |
| `d4` | 36 | 1.08 | h1 mobile · h2 tablet |
| `d5` | 28 | 1.18 | h2 mobile · h3 desktop |
| `d6` | 22 | 1.25 | h3 mobile · título de card |
| `d7` | 18 | 1.30 | rótulo de columna de footer |
| `intro` | 25 | 1.40 | bajada de sección desktop |
| `lead` | fluido | 1.60 | copy de sección |
| `base` | 16 | 1.65 | **el 92 % del texto del sitio** |
| `cta` | 16 | 1.20 | botones |
| `caption` | 13 | 1.45 | kickers, etiquetas, pies |

Mapa responsive: `h1 = d4 → d3 → d2` · `h2 = d5 → d4 → d3` · `h3 = d6 → d5` · card `d6 → d5`.

> ⚠️ **`lead` va en `:root`, no en `@theme`.** Tailwind v4 evalúa `@theme` en compilación
> y un `clamp()` con `100vw` ahí compila mudo en 18px.
> `clamp(16px, 16px + (100vw - 390px) * 0.005128, 18px)`

### Ritmo vertical

Bandas de sección, **siempre como par mobile/desktop y siempre simétricas** (mismo `pt`
que `pb` — el aire de un solo lado fue un bug corregido, no un patrón):

| Paso | Mobile | Desktop |
|---|---|---|
| `sm` | 48px | 64px |
| `md` | 64px | 96px |
| `lg` | 80px | 128px |
| `xl` | 96px | 160px |

Ritmo interno del encabezado de sección (mobile → desktop ≥922px):
`kicker 8→12` · `bajada 16→20` · `párrafo 8→8` · `cta 24→32`.

### Header

`--spacing-header: 77px` · `--spacing-header-sm: 67px`.

### Lo que el diseño nuevo sí puede redefinir

Color, radios, sombras, motion y el arte de marca. Nada de eso está fijado acá: los
radios de 0–4px y las sombras tintadas eran decisiones de Fase 1 marcadas «a validar»,
y las sombras estaban tintadas en el navy de otro proyecto.

---

## 4. SEO — desde el primer commit, no al final

- `SITE_URL = 'https://rooftopatriverside.com'`.
- `pageMeta()` en `src/lib/seo.ts`, con la tabla de títulos y descripciones en
  `src/content/seo-pages.ts`. Los títulos de la tabla son **absolutos** (ya traen la
  marca); los de rutas dinámicas pasan por el `template` del layout.
- Canonical por página, OG image por página con fallback.
- Schema `BarOrPub` + `EventVenue` (ver §1).
- `sitemap.ts` y `robots.ts` generados, no escritos a mano.

---

## 5. La regla de los pendientes

Los huecos de contenido se marcan en el código con `<PhotoPending>`, `<PendingData>` y
`<PendingBlock>`. El marcador muestra el brief de lo que falta, y **desaparece solo**
cuando el dato llega: no hay que rediseñar nada.

```
grep -rn "PhotoPending\|PendingData\|PendingBlock" src/
```

**Nada se estima.** Una capacidad en la página de un venue es una promesa, y un número
inventado se convierte en un problema comercial el día que alguien lo usa para decidir.

27 ítems abiertos al 2026-09-10 en `docs/pedido-al-cliente.md`. Tres bloquean la home:
foto de un perro (Wooftop Wednesdays), cielo de atardecer para el hero, y 6–8 clips
verticales de ambiente. **Estos tres siguen bloqueando en el diseño nuevo** salvo que el
diseño elimine esos elementos.

---

## 6. Medios

- Fotos: lado largo 3000px, JPEG, sin filtros ni marcas de agua.
- Videos: vertical 3:4 o 9:16, 6–10 s, muteados, **sin texto quemado ni gente hablando
  a cámara**. Un clip de redes en una card de 130px lee como video roto.
- El pipeline recodifica y baja de tamaño; `public/` ya tiene la entrega optimizada.
- Prohibido simular con CSS lo que debería ser una foto (p. ej. un degradado que imite
  el atardecer).
