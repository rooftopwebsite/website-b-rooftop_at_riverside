'use client';

import { useActionState } from 'react';
import { submitArtist, submitJob } from '@/app/actions/join';
import { IDLE } from '@/app/actions/types';
import {
  CheckboxGroup,
  FileField,
  FormShell,
  RepeatableField,
  SelectField,
  SubmitButton,
  TextAreaField,
  TextField,
} from '@/components/form/Fields';
import { Eyebrow, Heading } from '@/components/shared/Type';
import { AVAILABILITY, DISCIPLINES, HEARD_FROM, MAX_FILE_MB } from '@/lib/schemas/join';
import type { ActionState } from '@/app/actions/types';

/**
 * Los DOS formularios de `/join-us`, uno por carril.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ CADA UNO TIENE SU SCHEMA, SU SERVER ACTION Y SU MENSAJE DE ÉXITO, y son
 * distintos a propósito. Al músico se le dice que vamos por lotes porque
 * programamos cinco noches por semana; a quien busca trabajo se le dice a qué
 * buzón fue y que si el archivo no pasó, responda el mail. Un «gracias, te
 * vamos a contactar» genérico no le sirve a ninguno de los dos.
 *
 * ⚠️ EL MENSAJE DE ÉXITO DEL TRABAJO ADMITE QUE EL ARCHIVO PUEDE NO HABER
 * LLEGADO. Hoy el adjunto se valida pero no se guarda: no hay destino de envío
 * definido. Decirle «recibimos tu CV» cuando el servidor lo descarta sería
 * mentir, y el costo lo paga la persona que se queda esperando.
 * ══════════════════════════════════════════════════════════════════════════
 */

function Exito({
  eyebrow,
  titulo,
  children,
}: {
  readonly eyebrow: string;
  readonly titulo: string;
  readonly children: React.ReactNode;
}) {
  return (
    <div
      role="status"
      className="rounded-card border border-ink/15 bg-cream sombra-card p-[28px] lg:p-[36px]"
    >
      <Eyebrow tone="deep">{eyebrow}</Eyebrow>
      <Heading level={3} className="mt-gap-kicker text-d5 lg:text-d4">
        {titulo}
      </Heading>
      <p className="mt-gap-bajada max-w-[52ch] text-lead text-body/80">{children}</p>
    </div>
  );
}

/* ── 1. Trabajo ─────────────────────────────────────────────────────────── */

const JOB_LABELS: Record<string, string> = {
  name: 'Your name',
  email: 'Email',
  phone: 'Phone',
  position: 'What you want to do',
  availability: 'When you can work',
  experience: 'What you have done before',
  resume: 'Resume',
  heard: 'How you heard about us',
  message: 'Anything else',
};

export function JobForm() {
  const [state, action] = useActionState<ActionState, FormData>(submitJob, IDLE);

  if (state.status === 'ok') {
    return (
      <Exito eyebrow="Application sent" titulo="It landed">
        {state.message}
      </Exito>
    );
  }

  return (
    <FormShell state={state} action={action} labels={JOB_LABELS}>
      <div className="grid gap-[16px] sm:grid-cols-2">
        <TextField name="name" label={JOB_LABELS.name} required autoComplete="name" />
        <TextField name="email" label={JOB_LABELS.email} type="email" required autoComplete="email" />
      </div>
      <div className="grid gap-[16px] sm:grid-cols-2">
        <TextField name="phone" label={JOB_LABELS.phone} type="tel" required autoComplete="tel" />
        <TextField
          name="position"
          label={JOB_LABELS.position}
          required
          hint="Bar, kitchen, floor, whatever"
        />
      </div>

      <CheckboxGroup
        name="availability"
        legend={JOB_LABELS.availability}
        options={AVAILABILITY.map((a) => ({ value: a.value, label: a.label }))}
      />

      <TextAreaField name="experience" label={JOB_LABELS.experience} required rows={4} />

      <FileField
        name="resume"
        label={JOB_LABELS.resume}
        hint="Optional"
        accept=".pdf,.doc,.docx"
        maxMb={MAX_FILE_MB}
      />

      <SelectField
        name="heard"
        label={JOB_LABELS.heard}
        required
        placeholder="Choose one"
        options={HEARD_FROM.map((h) => ({ value: h, label: h }))}
      />

      <TextAreaField name="message" label={JOB_LABELS.message} rows={3} hint="Optional" />

      <div className="flex flex-wrap items-center gap-[16px]">
        <SubmitButton idle="Send application" busy="Sending…" />
      </div>
    </FormShell>
  );
}

