import Image from 'next/image';
import { ButtonLink } from '@/components/shared/Button';
import { Eyebrow, Heading } from '@/components/shared/Type';
import {
  GIVEAWAY_HEADING,
  GIVEAWAY_JERSEYS,
  GIVEAWAY_JERSEY_INTRO,
  GIVEAWAY_STEPS,
  NFC_NORTH_EYEBROW,
  NFC_NORTH_HEADING,
  NFC_NORTH_LEAD,
  SPECIALS_HEADING,
  SPECIALS_NOTE,
  SUNDAY_SPECIALS,
  WHATS_HAPPENING_CTA,
  WHATS_HAPPENING_NOTE,
} from '@/content/nfc-north';

export default function NfcNorthSundays() {
  return (
    <div id="nfc-north-hq" className="mt-14 scroll-mt-28 text-left lg:mt-20">
      <div className="text-center">
        <Eyebrow tone="cream">{NFC_NORTH_EYEBROW}</Eyebrow>
        <Heading
          level={2}
          id="nfc-north-title"
          className="mx-auto mt-3 max-w-[18ch] text-d3 leading-[0.98] text-paper sm:text-d2 lg:text-d1"
        >
          {NFC_NORTH_HEADING}
        </Heading>
        <p className="mx-auto mt-5 max-w-[56ch] font-body text-lead font-light text-bone">
          {NFC_NORTH_LEAD}
        </p>
      </div>

      <div className="relative mt-10 rounded-frame bg-bone grain px-6 py-9 text-ink sm:px-10 lg:mt-14 lg:px-14 lg:py-12">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-3.5 rounded-shell border border-dashed border-teal600/55"
        />
        <div className="relative">
          <Heading level={3} className="m-0 text-center text-d4 leading-none text-deep lg:text-d3">
            {GIVEAWAY_HEADING}
          </Heading>
          <ol className="m-0 mt-8 grid list-none gap-6 p-0 md:grid-cols-3 md:gap-0 md:divide-x md:divide-dashed md:divide-ink/20">
            {GIVEAWAY_STEPS.map((s, i) => (
              <li key={s.title} className="flex flex-col items-center gap-2 text-center md:px-6">
                <span
                  aria-hidden="true"
                  className="font-display text-d3 leading-none tabular-nums text-sunset-deep"
                >
                  {i + 1}
                </span>
                <span className="font-display text-d6 uppercase tracking-eyebrow text-deep">
                  {s.title}
                </span>
                <span className="font-body text-base text-ink/80">{s.body}</span>
              </li>
            ))}
          </ol>
          <p className="m-0 mt-8 text-center font-body text-base font-semibold text-ink">
            {GIVEAWAY_JERSEY_INTRO}
          </p>
          <ul className="m-0 mt-4 grid list-none grid-cols-2 gap-3 p-0 lg:grid-cols-4">
            {GIVEAWAY_JERSEYS.map((j) => (
              <li
                key={j.team}
                className="flex flex-col items-center gap-1 rounded-btn bg-paper px-3 py-4 text-center ring-1 ring-fog"
              >
                <span className="text-caption font-bold uppercase tracking-[0.08em] text-teal600">
                  {j.team}
                </span>
                <span className="font-display text-d7 uppercase leading-tight text-deep sm:text-d6">
                  {j.player}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-12 lg:mt-16">
        <div className="text-center">
          <Heading level={3} className="m-0 text-d4 leading-none text-paper lg:text-d3">
            {SPECIALS_HEADING}
          </Heading>
          <p className="mx-auto mt-3 max-w-[52ch] font-body text-base font-light text-bone/90">
            {SPECIALS_NOTE}
          </p>
        </div>
        <ul className="m-0 mt-8 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {SUNDAY_SPECIALS.map((d) => (
            <li
              key={d.name}
              className="relative flex flex-col gap-3 overflow-hidden rounded-shell bg-bone p-6 text-ink card-shadow"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-5 -right-5 w-[88px] opacity-15"
              >
                <Image src="/brand/emblem.svg" alt="" width={260} height={260} className="h-auto w-full" />
              </span>
              <span className="relative text-caption font-bold uppercase tracking-[0.08em] text-teal600">
                {d.team}
              </span>
              <span className="relative font-display text-d2 leading-none tabular-nums text-sunset-deep">
                {d.price}
              </span>
              <Heading level={4} role="label" className="relative m-0 text-deep">
                {d.name}
              </Heading>
              <p className="relative m-0 font-body text-base text-ink/80">{d.description}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12 text-center lg:mt-16">
        <p className="mx-auto m-0 max-w-[48ch] font-body text-lead font-light text-bone">
          {WHATS_HAPPENING_NOTE}
        </p>
        <div className="mt-6 flex justify-center">
          <ButtonLink href="/whats-on" variant="onDark" size="lg">
            {WHATS_HAPPENING_CTA}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
