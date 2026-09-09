'use client';

import { useEffect, useRef, useState } from 'react';
import { ButtonLink } from '@/components/shared/Button';
import Section, { GUTTER } from '@/components/shared/Section';
import { SocialLinks } from '@/components/shared/Social';
import TilePattern from '@/components/shared/TilePattern';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
import { BRAND, HOURS, addressLine, mapsUrl } from '@/lib/brand';

/**
 * «Find us» — contacto, mapa y horarios, en tres columnas.
 *
 * ⚠️ SEGUNDA versión, y sale de una referencia que mandó Camila: el bloque de
 * contacto de Luci's Ristorante. Losa de datos a la izquierda, mapa recortado
 * en el medio, losa de horarios a la derecha. Su frase fue «el tema del visit
 * sino podemos resolverlo así en tres columnas», y resuelve justo lo que no
 * cerraba: los horarios eran un panel largo colgando al costado del mapa, y
 * acá pasan a ser una de las tres piezas, con el mismo peso que las otras dos.
 *
 * Lo que se toma de la referencia: la estructura de tres, los grupos rotulados
 * (CONTACT / LOCATION / FOLLOW), el día de hoy destacado y la píldora de estado
 * al pie de los horarios.
 *
 * ⚠️ Lo que NO se toma: el borde de encaje. Es la identidad de ESE restaurante
 * —un italiano— y acá sería un disfraz. Las dos losas se separan del fondo con
 * el radio y la sombra de la casa, que es lo que hacen el resto de las tarjetas
 * del sitio.
 *
 * ⚠️ Tampoco se toma el CTA «Reserve a table». No tomamos reservas: el sitio
 * entero dice «walk-ins only, no reservations», y un botón de reserva sería el
 * dato más contradictorio de la home. En su lugar va «Get directions», que es
 * la acción real que alguien quiere desde este bloque.
 *
 * ── El acordeón ───────────────────────────────────────────────────────────
 *
 * Se mantiene lo aprobado antes: cada día se despliega y muestra los DOS
 * horarios, el del bar y el de los trucks. Es la única parte del bloque que no
 * estaba en la referencia, y tiene que quedar porque acá hay dos juegos de
 * horarios y la referencia tenía uno solo.
 *
 * ⚠️ Es `<details name="hours">` NATIVO. El atributo `name` compartido hace que
 * abrir uno cierre el otro **sin una línea de JavaScript**, y trae gratis el
 * foco, el teclado y el anuncio del estado a los lectores de pantalla. Un
 * acordeón propio necesitaría `aria-expanded`, manejo de teclas y estado, y
 * sería peor en las tres cosas. Donde el navegador no soporte `name` degrada a
 * siete desplegables independientes: se pueden abrir varios a la vez y nada
 * más.
 *
 * ⚠️ HOVER NO. Camila dijo «con el hover o el click», y hay que elegir uno: en
 * táctil no hay hover, y los dos a la vez pelean —el panel se abre solo al
 * pasar el mouse camino a otra cosa—.
 *
 * ⚠️ Los siete días se renderizan en el SERVIDOR. Lo único que aporta el JS es
 * cuál arranca abierto y la píldora de estado, porque las dos cosas dependen de
 * `America/New_York` y el servidor no lo sabe sin arriesgar una página cacheada
 * con el día equivocado. Sin JS la información igual se lee: están los siete,
 * cerrados pero alcanzables.
 */

/* ── La hora del local ──────────────────────────────────────────────────────
   Todo esto trabaja en minutos desde la medianoche. Es la forma más simple de
   comparar rangos que cruzan las 12, que acá son dos de siete: el viernes
   cierra a las 12 AM y el sábado a las 2 AM. */

/** `'3:00 PM'` → `900`. Devuelve `null` si el texto no tiene esa forma. */
function aMinutos(t: string): number | null {
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(t.trim());
  if (!m) return null;
  const h = Number(m[1]) % 12;
  return (h + (/pm/i.test(m[3]) ? 12 : 0)) * 60 + Number(m[2]);
}

