# Lectura del moodboard

Los diez archivos están en `assets-moodboard/` (no en `/assets/moodboard/` como
dice el brief; es la carpeta que apareció sin trackear en el árbol). Son capturas
de Pinterest, así que lo que se lee es la maqueta de adentro, no el screenshot.

**Regla que se aplicó:** el moodboard es fuente de **composición y ritmo de
superficies**. No de paleta ni de tipografía. Donde una imagen sólo aporta color o
ilustración, queda anotada como confirmación y no como fuente.

**Tres se descartan.** Preferí tirarlas antes que forzarlas.

---

## Las que aportan composición

### `IMG_2905` — «Late Checkout Edit»
- **Composición:** base crema en toda la página. Hero de foto a sangre con el
  titular centrado encima. Abajo, un bloque de dos columnas asimétricas (foto
  grande + lista de tres ítems chicos). Y el gesto fuerte: la sección «SERVICES»
  pone el titular **gigante detrás** de una fila de tres fotos que lo tapan
  parcialmente. Proporción imagen/texto muy a favor de la imagen; aire generoso.
- **Cambio de fondo:** un solo escalón, de crema a crema levemente más cálida. El
  ritmo lo dan las fotos, no los campos de color. Es exactamente la lógica que
  necesita una home clara.
- **Se aplica a:** el título de sección como **capa**, detrás de la media, en
  `WhatsOn`. Y la fila de tres con la bajada debajo de cada foto, sobre la
  superficie, sin contenedor de tarjeta.
- **No se toma:** su tipografía (serif de editorial), el titular centrado, ni el
  módulo de blog.
- **Estado:** la fila de tres sin tarjeta está en `ThreeDoors`. El titular
  cruzado con la media se construyó, pero en la variante de
  `referencia-dftc/` —la imagen INTERCALADA entre los dos renglones, no detrás
  de ellos— y en `ThreeDoors` y no en `WhatsOn`: el h2 de «Three doors» ya
  venía partido por un punto y no hubo que inventar el corte. La versión
  «titular tapado por las fotos» de esta imagen sigue sin construir, y es otra
  cosa: ahí el texto se pierde detrás de la media a propósito.

### `IMG_2906` — «Bitterroot Bunkhouse»
- **Composición:** hero de foto oscura a sangre con el nombre centrado; abajo, una
  sección crema con un **racimo de fotos de tamaños distintos y desfasadas en
  vertical**, con el texto intercalado entre ellas. Nada está alineado a una fila.
- **Cambio de fondo:** entre el hero y la sección clara hay una **tira angosta de
  marca** —una cinta con el nombre repetido— que hace de junta. No hay un corte
  seco.
- **Se aplica a:** el racimo de fotos desiguales, contra la fila de tres tarjetas
  iguales que tiene hoy `WhatsOn`. Y la tira angosta como junta: nosotros ya
  tenemos la pieza real para eso, la cenefa de olas de `WaveBorder`.
- **No se toma:** el hero oscuro (es lo que estamos revirtiendo), la serif, ni la
  script manuscrita.

### `IMG_2908` — «The Pineapple Doors», alquileres del Florida Panhandle
La más cercana en tono de las diez, y la única del mismo territorio geográfico.
- **Composición:** base crema. Campos de color en **terracota y durazno**, nunca
  oscuros. Titular en caja alta, condensado, en color cálido **sobre el campo de
  color claro**. Fila de tres fotos al pie. Un sello circular como ancla.
- **Cambio de fondo:** los bordes entre superficies son **ondulados**, no rectos —
  el campo de color entra en la sección de arriba con una curva. Es el mismo
  recurso que nuestra cenefa de olas, usado más veces y con más confianza.
- **Se aplica a:** la validación de todo el planteo. Confirma que (a) crema
  aguanta como base de toda la página, (b) el borde ondulado entre superficies es
  el separador correcto y no un adorno, (c) un titular grande en color cálido
  sobre superficie clara es suficiente peso — no hace falta una losa oscura.
- **No se toma:** su paleta durazno/terracota, la script, ni el sello.

### `IMG_2909` — «BAKE Today»
- **Composición:** página crema con **una sola losa saturada** —rojo profundo— que
  lleva un titular de caja alta centrado. Debajo, una tira de marquee, y después
  una fila de tres fotos con la etiqueta en **píldora** («STEP 1 · Add water») y el
  cuerpo debajo, sobre la superficie limpia.
- **Cambio de fondo:** crema → losa de color → tira de marquee → crema. **Un solo
  corte marcado en toda la página**, y el marquee amortiguando la salida.
