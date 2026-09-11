# Inventario del sitio actual — eatdrinkparadise.com

Auditado el **2026-09-08**. Wix. Sitemap generado el 2026-08-25.

**Esto es un inventario de contenido, no una referencia de diseño.** Se extraen datos,
textos reutilizables y assets. No se toma estructura, layout ni jerarquía visual.

---

## 1. Mapa de URLs — 23 rutas vivas

Las 22 del sitemap más `/ocn`, que no está en el sitemap. **Todas devuelven 200.**

### Con destino ya definido en el brief (14)

| URL actual | h1–h6 | → Destino | Estado |
|---|---|---|---|
| `/` | 4 | `/` | reescribir |
| `/this-is-us` | 1 | `/our-story` | 301 ✅ |
| `/eat` | 0 | `/food-trucks` | 301 ✅ |
| `/drink` | 0 | `/sunset-bar` | 301 ✅ |
| `/calendar` | 0 | `/whats-on` | 301 ✅ |
| `/hostanevent` | 1 | `/events` | 301 ✅ |
| `/neighborhood-market` | 2 | `/market` | 301 ✅ |
| `/entertainment` | 2 | `/join-us` | 301 ✅ |
| `/game-lounge` | 1 | `/the-experience` | 301 ✅ |
| `/find-us` | 2 | `/visit` | 301 ✅ |
| `/parking` | 1 | `/visit#parking` | 301 ✅ |
| `/primecarvery` | 0 | `/food-trucks/prime-carvery` | ⚠️ ver §3 |
| `/tropicalfusion` | 0 | `/food-trucks/tropical-fusion` | ⚠️ ver §3 |
| `/seameonwheels` | 0 | `/food-trucks/sea-me-on-wheels` | ⚠️ ver §3 |
| `/el-chilango` | 0 | `/food-trucks/el-chilango` | 301 ✅ |

### ⚠️ Sin destino en el brief — 8 rutas que hay que decidir

| URL | h1–h6 | Qué es | Propuesta |
|---|---|---|---|
| `/ocn` | — | **Ya es un 301 → `/seameonwheels`.** No es huérfana. | ver §2 |
| `/giveback` | 1 | **Contenido real.** Charity Partner Program: donación de $1/$3/$5 al cerrar la cuenta, 100% del neto a una organización distinta cada mes. Partner de agosto: Wonder Gardens de Bonita Springs. | ruta nueva o sección en `/our-story` — **decisión tuya** |
| `/tnt-sign-ups` | 19 | **Contenido real.** Sorteo "Enter to win free tickets", jueves durante Happy Hour, QR en el local, ganador anunciado los viernes por redes. Bases legales completas. | ruta nueva o `/whats-on` — **decisión tuya** |
| `/bar-games-waiver` | 1 | **Documento legal completo.** Términos de bar games: 21+, política de no-gambling, asunción de riesgo, código de conducta, derechos de imagen. | conservar; ¿`/legal/...`? |
| `/game-zone-waiver` | 1 | **Documento legal.** Waiver del camión de gaming. | conservar; ¿`/legal/...`? |
| `/blank` | 1 | Mezcla huérfana: un vendor form duplicado + la descripción de un cóctel (**Calusa Breeze**, ver §5). | 301 → `/market`; rescatar el copy |
| `/blank-1` | 6 | Plantilla de Wix sin tocar ("Welcome visitors to your site… Double click to edit"). | 410 o 301 → `/` |
| `/inquiry-services-page` | 5 | Plantilla de Wix sin tocar. Lorem genérico de agencia ("Custom Project", "Personal Solution Planning"). Nada que ver con el negocio. | 410 o 301 → `/events/inquire` |

> Los dos waivers son documentos legales redactados; no son relleno. `/game-zone-waiver`
> es además una dependencia del camión de gaming, que en el sitio nuevo vive en
> `/events/game-truck` y `/the-experience`.

---

## 2. ⚠️ La regla `/ocn` del brief rompe un 301 que ya funciona

El brief pide `/ocn → /food-trucks`. Pero `/ocn` **hoy no es una página huérfana**:

```
GET /ocn  →  HTTP/1.1 301 Moved Permanently
             location: https://www.eatdrinkparadise.com/seameonwheels
```

