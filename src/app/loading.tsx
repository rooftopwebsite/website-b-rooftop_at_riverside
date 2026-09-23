import PageSkeleton from '@/components/shared/Skeleton';

/**
 * La pantalla de carga de cualquier página que no tenga la suya.
 *
 * ⚠️ CASI NUNCA SE VE: las páginas estáticas llegan prefetcheadas. Está para
 * el caso lento —una conexión mala, un prefetch que no terminó— en el que sin
 * esto el clic parece no haber hecho nada. Ver `components/shared/Skeleton.tsx`.
 */
export default function Loading() {
  return <PageSkeleton />;
}
