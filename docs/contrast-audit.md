# Auditoría de contraste — Rooftop at Riverside

Calculado sobre luminancia relativa según **WCAG 2.1** (fórmula de 1.4.3 / 1.4.11).
Regenerable: `node scripts/contrast.mjs`.

**Mínimos aplicados:** 4.5:1 texto de cuerpo · 3:1 texto grande (≥24px, o ≥18.66px bold)
y elementos de interfaz no textuales.

---

## El problema de partida

`sunset` #F58521 y `river` #0EB6B8 son dos tonos medios con luminancia casi idéntica:
**2.54:1** y **2.50:1** sobre blanco. Ninguno de los dos alcanza AA como color de texto
sobre fondo claro, en ningún tamaño. De ahí salen las reglas duras de abajo.

---

## Tabla de pares en uso

| Par | Uso | Ratio | Mínimo | Estado |
|---|---|---:|---:|---|
| `body` sobre `paper` | Cuerpo de texto — el 92% del sitio | **19.80:1** | 4.5:1 | ✅ AAA |
| `ink` sobre `paper` | Títulos, nav, todo encabezado | **21.00:1** | 4.5:1 | ✅ AAA |
| `ink` sobre `sunset` | Texto del CTA primario | **8.26:1** | 4.5:1 | ✅ AAA |
| `ink` sobre `river` | Texto sobre relleno teal | **8.40:1** | 4.5:1 | ✅ AAA |
| `ink` sobre `cream` | Texto sobre la superficie crema | **18.30:1** | 4.5:1 | ✅ AAA |
| `ink` sobre `mint` | Texto sobre mint | **17.26:1** | 4.5:1 | ✅ AAA |
| `deep` sobre `paper` | Eyebrow y texto de color sobre blanco | **10.83:1** | 4.5:1 | ✅ AAA |
| `plum` sobre `paper` | Texto de color alternativo | **13.51:1** | 4.5:1 | ✅ AAA |
| `terra` sobre `paper` | Alertas y precios destacados | **7.43:1** | 4.5:1 | ✅ AAA |
| `magenta` sobre `paper` | Acento editorial | **5.64:1** | 4.5:1 | ✅ AA |
| `teal600` sobre `paper` | Texto de color sobre BLANCO | **4.59:1** | 4.5:1 | ✅ AA |
| `deep` sobre `cream` | Eyebrow sobre crema | **9.44:1** | 4.5:1 | ✅ AAA |
| `plum` sobre `cream` | Texto de color sobre crema | **11.77:1** | 4.5:1 | ✅ AAA |
| `terra` sobre `cream` | Acento sobre crema | **6.47:1** | 4.5:1 | ✅ AA |
| `magenta` sobre `cream` | Acento sobre crema | **4.92:1** | 4.5:1 | ✅ AA |
| `teal600` sobre `cream` | ⚠️ PROHIBIDO — no llega a AA | **4.00:1** | 4.5:1 | ❌ FALLA |
| `paper` sobre `deep` | Texto sobre la superficie oscura | **10.83:1** | 4.5:1 | ✅ AAA |
| `cream` sobre `deep` | Texto y eyebrow sobre oscuro | **9.44:1** | 4.5:1 | ✅ AAA |
| `mint` sobre `deep` | Detalle sobre oscuro | **8.90:1** | 4.5:1 | ✅ AAA |
| `sunset` sobre `deep` | Acento GRANDE sobre oscuro | **4.26:1** | 3:1 | ✅ AA |
| `river` sobre `deep` | Acento GRANDE sobre oscuro | **4.33:1** | 3:1 | ✅ AA |
| `ink` sobre `paper` | Anillo de foco sobre blanco | **21.00:1** | 3:1 | ✅ AA |
| `ink` sobre `sunset` | Anillo de foco sobre el CTA | **8.26:1** | 3:1 | ✅ AA |
| `cream` sobre `deep` | Anillo de foco sobre oscuro | **9.44:1** | 3:1 | ✅ AA |
| `ink45` sobre `paper` | Subrayado de link en REPOSO (identifica el link) | **3.36:1** | 3:1 | ✅ AA |
| `sunset` sobre `paper` | Subrayado en HOVER — redundante con el grosor | **2.54:1** | n/a | ✅ exento — decorativo |

---

## Reglas duras que salen de la tabla

1. **`sunset` y `river` nunca como color de texto** sobre blanco ni sobre crema.
   Se usan como SUPERFICIE (con texto negro encima) o como forma (isotipo, patrón).
2. **Sobre naranja o sobre teal el texto va en NEGRO** — 8.26:1 y 8.40:1. Nunca en blanco:
   blanco sobre `sunset` da 2.54:1 y sobre `river` 2.50:1.
3. **Sobre `deep` #014545** el texto va en blanco (10.83:1) o en crema (9.44:1).
4. **`magenta` no se usa sobre `deep`** — 1.92:1. Es el único acento que se apaga sobre
   la superficie oscura.
5. **El anillo de foco va en tinta** (21:1 sobre blanco, 8.26:1 sobre el naranja del CTA)
   y se invierte a crema dentro de `.on-dark` (9.44:1).
   No va en `sunset`: 2.54:1 no llega al 3:1 de 1.4.11.

---

## Los dos casos que hubo que resolver

### 1. `teal600` sobre crema — **prohibido**

El brief lista `#028382` entre los colores de texto admitidos «sobre fondo claro»,
con 4.6:1. Ese número es correcto **sobre blanco** (4.59:1). **Sobre crema da 4.00:1**
y no llega a AA para cuerpo.