/**
 * `'11:00 AM – 2:00 AM'` → `{ desde: 660, hasta: 1560 }`.
 *
 * ⚠️ Si el cierre cae ANTES que la apertura, el tramo cruzó la medianoche y el
 * cierre se lleva al día siguiente sumándole 1440. Sin esto, el sábado se
 * leería como «abre 11:00 y cierra 02:00», o sea un rango negativo, y la
 * píldora diría «cerrado» justo en la noche de más gente de la semana.
 */
function tramo(rango: string): { readonly desde: number; readonly hasta: number } | null {
  const partes = rango.split('–');
  if (partes.length !== 2) return null;
  const desde = aMinutos(partes[0]);
  const hasta = aMinutos(partes[1]);
  if (desde === null || hasta === null) return null;
  return { desde, hasta: hasta <= desde ? hasta + 1440 : hasta };
}

/** `1320` → `'10 PM'`. Sin los `:00`, que en una píldora son ruido. */
function etiquetaHora(min: number): string {
  const m = ((min % 1440) + 1440) % 1440;
  const h24 = Math.floor(m / 60);
  const mm = m % 60;
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  const suf = h24 >= 12 ? 'PM' : 'AM';
  return mm === 0 ? `${h} ${suf}` : `${h}:${String(mm).padStart(2, '0')} ${suf}`;
}

/** Qué día y qué hora es EN EL LOCAL, no en el navegador de quien mira. */
function ahoraEnElVenue(): { readonly indice: number; readonly minutos: number } {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: BRAND.address.timezone,
    weekday: 'long',
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());
  const leer = (t: string) => partes.find((p) => p.type === t)?.value ?? '';
  return {
    indice: HOURS.findIndex((h) => h.day === leer('weekday')),
    // `hour12: false` puede devolver «24» a la medianoche según el runtime.
    minutos: (Number(leer('hour')) % 24) * 60 + Number(leer('minute')),
  };
}

interface Estado {
  readonly abierto: boolean;
  readonly texto: string;
}

/**
 * Si el BAR está abierto ahora, y hasta cuándo.
 *
 * ⚠️ Mira el día de hoy Y el de ayer. Un sábado que cierra a las 2 AM sigue
 * abierto a la 1 de la madrugada del domingo, y a esa hora el tramo que
 * corresponde es el de AYER, no el de hoy.
 *
 * ⚠️ Es el horario del bar y no el de los trucks, y va dicho en la píldora. El
 * bar abre primero y cierra último —está en la FAQ y en /visit—, así que es el
 * que contesta «¿puedo ir ahora?».
 */
function estadoDelBar(): Estado | null {
  const { indice, minutos } = ahoraEnElVenue();
  if (indice < 0) return null;

  const hoy = tramo(HOURS[indice].bar);
  if (hoy && minutos >= hoy.desde && minutos < hoy.hasta) {
    return { abierto: true, texto: `Open · closes ${etiquetaHora(hoy.hasta)}` };
  }

  const ayer = tramo(HOURS[(indice + 6) % 7].bar);
  const arrastre = minutos + 1440;
  if (ayer && arrastre >= ayer.desde && arrastre < ayer.hasta) {
    return { abierto: true, texto: `Open · closes ${etiquetaHora(ayer.hasta)}` };
  }

  if (hoy && minutos < hoy.desde) {
    return { abierto: false, texto: `Closed · opens ${etiquetaHora(hoy.desde)}` };
  }

  // Busca el próximo día con horario. Como mucho da la vuelta entera.
  for (let salto = 1; salto <= 7; salto += 1) {
    const siguiente = HOURS[(indice + salto) % 7];
    const t = tramo(siguiente.bar);
    if (t) {
      return {
        abierto: false,
        texto: `Closed · opens ${siguiente.day} ${etiquetaHora(t.desde)}`,
      };
    }
  }
  return { abierto: false, texto: 'Closed' };
}

