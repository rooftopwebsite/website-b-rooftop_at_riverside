# Auditoría — home de Rooftop at Riverside

Rama `redesign/light-tropical`. Baseline en `design-audit/baseline/`, capturado con
`design-audit/shoot.mjs` sobre el árbol de `main` en 9569ef6.

Todos los números de acá están **medidos**, no estimados. Las herramientas quedan
en la rama: `shoot.mjs` (capturas), `surface-split.mjs` (reparto de superficie por
píxel), `measure.mjs` / `measure2.mjs` (contraste WCAG).

---

## 0. El número que resume el problema

Reparto de superficie **medido sobre el píxel** de `baseline/home-desktop.png`
(1440×6197, 991.680 píxeles muestreados):

| superficie | hoy | objetivo |
|---|---:|---:|
| **deep + deeper** (verde oscuro) | **55,4 %** | 20–25 % |
| paper (blanco/hueso) | 30,7 % | \_\_\_ |
| cream / bone (claro cálido) | 9,7 % | 70–75 % juntas |
| river / mint | 0,9 % | decorativo |
| sunset | 0,6 % | ≤ 5 % |
| cream-deep | 0,5 % | ≤ 5 % |
| foto / mapa / gris sin token | 2,3 % | — |

**Claro: 40,3 %. Oscuro: 55,4 %.** El objetivo es casi exactamente el inverso.
No es una impresión: más de la mitad de la home es verde oscuro.

Y hay un agravante que el porcentaje no muestra: el oscuro está en las **dos
primeras pantallas**. El hero es 100svh de `deep` sólido y la sección que lo
sigue a una pantalla de distancia es otra losa `deep` de 1.309px. Quien entra
ve verde, scrollea, y vuelve a ver verde.

---

## 1. Tabla por sección

Alturas medidas en desktop 1440. `main` mide 5.625px; el footer suma aparte.

| # | Sección | Componente | Superficie actual | Problema | Dirección nueva |
|---|---|---|---|---|---|
| 1 | Hero | `Hero` + `VideoWall` | `deep` sólido, 900px, 100svh | La primera pantalla es la más oscura del sitio. Y la mitad derecha son **12 recuadros grises rotulados «VIDEO»**: el lugar donde el brief pide imágenes protagonistas está literalmente vacío | Invertir la luminosidad: columna de texto sobre `paper` con el titular al tope de la escala. La columna del muro se queda donde está —es la geometría que aprobó Camila— pero cargada con **fotografía real**, que es lo que la vuelve protagonista |
| 2 | What's on | `WhatsOn` | `paper`, 1.053px | Tres tarjetas redondeadas idénticas: mismo radio, misma `shadow-card`, mismo ancho. Es el kit SaaS del anti-patrón. La primera se diferencia pintándose `bg-deep`, o sea con color en vez de con jerarquía. Y las tres fotos son placeholders «IMAGE MISSING» | Se cae el contenedor de tarjeta. Foto arriba, texto directamente sobre la superficie, filete de 1px separando. El ítem de hoy se distingue por **tamaño** (ocupa dos columnas), no por color |
| 3 | cenefa | `WaveBorder` | transición `paper`→`deep` | Correcta y es arte real del Figma. Pero hoy separa claro de oscuro; con la home clara hay menos cortes que marcar | Se preserva. Pasa a marcar el único corte a `deep` que queda, y cambia de color según las superficies que une |
| 4 | How this place works | `HomeSections` + `StepStair` | **`deep`, 1.309px** | La losa oscura más grande del sitio, y la escalera diagonal deja ~2/3 de la grilla vacía: 1.309px de verde para tres párrafos cortos. Los `01/02/03` van en `river` sobre `deep` (2,43:1 contra blanco; sobre deep es todavía menos) | Pasa a `cream`. La escalera se conserva —es la tercera forma y salió de for-living.it— pero el triángulo vacío deja de ser verde muerto y se compacta |
| 5 | cenefa | `WaveBorder` | `deep`→`paper` | ver #3 | Se preserva |
| 6 | Three doors | `ThreeDoors` | `paper`, 665px | **La sección más cerca del objetivo.** Ya son filetes de 1px, ícono chico, micro-etiqueta, título, cuerpo — el mandato de WeWork está cumplido. Lo que sobra: el ícono en caja `bg-bone` redondeada, el eyebrow encima del h2 *además* de los tres eyebrows de columna, y el h2 a 46px en una página de 1440 | Se toca poco: sube la escala del h2, sale la caja del ícono, y de los cuatro eyebrows queda uno |
| 7 | Events banner | `EventsBanner` | `bone` 569px con una card `bg-deep/90` sobre foto adentro | La card oscura hace que la sección lea oscura sin ser una sección oscura. Los tres ítems de la derecha son tres cajas `bg-paper/10` con el mismo radio — tarjetas otra vez | **Es la que se queda con el corte oscuro.** Pasa a `Section tone="deep"` a sangre: un solo corte marcado, en la vertical que más factura. Los tres ítems pasan a filas con filete |
| 8 | Find us | `FindUs` | `paper` 1.029px con **dos cards `bg-deep`** flanqueando el mapa | Dos bloques oscuros de ~620px dentro de una sección clara: en la captura la sección lee oscura. Es el segundo aporte grande al 55 % | Las dos cards pasan a claras con filete de 1px. El mapa queda como la única pieza con peso visual |
| — | Header | `Header` | `bg-deeper` fijo, translúcido | Barra oscura fija sobre toda la página. Con la home clara es el elemento que más va a pesar, y `deeper`/`deep` se separan sólo 1,26:1 — sobre el hero verde el header casi no se distingue | A revisar en la fase de componentes globales (FASE 4, paso 3) |
| — | Footer | `Footer` | `bg-deep` | Correcto y no se discute: el pie es oscuro | Se queda |

