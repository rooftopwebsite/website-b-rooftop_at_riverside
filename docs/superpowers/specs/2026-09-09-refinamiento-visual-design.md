# Refinamiento visual — de «tosco» a la calidad de Superside

Fecha: 9 de septiembre de 2026. Decisiones tomadas con Camila en sesión.

Camila: «quiero que hagas todo más lindo, más sofisticado, como
superside.com. Quiero que analices el uso del color… hoy lo nuestro se
percibe tosco, de baja calidad. Quiero un diseño moderno, limpio, mayormente
blanco pero con sectores oscuros por el uso del verde oscuro y el naranja solo
en puntos muy claves».

Este documento existe para que el rediseño no sea gusto personal. Todo lo que
sigue sale de **medir las dos páginas con la misma herramienta**, no de mirarlas.

---

## 1. Lo que midió el navegador

`superside.com` contra nuestra home, a 1440px, recorriendo la página entera para
disparar todo lo diferido.

| | Superside | Rooftop hoy |
|---|---|---|
| Alto de página | 16.498px | 8.660px |
| **Colores de texto distintos** | **4** | **8** |
| Texto dominante | `#0a211f` ×234 | `#2a2b28` ×31 + `#101418` ×19 |
| Tamaño de texto más usado | **18px** ×74 | **13px** ×159 |
| Escala de display | 100px ×52 · 64 · 60 | 112px ×2 · después 46 |
| Radios | 10px ×88 + píldoras ×13 | 14 ×78 · pill ×21 · 8 ×20 |
| Sombras reales | 0 | 0 ✓ |
| Superficie de color saturado | **ninguna** | **crema, 1.040px de alto** |

### El detalle que corrige una lectura apresurada

La primera lectura fue «usamos el naranja 3× más denso que la referencia»,
contando nodos: 9 contra 6. **Es falso medido por área.** Los nueve no son
equivalentes:

| Elemento | Tamaño | Área |
|---|---|---|
| 3 puntos del PromoBar | 3×3 | 27 px² |
| 3 filetes del footer | 28×2 | 168 px² |
| CTA del header | 155×46 | 7.130 px² |
| CTA del hero | 214×54 | 11.556 px² |
| **Card de evento** | **413×200** | **82.600 px²** |

**Una sola card es el 81% de todo el naranja de la página.** El problema no es
la cantidad de usos, es un bloque grande. Contar nodos habría llevado a una
solución equivocada — sacar los puntitos y los filetes, que son 195 px² entre
los seis.

### Dónde viven los 13px

De los 159 nodos, **123 son la utilidad `eyebrow`**. Una versalita por sección,
por card y por campo. Los otros 26 son `text-[13px]` explícitos.

---

## 2. Las cinco causas del «tosco», en orden de impacto

1. **La página está compuesta en 13px.** El tamaño más usado del sitio es el de
   una etiqueta, no el de un cuerpo de texto. Superside sostiene 18px.
2. **Dos negros haciendo el mismo trabajo** — `#2a2b28` y `#101418` — y ninguno
   pertenece a la paleta. El texto de Superside ES su verde de marca.
3. **Una banda de 1.040px de amarillo saturado.** La referencia no tiene ninguna
   superficie de color medio.
4. **Una card naranja de 82.600 px².** El acento dejó de ser puntuación.
5. **Cinco radios compitiendo** (8, 10, 14, 20, pill) contra uno dominante.

---

## 3. Las decisiones

### 3.1 Un solo color de texto: `#0A1F1E`

Reemplaza a `#2a2b28` (cuerpo) y `#101418` (títulos). Es un verde muy oscuro
derivado de `deep`, no un gris: el texto pasa a pertenecer a la marca, que es
exactamente lo que hace la referencia con sus 234 nodos en `#0a211f`.

Contraste: **16.65:1 sobre `paper`**, 15.19:1 sobre `bone`. Holgura de sobra.

⚠️ `--color-body` y `--color-ink` **no se fusionan en un solo token**: los usan
decenas de call sites y renombrarlos sería un cambio mecánico enorme con riesgo
de romper algo por un `sed` mal puesto. Los dos apuntan al mismo valor. El token
`--color-body` queda documentado como alias histórico.

### 3.2 La banda crema se elimina

