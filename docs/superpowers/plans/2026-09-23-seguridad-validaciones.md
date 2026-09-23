# Seguridad: validaciones, adjuntos y timeouts — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cerrar los huecos de validación y resiliencia de las seis Server Actions y de las llamadas externas, sin cambiar lo que ve un usuario legítimo.

**Architecture:** Las funciones puras (saneo de nombres y asuntos, poda del limitador, firmas de archivo, fetch con timeout) viven en módulos nuevos **sin imports** para poder testearlas con `node:test`. Los módulos de servidor existentes (`submissions.ts`, `mail.ts`, `join.ts`, `restoexp.ts`, `blog.ts`, `newsletter.ts`) las consumen. Los schemas de zod, compartidos entre cliente y servidor, suman `.max()`.

**Tech Stack:** Next.js 16.3 (App Router, Server Actions), React 19, TypeScript strict, zod 4, Resend 6, Node 24 (`node:test` con type stripping nativo).

**Spec:** `docs/superpowers/specs/2026-09-23-seguridad-validaciones-design.md`

## Global Constraints

- Rama: `seguridad/validaciones-y-timeouts`. Nunca commitear a `main`.
- Sin dependencias nuevas.
- No correr Prettier ni ningún formateador: el repo está formateado a mano, con comillas simples.
- `npm run build` y `npx tsc --noEmit` limpios antes de cada commit.
- Todo texto visible (mensajes de error de formularios) va en inglés y **sin em dash (—)**.
- Los módulos puros nuevos (`src/lib/saneo.ts`, `src/lib/file-signature.ts`, `src/lib/http.ts`) no llevan **ningún** import ni `import 'server-only'`.
- Los tests importan con extensión `.ts` y corren con `npm run test:seguridad`.
- Mensajes de commit en español, terminando con `Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>`.
- **No enviar mails reales a los buzones del cliente.** Toda prueba de envío usa `MAIL_TO_*=delivered@resend.dev`, la casilla de prueba oficial de Resend.

## Review Focus

- **El rate limit es global por IP, no por formulario:** cinco envíos de cualquier formulario agotan el cupo de todos. Las pruebas E2E tienen que reiniciar el dev server entre la tanda del newsletter y la de los formularios (Task 7).
- **Un adjunto vacío (`size === 0`) es «no adjuntó nada»**, no un archivo inválido: la verificación de firma lo saltea (Task 4).
- **Un 5xx en el último intento** tiene que devolverse como `Response`, no tirar, para que el llamador lo loguee como hoy (Task 5).
- **Un `POST` nunca se reintenta**, aunque devuelva 5xx (Task 5).
- **El nombre de archivo sin extensión** o con un punto inicial (`.bashrc`) no puede perder caracteres al recortar (Task 1).

---

### Task 1: Módulo `saneo.ts`, tests y asunto seguro en los mails

**Files:**
- Create: `src/lib/saneo.ts`
- Create: `src/lib/seguridad.test.ts`
- Modify: `tsconfig.json` (agregar `allowImportingTsExtensions`)
- Modify: `package.json` (script `test:seguridad`)
- Modify: `src/lib/submissions.ts` (usar `asuntoSeguro` en `sendSubmission`)

**Interfaces:**
- Produces:
  - `asuntoSeguro(s: string): string`
  - `nombreSeguro(nombre: string): string`
  - `podar(hits: Map<string, number[]>, ahora: number, ventana: number, tope: number): void`

- [ ] **Step 1: Habilitar imports con extensión y el script de tests**

En `tsconfig.json`, dentro de `compilerOptions`, después de `"noEmit": true,` agregar:

```json
    "allowImportingTsExtensions": true,
```

En `package.json`, dentro de `scripts`, después de la línea `"check:seo": ...,` agregar:

```json
    "test:seguridad": "node --test src/lib/seguridad.test.ts",
```

- [ ] **Step 2: Escribir los tests que fallan**

Crear `src/lib/seguridad.test.ts`:

```ts
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { asuntoSeguro, nombreSeguro, podar } from './saneo.ts';

describe('asuntoSeguro', () => {
  it('reemplaza saltos de línea por un espacio', () => {
    assert.equal(asuntoSeguro('Hola\r\nBcc: x@y.com'), 'Hola Bcc: x@y.com');
  });
  it('colapsa espacios repetidos y recorta', () => {
    assert.equal(asuntoSeguro('  Job   application:\n\nAna  '), 'Job application: Ana');
  });
  it('deja intacto un asunto normal', () => {
    assert.equal(asuntoSeguro('Booking request: The Band'), 'Booking request: The Band');
  });
});

describe('nombreSeguro', () => {
  it('saca las rutas de Windows y Unix', () => {
    assert.equal(nombreSeguro('C:\\Users\\ana\\cv.pdf'), 'cv.pdf');
    assert.equal(nombreSeguro('../../etc/passwd'), 'passwd');
  });
  it('quita caracteres de control y prohibidos', () => {
    assert.equal(nombreSeguro('mi<cv>:"|?*\u0000\u001f.pdf'), 'micv.pdf');
  });
  it('recorta a 100 caracteres conservando la extensión', () => {
    const largo = `${'a'.repeat(150)}.pdf`;
    const r = nombreSeguro(largo);
    assert.equal(r.length, 100);
    assert.ok(r.endsWith('.pdf'));
  });
  it('recorta un nombre largo sin extensión a 100', () => {
    assert.equal(nombreSeguro('b'.repeat(130)).length, 100);
  });
  it('no trata un punto inicial como extensión', () => {
    assert.equal(nombreSeguro('.bashrc'), '.bashrc');
  });
  it('cae a attachment si queda vacío', () => {
    assert.equal(nombreSeguro(''), 'attachment');
    assert.equal(nombreSeguro('///'), 'attachment');
    assert.equal(nombreSeguro('<>?'), 'attachment');
  });
});

describe('podar', () => {
  const VENTANA = 1000;
  it('no toca nada si está por debajo del tope', () => {
    const hits = new Map([['a', [0]]]);
    podar(hits, 5000, VENTANA, 10);
    assert.equal(hits.size, 1);
  });
  it('descarta las claves vencidas cuando supera el tope', () => {
    const hits = new Map([
      ['vieja', [0]],
      ['nueva', [4800]],
      ['otra', [4900]],
    ]);
    podar(hits, 5000, VENTANA, 2);
    assert.deepEqual([...hits.keys()].sort(), ['nueva', 'otra']);
  });
  it('si siguen sobrando, descarta las de actividad más vieja', () => {
    const hits = new Map([
      ['a', [4100]],
      ['b', [4900]],
      ['c', [4500]],
    ]);
    podar(hits, 5000, VENTANA, 2);
    assert.deepEqual([...hits.keys()].sort(), ['b', 'c']);
  });
});
```

- [ ] **Step 3: Correr los tests y ver que fallan**

Run: `npm run test:seguridad`
Expected: FAIL con `ERR_MODULE_NOT_FOUND` (todavía no existe `saneo.ts`).

- [ ] **Step 4: Implementar `saneo.ts`**

Crear `src/lib/saneo.ts`:

```ts
export function asuntoSeguro(s: string): string {
  return s.replace(/[\r\n]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

const MAX_NOMBRE = 100;

export function nombreSeguro(nombre: string): string {
  const base = nombre.split(/[\\/]/).pop() ?? '';
  const limpio = base.replace(/[\u0000-\u001f\u007f<>:"|?*]/g, '').trim();
  if (!limpio) return 'attachment';
  if (limpio.length <= MAX_NOMBRE) return limpio;
  const punto = limpio.lastIndexOf('.');
  const ext = punto > 0 && limpio.length - punto <= 10 ? limpio.slice(punto) : '';
  return limpio.slice(0, MAX_NOMBRE - ext.length) + ext;
}

export function podar(hits: Map<string, number[]>, ahora: number, ventana: number, tope: number): void {
  if (hits.size <= tope) return;
  for (const [clave, marcas] of hits) {
    if (!marcas.some((t) => ahora - t < ventana)) hits.delete(clave);
  }
  if (hits.size <= tope) return;
  const orden = [...hits].sort((a, b) => Math.max(...a[1]) - Math.max(...b[1]));
  for (const [clave] of orden.slice(0, hits.size - tope)) hits.delete(clave);
}
```

- [ ] **Step 5: Correr los tests y ver que pasan**

Run: `npm run test:seguridad`
Expected: PASS, 12 tests, 0 fallas.

- [ ] **Step 6: Usar `asuntoSeguro` al enviar**

En `src/lib/submissions.ts`, agregar al bloque de imports:

```ts
import { asuntoSeguro } from './saneo';
```

y dentro de `sendSubmission` reemplazar:

```ts
    subject: s.subject,
```

por:

```ts
    subject: asuntoSeguro(s.subject),
```

- [ ] **Step 7: Verificar y commitear**

Run: `npx tsc --noEmit && npm run build`
Expected: sin errores.

```bash
git add src/lib/saneo.ts src/lib/seguridad.test.ts tsconfig.json package.json src/lib/submissions.ts
git commit -m "El asunto de los mails ya no acepta saltos de línea del usuario, con tests para las funciones de saneo"
```

