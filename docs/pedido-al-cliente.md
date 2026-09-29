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

**Estado al 2026-09-11:** 33 ítems abiertos, más el 12 bis que se abrió el 2026-09-22 con el rediseño de `/market`. Tres bloquean la home y **uno
bloquea toda la lógica de reservas**: el 0, OpenTable.

> ### 0 · ⚠️ ¿Para qué usan OpenTable?
>
> El cliente **tiene cuenta de OpenTable** y no sabemos qué hace con ella.
> Las tres respuestas posibles cambian páginas distintas:
>
> - **Reservas de mesa todos los días** → va un «Book a table» en el header, en
>   `/visit` y al pie de cada página de venue.
> - **Sólo en noches de evento** → el aviso de reserva vive en `/whats-on` y en
>   la ficha de cada evento, al lado del de Eventbrite.
> - **Sólo grupos grandes o eventos privados** → es parte del flujo de
>   `/events/inquire` y no se menciona en ningún otro lado.
>
> Hace falta además **la URL del perfil**. Hasta que llegue la respuesta ninguna
> página puede decir si se reserva, si se saca entrada, o las dos cosas.

---

## Resumen por quién lo tiene que resolver

| bloque | ítems | quién |
|---|---:|---|
| A · Fotos y video | 13 | el cliente / un fotógrafo |
| B · Datos duros | 8 | el cliente (operaciones) |
| C · Archivos y enlaces | 9 | el cliente / decisión técnica nuestra |
| D · Textos | 3 | los dueños de los trucks |
| E · Marca | 1 | quien tenga el original del logo |
| F · Temporada de fútbol | 6 | Chris, Anthony y nosotros |
| G · Los mensuales de Madeline | 9 | Madeline Powers |

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

### A.1 ter · El video del hero — 1 decisión, no es un pedido de material (2026-09-16)

La portada de la home es, desde hoy, **el mismo video que el cliente ya tiene en
el hero de su sitio de Wix**, bajado a `public/videos/hero-home.mp4` y servido
desde nuestro repo. Pedido de Camila: «sin recortar ni nada, usemos ese tal
cual», así que va completo: mismo encuadre, mismos 68,8 segundos, misma
velocidad. Lo único que se le hizo es recodificarlo y sacarle el audio.

| lo que pesa | |
|---|---|
| lo que sirve Wix hoy, 1080p | 52 MB |
| lo que servimos nosotros | **30,5 MB** |

**La decisión que queda abierta: la duración.** 30 MB es mucho para una portada
que arranca sola, y no hay margen de compresión: es material de dron sobre
vegetación densa, de lo más caro que existe para comprimir. Medido con VMAF
sobre el tramo aéreo, bajar de CRF 30 lleva la calidad de 92 a 78 puntos, o sea
que empieza a verse sucio en pantalla grande. La única palanca real es cortarlo:

| duración | peso aproximado |
|---|---|
| 68,8 s — lo que hay hoy | 30,5 MB |
| ~30 s | ~13 MB |
| ~20 s | ~9 MB |

Cortarlo contradice el «tal cual» del pedido, así que **no se cortó**. Si el
cliente o Camila deciden que la home no puede pesar eso, se elige el tramo y se
recorta en una corrida de `ffmpeg`; el archivo fuente en 1080p está guardado
fuera de git, en `_interno/video-sitio/`.

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

### A.3 · Mejoran lo que ya funciona — 6 ítems

