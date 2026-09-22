import type { Metadata } from 'next';
import ContactForm from '@/components/sections/ContactForm';
import FindUs from '@/components/sections/FindUs';
import { ButtonLink } from '@/components/shared/Button';
import FormSlab from '@/components/shared/FormSlab';
import { Instagram } from '@/components/shared/Icon';
import PlateHero from '@/components/shared/PlateHero';
import { Heading } from '@/components/shared/Type';
import { BRAND, instagramHandle } from '@/lib/brand';
import { getVenue } from '@/lib/venue';
import { breadcrumbJsonLd, jsonLdScript, pageMeta, venueJsonLd } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  route: '/contact',
  image: {
    url: '/images/venue/contact-bar-day-wide.webp',
    width: 2576,
    height: 1364,
    alt: 'Guests at the bar at Rooftop at Riverside on a weekday afternoon',
  },
});

/**
 * `/contact` — los tres buzones, el formulario, los horarios y el mapa.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ REDISEÑADA EL 2026-09-21. La página estaba en un idioma propio y era la
 * única que quedaba así: abría con `ContactHero`, el encabezado COLLAGE
 * calcado de `defoodtruckclub.nl/contact`, con el titular monocromo, sin foto,
 * y el teléfono como una píldora gigante entrelazada con las letras.
 *
 * Camila, 2026-09-21: «contemplando cómo hiciste el formulario en plan an
 * event y cómo son los heros, diseñá las páginas de join us y contact».
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠️ EL HERO PASA A `PlateHero`, el de `/sunset-bar`, `/whats-on` y `/events`:
 * pregunta arriba, placa con la palabra en color, esquinas inversas y la foto
 * ancha que la placa muerde. Dos de las tres reglas fijas de hero del repo las
 * incumplía este archivo — el titular iba monocromo y no había placa mordiendo
 * ninguna foto— y ésta es la forma de cumplirlas sin inventar una cuarta.
 *
 * ⚠️ `ContactHero.tsx` SE BORRÓ, pero el collage no se tiró entero. Su
 * argumento bueno era que en una página de contacto la mitad de la gente viene
 * a LLAMAR, así que el teléfono no puede ser un renglón de 16px abajo a la
 * derecha. Ese mecanismo sobrevive: la píldora de teléfono en `mint` y el
 * círculo de Instagram son ahora lo primero de la columna de datos de la losa,
 * más chicos —60px de alto contra 104— porque ahí no compiten con un titular
 * de 144px sino que encabezan una columna.
 *
 * ⚠️ EL FORMULARIO EN FRASE SE QUEDA. La consigna decía «como el formulario de
 * plan an event», y lo que se toma de ahí es LA LOSA, no el formulario: son
 * cinco campos, y la oración con huecos funciona justamente porque son cinco.
 * El propio `/events` documenta por qué él no la copió con quince.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠️ LOS HORARIOS Y EL MAPA SIGUEN SIENDO EL SEGUNDO CONTENIDO DE LA PÁGINA
 * —la spec de internas (`docs/prompt-claude-design-internas.md` §7.9) los pone
 * ahí porque los dos sets de horario son la confusión número uno del negocio—
 * pero DESDE EL 2026-09-22 NO SON SECCIONES PROPIAS: los sirve `FindUs`, el
 * bloque de la home, por pedido explícito de Camila. Ver la nota de esa
 * sección más abajo.
 *
 * ⚠️ GIFT CARDS YA NO APARECE EN ESTA PÁGINA. Aparecía dos veces —la tarjeta
 * de la columna y la banda de cierre— y Camila marcó las dos: «eliminemos
 * estas secciones». El link sigue vivo en el footer, que es donde un enlace de
 * comercio pertenece cuando no es el trabajo de la página.
 *
 * ⚠️ JSON-LD: `venueJsonLd()` ya emite el `BarOrPub` con dirección, horarios
 * (`openingHours` desde `content/hours.ts`) y teléfono. No se escribe uno a
 * mano acá: sería una segunda fuente del mismo dato.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠️ EL RITMO DE SUPERFICIES:
 *
 *     hero        bone   (la placa y la foto)
 *     formulario  paper  ← el panel va en bone, que es lo que sostiene los campos
 *     find us     bone   ← entra con arco, montada sobre la losa
 *
 * ⚠️ YA NO HAY NINGUNA `deep` EN LA PÁGINA, porque la que había era la banda
 * de gift cards. Cero oscuras cumple `npm run check:surfaces` igual que una
 * —el guard topea, no exige— y la página cierra sobre el mismo hueso con el
 * que abre, con el arco marcando el corte.
 * ══════════════════════════════════════════════════════════════════════════
 */

