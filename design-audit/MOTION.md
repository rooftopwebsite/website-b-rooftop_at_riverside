# Motion — el vocabulario, sección por sección

Formato de nueve slots, como pide el brief: **elemento · API exacta ·
disparador · propiedades de→a · timing · orquestación · estado inicial ·
fallback · entrega**.

Los tokens viven en [`src/lib/motion.ts`](../src/lib/motion.ts) y los
componentes en [`src/components/shared/Motion.tsx`](../src/components/shared/Motion.tsx).

---

## 0. Los tokens

```
ease.out      [0.16, 1, 0.30, 1]      easeOutExpo — arranca rápido, frena largo
ease.inOut    [0.22, 1, 0.36, 1]      para lo que vuelve: acordeones, alturas

dur.micro     0.20   hover, tap
dur.ui        0.35   nav, dropdowns
dur.reveal    0.70   entradas de sección
dur.hero      1.10   ⚠️ SÓLO la secuencia del hero, y sólo al cargar

stagger       0.08
dist.text     32px
dist.media    48px
viewport      { once: true, margin: '0px 0px -20% 0px' }
clip          inset(0% 0% 100% 0%) → inset(0% 0% 0% 0%)
```

**El tope de 600ms y su única excepción.** La regla de la casa era «ninguna
animación pasa de 600ms», y sigue en pie para todo lo que el usuario dispara o
ve repetidas veces. Una entrada lenta que se repite ocho veces mientras
scrolleás no se lee como elegante, se lee como lag. `dur.hero` es la excepción
declarada: corre **una vez, al cargar**, no se repite, y es el momento
memorable de la página.

**`margin` y no `amount`.** `amount: 0.2` esperaba que el 20 % del elemento
estuviera visible, lo que en una sección alta significa scrollear media
pantalla más allá de que asome. El margen negativo dispara cuando al elemento
le falta un 20 % del viewport para entrar, que es cuando el ojo ya lo busca.

---

## 1. Un mecanismo por tipo de contenido

Esto es la regla de diseño, no un detalle de implementación. El mismo
fade + slide-up en las ocho secciones es la firma de una web autogenerada.

| tipo de contenido | mecanismo | por qué ése |
|---|---|---|
| titulares grandes | `MaskedLines` | reveal por líneas con máscara: el titular se **descubre**, no se desliza |
| imágenes a sangre | `RevealMedia` | `clip-path` que se abre. Una foto grande que se desliza arrastra el bloque; una que se descubre se lee como que estaba ahí |
| **banda dentro de un titular** | `RevealMedia from="left"` | el mismo mecanismo, pero abriéndose en el sentido de lectura del renglón que interrumpe. Es la única foto del sitio que es tipografía: si se abriera desde abajo, se delataría como una imagen que llegó de otra parte. Con `delay` de 0,12s, o sea después del primer renglón |
| grillas y filas | `StaggerGroup` + `RevealItem` | desfasaje: son elementos equivalentes de una lista |
| media en contenedor | `ScaleMedia` | escala mínima. Un `clip-path` dentro de una caja con radio pelea con el recorte del contenedor |
| bloques de texto | `Reveal` | fade + desplazamiento corto |
| **salidas** | `ScrollExit` | ligado al progreso del scroll. Sólo en dos lugares |

---

## 2. Sección por sección

### Hero — la secuencia de carga

| slot | valor |
|---|---|
| **elemento** | h1 «Bonita comes / together», dos líneas |
| **API** | `MaskedLines` → `motion.span` dentro de un `<span class="block overflow-hidden">` por línea |
| **disparador** | `animate` al montar. **No** `whileInView`: es la primera pantalla, ya está visible |
| **de → a** | `y: '105%'` → `y: '0%'` |
| **timing** | `dur.hero` (1.10s), `ease.out`, `delay: 0.08 + i × 0.07` |
| **orquestación** | 0.07s entre las dos líneas — **no** el `stagger` de 0.08. Dos líneas de un mismo titular tienen que leerse como UN gesto, no como dos ítems |
| **estado inicial** | la línea fuera de su máscara, abajo. El `overflow-hidden` del padre la oculta |
| **fallback** | `useReducedMotion` → texto plano, sin máscaras. El layout es idéntico: las máscaras no aportan altura |
| **entrega** | ✅ |