| # | qué | para qué |
|---|---|---|
| 8 | **Bingo en acción** — los cartones en la mesa, la gente jugando | Reemplaza la foto genérica de patio de noche en la card de Bingo Night |
| 9 | **El Sunset Bar de día, vacío y ordenado** | Todas las tomas del bar son con gente y de noche; falta la que muestra el lugar como espacio |
| 10 | **Un evento privado montado** — mesas puestas, el lugar cerrado, antes de que llegue la gente | El Events banner usa la aérea del patio, que funciona, pero un evento montado vende mejor |
| 11 | **El patio con los cuatro trucks desde el rooftop**, con el escenario armado | La ficha de The Yard usa una fila de camiones vacía |
| 12 | **Un evento privado en curso**, rooftop y patio llenos, desde el lado de la calle | La ficha de Full Buyout |
| 12 bis | **Fotos propias del Neighborhood Market** — los puestos armados, la gente recorriendo, algún detalle de producto. Seis u ocho alcanzan, horizontales y verticales mezcladas | El hero y el muro de `/market`. **No bloquea, pero lo que hay es prestado:** las siete que usa la página hoy se bajaron de la galería del sitio Wix del propio cliente, o sea que son de él pero no nos las dio. Están a 2048px de lado largo y por eso el hero de `/market` sale una medida por debajo de los otros seis. De las 36 fotos de la entrega no hay **ni una** del market |

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
| 12 bis | ~~**Qué días es el happy hour: ¿martes o miércoles?**~~ **RESUELTO el 2026-09-17, y ninguna de las dos opciones era la buena.** El cliente pasó el dato real: **Weekend Happy Hour, sábado y domingo de 12 a 6, en todo el venue**, con `$1 off` en drafts, bottles y cans, `$8` Tito's, Captain y Crown's, `$10` margaritas y Superior Light Beer como marca destacada. Lo que publicábamos («Wednesday – Friday, 3–6 PM, $4 drafts, $5 house wines, $6 house drinks») salía del footer del sitio Wix y estaba mal de punta a punta. **Queda abierta una sola pregunta: ¿existe además un happy hour de semana, o el de fin de semana es el único?** | `/sunset-bar`, `/whats-on` y la píldora del hero de la home | El dato nuevo, leído del evento de la base |
| 13 | **Capacidad de pie** del Sunset Bar, The Yard, The Patio y Full Buyout | Ya no cae en ninguna pantalla: ver el aviso de abajo | **Nada.** El sitio no menciona aforos |
| 14 | **Capacidad sentada** de los mismos cuatro | ídem | ídem |
| 15 | **Mínimo de invitados** de los mismos cuatro | ídem. El único mínimo publicado es el de 12 de `/hostanevent`, que sí está en el sitio | ídem |
| 16 | **Planos de planta**, si existen | ídem | ídem |
| 17 | **Cuántas consolas** hay en el game truck | `/events/game-truck` | `TBD` |
| 18 | **Cuántas consolas y cuántas pantallas** en el game lounge | `/the-experience` | `TBD` ×2 — **y acá hay un conflicto**: el brief y el sitio actual dan números distintos, así que no alcanza con elegir uno |
| 19 | **Próximas fechas del market** | `/market` | `TBD` |
| 20 | **Horarios propios de cada truck**, si difieren del venue | las cuatro fichas de `/food-trucks`, la fila «When they're here» | «The roster rotates» con un link al calendario. Es cierto y sirve, pero si algún truck tiene días fijos conviene decirlo |
| 51 | **Las cinco zonas de estacionamiento: nombre, vigencia y si alguna se paga.** El 2026-09-22 apareció la fuente que faltaba —la página `/parking` del sitio viejo— y con ella se dibujó el mapa de `/contact#parking`. Pero la fuente es **una captura de pantalla de Google Maps del 29 de diciembre de 2023, sin una sola palabra escrita salvo «LIBRARY PARKING»**, así que quedan tres cosas sin confirmar: **(a)** que el reparto siga vigente casi tres años después; **(b)** los NOMBRES de cuatro de las cinco zonas, que los pusimos nosotros leyendo sobre qué calle cae cada mancha; **(c)** si alguna es paga, tiene horario o está reservada a otro comercio — la captura no distingue. **Y una pregunta puntual:** las dos filas pegadas a Old 41, que son las más cercanas a la puerta, ¿son del venue o del vecino? | La sección «Where to park» de `/contact` y el bloque Parking de la home | Las cinco zonas dibujadas y nombradas, sin decir de quién es cada una ni si se paga |

Los cuatro espacios están en `src/content/spaces.ts` y los trucks en
`src/content/trucks.ts`: los números entran ahí y los `TBD` se van solos.

