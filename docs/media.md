# Medios — qué hay, dónde se usa y qué falta

Entrega del cliente del 2026-09-10, en `public/multimedia/`: **36 fotos y 5
videos, 681 MB**.

Esa carpeta es la **entrada**, no lo que se publica. Está en `.gitignore` —igual
que `public/fonts/_drop`— y lo que se versiona son los derivados que genera
`npm run media`.

```
originales usados   360,0 MB
derivados             2,9 MB      −99,2 %
```

La reducción no es sólo compresión: los originales van de 7008×4672 a 4000×6000
y los derivados se recortan al tamaño y la proporción en que se muestran.

> ⚠️ **`next/image` no alcanza por sí solo.** Optimiza lo que SIRVE, pero el
> archivo fuente en `public/` viaja igual al deploy. Con 681 MB de originales
> ahí adentro, el build entero se lleva eso sin que nadie lo vea.

---

## 1. Los videos: sólo dos de los cinco sirven

Y el motivo no es el peso, es el contenido.

| archivo | qué es | veredicto |
|---|---|---|
| `LATIN NIGHT 1.mp4` | gente bailando en la noche latina | ✅ **se usa** |
| `GABRIEL KEY 2.mp4` | un guitarrista tocando | ✅ **se usa** |
| `Rooftop_4th schedule.mov` | placa gráfica animada: «RED WHITE & MIMOSAS · JULY 4TH · $30 BOTTOMLESS» | ❌ es un flyer |
| `Rooftop_Red White Mimosas.mov` | una persona hablando a cámara, subtítulo quemado | ❌ es un reel |
| `Gaming Truck.mp4` | ídem, con el rótulo «EVER GAME TRUCK» | ❌ es un reel |

Los tres descartados son **piezas de redes**. En una card de 130px, muteada y en
loop de 6 segundos:

- el flyer no se puede leer, así que no queda nada;
- los dos reels son alguien moviendo la boca en silencio, y eso no lee como
  ambiente sino como video roto.

**No se borran.** Siguen en `public/multimedia/` y sirven para redes, o para una
página de eventos con sonido y controles de reproducción. Simplemente no son
material para un muro decorativo.

### Lo que se les hizo a los dos que sí

Estaban en **HEVC**, que sólo reproduce Safari — en Chrome y Firefox el
`<video>` queda negro. Había que recodificar de todos modos.

```
9:16 → recorte central a 3:4 → 480×640 → 6 s → H.264 → sin audio → faststart
161 MB  →  440 KB        (live-music)
 98 MB  →  518 KB        (latin-night)
```

Cada uno lleva además un **póster** (~32 KB): es el frame que se ve antes de que
cargue el video, y es lo que se muestra con `prefers-reduced-motion` en lugar
del clip.

---

## 2. Dónde se usa cada foto

| derivado | origen | dónde | por qué esa |
|---|---|---|---|
| `wall-cocktails-rooftop.jpg` | `_RCZ4830` | arco del hero | tres tragos en la mesa del rooftop a contraluz |
| `wall-truck-window-day.jpg` | `_RCZ8096` | arco del hero | la ventanilla de Butcher's Blvd con gente |
| `wall-food-platter.jpg` | `D5F6CEA7…` | arco del hero | plato de comida + trago, vertical |
| `wall-live-music-tent.jpg` | `_RCZ5702` | arco del hero | músico tocando bajo la carpa |
| `wall-yard-night-table.jpg` | `_RCZ5884` | arco del hero | grupo en la mesa de noche, trucks encendidos |
| `wall-guests-yard-day.jpg` | `_RCZ8185` | arco del hero | gente en el patio de día |
| `wall-dancing-night.jpg` | `_RCZ4382` | arco del hero | pista de noche |
| `wall-bartender.jpg` | `_RCZ4397 (1)` | arco del hero | el bartender preparando un trago |
| `wall-yard-night-crowd.jpg` | `_RCZ4336` | muro vertical (forma alternativa) | |
| `wall-sandwich.jpg` | `_RCZ4528` | muro vertical (forma alternativa) | |
| `event-live-music.jpg` | `_RCZ5702` | What's on → **Ross Brown** | Ross Brown toca los jueves: la foto ES un músico tocando en el venue |
| `event-yard-night.jpg` | `_RCZ5757` | What's on → **Bingo Night** | bingo es los miércoles en The Yard: la foto es el patio de noche con gente en las mesas |
| `event-dj-night.jpg` | `_RCZ4382` | What's on → **La Noche · DJ David Cast** | la pista de noche |
| `hero-truck-window.jpg` | `_RCZ5847` | **el hero de la home** | ver abajo, tiene sección propia |
| `truck-window-night.jpg` | `_RCZ5847` | «Five businesses» *(ya no se usa, ver abajo)* | la ventanilla de noche con gente pidiendo |
| `venue-aerial.jpg` | `WhatsApp Image…` | fondo del Events banner, **y nada más** | la aérea del patio ENTERO, para un bloque que dice «cerramos el lugar completo» |
| `story-yard-day-wide.jpg` | `_RCZ8015` | **el hero de `/our-story`** | 17:9, la sexta de esa medida. Es el patio desde arriba y el único plano que muestra la PLANTA del lugar, que es lo que cuenta esa página. Se descartó `DSC04091` —el patio lleno de familias, que pegaba mejor con «A Magnus family project»— porque es el 4 de julio y una página de marca no puede tener fecha |

