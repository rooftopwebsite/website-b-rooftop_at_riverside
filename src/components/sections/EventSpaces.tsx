/**
 * Los espacios que se alquilan, como sección de `/events`.
 *
 * ⚠️ ERA LA PÁGINA `/events/spaces` y se mudó acá entera. Camila, definiendo
 * qué tiene que tener la página de eventos: «quiero que esté la info de qué se
 * alquila y cierra para eventos privados, y el formulario o info para
 * reservar».
 *
 * ⚠️ EL `id="spaces"` ES EL DESTINO DEL REDIRECT 301 de la ruta vieja, así que
 * no se renombra. Ver `next.config.ts`.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ QUÉ SE FUE EL 2026-09-21, con el rediseño de la página.
 *
 * 1. LOS DOCE MARCADORES TBD. Cada tarjeta tenía un `<dl>` de tres columnas
 *    —standing, seated, minimum— y los tres valores están en `null` para los
 *    cuatro espacios, así que la sección renderizaba DOCE bloques de alarma
 *    naranja seguidos. El aviso no desaparece: sigue abajo, una vez, en el
 *    `PendingBlock`. Doce alarmas para un solo dato faltante dejan de leerse
 *    como alarma y pasan a leerse como maqueta rota.
 *
 * 2. LAS CUATRO FOTOS PENDIENTES. `photo` también es `null` en los cuatro, así
 *    que al lado de cada tarjeta había un hueco gris de 340px de alto. Los
 *    cuatro `photoBrief` siguen en `content/spaces.ts` —que es donde el
 *    fotógrafo los va a leer— y el pedido está nombrado en el mismo
 *    `PendingBlock`.
 *
 * 3. LA LOSA NARANJA «DECEMBER FILLS FIRST». La página cerraba con DOS losas
 *    `bg-sunset` idénticas en forma: ésta y la de «One screen, two minutes»,
 *    separadas por la galería y el PDF. Queda una sola, la del cierre.
 *
 * 4. LOS CUATRO BOTONES «ASK ABOUT <ESPACIO>». Uno por tarjeta, los cuatro
 *    apuntando al mismo `#inquire` que el CTA del hero y el del cierre. El
 *    formulario ya tiene el desplegable de áreas de interés (`AREAS_OF_INTEREST`
 *    en `content/spaces.ts`), así que el botón no llevaba el dato consigo: era
 *    el mismo salto cuatro veces.
 *
 * ⚠️ EL AIRE DE ARRIBA ES `PADDING_CRUCE` Y NO SE PUEDE SACAR. Arriba de esta
 * sección va el `CompareSlab` de la página, cuyas dos tarjetas se salen de la
 * losa oscura con un `-mb-32` y aterrizan acá. Sin este `pt` —y sin el
 * `bandTop="none"` que lo acompaña— las tarjetas caen encima del encabezado.
 * El número se importa del propio `CompareSlab` para que viva en un solo lado.
 * ══════════════════════════════════════════════════════════════════════════
 */
import Image from 'next/image';
import { PADDING_CRUCE } from '@/components/shared/CompareSlab';
import { MapPin, MusicNote, Truck, UserCircle } from '@/components/shared/Icon';
import { RevealItem, StaggerGroup } from '@/components/shared/Motion';
import { PendingBlock } from '@/components/shared/PendingData';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
import { SPACES, type Space } from '@/content/spaces';

