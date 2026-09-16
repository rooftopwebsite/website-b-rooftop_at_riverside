import { ButtonLink } from '@/components/shared/Button';
import Section from '@/components/shared/Section';
import { Heading, SectionHead } from '@/components/shared/Type';
import { Reveal, RevealItem, StaggerGroup } from '@/components/shared/Motion';
import { Martini, Truck } from '@/components/shared/Icon';

/**
 * «Cómo se pide acá»: las dos ventanillas, enfrentadas.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ESTE BLOQUE OCUPA EL LUGAR DE UN COMPARATIVO QUE NO PODÍAMOS HACER, y
 * conviene dejar escrito el cambio porque la FORMA es prestada y el CONTENIDO
 * no.
 *
 * La referencia que fijó Camila —defoodtruckclub.nl— tiene el mismo bloque en
 * dos de sus páginas: dos tarjetas de borde punteado enfrentadas, la propia con
 * tildes verdes y la de «los caterings comunes» con cruces rojas. Es un
 * argumento de venta B2B de una empresa que ALQUILA food trucks para eventos.
 *
 * Acá eso no existe: nuestros trucks son negocios independientes estacionados
 * en el yard, no se alquilan, y el cliente nunca escribió un argumento
 * comparativo. Ponerle texto a esas dos tarjetas habría sido inventarlo.
 *
 * Camila, 2026-09-16: reemplazarlo por «cómo se pide acá».
 *
 * ⚠️ Y RESULTA SER MEJOR QUE UN COMPARATIVO, porque explica LO QUE LA GENTE
 * ENTIENDE MAL. Es el malentendido de raíz del negocio, el mismo que la home
 * corrige con «Not a restaurant. Three of them»: el visitante llega pensando
 * que es un restaurante con varias cocinas y una sola cuenta. No lo es. Cada
 * truck cobra lo suyo y el único que lleva cuenta es el bar de arriba.
 *
 * ⚠️ TODOS LOS DATOS SON REALES Y YA ESTÁN PUBLICADOS. Los seis renglones
 * salen de `YardSteps` y de `ThreeDoors`, en la home, palabra por palabra o
 * reescritos sin agregar un hecho nuevo. Ninguno es una promesa de servicio
 * que el cliente no haya hecho.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ NO HAY TILDES NI CRUCES, y eso sí cambia respecto de la referencia. Allá
 * una columna es la buena y la otra la mala; acá las dos son NUESTRAS, y
 * marcar una con cruces rojas diría que pedirle a un truck está mal. El
 * contraste lo hace el material de la tarjeta —clara contra oscura— y el punto
 * de viñeta, que es el recurso que las tarjetas del yard ya usan.
 */

interface Ventanilla {
  readonly rotulo: string;
  readonly titulo: string;
  readonly lineas: readonly string[];
  readonly Icon: typeof Truck;
  /** Las clases del material. Ver la nota de arriba. */
  readonly caja: string;
  readonly tinta: string;
  readonly punto: string;
  readonly filete: string;
}

const VENTANILLAS: readonly Ventanilla[] = [
  {
    rotulo: 'At the trucks',
    titulo: 'You order at the window',
    lineas: [
      'Four independent kitchens, each one its own business.',
      'You order at the window and you pay that truck.',
      'Separate line, separate card, separate receipt.',
      'No table service, and no single check for the yard.',
    ],
    Icon: Truck,
    caja: 'bg-paper',
    tinta: 'text-ink',
    punto: 'bg-sunset',
    filete: 'border-fog',
  },
  {
    rotulo: 'At the Sunset Bar',
    titulo: 'The one tab we run',
    lineas: [
      'The bar on the roof is ours, and it is the only tab we keep.',
      'Cocktails made that morning and drafts from breweries twenty minutes away.',
      'It is the only menu on this site with prices, because it is the only one that is ours.',
      'A 22% gratuity is applied to unsigned bar tabs.',
    ],
    Icon: Martini,
    caja: 'bg-deep',
    tinta: 'text-paper',
    punto: 'bg-cream',
    filete: 'border-paper/20',
  },
];

export default function HowToOrder({ id = 'order-title' }: { readonly id?: string }) {
  return (
    <Section tone="paper" band="lg" labelledBy={id}>
      <Reveal>
        <SectionHead
          eyebrow="How it works"
          eyebrowTone="plum"
          title={
            <>
              Two windows, <span className="text-sunset-deep">two ways to pay</span>
            </>
          }
          id={id}
          lead="It looks like one restaurant and it is not. Knowing which counter does what is the only thing worth reading before you come."
        />
      </Reveal>

      {/*
        ⚠️ DOS COLUMNAS DESDE `md` Y NO DESDE `lg`. Son dos tarjetas, no tres:
        a 768px cada una queda en 360px, que alcanza para un titular de dos
        renglones y cuatro viñetas cortas. La regla de «1 y después 3 sin pasar
        por 2» que rige las grillas de tres de la home no aplica acá, porque con
        dos elementos nunca hay huérfana.

        ⚠️ Y VAN ENFRENTADAS, `items-stretch`, para que las dos midan lo mismo.
        El contraste del bloque es claro CONTRA oscuro: si una es más alta que
        la otra, el par deja de leerse como un par.
      */}
      <StaggerGroup
        as="ul"
        className="mt-bloque grid list-none grid-cols-1 items-stretch gap-6 p-0 md:grid-cols-2"
      >
        {VENTANILLAS.map(({ rotulo, titulo, lineas, Icon, caja, tinta, punto, filete }) => (
          <RevealItem as="li" key={rotulo} className="h-full">
            <div
              className={`flex h-full flex-col rounded-shell p-7 sombra-card lg:p-9 ${caja} ${tinta}`}
            >
              <div className="flex items-center gap-3.5">
                <Icon className="size-8 shrink-0" />
                <span className="font-body text-caption font-bold uppercase tracking-eyebrow">
                  {rotulo}
                </span>
              </div>

              <Heading level={3} className="mt-5 max-w-[16ch] text-d5 lg:text-d4">
                {titulo}
              </Heading>

              <ul className={`m-0 mt-6 flex list-none flex-col gap-3.5 border-t p-0 pt-6 ${filete}`}>
                {lineas.map((linea) => (
                  <li key={linea} className="flex gap-3.5">
                    {/* El punto va a la altura de la primera línea del texto,
                        no centrado en el renglón: con dos renglones, centrado
                        queda flotando en el medio del párrafo. */}
                    <span
                      aria-hidden="true"
                      className={`mt-2.25 size-1.5 shrink-0 rounded-pill ${punto}`}
                    />
                    <span className="font-body text-base font-light leading-[1.5]">{linea}</span>
                  </li>
                ))}
              </ul>

              {/* El CTA va en la tarjeta oscura y no en las dos: la clara
                  describe negocios que no son nuestros, así que no hay nada a
                  dónde mandar a nadie. La del bar sí tiene destino. */}
              {caja === 'bg-deep' ? (
                <span className="mt-auto pt-8">
                  <ButtonLink href="/sunset-bar" variant="onDark">
                    See the bar menu
                  </ButtonLink>
                </span>
              ) : (
                <span className="mt-auto pt-8">
                  <ButtonLink href="/food-trucks" variant="secondary">
                    All four trucks
                  </ButtonLink>
                </span>
              )}
            </div>
          </RevealItem>
        ))}
      </StaggerGroup>
    </Section>
  );
}