> ### ⚠️ Los ítems 13 a 16 ya no se ven en el sitio — 2026-09-22
>
> La sección que los mostraba, «Pick your footprint» de `/events`, **se
> eliminó**. Camila: «esta parte se puede contar mucho mejor; de hecho ya se
> está contando en "Lo que viene con cada espacio", ¿por qué no la sacamos?».
>
> Eso cambia una sola cosa y conviene tenerla escrita: **estos cuatro ítems
> dejaron de tener marcador en pantalla.** Hasta ahora el sitio los pedía solo
> —el bloque naranja estaba a la vista de cualquiera que abriera `/events`— y
> desde hoy el único lugar donde constan es este documento. Si llegan los
> números y se quiere volver a publicar aforos, hay que **rediseñar dónde
> van**: ya no existe la tabla que los esperaba.
>
> Lo que sí sigue publicado es el mínimo de 12 invitados, que es el único dato
> de capacidad que el cliente publica hoy (`/hostanevent`: «*For parties less
> than 12 people contact: 239-268-0080»). Vive en `SMALL_PARTY_MAX` y se lee
> al lado del formulario.

> ⚠️ **El detalle del 12 bis, porque ahora se ve en la misma pantalla.** El
> cliente publica el happy hour en dos lugares y no dicen lo mismo:
>
> | dónde | qué dice |
> |---|---|
> | el footer de `eatdrinkparadise.com` | `Wednesday - Friday | 3pm - 6pm` |
> | la lámina 2 del menú, en el recuadro «HAPPY HOUR» | `TUE - FRI | 3-6 PM` |
>
> Y los horarios del propio venue dicen que **los lunes y los martes está
> cerrado** (`content/hours.ts`, la FAQ y los días cerrados del calendario), o
> sea que un happy hour que arranca el martes no puede ser. Por eso el sitio
> publica «Wednesday – Friday»: es la versión que no se contradice con nada.
>
> Desde que `/sunset-bar` muestra la lámina del menú, **las dos versiones
> conviven en la misma página**: la banda verde dice miércoles y la imagen de
> abajo dice martes. No se puede arreglar desde el código —el texto está
> adentro del JPG— así que o el cliente confirma cuál vale y manda la lámina
> corregida, o alguien va a preguntar.

### B bis · Lo que abrió comparar `/events` contra `/hostanevent` (2026-09-22)

Camila pasó la captura de la página de eventos que el cliente publica hoy y se
revisó campo por campo contra la nuestra. **Dos huecos se cerraron solos** —los
tres paquetes de barra y la regla de las fiestas de menos de 12, que estaban en
las fuentes y no en el sitio— y quedaron estas cuatro preguntas, que no se
pueden contestar desde acá porque las cuatro son promesas comerciales.

| # | qué | por qué no se decide de este lado |
|---|---|---|
| 52 | **¿Se alquila algo además del segundo piso, y a qué precio?** El PDF «Events Packages» tarifa **sólo** el second floor buyout ($750 / $1.250 la hora) y lista tres variantes, las tres de arriba: full upstairs, rooftop patio y rooftop inside. Nuestro `/events` ofrece además **The Yard cerrado con portón** y **el buyout completo**, y para fundraisers y fiestas de fin de año son el argumento principal. | Ninguna fuente del cliente le pone precio ni condiciones al patio de abajo. O existe una tarifa que no nos pasaron, o estamos ofreciendo un producto que no está a la venta |
| 53 | **¿Cuál es el teléfono de eventos?** La página `/hostanevent` manda las fiestas chicas al **(239) 268-0080**, que es el de la casa. La última lámina del PDF, «Let's collaborate», da **941-889-8827** y dos mails: `events@` y `mpowers@`. | El sitio publica hoy el de la casa en los dos lugares. Si el 941 es la línea de eventos, es el que tiene que estar al lado del formulario |
| 54 | **¿Hasta cuántos invitados entran?** Su formulario corta el desplegable en **«100 or more»**. El nuestro ofrece **«200 – 350»** y **«350+»**, que son rangos que nadie confirmó. | Es el ítem 13 escrito de otra manera: sin capacidad declarada, un rango en el desplegable es una capacidad declarada por la puerta de atrás |
| 55 | **¿Siguen vigentes los precios del PDF?** Ya estaba anotado como TODO en `content/events-pricing.ts` y ahora pesa más: con los paquetes de barra publicados, la página afirma **once números** del cliente y el PDF no tiene fecha en ninguna parte. | Podría ser de 2024. Es lo último que hay que confirmar antes de que `/events` salga a producción |
| 56 | ~~**El precio nuevo del alquiler del segundo piso.**~~ **Resuelto el 2026-09-29**: Maddie pasó $1,250 por 2 horas + $250 la hora extra (domingo a jueves), $2,000 + $500 (viernes y sábado), el patio a $1,000 flat y el venue completo a consultar. Ya está en `RENTAL`. | — |
| 57 | **El Events Packet PDF está desactualizado.** Sigue con los precios viejos (alquiler por hora, fees, open bar a $25) y con «Upscale catering». El botón de `/events` baja ese archivo. | Lo tiene que rehacer el cliente; cuando llegue, se cambia `EVENTS_PDF` en `content/events-pricing.ts` |
| 58 | **La comida de `/food-trucks` cuando arranque BBOT.** Va a haber servicio a la mesa con food runners y servers, además del pedido en la ventana. Chris decide cuándo; Maddie pasa la info. | Hasta entonces no se invierte más en esa parte de la página |