---

## 2. Inventario: dónde está aplicado hoy el `deep` como **superficie**

Separado de `deep` como color de texto, que es otra cosa y está bien.

### Superficies oscuras en la home
| Archivo | Línea | Qué |
|---|---|---|
| `src/components/sections/Hero.tsx` | 59 | `bg-deep` en la sección entera, 100svh |
| `src/components/sections/HomeSections.tsx` | 80 | `Section tone="deep"` — la losa de 1.309px |
| `src/components/sections/EventsBanner.tsx` | 79 | `bg-deep/90` sobre la foto, dentro de una sección `bone` |
| `src/components/sections/FindUs.tsx` | 222, 298 | dos cards `bg-deep` |
| `src/components/sections/WhatsOn.tsx` | 82 | la primera card del listado, `bg-deep` |
| `src/components/shared/Footer.tsx` | 88 | el pie. Se queda |
| `src/components/shared/Header.tsx` | 135–136 | `bg-deeper` / `bg-deeper/90` |
| `src/components/shared/Section.tsx` | 39 | la definición del tono `deep` |

### Superficies oscuras fuera de la home (no son de esta rama, quedan anotadas)
`src/app/nfc-north-hq/page.tsx:134`, `src/app/our-story/page.tsx:202`,
`src/app/sunset-bar/page.tsx:63` — una `Section tone="deep"` cada una.

### Overlays de marca, que se preservan
`src/components/shared/PageTransition.tsx:48` y `Preloader.tsx:40` usan `bg-deep`.
Son la cortina y el preloader; el brief pide preservar `.transition` y sólo revisar
que el color acompañe la paleta clara.

### Falsos positivos
`Eyebrow tone="deep"` (12 call sites) es **color de texto**, no superficie, y da
10,83:1 sobre blanco. No se toca.

---

## 3. Estado de los tokens: tres fuentes de verdad, y no coinciden

Esto es el hallazgo más serio del audit, porque invalida la documentación de
contraste que ya existe.

| Token | `src/lib/brand.ts` | `src/app/globals.css` `@theme` | `scripts/contrast.mjs` |
|---|---|---|---|
| `paper` | `#FFFFFF` | **`#FDFCF7`** | `#FFFFFF` |
| `ink` | `#000000` | **`#0A1F1E`** | `#000000` |
| `body` | `#0A0A0A` | **`#0A1F1E`** | `#0A0A0A` |
| `bone` | — no existe | `#F7F1E3` | — |
| `deeper` | — no existe | `#013434` | — |
| `chalk` | — no existe | `#FFFFFF` | — |
| `fog` | — no existe | `#E6E1D4` | — |

