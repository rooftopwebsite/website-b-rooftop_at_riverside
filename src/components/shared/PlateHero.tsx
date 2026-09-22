import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Crumb } from '@/components/shared/PageHero';
import { PhotoPending } from '@/components/shared/PendingData';

/**
 * El hero de la placa: una pregunta, el titular gigante centrado en una placa
 * del color de la página, y la foto ancha que la placa muerde por arriba.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ES UN CALCO DE COMPOSICIÓN, PEDIDO ASÍ. Camila, 2026-09-16, señalando
 * `defoodtruckclub.nl/diensten/bbq-catering`: «copiemos este hero para Sunset
 * Bar». Es el segundo mecanismo que sale de esa misma referencia —el primero
 * es `DiscHero`, que abre `/game-truck`— y vale la misma regla que está
 * escrita en `docs/design-references.md`: **una referencia no se copia
 * entera, se le saca un mecanismo**.
 *
 * Lo que se toma son cuatro decisiones de composición:
 *
 *   · una PREGUNTA arriba de todo, centrada, en cuerpo de bajada. Es la que
 *     hace el trabajo de intención de búsqueda antes de que el titular diga
 *     el nombre;
 *   · el titular en caja alta, centrado, en dos renglones;
 *   · una PLACA del color de la página detrás del titular, con las dos
 *     esquinas de abajo redondeadas;
 *   · una foto ANCHA que arranca detrás de esa placa, o sea que la placa la
 *     muerde por el borde de arriba.
 *
 * Lo que NO se toma: ni una palabra de su copy, ni su tipografía, ni su rosa,
 * ni sus fotos. Acá va nuestra display sobre `bone`, con nuestro radio de
 * marco y la foto del venue.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ EL FONDO ES `bone` Y NO `paper`, o sea que este hero ROMPE la regla de
 * superficie de las internas —«la base de la home es el hueso, la de las 22
 * internas es el blanco puro»— y lo hace por pedido: Camila, 2026-09-16,
 * «cuidado que el blanco del fondo del hero no sea blanco puro, debe ser como
 * el del home y con el efecto noise».
 *
 * ⚠️ EL `grano` VA ESCRITO AUNQUE EL `body` YA LO TENGA. En cuanto esta
 * sección pinta su propio `bg-*`, tapa el grano del suelo: el grano se pinta
 * POR SUPERFICIE y no se hereda. Sin la clase, el hero queda liso en el medio
 * de una página con textura, que es justo lo contrario de lo que se pidió.
 *
 * ⚠️ LA PLACA ES `bg-bone grano`, LAS DOS COSAS, Y TIENE QUE SER EL MISMO PAR
 * QUE LA SECCIÓN. El color solo no alcanza: una placa lisa del mismo color se
 * recorta igual contra un fondo granulado. Es la misma nota que tiene el
 * recorte del hero de la home, y se rompe de la misma forma. Si mañana este
 * hero cambia de superficie, los dos `bg-*` se mueven juntos o aparece el
 * rectángulo.
 *
 * ⚠️ LA SECCIÓN DE ABAJO TAMBIÉN PASÓ A `bone`, así que la mitad de arriba de
 * `/sunset-bar` es una sola superficie continua. Si alguna vez una de las dos
 * vuelve a `paper`, el escalón no se va a ver —`bone` contra `paper` da
 * 1.08:1— pero el grano sí cambia de fase en el corte, y eso se nota.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ EL TITULAR TIENE QUE IR EN DOS RENGLONES, y eso es un contrato con quien
 * lo escribe, no un detalle. El solapamiento es un margen negativo de
 * `-0.94em`, que son exactamente la mitad de la placa cuando mide dos
 * renglones (2 × 0.88 de interlínea + 0.12 de acolchado abajo = 1,88em). Con
 * dos renglones la foto arranca en el medio del titular, que es el gesto de
 * la referencia.
 *
 * Con UN renglón la foto taparía el titular entero, así que el corte se pasa
 * desde la página —`title={<>Bonita&rsquo;s only<br />rooftop</>}`— y no se
 * deja librado a dónde caiga el reflow.
 *
 * ⚠️ EL NÚMERO VA EN `em` Y NO EN PÍXELES a propósito: `em` se mide contra el
 * tamaño del titular, que es un `clamp` de 45 a 112px. En píxeles el
 * solapamiento sería correcto en una medida y mal en las otras.
 *
 * ⚠️ EL TITULAR VA EN `text-banda` Y NO EN `text-titan`, que es el cuerpo más
 * grande del sitio. A 144px «Bonita's only» no entra en un renglón de 1168 y
 * el contrato de los dos renglones se rompe solo. `banda` topea en 112 y deja
 * el renglón más largo en 728px, con aire de sobra.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ ROMPE CON `PageHero`, que es el hero de las otras internas — la misma
 * deuda que ya abrió `DiscHero` y con la misma salida anotada: si molesta que
 * las internas abran de tres formas distintas, el camino es llevar ESTE hero
 * a las demás, no volverlo atrás.
 *
 * Lo que sí se conserva son las MIGAS, con el mismo marcado y el mismo
 * `aria-label` que `PageHero`: son SEO y orientación, no decoración.
 */
