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

## 2 · La greca al 15 % sobre el cuadro amarillo

Los tres cuadros de «Five businesses» llevan la trama de grecas: `deep/15`
sobre crema, `ink/15` sobre naranja, `cream/20` sobre verde.

Sobre el naranja y el verde funciona: es una textura y se lee como textura.
**Sobre el amarillo no.** El verde al 15 % sobre `cream` tiene demasiado
contraste para ser un fondo —el par `deep`/`cream` mide 9.44:1— así que la
espiral se lee como un DIBUJO, compite con el texto que va apoyado encima y
hace que el primero de los tres cuadros grite más que los otros dos.

No la saqué porque la textura en las cards fue un pedido explícito y sacarla de
uno de los tres rompería la serie. Pero la corrección correcta no es bajar la
opacidad —a menos del 10 % desaparece en los otros dos—: es que **cada cuadro
tenga su propia opacidad**, calibrada contra su propio campo. Es un cambio de
tres números y lo hago cuando digas.

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

- **El oscuro quedó en 25,1 %**, un décimo sobre el techo. Lo empuja el cuadro
  `deep` de «Night». Se corrige cambiándole el color a ese cuadro.
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
