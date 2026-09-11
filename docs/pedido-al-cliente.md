# Pedido al cliente — lo que falta para publicar

Un solo documento con todo lo que el sitio necesita y no tenemos. Cada ítem dice
**dónde cae**, **qué se ve hoy en su lugar** y **por qué no se puede reemplazar
por otra cosa**.

> Está armado recorriendo los marcadores reales del código
> —`<PhotoPending>`, `<PendingData>`, `<PendingBlock>`—, no de memoria. Cuando
> un ítem llega, el marcador desaparece solo: no hay que rediseñar nada.
>
> Regenerar el inventario:
> `grep -rn "PhotoPending\|PendingData\|PendingBlock" src/`

**Estado al 2026-09-10:** 27 ítems abiertos. Tres bloquean la home.

---

## Resumen por quién lo tiene que resolver

| bloque | ítems | quién |
|---|---:|---|
| A · Fotos y video | 12 | el cliente / un fotógrafo |
| B · Datos duros | 8 | el cliente (operaciones) |
| C · Archivos y enlaces | 3 | el cliente / decisión técnica nuestra |
| D · Textos | 3 | los dueños de los trucks |
| E · Marca | 1 | quien tenga el original del logo |

---

## A · Fotos y video

### A.1 · Bloquean la home — 3 ítems

| # | qué | dónde cae | qué se ve hoy | por qué no hay reemplazo |
|---|---|---|---|---|
| 1 | **Un perro en el patio.** Alguien con su perro en una mesa, o un perro en la fila de un truck. | La card de **Wooftop Wednesdays** en «This week in the yard» | El hueco gris marcado, con el brief de la toma escrito adentro | Es la noche de perros y en las 36 fotos entregadas **no hay ni un perro**. Poner otra foto del patio sería decir «traé al perro» sobre una imagen sin perros. Es el único hueco marcado que queda en la home |
| 2 | **Cielo de atardecer sobre el rooftop.** Horizontal, nubes doradas de las 6 de la tarde, tomado desde la terraza. | El fondo del hero — está en el mockup que aprobamos | El hero apoya en `bone`, la superficie clara de la marca | No hay ni una foto de cielo en la entrega, y menos de golden hour. Un degradado CSS que lo imite es exactamente lo que el brief prohíbe |
| 3 | **Seis u ocho clips AMBIENTE verticales.** 3:4 o 9:16, 6–10 s. | El arco de cards del hero | Los dos clips que sirven, repartidos en el arco | De los cinco videos entregados, tres son piezas de redes: un flyer animado y dos personas hablando a cámara con subtítulo quemado. Muteados en una card de 130px eso lee como video roto, no como ambiente. Detalle en `docs/media.md` §1 |

**Tomas concretas para el #3:** la barra sirviendo · el humo de una parrilla ·
la fila en una ventanilla · el atardecer desde la terraza · la banda arrancando ·
el patio llenándose.

### A.1 bis · Las piezas de los eventos — 2 ítems nuevos (2026-09-11)

Contexto: el carrusel de «This week in the yard» ya NO usa fotos genéricas del
venue. Usa la **pieza gráfica real** que el local publica por evento, bajada del
calendario del sitio viejo. Eso deja dos pendientes.

| # | qué | por qué |
|---|---|---|
| 1 bis | **El flyer de «La Noche» SIN el dominio viejo.** La pieza que está publicada lleva impreso `WWW.EATDRINKPARADISE.COM` en el pie. | Publicada tal cual en el sitio nuevo, el evento **promociona la web que estamos reemplazando**. No se puede arreglar desde el código: el texto está adentro del JPG. Hace falta la pieza sin esa línea, o con el dominio nuevo |
| 1 ter | **Las piezas de «Wooftop Wednesdays» y «Bingo Night»**, si esos eventos existen. | Hoy las dos tarjetas muestran el hueco gris marcado. No hay pieza de dónde bajarlas porque **el calendario del cliente no publica esos dos eventos** (ver `current-site-inventory.md` §9). Va atado a la pregunta «¿los miércoles pasan o no pasan?» |

> ⚠️ El ítem 1 del bloque de arriba —la foto del perro— **queda supeditado a
> esto**: si Wooftop tiene su propia pieza gráfica, ya no hace falta una foto
> con un perro, alcanza con el flyer.

---

### A.2 · Bloquean páginas internas — 4 ítems

| # | qué | dónde cae |
|---|---|---|
| 4 | El truck de **OCN Seafood Co.** abierto y sirviendo, al atardecer, ventanilla iluminada, gente pidiendo | `/food-trucks/ocn-seafood-co` |
| 5 | El truck de **Butcher's Blvd** en el patio, más un primer plano de una smashburger en el pase | `/food-trucks/butchers-blvd` |
| 6 | El truck de **Reggae Kitchen** con el cartel legible, y un plato servido que muestre el color | `/food-trucks/reggae-kitchen` |
| 7 | **El patio cubierto** una vez terminada la reforma — plano general que muestre cómo conecta el yard con la barra | `/events/spaces`, la ficha de The Patio |

De los cuatro trucks activos, **tres no tienen ninguna foto**. Hoy cada ficha
muestra el hueco marcado a lo ancho, con el brief de su toma adentro.

### A.3 · Mejoran lo que ya funciona — 5 ítems