| slot | valor |
|---|---|
| **elemento** | isotipo, bajada y los dos CTAs |
| **API** | `HeroFadeUp` → `motion.div` |
| **disparador** | `animate` al montar |
| **de → a** | `opacity: 0, y: 16` → `opacity: 1, y: 0` |
| **timing** | `dur.ui` (0.35s), `ease.out`, delays 0 / 0.26 / 0.34 |
| **orquestación** | tres delays escritos a mano, escalonados detrás del titular |
| **estado inicial** | invisible, 16px abajo |
| **fallback** | tag plano |
| **entrega** | ✅ |

| slot | valor |
|---|---|
| **elemento** | el abanico de nueve cards (`CardArc`) |
| **API** | `motion.li` con `initial`/`animate` por card |
| **disparador** | `animate` al montar |
| **de → a** | `opacity: 0, y: −subida + 40` → `opacity: 1, y: −subida`. La `subida` es la del arco: la animación mueve 40px **sobre** su posición geométrica, no la reemplaza |
| **timing** | `dur.reveal`, `ease.out`, `delay: 0.35 + |i − centro| × 0.06` |
| **orquestación** | el desfasaje sale del **centro hacia afuera**, no de izquierda a derecha: así el abanico se abre en vez de barrerse |
| **estado inicial** | invisible, 40px por debajo de su lugar en el arco |
| **fallback** | `initial`/`animate` en `undefined` → la card queda en su posición final |
| **entrega** | ✅ |

| slot | valor |
|---|---|
| **elemento** | los dos clips del abanico |
| **API** | `WallVideo` → `<video autoPlay muted loop playsInline preload="none">` |
| **disparador** | autoplay al montar |
| **de → a** | loop continuo de 6s |
| **timing** | el del clip |
| **orquestación** | ninguna. Los dos clips están separados por tres posiciones en `wall-slots.ts` para que no caigan juntos |
| **estado inicial** | el póster (un frame real del clip) |
| **fallback** | ⚠️ **componente cliente**, porque un `<video autoPlay>` **no se apaga con CSS**. Con reduced-motion se renderiza el póster |
| **entrega** | ✅ |

| slot | valor |
|---|---|
| **elemento** | el bloque de texto del hero, al salir |
| **API** | `ScrollExit` → `useScroll` + `useTransform` |
| **disparador** | progreso del scroll, `offset: ['end end', 'end start']` |
| **de → a** | `y: 0 → −70` |
| **timing** | ninguno: está ligado al scroll, no al reloj |
| **orquestación** | — |
| **estado inicial** | en su lugar. El progreso vale 0 durante toda la lectura |
| **fallback** | tag plano, sin `useScroll` activo |
| **entrega** | ✅ · ⚠️ **sin opacidad** — ver §3 |

---

### What's on — el track de cuatro cards

| slot | valor |
|---|---|
| **elemento** | las cuatro cards de evento |
| **API** | `StaggerGroup as="ul"` + `RevealItem as="li"` |
| **disparador** | `whileInView`, token `viewport` |
| **de → a** | `opacity: 0, y: dist.text (32)` → `opacity: 1, y: 0` |
| **timing** | `dur.reveal`, `ease.out` |
| **orquestación** | `staggerChildren: 0.08`, `delayChildren: 0.04` |
| **estado inicial** | invisibles, 32px abajo |
| **fallback** | tags planos |
| **entrega** | ✅ |

| slot | valor |
|---|---|
| **elemento** | la foto de cada card, en hover |
| **API** | CSS `transition-transform` + `group-hover:scale-[1.03]` |
| **disparador** | hover del `<Link>` contenedor |
| **de → a** | `scale: 1 → 1.03` |
| **timing** | 250ms, `ease-brand` |
| **orquestación** | — |
| **estado inicial** | `scale: 1` |
| **fallback** | ⚠️ el `@media (prefers-reduced-motion)` global de `globals.css` neutraliza las transiciones |
| **entrega** | ✅ |

