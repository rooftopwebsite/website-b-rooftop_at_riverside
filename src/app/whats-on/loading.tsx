import PageSkeleton from '@/components/shared/Skeleton';

/**
 * ⚠️ `/whats-on` SE ARMA POR REQUEST: lee los eventos de la base y el mes de
 * la URL. Es la página donde más se espera al navegar, y la silueta es la del
 * calendario (filtros, barra del mes, tarjetas) para que el contenido caiga
 * donde ya estaba el bloque gris.
 */
export default function Loading() {
  return <PageSkeleton variant="calendar" />;
}
