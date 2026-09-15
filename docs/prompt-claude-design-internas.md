# Prompt maestro — las páginas internas, para Claude Design

> Documento de trabajo. Se pega **entero** como prompt en Claude Design.
> Es el hermano de [`prompt-claude-design.md`](prompt-claude-design.md), que fue el
> de la **home** y ya está construido. Éste cubre las **nueve páginas internas**.
> Referencia de layout: **https://defoodtruckclub.nl/inspiratie/italiaanse-catering**,
> auditada el 2026-09-14, bloque por bloque y no de memoria.
> Copys extraídos del código vigente (`src/app/*/page.tsx`, `src/content/*`,
> `src/lib/nav.ts`, `src/lib/brand.ts`). Sistema desde `src/app/globals.css`,
> `docs/INVARIANTES.md` y `design-audit/DIRECCION-VISUAL.md`.

---

## ROL Y ENCARGO

Sos un director de arte digital senior. La **home** de *Rooftop at Riverside*
(Bonita Springs, Florida) ya está diseñada y construida con un sistema propio. Lo
que falta son las **páginas internas**, que hoy están resueltas con un encabezado
genérico y secciones apiladas, todas iguales entre sí y sin un solo gesto del
sistema que sí tiene la home.

Diseñá **las nueve páginas internas**, desktop (1440) y mobile (390), tomando como
**referencia estructural** una página interna real de otro sitio del rubro:
**https://defoodtruckclub.nl/inspiratie/italiaanse-catering**.

Esa referencia importa porque resuelve el problema exacto que tenemos: es una
**landing de vertical**, larga, con mucho texto argumentativo, que no se lee como
un muro de párrafos porque alterna bloques de naturaleza distinta cada 400 px.

**Cómo se usa la referencia:**
- **Se toma:** el ritmo de bloques (ningún bloque se repite dos veces seguidas), el
  texto que convive con imagen en vez de ir suelto, la tabla comparativa a dos
  columnas, la tira de testimonios, la marquesina de logos, el carrusel de fichas
  del final, el bloque de CTA y el bloque de contacto como cierre fijo de toda
  página interna.
- **Se cambia:** todos los textos (los nuestros, literales), la paleta (la nuestra),
  las tipografías (las nuestras) y el contenido de cada bloque.
- **No se toma nada propietario de ellos:** ni su mascota, ni su logotipo, ni sus
  fotos, ni sus fuentes de pago, ni sus logos de clientes.

**Entregá:**
1. Las nueve páginas internas completas, desktop (1440) y mobile (390).
2. **Antes que las páginas: el kit de bloques de la sección 5.** Es el verdadero
   entregable. Las páginas son el kit aplicado.
3. La especificación de motion por bloque.

---

## 1. EL NEGOCIO, EN CINCO LÍNEAS

Una **barra en la azotea** sobre un **patio con cuatro food trucks independientes**,
en el downtown de Bonita Springs, enfrente de Riverside Park. Abrió en enero de
2024, es de la familia Magnus, es local.

- Los cuatro camiones son **negocios ajenos**: pedís en la ventanilla y pagás a ese
  camión. Cuenta, tarjeta y ticket separados. **No hay servicio de mesa.**
- **La barra de arriba es del venue.** Es la única cuenta propia y el único menú con
  precios en el sitio.
- El lugar **se alquila entero** para eventos privados.
- Horarios: lunes y martes cerrado. Mié–jue 15–20 h. Viernes 15–24 h. Sábado 11–2 h.
  Domingo 11–20 h. Los camiones abren una hora más tarde. Happy hour mié–vie 15–18 h.

**La tesis que gobierna la estética: el sitio tiene que ser la hora, no el lugar.**
Es un lugar de tarde y de atardecer, no de medianoche. Entrar tiene que sentirse
como salir de la escalera al techo a las seis de la tarde en Florida.

**Nomenclatura vetada por el brief**, ni como copy ni como concepto: «two-story food
truck park», «upper deck», «the ultimate dining experience», y cualquier fórmula que
haga leer el lugar como un **restaurante**.

---

## 2. QUÉ YA EXISTE Y NO SE REDISEÑA

