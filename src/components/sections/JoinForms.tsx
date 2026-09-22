'use client';

import { useActionState } from 'react';
import { submitArtist, submitJob } from '@/app/actions/join';
import { IDLE } from '@/app/actions/types';
import {
  CheckboxMatrix,
  DateField,
  FieldRows,
  FileField,
  FormShell,
  RadioGroup,
  SubmitButton,
  TextAreaField,
  TextField,
} from '@/components/form/Fields';
import { Eyebrow, Heading } from '@/components/shared/Type';
import {
  DAYS,
  EDU_COLS,
  EDU_ROWS,
  EMPLOYMENT_TYPE,
  HISTORY_COLS,
  HISTORY_ROWS,
  MAX_FILE_MB,
  MAX_IMAGE_MB,
  SHIFTS,
  YES_NO,
} from '@/lib/schemas/join';
import type { ActionState } from '@/app/actions/types';

/**
 * Los DOS formularios de `/join-us`, uno por carril.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ DESDE EL 2026-09-22 NINGUNO DE LOS DOS ES NUESTRO: son calcos de lo que
 * el cliente ya usa. El de trabajo repite, campo por campo y en su orden, la
 * hoja que publica para imprimir —`public/docs/rooftop-at-riverside-job-
 * application.pdf`—; el de artistas repite el formulario «Want to perform at
 * Rooftop? Tell us more» de su sitio.
 *
 * El porqué está largo en `lib/schemas/join.ts`, y se resume en una frase: el
 * papel y la web tienen que pedir lo mismo, o quien recibe termina con dos
 * planillas que no se pueden comparar.
 *
 * ⚠️ CADA UNO TIENE SU SCHEMA, SU SERVER ACTION Y SU MENSAJE DE ÉXITO, y son
 * distintos a propósito. Al músico se le dice que vamos por lotes porque
 * programamos la mayoría de las semanas; a quien busca trabajo se le dice a
 * qué buzón fue y que si el archivo no pasó, responda el mail. Un «gracias, te
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

/**
 * Un rótulo de bloque adentro del formulario.
 *
 * ⚠️ EXISTE PORQUE EL PAPEL LO TIENE: «PERSONAL INFORMATION», «EDUCATIONAL
 * BACKGROUND», «EMPLOYMENT HISTORY» son los tres encabezados del PDF, y sin
 * ellos el calco serían veinte campos seguidos sin un solo descanso. Es lo que
 * deja seguir los dos documentos en paralelo, que es la razón del calco.
 *
 * ⚠️ NO ES UN `<h3>`. Estos formularios viven dentro de una `FormSlab` cuyo
 * `<h2>` es el título del carril, y meter encabezados de verdad adentro del
 * `<form>` mete tres entradas más en el esquema del documento por algo que es
 * un separador visual. Los grupos que necesitan nombre accesible ya lo tienen:
 * cada `<fieldset>` trae su `<legend>`.
 */
function Bloque({ children }: { readonly children: React.ReactNode }) {
  return (
    <p
      aria-hidden="true"
      className="mt-[12px] border-t border-ink/15 pt-[24px] font-body text-caption font-bold uppercase tracking-[0.12em] text-body/70"
    >
      {children}
    </p>
  );
}

/* ── 1. Trabajo ─────────────────────────────────────────────────────────── */

/*
 * ⚠️ LAS ETIQUETAS SON LAS DEL PAPEL, INCLUIDAS LAS QUE NO ESCRIBIRÍAMOS ASÍ.
 * «Position» a secas, «City/State», «Zipcode». Cambiarlas por algo más
 * amable —«What you want to do»— rompe el paralelo con la hoja impresa, que es
 * lo único que este formulario tiene que sostener.
 */
