# Prompt maestro — variante de diseño para Claude Design

> Documento de trabajo. Se pega **entero** como prompt en Claude Design.
> Referencia de layout: **https://defoodtruckclub.nl/**, auditada el 2026-09-10
> (DOM, estilos computados y capturas desktop 1440 + mobile 390).
> Copys extraídos del código vigente (`src/components/sections/*`, `src/lib/nav.ts`,
> `src/lib/brand.ts`). Marca y perfil del cliente desde `docs/current-site-inventory.md`,
> `design-audit/DIRECCION-VISUAL.md` y el brand book.

---

## ROL Y ENCARGO

Sos un director de arte digital senior. Diseñá **la home completa** de
*Rooftop at Riverside* (Bonita Springs, Florida), desktop y mobile, tomando como
**referencia estructural literal** el sitio **https://defoodtruckclub.nl/**.

**Cómo se usa la referencia:**
- **Se toma:** el orden y el tipo de bloques, el sistema de composición, la escala
  tipográfica y sus contrastes, el tratamiento de tarjetas y bordes punteados, las
  transiciones de superficie con esquinas redondeadas grandes, los carruseles con
  flechas circulares y puntos, las marquesinas horizontales, las píldoras, los
  stickers circulares montados sobre los bordes, y el repertorio de animación.
- **Se cambia:** **todos** los textos (los nuestros, literales), **la paleta**
  (la nuestra), **las tipografías** (las nuestras) y **el contenido** de cada
  bloque, que es distinto y manda sobre la forma.
- **No se toma nada propietario de ellos:** ni su mascota (el pájaro), ni su
  logotipo, ni sus ilustraciones, ni sus fotos, ni sus fuentes de pago
  (Thunder LC, Perfectly Nineties), ni sus logos de clientes. Todo eso se sustituye
  por lo nuestro según el mapeo de la sección 5.

Entregá:
1. La home completa, desktop (1440) y mobile (390).
2. El sistema aplicado: tipografía, color, superficies, radios, tarjetas, píldoras.
3. La especificación de motion, bloque por bloque.

---

## 1. PERFIL DEL CLIENTE Y CONTEXTO DE NEGOCIO

**Rooftop at Riverside** — Bonita Springs, Florida. Abrió en enero de 2024.
Parte de **Paradise Food Group**. Negocio familiar: la familia **Magnus**, locales
de Bonita, después de cuatro años de planificación.

**Qué es, literalmente:** una **barra en la azotea** sobre un **patio con cuatro
food trucks independientes**, en el downtown de Bonita Springs, enfrente de
Riverside Park. Cinco negocios en una misma dirección, una sola escalera.

**El modelo, que es lo que confunde a la gente:**
- Los cuatro camiones son **negocios ajenos**. Pedís en la ventanilla, pagás a ese
  camión: cuenta separada, tarjeta separada, ticket separado.
- **La barra de arriba es del venue**. Es la única cuenta propia y el único menú
  con precios en el sitio.
- **No hay servicio de mesa.**
- El lugar se alquila entero para eventos privados: azotea, patio, patio cubierto,
  o todo con los portones cerrados y una sola persona coordinando.

**Las tres verticales, por orden de facturación:**
1. **Eventos privados** — la que más factura; merece el énfasis visual más fuerte.
2. **Sunset Bar** — cócteles, tiradas locales, happy hour.
3. **El patio y los camiones** — roster rotativo, entrada libre.

**Audiencias, en este orden:**
1. Local de Bonita / Naples / Estero que quiere saber **qué hay esta noche**.
2. Organizador de eventos —corporativo, fiesta de fin de año, recaudación,
   celebración familiar— evaluando el lugar.
3. Turista o visitante de Southwest Florida buscando atardecer, cócteles y comida.

**Horarios (definen el tono):** lunes y martes cerrado. Mié–jue 15–20 h.
Viernes 15–24 h. Sábado 11–2 h. Domingo 11–20 h. Los camiones abren una hora más
tarde. **Happy hour miércoles a viernes, 15–18 h.**

### La tesis de posicionamiento

**Esto no es un restaurante.** El sitio anterior lo vendía como «parque de food
trucks de dos pisos» y ése es el error que hay que corregir. Es un **espacio de
eventos con barra propia y cuatro cocinas independientes**, al aire libre, y su
hora natural es **la tarde y el atardecer, no la medianoche**.