/**
 * ⚠️ LOS DATOS DUROS SALEN DE LA BASE DE RESTOEXP, no de `brand.ts`.
 *
 * `getLocation()` lee la tabla `locations` con la anon key que ya estaba en
 * `.env.local`. Verificado el 2026-09-15: teléfono, mail, dirección, ciudad,
 * coordenadas, link de Maps y zona horaria coinciden exacto con lo que tenía
 * el repo, así que a partir de ahora los edita el cliente desde el dashboard y
 * el sitio los sigue solo.
 *
 * ⚠️ `BRAND` QUEDA COMO RESPALDO, no como fuente. Si la base no contesta, la
 * página se sirve igual con el último valor conocido: un teléfono viejo es
 * mejor que un 500 en la página de contacto.
 *
 * ⚠️ CUATRO DATOS NO ESTÁN EN LA BASE y siguen saliendo de `brand.ts` porque
 * no hay columna donde guardarlos: el estado (FL), el código postal (34135),
 * los mails de eventos y de trabajo —la tabla tiene UNA sola columna `email`—
 * y el texto del barrio. Y `social_links` viene en `null`.
 * TODO: confirmar con cliente si esos campos se pueden cargar en el dashboard.
 */
export default async function ContactPage() {
  const venue = await getVenue();

  /*
   * ⚠️ LOS BUZONES PERDIERON SU BAJADA EL 2026-09-22. Camila, sobre la
   * captura: «pon cada uno de los mails pero sin sus bajadas y con títulos
   * menos relevantes; cada título y mail quiero que pase más desapercibido y
   * no ocupe tanto».
   *
   * Cada uno traía una línea de para qué era —«Hours, the yard, a jacket
   * someone left on a bench…»— y el conjunto medía media pantalla al lado de
   * un formulario de cinco campos. La etiqueta sola ya dice a qué buzón va
   * cada cosa: «Private events» no necesita que le expliquen que es para
   * eventos privados.
   *
   * ⚠️ LOS TRES BUZONES SIGUEN SIENDO TRES, y eso no se toca: el de eventos
   * existe para que una consulta de $20.000 no caiga en el mismo lugar que
   * una pregunta sobre el horario. Por el mismo motivo `events@` NO va en el
   * footer (ver `docs/layout-motion.md`): vive sólo acá y en el hub de
   * eventos.
   */
  const buzones = [
    { label: 'General', address: venue.email },
    { label: 'Private events', address: venue.emailEvents },
    { label: 'Working here', address: venue.emailHiring },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(venueJsonLd(venue)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(breadcrumbJsonLd([{ name: 'Contact', path: '/contact' }])),
        }}
      />

      {/* ══ 1. El hero ════════════════════════════════════════════════════ */}

      {/*
        ⚠️ EL TITULAR PARTE EN DOS RENGLONES Y ESO ES UN CONTRATO, no un
        detalle de escritura: el solapamiento de `PlateHero` es `-0.94em`, que
        es exactamente media placa de DOS renglones. Con uno solo, la foto le
        pasa por encima al titular entero.

        ⚠️ Y EL TEXTO PLANO TIENE QUE DAR «Say hello», que es el H1 que fija
        `PAGE_SEO` y lo que compara `npm run check:seo`. El `<span>` parte el
        renglón y pinta el color; no agrega ni saca una palabra.
      */}
      <PlateHero
        question="Trying to reach the rooftop in Bonita Springs?"
        title={
          <>
            {'Say '}
            <span className="block text-sunset-deep">hello</span>
          </>
        }
        lead="Three inboxes, so your message lands with the person who can answer it instead of a shared one. If it is urgent, the phone is faster than all of it."
        photo="/images/venue/contact-bar-day-wide.webp"
        photoAlt="Guests at the bar at Rooftop at Riverside on a weekday afternoon"
      >
        {/*
          ⚠️ EL SEGUNDO CTA NO ES EL TELÉFONO, Y SE MIDIÓ. «Call (239)
          268-0080» son 19 caracteres, uno menos que el presupuesto de 20 que
          declara `BASE` en `Button.tsx`, pero el presupuesto es una guía y el
          ancho real depende de la letra: en `size="lg"` esa etiqueta da 293px
          y a 320px de viewport quedan 288 útiles. Como la etiqueta va con
          `nowrap`, no se parte: mete scroll horizontal a todo el documento.
          Es exactamente el error que ya está documentado en `/events`.

          El teléfono no se pierde: es la píldora grande de la columna de
          datos, dos pantallas más abajo pero a tamaño de titular.
        */}
        <ButtonLink href="#write" variant="primary" size="lg">
          Write to us
        </ButtonLink>
        <ButtonLink href="#find" variant="secondary" size="lg">
          Hours and map
        </ButtonLink>
      </PlateHero>

      {/* ══ 2. La losa del formulario, con los datos al costado ═══════════ */}

      {/*
        ⚠️ LA BAJADA DE LA LOSA YA NO DA INSTRUCCIONES. Decía «Pick the one
        that fits. The form does the same thing if you would rather type than
        open your mail app», o sea que explicaba cómo usar la pantalla que se
        está mirando. Camila: «necesito que la bajada del título tenga sentido,
        que no indique qué hacer… que diga contáctanos y te responderemos lo
        antes posible o algo así».

        Ahora dice lo único que a alguien le importa antes de escribir: que lo
        lee una persona y cuánto tarda en contestar.
      */}
      <FormSlab
        id="write"
        eyebrow="Write to us"
        eyebrowTone="deep"
        title="Three inboxes"
        titleId="write-title"
        lead="Write to us and a person here reads it. We come back within one business day."
        aside={
          <div className="flex flex-col gap-9">
            {/*
              ── Lo que sobrevive del collage ───────────────────────────────
              ⚠️ ESTO ERA EL ENCABEZADO DE LA PÁGINA y ahora encabeza la
              columna. La píldora y el círculo son las mismas dos piezas, con
              el mismo filete punteado y los mismos colores; lo único que
              cambió es la escala, de 104px de alto a 60.

              ⚠️ LA PÍLDORA SIGUE EN `mint` Y NO EN `sunset`. El naranja es del
              CTA primario y en esta pantalla el CTA es el formulario. `mint`
              es el token de las formas grandes de acento y la tinta encima
              queda en `ink`, o sea el mismo 15:1 de siempre.

              ⚠️ ES UN `<a href="tel:">` DE VERDAD, no un número pintado
              grande: los 60px de alto son todos área de toque, bastante más
              que los 44 del mínimo.
            */}
            <div className="flex items-center gap-3">
              <a
                href={venue.phoneHref}
                className="flex h-[60px] flex-1 items-center justify-center rounded-pill border-2 border-dashed border-ink/30 bg-mint px-4 font-display text-d6 font-semibold uppercase leading-none text-ink transition-colors hover:bg-river/30 sm:text-d5"
              >
                {venue.phone}
              </a>
              <a
                href={BRAND.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-[60px] shrink-0 items-center justify-center rounded-full border-2 border-dashed border-ink/30 bg-cream text-ink transition-colors hover:bg-sunset"
              >
                <Instagram className="size-6" aria-hidden="true" />
                <span className="sr-only">
                  @{instagramHandle()} on Instagram (opens in a new tab)
                </span>
              </a>
            </div>

            {/*
              ── Los tres buzones ────────────────────────────────────────
              ⚠️ BAJARON DE JERARQUÍA ENTERA. Eran un `Heading` de rótulo, el
              mail en `d5` de display en caja alta y una bajada de tres
              renglones: tres bloques de ~120px de alto cada uno, que en la
              captura de Camila competían con el formulario que están al lado.

              Ahora cada uno es una sola línea de dato —rótulo chico arriba,
              mail en cuerpo de texto debajo— y los tres juntos miden menos que
              lo que medía uno. El `gap` bajó de 28 a 18 por lo mismo: sin
              bajada, 28px entre un mail y el rótulo siguiente abrían un hueco
              que ya no separa nada.

              ⚠️ EL MAIL DEJA DE SER DISPLAY. `font-display` en caja alta a
              `d5` es el tratamiento de un titular, y esto no lo es. En cuerpo
              de texto se lee igual de bien, entra sin `break-all` en la
              columna angosta y de paso deja de pelear con la píldora del
              teléfono, que es lo que SÍ tiene que destacar acá.
            */}
            <ul className="flex list-none flex-col gap-4.5 p-0">
              {buzones.map((b) => (
                <li key={b.address}>
                  <span className="block font-body text-caption font-medium uppercase tracking-eyebrow text-body/60">
                    {b.label}
                  </span>
                  <a
                    href={'mailto:' + b.address}
                    className="link-texto mt-1 block break-words font-body text-[16px] leading-[1.5] text-ink"
                  >
                    {b.address}
                  </a>
                </li>
              ))}
            </ul>

            <hr className="w-full border-0 border-t border-ink/15" />

            {/* ── La dirección ─────────────────────────────────────────── */}
            <div>
              <Heading level={3} role="label">
                Come by
              </Heading>
              <address className="mt-[12px] not-italic">
                <p className="text-lead leading-[1.5]">
                  {venue.street}
                  <br />
                  {venue.locality}, {venue.region} {venue.postalCode}
                </p>
                <p className="mt-[10px] text-[16px] text-body/80">{venue.neighborhood}</p>
              </address>
              <p className="mt-[14px] text-[15px] leading-[1.6] text-body/75">
                Cancellations and weather calls go up on{' '}
                <a
                  href={BRAND.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-texto font-bold"
                >
                  @{instagramHandle()}
                  <span className="sr-only">(opens in a new tab)</span>
                </a>{' '}
                first.
              </p>
            </div>

            {/*
              ⚠️ ACÁ IBA LA TARJETA DE GIFT CARDS Y SE FUE EL 2026-09-22, junto
              con la banda de cierre que decía lo mismo. Camila marcó las dos
              sobre las capturas: «eliminemos estas secciones».

              Aparecían dos veces en la misma página —una en esta columna y
              otra a pantalla completa abajo— y las dos salían al mismo link de
              Toast. El link de gift cards sigue vivo donde corresponde, en el
              footer; lo que se fue es el módulo que lo repetía en una página
              cuyo trabajo es que alguien escriba, no que compre.
            */}
          </div>
        }
      >
        <ContactForm />
      </FormSlab>

      {/* ══ 3. Horarios, mapa y cómo llegar ══════════════════════════════ */}

      {/*
        ══════════════════════════════════════════════════════════════════
        ⚠️ ACÁ HABÍA DOS SECCIONES PROPIAS Y AHORA HAY UNA SOLA, QUE ES LA DE
        LA HOME. Camila, 2026-09-22, sobre la captura: «acá va mismo layout
        que en la home, coloca las olas para hacer pase de fondos o al menos
        las puntas redondeadas, no recto el cambio de fondo».

        Lo que se fue:

          · «When we are open, and where» — una `HoursCard` al lado de un
            `MapEmbed`, o sea la mitad de lo que este bloque ya hace, con el
            mapa detrás de un botón.
          · «Where to park» — la sección `#parking` con el mapa dibujado.
            Camila la marcó aparte: «eliminemos por completo el mapa de
            park». `ParkingMap.tsx` se borró con ella, y el link que la home
            tenía hacia `#parking` también.
          · La banda de cierre de gift cards, que era la segunda aparición del
            mismo link en la misma página.

        ⚠️ EL `id="find"` SE CONSERVA y por eso el componente lo recibe por
        prop: el CTA «Hours and map» del hero de esta misma página apunta ahí
        desde que existe, y romper un ancla interna al mover una sección es
        exactamente lo que le pasó al `#parking` de la home.

        ⚠️ EL CAMBIO DE FONDO YA NO ES RECTO, que era la otra mitad del
        pedido: `FindUs` entra con `banda-arco`, o sea con las dos esquinas de
        arriba redondeadas y montado sobre la sección anterior. El hueco que
        la de arriba necesita para no quedar tapada lo pone la regla
        `:has(+ .banda-arco)` de `globals.css`, sin tocar nada de este lado.
        ══════════════════════════════════════════════════════════════════
      */}
      <FindUs id="find" />
    </>
  );
}
