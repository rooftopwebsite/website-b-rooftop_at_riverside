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

## 5b. Material del cliente: nunca entra a git

Regla de Camila, 2026-09-11. **Ningún PDF, brief, brand book, moodboard ni
archivo con datos del cliente se versiona.** Todo eso vive en `_interno/`,
que está en `.gitignore` y no se sube nunca.

El motivo es concreto: esos archivos traen emails y teléfonos personales de los
dueños, el fee de agencia y presupuestos. Una vez en el historial de git, sacarlos
exige reescribirlo.

Lo que sí se versiona es el **derivado**: la imagen optimizada, el dato
transcrito, la cita en un documento de `docs/`. Nunca el original.

## 6. Medios

- Fotos: lado largo 3000px, JPEG, sin filtros ni marcas de agua.
- Videos: vertical 3:4 o 9:16, 6–10 s, muteados, **sin texto quemado ni gente hablando
  a cámara**. Un clip de redes en una card de 130px lee como video roto.
- El pipeline recodifica y baja de tamaño; `public/` ya tiene la entrega optimizada.
- Prohibido simular con CSS lo que debería ser una foto (p. ej. un degradado que imite
  el atardecer).

---

## 9. Decisiones que sostienen código (rescatadas de los comentarios, 2026-09-23)

El 2026-09-23 se borraron todos los comentarios del código fuente. El texto completo sigue en el historial de git
anterior a esa fecha: `git log -S "<símbolo o frase>" -- <archivo>` encuentra el commit, y `git show <hash>:<archivo>` lo muestra.

### 9.1 Código que se conserva sin uso, a propósito

Ninguno de estos tiene importadores (o sólo se importan sus tipos). **No se borran** en una limpieza de huérfanos.

- `src/components/shared/DiscHero.tsx` → template del hero de disco (ex `TruckHero`), guardado al unificar los trucks. Si molesta
  que las internas abran distinto, se lleva `PlateHero` a todas; no se vuelve a éste.
- `src/components/shared/HorizonBorder.tsx` → ola + medallón de sol del brand book (Figma nodo 2012:4491, lo parte `npm run horizonte`).
  Redibujarla cuesta más que guardarla. La clase `rt-sol` de `globals.css` es su gancho vacío: se conserva sin keyframe.
- `src/components/shared/WaveBorder.tsx` → la cenefa de rulos. El componente no se monta, pero `Surface`, `SURFACE_BG` y
  `SURFACE_TEXT` los importan `SoftWave`, `PageHeroWave` y `CompareSlab`: el archivo no se toca.
- `src/components/shared/BandVideo.tsx` + `public/videos/hero-rooftop.mp4` (y su póster) → clip de `/hostanevent` (15 s, 1,5 MB).
  Si vuelve a `/our-story`, entra como banda dentro de la página, nunca como encabezado.
- `src/components/shared/VideoWall.tsx` (+ `WallVideo.tsx`) → muro de 3 columnas, la forma correcta para un hero de dos columnas.
- `src/components/shared/CardArc.tsx` → arco de cards para un hero centrado. Comparte `wall-slots.ts` con `VideoWall`: volver a
  cualquiera de las dos no obliga a reasignar fotos.
- `src/components/shared/StepStair.tsx` → los pasos en escalera. Hoy sólo se importa su tipo `Step` (desde `YardSteps`).
- `src/components/sections/FeaturedEvent.tsx` → la banda del destacado grande, sacada de `/whats-on`, guardada para otra página que
  quiera abrir con un destacado. `shared/FeaturedEventCard` **sí** está en uso (`/sunset-bar`, `UpcomingCards`, `EventTypes`).
- `src/components/sections/BarMenu.tsx` + `getBarMenu()` (`lib/restoexp.ts`) + `respaldoComoGrupos()` (`content/bar-menu.ts`) → la
  carta digital del bar. Volver es cambiar `<MenuSheets />` por `<BarMenu grupos={carta} />` en `/sunset-bar`, con
  `const carta = (await getBarMenu()) ?? respaldoComoGrupos();`.
- `src/components/sections/TruckMenu.tsx` → carta de platos de un truck leída de la base. Espera a que vuelvan las fichas por truck.
- `ReviewsMarquee` en `src/components/sections/HomeSections.tsx` → escrito y sin montar hasta que el cliente confirme ratings reales.
- `src/content/story.ts` → Charity Partner Program, dato real de `/giveback`. `/giveback` hace 301 a `/our-story`, que ya no lo
  menciona: decisión abierta (re-montarlo, ruta propia o repuntar el 301). El partner del mes está vencido.
