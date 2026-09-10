# Contraste medido — `redesign/light-tropical`

Generado por `node scripts/contrast.mjs`. **La paleta se lee de
`src/app/globals.css`**, no está escrita en el script: es la corrección del
problema que encontró la auditoría, donde `scripts/contrast.mjs` tenía la
paleta copiada a mano y había quedado vieja, así que todos los ratios
documentados estaban calculados contra colores que el sitio no pintaba.

Método: luminancia relativa WCAG 2.1. Mínimos: **4.5:1** para cuerpo,
**3:1** para texto grande (≥24px, o ≥19px en negrita) y para componentes de
interfaz no textuales (WCAG 1.4.11). Un filete decorativo no es un componente
de interfaz y no tiene mínimo.

## La paleta que se midió

| token | hex |
|---|---|
| `sunset` | `#F58521` |
| `river` | `#0EB6B8` |
| `cream` | `#FDF0B4` |
| `mint` | `#C4F2EC` |
| `deep` | `#014545` |
| `deeper` | `#013434` |
| `teal600` | `#028382` |
| `tomato` | `#EB452C` |
| `terra` | `#A62000` |
| `plum` | `#402639` |
| `magenta` | `#A24584` |
| `sunset-hover` | `#E0741A` |
| `ink` | `#0A1F1E` |
| `paper` | `#FFFFFF` |
| `bone` | `#FAF6EA` |
| `body` | `#0A1F1E` |
| `muted` | `#487270` |
| `muted-dark` | `#A8C6C4` |
| `fog` | `#DED8C7` |

## Los pares

| Par | Uso | Ratio | Mínimo | Estado |
|---|---|---:|---:|---|
| **— Texto sobre las dos superficies claras —** | | | | |
| `ink` `#0A1F1E` sobre `paper` `#FFFFFF` | Títulos y cuerpo sobre la base | **17.11:1** | 4.5:1 | ✅ AAA |
| `ink` `#0A1F1E` sobre `bone` `#FAF6EA` | Títulos y cuerpo sobre la segunda superficie | **15.83:1** | 4.5:1 | ✅ AAA |
| `body` `#0A1F1E` sobre `paper` `#FFFFFF` | Cuerpo — mismo valor que `ink`, token separado | **17.11:1** | 4.5:1 | ✅ AAA |
| `muted` `#487270` sobre `paper` `#FFFFFF` | **La bajada** y el texto secundario | **5.36:1** | 4.5:1 | ✅ AA |
| `muted` `#487270` sobre `bone` `#FAF6EA` | La bajada sobre la segunda superficie | **4.96:1** | 4.5:1 | ✅ AA |
| `muted` `#487270` sobre `cream` `#FDF0B4` | La bajada sobre una píldora amarilla | **4.67:1** | 4.5:1 | ✅ AA |
| **— Texto sobre la banda oscura —** | | | | |
| `paper` `#FFFFFF` sobre `deep` `#014545` | Títulos y cuerpo sobre la banda de Events y el footer | **10.83:1** | 4.5:1 | ✅ AAA |
| `muted-dark` `#A8C6C4` sobre `deep` `#014545` | **La bajada** sobre oscuro — el par que encontró `npm run a11y` | **5.95:1** | 4.5:1 | ✅ AA |
| `cream` `#FDF0B4` sobre `deep` `#014545` | Eyebrow y detalle sobre oscuro | **9.44:1** | 4.5:1 | ✅ AAA |
| `paper` `#FFFFFF` sobre `deeper` `#013434` | Texto del header | **13.62:1** | 4.5:1 | ✅ AAA |
| `muted` `#487270` sobre `deep` `#014545` | ❌ `muted` sobre oscuro — el bug que hubo que arreglar | **2.02:1** | 4.5:1 | 🚫 **prohibido, y por esto** |
| **— Rellenos de marca: el texto encima va NEGRO —** | | | | |
| `#000000` `#000000` sobre `sunset` `#F58521` | Texto del CTA primario | **8.26:1** | 4.5:1 | ✅ AAA |
| `#000000` `#000000` sobre `river` `#0EB6B8` | Texto sobre relleno teal | **8.40:1** | 4.5:1 | ✅ AAA |
| `#000000` `#000000` sobre `cream` `#FDF0B4` | Texto sobre la píldora amarilla | **18.30:1** | 4.5:1 | ✅ AAA |
| `deep` `#014545` sobre `cream` `#FDF0B4` | Texto sobre botón crema (el CTA sobre oscuro) | **9.44:1** | 4.5:1 | ✅ AAA |
| **— El acento del titular, a dos colores según superficie —** | | | | |
| `terra` `#A62000` sobre `paper` `#FFFFFF` | Acento sobre claro | **7.43:1** | 4.5:1 | ✅ AAA |
| `terra` `#A62000` sobre `bone` `#FAF6EA` | Acento sobre la segunda superficie | **6.87:1** | 4.5:1 | ✅ AA |
| `sunset` `#F58521` sobre `deep` `#014545` | Acento sobre oscuro — sólo display, NO cuerpo | **4.26:1** | 3:1 | ✅ AA |
| **— Eyebrows: sólo los tonos que pasan —** | | | | |
| `deep` `#014545` sobre `paper` `#FFFFFF` | Eyebrow y texto de color sobre claro | **10.83:1** | 4.5:1 | ✅ AAA |
| `deep` `#014545` sobre `bone` `#FAF6EA` | Eyebrow sobre la segunda superficie | **10.03:1** | 4.5:1 | ✅ AAA |
| `plum` `#402639` sobre `paper` `#FFFFFF` | Eyebrow alternativo | **13.51:1** | 4.5:1 | ✅ AAA |
| `plum` `#402639` sobre `bone` `#FAF6EA` | Eyebrow alternativo | **12.50:1** | 4.5:1 | ✅ AAA |
| `magenta` `#A24584` sobre `paper` `#FFFFFF` | Eyebrow editorial | **5.64:1** | 4.5:1 | ✅ AA |
| `magenta` `#A24584` sobre `bone` `#FAF6EA` | Eyebrow editorial | **5.22:1** | 4.5:1 | ✅ AA |
| **— Anillo de foco (WCAG 1.4.11, 3:1) —** | | | | |
| `ink` `#0A1F1E` sobre `paper` `#FFFFFF` | Anillo sobre claro | **17.11:1** | 3:1 | ✅ AA |
| `ink` `#0A1F1E` sobre `sunset` `#F58521` | Anillo sobre el CTA naranja | **6.73:1** | 3:1 | ✅ AA |
| `cream` `#FDF0B4` sobre `deep` `#014545` | Anillo sobre oscuro | **9.44:1** | 3:1 | ✅ AA |
| **— Filetes de 1px: decorativos, no son controles —** | | | | |
| `fog` `#DED8C7` sobre `paper` `#FFFFFF` | El filete que reemplaza a las tarjetas | **1.42:1** | — | ➖ exento — decorativo |
| `fog` `#DED8C7` sobre `bone` `#FAF6EA` | ídem sobre la segunda superficie | **1.32:1** | — | ➖ exento — decorativo |
| **— PROHIBIDOS, medidos para que quede escrito por qué —** | | | | |
| `sunset` `#F58521` sobre `paper` `#FFFFFF` | ❌ naranja como TEXTO sobre claro | **2.54:1** | 4.5:1 | 🚫 **prohibido, y por esto** |
| `sunset` `#F58521` sobre `bone` `#FAF6EA` | ❌ ídem sobre la segunda superficie | **2.35:1** | 4.5:1 | 🚫 **prohibido, y por esto** |
| `river` `#0EB6B8` sobre `paper` `#FFFFFF` | ❌ teal medio como TEXTO sobre claro | **2.50:1** | 4.5:1 | 🚫 **prohibido, y por esto** |
| `paper` `#FFFFFF` sobre `sunset` `#F58521` | ❌ blanco sobre el CTA naranja | **2.54:1** | 4.5:1 | 🚫 **prohibido, y por esto** |
| `paper` `#FFFFFF` sobre `river` `#0EB6B8` | ❌ blanco sobre relleno teal | **2.50:1** | 4.5:1 | 🚫 **prohibido, y por esto** |
| `teal600` `#028382` sobre `cream` `#FDF0B4` | ❌ teal600 sobre amarillo — el caso histórico | **4.00:1** | 4.5:1 | 🚫 **prohibido, y por esto** |