**Lo que renderiza es `globals.css`.** `brand.ts` quedó describiendo una paleta
que el sitio no usa desde que se revisó el tema contra Showdown Social, y
`scripts/contrast.mjs` arrastra la misma paleta vieja — así que **cada ratio de
`docs/contrast-audit.md` está calculado contra colores que no se pintan**. Los
veredictos gruesos siguen valiendo (los pares problemáticos son los mismos) pero
los números no son los del sitio.

Consecuencia para el brief: «Ningún hex fuera de `lib/brand.ts`» no se puede
cumplir literalmente. Tailwind v4 no tiene `tailwind.config.ts` —el tema es
CSS-first, en `@theme`— y no se puede importar un `.ts` ahí. **Propuesta en
`DIRECCION-VISUAL.md` §7.**

### Componentes con hex o clase arbitraria de color
| Archivo | Qué | Veredicto |
|---|---|---|
| `shared/AgencyBar.tsx` | `bg-[#f5f5f5]`, `text-[#5c5c5c]` ×5, `via-[#7c7c7c]` ×2 | **violación real** — 8 hexes de gris de sistema, fuera de paleta |
| `shared/Button.tsx:35` | `hover:bg-[#e0741a]` | **violación real** — el hover del CTA primario |
| `app/layout.tsx:25` | `themeColor: '#FFFFFF'` | legítimo: es metadata del navegador, no un estilo. Hay que actualizarlo si cambia `paper` |
| `app/nfc-north-hq/page.tsx:39-42` | colores de equipos de la NFL | legítimo: son marcas ajenas, no nuestra paleta. Fuera de esta rama |
| `app/globals.css` | 21 hexes | son las **definiciones** de los tokens y los comentarios. Es donde tienen que estar |

### Valores arbitrarios de espaciado y tamaño — el problema de escala
Conteo en `src/app` + `src/components`:

| patrón | ocurrencias |
|---|---:|
| `p-[` | 230 |
| `gap-[` | 198 |
| `mt-[` | 174 |
| `text-[` | 152 |
| `py-[` | 90 |
| `w-[` | 81 |
| `leading-[` | 79 |
| `h-[` | 55 |
| `max-w-[` | 39 |
| `px-[` | 36 |
| `pb-[` | 29 |
| `pt-[` | 24 |
| `tracking-[` | 20 |
| `mb-[` | 8 |
| `bg-[` | 2 |
| **total** | **1.217** |

El brief pide «cero valores arbitrarios». Son 1.217 call sites repartidos en 23
rutas. Llevarlos todos a token en esta rama es un reemplazo mecánico masivo con
riesgo alto de romper algo por un sed mal puesto, y la mayoría vive en páginas
internas que esta rama no rediseña. **Necesito una decisión de alcance — §8 de
`DIRECCION-VISUAL.md`.**

---

## 4. Estado tipográfico

### Las familias viejas: ninguna en código
`Steelfish`, `Bronx` y `Futura` aparecen **28 veces en `src/`, todas en
comentarios** — el encabezado de `globals.css` que documenta por qué se fueron, y
el JSDoc de `Type.tsx`. Ni una referencia ejecutable. El grep de control de FASE 5
va a dar positivo mientras esos comentarios existan, así que hay que reescribirlos
para que nombren las fuentes reales. También aparecen en 4 archivos de `docs/`.

### Lo que hay, y funciona
Big Shoulders Display + Jost, las dos variables, las dos OFL, **auto-hospedadas**
en `public/fonts/*.woff2` vía `@font-face` en `globals.css` (35 KB y 27 KB). No hay
`<link>` a `fonts.googleapis`. El brief pide `next/font/google`; lo que hay es
equivalente o mejor —cero request externo— pero no es lo que pide el brief. **§8.**

### La escala, y por qué la jerarquía no se lee
Medido en `Type.tsx`:

| rol | hoy | objetivo del brief | salto |
|---|---|---|---|
| h1 hero | `--text-hero`, clamp(56→112px) | clamp(3.5rem, 9vw, 9rem) = 56→**144px** | +29 % arriba |
| h2 sección | `text-d5 md:text-d4 lg:text-d3` = 28→36→**46px** | clamp(2.5rem, 6vw, 5.5rem) = 40→**88px** | **+91 %** |
| h3 | `text-d6 lg:text-d5` = 22→28px | — | |
| bajada | `--text-lead` clamp(16→18px) | clamp(1.0625rem, 1.6vw, 1.375rem) = 17→22px | +22 % |

