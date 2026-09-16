import Image from 'next/image';
import type { ReactNode } from 'react';
import { PhotoPending } from '@/components/shared/PendingData';
import { Heading } from '@/components/shared/Type';
import { Reveal } from '@/components/shared/Motion';

/**
 * La ficha técnica: foto a la izquierda, los números grandes y los datos a la
 * derecha.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ES EL BLOQUE DE FICHA TÉCNICA DE defoodtruckclub.nl, y de todo el calco
 * es el que mejor cierra con lo que tenemos.
 *
 * La referencia pone acá, por cada camión, tres o cuatro datos duros en
 * cuerpo grande —«480 pizza's per uur», «6,5 × 4 m», «1× 230v»— más las
 * certificaciones, la descripción del vehículo y una fila de fotos. Son los
 * datos que hacen falta para ALQUILAR un truck y llevarlo a un evento, que es
 * su negocio.
 *
 * Cuando esto era `TruckFacts` y describía a los food trucks del patio, esos
 * datos NO EXISTÍAN de nuestro lado: los trucks son negocios independientes
 * estacionados acá, no sabemos sus medidas, no gestionamos su corriente y sus
 * certificaciones no son nuestras. Había que reemplazarlos por cuatro datos
 * blandos y el bloque perdía la mitad de su gracia.
 *
 * Con el gaming truck el problema se da vuelta: las specs SON nuestras y están
 * publicadas por el cliente. Seis pantallas, tres consolas, más de treinta
 * juegos y un Game Coach es exactamente la clase de dato que la referencia
 * pone en este lugar y en este cuerpo.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ NO TRAE SU `<Section>`, Y ES A PROPÓSITO. La envuelve el call site. El
 * motivo es `npm run check:surfaces`: el guard lee los `tone=` de las
 * `<Section>` que encuentra escritas en la página y sólo expande componentes
 * que se usan SIN props (`<X />`). Un `<SpecSlab …>` con props sería una banda
 * oscura invisible para el guard, que es justo lo que ese archivo advierte que
 * no hay que dejar pasar: «el guard da verde por omisión, que es peor que dar
 * rojo». Con la `<Section tone="deep">` escrita en la página, la cuenta es
 * real.
 *
 * ⚠️ VA SOBRE OSCURO PORQUE LA REFERENCIA PONE ESTE BLOQUE EN OSCURO, y en la
 * página cumple además una función de ritmo: es la única banda oscura entre un
 * hero claro y seis secciones claras. Los colores de adentro dan por sentada
 * esa superficie.
 */

/** Un dato duro en cuerpo grande: el número y qué es. */
export interface SpecNumber {
  readonly value: string;
  readonly label: string;
  /** Una aclaración chica debajo, o un marcador de dato pendiente. */
  readonly note?: ReactNode;
}

export default function SpecSlab({
  title,
  id,
  photo,
  photoAlt,
  photoBrief,
  numbers,
  facts,
  children,
}: {
  readonly title: string;
  readonly id: string;
  readonly photo: string | null;
  readonly photoAlt: string | null;
  readonly photoBrief: string;
  /** Los datos duros en cuerpo grande. Tres o cuatro, como la referencia. */
  readonly numbers: readonly SpecNumber[];
  /** Los pares rótulo/dato de la ficha. */
  readonly facts: readonly (readonly [string, ReactNode])[];
  /** El párrafo de cierre y lo que vaya debajo de la ficha. */
  readonly children?: ReactNode;
}) {
  return (
    <Reveal>
      {/*
        ⚠️ `items-center` Y NO `items-start`. La columna derecha lleva los
        números, la ficha y el párrafo: es bastante más alta que una foto en
        4:3, y con la foto pegada arriba quedaban 300px de verde vacío debajo.
        Centrada, el aire se reparte y las dos columnas se leen como un par.
      */}
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
        <figure className="m-0">
          {photo ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-shell bg-deeper sombra-card">
              <Image
                src={photo}
                alt={photoAlt ?? ''}
                fill
                sizes="(min-width: 1024px) 520px, 92vw"
                className="object-cover"
              />
            </div>
          ) : (
            <PhotoPending brief={photoBrief} ratio="aspect-[4/3]" tone="dark" />
          )}
        </figure>

        <div>
          <Heading level={2} id={id} className="max-w-[18ch] text-d4 lg:text-d3">
            {title}
          </Heading>

          {/*
            LOS NÚMEROS, que es lo que la referencia pone primero y en grande.

            ⚠️ `tabular-nums` PORQUE SON CIFRAS EN COLUMNA. Sin eso el `6` y el
            `30+` se alinean por el ancho de cada glifo y la fila queda pareja
            de casualidad. Con cifras tabulares, los tres arrancan en el mismo
            punto de su celda.
          */}
          {/*
            ⚠️ EL `<dt>` VA PRIMERO EN EL DOM Y EL NÚMERO SE SUBE CON
            `flex-col-reverse`, que no es un capricho de maquetación: lo pidió
            axe. La regla `definition-list` exige que adentro de un `<dl>` cada
            grupo sea un `<dt>` seguido de su `<dd>`, y con el número arriba
            escrito primero el informe daba `serious` en las dos anchuras.

            ⚠️ Y LA NOTA VA ADENTRO DEL `<dt>`, no en un `<p>` hermano, por la
            misma regla: un `<dl>` no admite párrafos sueltos entre sus grupos.
            Es además donde corresponde, porque la nota aclara el rótulo.
          */}
          <dl className="mt-9 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-paper/20 pt-9 sm:grid-cols-3">
            {numbers.map((n) => (
              <div key={n.label} className="flex flex-col-reverse">
                <dt className="mt-2.5 font-body text-base leading-[1.4] text-paper/90">
                  {n.label}
                  {n.note ? (
                    <span className="mt-2 block font-body text-dato leading-[1.5] text-muted-dark">
                      {n.note}
                    </span>
                  ) : null}
                </dt>
                <dd className="m-0 font-display text-d3 font-semibold uppercase leading-none tabular-nums text-cream lg:text-d2">
                  {n.value}
                </dd>
              </div>
            ))}
          </dl>

          {/*
            ⚠️ ES UN `<dl>` Y NO UNA GRILLA DE `<div>`. Son pares de rótulo y
            dato, que es exactamente para lo que existe la lista de
            definiciones: un lector de pantalla anuncia «Consoles, Xbox Series
            X» como un par y no como dos textos sueltos seguidos.
          */}
          <dl className="mt-9 grid grid-cols-1 gap-x-10 gap-y-7 border-t border-paper/20 pt-9 sm:grid-cols-2">
            {facts.map(([rotulo, valor]) => (
              <div key={rotulo}>
                <dt className="font-body text-micro font-bold uppercase tracking-cta text-muted-dark">
                  {rotulo}
                </dt>
                <dd className="m-0 mt-2 font-body text-lead font-light leading-[1.4] text-paper">
                  {valor}
                </dd>
              </div>
            ))}
          </dl>

          {children ? <div className="mt-9 border-t border-paper/20 pt-9">{children}</div> : null}
        </div>
      </div>
    </Reveal>
  );
}
