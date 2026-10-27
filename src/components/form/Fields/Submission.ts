'use client';

import { useActionState, useState, useTransition } from 'react';
import { IDLE, type ActionState } from '@/app/actions/types';

export type FormAction = (prev: ActionState, fd: FormData) => Promise<ActionState>;

const OFFLINE =
  'You look offline, so nothing was sent. Your answers are still here: try again once you are back online.';
const NO_RESPONSE =
  'We could not reach our server, so nothing was sent. Your answers are still here: give it another try in a moment.';

export function useSubmission(action: FormAction) {
  const [ssr, formAction] = useActionState(action, IDLE);
  const [local, setLocal] = useState<ActionState | null>(null);
  const [pending, start] = useTransition();

  function submit(fd: FormData) {
    start(async () => {
      if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        setLocal({ status: 'error', message: OFFLINE });
        return;
      }
      try {
        const res = await action(IDLE, fd);
        setLocal(res);
      } catch (err) {
        console.error('[form] the submission did not reach the server:', err);
        setLocal({ status: 'error', message: NO_RESPONSE });
      }
    });
  }

  return { state: local ?? ssr, formAction, pending, submit } as const;
}

export type Submission = ReturnType<typeof useSubmission>;