---

### Task 2: Rate limit en el newsletter y poda del limitador

**Files:**
- Modify: `src/app/actions/newsletter.ts`
- Modify: `src/lib/submissions.ts` (función `rateLimited`)

**Interfaces:**
- Consumes: `podar` de `src/lib/saneo.ts` (Task 1); `rateLimited(): Promise<boolean>` de `src/lib/submissions.ts` (ya existe).

- [ ] **Step 1: Podar el mapa en cada llamada**

En `src/lib/submissions.ts`, cambiar el import de la Task 1 a:

```ts
import { asuntoSeguro, podar } from './saneo';
```

debajo de `const MAX_PER_WINDOW = 5;` agregar:

```ts
const MAX_CLAVES = 1000;
```

y en `rateLimited()`, reemplazar:

```ts
  const key = await clientKey();
  const now = Date.now();
```

por:

```ts
  const key = await clientKey();
  const now = Date.now();
  podar(HITS, now, WINDOW_MS, MAX_CLAVES);
```

- [ ] **Step 2: Rate limit en el newsletter y fuera los imports sin uso**

En `src/app/actions/newsletter.ts`, reemplazar:

```ts
import { BRAND } from '@/lib/brand';
import { sendMail } from '@/lib/mail';
```

por:

```ts
import { rateLimited } from '@/lib/submissions';
```

y reemplazar:

```ts
  const { firstName, email } = parsed.data;
  const webhook = process.env.NEWSLETTER_SHEETS_WEBHOOK_URL;
```

por:

```ts
  if (await rateLimited()) {
    return {
      status: 'error',
      message: 'That is a few sign-ups in a short while. Give it ten minutes and try again.',
    };
  }

  const { firstName, email } = parsed.data;
  const webhook = process.env.NEWSLETTER_SHEETS_WEBHOOK_URL;
```

- [ ] **Step 3: Verificar**

Run: `npm run test:seguridad && npx tsc --noEmit && npm run build`
Expected: tests PASS, sin errores de tipos ni de build.

- [ ] **Step 4: Commit**

```bash
git add src/app/actions/newsletter.ts src/lib/submissions.ts
git commit -m "El newsletter pasa por el rate limit como los otros formularios, y el limitador deja de crecer sin tope"
```

---

### Task 3: Largos máximos en los schemas

**Files:**
- Modify: `src/lib/schemas/contact.ts`
- Modify: `src/lib/schemas/event-inquiry.ts`
- Modify: `src/lib/schemas/join.ts`
- Modify: `src/lib/schemas/market-vendor.ts`
- Modify: `src/app/actions/newsletter.ts` (su schema interno)

**Interfaces:** ninguna nueva; los tipos inferidos no cambian.

Mensajes a usar (en inglés, sin em dash):
- Nombres: `'Keep this under 100 characters.'`
- Email: `'That email is too long.'`
- Teléfono: `'That phone number is too long.'`
- Campos de 200: `'Keep this under 200 characters.'`

- [ ] **Step 1: `contact.ts`**

- `name: z.string().trim().min(2, 'Enter your name so we know who is writing.'),` → agregar `.max(100, 'Keep this under 100 characters.')` antes de la coma final.
- `email: z.string().trim().email('Enter a valid email.'),` → agregar `.max(254, 'That email is too long.')` antes de la coma final.
- En el bloque `phone: z .string() .trim()`, después de la línea `.trim()` insertar la línea `    .max(30, 'That phone number is too long.')`, con la misma indentación que `.trim()`.

- [ ] **Step 2: `event-inquiry.ts`**

- `name` → `.max(100, 'Keep this under 100 characters.')`
- `email` → `.max(254, 'That email is too long.')`
- En `phone`, después de `.trim()` insertar `.max(30, 'That phone number is too long.')`.
- `startTime: z.string().trim().optional().default(''),` → `startTime: z.string().trim().max(200, 'Keep this under 200 characters.').optional().default(''),`
- `endTime`: el mismo cambio.

- [ ] **Step 3: `join.ts`**

- `const nombre = (campo: string) => z.string().trim().min(2, \`Enter your ${campo}.\`);` → agregar `.max(100, 'Keep this under 100 characters.')` antes del `;`.
- `const mail = z.string().trim().email('Enter a valid email.');` → agregar `.max(254, 'That email is too long.')` antes del `;`.
- En `const telefono = z .string() .trim()`, después de `.trim()` insertar `.max(30, 'That phone number is too long.')`.
- `position`, `address`, `cityState` y `startDate`: agregar `.max(200, 'Keep this under 200 characters.')` después del `.min(...)`.

