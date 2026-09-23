# Seguridad: validaciones, adjuntos y timeouts

**Fecha:** 2026-09-23
**Rama:** `seguridad/validaciones-y-timeouts`
**Sub-proyecto 1 de 6** de la auditoría enterprise (seguridad → correcciones sin riesgo → comentarios → CSS → rendimiento → splits). Cada uno lleva su propio spec, plan, rama y PR.

## Objetivo

Cerrar los huecos de validación y resiliencia que encontró la Fase 0 en las seis Server Actions del sitio y en sus llamadas externas, **sin cambiar lo que ve un usuario legítimo** y sin agregar dependencias.

El sitio no tiene rutas `/api`. La superficie son las seis Server Actions: `submitContact`, `submitEventInquiry`, `submitJob`, `submitArtist`, `submitMarketVendor` y `subscribeToNewsletter`. Todas validan hoy con zod y tienen honeypot.

## Criterios de éxito

1. Las seis actions pasan por el rate limit.
2. Un adjunto cuyo contenido no coincide con su tipo declarado se rechaza con un error de campo, y lo que se adjunta al mail sale del resultado validado.
3. Ningún campo de texto libre acepta más de su largo máximo, tanto en el cliente como en el servidor.
4. Ninguna llamada externa puede colgar un render o un envío más de su timeout.
5. `npm run build` y `npx tsc --noEmit` terminan sin errores, y los tests nuevos de `node:test` pasan.
6. Un envío legítimo de cada formulario sigue llegando igual que antes.

## Diseño

### 1. Rate limit

- `subscribeToNewsletter` (`src/app/actions/newsletter.ts`) llama a `rateLimited()` después de validar, igual que las otras cinco. Si se excede, devuelve el mismo tipo de mensaje de error que ellas.
- `src/lib/submissions.ts`: el mapa `HITS` se poda. En cada llamada, cuando supera las 1.000 claves, descarta las entradas cuya última marca está fuera de la ventana. Si después de podar sigue arriba del tope, descarta las más viejas. La lógica de decisión (5 envíos cada 10 minutos por IP) no cambia.
- La poda se extrae a una función pura `podar(hits, ahora, ventana, tope)` en `src/lib/saneo.ts`, para poder testearla.

### 2. Adjuntos

- `adjuntos()` en `src/app/actions/join.ts` deja de leer de `formData`: recibe los `File` de `parsed.data` (`resume`; `logo` y `photo`).
- Nuevo módulo `src/lib/file-signature.ts`, sin imports, con una función pura `firmaCoincide(bytes: Uint8Array, mime: string): boolean` que compara los primeros bytes contra la firma del tipo:

  | Tipo | Firma |
  |---|---|
  | `application/pdf` | `25 50 44 46` (`%PDF`) |
  | `.docx` (`…wordprocessingml.document`) | `50 4B 03 04` (ZIP) |
  | `application/msword` | `D0 CF 11 E0 A1 B1 1A E1` (OLE) |
  | `image/jpeg` | `FF D8 FF` |
  | `image/png` | `89 50 4E 47 0D 0A 1A 0A` |
  | `image/webp` | `52 49 46 46` + `57 45 42 50` en el byte 8 |
  | `image/avif` | `66 74 79 70` en el byte 4, con marca `avif` o `avis` |

- Después del `safeParse`, cada action con archivos verifica la firma de cada `File` no vacío. Si no coincide, devuelve `status: 'error'` con el error de campo `"<Etiqueta> doesn't look like <formato>."`, usando el mismo camino de `fieldErrors` que ya usa zod.
- `fileToAttachment` sanea el nombre del archivo con una función pura `nombreSeguro(nombre)`: toma solo la parte después de la última `/` o `\`, quita los caracteres de control y `<>:"|?*`, recorta a 100 caracteres conservando la extensión, y cae a `attachment` si queda vacío.

### 3. Largos máximos

Se agrega `.max()` con un mensaje en inglés a cada campo de texto libre que hoy no lo tiene:

| Campo | Máximo |
|---|---|
| Nombres (`name`, `firstName`, `lastName`, helper `nombre()`) | 100 |
| Email (todos, incluido el helper `mail`) | 254 |
| Teléfono (todos, incluido el helper `telefono`) | 30 |
| `business`, `position`, `address`, `cityState`, `dates`, `startDate`, `startTime`, `endTime` | 200 |
| Newsletter: `firstName` y `email` | 100 y 254 |

Los textareas, `company` y las celdas de `tabla()` conservan el tope que ya tienen. Como los schemas son compartidos, el cliente muestra el error antes de enviar, igual que hoy con el mínimo.

### 4. Llamadas externas

- Nuevo `src/lib/http.ts` (sin imports) con `fetchConTimeout(url, init, { ms = 5000, reintentos = 1 })`:
  - Usa `AbortSignal.timeout(ms)` en cada intento.
  - Reintenta solo ante un error de red, un timeout o un 5xx, y solo en `GET`.
  - Devuelve la `Response` tal cual; el llamador decide qué hacer con un 4xx, como hoy.
  - Conserva las opciones `next: { revalidate, tags }` que recibe.