El h2 a 46px en un lienzo de 1440 es la razón concreta de que «no se lea SaaS
moderno». La relación h2/bajada hoy es **46/18 = 2,6×**; el brief pide ≥3,5×. Con
88/22 = **4,0×**. La jerarquía se arregla subiendo el título, que es exactamente lo
que dice el brief.

### Tres decisiones del brief que contradicen decisiones ya aprobadas
Están en el código con el pedido de Camila citado textual. No las cambio sin
preguntar.

| Eje | Aprobado antes | Pide el brief |
|---|---|---|
| **Peso del display** | `font-normal` (400). `Type.tsx:76`: «Camila: *en regular nunca en peso alto*» | 600–800 |
| **Tracking del display** | positivo, 0,02→0,05em en escala óptica. `globals.css:265`: el tracking negativo «era el motivo por el que Camila rechazó la Steelfish: *se ve muy pegada*» | −0,01em |
| **Caja** | `uppercase` siempre en display, `Type.tsx:80` | el brief no lo menciona |

A 144px, caps + peso 700 + tracking negativo es un objeto muy distinto del que
está aprobado. **§8.**

### Eyebrows: sobran
Contados en la home: `What's on`, `In the yard`, `Happy hour`, `How this place
works`, `Three places one gate`, `Eat`, `Drink`, `Rent`, `Planning a work event?`,
`Find us`, `Contact`, `Location`, `Parking`, `Follow` — **14**. El brief permite
máximo 3.

---

## 5. Estado del motion

Lo que hay en `shared/Motion.tsx`, y está mejor de lo que el brief supone:

| pieza | estado |
|---|---|
| `Reveal`, `StaggerGroup` + `RevealItem` | ✅ existen y son reutilizables |
| `MaskedLines` | ✅ **ya es el reveal por líneas con máscara** que pide el brief para titulares |
| `HeroFadeUp`, `Marquee`, `DragCarousel`, `CountUp` | ✅ |
| `useReducedMotion` | ✅ respetado en todos; los loops del muro y del marquee tienen fallback CSS |
| `once: false` | ✅ **cero ocurrencias** |
| `italic` | 1 violación real (`app/sunset-bar/page.tsx:203`). Las otras 2 son `not-italic` en `<address>`, que es lo correcto |
| Lenis | ✅ corre en `SmoothScroll.tsx`, se apaga entero con reduced-motion |
| `.transition` | ✅ `PageTransition.tsx` — cortina `bg-deep`. Se preserva; sólo se revisa el color |

### Lo que falta
- **No hay `lib/motion.ts`.** Los tokens viven en `Motion.tsx` como `EASE_BRAND`,
  `DURATION`, `REVEAL_OFFSET`, `STAGGER`, `REVEAL_AMOUNT`.
- Los valores están **por debajo** de lo que pide el brief:
  `DURATION.base 0,45` vs `dur.reveal 0,70` · `STAGGER 0,06` vs `0,08` ·
  `REVEAL_OFFSET 24` vs `dist.text 32` / `dist.media 48`.
  `EASE_BRAND [0.16, 1, 0.3, 1]` **ya es** el `ease.out` del brief.
- `viewport` usa `{ once: true, amount: 0.2 }`, no el `margin: "0px 0px -20% 0px"`
  del brief.
- **Cero salidas.** No hay un solo `useScroll` / `useTransform` en el repo.
- **Un solo mecanismo para todo.** `Reveal` es fade + y para cualquier contenido.
  No hay `clip-path` para imágenes ni `ParallaxMedia`. Es justo el anti-patrón que
  el brief llama «la firma de una web autogenerada».
- El ítem que abre en la sección de servicios (mandato de agencefoudre) no existe
  todavía en la home.

---

## 6. Lo que NO se toca en esta rama

Copy, rutas, metadata, SEO, `content/`, `lib/seo.ts`, `lib/calendar.ts`,
`lib/nav.ts`, las 22 páginas internas y los scripts de `scripts/`. Ningún
componente se borra: si algo se reemplaza queda en el árbol y anotado acá.
