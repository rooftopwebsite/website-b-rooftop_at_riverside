'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { Venue } from '@/lib/venue';

/**
 * El local, disponible para los componentes CLIENTE.
 *
 * ⚠️ POR QUÉ HACE FALTA. `getVenue()` lee la base y eso sólo puede pasar en el
 * servidor. Pero seis componentes que muestran estos datos son de cliente
 * —la barra de utilidad, la tarjeta de horarios, el mapa, el hero— porque
 * necesitan estado o interacción. Sin esto habría que pasarles el objeto por
 * props desde cada página que los use, y son veintitrés páginas.
 *
 * Así en cambio se resuelve UNA vez en `layout.tsx`, que es servidor, y todos
 * lo leen con `useVenue()`.
 *
 * ⚠️ NO LLEVA NADA SECRETO. Lo que viaja al navegador es el teléfono, la
 * dirección y los horarios: exactamente lo que la página ya muestra impreso.
 * La anon key y la URL de Supabase no cruzan: el fetch pasó en el servidor.
 *
 * ⚠️ LOS COMPONENTES DE SERVIDOR NO USAN ESTO. Llaman a `getVenue()` directo,
 * que es más simple y además dedupea solo.
 */

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

/**
 * El local, desde un componente cliente.
 *
 * ⚠️ Tira si no encuentra el proveedor, a propósito. Un componente que muestra
 * el teléfono y silenciosamente no lo muestra es peor que un error en
 * desarrollo: el error se ve, el hueco no.
 */
export function useVenue(): Venue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useVenue() necesita <VenueProvider>, que va en app/layout.tsx');
  return v;
}