Estas piezas están construidas y las nueve internas las comparten. **No las
rediseñes: usalas.** Son lo que hace que una interna se lea como parte del mismo
sitio que la home.

| Pieza | Qué es |
|---|---|
| **Header** | Nav a la izquierda, isotipo centrado en un medallón, `What's On` más la píldora `Plan an Event` a la derecha. Mega-menú «More» en bloques rotulados. |
| **Footer** | Losa `deep`, cuatro columnas con filete bajo cada título, newsletter adentro, barra de agencia abajo. |
| **El horizonte** | La ola del brand book con el medallón de sol emergiendo. Es la transición de claro a oscuro. Se usa **una vez por página**, en el único corte que importa. |
| **La cenefa de olas** | El separador general del brand book. Es la transición de oscuro a claro. |
| **La trama de grecas** | Textura del brand book, sobre bloques de color plano. |
| **Sello circular giratorio** | Isotipo con texto en curva alrededor, montado a caballo del borde de una foto. |
| **Marquesina** | Tira horizontal en loop continuo que reacciona a la velocidad del scroll. |
| **Carrusel con snap** | Flechas circulares, slides vecinos asomando cortados, puntos de paginación. |
| **Tarjeta de pendiente** | La tarjeta punteada que marca un dato que el cliente todavía no entregó. Ver sección 9. |

---

## 3. EL DIAGNÓSTICO: QUÉ ESTÁ MAL HOY

Esto es literal, medido sobre las nueve páginas. Es el encargo, dicho al revés.

1. **Las nueve arrancan idénticas.** El mismo encabezado: eyebrow, h1, bajada,
   breadcrumb, y una foto al costado cuando la hay. Sin jerarquía entre ellas: la
   página que más factura entra igual que la de vendors.
2. **Después del encabezado, todo es la misma caja.** Una sección tras otra,
   alternando fondo blanco y crema, con el mismo bloque de encabezado y una grilla
   de tarjetas debajo. Ocho de las nueve tienen esa forma de punta a punta.
3. **Ningún gesto del sistema aparece.** Ni el horizonte, ni la cenefa, ni las
   grecas, ni el sello, ni una marquesina, ni un carrusel. Todo eso vive sólo en la
   home, y por eso al pasar de la home a una interna el sitio se apaga.
4. **La fotografía no está compuesta, está insertada.** Entra como panel al costado
   del h1 y después no vuelve a aparecer en toda la página.
5. **Ninguna interna tiene cierre.** Terminan en la última sección y cae el footer.
   No hay bloque de CTA ni bloque de contacto, que es justamente lo que la
   referencia sí tiene y repite en todas sus internas.

---

## 4. LA REFERENCIA, DESARMADA

Auditoría real de `defoodtruckclub.nl/inspiratie/italiaanse-catering`, en orden.

| # | Bloque | Qué hace |
|---|---|---|
| 1 | **Hero** | Titular grande sobre foto a sangre, con la promesa de la vertical en una línea. |
| 2 | **Intro con imagen abrazada** | Un párrafo largo (unas 120 palabras) con la imagen metida **dentro** del bloque de texto, no al costado. El texto la rodea. |
| 3 | **Dos columnas de argumento** | Dos subtítulos de 80 a 110 palabras cada uno, con tres imágenes chicas cuadradas intercaladas. |
| 4 | **Cuatro ventajas cortas** | Cuatro subtítulos de unas 60 palabras. Sin tarjetas: subtítulo y párrafo, uno abajo del otro, en dos columnas. |
| 5 | **Testimonios** | Tres citas reales con nombre y empresa, en bloques. |
| 6 | **Marquesina de logos** | Los clientes, en tira horizontal continua. |
| 7 | **Tabla comparativa, losa oscura** | «Nosotros» contra «los otros», dos columnas de cinco filas, cada fila con icono y una frase de 15 a 20 palabras. Es el bloque de más peso visual de la página. |
| 8 | **Carrusel de fichas** | Nueve tarjetas con foto, logo y botón de «más información». El cross-sell hacia las otras verticales. |
| 9 | **Bloque de CTA** | Titular corto, unas 50 palabras y la promesa de respuesta en 4 horas. |
| 10 | **Bloque de contacto** | Mail y teléfono grandes y clickeables, más las redes. |
| 11 | **Footer** | Cuatro columnas. |