export default function PlateHero({
  question,
  title,
  titleId = 'page-title',
  lead,
  photo = null,
  photoAlt,
  photoBrief,
  crumbs,
  children,
}: {
  /** La pregunta de arriba. Va en cuerpo, no en caja alta: es una frase. */
  readonly question: string;
  /**
   * El H1. Va con el corte de renglón escrito a mano — ver la nota de arriba.
   *
   * ⚠️ TIENE QUE COINCIDIR CON `PAGE_SEO`, que es de donde sale el H1 de cada
   * ruta y lo que compara `npm run check:seo`.
   */
  readonly title: ReactNode;
  /**
   * El `id` del H1 y el destino del `aria-labelledby` de la sección.
   *
   * ⚠️ TIENE VALOR POR DEFECTO PORQUE UNA PÁGINA TIENE UN SOLO HERO: en una
   * ruta normal esto no se pasa. Existe para la página de muestras, que monta
   * varios heroes seguidos para comparar y no puede repetir el `id`.
   */
  readonly titleId?: string;
  readonly lead?: ReactNode;
  readonly photo?: string | null;
  readonly photoAlt?: string | null;
  /** El brief EN ESPAÑOL de la foto que falta. Mismo contrato que `PageHero`. */
  readonly photoBrief?: string | null;
  readonly crumbs?: readonly Crumb[];
  readonly children?: ReactNode;
}) {
  return (
    <section
      aria-labelledby={titleId}
      /*
        ⚠️ SIN `px-borde`. LA SECCIÓN NO LLEVA GUTTER PROPIO porque el
        `caja-ancha` de adentro ya lo pone, y los dos juntos SE SUMAN — es
        exactamente el par que la nota de `caja-ancha` en `globals.css` dice
        que no se combina.

        Estuvo sumando desde el principio y el costo se veía en mobile: 48px
        de aire por lado sobre 375 útiles dejaban la foto en 279px, o sea
        EXACTAMENTE tan ancha como la placa del titular. Con la placa del
        mismo ancho que la foto no hay mordida, y la mordida es la forma de
        este hero: se veía una placa apoyada arriba de una foto, no una placa
        entrando en ella. Camila, 2026-09-17: «el hero se debe apreciar, tener
        protagonismo».
      */
      className="bg-bone grano pt-[34px] pb-[48px] lg:pt-[46px] lg:pb-[64px]"
    >
      <div className="caja-ancha">
        {crumbs && crumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="mb-[20px]">
            <ol className="flex flex-wrap items-center gap-x-[8px] gap-y-[2px] text-[13px] text-body/75">
              <li>
                <Link href="/" className="link-texto">
                  Home
                </Link>
              </li>
              {crumbs.map((c, i) => (
                <li key={c.path} className="flex items-center gap-[8px]">
                  <span aria-hidden="true">/</span>
                  {i === crumbs.length - 1 ? (
                    <span aria-current="page" className="text-body/80">
                      {c.name}
                    </span>
                  ) : (
                    <Link href={c.path} className="link-texto">
                      {c.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        {/*
          ⚠️ LA PREGUNTA NO ES UN `Eyebrow`. El componente de rótulo del sitio
          es micro en caja alta con tracking, que es lo que se le pone a una
          ETIQUETA de sección. Esto es una frase con signo de pregunta y tiene
          que leerse como tal: va en cuerpo, a tamaño de bajada.
        */}
        <p className="mx-auto max-w-[40ch] text-center font-body text-intro font-light text-body/85">
          {question}
        </p>

        <h1
          id={titleId}
          className="relative z-10 mx-auto mt-5 mb-[-0.94em] w-fit max-w-[calc(100%-2*var(--radius-frame))] rounded-b-frame bg-bone grano px-[0.3em] pb-[0.12em] text-center font-display text-banda font-extrabold uppercase text-ink lg:mt-7"
        >
          {title}

          {/*
            ══════════════════════════════════════════════════════════════
            ⚠️ LAS DOS ESQUINAS INVERSAS. Camila las marcó sobre la página con
            dos flechas rojas en los ángulos vivos, igual que las había pasado
            para el hero de la home: «colocá los elementos vectoriales que
            usamos en el home en esas dos esquinas».

            ES EL MISMO PROBLEMA QUE EN LA HOME y la misma pieza. Esta placa
            muerde el borde de arriba de la foto, así que donde sus dos
            costados cruzan ese borde quedan dos ángulos de 90°, y un ángulo
            vivo entre dos superficies delata que una está tapando a la otra.
            Con el radio invertido el hueso no termina: se curva y entra en la
            foto. La nota larga de por qué es una máscara y no un
            `border-radius` está en `globals.css`, en la utilidad.

            ⚠️ VAN COLGADAS DE LA PLACA Y NO ADENTRO DE LA FOTO. La placa es
            `w-fit`: su ancho es el del titular, que cambia con el texto, con
            el viewport y con si la display ya cargó. Metidas en la caja de la
            foto habría que medirlo en JS como hace la home con su recorte;
            colgadas de `left-full` y `right-full` se acomodan solas.

            ⚠️ Y POR ESO LA PLACA SE TOPA EN `100% − 2×--radius-frame` Y NO EN
            `max-w-full`, que es lo que tenía. Colgadas del costado, las dos
            esquinas no cuentan para el ancho de la placa: si la placa llega al
            borde del contenedor, las esquinas quedan directamente afuera de la
            página. Pasaba en /sunset-bar a 360px —el titular medía 275 y el
            hueco que quedaba era de 43, uno menos que los 44 de la pieza— y
            arrastraba 1px de scroll horizontal a todo el documento; a 320px
            eran 16. Reservando los dos anchos de esquina, el titular parte un
            renglón antes en celular y las piezas caen siempre adentro de la
            caja de la foto, que es donde tienen que morder.

            Decisión de Camila, 2026-09-21, sobre las tres opciones: recortar
            el hero, angostar el titular o dejar el píxel. Eligió angostar.

            ⚠️ LA ALTURA ES `100% − 0.94em`, QUE ES EL MISMO NÚMERO DEL
            `mb-[-0.94em]` de esta placa, o sea exactamente donde arranca la
            foto. Está escrito en `em` por el mismo motivo que el margen: se
            mide contra el titular, que es un `clamp` de 45 a 112px, y en
            píxeles daría bien en una medida y mal en las otras. Los dos
            números se mueven juntos — si cambia el solapamiento, cambia acá.

            ⚠️ LA IZQUIERDA VA ESPEJADA Y LA DE LA HOME NO. `globals.css`
            avisa que las dos esquinas de la home son la misma pieza SIN
            ROTAR, y esto no la contradice: allá el recorte está en una
            ESQUINA del marco y sus dos ángulos vivos miran para el mismo
            lado. Acá la placa está CENTRADA, así que los dos ángulos son
            simétricos y el de la izquierda es el espejo del de la derecha.

            Es espejo (`scale-x-[-1]`), no rotación. La advertencia de
            `globals.css` es contra ROTAR, que es lo que invierte la dirección
            del mordisco y se lee como la foto metiéndose en el hueso. Un
            espejo horizontal deja el disco abajo, que es de donde viene la
            foto en los dos lados.
            ══════════════════════════════════════════════════════════════
          */}
          <span
            aria-hidden="true"
            className="esquina-inversa top-[calc(100%-0.94em)] left-full"
          />
          <span
            aria-hidden="true"
            className="esquina-inversa top-[calc(100%-0.94em)] right-full scale-x-[-1]"
          />
        </h1>

        {/*
          ⚠️ LA CAJA DE LA FOTO SE ACHATA CON LA PANTALLA, de 16:10 en un
          teléfono a 17:9 en desktop. No es cosmético: la placa le muerde el
          borde de arriba siempre lo mismo —media altura del titular— y esa
          mordida es proporcionalmente enorme en una caja angosta. Con la caja
          más apaisada arriba, lo que queda de foto es una banda a lo ancho,
          que es lo que se ve en la referencia.

          ⚠️ EN DESKTOP ERA 21:9 Y SUBIÓ A 17:9 PARA TAPAR EL PLIEGUE. Camila:
          «que no asomen las olas al comienzo, que deba hacer scroll para
          verlas; haz que la imagen sea algo más alta». Con 21:9 el pie de la
          foto caía en 833 de una pantalla de 950 y la cenefa de la sección
          siguiente asomaba por abajo; con 17:9 cae en 989 y hay que scrollear.

          ⚠️ LA PROPORCIÓN DE ACÁ Y LA DEL ARCHIVO TIENEN QUE SER LA MISMA. La
          derivada se genera en 2576×1364 —17:9— justamente para que
          `object-cover` no recorte nada. Si esta caja cambia de proporción sin
          regenerar el archivo, el recorte se lo come por los costados, que en
          esta foto son los dos vasos de los extremos. El número vive en la
          entrada de `scripts/build-media.mjs`.
        */}
        {/*
          ══════════════════════════════════════════════════════════════════
          ⚠️ EL `max-h` ES LO QUE GARANTIZA QUE SE VEA FONDO DEBAJO DE LA FOTO
          SIN SCROLLEAR. Camila, 2026-09-17: «quiero ver al menos 40px de fondo
          crema debajo de la imagen sin necesidad de hacer scroll». Con la
          proporción sola, en 1920×972 el pie de la foto caía en 952 y quedaban
          20px: se leía como si la imagen estuviera cortada por la pantalla.

          ⚠️ LOS 378 SON UNA CUENTA, no un número de gusto: 333 de todo lo que
          la foto tiene encima —barra de servicio, header, la pregunta y la
          mitad de la placa que no la pisa— más los 40 de fondo pedidos, más
          cinco de colchón para el redondeo. Si cambia el alto del header o el
          cuerpo del titular, este número se mueve con ellos.

          ⚠️ ES `max-h` Y NO `h`, y la diferencia importa: así la proporción
          17:9 sigue mandando en una pantalla holgada y el tope sólo entra a
          jugar cuando la pantalla es baja. Ahí la caja se vuelve más apaisada
          que el archivo, o sea que `object-cover` recorta ARRIBA Y ABAJO —24px
          repartidos en 972— y nunca por los costados, que es donde están los
          dos vasos de los extremos.

          ⚠️ LO QUE ESTE TOPE NO PUEDE RESOLVER: arriba de ~1015px de alto de
          viewport, la cenefa de la sección siguiente vuelve a asomar. Son dos
          pedidos que se cruzan —«que no asomen las olas» y «40px de fondo»— y
          sólo se cumplen los dos juntos mientras la pantalla esté en el rango
          normal de un portátil o un monitor de 1080. Para cumplirlos SIEMPRE
          habría que atar el alto de la foto al viewport, y eso recorta la foto
          por los costados en pantallas altas.
          ══════════════════════════════════════════════════════════════════
        */}
        {/*
          ══════════════════════════════════════════════════════════════════
          ⚠️ EN MOBILE LA FOTO ES VERTICAL (4:5) Y ANTES ERA APAISADA (16:10).
          Pedido de Camila, 2026-09-17: «en mobile la imagen debe ser vertical
          dado que pierde lo horizontal».

          Tiene razón y el número lo muestra: a 390px una caja 16:10 mide
          343×214, o sea una franja de 214px de alto en una pantalla de 844.
          El hero ocupaba un cuarto de la pantalla y la foto se leía como un
          banner, no como la portada de la página. En 4:5 la misma caja mide
          343×429 y el hero pasa a ocupar la mitad de arriba, que es el
          protagonismo que se pidió.

          ⚠️ 4:5 Y NO 3:4 NI 9:16. Con 3:4 (343×457) y sobre todo con 9:16
          (343×610) la foto empuja la bajada y los CTA fuera del pliegue, y
          este hero los tiene abajo. 4:5 es el vertical más alto que deja
          asomar lo que sigue.

          ⚠️ LA PROPORCIÓN VA EN CUATRO ESCALONES Y NO EN DOS, que es lo que
          pidió Camila al mandar a mirar los otros proyectos de la casa: «fijate
          cómo van variando los márgenes mínimos entre dispositivos».

              mobile   4:5    vertical, el hero ocupa media pantalla
              sm       4:3    la transición
              md      16:9    apaisada
              lg      17:9    la proporción del archivo

          El par 4:5 → 16:9 saltaba de vertical a muy apaisada en un solo
          pixel de viewport: medido a 640px, la foto pasaba de 512×640 a
          585×329 y el hero perdía de golpe la presencia que acababa de ganar
          en el teléfono. `4/3` en el medio es el escalón que falta, y es el
          mismo criterio con el que el gutter crece 16 → 24 → 32 en vez de
          saltar.

          ⚠️ EL ESCALÓN DE `md` NO ES DECORATIVO: 16:9 entra recién cuando el
          ancho alcanza para que una foto apaisada siga siendo alta. Abajo de
          768 la caja queda en una banda de menos de 340px de alto, que es la
          franja que este cambio vino a sacar.

          ⚠️ EL RECORTE DE `object-cover` CAMBIA Y ESO ES LO QUE HAY QUE
          MIRAR AL CAMBIAR LA FOTO: el archivo es 17:9, así que en una caja
          4:5 se recorta FUERTE por los costados. En la foto de `/sunset-bar`
          eso se come los dos vasos de los extremos, que en desktop son los
          que cierran la composición. Es el precio del vertical y es el que
          se pidió; si alguna foto no tolera el recorte, la salida es una
          derivada vertical propia, no volver la caja a apaisada.
          ══════════════════════════════════════════════════════════════════
        */}
        {/*
          ⚠️ EL `bg-fog` VA SÓLO DETRÁS DE FOTO REAL, y es la misma regla que ya
          tienen `VenueTabs` y `TruckCards`. Es el color de la caja mientras la
          imagen baja; con el hueco adentro pasa a ser el FONDO del marcador, y
          `PhotoPending` en tono claro está calibrado contra `paper` o `bone`,
          no contra el fog.

          Lo encontró axe el 2026-09-22, al ser `/game-truck` la primera página
          que usa este hero SIN foto: el rótulo «Falta la foto» va en `ink/65`
          sobre el 6 % de tinta del marcador, y con el fog debajo el par caía
          por debajo de 4.5:1. Marcado `serious` en las dos anchuras.

          Sin `bg-fog` el marcador se apoya en el `bone` de la sección, que es
          la superficie para la que sus tres opacidades están medidas.
        */}
        <div
          className={[
            'relative aspect-[4/5] w-full overflow-hidden rounded-frame',
            photo ? 'bg-fog' : '',
            'sm:aspect-[4/3] md:aspect-[16/9] lg:aspect-[17/9] lg:max-h-[calc(100svh-378px)]',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {photo ? (
            <Image
              src={photo}
              alt={photoAlt ?? ''}
              fill
              priority
              sizes="(min-width: 1400px) 1288px, 100vw"
              className="object-cover"
            />
          ) : (
            <PhotoPending
              brief={photoBrief ?? 'Falta definir qué foto va acá.'}
              ratio=""
              className="absolute inset-0 h-full rounded-none border-0"
            />
          )}
        </div>

        {lead ? (
          <p className="mx-auto mt-8 max-w-[62ch] text-center text-lead text-body/80 lg:mt-10">
            {lead}
          </p>
        ) : null}

        {children ? (
          <div className="mt-gap-cta flex flex-wrap items-center justify-center gap-3.5">
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}
