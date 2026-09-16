import Image from 'next/image';
import { RevealItem, StaggerGroup } from '@/components/shared/Motion';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
import { TIPOS_EVENTO } from '@/content/event-types';
import { TAG } from '@/lib/tag';

/**
 * ══════════════════════════════════════════════════════════════════════════
 * LOS CUATRO TIPOS DE EVENTO PRIVADO, COMO SECCIONES DE `/events`.
 *
 * Reemplaza a `EventVertical`, que renderizaba UNA vertical por página. El
 * contenido es el mismo —sale de `content/event-types.ts`, campo por campo—
 * y lo que cambia es que las cuatro se leen de corrido en vez de vivir en
 * cuatro URLs. El porqué está en el encabezado de ese archivo.
 *
 * ⚠️ CADA TIPO LLEVA SU `id` Y NO SE PUEDE RENOMBRAR. Las cuatro rutas viejas
 * —`/events/corporate` y compañía— redirigen con 301 a `/events#<id>`, así que
 * un `id` distinto rompe un link que puede estar en un mail que el cliente
 * mandó el mes pasado.
 *
 * ⚠️ LA FILA SE DA VUELTA EN LOS IMPARES (`lg:flex-row-reverse`). Cuatro
 * bloques idénticos con la foto siempre del mismo lado se leen como una
 * plantilla; alternando, el ojo tiene dónde apoyarse para saber que empezó
 * otro tipo. Es el mismo recurso que usa `/our-story`.
 *
 * ⚠️ EL TONO ALTERNA ENTRE `paper` Y `bone` por el mismo motivo, y NO puede
 * ser una banda de color por tipo: la regla de superficies del repo permite
 * como máximo dos secciones de crema por página, y esta página ya tiene las
 * suyas. Lo verifica `npm run check:surfaces`.
 * ══════════════════════════════════════════════════════════════════════════
 */
export default function EventTypes() {
  return (
    <>
      <Section band="lg" labelledBy="tipos-title">
        <SectionHead
          eyebrow="What we host"
          eyebrowTone="plum"
          id="tipos-title"
          title="Pick the night you're planning"
          lead="Four ways the same place gets used. The room, the kitchens and the bar don't change. How the night is built does."
        />
      </Section>

      {TIPOS_EVENTO.map((tipo, i) => (
        <Section
          key={tipo.id}
          id={tipo.id}
          tone={i % 2 === 0 ? 'paper' : 'bone'}
          band="lg"
          labelledBy={`${tipo.id}-title`}
        >
          <div
            className={`flex flex-col gap-10 lg:items-center lg:gap-16 ${
              i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
            }`}
          >
            <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-card bg-mint sombra-card lg:w-[46%]">
              <Image
                src={tipo.image}
                alt={tipo.imageAlt}
                fill
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <Eyebrow tone="terra">{tipo.eyebrow}</Eyebrow>
              <Heading level={2} id={`${tipo.id}-title`} className="mt-gap-kicker text-d4 lg:text-d3">
                {tipo.title}
              </Heading>
              <p className="bajada mt-gap-bajada max-w-[52ch] font-body text-lead font-light">
                {tipo.lead}
              </p>

              <StaggerGroup as="ul" className="mt-bloque grid list-none gap-6 p-0 sm:grid-cols-2">
                {tipo.highlights.map((h) => (
                  <RevealItem as="li" key={h.title}>
                    <Heading level={3} className="text-d6">
                      {h.title}
                    </Heading>
                    <p className="mt-2 font-body text-base font-light text-ink">{h.body}</p>
                  </RevealItem>
                ))}
              </StaggerGroup>

              {/*
                ⚠️ LOS FORMATOS SON ETIQUETAS Y TIENEN QUE PARECERLO. Es el
                mismo tratamiento que los tags de `YardSteps`, y por el mismo
                motivo: en píldora con contorno se leen como botones apagados.
                Fondo tenue, radio de la familia y texto en `muted`.
              */}
              <ul className="mt-bloque flex list-none flex-wrap gap-2 p-0">
                {tipo.formats.map((f) => (
                  <li
                    key={f}
                    /* Letra y acolchado salen de `TAG`, el molde común de los
                       tags del sitio. Ver `lib/tag.ts`. */
                    className={`inline-flex items-center gap-1.75 rounded-btn bg-bone ${TAG} text-muted`}
                  >
                    <span aria-hidden="true" className="size-1 shrink-0 rounded-pill bg-river" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      ))}
    </>
  );
}
