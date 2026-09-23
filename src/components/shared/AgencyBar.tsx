import Image from 'next/image';
import { AGENCY } from '@/lib/brand';
import { GUTTER } from './Section';

/**
 * La barra «powered by Resto Experience», compartida entre todos los sitios de
 * la casa. Portada de the-orient, que a su vez la comparte con santa-maria y
 * rreal tacos; lo único que cambia por proyecto es la fuente auxiliar.
 *
 * ⚠️ FALTABA. Camila: «falta el footer de la agencia». El sitio tenía sólo una
 * línea de texto «Content, marketing & web design by Resto Experience» perdida
 * en la franja del copyright, sin el logo y sin el formato de la casa.
 *
 * ⚠️ El gutter va en el ENVOLTORIO y la `caja` adentro sin padding propio. Es
 * la composición del resto del sitio, y es lo que hace que esta fila alinee por
 * los extremos con el footer de arriba. Puesto adentro de la caja, el contenido
 * arrancaría 32px más adentro que el del footer.
 *
 * Contrastes verificados en the-orient, y valen igual acá porque la barra trae
 * su propio fondo claro: `#5c5c5c` sobre `#f5f5f5` da 6.13:1, y sobre el blanco
 * de la fila 6.69:1.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ESTE COMPONENTE NO SE AJUSTA AL SITIO. Camila: «el footer de la agencia
 * debe quedar tal cual a los otros proyectos de la agencia».
 *
 * Es la firma de la casa y tiene que verse IGUAL en todos los sitios, así que
 * sus medidas están copiadas de the-orient y NO siguen los tokens de Rooftop:
 *
 *   powered by      16px   (text-base)      logo         24px  (h-6)
 *   tagline desktop 14px   (text-sm)        pastilla     px-16 py-6
 *   año desktop     14px   (text-sm)        fila desktop 72px de alto
 *   tagline mobile  12px   (text-xs)        separador    40px (h-10)
 *   año mobile      14px   (text-sm)        filete móvil 283px
 *
 * Lo ÚNICO que cambia por proyecto es la fuente auxiliar: acá `font-body`
 * (Jost), en the-orient DM Sans.
 *
 * ⚠️ Ya se rompió una vez: un reemplazo masivo que subió el piso de texto del
 * sitio (15px → 16, 14px → 15) se llevó puesto este archivo y dejó el tagline
 * y el año en 15px. Si volvés a hacer un cambio global de tamaños, EXCLUÍ este
 * archivo.
 * ══════════════════════════════════════════════════════════════════════════
 */
export default function AgencyBar() {
  const poweredBy = (
    <a
      href={AGENCY.url}
      target="_blank"
      rel="noopener noreferrer"
      /*
        ⚠️ El aviso de pestaña nueva va en el `aria-label` y NO en un `<span>`
        con `sr-only`: algunos checkers no leen texto oculto con `clip`. Y el
        label CONTIENE el texto visible, que es lo que exige WCAG 2.5.3 (Label
        in Name) — si no, un usuario de comandos de voz que dice «powered by» no
        activa nada.
      */
      aria-label={`Powered by ${AGENCY.label}, visit restoexp.com (opens in a new tab)`}
      className="flex max-w-full flex-wrap items-center justify-center gap-x-[12px] gap-y-[4px] rounded-pill bg-[#f5f5f5] px-[16px] py-[6px] transition-opacity duration-200 hover:opacity-80"
    >
      <span className="font-body text-[16px] leading-none whitespace-nowrap text-[#5c5c5c]">
        powered by
      </span>
      {/* `unoptimized`: es un SVG y el optimizador no tiene nada que hacerle.
          Next lo sirve tal cual, sin pasar por `/_next/image`. */}
      <Image
        unoptimized
        src="/images/agency/resto-experience.svg"
        alt={AGENCY.label}
        width={523}
        height={74}
        className="h-[24px] w-auto shrink-0"
      />
    </a>
  );

  const año = new Date().getFullYear();

  return (
    <div
      /*
        ⚠️ EL `relative z-[1]` ES LO QUE LA MANTIENE BLANCA, y sin eso el
        `bg-chalk` no alcanzaba. Pedido de Camila: «el footer de la agencia
        debe ser completamente blanco».

        La barra vive DENTRO del `<footer>`, y el footer tiene dos capas
        decorativa en `absolute inset-0`: el fondo de nubes con la
        palmera. Llegaba hasta acá abajo —el tronco de la palmera se
        veía cruzando la franja— y sobre blanco puro esa textura al 22 % daba
        exactamente lo que se veía: un blanco sucio.

        Con contexto propio por encima del `z-0` de esa capa, la franja
        queda fuera de su alcance. El color no cambió: `chalk` ya
        resuelve a `paper`, que es #FFFFFF.
      */
      className="relative z-[1] bg-chalk grano"
    >
      {/* Desktop: la pastilla a la izquierda, el crédito a la derecha. */}
      {/*
        ⚠️ `caja-ancha` Y NO EL PAR `GUTTER` + `caja`. Pedido de Camila: «el
        footer de la agencia también debe adaptarse al ancho máximo de
        sección».

        Es el mismo arreglo que acaba de hacerse en el `<footer>` que la
        contiene, y por el mismo motivo: `caja` lleva el gutter POR FUERA y
        `caja-ancha` lo lleva adentro. Con el par viejo el contenido arrancaba
        56px antes que el del resto del sitio, así que el «powered by» y el año
        quedaban desalineados con las columnas de arriba.

        ⚠️ SON DOS FILAS Y LAS DOS TIENEN QUE CAMBIAR: la de desktop y la de
        mobile. Si una se queda con `caja`, el desfasaje aparece sólo en una
        medida y es de los que no se ven hasta que alguien pone una regla.
      */}
      <div className="caja-ancha hidden h-[72px] items-center justify-between desk:flex">
        {poweredBy}
        <div className="flex items-center gap-[24px]">
          <span className="font-body text-[14px] text-[#5c5c5c]">{AGENCY.tagline}</span>
          <span
            aria-hidden="true"
            className="h-[40px] w-px bg-gradient-to-b from-transparent via-[#7c7c7c]/50 to-transparent"
          />
          <span className="font-body text-[14px] text-[#5c5c5c]">{año}</span>
        </div>
      </div>

      {/* Mobile y tablet: apilado y centrado, con el filete como separador. */}
      <div className="caja-ancha flex flex-col items-center gap-[10px] py-[16px] desk:hidden">
        {poweredBy}
        <span
          aria-hidden="true"
          className="h-px w-[283px] max-w-full bg-gradient-to-r from-transparent via-[#7c7c7c]/50 to-transparent opacity-70"
        />
        <div className="flex flex-wrap items-center justify-center gap-x-[12px] gap-y-[4px] text-center">
          <p className="font-body text-[12px] leading-[1.3] text-[#5c5c5c]">{AGENCY.tagline}</p>
          <p className="font-body text-[14px] leading-[1.3] text-[#5c5c5c]">{año}</p>
        </div>
      </div>
    </div>
  );
}