Y hay un dato que lo explica: **OCN Seafood Co. es un truck del roster actual** — aparece
en el menú impreso de enero 2026 (§4). O sea que `/ocn` no es una URL muerta, es la URL
de un truck vigente redirigida a la ficha de otro.

**Propuesta:** `/ocn → /food-trucks/ocn-seafood-co`, no a `/food-trucks`.
Mandarla al índice tira una URL que tiene equity y que apunta a un vendor activo.
**Necesito tu confirmación** — depende de si OCN Seafood Co. y Sea Me on Wheels son
el mismo negocio renombrado o dos distintos.

---

## 3. Food trucks: qué páginas existen y por qué el sitio está desactualizado

**Respuesta directa a lo que pediste:** existen **5** URLs de truck. Cuatro linkeadas
desde `/eat` y una que no.

| URL | Linkeada desde `/eat` | Copy | Fotos | Menú como imagen |
|---|---|---|---|---|
| `/primecarvery` | ✅ | 2 párrafos | 5 | — |
| `/tropicalfusion` | ✅ | **ninguno** | 4 | — |
| `/seameonwheels` | ✅ | 2 párrafos | 3 | `MENU_SEA_ME_ON_WHEELS_1.0.jpg` |
| `/el-chilango` | ✅ | 1 párrafo | 5 | `El Chilango menu V02A-Frame Menu_0.25x-80.jpg` |
| `/ocn` | ❌ **no linkeada** | (redirige) | — | — |

### El problema de fondo: el roster rotó y el sitio no

El menú de barra de **enero 2026** (el más reciente que publica el propio sitio) lista
los cuatro trucks vigentes con sus logos:

> **OCN Seafood Co.** · **Butcher's Blvd** (American Kitchen, EST 2023) · **El Chilango** · **Reggae Kitchen** (Caribbean & International Flavors)

Cruzado con las páginas del sitio:

| Truck en el menú de ene-2026 | ¿Tiene página? |
|---|---|
| OCN Seafood Co. | sólo un 301 a otra ficha |
| Butcher's Blvd | ❌ **no existe** |
| El Chilango | ✅ `/el-chilango` |
| Reggae Kitchen | ❌ **no existe** |

| Página en el sitio | ¿Está en el menú de ene-2026? |
|---|---|
| Prime Carvery | ❌ obsoleta |
| Tropical Fusion | ❌ obsoleta |
| Sea Me on Wheels | ❌ obsoleta |

**Sólo 1 de 4 trucks vigentes tiene ficha, y 3 de 4 fichas publicadas son de trucks que ya no están.**
Es exactamente el escenario que justifica el requisito del brief: template único desde CMS,
alta y baja por datos, 301 automático al sacar un truck. Sin eso esto se repite en un año.

⚠️ **Necesito de vos:** el roster confirmado a hoy (2026-09-08) con nombre, slug, cocina,
especialidad, horarios e Instagram de cada truck. El menú de enero puede estar tan viejo
como las fichas. **No voy a inferirlo.**

### Instagram de los trucks

Ninguna ficha linkea al IG del truck. El único IG en todo el sitio es el del venue
(`instagram.com/rooftopatriverside/`). El template pide "link a su Instagram": ese dato
**no existe hoy** y hay que pedirlo truck por truck.

---

## 4. Menú de barra — descargado y transcribible

`/drink` publica el menú como **dos imágenes** dentro de un slider, sin texto alternativo real.

| Alt | URL de origen (Wix, sin transformar) | Descargado |
|---|---|---|
| `Rooftop_Menu-Jan-2026_1` | `static.wixstatic.com/media/526079_60ecb618582948d9bdf59ad35a7f26e9~mv2.jpg` | 1294×2000, 2.0 MB |
| `Rooftop_Menu-Jan-2026_2` | `static.wixstatic.com/media/526079_df856c2cd1cd436bbd35b50b33834a13~mv2.jpg` | 1294×2000, 1.8 MB |

Ambas legibles y transcribibles a HTML. **Contenido verificado:**

- **Página 1** — Signature Cocktails (14 ítems con precio y receta) + Specials
  (Frozen Drink of the Month $12, Xtini-Tower $79).
  Pie: *"All listed prices include tax. A 22% gratuity fee will be applied to unsigned bar tabs."*
