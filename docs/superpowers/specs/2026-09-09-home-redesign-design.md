# Rediseño de la home + tipografía + footer — diseño validado

Fecha: 9 de septiembre de 2026. Decisiones tomadas con Camila en sesión.

Este documento fija QUÉ se construye y POR QUÉ. El plan de implementación es
otro archivo.

---

## 1. Qué pidió Camila, en sus términos

Doce cambios sobre la home, más el footer. Las referencias externas son
Superside (hero, cards, «Our difference», banner «Our global team») y dos
proyectos de la casa: **yava** para el acordeón de horarios y **the-orient**
para la estructura de footer y la barra de agencia.

Lo aprobó todo en una pasada salvo la tipografía, que se discutió aparte y
quedó resuelta en la sección 3.

---

## 2. Home nueva — orden de secciones

| # | Sección | Componente | Estado |
|---|---|---|---|
| 1 | Banner promocional | `shared/PromoBar.tsx` | **nuevo** |
| 2 | Header + StatusBar | `shared/Header`, `shared/StatusBar` | sin cambios |
| 3 | Hero | `sections/Hero.tsx` + `shared/VideoWall.tsx` | **rediseñado** |
| 4 | What's on | `sections/WhatsOn.tsx` | **fusión** |
| 5 | How this place works | `HomeSections.HowThisPlaceWorks` | rediseño sutil |
| 6 | Three doors | `sections/ThreeDoors.tsx` | **fusión** |
| 7 | Events banner | `sections/EventsBanner.tsx` | **reemplaza** |
| 8 | Find us | `sections/FindUs.tsx` | **rediseñado** |
| 9 | Footer + AgencyBar | `shared/Footer.tsx`, `shared/AgencyBar.tsx` | **reestructurado** |

### Se eliminan

- `shared/BrandTrail.tsx` — el elemento de marca que acompaña el scroll, y su
  montaje en `app/layout.tsx`.
- `HomeSections.StoryTeaser` — «Nuestra historia» vive en `/our-story`.
- El bloque «Last call» del footer.
- `shared/NewsletterForm.tsx` y la action `subscribeToNewsletter` de
  `app/actions.ts`. **No se toca `submitEventInquiry`**, que comparte
  `lib/mail.ts`.
- Las mini cards de intención del hero (`INTENTS`) y `HomeSections.ThreeVerticals`,
  que se funden en `ThreeDoors`.
- `HomeSections.FeaturesMarquee` — **pendiente de confirmación de Camila**. Dice
  lo mismo que el PromoBar nuevo, en la misma pantalla.

---

## 3. Tipografía — la discusión que se resolvió aparte

### 3.1 Qué hay realmente instalado

Leído de la tabla `name` interna de cada WOFF2, no del nombre del archivo:

| Archivo | Declara | Es realmente |
|---|---|---|
| `steelfish-*.woff2` (7 caras) | Steelfish | Steelfish ✅ |
| `bronx-regular.woff2` | Bronx | Bronx, de `Bronx_PersonalUse.otf` |
| `futura-pt-*.woff2` (6 caras) | `Futura PT` | **Futura Cyrillic** |

Dos desajustes, que Camila decidió dejar **pendientes y no bloqueantes** para
poder ver el diseño: entiende que las licencias están compradas y se verifica
antes de publicar. Ver sección 8.

`futura-pt-heavy.woff2` es en realidad la cara **Demi**, servida con
`font-weight: 600`. La escalera de pesos no dice la verdad y Heavy real no
existe.

### 3.2 Por qué se veía apretada

Dos causas concretas, ninguna de percepción:

1. **`Heading` fuerza `font-bold` en todos los niveles**
   (`shared/Type.tsx`): todos los títulos del sitio son Steelfish Bold. No hay
   un solo título en Regular.
2. **`--tracking-display: -0.02em`** — tracking negativo, heredado de The
   Orient, que usa Lusitana (una serif). `docs/house-tokens.md` ya lo advertía:
   «The Orient no define tracking negativo… Rooftop toma The Orient».

