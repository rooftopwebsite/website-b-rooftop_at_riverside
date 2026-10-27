'use client';

import { submitJob } from '@/app/actions/join';
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
  useSubmission,
} from '@/components/form/Fields';
import {
  DAYS,
  EDU_COLS,
  EDU_ROWS,
  EMPLOYMENT_TYPE,
  HISTORY_COLS,
  HISTORY_ROWS,
  jobFromForm,
  jobSchema,
  MAX_FILE_MB,
  MAX_REQUEST_MB,
  SHIFTS,
  YES_NO,
} from '@/lib/schemas/join';
import { Block, Success } from './Shared';

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
      <Success eyebrow="Application sent" title="It landed">
        {state.message}
      </Success>
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

      <Block>Personal information</Block>
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
