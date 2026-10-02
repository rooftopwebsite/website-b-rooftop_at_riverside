'use client';

import { useEffect, useState } from 'react';
import type { VenueEvent } from '@/content/events';
import { VerMas } from './EventDialogProvider';

export default function VerMasSiRecorta({
  event,
  date,
  cuerpoId,
}: {
  readonly event: VenueEvent;
  readonly date: string;
  readonly cuerpoId: string;
}) {
  const [recorta, setRecorta] = useState(false);

  useEffect(() => {
    const cuerpo = document.getElementById(cuerpoId);
    if (!cuerpo) return;
    const medir = () => setRecorta(cuerpo.scrollHeight > cuerpo.clientHeight + 1);
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(cuerpo);
    return () => ro.disconnect();
  }, [cuerpoId]);

  if (!recorta) return null;
  return <VerMas event={event} date={date} className="mt-[14px] max-sm:hidden" />;
}
