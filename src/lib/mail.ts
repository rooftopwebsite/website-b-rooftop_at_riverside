import 'server-only';
import { fetchWithTimeout } from './http';

const TIMEOUT_MAIL_MS = 10_000;
const MAILJET_SEND_URL = 'https://api.mailjet.com/v3.1/send';
const FROM = { Email: 'info@eatdrinkparadise.com', Name: 'Rooftop at Riverside' } as const;
const FAILED = 'We could not send your message right now. Please email us directly.';

export function mailjetAuth(): string | null {
  const key = process.env.MAILJET_API_KEY;
  const secret = process.env.MAILJET_SECRET_KEY;
  if (!key || !secret) return null;
  return Buffer.from(`${key}:${secret}`).toString('base64');
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

interface MailjetResponse {
  readonly Messages?: readonly {
    readonly Status?: string;
    readonly Errors?: readonly { readonly ErrorMessage?: string }[];
  }[];
  readonly ErrorMessage?: string;
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
  const auth = mailjetAuth();

  if (!auth) {
    console.error('[mail] MAILJET_API_KEY or MAILJET_SECRET_KEY not configured; nothing was sent.');
    return { ok: false, message: FAILED };
  }

  const recipients = typeof to === 'string' ? [to] : [...to];

  try {
    const res = await fetchWithTimeout(
      MAILJET_SEND_URL,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Messages: [
            {
              From: FROM,
              To: recipients.map((Email) => ({ Email })),
              Subject: subject,
              TextPart: text,
              ...(replyTo ? { ReplyTo: { Email: replyTo } } : {}),
              ...(attachments && attachments.length > 0
                ? {
                    Attachments: attachments.map((a) => ({
                      ContentType: a.contentType || 'application/octet-stream',
                      Filename: a.filename,
                      Base64Content: a.content.toString('base64'),
                    })),
                  }
                : {}),
            },
          ],
        }),
      },
      { ms: TIMEOUT_MAIL_MS },
    );

    const payload = (await res.json().catch(() => null)) as MailjetResponse | null;
    const status = payload?.Messages?.[0]?.Status;

    if (!res.ok || status !== 'success') {
      console.error('[mail] Mailjet returned an error:', res.status, JSON.stringify(payload));
      return { ok: false, message: FAILED };
    }

    console.info(JSON.stringify({ event: 'mail.sent', to, subject: subject.slice(0, 80) }));
    return { ok: true, message: 'Sent.' };
  } catch (err) {
    console.error('[mail] Exception while sending:', err);
    return { ok: false, message: FAILED };
  }
}
