'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLink } from '@/components/shared/Button';
import { RevealItem, StaggerGroup } from '@/components/shared/Motion';
import { PhotoPending } from '@/components/shared/PendingData';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading } from '@/components/shared/Type';
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
 * Los tres colores de bloque, en orden.
 *
 * ⚠️ El primero era `sunset`. Se cambió a `deep` en el refinamiento visual, y
 * el motivo está medido: esa card sola —413×200— era **82.600 px², el 81% de
 * todo el naranja de la home**. Camila pidió «el naranja solo en puntos muy
 * claves», y una card de eventos no es un punto clave: un CTA sí.
 *
 * Sigue habiendo tres superficies distintas, así que la fila no se aplana. Lo
 * que cambia es que la primera deja de gritar.
 *
 * ⚠️ Las dos claras llevan FILETE de 1px y las dos son `chalk`. Al sacar la
 * banda crema quedaron sobre hueso, y ahí `bone` y `chalk` dejaron de
 * distinguirse del fondo: la tercera card flotaba sin borde. El filete las
 * devuelve a ser objetos, y es el lenguaje de las referencias —estructura por
 * filetes finos, no por relleno—.
 *
 * Que las dos sean iguales es deliberado: la primera es la de HOY y el verde
 * es lo que la ancla. Tres colores distintos competían entre sí; uno oscuro y
 * dos neutras dicen cuál importa.
 *
 * ⚠️ El texto no es intercambiable: sobre `deep` va `paper`, sobre `chalk` va
 * `ink`.
 */
const BLOQUES = [
  { fondo: 'bg-deep', filo: '', texto: 'text-paper', sub: 'text-paper/75', borde: 'border-paper/30' },
  { fondo: 'bg-chalk', filo: 'ring-1 ring-ink/10', texto: 'text-ink', sub: 'text-body/75', borde: 'border-ink/20' },
  { fondo: 'bg-chalk', filo: 'ring-1 ring-ink/10', texto: 'text-ink', sub: 'text-body/75', borde: 'border-ink/20' },
] as const;

function EventCard({
  evento,
  bloque,
  esHoy,
}: {
  readonly evento: VenueEvent;
  readonly bloque: (typeof BLOQUES)[number];
  readonly esHoy: boolean;
}) {
  return (
    <Link
      href={`/whats-on/${evento.slug}`}
      className={`group flex h-full flex-col overflow-hidden rounded-card shadow-card transition-shadow duration-300 hover:shadow-float ${bloque.filo}`}
    >
      {/*
        La foto arriba. El `overflow-hidden` va acá y el zoom en la imagen: si
        el zoom fuera sobre la card entera, el bloque de color escalaría con
        ella y se vería el borde moverse.
      */}
      <div className="relative aspect-[4/3] overflow-hidden bg-bone">
        {evento.image === null ? (
          /* ⚠️ El brief va en INGLÉS. Es texto VISIBLE en la página, no un
             comentario: el placeholder se ve a propósito para que el hueco no
             se publique callado. Los comentarios del repo van en español, las
             cadenas que se renderizan no.

             Y es concreto porque es lo que se le pide al cliente. `ratio`
             vacío: el contenedor ya impone el 4:3. */
          <PhotoPending
            brief={`${evento.title} at ${evento.space}, at night, with people`}
            ratio=""
            className="h-full rounded-none border-0"
          />
        ) : (
          <Image
            src={evento.image}
            alt={evento.imageAlt ?? ''}
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
            className="object-cover transition-transform duration-250 ease-brand group-hover:scale-[1.03]"
          />
        )}
      </div>

      <div className={`flex flex-1 flex-col ${bloque.fondo} p-[22px]`}>
        {/*
          El tag dice CUÁNDO y nada más. `whenLabel` devuelve «Every Thursday ·
          6 PM – 8 PM», que repite la hora del pie de la card y además parte la
          píldora en dos renglones. Acá alcanza con el día — la hora exacta está
          doce píxeles más abajo.
        */}
        <span
          className={`w-fit rounded-pill border px-[10px] py-[3px] eyebrow ${bloque.borde} ${bloque.sub}`}
        >
          {esHoy
            ? 'Tonight'
            : evento.weekday !== null
              ? weekdayLabel(evento.weekday)
              : whenLabel(evento)}
        </span>

        <Heading level={3} role="card" className={`mt-[12px] ${bloque.texto}`}>
          {evento.title}
        </Heading>

        <p className={`mt-[8px] text-[15px] leading-[1.55] ${bloque.sub}`}>{evento.summary}</p>

        {/* El pie es un dato —hora y espacio—, no una etiqueta de bloque. Iba
            en versalita a 13px y competía con el tag de arriba, que sí lo es. */}
        <span className={`mt-auto pt-[16px] font-body text-[15px] tabular-nums ${bloque.sub}`}>
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
  const ordenados = [...deHoy, ...resto].slice(0, 3);

  const trucks = activeTrucks();

  return (
    <Section tone="paper" band="lg" labelledBy="whats-on-title">
      <div className="flex flex-col gap-[10px] sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Eyebrow tone="deep">What&rsquo;s on</Eyebrow>
          <Heading level={2} id="whats-on-title" className="mt-gap-kicker">
            {cerradoHoy ? 'Closed today, back Wednesday' : 'This week in the yard'}
          </Heading>
        </div>
        <ArrowLink href="/whats-on" className="shrink-0 text-deep">
          Full calendar
        </ArrowLink>
      </div>

      <StaggerGroup as="ul" className="mt-[40px] grid gap-[20px] sm:grid-cols-2 lg:grid-cols-3">
        {ordenados.map((evento, i) => (
          <RevealItem as="li" key={evento.slug}>
            <EventCard
              evento={evento}
              bloque={BLOQUES[i % BLOQUES.length]}
              esHoy={hoy !== null && evento.weekday === hoy}
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
      <div className="mt-[36px] border-t border-ink/12 pt-[24px]">
        <div className="flex flex-col gap-[6px] sm:flex-row sm:items-baseline sm:justify-between">
          <Eyebrow tone="terra">In the yard</Eyebrow>
          <ArrowLink href="/food-trucks" className="shrink-0 text-deep">
            All four trucks
          </ArrowLink>
        </div>
        <p className="mt-[10px] text-[16px] leading-[1.6] text-body/75">
          {trucks.map((t) => t.name).join(' · ')}. The roster rotates, and each truck takes its own
          orders and its own payment.
        </p>
        <p className="mt-[12px] text-[16px] text-body/75">
          <span className="eyebrow text-deep">Happy hour</span>{' '}
          <span className="ml-[6px]">
            {HAPPY_HOUR.days}, {HAPPY_HOUR.time} — {HAPPY_HOUR.deals.join(' · ')}
          </span>
        </p>
      </div>
    </Section>
  );
}