- `public/images/venue/hero-truck-window.webp` → portada de respaldo si el video del hero se cae. La sigue generando
  `scripts/build-media.mjs`; sólo se borra sacando antes esa entrada del script.
- Entrada de Reggae Kitchen en `src/content/trucks.ts` (`active: false`) → si el truck aparece, vuelve con `active: true`, y su 301
  nunca dejó de existir. `retiredTruckRedirects()` conserva el nombre para no tocar `next.config.ts` (hoy redirige todos los slugs).
- Token `tomato-soft` (`globals.css`) → no es huérfano: lo usa la variante oscura de `PendingData`.
- `EVENT_FAMILIES` → ya no se lista en `/events`, pero genera `EVENT_SUBTYPES`, que valida en el servidor el desplegable de `InquiryForm`.
- `src/app/actions/newsletter.ts` → se borró una vez por error: el sitio vigente **sí** tiene el formulario. Responde error a
  propósito mientras no exista `NEWSLETTER_SHEETS_WEBHOOK_URL` (va a planilla por Apps Script, no a Resend).
- `src/components/shared/Motion/` re-exporta `EASE_BRAND`, `DURATION`, `REVEAL_OFFSET`, `STAGGER` y `REVEAL_AMOUNT` desde
  `lib/motion.ts` con los nombres viejos, para no romper call sites. `ScrollExit` se borró el 2026-09-23 (está en git).

### 9.2 Contratos entre archivos

**H1 y SEO**
- Texto del `<h1>` de cada página ↔ `PAGE_SEO[ruta].h1` en `src/content/seo-pages.ts`: `npm run check:seo` compara el `textContent`
  carácter por carácter. Apóstrofo recto (`'`, no `&rsquo;`); mayúsculas por CSS, nunca en el fuente.
- `PlateHero` · `title` + `titleAccent` ↔ `PAGE_SEO`: `title` termina en espacio. El espacio va dentro del string: un nodo de texto
  suelto entre dos `block` arma una caja anónima. Para partir renglón, `span` con `block`, nunca `<br>`.
- `src/components/sections/Hero.tsx` · placa «TOGETHER» (`aria-hidden`) ↔ `sr-only` dentro del `<h1>`: sin el `sr-only` el h1 queda
  en «Bonita comes» y `check:seo` falla.

**Hero de placa (`src/components/shared/PlateHero.tsx`)**
- `mb-[-0.94em]` del `<h1>` ↔ `top-[calc(100%-0.94em)]` de las dos `esquina-inversa` ↔ interlínea 0.88 + `pb-[0.12em]` de la placa:
  0.94em es media placa de dos renglones. Si cambia uno, cambian los tres. Van en `em`, nunca en px.
- Placa `max-w-[calc(100%-4*var(--radius-frame))]` ↔ radio del marco de la foto: si la placa llega más lejos, la esquina cae sobre la
  curva de la foto o sale de la página (1px de scroll horizontal a 360px).
- Placa `bg-bone grano` ↔ `bg-bone grano` de la sección: si uno cambia de superficie sin el otro, aparece el rectángulo.
- Titular de hero que no entra en dos renglones de `text-banda` → se acorta el copy (y `PAGE_SEO` con él). No se achica el cuerpo.
- `photoMobileRatio` elige el marco de mobile (`portrait` 4:5 por defecto, `landscape` 3:2). `landscape` es para una foto
  horizontal donde el 4:5 cortaría gente a los costados (`/events`, 2026-09-28): el marco baja y la bajada con los dos CTA entra en
  la primera pantalla. Si hiciera falta otra foto para mobile, se recorta del original y no de la de desktop.
- `photoMobile` monta una foto propia debajo de `sm` (`/events` desde el 2026-09-29, 3:2 desde el original). Las dos `Image` llevan
  `preload`, y el `sizes` de `1px` en el ancho donde cada una está oculta es lo que evita bajar las dos en tamaño completo.
