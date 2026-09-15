import 'server-only';
import { headers } from 'next/headers';

/**
 * El punto único por donde sale TODO envío de formulario del sitio.
 *
 * ⚠️ EL DESTINO REAL TODAVÍA NO ESTÁ DEFINIDO. Hoy esto registra el envío de
 * forma estructurada y devuelve ok. Cuando se decida (Resend a un buzón, un
 * CRM, el dashboard de RestoExp), se enchufa ACÁ y ningún formulario se entera.
 *
 * Por qué una función y no `sendMail` directo en cada action: `lib/mail.ts`
 * manda un mail y nada más. Un envío de formulario es otra cosa — puede querer
 * ir a dos lados, guardarse, o disparar un aviso — y si cada action llama a
 * `sendMail` a mano, cambiar de destino significa tocar cinco archivos.
 */

export interface Submission {
  /** Qué formulario. Es la clave por la que se va a rutear después. */
  readonly form: 'contact' | 'event-inquiry' | 'market-vendor' | 'musician' | 'job';
  /** Los campos ya validados. Nunca el FormData crudo. */
  readonly data: Readonly<Record<string, string>>;
  /** A dónde debería ir, cuando haya a dónde. */
  readonly to: string;
  /** Para poder responder apretando «responder». */
  readonly replyTo?: string;
  readonly subject: string;
}

export interface SubmissionResult {
  readonly ok: boolean;
  /** Mensaje para la persona. Nunca detalles del proveedor. */
  readonly message: string;
}

/**
 * Rate limit básico, en memoria.
 *
 * ⚠️ ES POR INSTANCIA, no global. En Fluid Compute las instancias se reusan
 * entre requests, así que en la práctica frena el caso real —alguien apretando
 * enviar veinte veces— pero no un ataque distribuido. Para eso va el WAF, no
 * esto.
 *
 * TODO: confirmar con cliente si el volumen justifica mover esto a un store
 * compartido. Con el tráfico de hoy no lo justifica.
 */
const HITS = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

async function clientKey(): Promise<string> {
  const h = await headers();
  // `x-forwarded-for` en Vercel trae la IP real primero.
  const fwd = h.get('x-forwarded-for');
  return (fwd ? fwd.split(',')[0]!.trim() : null) ?? h.get('x-real-ip') ?? 'unknown';
}

export async function rateLimited(): Promise<boolean> {
  const key = await clientKey();
  const now = Date.now();
  const recent = (HITS.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    HITS.set(key, recent);
    return true;
  }
  recent.push(now);
  HITS.set(key, recent);
  return false;
}

export async function sendSubmission(s: Submission): Promise<SubmissionResult> {
  /*
   * TODO: confirmar con cliente a qué buzón va cada formulario y enchufar el
   * envío real. Mientras tanto queda el registro estructurado, que es lo que
   * permite verificar en el log de Vercel que un envío llegó al servidor.
   */
  console.info(
    JSON.stringify({
      at: new Date().toISOString(),
      event: 'form.submission',
      form: s.form,
      to: s.to,
      replyTo: s.replyTo ?? null,
      subject: s.subject,
      fields: Object.keys(s.data),
      data: s.data,
    }),
  );

  return { ok: true, message: 'Thanks. Your message is in.' };
}
