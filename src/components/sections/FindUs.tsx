import { getVenue, venueAddressLine } from '@/lib/venue';
import { ButtonLink } from '@/components/shared/Button';
import HoursCard from '@/components/shared/HoursCard';
import { Reveal, RevealItem, StaggerGroup } from '@/components/shared/Motion';
import { Facebook, Google, Instagram } from '@/components/shared/Icon';
import { BRAND, addressLine, mapsUrl } from '@/lib/brand';

const SOCIAL = [
  { label: 'Instagram', href: BRAND.social.instagram, Icon: Instagram },
  { label: 'Facebook', href: BRAND.social.facebook, Icon: Facebook },
  { label: 'Google', href: BRAND.social.google, Icon: Google },
] as const;

export default async function FindUs({ id = 'find-us' }: { readonly id?: string } = {}) {
  const venue = await getVenue();
  const direccion = venueAddressLine(venue);

  return (
    <section
      id={id}
      aria-labelledby="find-us-title"
      className="relative z-[3] banda-arco bg-bone grano pt-16 pb-cierre scroll-mt-24 md:pt-20 lg:pt-24 desk:pt-32"
    >
      <div className="caja-ancha max-sm:[padding-inline:24px]">
        <Reveal className="relative flex flex-col items-start gap-6 md:block md:gap-0">
          <h2
            id="find-us-title"
            className="m-0 pr-6 font-display text-[clamp(2.8rem,7vw,6.6rem)] font-extrabold uppercase leading-[0.88] text-ink sm:pr-0"
          >
            <span className="block">Downtown,</span>{' '}
            <span className="mt-1 block text-sunset-deep md:mt-5 lg:mt-1">Across from Riverside Park</span>
          </h2>
          <ul className="flex w-full list-none flex-wrap items-center justify-start gap-3 p-0 md:absolute md:top-0 md:right-0 md:w-auto">
            {SOCIAL.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-13 place-items-center rounded-pill bg-deep text-cream transition-colors duration-200 hover:bg-sunset hover:text-ink lg:size-15.5"
                >
                  <Icon className="size-5.5 lg:size-6.5" />
                  <span className="sr-only">{label} (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
        <StaggerGroup className="mt-bloque grid grid-cols-1 items-stretch gap-7 md:grid-cols-2 lg:grid-cols-3">
          <RevealItem className="order-3 flex flex-col gap-6.5 rounded-shell bg-deep p-6.5 text-bone on-dark sombra-card lg:order-1 lg:p-9">
            <h3 className="m-0 font-display text-d5 font-bold uppercase leading-none tracking-[0.02em] text-paper">
              {BRAND.name}
            </h3>

            <div>
              <span className="mb-2.5 block font-body text-caption font-medium uppercase tracking-eyebrow text-cream">
                Contact
              </span>
              <a
                href={venue.phoneHref}
                className="block font-body text-dato leading-[1.6] text-paper transition-colors duration-200 hover:text-cream"
              >
                {venue.phone}
              </a>
              <a
                href={`mailto:${venue.email}`}
                className="block font-body text-dato leading-[1.6] text-paper transition-colors duration-200 hover:text-cream"
              >
                {venue.email}
              </a>
            </div>

            <div>
              <span className="mb-2.5 block font-body text-caption font-medium uppercase tracking-eyebrow text-cream">
                Location
              </span>
              <address className="m-0 font-body text-dato leading-[1.6] text-paper not-italic">
                {direccion}
              </address>
            </div>

            <div>
              <span className="mb-2.5 block font-body text-caption font-medium uppercase tracking-eyebrow text-cream">
                Parking
              </span>
              <p className="m-0 font-body text-dato font-light leading-[1.6] text-paper">
                Street parking on Old 41 and public lots around Riverside Park.
              </p>
            </div>
            <ButtonLink
              href={venue.mapsUrl}
              external
              variant="onDark"
              size="lg"
              className="mt-auto w-fit"
            >
              Get directions
            </ButtonLink>
          </RevealItem>
          <RevealItem className="order-1 min-h-80 overflow-hidden rounded-shell border border-fog sombra-card md:col-span-2 lg:order-2 lg:col-span-1 lg:min-h-110">
            <iframe
              title={`Map showing ${venue.name} at ${direccion}`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(direccion)}&z=15&output=embed`}
              loading="lazy"
              className="block size-full min-h-80 border-0 lg:min-h-110"
            />
          </RevealItem>
          <RevealItem className="order-2 lg:order-3">
            <HoursCard />
          </RevealItem>
        </StaggerGroup>
      </div>
    </section>
  );
}