- `photoKeepFaces` (`/events`, 2026-09-29; tope cambiado el 2026-10-02) pone `@container` en la caja y `lg:min-h-[56.25cqw]` en el
  marco: la franja nunca pasa de 16:9 aunque `max-h` la achate. Con la foto de las cinco amigas de pelucas naranjas (4:3 del original a
  todo el ancho, `foco` 0,295 en `build-media.mjs`) más apaisado que eso no entran a la vez las cabezas debajo de la placa y el mentón
  más bajo: las caras van de borde a borde, así que el marco solo puede recortar arriba y abajo. Costo: en pantallas bajas los CTA del
  hero bajan de la primera pantalla. Regla de Camila: la foto es la misma en todos los dispositivos y ninguna cabeza se corta.

**Alto del header**
- Header real de 78px ↔ `top-[78px]` (`PilaConCabeza`), `top-[calc(78px+var(--cabeza))]` (`EventTypes`), `pt-24` (`GameShelf`,
  78 + aire), `top-[79px]` (`MonthBar`, 78 + filete). Si el header cambia de alto, se mueven todos.
- `:target { scroll-margin-top }` en `globals.css` (lee `--spacing-header` / `--spacing-header-sm`) es el único lugar del offset de
  anclas. Lenis lo respeta: `SmoothScroll` va **sin** `anchors.offset` (con él el destino caía al doble de distancia).

**Superficies, arcos y olas**
- `<Section tone>` y `<section class="bg-…">` de cada página ↔ `scripts/surface-rhythm.mjs` (`npm run check:surfaces`): máx. 1 `deep`
  por página, `mint` y `cream` cuentan como crema (máx. 2), nunca dos de color pegadas. Lee el archivo con regex (comentarios y
  ternarios incluidos) y sólo expande `<Section>`, `<FormSlab>` y componentes usados **sin props**. La home lo excede a propósito.
- Por eso `VenueTabs` escribe su `tone` adentro (no por prop), `SpecSlab` no trae su `<Section>` (la pone el call site) y
  `JoinSwitch` queda fuera del guard: si pasa a ser `Section`, hay que revisar el ritmo de `/join-us`.
- Un `div` oscuro o crema dentro de una sección clara es tarjeta, no banda: no cuenta para el guard (`HowToOrder`, precios de `/game-truck`).
- Textura `piedra` (Figma nodo 2057:27897, `public/textures/piedra.webp`) va sólo en la cita de `/our-story` (`Section tone="teal"`) y
  en la card del newsletter del footer (Camila, 2026-09-28). Está remapeada a grises por debajo del 50 %: en `hard-light` sólo
  oscurece, y el blanco sobre `teal600` nunca baja de 4.59:1. La versión de Figma aclaraba y dejaba el texto en 2.6:1.
  `SoftWave` la repite en su lado `teal600` para que no quede una tira lisa pegada a la cita: debajo de la ola cuando `to` es teal, y
  recortada con `public/textures/ola-suave-mask.svg` cuando `from` es teal. La máscara es el `OLA_SUAVE.d` ya volteado: si cambia la
  ola, se regenera.
- Color de arranque de cada ola (`SoftWave` `from`, `CompareSlab` `from`) ↔ superficie de la sección de **arriba**. Se mueve cada vez
  que se reordena la página; `check:surfaces` también mira las olas.
- `--radius-band` ↔ margen negativo de la sección que se monta ↔ `cierre-arco` (= `cierre` + `--radius-band`). La clase `.banda-arco`
  + `:has(+ .banda-arco)` estira la anterior con **borde transparente**. Cada sección que se monta necesita `z-index` creciente.
- `FormSlab` en `/events` pasa `panelTone="paper"` porque su sección tiene que ser `bone` (lleva `banda-arco` y el arco toma el color
  de la sección). Default del resto: sección `paper` + panel `bone`.
- `PADDING_CRUCE` (exportado de `CompareSlab.tsx`) ↔ margen negativo de sus tarjetas: lo consumen `/events`, `/food-trucks` y
  `EventSpaces`. El `z-10` de las tarjetas no se saca.

**Medidas atadas**
- `TruckCards.tsx` · `-top-[26px]` = `TOLDO.asomo`, `-inset-x-2` (8px) = `TOLDO.vuelo`, el `18` del `clip-path` = `TOLDO.entrada`.
  Tailwind necesita el literal: si cambia la constante, cambia la clase. Las rayas del toldo, siempre en número par.