**Lo que hay que robarle, y es una sola cosa: el bloque nunca se repite dos veces
seguidas.** Texto, texto con imagen, columnas, citas, marquesina, tabla oscura,
carrusel, CTA, contacto. Nueve naturalezas distintas en una sola página. Nuestras
internas hoy tienen una sola, repetida ocho veces.

**Lo que NO se le copia:** su clave oscura repartida, su tipografía serif, y el
volumen de texto. La referencia es una landing de SEO con 900 palabras; nosotros
escribimos corto y el copy ya está escrito.

---

## 5. EL KIT DE BLOQUES PARA INTERNAS

**Éste es el entregable central.** No quiero nueve páginas sueltas: quiero doce
bloques que se combinan, y que las nueve páginas sean combinaciones distintas de los
mismos doce. Diseñá cada uno como pieza, con sus variantes y estados, y después armá
las páginas.

| # | Bloque | Para qué | Dónde se usa |
|---|---|---|---|
| **A** | **Encabezado de interna, en tres pesos** | Hoy hay uno solo para las nueve. Quiero **tres**: `mayor` (foto a sangre con el titular encastrado, para Events y Sunset Bar), `medio` (titular con arco de piezas o con la trama de grecas, sin foto grande), `chico` (sólo tipografía y un filete, para Contact y Join Us). | las 9 |
| **B** | **Texto con imagen abrazada** | El bloque 2 de la referencia. Un párrafo largo con la foto metida adentro, no al costado. | Our Story, Market, Game Room |
| **C** | **Dos columnas de argumento con imágenes chicas** | El bloque 3 de la referencia. | Events, Food Trucks |
| **D** | **Lista de pasos numerados** | Numeral gigante en display, título, párrafo corto. Sin tarjeta. | Events, Join Us, Market |
| **E** | **Tabla comparativa sobre losa oscura** | El bloque 7 de la referencia y **el único bloque oscuro de la página**. Entra por el horizonte, sale por la cenefa. | Events (con nosotros contra un salón), Food Trucks (cómo se paga acá contra cómo se paga en un restaurante) |
| **F** | **Tira de testimonios** | Citas reales con nombre. **Sólo donde haya reseñas reales**; si no hay, el bloque no se usa. | Events, Sunset Bar |
| **G** | **Marquesina** | De nombres de trucks, de fotos o de logos. | Food Trucks, Market, Game Room, What's On |
| **H** | **Carrusel de fichas** | El cross-sell hacia las otras internas: foto, título, una línea, flecha. | las 9, al final |
| **I** | **Ficha de menú con precios** | Fila con nombre en display, descripción en cuerpo y precio a la derecha, con filete punteado entre nombre y precio. | Sunset Bar, Game Room (los paquetes de fiesta) |
| **J** | **Ficha de dato duro** | Capacidad, horario, superficie, precio desde. Número grande, etiqueta chica. | Events, Sunset Bar, Game Room |
| **K** | **Bloque de CTA de cierre** | Titular corto, una línea, píldora `sunset` con texto negro. **Obligatorio en las nueve.** | las 9 |
| **L** | **Bloque de contacto de cierre** | Mail y teléfono grandes y clickeables, dirección, mapa. **Obligatorio en las nueve**, arriba del footer. | las 9 |

**Regla de composición, no negociable:** ninguna página puede usar el mismo bloque
dos veces seguidas, y ninguna puede tener menos de cinco naturalezas distintas.

---

## 6. EL SISTEMA — NO SE REDISEÑA, SE APLICA

Todo lo que sigue está medido y en producción. No lo cambies.

### 6.1 Tipografía

| Rol | Familia | Uso |
|---|---|---|
| **Display** | **Big Shoulders** (variable 100–900) | Titulares en MAYÚSCULAS, números, precios, nombres de menú, títulos de tarjeta. |
| **Cuerpo y UI** | **Jost** (variable 100–900) | Bajadas, párrafos, nav, botones, píldoras, datos. |

