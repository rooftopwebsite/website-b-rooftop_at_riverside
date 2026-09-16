import Image from 'next/image';
import { ArrowLink, ExternalIcon } from '@/components/shared/Button';
import { PendingBlock, PhotoPending } from '@/components/shared/PendingData';
import Section from '@/components/shared/Section';
import { Heading } from '@/components/shared/Type';
import { Reveal } from '@/components/shared/Motion';
import type { Truck } from '@/content/trucks';

/**
 * La banda oscura con la ficha del truck: foto a la izquierda, datos a la derecha.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ES EL BLOQUE DE FICHA TÉCNICA DE LA REFERENCIA, CON OTRO CONTENIDO, y la
 * diferencia importa porque el original dice cosas que de nuestros trucks no
 * podemos decir.
 *
 * defoodtruckclub.nl pone acá cuatro datos: velocidad de despacho («450
 * platos por hora»), medidas («6,5 × 2,5 m»), corriente («1× 230v») y
 * certificaciones («cumple con bomberos y HACCP»). Son los datos que hacen
 * falta para ALQUILAR un truck y llevarlo a un evento, que es su negocio.
 *
 * Nuestros trucks no se alquilan: son negocios independientes estacionados en
 * el yard. No sabemos sus medidas, no gestionamos su corriente y sus
 * certificaciones no son nuestras. Inventarlas habría sido publicar datos
 * falsos sobre el negocio de un tercero.
 *
 * Lo que va en su lugar son los cuatro datos que SÍ tenemos verificados y que
 * son los que un visitante de este sitio necesita: qué cocinan, por qué se los
 * conoce, dónde están y cuándo. La forma es la misma —rótulo chico arriba, dato
 * grande abajo, cuatro en grilla— y es la que hace que se lea como una ficha.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ «WHERE» ES UN DATO FIJO Y NO UN CAMPO. Los cuatro trucks están en el
 * mismo patio de la misma dirección, así que no hay nada que guardar por truck:
 * si algún día uno para en otro lado, ahí se agrega el campo.
 *
 * ⚠️ VA EN `deep` PORQUE LA REFERENCIA PONE ESTE BLOQUE EN OSCURO, y en esta
 * página cumple además una función de ritmo: es la única banda oscura entre el
 * hero claro y la carta, que también es clara.
 */
export default function TruckFacts({
  truck,
  id = 'facts-title',
}: {
  readonly truck: Truck;
  readonly id?: string;
}) {
  /* La galería si existe, y si no la foto principal. Ver la nota del `<figure>`. */
  const secundaria = truck.gallery[0] ?? null;

  const datos: readonly (readonly [string, React.ReactNode])[] = [
    ['Cuisine', truck.cuisine],
    ['Known for', truck.specialty],
    ['Where', 'The yard, under the rooftop'],
    [
      'When',
      truck.schedule ?? (
        <>
          The roster rotates.{' '}
          <ArrowLink href="/whats-on" className="text-dato">
            Check the calendar
          </ArrowLink>
        </>
      ),
    ],
  ];

  return (
    <Section tone="deep" band="lg" labelledBy={id}>
      <Reveal>
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
          {/*
            ⚠️ LA FOTO DE ACÁ NO ES LA DEL HERO cuando hay galería, y es a
            propósito: la referencia muestra el truck desde otro ángulo en este
            bloque. Con galería cargada se usa la primera de la galería; sin
            galería se repite la principal, que sigue siendo mejor que un hueco.
          */}
          <figure className="m-0">
            {secundaria ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-shell bg-deeper sombra-card">
                <Image
                  src={secundaria.src}
                  alt={secundaria.alt}
                  fill
                  sizes="(min-width: 1024px) 520px, 92vw"
                  className="object-cover"
                />
              </div>
            ) : truck.photo ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-shell bg-deeper sombra-card">
                <Image
                  src={truck.photo}
                  alt={truck.photoAlt ?? `${truck.name} in the yard`}
                  fill
                  sizes="(min-width: 1024px) 520px, 92vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <PhotoPending brief={truck.photoBrief} ratio="aspect-[4/3]" tone="dark" />
            )}
          </figure>

          <div>
            <Heading level={2} id={id} className="max-w-[18ch] text-d4 lg:text-d3">
              {truck.name}
            </Heading>

            {/*
              ⚠️ ES UN `<dl>` Y NO UNA GRILLA DE `<div>`. Son pares de
              rótulo y dato, que es exactamente para lo que existe la lista de
              definiciones: un lector de pantalla anuncia «Cuisine, Mexican»
              como un par y no como dos textos sueltos seguidos.
            */}
            <dl className="mt-9 grid grid-cols-1 gap-x-10 gap-y-7 border-t border-paper/20 pt-9 sm:grid-cols-2">
              {datos.map(([rotulo, valor]) => (
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

            {/*
              LA HISTORIA DEL TRUCK. En la referencia este bloque cierra con un
              párrafo describiendo el vehículo; acá cierra con quiénes son, que
              es el dato equivalente y el que el cliente nos puede dar.

              ⚠️ TRES DE SIETE LA TIENEN. Los otros cuatro muestran el
              pendiente, y el texto del pendiente dice que tiene que venir del
              dueño del truck: es de las pocas cosas del sitio que no podemos
              escribir nosotros ni aproximar.
            */}
            <div className="mt-9 border-t border-paper/20 pt-9">
              {truck.story ? (
                <p className="m-0 max-w-[62ch] font-body text-lead font-light leading-[1.65] text-paper/92">
                  {truck.story}
                </p>
              ) : (
                <PendingBlock tone="dark" title={`Who ${truck.name} are`}>
                  <p className="m-0">
                    Faltan dos o tres frases del dueño del truck: quiénes son, de dónde vienen y por
                    qué se los conoce. Tiene que venir de ellos. Nada de este sitio lo escribe una
                    máquina.
                  </p>
                </PendingBlock>
              )}

              {truck.instagram ? (
                <p className="m-0 mt-6">
                  <a
                    href={truck.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-texto inline-flex items-center gap-1.5 font-body text-base font-semibold text-cream"
                  >
                    {truck.name} on Instagram
                    <ExternalIcon />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
