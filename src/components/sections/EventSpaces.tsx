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
import { PADDING_CRUCE } from '@/components/shared/CompareSlab';
import { MapPin, Martini, MusicNote, Truck, UserCircle } from '@/components/shared/Icon';
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

        {/*
          ══════════════════════════════════════════════════════════════════════
          CINCO TARJETAS IGUALES, SIN DESTACADA Y SIN FOTO.

          ⚠️ HUBO UNA CELDA GRANDE EN `deep` CON LA FOTO DE LA BARRA Y SE FUE.
          Camila, 2026-09-21: «no debería tener una imagen o resaltar tanto, las
          5 deben tener mismo nivel de lectura».

          Tiene razón y el contenido lo respalda: los cinco puntos responden la
          MISMA pregunta —qué viene incluido cuando alquilás— y ninguno es la
          respuesta principal. Darle a uno el doble de alto, una foto y fondo
          oscuro lo convertía en el titular de la sección y a los otros cuatro en
          su letra chica. El argumento que yo había usado para destacarlo —que
          el bar es lo único que factura el venue— es cierto pero es de otra
          conversación: eso lo cuenta la comparativa, no esta lista.

          ⚠️ Y CON LA DESTACADA SE VA LA ÚNICA FOTO de la sección. No hace falta:
          lo que esta banda enumera son servicios, no lugares, y una foto de la
          barra al lado de cuatro tarjetas de texto volvía a romper la paridad
          por otro lado.

          ⚠️ LA GRILLA VA DE 1 A 5 COLUMNAS Y SALTEA EL 4. Con cinco ítems, una
          fila de cuatro deja uno solo colgando abajo, que es la peor de las
          repartijas. Los cortes son 1 · 2 · 3 · 5: en `desk` entran las cinco en
          una línea —(1288 menos 4x20)/5 = 241px por tarjeta— y abajo de eso van
          3+2, que se lee como dos filas y no como una fila rota.
          ══════════════════════════════════════════════════════════════════════
        */}
        <StaggerGroup
          as="ul"
          className="mt-bloque grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 md:grid-cols-3 desk:grid-cols-5"
        >
          {INCLUIDO.map((item) => (
            <RevealItem as="li" key={item.label} className="h-full">
              {/*
                ⚠️ EL ICONO VA SUELTO ADENTRO DE LA TARJETA Y NO EN UN SELLO.
                Camila: «que los iconos no estén en los circulitos, que estén
                integrados en cada card».

                Antes eran los tres anillos concéntricos de la home montados a
                caballo del borde de arriba. Esa pieza está pensada para
                DESTACAR —numera los tres pasos del yard, rotula las dos
                columnas de la comparativa— y acá multiplicada por cinco pedía
                más atención que el texto que acompaña, además de obligar a un
                `pt` de 44px y a un `gap-y` de 56 en la grilla para que un sello
                no pisara la fila de arriba.

                Suelto y en `sunset-deep` hace el mismo trabajo de color con una
                pieza en vez de cuatro capas. `sunset-deep` y no `sunset`: sobre
                claro el naranja de marca da 2.54:1 y no pasa; este da 3.54:1,
                que es la barra de texto grande, y un icono de 32px la cumple.
              */}
              <article className="flex h-full flex-col gap-2.5 rounded-ticket bg-paper p-6 sombra-card transition-transform duration-300 ease-brand hover:-translate-y-1.5">
                <item.Icon aria-hidden="true" className="size-8 text-sunset-deep" />
                <Eyebrow tone="terra" className="mt-1.5">
                  {item.label}
                </Eyebrow>
                <h3 className="m-0 font-display text-d6 font-bold uppercase leading-[1.05] text-ink">
                  {item.title}
                </h3>
                <p className="m-0 font-body text-base font-light leading-[1.6] text-body/80">
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
    label: 'The bar',
    title: 'The Sunset Bar is ours',
    body: 'Our own team pours it. Open bar, drink tickets or consumption.',
    Icon: Martini,
  },
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