De ahí la línea que gobierna la estética: **el sitio tiene que ser la hora, no el
lugar.** Entrar debería sentirse como salir de la escalera al techo a las seis de
la tarde en Florida: luz que lava todo, aire blanco, y el verde de marca apareciendo
sólo donde hay sombra. No es un bar oscuro con luces: es una **terraza al aire libre
a contraluz**.

Eso es lo que corrige el desvío más probable al copiar la referencia: **De Foodtruck
Club es un sitio oscuro y nocturno. El nuestro no.** Ver la sección 4.

### Nomenclatura prohibida (el brief la veta explícitamente)

Nunca usar, ni como copy ni como concepto rector:
- «two-story food truck park» / «parque de food trucks de dos pisos»
- «upper deck», «our two-story bar»
- «Eat. / Drink. / Paradise.» como títulos de sección
- «the ultimate dining experience», «bites and family favorites»
- Cualquier fórmula que haga leer el lugar como **restaurante**.

---

## 2. LA REFERENCIA, DESARMADA

Lo que sigue es la auditoría real de https://defoodtruckclub.nl/ — no una
descripción de memoria. Es el molde que hay que reproducir.

### 2.1 Su sistema visual

| Rol | Ellos | Nosotros (ver §3 y §4) |
|---|---|---|
| Display | **Thunder LC**, ultracondensada, 800, MAYÚSCULAS, H1 a 140 px con line-height 0.85 | **Big Shoulders** |
| UI / etiquetas | **DM Sans** | **Jost** |
| Párrafos largos | **Perfectly Nineties** (serif) | **Jost light a cuerpo grande** — ver §3 |
| Tinta | `#201E1D` (casi negro cálido) | `ink` `#0A1F1E` |
| Papel | `#F2EDE9` (crudo cálido) | `bone` `#FAF6EA` |
| Losa oscura | `#201E1D` | `deep` `#014545` |
| CTA / acento 1 | rosa `#FFB3DB` | `sunset` `#F58521`, **con texto negro** |
| Acento 2 (formas grandes) | lima `#CAF291` | `mint` `#C4F2EC` |
| Positivo | verde `#008A49` | `teal600` `#028382` |
| Negativo | rojo `#BD2018` | `terra` `#A62000` |
| Radios | 21.6 / 43.2 / 86.4 px, píldoras totales, círculos | 24 / 44 / 88 px, píldoras totales |

**Los cinco gestos que definen el estilo — hay que reproducirlos todos:**
1. **Titulares gigantes ultracondensados en mayúsculas**, con la interlínea muy
   apretada, ocupando el ancho completo y **partidos en dos líneas desalineadas**
   (una a la izquierda, la siguiente empujada a la derecha).
2. **Bordes punteados** (dashed) alrededor de tarjetas y píldoras, en color, sobre
   fondo crudo. Es su firma gráfica.
3. **Stickers circulares** montados a caballo del borde de una foto o una tarjeta,
   rompiendo la caja: sello circular con texto en curva, badge redondo tipo «NEW»,
   estrella dentada con un número.
4. **Transiciones de superficie con esquinas muy redondeadas**: el bloque claro
   sube sobre el oscuro con radios de 44–88 px, como una cortina. Nunca un corte
   recto.
5. **Marquesinas horizontales** de logos y de fotos, y **carruseles** con flechas
   circulares a los costados, los slides vecinos asomando cortados y puntos de
   paginación centrados debajo.

### 2.2 Su motion

- **GSAP 3.14 + ScrollTrigger** — 158 triggers en la home. Cada sección tiene su
  propio revelado al entrar en viewport.
- **barba.js** para transiciones entre páginas.
- Contadores numéricos que animan desde 0 al entrar en pantalla.
- Marquesinas en loop continuo.
- Píldora del hero con **texto que rota** (ellos ciclan saludos en cinco idiomas).
- Sellos circulares que **giran lento** de forma permanente.

### 2.3 Su orden de bloques (alturas reales, desktop 1440)

