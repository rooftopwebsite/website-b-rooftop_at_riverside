import DishCard from '@/components/shared/DishCard';
import Section from '@/components/shared/Section';
import { PendingBlock } from '@/components/shared/PendingData';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
import { RevealItem, StaggerGroup } from '@/components/shared/Motion';
import { TAG } from '@/lib/tag';
import type { DishGroup } from '@/types/content';

export default function TruckMenu({
  truck,
  menus = null,
  id = 'menu-title',
}: {
  readonly truck: string;
  readonly menus?: readonly DishGroup[] | null;
  readonly id?: string;
}) {
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
          menus
            ? 'Prices and dishes come from the truck. They change when the truck changes them.'
            : undefined
        }
      />

      {menus ? (
        <div className="mt-block flex flex-col gap-14 lg:gap-20">
          {menus.map((menu) => (
            <div key={menu.title}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-fog pb-4">
                <Heading level={3} className="text-d5 lg:text-d4">
                  {menu.title}
                </Heading>
                {menu.note ? (
                  <p className="m-0 max-w-[52ch] font-body text-data font-light text-muted">
                    {menu.note}
                  </p>
                ) : null}
              </div>

              <StaggerGroup
                as="ul"
                className="mt-8 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2"
              >
                {menu.items.map((dish) => (
                  <RevealItem as="li" key={dish.name} className="h-full">
                    <DishCard dish={dish} />
                  </RevealItem>
                ))}
              </StaggerGroup>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-block max-w-[68ch]">
          <PendingBlock title={`Digital menu for ${truck}`}>
            <p className="m-0">
              This truck does not have its digital menu yet. Today the menu for <strong>{truck}</strong>{' '}
              is its PDF in <code>src/content/menus.json</code>.
            </p>
            <p className="m-0 mt-3">
              To show the dishes here, pass them through the <code>menus</code> prop, with price,
              description, photo and whatever tags apply.
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
              ].map((field) => (
                <li
                  key={field}
                  className={`rounded-pill bg-cream ${TAG} text-deep`}
                >
                  {field}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Section>
  );
}