**La marca no tiene serif.** Los párrafos largos van en **Jost Light (300) a 20–22 px
con interlínea 1.6**. El contraste lo da el salto de peso y de escala, no un cambio
de familia.

Escala: Hero `clamp(3.5rem, 9vw, 9rem)` LH 0.88 · H1 `clamp(3rem, 7vw, 6.5rem)`
LH 0.90 · H2 88 px LH 0.92 · H3 40 px LH 1 · Intro 25/1.4 · Lead 22/1.55 ·
Base 16/1.6 · Dato 15 · Micro 13 · Caption 12. Eyebrow en MAYÚSCULAS, Jost medium,
tracking 0.12 em. Los títulos display van **sin tracking negativo**: Big Shoulders
ya es condensada y el tracking negativo la empasta.

### 6.2 Color, con los hex exactos

| Token | Hex | Rol |
|---|---|---|
| `ink` / `body` | `#0A1F1E` | toda la tinta sobre claro |
| `paper` | `#FFFFFF` | la superficie base |
| `bone` | `#FAF6EA` | la segunda superficie clara |
| `cream` | `#FDF0B4` | píldoras y badges chicos. **Nunca fondos grandes** |
| `deep` | `#014545` | la única losa oscura de la página, más el footer |
| `deeper` | `#013434` | capas dentro de una losa oscura |
| `sunset` | `#F58521` | CTA primario, **con texto negro** |
| `sunset-deep` | `#D66A0A` | **la palabra acentuada dentro de un titular sobre claro** |
| `mint` | `#C4F2EC` | las formas grandes de acento |
| `river` | `#0EB6B8` | iconografía y trama. **Nunca como texto** |
| `teal600` | `#028382` | los ✓ y el punteado «positivo» |
| `terra` | `#A62000` | los ✗, el punteado «negativo» y los errores |
| `muted` | `#487270` | texto secundario sobre claro |
| `muted-dark` | `#A8C6C4` | texto secundario sobre oscuro |
| `fog` | `#DED8C7` | filetes y bordes de 1 px |

**Reglas de contraste, medidas con WCAG 2.1, no negociables:**
- `sunset` y `river` **nunca como texto sobre claro** (2.54:1 y 2.50:1). Sí como relleno.
- Sobre relleno naranja o teal, el texto va en **negro**, nunca en blanco.
- El acento de titular sobre claro es `sunset-deep` (3.54:1), y **sólo dentro de un
  titular de display**, jamás en cuerpo. Sobre oscuro el acento es `sunset`.
- Sobre `deep`: texto en `paper` o `cream`, secundario en `muted-dark`.
- El texto secundario **es un token, no una opacidad**: una opacidad da un color
  distinto sobre cada superficie y no se puede auditar.

### 6.3 Superficie

**70–75 % claro, 20–25 % oscuro. `sunset` ≤ 5 %, `cream` ≤ 5 %.**

**Una sola zona oscura por página, más el footer.** En cada interna esa zona es el
bloque **E** o el argumento de más peso, y nunca puede haber dos oscuros seguidos.
Se entra por **el horizonte** y se sale por **la cenefa de olas**: dos piezas
distintas para los dos cortes, no la misma dos veces.

### 6.4 Medidas

- Contenedor **1280 px**, el mismo de la home. Las internas no pueden tener otro
  ancho de texto que la home o el salto se ve al navegar.
- Gutter **fluido**: `clamp(24px, 4vw, 56px)`. Piso de 24 en mobile, por pedido explícito.
- Radios: **24 / 44 / 88 px**, píldoras totales, círculos.
- Breakpoint grande: **1344 px**.
- El bloque de encabezado de sección (eyebrow + h2 + bajada) va en **1040 px**.

---

## 7. LAS NUEVE PÁGINAS

El copy entre comillas **es el vigente y se usa literal**: no traducir, no
reescribir, no inventar. Está en inglés de EE. UU. El orden es el de prioridad de
negocio: diseñá Events primero.

### 7.1 `/events` — la que más factura, y la que más se parece a la referencia

Eyebrow `Private events`. H1 **"Your event, two stories up"**. Bajada: "A rooftop
bar, a gated yard and four independent kitchens in downtown Bonita Springs, ten
minutes from Naples and Estero."

