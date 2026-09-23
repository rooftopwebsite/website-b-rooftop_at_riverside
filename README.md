# Rooftop at Riverside

Sitio de Rooftop at Riverside (Bonita Springs, FL): bar en la terraza sobre un
parque de food trucks. Reemplaza al sitio de Wix `eatdrinkparadise.com`.

Next.js 16 (App Router) · React 19 · Tailwind 4 · Vercel. Hecho por RestoExp.

## Arrancar

```bash
npm install
cp .env.example .env.local   # y completar lo que falte (ver abajo)
npm run dev
```

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` / `build` / `start` | Lo de siempre de Next |
| `npm run sync:events` | Trae los eventos del dashboard de RestoExp a `src/content/events.json`. Necesita `RESTOEXP_COOKIE` |
| `npm run events:verify` | Revisa que cada evento tenga su afiche y que dos eventos no compartan foto |
| `npm run events:banners` | Intenta igualar el afiche de todas las fechas de un mismo evento |
| `npm run media` | Genera las fotos y videos de `public/` desde `public/multimedia/` (originales, fuera de git) |
| `npm run og` | Genera las imágenes para compartir en redes (`public/og/`). El diseño original va en `_interno/og/` |
| `npm run media:import` | Baja las fotos del sitio viejo a `public/images/` |
| `npm run media:fetch-old-site` | Descarga todo el material publicado en el sitio vigente |
| `npm run media:photo-bank` | Arma el banco de fotos único, sin repetidas |
| `npm run greca` / `horizonte` | Regeneran dos piezas gráficas de marca |
| `npm run a11y` · `contrast` · `check:*` | Auditorías: accesibilidad, contraste, SEO, CSS, tokens, sombras, grano, ritmo de superficies y movimiento reducido |

Las auditorías que abren páginas necesitan el server corriendo. Por defecto
apuntan a `localhost:3157`; se cambia con `BASE=http://localhost:PUERTO`.

## Variables de entorno

La plantilla comentada es `.env.example`. En resumen:

- **`RESEND_API_KEY`**: variable compartida del team en Vercel. No se crea a
  nivel proyecto, porque la pisaría.
- **`RESEND_FROM`**: tiene que ser `@restoexp.com`, el único dominio
  verificado en Resend.
- **`MAIL_TO_CONTACT`, `MAIL_TO_EVENTS`, `MAIL_TO_CAREERS`, `MAIL_TO_MARKET`,
  `MAIL_TO_BOOKING`**: a qué buzón llega cada formulario. El ruteo está en
  `src/lib/inboxes.ts`.
- **`NEWSLETTER_SHEETS_WEBHOOK_URL`**: pendiente, la planilla todavía no existe.

## Dónde está cada cosa

```
src/app/            rutas; cada formulario tiene su server action en app/actions/
src/components/     form/ (campos compartidos), sections/ (bloques de página), shared/
src/content/        todo el texto y los datos del sitio, en TypeScript
src/lib/            venue, SEO, mail, schemas de formularios (lib/schemas/)
public/             sólo lo que se publica: fotos derivadas, videos, OG, PDFs
scripts/            generadores de medios y auditorías (ver tabla de arriba)
docs/               decisiones del proyecto e inventario del sitio viejo
design-audit/       capturas antes/después de la auditoría visual
_interno/           material del cliente y de trabajo. NO se versiona ni se publica
```

## Reglas que no se ven en el código

- **Material del cliente fuera de git.** PDFs, briefs, originales de foto y
  fuentes con licencia van a `_interno/`. `.gitignore` y `.vercelignore` lo
  tapan.
- **Nada de datos inventados.** Un hueco de contenido se marca con
  `<PhotoPending>`, `<PendingData>` o `<PendingBlock>` y se va solo cuando llega
  el dato.
- **Los 301 del sitio viejo no se tocan** sin revisar `next.config.ts` y
  `docs/current-site-inventory.md`.
- **No se corre Prettier:** el repo no lo usa y reescribiría cada archivo.
- El contexto del cliente vive en `docs/` (empezar por
  `docs/current-site-inventory.md` y `docs/pedido-al-cliente.md`).