> **Un dato que NO es un pedido:** la primera lámina del PDF dice «food trucks
> serving 5 unique cuisines» y el sitio nuevo dice cuatro. No hay conflicto: el
> roster vigente tiene cuatro y los tres retirados están en `content/trucks.ts`
> con `active: false`. El PDF es el que quedó viejo.

---

## C · Archivos y enlaces

| # | qué | dónde cae | qué se ve hoy |
|---|---|---|---|
| 21 | **El PDF del events packet** | `/events/inquire` | El brief pide que se entregue en el momento de enviar el formulario. Como el PDF no existe, la confirmación dice que llega adjunto en la respuesta. Con el archivo pasa a ser descarga inmediata |
| 0 | **⚠️ Para qué usan OpenTable, y la URL del perfil** | El header, `/visit`, `/whats-on` y `/events/inquire` — depende de la respuesta | Nada: el sitio hoy no menciona reservas en ningún lado. Es el ítem más importante de la lista, ver el bloque del principio |
| 22 | **Confirmar el perfil de Eventbrite** (lo encontramos nosotros: `eventbrite.com/o/rooftop-at-riverside-104153700851`) | `/whats-on` y `/the-yard`, el CTA de entradas | Ya está puesto en `BRAND.eventbrite` y el bloque «Pending» se fue. Falta que el cliente confirme que es el suyo y que todo evento con entrada se vende por ahí. Hoy el perfil dice «No upcoming events» |
| 28 | **¿Siguen vigentes los tres documentos legales del camión?** Los dos waivers (`/bar-games-waiver`, `/game-zone-waiver`) y el PDF de políticas y procedimientos | Las tres páginas nuevas, y el bloque de links de `/game-truck` | **Los tres ya están publicados en el sitio nuevo**, textuales, el 2026-09-22: `/gaming-truck-policies`, `/game-zone-waiver` y `/bar-games-waiver`. Los dos 301 al ancla se fueron. Lo que falta es que el cliente confirme que ninguno cambió desde el 2026-09-15, que es la fecha que las tres páginas declaran como «last updated» porque es cuando tomamos el texto |
| 28a | **La edad mínima para jugar en el camión** | El bloque de links de `/game-truck`, y la respuesta a quien llama | Nada: no se publica. Ni los dos waivers ni el PDF fijan una edad. Lo más cerca es «we recommend that the youngest age group we accept party bookings for is age 6», que es una recomendación para reservar una fiesta, no un mínimo para jugar. El «21 and over» es de los juegos de la barra, que son otra cosa |
| 28b | **Falta una dirección de mail en el documento de políticas.** El apartado VIDEO GAME RATINGS dice «please send an e-mail to indicating the game(s)…» y después de «to» no hay nada | `/gaming-truck-policies` | Se publica tal cual, porque es el texto del cliente y no lo completamos nosotros. Con la dirección confirmada se corrige en el original y acá |
| 29 | **¿Sigue corriendo el sorteo de los jueves?** (`/tnt-sign-ups`, «Enter to win free tickets», QR en el local, ganador los viernes) | `/whats-on` | Mismo caso: 301 a `/whats-on` sin una línea del sorteo. Las bases legales ya están escritas y se reutilizan tal cual |
| 30 | **Los menús de los cuatro trucks vigentes** | las cuatro fichas de `/food-trucks` | El sitio actual sólo publica dos menús como imagen, y uno es de un truck que ya no está. De los cuatro del roster hoy sólo El Chilango tiene menú publicado |
| 31 | **El calendario mensual completo, evento por evento** | `/whats-on`, y la base de RestoExp | La base tiene hoy sólo los cuatro recurrentes semanales. Los eventos puntuales (festivales, shows con entrada) no están cargados, y son justamente los que se venden por Eventbrite. El cliente ya entrega el calendario del mes siguiente el día 10 |
| 32 | **¿La lista de email vive en Toast o en una planilla?** | el pre-footer de todo el sitio | El cuestionario F5 dice que el email marketing sale por Toast, que ya es el POS. El formulario del sitio apunta hoy a un webhook de planilla que todavía no existe. Según la respuesta cambia el destino del formulario, no el formulario |
| 23 | **Backend de formularios + almacenamiento de archivos** — decisión técnica, no del cliente | `/join-us` | El sitio actual corre tres formularios con subida de hasta 15 MB (material de músicos, datos de vendors, CVs). Hasta que se elija dónde viven, la página manda a email, que es honesto y funciona hoy |
| 24 | **⚠️ La planilla del newsletter y su webhook** — decisión técnica, no del cliente | El pre-footer de **las 23 páginas** | El formulario está terminado y valida, pero **el alta no se guarda**: sin `NEWSLETTER_SHEETS_WEBHOOK_URL` la action responde un error visible que manda a escribir a `info@eatdrinkparadise.com`. Ver el paso a paso abajo |