Es la interna que más se parece a la referencia y la que más bloques usa. Contenido
que ya existe y hay que componer: qué hacemos ("What we actually do"), los tres pasos
("Three steps, and the first one takes two minutes"), los tipos de evento
(corporativos, fiestas de fin de año, recaudaciones, celebraciones), los espacios que
se alquilan (azotea, patio, patio cubierto, o el lugar entero con los portones
cerrados), el game truck, las pruebas, y el formulario de consulta.

Bloques: **A-mayor → C → D → J → E (la losa oscura: nosotros contra un salón) →
F → H (los espacios, en carrusel de fichas) → formulario → K → L**.

El formulario merece diseño propio: hoy es el único de todo el sitio y entra como una
caja más. Tiene que leerse como el final de un argumento, no como un anexo.

### 7.2 `/sunset-bar` — la única página con precios

Eyebrow `The rooftop`. H1 **"Bonita's only rooftop"**. Bajada: "Our bar, and the
only thing here we actually cook up ourselves. Cocktails made daily, drafts from
down the road, and the best west-facing seat in Bonita Springs."

Contenido: happy hour (mié–vie, 15–18 h: $4 drafts, $5 house wines, $6 house
drinks), cócteles de autor, specials, cerveza y seltzers, vinos y burbujas.

Bloques: **A-mayor (foto a sangre del rooftop) → J (el happy hour como dato duro, no
como párrafo) → I ×4 (las cuatro cartas) → B → K → L**.

El bloque **I** es el trabajo fino de esta página: cuatro listas de precios seguidas
son lo más fácil de arruinar. Que cada carta tenga su propia entrada y que el precio
sea display, no cuerpo.

### 7.3 `/food-trucks` — y la ficha de cada truck

Eyebrow `The yard`. H1 **"Four kitchens. One yard."** Bajada: "The trucks rotate.
Each one is independently owned, sets its own menu and takes its own payment. We just
give them the yard and the crowd."

Bloques: **A-medio → G (marquesina con los nombres de los cuatro trucks) → carrusel
del roster → E (cómo se paga acá contra cómo se paga en un restaurante: es LA
confusión del negocio y merece la losa oscura) → C → K → L**.

**`/food-trucks/[slug]`** es una plantilla aparte y más corta: foto, nombre, qué
cocinan, cuándo están, link a su menú, y el carrusel con los otros tres.

### 7.4 `/whats-on` — el calendario

Eyebrow `The calendar`. H1 **"What's on this week"**. Bajada: "Live music five nights
a week, Bingo on Wednesdays, and the dogs get their own day. Most of it is free."

Es la página de tráfico recurrente y la que más se mira parado en la vereda:
**mobile manda acá**. Tiene un evento destacado con card grande, una vista de lista y
una vista de mes. Las tres formas tienen que convivir sin que la página se vuelva un
panel de control.

Bloques: **A-chico → card destacada → lista / mes → G (marquesina de fotos) → K → L**.

**No hay ficha por evento.** Decisión del 2026-09-15: el calendario expone todo en la
propia página y el evento con entrada linkea **directo afuera**, a Eventbrite, con
icono de enlace externo y aviso de que abre en otra pestaña. No existe
`/whats-on/[slug]`. Con lo cual la card destacada y la fila de lista tienen que decir
todo lo que hoy diría una ficha: qué es, cuándo, dónde y si lleva ticket.

### 7.5 `/game-room` — la segunda página con precios

⚠️ **Dos datos sin confirmar antes de dibujar nada.** Primero el **nombre**: el sitio
viejo lo llama "SWFL's First Gaming Truck" en `/game-lounge`, y si es un camión y no
una sala, cambian la ruta y el titular. Segundo las **cantidades**: el brief dice 4
PS5, 4 Xbox Series X y 2 Switch 2; la página vieja dice 6 TVs. No coinciden. Hasta que
el cliente confirme van con `<PendingData>`: ningún número de consolas ni de pantallas
se publica a ojo.

Lo verificado, que es el esqueleto de la página: **$10 por persona los primeros 30
min** y $5 cada 15 min adicionales; **paquetes de fiesta de 2 h a $400 lun–jue** (hora
extra $200) y **$500 vie–dom** (hora extra $250); Game Coach incluido; más de 30
juegos.