| # | qué | para qué |
|---|---|---|
| 8 | **Bingo en acción** — los cartones en la mesa, la gente jugando | Reemplaza la foto genérica de patio de noche en la card de Bingo Night |
| 9 | **El Sunset Bar de día, vacío y ordenado** | Todas las tomas del bar son con gente y de noche; falta la que muestra el lugar como espacio |
| 10 | **Un evento privado montado** — mesas puestas, el lugar cerrado, antes de que llegue la gente | El Events banner usa la aérea del patio, que funciona, pero un evento montado vende mejor |
| 11 | **El patio con los cuatro trucks desde el rooftop**, con el escenario armado | La ficha de The Yard usa una fila de camiones vacía |
| 12 | **Un evento privado en curso**, rooftop y patio llenos, desde el lado de la calle | La ficha de Full Buyout |

### Especificación técnica, para pasarle al fotógrafo

- **Fotos:** lado largo de 3000px alcanza y sobra — el pipeline las baja a lo que
  se muestra. JPEG. **Sin filtros y sin marcas de agua.**
- **Videos:** vertical, 6–10 s. **El audio no hace falta** (van muteados),
  **sin texto quemado**, **sin nadie hablando a cámara**. H.264 o HEVC, el
  pipeline recodifica. Sin límite de peso en el original.
- **Lo que no sirve:** capturas de Instagram, piezas con rótulo gráfico, fotos
  con el logo de otra marca encima.

---

## B · Datos duros

Ninguno de estos se estima. Una capacidad en la página de un venue es una
promesa, y un número inventado se convierte en un problema comercial el día que
alguien lo usa para decidir.

| # | qué | dónde cae | qué se ve hoy |
|---|---|---|---|
| 13 | **Capacidad de pie** del Sunset Bar, The Yard, The Patio y Full Buyout | `/events/spaces`, la tabla de cada espacio | `TBD` con borde punteado |
| 14 | **Capacidad sentada** de los mismos cuatro | ídem | `TBD` |
| 15 | **Mínimo de invitados** de los mismos cuatro | ídem | `TBD` |
| 16 | **Planos de planta**, si existen | `/events/spaces` | un bloque «Pending» que lo explica |
| 17 | **Cuántas consolas** hay en el game truck | `/events/game-truck` | `TBD` |
| 18 | **Cuántas consolas y cuántas pantallas** en el game lounge | `/the-experience` | `TBD` ×2 — **y acá hay un conflicto**: el brief y el sitio actual dan números distintos, así que no alcanza con elegir uno |
| 19 | **Próximas fechas del market** | `/market` | `TBD` |
| 20 | **Horarios propios de cada truck**, si difieren del venue | las cuatro fichas de `/food-trucks`, la fila «When they're here» | «The roster rotates» con un link al calendario. Es cierto y sirve, pero si algún truck tiene días fijos conviene decirlo |

Los cuatro espacios están en `src/content/spaces.ts` y los trucks en
`src/content/trucks.ts`: los números entran ahí y los `TBD` se van solos.

---

## C · Archivos y enlaces

| # | qué | dónde cae | qué se ve hoy |
|---|---|---|---|
| 21 | **El PDF del events packet** | `/events/inquire` | El brief pide que se entregue en el momento de enviar el formulario. Como el PDF no existe, la confirmación dice que llega adjunto en la respuesta. Con el archivo pasa a ser descarga inmediata |
| 22 | **La URL de organizador de Eventbrite** | `/the-yard`, el bloque de entradas | Un bloque «Pending»: sin la URL la página no puede apuntar a ningún lado para comprar |
| 23 | **Backend de formularios + almacenamiento de archivos** — decisión técnica, no del cliente | `/join-us` | El sitio actual corre tres formularios con subida de hasta 15 MB (material de músicos, datos de vendors, CVs). Hasta que se elija dónde viven, la página manda a email, que es honesto y funciona hoy |

---

## D · Textos

**Nada de esto lo escribimos nosotros.** Es la regla del proyecto: ningún texto
del sitio sale de una IA.

| # | qué | dónde cae |
|---|---|---|
| 24 | **La historia de OCN Seafood Co., Butcher's Blvd y Reggae Kitchen** — dos o tres frases del dueño: quién es, de dónde viene, por qué lo conocen | las tres fichas de `/food-trucks`. El Chilango ya tiene la suya, tomada del sitio viejo |
| 25 | **El Instagram de cada truck**, si tienen | las cuatro fichas |
| 26 | **Quién es el partner de caridad hoy**, y dónde va esa sección | `/our-story`. Vivía en `/giveback`, una página que el brief no contemplaba; el partner que muestra el sitio viejo está vencido. Hay que decidir si va en su propia ruta o dentro de Our Story |

---

## E · Marca

| # | qué | por qué |
|---|---|---|
| 27 | **El logo lockup full color en vectorial** (`.ai`, `.svg` o `.pdf`) | Es lo único del sitio que no escala: el header usa un PNG. Del isotipo, de la cenefa de olas, del azulejo y del medallón de sol y palmera ya tenemos el vector, salido del Figma. Del lockup completo, no |

---

## Lo que NO hay que pedir

Para que nadie vuelva a pedirlo por inercia:

- **Los tres videos descartados no se borran y no hay que reemplazarlos.** Siguen
  en `public/multimedia/` y sirven para redes, o para una página de eventos con
  sonido y controles. Simplemente no son material para un muro decorativo.
- **Fotos de comida no faltan.** De las 36 entregadas, buena parte son platos y
  tragos, y están bien. Lo que falta es el LUGAR y la GENTE en situaciones
  concretas: el perro, el bingo, el evento montado, el cielo.
- **Los tres trucks retirados** —Prime Carvery, Sea Me on Wheels, Tropical
  Fusion— tienen su foto y no necesitan nada más. Sus URLs viejas redirigen
  solas desde `content/trucks.ts`.
