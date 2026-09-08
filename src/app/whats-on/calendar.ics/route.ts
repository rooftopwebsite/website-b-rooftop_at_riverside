import { buildICal } from '@/lib/calendar';

/**
 * `/whats-on/calendar.ics` — el calendario suscribible.
 *
 * Es un route handler y no un archivo estático para que se regenere cuando
 * cambia `content/events.ts`. Los recurrentes salen como RRULE, así que
 * Google Calendar y Apple los muestran como serie, no como cientos de sueltos.
 */
export async function GET() {
  return new Response(buildICal(), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="rooftop-at-riverside.ics"',
      // Una hora de caché: el calendario se carga en lote una vez al mes, así
      // que no hace falta más fresco que esto.
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
