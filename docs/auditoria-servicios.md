# Auditoría de servicios — brief vs. sitio del cliente vs. sitio nuevo

Hecha el **2026-09-11**. Pregunta que responde: **¿qué le puede querer hacer una
persona a este negocio que la web no le deja hacer?**

## Fuentes, todas leídas de punta a punta

| Fuente | Qué es |
|---|---|
| `docs/brief-rooftop/Rooftop at Riverside ….pdf` | El brief, 14 páginas, secciones 1 a 7 |
| `docs/brief-rooftop/Onboarding Questionnaire ….pdf` | El cuestionario, 25 páginas, secciones A a I |
| `eatdrinkparadise.com` | Sitio Wix del cliente, verificado en vivo hoy |
| `docs/current-site-inventory.md` | Inventario de las 23 rutas del sitio viejo |
| `src/` | El sitio nuevo, 23 rutas |

**Lo que el brief agrega y el inventario no tenía:** los tres sistemas externos del
negocio salen nombrados en el cuestionario, no del sitio. G1 dice **Toast** (POS, y los
cuatro trucks también facturan con Toast). G2 dice **OpenTable**. H5 dice, textual:
*«EventBrite se queda del lado del cliente para ticketing; nosotros hacemos creative y
promoción»*. Ninguno de los tres aparece enlazado en el sitio viejo, salvo Toast para
gift cards.

---

## 1. Los tres sistemas externos, uno por uno

### OpenTable, el agujero más grande

| Fuente | Qué dice |
|---|---|
| Cuestionario G2 | Plataforma de reservas: **OpenTable**. Y la nota al pie: *«reservas de OpenTable forman parte de la atribución. El sitio web no muestra reservas online para el food court/bar, probablemente aplica más a eventos privados»* |
| Brief §4, objetivos 90 días | Instrumentar atribución con **APIs de Toast, OpenTable, Meta y Google**, semanas 1 y 2 |
| Brief §6, Reputation Management | OpenTable figura como una de las cuatro plataformas de reseñas a gestionar, junto a Google, Yelp y TripAdvisor |
| Cuestionario B1 | Uno de los dos objetivos marcados es **«Increase reservations / bookings»** |
| Sitio viejo | Cero. Ni link, ni widget, ni botón. Verificado en vivo hoy |
| Sitio nuevo | Cero |

O sea: **el cliente paga OpenTable, el plan de 90 días promete medirlo, y ninguna de las
dos webs manda una sola reserva ahí.** El propio cuestionario dice «probablemente aplica
más a eventos privados», y ese «probablemente» es exactamente lo que no se puede publicar.

Las tres lecturas posibles cambian páginas distintas:

1. **Reserva de mesa cualquier día** → botón permanente en el header, en `/visit` y al
   pie de cada venue. Es el caso que más cambia el sitio.
2. **Sólo noches de evento** → el aviso vive en `/whats-on` y en cada ficha de evento.
3. **Sólo grupos grandes y eventos privados** → es un paso del flujo de
   `/events/inquire` y no se menciona en ningún otro lado.

**Qué pedir:** cuál de las tres, y la URL del perfil.

### Eventbrite, sí, es ese

Se escribe **Eventbrite** (eventbrite.com). El cuestionario lo confirma como decisión ya
tomada: el ticketing queda del lado del cliente, nosotros promocionamos. Encaja con el
rebrand que describen el brief y el cuestionario G5: **the Yard se está cerrando con reja
justamente para poder hacer eventos con entrada paga**.

Estado en el sitio nuevo: la plomería está puesta y desconectada.

