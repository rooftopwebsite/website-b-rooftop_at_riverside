# Dirección visual — `redesign/light-tropical`

Home de Rooftop at Riverside. Lo que sigue supone leído `AUDIT.md` (qué hay hoy y
qué mide) y `MOODBOARD.md` (qué se toma de cada referencia).

> ## ⚠️ QUÉ CAMBIÓ DESPUÉS DE QUE ESTO SE APROBÓ
>
> Este documento es la dirección que se aprobó en el STOP 1. **El concepto, el
> sistema de superficies y la escala tipográfica siguen vigentes tal cual.** Lo
> que cambió son cuatro formas, todas por pedido posterior de Camila con
> referencias nuevas, y una decisión mía en la autocrítica final. Está detallado
> en [`COMPARACION.md`](COMPARACION.md), pero conviene no leer las secciones
> §5 y §6 de acá sin esta lista:
>
> | § | lo que dice este doc | lo que se construyó |
> |---|---|---|
> | 5.1 | hero de dos columnas, muro con los huecos rotulados | **pila centrada** con un abanico de 9 cards sobre un arco, con material real |
> | 5.2 | What's on en grilla asimétrica 2:1:1 | **track de 4 cards** con `scroll-snap`, foto arriba y bloque de color abajo |
> | 5.3 | Five businesses conserva la escalera diagonal con una foto en el hueco | **tres cuadros de color con textura de grecas** — las tres horas del día |
> | 2 | la cenefa de olas en los dos cortes de Events banner | **el horizonte** (ola + medallón de sol) en la entrada, la cenefa en la salida |
> | 6 | el momento memorable es el titular solo | sigue siendo el titular, pero **ya no está solo**: llegaron 36 fotos y 5 videos |
>
> Y dos cosas que este doc dice y hay que corregir:
>
> - **§8.4 dice que el muro se queda en huecos rotulados.** Quedó sin efecto:
>   la entrega de `public/multimedia/` reemplazó los doce huecos por 2 clips y 7
>   fotos reales. Ver [`docs/media.md`](../../docs/media.md).
> - **§2 proyectaba ~23 % de oscuro.** Medido al final: **25,1 %**. Lo empuja el
>   tercer cuadro de Five businesses.

---

## 1. El concepto

**El sitio tiene que ser la hora, no el lugar.**

La barra se llama Sunset Bar. Los camiones abren a las 4 y cierran a las 8. El
happy hour es de 3 a 6 de la tarde. El domingo se abre a las 11 de la mañana. Este
lugar vive de día y de atardecer, y el sitio de hoy —verde oscuro en más de la
mitad de su superficie— está vendiendo la medianoche de un lugar que a la
medianoche está cerrado cuatro días de la semana.

Entrar tiene que sentirse como salir de la escalera al techo a las seis de la
tarde en Florida: la luz lava todo, el aire es blanco, y el verde aparece
solamente donde hay sombra. Eso es lo que hace que sea Rooftop y no cualquier
venue: no es un bar oscuro con luces, es una **terraza al aire libre a contraluz**.
El verde de marca no desaparece — pasa de ser el piso a ser la tinta. Y el naranja
deja de ser decoración: es el sol, así que aparece una vez y donde hay que apretar.

---

## 2. Sistema de superficies

El recorrido completo de la home, en orden. Cada fila es una superficie real.

| # | Sección | Fondo | Texto | Tratamiento de imagen |
|---|---|---|---|---|
| — | Header | `deeper` → **a revisar en FASE 4** | `paper` | — |
| 1 | **Hero** | `paper` (texto) + `cream` (muro) | `ink` · titular `deep` | **Sin fotografía.** El muro conserva sus huecos rotulados, pasados a clave clara: relleno `paper`, filete de 1px en `fog`, rótulo en `muted`. Sigue derivando en vertical |
| 2 | **What's on** | `paper` | `ink` · bajadas `muted` | **Acá vive el peso fotográfico de la home.** Tres fotos de tamaños distintos: la de hoy al doble de ancho, las otras dos apiladas al lado. Sin contenedor de tarjeta: la foto apoya directo en la superficie |
| 3 | **How this place works** | `cream` | `ink` | Una foto en el hueco que hoy deja vacía la escalera diagonal |
| 4 | **Three doors** | `paper` | `ink` | **Ninguna.** Es la sección de filetes; su trabajo es respirar entre dos bloques con imagen |
| 5 | cenefa de olas | `paper` → `deep` | — | El arte real del Figma. Marca el único salto claro→oscuro |
| 6 | **Events banner** | **`deep`, a sangre** | `paper` · acento `sunset` | Foto a sangre de fondo con un **panel claro encima** que sostiene el texto — el gesto de Casa Coco, no un velo verde sobre la foto |
| 7 | cenefa de olas | `deep` → `paper` | — | Cierra el corte |
| 8 | **Find us** | `paper` | `ink` | El mapa es la única pieza con peso visual. Las dos fichas que hoy son verdes pasan a claras con filete |
| — | Footer | `deep` | `paper` | — |