⚠️ Corrección respecto de lo primero que se dijo en la sesión: la clase
`tracking-display` sólo se aplica en **dos lugares** (el h1 del hero y las mini
cards). En el resto de los títulos el tracking es 0. Así que el arreglo no es
sólo cambiarle el signo al token: hay que **hacer que el tracking llegue a
todos los títulos**, que hoy no llega.

### 3.3 Qué se cambia

**Escala óptica de tracking, no un valor único.** A menor cuerpo la condensada
se cierra más y necesita más aire; un solo número deja el h3 apretado o el h1
desarmado. Se implementa con los sub-tokens de la escala de Tailwind v4
(`--text-*--letter-spacing`), el mismo mecanismo que ya usa
`--text-d1--line-height`, así que cada escalón lleva su tracking en todos los
breakpoints sin tocar los componentes:

| Escalón | Cuerpo | Tracking |
|---|---|---|
| `text-hero` | 72px+ | `0.02em` |
| `d1` | 72px | `0.02em` |
| `d2` | 58px | `0.03em` |
| `d3` | 46px | `0.035em` |
| `d4` | 36px | `0.04em` |

`--tracking-display: -0.02em` se elimina, junto con sus dos usos.

**Peso Regular, nunca alto.** `Heading` pasa de `font-bold` a `font-normal`
(Steelfish Regular, 400). Es la instrucción de Camila: «en regular nunca en
peso alto».

**Steelfish sólo en h1/h2/h3.** `h4` y los títulos de card salen de la escala
de display y pasan a **Futura PT Medium** (500) en caja mixta, con tracking
`0.01em`. No van en Bronx: Bronx es caja alta con tracking abierto por
definición —es la de los eyebrows— y en un título de card de dos líneas se
vuelve ilegible. Concretamente el `role="card"` y el `level={4}` de `Heading`
dejan de usar `font-display`.

Los escalones `d5`, `d6` y `d7` **no reciben tracking en la escala**, porque a
partir de ahí los usa Futura y no Steelfish. El tracking de esos casos va
explícito en la clase.

### 3.4 El acento del titular: color, no itálica

Camila: «usar cambio de color no itálica, porque el brand no usa itálica». El
mecanismo ya existe: `MaskedLines accentLast` en el hero pinta la segunda línea
en `sunset`.

⚠️ Pero **`sunset` no sirve como acento sobre claro: 2.48:1**. No alcanza ni el
3:1 que pide el texto grande (WCAG 1.4.3). Así que el acento necesita dos
colores según la superficie:

| Superficie | Color de acento | Contraste |
|---|---|---|
| Claro (`paper`, `bone`, `cream`) | **`terra` #a62000** | 7.23:1 · 6.59:1 · 6.47:1 |
| Oscuro (`deep`) | **`sunset` #f58521** | 4.26:1 |

`terra` es además el color que ya usan los eyebrows (`Eyebrow tone="terra"`), así
que no entra un color nuevo a la paleta.

Medidos y descartados como acento sobre claro: `river` 2.43:1 (falla),
`tomato` 3.77:1 (pasa raspando, sólo texto grande), `plum` 13.15:1 y `deep`
10.55:1 (pasan, pero el acento se pierde por ser oscuros como el titular).

---

## 4. Sección por sección

### 4.1 PromoBar — nuevo

Los cuatro hechos del hero (`Four food trucks · Rooftop bar · Live music five
nights · Walk in, no reservations`) suben a un banner **arriba del header**.

- Server component. Fila única, separadores en viñeta, sobre `deep`, ~34px.
- **No es sticky**: se va con el scroll y el header queda solo.
- Los hechos salen del hero, donde hoy son la fila `FACTS`.
- **Va en `app/layout.tsx`, así que aparece en las 23 rutas**, igual que el
  header y la `StatusBar`. Es lo que Camila pidió al compararlo con el «Closed
  now», que también está en todas.

⚠️ **Consecuencia obligada**: el header es hoy una píldora **flotante** con
`top` fijo. El PromoBar lo empuja, así que hay que recalcular ese `top` y el
`padding-top` de los heroes de las 23 rutas (`Hero` y `PageHero`), o el header
se monta encima del contenido. Es el trabajo menos visible de todo el rediseño
y el que más fácil se rompe.

### 4.2 Hero — rediseñado

