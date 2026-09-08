# Referencias de diseño — qué se mide, qué se toma, qué se descarta

Camila fue mandando siete referencias. Este documento existe para que no se
promedien: **una referencia no se copia entera, se le saca un mecanismo**. Cada
fila de abajo dice qué se midió con el navegador (no de memoria) y qué se
adoptó.

Fecha de medición: 8 de septiembre de 2026.

---

## 1. Lo que midió el navegador

### visitors.now — la piel

Llegó con su propio `design.md`. Píldoras, sombras suaves, pila centrada, campo
de color debajo del hero. Es la referencia de la que sale el lenguaje actual de
`Button`, `Header` y `Hero`.

Adaptación obligada, ya documentada en `Button.tsx`: visitors.now pone texto
**blanco** sobre su lavanda. Sunset Orange es un tono medio y el blanco encima
da 2.54:1. **Texto sobre naranja va en negro** (8.26:1).

### ronnsquare.fr — el movimiento

| Elemento | Medido |
|---|---|
| `.brand-clone` | `position: fixed`, `z-index: 220`, 518×356, contiene un SVG |
| `.transition` | `position: fixed`, `z-index: 400`, viewport completo, dibuja una forma de marca |
| `.site-bg` | `position: fixed`, viewport completo |

Es lo único que se le tomó: **un elemento de marca que te acompaña todo el
scroll** y **una transición de página que dibuja una forma de marca** en vez de
un telón liso.

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

Adoptado en `PinnedList` (ver `src/components/shared/PinnedList.tsx`), con tres
desvíos deliberados: recorrido más corto (55vh por ítem, no 133), etiquetas
neutras en vez de rellenas de color, y un riel de progreso agregado.

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
lo dijo con esas palabras. Así que la piel sigue siendo visitors.now, y de
ronnsquare entran sólo los dos gestos de scroll y de transición.

**Está pendiente que Camila confirme esta lectura.** Si en realidad quería
también el peso tipográfico de ronnsquare, cambia el hero, no el sistema.

## 4. Todavía sin llegar

Camila escribió «esta es otra pag de muestra del estilo» y no llegó ni URL ni
imagen. Sigue faltando.

---

## 5. Qué se implementó de todo esto

| Gesto | Dónde | Referencia |
|---|---|---|
| Píldoras, sombras suaves, pila centrada | `Button`, `Header`, `Hero` | visitors.now |
| Elemento de marca que acompaña el scroll | `BrandTrail` | ronnsquare.fr |
| Transición de página | `PageTransition` | ronnsquare.fr |
| Lista fijada que se cuenta sola | `PinnedList` → `HowThisPlaceWorks` | agencefoudre.com |

Pendiente de aplicar: el acento tipográfico dentro del titular (wework /
superside) y las filas de ícono + versalita + título. Ver el informe de la
sesión.