### Por qué el corte oscuro va en Events y no donde está hoy

El brief permite máximo dos secciones oscuras y pide que sean un corte marcado. Hoy
el oscuro está repartido en cinco lugares y ninguno es un corte: es el fondo.

Events banner es el candidato correcto por tres razones concretas. Es la vertical
que más factura, así que merece el único énfasis fuerte de la página. Mide 569px —
una banda, no una losa. Y su mandato de Superside («OUR GLOBAL TEAM», la card
oscura con imagen inset) ya pedía oscuro; lo que cambia es que deja de ser una card
oscura *dentro* de una sección clara —que es lo que hoy hace que la sección entera
lea oscura sin serlo— y pasa a ser la sección.

`IMG_2909` del moodboard es el mismo movimiento: página crema entera, **una** losa
saturada, y el resto callado.

### Reparto proyectado

| superficie | hoy (medido) | proyectado | objetivo |
|---|---:|---:|---:|
| claro (`paper` + `cream`) | **40,3 %** | ~76 % | 70–75 % |
| oscuro (`deep`) | **55,4 %** | ~23 % | 20–25 % |
| `cream-deep` | 0,5 % | < 1 % | ≤ 5 % |
| `sunset` | 0,6 % | < 2 % | ≤ 5 % |

Se vuelve a medir con `surface-split.mjs` sobre las capturas de `after/` en FASE 5.
El proyectado sale de las alturas del baseline, no de una estimación a ojo: dos
zonas oscuras (Events ~620px + footer ~700px) sobre un recorrido de ~5.800px.

---

## 3. Superficies y texto — los tokens, con el contraste medido

Medido con `design-audit/measure.mjs` (WCAG 2.1, luminancia relativa). Ningún
número de memoria.

### Superficies
| Token | Hex | De dónde sale | Uso |
|---|---|---|---|
| `paper` | `#FFFFFF` | el brief | Base principal |
| `cream` | **`#FAF6EA`** | `#FDF0B4` desaturado. **1,08:1 contra `paper`** — se ve el corte, y es el mismo escalón que el par `paper`/`bone` que ya existe (1,10:1) | Segunda superficie clara |
| `cream-deep` | `#FDF0B4` | el brand book | Píldoras y botones sobre oscuro. Nunca fondo grande |
| `deep` | `#014545` | el brand book | La banda de Events + el footer |
| `sunset` | `#F58521` | el brand book | El CTA primario, con texto **negro** |

> Nota medida que vale la pena: `#FFFFFF` contra el `paper` actual `#FDFCF7` da
> **1,03:1** — imperceptible. Cambiar la base a blanco puro **no es** lo que
> aclara el sitio. Lo que lo aclara es sacar el `deep` del 55 % al 23 % y subir la
> escala tipográfica. El token de base es casi indistinto; lo digo para que la
> discusión no se vaya ahí.

### Texto
| Situación | Token | Hex | Ratio medido |
|---|---|---|---|
| Títulos y cuerpo sobre `paper` | `ink` | `#0A1F1E` | **17,11:1** |
| ídem sobre `cream` | `ink` | `#0A1F1E` | **15,83:1** |
| **Bajadas y texto secundario** | `muted` | **`#487270`** | **5,36:1** sobre `paper` · **4,96:1** sobre `cream` · **4,67:1** sobre `cream-deep` |
| Sobre `deep` | `paper` / `cream-deep` | | **10,83:1** · **9,44:1** |
| Sobre `sunset` y sobre `river` | `ink` negro | `#000000` | **8,26:1** · **8,40:1** |
| Acento del titular sobre claro | `terra` | `#A62000` | **7,43:1** sobre `paper` · **6,87:1** sobre `cream` |
| Acento del titular sobre `deep` | `sunset` | `#F58521` | **4,26:1** — pasa para display, **no** para cuerpo |

