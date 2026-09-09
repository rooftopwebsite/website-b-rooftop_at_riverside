# Layout y movimiento — Rooftop at Riverside

Se apoya en `docs/house-tokens.md`. Ante conflicto, **ganan los tokens medidos**.

---

## Header

| | |
|---|---|
| Alto | 67px · 77px desde `desk` |
| Posición | `fixed`, opaco, sombra al scrollear (umbral 40px) |
| Logo | lockup completo; se reduce de 58px a 42px al scrollear |
| Nav visible | Sunset Bar · Food Trucks · What's On · Events · The Yard |
| Mega-menú | «More», 8 links con descripción de una línea, en 2 columnas |
| CTAs | `Plan an Event` primario (sunset, texto negro) · `What's On` secundario (borde) |
| Mobile | menú **full-screen**, lista con flecha por ítem, los 2 CTAs fijos abajo |

**No hay «Book Now»**: el venue es walk-in y no toma reservas de mesa.

### Barra de estado

Pegada debajo del header, 34px, sobre crema. Una línea:
`● Open now | BAR 3PM–8PM | TRUCKS 4PM–8PM`

Es la pregunta que más se hace del negocio y la confusión número uno —los dos
horarios son distintos— por 34px de alto. Client-side: el servidor no sabe qué
hora es en Bonita Springs y una página cacheada mostraría un estado viejo.

---

## Footer

Cuatro columnas sobre `#014545`:

1. **Identidad** — logo, una línea de posicionamiento, IG · FB · Google
2. **Contacto** — dirección, teléfono, `info@`, botón de direcciones
3. **Horarios** — los **dos sets** en columnas contiguas. Es donde el footer hace
   trabajo de posicionamiento: mostrarlos juntos dice «bar y trucks son cosas
   distintas» sin una línea de copy
4. **Quick links** — Events Packet, Event Spaces, Corporate, Join Us, FAQ,
   Gift Cards, Careers

Franja inferior: legales + badge de Resto Experience.

⚠️ **`events@` no va en el footer.** Vive sólo en el hub de eventos y en
`/contact`: una consulta de $20.000 no puede caer en el mismo buzón que una
pregunta sobre estacionamiento.

⚠️ **El logo va invertido a blanco** (`brightness-0 invert`). El lockup a color
tiene el wordmark en NEGRO y sobre teal profundo no se lee. Es un compromiso
hasta que llegue el lockup reversado del brand book: se pierden el aro naranja
y la onda teal.

---

## Ritmo de superficies

- Blanco por defecto
- Máximo **2 secciones de crema** por página
- Máximo **1 de teal profundo**
- **Nunca dos secciones de color seguidas**

Verificado en cada build: `node scripts/surface-rhythm.mjs`.

La cenefa de olas (`<WaveBorder>`) sólo donde la superficie cambia de verdad, dos
o tres por página. En cada corte dejaría de ser un gesto de marca y sería un
patrón de fondo.

Es el separador del brand book, sacado del Figma —página «Elementos», nodo
2001:2414—, no un dibujo propio. Reemplazó a `<Scallop>`, que era un festón de
arcos inventado mientras no teníamos el archivo.

Dos cosas que hay que respetar al usarla:

- **El color va en la sección de ABAJO.** Las olas tienen las crestas hacia
  arriba: pintadas del color de arriba quedarían colgando dadas vuelta.
- **El período de repetición es 383,5px, no los 422 que mide el dibujo.** La
  tira no cierra sola; en el archivo el diseñador superpone las copias. Medido
  renderizando 422, 400 y 383,5 en paralelo: sólo 383,5 corre sin hueco.

---

## Vocabulario de motion — nueve slots

Lenis para el scroll, Motion para entradas y micro-estados. GSAP quedó **sin
usar**: ninguno de los nueve slots lo necesitó, y sumar 70 KB para nada no se
justifica.

| # | Slot | Dónde | Cómo |
|---|---|---|---|
| 1 | Preloader | global | % con el isotipo, salida en cortina. Fade 300ms + lift 600ms |
| 2 | Entrada del hero | `/` | H1 por líneas con máscara, stagger 70ms |
| 3 | Reveal de sección | global | fade + 24px, una vez, threshold 20% |
| 4 | Marquee | `/` | loop CSS, pausa en hover y con foco dentro |
| 5 | Hover de tarjeta | trucks, espacios, eventos | −2px, imagen ×1.03, título a `#014545` |
| 6 | Sticky de event planners | `/` | `position: sticky` puro, sólo desde `lg` |
| 7 | Carrusel de trucks | `/food-trucks` | scroll nativo + `scroll-snap`, arrastre con mouse |
| 8 | Contador | `/events` | 25.000–30.000 del 4 de julio. **Único del sitio** |
| 9 | Transición de página | global | cortina corta, misma curva que el preloader |

**Curva:** `cubic-bezier(0.16, 1, 0.3, 1)` · **Tope: 600ms**, sin excepciones.

### Reglas verificadas

- Sin parallax en fotos de comida ni de gente
- Sin scroll hijacking — Lenis interpola la rueda, no cambia a dónde llegás
- Ninguna animación pasa de 600ms
- **Con `prefers-reduced-motion` el layout es idéntico**, comprobado midiendo
  cada caja con y sin la preferencia: `node scripts/reduced-motion.mjs`

---

## ⚠️ Bug de breakpoints que encontramos acá

`--breakpoint-desk` estaba declarado en **px** (`1344px`) mientras los de
Tailwind vienen en **rem**. Tailwind ordena los media queries por valor, no
puede comparar unidades distintas, y emitía el bloque de `desk` **antes** que
los defaults.

Consecuencia: `sm:grid-cols-2` le ganaba a `desk:grid-cols-4` en una pantalla de
1440px. Medido: el bloque de 1344px caía en el byte 39975 y el de 40rem en 40927.

Arreglado pasándolo a `84rem` (= 1344px exactos). Afectaba a **todas** las
combinaciones `sm:`/`md:`/`lg:` + `desk:` del sitio, no sólo al footer.
