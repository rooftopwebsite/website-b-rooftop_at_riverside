import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ButtonLink } from '@/components/shared/Button';
import CompareSlab, { PADDING_CRUCE } from '@/components/shared/CompareSlab';
import TruckCards from '@/components/sections/TruckCards';
import PageHeroWave from '@/components/shared/PageHeroWave';
import Section from '@/components/shared/Section';
import { Heading, SectionHead } from '@/components/shared/Type';
import { activeTrucks } from '@/content/trucks';
import { BRAND } from '@/lib/brand';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  route: "/food-trucks",
});

/**
 * /food-trucks
 *
 * ⚠️ La grilla lleva los trucks MÁS UNA QUINTA TARJETA que es el Sunset Bar, al
 * mismo nivel visual. Eso comunica el modelo de negocio sin explicarlo: acá hay
 * cinco lugares donde gastar plata y sólo uno es del venue.
 *
 * ⚠️ Sin precios de los trucks. Los precios son del vendor, no del venue.
 *
 * ⚠️ La rotación NO se muestra acá. Qué truck está hoy vive en el home y en
 * /whats-on.
 */
export default function FoodTrucksPage() {
  const trucks = activeTrucks();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(breadcrumbJsonLd([{ name: 'Food Trucks', path: '/food-trucks' }])),
        }}
      />

      <PageHeroWave
        eyebrow="The yard"
        accent="Four kitchens."
        title="One yard."
        lead="The trucks rotate. Each one is independently owned, sets its own menu and takes its own payment. We just give them the yard and the crowd."
        from="paper"
        to="mint"
      />

      {/*
        ⚠️ ACÁ HABÍA UNA MARQUESINA CON LOS CUATRO NOMBRES y se fue el
        2026-09-16, tachada por Camila en la captura junto con las migas.

        Tenía sentido cuando la página abría con un hero de foto y las tarjetas
        estaban más abajo: la tira era lo primero que nombraba el roster. Con el
        encabezado centrado que termina en onda, lo que sigue a la portada son
        las tarjetas, y ahí los cuatro nombres están en 40px con su foto al
        lado. La tira los decía otra vez cuatro renglones antes.
      */}

      {/*
        ⚠️ LA BANDA DE LAS TARJETAS ES MENTA Y ERA `bone`. Camila, 2026-09-21,
        rodeando el fondo a la derecha de la fila: «el C4F2EC lo quiero detrás de
        las cards». Es el mismo color de la muestra del toldo, así que la fila
        entera —toldo rojo y morado sobre menta— es la muestra puesta en página.

        ⚠️ Y ARRASTRA DOS OLAS. La del hero pinta el color de ABAJO, así que pasa
        a `to="mint"`; la del comparativo pinta el de ARRIBA, así que recibe
        `from="mint"`. Si esta banda cambia de color otra vez, son tres líneas y
        no una.
      */}
      <TruckCards tone="mint" head={false} />

      {/*
        ══════════════════════════════════════════════════════════════════
        BLOQUE E: la losa oscura, y acá es la pieza más importante de la
        página.

        ⚠️ ES *LA* CONFUSIÓN DEL NEGOCIO. La gente llega creyendo que esto es
        un restaurante con varias cocinas, y entonces espera una cuenta, un
        mozo y un menú. Nada de eso existe. Ponerlo en una comparación lado a
        lado es la forma más rápida de que se entienda, y por eso se gana la
        única superficie oscura de la página.

        ⚠️ LA COLUMNA DE LA DERECHA NO DICE QUE UN RESTAURANTE SEA PEOR. Dice
        en qué se diferencia. El argumento se sostiene solo.
        ══════════════════════════════════════════════════════════════════
      */}
      <CompareSlab
        /* La ola de entrada se dibuja del color de la sección de ARRIBA, que
           desde el 2026-09-21 es la banda menta de las tarjetas. */
        from="mint"
        id="how-pay"
        eyebrow="How this works"
        accent="One yard,"
        title="five registers"
        lead="It reads like a restaurant with several kitchens. It is not, and the difference shows up when you go to pay."
        ours={{
          label: 'Here',
          rows: [
            /* ⚠️ ERAN DOS RENGLONES Y AHORA SON UNO. Camila: «unifiquemos los dos
               primeros puntos, que dicen más o menos lo mismo». Decían la misma
               idea en dos tiempos —dónde pedís y a quién le pagás— y separados
               hacían que la columna arrancara con una repetición. */
            'You order at whichever window you want, and you pay that truck: its own register, its own receipt',
            'Four parties at one table can each eat something different',
            'Drinks come from the Sunset Bar upstairs, and that tab is ours',
            'No waiting for a table: find a seat and go up to the window',
          ],
        }}
        theirs={{
          label: 'A restaurant',
          rows: [
            /* ⚠️ ACÁ TAMBIÉN SE UNIERON DOS, y es lo que hace que las dos columnas
               queden con la misma cantidad. El pedido decía «así tenemos misma
               cantidad de ítem de cada lado», pero los dos lados tenían CINCO:
               unir sólo los nuestros dejaba 4 contra 5. «One kitchen, one menu,
               one check» y «Everyone eats from the same list» son la misma idea
               —una sola carta para todos— así que van juntos y quedan 4 y 4. */
            'One kitchen and one menu: everyone eats from the same list, on one check',
            'A server takes the order and brings it over',
            'Food and drinks land on the same bill',
            'A host seats you when a table opens',
          ],
        }}
      />

      {/*
        ══════════════════════════════════════════════════════════════════
        EL BANNER DE LA ROTACIÓN.

        ⚠️ ACÁ HABÍA UNA SECCIÓN DE DOS COLUMNAS Y SE FUE EL 2026-09-16.
        Llevaba un titular de display, «Who is in tonight» y «Where are the
        menus», con un párrafo cada uno y dos links. Camila: «saquemos esta
        parte, reemplacémosla por una sección más chica y simple que sólo diga
        que los camiones rotan».

        Tenía razón por dónde caía: era el CIERRE de la página, después de las
        tarjetas y de la comparación, y repetía dos cosas que ya estaban
        dichas. «Dónde están los menús» dejó de tener sentido en cuanto cada
        tarjeta pasó a tener su propio botón de carta, y «quién está de guardia»
        ya lo dice la bajada del hero: «the trucks rotate».

        Lo único que no estaba dicho en ningún otro lado es lo que la rotación
        SIGNIFICA para quien viene, y eso es todo lo que dice el banner.

        ⚠️ EL COPY NO AFIRMA UNA FRECUENCIA. No sabemos cada cuánto rota el
        roster, así que el banner habla de que cambia y no de cada cuánto. El
        dato concreto —quién está esta noche— sigue viviendo en el calendario.

        ══════════════════════════════════════════════════════════════════
        ⚠️ LA FORMA SALE DE LA TARJETA DE MENÚ DE defoodtruckclub.nl, que
        Camila pasó con «como esta parte puede ser el banner». Son tres cosas y
        las tres están acá:

          · un panel de color con esquinas muy redondeadas;
          · un FILETE PUNTEADO POR DENTRO, separado del borde, que es lo que
            hace que el panel se lea como una etiqueta troquelada y no como una
            caja;
          · y el SELLO DE LA MARCA montado sobre el borde de abajo, pisando el
            filo.

        El recurso ya existe en este repo: el filete punteado interior es el
        mismo de los huecos de foto de `WhatsOn`, y el sello con su sombra es
        el emblema que remata la ola de `PhotoDivider`, con la clase `.sticker`
        que comparte con el logo del header.

        ⚠️ EL PANEL VA EN `cream` Y NO EN `deep`. La página ya cierra con la
        losa oscura de la comparación justo arriba: dos oscuras seguidas dejan
        el pie de la página en un solo bloque negro. Crema sobre el `paper` de
        la sección da el corte sin sumar otra banda, y es el fondo con el que
        el emblema naranja fue dibujado.
        ══════════════════════════════════════════════════════════════════
      */}
      <Section band="md" bandTop="none" labelledBy="rota-title" innerClassName={PADDING_CRUCE}>
        {/*
          ⚠️ EL COSTADO DE LA LOSA BAJÓ DE 28px A 20px EN CELULAR. A 360px
          —la pantalla Android más común— entre el margen de 16px de la página
          y los 28px de la losa quedaban 272px de hueco para un CTA que mide
          278: se pasaba por 6px. Con 20px el hueco es de 288 y el botón entra
          con aire. De `sm` en adelante no cambia nada.
        */}
        <div className="relative rounded-frame bg-cream grano px-5 pt-14 pb-20 text-center sm:px-16 sm:pt-16 sm:pb-16 lg:px-24">
          {/* El filete punteado, separado del borde. `inset-3.5` son los 14px
              que lo despegan, igual que en los huecos de foto de `WhatsOn`. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-3.5 rounded-shell border border-dashed border-deep/35"
          />

          {/*
            ⚠️ ACÁ HABÍA UN EMBLEMA DE PALMERA Y SE FUE. Camila, 2026-09-16:
            «sin el sticker de la palmera, sólo las ondas». Queda el isotipo del
            camión en la esquina de abajo, que es el que dice de qué habla la
            página; el emblema sólo ocupaba lugar.
          */}
          <Image
            src="/brand/isotype-truck.svg"
            alt=""
            aria-hidden="true"
            width={552}
            height={390}
            className="pointer-events-none absolute right-6 bottom-6 hidden w-24 opacity-30 sm:block lg:right-9 lg:bottom-8 lg:w-32"
          />

          <div className="relative">
            <Heading level={2} id="rota-title" className="mx-auto max-w-[18ch] text-d4 lg:text-d3">
              You never eat the same week twice
            </Heading>
            {/*
              ⚠️ EL COPY MANDA A INSTAGRAM Y NO AL CALENDARIO, y antes hacía lo
              contrario. Camila, 2026-09-16: «en la web no mostraremos cuándo
              cambian y qué va a haber, así que la idea sería decir que van
              rotando y para enterarse de las nuevas propuestas y desde cuándo
              están, que nos sigan en las redes».

              O sea que el calendario NO tiene el dato: publica los eventos, no
              las altas y bajas de trucks. Mandar ahí a alguien que quiere saber
              qué camión nuevo hay era mandarlo a una página que no lo dice.
            */}
            <p className="mx-auto mt-5 max-w-[52ch] font-body text-lead font-light leading-[1.5] text-ink">
              The lineup changes. We announce which kitchens are coming, and from when, on
              Instagram.
            </p>
            {/*
              ⚠️ EL CTA DECÍA «Follow for the new trucks» Y SE ACORTÓ. Camila,
              2026-09-21: «cuidado con los CTA largos, nunca deben quedar CTA
              con texto en dos líneas». Eran 25 caracteres más el ícono de
              enlace externo, y en celular no entraban en una línea.

              La frase de arriba ya dice QUÉ se anuncia —los camiones nuevos y
              desde cuándo—, así que el botón sólo tiene que decir dónde. Ver
              el presupuesto de caracteres en `BASE`, en `shared/Button.tsx`.
            */}
            <div className="mt-8 flex justify-center">
              <ButtonLink href={BRAND.social.instagram} variant="dark" external>
                Follow on Instagram
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