- [ ] **Step 4: `market-vendor.ts`**

- `business`, `dates` → `.max(200, 'Keep this under 200 characters.')` después del `.min(...)`.
- `name` → `.max(100, 'Keep this under 100 characters.')`.
- `email` → `.max(254, 'That email is too long.')`.
- En `phone`, después de `.trim()` insertar `.max(30, 'That phone number is too long.')`.

- [ ] **Step 5: `newsletter.ts`**

```ts
  firstName: z.string().trim().min(2, 'Enter your first name.').max(100, 'Keep this under 100 characters.'),
  email: z.string().trim().email('Enter a valid email.').max(254, 'That email is too long.'),
```

- [ ] **Step 6: Verificar que no quedó ningún campo de texto libre sin tope**

Run:

```bash
for f in src/lib/schemas/*.ts src/app/actions/newsletter.ts; do grep -nE "z\.string\(\)\.trim\(\)\.(min|email)" "$f" | grep -v "\.max("; done
```

Expected: sin salida.

Run: `npx tsc --noEmit && npm run build`
Expected: sin errores.

- [ ] **Step 7: Commit**

```bash
git add src/lib/schemas src/app/actions/newsletter.ts
git commit -m "Todos los campos de texto libre de los formularios tienen largo máximo, en el cliente y en el servidor"
```

---

### Task 4: Firma real de los adjuntos y adjuntar lo validado

**Files:**
- Create: `src/lib/file-signature.ts`
- Modify: `src/lib/seguridad.test.ts` (tests de firmas)
- Modify: `src/app/actions/join.ts` (`adjuntos`, `submitJob`, `submitArtist`)
- Modify: `src/lib/submissions.ts` (`fileToAttachment` con `nombreSeguro`)

**Interfaces:**
- Consumes: `nombreSeguro` (Task 1).
- Produces: `firmaCoincide(bytes: Uint8Array, mime: string): boolean`

- [ ] **Step 1: Escribir los tests que fallan**

En `src/lib/seguridad.test.ts`, agregar al bloque de imports:

```ts
import { firmaCoincide } from './file-signature.ts';
```

y al final del archivo:

```ts
const b = (...xs: number[]) => new Uint8Array([...xs, ...new Array(16).fill(0)]);
const ascii = (s: string) => [...s].map((c) => c.charCodeAt(0));
const DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

describe('firmaCoincide', () => {
  it('PDF', () => {
    assert.ok(firmaCoincide(b(...ascii('%PDF-1.7')), 'application/pdf'));
    assert.ok(!firmaCoincide(b(...ascii('hola mundo')), 'application/pdf'));
  });
  it('DOCX (ZIP)', () => {
    assert.ok(firmaCoincide(b(0x50, 0x4b, 0x03, 0x04), DOCX));
    assert.ok(!firmaCoincide(b(...ascii('%PDF-1.7')), DOCX));
  });
  it('DOC (OLE)', () => {
    assert.ok(firmaCoincide(b(0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1), 'application/msword'));
    assert.ok(!firmaCoincide(b(0x50, 0x4b, 0x03, 0x04), 'application/msword'));
  });
  it('JPEG', () => {
    assert.ok(firmaCoincide(b(0xff, 0xd8, 0xff, 0xe0), 'image/jpeg'));
    assert.ok(!firmaCoincide(b(0x89, 0x50, 0x4e, 0x47), 'image/jpeg'));
  });
  it('PNG', () => {
    assert.ok(firmaCoincide(b(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a), 'image/png'));
    assert.ok(!firmaCoincide(b(0xff, 0xd8, 0xff), 'image/png'));
  });
  it('WebP', () => {
    assert.ok(firmaCoincide(b(...ascii('RIFF'), 0, 0, 0, 0, ...ascii('WEBP')), 'image/webp'));
    assert.ok(!firmaCoincide(b(...ascii('RIFF'), 0, 0, 0, 0, ...ascii('WAVE')), 'image/webp'));
  });
  it('AVIF', () => {
    assert.ok(firmaCoincide(b(0, 0, 0, 0x20, ...ascii('ftypavif')), 'image/avif'));
    assert.ok(firmaCoincide(b(0, 0, 0, 0x20, ...ascii('ftypavis')), 'image/avif'));
    assert.ok(!firmaCoincide(b(0, 0, 0, 0x20, ...ascii('ftypheic')), 'image/avif'));
  });
  it('un tipo desconocido nunca coincide', () => {
    assert.ok(!firmaCoincide(b(...ascii('%PDF-1.7')), 'text/plain'));
  });
  it('un archivo más corto que la firma no coincide', () => {
    assert.ok(!firmaCoincide(new Uint8Array([0x25, 0x50]), 'application/pdf'));
  });
});
```