- `query()` en `src/lib/restoexp.ts` y los fetch de `src/lib/blog.ts` pasan a usarlo. Los fallbacks actuales no cambian: contenido local si Supabase falla, y `getPosts` vacío si el feed falla.
- `sendMail` en `src/lib/mail.ts` envuelve `resend.emails.send` con un timeout de 10 segundos (`Promise.race`) y **no reintenta**, porque reintentar un envío puede duplicar un mail. Un timeout se trata como el error que ya maneja: log y `ok: false`.

### 5. Asunto de los mails

`sendSubmission` aplica una función pura `asuntoSeguro(s)` que reemplaza cualquier `\r` o `\n` por un espacio y colapsa los espacios repetidos antes de pasar el asunto a Resend.

### 6. Variables de entorno

- Nuevo `src/instrumentation.ts` con `register()`. Solo en el runtime de Node, avisa con `console.warn` qué variables faltan de esta lista:
  - `RESEND_API_KEY`, `RESEND_FROM`
  - los cinco `MAIL_TO_*`
  - `NEWSLETTER_SHEETS_WEBHOOK_URL`
  - las tres `NEXT_PUBLIC_SUPABASE_*`
  - `BLOG_FEED_ORIGIN`, `BLOG_RESTAURANT_ID`
- **No corta el arranque.** El sitio degrada con gracia a propósito: sin Supabase sirve contenido local y sin Resend avisa al usuario.
- `.env.example`: sale `NEXT_PUBLIC_SITE_URL`, que nadie lee porque `SITE_URL` está fijo en `seo.ts`, y entran `BLOG_FEED_ORIGIN` y `BLOG_RESTAURANT_ID`.

## Fuera de alcance (se reporta en el PR)

- **El test roto de `blog-format`.** Ver «Cómo corren los tests».

- **Sanitizar el HTML del blog** (`src/app/blog/[slug]/page.tsx`). Requiere una dependencia de sanitización, y el sub-proyecto no agrega dependencias. Escribir un sanitizador a mano es más riesgoso que el estado actual: el contenido viene del dashboard propio de RestoExp.
- **Reglas de seguridad de Supabase para escrituras anónimas.** `scripts/propagar-banner-evento.mjs` escribe con la anon key; hay que confirmar en Supabase, fuera del repo, que la base las bloquea para el público.
- **Rate limit distribuido.** El limitador en memoria es por instancia; el límite real entre instancias es el firewall de Vercel, que se configura en el dashboard.

## Pruebas

### Cómo corren los tests

Node 24 ejecuta TypeScript directo, pero solo resuelve imports con la extensión `.ts` escrita y no entiende `server-only` ni los alias `@/`. Por eso el test que ya existe, `src/lib/blog-format.test.ts`, **hoy falla** con `ERR_MODULE_NOT_FOUND`: importa `./blog-format` sin extensión, y ese módulo importa `./restoexp`, y así sigue la cadena. Arreglarlo exige tocar los imports de toda esa cadena, así que queda fuera de alcance y se reporta.

Para que los tests nuevos sí corran:

- Las funciones puras viven en módulos **sin imports** y sin `server-only`:
  - `src/lib/file-signature.ts`: `firmaCoincide`.
  - `src/lib/saneo.ts`: `nombreSeguro`, `asuntoSeguro` y `podar`.
  - `src/lib/http.ts`: `fetchConTimeout`, que solo usa `fetch` y `AbortSignal`, globales de Node. Lo importan únicamente módulos de servidor.
- `submissions.ts`, `mail.ts`, `join.ts`, `restoexp.ts` y `blog.ts` los importan con el alias de siempre.
- Los tests viven en `src/lib/seguridad.test.ts` e importan con extensión (`./saneo.ts`). Para que `tsc` lo acepte se agrega `"allowImportingTsExtensions": true` en `tsconfig.json`, que es válido porque el proyecto ya tiene `noEmit`.
- Nuevo script `"test:seguridad": "node --test src/lib/seguridad.test.ts"`. No hay un `test` general, porque incluiría el test roto.

### Qué se prueba

- **Tests con `node:test`** para las funciones puras:
  - `firmaCoincide`: los siete tipos, un positivo y un negativo por tipo, y un PDF renombrado como `.docx`.
  - `nombreSeguro`: rutas, caracteres de control, nombres largos y nombre vacío.
  - `asuntoSeguro`: saltos de línea y espacios repetidos.
  - `podar`: vencidas, tope y orden.
  - `fetchConTimeout`: timeout, reintento ante un 5xx, sin reintento ante un 4xx ni en `POST`. Se prueba contra un servidor `http` local levantado en el propio test.
- **Envíos reales en `npm run dev`** con Playwright:
  - un envío válido de contact, event inquiry, job (con PDF) y market vendor;
  - un `.pdf` falso (texto renombrado) en job, que debe mostrar el error de campo;
  - un nombre de 101 caracteres, que debe mostrar el error antes de enviar;
  - seis altas seguidas al newsletter, donde la sexta debe dar el error de rate limit.
- `npm run build` y `npx tsc --noEmit` limpios antes de cada commit.

## Commits

Un commit por punto, en este orden: 5, 1, 3, 2, 4, 6. Los dos primeros son los más chicos y los que más riesgo cierran. El PR va contra `main` y reporta los tres puntos fuera de alcance.