### 24 · Cómo se conecta el newsletter — 15 minutos

El formulario del pre-footer manda `{ firstName, email, source }` por POST a
una URL de Apps Script. Falta crear esa punta.

1. **Planilla nueva** en el Drive de la agencia. Primera fila:
   `fecha · firstName · email · source`.
2. **Extensiones → Apps Script**, pegar esto y guardar:

```js
function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    if (!d.email) throw new Error('email vacío');
    SpreadsheetApp.getActiveSpreadsheet()
      .getSheets()[0]
      .appendRow([new Date(), d.firstName || '', d.email, d.source || '']);
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    // ⚠️ Apps Script contesta 200 igual. Por eso el `result` va en el cuerpo
    // y `actions.ts` lo lee: sin esto un fallo de escritura se le reportaría
    // al usuario como éxito.
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. **Implementar → Nueva implementación → Aplicación web**, con
   *Ejecutar como* **yo** y *Quién tiene acceso* **cualquier persona**. Sin ese
   segundo valor el sitio recibe un 401 y el alta se pierde.
4. Copiar la URL `/exec` y cargarla como `NEWSLETTER_SHEETS_WEBHOOK_URL` en
   Vercel (los tres entornos) y en el `.env.local` de cada uno.

**Después de conectarla hay que probar un alta real** y ver la fila en la
planilla. El error de «no está conectado» y el de «falló la escritura» se ven
distintos en el navegador pero los dos se registran en los logs con el prefijo
`[newsletter]`.

> **Lo que esto NO es:** una plataforma de envío. La planilla junta la lista;
> mandar la campaña sigue siendo manual hasta que el cliente decida un
> proveedor (Mailchimp, Klaviyo). Decisión aplazada por Camila el 2026-09-11.

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

## F · Temporada de fútbol

Abierto el 2026-09-17, cuando llegaron las specials de los trucks, el happy hour
de fútbol del bar y las reglas del sorteo. **Todo este bloque se borra cuando
Chris avise que la temporada terminó**, junto con `content/game-day.ts`, los tres
eventos del dashboard y las láminas de promo de cada truck.

| # | qué | dónde cae | qué se ve hoy |
|---|---|---|---|
| 33 | **¿Hasta qué domingo corre todo?** Sin fecha de fin, los tres eventos siguen publicándose solos. La base ya tiene la columna (`end_date`) y el sitio ahora la respeta: el día que Chris diga la fecha, se carga y el calendario se apaga solo | Los tres eventos de fútbol en `/whats-on` y en la home | Sin fecha de fin, o sea «hasta que alguien los borre a mano» |
| 34 | **«Touchdown Shots»: ¿el touchdown de quién?** El documento dice «cada vez que el equipo del cliente anota un touchdown», y eso se lee de dos maneras: el equipo de la casa, o el equipo del que es hincha quien está en la mesa. Cambia a quién le corresponde el shot de $4 | El bloque «On football Sundays» de `/sunset-bar` | Publicado como «our team», que es la lectura estrecha: si la promo fuera la ancha, nadie se queja; al revés, sí |
| 35 | **El nombre y las specials del cuarto truck** (el de cocina jamaiquina, que además sigue con el nombre sin confirmar) | La ficha de ese truck en `/food-trucks` | El truck aparece con el nombre marcado como no confirmado y sin carta |
| 36 | **¿Tienen bases legales del sorteo?** No son un requisito nuestro y no bloquean la publicación: el evento cuenta la dinámica, no nombra premios y manda a las redes, que es donde el cliente publica qué se sortea cada semana. Vale preguntar igual, porque el propio Chris levantó la mano por el tema de responsabilidad y porque el sorteo de los jueves del sitio viejo (`/tnt-sign-ups`, ítem 29) **sí tenía bases escritas**: si las de éste existen, se linkean desde el evento en una línea | La ficha del evento del sorteo | El evento se publica con la dinámica y el link a redes. Sin bases publicadas |
| 37 | **¿Se pueden nombrar los cuatro equipos?** La mecánica del sorteo es una urna por equipo, y los cuatro nombres son marcas registradas. El sitio nuevo no usa ni un nombre ni un logo de la NFL porque el brief lo exige (ver `auditoria-servicios.md`) | El texto del evento del sorteo | Escrito como «one for each team in the division», que cuenta la mecánica sin imprimir las marcas |
| 38 | **RESUELTO A MEDIAS el 2026-09-21: la mitad de Wooftop.** El mail de Madeline contestó la pregunta de ese evento (es mensual, tercer miércoles, y pasó a llamarse Wooftop Fest; ver el bloque G). **Bingo Night sigue abierto.** Texto original: las fechas reales de Wooftop Wednesdays y de Bingo Night. Es el ítem más urgente del bloque: hoy los dos están cargados en el dashboard como eventos de un solo día, con fecha 9 de septiembre, o sea **ya pasada**, así que no aparecen en la home ni en la semana. Ross Brown y La Noche sí son semanales y están verificados contra el calendario público del cliente (`current-site-inventory.md` §9); estos dos no aparecen ahí en ninguna fecha | La home y `/whats-on` | Nada: los dos desaparecieron del sitio el día que alguien los editó en el dashboard |

| 39 | **Las dos URLs de Eventbrite**, la de Ross Brown y la de La Noche. Hoy los dos botones apuntan al PERFIL del organizador, que al 2026-09-15 dice «No upcoming events» | La fila de cada uno en la grilla semanal de `/whats-on` | «Tickets on Eventbrite» linkeando al perfil completo |
| 40 | ~~Las descripciones de esos dos eventos dicen lo contrario~~ **RESUELTO el 2026-09-17.** Camila confirmó que los dos llevan entrada, así que se reescribieron las descripciones en el dashboard («Free, and no ticket needed» y «No cover, no ticket» se fueron) y **el sitio dejó de afirmar que algo es gratis en cualquier lado**: se fueron la píldora «Free entry», el `isAccessibleForFree` del JSON-LD de los eventos y el del local, «Almost all of it is free and none of it needs a ticket» de la home, y «there is no cover» de la FAQ. La regla nueva: el evento con entrada la anuncia, el resto no dice nada | Todo el sitio | Sólo se anuncia lo que SÍ necesita ticket |
| 41 | **Las descripciones de los eventos repiten el día, el horario y el espacio**, que son datos que la tarjeta ya publica arriba en su propia línea. «Weekend Happy Hour» abre con «Every Saturday and Sunday, from noon to 6 PM, all over the venue» y la tarjeta ya dice «12 PM – 6 PM · Venue-wide» dos renglones más arriba; «Game Day at the Trucks» y «NFC North HQ» hacen lo mismo con la hora de apertura y de cierre. Pedido de Camila, 2026-09-21: «cuidado con las descripciones de los eventos, que no repitan información que ya está simplificada en la card, como días y horarios o lugar». **Es texto del dashboard, no del sitio**: la tarjeta publica lo que el cliente escribe, y el día que la descripción empiece por lo que el evento ES en vez de por cuándo pasa, la tarjeta deja de repetirse sola | Las tarjetas de `/whats-on` y la card de `/sunset-bar` | La descripción se publica tal cual, con la repetición a la vista |

> **Sobre el 38, que es nuestro trabajo y no del cliente:** el dashboard sólo
> sabe guardar UN día de la semana como recurrencia, así que algo que pasa «un
> miércoles al mes» no se puede cargar como recurrente sin mentir. La forma
> correcta es **una fila por fecha**, con la recurrencia destildada. El sitio ya
> las muestra: desde el 2026-09-17 la home y el calendario expanden los dos
> tipos sobre las mismas fechas.

---

## G · Los mensuales de Madeline

Abierto el 2026-09-21, con el mail de **Madeline Powers** (`mpowers@eatdrinkparadise.com`,
con copia a Chris Magnus y a Jimbo Mann) del 17 de septiembre y su respuesta del 18.
El mail trajo dos eventos mensuales y adelantó un tercero.

> ### Lo que el mail ya resolvió, y por qué importa
>
> **Wooftop Fest es Wooftop Wednesdays.** Es el mismo evento contado por dos
> personas distintas, y la prueba no es el nombre: coinciden en el día
> (miércoles), en el público (perros), en la promo (2x1 en tragos) y en una
> palabra inventada que no se repite por casualidad. Lo que NO coincide es la
> cadencia, y ahí manda el mail: **tercer miércoles de cada mes**, no todas las
> semanas.
>
> La fila del dashboard no la escribimos nosotros: existe desde el **8 de
> septiembre a las 17:20 UTC**, diez días antes de nuestra primera carga, y el
> nombre también está en el brief del cliente. O sea que Madeline está
> describiendo un evento que ya estaba cargado en su propia base, con otro
> nombre y con la frecuencia equivocada.
>
> **Se cargó el 2026-09-21** como fila única del 21 de octubre, con la
> recurrencia destildada, que es la única forma honesta de expresar «un
> miércoles al mes» en este dashboard (ver la nota del ítem 38).

| # | qué | dónde cae | qué se ve hoy |
|---|---|---|---|
| 42 | **¿Cuándo arranca «la temporada oficialmente»?** Es la pregunta madre de todo este bloque: Madeline avisó el 18 que el 2x1, la banda, el DJ, el bloody mary bar y el brunch **no rigen en octubre** y entran «cuando arranque la temporada». Sin esa fecha no podemos programar contenido para ninguno de los cinco, ni sabemos cuándo volver a editar los eventos | La descripción de Wooftop Fest y la del Neighborhood Market, en el dashboard | Los dos eventos se publican sin un solo extra, que es lo correcto mientras no haya fecha |
| 43 | **El 2x1 en tragos de Wooftop Fest: ¿sigue vigente?** Madeline lo da como histórico («ofrecían») y dijo que lo tiene que confirmar. **Hasta el 2026-09-21 el sitio lo prometía como hecho firme**, todos los miércoles, en la FAQ y en la descripción del evento. Ya se sacó de los dos lugares | La FAQ de perros y la tarjeta del evento | Ni la FAQ ni el evento nombran el 2x1 |
| 44 | **La banda en vivo de Wooftop Fest**: quién toca y desde cuándo. Madeline la nombró como parte de la temporada y dijo que pasa la info | La tarjeta del evento y la cuenta de noches con música de `content/entertainment.ts` | El evento no nombra música, y la cuenta de noches no lo suma |
| 45 | **El horario de Wooftop Fest.** Nadie lo confirmó. Las 3 a 8 PM que publica el sitio vienen **heredadas de la fila semanal vieja**, no del mail. Si el fest es más largo que un miércoles normal, hoy lo estamos publicando corto | La línea de horario de la tarjeta del evento | «3 PM – 8 PM», sin confirmar |
| 46 | **El ítem de $5 para perros en cada truck: ¿existe todavía?** Estaba en la fila original del dashboard y Madeline **no lo menciona** en ninguno de los dos mails. Se sacó de la descripción junto con el 2x1, porque las dos son promos sin confirmar del mismo texto viejo | La tarjeta del evento y la FAQ de perros | No se nombra en ningún lado |
| 47 | **¿Se pueden llevar perros los otros días?** Antes la FAQ podía decir «sí, los miércoles». Ahora que el evento es mensual, lo único que podemos afirmar es que el tercer miércoles el lugar es pet-friendly, y quedó sin responder qué pasa el resto del mes. **Ojo con dónde ya está afirmado:** la meta description de la home dice «dogs welcome in the yard», sin condición de día. No se tocó porque nadie dijo lo contrario y es plausible en un patio al aire libre, pero es una afirmación sin respaldo | La FAQ «Are dogs allowed?» (hoy sin renderizar) y la meta description de `/` en `content/seo-pages.ts` | La FAQ habla sólo del tercer miércoles; la home sigue diciendo «dogs welcome in the yard» |
| 48 | **Las fechas de Wooftop Fest de noviembre en adelante.** Madeline confirmó el 21 de octubre y dijo que va a cargar los meses siguientes en el calendario. Por el patrón, noviembre cae el **18**, pero **no se carga por patrón**: cada fecha entra cuando ella la confirma | `/whats-on` y la home | Una sola fecha publicada, el 21 de octubre |
| 49 | **El Neighborhood Market no está cargado en el dashboard, y su horario se contradice.** El mail del 17 dice que en temporada va de 12 PM a 4 PM y que octubre podría ser el último mes en formato 4 PM a 8 PM; el del 18 confirma que el 20 de septiembre fue de 4 PM a 8 PM, sin explicar el desfase. Falta además las fechas de octubre y noviembre (el patrón es tercer domingo, o sea **18 de octubre** y **15 de noviembre**) y los tres extras de temporada: DJ, bloody mary bar y brunch. **El 20 de septiembre ya pasó y no se carga** | `/whats-on`, la home y `/market`, que hoy describe el market sin una sola fecha | `/market` sigue con el TODO de frecuencia abierto desde `content/market.ts` |
| 50 | **Sunset Saturday: la activación nueva.** Madeline la anuncia con temáticas rotativas por tipo de grupo social (profesionales, singles, amigos) y sin detalles cerrados. **Conecta con la branding session del 3 de septiembre**, donde se habló de «Sunset Saturdays» con géneros rotativos para el Sunset Bar de arriba, así que parece la confirmación de que esa idea avanza. Ojo con el choque: el sábado a la noche ya lo ocupa La Noche · DJ David Cast, de 10 PM a 2 AM | Todavía en ningún lado | Nada. `current-site-inventory.md` §9 dejó constancia de que «Sunset Saturdays» aparecía en el brief y **no existía en ninguna de las dos fuentes de datos**. Ahora existe como intención, no como fecha |

> **Lo que NO se cargó, y a propósito:** el Neighborhood Market del 20 de
> septiembre. Ya pasó. Un evento vencido en el dashboard es exactamente lo que
> dejó a Wooftop y a Bingo fuera del sitio en septiembre (ítem 38).

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
