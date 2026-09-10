# Antes / después, sección por sección

Baseline: `main` en 9569ef6, capturado con `design-audit/shoot.mjs`.
Después: `redesign/light-tropical`, mismo setup, mismo script, mismos anchos.

Capturas en `baseline/` y `after/`. Comparativas montadas:
`COMPARAR-home.png` (lado a lado, escalado) y `COMPARAR-home-mobile.png`.

---

## El número global

| | antes | después | objetivo |
|---|---:|---:|---:|
| **oscuro** (`deep` + `deeper`) | **55,4 %** | **24,5 %** | 20–25 % |
| **claro** (`paper` + `bone`) | 40,3 % | 63,6 % | 70–75 % |
| `cream-deep` | 0,5 % | 1,2 % | ≤ 5 % |
| `sunset` | 0,6 % | 1,9 % | ≤ 5 % |
| foto / mapa / sin token | 2,3 % | **7,9 %** | — |
| **alto de página** (desktop) | 6.197px | 6.447px | — |

Medido sobre el píxel con `surface-split.mjs`, no estimado.

⚠️ **El claro quedó en 63,6 % y no en 70-75 %, y no es que falte claro: es que
ahora hay FOTOS.** La franja «foto / mapa / sin token» pasó de 2,3 % a 7,9 %
porque el hero tiene nueve piezas de material real donde antes había doce
recuadros vacíos, y «Three doors» tiene la banda del titular. Claro + foto =
71,5 %. Lo que bajó de verdad es el verde: de 55,4 a 24,5.

✅ **El oscuro entró en el techo: 24,5 %.** Estuvo en 25,1 % —un décimo
afuera— y quedó anotado como deuda. Lo cerró la banda de foto de «Three doors»:
la página creció 307px de material claro y con foto, así que el mismo verde
—Events, el footer y el cuadro `deep` de «Night»— pesa menos sobre el total. No
hubo que cambiarle el color a nada.

---

## Sección por sección

| # | Sección | Antes | Después | Alto |
|---|---|---|---|---|
| — | **Header** | barra `deeper` fija, logo reversado blanco, nav en `paper/70` | **claro**: `paper/85` con blur arriba, `paper` sólido + filete `fog` al scrollear. Logo lockup full color, nav en `ink`/`muted`. La sombra `rgba(0,0,0,.5)` de 30px salió: sobre claro era una nube gris | 64 / 76px |
| 1 | **Hero** | 100svh de `deep` sólido · titular a la izquierda a 112px · 12 recuadros grises rotulados «VIDEO» | **séptima forma**: pila centrada sobre `bone`, titular a 130px con acento `terra`, dos CTAs, y un **abanico de 9 cards** sobre un arco con 2 clips y 7 fotos reales. Salida ligada al scroll | 900 → **851px** |
| 2 | **What's on** | 3 tarjetas idénticas: mismo radio, misma `shadow-card`, mismo ancho. La de hoy diferenciada **pintándose de verde**. 3 placeholders «IMAGE MISSING» | **track de 4 cards** con `scroll-snap` nativo: foto arriba, bloque `bone` con la greca del brand book abajo. La de hoy es más ancha, no de otro color. 3 de 4 con foto real | 1.053 → **1.362px** |
| 3 | **Five businesses** | `Section tone="deep"`, **1.430px** de verde con la escalera diagonal dejando ⅔ de la grilla vacía. Los `01/02/03` en `river` sobre `deep` | **cuarta forma**: texto sticky a la izquierda y **tres cuadros de color con textura de grecas** a la derecha — crema/naranja/verde = tarde/atardecer/noche, o sea las tres horas del día en el orden de los pasos | 1.309 → **784px** |
| 4 | **Three doors** | ya era filetes de 1px (mandato WeWork cumplido). Pero: eyebrow + acento de titular + centrado + ícono en caja `bone` redondeada | h2 de 46 → 86px, alineado a la izquierda, **sin** el eyebrow de sección, **sin** el acento (era el tercero y el brief permite dos), ícono suelto sin caja, filetes en `fog`. Y el **titular partido en dos renglones con una banda de foto en el medio** — ver abajo | 665 → **968px** |
| 5 | **transición** | cenefa de olas lisa, `paper → deep` | **el horizonte**: la ola con el medallón de sol y palmera del Figma. El sol sube al entrar y **gira 360° en 90s** | 50 → **132px** |
| 6 | **Events banner** | card `deep/90` con radio y `shadow-float` DENTRO de una `Section tone="bone"`. 3 cajas `paper/10` con el mismo radio | **la banda oscura de la home**, a sangre. Sin radio ni sombra. Los 3 ítems pasan a filas con filete. Fondo: la aérea del patio entero. Salida ligada al scroll | 569 → **619px** |
| 7 | **transición** | cenefa `deep → paper` | igual — se queda. Entra por el horizonte y sale por la cenefa: dos piezas para dos cortes | 50px |
| 8 | **Find us** | `paper` con **dos cards `bg-deep`** de ~620px flanqueando el mapa. La sección leía oscura sin serlo | tres columnas como **listas**: filete de 1px arriba y contenido apoyado en la superficie. **El mapa es el único objeto con borde** | 1.029 → **1.111px** |
| — | **Footer** | `bg-deep` | igual. El pie es oscuro y no se discute | — |
| — | **Cortina de página** | telón liso `bg-deep` que sube | **dibuja una forma**: la cenefa de olas volteada como borde que barre. Cierra el mandato de ronnsquare que estaba pendiente | — |

