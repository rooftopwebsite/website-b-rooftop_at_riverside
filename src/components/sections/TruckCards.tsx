import Image from 'next/image';
import { ArrowUpRight } from '@/components/shared/Icon';
import { NombreSinConfirmar, PhotoPending } from '@/components/shared/PendingData';
import Section from '@/components/shared/Section';
import { SectionHead } from '@/components/shared/Type';
import { RevealItem, StaggerGroup } from '@/components/shared/Motion';
import { activeTrucks } from '@/content/trucks';
import { HOURS } from '@/content/hours';

/**
 * Las cuatro tarjetas de food truck. Es TODO lo que hay de cada uno.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LAS FICHAS POR TRUCK SE FUERON, Y ES UN CAMBIO DE ALCANCE PEDIDO. Camila,
 * 2026-09-16: «cada food truck no tendrá su página. Haremos una única con los 4
 * food truck, cada uno en una card o algo así, con una descripción pero mínima
 * tipo bajada de card y un CTA que derive a un menú PDF».
 *
 * Así que `/food-trucks/[slug]` deja de existir y las cuatro URLs redirigen acá
 * con 301. El template que tenían —hero del disco, ficha en banda oscura, carta
 * en tarjetas de plato— NO se borró: Camila lo pidió expresamente para
 * `/game-truck`. Vive en `TruckHero`, `TruckFacts` y `TruckMenu`.
 *
 * ⚠️ Y TIENE SENTIDO MÁS ALLÁ DEL PEDIDO. Una ficha por truck necesita ocho
 * fotos, una historia larga, una carta y un horario propio POR truck. De los
 * nuestros tenemos una foto, un párrafo y, en dos de cuatro, una carta. Cuatro
 * páginas con tres datos cada una son cuatro páginas flacas; cuatro tarjetas con
 * tres datos cada una son una página completa.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ EL CTA VA A UNA IMAGEN Y NO A UN PDF, y el pedido decía PDF. El motivo es
 * que el PDF no existe: el sitio vigente publica cada carta como IMAGEN dentro
 * de la página del truck, y los únicos tres PDF que tiene son el mapa de
 * estacionamiento, el del game lounge y el de eventos. Están bajadas en
 * `public/menus/`. Una carta de una página como imagen abre en cualquier
 * teléfono y se hace zoom con dos dedos; el día que el cliente mande PDF se
 * cambia la ruta en `trucks.ts` y esta sección no se entera.
 *
 * ⚠️ LOS QUE NO TIENEN CARTA NO TIENEN BOTÓN. Prime Carvery y el jamaiquino no
 * la dieron, y un botón que no lleva a ningún lado es peor que ninguno: en su
 * lugar va una línea de texto que dice que falta. Así el hueco se ve y se pide.
 */
/**
 * Agrupa días seguidos con el mismo horario de trucks: «Wednesday to Thursday».
 *
 * ⚠️ AGRUPA POR CONSECUTIVOS Y NO POR VALOR, que es la misma regla que la tira
 * de horarios del encabezado: dos días con el mismo horario pero separados en la
 * semana no pueden mostrarse como un rango, porque eso afirmaría que los días
 * del medio también abren a esa hora.
 */
function tramosDeTrucks() {
  const out: { label: string; horario: string; primero: string }[] = [];
  HOURS.filter((h) => !/closed/i.test(h.trucks)).forEach((row) => {
    const ultimo = out[out.length - 1];
    if (ultimo && ultimo.horario === row.trucks) {
      ultimo.label = `${ultimo.primero} to ${row.day}`;
      return;
    }
    out.push({ label: row.day, horario: row.trucks, primero: row.day });
  });
  return out;
}