- **Página 2** — Bottled Beer (12) · Draft Beer (7) · Seltzers & Canned Beer (5) ·
  Wine & Bubbles (White 5, Bubbles 1, Blush 2, Red 4, con marca de "HOUSE") ·
  recuadro de Happy Hour · logos de los 4 food trucks + QR "VIEW MENUS".

Total transcribible: **~50 ítems con precio.** Alcanza para armar `/sunset-bar` en HTML
sin pedir nada más. Los precios llevan la nota de impuesto incluido.

---

## 5. Textos reutilizables

Los que sobreviven a las prohibiciones del brief. **Ninguno generado por IA: son del cliente.**

| Origen | Texto | Destino |
|---|---|---|
| `/this-is-us` | "After 4 years of planning, the Bonitian locals, the Magnus family get to fulfill their dreams of bringing life, community fun, and legacy to Bonita Springs." | `/our-story` |
| `/this-is-us` | "We hope this park will be a staple for families in the community, a symbol for up and coming entrepreneurs & business owners, and a landmark our kids would be proud of" — *Chris Magnus, Founder & Operator* | `/our-story` (cita) |
| `/eat` | "Discover the unique flavors of Southwest Florida's finest food trucks" | `/food-trucks` |
| `/drink` | "The best craft cocktails and local beers this side of the Imperial River" | `/sunset-bar` |
| `/` | "Our bartenders are skilled in the art of mixology… We also offer a rotating selection of national brands and local craft beers." | `/sunset-bar` |
| `/game-lounge` | "SWFL's First Gaming Truck Has Arrived" + descripción completa | `/events/game-truck` |
| `/neighborhood-market` | Bloque completo de vendors + condiciones | `/market` |
| `/giveback` | Charity Partner Program, completo | a definir |
| `/blank` | **Calusa Breeze** — "a mesmerizing ocean blue, swirled piña colada… house-spiced pineapple rum, velvety coconut, and the vibrant kick of zesty lime." | `/sunset-bar` (si sigue en carta) |
| `/el-chilango` | Descripción del truck | ficha, si sigue en el roster |
| `/primecarvery`, `/seameonwheels` | Descripciones | sólo si siguen en el roster |

### ⛔ Textos que NO se reutilizan — nomenclatura prohibida

El home actual está construido enteramente sobre lo que el brief prohíbe:

- **"A two-story food truck park nestled in the heart of Bonita Springs"** (H1 actual)
- **"our upper deck"**, **"Our two-story bar"**
- Las tres secciones del home se llaman literalmente **"Eat." / "Drink." / "Paradise."**
- "Bites and Family Favorites", "the ultimate dining experience" — refuerzan lectura de restaurante

Y el posicionamiento entero es el equivocado según la tesis del brief: el home actual vende
"parque de food trucks de dos pisos", no "espacio de eventos con barra propia y cuatro
cocinas independientes". Se reescribe completo.

---

## 6. Datos de contacto y horarios

### ⚠️ Corrección del 2026-09-11 — el pre-footer de newsletter faltaba en este inventario

Este documento **omitía el formulario de suscripción**, y esa omisión costó
trabajo: el 2026-09-09 se borró el newsletter del sitio nuevo argumentando que
«la web actual no tiene nada parecido», con este inventario como fuente. Se
verificó en vivo el 2026-09-11 y **sí existe**, en el pre-footer, arriba de los
horarios:

| | |
|---|---|
| Título | «Sign Up» |
| Bajada | «Stay up to date with all the latest from Rooftop at Riverside» |
| Campos | First name · Last name · Email |
| Botón | «Join» |
| Confirmación | «Thanks for subscribing!» |

Repuesto en `shared/NewsletterSignup.tsx`, con dos campos en vez de tres —se
cayó el apellido, que en una lista de correo no se usa—. **Va a una planilla,
no a un mail**, y la planilla todavía no existe: ítem 24 de
`docs/pedido-al-cliente.md`.

> **La lección, para el resto de este documento:** lo que no está acá se trata
> como que no existe en el sitio actual, así que un hueco se lee como un dato.
> Antes de borrar algo del sitio nuevo por ausencia en este inventario,
> **verificar en vivo**.