- [ ] **Step 2: Correr los tests y ver que fallan**

Run: `npm run test:seguridad`
Expected: FAIL con `ERR_MODULE_NOT_FOUND` para `file-signature.ts`.

- [ ] **Step 3: Implementar `file-signature.ts`**

Crear `src/lib/file-signature.ts`:

```ts
const empieza = (b: Uint8Array, firma: readonly number[], desde = 0): boolean =>
  b.length >= desde + firma.length && firma.every((x, i) => b[desde + i] === x);

const ascii = (s: string): number[] => [...s].map((c) => c.charCodeAt(0));

const FIRMAS: Readonly<Record<string, (b: Uint8Array) => boolean>> = {
  'application/pdf': (b) => empieza(b, ascii('%PDF')),
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': (b) =>
    empieza(b, [0x50, 0x4b, 0x03, 0x04]),
  'application/msword': (b) => empieza(b, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]),
  'image/jpeg': (b) => empieza(b, [0xff, 0xd8, 0xff]),
  'image/png': (b) => empieza(b, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  'image/webp': (b) => empieza(b, ascii('RIFF')) && empieza(b, ascii('WEBP'), 8),
  'image/avif': (b) =>
    empieza(b, ascii('ftyp'), 4) && (empieza(b, ascii('avif'), 8) || empieza(b, ascii('avis'), 8)),
};

export function firmaCoincide(bytes: Uint8Array, mime: string): boolean {
  const regla = FIRMAS[mime];
  return regla ? regla(bytes) : false;
}
```

- [ ] **Step 4: Correr los tests y ver que pasan**

Run: `npm run test:seguridad`
Expected: PASS, 21 tests, 0 fallas.

- [ ] **Step 5: `fileToAttachment` con nombre seguro**

En `src/lib/submissions.ts`, cambiar el import a:

```ts
import { asuntoSeguro, nombreSeguro, podar } from './saneo';
```

y en `fileToAttachment` reemplazar:

```ts
    filename: f.name || 'attachment',
```

por:

```ts
    filename: nombreSeguro(f.name),
```

- [ ] **Step 6: Adjuntar desde lo validado y verificar la firma en `join.ts`**

En `src/app/actions/join.ts`, agregar al bloque de imports:

```ts
import { firmaCoincide } from '@/lib/file-signature';
```

Reemplazar la función `adjuntos` entera por estas dos:

```ts
async function adjuntos(
  campos: readonly { readonly file: File | undefined; readonly prefijo: string }[],
): Promise<MailAttachment[]> {
  const out: MailAttachment[] = [];
  for (const c of campos) {
    const a = await fileToAttachment(c.file);
    if (a) out.push({ ...a, filename: `${c.prefijo} ${a.filename}` });
  }
  return out;
}

async function revisarFirmas(
  campos: readonly {
    readonly name: string;
    readonly file: File | undefined;
    readonly etiqueta: string;
    readonly formato: string;
  }[],
): Promise<Record<string, string>> {
  const errores: Record<string, string> = {};
  for (const c of campos) {
    if (!c.file || c.file.size === 0) continue;
    const cabeza = new Uint8Array(await c.file.slice(0, 16).arrayBuffer());
    if (!firmaCoincide(cabeza, c.file.type)) {
      errores[c.name] = `${c.etiqueta} doesn't look like ${c.formato}.`;
    }
  }
  return errores;
}
```

En `submitJob`, justo después del bloque `if (!parsed.success) { ... }` (antes de `const venue = await getVenue();`), insertar:

```ts
  const firmas = await revisarFirmas([
    {
      name: 'resume',
      file: parsed.data.resume,
      etiqueta: 'Your resume',
      formato: 'a PDF or a Word document',
    },
  ]);
  if (Object.keys(firmas).length > 0) {
    return {
      status: 'error',
      message: 'Some fields need another look before this can go out.',
      fieldErrors: firmas,
    };
  }
```

y reemplazar:

```ts
  const archivos = await adjuntos(formData, [{ name: 'resume', prefijo: 'Resume' }]);
```

por:

```ts
  const archivos = await adjuntos([{ file: d.resume, prefijo: 'Resume' }]);
```

En `submitArtist`, justo después de su bloque `if (!parsed.success) { ... }`, insertar:

```ts
  const firmas = await revisarFirmas([
    { name: 'logo', file: parsed.data.logo, etiqueta: 'Your logo', formato: 'an image' },
    { name: 'photo', file: parsed.data.photo, etiqueta: 'Your photo', formato: 'an image' },
  ]);
  if (Object.keys(firmas).length > 0) {
    return {
      status: 'error',
      message: 'Some fields need another look before this can go out.',
      fieldErrors: firmas,
    };
  }
