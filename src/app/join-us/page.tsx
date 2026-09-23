import type { Metadata } from 'next';
import JoinSwitch, { parseLane } from '@/components/sections/JoinSwitch';
import { ArtistForm, JobForm } from '@/components/sections/JoinForms';
import { ButtonLink } from '@/components/shared/Button';
import FormSlab from '@/components/shared/FormSlab';
import PlateHero from '@/components/shared/PlateHero';
import { GUTTER } from '@/components/shared/Section';
import SoftWave from '@/components/shared/SoftWave';
import { Eyebrow, Heading } from '@/components/shared/Type';
import { fraseEntretenimiento } from '@/content/entertainment';
import { getJobPostings } from '@/lib/restoexp';
import { getVenue } from '@/lib/venue';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  route: '/join-us',
  image: {
    url: '/images/venue/join-stage-day-wide.webp',
    width: 2576,
    height: 1364,
    alt: 'A singer on the stage in the yard at Rooftop at Riverside in the afternoon',
  },
});

/** La hoja que el cliente publica para imprimir. Ver la tarjeta de más abajo. */
const PDF = '/docs/rooftop-at-riverside-job-application.pdf';

/**
 * `/join-us` — DOS carriles, uno a la vez, elegidos con un selector.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ REHECHA EL 2026-09-22 Y ES EL TERCER REDISEÑO DE ESTA PÁGINA. Camila:
 * «quiero que los forms y sus textos cambien según si en un selector elijo the
 * team o artist, es decir quiero que si scrolleo tanto a primeras yo comprenda
 * que rooftop busca tanto gente para el team como artistas y que puedo
 * postular para cada uno».
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠️ LOS DOS CARRILES DEJARON DE ESTAR APILADOS, Y ACÁ ESTÁ LA MARCHA ATRÁS
 * EXPLÍCITA DE UNA DECISIÓN DEL 2026-09-21. Ese día este archivo decía:
 *
 *     «SIGUEN SIENDO DOS SECCIONES ANCLADAS Y NO TABS. `#work` y `#artists`
 *     son URLs que se pueden compartir y funcionan sin JavaScript. Unos tabs
 *     esconden la mitad de la página, no se pueden enlazar y obligan a
 *     reimplementar el teclado.»
 *
 * Los tres argumentos eran contra UNA implementación de tabs: la de `useState`
 * en el cliente. El selector que entró hoy no es esa: el carril viaja en la
 * URL —`?apply=team` y `?apply=artist`—, así que se enlaza, se comparte,
 * funciona sin JavaScript y no tiene teclado propio que implementar. Ver
 * `sections/JoinSwitch.tsx`, donde está punto por punto.
 *
 * Lo que la página apilada sí perdía es lo que Camila marcó: el segundo carril
 * arrancaba mil y pico de píxeles más abajo, o sea que quien abría la página
 * veía UN formulario y tenía que adivinar que había otro. Ahora las dos
 * ofertas se leen juntas, arriba, y sólo una ocupa la pantalla.
 *
 * ⚠️ EL HERO SE QUEDÓ SIN SUS DOS BOTONES, y no es un olvido: eran «Work here»
 * y «Play here» apuntando a los dos anclajes, o sea exactamente lo que ahora
 * hace el selector, que está doce píxeles más abajo. Dos controles pegados que
 * hacen lo mismo no es redundancia inofensiva: obliga a decidir dos veces.
 *
 * ⚠️ EL H1 NO CAMBIÓ y sigue siendo «Work here, play here», que es lo que fija
 * `PAGE_SEO` y lo que compara `npm run check:seo`. Ahora además nombra a los
 * dos carriles del selector, que es lo que ya hacía sin que la página lo
 * aprovechara.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠️ LOS DOS FORMULARIOS SON CALCOS DE LO QUE EL CLIENTE YA USA. El de trabajo
 * repite la hoja imprimible del cliente campo por campo; el de artistas repite
 * su formulario web. El porqué entero está en `lib/schemas/join.ts`.
 *
 * ⚠️ Y POR ESO EL CARRIL DE TRABAJO OFRECE EL PDF. Camila: «que sino esté este
 * formulario para que la persona llene y entregue en el lugar». La hoja se
 * sirve desde `public/docs/` y no desde el Wix del cliente: mismo origen,
 * descarga inmediata, y no se rompe si reordenan su sitio. La contra está
 * anotada donde se ofrece.
 *
 * ⚠️ EL CARRIL DE ARTISTAS NO TIENE IMPRIMIBLE, y es una decisión: un músico
 * manda un link de video y una foto, y nada de eso existe en papel. El cliente
 * tampoco tiene una hoja de artistas que calcar.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠️ LAS VACANTES SALEN DE LA BASE. `job_postings` existe en el dashboard de
 * RestoExp con título, descripción, requisitos, tipo de empleo y rango
 * salarial. Hoy está VACÍA para este restaurante, así que la página muestra
 * aplicación abierta. Cuando el cliente cargue una búsqueda aparece listada,
 * sin tocar código y sin deploy.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠️ EL RITMO DE SUPERFICIES, que ahora es más corto porque hay una losa y no
 * dos:
 *
 *     hero        bone   (la placa y la foto)
 *     selector    bone   ← sigue al hero a propósito: es su última línea
 *     la losa     paper  ← el panel va en bone, que es lo que sostiene los campos
 *     cierre      DEEP   ← única oscura
 *
 * ⚠️ `npm run check:surfaces` IMPRIME `paper · paper · deep` PARA ESTA PÁGINA
 * Y NO ES LO QUE SE VE. El guard lee el archivo con una expresión regular, así
 * que encuentra las DOS `FormSlab` del ternario aunque en pantalla se renderice
 * una sola. El ritmo real es `paper · deep`. No hace falta arreglar nada: dos
 * tonos iguales seguidos no son un error para ese script, sólo se listan.
 *
 * ⚠️ Y POR ESO LA LOSA DE ARTISTAS DEJÓ DE LLEVAR `panelTone="paper"`. Lo
 * llevaba porque era la SEGUNDA losa y necesitaba el escalón de hueso para
 * despegarse de la primera. Sin la primera debajo, ese motivo no existe y
 * vuelve al default, que es el par bueno: sección `paper` y panel `bone`, con
 * los campos blancos recortándose contra el panel.
 * ══════════════════════════════════════════════════════════════════════════
 */