### Coinciden con el brief ✅

Horarios (footer, idénticos en las 23 páginas):

| Día | Barra | Food Trucks |
|---|---|---|
| Lunes | CLOSED | CLOSED |
| Martes | CLOSED | CLOSED |
| Miér–Jue | 3pm – 8pm | 4pm – 8pm |
| Viernes | 3pm – 12am | 4pm – 11pm |
| Sábado | 11am – 2am | 12pm – 11pm |
| Domingo | 11am – 8pm | 12pm – 8pm |

Dirección `27333 Old 41 Rd, Bonita Springs, FL 34135` · Teléfono `(239) 268-0080` ·
`info@eatdrinkparadise.com` · `hiring@eatdrinkparadise.com` ·
IG `instagram.com/rooftopatriverside/` · FB `facebook.com/people/Rooftop-at-Riverside/100075964505890/`

### ⚠️ Tres contradicciones que hay que resolver antes de publicar

**a) Happy Hour — tres versiones distintas en el mismo sitio**

| Fuente | Días | Horario |
|---|---|---|
| Footer de las 23 páginas | **Wed – Fri** | 3–6 PM |
| Menú impreso ene-2026, pág. 2 | **Tue – Fri** | 3–6 PM |
| `/tnt-sign-ups` | **Thursdays** | **3–7 PM** |
| Brief | **Wed – Fri** | 3–6 PM |

El menú dice martes, y **los martes el local está cerrado**: ese dato es imposible.
Voy con **Wed–Fri 3–6 PM** (footer + brief coinciden), pero necesita confirmación del cliente,
y si es correcto **hay que reimprimir el menú**.

**b) Un segundo dominio de email**

`/find-us` publica **`info@rooftopatriverside.com`** — dominio distinto al
`info@eatdrinkparadise.com` del footer. No sé cuál es el bueno ni si los dos reciben.
El brief sólo lista `@eatdrinkparadise.com`. **A confirmar.**

**c) Emails personales expuestos**

`/this-is-us` publica `cmagnus@eatdrinkparadise.com` y `ahayes@eatdrinkparadise.com`.
No están en el brief. Recomiendo **no** republicarlos y dejar sólo los buzones genéricos.

> **Dato útil:** `ahayes@` es **Anthony Hayes, General Manager**. Eso resuelve el
> "«Tony» (A. Hayes, nombre a confirmar)" de la lista de aprobadores del brief.

---

## 7. Otros datos duros que el brief no traía

Todos del sitio actual, verificados. **Confirmar vigencia antes de publicar.**

**Camión de gaming** (`/game-lounge`):
- $10 por persona + impuesto por 30 min; $5 cada 15 min adicionales
- Fiestas 2 h: **$400** lun–jue (hora extra $200) · **$500** vie–dom (hora extra $250)
- Incluye Game Coach, 6 TVs, inventario físico + suscripciones
- 30+ juegos, listados uno por uno (de E a M)

> ⚠️ **No coincide con el brief.** El brief dice "4 PS5, 4 Xbox Series X, 2 Switch 2, con A/C".
> La página dice **6 TVs** con "Xbox Series X, PlayStation 5, Nintendo Switch 2" (y en el
> bloque de fiestas escribe "PS6", casi seguro un error de tipeo por PS5). Ni las cantidades
> ni el conteo de pantallas coinciden. **A confirmar** antes de publicar cualquier número.

**Neighborhood Market** (`/neighborhood-market`): fee de vendor **$30** · espacio 10×10
salvo aprobación · orden de llegada, aprobación al check-in · carpas pop-up permitidas ·
electricidad a pedido.

**Formulario de `/hostanevent`** — campos actuales, buena línea de base para `/events/inquire`:
nombre · email · teléfono · fecha (requerida) · hora de inicio · hora de fin · group size ·
group type · company name · occasion type · ¿drink package? · ¿food package? ·
cómo nos conociste (Social Media / Radio / Referral / E-Blast / Walk By) · comentarios.

