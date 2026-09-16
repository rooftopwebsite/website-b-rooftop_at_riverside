import DishCard from '@/components/shared/DishCard';
import Section from '@/components/shared/Section';
import { PendingBlock } from '@/components/shared/PendingData';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
import { RevealItem, StaggerGroup } from '@/components/shared/Motion';
import { getTruckMenu } from '@/lib/restoexp';
import { TAG } from '@/lib/tag';

/**
 * La carta de un food truck.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ HOY NINGÚN TRUCK TIENE CARTA CARGADA, Y LA SECCIÓN EXISTE IGUAL. Es un
 * pedido explícito: «armalo con lo que tenemos hoy contemplando que en cada
 * uno tendremos el menú digital» (Camila, 2026-09-16).
 *
 * El día que el cliente cree un menú llamado «El Chilango» en el dashboard,
 * esta sección se llena sola en la próxima revalidación. No hay que tocar
 * código, no hay que hacer deploy y no hay que acordarse de nada: el match va
 * por nombre de truck, y está explicado en `getTruckMenu`.
 *
 * ⚠️ MIENTRAS NO HAY CARTA SE MUESTRA EL HUECO, no se esconde la sección. Es
 * la regla del proyecto para todo dato que falta: el recuadro marcado es lo que
 * hace que el hueco se note y se pida. Si la sección desapareciera, nadie se
 * acordaría de que a estas cuatro páginas les falta lo más importante.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ ES ASYNC Y VIVE EN SU PROPIO ARCHIVO, y eso es deliberado: la página del
 * truck ya hace dos lecturas a la base y meter una tercera en el mismo
 * componente las serializa. Como sección aparte, Next la puede resolver en
 * paralelo con el resto del árbol.
 *
 * ⚠️ LA GRILLA ES DE DOS COLUMNAS Y NO DE TRES. Una tarjeta de plato tiene
 * foto, nombre, precio, píldoras, descripción y notas: a tres columnas en
 * 1168px cada una queda en 373px, y la descripción de un plato cae en seis
 * renglones. Dos columnas dan 572px, que es donde una descripción de taco entra
 * en dos. Es la misma medida que usan las cartas de pretty-hens y santa-maría.
 */
export default async function TruckMenu({
  truck,
  id = 'menu-title',
}: {
  readonly truck: string;
  readonly id?: string;
}) {
  const cartas = await getTruckMenu(truck);

  return (
    <Section tone="bone" band="lg" labelledBy={id}>
      <SectionHead
        eyebrow="The menu"
        eyebrowTone="plum"
        title={
          <>
            What {truck} <br className="hidden sm:block" />
            is cooking
          </>
        }
        id={id}
        lead={
          cartas
            ? 'Prices and dishes come from the truck. They change when the truck changes them.'
            : undefined
        }
      />

      {cartas ? (
        <div className="mt-bloque flex flex-col gap-14 lg:gap-20">
          {cartas.map((carta) => (
            <div key={carta.title}>
              {/*
                El rótulo de la categoría es nivel 3 y el plato nivel 4. La
                jerarquía tiene que cerrar: el h2 es el título de la sección,
                así que una categoría no puede ser otro h2 ni saltar a h4.
              */}
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-fog pb-4">
                <Heading level={3} className="text-d5 lg:text-d4">
                  {carta.title}
                </Heading>
                {carta.note ? (
                  <p className="m-0 max-w-[52ch] font-body text-dato font-light text-muted">
                    {carta.note}
                  </p>
                ) : null}
              </div>

              <StaggerGroup
                as="ul"
                className="mt-8 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2"
              >
                {carta.items.map((plato) => (
                  <RevealItem as="li" key={plato.name} className="h-full">
                    <DishCard dish={plato} />
                  </RevealItem>
                ))}
              </StaggerGroup>
            </div>
          ))}
        </div>
      ) : (
        /*
          ⚠️ EL TEXTO DEL HUECO DICE QUÉ HAY QUE HACER Y DÓNDE, no «falta el
          menú». Quien lo lee es Camila o el cliente, y lo que necesitan saber
          es que se carga en el dashboard y que el nombre tiene que coincidir.
          Un pendiente que no dice cómo se resuelve es una queja.
        */
        <div className="mt-bloque max-w-[68ch]">
          <PendingBlock title={`Digital menu for ${truck}`}>
            <p className="m-0">
              El truck todavía no tiene su carta cargada. Se crea en el dashboard de RestoExp como
              un menú nuevo, con el nombre del truck escrito igual que acá: <strong>{truck}</strong>.
              Adentro van las categorías y los platos, con precio, descripción, foto y las etiquetas
              que correspondan.
            </p>
            <p className="m-0 mt-3">
              Apenas exista, esta sección se llena sola. No hace falta tocar el sitio ni volver a
              publicar.
            </p>
          </PendingBlock>

          {/*
            ⚠️ LA LISTA DE LO QUE LA TARJETA SABE MOSTRAR VA ACÁ Y NO EN UN
            DOC APARTE. Es lo que el cliente tiene que saber antes de cargar,
            y puesto al lado del hueco se lee cuando importa.
          */}
          <div className="mt-8">
            <Eyebrow tone="plum">What each dish can carry</Eyebrow>
            <ul className="m-0 mt-3.5 flex list-none flex-wrap gap-2 p-0">
              {[
                'Photo',
                'Price',
                'Price range',
                'Sizes',
                'Description',
                'Vegan',
                'Vegetarian',
                'Gluten free',
                'Dairy free',
                'Nut free',
                'Halal',
                'Keto',
                'Organic',
                'Spice level',
                'Allergens',
                'Calories',
                'New',
                "Chef's pick",
              ].map((campo) => (
                <li
                  key={campo}
                  /* Letra y acolchado de `TAG`: era 13px con menos aire, o sea
                     un tamaño propio para lo mismo. Ver `lib/tag.ts`. */
                  className={`rounded-pill bg-cream ${TAG} text-deep`}
                >
                  {campo}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Section>
  );
}
