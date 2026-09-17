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
      className="bg-bone grano px-borde pt-[34px] pb-[48px] lg:pt-[46px] lg:pb-[64px]"
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
          className="relative z-10 mx-auto mt-5 mb-[-0.94em] w-fit max-w-full rounded-b-frame bg-bone grano px-[0.3em] pb-[0.12em] text-center font-display text-banda font-extrabold uppercase text-ink lg:mt-7"
        >
          {title}
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
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-frame bg-fog sm:aspect-[16/9] lg:aspect-[17/9] lg:max-h-[calc(100svh-378px)]">
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
