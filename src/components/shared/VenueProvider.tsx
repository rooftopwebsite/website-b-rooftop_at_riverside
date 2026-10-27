'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { Venue } from '@/lib/venue';

const Ctx = createContext<Venue | null>(null);

export default function VenueProvider({
  venue,
  children,
}: {
  readonly venue: Venue;
  readonly children: ReactNode;
}) {
  return <Ctx.Provider value={venue}>{children}</Ctx.Provider>;
}

export function useVenue(): Venue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useVenue() needs <VenueProvider>, which lives in app/layout.tsx');
  return v;
}