- `.troquel` (`globals.css`): radio del diente 13px ↔ paso 26px ↔ 26px descontados al relleno. El `13.5px` es antialias, no error.
- Filete troquelado `inset-3.5` (14px) + `rounded-shell`, compartido por `CompareSlab`, `EventTypes`, `FormSlab`, happy hour de
  `/sunset-bar`, banner de `/food-trucks` y tarjeta de `/market`; por eso esas tarjetas llevan padding 8/10.
- `ThreeDoors.tsx` · `right-1 bottom-1` del círculo ↔ `--mordisco-sangria` (4px).
- `/our-story` · `translate-y-19` (76px) de la placa del equipo = 56 del cajón + 20 del `p-5`.
- Plancha del sticker del logo (`globals.css`): 109.262 % × 108.696 % (14px sobre 302.3 × 322), un porcentaje por eje; el filo en `fog`
  suma 3px sobre las medidas desktop.
- Topes de cuerpo de titular ↔ texto del titular + pieza al lado: `EventsBanner` (105,6px, sello) y `FindUs` (redes). Si cambia el
  texto o la pieza, se recalcula el tope.
- `HomeSections.tsx` · las dos columnas cierran a la misma altura: grilla **sin** `items-start` + derecha `flex-col justify-between`
  + párrafo de ≤ ~165 caracteres.
- `src/content/venue-areas.ts` · cada `body` ≤ ~140 caracteres ↔ `VenueTabs` a 62ch (dos renglones en desktop).
- Frases del pill de estado del hero ≤ ~22 caracteres ↔ `text-pastilla` (tabla medida en `Hero.tsx`). Etiquetas de botón ≤ ~20
  caracteres ↔ `whitespace-nowrap` de `Button.tsx`: si no entra, se acorta el copy.

**Scroll horizontal y sombras**
- `GameShelf.tsx` · `pad` de la cuenta del track ↔ `px-gutter md:px-gutter-lg` de la fila (no `--spacing-borde`).
- Variante `estante:` de `globals.css` ↔ la misma media query en el JS de `GameShelf`.
- `MonthBar.tsx` · sangría negativa de la tira de filtros ↔ padding del contenedor (`GUTTER`). Si divergen, scroll horizontal en
  todo el documento.
- `WhatsOn/` · `px-6` del track = `gap-6` (24px); `scroll-px-6` acompaña al `px-6`; `ANCHO` decide cuántas tarjetas se ven;
  `bordeTrack` lee el `px-borde` computado del DOM. Tope de tarjetas en 8.
- Paddings que existen para la sombra ↔ token de sombra (alcance = `blur + spread`, lo mide `npm run check:sombras`):
  `WhatsOn` `pt-3.5 pb-13` (`shadow-card-dark`), carrusel de `Motion/` `pt-6 pb-21` (`shadow-float`), `YardSteps` `pt-2 pb-7`,
  `PhotoDivider` `py-13` (52px). Si cambia la sombra, se recalculan.
- `BackToTop.tsx`: 37px al borde ≥ alcance de `shadow-card` (32); por eso no usa `shadow-float`.

**Colores, tokens y tipografía**
- Bloque `@theme` de `src/app/globals.css` ↔ `src/lib/brand.ts`: `npm run check:tokens` falla si divergen. Lo que pinta es el CSS.
- `src/lib/cn.ts` · config de `twMerge` ↔ **todos** los `--text-*` del `@theme`. Un token de tamaño que falte se toma por color y
  borra el color de la variante (lo detecta `npm run a11y`, no el build).
- `--font-display` / `--font-subhead` / `--font-body` (163 call sites) ↔ variables de `next/font/local` en `src/app/layout.tsx`, que
  van en el `className` del `<html>`. Sin él, el texto cae al default sin aviso (`npm run check:css`).
- Acento de titular: `sunset-deep` sobre claro (`BRAND.headlineAccent.onLight`), `sunset` sobre `deep`. Texto sobre `sunset`: negro.
  Única excepción viva: la placa «TOGETHER» del hero de la home (`sunset` sobre `bone`, 2.35:1, decisión de Camila).
- Colores de las lomeras de `GameShelf` ↔ cuadraditos de consola de `SpecSlab` (los mismos tres primeros, mismo orden). `river` sólo
  como relleno, nunca texto.

**Formularios, rutas y datos**
- `INPUT_BASE` de `NewsletterSignup.tsx` ↔ `INPUT_BASE` de `InquiryForm.tsx`: copias deliberadas que cambian juntas (píldora, 22px de
  padding, 42px de alto = botón, `text-[16px]`).
