'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLink } from '@/components/shared/Button';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading } from '@/components/shared/Type';
import { EVENTS, type VenueEvent, type Weekday, timeRange } from '@/content/events';
import { activeTrucks } from '@/content/trucks';

/**
 * «Tonight at the Yard» — qué trucks y qué música hay HOY.
 *
 * Es el módulo más importante del sitio y ningún competidor de la zona lo
 * tiene. También es la razón por la que alguien vuelve a entrar a la web una
 * segunda vez.
 *
 * ⚠️ Client component porque necesita saber qué día es en Bonita Springs. El
 * servidor no puede: una página cacheada mostraría el jueves un martes.
 * El servidor pinta el estado de fallback —que ya es útil— y el día real
 * aparece al montar. Sin esto habría mismatch de hidratación.
 *
 * ⚠️ FALLBACK ELEGANTE, que es lo que pide el brief. Hay dos huecos de datos
 * distintos y se tratan distinto:
 *
 *   MÚSICA   sale de `content/events.ts`. Si hoy no hay nada cargado, no
 *            inventa: dice que hoy no hay programación y ofrece el calendario.
 *   TRUCKS   la rotación diaria NO EXISTE como dato todavía. Así que en vez de
 *            fingir un «hoy están estos cuatro», el módulo muestra el roster
 *            completo y dice la verdad: los trucks rotan, mirá el calendario.
 *            Cuando el cliente entregue la grilla de rotación, esto se
 *            reemplaza por los trucks del día y nada más cambia.
 */

function venueWeekday(): Weekday {
  const label = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
  }).format(new Date());
  const map: Record<string, Weekday> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return map[label] ?? 0;
}

const CLOSED_DAYS: readonly Weekday[] = [1, 2];

export default function TonightAtTheYard() {
  const [today, setToday] = useState<Weekday | null>(null);
  useEffect(() => setToday(venueWeekday()), []);

  const trucks = activeTrucks();
  const todaysEvents: readonly VenueEvent[] =
    today === null ? [] : EVENTS.filter((e) => e.kind === 'recurring' && e.weekday === today);
  const isClosed = today !== null && CLOSED_DAYS.includes(today);

  return (
    <Section tone="cream" band="lg" labelledBy="tonight-title">
      <div className="flex flex-col gap-[10px] sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Eyebrow tone="deep">Tonight at the Yard</Eyebrow>
          <Heading level={2} id="tonight-title" className="mt-gap-kicker">
            {isClosed ? "We're closed today" : "What's happening right now"}
          </Heading>
        </div>
        <ArrowLink href="/whats-on" className="text-deep">
          Full calendar
        </ArrowLink>
      </div>

      <div className="mt-[40px] grid gap-[28px] lg:grid-cols-2 lg:gap-[48px]">
        {/* ── Música de hoy ───────────────────────────────────────────── */}
        <div className="flex flex-col rounded-card border border-ink/12 bg-paper p-[24px] lg:p-[32px]">
          <Eyebrow tone="magenta">On the stage</Eyebrow>

          {isClosed ? (
            <p className="mt-[16px] text-lead text-body/70">
              Monday and Tuesday we&rsquo;re dark. The yard opens back up Wednesday at 3.
            </p>
          ) : todaysEvents.length > 0 ? (
            <ul className="mt-[16px] flex flex-col gap-[2px]">
              {todaysEvents.map((e) => (
                <li key={e.slug}>
                  <Link
                    href={`/whats-on/${e.slug}`}
                    className="group flex items-baseline justify-between gap-[16px] border-b border-ink/10 py-[14px] last:border-0"
                  >
                    <span className="font-display text-d5 uppercase transition-colors group-hover:text-deep">
                      {e.title}
                    </span>
                    <span className="shrink-0 text-caption font-bold tabular-nums text-body/70">
                      {timeRange(e)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            /* Fallback: no inventa un evento. Dice qué pasa y hacia dónde ir. */
            <div className="mt-[16px]">
              <p className="text-lead text-body/70">
                {today === null
                  ? 'Loading tonight&rsquo;s lineup…'
                  : 'No live music on the books for today.'}
              </p>
              <p className="mt-[8px] text-[15px] text-body/60">
                The bar is open either way, and the calendar has the rest of the week.
              </p>
            </div>
          )}
        </div>

        {/* ── Trucks ──────────────────────────────────────────────────── */}
        <div className="flex flex-col rounded-card border border-ink/12 bg-paper p-[24px] lg:p-[32px]">
          <Eyebrow tone="terra">In the yard</Eyebrow>

          <ul className="mt-[16px] flex flex-col gap-[2px]">
            {trucks.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/food-trucks/${t.slug}`}
                  className="group flex items-baseline justify-between gap-[16px] border-b border-ink/10 py-[14px] last:border-0"
                >
                  <span className="font-display text-d5 uppercase transition-colors group-hover:text-deep">
                    {t.name}
                  </span>
                  <span className="shrink-0 text-caption text-body/70">{t.cuisine}</span>
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-[16px] text-[14px] leading-[1.55] text-body/60">
            The roster rotates. Check the calendar for which trucks are in on a given night — and
            remember each one takes its own orders and its own payment.
          </p>
        </div>
      </div>
    </Section>
  );
}
