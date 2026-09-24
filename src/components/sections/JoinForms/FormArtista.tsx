'use client';

import { submitArtist } from '@/app/actions/join';
import {
  FileField,
  FormShell,
  SubmitButton,
  TextField,
  useSubmission,
} from '@/components/form/Fields';
import { artistFromForm, artistSchema, MAX_IMAGE_MB, MAX_REQUEST_MB } from '@/lib/schemas/join';
import { Exito } from './Compartido';

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