`WhatsOn` pasa de `tone="cream"` a `paper`. El ritmo de la página lo dan **verde
oscuro y hueso**, y nada más:

```
hero            VERDE
what's on       hueso
how it works    hueso
three doors     hueso
events banner   VERDE  (card dentro de sección hueso)
find us         hueso
footer          VERDE
```

Es literalmente «mayormente blanco con sectores oscuros».

⚠️ Con esto `Scallop` —el festón que marcaba la entrada a crema— **se queda sin
trabajo**. Se da de baja de la home: un festón entre hueso y hueso no separa
nada.

### 3.3 El naranja, por área

Se queda **sólo en los dos CTA**: el del header y el del hero. La card de evento
naranja pasa a `deep`.

| | Antes | Después |
|---|---|---|
| Área de naranja | 101.481 px² | ~18.700 px² |
| Reducción | | **−82%** |

Los micro-acentos —los tres puntos del PromoBar y los tres filetes del footer—
se quedan: 195 px² entre los seis, y son lo que evita que el hueso quede mudo.

⚠️ Los tres colores de card de `WhatsOn` pasan de `sunset · deep · chalk` a
**`deep · bone · chalk`**. Sigue habiendo tres superficies distintas, así que la
fila no se aplana; lo que cambia es que la primera deja de gritar.

### 3.4 Las versalitas: de 123 nodos a ~24

**Una por sección. Ninguna por card, ninguna por campo.**

Donde desaparece, la etiqueta pasa a **15px en el color de texto, peso 500**, en
caja normal. Concretamente salen de:

- los tags de las cards de `WhatsOn` (quedan como texto, no como versalita)
- los rótulos de campo de `FindUs` — Hours, Address, Phone, Parking
- los kickers de cada columna de `ThreeDoors`
- los rótulos de columna del footer
- las etiquetas de paso de `PinnedList`

### 3.5 El piso del cuerpo sube

| Rol | Hoy | Propuesta |
|---|---|---|
| Cuerpo principal | 15px | **16px** |
| Secundario | 14px | **15px** |
| Caption / versalita | 13px | 13px (sin cambio, pero ~24 nodos) |

### 3.6 De cinco radios a dos

| Token | Hoy | Propuesta |
|---|---|---|
| `--radius-btn` | 8px | **10px** |
| `--radius-input` | 8px | **10px** |
| `--radius-image` | 10px | 10px |
| `--radius-card` | 14px | **10px** |
| `--radius-panel` | 20px | **10px** |
| `--radius-pill` | 9999px | 9999px |

Los tokens **se mantienen como nombres** —dicen para qué es cada cosa— pero
todos apuntan a 10px salvo la píldora. Si mañana algo necesita divergir, el
nombre ya está.

---

## 4. Lo que NO se toca

- **La tipografía.** Big Shoulders y Jost quedan como están; la escala de
  tracking y el peso Regular también. Se cerró hace dos horas y funciona.
- **El movimiento.** Ningún cambio en `Motion.tsx` ni en los reveals.
- **La estructura de la home.** Las seis secciones y su orden se quedan.
- **El contenido.** Ni una palabra nueva.

---

## 5. Verificación

Además de la batería habitual, este cambio necesita **medirse igual que se
diagnosticó**: al terminar hay que volver a correr el análisis y confirmar los
números.

| Métrica | Hoy | Objetivo |
|---|---|---|
| Colores de texto | 8 | ≤ 5 |
| Nodos de 13px | 159 | ≤ 40 |
| Área de naranja | 101.481 px² | ≤ 25.000 px² |
| Superficies de color medio | 1 (1.040px) | 0 |
| Radios distintos | 5 | 2 |

Y los guards de siempre: `build`, `check:css`, `contrast`, `check:surfaces`,
`a11y`, `check:motion`, `check:seo`.

⚠️ `check:surfaces` cuenta secciones `cream`. Al eliminar la única de la home el
guard va a seguir en verde, pero conviene mirar la línea: si dice `paper ×6`, el
cambio entró.

---

## 6. Riesgo conocido

El sitio queda con **menos color**. Es lo que se pidió, y es la dirección de la
referencia — pero si al verlo resulta demasiado sobrio, la palanca para
recuperar calidez sin volver atrás es el **verde oscuro**, no el naranja:
sumar una sección más en `deep` antes que reintroducir superficies naranjas.