```

y reemplazar:

```ts
  const archivos = await adjuntos(formData, [
    { name: 'logo', prefijo: 'Logo' },
    { name: 'photo', prefijo: 'Photo' },
  ]);
```

por:

```ts
  const archivos = await adjuntos([
    { file: d.logo, prefijo: 'Logo' },
    { file: d.photo, prefijo: 'Photo' },
  ]);
```

Si después de estos cambios `formData` queda sin uso en alguna de las dos actions, se deja igual: es parte de la firma que exige `useActionState`.

- [ ] **Step 7: Verificar y commitear**

Run: `npm run test:seguridad && npx tsc --noEmit && npm run build`
Expected: tests PASS, sin errores.

```bash
git add src/lib/file-signature.ts src/lib/seguridad.test.ts src/app/actions/join.ts src/lib/submissions.ts
git commit -m "Los adjuntos se verifican por su contenido real, salen de lo validado y con el nombre saneado"
```

---

### Task 5: Timeouts en las llamadas externas

**Files:**
- Create: `src/lib/http.ts`
- Modify: `src/lib/seguridad.test.ts` (tests de `fetchConTimeout` y `conTimeout`)
- Modify: `src/lib/restoexp.ts` (`query`)
- Modify: `src/lib/blog.ts` (`readFeed`)
- Modify: `src/lib/mail.ts` (`sendMail`)

**Interfaces:**
- Produces:
  - `fetchConTimeout(url: string, init?: RequestInit, opciones?: { ms?: number; reintentos?: number }): Promise<Response>`
  - `conTimeout<T>(promesa: Promise<T>, ms: number): Promise<T>`

- [ ] **Step 1: Escribir los tests que fallan**

En `src/lib/seguridad.test.ts`, agregar a los imports:

```ts
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { conTimeout, fetchConTimeout } from './http.ts';
```

y al final del archivo:

```ts
function servidor(responder: (n: number, metodo: string) => { status: number; demoraMs?: number }) {
  let n = 0;
  const server: Server = createServer((req, res) => {
    n += 1;
    const { status, demoraMs = 0 } = responder(n, req.method ?? 'GET');
    setTimeout(() => {
      res.statusCode = status;
      res.end('ok');
    }, demoraMs);
  });
  return new Promise<{ url: string; llamadas: () => number; cerrar: () => void }>((resolve) => {
    server.listen(0, () => {
      const { port } = server.address() as AddressInfo;
      resolve({
        url: `http://127.0.0.1:${port}/`,
        llamadas: () => n,
        cerrar: () => server.close(),
      });
    });
  });
}

describe('fetchConTimeout', () => {
  it('devuelve la respuesta sin reintentar si sale bien', async () => {
    const s = await servidor(() => ({ status: 200 }));
    const res = await fetchConTimeout(s.url);
    assert.equal(res.status, 200);
    assert.equal(s.llamadas(), 1);
    s.cerrar();
  });
  it('reintenta una vez ante un 5xx en GET', async () => {
    const s = await servidor((n) => ({ status: n === 1 ? 503 : 200 }));
    const res = await fetchConTimeout(s.url);
    assert.equal(res.status, 200);
    assert.equal(s.llamadas(), 2);
    s.cerrar();
  });
  it('devuelve el 5xx si el último intento también falla', async () => {
    const s = await servidor(() => ({ status: 500 }));
    const res = await fetchConTimeout(s.url);
    assert.equal(res.status, 500);
    assert.equal(s.llamadas(), 2);
    s.cerrar();
  });
  it('no reintenta un 4xx', async () => {
    const s = await servidor(() => ({ status: 404 }));
    const res = await fetchConTimeout(s.url);
    assert.equal(res.status, 404);
    assert.equal(s.llamadas(), 1);
    s.cerrar();
  });
  it('no reintenta un POST aunque dé 5xx', async () => {
    const s = await servidor(() => ({ status: 503 }));
    const res = await fetchConTimeout(s.url, { method: 'POST' });
    assert.equal(res.status, 503);
    assert.equal(s.llamadas(), 1);
    s.cerrar();
  });
  it('corta por timeout y tira si todos los intentos se cuelgan', async () => {
    const s = await servidor(() => ({ status: 200, demoraMs: 500 }));
    await assert.rejects(fetchConTimeout(s.url, {}, { ms: 100 }));
    assert.equal(s.llamadas(), 2);
    s.cerrar();
  });
});