Es la **segunda página con precios** después de Sunset Bar, y la única con políticas:
hay un waiver legal propio (`/game-zone-waiver`) y otro de bar games
(`/bar-games-waiver`) que hoy redirigen a `/our-story#experience` y **hay que
reapuntar acá**.

Bloques: **A-medio → B → J (la tarifa por persona) → I (los paquetes de fiesta) →
políticas y waiver → G → K → L**.

El bloque **I** se reusa acá a propósito: un paquete de fiesta se lee igual que un
trago de la carta, nombre en display y precio a la derecha. Que no se convierta en una
tabla de tarifas.

### 7.6 `/our-story` — la marca, y las preguntas

Eyebrow `Our story`. H1 **"A Magnus family project"**. Bajada: "The Magnuses are
Bonitians. This corner of Old 41 was an idea in their kitchen for four years before
it was a rooftop."

Absorbió dos páginas que ya no existen: «The Experience» y el FAQ. Hoy son dos
secciones más y se leen como apéndices. **El FAQ necesita forma propia**: es lo que
más se consulta de esta página (estacionamiento, perros, chicos, cómo se pide).

Bloques: **A-medio → B → línea de tiempo → qué se construyó → devolución a la
comunidad → FAQ en acordeón → K → L**.

### 7.7 `/market` — el mercado de vendors

Eyebrow `Neighborhood Market`. H1 **"The Neighborhood Market"**. Bajada: "A curated
set of local makers showing handmade goods, with the trucks cooking and the bar open
the whole time."

**El formulario de vendors vive acá.** Hoy está duplicado y huérfano en `/blank`, que
ya redirige a `/market`. Con él van las condiciones, verificadas: **fee de $30**,
espacio **10×10** salvo aprobación, orden de llegada con aprobación al check-in,
carpas pop-up permitidas y electricidad a pedido.

Bloques: **A-medio → B → G (marquesina de fotos del mercado) → D (cómo se pide un
puesto) → formulario de vendor → K → L**.

El formulario no es un anexo, es la conversión de la página: mismo tratamiento que el
de Events, no una caja gris al final.

### 7.8 `/join-us` — músicos y trabajo

Eyebrow `Join us`. H1 **a reescribir**: el actual, "Bring your truck to the yard", ya
no corresponde (ver el aviso de abajo). Bajada: "Two ways in, depending on what you
do. Both of them start with an email."

⚠️ **Dos carriles, no tres. Corregido el 2026-09-15.** La página tenía un tercer
carril, "Food truck owners · Pitch your truck", que **lo inventamos nosotros**: el
sitio actual no tiene, en ninguna de sus 23 rutas, un formulario de alta de trucks, y
el cliente nunca lo pidió. Se elimina. Los dos que quedan sí existen hoy:

1. **Músicos.** Es el formulario vivo de `/entertainment`, que migra tal cual: nombre,
   email, teléfono, band name, link de redes, género, link de video, logo (upload, máx
   15 MB) y foto.
2. **Trabajo.** Empleo en el venue.

Es la página más corta y la única donde las tarjetas están bien: lo que falta es que
los dos carriles se diferencien entre sí y que el mail no sea la única salida. Con dos
y no tres, la grilla de tres columnas se cae: rehacer la composición, no dejar un
hueco.

Bloques: **A-chico → dos carriles → D → K → L**.

### 7.9 `/contact` — tres buzones

Eyebrow `Contact`. H1 **"Say hello"**. Bajada: "Three inboxes, so your message lands
with the person who can answer it instead of a shared one."

Tiene la dirección (27333 Old 41 Rd, Bonita Springs, FL 34135), el teléfono
(239) 268-0080, el estacionamiento, el mapa y los horarios con **dos sets separados**
(bar y trucks) y el día de hoy destacado.

Bloques: **A-chico → los tres buzones → horarios a dos sets → mapa grande → L**.
Es la única página donde **L** es el contenido y no el cierre: dale el peso que en
las otras ocho tiene el bloque principal.

---

## 8. MOTION