export default function EventSpaces() {
  return (
    <div id="spaces" className="scroll-mt-24">
      <Section band="lg" bandTop="none" labelledBy="spaces-title" innerClassName={PADDING_CRUCE}>
        <SectionHead
          eyebrow="The rooms"
          eyebrowTone="deep"
          id="spaces-title"
          title="Pick your footprint"
          lead="Four footprints, from the rooftop bar on its own to the gates closed on the whole place."
        />

        <StaggerGroup as="ul" className="mt-bloque grid list-none gap-6 p-0 md:grid-cols-2">
          {SPACES.map((s) => (
            <RevealItem as="li" key={s.slug} className="h-full">
              <SpaceCard space={s} />
            </RevealItem>
          ))}
        </StaggerGroup>

        {/*
          El aviso general, UNA vez. Junta los dos faltantes —los números y las
          fotos— porque los dos se resuelven con el mismo mail al cliente.
        */}
        <div className="mt-bloque">
          <PendingBlock title="Capacities, minimums and a photo of each space">
            Standing and seated capacities, guest minimums and a photograph of each of the four
            spaces are still missing, and we&rsquo;re not going to estimate any of them. A capacity
            on a venue page is a promise somebody has to keep on the night. The numbers drop into{' '}
            <code className="rounded-btn bg-ink/5 px-1.25 py-px text-[13px]">
              src/content/spaces.ts
            </code>
            , where each space already carries the brief for the shot we need.
          </PendingBlock>
        </div>
      </Section>

      {/*
        ══════════════════════════════════════════════════════════════════════
        LO QUE VIENE CON CADA ESPACIO, EN BENTO.

        ⚠️ ERAN CINCO RENGLONES DE UNA LISTA con un titular al costado. Camila,
        2026-09-21: «como son más de 4 puntos creo que podríamos ponerlos en
        cards dentro de un bento». Son exactamente cinco, y un bento de una
        destacada a doble alto más cuatro de icono tiene exactamente cinco
        celdas: la forma y el contenido coinciden sin forzar ninguno.

        ⚠️ LA DESTACADA ES EL BAR Y NO OTRA, y eso es un argumento de negocio:
        es lo ÚNICO de esta lista que factura el venue. Los trucks son de sus
        dueños, el escenario ya está ahí y el estacionamiento es de la calle;
        la barra es nuestra y la corre nuestro equipo. Por eso se lleva la
        celda grande y la única foto.

        ⚠️ LA FOTO ES `wall-bartender.jpg`, que es la barra con alguien
        atendiendo: la celda grande de la referencia lleva un visual arriba y
        el texto al pie, y ésta es la toma que dice «nuestro equipo» sin
        explicarlo. Es 540×720, o sea vertical, que es justo lo que pide una
        celda a doble alto.

        ⚠️ EL HOVER DE LA REFERENCIA SE FUE. Era un filete de 2px en el borde de
        arriba trazándose con `scale-x`, más un tile gris de 44px que pasaba a
        naranja. Los dos eran del otro sistema visual —el de `#E55100` sin
        sombras, donde la elevación es un borde de 1px— y acá quedaban como dos
        gestos prestados sobre tarjetas que sí tienen sombra. El hover de la
        casa es el levante de 6px con `ease-brand`, el mismo de los tickets de
        `YardSteps`.

        ⚠️ LOS RÓTULOS VAN EN `Eyebrow` Y NO EN UNA MONO. La referencia los
        pide en Geist Mono y en este repo no hay fuente monoespaciada: el rótulo
        de la casa es la geométrica en caja alta con tracking, que es lo que
        hace `eyebrow`. Meter una cuarta familia por cinco etiquetas es
        exactamente lo que la nota de `Type.tsx` evita.

        ⚠️ LOS ICONOS SALEN DE `shared/Icon.tsx`, y dos son nuevos: `MapPin`
        para el estacionamiento y `UserCircle` para el contacto único. El
        repo dibuja su propio set en vez de instalar Phosphor —el porqué está
        en la cabecera de ese archivo— así que sumar dos es el camino previsto,
        no un atajo.
        ══════════════════════════════════════════════════════════════════════
      */}
      <Section
        tone="cream"
        band="lg"
        labelledBy="incluye-title"
        className="banda-arco z-[2] pb-cierre"
      >
        {/*
          ⚠️ EL TITULAR ES DE BANDA Y ANTES ERA UN `d5` A LA IZQUIERDA. Camila,
          2026-09-21: «le falta muchísimo, no tiene el peso ni el estilo del
          resto de la web; fijate el título, los colores, el fondo».

          Tenía razón en las tres. Ésta es la primera: todas las bandas del
          rediseño encabezan con `text-banda` centrado y una palabra en el
          acento —«Not a restaurant. Three of them», «One yard, five registers»,
          «Four kinds of night. One yard»— y ésta abría con un titular de 40px
          alineado a la izquierda, o sea el cuerpo de un subtítulo de sección.

          ⚠️ EL COPY NO CAMBIÓ. Son las mismas cuatro palabras, partidas en dos
          renglones para que «every space» se lleve el color.
        */}
        <h2
          id="incluye-title"
          className="mx-auto max-w-[14ch] text-center font-display text-banda font-extrabold uppercase"
        >
          <span className="text-ink">What comes with</span>{' '}
          <span className="text-sunset-deep">every space</span>
        </h2>

        <StaggerGroup
          as="ul"
          className="mt-bloque grid list-none grid-cols-1 gap-x-5 gap-y-14 p-0 sm:grid-cols-2 lg:grid-cols-3"
        >
          {/*
            ══════════════════════════════════════════════════════════════════
            LA CELDA GRANDE, AHORA EN `deep`.

            ⚠️ ERA UNA TARJETA BLANCA MÁS y ése era el segundo problema: la
            sección entera eran cinco rectángulos blancos sobre crema, sin un
            solo color de la marca. Acá el naranja y el teal estaban ausentes en
            una página que los usa en todas las otras bandas.

            ⚠️ ES UNA TARJETA OSCURA, NO UNA SECCIÓN OSCURA, y la diferencia
            importa para la ley del color: el tope de una superficie `deep` por
            página ya se lo llevó el `CompareSlab`. `check:surfaces` cuenta
            `<Section tone>` y `<section class="bg-…">`, no los `div`. El
            precedente es la losa `bg-deep` que `TruckCards` mete adentro de una
            sección clara.

            ⚠️ NO LLEVA `grano`, aunque la losa oscura de `TruckCards` —que es
            la misma pieza en /food-trucks— sí lo lleve. El grano va en los
            FONDOS y no en los objetos, y una tarjeta adentro de una sección
            clara es un objeto. `npm run check:grano` mide exactamente eso y lo
            marcó acá; allá no se ve porque esa ruta no está en sus `RUTAS`.

            ⚠️ `on-dark` NO ES DECORATIVO: invierte el anillo de foco y cambia
            la sombra por la variante para superficies oscuras. Ver globals.css.
            ══════════════════════════════════════════════════════════════════
          */}
          <RevealItem as="li" className="sm:col-span-2 lg:col-span-1 lg:row-span-2">
            <article className="on-dark group flex h-full flex-col overflow-hidden rounded-shell bg-deep sombra-card">
              {/* La foto crece con `flex-1` para llenar lo que sobre: si fijara
                  proporción, su alto se lo impondría a las cuatro tarjetas
                  chicas, que abarcan las mismas dos filas. */}
              <div className="relative aspect-[4/3] w-full bg-deeper lg:aspect-auto lg:min-h-[240px] lg:flex-1">
                <Image
                  src="/images/venue/wall-bartender.jpg"
                  alt="A bartender making drinks at the Sunset Bar"
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 100vw, 100vw"
                  className="object-cover transition-transform duration-500 ease-brand group-hover:scale-104"
                />
              </div>
              <div className="flex flex-col gap-2.5 p-7 lg:p-8">
                <Eyebrow tone="cream">The only one that&rsquo;s ours</Eyebrow>
                <h3 className="m-0 font-display text-d4 font-bold uppercase leading-none text-paper">
                  The Sunset Bar
                </h3>
                <p className="m-0 font-body text-base font-light leading-[1.6] text-bone/85">
                  The rooftop bar and our own team running it. Open bar, drink tickets or
                  consumption, however you want to pour it.
                </p>
              </div>
            </article>
          </RevealItem>

          {/*
            ══════════════════════════════════════════════════════════════════
            LAS CUATRO CHICAS, CON EL SELLO PISANDO EL BORDE.

            ⚠️ EL TILE DE 44px DE LA REFERENCIA SE FUE Y EN SU LUGAR ESTÁ EL
            SELLO DE LA CASA: los tres anillos concéntricos —papel, naranja,
            crema— montados a caballo del borde de arriba, mitad adentro y
            mitad afuera. Es la misma construcción que los pasos 01/02/03 de la
            home y que los dos stickers de `CompareSlab`, con la clase
            `.sticker` que les da la sombra de dos pasadas y que comparte con
            el logo del header.

            Un cuadradito gris en la esquina de una tarjeta blanca no es de
            este sitio; el sello sí, y es lo que mete el naranja de la marca en
            una sección que no tenía ninguno.

            ⚠️ EL ICONO VA ADENTRO DEL SELLO, donde en la home va el número. En
            `deep` sobre el crema del anillo interior: 9.44:1, el mismo ratio
            que el lockup del header contra su plancha.

            ⚠️ LA GEOMETRÍA: el sello mide 56px y el `-translate-y-1/2` lo parte
            exacto en el filo, así que asoma 28 por arriba. El `pt-11` de la
            tarjeta son 44px, que dejan 16 de aire entre el sello y el rótulo.
            Y el `gap-y-14` de la grilla —56px— es lo que evita que el sello de
            una fila pise la tarjeta de la fila de arriba.
            ══════════════════════════════════════════════════════════════════
          */}
          {INCLUIDO.map((item) => (
            <RevealItem as="li" key={item.label}>
              <article className="group relative flex h-full flex-col items-center gap-2.5 rounded-ticket bg-paper px-6 pt-11 pb-8 text-center sombra-card transition-transform duration-300 ease-brand hover:-translate-y-1.5">
                <span
                  aria-hidden="true"
                  className="sticker absolute top-0 left-1/2 z-10 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-pill bg-paper p-1"
                >
                  <span className="grid size-full place-items-center rounded-pill bg-sunset p-1.25">
                    <span className="grid size-full place-items-center rounded-pill bg-cream text-deep">
                      <item.Icon className="size-5" />
                    </span>
                  </span>
                </span>

                <Eyebrow tone="terra">{item.label}</Eyebrow>
                <h3 className="m-0 max-w-[18ch] font-display text-d6 font-bold uppercase leading-[1.05] text-ink">
                  {item.title}
                </h3>
                <p className="m-0 max-w-[30ch] font-body text-base font-light leading-[1.6] text-body/80">
                  {item.body}
                </p>
              </article>
            </RevealItem>
          ))}
        </StaggerGroup>
      </Section>
    </div>
  );
}