`utility bar` → `header` → `hero` → `intro 2-col` (498 px) →
`image divider` a sangre, cierre oscuro (536 px) → `slider de conceptos`, oscuro
(808 px) → `line divider` → `compare`, oscuro (1145 px) → *cortina clara* →
`marquesina de clientes` (70 px) → `marquesina de fotos` (454 px) →
`steps slider` con estrella dentada gigante (1011 px) → `cases slider` (731 px) →
`stats`, oscuro (415 px) → `bloque de contacto` → `footer` de 4 columnas.

---

## 3. NUESTRA TIPOGRAFÍA

| Rol | Familia | Uso |
|---|---|---|
| **Display** | **Big Shoulders** (variable, 100–900) | Todo lo que en la referencia es Thunder: titulares gigantes en MAYÚSCULAS, números de los contadores, títulos de tarjeta, etiquetas de nav. Es condensada, alta e industrial: aguanta los 140 px. |
| **Cuerpo y UI** | **Jost** (variable, 100–900) | Bajadas, párrafos, navegación, botones, píldoras, etiquetas, datos. |

**⚠️ La marca no tiene serif.** La referencia apoya buena parte de su carácter en
el contraste *condensada brutal ↔ serif de los noventa*. Ese contraste hay que
reconstruirlo **sin serif**: los párrafos largos van en **Jost Light (300) a 20–22 px
con interlínea 1.6**, bien anchos de medida. El contraste lo da el salto de peso y
de escala, no un cambio de familia. Si considerás que hace falta una tercera
familia, **proponela aparte como decisión explícita** — no la des por hecha.

**Escala vigente, como piso:**
- Hero: `clamp(3.5rem, 9vw, 9rem)`, line-height **0.88** → subilo hasta 0.85 si
  seguís la referencia
- H1 `clamp(3rem, 7vw, 6.5rem)` LH 0.90 · H2 88 px LH 0.92 · H3 40 px LH 1
- Intro 25 px / 1.4 · Lead 22 px / 1.55 · Base 16 px / 1.6
- Dato 15 px · Micro 13 px · Caption 12 px
- Eyebrow: MAYÚSCULAS, tracking **0.12 em**, Jost medium

Los títulos display van **sin tracking negativo**: Big Shoulders ya es condensada y
el tracking negativo la empasta.

---

## 4. NUESTRO COLOR

Paleta del brand book, con hex exactos.

| Token | Hex | Rol propuesto en este layout |
|---|---|---|
| `ink` / `body` | `#0A1F1E` | toda la tinta sobre claro |
| `bone` | `#FAF6EA` | **la superficie base del sitio** (el «papel» de la referencia) |
| `paper` | `#FFFFFF` | tarjetas y paneles que se levantan del papel |
| `deep` | `#014545` | las losas oscuras |
| `deeper` | `#013434` | capas dentro de una losa oscura |
| `sunset` | `#F58521` | **CTA primario y acento de titular sobre oscuro** |
| `sunset-hover` | `#E0741A` | hover del CTA |
| `mint` | `#C4F2EC` | las formas grandes de acento (la estrella dentada, la píldora del hero) |
| `cream` | `#FDF0B4` | píldoras y badges chicos. **No** fondos grandes |
| `teal600` | `#028382` | los ✓ y el borde punteado «positivo» |
| `terra` | `#A62000` | los ✗ y el borde punteado «negativo»; acento de titular sobre claro |
| `river` | `#0EB6B8` | iconografía y patrón. **Nunca como texto** |
| `muted` | `#487270` | texto secundario sobre claro |
| `muted-dark` | `#A8C6C4` | texto secundario sobre oscuro |
| `fog` | `#DED8C7` | filetes y bordes de 1 px |
| `tomato` / `plum` / `magenta` | `#EB452C` / `#402639` / `#A24584` | reserva |

### Reglas de contraste — medidas con WCAG 2.1, no negociables

- **`sunset` y `river` NUNCA como texto sobre fondo claro** (2.54:1 y 2.50:1). Sí
  como **relleno**.
- Sobre relleno naranja o teal, **el texto va en NEGRO** (8.26:1 y 8.40:1), nunca
  en blanco. Esto aplica al CTA principal, que en la referencia es la píldora rosa.
- Texto de color admitido sobre `paper`: `ink`, `body`, `muted`, `deep`, `plum`,
  `terra`, `magenta`, `teal600`. Sobre `bone`: los mismos **menos `teal600`**.
