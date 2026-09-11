import fs from 'node:fs/promises';

/**
 * Baja los eventos del dashboard y los escribe en `src/content/events.json`.
 *
 *   npm run sync:events
 *
 * ⚠️ POR QUÉ ESTO Y NO UN FETCH EN TIEMPO DE EJECUCIÓN.
 * La API del dashboard (`app.restoexp.com/api/...`) exige sesión: sin cookie
 * devuelve 401, y no existe endpoint público ni forma de emitir una API key
 * desde el panel (verificado el 2026-09-08). Así que el sitio no puede pedirle
 * los eventos en cada request.
 *
 * El arreglo mientras tanto: el dashboard sigue siendo la ÚNICA fuente de
 * verdad —los eventos se cargan y editan ahí, no en el código— y este script
 * los baja a un JSON versionado que el build consume. Cargás el calendario del
 * mes el día 10, corrés esto, y deploy.
 *
 * ⚠️ Cuando la plataforma exponga lectura pública o emita API keys, esto se
 * reemplaza por un fetch con `revalidate` y el JSON desaparece. El resto del
 * sitio no cambia: ya lee a través de `content/events.ts`, que es el adaptador.
 *
 * CÓMO AUTENTICAR HOY: pegá la cookie de sesión del dashboard en
 * `RESTOEXP_COOKIE` dentro de `.env.local` (DevTools → Application → Cookies).
 */

const RESTAURANT_ID = 'b726bcd3-1167-4b09-ba64-39e79bbef141';
const API = `https://app.restoexp.com/api/restaurants/${RESTAURANT_ID}/events?scope=all`;
const OUT = 'src/content/events.json';

const cookie = process.env.RESTOEXP_COOKIE;
if (!cookie) {
  console.error(
    'Falta RESTOEXP_COOKIE.\n' +
      'Pegá la cookie de sesión de app.restoexp.com en .env.local y volvé a correr.\n' +
      `El archivo ${OUT} queda como está.`,
  );
  process.exit(1);
}

const res = await fetch(API, { headers: { cookie, accept: 'application/json' } });

if (!res.ok) {
  console.error(`La API respondió ${res.status}. ${res.status === 401 ? 'La cookie venció.' : ''}`);
  process.exit(1);
}

const body = await res.json();
const rows = body.data ?? body;

// Sólo lo publicado, y sólo los campos que el sitio usa. Guardar la respuesta
// entera metería `createdAt`/`updatedAt` y el diff cambiaría en cada sync.
const clean = rows
  .filter((e) => e.status === 'published')
  .map((e) => ({
    id: e.id,
    title: e.title,
    description: e.description ?? '',
    /*
     * ⚠️ `bannerUrl` ENTRA EN EL SYNC desde el 2026-09-11, y con él muere el
     * mapa manual de imágenes que vivía en `content/events.ts`.
     *
     * El campo existía en la tabla desde siempre —estaba en `null` en los
     * cuatro eventos— y este script simplemente no lo bajaba. O sea que el
     * sitio no tenía forma de mostrar la imagen de un evento aunque el
     * cliente la cargara, y por eso se había armado un mapa slug → archivo
     * a mano. Eso ya no hace falta: quien sube la pieza al dashboard la ve
     * publicada en el sitio con el próximo `npm run sync:events`.
     *
     * Apunta al storage de Supabase (`/restaurant-assets/restaurants/<id>/
     * events/...webp`) y es público, así que `next/image` lo sirve sin
     * credenciales. Requiere que el host esté en `remotePatterns` de
     * `next.config.ts`.
     */
    bannerUrl: e.bannerUrl ?? null,
    startDate: e.startDate,
    endDate: e.endDate ?? null,
    startTime: e.startTime,
    endTime: e.endTime ?? null,
    isRecurring: Boolean(e.isRecurring),
    recurrenceType: e.recurrenceType ?? null,
    recurrenceDays: e.recurrenceDays ?? null,
    price: e.price ?? null,
    tags: e.tags ?? [],
  }))
  .sort((a, b) => a.startDate.localeCompare(b.startDate) || a.startTime.localeCompare(b.startTime));

await fs.writeFile(OUT, `${JSON.stringify(clean, null, 2)}\n`, 'utf8');
console.log(`${clean.length} eventos publicados → ${OUT}`);