/**
 * LOS CUATRO PUNTOS QUE NO SON EL BAR.
 *
 * ⚠️ ERAN CINCO RENGLONES SUELTOS de una lista y ahora son cuatro fichas más
 * la destacada. El texto de cada renglón se partió en `title` + `body`: lo que
 * era «Coordination with the food trucks. You pick a tier, we handle the
 * vendors.» son literalmente sus dos oraciones, la primera como título y la
 * segunda como cuerpo. No se agregó ni se quitó un dato.
 *
 * ⚠️ EL PRIMER RENGLÓN —«The Sunset Bar and our team running it»— NO ESTÁ ACÁ:
 * es la celda destacada, escrita en el JSX porque lleva foto y no icono.
 *
 * ⚠️ `Icon` ES EL COMPONENTE, NO UN NOMBRE. Va en mayúscula porque se usa como
 * `<item.Icon />`: en JSX un identificador en minúscula se compila como
 * etiqueta HTML literal y no como componente.
 */
const INCLUIDO = [
  {
    label: 'The trucks',
    title: 'We coordinate the kitchens',
    body: 'You pick a tier, we handle the vendors and the timing.',
    Icon: Truck,
  },
  {
    label: 'The stage',
    title: 'Sound is already here',
    body: 'For live music or a DJ, on the stage that lives in the yard.',
    Icon: MusicNote,
  },
  {
    label: 'Getting here',
    title: 'Street parking on Old 41',
    body: 'Plus the public lots around Riverside Park, across the street.',
    Icon: MapPin,
  },
  {
    label: 'The planning',
    title: 'One point of contact',
    body: 'The same person, from the first email through load-out.',
    Icon: UserCircle,
  },
] as const;

