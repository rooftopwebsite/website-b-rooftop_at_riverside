'use client';

import { useContext } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/shared/Button';
import { Ctx } from './context';

export function SubmitButton({ idle, busy }: { readonly idle: string; readonly busy: string }) {
  const ctx = useContext(Ctx);
  const { pending: native } = useFormStatus();
  const pending = ctx.pending || native;
  return (
    <Button
      type="submit"
      variant="primary"
      size="lg"
      disabled={pending}
      className={pending ? 'w-full disabled:opacity-85' : 'w-full'}
    >
      {pending ? (
        <>
          <span
            aria-hidden="true"
            className="size-[16px] shrink-0 rounded-full border-2 border-ink/25 border-t-ink motion-safe:animate-spin"
          />
          {busy}
        </>
      ) : (
        idle
      )}
    </Button>
  );
}