const JOB_LABELS: Record<string, string> = {
  position: 'Position',
  employmentType: 'Employment type',
  availability: 'Availability',
  firstName: 'First name',
  lastName: 'Last name',
  phone: 'Phone',
  email: 'Email',
  address: 'Address',
  cityState: 'City / State',
  zipcode: 'Zipcode',
  license: 'Valid driver license or ID card',
  eligible: 'Eligible for employment in the U.S.',
  transport: 'Reliable transportation',
  education: 'Educational background',
  history: 'Employment history',
  startDate: 'Expected start date',
  resume: 'Resume and portfolio',
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
        <TextField
          name="position"
          label={JOB_LABELS.position}
          required
          hint="Bar, kitchen, floor, whatever"
        />
        <RadioGroup
          name="employmentType"
          legend={JOB_LABELS.employmentType}
          options={EMPLOYMENT_TYPE.map((e) => ({ value: e.value, label: e.label }))}
        />
      </div>

      <CheckboxMatrix
        name="availability"
        legend={JOB_LABELS.availability}
        hint="Tick the mornings and afternoons you can work"
        rows={DAYS}
        cols={SHIFTS.map((s) => ({ value: s.value, label: s.label }))}
      />

      <Bloque>Personal information</Bloque>

      {/* El reparto de las columnas es el del papel: los nombres a la
          izquierda, teléfono y mail a la derecha. */}
      <div className="grid gap-[16px] sm:grid-cols-2">
        <TextField
          name="firstName"
          label={JOB_LABELS.firstName}
          required
          autoComplete="given-name"
        />
        <TextField name="phone" label={JOB_LABELS.phone} type="tel" required autoComplete="tel" />
      </div>
      <div className="grid gap-[16px] sm:grid-cols-2">
        <TextField
          name="lastName"
          label={JOB_LABELS.lastName}
          required
          autoComplete="family-name"
        />
        <TextField
          name="email"
          label={JOB_LABELS.email}
          type="email"
          required
          autoComplete="email"
        />
      </div>

      {/* En el papel «Address» es una caja alta, no un renglón. */}
      <TextAreaField
        name="address"
        label={JOB_LABELS.address}
        required
        rows={2}
        autoComplete="street-address"
      />

      <div className="grid gap-[16px] sm:grid-cols-2">
        <TextField
          name="cityState"
          label={JOB_LABELS.cityState}
          required
          autoComplete="address-level2"
        />
        <TextField
          name="zipcode"
          label={JOB_LABELS.zipcode}
          required
          autoComplete="postal-code"
        />
      </div>

      {/*
        Las tres preguntas de sí o no, con la redacción del papel. «Of ID Card»
        del original es una errata por «or ID card» y se corrige acá: copiar un
        error de tipeo no es fidelidad, es copiar un error.
      */}
      <div className="flex flex-col gap-[20px]">
        <RadioGroup
          name="license"
          legend="Do you have a valid driver license or ID card?"
          options={YES_NO.map((y) => ({ value: y.value, label: y.label }))}
        />
        <RadioGroup
          name="eligible"
          legend="Are you eligible for employment in the U.S.?"
          options={YES_NO.map((y) => ({ value: y.value, label: y.label }))}
        />
        <RadioGroup
          name="transport"
          legend="Do you have reliable transportation?"
          options={YES_NO.map((y) => ({ value: y.value, label: y.label }))}
        />
      </div>

      {/*
        ⚠️ ESTAS DOS NO LLEVAN <Bloque> ARRIBA Y EL RESTO SÍ. El rótulo de
        bloque repetiría palabra por palabra el <legend> del fieldset, que ya
        está ahí y que además es el nombre accesible del grupo: se veía
        «EDUCATIONAL BACKGROUND» y tres píxeles abajo «Educational background».
        Lo que hacía falta del <Bloque> era el filete que separa, y eso lo pone
        el envoltorio.
      */}
      <div className="mt-[12px] border-t border-ink/15 pt-[24px]">
        <FieldRows
          name="education"
          prefix="edu"
          legend={JOB_LABELS.education}
          cols={EDU_COLS}
          rows={EDU_ROWS}
        />
      </div>

      <div className="mt-[12px] border-t border-ink/15 pt-[24px]">
        <FieldRows
          name="history"
          prefix="job"
          legend={JOB_LABELS.history}
          cols={HISTORY_COLS}
          rows={HISTORY_ROWS}
        />
      </div>

      <div className="mt-[12px] border-t border-ink/15 pt-[24px]">
        <DateField name="startDate" label={JOB_LABELS.startDate} required />
      </div>

      <FileField
        name="resume"
        label={JOB_LABELS.resume}
        hint="Both in one file is fine"
        accept=".pdf,.doc,.docx"
        maxMb={MAX_FILE_MB}
      />

      <div className="flex flex-wrap items-center gap-[16px]">
        <SubmitButton idle="Send application" busy="Sending…" />
      </div>
    </FormShell>
  );
}