export default async function JoinUsPage({
  searchParams,
}: {
  readonly searchParams: Promise<{ apply?: string }>;
}) {
  const lane = parseLane((await searchParams).apply);
  const venue = await getVenue();
  // Ver `content/entertainment.ts`: el número de noches no está confirmado.
  const musicaLarga = await fraseEntretenimiento();
  // Sólo el carril de trabajo las muestra, así que el otro no paga la consulta.
  const vacantes = lane === 'team' ? await getJobPostings() : [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(breadcrumbJsonLd([{ name: 'Join Us', path: '/join-us' }])),
        }}
      />

      {/* ══ El hero ═══════════════════════════════════════════════════════ */}

      {/*
        ⚠️ LA FOTO ES EL ESCENARIO DE DÍA y muestra el carril de artistas, no
        el de trabajo. Es una decisión y está argumentada en su entrada de
        `scripts/build-media.mjs`: es la única toma de música en vivo con luz
        de día de toda la entrega, y el carril de trabajo lo sostiene el copy,
        que es lo que un aviso de empleo necesita.

        ⚠️ LA FOTO NO CAMBIA CON EL CARRIL, aunque el resto de la página sí.
        Probado y descartado: con la foto cambiando, tocar el selector mueve
        ochocientos píxeles de página y el propio selector salta de lugar bajo
        el dedo. El hero es el marco de las dos cosas, no de una.
      */}
      <PlateHero
        question="Looking for a bar job or a stage in Bonita Springs?"
        title={'Work here, '}
        titleAccent="play here"
        photo="/images/venue/join-stage-day-wide.webp"
        photoAlt="A singer on the stage in the yard at Rooftop at Riverside in the afternoon"
      />

      {/* ══ El corte, el título y el selector ════════════════════════════ */}

      {/*
        ══════════════════════════════════════════════════════════════════
        ⚠️ TRES COSAS DEL MISMO PEDIDO, 2026-09-22. Camila, sobre la captura:
        «separa el hero del contenido con una ola, saca la bajada del hero,
        conviértela en un título y bajada que le siga un selector típico como
        usamos en otros proyectos, y con él cambie el contenido de debajo».

          1 · LA OLA, que va DEBAJO DEL SELECTOR y no entre el hero y el
              título. El hero, su pregunta y el control son el mismo bloque —el
              encabezado de la página— y el «contenido» que hay que separar es
              el formulario. Ahí además la ola SE VE: corta de `bone` a `paper`.

              ⚠️ ENTRE EL HERO Y EL TÍTULO ESTUVO PRIMERO Y NO SERVÍA: los dos
              lados eran `bone`, así que una ola del mismo color contra el mismo
              color no dibuja nada. Lo único que hacía era dejar 90px de hueco
              en blanco debajo de la foto. Medido en el navegador.

          2 · LA BAJADA DEL HERO SE VA Y VUELVE COMO TITULAR. Decía «we are
              hiring when we are hiring, and we book <música>. Pick which one
              you are here for, and a person reads what comes in»: tres ideas
              en un renglón, y la del medio —elegí cuál— es una instrucción del
              control que viene abajo. Ahora es un `h2` que hace la pregunta y
              una bajada que dice las dos ofertas.

          3 · EL SELECTOR. Ver `sections/JoinSwitch.tsx`: pasó de dos tarjetas
              grandes a la fila de píldoras que el repo ya usa en el
              calendario.

        ⚠️ EL TITULAR ES UN `h2` Y NO REPITE AL `h1`. El `h1` del hero es «Work
        here, play here», que es la marca de la página; éste es la pregunta que
        el selector contesta. Dos titulares seguidos diciendo lo mismo era
        justamente lo que había.
        ══════════════════════════════════════════════════════════════════
      */}
      {/*
        ⚠️ LA OLA SUBIÓ: VA ENTRE EL HERO Y ESTE ENCABEZADO, desde el
        2026-09-23. Camila: «esto debería estar en la zona blanca post ondas,
        con título en el tamaño correcto y centrado; es el primer título de toda
        la sección». Antes el encabezado y el conmutador quedaban en el `bone`
        del hero y la ola cortaba recién debajo, así que se leían como el pie
        del hero y no como la apertura del formulario. Ahora abren la banda
        blanca, centrados y con el cuerpo de un titular de sección (`banda`).
      */}
      <SoftWave from="bone" to="paper" className="relative -mb-px" />

      <div className={`grano bg-paper pt-12 md:pt-16 lg:pt-20 ${GUTTER}`}>
        <div className="caja text-center">
          <Heading level={2} id="apply-title" className="mx-auto max-w-[18ch] text-balance text-banda">
            What are you <span className="text-sunset-deep">here for</span>
          </Heading>
          <p className="bajada mx-auto mt-gap-bajada max-w-[56ch] font-body text-lead font-light">
            We hire when we hire, and we book {musicaLarga.toLowerCase()}. Either way a person
            reads what comes in.
          </p>
        </div>
      </div>

      <JoinSwitch lane={lane} />


      {/* ══ El carril elegido ════════════════════════════════════════════ */}

      {lane === 'team' ? (
        <FormSlab
          /*
            ⚠️ EL `id` SIGUE SIENDO `work` PARA NO ROMPER LOS LINKS VIEJOS.
            `/join-us#work` circula desde que existe la página y es lo que
            apuntaba «Careers» en el footer. Con el carril de trabajo como
            default, esa URL sigue cayendo donde caía.
          */
          id="work"
          eyebrow="Join the team"
          eyebrowTone="deep"
          title="Work here"
          titleId="work-title"
          lead="It is a rooftop bar over four food trucks, open five days a week, with a stage in the yard. Busy, outdoors, and never the same shift twice."
          aside={
            <div className="flex flex-col gap-6">
              {/*
                ⚠️ LAS VACANTES O LA APLICACIÓN ABIERTA, según lo que haya en la
                base. Las dos ramas son estados normales, no un error: la mayor
                parte del año un lugar así no tiene búsquedas publicadas y recibe
                currículums igual.
              */}
              {vacantes.length > 0 ? (
                <div>
                  <Heading level={3} role="label">
                    Open right now
                  </Heading>
                  <ul className="mt-[16px] flex list-none flex-col gap-[20px] p-0">
                    {vacantes.map((v) => (
                      <li key={v.id} className="border-t border-ink/12 pt-[16px]">
                        <p className="font-display text-d6 uppercase lg:text-d5">{v.title}</p>
                        <p className="mt-[6px] flex flex-wrap gap-x-[14px] gap-y-[4px] text-caption font-bold uppercase tracking-[0.1em] text-body/70">
                          {v.department ? <span>{v.department}</span> : null}
                          {v.employment_type ? <span>{v.employment_type}</span> : null}
                          {v.salary_min !== null ? (
                            <span className="tabular-nums">
                              ${v.salary_min}
                              {v.salary_max !== null ? ` – $${v.salary_max}` : ''}
                              {v.salary_type ? ` ${v.salary_type}` : ''}
                            </span>
                          ) : null}
                        </p>
                        {v.description ? (
                          <p className="mt-[8px] max-w-[52ch] text-[16px] leading-[1.7] text-body/80">
                            {v.description}
                          </p>
                        ) : null}
                        {v.requirements ? (
                          <p className="mt-[8px] max-w-[52ch] text-[15px] leading-[1.6] text-muted">
                            {v.requirements}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                /*
                  ⚠️ SIN VACANTES NO SE DIBUJA NADA. Acá había una tarjeta —«No
                  posted openings today»— y Camila la tachó sobre la captura.

                  Era el primer bloque de la columna y lo primero que decía era
                  que no hay trabajo, al lado de un formulario que pide veinte
                  campos. Que la mayor parte del año no haya búsquedas
                  publicadas es cierto y sigue siendo cierto; lo que no hace
                  falta es anunciarlo antes de que alguien postule.

                  ⚠️ LA RAMA SE QUEDA ESCRITA aunque no renderice: es el estado
                  normal, no un error, y dejarla explícita evita que alguien
                  «arregle» el ternario creyendo que falta algo.
                */
                null
              )}

              {/*
                ══════════════════════════════════════════════════════════════
                LA HOJA IMPRESA.

                ⚠️ ES EL MISMO FORMULARIO, NO UN RESUMEN NI UN FOLLETO, y por eso
                el copy lo dice con esas palabras. Quien está parado en la barra
                y prefiere lapicera tiene que poder salir de la web sin sentir
                que está eligiendo la opción de segunda.

                ⚠️ EL ARCHIVO SE SIRVE DESDE `public/docs/` Y ES UNA COPIA DEL
                QUE EL CLIENTE TIENE EN SU WIX. La contra está asumida: si el
                cliente actualiza su PDF, esta copia queda vieja hasta que
                alguien la sincronice. Se eligió igual porque un link a un
                dominio ajeno se rompe sin que nos enteremos, y porque este
                formulario web es un calco de ESTA versión de la hoja: si el
                cliente cambia el papel, hay que tocar el schema de todos modos.

                ⚠️ VA CON LA DIRECCIÓN AL LADO. Un PDF que dice «entregalo en el
                lugar» sin decir dónde queda el lugar obliga a abrir otra página.
                ══════════════════════════════════════════════════════════════
              */}
              {/*
                ⚠️ ES LA MISMA TARJETA QUE EL PACKET DE `/events`, ADAPTADA.
                Camila, 2026-09-22: «acorta el texto de la segunda y dale mismo
                formato que a la card de PDF de eventos; deben ser mismo
                componente adaptado a cada situación».

                Lo que comparten, y que allá se decidió el mismo día: fondo
                `mint`, rótulo, titular de tarjeta, un párrafo, y el botón
                naranja al ANCHO de la tarjeta con el formato y el peso del
                archivo debajo, centrados.

                ⚠️ EL TEXTO BAJÓ DE TRES RENGLONES A UNO. Decía dónde
                entregarlo, que también se puede mandar por mail y que pide
                exactamente lo mismo que el formulario de al lado. La dirección
                está en el footer y en `FindUs`; lo de «pide lo mismo» es la
                razón de ser de la tarjeta y ya lo dice el titular.
              */}
              <div className="rounded-shell bg-mint p-6">
                <Eyebrow tone="deep">Rather use a pen?</Eyebrow>
                <Heading level={3} role="card" className="mt-2.5">
                  The same form, on paper
                </Heading>
                <p className="mt-2.5 max-w-[46ch] font-body text-base font-light leading-[1.7] text-ink/80">
                  Print it, fill it in and hand it to the management team with your resume.
                </p>
                <div className="mt-5">
                  <ButtonLink
                    href={PDF}
                    variant="primary"
                    size="md"
                    external
                    className="w-full justify-center"
                  >
                    Download the form
                  </ButtonLink>
                  <p className="mt-2 text-center font-body text-micro font-medium text-ink/70">
                    PDF
                  </p>
                </div>
              </div>

              {/*
                ⚠️ ACÁ ESTABA EL MAIL, BAJO UN RÓTULO «OR SKIP THE FORM», Y LOS
                DOS SE FUERON EL 2026-09-22. Camila, sobre la captura: tachó el
                rótulo y marcó «el main ponlo dentro de la card de formulario».

                El rótulo es el mismo que se sacó de `/events` y de `/market` el
                mismo día, y por el mismo motivo: estaba al lado de un
                formulario y lo primero que hacía era ofrecer no usarlo.

                El mail no se pierde: `FormSlab` lo recibe ahora por `footer` y
                lo dibuja adentro del panel, debajo del botón de enviar. Ver la
                prop en ese componente.
              */}
            </div>
          }
          footer={
            <>
              Prefer to send a resume by mail?{' '}
              <a href={`mailto:${venue.emailHiring}`} className="link-texto break-words font-bold">
                {venue.emailHiring}
              </a>
            </>
          }
        >
          <JobForm />
        </FormSlab>
      ) : (
        <FormSlab
          id="artists"
          eyebrow="Artists and performers"
          eyebrowTone="terra"
          title="Play here"
          titleId="artists-title"
          lead={`${musicaLarga}: solo acts, bands, DJs. There is a stage in the yard with sound already on it, so you are not carrying a PA up two flights.`}
          aside={
            <div className="flex flex-col gap-6">
              <div>
                <Heading level={3} role="label">
                  What we need from you
                </Heading>
                {/*
                  ⚠️ ESTA LISTA ES EL FORMULARIO DE AL LADO, EN PALABRAS. Desde
                  que el formulario se calcó del que el cliente tiene vivo
                  (2026-09-22), pide otra cosa que antes: se fueron la duración
                  del set, cuántos son y qué noches sirven, y entraron el logo y
                  la foto. Una lista que prometa lo que el formulario no
                  pregunta es peor que no tener lista.

                  ⚠️ EL PRIMER ITEM ES EL QUE MANDA, y en el formulario del
                  cliente el campo de video es OPCIONAL. Acá se dice que sin eso
                  no se puede evaluar, que es la verdad, sin endurecer el calco.
                */}
                <ul className="mt-[16px] flex list-none flex-col gap-[10px] p-0">
                  {[
                    'A video link, or the social account where we can hear you',
                    'Your band name and your genre',
                    'A logo and a photo, if you have them, for the calendar',
                    'A phone number, because booking happens fast',
                  ].map((i) => (
                    <li key={i} className="flex items-start gap-[10px] text-[16px] leading-[1.6]">
                      <span
                        aria-hidden="true"
                        className="mt-[8px] size-[6px] shrink-0 rounded-pill bg-sunset"
                      />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>

              {/*
                ⚠️ ESTA TARJETA SE ACORTÓ A UNA FRASE. Camila, 2026-09-22: «en
                esta card hazlo más acotado, pon algo así como "si ya tienes
                fecha pero tienes alguna duda escríbenos a
                info@eatdrinkparadise.com". NO digas que es más rápido ni nada
                de eso».

                Decía que el calendario tiene la fecha y el horario, y cerraba
                con «is faster than this form» — o sea que la página misma
                desaconsejaba el formulario que tiene al lado. Eso es lo que
                Camila subrayó en mayúsculas.

                ⚠️ SE FUE TAMBIÉN EL LINK AL CALENDARIO. Sin la frase que lo
                introducía no tenía dónde colgarse, y el calendario está en el
                header de todas las páginas.

                ⚠️ `break-words` Y NO `break-all`. Iba con `break-all`, que parte
                en CUALQUIER letra, y como el mail va embebido en una frase y la
                columna es angosta, salía cortado al medio: «info@eatdrinkp /
                aradise.com». Con `break-words` se va entero al renglón de abajo.
              */}
              <div className="rounded-card border border-ink/15 bg-bone p-[20px]">
                <Eyebrow tone="deep">Already on the calendar?</Eyebrow>
                <p className="mt-[8px] max-w-[42ch] text-[16px] leading-[1.7] text-body/80">
                  If you already have a date with us and something is unclear, write to{' '}
                  <a href={`mailto:${venue.email}`} className="link-texto font-bold break-words">
                    {venue.email}
                  </a>
                  .
                </p>
              </div>
            </div>
          }
        >
          <ArtistForm />
        </FormSlab>
      )}

      {/* ⚠️ EL CIERRE «NOT WHAT YOU WERE LOOKING FOR?» SE FUE EL 2026-09-23.
          Camila: «eliminemos esta sección». Mandaba al market y a contacto,
          que ya están en el header y en el pie. */}
    </>
  );
}
