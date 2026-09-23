import DishCard from '@/components/shared/DishCard';
import Section from '@/components/shared/Section';
import { PendingBlock } from '@/components/shared/PendingData';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
import { RevealItem, StaggerGroup } from '@/components/shared/Motion';
import { getTruckMenu } from '@/lib/restoexp';
import { TAG } from '@/lib/tag';

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
