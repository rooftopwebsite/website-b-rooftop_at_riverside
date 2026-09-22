/**
 * Lo que viene con cada espacio que se alquila, como sección de `/events`.
 *
 * ⚠️ ERA LA PÁGINA `/events/spaces` y se mudó acá entera. Camila, definiendo
 * qué tiene que tener la página de eventos: «quiero que esté la info de qué se
 * alquila y cierra para eventos privados, y el formulario o info para
 * reservar».
 *
 * ⚠️ EL `id="spaces"` ES EL DESTINO DEL REDIRECT 301 de la ruta vieja, así que
 * no se renombra. Ver `next.config.ts`. También es donde cae el CTA «See the
 * spaces» del hero de `/events`.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LA LISTA DE LOS CUATRO ESPACIOS SE FUE EL 2026-09-22, y con ella la mitad
 * de este archivo. Camila, sobre la captura de «Pick your footprint»: «esta
 * parte se puede contar mucho mejor; de hecho creo que ya más o menos se está
 * contando en "Lo que viene con cada espacio", ¿no lo crees? ¿por qué no la
 * sacamos?».
 *
 * Tiene razón, y lo que quedaba de esas tarjetas lo explica: sin capacidades
 * —los doce números están en `null`— y sin fotos —los cuatro `photo` también—,
 * cada tarjeta era un título, un párrafo y cuatro píldoras de «best for». Es
 * decir, la misma promesa que hace la banda que quedó, repartida en cuatro
 * cajas que no podían decir lo único que las diferencia: cuánta gente entra en
 * cada una.
 *
 * QUÉ SE FUE CON ELLA:
 *
 *   · `SpaceCard`, que no la usaba nadie más.
 *   · El `PendingBlock` de «capacities, minimums and a photo of each space».
 *     ⚠️ EL PEDIDO SIGUE ABIERTO: vive en `docs/pedido-al-cliente.md` y los
 *     cuatro `photoBrief` siguen en `content/spaces.ts`, que es donde el
 *     fotógrafo los lee. Lo que se fue es el cartel, no el faltante.
 *   · `SPACES` deja de leerse acá. El archivo `content/spaces.ts` NO se borra:
 *     de ahí sale `AREAS_OF_INTEREST`, que son las casillas del formulario.
 *
 * ⚠️ EL MÍNIMO DE 12 INVITADOS SÍ ESTÁ PUBLICADO, y es el único número de
 * capacidad que el cliente publica hoy: `eatdrinkparadise.com/hostanevent`
 * dice «*For parties less than 12 people contact: 239-268-0080» y nada más.
 * Ese dato vive en `SMALL_PARTY_MAX` y lo escribe la columna del formulario.
 * No hay máximos en ninguna fuente y no se estiman.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ QUÉ SE HABÍA IDO ANTES, EL 2026-09-21, y no vuelve: los doce marcadores
 * TBD de aforo (uno por dato y por espacio), las cuatro fotos pendientes, la
 * losa naranja «December fills first» —la página cerraba con DOS losas
 * `bg-sunset` idénticas en forma— y los cuatro botones «Ask about <espacio>»,
 * que apuntaban los cuatro al mismo `#inquire`.
 *
 * ⚠️ EL AIRE DE ARRIBA ES `PADDING_CRUCE` Y NO SE PUEDE SACAR. Arriba de esta
 * sección va el `CompareSlab` de la página, cuyas dos tarjetas se salen de la
 * losa oscura con un `-mb-32` y aterrizan acá. Sin este `pt` —y sin el
 * `bandTop="none"` que lo acompaña— las tarjetas caen encima del titular.
 * El número se importa del propio `CompareSlab` para que viva en un solo lado.
 */
import { PADDING_CRUCE } from '@/components/shared/CompareSlab';
import { Car, Martini, MusicNote, Truck, UserCircle } from '@/components/shared/Icon';
import { RevealItem, StaggerGroup } from '@/components/shared/Motion';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading } from '@/components/shared/Type';

export default function EventSpaces() {
  return (
    <div id="spaces" className="scroll-mt-24">
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

        ⚠️ LOS ICONOS SALEN DE `shared/Icon.tsx`, y tres se dibujaron para esta
        lista: `UserCircle` para el contacto único, `MapPin` para el
        estacionamiento —reemplazado el 2026-09-22 por `Car`, ver la nota de esa
        tarjeta— y el propio `Car`. El repo dibuja su propio set en vez de
        instalar Phosphor —el porqué está en la cabecera de ese archivo— así que
        sumar uno es el camino previsto, no un atajo.
        ══════════════════════════════════════════════════════════════════════
      */}
      {/*
        ⚠️ ESTA BANDA HEREDÓ EL HUECO DE LAS TARJETAS CRUZADAS. Lo tenía la
        sección de arriba —«Pick your footprint»— que se borró el 2026-09-22,
        y sin el hueco las dos tarjetas del `CompareSlab`, que salen de la losa
        oscura con un `-mb-32`, aterrizan encima de este titular.

        ⚠️ VA EN `innerClassName` Y CON `bandTop="none"`, que es como el
        componente pide que se haga: el porqué —dos `padding-top` peleando por
        orden de compilación— está escrito en `PADDING_CRUCE`.
      */}
      <Section
        tone="cream"
        band="lg"
        bandTop="none"
        innerClassName={PADDING_CRUCE}
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
  /*
    ⚠️ ESTA TARJETA SE REESCRIBIÓ ENTERA EL 2026-09-22. Camila, sobre la
    captura: «esta card está extraña: cambia el icono, no representa
    estacionamiento; el "cómo llegar aquí" tampoco tiene mucho sentido que diga
    "estacionamiento", y en el título mejor digamos algo como "vente en tu
    vehículo"; y teniendo en cuenta estos cambios, modifica la bajada para que
    esté acorde».

    Los tres problemas eran el mismo: la tarjeta estaba escrita desde el dato
    —dónde hay lugar para estacionar— y las otras cuatro están escritas desde
    lo que el cliente RECIBE. «Street parking on Old 41» como título de una
    lista que dice «la barra es nuestra», «coordinamos las cocinas» y «el
    sonido ya está» sonaba a disculpa.

    Ahora el título es una invitación, la bajada dice dónde se deja el auto y
    el icono es un auto y no un alfiler de mapa.

    ⚠️ NO PROMETE QUE SEA GRATIS. Nunca lo dijo y no lo va a decir: que los
    lotes públicos no se paguen es de las cosas que el cliente todavía no
    confirmó (ítem 51 de `docs/pedido-al-cliente.md`).
  */
  {
    label: 'Getting here',
    title: 'Come in your own car',
    body: 'Street parking on Old 41, plus the public lots around Riverside Park.',
    Icon: Car,
  },
  {
    label: 'The planning',
    title: 'One point of contact',
    body: 'The same person, from the first email through load-out.',
    Icon: UserCircle,
  },
] as const;