---

### Five businesses — los tres cuadros

| slot | valor |
|---|---|
| **elemento** | los tres cuadros de color con textura |
| **API** | `StaggerGroup as="ul"` + `RevealItem as="li"` |
| **disparador** | `whileInView`, token `viewport` |
| **de → a** | `opacity: 0, y: 32` → `opacity: 1, y: 0` |
| **timing** | `dur.reveal`, `ease.out` |
| **orquestación** | `stagger` 0.08 |
| **estado inicial** | invisibles, 32px abajo |
| **fallback** | tags planos |
| **entrega** | ✅ · el contenedor lleva `tabIndex={0}` + `aria-label` porque es una región scrolleable sin nada enfocable adentro |

---

### El horizonte — la transición a la banda oscura

| slot | valor |
|---|---|
| **elemento** | el medallón de sol y palmera |
| **API** | `motion.div` con `whileInView` |
| **disparador** | `whileInView`, token `viewport` |
| **de → a** | `opacity: 0, y: 26` → `opacity: 1, y: 0` |
| **timing** | `dur.reveal`, `ease.out` |
| **orquestación** | ninguna: es un elemento único |
| **estado inicial** | invisible, 26px abajo — detrás de la línea de la ola |
| **fallback** | `initial`/`animate` en `undefined` |
| **entrega** | ✅ |

| slot | valor |
|---|---|
| **elemento** | el disco dentado del sol |
| **API** | CSS `@keyframes rt-sol` |
| **disparador** | al montar, infinito |
| **de → a** | `rotate: 0 → 360deg` |
| **timing** | **90s**, `linear`. A esa velocidad el movimiento no se ve mirándolo: se nota al volver a la sección. A 20s es un spinner de carga |
| **orquestación** | — |
| **estado inicial** | sin rotar |
| **fallback** | `animation: none` en el media query |
| **entrega** | ✅ |

⚠️ **La ola NO se anima.** Ya se mueve el sol; mover las dos cosas convierte
una transición en una escena.

---

### Events banner — la banda oscura

| slot | valor |
|---|---|
| **elemento** | el bloque de dos columnas |
| **API** | `Reveal` → `motion.div` |
| **disparador** | `whileInView`, token `viewport` |
| **de → a** | `opacity: 0, y: 32` → `opacity: 1, y: 0` |
| **timing** | `dur.reveal`, `ease.out` |
| **orquestación** | — |
| **estado inicial** | invisible, 32px abajo |
| **fallback** | tag plano |
| **entrega** | ✅ |

| slot | valor |
|---|---|
| **elemento** | el mismo bloque, al salir |
| **API** | `ScrollExit` |
| **disparador** | progreso del scroll |
| **de → a** | `y: 0 → −70` |
| **timing** | ligado al scroll |
| **orquestación** | `ScrollExit` **afuera** y `Reveal` **adentro**, en ese orden: al revés, el transform de la salida sería ancestro del reveal y los dos escribirían el mismo `y` |
| **estado inicial** | en su lugar |
| **fallback** | tag plano |
| **entrega** | ✅ |

---

### Global

| slot | valor |
|---|---|
| **elemento** | la cortina de transición entre páginas (`.transition` de ronnsquare) |
| **API** | `AnimatePresence` + `motion.div`, con la cenefa de olas como borde inferior |
| **disparador** | cambio de `pathname`. **No** en la primera carga: ahí trabaja el preloader |
| **de → a** | `y: 0 → −110vh` |
| **timing** | `DURATION.slow` = `dur.reveal`, `ease.out` |
| **orquestación** | — |
| **estado inicial** | cubriendo la pantalla, con los 10vh de ola por debajo del viewport |
| **fallback** | no se monta nada |
| **entrega** | ✅ **DIBUJA UNA FORMA.** La ola del brand book, volteada, como borde que barre. Reutiliza los paths de `npm run horizonte`: cero arte nuevo |