Mismo repertorio que la home: un revelado propio por sección, ligado al scroll.

- **Encabezado:** revelado tipográfico por máscara, línea a línea, con stagger. La
  foto entra con un `clip-path` que se abre.
- **Cortinas de superficie:** el horizonte y la cenefa se dibujan con `scrub` ligado
  al scroll, no con un fade.
- **Marquesinas:** loop continuo que **reacciona a la velocidad del scroll**, acelera
  y cambia de dirección. Es lo que separa una marquesina buena de un scroll plano.
- **Sello circular:** rotación lenta, continua, infinita.
- **Datos duros (bloque J):** los números animan desde 0 al entrar en viewport.
- **Tabla comparativa:** las filas entran alternadas desde los dos lados.
- **Carruseles:** arrastre, snap, flechas circulares, slides vecinos asomando
  cortados. En mobile, scroll horizontal con snap.
- **Transiciones de página:** las internas se navegan entre sí más que desde la home,
  así que la transición importa más acá que en cualquier otro lado del sitio.

---

## 9. RESTRICCIONES — se cumplen sí o sí

- **Ni un em dash (—) en el copy visible.** Ni en titulares, ni en bajadas, ni en
  alt text, ni en los títulos de SEO. Se reemplaza por punto, coma, dos puntos o
  paréntesis, el que corresponda al sentido de la frase. **Sí se conserva el en dash
  (–) en rangos**: `3–6 PM`, `Wednesday – Friday`. Es regla permanente del proyecto.
- **Copy literal.** No traducir, no reescribir, no inventar copy nuevo. Si un bloque
  que proponés necesita un texto que no existe, marcalo como hueco y decilo: no lo
  escribas vos.
- **No inventar datos.** Ni capacidades, ni precios, ni métricas, ni reseñas. Lo que
  el cliente todavía no entregó va en una **tarjeta punteada de pendiente**, que es
  una pieza del sistema y también hay que diseñarla.
- **Accesibilidad AA.** Los ratios de la sección 6.2 son medidos, no estimados. Foco
  visible, jerarquía de headings correcta, targets táctiles de 44 px. Un carrusel
  nunca puede ser la única vía al contenido y tiene que navegarse por teclado.
- **`prefers-reduced-motion`:** todo tiene camino sin movimiento. Las marquesinas se
  detienen y el contenido queda visible y legible sin el JS de animación.
- **Mobile-first real.** El grueso del tráfico es gente parada en la vereda de Old 41
  mirando si hay música esta noche. Los bloques degradan a: titulares apilados,
  carruseles a scroll horizontal con snap, tarjetas a una columna.
- **Fotografía:** hay 36 fotos reales del lugar y 2 clips utilizables. **No** hay
  cielo de atardecer, **no** hay perros, **no** hay un evento privado montado. No
  diseñes un bloque que dependa de una foto que no existe sin marcarlo como hueco.

### Lo que NO quiero

- Las nueve páginas con el mismo encabezado. Es el problema que vinimos a resolver.
- Una página en clave oscura. **Una sola losa oscura por página.**
- Tarjetas por defecto. La referencia resuelve la mitad de sus bloques **sin**
  tarjeta, y ahí está buena parte de su aire.
- Los bordes punteados y los stickers convertidos en manierismo. Son un acento
  fuerte: van donde el mapeo los pide y no en cada caja.
- Copy nuevo, traducido o inventado, ni métricas que nadie verificó.
- Bloques que existan sólo para llenar. Si una página es corta, es corta.

---

## 10. CÓMO QUIERO VER LA ENTREGA

1. **El kit de bloques primero** (sección 5), cada bloque mostrado como pieza con sus
   variantes y sus estados, desktop y mobile.
2. **Las nueve páginas completas**, en el orden de la sección 7, cada una en desktop
   (1440) y mobile (390), **de punta a punta**, con el header y el footer reales.
3. **Un cuadro de composición** que muestre, para las nueve, qué bloques usa cada una
   y en qué orden, para verificar de un vistazo que ninguna repite un bloque dos
   veces seguidas y que ninguna baja de cinco naturalezas distintas.
4. **La spec de motion** por bloque, no por página.
