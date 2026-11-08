'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { confirmNewsletter } from '@/app/actions/newsletter';
import type { ActionState } from '@/app/actions/types';
import { Button, ButtonLink } from './Button';

const INITIAL: ActionState = { status: 'idle', message: '' };

function ConfirmButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" size="lg" disabled={pending}>
      {pending ? 'Confirming…' : 'Confirm my subscription'}
    </Button>
  );
}

export default function NewsletterConfirm({ token }: { readonly token: string }) {
  const [state, action] = useActionState(confirmNewsletter, INITIAL);

  if (state.status === 'ok') {
    return (
      <div className="mt-gap-cta">
        <p role="status" className="m-0 font-body text-lead text-ink">
          {state.message}
        </p>
        <div className="mt-gap-cta">
          <ButtonLink href="/whats-on" variant="primary" size="lg">
            See what&rsquo;s on
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="mt-gap-cta flex flex-col items-start gap-4">
      <input type="hidden" name="token" value={token} />
      <ConfirmButton />
      <p aria-live="polite" className="m-0 font-body text-data text-ink">
        {state.status === 'error' ? state.message : ''}
      </p>
    </form>
  );
}