| slot | valor |
|---|---|
| **elemento** | el scroll de la página |
| **API** | Lenis, `lerp: 0.1`, `anchors: false` |
| **disparador** | rueda / touch |
| **de → a** | interpolación de la posición |
| **timing** | `lerp` |
| **orquestación** | — |
| **estado inicial** | — |
| **fallback** | **no se instancia** con reduced-motion. El scroll suave es exactamente el movimiento que marea |
| **entrega** | ✅ |

| slot | valor |
|---|---|
| **elemento** | botones y links |
| **API** | CSS `transition` |
| **disparador** | hover, focus, tap |
| **de → a** | color de relleno, color de anillo, grosor del subrayado |
| **timing** | `dur.micro` (200ms) / 250ms |
| **orquestación** | — |
| **estado inicial** | reposo |
| **fallback** | media query global |
| **entrega** | ✅ · foco de teclado visible en todo lo interactivo, con el anillo invertido a `cream` dentro de `.on-dark` |

---

## 3. Lo que NO está, y por qué

### La opacidad en las salidas — **sacada a propósito**

El brief pide «opacidad e `y` ligados al progreso». La opacidad se implementó y
se quitó: `npm run a11y` la reprobó. Los dos bloques con salida contienen CTAs,
y a mitad del fundido el botón primario quedaba en **3.3:1** (`#54615d` sobre
`#f7a85f` — `ink` y `sunset` a un tercio de opacidad sobre el fondo claro).

Y el contraste es el menor de los dos problemas: **un botón al 35 % de opacidad
sigue siendo clickeable**. Queda un control activo, enfocable con teclado, que
se ve apagado. Eso no es una salida elegante, es un control que miente sobre si
funciona.

La salida quedó como desplazamiento solo. Sigue ligada al progreso del scroll,
que es lo que el brief busca, y no toca la legibilidad de nada.

### `ParallaxMedia` — **no existe**

El brief lo nombra como componente reutilizable. En su lugar está `ScaleMedia`,
que resuelve el caso real que apareció (media dentro de un contenedor con
radio). No hay parallax en el sitio, y el propio `Motion.tsx` tiene la regla
escrita desde antes: «nada de parallax sobre fotos de comida o de gente».
Queda como decisión a confirmar, no como olvido.

### La sección de servicios estilo **agencefoudre** — **sin destino**

El mandato del brief es «dos columnas pegadas, ítem activo que abre su bloque
con `min-height`». La home **no tiene** sección de servicios: el contenido que
más se le parecía —los tres pasos de «Five businesses»— pasó a ser tres cuadros
de color por pedido explícito. Hay que decidir si se crea una sección para el
mandato o si el mandato se da de baja.

### El color de la cortina — **revisado, y se queda en `deep`**

El brief pedía «revisá que el color de la forma acompañe la paleta clara».
Revisado: **se queda**. Una cortina tiene que TAPAR, y con el sitio en 74 %
claro una cortina clara sería invisible y no cubriría el salto de página —que
es su único trabajo—. El verde de marca es lo único que contrasta contra las
dos páginas, la que se va y la que llega. Mismo razonamiento para el
`Preloader`.

Lo que sí cambió es la FORMA, no el color: ver la fila de la cortina en §2.

### Un error que cometí y corregí, por si vuelve

La primera versión de la cortina con forma puso la ola **arriba**. No se ve
nunca: la cortina **sube**, así que el borde que barre la pantalla es el de
abajo y el de arriba sale de cuadro en el primer frame. La ola va abajo y
volteada con `scaleY(-1)`, porque el dibujo tiene las crestas hacia arriba —está
hecho para que una superficie EMERJA— y acá la superficie se RETIRA.

---

## 4. Verificación

| check | estado |
|---|---|
| `npm run check:motion` — layout idéntico con y sin movimiento, 6 rutas | ✅ |
| `npm run a11y` — 20 páginas × 2 anchos | ✅ 0 violaciones |
| `once: false` en el repo | ✅ cero |
| `useScroll`/`useTransform` fuera de `ScrollExit` | ✅ ninguno (el `useScrolled` del Header es un hook propio, sin relación) |
| ninguna animación de interacción supera 600ms | ✅ |