describe('conTimeout', () => {
  it('resuelve si la promesa llega a tiempo', async () => {
    assert.equal(await conTimeout(Promise.resolve(7), 100), 7);
  });
  it('rechaza si la promesa tarda más que el límite', async () => {
    const lenta = new Promise((r) => setTimeout(() => r('tarde'), 300));
    await assert.rejects(conTimeout(lenta, 50), /timeout/);
  });
});
```

- [ ] **Step 2: Correr los tests y ver que fallan**

Run: `npm run test:seguridad`
Expected: FAIL con `ERR_MODULE_NOT_FOUND` para `http.ts`.

- [ ] **Step 3: Implementar `http.ts`**

Crear `src/lib/http.ts`:

```ts
export async function fetchConTimeout(
  url: string,
  init: RequestInit = {},
  { ms = 5000, reintentos = 1 }: { ms?: number; reintentos?: number } = {},
): Promise<Response> {
  const metodo = (init.method ?? 'GET').toUpperCase();
  const intentos = metodo === 'GET' ? reintentos + 1 : 1;
  let ultimoError: unknown = new Error(`fetch sin intentos: ${url}`);
  for (let i = 0; i < intentos; i += 1) {
    try {
      const res = await fetch(url, { ...init, signal: AbortSignal.timeout(ms) });
      if (res.status >= 500 && i < intentos - 1) continue;
      return res;
    } catch (error) {
      ultimoError = error;
    }
  }
  throw ultimoError;
}

