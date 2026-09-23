import { ButtonLink } from '@/components/shared/Button';
import { Heading } from '@/components/shared/Type';

/**
 * El listado sin notas. Decisión de Camila (2026-09-23, opción B): el blog se
 * ve desde el día uno, aunque el dashboard todavía no tenga nada publicado.
 * También es lo que se ve si el feed no contesta.
 *
 * Va en la misma losa troquelada que las cards, sobre la banda menta: el día
 * que entra la primera nota, la losa cambia de contenido y la página no cambia
 * de forma.
 */
export default function BlogEmpty() {
  return (
    <div className="relative mx-auto max-w-[46rem] rounded-shell bg-paper px-7 py-12 text-center sombra-card lg:px-14 lg:py-16">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-3.5 rounded-shell border border-dashed border-deep/35"
      />
      <Heading level={2} id="blog-empty-title">
        Stories are on their way
      </Heading>
      <p className="bajada mx-auto mt-gap-bajada max-w-[44ch] text-lead">
        We are writing about the music, the trucks and the people who make the rooftop. Until the
        first one is up, the calendar has everything happening this month.
      </p>
      <div className="mt-gap-cta flex justify-center">
        <ButtonLink href="/whats-on" variant="primary" size="lg">
          See what&rsquo;s on
        </ButtonLink>
      </div>
    </div>
  );
}
