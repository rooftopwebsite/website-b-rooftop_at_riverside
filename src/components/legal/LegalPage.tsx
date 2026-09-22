import Link from 'next/link';
import type { ReactNode } from 'react';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading } from '@/components/shared/Type';
import { LEGAL_DOCS, type LegalBlock } from '@/content/legal-docs';

/**
 * El cuerpo del documento: los bloques de `content/legal/` pasados a HTML.
 *
 * ⚠️ NO HAY NINGÚN `className` POR BLOQUE. Todo lo visual sale de `.prose-legal`
 * en `globals.css`, que estiliza por etiqueta. Es lo que permite que un
 * documento de veintidós mil caracteres no tenga una sola decisión de diseño
 * escrita entre el texto legal.
 */
function Cuerpo({ blocks }: { readonly blocks: readonly LegalBlock[] }) {
  return (
    <div className="prose-legal">
      {blocks.map((b, i) => {
        switch (b.kind) {
          case 'titulo':
            return <h2 key={i}>{b.text}</h2>;

          case 'aviso':
            /*
             * ⚠️ ES UN `<p>` Y NO UN `<aside>` NI UN `role="note"`. El aviso en
             * caja alta es parte del texto que se firma, no un comentario al
             * margen: sacarlo del hilo del documento lo haría opcional para un
             * lector de pantalla, que es exactamente al revés de lo que el
             * documento quiere.
             */
            return (
              <p key={i} className="aviso">
                {b.text}
              </p>
            );

          case 'parrafo':
            return <p key={i}>{b.text}</p>;

          case 'clausula':
            return (
              <div key={i}>
                <h3>{b.rotulo}</h3>
                {b.cuerpo.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            );

          case 'lista':
            /*
             * Con rótulo va en `<ul>`: el rótulo ya identifica al ítem y un
             * número al lado sería una segunda numeración compitiendo con la de
             * las secciones. Sin rótulo va en `<ol>`, porque ahí el orden ES el
             * identificador: el documento se refiere a «el punto d».
             */
            return b.orden === 'letras' ? (
              <ol key={i} className="letras">
                {b.items.map((it, j) => (
                  <li key={j}>{it.texto}</li>
                ))}
              </ol>
            ) : (
              <ul key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>
                    {it.rotulo ? <strong>{it.rotulo}:</strong> : null} {it.texto}
                  </li>
                ))}
              </ul>
            );
        }
      })}
    </div>
  );
}

/**
 * LA LOSA DE DOCUMENTO LEGAL: la carcasa que comparten los tres documentos del
 * gaming truck.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LAS TRES PÁGINAS EXISTEN PORQUE CAMILA LAS PIDIÓ EL 2026-09-22: «creá las
 * páginas de políticas con los textos originales; no deben redirigir a la
 * página original, debemos crear la copia de cada una en la web nueva».
 *
 * Hasta hoy `/game-zone-waiver` y `/bar-games-waiver` eran dos 301 a
 * `/game-truck#policies`, y el documento de políticas no era alcanzable: vivía
 * en un PDF colgado del sitio viejo. O sea que los tres documentos legales del
 * negocio seguían publicados en el dominio que estamos reemplazando.
 *
 * ⚠️ EL TEXTO ES VERBATIM Y NO SE EDITA. Son documentos legales del cliente:
 * lo que se publica es la transcripción, con su numeración, sus mayúsculas y
 * sus erratas. Lo único que se agrega es la estructura HTML —encabezados,
 * listas, párrafos— para que se pueda leer y navegar.
 *
 * ⚠️ Y POR ESO ESTAS TRES SON LAS ÚNICAS PÁGINAS DEL SITIO CON EM DASHES
 * PERMITIDOS si el original los trae. La regla de «ni un guión medio en el
 * copy» es sobre el copy que escribimos nosotros; acá no escribimos nada.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LA FORMA SALE DE `website-b-santa-maria`, que es la implementación de
 * referencia de la casa para páginas legales: encabezado de página, tarjeta de
 * ancho de lectura acotado y centrada, renglón de «última actualización» con
 * `<time>`, el cuerpo en una sola clase `.prose-legal`, y al pie la navegación
 * a los otros documentos excluyendo el actual.
 *
 * Lo que cambia respecto de aquella es la piel, que es la de este proyecto: la
 * tarjeta es `bone` con grano sobre una sección `paper`, el radio es
 * `rounded-frame` y los tipos son los del tema. Ni un color nuevo.
 *
 * ⚠️ EL CUERPO VA EN UNA SOLA CLASE Y NO EN UTILIDADES POR ETIQUETA. Son
 * 22.000 y 11.000 caracteres de texto legal: escribir las clases en cada `<p>`
 * sería imposible de mantener y, peor, invitaría a tocar el texto mientras se
 * maqueta. La clase vive en `globals.css`.
 *
 * ⚠️ NO HAY BANNER DE COOKIES NI LINKS LEGALES EN EL FOOTER. La guía de la
 * casa los trae en el mismo paquete, pero estos tres documentos no son
 * privacidad, términos ni cookies: son los papeles que se firman para usar el
 * camión. El footer del sitio no los lista y no debería: se llega desde
 * `/game-truck`, que es donde importan.
 */
