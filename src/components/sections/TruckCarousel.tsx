'use client';

import Card from '@/components/shared/Card';
import { DragCarousel } from '@/components/shared/Motion';
import type { Truck } from '@/content/trucks';

/**
 * El roster de trucks como carrusel arrastrable con snap, más la quinta tarjeta
 * que es el Sunset Bar.
 *
 * ⚠️ Es carrusel y no grilla a propósito: cinco tarjetas en fila comunican
 * «esto es un roster que rota» mejor que una grilla, que se lee como un
 * catálogo cerrado. Y el arrastre le da la textura física que el brief pide
 * («que no se sienta estéril») sin recurrir a decoración.
 *
 * ⚠️ Scroll nativo con `scroll-snap` debajo: teclado, rueda y dedo salen
 * gratis, y el contenido está entero en el HTML servido. Un carrusel de JS
 * escondería cuatro de las cinco tarjetas del crawler.
 */
export default function TruckCarousel({ trucks }: { readonly trucks: readonly Truck[] }) {
  return (
    <>
      <DragCarousel label="Food trucks in the yard" className="mt-[40px]">
        {trucks.map((t) => (
          <div
            key={t.slug}
            className="w-[268px] shrink-0 snap-start sm:w-[300px] lg:w-[330px]"
          >
            <Card
              href={`/food-trucks/${t.slug}`}
              eyebrow={t.cuisine}
              title={t.name}
              body={t.specialty}
              cta="Meet the truck"
              photo={t.photo}
              photoAlt={t.photoAlt}
              photoBrief={t.photoBrief}
              sizes="330px"
            />
          </div>
        ))}

        {/* La quinta tarjeta: el Sunset Bar, al mismo nivel visual que los
            trucks. Comunica el modelo sin explicarlo — acá hay cinco negocios
            y sólo uno es del venue. */}
        <div className="w-[268px] shrink-0 snap-start sm:w-[300px] lg:w-[330px]">
          <Card
            href="/sunset-bar"
            eyebrow="Drinks"
            title="Sunset Bar"
            body="Cocktails, local drafts and wine — the one tab that’s ours, upstairs on the roof."
            cta="See the menu"
            photo="/images/venue-rooftop.jpg"
            photoAlt="The Sunset Bar rooftop at Rooftop at Riverside"
            badge="Ours"
            sizes="330px"
          />
        </div>
      </DragCarousel>

      <p className="mt-[16px] text-[13px] text-body/75">
        <span aria-hidden="true">← </span>
        Drag or scroll to see the rest
      </p>
    </>
  );
}