## Las reglas duras que salen de la tabla

1. **El naranja y el teal medio no son colores de texto sobre claro.** Dan
   2.54:1 y 2.50:1 sobre la base, y sobre la segunda superficie
   todavía menos (2.35:1). No pasan ni el mínimo de texto grande, en
   ningún tamaño. Por eso el acento del titular es **a dos colores según la
   superficie**: `terra` sobre claro, `sunset` sobre oscuro.
2. **Sobre relleno naranja o teal, el texto va negro.** El blanco da
   2.54:1 y 2.50:1; el negro da 8.26:1 y 8.40:1.
3. **El acento sobre oscuro es sólo para display.** `sunset` sobre `deep` da
   4.26:1: pasa el 3:1 de texto grande, no el 4.5:1 de cuerpo. Sirve
   para una palabra de un titular de 88px, no para una bajada.
4. **La bajada tiene un token opaco y no una opacidad.** `muted`
   `#487270` pasa AA en las tres superficies claras
   (5.36:1 · 4.96:1 · 4.67:1). Con `text-body/75` el color
   resultante cambiaba según lo que hubiera detrás, así que no se podía medir.
5. **El anillo de foco se invierte sobre oscuro.** `ink` sobre `deep` sería
   1.58:1 — invisible. La regla `.on-dark` de globals.css lo pasa a
   `cream`, que da 9.44:1.

## Colores compuestos — lo que esta tabla NO puede prever

Un color translúcido sobre otro translúcido sobre una foto no se puede resolver
acá: sólo se ve midiendo el píxel renderizado. El caso conocido es el rótulo
`video` del muro del hero, que es `paper` translúcido sobre un relleno
translúcido. **Se verifica con `npm run a11y` sobre la página servida**, no en
esta tabla.

Con la dirección clara ese rótulo pasa a ser `muted` opaco sobre `paper`
opaco, o sea 5.36:1 medible acá — que es una de las razones por las que
conviene que el muro deje de apoyarse en opacidades.