- Sobre `deep`: texto en `paper` o `cream`. `sunset` sobre `deep` da 4.26:1 →
  **sólo una palabra de un titular grande, jamás cuerpo**.

### ⚠️ El reparto de superficie — acá NO seguimos a la referencia

De Foodtruck Club tiene **~41 % de su home en oscuro**. Nosotros vamos a
**70–75 % claro y 20–25 % oscuro**, con `sunset` ≤ 5 % y `cream` ≤ 5 %.

**Sólo dos zonas oscuras en toda la página, más el footer, y nunca dos seguidas:**

1. **What's on** — el carrusel de la semana.
2. **Events + Stats**, contiguas, leídas como una sola losa: es la vertical que más
   factura y merece el único énfasis fuerte de la página.
3. El footer.

Todo lo demás va sobre `bone`, con tarjetas en `paper`. Cada entrada y salida del
oscuro se hace con la **cortina de esquinas redondeadas** de la referencia.

---

## 5. LA HOME, BLOQUE POR BLOQUE

Mapeo directo: **bloque de la referencia → nuestro contenido**. El texto está en
**inglés (EE. UU.) y se usa literal**: no traducir, no reescribir, no inventar copy
nuevo. Los datos duros son reales y se muestran tal cual.

---

### 0 · UTILITY BAR — *su barra superior oscura*

Franja fina en `deep`. Izquierda: iconos de Instagram, Facebook y Google.
Derecha: `Gift Cards` · `FAQ`.

---

### 1 · HEADER — *idéntico en estructura al de ellos*

Sobre `bone`, con un filete de 1 px abajo. **Nav a la izquierda, isotipo centrado,
acciones a la derecha.**

- Nav: `Sunset Bar` · `Food Trucks` · `What's On` · `Events` · `The Yard` · `More ▾`
- Derecha: `Contact` (texto) + **`Plan an Event`** (píldora `sunset`, texto negro)
- **Mobile:** hamburguesa + `MENU` a la izquierda, isotipo centrado, píldora a la
  derecha. Exactamente el patrón de la referencia.

Menú **More**, cada ítem con su bajada:
- **Our Story** — "The Magnus family and four years of planning."
- **The Experience**
- **Market** — "Local vendors and handmade goods in the yard."
- **Events Packet**
- **Join Us** — "Play here, park a truck here, work here."
- **FAQ** — "Parking, dogs, kids and how ordering works."
- **Visit** — "Hours, parking and directions."
- **Contact** — "Three inboxes, so you reach the right one."

---

### 2 · HERO — *su hero: titular partido con la foto encastrada*

La composición exacta de la referencia:

- **Línea 1 del titular, alineada a la izquierda:** `BONITA COMES`
- A su derecha, en la misma altura, una **píldora `mint`** con un **círculo `sunset`**
  pegado al extremo derecho. Ellos rotan saludos en cinco idiomas; **nosotros rotamos
  el estado en vivo del lugar**: `Open until 8 PM` / `Happy hour until 6` /
  `Live music tonight` / `Closed — back Wednesday`. Es el mismo gesto, con
  información útil.
- **Línea 2, empujada a la derecha y superpuesta al borde superior de la foto:**
  `TOGETHER` — en `terra`, que es el acento sobre claro.
- **La foto grande**, con radios de 44 px, **entra por debajo de la línea 1 y por
  encima queda la línea 2**. Azotea al atardecer, o el patio lleno. Puede ser video.
- **Bajada:** `Rooftop bar. Four kitchens. Walk in.`
- **CTA primario:** `What's on tonight` → `/whats-on` (píldora `sunset`, texto negro)
- **CTA secundario:** `See the yard` → `/the-yard` (píldora de contorno)
- **Mobile:** las dos líneas apiladas, una foto chica encastrada a la izquierda entre
  ambas, y la foto grande debajo. Como ellos.

---

### 3 · WHAT'S ON — *su slider de conceptos* · **LOSA OSCURA 1**

Fondo `deep`, entrada por cortina de esquinas redondeadas.