**`#487270` es el valor elegido a propósito, no el `#3F6664` del brief.** Barrí
desde ahí hacia arriba buscando el más claro que aún pase 4,5:1 en las tres
superficies claras: `#4B7674` falla sobre `cream-deep` (4,42:1) y `#487270` es el
primero que pasa las tres. Es la bajada más liviana posible sin perder AA, que es
lo que necesita el salto de jerarquía. `#3F6664` también pasa pero con 6,37:1 —
demasiado cerca del titular para leerse como segundo nivel.

### Restricciones duras, verificadas
- `sunset` como texto sobre claro: **2,54:1** sobre `paper`, **2,35:1** sobre
  `cream`. Falla todo, en todo tamaño. Por eso el acento del titular es a dos
  colores según superficie.
- `river` `#0EB6B8` como texto sobre claro: **2,50:1**. Falla. Queda decorativo.
- Blanco sobre `sunset`: **2,54:1**. Falla. El CTA lleva texto negro.

La tabla completa va a `design-audit/CONTRASTE.md` en FASE 2.

---

## 4. Escala tipográfica

Dos familias, las que ya están: **Big Shoulders Display** (condensada, display) y
**Jost** (geométrica, todo lo demás). No entra una tercera.

| Rol | Familia | Tamaño | line-height | Notas |
|---|---|---|---|---|
| `display` — h1 del hero | Big Shoulders **600** | `clamp(3.5rem, 9vw, 9rem)` → **56→144px** | 0.88 | `letter-spacing: 0`. Hoy: peso 400, tope 112px, tracking +0,02em |
| `h2` de sección | Big Shoulders **600** | `clamp(2.5rem, 6vw, 5.5rem)` → **40→88px** | 0.92 | `letter-spacing: 0`. Hoy 28→46px. **+91 %** |
| `h3` | Big Shoulders **600** | `clamp(1.75rem, 2.6vw, 2.5rem)` → **28→40px** | 1.0 | Hoy 22→28px. El 22px de mobile **viola** el piso de 24px |
| bajada | Jost 300 | `clamp(1.0625rem, 1.6vw, 1.375rem)` → **17→22px** | 1.55 | `max-width: 60ch`, color `muted` |
| body | Jost 400 | `1rem`–`1.125rem` | 1.6 | máximo 75 caracteres |
| eyebrow | Jost 500, caja alta | `0.75rem` = 12px | — | `letter-spacing: 0.12em` |

**El salto es el punto de todo el rediseño.** Hoy h2/bajada = 46/18 = **2,6×**, por
debajo del 3,5× que pide el brief y por eso el bloque no se lee jerárquico. Con
88/22 = **4,0×**.

### Reglas de la pareja, aplicadas
- **Big Shoulders nunca por debajo de 24px.** Hay dos violaciones hoy: el h3 en
  mobile (22px) y `role="label"` de `Type.tsx`, que es `--text-d7` = **18px en
  font-display** y se usa en los rótulos de columna del footer. Los rótulos pasan
  a Jost 500 en caja alta.
- La bajada nunca en Big Shoulders. `--text-lead` ya es Jost; se respeta.
- El acento del titular va en **color, nunca en itálica**, y **máximo en 2
  titulares** de la home: el h1 del hero (`sunset` si queda sobre oscuro, `terra`
  si queda sobre claro) y el h2 de Events banner (`sunset` sobre `deep`). Los otros
  cinco titulares van en un solo color.
- **Eyebrows: de 14 a 3.** Se quedan los que clasifican contenido de verdad:
  `Tonight` / el día en las fichas de What's on, `Eat` / `Drink` / `Rent` en Three
  doors (son las tres unidades del negocio, es una clasificación real), y los
  rótulos de dato de Find us. Se caen los 11 que sólo anuncian la sección de abajo
  — `What's on`, `How this place works`, `Three places one gate`, `Find us`,
  `Planning a work event?` y el resto. Un eyebrow arriba de cada h2 es el cromo de
  plantilla que el brief nombra explícitamente.