### 2 bis. Las siete del market, que NO son de la entrega

La entrega de 36 fotos **no tiene ni una del Neighborhood Market**: son camiones,
barra y noches de música. O sea que la alternativa no era «otra foto», era
ilustrar una página de artesanos con fotos de otra cosa.

Se bajaron el **2026-09-22** de la galería que el propio local publica en
`eatdrinkparadise.com/neighborhood-market`. Es material del cliente, publicado
por el cliente, reutilizado en el sitio nuevo del cliente.

Viven en **`public/images/market/`**, no en `images/venue/`: esa carpeta es la
derivada de la entrega y hasta acá lo era sin excepción. El día que el cliente
mande fotos propias del market, entran ahí y estas se van.

| derivado | medida | dónde | qué se ve |
|---|---|---|---|
| `hero-yard-wide.jpg` | 2048×1084 (17:9) | **el hero de `/market`** | los puestos de ropa con las carpas, dos vendedores atendiendo |
| `stall-jewelry.jpg` | 880×1100 (4:5) | el muro | tres vendedoras detrás de una mesa de collares |
| `stall-picnic.jpg` | 900×675 (4:3) | el muro | una mesa baja puesta para picnic sobre el césped |
| `stall-art.jpg` | 880×1100 (4:5) | el muro | un puesto de cuadros y láminas de la costa |
| `stall-flowers.jpg` | 900×675 (4:3) | el muro | el puesto de flores, con baldes de tallos y plantas |
| `vendor-boba.jpg` | 880×1100 (4:5) | el muro | una vendedora entregando un pedido sobre el mostrador |
| `stall-home.jpg` | 900×675 (4:3) | el muro | mesa larga con platos, velas y flores secas |

⚠️ **El hero sale a 2048 y no a los 2576 de los otros seis heroes.** El original
mide 2048×1365 —Wix no sirve nada más grande, la URL sin transformar ya es el
archivo subido— así que 2576 sería un upscale de 1,26×, que es exactamente lo
que este archivo le critica al hero viejo de la home. A 1288 de placa sigue
dando 1,59× de densidad.

⚠️ **Dos medidas y no una, y el orden alterna.** El muro es de tres columnas:
con seis tiles del mismo alto queda un catálogo, con tres verticales y tres
apaisadas intercaladas queda una pared. Es el mismo criterio del tendal de
`PhotoDivider`. El orden está fijado en `SHOTS`, en `content/market.ts`.

### La foto del hero

Es la más grande del sitio y el LCP de la home, así que va aparte.

```
_RCZ5847.JPG   3465×5198  →  hero-truck-window.jpg  2576×1200  (506 KB)
foco 0,4586
```