Es la única cifra del brief que no se sostiene, y no porque esté mal calculada:
la regla dice «fondo claro» sin distinguir blanco de crema, y crema es más oscuro.

**Resuelto quitándolo, no justificándolo.** `COLOR_RULES.colorTextOnCream` en
`src/lib/brand.ts` excluye `teal600`. Sobre crema quedan `deep` (9.44), `plum` (11.77),
`terra` (6.47) y `magenta` (4.92).

### 2. El hover naranja de los links — **choque entre dos reglas del brief**

El brief pide las dos cosas a la vez:

- «Sunset Orange — … en el **hover de links**»
- «Todo el texto cumple WCAG AA» / «si un par no pasa, **cambialo, no lo justifiques**»

Pero el naranja sobre blanco da 2.54:1 y no llega al 3:1 que pide 1.4.11 para un
indicador de interfaz. Pintar el subrayado de naranja y seguir de largo rompería la
segunda regla.

**Resuelto separando qué indicador sostiene la accesibilidad:**

| Estado | Subrayado | Ratio | Rol |
|---|---|---:|---|
| Reposo | 1px, tinta al 45% (#8C8C8C) | **3.36:1** ✅ | **Es acá donde el link se identifica como link.** Cumple 1.4.11. |
| Hover | 2px, `sunset` | 2.54:1 | Gesto. El cambio de estado se comunica **también por grosor**, así que no depende del color (1.4.1). |

El texto del link se mantiene en tinta a 21:1 en los dos estados. Si alguien no distingue
el naranja, no pierde ninguna información: el link estaba subrayado antes y el subrayado
se engrosó.

Implementado en la utilidad `link-texto` de `globals.css`.

---

## El acento del titular — agregado el 9 de septiembre de 2026

El rediseño sumó un acento tipográfico dentro del titular, en **color y no en
itálica**. Necesita **dos** colores y no uno, y este es el motivo medido:

| Par | Uso | Ratio | Veredicto |
|---|---|---|---|
| `sunset` sobre `paper` | acento sobre claro | **2.48:1** | ❌ no llega ni al 3:1 de texto grande |
| `terra` sobre `paper` | acento sobre claro | **7.43:1** | ✅ AAA |
| `terra` sobre `cream` | acento sobre crema | **6.47:1** | ✅ AA |
| `sunset` sobre `deep` | acento sobre oscuro | **4.26:1** | ✅ AA |

Medidos y descartados para claro: `river` 2.43:1 (falla), `tomato` 3.77:1 (pasa
raspando, sólo texto grande), `plum` 13.15:1 y `deep` 10.55:1 (pasan, pero
siendo oscuros como el titular el acento no se lee como acento).

**Regla:** sobre superficie clara el acento es `terra`; sobre `deep` es
`sunset`. Lo encapsula el componente `Accent`, cuya prop es la **superficie** y
no el color, justamente para que nadie tenga que acordarse de esto.

---

## Colores COMPUESTOS — lo que esta tabla no puede prever

⚠️ Tres fallos reales de esta sesión, y los tres los encontró `npm run a11y`
midiendo el píxel renderizado, no esta tabla:

| Dónde | Declarado | Medido | Arreglo |
|---|---|---|---|
| Rótulo «video» del muro | `paper/55` sobre `paper/12` sobre `deep` | **3.51:1** | `paper/75` → 5.08:1 |
| Rótulos Bar/Trucks de FindUs | `body/60` sobre `paper` | **3.92:1** | `body/70` → 5.30:1 |
| Número inactivo de PinnedList | `body/45` sobre `paper` | **2.61:1** | `body/65` → 4.57:1 |

Los tres son **una opacidad sobre otra**, o una opacidad sobre un fondo que ya
es una opacidad. Un par de paleta no los describe: el color real no está
declarado en ninguna parte, sale de la composición.

⚠️ Y el tercero enseña algo más: axe marca el contraste **aunque el elemento
sea `aria-hidden`**. Tiene razón — sigue siendo texto visible para quien ve,
aunque no lo lea un lector de pantalla. Esconder algo del árbol de
accesibilidad no es una salida para un contraste que no pasa.

---

## Lo que todavía no está cubierto

Esta tabla cubre los pares del **sistema**. Falta verificar, cuando existan:

- **Texto sobre fotografía.** Ya no aplica al hero —se quedó sin foto de fondo y
  hoy es `deep` sólido, donde `paper` da 15.4:1 sin depender de nada—, pero
  sigue valiendo para cualquier texto que se ponga sobre imagen en otra página.
  El par real se mide sobre el color compuesto y no sobre el declarado, que es
  el error clásico que ningún checker automático detecta.
- **El patrón de azulejo.** Ya llegó el asset real (`public/brand/tile-pattern.svg`,
  del Figma) y va como banda decorativa `aria-hidden`, así que hoy no hay texto
  encima de él. Si alguna vez se apoya texto, hay que medirlo sobre el píxel
  renderizado: son cuatro colores y el par cambia según dónde caiga la letra.
- **Texto sobre foto desenfocada** (el banner de eventos de la home). Resuelto con
  un velo `deep/90`, que es un piso calculado: con una foto blanca pura el peor
  caso da 5,3:1. Medido sobre el píxel renderizado con la foto real —axe informa
  «incomplete» cuando el fondo es imagen— da entre 6,4:1 y 8,2:1. Si se cambia la
  foto no hace falta volver a medir, pero si se baja el velo, sí.
- **Estados de error de formulario.** Van con texto además de color (requisito de Fase 4),
  pero el par de color todavía no está definido.