export default function LegalPage({
  title,
  /** El acento del titular. Ver la nota de abajo: ningún hero va monocromo. */
  accent,
  eyebrow,
  lastUpdated,
  currentHref,
  intro,
  blocks,
}: {
  readonly title: string;
  readonly accent: string;
  readonly eyebrow: string;
  /** Fecha ISO, por ejemplo `2026-09-15`. */
  readonly lastUpdated: string;
  /** La ruta actual, para excluirla de la navegación del pie. */
  readonly currentHref: string;
  /** Una línea nuestra que dice qué es el documento. No es parte del texto legal. */
  readonly intro?: ReactNode;
  /** El documento, de `content/legal/`. */
  readonly blocks: readonly LegalBlock[];
}) {
  const fecha = new Date(`${lastUpdated}T00:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const otros = LEGAL_DOCS.filter((d) => d.href !== currentHref);

  return (
    <>
      {/*
        EL ENCABEZADO. No es `PlateHero`: no hay foto que poner y un documento
        legal no la necesita. Es el par rótulo + titular que el sitio usa en
        todas sus secciones, a tamaño de h1.

        ⚠️ EL TITULAR LLEVA UNA PALABRA EN COLOR, como todos los del sitio. Es
        la regla fija del repo —ningún titular de portada va monocromo— y acá
        vale igual: sobre claro el acento es `sunset-deep`, que es el único
        naranja que pasa contraste como tinta.
      */}
      <Section tone="bone" band="md" labelledBy="page-title">
        <Eyebrow tone="deep">{eyebrow}</Eyebrow>
        <Heading level={1} id="page-title" className="mt-gap-kicker max-w-[20ch]">
          {title} <span className="text-sunset-deep">{accent}</span>
        </Heading>
        {intro ? (
          <p className="mt-gap-bajada max-w-[62ch] text-lead bajada">{intro}</p>
        ) : null}
      </Section>

      <Section band="lg">
        {/*
          ⚠️ LA TARJETA SE TOPA EN 900px Y NO EN EL CONTENEDOR. Es la medida de
          la implementación de referencia y es la que hace que un documento de
          veinte mil caracteres se pueda leer: a 1280 el renglón pasa de 140
          caracteres y el ojo pierde el salto de línea.

          ⚠️ ES `bone` SOBRE `paper`, o sea el panel es el tono de más arriba.
          Misma regla que `FormSlab`: el panel nunca es del color de su sección.
        */}
        <article className="mx-auto max-w-[900px] rounded-frame bg-bone grano px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <p className="eyebrow text-muted">
            Last updated &middot; <time dateTime={lastUpdated}>{fecha}</time>
          </p>

          <hr className="mt-6 mb-9 h-px w-full border-0 bg-ink/15" />

          <Cuerpo blocks={blocks} />

          {/*
            ⚠️ LA NAVEGACIÓN DEL PIE EXCLUYE EL DOCUMENTO ACTUAL. Un link a la
            página en la que ya estás no es navegación, es ruido, y además
            rompe la expectativa de que los tres links llevan a algún lado.
          */}
          <nav
            aria-label="The other documents"
            className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-ink/15 pt-7"
          >
            <span className="eyebrow text-muted">Also read</span>
            {otros.map((d, i) => (
              <span key={d.href} className="flex items-center gap-3">
                {i > 0 ? <span aria-hidden="true" className="h-3 w-px bg-ink/20" /> : null}
                <Link href={d.href} className="link-texto font-body text-base font-semibold">
                  {d.label}
                </Link>
              </span>
            ))}
          </nav>
        </article>
      </Section>
    </>
  );
}
