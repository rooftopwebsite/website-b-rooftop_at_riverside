import Image from 'next/image';
import { ArrowUpRight } from '@/components/shared/Icon';
import { PhotoPending } from '@/components/shared/PendingData';
import Section from '@/components/shared/Section';
import { SectionHead } from '@/components/shared/Type';
import { RevealItem, StaggerGroup } from '@/components/shared/Motion';
import { activeTrucks, nombreVisible } from '@/content/trucks';
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
 * ⚠️ NO HAY CTA A INSTAGRAM, aunque de El Chilango lo tengamos. Pedido de
 * Camila: la tarjeta cierra con una sola acción. Dos links juntos al pie —uno
 * relleno y uno de texto— hacen que el ojo tenga que elegir justo donde la
 * tarjeta debería empujar a una sola cosa. El dato queda en `trucks.ts` para
 * cuando haga falta.
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

export default function TruckCards({
  id = 'roster-title',
  tone = 'paper',
  head = true,
}: {
  readonly id?: string;
  /** La superficie. La manda la onda del encabezado: ver `PageHeroWave`. */
  readonly tone?: 'paper' | 'bone';
  /**
   * ¿Lleva encabezado propio?
   *
   * ⚠️ EN `/food-trucks` VA EN `false`, y es por adyacencia. Desde que la
   * página abre con el hero centrado que termina en onda, las tarjetas quedan
   * INMEDIATAMENTE debajo de él: el hero dice «Four kitchens. One yard.» y el
   * encabezado de la sección decía «The four kitchens» cuatro renglones más
   * abajo, con una bajada que repetía la misma idea con otras palabras. Dos
   * titulares seguidos diciendo lo mismo se leen como un error de armado.
   *
   * El `<h2>` no desaparece: queda para lectores de pantalla, porque la sección
   * igual necesita nombre.
   */
  readonly head?: boolean;
}) {
  const trucks = activeTrucks();
  const tramos = tramosDeTrucks();

  return (
    <Section tone={tone} band="lg" labelledBy={id}>
      {head ? (
        <SectionHead
          eyebrow="In the yard"
          eyebrowTone="plum"
          id={id}
          title="The four kitchens"
          lead="Each one is its own business. You order at the window and you pay that truck: separate line, separate card, separate receipt."
        />
      ) : (
        <h2 id={id} className="sr-only">
          The four kitchens
        </h2>
      )}

      {/*
        ══════════════════════════════════════════════════════════════════
        ⚠️ SON CUATRO COLUMNAS Y ERAN DOS. Camila, 2026-09-16: «las 4 cards las
        veo muy grotescas, tan grandes; ¿qué otra opción podemos hacer para que
        no se vea tan grande?».

        A dos columnas cada tarjeta medía 572px de ancho con una foto de 358 de
        alto: dos filas de eso son 1.400px de página para cuatro nombres y
        cuatro párrafos cortos. La tarjeta no estaba mal hecha, estaba
        sobredimensionada para lo que lleva adentro.

        A cuatro quedan en 266px. La foto pasa a 4/5 —vertical, que es la
        proporción de una ficha y no la de un banner—, el nombre baja un escalón
        y la bajada se recorta en tres renglones. La sección entera pasa de
        1.400px a unos 520.

        ⚠️ LA BAJADA SE RECORTA MÁS Y NO ES UNA PÉRDIDA. El pedido original de
        esta tarjeta era «una descripción pero mínima, tipo bajada de card». A
        266px de ancho entran unos 95 caracteres en tres renglones, que es
        exactamente eso. El texto completo de cada truck no se pierde: está en
        `trucks.ts` y lo muestra la carta.

        ⚠️ EL SALTO ES 1 → 2 → 4 Y NUNCA 3. Con tres columnas, cuatro tarjetas
        dejan una huérfana sola en la segunda fila, que es la regla que rige
        todas las grillas de este sitio.
        ══════════════════════════════════════════════════════════════════
      */}
      <StaggerGroup
        as="ul"
        className={`grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4 ${head ? 'mt-bloque' : ''}`}
      >
        {trucks.map((t) => (
          <RevealItem as="li" key={t.slug} className="h-full">
            <article className="flex h-full flex-col overflow-hidden rounded-shell bg-paper sombra-card">
              {/* ⚠️ EL `bg-fog` VA SÓLO DETRÁS DE UNA FOTO REAL, donde tapa el hueco
                  mientras carga. Debajo del placeholder NO: el relleno del
                  placeholder es `ink` al 6 %, o sea que se compone sobre lo que
                  tenga atrás, y sobre `fog` daba #d1cdbd. Ahí su propio rótulo
                  caía a 4.38:1 y axe lo marcó. */}
              <div className={`relative aspect-[3/2] ${t.photo ? 'bg-fog' : ''}`}>
                {t.photo ? (
                  <Image
                    src={t.photo}
                    alt={t.photoAlt ?? t.name}
                    fill
                    sizes="(min-width: 1024px) 280px, (min-width: 640px) 46vw, 92vw"
                    className="object-cover"
                  />
                ) : (
                  <PhotoPending brief={t.photoBrief} ratio="aspect-[3/2]" className="h-full" />
                )}
              </div>

              <div className="flex flex-1 flex-col p-5">
                <p className="m-0 font-body text-micro font-bold uppercase tracking-cta text-muted">
                  {t.cuisine}
                </p>

                <h3 className="m-0 mt-1.5 font-display text-d5 font-bold uppercase leading-none text-ink">
                  {nombreVisible(t)}
                </h3>

                {/*
                  ⚠️ SE USA `blurb` Y NO `story`, y ya no hay `line-clamp`. La
                  historia completa del cliente mide hasta 290 caracteres y a
                  266px de ancho el recorte entraba siempre: la tarjeta
                  terminaba en puntos suspensivos en las cuatro. El porqué del
                  campo está arriba de `blurb` en `trucks.ts`.

                  El respaldo a `story` queda para un truck que todavía no tenga
                  bajada propia: es mejor una frase cortada que ninguna.
                */}
                {t.blurb ?? t.story ? (
                  <p className="m-0 mt-3 font-body text-dato font-light leading-[1.5] text-body">
                    {t.blurb ?? t.story}
                  </p>
                ) : null}

                {/* El `mt-auto` apoya la línea de acción en el piso de la
                    tarjeta, que es lo que las alinea entre sí. */}
                <div className="mt-auto pt-5">
                  {/*
                    ══════════════════════════════════════════════════════════
                    ⚠️ EL BOTÓN VA EN LAS CUATRO TARJETAS, Y ANTES IBA SÓLO EN
                    LAS DOS QUE TIENEN CARTA. Camila, 2026-09-16: «en todas poné
                    el see the menu; en las que aún no lo tengamos, no linkees
                    nada».

                    ⚠️ ES UN `<button disabled>` Y NO UN `<a>` SIN `href`. Un
                    botón que se ve vivo, responde al hover y no hace nada al
                    apretarlo se lee como que la página está rota — es
                    exactamente el argumento que este proyecto ya escribió para
                    las flechas del carrusel de `WhatsOn`. `disabled` lo saca
                    del tabulador y lo anuncia como no disponible.
                    ══════════════════════════════════════════════════════════
                  */}
                  {t.menuImage ? (
                    <a
                      href={t.menuImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-pill bg-sunset px-4.5 py-2 font-body text-dato font-semibold uppercase tracking-cta text-ink transition-colors duration-200 hover:bg-sunset-hover"
                    >
                      See the menu
                      <ArrowUpRight className="size-3.5 shrink-0" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="inline-flex items-center gap-2 rounded-pill bg-sunset px-4.5 py-2 font-body text-dato font-semibold uppercase tracking-cta text-ink opacity-50"
                    >
                      See the menu
                      <ArrowUpRight className="size-3.5 shrink-0" />
                    </button>
                  )}
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
        los horarios del espacio en sí».

        ⚠️ Y NO ES EL MISMO QUE EL DE LA BARRA. `content/hours.ts` guarda dos
        sets porque el sitio vigente los publica separados en cada página: los
        trucks abren exactamente una hora más tarde que la barra, todos los días.
        Acá se muestra la columna `trucks`.

        ══════════════════════════════════════════════════════════════════
        ⚠️ AHORA ES UNA TARJETA HORIZONTAL DESTACADA Y ERA UN FILETE CON UNA
        LISTA. Camila: «la parte de los horarios debe tener más peso, quizá
        ponerlo en una card horizontal destacada o darle más protagonismo de
        otra forma».

        Tenía razón por jerarquía: es el dato más buscado de la página —a qué
        hora abren— y estaba compuesto igual que una nota al pie, en gris, tras
        un filete de 1px. Ahora es una losa oscura, que en esta página es la
        única pieza de ese color antes del comparativo, así que se ve desde
        lejos.

        ⚠️ LOS DÍAS VAN EN FILA Y NO APILADOS. Son cuatro tramos, y en fila se
        leen como una semana: el ojo compara los horarios entre sí en un solo
        barrido. Apilados hay que leer cuatro renglones para descubrir que el
        fin de semana abre antes.

        ⚠️ LOS DÍAS CERRADOS NO SE LISTAN. Es la misma decisión que el cliente
        pidió para la barra de horarios del encabezado: se comunica por cuándo
        ABRE, no por cuándo no.
        ══════════════════════════════════════════════════════════════════
      */}
      <div className="mt-bloque overflow-hidden rounded-shell bg-deep grano sombra-card">
        <div className="grid gap-8 p-8 lg:grid-cols-[minmax(0,auto)_minmax(0,1fr)] lg:items-center lg:gap-14 lg:p-11">
          <div>
            <h3 className="m-0 font-display text-d4 font-bold uppercase leading-none text-paper lg:text-d3">
              When the trucks
              <br className="hidden lg:block" /> are open
            </h3>
            <p className="m-0 mt-3.5 max-w-[34ch] font-body text-dato font-light text-muted-dark">
              The bar upstairs opens an hour earlier every day.
            </p>
          </div>

          <dl className="m-0 grid grid-cols-2 gap-x-8 gap-y-6 lg:grid-cols-4">
            {tramos.map((t) => (
              <div key={t.label} className="border-t border-paper/20 pt-4">
                <dt className="font-body text-micro font-bold uppercase tracking-cta text-cream">
                  {t.label}
                </dt>
                <dd className="m-0 mt-2 font-display text-d6 font-bold tabular-nums leading-none text-paper">
                  {t.horario}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
