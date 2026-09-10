'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLink } from '@/components/shared/Button';
import { RevealItem, StaggerGroup } from '@/components/shared/Motion';
import { PhotoPending } from '@/components/shared/PendingData';
import Section from '@/components/shared/Section';
import { Heading } from '@/components/shared/Type';
import { HAPPY_HOUR } from '@/lib/brand';
import {
  type VenueEvent,
  type Weekday,
  recurringEvents,
  timeRange,
  weekdayLabel,
  whenLabel,
} from '@/content/events';
import { activeTrucks } from '@/content/trucks';

/**
 * «What's on» — la programación de la semana, con la de HOY primero.
 *
 * ⚠️ Es la FUSIÓN de dos secciones que se pisaban. Camila: «no entiendo la
 * diferencia entre la sección Esta noche en el Yard y Esta semana, ¿no debería
 * ser toda una? De eventos, que los diferenciemos con tags a lo sumo».
 *
 * Tenía razón: `TonightAtTheYard` y `ThisWeek` leían la misma lista de
 * recurrentes y la mostraban dos veces, una filtrada por hoy y otra entera. El
 * visitante veía el mismo bingo dos veces en la misma página.
 *
 * Lo que NO se perdió al fusionarlas: la inmediatez. La card de hoy va
 * primera y con el tag «Tonight». Es la razón por la que alguien vuelve a
 * entrar a la web una segunda vez, y era lo único que justificaba la sección
 * separada.
 *
 * ⚠️ Client component, y no por gusto: necesita saber qué día es en Bonita
 * Springs. El servidor no puede — una página cacheada mostraría el jueves un
 * martes. El servidor pinta la semana completa, que ya es útil, y al montar se
 * reordena poniendo hoy adelante. Sin esto hay mismatch de hidratación y, peor,
 * se publica un dato que puede estar mal.
 */

/** Lunes y martes el lugar está cerrado. Dato del brief, no inventado. */
const CLOSED_DAYS: readonly Weekday[] = [1, 2];

function venueWeekday(): Weekday {
  const label = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
  }).format(new Date());
  const map: Record<string, Weekday> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return map[label] ?? 0;
}

/**
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ SE CAYÓ EL CONTENEDOR DE TARJETA — `redesign/light-tropical`.
 *
 * Acá vivían `BLOQUES`, tres rellenos de color para tres tarjetas de igual
 * tamaño: una `deep` y dos `chalk` con filete. La estructura era el
 * anti-patrón que el brief nombra explícitamente: mismo radio, misma
 * `shadow-card`, mismo ancho, y la de hoy diferenciada **pintándose de otro
 * color**.
 *
 * Lo que cambia, y es una decisión sobre jerarquía y no sobre piel:
 *
 *   · **La de hoy se distingue por TAMAÑO, no por color.** Es más ancha que
 *     las otras y titula un escalón más arriba. Con sólo dos familias, la
 *     jerarquía la hacen tamaño, peso y ancho — no cajas de color.
 *   · **Se fue el bloque `deep`.** Era una de las cinco superficies oscuras
 *     que sumaban el 55,4 % de la home.
 *
 * ⚠️ Y AHORA ES UN TRACK, no una grilla — tercera forma. Fueron tres tarjetas
 * iguales con sombra, después una grilla asimétrica de 1.35fr/1fr, y ahora una
 * fila que pasa con las cuatro. Lo pidió Camila con una referencia. El detalle
 * está en el cuerpo del componente, en la nota del `StaggerGroup`.
 *
 * ⚠️ TRES DE LOS CUATRO EVENTOS YA TIENEN FOTO, de la entrega de
 * `public/multimedia/`. El que falta es `wooftop-wednesdays`: es la noche de
 * perros y en las 36 fotos no hay ni un perro, así que sigue mostrando el
 * hueco marcado con el brief de la toma. Poner una foto del patio ahí diría
 * «traé al perro» sobre una imagen sin perros. El mapa de fotos y el
 * razonamiento están en `IMAGENES`, en `content/events.ts`.
 * ══════════════════════════════════════════════════════════════════════════
 */