/* ── 2. Artistas ────────────────────────────────────────────────────────── */

/*
 * ⚠️ LAS DIEZ ETIQUETAS SON LAS DEL FORMULARIO DEL CLIENTE, con su redacción:
 * «Band Name», «Social media link», «Genre of music/entertainment», «Video
 * link». Lo único que se corrige es el «(Youtube, Facebook, ect.)» del
 * original, que va con la errata adentro.
 */
const ART_LABELS: Record<string, string> = {
  firstName: 'First name',
  lastName: 'Last name',
  email: 'Email',
  phone: 'Phone',
  band: 'Band name',
  social: 'Social media link',
  genre: 'Genre of music or entertainment',
  video: 'Video link',
  logo: 'Band logo',
  photo: 'Band photo',
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
        <TextField
          name="firstName"
          label={ART_LABELS.firstName}
          required
          autoComplete="given-name"
        />
        <TextField
          name="lastName"
          label={ART_LABELS.lastName}
          required
          autoComplete="family-name"
        />
      </div>
      <div className="grid gap-[16px] sm:grid-cols-2">
        <TextField
          name="email"
          label={ART_LABELS.email}
          type="email"
          required
          autoComplete="email"
        />
        <TextField name="phone" label={ART_LABELS.phone} type="tel" required autoComplete="tel" />
      </div>
      <div className="grid gap-[16px] sm:grid-cols-2">
        <TextField name="band" label={ART_LABELS.band} />
        <TextField
          name="social"
          label={ART_LABELS.social}
          type="url"
          hint="Instagram, Facebook"
        />
      </div>
      <div className="grid gap-[16px] sm:grid-cols-2">
        <TextField name="genre" label={ART_LABELS.genre} hint="Rough is fine" />
        {/*
          ⚠️ EL `hint` DICE QUE ES LO QUE MÁS IMPORTA, y el campo sigue siendo
          opcional. El formulario del cliente no lo marca con asterisco y esto
          es un calco, así que la regla no se endurece acá; lo que sí se puede
          hacer es decir la verdad al lado del campo, que sin algo para
          escuchar o mirar la solicitud no se puede evaluar. Lo mismo dice la
          columna de la izquierda de la página.
        */}
        <TextField
          name="video"
          label={ART_LABELS.video}
          type="url"
          hint="YouTube or Facebook. What gets you booked"
        />
      </div>

      <div className="grid gap-[16px] sm:grid-cols-2">
        <FileField
          name="logo"
          label={ART_LABELS.logo}
          accept="image/jpeg,image/png,image/webp,image/avif"
          maxMb={MAX_IMAGE_MB}
        />
        <FileField
          name="photo"
          label={ART_LABELS.photo}
          accept="image/jpeg,image/png,image/webp,image/avif"
          maxMb={MAX_IMAGE_MB}
        />
      </div>

      <div className="flex flex-wrap items-center gap-[16px]">
        <SubmitButton idle="Send your material" busy="Sending…" />
      </div>
    </FormShell>
  );
}