Forma Superside: titular grande, bajada corta, **un** CTA, y debajo el muro de
piezas.

- **Sin foto de fondo.** Hoy es foto a sangre con velo `deep` al 72%. Con el
  muro debajo, foto y videos compiten: Superside apoya los tiles sobre fondo
  plano justamente por eso. Queda `deep` plano con el isotipo arriba.
- **Titular**: `Bonita comes together`, con `together` en `sunset` (4.26:1
  sobre `deep`). Steelfish Regular, `text-hero`, tracking `0.02em`.
- **Bajada de una línea**, contundente. Camila: «que vaya más al grano, una
  frase contundente, de impacto». Reemplaza el párrafo de dos líneas actual.

  Copy propuesto, **a aprobar por Camila**: `Rooftop bar. Four kitchens. Walk
  in.` Son tres hechos verificados, en tres golpes, y contesta la confusión de
  «restaurante» sin explicarla. El párrafo actual dice lo mismo en 24 palabras.

  Alternativa si se prefiere una frase y no tres: `A rooftop bar over four food
  trucks. No reservations.`
- **Un solo CTA**: «What's on tonight». «Plan an event» ya está en el header
  como píldora naranja; en el hero era la segunda puerta al mismo lugar.

### 4.3 VideoWall — nuevo

Dos filas de tiles en direcciones opuestas, debajo del titular del hero.

- Tiles **3:4 vertical**, ~200px de ancho, esquinas `rounded-card`.
- **6 por fila, 12 en total.** Es el mínimo: con menos de 6 por fila el loop se
  ve repetido en pantalla al mismo tiempo. Ideal 16 (8 por fila).
- Cada slot es hoy un **recuadro gris con el rótulo «video»**, ya cableado para
  `<video muted loop playsInline preload="metadata">`. Cuando lleguen los clips
  se cambia el `src` y nada más.
- **`prefers-reduced-motion`**: no auto-scrollea. Queda scroll horizontal
  manual, con la fila como región desplazable y accesible por teclado.

**Lo que hace falta del cliente**: 12 clips mínimo, 3:4 vertical, 4–8 s, sin
audio, ~1–2 MB cada uno, `.mp4` H.264.

### 4.4 WhatsOn — fusión de «Tonight at the Yard» + «This week»

Camila: «no entiendo la diferencia, no debería ser todo una». Se funden en una
sección con las cards de Superside.

- **Card Superside**: foto arriba, bloque de color abajo con el título. Un color
  por card: `sunset` (texto negro, 8.26:1), `deep` (texto crema), `chalk`
  (texto tinta). **Nunca blanco sobre naranja**: 2.54:1.
- Comportamiento en hover: zoom de la imagen a 1.03 y nada más, 250ms. Es lo
  que le gustó de las cards de Superside.
- **La primera card es la de hoy**, con tag `Tonight`. El resto de la semana
  sigue con su tag de día. Así no se pierde la inmediatez, que es la razón por
  la que alguien vuelve a entrar a la web.
- Client component: necesita saber qué día es en `America/New_York`, con el
  mismo patrón de fallback que hoy usa `TonightAtTheYard` (el servidor pinta un
  estado útil, el día real aparece al montar).
- El fallback de trucks se mantiene tal cual: la rotación diaria **no existe**
  como dato, así que muestra el roster y dice la verdad.

### 4.5 HowThisPlaceWorks — rediseño sutil

Camila: «me gusta, pero rediseñemos un poco para hacerlo más sutil, más actual
y de identidad sofisticado». Se mantiene el mecanismo de `PinnedList`; cambia
el acabado:

- Filetes de 1px en vez de 2px.
- Etiquetas de paso más chicas, en Bronx versalita, sin relleno de color.
- Título activo en Steelfish **Regular** con el tracking nuevo, sin peso alto.
- Riel de progreso de 1px.
- Más aire entre paso y paso.

### 4.6 ThreeDoors — forma «Our difference»

Fusiona las mini cards del hero y las tres losas oscuras. Las tres unidades
aparecen **una sola vez** en la home.

- Eyebrow + h2 con acento en `terra` + fila de tres columnas.
- Cada columna: ícono chico en cuadrado redondeado, micro-etiqueta en
  versalitas, título, cuerpo, y el link.