export function conTimeout<T>(promesa: Promise<T>, ms: number): Promise<T> {
  let reloj: ReturnType<typeof setTimeout> | undefined;
  const limite = new Promise<never>((_, rechazar) => {
    reloj = setTimeout(() => rechazar(new Error(`timeout de ${ms} ms`)), ms);
  });
  return Promise.race([promesa, limite]).finally(() => clearTimeout(reloj));
}
```

- [ ] **Step 4: Correr los tests y ver que pasan**

Run: `npm run test:seguridad`
Expected: PASS, 29 tests, 0 fallas.

- [ ] **Step 5: Supabase con timeout**

En `src/lib/restoexp.ts`, agregar al bloque de imports:

```ts
import { fetchConTimeout } from './http';
```

y en `query()` reemplazar:

```ts
    const res = await fetch(`${URL_BASE}/rest/v1/${path}`, {
```

por:

```ts
    const res = await fetchConTimeout(`${URL_BASE}/rest/v1/${path}`, {
```

- [ ] **Step 6: Feed del blog con timeout**

En `src/lib/blog.ts`, agregar al bloque de imports:

```ts
import { fetchConTimeout } from './http';
```

y en `readFeed` reemplazar:

```ts
  const res = await fetch(url, {
```

por:

```ts
  const res = await fetchConTimeout(url, {
```

- [ ] **Step 7: Resend con timeout y sin reintento**

En `src/lib/mail.ts`, agregar al bloque de imports:

```ts
import { conTimeout } from './http';
```

debajo de los imports agregar:

```ts
const TIMEOUT_MAIL_MS = 10_000;
```

y reemplazar:

```ts
    const { error } = await resend.emails.send({
```

por:

```ts
    const { error } = await conTimeout(resend.emails.send({
```

Después cerrar la llamada: en la línea `    });` que cierra el objeto de `resend.emails.send`, justo antes de `if (error) {`, reemplazarla por:

```ts
    }), TIMEOUT_MAIL_MS);
```

Un timeout cae en el `catch` que ya existe, que loguea y devuelve `ok: false`.

- [ ] **Step 8: Verificar y commitear**

Run: `npm run test:seguridad && npx tsc --noEmit && npm run build`
Expected: tests PASS, sin errores. El build hace fetch reales a Supabase y al feed: tienen que seguir funcionando (las páginas se generan igual que antes).

```bash
git add src/lib/http.ts src/lib/seguridad.test.ts src/lib/restoexp.ts src/lib/blog.ts src/lib/mail.ts
git commit -m "Supabase, el feed del blog y Resend tienen timeout; las lecturas reintentan una vez y el mail nunca"
```

---

### Task 6: Aviso de variables de entorno al arrancar

**Files:**
- Create: `src/instrumentation.ts`
- Modify: `.env.example`

- [ ] **Step 1: Crear `src/instrumentation.ts`**

```ts
const REQUERIDAS = [
  'RESEND_API_KEY',
  'RESEND_FROM',
  'MAIL_TO_CONTACT',
  'MAIL_TO_EVENTS',
  'MAIL_TO_CAREERS',
  'MAIL_TO_MARKET',
  'MAIL_TO_BOOKING',
  'NEWSLETTER_SHEETS_WEBHOOK_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SUPABASE_RESTAURANT_ID',
  'BLOG_FEED_ORIGIN',
  'BLOG_RESTAURANT_ID',
] as const;

export function register(): void {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const faltan = REQUERIDAS.filter((nombre) => !process.env[nombre]);
  if (faltan.length > 0) {
    console.warn(`[env] Faltan variables: ${faltan.join(', ')}. El sitio arranca igual con sus respaldos.`);
  }
}
```

- [ ] **Step 2: Corregir `.env.example`**

Reemplazar el bloque:

```
# ── Sitio ─────────────────────────────────────────────────────────────────
NEXT_PUBLIC_SITE_URL=
```

por:

```
# ── Blog ──────────────────────────────────────────────────────────────────
# El feed público del dashboard. Si faltan, `lib/blog.ts` usa
# https://app.restoexp.com y NEXT_PUBLIC_SUPABASE_RESTAURANT_ID.
BLOG_FEED_ORIGIN=
BLOG_RESTAURANT_ID=
```

- [ ] **Step 3: Verificar**

Run: `npx tsc --noEmit && npm run build`
Expected: sin errores. Después, `npx next start -p 3457` y mirar la salida: si falta alguna variable del `.env.local` (por ejemplo `NEWSLETTER_SHEETS_WEBHOOK_URL`, que hoy no existe), aparece la línea `[env] Faltan variables: ...` y el server contesta 200 en `/`. Matar el server al terminar (en Windows: `netstat -ano | grep :3457` y `Stop-Process -Id <pid> -Force`).

- [ ] **Step 4: Commit**

```bash
git add src/instrumentation.ts .env.example
git commit -m "El server avisa al arrancar qué variables de entorno faltan, y .env.example lista las que el código usa"
```

---

### Task 7: Verificación de punta a punta en el navegador

**Files:**
- Create (temporal, se borra al terminar): `_e2e-seguridad.mjs` en la raíz del repo (Playwright solo resuelve desde ahí).

- [ ] **Step 1: Levantar el dev server sin mails reales**

```bash
MAIL_TO_CONTACT=delivered@resend.dev MAIL_TO_EVENTS=delivered@resend.dev MAIL_TO_CAREERS=delivered@resend.dev MAIL_TO_MARKET=delivered@resend.dev MAIL_TO_BOOKING=delivered@resend.dev npx next dev -p 3458
```

Leer el log y confirmar el puerto que anuncia: en esta máquina el 3000 lo usa otro proyecto.

- [ ] **Step 2: Tanda A, newsletter (con el server recién levantado)**

Con Playwright, en `http://localhost:3458/`, completar el formulario del newsletter del footer (nombre `Test`, email `test@example.com`) y enviarlo 6 veces seguidas.
Expected: los 5 primeros envíos muestran `Sign-up isn’t live yet...` (el webhook no existe todavía) y el sexto muestra `That is a few sign-ups in a short while...`.

- [ ] **Step 3: Reiniciar el dev server**

El rate limit es global por IP y en memoria: matar el server y levantarlo de nuevo con el mismo comando del Step 1.

- [ ] **Step 4: Tanda B, rechazos**

- En `/join-us`, carril de trabajo: adjuntar como resume un archivo de texto renombrado `falso.pdf` con tipo `application/pdf` y completar el resto de los campos obligatorios con datos válidos. Expected: el error de campo `Your resume doesn't look like a PDF or a Word document.`, y ningún mail enviado.
- En `/contact`: escribir un nombre de 101 caracteres y enviar. Expected: el error `Keep this under 100 characters.` en el campo, visible antes de cualquier envío.

- [ ] **Step 5: Tanda B, envíos válidos**

Enviar con datos válidos, cada uno una vez: `/contact`, la consulta de `/events`, el carril de trabajo de `/join-us` con un PDF real (generarlo con los bytes `%PDF-1.4` y un cuerpo mínimo) y la solicitud de `/market`. Son 4 envíos, por debajo del cupo de 5.
Expected: los cuatro muestran su mensaje de éxito de siempre, y el log del dev server muestra una línea `mail.sent` por cada uno con destino `delivered@resend.dev`.

- [ ] **Step 6: Consola limpia y cierre**

Durante toda la tanda, ningún error de consola nuevo ni de hidratación. Matar el dev server, borrar `_e2e-seguridad.mjs` y confirmar `git status` sin archivos sueltos.

- [ ] **Step 7: Build final**

Run: `npm run test:seguridad && npx tsc --noEmit && npm run build`
Expected: todo en verde. Esta task no genera commit propio.