/** El rótulo de cuándo. Píldora chica: es un dato, no un eyebrow de sección. */
function Cuando({ evento, esHoy }: { readonly evento: VenueEvent; readonly esHoy: boolean }) {
  return (
    <span className="w-fit rounded-pill border border-ink/20 px-2.5 py-0.75 eyebrow text-muted">
      {esHoy
        ? 'Tonight'
        : evento.weekday !== null
          ? weekdayLabel(evento.weekday)
          : whenLabel(evento)}
    </span>
  );
}

/** La foto, o el hueco marcado. `ratio` lo impone quien la usa. */
function Foto({ evento, sizes }: { readonly evento: VenueEvent; readonly sizes: string }) {
  if (evento.image === null) {
    /* ⚠️ El brief va en INGLÉS. Es texto VISIBLE en la página, no un
       comentario: el placeholder se ve a propósito para que el hueco no se
       publique callado. Los comentarios del repo van en español, las cadenas
       que se renderizan no.

       ⚠️ El borde PUNTEADO se conserva y es lo que lo salva en clave clara. Un
       filete continuo lee «imagen que no cargó»; uno punteado lee «acá va
       algo». Es la diferencia entre un error y un placeholder. */
    return (
      <PhotoPending
        brief={`${evento.title} at ${evento.space}, at night, with people`}
        ratio=""
        className="h-full rounded-none border-0 border-dashed"
      />
    );
  }
  return (
    <Image
      src={evento.image}
      alt={evento.imageAlt ?? ''}
      fill
      sizes={sizes}
      className="object-cover transition-transform duration-250 ease-brand group-hover:scale-[1.03]"
    />
  );
}

/**
 * Una card del track: FOTO ARRIBA, BLOQUE DE COLOR ABAJO.
 *
 * ⚠️ Es el mandato de Superside que el brief le asigna a esta sección
 * —«Cards de foto arriba + bloque de color abajo»— y recién ahora se cumple.
 * Las versiones anteriores tenían la foto arriba y el texto sobre la superficie
 * de la página, o sobre un relleno de color que hacía de tarjeta.
 *
 * ⚠️ EL TEXTO NO VA SOBRE LA FOTO. En la referencia que mandó Camila el rótulo
 * está encima de la imagen, y acá no se puede: el contraste de un texto sobre
 * una foto depende de qué píxel le toque debajo, y estas fotos las cambia el
 * cliente. Con el bloque de color abajo, el par es `ink` sobre `bone` —15.83:1
 * medido— y no depende de la imagen.
 *
 * ⚠️ La jerarquía la hace el ANCHO, que lo pone el track, más el escalón de
 * título: la card grande titula en la condensada a 40px y las chicas en la
 * geométrica a 20/24.
 */