/* ── 2. Artistas ────────────────────────────────────────────────────────── */

const ART_LABELS: Record<string, string> = {
  act: 'Artist or band name',
  name: 'Your name',
  email: 'Email',
  phone: 'Phone',
  discipline: 'What you do',
  genre: 'Genre',
  links: 'Links',
  setLength: 'Typical set length',
  lineup: 'How many of you',
  availability: 'Which nights work',
  fee: 'What you usually charge',
  presskit: 'Press kit',
  message: 'Anything else',
};

export function ArtistForm() {
  const [state, action] = useActionState<ActionState, FormData>(submitArtist, IDLE);

  if (state.status === 'ok') {
    return (
      <Exito eyebrow="Material received" titulo="We&rsquo;ll listen">
        {state.message}
      </Exito>
    );
  }

  return (
    <FormShell state={state} action={action} labels={ART_LABELS}>
      <div className="grid gap-[16px] sm:grid-cols-2">
        <TextField name="act" label={ART_LABELS.act} required />
        <TextField name="name" label={ART_LABELS.name} required autoComplete="name" />
      </div>
      <div className="grid gap-[16px] sm:grid-cols-2">
        <TextField name="email" label={ART_LABELS.email} type="email" required autoComplete="email" />
        <TextField name="phone" label={ART_LABELS.phone} type="tel" required autoComplete="tel" />
      </div>
      <div className="grid gap-[16px] sm:grid-cols-2">
        <SelectField
          name="discipline"
          label={ART_LABELS.discipline}
          required
          placeholder="Choose one"
          options={DISCIPLINES.map((d) => ({ value: d, label: d }))}
        />
        <TextField name="genre" label={ART_LABELS.genre} required hint="Rough is fine" />
      </div>

      {/*
        ⚠️ ES EL CAMPO QUE MÁS IMPORTA de todo el formulario: sin algo que
        escuchar o mirar, la solicitud no se puede evaluar. El formulario que
        el cliente tiene hoy ya pide link de redes y link de video por
        separado; acá es un campo que se repite, así que quien tiene cinco los
        manda y quien tiene uno manda uno.
      */}
      <RepeatableField
        name="links"
        label={ART_LABELS.links}
        hint="At least one"
        placeholders={[
          'instagram.com/yourband',
          'open.spotify.com/artist/…',
          'youtube.com/watch?v=…',
          'Your portfolio',
          'Anything else',
        ]}
      />

      <div className="grid gap-[16px] sm:grid-cols-3">
        <TextField name="setLength" label={ART_LABELS.setLength} required hint="e.g. 2 × 45 min" />
        <TextField name="lineup" label={ART_LABELS.lineup} required hint="e.g. 4" />
        <TextField name="fee" label={ART_LABELS.fee} hint="Optional" />
      </div>

      <TextField
        name="availability"
        label={ART_LABELS.availability}
        required
        hint="Fridays, Saturdays, whatever"
      />

      <FileField
        name="presskit"
        label={ART_LABELS.presskit}
        hint="Optional"
        accept=".pdf,.doc,.docx"
        maxMb={MAX_FILE_MB}
      />

      <TextAreaField name="message" label={ART_LABELS.message} rows={3} hint="Optional" />

      <div className="flex flex-wrap items-center gap-[16px]">
        <SubmitButton idle="Send your material" busy="Sending…" />
      </div>
    </FormShell>
  );
}
