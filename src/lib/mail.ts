import 'server-only';
import { Resend } from 'resend';

/**
 * Envío de mail con Resend.
 *
 * ⚠️ `server-only`: importar esto desde un componente cliente rompe el build a
 * propósito. Es la red que impide que la API key termine en el bundle del
 * navegador.
 *
 * La `RESEND_API_KEY` está como **shared env var en Vercel**, así que no vive
 * en el repo. En local va en `.env.local` (ignorado por git). Ver `.env.example`.
 */

/**
 * El cliente se crea POR LLAMADA y no a nivel de módulo.
 *
 * ⚠️ A nivel de módulo se instancia durante el build, cuando la env var puede
 * no estar, y el `new Resend(undefined)` tira. Acá se crea recién cuando hay
 * un envío real, que es cuando la key sí existe.
 */
function client(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export interface MailResult {
  readonly ok: boolean;
  /** Mensaje para mostrarle a la persona. Nunca expone detalles del proveedor. */
  readonly message: string;
}

export async function sendMail({
  to,
  subject,
  text,
  replyTo,
}: {
  readonly to: string;
  readonly subject: string;
  /** Texto plano. Sin HTML: estos son mails internos, no una campaña. */
  readonly text: string;
  readonly replyTo?: string;
}): Promise<MailResult> {
  const resend = client();
  const from = process.env.RESEND_FROM;

  if (!resend || !from) {
    // Sin credenciales no se finge un éxito: se avisa y se deja rastro en el log.
    console.error('[mail] RESEND_API_KEY o RESEND_FROM sin configurar; no se envió nada.');
    return {
      ok: false,
      message: 'We could not send your message right now. Please email us directly.',
    };
  }

  try {
    const { error } = await resend.emails.send({
      from,
      to: [to],
      subject,
      text,
      ...(replyTo ? { replyTo } : {}),
    });

    if (error) {
      console.error('[mail] Resend devolvió error:', error);
      return {
        ok: false,
        message: 'We could not send your message right now. Please email us directly.',
      };
    }

    return { ok: true, message: 'Sent.' };
  } catch (err) {
    console.error('[mail] Excepción al enviar:', err);
    return {
      ok: false,
      message: 'We could not send your message right now. Please email us directly.',
    };
  }
}
