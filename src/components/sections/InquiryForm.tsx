'use client';

import { submitEventInquiry } from '@/app/actions/event-inquiry';
import {
  CheckboxGroup,
  DateField,
  FormShell,
  SelectField,
  SentPanel,
  SubmitButton,
  TextAreaField,
  TextField,
  useRadioGroup,
  useSubmission,
} from '@/components/form/Fields';
import { Eyebrow, Heading } from '@/components/shared/Type';
import { todayInFlorida, inquiryFromForm, inquirySchema } from '@/lib/schemas/event-inquiry';
import {
  AREAS_OF_INTEREST,
  BAR_TIERS,
  BUDGET_RANGES,
  EVENT_SUBTYPES,
  FOOD_TIERS,
  GUEST_RANGES,
  REFERRAL_SOURCES,
} from '@/content/spaces';

const LABELS: Record<string, string> = {
  name: 'Your name',
  email: 'Email',
  phone: 'Phone',
  company: 'Company',
  eventType: 'Type of event',
  date: 'Event date',
  altDate: 'A second date that works',
  startTime: 'Start time',
  endTime: 'End time',
  guests: 'Guest count',
  budget: 'Rough budget',
  areas: 'What you are interested in',
  foodTier: 'Food tier',
  barTier: 'Bar package',
  comments: 'Anything else',
  referral: 'How did you hear about us?',
};

function Group({ children }: { readonly children: React.ReactNode }) {
  return <legend className="eyebrow mb-[6px] text-body/75">{children}</legend>;
}

export default function InquiryForm({
  defaultAreas,
}: {
  readonly defaultAreas?: readonly string[];
} = {}) {
  const submission = useSubmission(submitEventInquiry);
  const { state } = submission;
  const today = todayInFlorida();

  if (state.status === 'ok') {
    return (
      <SentPanel
        className="rounded-card border border-ink/15 bg-cream card-shadow p-[32px] lg:p-[48px]"
      >
        <Eyebrow tone="deep">Request received</Eyebrow>
        <Heading level={2} className="mt-gap-kicker text-d4">
          We&rsquo;ll come back within 24–48 hours
        </Heading>
        <p className="mt-gap-subhead max-w-[54ch] text-lead text-body/80">{state.message}</p>
        <p className="mt-3 max-w-[54ch] text-[16px] leading-[1.65] text-body/75">
          Rental rates, food options and the fees are all on this page if you want them now.
        </p>
      </SentPanel>
    );
  }

  return (
    <FormShell submission={submission} schema={inquirySchema} fromForm={inquiryFromForm}>
      <fieldset className="flex flex-col gap-[16px]">
        <Group>About you</Group>
        <div className="grid gap-[16px] sm:grid-cols-2">
          <TextField name="name" label={LABELS.name} required autoComplete="name" />
          <TextField name="email" label={LABELS.email} type="email" required autoComplete="email" />
          <TextField name="phone" label={LABELS.phone} type="tel" required autoComplete="tel" />
          <TextField
            name="company"
            label={LABELS.company}
            autoComplete="organization"
          />
        </div>
      </fieldset>
      <fieldset className="flex flex-col gap-[16px]">
        <Group>The event</Group>

        <SelectField
          name="eventType"
          label={LABELS.eventType}
          required
          placeholder="Choose one"
          options={EVENT_SUBTYPES.map((o) => ({ value: o, label: o }))}
        />
        <div className="grid gap-[16px] sm:grid-cols-2">
          <DateField name="date" label={LABELS.date} required min={today} />
          <DateField name="altDate" label={LABELS.altDate} min={today} />
        </div>
        <div className="grid gap-[16px] sm:grid-cols-2">
          <TextField name="startTime" label={LABELS.startTime} type="time" />
          <TextField name="endTime" label={LABELS.endTime} type="time" />
        </div>

        <div className="grid gap-[16px] sm:grid-cols-2">
          <SelectField
            name="guests"
            label={LABELS.guests}
            required
            placeholder="Choose a range"
            options={GUEST_RANGES.map((o) => ({ value: o, label: o }))}
          />
          <SelectField
            name="budget"
            label={LABELS.budget}
            required
            placeholder="Choose a range"
            options={BUDGET_RANGES.map((o) => ({ value: o, label: o }))}
          />
        </div>
        <div className="mt-[8px]">
          <CheckboxGroup
            name="areas"
            legend={LABELS.areas}
            options={AREAS_OF_INTEREST.map((a) => ({ value: a.value, label: a.label }))}
            defaultChecked={defaultAreas}
          />
        </div>
      </fieldset>
      <FoodTier />
      <fieldset className="flex flex-col gap-[16px]">
        <Group>The bar</Group>
        <SelectField
          name="barTier"
          label={LABELS.barTier}
          placeholder="Choose one"
          options={BAR_TIERS.map((o) => ({ value: o, label: o }))}
        />
      </fieldset>
      <fieldset className="flex flex-col gap-[16px]">
        <Group>Anything else</Group>
        <TextAreaField name="comments" label={LABELS.comments} rows={4} maxLength={4000} />
        <SelectField
          name="referral"
          label={LABELS.referral}
          placeholder="Choose one"
          options={REFERRAL_SOURCES.map((o) => ({ value: o, label: o }))}
        />
      </fieldset>

      <div className="flex flex-col gap-[12px] border-t border-ink/15 pt-[24px]">
        <p className="text-[15px] text-body/75">
          <span className="text-terra">*</span> Required
        </p>
        <div>
          <SubmitButton idle="Send the request" busy="Sending…" />
        </div>
      </div>
    </FormShell>
  );
}

function FoodTier() {
  const { eid, err, aria } = useRadioGroup('foodTier');
  return (
    <fieldset className="flex flex-col gap-[12px]">
      <legend className="eyebrow mb-[6px] text-body/75">
        Food tier <span className="text-terra">*</span>
      </legend>
      <p className="text-[15px] leading-[1.55] text-body/75">
        The trucks cook. We coordinate them. Pick how involved you want that to be.
      </p>
      <div className="grid gap-[12px] sm:grid-cols-3">
        {FOOD_TIERS.map((tier) => (
          <label
            key={tier.value}
            className="flex cursor-pointer flex-col gap-[6px] rounded-card border border-ink/20 bg-paper p-[16px] transition-colors hover:border-ink/45 has-[:checked]:border-2 has-[:checked]:border-ink has-[:checked]:bg-cream"
          >
            <span className="flex items-center gap-[10px]">
              <input
                type="radio"
                name="foodTier"
                value={tier.value}
                {...aria}
                className="h-[18px] w-[18px] accent-black"
              />
              <span className="font-body text-[16px] font-bold">{tier.label}</span>
            </span>
            <span className="text-[14px] leading-[1.5] text-body/75">{tier.hint}</span>
          </label>
        ))}
      </div>
      {err ? (
        <p id={eid} className="text-[15px] font-bold text-terra">
          {err}
        </p>
      ) : null}
    </fieldset>
  );
}