**⚠️ Antes acá estaba `venue-aerial.jpg`, y era un error de destino.** Esa
derivada se genera a 1000×667 con calidad 70 a propósito, porque su lugar es el
fondo del Events banner, que la pinta con `blur-[22px]`. El hero la mostraba
nítida y a todo el ancho: 1000px estirados hasta 2576 en una pantalla retina,
**2,6 veces**, y un upscale no lo arregla ninguna calidad de compresión. Encima
la aérea es de una clase de yoga y lleva las carpas y los banderines de JETSET,
o sea la marca de otro, que es lo que este mismo documento lista como material
que no sirve.

**Por qué 2576×1200 y no 2080 como el resto.** El marco mide 1288 CSS de ancho
tope, así que 2576 es exactamente 2×: el primer valor que no obliga a
`next/image` a estirar en retina. Con 2080 el techo queda en 1,61×. Es la única
foto que justifica el peso, porque es la única a todo el ancho y sin blur que
perdone. Y la proporción es la del marco al píxel —2576/1200 = 1288/600—, así
que el `object-cover` del componente no recorta nada.

**Por qué ese foco.** La foto es vertical y la banda mide 1614 de alto: sobran
3584px, o sea que el recorte decide qué foto es. Con el centro en 0,4586 entra
la guirnalda, la ventanilla encendida con la cocinera adentro, las dos personas
pidiendo y el cartel de Birria Tacos. Más arriba se cortan las dos personas al
pecho; más abajo aparece una cabeza fuera de foco en el borde inferior izquierdo
que lee como error de encuadre.

**Las otras dos finalistas** eran `_RCZ4830` (los tragos a contraluz) y
`_RCZ4336` (el patio de noche). La de los tragos se cayó por dos motivos: ya se
usa en el `PhotoDivider`, y el naranja de la placa «Together» se despinta contra
los ámbar del trago. Sobre el azul de esta, la placa es lo más saturado de la
primera pantalla.

### Dos notas de criterio

**Qué foto se le puede poner a un evento.** La entrega no trae fotos *de* estos
eventos: trae fotos del lugar. La regla que se aplicó es que la imagen muestre
**el tipo de noche y el espacio** donde el evento pasa, y que el `alt` describa
**lo que se ve**, no lo que dice el título. Un `alt` que diga «Bingo Night» sobre
una foto donde no hay bingo es una mentira para quien usa lector de pantalla.
El mapa vive en `IMAGENES`, en `src/content/events.ts`.

**`truck-window-night.jpg` quedó sin uso.** Se generó para el hueco de la
escalera diagonal de «Five businesses», y esa sección cambió de forma: ahora son
tres cuadros de color con la trama de grecas, sin fotos. El derivado se conserva
porque es la mejor foto de «order at whichever window you want» que hay en la
entrega, y esa sección puede volver a querer una imagen.

⚠️ **Pero ahora sale del mismo original que el hero.** Antes de colgarla en
cualquier lado hay que mirar la home entera: puesta en una sección, la misma
escena aparecería dos veces en la misma página, que es exactamente lo que se
evitó al elegir esta foto para el hero y no la de los tragos.

---

## 3. ⚠️ Lo que FALTA

Ordenado por lo que más bloquea.

### Lo que falta para que el sitio esté completo

| # | Qué | Para qué | Por qué no se puede reemplazar |
|---|---|---|---|
| 1 | **Un perro en el patio.** Alguien con su perro en una mesa, o un perro en la fila de un truck. | La card de **Wooftop Wednesdays** en What's on | Es la noche de perros y en las 36 fotos **no hay ni un perro**. Cualquier foto del patio ahí diría «traé al perro» sobre una imagen sin perros. Es el único hueco marcado que queda en la home. |
| 2 | **Cielo de atardecer sobre el rooftop.** Horizontal, con las nubes doradas de las 6 de la tarde, desde la terraza. | El fondo del hero — está en el mockup | No hay ni una foto de cielo en la entrega, y menos de golden hour. Un degradado CSS que lo imite es exactamente lo que el brief prohíbe. **Ya NO bloquea:** el hero tiene la ventanilla de noche, que funciona. Pasó a ser una mejora, no un hueco. |
| 3 | **Clips AMBIENTE, verticales, sin texto ni locución.** 3:4 o 9:16, 6–10 s, sin gente hablando a cámara y sin rótulos quemados. Seis u ocho alcanzan. | El arco del hero y el muro vertical | Hay dos y funcionan, pero se repiten. Lo que sobra son piezas de redes, que en un tile muteado no sirven. Ejemplos de toma: la barra sirviendo, el humo de una parrilla, la fila en una ventanilla, el atardecer desde la terraza, la banda arrancando. |