---

## 5. Wireframes — las tres secciones que más cambian

### 5.1 Hero

```
ANTES                                  DESPUÉS
┌──────────────────────────────┐       ┌──────────────────────────────┐
│▓▓▓▓▓▓▓▓ header deeper ▓▓▓▓▓▓▓│       │      header (a revisar)      │
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░┌──┐┌──┐┌──│       │ paper           ░┌──┐┌──┐┌───│
│▓▓▓▓ deep ▓▓▓▓▓▓▓▓░│▒▒││▒▒││▒▒│       │                 ░│  ││vi││de │
│▓▓ 🚚               ░│vi││de││o│       │  BONITA         ░│vi││  ││   │
│▓▓ BONITA COMES   ░│▒▒││▒▒││▒▒│       │  COMES          ░└──┘└──┘└───│
│▓▓ TOGETHER       ░└──┘└──┘└──│       │  TOGETHER       ░┌──┐┌──┐┌───│
│▓▓ Rooftop bar.…  ░┌──┐┌──┐┌──│       │  ▔▔▔▔▔▔▔▔▔ 144px░│  ││  ││vi │
│▓▓ [ CTA ]        ░│▒▒││▒▒││▒▒│       │                 ░└──┘└──┘└───│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░│▒▒││▒▒││▒▒│       │  Rooftop bar.   ░┌──┐┌──┐┌───│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░└──┘└──┘└──│       │  Four kitchens. ░│vi││  ││   │
│▓▓▓▓ 100svh ▓▓▓▓▓░┌──┐┌──┐┌──│       │  Walk in.       ░└──┘└──┘└───│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░│▒▒││▒▒││▒▒│       │                 ░┌──┐┌──┐┌───│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░└──┘└──┘└──│       │  [ What's on → ]░│  ││vi││   │
└──────────────────────────────┘       └──────────────────────────────┘
 100 % deep · huecos sobre verde        paper │ cream · huecos en clave clara
                                        el titular carga TODO el hero
```

Se conserva la geometría de dos columnas: es la quinta versión y salió del boceto a
mano de Camila. Lo que se invierte es la **luminosidad**.

**Los 12 huecos se quedan rotulados, por decisión tomada** — la regla de que un
hueco silencioso se publica sin que nadie lo note sigue en pie. Lo que cambia es la
clave: hoy son `bg-paper/12` sobre verde y se leen como paneles tonales; sobre
claro necesitan dibujo, así que pasan a relleno `paper` con filete de 1px en `fog`
sobre una columna `cream`, y el rótulo en `muted` (5,36:1 medido). El loop vertical
no se toca. Leído así, el muro es un **campo de wireframe** que deriva despacio:
callado, honesto sobre lo que falta, y sin fingir que hay contenido.

**Consecuencia que hay que decir en voz alta:** sin fotografía, el hero lo carga
**enteramente la tipografía**. Eso sube la apuesta del titular — es la única cosa
grande que hay en la primera pantalla— y hace que la decisión de peso 600 y los
144px sean el rediseño, no un ajuste. Si en el piloto el titular no sostiene la
pantalla solo, el problema no va a ser el tamaño: va a ser que falta la foto.

En **mobile** sigue apilado —texto arriba, muro abajo a sangre— porque dos columnas
en 390px darían 170px cada una.

### 5.2 What's on