/**
 * ⚠️ LA TARJETA ES SÓLO TEXTO Y ANTES ERA UNA GRILLA DE DOS COLUMNAS con la
 * foto ocupando la mitad. Ver el punto 2 del encabezado: las cuatro fotos son
 * `null`, así que esa mitad era un hueco gris.
 *
 * ⚠️ `bone` SOBRE `paper` ES UN ESCALÓN DE 1.08:1, o sea que el borde de la
 * tarjeta se ve sin meter un campo de color ni un contorno. Es el mismo
 * recurso con el que la home separa sus bandas. No lleva `grano`: el grano es
 * de los fondos, no de los elementos.
 */
function SpaceCard({ space }: { readonly space: Space }) {
  return (
    <article className="flex h-full flex-col rounded-shell bg-bone p-6 lg:p-8">
      {/*
        ⚠️ ES EL KICKER *O* LA CHAPA, NUNCA LOS DOS. Antes se dibujaban juntos y
        en el patio decían lo mismo: su `kicker` es «Currently in renovation» y
        al lado le quedaba una chapa que decía «In renovation». El mismo dato
        dos veces, con dos tratamientos distintos, en la misma línea.

        Gana la chapa porque es el dato más importante de esa tarjeta —el
        espacio no se puede alquilar hoy— y porque se escanea. Los otros tres
        kickers son ubicaciones («The rooftop», «The ground floor», «The whole
        place») y siguen intactos.

        TODO: si el cliente confirma dónde queda el patio, el `kicker` de
        `content/spaces.ts` puede pasar a ser una ubicación como los otros tres
        y entonces los dos conviven sin repetirse. Hoy no lo sabemos: la ficha
        dice «between the yard and the bar» y la sección de tarifas lo cuenta
        como parte del segundo piso.
      */}
      <div className="flex flex-wrap items-center gap-2.5">
        {space.status === 'renovating' ? (
          <span className="rounded-btn bg-cream px-2 py-0.5 font-body text-[11px] font-bold uppercase tracking-eyebrow text-plum">
            In renovation
          </span>
        ) : (
          <Eyebrow tone="deep">{space.kicker}</Eyebrow>
        )}
      </div>

      <Heading level={3} className="mt-2 text-d5 lg:text-d4">
        {space.name}
      </Heading>

      <p className="mt-3 max-w-[52ch] font-body text-base font-light leading-[1.65] text-body/80">
        {space.description}
      </p>

      {/* `mt-auto` alinea las cuatro filas de píldoras aunque las descripciones
          midan distinto. Mismo criterio que las tarjetas de `EventTypes`. */}
      <div className="mt-auto pt-6">
        <p className="eyebrow text-body/75">Best for</p>
        <ul className="mt-2 flex list-none flex-wrap gap-2 p-0">
          {space.bestFor.map((b) => (
            <li
              key={b}
              className="rounded-pill border border-ink/20 px-3 py-1.25 font-body text-caption font-medium"
            >
              {b}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