- `BRAND.eventbrite` es `null` y `/the-yard` muestra un bloque pendiente en vez de un
  botón muerto ([the-yard/page.tsx:26-33](src/app/the-yard/page.tsx#L26-L33)).
- Cada evento tiene `ticketUrl`, pero está **fijado a `null` a mano** en
  [events.ts:156-158](src/content/events.ts#L156-L158).
- Y acá está el hallazgo que no estaba en ningún documento: **el dashboard de RestoExp
  no tiene campo para la URL de entradas.** Los campos que baja el sync son `id`, `title`,
  `description`, `bannerUrl`, `startDate`, `endDate`, `startTime`, `endTime`,
  `isRecurring`, `recurrenceType`, `recurrenceDays`, `price` y `tags`. No hay dónde pegar
  el link.

Con lo cual, tal como está hoy, **el cliente no puede publicar un evento con entrada
aunque nos pase la URL de Eventbrite mañana**. Hay que agregar el campo, o acordar que el
link viaje en un tag, que es un parche.

### Toast, el único que sí está conectado

Gift cards, `toasttab.com/rooftop-and-riverside-new-27333-old-41-road/giftcards`. Es el
único enlace de comercio del sitio viejo y el sitio nuevo lo conserva. Sin novedad.

Un detalle a resolver: el cuestionario F5 dice que el email marketing sale por **Toast**,
que ya es el POS. Nuestro formulario de newsletter manda a un webhook de planilla que
todavía no existe. Si la lista va a vivir en Toast, cambia el destino del formulario.

---

## 2. Los eventos, que es lo que disparó esta auditoría

Cómo tiene que funcionar: **mostramos el evento con día, hora y lo que pasa, y cada uno
deriva al link de su plataforma para sacar la entrada.** Sin checkout propio y sin precios
inventados.

Qué falta para que eso sea posible:

| Pieza | Estado |
|---|---|
| Día, hora, descripción, espacio | ✅ Ya sale del dashboard |
| Imagen del evento | ✅ Desde el 2026-09-11 baja `bannerUrl` |
| **Link a la plataforma de entradas** | ❌ **No existe el campo en el dashboard** |
| Aviso de que hace falta entrada o reserva | ⚠️ Hoy dice lo contrario, ver abajo |
| URL de organizador de Eventbrite | ❌ Pendiente del cliente, ítem 22 |

⚠️ **Lo que el sitio nuevo afirma hoy y no puede sostener:** como `ticketUrl` está fijo en
`null`, la ficha de cada evento imprime literalmente **«Free, no ticket needed»**
([whats-on/[slug]/page.tsx:200](src/app/whats-on/[slug]/page.tsx#L200)). No lo dice porque
sepamos que es gratis: lo dice porque el campo está vacío. Los cuatro eventos de hoy son
gratis, confirmado, así que hoy no miente. Pero el día que entre un show con entrada, el
sitio va a seguir diciendo que se entra gratis hasta que alguien toque código.

**Discrepancia de calendario que sigue sin resolverse**, y que el brief agrava: el
calendario público del cliente publica **sólo dos** recurrentes, Ross Brown los jueves y
La Noche los sábados. El dashboard tiene cuatro, sumando Wooftop Wednesdays y Bingo Night.
Y el brief nombra formatos que no están en ninguna de las dos fuentes: **Sunset
Saturdays**, **Jazz Wednesdays**, y festivales grandes con nombre provisorio (*Swamp
Fest*, *Glades Fest*, *Bonita Fest*). El propio cuestionario lo marca como «Discrepancia
a resolver».

---

## 3. Matriz de servicios: qué puede querer hacer una persona, y dónde cae

| Servicio del cliente | Brief | Sitio viejo | Sitio nuevo | Veredicto |
|---|---|---|---|---|
| **Reservar mesa** | OpenTable (G2, §4, §6) | ✗ | ✗ | 🔴 **Fuera de respuesta**, ver §1 |
| **Sacar entrada a un evento** | Eventbrite (H5) | ✗ | Plomería sin URL ni campo | 🔴 **Fuera de respuesta** |
| **Ver qué pasa esta semana** | Calendario mensual, entregado el día 10 | iframe de Boomtech, invisible para Google | Página por evento y JSON-LD | ✅ Mejor que el viejo |
| **Comprar gift card** | Toast Tab (A8) | ✅ | ✅ | ✅ |
| **Pedir un evento privado** | Vertical greenfield, tickets de $10K a $30K | Form de 14 campos en `/hostanevent` | Form con rangos de invitados y food tier | ✅ Falta el PDF del packet, ítem 21 |
| **Alquilar el game truck** | 4 PS5, 4 Xbox Series X, 2 Switch 2, con A/C | $10 por persona, fiestas $400 y $500, 6 TVs | Precios copiados del viejo | ⚠️ **Brief y sitio no coinciden en consolas ni pantallas** |
| **Leer el waiver de juegos** | — | `/bar-games-waiver` y `/game-zone-waiver`, **vivos, 200** | 301 a `/the-experience`, que sólo dice «a waiver is required» | 🔴 **Se pierden dos documentos legales** |
| **Anotarse al sorteo de entradas** | — | `/tnt-sign-ups`, **vivo, 200**, con bases legales | 301 a `/whats-on`, **sin una línea del sorteo** | 🔴 **Contenido real que desaparece** |
| **Ver el menú de un food truck** | Los trucks son dueños de su venta | 2 menús como imagen y un QR «VIEW MENUS» | ✗ Ninguna ficha tiene menú | 🟠 **Hueco**: se ve quién cocina, no qué se come |
| **Ver el menú de barra** | — | 2 imágenes sin texto | ~50 ítems transcritos | ✅ |
| **Ser vendor del market** | — | Fee $30, espacio 10x10 | Mismo dato | ✅ |
| **Tocar en vivo o postularse** | — | Form con upload de 15 MB | Va a email hasta definir backend | ⚠️ Ítem 23 |
| **Donar al partner de caridad** | — | `/giveback`, **vivo** | Sección en `/our-story` | ⚠️ Falta el partner vigente |
| **Dejar una reseña** | Reputation Management contratado. El brief trae el link: `g.page/r/CeuPjh8GL32REAE/review` | ✗ | ✗ | 🟠 **Hueco barato de tapar** |
| **Ver los partidos** | NFC North HQ, $18,000 en Sunday Ticket | ✗ | `/nfc-north-hq` | ✅ Sin nombres ni logos de la NFL, como exige el brief |
| **Pedir delivery** | Prohibido pitchearlo | ✗ | ✗ | ✅ Correcto que no esté |

---

## 4. Lo que nos deja fuera de respuesta, por orden de gravedad

1. **No sabemos para qué usan OpenTable.** Bloquea toda decisión de reservas. Es el
   ítem 0 de `docs/pedido-al-cliente.md`.
2. **Ningún evento puede llevar a su entrada.** Falta la URL de Eventbrite y falta el
   campo en el dashboard donde cargarla. Lo segundo lo resolvemos nosotros.
3. **Las fichas de evento afirman «Free, no ticket needed» por defecto**, no por dato.
4. **Los dos waivers legales se pierden en un 301.** Quien busca hoy el waiver del game
   truck antes de ir lo encuentra en el sitio viejo y no lo va a encontrar en el nuevo.
5. **El sorteo de entradas de los jueves desaparece.** Es contenido real y con bases
   legales escritas.
6. **Los food trucks no muestran qué venden.**
7. **Números del game truck en conflicto** entre brief y sitio: consolas y pantallas.
8. **Happy hour tiene tres versiones** entre footer, menú impreso y `/tnt-sign-ups`.
9. **El calendario no cierra por ningún lado**: dos eventos públicos, cuatro en el
   dashboard, dos nombres más en el brief.

---

## 5. Preguntas al cliente, listas para mandar

1. **OpenTable**: ¿se reserva mesa cualquier día, sólo en noches de evento, o sólo para
   grupos y eventos privados? Hace falta además la URL del perfil.
2. **Eventbrite**: URL de organizador, y confirmar que todo evento con entrada se vende
   por ahí y no por otra plataforma.
3. **Waivers**: ¿siguen vigentes los dos textos? ¿Se publican como páginas propias?
4. **Sorteo de los jueves**: ¿sigue corriendo?
5. **Menús de los trucks**: ¿se publican, o queda sólo el QR del local?
6. **Game truck**: cuántas consolas y cuántas pantallas, y si los precios de $10, $400 y
   $500 siguen vigentes.
7. **Happy hour**: miércoles a viernes de 3 a 6, ¿correcto? El menú impreso dice martes y
   los martes está cerrado.
8. **Calendario**: ¿los miércoles pasan Wooftop y Bingo? ¿Existen Sunset Saturdays y Jazz
   Wednesdays, o son nombres de trabajo?
9. **Lista de email**: ¿vive en Toast, como dice el cuestionario, o en una planilla?