- **Se aplica a:** la política de superficie oscura, que es la decisión central de
  esta rama. Un corte, no cinco. Y las etiquetas en píldora para la secuencia de
  `HowThisPlaceWorks`, en lugar de los `01/02/03` en teal que hoy no se leen.
- **No se toma:** el rojo, las píldoras rotadas tipo sticker, ni el marquee (ya se
  dio de baja en este proyecto: `FeaturesMarquee` salió por repetir el `PromoBar`).

### `IMG_2912` — «Casa Coco»
- **Composición:** un **panel crema flotando sobre una foto cálida a sangre**. El
  panel lleva el logotipo al centro y **cuatro micro-etiquetas ancladas a las
  esquinas**, no apiladas encima del título. Detrás del panel, un patrón dibujado
  a mano que **asoma por fuera** de sus bordes.
- **Cambio de fondo:** no hay bandas. La foto es el fondo y el panel claro es el
  soporte del texto. Es la solución limpia al problema de poner texto sobre foto:
  el contraste se mide contra el panel, no contra la foto.
- **Se aplica a:** el `EventsBanner`, que hoy resuelve lo mismo con un velo
  `bg-deep/90` encima de la foto. Y el patrón que asoma detrás del panel: tenemos
  la pieza real, `public/brand/tile-pattern.svg`, que hoy se usa poco.
- **No se toma:** la paleta durazno, la script del logotipo, ni el borde de greca
  dibujado a mano.

### `IMG_2913` — etiqueta «Wick»
- **Composición:** ficha clara sobre un fondo de color con **sombra de palmera**
  como única textura. **Pares de datos anclados en las esquinas** («NET W. 8 OZ» /
  «EST. 1909»), un sello circular al centro, y una **píldora amarilla** como único
  acento saturado. El borde inferior de la ficha es **festoneado**.
- **Cambio de fondo:** ficha clara sobre campo de color; el festón hace la junta.
- **Se aplica a:** el borde festoneado como cierre de un panel claro —lo tenemos
  en la cenefa de olas—, y sobre todo **la píldora amarilla**: justifica que
  `cream-deep` (#FDF0B4) exista como pieza chica de acento y no como fondo grande,
  que es exactamente lo que pide el brief. Los pares de datos en esquina se
  aplican a las horas y la dirección en `FindUs`.
- **No se toma:** la serif con la script, el fondo texturado, ni el sello.

---

## Las que sólo confirman paleta — no son fuente de layout

### `IMG_2910` y `IMG_2911` — ilustración tropical de papel cortado
`2910`: siluetas de palmera, hibisco, sol y coral en **un solo color** sobre rosa
pálido. `2911`: bodegón de papaya con frondas de palmera en **verde oscuro**, soles
en **naranja**, sobre **crema**.

`IMG_2911` es la prueba de que el planteo del brief cierra: **verde oscuro como
color de dibujo y de tipografía, naranja como acento, crema como base** — y el
resultado se lee cálido, claro e inequívocamente tropical. Es el reparto exacto
que pide la tabla del §1 del brief, dibujado.

Aporte a la composición: **ninguno**. No hay layout que leer. Y como el brief
prohíbe explícitamente sacar paleta del moodboard, quedan como confirmación de una
decisión ya tomada, no como fuente. No se traduce el estilo de papel cortado a
gráficos nuevos: ya tenemos arte de marca real —la cenefa de olas y el azulejo,
sacados del Figma— y meter una tercera familia gráfica sería el mismo error que
meter una tercera tipografía.

---

## Las que se descartan

### `IMG_2904` — agencia de branding en rojo oscuro
Hero de foto a sangre en rojo oscuro, titular grotesco grande, filas de tres fotos,
carrusel de tarjetas. Se descarta por dos razones: la **luminosidad es la opuesta**
a la que persigue esta rama, y su recurso tipográfico central —una palabra del
titular en otro color y el resto en gris— es literalmente el anti-patrón que el
brief acota a «máximo 2 titulares de la home». Tomarla sería reforzar lo que
estamos sacando.

### `IMG_2907` — «Voyage», plantilla de viajes
Lleva la marca de agua «Modificado por IA». Es el kit por defecto completo: hero de
foto con buscador encima, fila de cuatro íconos con micro-etiqueta, tres tarjetas
de foto idénticas con el precio abajo, mockup de tres teléfonos. Es exactamente el
aspecto de plantilla que hay que evitar, y su fila de tarjetas iguales es el
anti-patrón que estamos sacando de `WhatsOn`. Se descarta entera.

### El screenshot de teléfono en sí
Las diez son capturas con barra de estado, botones de Pinterest y fondo
desenfocado. Nada de ese cromo entra en ninguna decisión.
