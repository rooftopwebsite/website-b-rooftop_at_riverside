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

/** Un adjunto ya leído a memoria. Ver `fileToAttachment` en `submissions.ts`. */
export interface MailAttachment {
  readonly filename: string;
  readonly content: Buffer;
  readonly contentType?: string;
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
  attachments,
}: {
  /** Uno o varios buzones. Ver `lib/inboxes.ts`. */
  readonly to: string | readonly string[];
  readonly subject: string;
  /** Texto plano. Sin HTML: estos son mails internos, no una campaña. */
  readonly text: string;
  readonly replyTo?: string;
  readonly attachments?: readonly MailAttachment[];
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
      to: typeof to === 'string' ? [to] : [...to],
      subject,
      text,
      ...(replyTo ? { replyTo } : {}),
      ...(attachments && attachments.length > 0
        ? {
            attachments: attachments.map((a) => ({
              filename: a.filename,
              content: a.content,
              ...(a.contentType ? { contentType: a.contentType } : {}),
            })),
          }
        : {}),
    });

    if (error) {
      console.error('[mail] Resend devolvió error:', error);
      return {
        ok: false,
        message: 'We could not send your message right now. Please email us directly.',
      };
    }

    /*
     * ⚠️ SE LOGUEA EL DESTINO Y NO EL CONTENIDO. Es lo que permite contestar
     * «¿a dónde fue la consulta del sábado?» mirando el log de Vercel, sin
     * dejar datos personales de nadie escritos en él.
     */
    console.info(JSON.stringify({ event: 'mail.sent', to, subject: subject.slice(0, 80) }));
    return { ok: true, message: 'Sent.' };
  } catch (err) {
    console.error('[mail] Excepción al enviar:', err);
    return {
      ok: false,
      message: 'We could not send your message right now. Please email us directly.',
    };
  }
}