---

## La banda intercalada en el titular de «Three doors»

Es lo último que entró y sale de una referencia que apareció a mitad de camino:
`design-audit/referencia-dftc/`, o sea **defoodtruckclub.nl**, un negocio de food
trucks. Su home abre con `LET'S CHANGE` / la foto / `CATERING!`. El mismo gesto
estaba anotado en `MOODBOARD.md` para `IMG_2905` desde la fase 1 y no se había
construido nunca.

| | |
|---|---|
| **dónde** | el h2 de «Three doors», partido en `Not a restaurant.` + banda + `Three of them` |
| **por qué ahí** | el copy ya venía partido por un punto, así que la foto cae en una pausa que existía. Y era la única sección de la home sin nada de material |
| **la foto** | `_RCZ8192` recortada a **4,95:1** — la barra de arriba con gente a lo largo. Se eligió midiendo el RECORTE en una hoja de contactos a 4,7:1 de las 24 candidatas sin usar, no mirando las fotos |
| **el recorte** | `foco: 0.564`, seis puntos por debajo del centro. Saca las dos telarañas de Halloween de la pared del fondo, que le ponían fecha a una home evergreen. Cuesta que las caras del borde superior quedan cortadas: en un 4,95:1 eso es el formato, la fecha no |
| **el alto** | `--banda-titular: clamp(5.5rem, 13vw, 12.5rem)` → 88px en mobile, 187px en 1440. Sale del h2: `6vw` con LH 0.92 es un renglón de 5.5vw, así que 13vw son **2,4 renglones** |
| **la medida** | `SectionHead` ganó `measure="full"`. Con el encabezado cortado en `max-w-head` la banda quedaba 240px más angosta que las tres columnas de abajo, y dos bordes apilados con distinta medida se leen como error. Ahora comparten grilla |
| **el markup** | los dos renglones y el `<img>` van **dentro del mismo `<h2>`**: mismo copy, mismas palabras, mismo orden. Un `<h2>` sólo admite contenido de frase, así que el `RevealMedia` va como `<span>` y no como `div` |
| **el motion** | `clip-path` que se abre **desde la izquierda**, en el sentido en que se lee el renglón que interrumpe |
| **el peso** | 127 KB de origen a 2080×420, 55 KB servidos en AVIF a 1920 |

---

## La trama de grecas, recalibrada

Dos cambios, los dos medidos, y uno de ellos **corrige un diagnóstico mío que
estaba mal**.

| | antes | después |
|---|---|---|
| celda de la greca | 34px en los cuadros, 26px en What's on | **20px en todo el sitio** |
| opacidad `deep` sobre `cream` | 15 % | **19 %** |
| opacidad `ink` sobre `sunset` | 15 % | **16 %** |
| opacidad `cream` sobre `deep` | 20 % | **18 %** |

`AUTOCRITICA.md` §2 decía que la trama del cuadro crema gritaba y que había que
BAJARLE la opacidad, apoyado en que el par `deep`/`cream` mide 9.44:1.
`design-audit/trama.mjs` compone cada trama sobre su propio campo, las pasa a
CIELAB y mide el ΔE: el cuadro crema era el **más suave** de los tres (11,7
contra 13,4 y 15,7). 9.44:1 mide si un texto se lee, no cuánto pesa una textura.
Las opacidades nuevas dejan a los tres en ΔE 14,4-14,7, o sea que la serie se
lee como serie.