- **Título centrado a dos colores** (el gesto de «ONZE **FOODTRUCK** CONCEPTEN»):
  `THIS WEEK` en `paper` + `IN THE YARD` en `sunset`.
  Estado alternativo cuando está cerrado: `CLOSED TODAY, BACK WEDNESDAY`.
- **Carrusel** con flechas circulares a los costados, **los slides vecinos asomando
  cortados** por el borde, y puntos de paginación centrados debajo.
- Cada slide es una tarjeta con **foto recortada y sticker**: badge `TONIGHT` si es
  hoy, título del evento, resumen corto y el espacio donde ocurre. **La de hoy va
  primera y más grande.** Eventos reales: música en vivo cinco noches, Bingo los
  miércoles, DJ sets los sábados.
- **Píldora CTA centrada debajo:** `Full calendar` → `/whats-on`
- **Pie de la losa, sobre un filete:**
  - Eyebrow `IN THE YARD` · link `All four trucks` → `/food-trucks`
  - `[Nombres de los cuatro trucks, separados por · ]. The roster rotates, and each truck takes its own orders and its own payment.`
  - `**Happy hour** Wednesday – Friday, 3–6 PM — $4 drafts · $5 house wines · $6 house drinks`

---

### 4 · HOW THIS PLACE WORKS — *su intro a dos columnas*

Vuelve el claro por cortina redondeada. `bone`.

- **Columna izquierda:** H2 display gigante en dos líneas —
  `FIVE BUSINESSES,` / `ONE SET OF STAIRS.`
- **Columna derecha:** el párrafo largo, en Jost Light 20–22 px —
  "It catches people out the first time, so here it is plainly."
- Debajo, link con flecha: `See how the yard is laid out` → `/the-yard`

---

### 5 · LOS TRES PASOS — *su «STAP» dentro de la estrella dentada*

El bloque más característico de la referencia. **Estrella dentada gigante en `mint`**,
centrada, ocupando casi el ancho de la caja, con flechas circulares a los costados y
puntos de paginación. Ellos tienen seis pasos; **nosotros tenemos tres**.

Dentro de la estrella, por slide: la palabra `STEP` en display gigante + una
**estrella chica en `teal600`** con el número, el título del paso, el párrafo y las
etiquetas.

**01 — `Order at whichever window you want`**
"Four trucks park in the yard and each one is somebody's own business. You order at
the window, you pay that truck. Separate line, separate card, separate receipt."
Etiquetas: `Four independent kitchens` · `Order at the window` · `A tab per truck` · `No table service`

**02 — `Get your drinks upstairs`**
"The Sunset Bar on the roof is ours. Cocktails made that morning, drafts from
breweries twenty minutes away. It's the one tab we run, and the only menu on this
site with prices."
Etiquetas: `Cocktails made daily` · `Local drafts` · `Happy hour Wednesday – Friday, 3–6 PM` · `The one tab we run`

**03 — `Stay for whoever's playing`**
"Live music five nights a week, Bingo on Wednesdays, DJ sets late on Saturdays.
Almost all of it is free and none of it needs a ticket."
Etiquetas: `Live music five nights` · `Bingo Wednesdays` · `DJ sets Saturdays` · `No ticket, no cover`

---

### 6 · FOTO DIVISORIA CON SELLO — *su image divider*

Foto a sangre del patio o de la azotea, con las **esquinas superiores muy
redondeadas** del bloque de arriba montándose encima. Sobre el borde superior
izquierdo, a caballo, un **sello circular que gira lento**, con texto en curva:
`ROOFTOP AT RIVERSIDE · BONITA SPRINGS, FL ·` alrededor del isotipo del camión.

---

### 7 · THREE DOORS — *su bloque «compare», de dos tarjetas a tres*

`bone`. Ellos comparan dos columnas con **borde punteado verde vs. rojo**; nosotros
usamos el mismo lenguaje de tarjeta punteada, pero son **tres puertas, no una
comparación**.

- **Título centrado a dos colores:** `NOT A RESTAURANT.` en `ink` + `THREE OF THEM`
  en `terra`.
- **Bajada:** `A rooftop bar, a yard of independent kitchens, and a venue you can rent. Same address, three different nights.`
- **Tres tarjetas en `paper` con borde punteado**, cada una de un color —
  `teal600`, `sunset`, `terra`— con icono lineal arriba:

| Título | Párrafo | Link |
|---|---|---|
| `Four kitchens in the yard` | "Four independent kitchens under the rooftop, each one its own business. You order at the truck — the bar upstairs is ours." | `Meet the trucks` |
| `The bar over the river` | "Craft cocktails made daily, local drafts, and the best west-facing seat in Bonita Springs." | `See the bar` |
| `The whole place, closed` | "The rooftop, the yard, the patio — or the entire venue with the gates shut, and one person coordinating all of it." | `Plan an event` |

Sobre el borde superior de la tarjeta central, **montado a caballo, el isotipo como
sticker** — igual que el logo de ellos sobre la primera columna.

---

### 8 · MARQUESINA DE TRUCKS — *su marquesina de logos de clientes*

Tira horizontal en loop continuo. Ellos ponen TUI, Siemens, Red Bull. **Nosotros
ponemos los cuatro food trucks**: nombre en display o logo, separados por un punto.
Debajo, en una línea: "The roster rotates, and each truck takes its own orders and
its own payment."

---

### 9 · MARQUESINA DE FOTOS — *su impression marquee*

Tira horizontal de fotos con radios grandes y **alturas desiguales**, en loop lento.
Azotea al atardecer, gente en el patio, cócteles, los camiones, música en vivo.

---

### 10 · EVENTS — *su cases slider* · **LOSA OSCURA 2 (primera mitad)**

Entra el oscuro por cortina. Fondo `deep` con **foto a sangre** detrás.

- **Titular partido, con badge circular montado** (su badge rosa «NEW» → nuestro
  badge `sunset` con `PRIVATE EVENTS`):
  `WE CLOSE THE WHOLE PLACE` / `FOR YOU` — la segunda línea en `sunset`.
- **Bajada:** "Holiday parties, client nights, fundraisers and reunions. You get the
  rooftop, the yard and four kitchens — and one person coordinating all of it."
- **Tres tarjetas** con foto arriba, título en display y flecha `→`, con los tres
  argumentos:
  - "We coordinate the trucks, so you deal with one person and not four vendors"
  - "The bar is ours: open bar, drink tickets or consumption, however you want to run it"
  - "The rooftop, the yard, the patio — or the entire venue with the gates shut"
- **Píldora CTA centrada:** `Plan your event` → `/events/inquire`

---

### 11 · STATS — *sus contadores* · **LOSA OSCURA 2 (segunda mitad)**

Sigue en `deep`, sin corte: se lee como una sola losa con Events. Cuatro números
gigantes en display que **animan desde 0**, con la etiqueta debajo en Jost Light:

| Número | Etiqueta |
|---|---|
| `4` | Independent kitchens |
| `5` | Nights of live music |
| `2024` | Open since |
| `$0` | Cover charge |

⚠️ Sólo estos cuatro datos, que son verificables. **No inventar métricas.**

---

### 12 · FIND US — *su bloque de contacto gigante*

Cortina clara. `bone`.

- **Titular partido a lo ancho, con las píldoras encastradas entre las líneas** —
  el gesto exacto de «VRAGEN? / TREK AAN DE BEL»:
  `DOWNTOWN,` / `ACROSS FROM RIVERSIDE PARK`
  - Píldora `mint` con el email: `info@eatdrinkparadise.com`
  - Píldora de **borde punteado** con el teléfono: `(239) 268-0080`
  - Botón circular `sunset` con el icono de Instagram
- Debajo, la grilla de tres columnas:
  - **Ficha** — eyebrow `Location`: `27333 Old 41 Rd, Bonita Springs, FL 34135` ·
    eyebrow `Parking`: "Street parking on Old 41 and public lots around Riverside
    Park." + link `Details` · botón `Get directions`
  - **Mapa** embebido, con radios grandes
  - **Horarios**, con **dos sets separados** (`Bar` y `Trucks`), el día de hoy
    destacado y un estado en vivo del tipo `Open · closes 8 PM` /
    `Closed · opens Wednesday 3 PM`:

| | Bar | Food Trucks |
|---|---|---|
| Monday | Closed | Closed |
| Tuesday | Closed | Closed |
| Wednesday | 3:00 PM – 8:00 PM | 4:00 PM – 8:00 PM |
| Thursday | 3:00 PM – 8:00 PM | 4:00 PM – 8:00 PM |
| Friday | 3:00 PM – 12:00 AM | 4:00 PM – 11:00 PM |
| Saturday | 11:00 AM – 2:00 AM | 12:00 PM – 11:00 PM |
| Sunday | 11:00 AM – 8:00 PM | 12:00 PM – 8:00 PM |

---

### 13 · FOOTER — *sus cuatro columnas con filete bajo cada título*

Fondo `deep`. Descriptor arriba: "A rooftop bar over a curated food truck park, in
downtown Bonita Springs." · `Bonita Springs, Florida` · CTA `Plan an event`.

Cuatro columnas, cada título en display con un filete debajo:

| THE PLACE | EVENTS | GET TO KNOW US | VISIT |
|---|---|---|---|
| Sunset Bar | Private Events | Our Story | Visit Us |
| Food Trucks | Event Spaces | The Experience | Contact |
| The Yard | Corporate | Join Us | FAQ |
| The Market | Holiday Parties | | Gift Cards |
| | Request a Proposal | | |

Barra inferior de agencia: **Resto Experience — Content, marketing & web design**.

---

## 6. MOTION

Mismo repertorio que la referencia —**GSAP + ScrollTrigger**, un revelado propio por
sección— con estas piezas concretas:

- **Hero:** revelado tipográfico por máscara, línea a línea, con stagger; la foto
  entra con un `clip-path` que se abre; la píldora de estado aparece última.
- **Píldora del hero:** el texto **rota** entre los estados del lugar, con transición
  vertical tipo rodillo.
- **Sello circular:** rotación lenta, continua e infinita.
- **Cortinas de superficie:** al entrar y salir del oscuro, el bloque siguiente
  **sube** con sus esquinas redondeadas montándose sobre el anterior, con `scrub`
  ligado al scroll.
- **Marquesinas:** loop continuo, y que **reaccionen a la velocidad del scroll**
  (aceleran y cambian de dirección) — es el detalle que separa una marquesina buena
  de un `animation: scroll` plano.
- **Stats:** los cuatro números animan desde 0 al entrar en viewport.
- **Carruseles:** arrastre, snap, flechas circulares, y los slides vecinos asomando
  cortados. En mobile, scroll horizontal con snap.
- **Tarjetas:** hover con elevación corta y el borde punteado que se desplaza.
- **Transiciones de página** al estilo barba.js.

**Si querés ir más lejos que la referencia**, el lugar es el hero: un plano WebGL /
Three.js con un **gradiente de atardecer que avanza con el scroll** —de mediodía a
noche, que es literalmente el recorrido de la página— o una transición shader entre
fotos. Un solo momento, con propósito, y con fallback estático.

---

## 7. RESTRICCIONES — se cumplen sí o sí

- **`prefers-reduced-motion`**: toda animación tiene su camino sin movimiento; el
  contenido queda visible y legible sin el JS de animación. Las marquesinas se
  detienen.
- **Accesibilidad AA**: los ratios de la sección 4 son medidos, no estimados. Foco
  visible, jerarquía de headings correcta, targets táctiles de 44 px. Los carruseles
  necesitan navegación por teclado y no pueden ser la única vía al contenido.
- **Mobile-first real.** El grueso del tráfico es gente parada en la vereda de
  Old 41 mirando si hay música esta noche. Los bloques de la referencia tienen que
  degradar a: titulares apilados, carruseles a scroll horizontal con snap, tarjetas
  a una columna, y la estrella dentada reducida sin perder el gesto.
- **Performance:** las marquesinas y el WebGL no pueden costar el LCP. Carga
  diferida, y `will-change` sólo donde haga falta.
- **Nada propietario de la referencia**: ni su mascota, ni su logo, ni sus fuentes,
  ni sus fotos, ni sus logos de clientes.

### Lo que NO quiero

- El sitio en clave oscura. La referencia lo es; **nosotros no**: 70–75 % claro.
- Rosa, lima ni el negro cálido de ellos. Nuestra paleta, entera.
- Copy nuevo, inventado o traducido.
- Métricas inventadas en el bloque de stats.
- Los bordes punteados y los stickers convertidos en manierismo: son un acento
  fuerte, se usan donde el mapeo los pide y no en cada caja.
