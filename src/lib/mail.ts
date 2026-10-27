import 'server-only';
import { Resend } from 'resend';
import { withTimeout } from './http';

const TIMEOUT_MAIL_MS = 10_000;

function client(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export interface MailAttachment {
  readonly filename: string;
  readonly content: Buffer;
  readonly contentType?: string;
}

export interface MailResult {
  readonly ok: boolean;
  readonly message: string;
}

export async function sendMail({
  to,
  subject,
  text,
  replyTo,
  attachments,
}: {
  readonly to: string | readonly string[];
  readonly subject: string;
  readonly text: string;
  readonly replyTo?: string;
  readonly attachments?: readonly MailAttachment[];
}): Promise<MailResult> {
  const resend = client();
  const from = process.env.RESEND_FROM;

  if (!resend || !from) {
    console.error('[mail] RESEND_API_KEY or RESEND_FROM not configured; nothing was sent.');
    return {
      ok: false,
      message: 'We could not send your message right now. Please email us directly.',
    };
  }

  try {
    const { error } = await withTimeout(resend.emails.send({
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
    }), TIMEOUT_MAIL_MS);

    if (error) {
      console.error('[mail] Resend returned an error:', error);
      return {
        ok: false,
        message: 'We could not send your message right now. Please email us directly.',
      };
    }

    console.info(JSON.stringify({ event: 'mail.sent', to, subject: subject.slice(0, 80) }));
    return { ok: true, message: 'Sent.' };
  } catch (err) {
    console.error('[mail] Exception while sending:', err);
    return {
      ok: false,
      message: 'We could not send your message right now. Please email us directly.',
    };
  }
}