- Honeypot `name="website"` que dibuja `FormShell` ↔ schemas: `lib/schemas/join.ts` lee `website`; ningún campo real puede llamarse
  `website` (por eso el de `market-vendor.ts` es `link`).
- `lib/schemas/contact.ts` lo usan el cliente y la server action: un solo objeto, los mismos mensajes.
- Query params y anclas: `?apply=team|artist` (`JoinSwitch`), `/events?area=game-truck#inquire` (tilda la casilla de `InquiryForm`),
  `#inquire` y `#spaces` en `/events`. Los `id` `game-truck` (`/events`), `packages` y `policies` (`/game-truck`) se conservan como
  destinos; algunos emisores ya no existen: `grep` antes de renombrar.
- `data-pie-cierre` en `Footer.tsx` ↔ `alzaDelPie()` en `BackToTop.tsx`: si se renombra, el botón cae a su piso en silencio.
- `--aviso-pie` (`globals.css`): lo **escribe** el elemento fijo al pie (el futuro banner de cookies, alto en px y `0px` al cerrar) y
  lo **lee** `BackToTop` sumado a su piso de 72px. `BackToTop` va en `z-[60]`, debajo del `z-[70]` del banner de la casa.
- `SITE_LEGAL_DOCS` arma el pie del sitio y el pie de cada documento legal. La URL de gift cards de Toast vive sólo en `brand.ts`.
- `lib/motion.ts` es la única fuente de curvas y duraciones; las dos puntas del `inset` de `RevealMedia` salen del token `clip`.
- Labels del desplegable de bebida en `content/spaces.ts` = labels de `DRINK_OPTIONS` en `content/events-pricing.ts`; los fees
  (gratuity, tax, reservation fee) se sacaron de `/events` el 2026-09-29 por pedido de Maddie; no se vuelven a publicar sin que lo pida. Precios de `/game-truck` y `/events` salen siempre de `content/`.
- `EVENTS_PDF = null` (2026-09-29, Camila): el Events Packet del cliente quedó viejo y contradice los precios de `/events`, así que
  la tarjeta de descarga no se muestra. Cuando llegue el nuevo, se vuelve a poner `{ label, href, format, size }` y reaparece sola.
- Regla «renglón que empieza con precio = promo»: duplicada a propósito en `content/happy-hour.ts` (carga) y `UpcomingCards` (lectura).
- Promos de `/sunset-bar`: `space === 'Sunset Bar'` + que el evento publique precios. Happy hour identificado por título. Nunca por tag.
- Cartas de truck ↔ dashboard: emparejadas por nombre normalizado (`truckPorNombre` / `menuDeTruck`); sin match cae a `menuImage`.
- Nombre de truck en pantalla: siempre `nombreVisible(t)`, nunca `truck.name` directo (esconde los nombres no confirmados).
- Fechas del calendario: `from` = `todayInVenue()`, nunca `toISOString()` (Vercel corre en UTC y borra el evento de la noche).
- Caché de lo que viene del dashboard: 60 s (`REVALIDATE` en `lib/restoexp.ts`, `lib/blog.ts` y el `revalidate` de `/blog`). Con
  3600 un cambio de horario tardó más de una hora: es stale-while-revalidate, así que el primer visitante tras vencer recibe la
  versión vieja. No subirlo sin un webhook de revalidación del dashboard.
- Horario de los trucks: sale de la sede «Food Trucks» del dashboard (`location_hours` guarda un horario por sede). Se reconoce por
  nombre normalizado (`esSedeDeTrucks`: contiene «foodtruck»); cualquier otra sede es la del bar. Sin fila, cada columna cae a
  `content/hours.ts` por separado. Los menús de los trucks no cuelgan de esa sede: `menus` no tiene `location_id`, se emparejan por
  nombre con el truck (ver arriba).

### 9.3 Trampas técnicas medidas

**CSS y Tailwind**
- Todas las utilidades de tema desaparecen sin warning → un comentario CSS dentro de `@theme` cierra el bloque antes (no se anidan) →
  nada de comentarios dentro de `@theme`. Lo cubre `npm run check:css`.
