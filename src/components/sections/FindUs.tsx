import Link from 'next/link';
import HoursCard from '@/components/shared/HoursCard';
import { Reveal, RevealItem, StaggerGroup } from '@/components/shared/Motion';
import { ArrowSquareOut, Facebook, Google, Instagram } from '@/components/shared/Icon';
import { BRAND, addressLine, mapsUrl } from '@/lib/brand';

/**
 * «Downtown, across from Riverside Park» — la conversión física.
 *
 * Cierra la home: dónde queda, cómo se llega, a qué hora abre y cómo se
 * contacta. Es la última sección clara antes del footer.
 *
 * ⚠️ YA NO ES CLIENT COMPONENT. Lo era entera por una sola cosa —saber qué
 * día es hoy para resaltar la fila de horarios— y eso ahora vive en
 * `shared/HoursCard.tsx`. Todo lo demás se renderiza en el servidor. Ver la
 * nota de ese archivo.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ EL TITULAR ESTÁ PARTIDO EN DOS Y ES UNA SOLA FRASE: «Downtown, / across
 * from Riverside Park». La primera mitad a la izquierda con las redes al
 * lado, la segunda alineada a la derecha y en naranja.
 *
 * Es el mismo mecanismo del titular de eventos, y está a propósito: son las
 * dos últimas secciones de la home y el eco las emparenta. Pero acá la frase
 * dice una dirección, no un argumento — «Downtown» es el dato que la mitad de
 * la gente busca y por eso va primero, grande y solo.
 *
 * ⚠️ La segunda mitad va en `terra` y no en `sunset` como el prototipo: el
 * naranja sobre superficie clara da 2.35:1 y no pasa AA ni como titular. El
 * razonamiento completo está en el encabezado de `ThreeDoors.tsx`, que es
 * donde vive esa decisión para toda la home.
 *
 * ⚠️ LAS REDES VAN ACÁ ADEMÁS DE EN LA BARRA DE SERVICIO, y no es
 * duplicación por descuido. Arriba son tres iconos de 17px en una franja de
 * servicio: están para quien ya los busca. Acá son tres círculos de 62px en
 * la sección donde alguien decide si va — que es exactamente el momento en
 * que se quiere ver fotos recientes del lugar antes de salir de casa.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ La grilla es de TRES columnas iguales y el mapa es la del medio. Con el
 * mapa a un costado, las dos tarjetas verdes quedaban pegadas y se leían como
 * un solo bloque de 800px de verde. En el medio, cada tarjeta tiene su
 * respiro y el mapa hace de separador.
 *
 * ⚠️ Se monta con `-mt-22` sobre la banda de eventos, igual que
 * `HowThisPlaceWorks` sobre la de What's On. Los dos arcos son el mismo
 * gesto: la superficie clara emerge sobre la oscura.
 */

const SOCIAL = [
  { label: 'Instagram', href: BRAND.social.instagram, Icon: Instagram },
  { label: 'Facebook', href: BRAND.social.facebook, Icon: Facebook },
  { label: 'Google', href: BRAND.social.google, Icon: Google },
] as const;

export default function FindUs() {
  return (
    <section
      id="find-us"
      aria-labelledby="find-us-title"
      className="relative z-[3] -mt-22 rounded-t-band bg-bone pt-16 pb-14 lg:pt-32 lg:pb-26"
    >
      <div className="caja-ancha">
        <Reveal className="flex flex-wrap items-center gap-3">
          <h2
            id="find-us-title"
            className="m-0 flex-1 font-display text-banda font-extrabold uppercase leading-[0.88] text-ink"
          >
            {/* Las dos mitades, un solo h2. Ver la nota del encabezado. */}
            <span className="block">Downtown,</span>
            <span className="mt-1 block text-right text-terra">Across from Riverside Park</span>
          </h2>

          {/* ⚠️ Sin `order-*`: las redes van DESPUÉS del titular en el DOM y
              en pantalla, alineadas a la derecha por el `justify-between` del
              contenedor. Tenían `order-first` y quedaban a la izquierda de
              «Downtown,», que es al revés que el diseño. */}
          <ul className="flex list-none flex-wrap items-center justify-end gap-3 p-0">
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

        <StaggerGroup className="mt-11 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-stretch gap-7 lg:mt-20">
          {/* ── Contacto ─────────────────────────────────────────────── */}
          <RevealItem className="flex flex-col gap-6.5 rounded-shell bg-deep p-6.5 text-bone on-dark lg:p-9">
            <h3 className="m-0 font-display text-d5 font-bold uppercase leading-none tracking-[0.02em] text-paper">
              {BRAND.name}
            </h3>

            <div>
              <span className="mb-2.5 block font-body text-caption font-medium uppercase tracking-eyebrow text-cream">
                Contact
              </span>
              <a
                href={BRAND.contact.phoneHref}
                className="block font-body text-dato leading-[1.6] text-paper transition-colors duration-200 hover:text-cream"
              >
                {BRAND.contact.phone}
              </a>
              <a
                href={`mailto:${BRAND.contact.email}`}
                className="block font-body text-dato leading-[1.6] text-paper transition-colors duration-200 hover:text-cream"
              >
                {BRAND.contact.email}
              </a>
            </div>

            <div>
              <span className="mb-2.5 block font-body text-caption font-medium uppercase tracking-eyebrow text-cream">
                Location
              </span>
              <address className="m-0 font-body text-dato leading-[1.6] text-paper not-italic">
                {addressLine()}
              </address>
            </div>

            <div>
              <span className="mb-2.5 block font-body text-caption font-medium uppercase tracking-eyebrow text-cream">
                Parking
              </span>
              <p className="m-0 font-body text-dato font-light leading-[1.6] text-paper">
                Street parking on Old 41 and public lots around Riverside Park.{' '}
                <Link href="/visit#parking" className="border-b border-cream text-cream">
                  Details
                </Link>
              </p>
            </div>

            <a
              href={mapsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto flex min-h-11 w-fit items-center gap-3 rounded-pill bg-cream px-7 py-3.75 font-body text-micro font-medium uppercase tracking-cta text-ink transition-colors duration-200 hover:bg-paper"
            >
              Get directions
              <ArrowSquareOut className="size-4.25" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </RevealItem>

          {/* ── Mapa ─────────────────────────────────────────────────── */}
          {/* ⚠️ `loading="lazy"` es obligatorio y no una optimización: el
              embed de Maps trae su propio bundle y se carga incluso cuando la
              sección está tres pantallas más abajo. Es el recurso más pesado
              de la home. */}
          <RevealItem className="min-h-80 overflow-hidden rounded-shell border border-fog lg:min-h-110">
            <iframe
              title={`Map showing ${BRAND.name} at ${addressLine()}`}
              src={`https://maps.google.com/maps?q=${BRAND.address.mapsQuery}&z=15&output=embed`}
              loading="lazy"
              className="block size-full min-h-80 border-0 lg:min-h-110"
            />
          </RevealItem>

          {/* ── Horarios ─────────────────────────────────────────────── */}
          <RevealItem>
            <HoursCard />
          </RevealItem>
        </StaggerGroup>
      </div>
    </section>
  );
}