```
ANTES                                  DESPUÉS
┌──────────────────────────────┐       ┌──────────────────────────────┐
│ THIS WEEK IN THE YARD   46px │       │ THIS WEEK                    │
│                              │       │ IN THE YARD            88px  │
│ ┌────────┐┌────────┐┌───────┐│       │ ┌───────────────┐┌──────────┐│
│ │ IMAGE  ││ IMAGE  ││ IMAGE ││       │ │███████████████││██████████││
│ │MISSING ││MISSING ││MISSING││       │ │███ foto de ███││█ foto ███││
│ ├────────┤├────────┤├───────┤│       │ │███  HOY   ████│└──────────┘│
│ │▓TONIGHT││WEDNESDAY│WEDNESD││       │ │███████████████│ WEDNESDAY  │
│ │▓ROSS   ││WOOFTOP ││BINGO  ││       │ │███████████████│ Wooftop W. │
│ │▓BROWN  ││WEDNESD.││NIGHT  ││       │ └───────────────┘ 3–8 PM     │
│ │▓6–8 PM ││3–8 PM  ││7–9 PM ││       │  TONIGHT         ────────────│
│ └────────┘└────────┘└───────┘│       │  ROSS BROWN     ┌──────────┐ │
│  ↑ misma caja, mismo radio,  │       │  Live music…    │██████████│ │
│    misma sombra, ×3          │       │  6–8 PM         └──────────┘ │
│  la de hoy se distingue      │       │  ───────────────  BINGO NIGHT│
│    pintándose de verde       │       │                   7–9 PM     │
└──────────────────────────────┘       └──────────────────────────────┘
```

Se cae el contenedor de tarjeta: nada de radio, nada de `shadow-card`. La foto
apoya en la superficie y un filete de 1px separa el texto. **El ítem de hoy se
distingue por tamaño, no por color** — ocupa el doble de ancho y las otras dos se
apilan al lado. Es la asimetría de `IMG_2906`, y es lo que el brief pide cuando
dice que la jerarquía la hacen tamaño, peso y ancho.

### 5.3 How this place works

```
ANTES — deep, 1.309px                  DESPUÉS — cream, ~850px
┌──────────────────────────────┐       ┌──────────────────────────────┐
│▓▓▓▓▓▓▓▓▓▓▓▓ deep ▓▓▓▓▓▓▓▓▓▓▓▓│       │ FIVE BUSINESSES,             │
│▓ HOW THIS PLACE WORKS ▓▓▓▓▓▓▓│       │ ONE SET OF STAIRS.     88px  │
│▓ FIVE BUSINESSES,  46px ▓▓▓▓▓│       │ It catches people out…       │
│▓ ONE SET OF STAIRS. ▓▓▓▓▓▓▓▓▓│       │                              │
│▓ It catches people out…▓▓▓▓▓▓│       │ ┌01┐ ORDER AT WHICHEVER…     │
│▓                      ▓▓▓▓▓▓▓│       │ │  │ Four trucks park…       │
│▓ 01 ORDER AT WHICHEVER…▓▓▓▓▓▓│       │ │  └───┐                     │
│▓ │ Four trucks park…  ▓▓▓▓▓▓▓│       │ │┌───────────┐ ┌02┐ GET YOUR │
│▓ │ ▓▓▓▓ vacío ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│       │ ││███████████│ │  │ DRINKS…  │
│▓ └──────┐ 02 GET YOUR…▓▓▓▓▓▓▓│       │ ││██ foto ███│ │  │ The Sunset│
│▓ ▓▓▓▓▓▓ │ │ The Sunset…▓▓▓▓▓▓│       │ ││███ real ██│ └──┴───┐      │
│▓ ▓▓ vacío▓ │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│       │ │└───────────┘   ┌03┐ STAY   │
│▓ ▓▓▓▓▓▓▓▓ └──────┐ 03 STAY…▓▓│       │ │                │  │ FOR…   │
│▓ ▓▓▓▓ vacío ▓▓▓▓▓ │ │ Live…▓▓│       │ └────────────────┴──┘        │
│▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│       │ See how the yard is laid out→│
│▓ See how the yard…  ▓▓▓▓▓▓▓▓▓│       └──────────────────────────────┘
└──────────────────────────────┘        cream · el hueco lo llena una foto
 ~2/3 de la grilla es verde vacío
```

La escalera se conserva —es la tercera forma, salió de for-living.it, y la
secuencia sí es una secuencia real, así que los `01/02/03` están justificados. Lo
que cambia: pasa a `cream`, los números pasan a píldora (`IMG_2909`) en lugar del
teal ilegible sobre verde, y **el triángulo vacío deja de ser verde muerto y se
llena con una foto del patio**. La sección devuelve ~450px a la página.

---

## 6. El momento memorable

**El titular del hero, y nada más.**

