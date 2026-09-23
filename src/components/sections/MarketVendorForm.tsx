'use client';

import { submitMarketVendor } from '@/app/actions/market-vendor';
import {
  CheckboxGroup,
  FormShell,
  SelectField,
  SentPanel,
  SubmitButton,
  TextAreaField,
  TextField,
  useSubmission,
} from '@/components/form/Fields';
import { marketVendorFromForm, marketVendorSchema } from '@/lib/schemas/market-vendor';
import { Eyebrow, Heading } from '@/components/shared/Type';
import { PRODUCT_CATEGORIES, VENDOR_NEEDS } from '@/content/market';
import { useVenue } from '@/components/shared/VenueProvider';

const LABELS: Record<string, string> = {
  business: 'Business name',
  name: 'Your name',
  email: 'Email',
  phone: 'Phone',
  link: 'Website or Instagram',
  category: 'What you sell',
  products: 'Describe your products',
  dates: 'Which market dates',
  needs: 'What you need from us',
  insurance: 'Do you carry insurance',
  message: 'Anything else',
};

export default function MarketVendorForm() {
  const venue = useVenue();
  const submission = useSubmission(submitMarketVendor);
  const { state } = submission;

  if (state.status === 'ok') {
    return (
      <SentPanel
        className="rounded-card border border-ink/15 bg-cream sombra-card p-[32px] lg:p-[40px]"
      >
        <Eyebrow tone="deep">Request received</Eyebrow>
        <Heading level={3} className="mt-gap-kicker text-d5 lg:text-d4">
          We&rsquo;ll be in touch
        </Heading>
        <p className="mt-gap-bajada max-w-[52ch] text-lead text-body/80">{state.message}</p>
        <p className="mt-3 max-w-[52ch] text-[16px] leading-[1.65] text-body/75">
          If you would rather talk it through, call{' '}
          <a href={venue.phoneHref} className="link-texto font-bold">
            {venue.phone}
          </a>
          .
        </p>
      </SentPanel>
    );
  }

  return (
    <FormShell
      submission={submission}
      schema={marketVendorSchema}
      fromForm={marketVendorFromForm}
    >
      <fieldset className="flex flex-col gap-[16px]">
        <legend className="eyebrow mb-[6px] text-body/75">Your business</legend>
        <TextField name="business" label={LABELS.business} required autoComplete="organization" />
        <div className="grid gap-[16px] sm:grid-cols-2">
          <TextField name="name" label={LABELS.name} required autoComplete="name" />
          <TextField name="email" label={LABELS.email} type="email" required autoComplete="email" />
        </div>
        <div className="grid gap-[16px] sm:grid-cols-2">
          <TextField name="phone" label={LABELS.phone} type="tel" required autoComplete="tel" />
          <TextField
            name="link"
            label={LABELS.link}
            required
            hint="A link or an @handle"
          />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-[16px]">
        <legend className="eyebrow mb-[6px] text-body/75">What you make</legend>
        <SelectField
          name="category"
          label={LABELS.category}
          required
          placeholder="Choose one"
          options={PRODUCT_CATEGORIES.map((c) => ({ value: c, label: c }))}
        />
        <TextAreaField
          name="products"
          label={LABELS.products}
          required
          rows={4}
          maxLength={2000}
          hint="A sentence or two is plenty"
        />
      </fieldset>

      <fieldset className="flex flex-col gap-[16px]">
        <legend className="eyebrow mb-[6px] text-body/75">The logistics</legend>
        <TextField
          name="dates"
          label={LABELS.dates}
          required
          hint="Which ones you are after"
        />
        <CheckboxGroup
          name="needs"
          legend={LABELS.needs}
          options={VENDOR_NEEDS.map((n) => ({ value: n.value, label: n.label }))}
        />
        <SelectField
          name="insurance"
          label={LABELS.insurance}
          required
          placeholder="Choose one"
          options={[
            { value: 'yes', label: 'Yes, I carry insurance' },
            { value: 'no', label: 'No, I do not' },
          ]}
        />
        <TextAreaField name="message" label={LABELS.message} rows={3} maxLength={2000} />
      </fieldset>

      <div className="flex flex-wrap items-center gap-[16px]">
        <SubmitButton idle="Apply for a booth" busy="Sending…" />
        <p className="text-[15px] text-body/70">We answer within one business day.</p>
      </div>
    </FormShell>
  );
}