function EventoCard({
  evento,
  esHoy,
  grande,
}: {
  readonly evento: VenueEvent;
  readonly esHoy: boolean;
  readonly grande: boolean;
}) {
  return (
    <Link
      href={`/whats-on/${evento.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-image bg-bone ring-1 ring-fog transition-shadow duration-300 hover:shadow-photo"
    >
      {/* ⚠️ 3:4 en las dos medidas. La referencia usa cards verticales y es lo
          que hace que la fila se lea como una fila de piezas y no como una
          tira de banners. El `overflow-hidden` va acá para que el zoom del
          hover recorte contra la foto y no contra la card entera. */}
      <div className="relative aspect-[3/4] shrink-0 overflow-hidden bg-fog/40">
        <Foto
          evento={evento}
          sizes={grande ? '(max-width: 1023px) 84vw, 420px' : '(max-width: 1023px) 74vw, 300px'}
        />
      </div>

      {/* El bloque de color. Lleva la greca del brand book al 8 %: es la trama
          que Camila pidió para las cards, y a esa opacidad no toca el contraste
          del texto que va encima. */}
      <div className="relative flex flex-1 flex-col p-4.5 lg:p-5.5">
        <div
          aria-hidden="true"
          className="greca pointer-events-none absolute inset-0 text-deep/[0.08]"
          style={{ '--greca-celda': '26px' } as React.CSSProperties}
        />

        <div className="relative">
          <Cuando evento={evento} esHoy={esHoy} />

          {grande ? (
            <Heading level={3} className="mt-3 transition-colors group-hover:text-deep">
              {evento.title}
            </Heading>
          ) : (
            <Heading level={3} role="card" className="mt-2 transition-colors group-hover:text-deep">
              {evento.title}
            </Heading>
          )}

          {/* La bajada sólo en la grande: en una card de 300px, tres renglones
              más empujan el dato de la hora fuera de la vista. */}
          {grande ? (
            <p className="mt-2 text-base text-muted">{evento.summary}</p>
          ) : null}
        </div>

        <span className="relative mt-auto pt-4 font-body text-dato tabular-nums text-muted">
          {timeRange(evento)} · {evento.space}
        </span>
      </div>
    </Link>
  );
}

export default function WhatsOn() {
  const [hoy, setHoy] = useState<Weekday | null>(null);
  useEffect(() => setHoy(venueWeekday()), []);

  const semana = recurringEvents();
  const cerradoHoy = hoy !== null && CLOSED_DAYS.includes(hoy);

  /*
    Hoy primero. Antes de montar `hoy` es null y sale el orden natural de la
    semana, que es un estado correcto y no un placeholder: el servidor no
    puede saber el día sin arriesgar una página cacheada con el día equivocado.
  */
  const deHoy = hoy === null ? [] : semana.filter((e) => e.weekday === hoy);
  const resto = semana.filter((e) => !deHoy.includes(e));
  /*
    ⚠️ CUATRO y no tres. La grilla anterior cortaba en tres porque no había
    lugar para el cuarto; el track no tiene ese límite. Camila: «con tres o
    cuatro eventos que se muestren estamos bien, los demás van en la página
    que le corresponde».

    ⚠️ El TOPE se queda, y es lo importante de esta línea. Hoy
    `recurringEvents()` devuelve cuatro, pero si el cliente carga diez la home
    no puede convertirse en el calendario: para eso está `/whats-on`, que es a
    donde va el enlace de al lado del título.
  */
  const ordenados = [...deHoy, ...resto].slice(0, 4);

  const trucks = activeTrucks();

  return (
    <Section tone="paper" band="lg" labelledBy="whats-on-title">
      {/* ⚠️ SE FUE EL EYEBROW «What's on» de arriba del h2. La home tenía 14
          eyebrows y el brief permite 3: se quedan los que clasifican un dato
          real —el día de cada evento, las tres unidades del negocio, los
          rótulos de contacto— y se caen los que sólo repetían en versalitas el
          título que venía abajo. Éste era uno de esos. */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-end sm:justify-between">
        <Heading level={2} id="whats-on-title">
          {cerradoHoy ? 'Closed today, back Wednesday' : 'This week in the yard'}
        </Heading>
        <ArrowLink href="/whats-on" className="shrink-0 pb-2 text-deep">
          Full calendar
        </ArrowLink>
      </div>

      {/*
        ⚠️ GRILLA ASIMÉTRICA, 1.35fr / 1fr. Es lo que hace la jerarquía: el
        evento de hoy ocupa la columna ancha y los otros dos se apilan en la
        angosta. Con tres columnas iguales —que es lo que había— las tres
        cosas pesaban lo mismo y la de hoy tenía que gritar con color para
        distinguirse.

        En mobile se apila todo en una columna, en el mismo orden.
      */}
      {/*
        ⚠️ EL BLOQUE GRANDE VA FUERA DE CUALQUIER `StaggerGroup`, y no es
        estilo: es obligatorio. `motion` propaga variantes a los hijos, así que
        un `RevealMedia` metido dentro de un grupo con variantes deja de
        disparar su propio `whileInView` y su `clip-path` se queda cerrado para
        siempre — la imagen no aparece nunca, sin error ni warning. Ya pasó acá.
        Ver la nota de `RevealMedia` en `Motion.tsx`.

        Y de paso es lo correcto semánticamente: el evento de hoy es UNO, no un
        grupo de uno.
      */}
      {/*
        ══════════════════════════════════════════════════════════════════════
        ⚠️ ES UN TRACK QUE PASA, no una grilla. Lo pidió Camila con una
        referencia: «cards que vayan pasando con tres o cuatro eventos que se
        muestren estamos bien, los demás van en la página que le corresponde».

        Qué reemplaza: una grilla asimétrica de 1.35fr/1fr con el evento de hoy
        grande y dos chicos al costado. Y antes de eso, tres tarjetas iguales
        con sombra. Lo que gana el track:

          · **Cabe la semana entera sin decidir qué se cae.** La grilla mostraba
            tres de cuatro eventos porque no había lugar para el cuarto. El
            track muestra los cuatro y el resto vive en `/whats-on`, que es
            donde corresponde.
          · **La jerarquía sigue siendo por tamaño, no por color.** La card de
            HOY es más ancha que las otras. Es la misma regla de la grilla
            anterior, aplicada a una fila.

        ⚠️ ES `scroll-snap` NATIVO Y NO UN CARRUSEL DE JS. Hay un
        `DragCarousel` en `Motion.tsx`, y no se usa acá a propósito: con
        `overflow-x-auto` + `snap-x` el track funciona con rueda, con dedo, con
        la barra de scroll y **con teclado** —Tab lleva al link de cada card y
        el navegador scrollea solo—, y no cuesta un byte de JavaScript. Un
        carrusel propio tendría que reimplementar las cuatro cosas y las haría
        peor.

        ⚠️ `-mx-gutter` con `px-gutter` adentro: el track SANGRA por los
        costados —una fila que se corta en el borde se lee como que sigue— pero
        la primera card arranca alineada con el título. Sin el padding interno,
        el track empezaría pegado al borde de la pantalla y rompería el eje de
        la grilla.
        ══════════════════════════════════════════════════════════════════════
      */}
      <StaggerGroup
        as="ul"
        className="-mx-gutter mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-gutter pb-2.5 md:-mx-gutter-lg md:px-gutter-lg lg:gap-5"
      >
        {ordenados.map((evento, i) => (
          <RevealItem
            as="li"
            key={evento.slug}
            /* La de hoy es más ancha. `i === 0` y no una comprobación del día:
               el orden ya pone hoy primero, y con el local cerrado la primera
               es la próxima que viene — que es la que interesa igual. */
            className={`shrink-0 snap-start ${
              i === 0 ? 'w-[84vw] sm:w-[58vw] lg:w-105' : 'w-[74vw] sm:w-[46vw] lg:w-75'
            }`}
          >
            <EventoCard
              evento={evento}
              esHoy={hoy !== null && evento.weekday === hoy}
              grande={i === 0}
            />
          </RevealItem>
        ))}
      </StaggerGroup>

      {/*
        ── Los trucks ────────────────────────────────────────────────────
        ⚠️ La rotación diaria NO EXISTE como dato. Así que esto no dice «hoy
        están estos cuatro»: muestra el roster y dice la verdad. Cuando el
        cliente entregue la grilla de rotación, se reemplaza por los del día y
        nada más cambia. Es la misma decisión que tenía `TonightAtTheYard`, y
        se conserva palabra por palabra.
      */}
      {/* ⚠️ El filete sube a `fog`, que está calibrado sobre blanco. `ink/12`
          era una opacidad, o sea un color distinto sobre cada superficie. */}
      <div className="mt-12 border-t border-fog pt-6">
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between">
          {/* ⚠️ «In the yard» deja de ser eyebrow y pasa a ser un rótulo de
              dato en la geométrica. No clasificaba: anunciaba. */}
          <p className="font-subhead text-dato font-medium tracking-cta uppercase text-deep">
            In the yard
          </p>
          <ArrowLink href="/food-trucks" className="shrink-0 text-deep">
            All four trucks
          </ArrowLink>
        </div>
        {/* ⚠️ `text-ink` y no `text-body/75`. Esto es CUERPO —el roster real de
            los camiones—, no una bajada, y el brief pone el cuerpo sobre claro
            en el color de texto pleno. La opacidad además daba un color
            distinto sobre cada superficie. */}
        <p className="mt-3 max-w-[75ch] text-base text-ink">
          {trucks.map((t) => t.name).join(' · ')}. The roster rotates, and each truck takes its own
          orders and its own payment.
        </p>
        <p className="mt-3 text-base text-ink">
          <span className="font-medium">Happy hour</span>{' '}
          <span className="text-muted">
            {HAPPY_HOUR.days}, {HAPPY_HOUR.time} — {HAPPY_HOUR.deals.join(' · ')}
          </span>
        </p>
      </div>
    </Section>
  );
}