Con el muro quedando en huecos rotulados, el hero no tiene una segunda pieza
grande. Así que la apuesta es una sola y es puramente tipográfica: **«BONITA COMES
TOGETHER» a 144px, peso 600, en el verde de marca sobre papel limpio**, ocupando la
mitad izquierda de la primera pantalla. Es lo único grande que hay ahí, y por eso
es lo que se recuerda.

Que sea el único gesto no es una limitación: es la disciplina que pide el brief.
Una cosa al máximo y todo lo demás callado se lee mejor que cinco cosas al 70 %.

La secuencia de entrada, una sola vez y al cargar: las dos líneas suben con máscara
—`MaskedLines`, que ya existe— a `dur.hero`, y el muro entra después con un fundido
corto, sin desplazamiento, para que no compita. `dur.hero`, un solo `stagger`.
Después de eso el resto de la página **acompaña callado**: un mecanismo por tipo de
contenido y silencio entre medio. Superside es la referencia de moderación: anima
poco, en los momentos justos.

Lo que NO hace el hero, a propósito: nada de texto sobre imagen en toda la home,
nada de velo, nada de parallax, y el logo no crece — el isotipo del camión se queda
en 58px donde está.

---

## 7. Arquitectura de tokens — el problema que hay que resolver antes de codear

El brief dice «Todo en `lib/brand.ts` + `tailwind.config.ts`» y «ningún hex fuera
de `lib/brand.ts`». **`tailwind.config.ts` no existe**: el proyecto es Tailwind v4,
donde el tema es CSS-first y vive en el bloque `@theme` de `globals.css`. Y no se
puede importar un `.ts` dentro de `@theme`.

Hoy hay **tres fuentes de color que no coinciden** (ver `AUDIT.md` §3), y la
consecuencia es que los ratios de `docs/contrast-audit.md` están calculados contra
una paleta que el sitio no pinta.

**Propuesta:** `globals.css @theme` es la fuente que renderiza y por lo tanto la
única definición de los hexes. `lib/brand.ts` deja de declarar `COLORS` con valores
propios y pasa a re-exportar los nombres con su hex más las **reglas** de uso
(`COLOR_RULES`), que es lo que los componentes consultan. Y se agrega un
`scripts/check-tokens.mjs` que lee los dos archivos y **falla si divergen**, más el
arreglo de `scripts/contrast.mjs` para que lea la paleta real en vez de tenerla
escrita a mano. Así «un solo lugar» pasa a ser verificable en vez de aspiracional.

Si preferís lo contrario —`brand.ts` como fuente y `globals.css` generado— también
se puede, con un script que emita el `@theme`. Es más maquinaria; lo digo por si el
requisito de «el hex vive en `brand.ts`» es literal.

---

## 8. Decisiones tomadas — resueltas con Camila antes de codear

Cuatro puntos donde el brief chocaba con una decisión ya aprobada o donde el
alcance no estaba acotado. Quedan cerrados así:

**1. Display: peso 600 y `letter-spacing: 0`.** Punto medio entre el 600–800 del
brief y el `font-normal` aprobado. Gana el cuerpo de asta que a 400 no tiene una
condensada a 144px, sin el cierre entre letras que hizo rechazar la Steelfish. El
tracking **no** va negativo: se queda en 0 para el display, que es el escalón que
respeta el «se ve muy pegada» sin dejar el titular abierto como está hoy
(+0,02→0,05em). La caja alta se mantiene: el brief no la discute.

Consecuencia mecánica: los siete `--text-d*--letter-spacing` de la escala óptica se
van, porque su motivo era compensar un tracking negativo global que ya no existe.

**2. Fuentes: `next/font/local`.** Ni lo que hay ni exactamente lo que pide el
brief, sino lo que resuelve el problema real —qué pasa cuando alguien abre el sitio
sin tener las fuentes, que es el caso de todos los visitantes—. Verificado sobre el
HTML servido: hoy **no hay `<link rel="preload" as="font">`** y **no hay métricas de
reemplazo**, así que la fuente recién empieza a bajar después de HTML → CSS
(tres saltos) y al llegar el texto salta.

`next/font/local` apuntando a los mismos `woff2` da las dos cosas que faltan:
`preload: true` por defecto y `adjustFontFallback: 'Arial'`, que genera métricas
ajustadas para que la caja de texto casi no cambie en el swap — decisivo con dos
líneas de titular a 144px. Y conserva el subset hecho a mano, más chico que lo que
devuelve la API de Google, sin request externo en runtime **ni en build**.