export default function TruckCards({ id = 'roster-title' }: { readonly id?: string }) {
  const trucks = activeTrucks();
  const tramos = tramosDeTrucks();

  return (
    <Section band="lg" labelledBy={id}>
      <SectionHead
        eyebrow="In the yard"
        eyebrowTone="plum"
        id={id}
        title="The four kitchens"
        lead="Each one is its own business. You order at the window and you pay that truck: separate line, separate card, separate receipt."
      />

      {/*
        ⚠️ DOS COLUMNAS Y NO CUATRO. Con cuatro, cada tarjeta mide 274px en
        1168 y la bajada de tres renglones se parte en seis. Con dos quedan en
        572, que es donde un párrafo corto entra en tres renglones y la foto
        tiene tamaño de foto. Son cuatro tarjetas: dos filas de dos cierran
        parejo, sin huérfanas.
      */}
      <StaggerGroup
        as="ul"
        className="mt-bloque grid list-none grid-cols-1 gap-8 p-0 md:grid-cols-2"
      >
        {trucks.map((t) => (
          <RevealItem as="li" key={t.slug} className="h-full">
            <article className="flex h-full flex-col overflow-hidden rounded-shell bg-paper sombra-card">
              <div className="relative aspect-[16/10] bg-fog">
                {t.photo ? (
                  <Image
                    src={t.photo}
                    alt={t.photoAlt ?? t.name}
                    fill
                    sizes="(min-width: 768px) 572px, 92vw"
                    className="object-cover"
                  />
                ) : (
                  <PhotoPending brief={t.photoBrief} ratio="aspect-[16/10]" className="h-full" />
                )}
              </div>

              <div className="flex flex-1 flex-col p-6 lg:p-7">
                <p className="m-0 font-body text-micro font-bold uppercase tracking-cta text-muted">
                  {t.cuisine}
                </p>

                <h3 className="m-0 mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 font-display text-d4 font-bold uppercase leading-none text-ink">
                  {t.name}
                  <NombreSinConfirmar truck={t} />
                </h3>

                {/*
                  LA BAJADA. Es el texto del propio truck, tomado de su página
                  del sitio vigente. `line-clamp-3` para que las cuatro tarjetas
                  midan parecido: la de Prime Carvery son tres oraciones y la de
                  El Chilango dos.
                */}
                {t.story ? (
                  <p className="m-0 mt-3.5 line-clamp-3 font-body text-base font-light leading-[1.55] text-body">
                    {t.story}
                  </p>
                ) : null}

                {/* El `mt-auto` apoya la línea de acción en el piso de la
                    tarjeta, que es lo que las alinea entre sí. */}
                <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-7">
                  {t.menuImage ? (
                    <a
                      href={t.menuImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2.25 rounded-pill bg-sunset px-5.5 py-2.5 font-body text-base font-semibold uppercase tracking-cta text-ink transition-colors duration-200 hover:bg-sunset-hover"
                    >
                      See the menu
                      <ArrowUpRight className="size-4 shrink-0" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  ) : (
                    <p className="m-0 font-body text-dato font-medium text-terra">
                      Menu not on file yet
                    </p>
                  )}

                  {t.instagram ? (
                    <a
                      href={t.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-texto font-body text-base font-medium text-ink"
                    >
                      Instagram
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          </RevealItem>
        ))}
      </StaggerGroup>

      {/*
        ══════════════════════════════════════════════════════════════════
        EL HORARIO, UNA VEZ Y PARA LOS CUATRO.

        ⚠️ ES EL DEL PATIO Y NO UNO POR TRUCK. Camila, 2026-09-16: «el horario
        es el mismo para todos los food trucks y sí lo tenemos, lo tenemos con
        los horarios del espacio en sí». Antes cada ficha mandaba al calendario
        con un «el roster rota», que era cierto pero esquivaba la pregunta.

        ⚠️ Y NO ES EL MISMO QUE EL DE LA BARRA. `content/hours.ts` guarda dos
        sets porque el sitio vigente los publica separados en cada página: los
        trucks abren una hora más tarde que la barra todos los días, y el
        sábado cierran tres horas antes. Acá se muestra la columna `trucks`.

        ⚠️ LOS DÍAS CERRADOS NO SE LISTAN. Es la misma decisión que el cliente
        pidió para la barra de horarios del encabezado: se comunica por cuándo
        ABRE, no por cuándo no.
        ══════════════════════════════════════════════════════════════════
      */}
      <div className="mt-bloque border-t border-fog pt-8">
        <h3 className="m-0 font-body text-micro font-bold uppercase tracking-cta text-muted">
          When the trucks are open
        </h3>
        <dl className="m-0 mt-5 grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
          {tramos.map((t) => (
            <div key={t.label} className="border-t border-fog/70 pt-3.5">
              <dt className="font-body text-dato font-bold uppercase tracking-eyebrow text-ink">
                {t.label}
              </dt>
              <dd className="m-0 mt-1 font-body text-base font-light tabular-nums text-body">
                {t.horario}
              </dd>
            </div>
          ))}
        </dl>
        <p className="m-0 mt-6 max-w-[62ch] font-body text-dato font-light text-muted">
          {/* ⚠️ «UNA HORA ANTES» ES EXACTO Y «cierra más tarde» NO LO ERA: el
              domingo la barra y los trucks cierran los dos a las 8. La hora de
              apertura sí se adelanta exactamente una hora los cuatro días. */}
          The bar upstairs opens an hour earlier every day. Which trucks are in on a given night is
          on the calendar.
        </p>
      </div>
    </Section>
  );
}