- `position: sticky` deja de pegarse → un ancestro con `overflow: hidden` crea contenedor de scroll → usar `overflow-x: clip` (el
  `body` ya lo tiene; también es lo que permite `mx-[calc(50%-50vw)] w-screen` sin desborde).
- La página queda corrida en x tras navegar → un desborde momentáneo sobrevive a los links con `scroll={false}` → el `clip` del body.
- Sombras cortadas al ras en carruseles → `overflow-x: auto` computa `overflow-y: auto` → `py` en el track + margen negativo que lo
  devuelva. El mismo recorte se come el `::after` de `.toque` (por eso `py-2 -mb-2` en `MonthBar`).
- Sombra cortada con padding «suficiente» → el alcance se calculó `blur/2 + spread` → la cola real es `blur + spread`.
- Sombra rectangular sobre una pieza con `mask` → `box-shadow` no sigue la máscara y el orden es filtro → recorte → máscara →
  `filter: drop-shadow` en el **envoltorio** (`troquel`, sticker, `YardSteps`).
- `mix-blend-mode` que no mezcla (footer grisado) → `z-0` en un posicionado crea contexto de apilamiento y mezcla contra nada →
  capa en `z-index: auto` y el contenido en `relative z-[1]`.
- Aire de cierre en cero → `padding-bottom` **pisa** el `pb-cierre` en vez de sumarse → estirar con `border-bottom` transparente.
- Clases que no existen en el CSS → Tailwind sólo emite literales → nada de `bg-${x}`; mapas con las clases enteras (`SURFACE_BG`).
- `-mx-6` en el DOM sin regla emitida (medido en este repo) → usar `[margin-inline:-1.5rem]`.
- Warning «preloaded but not used» en Chrome → un CSS module de una sección de una sola ruta sale en un chunk que el prefetch del
  header precarga en todas → utilidad arbitraria en vez de módulo.
- `hidden` que no oculta → concatenar clases deja ganar la que aparece después en el CSS emitido → todo por `cn()` (`clsx` + `twMerge`).
- `max-w-[16ch]` que estrangula un h1 → `ch` es relativo al font-size del propio elemento → la medida va en el span que lleva el cuerpo.
- Disco que salta al aparecer la barra de scroll → ancho en `vw` → ancho en `%` del contenedor con `aspect-square`.
- Superficie con `bg-*` propio queda lisa → el `grano` va por superficie, no se hereda → `grano` en cada sección/placa que pinta fondo.
  Nunca en objetos (tarjetas, botones) ni en elementos que ya tengan `background-image`; lo vigila `check:grano`.
- `grano-capa` rompió un `absolute` → la utilidad declaraba `position: relative` → no declara `position`; quien la usa ya está
  posicionado. Su tile fija alfa 1 con `feFuncA` (`feTurbulence` también mete ruido en el alfa).
- Subir la opacidad del grano baja contraste sin que `check:contrast` lo vea (lee tokens, no la capa) → alfas 0.03/0.05 topados por
  `muted` sobre `bone` (4.67:1). Rehacer la cuenta a mano antes de tocarlos.
- Tira de filtros que arrastra scroll horizontal → sangría negativa distinta del padding real del contenedor (ver §9.2).

**React, hidratación y Next**
- Contenido invisible con «reducir movimiento» → el servidor emite `style="opacity:0;…"` y React no borra en la hidratación un atributo
  que el vnode no tiene → estado final con `!important` (`Motion.module.css`) + red de seguridad en la media query de `globals.css`.
- Error #418 de hidratación en la home → `useReducedMotion` de motion ya es `true` en el primer render del cliente y cambia `<video>`
  por `<img>` → `useSyncExternalStore` con snapshot de servidor `false` (`Hero.tsx`). Latente en `BandVideo`, `WallVideo`, `CardArc`.
- Imagen con `clip-path` que nunca aparece dentro de un `StaggerGroup` → motion propaga etiquetas de variantes por contexto y pisa el
  `whileInView` literal → declarar con `variants` usando las mismas etiquetas (`hidden` / `visible`).
- SVG por `next/image` sale 0×0 sin error → el optimizador rompe los vectores → `<Image unoptimized>` para todo `.svg`.
- SVG en `<img>` que no se estira → respeta su propio `preserveAspectRatio` → inline con `preserveAspectRatio="none"` (o `slice`
  para que no escale en monitores anchos).