| 3 bis | **Fotos propias del Neighborhood Market.** Los puestos armados, la gente recorriendo, algún detalle de producto. Seis u ocho alcanzan, y sirve tanto horizontal como vertical. | El hero y el muro de `/market` | **No bloquea, pero sí es prestado.** Hoy las siete que usa la página se bajaron de la galería del sitio Wix del propio cliente (ver §2 bis), o sea que son de él pero no nos las dio: no tenemos el original, están a 2048px de lado largo y por eso el hero sale una medida por debajo del resto. De las 36 fotos de la entrega no hay **ni una** del market. |

| 4 | **El gaming truck, abierto y de frente.** Horizontal y bien apaisada (17:9), con las pantallas encendidas y gente jugando adentro. | El hero de `/game-truck` | Es el **único hueco de foto que queda en un hero** de todo el sitio. De las 36 fotos no hay ni una del camión, y las dos cosas que parecen serlo no lo son: `/images/game-truck.jpg` es el flyer de Instagram con el logo quemado, y `Gaming Truck.mp4` es el reel. Al rediseñar la página (2026-09-22) se revisó el reel cuadro por cuadro buscando un fotograma servible: los planos del exterior están desenfocados —el foco es la presentadora que pasa delante—, los del interior son pantallas de juego llenando el cuadro, y el archivo mide 1440px contra los 2576 del marco. |

### Lo que mejoraría lo que ya hay

| # | Qué | Para qué |
|---|---|---|
| 4 | **Bingo en acción.** Los cartones en la mesa, la gente jugando. | Reemplazar la foto genérica de patio de noche en la card de Bingo Night |
| 5 | **El Sunset Bar de día, vacío y ordenado.** | Hoy las tomas del bar son con gente y de noche; falta la que muestra el lugar como espacio |
| 6 | **Un evento privado montado.** Mesas puestas, el lugar cerrado, antes de que llegue la gente. | El Events banner usa la aérea, que funciona, pero una foto de un evento montado vende mejor |

### Especificación técnica, para pedirlas

- **Fotos:** el lado largo de 3000px alcanza y sobra; el pipeline las baja a lo
  que se muestra. JPEG. Sin filtros ni marcas de agua.
- **Videos:** vertical, 6–10 s, **sin audio necesario** (se usa muteado),
  **sin texto quemado**, **sin nadie hablando a cámara**. H.264 o HEVC —el
  pipeline recodifica— y sin límite de peso en el original.
- **Lo que no sirve:** capturas de Instagram, piezas con rótulo gráfico, fotos
  con el logo de otra marca encima.

---

## 4. Los scripts

| comando | qué hace |
|---|---|
| `npm run media` | fotos y videos: recorta, recodifica y genera pósters |
| `npm run greca` | las dos grecas del Figma → la tira de trama (148 KB → 6 KB) |
| `npm run horizonte` | el elemento de transición → la ola inline + el medallón |

Los tres leen de `design-audit/tmp/` o de `public/multimedia/` y escriben en
`public/`. Todos son idempotentes: se pueden correr de nuevo sin efectos.

### Arte de marca traído del Figma en esta rama

| pieza | nodo | destino | peso |
|---|---|---|---|
| greca A y B | `2012:4489`, `2012:4488` | `public/brand/greca.png` | 148 KB → **6 KB** |
| horizonte | `2012:4491` | `horizonte-ola.ts` + `public/brand/sun-palm.svg` | 75 KB → 1,8 KB inline + 56 KB cacheado |

⚠️ Los dos scripts **rasterizan o parten** los SVG en lugar de usarlos como
vienen, y el motivo es el mismo en los dos casos: son trazados a mano con miles
de micro-segmentos. La greca son 8.601 y 10.375 números para un dibujo que se
repite cientos de veces. El detalle está en el encabezado de cada script.
