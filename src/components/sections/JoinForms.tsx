'use client';

import { submitArtist, submitJob } from '@/app/actions/join';
import {
  CheckboxMatrix,
  DateField,
  FieldRows,
  FileField,
  FormShell,
  RadioGroup,
  SentPanel,
  SubmitButton,
  TextAreaField,
  TextField,
  useSubmission,
} from '@/components/form/Fields';
import { Eyebrow, Heading } from '@/components/shared/Type';
import {
  artistFromForm,
  artistSchema,
  DAYS,
  EDU_COLS,
  EDU_ROWS,
  EMPLOYMENT_TYPE,
  HISTORY_COLS,
  HISTORY_ROWS,
  jobFromForm,
  jobSchema,
  MAX_FILE_MB,
  MAX_IMAGE_MB,
  MAX_REQUEST_MB,
  SHIFTS,
  YES_NO,
} from '@/lib/schemas/join';

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
    <SentPanel className="rounded-card border border-ink/15 bg-cream sombra-card p-[28px] lg:p-[36px]">
      <Eyebrow tone="deep">{eyebrow}</Eyebrow>
      <Heading level={3} className="mt-gap-kicker text-d5 lg:text-d4">
        {titulo}
      </Heading>
      <p className="mt-gap-bajada max-w-[52ch] text-lead text-body/80">{children}</p>
    </SentPanel>
  );
}

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
  const submission = useSubmission(submitJob);
  const { state } = submission;

  if (state.status === 'ok') {
    return (
      <Exito eyebrow="Application sent" titulo="It landed">
        {state.message}
      </Exito>
    );
  }

  return (
    <FormShell
      submission={submission}
      schema={jobSchema}
      fromForm={jobFromForm}
      maxUploadMb={MAX_REQUEST_MB}
    >
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
  const submission = useSubmission(submitArtist);
  const { state } = submission;

  if (state.status === 'ok') {
    return (
      <Exito eyebrow="Material received" titulo="We&rsquo;ll listen">
        {state.message}
      </Exito>
    );
  }

  return (
    <FormShell
      submission={submission}
      schema={artistSchema}
      fromForm={artistFromForm}
      maxUploadMb={MAX_REQUEST_MB}
    >
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
          compress
        />
        <FileField
          name="photo"
          label={ART_LABELS.photo}
          accept="image/jpeg,image/png,image/webp,image/avif"
          maxMb={MAX_IMAGE_MB}
          compress
        />
      </div>

      <div className="flex flex-wrap items-center gap-[16px]">
        <SubmitButton idle="Send your material" busy="Sending…" />
      </div>
    </FormShell>
  );
}
