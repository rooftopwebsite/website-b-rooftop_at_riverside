# Referencias de diseño — qué se mide, qué se toma, qué se descarta

Camila fue mandando siete referencias. Este documento existe para que no se
promedien: **una referencia no se copia entera, se le saca un mecanismo**. Cada
fila de abajo dice qué se midió con el navegador (no de memoria) y qué se
adoptó.

Fecha de medición: 8 de septiembre de 2026.
Actualizado el 9 de septiembre tras el rediseño de la home, que sumó
superside.com como referencia de forma y dio de baja dos gestos.

---

## 1. Lo que midió el navegador

### visitors.now — la piel

Llegó con su propio `design.md`. Píldoras, sombras suaves, pila centrada, campo
de color debajo del hero.

⚠️ **Ya no queda nada suyo en el sitio.** Fue la referencia del primer lenguaje
de `Button`, `Header` y `Hero`, y se cayó entera cuando Camila fijó Showdown
Social primero y superside después: ninguna de las dos usa píldoras ni sombras
suaves. Se deja documentada porque explica por qué el sitio pasó por una etapa
que hoy no se ve.

Adaptación obligada, ya documentada en `Button.tsx`: visitors.now pone texto
**blanco** sobre su lavanda. Sunset Orange es un tono medio y el blanco encima
da 2.54:1. **Texto sobre naranja va en negro** (8.26:1).

### ronnsquare.fr — el movimiento

| Elemento | Medido |
|---|---|
| `.brand-clone` | `position: fixed`, `z-index: 220`, 518×356, contiene un SVG |
| `.transition` | `position: fixed`, `z-index: 400`, viewport completo, dibuja una forma de marca |
| `.site-bg` | `position: fixed`, viewport completo |

Se le tomaron dos gestos: un elemento de marca que acompaña el scroll y una
transición de página que dibuja una forma de marca en vez de un telón liso.

⚠️ **Del primero ya no queda nada.** `BrandTrail` se dio de baja en el rediseño
de la home por pedido de Camila. De ronnsquare sobrevive **sólo la transición**.

> ⚠️ En layout, ronnsquare es casi lo OPUESTO a visitors.now: fondo crema
> cálido, tipografía negra grande alineada a la izquierda, botones oscuros de
> esquina viva. Se tomó el movimiento, no la maqueta. Ver «El conflicto».

### agencefoudre.com — cómo se van contando los servicios

| Elemento | Medido |
|---|---|
| Sección | `position: relative`, **3600px** con ventana de 900px → 4 pantallas para 3 ítems |
| Ambas columnas | `position: sticky; top: 0` |
| Ítem activo | abre su bloque con `min-height`, `cubic-bezier(.23, 1, .32, 1)`, 0.8s |
| Título activo | 46px, peso 900, en el rosa de marca; los inactivos apagados |

**DADO DE BAJA.** Se adoptó en `PinnedList` para «how this place works» y Camila
lo cambió por la escalera de for-living.it (abajo). El módulo se borró.

Lo que dejó aprendido, que vale para la próxima vez que aparezca la tentación:
un recorrido de varias pantallas para tres párrafos cortos cuesta caro. Con
42vh por ítem —ya recortado desde los 133 de la referencia— la sección se
llevaba 2.226px, casi un tercio del scroll de la home.

### for-living.it — los pasos en escalera

El bloque «We handle all the complexity». Cuatro pasos bajando en diagonal:
cada uno un peldaño más abajo y más a la derecha, con un filete que corre por
la izquierda del bloque y dobla en horizontal hasta el arranque del siguiente.

| Elemento | Medido |
|---|---|
| Pasos | 4, todos abiertos y visibles a la vez |
| Desplazamiento | cada peldaño arranca donde termina el filete horizontal del anterior |
| Bloque | número tenue + título + descripción en gris, sin caja ni relleno |
| Filete | 1px, en L: vertical por la izquierda del bloque, horizontal al pie |

Adoptado en `StepStair` → `HowThisPlaceWorks`. La geometría sale de una grilla
de N×N con el paso *i* en la celda *(fila i, columna i)*: la diagonal cae sola y
el ancho de la celda ES la distancia hasta el siguiente, así que el filete
horizontal termina exactamente en su arranque sin un número calculado a mano.

Dos desvíos: son tres pasos y no cuatro —son los que hay—, y cada uno lleva sus
etiquetas de datos debajo de la descripción, que la referencia no tiene.

### designproject.io

| Medido | Valor |
|---|---|
| Contenedor dominante | **1280px** (15 apariciones) |
| Fondos | alternancia `#f8f8f8` · `#e9f6fd` · `#162825` (oscuro, 3 veces) |
| Encabezados de sección | 48px, mayormente **centrados** |
| CTA de cierre | 72px |
| Elementos `sticky` | 0 |

### stripe.com/es-us

