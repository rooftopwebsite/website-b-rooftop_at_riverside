# Autocrítica final

El brief pide tres cosas que sacaría del diseño, y sacar una. Van en orden de
cuánto me molestan.

---

## 1 · El giro perpetuo del sol — **ÉSTA LA SAQUÉ**

El medallón del horizonte hacía dos cosas: **subía** al entrar en pantalla, una
vez, y **giraba** 360° cada 90 segundos, para siempre.

La subida se queda. El giro se fue, y por tres razones que no son de gusto:

- **Contradice la doctrina de motion de toda la rama.** Cada mecanismo del sitio
  dispara una vez y se queda quieto. `MOTION.md` lo dice en la primera línea:
  Superside es la referencia de moderación, «anima poco, en los momentos
  justos». Un giro infinito no es poco ni es un momento — es un estado.
- **Era el único elemento que nunca se asienta.** Una página que termina de
  moverse se lee terminada. Con el sol girando, siempre queda algo en marcha en
  la periferia de la vista, que es precisamente el tipo de movimiento que
  `prefers-reduced-motion` existe para apagar. Enviar algo que hay que defender
  con un media query es una señal.
- **Era MI agregado, no el pedido.** Camila pidió «¿podrías animarlo también?».
  La subida ES la animación: el sol emerge de detrás de la ola cuando la sección
  entra. El giro lo puse yo encima, y no explicaba nada que la subida no
  explicara ya.

Lo que queda en el código es la clase `rt-sol` sin animación y el comentario de
por qué, para que no vuelva por inercia. El keyframe está borrado.

---

## 2 · La greca al 15 % sobre el cuadro amarillo — **ESTABA MAL DIAGNOSTICADA**

Lo que decía acá: que el verde al 15 % sobre `cream` grita más que los otros
dos cuadros, que la culpa era de la opacidad, y que la prueba era que el par
`deep`/`cream` mide 9.44:1.

**El razonamiento estaba mal.** 9.44:1 es una medida de si un TEXTO se lee, no
de cuánto pesa una textura, y usé una para hablar de la otra. Escribí
`design-audit/trama.mjs` para medirlo en serio: compone cada trama sobre su
propio campo a su opacidad, pasa las dos a CIELAB y devuelve el ΔE. Con
15/15/20 % daba

    01 · deep sobre cream     ΔL* 9,9   ΔE 11,7
    02 · ink  sobre sunset    ΔL* 8,0   ΔE 13,4
    03 · cream sobre deep     ΔL* 14,0  ΔE 15,7

o sea que el cuadro crema era el **más suave de los tres** por las dos medidas.
Bajarle la opacidad, que es lo que yo proponía, lo habría hecho desaparecer.

Lo que sí estaba mal era el **tamaño de la celda**, que no había mirado: a 34px
la greca es una figura que el ojo cuenta una por una, y por eso compite con el
texto. Comparado en pantalla a 34 / 26 / 20 / 15px, **20px** es el punto donde
pasa a ser campo sin dejar de ser reconocible —a 15px ya no es una greca, es un
tejido cualquiera y el arte de marca se pierde—.

Quedó: celda a 20px en todo el sitio (What's on tenía su propio override de
26px, o sea que la home mostraba dos escalas de la misma trama a diez
centímetros de distancia; se fue) y las tres opacidades igualadas a ΔE ~14,5 →
19 % / 16 % / 18 %. **El cuadro crema SUBIÓ.**

La lección, que es la que importa: la corrección la encontró el script, no el
ojo. Y el error original también fue de método —tomé un ratio de contraste como
si midiera peso visual— y no de gusto.

---

## 3 · La ola aparece tres veces

Cuando escribí la primera autocrítica anoté el riesgo de que dos cenefas
alrededor de Events banner se leyeran como manierismo. Lo resolví poniendo el
horizonte en la entrada y la cenefa en la salida — dos piezas distintas para
dos cortes distintos.

Y después usé la ola una tercera vez, como borde de la cortina de transición
entre páginas.

Cada uso está justificado por separado, y la reutilización es lo que hace que el
arte de marca se sienta sistema y no adorno. Pero tres apariciones del mismo
dibujo es el límite: la cuarta convierte la ola en un patrón de fondo, que es
justo lo que la ley del color prohíbe. **Queda anotado como techo, no como
deuda.**

---

## Lo que sigue estando mal y no es mío

Para que no se lea como que el diseño está cerrado:

- ~~**El oscuro quedó en 25,1 %**, un décimo sobre el techo.~~ **Cerrado: 24,5 %.**
  Lo cerró la banda de foto de «Three doors», que agregó 307px de página clara
  y con foto. No hubo que cambiarle el color a ningún cuadro.
- **`docs/prompt-claude-design.md` no está ejecutado, y es un documento tuyo
  que barrí a un commit sin leer.** Es un prompt maestro completo que toma
  defoodtruckclub.nl como referencia ESTRUCTURAL literal: otro orden de
  bloques, bordes punteados, sellos circulares, cortinas de esquinas
  redondeadas, marquesinas, carruseles con flechas, contadores, `bone` como
  superficie base y «What's on» en losa oscura. De sus cinco gestos hoy hay uno
  construido —el titular partido con la foto encastrada, en «Three doors»— y
  su hero contradice el que aprobaste después (el arco de cards). Es una
  bifurcación, no una deuda: hay que decidirla, no completarla en silencio.
- **`Wooftop Wednesdays` sigue sin foto** porque en las 36 entregadas no hay ni
  un perro. Es el único hueco marcado que queda en la home.
- **El hero no tiene el cielo del mockup** porque no existe la foto.
- **El logo del header es un PNG.** Del lockup full color no hay versión
  vectorial; es lo único del sitio que no escala.
- **Cinco `text-d6` en páginas internas** dejan la condensada a 22px, por debajo
  del piso de 24. Están fuera del alcance que acordamos, pero es una regla del
  sistema de tipo y no de la home.
- **Diez usos del estilo eyebrow en la home** contra los 3 que permite el brief.
  Saqué todos los que anunciaban sección; los que quedan son rótulos de dato.
  Esa distinción la interpreté yo.
- **`ParallaxMedia` no existe** y la **sección de servicios estilo agencefoudre
  no tiene destino** en la home. Las dos están documentadas en `MOTION.md` §3
  como decisiones a confirmar, no como olvidos.
- **No abrí los repos hermanos de la casa** (Zakia, The Orient, Santa María,
  Tre Vele, YAVA) ni showdown-social, que el brief pone como referencia
  prioridad #1 y #2. Trabajé con el moodboard, las referencias externas de §2.1
  y lo que `docs/house-tokens.md` ya tenía medido de ellos.
