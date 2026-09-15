'use client';

import { useActionState } from 'react';
import { submitMarketVendor } from '@/app/actions/market-vendor';
import { IDLE } from '@/app/actions/types';
import {
  CheckboxGroup,
  FormShell,
  SelectField,
  SubmitButton,
  TextAreaField,
  TextField,
} from '@/components/form/Fields';
import { Eyebrow, Heading } from '@/components/shared/Type';
import { PRODUCT_CATEGORIES, VENDOR_NEEDS } from '@/content/market';
import { useVenue } from '@/components/shared/VenueProvider';

/**
 * El formulario de vendor del market.
 *
 * ⚠️ Usa los campos compartidos de `components/form/Fields.tsx`, los mismos
 * que el resto del sitio. No hay un control propio de esta página.
 *
 * ⚠️ EL SEGURO ES UN `<select>` Y NO DOS RADIOS. Son dos opciones excluyentes
 * y un radio group sería más idiomático, pero el sitio ya tiene un lenguaje
 * de select —altura, radio de píldora, padding medido— y meter un radio suelto
 * en un formulario de once campos rompe la columna. Cuando haya un segundo
 * caso de sí/no se extrae un `RadioGroup` al kit compartido.
 */

const LABELS: Record<string, string> = {
  business: 'Business name',
  name: 'Your name',
  email: 'Email',
  phone: 'Phone',
  website: 'Website or Instagram',
  category: 'What you sell',
  products: 'Describe your products',
  dates: 'Which market dates',
  needs: 'What you need from us',
  insurance: 'Do you carry insurance',
  message: 'Anything else',
};

export default function MarketVendorForm() {
  const venue = useVenue();
  const [state, action] = useActionState(submitMarketVendor, IDLE);

  if (state.status === 'ok') {
    return (
      <div
        role="status"
        className="rounded-card border border-ink/15 bg-cream sombra-card p-[32px] lg:p-[40px]"
      >
        <Eyebrow tone="deep">Request received</Eyebrow>
        <Heading level={3} className="mt-gap-kicker text-d5 lg:text-d4">
          We&rsquo;ll be in touch
        </Heading>
        <p className="mt-gap-bajada max-w-[52ch] text-lead text-body/80">{state.message}</p>
        <p className="mt-[16px] max-w-[52ch] text-[16px] leading-[1.65] text-body/75">
          If you would rather talk it through, call{' '}
          <a href={venue.phoneHref} className="link-texto font-bold">
            {venue.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <FormShell state={state} action={action} labels={LABELS}>
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
            name="website"
            label={LABELS.website}
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
          hint="Optional"
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
        <TextAreaField name="message" label={LABELS.message} rows={3} hint="Optional" />
      </fieldset>

      <div className="flex flex-wrap items-center gap-[16px]">
        <SubmitButton idle="Apply for a booth" busy="Sending…" />
        <p className="text-[15px] text-body/70">We answer within one business day.</p>
      </div>
    </FormShell>
  );
}