| Medido | Valor |
|---|---|
| Contenedor dominante | **1232px** (71 apariciones) |
| Fondos | blanco casi en todo; **una sola** banda oscura `#0d1738` |
| Encabezados de sección | 32px, **alineados a la izquierda** |
| Hero | 44px · un único momento centrado a 56px |

### wework.com y superside.com

De las capturas que mandó Camila:

- Fondo blanco / crudo, tipografía negra, jerarquía por tamaño y peso.
- Filas de 3–4 con **ícono chico + micro-etiqueta en versalitas + título +
  cuerpo**, separadas por filetes de 1px, no por tarjetas pesadas.
- **Un tramo del titular en itálica de una familia distinta**
  («brands that *refuse to compromise*», «un *espacio de coworking*»).
- Divisiones editoriales a dos columnas: texto de encuadre a un lado, lista de
  enlaces o de medios al otro.

---

## 2. El hilo común

Cinco de las siete son lo mismo: **fondo blanco, texto negro, estructura por
filetes finos, color como puntuación y una sola banda oscura por página.** Eso
ya es la ley del color del proyecto; las referencias la confirman en vez de
contradecirla.

Coincidencias medidas que valen como decisión:

- **Contenedor 1280px.** Unánime entre los cinco repos de la casa, Showdown
  Social y designproject.io; Stripe usa 1232. Nuestro token se queda.
- **Una sola superficie oscura por página.** Stripe usa una; designproject
  tres en una página larguísima. Nuestro `deep` en el footer y en contadas
  secciones está bien calibrado.
- **Encabezados de sección alineados a la izquierda y modestos** (Stripe 32px),
  con **un** momento grande y centrado por página. Es lo que ya hace el home:
  hero centrado, el resto a la izquierda.

## 3. El conflicto, sin promediar

visitors.now (píldoras, sombras, centrado, suave) y ronnsquare.fr (crema
cálido, negro grande a la izquierda, esquina viva) tiran para lados opuestos.
El segundo se parece bastante al diseño que Camila **rechazó**.

Lectura: lo que le gustó de ronnsquare fue el **movimiento**, no la maqueta —
lo dijo con esas palabras.

**RESUELTO.** El conflicto se cerró solo: la piel de visitors.now se cayó
entera y de ronnsquare quedó únicamente la transición de página. La forma la
fija ahora superside.com, que Camila eligió explícitamente para el hero, las
cards y los dos bloques nuevos.

---

## 4. Qué se implementó de todo esto

Actualizado el 9 de septiembre de 2026, después del rediseño de la home.

| Gesto | Dónde | Referencia |
|---|---|---|
| Transición de página | `PageTransition` | ronnsquare.fr |
| Pasos en escalera diagonal con filete en L | `StepStair` → `HowThisPlaceWorks` | for-living.it |
| Acento tipográfico dentro del titular | `Accent`, `MaskedLines` | wework / superside |
| Filas de ícono + versalita + título, con filetes | `ThreeDoors` | wework / superside |
| Hero de titular + una frase + un CTA + muro | `Hero`, `VideoWall` | superside |
| Cards de foto arriba y bloque de color abajo | `WhatsOn` | superside |
| Banner de card oscura con imagen inset | `EventsBanner` | superside · «Our global team» |

### Lo que se dio de baja, y por qué

**`BrandTrail` — el elemento de marca que acompañaba el scroll.** Era lo
adoptado de ronnsquare.fr junto con la transición de página. Camila lo mandó
sacar en el rediseño: «quitemos el elemento de marca que acompaña el scroll».
De ronnsquare queda **sólo `PageTransition`**.

**Las píldoras y las sombras suaves de visitors.now.** Se habían ido antes,
cuando Camila fijó Showdown Social como referencia máxima: ninguna de las
cuatro referencias que eligió usa píldoras. Ver la nota de `Button.tsx`.

### Referencias nuevas que entraron en el rediseño

Camila sumó **superside.com** como la referencia de forma de la home, y de ahí
salieron cuatro de las siete filas de la tabla de arriba. Dos páginas concretas
que se midieron con el navegador:

- `superside.com/our-creative-talent`, bloque «OUR GLOBAL TEAM» → `EventsBanner`
- el hero de `superside.com` → `Hero` + `VideoWall`

### Sobre el acento del titular

⚠️ Se aplicó en **color y no en itálica**, que es donde se aparta de la
referencia. Camila: «usar cambio de color no itálica, porque el brand no usa
itálica». Superside lo hace con una serif itálica de otra familia; acá no hay
serif y no se sumó una cuarta familia por un acento.

Y son **dos colores según la superficie**, no uno: `sunset` sobre claro da
2.48:1 y no pasa ni el 3:1 de texto grande. Sobre claro va `terra` (7.43:1),
sobre `deep` va `sunset` (4.26:1).

### Lo que sigue sin llegar

Camila escribió «esta es otra pag de muestra del estilo» y nunca llegó ni URL
ni imagen. Sigue faltando.