- `Link` a un hash deja el foco en el origen → el router de Next resuelve el hash sin mover el foco → anclas, `mailto:`, `tel:` y
  externos van como `<a>`; `Link` sólo para navegación interna.
- Estado dependiente de la hora (hoy, abierto ahora) mal o con mismatch → el servidor no sabe la hora del visitante y la página se
  cachea → pintar sin estado y resolver al montar (`lib/hours.ts`, `WhatsOn`, `Hero`).
- «The result of getSnapshot should be cached» / render infinito → `getSnapshot` devolvía objeto nuevo → devolver primitivos (y
  redondear a entero para no renderizar por medio píxel), como en `BackToTop`.
- Carrusel que muestra todas o ninguna tarjeta → `IntersectionObserver` con el array de hijos capturado al montar se desincroniza al
  reordenar y en Fast Refresh → medir geometría en cada pasada; tolerancia de 1px por DPR fraccional de Windows.
- Carrusel que abre en la segunda tarjeta → reordenar hijos de un `snap-mandatory` fuerza re-anclaje, o falta `scroll-px` con el
  `px` → efecto que vuelve `scrollLeft` a 0 cuando se resuelve `today` (no remontar con `key`: tira el foco).
- Foco que vuelve a la nada al cerrar un diálogo → StrictMode monta dos veces y el segundo setup guarda el botón de cerrar → guardar
  el foco de retorno sólo si `activeElement` está fuera del diálogo (`EventDialog`).
- La página de atrás scrollea con un `<dialog>` abierto → `showModal()` inertiza pero no frena el scroll → `overflow: hidden` en el
  body, restaurado en el `return` del efecto (mismo mecanismo que el drawer). El que scrollea es el propio `<dialog>` con `h-dvh`.
- Preloader clavado 4 s en arranque en frío → la cortina dependía de JS para levantarse → server component con animación 100 % CSS.
- `<video autoPlay>` sigue corriendo con reduced-motion → la media query no detiene reproducciones → componente cliente que muestra
  el póster (misma caja).
- Salto tras hidratar en el muro de video → decidir columnas por ancho en el cliente → renderizar todas y ocultar con CSS.
- Recorte del hero de la home mal dimensionado → se midió con la fuente de respaldo → medir con `getBoundingClientRect` al montar,
  en resize y en `document.fonts.ready`; offset de documento (`rect.top + scrollY`); arranque en `38%` / `76px` sin JS.
- Animación que no se reinicia al cambiar el texto → React reusa el nodo → `key` compartida entre texto y medalla del pill.
- Envoltorio `link ? Link : 'div'` no compila → la unión deja `href` opcional → una función aparte por rama (`FeaturedEventCard`).
- Dos `<meta name="robots">` en el 404 → Next ya inyecta `noindex` → `not-found.tsx` declara `metadata` sin `robots`.
- Honeypot que nunca atrapa o que rechaza todo → el schema leía otra clave, o un campo real se llamaba igual y `Object.fromEntries`
  se quedó con el vacío → ver contrato de `website` en §9.2.
- Zoom automático al enfocar un campo en iOS → font-size menor a 16px → `text-[16px]` en inputs.
- Select que parece campo de texto → `appearance-none` sin flecha propia → flecha a 18px del borde con `pointer-events-none`.
- Tarjeta entera clickeable con botón adentro → `<a>` dentro de `<a>` es HTML inválido → el link es el botón (`UpcomingCards`).
- axe da contrastes falsos → mide a mitad del fundido de entrada; `networkidle` no significa página quieta → esperar a que terminen
  las entradas antes de medir (`scripts/a11y.mjs`). Y axe saltea lo `aria-hidden`: la placa «TOGETHER» nunca la audita.
- En Windows, cortar la terminal de `next start` no mata el proceso de node: sigue escuchando o deja tomado `.next`, y el build siguiente falla o sirve CSS viejo → antes de buildear, `netstat -ano` y `Stop-Process -Id <pid> -Force`; si ya pasó, borrar `.next`.
- CSS de componente sin capa en `globals.css` le gana a toda clase de Tailwind (Tailwind 4 pone las utilidades en `@layer utilities`) → la clase se ignora sin aviso → toda regla nueva de componente va dentro de `@layer components { }`. Fuera de capa sólo los tokens de `:root` y los `!important` de reduced-motion sobre `*` y `[data-reveal]` (en una capa, un `!important` cambia de fuerza).