> El brief pide dos campos que hoy no existen (**tier de comida** Food Truck Spread /
> Catered / Chef's Table, y **rangos** de cantidad de invitados) y elimina los de
> drink/food package. Los valores del dropdown "cómo nos conociste" se pueden reutilizar tal cual.

**Formulario de `/entertainment`** — confirma el 301 a `/join-us`: nombre · email · teléfono ·
band name · social media link · género · video link · logo (upload, máx 15 MB) · foto.
No es una página de programación. El brief tiene razón.

---

## 8. Assets a descargar

| Grupo | Dónde | Cantidad |
|---|---|---|
| **Menú de barra** | `/drink` | 2 — **ya descargadas** ✅ |
| Logo principal | header, todas las páginas | `Rooftop at Riverside_Logo.png` |
| Isotipo del food truck | home | `Rooftop at Riverside_truck.png` |
| Fotos de trucks | 4 fichas | 17 |
| Fotos de eventos | `/hostanevent` | `DSC03511.jpg`, `DSC02523.jpg`, `IMG_1063.jpg`, `_RCZ4209.JPG` |
| Fotos del venue | `/this-is-us`, `/calendar` | `IMG_6030 (1).jpg`, `DSC05537-2.jpg`, `DSC02521 (1).JPG` |
| Camión de gaming | `/game-lounge` | `Rooftop_Gaming Lounge_4x5 2.jpg` |
| Mapa de estacionamiento | `/parking` | `Screenshot 2023-12-29 at 11.51.36 AM.jpg` ⚠️ es un screenshot; **rehacer** |
| Menús de truck | 2 fichas | 2 — **sólo referencia**, no se publican |

Todas en `static.wixstatic.com`. Se bajan en original quitando el segmento `/v1/fill/...`.

⚠️ Los nombres de archivo son de cámara (`IMG_6071.jpg`, `PHOTO-2024-08-29-22-49-04.jpg`)
y los `alt` actuales repiten el nombre del archivo. El brief exige `alt` descriptivo real:
**hay que redactar los 30+ alt a mano.**

---

## 9. Por qué el calendario es el error central — verificado

`/calendar` monta un **iframe de un tercero**: `calendar.boomte.ch` (Boomtech, app de Wix).

Medido sobre el HTML servido (736 KB):

```
"Sunset Saturday"  → 0 apariciones
"Jazz"             → 0
"Wooftop"          → 0
"Live Music"       → 0
"Trivia"           → 0
"Bingo"            → 0
```

**Cero contenido de eventos en el HTML.** Google no indexa un solo evento. No hay URL por
evento, no hay `Event` en JSON-LD, no hay iCal. Y el iframe es cross-origin: ni siquiera
desde la propia página se puede leer su contenido.

Es exactamente el diagnóstico del brief, confirmado.

### Los eventos recurrentes reales

> ⚠️ **CORREGIDO EL 2026-09-11.** Esta sección afirmaba que los CUATRO eventos estaban
> «leídos del iframe». **Es falso para dos de ellos.** Lo detectó Camila mirando el
> calendario, y se verificó abriendo el iframe con un navegador real — el HTML servido
> no alcanza, porque el `<iframe title="Calendar">` no trae `src` y lo inyecta Wix por
> JS en runtime. La URL real del widget es
> `calendar.boomte.ch/widget/index.html?lang=en&…`.
>
> El calendario público publica **SÓLO DOS** recurrentes, alternados semana por semana:
>
> ```
> La Noche | Dj David Cast   sáb 12 sep · 10:00 pm – 2:00 am
> Ross Brown                 jue 17 sep · 6:00 pm – 8:00 pm
> La Noche | Dj David Cast   sáb 19 sep
> Ross Brown                 jue 24 sep
> La Noche | Dj David Cast   sáb 26 sep
> Ross Brown                 jue 01 oct
> ```
>
> Los miércoles —16, 23 y 30 de septiembre— **no tienen un solo evento**.

| Evento | Cuándo | ¿Está en el calendario público? | Detalle |
|---|---|---|---|
| **Ross Brown** | jueves 6–8 PM | ✅ sí, verificado en vivo | música en vivo, recurrente |
| **La Noche · DJ David Cast** | sábados 10 PM – 2 AM | ✅ sí, verificado en vivo | recurrente |
| **Wooftop Wednesdays** | miércoles | ❌ **NO aparece** | 2x1 en tragos todo el día (excluye flights) · ítems de $5 para perros en cada truck |
| **Bingo Night** | miércoles 7–9 PM | ❌ **NO aparece** | premios en gift cards · pozo progresivo semanal |

⚠️ **LOS CUATRO EXISTEN EN EL DASHBOARD DE RESTOEXP**, cada uno con su UUID, su
descripción, su horario y sus tags — no son inventados ni los escribió nadie a mano en
el código. O sea que **el dashboard y el sitio público no coinciden**: hay dos eventos
cargados que el calendario del cliente no está mostrando.

Eso cambia el sentido de la pregunta abierta #8. No es sólo «cuál es la lista canónica»:
es **«los miércoles pasan o no pasan»**. Si pasan, el calendario público lleva meses sin
publicarlos —y es justamente el agujero que el sitio nuevo viene a tapar—. Si no pasan,
hay dos eventos de más en el dashboard y el sitio nuevo los está publicando.

El brief, por su lado, lista "Sunset Saturdays, Jazz Wednesdays, Wooftop Wednesdays,
Happy Hour". Ninguno de esos cuatro nombres coincide del todo con los datos: "Sunset
Saturdays" y "Jazz Wednesdays" no existen en ninguna de las dos fuentes.

---

## 10. Plataformas externas — qué está y qué no

Barrido sobre las 9 páginas principales. **Sólo tres enlaces externos en todo el sitio:**

```
toasttab.com/rooftop-and-riverside-new-27333-old-41-road/giftcards
instagram.com/rooftopatriverside/
facebook.com/people/Rooftop-at-Riverside/100075964505890/
```

**No hay** OpenTable · **no hay** Eventbrite · **no hay** Yelp · **no hay** Google Business ·
**no hay** TikTok · **no hay** delivery.

Esto confirma varias notas del brief:
- Toast es efectivamente el proveedor de gift cards ✅
- Sin TikTok ✅ (no inventar handle)
- Sin delivery ni takeout en ninguna página ✅
- **OpenTable y Eventbrite no están enlazados hoy en ningún lado.** Refuerza el
  "probablemente sólo para eventos, a confirmar" de OpenTable, y significa que la URL
  de Eventbrite para `/the-yard` **todavía hay que pedirla**.

Otros hallazgos técnicos: `Copyright © 2023 … powered by MCH` (agencia anterior) ·
sirve detrás de Cloudflare · **ninguna página de contenido tiene un `<h1>` real**
(`/eat`, `/drink`, `/calendar` y las 4 fichas de truck tienen **0** encabezados en el HTML).

---

## 11. Lo que necesito de vos para cerrar el inventario

1. **Roster de trucks confirmado a hoy** — nombre, slug, cocina, especialidad, horarios e IG. Sin esto no puedo generar `/food-trucks/[slug]`.
2. **`/ocn`** — ¿OCN Seafood Co. y Sea Me on Wheels son el mismo negocio? Define el 301.
3. **Happy Hour** — Wed–Fri 3–6 PM contra las otras dos versiones publicadas.
4. **`info@rooftopatriverside.com`** — ¿vale, o sólo `@eatdrinkparadise.com`?
5. **Camión de gaming** — cantidad real de consolas y pantallas; y si los precios de 2026 siguen vigentes.
6. **Destino de** `/giveback`, `/tnt-sign-ups` y los dos waivers.
7. **URL de Eventbrite** para `/the-yard`.
8. **Recurrentes canónicos** de `/whats-on` — y ahora con una pregunta más concreta y
   más urgente: **¿los miércoles pasan o no pasan?** El dashboard tiene cargados
   *Wooftop Wednesdays* y *Bingo Night*, y el calendario público del cliente **no
   muestra ninguno de los dos** (verificado en vivo el 2026-09-11, ver §9). El sitio
   nuevo los está publicando porque lee el dashboard. Si no pasan, hay que bajarlos del
   dashboard; si pasan, el calendario viejo lleva meses sin publicarlos.
9. **Los assets del brief** que todavía no recibí: WOFF2 de Steelfish / Bronx / Futura PT, los SVG de marca y el patrón de azulejo, y las fotos reales del venue.