- Separadas por filetes de 1px, **no** por tarjetas pesadas. Es el gesto que
  `docs/design-references.md` ya tenía pendiente de aplicar de wework/superside.
- Los tres íconos se dibujan como SVG inline en el lenguaje de la marca. No hay
  íconos de bar/música/eventos en `public/`.

### 4.7 EventsBanner — forma «Our global team»

Reemplaza `ForEventPlanners`. Camila: «que sea sólo un banner, que toda esa info
esté en la página que le corresponda, no en la home».

Estructura medida en `superside.com/our-creative-talent`: card oscura con la
imagen arriba (inset, con radio), después eyebrow, titular con acento, bajada,
y tres barras de una línea cada una con lo más importante.

- Card en `deep`. Titular con acento en `sunset`.
- Los tres items son los ya confirmados que vivían en la sección: coordinamos
  los trucks, la barra es nuestra, el espacio es tuyo.
- Un CTA a `/events`.

**Los tres pasos del proceso** (`PLANNER_STEPS`: request a proposal → get the
packet → see the spaces) **no se borran: se mudan a `/events`** como bloque de
proceso. Es contenido que hoy sólo existe en la home.

### 4.8 FindUs — acordeón estilo yava

Camila: «como el de yava, cada día será clicqueable y con el click se expande y
muestra el horario de apertura y el de los food».

Estructura de `yava/app/components/LocationSection.tsx`: mapa a un lado, panel
de datos al otro, con el día de hoy destacado. Lo que se **agrega** sobre yava
es el acordeón: yava lista los siete días planos.

- Cada día es un **`<details name="hours">` nativo** con su `<summary>`. El
  atributo `name` compartido hace el acordeón exclusivo —abrir uno cierra el
  otro— **sin una línea de JavaScript**, y trae gratis el foco, el teclado y el
  anuncio del estado. Adentro, `bar` y `trucks` de ese día, que ya existen en
  `HOURS` (`lib/brand.ts`).

  Donde el navegador no soporte `name` en `<details>` degrada a siete
  desplegables independientes: se pueden abrir varios a la vez y nada más. Es
  una degradación aceptable, no una rotura.
- **Hoy arranca abierto y destacado.** Hover no expande: en táctil no hay hover
  y los dos mecanismos a la vez pelean. El `open` de hoy lo pone un client
  component chico al montar, porque el día depende de `America/New_York` y el
  servidor no lo puede saber sin arriesgar una página cacheada con el día
  equivocado.
- Se conservan dirección (link a Maps), teléfono y parking.
- Los siete días se renderizan en el **servidor**, así que sin JS la información
  igual se lee: lo único que aporta el JS es cuál arranca abierto.

Queda **sólo en la home**. Los datos también viven en `/visit` y `/contact`.

### 4.9 Footer + AgencyBar — reestructurado

Camila: «no tiene la estructura que trabajamos en la agencia y falta el footer
de la agencia; los horarios, dirección y teléfonos no van allí».

Estructura compartida de la casa (the-orient, santa-maria, casa-pirul,
pretty-hens): columna de identidad a la izquierda y columnas de links a la
derecha.

- **Columna de identidad**: logo, una bajada corta y el CTA. **Sin dirección,
  sin horarios, sin teléfono.**
- **Tres columnas de links** adaptadas a las 23 rutas del sitio, más redes.
- **Franja inferior**: copyright y links legales.
- **`AgencyBar` nuevo**, portado de the-orient: pastilla «powered by» + logo de
  Resto Experience + tagline + año. Hace falta:
  - copiar `resto-experience.svg` a `public/images/agency/`;
  - agregar la constante `AGENCY` (url, tagline, año) a `lib/brand.ts`, donde
    hoy sólo hay `BRAND.credit`.

⚠️ **Consecuencia aceptada**: sacando los datos del footer, en las otras 20
rutas los horarios y la dirección no están en ninguna parte. Camila lo eligió
sabiéndolo: viven en la home, `/visit` y `/contact`.

---

## 5. Motion y accesibilidad

Se respeta el vocabulario ya fijado en `docs/layout-motion.md`:

- Tope de 600ms por animación. El muro de videos es un loop continuo, no una
  animación de entrada: no le aplica el tope, pero sí `prefers-reduced-motion`.
- `prefers-reduced-motion` apaga: el auto-scroll del muro, el zoom de las cards
  y el stagger de las secciones nuevas.
- Todo lo que se expande (acordeón de FindUs) es un control real, alcanzable por
  teclado y con su estado anunciado.

---

## 6. Contrastes a verificar

Los que este rediseño introduce y hay que medir antes de cerrar:

| Combinación | Uso | Mínimo |
|---|---|---|
| `terra` sobre `paper` / `bone` / `cream` | acento de titular | 3:1 (texto grande) |
| `sunset` sobre `deep` | acento de titular | 3:1 |
| `ink` sobre `sunset` | card de evento naranja | 4.5:1 |
| `paper` sobre `deep` | card de evento oscura | 4.5:1 |
| texto del PromoBar sobre `deep` | banner | 4.5:1 |
| rótulo «video» sobre el gris del placeholder | muro | 4.5:1 |

---

## 7. Documentación que queda desactualizada

- **`docs/design-references.md`** documenta `BrandTrail` como el gesto adoptado
  de ronnsquare.fr. Al eliminarlo, de ronnsquare queda sólo `PageTransition`.
  Hay que anotarlo con el motivo, y marcar como aplicado el acento tipográfico
  de wework/superside, que estaba pendiente.
- **`docs/house-tokens.md`** fija `--tracking-display: -0.02em` heredado de The
  Orient. Hay que registrar por qué se reemplaza por una escala positiva.
- **`src/app/page.tsx`** tiene el orden de secciones comentado en el
  encabezado. Se reescribe.

---

## 8. Pendientes que NO bloquean este trabajo

1. **Licencia de Bronx.** El fuente es `Bronx_PersonalUse.otf`. Camila entiende
   que está comprada; **verificar antes de publicar**. Además nunca se confirmó
   contra la página 13 del brand book cuál de las tres tipografías llamadas
   Bronx es la correcta.
2. **`Futura PT` es Futura Cyrillic.** El `@font-face` declara una familia que
   no sirve. Se deja como está por decisión de Camila; corregir el nombre antes
   de publicar.
3. **Red de seguridad en CSS del `Preloader`.** Es una cortina opaca a pantalla
   completa cuya única salida es un timer de JS: si la hidratación falla, el
   sitio queda tapado. No fue la causa del incidente del 9/9 —era el server
   caído— pero sigue siendo una fragilidad real.
4. **`FeaturesMarquee`**: eliminarlo o no. Recomendación: eliminarlo, dice lo
   mismo que el PromoBar.

---

## 9. Cómo conviene fasear

Es mucho para una sola tanda, y hay un orden que reduce el riesgo. La
tipografía va primero porque toca las 23 rutas y cambia cómo se ve todo lo
demás: hacerla al final obligaría a revisar dos veces cada sección nueva.

1. **Tipografía** — escala de tracking, peso Regular, Steelfish sólo en h1–h3,
   los dos colores de acento. Se revisa el sitio entero una vez.
2. **PromoBar + offset del header** — el trabajo de las 23 rutas, y el que más
   fácil se rompe. Mejor solo, con revisión visual.
3. **Hero + VideoWall**.
4. **Las secciones de la home** — WhatsOn, ThreeDoors, EventsBanner, FindUs,
   HowThisPlaceWorks, y las eliminaciones.
5. **Footer + AgencyBar**, y la mudanza de `PLANNER_STEPS` a `/events`.
6. **Documentación** — los tres archivos de la sección 7.

---

## 10. Verificación al terminar

Los scripts que ya tiene el proyecto, todos deben pasar:

```bash
npm run contrast        # los contrastes de la sección 6
npm run a11y            # axe sobre las 23 rutas
npm run check:css       # tokens y clases
npm run check:surfaces  # ritmo de superficies
npm run check:motion    # reduced-motion
npm run build           # tipos y build de producción
```

Y a ojo, en el navegador: que el header no se monte sobre ningún hero en las 23
rutas, que el muro loopee sin repetir en pantalla, y que el acordeón de FindUs
se lea con JS apagado.