Lo que sí gritaba era el **tamaño**: a 34px la greca es una figura que se cuenta
una por una. Comparado en pantalla a 34 / 26 / 20 / 15px, 20px es donde pasa a
ser campo sin dejar de ser reconocible; a 15px deja de ser una greca.

---

## Tipografía

| | antes | después |
|---|---|---|
| h1 hero | clamp 56 → **112px**, peso 400, tracking +0,02em | clamp 56 → **144px**, peso **600**, tracking **0** |
| h2 sección | `text-d5 md:text-d4 lg:text-d3` = 28 → 36 → **46px** | clamp 40 → **88px**, una sola clase |
| h3 | 22 → 28px (**el 22px violaba el piso de 24**) | clamp **28** → 40px |
| bajada | 16 → 18px, color por opacidad `body/75` | 17 → **22px**, color `muted` opaco medido |
| **h2 / bajada** | **2,6×** — por debajo del 3,5× donde la jerarquía se lee | **4,0×** |
| eyebrow | 13px / 0,24em | 12px / 0,12em |
| `role="label"` | condensada a **18px** — violaba el piso | geométrica 15/16px |
| familias | 2 (Big Shoulders + Jost), `@font-face` a mano | las mismas, con `next/font/local`: **preload** + métricas de respaldo ajustadas |
| escala de texto chico | **9 tamaños** con corchetes: 11, 12, 13, 14, 15, 16, 17, 20, 24px | 4 tokens: `caption` 12 · `micro` 13 · `dato` 15 · `base` 16 |
| escala de tracking | **7 valores** con corchetes, de 0,01 a 0,14em | 3 tokens de rol: `eyebrow` 0,12 · `label` 0,08 · `cta` 0,06 |

---

## Peso y assets

| | antes | después |
|---|---:|---:|
| fotos en la home | 1 (`event-a.jpg`, desenfocada) | **13** derivados + 2 clips |
| entrega del cliente | — | 681 MB de originales → **1,9 MB** de derivados (−99,4 %) |
| arte de marca del Figma | la cenefa + el azulejo | + **grecas** (148 KB → 6 KB) y **horizonte** (75 KB → 1,8 KB inline + 56 KB cacheado) |
| CSS emitido | 66,8 KB | 72,8 KB |

---

## Valores arbitrarios, en el alcance acordado

| categoría | antes | después |
|---|---:|---:|
| **espaciado en px** | ~200 | **0** |
| opacidades de trama | — | 3 · medidas con `trama.mjs`, documentadas en el call site |
| tipografía (`text`/`leading`) | 65 | 11 · quedan sólo en `Type.tsx`, que es el punto donde el sistema se DEFINE |
| `tracking` | 14 | **0** |
| unidades relativas (`vw`, `svh`, `%`, `ch`, `fr`, `minmax`) | — | 27 · no hay escala que las cubra |
| otras escalas (`z`, `aspect`, `rounded`, `blur`, `scale`, `transition`) | — | 19 |
| selectores de estado (`data-[…]`) | — | 5 · **no son valores**, son variantes |
| **total** | **290** | **82** |

La conversión de espaciado se verificó **píxel a píxel**: mismo alto de página y
cero diferencias fuera de las tres zonas con movimiento propio (los clips, el
sol que gira, el badge de dev de Next y el header fijo, que en una captura de
página completa aparece donde estaba el viewport).

---

## Verificación

| check | estado |
|---|---|
| `npx tsc --noEmit` | ✅ |
| `npx next build` | ✅ |
| `npm run a11y` — 20 páginas × 2 anchos | ✅ **0 violaciones AA** |
| `npm run check:motion` — layout idéntico sin movimiento, 6 rutas | ✅ |
| `npm run check:surfaces` — nunca dos secciones de color seguidas | ✅ |
| `npm run check:tokens` — `globals.css` ≡ `brand.ts` | ✅ |
| `npm run check:contrast` — 35 pares medidos | ✅ |
| `npm run check:css` — utilidades de tema emitidas | ✅ |
| desborde horizontal en 1440 / 1344 / 390 | ✅ ninguno |