export default function FindUs() {
  const lista = useRef<HTMLDivElement>(null);
  /*
    ⚠️ Arranca en `null` y la píldora no se dibuja hasta que hay valor. No es
    pereza: la página es estática y cacheada, así que cualquier estado que
    saliera del servidor sería el de la hora del build. «OPEN» impreso a las
    3 AM es peor que no decir nada.
  */
  const [estado, setEstado] = useState<Estado | null>(null);

  useEffect(() => {
    setEstado(estadoDelBar());

    const i = ahoraEnElVenue().indice;
    if (i < 0) return;
    const hoy = lista.current?.querySelectorAll('details')[i];
    if (!hoy) return;
    hoy.open = true;
    hoy.dataset.hoy = 'true';
  }, []);

  return (
    <Section
      tone="paper"
      bandTop="sm"
      bandBottom="lg"
      labelledBy="find-title"
      width="full"
      className="px-0"
    >
      <div className={GUTTER}>
        <div className="caja">
          <SectionHead
            eyebrow="Find us"
            eyebrowTone="deep"
            id="find-title"
            title="Downtown, across from Riverside Park"
          />
        </div>
      </div>

      <div className={`${GUTTER} mt-[40px]`}>
        {/*
          ⚠️ Las columnas laterales son MÁS ANGOSTAS que el mapa. En la
          referencia las tres se ven parejas porque el panel del medio es una
          foto recortada, no un mapa: un mapa necesita ancho para que se
          reconozca el barrio, y a un tercio exacto quedaba en una estampilla.
          Las losas de datos, en cambio, son listas de una línea y no ganan
          nada con más ancho.

          Hasta `lg` se apila en el orden en que hay que leerlo: quién sos,
          dónde estás, cuándo abrís.
        */}
        <div className="caja grid gap-[24px] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.1fr)_minmax(0,0.95fr)] lg:items-stretch lg:gap-[28px]">
          {/* ══ 1. La losa de contacto ═══════════════════════════════════ */}
          <div className="flex flex-col rounded-card bg-deep p-[28px] shadow-card lg:p-[32px]">
            <Heading level={3} className="text-paper">
              {BRAND.name}
            </Heading>

            <div className="mt-[26px]">
              <Eyebrow tone="cream">Contact</Eyebrow>
              <p className="mt-[10px] text-[17px] leading-[1.5]">
                <a href={BRAND.contact.phoneHref} className="link-texto text-paper">
                  {BRAND.contact.phone}
                </a>
              </p>
              <p className="mt-[4px] text-[17px] leading-[1.5]">
                <a href={`mailto:${BRAND.contact.email}`} className="link-texto text-paper">
                  {BRAND.contact.email}
                </a>
              </p>
            </div>

            <div className="mt-[24px]">
              <Eyebrow tone="cream">Location</Eyebrow>
              <address className="mt-[10px] text-[17px] leading-[1.5] not-italic">
                <a
                  href={mapsUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-texto text-paper"
                >
                  {addressLine()}
                  <span className="sr-only">, open in Google Maps (opens in a new tab)</span>
                </a>
              </address>
            </div>

            {/* Parking. Camila lo anotó en el boceto y no estaba en la
                referencia; entra acá porque es lo segundo que pregunta
                cualquiera que viene en auto a un centro sin playa propia. */}
            <div className="mt-[24px]">
              <Eyebrow tone="cream">Parking</Eyebrow>
              <p className="mt-[10px] text-[16px] leading-[1.6] text-paper/80">
                Street parking on Old 41 and public lots around Riverside Park.{' '}
                <a href="/visit#parking" className="link-texto text-paper">
                  Details
                </a>
              </p>
            </div>

            <div className="mt-[24px]">
              <Eyebrow tone="cream">Follow</Eyebrow>
              <SocialLinks className="mt-[12px]" />
            </div>

            {/* `mt-auto` empuja el botón al pie: las tres columnas estiran a la
                misma altura y sin esto el CTA queda flotando a media losa. */}
            <div className="mt-auto pt-[30px]">
              <ButtonLink href={mapsUrl()} variant="onDark" external>
                Get directions
              </ButtonLink>
            </div>
          </div>

          {/* ══ 2. El mapa ═══════════════════════════════════════════════
              `loading="lazy"` porque está bien abajo de la página y un iframe
              de Google pesa; `title` porque un iframe sin título es un fallo
              de WCAG 4.1.2. */}
          <div className="overflow-hidden rounded-card shadow-photo">
            <iframe
              title={`Map showing ${BRAND.name} at ${addressLine()}`}
              src={`https://www.google.com/maps?q=${BRAND.address.mapsQuery}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[340px] w-full border-0 lg:h-full lg:min-h-[620px]"
            />
          </div>

          {/* ══ 3. La losa de horarios ═══════════════════════════════════ */}
          <div className="flex flex-col rounded-card bg-deep p-[28px] shadow-card lg:p-[32px]">
            <Heading level={3} className="text-paper">
              Hours
            </Heading>

            {/* ⚠️ Los días NO son versalitas. Lo fueron, y eran 21 de los 26
                eyebrows de esta sección — más que cualquier otra del sitio. Una
                versalita es una ETIQUETA de bloque; siete días seguidos son
                DATOS, y en versalita a 13px se leían como un panel de control. */}
            <div ref={lista} className="mt-[22px]">
              {HOURS.map((fila) => (
                <details
                  key={fila.day}
                  name="hours"
                  className="group border-b border-paper/15 data-[hoy]:border-cream/45"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-[12px] py-[12px] transition-colors duration-200 [&::-webkit-details-marker]:hidden">
                    <span className="whitespace-nowrap font-body text-[15px] font-medium text-paper/85 group-data-[hoy]:font-bold group-data-[hoy]:text-cream">
                      {fila.day}
                      {/* El «hoy» se marca con TEXTO y no sólo con color y
                          peso: WCAG 1.4.1 no permite que el color sea el único
                          portador de un dato. */}
                      <span className="hidden group-data-[hoy]:inline"> · today</span>
                    </span>

                    <span className="flex items-center gap-[10px]">
                      {/* El resumen de una línea, para no obligar a abrir los
                          siete días sólo para saber si hoy abren.

                          ⚠️ `paper/75` y no menos. Es texto de 15px sobre
                          `deep`: al 55% da 4.34:1 contra el 4.5:1 que pide AA.
                          Al 75% da 8.05:1. */}
                      <span className="whitespace-nowrap text-[14px] tabular-nums text-paper/75 group-data-[hoy]:text-cream">
                        {fila.bar}
                      </span>
                      <svg
                        width="10"
                        height="7"
                        viewBox="0 0 11 7"
                        fill="none"
                        aria-hidden="true"
                        className="shrink-0 text-paper/55 transition-transform duration-200 group-open:rotate-180"
                      >
                        <path
                          d="M1 1l4.5 4.5L10 1"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </summary>

                  {/* Los dos horarios del día. Van como `<dl>` porque son
                      exactamente eso: pares de término y definición. */}
                  <dl className="grid grid-cols-[auto_1fr] gap-x-[14px] gap-y-[5px] pb-[14px]">
                    <dt className="font-body text-[14px] font-medium text-paper/70">Bar</dt>
                    <dd className="text-[15px] tabular-nums text-paper/90">{fila.bar}</dd>
                    <dt className="font-body text-[14px] font-medium text-paper/70">Trucks</dt>
                    <dd className="text-[15px] tabular-nums text-paper/90">{fila.trucks}</dd>
                  </dl>
                </details>
              ))}
            </div>

            {/*
              La píldora de estado, al pie de los horarios como en la
              referencia.

              ⚠️ Es lo MISMO que se sacó del header, y no vuelve por
              distracción: ahí molestaba porque era una barra fija peleando con
              la navegación en cada pantalla del sitio. Acá está al lado de los
              horarios, que es donde el dato significa algo.

              ⚠️ El punto lleva `aria-hidden`: el estado ya está en el texto.
            */}
            <div className="mt-auto pt-[26px]">
              {estado ? (
                <p className="inline-flex items-center gap-[9px] rounded-pill bg-paper/10 px-[16px] py-[9px] ring-1 ring-paper/25">
                  <span
                    aria-hidden="true"
                    className={`h-[7px] w-[7px] shrink-0 rounded-pill ${
                      estado.abierto ? 'bg-sunset' : 'bg-paper/45'
                    }`}
                  />
                  <span className="eyebrow text-cream">{estado.texto}</span>
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <TilePattern className="mt-[56px]" />
    </Section>
  );
}