Verificado en `node_modules/next/dist/docs/01-app/03-api-reference/02-components/font.md`:
`src`, `display`, `preload`, `fallback`, `adjustFontFallback`, `variable` y
`declarations` están todos disponibles en `next/font/local`. Los `.woff2` se mudan
de `public/fonts/` a `src/app/fonts/` para que se empaqueten una sola vez con
nombre hasheado en lugar de quedar además servidos desde `public/`.

**3. Alcance de los valores arbitrarios: home + componentes globales.** Es la
superficie que esta rama rediseña. Las 22 páginas internas quedan inventariadas en
`AUDIT.md` §3 para una rama propia, y el grep de control de FASE 5 se corre acotado
a esa superficie, diciéndolo.

**4. El muro del hero: los huecos se quedan rotulados.** No se cargan las fotos. La
regla original sigue en pie —un hueco silencioso se publica sin que nadie lo note—
así que el muro pasa a clave clara y sigue marcando lo que falta. **El peso
fotográfico se muda a What's on** (tres fotos de tamaños distintos) **y a How this
place works** (una foto en el hueco de la escalera), que son las dos secciones
donde sí hay assets reales para usar.

---

## 9. Autocrítica

**Lo que se parecía a cualquier otro cliente, y con qué lo reemplacé.**

**Uno.** Mi primer hero fue el reflejo automático: foto a sangre, velo oscuro
encima, titular grande centrado sobre la foto. Es el hero por defecto, lo hace todo
el mundo, y encima el sitio ya lo probó y lo rechazó («era Showdown, no
Superside»). Lo reemplacé por lo contrario: **cero texto sobre imagen en toda la
home**. El titular vive sobre papel limpio, así que el contraste es medible
—17,11:1— en vez de depender de la opacidad de un velo sobre una foto que todavía
no vi. Con la decisión de dejar el muro en huecos, esto se volvió más radical de lo
que había planeado: el hero no tiene imagen ninguna y lo sostiene sólo la
tipografía. Es más riesgoso y es más disciplinado.

**Dos.** El planteo «base crema + display condensada en caja alta + una losa de
color + fila de tres fotos» está a un paso del cluster genérico de crema con serif
de alto contraste y acento terracota. Lo que lo separa es una decisión rara y
deliberada: **el color de texto no es un gris ni un casi-negro, es el verde de
marca** (`#0A1F1E`, que es `deep` llevado a casi negro). Todo el cuerpo del sitio
está escrito en el color de la marca. Eso ya está en el repo y es lo mejor que
tiene; no lo toco, lo aprovecho. Y rompí la fila de tres iguales en What's on: 2:1:1
asimétrico, sin cajas.

**Tres.** Había puesto un eyebrow arriba de cada h2 «para clasificar». Son 14 en la
home y el brief permite 3. Los conté y no clasificaban: anunciaban. Quedan los que
son datos reales —el día de cada evento, las tres unidades del negocio, los rótulos
de contacto— y se caen los 11 que sólo repetían en versalitas el título que venía
abajo.

**Lo que todavía me preocupa, en orden de riesgo.**

**El hero.** Doce recuadros vacíos rotulados «video» funcionaban sobre verde
porque el relleno translúcido los volvía paneles tonales. Sobre claro hay que
dibujarlos con filete, y un filete dibuja **más** atención sobre el hueco, no
menos. Es el riesgo real de esta rama y no lo puedo resolver con diseño: sin los
clips, la primera pantalla es un titular grandioso al lado de una grilla de cajas
vacías. Lo llevo al piloto de FASE 4 justamente para que se vea antes de
implementar las otras cinco secciones, y si ahí no cierra, la salida es pedirle los
clips al cliente o revisar la decisión del muro — no maquillarlo.

**La cenefa.** Aparece dos veces en el recorrido nuevo, las dos alrededor de Events
banner. Con la home clara hay un solo salto fuerte de superficie, así que las dos
cenefas sirven a la misma sección — y dos apariciones de la misma pieza de marca a
50px de alto cada una pueden leerse como manierismo. Si en el piloto se ve así, la
de salida se va y el corte se cierra seco.
