import PageSkeleton from '@/components/shared/Skeleton';

/**
 * ⚠️ ESTA PÁGINA SE ARMA POR REQUEST porque lee `searchParams`, así que al
 * navegar hacia ella hay una espera real. La silueta termina en la losa del
 * formulario, que es a lo que viene la mayoría.
 */
export default function Loading() {
  return <PageSkeleton variant="form" />;
}
