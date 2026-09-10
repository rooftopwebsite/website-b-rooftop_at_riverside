# Medios — qué hay, dónde se usa y qué falta

Entrega del cliente del 2026-09-10, en `public/multimedia/`: **36 fotos y 5
videos, 681 MB**.

Esa carpeta es la **entrada**, no lo que se publica. Está en `.gitignore` —igual
que `public/fonts/_drop`— y lo que se versiona son los derivados que genera
`npm run media`.

```
originales usados   338,4 MB
derivados             1,9 MB      −99,4 %
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
| `truck-window-night.jpg` | `_RCZ5847` | «Five businesses» *(ya no se usa, ver abajo)* | la ventanilla de noche con gente pidiendo |
| `venue-aerial.jpg` | `WhatsApp Image…` | fondo del Events banner | la aérea del patio ENTERO, para un bloque que dice «cerramos el lugar completo» |

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

---

## 3. ⚠️ Lo que FALTA

Ordenado por lo que más bloquea.

### Lo que falta para que el sitio esté completo

| # | Qué | Para qué | Por qué no se puede reemplazar |
|---|---|---|---|
| 1 | **Un perro en el patio.** Alguien con su perro en una mesa, o un perro en la fila de un truck. | La card de **Wooftop Wednesdays** en What's on | Es la noche de perros y en las 36 fotos **no hay ni un perro**. Cualquier foto del patio ahí diría «traé al perro» sobre una imagen sin perros. Es el único hueco marcado que queda en la home. |
| 2 | **Cielo de atardecer sobre el rooftop.** Horizontal, con las nubes doradas de las 6 de la tarde, desde la terraza. | El fondo del hero — está en el mockup | No hay ni una foto de cielo en la entrega, y menos de golden hour. Un degradado CSS que lo imite es exactamente lo que el brief prohíbe. |
| 3 | **Clips AMBIENTE, verticales, sin texto ni locución.** 3:4 o 9:16, 6–10 s, sin gente hablando a cámara y sin rótulos quemados. Seis u ocho alcanzan. | El arco del hero y el muro vertical | Hay dos y funcionan, pero se repiten. Lo que sobra son piezas de redes, que en un tile muteado no sirven. Ejemplos de toma: la barra sirviendo, el humo de una parrilla, la fila en una ventanilla, el atardecer desde la terraza, la banda arrancando. |

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
