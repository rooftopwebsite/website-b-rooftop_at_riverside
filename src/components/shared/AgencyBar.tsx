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
      <span className="font-body text-[15px] leading-none whitespace-nowrap text-[#5c5c5c]">
        powered by
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element -- SVG estático de
          tamaño fijo: `next/image` no aporta nada acá y agrega un envoltorio. */}
      <img
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
    <div className={`bg-chalk ${GUTTER}`}>
      {/* Desktop: la pastilla a la izquierda, el crédito a la derecha. */}
      <div className="caja hidden h-[72px] items-center justify-between desk:flex">
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
      <div className="caja flex flex-col items-center gap-[10px] py-[16px] desk:hidden">
        {poweredBy}
        <span
          aria-hidden="true"
          className="h-px w-[283px] max-w-full bg-gradient-to-r from-transparent via-[#7c7c7c]/50 to-transparent opacity-70"
        />
        <div className="flex flex-wrap items-center justify-center gap-x-[12px] gap-y-[2px] text-center">
          <p className="font-body text-[12px] leading-[1.3] text-[#5c5c5c]">{AGENCY.tagline}</p>
          <p className="font-body text-[14px] leading-[1.3] text-[#5c5c5c]">{año}</p>
        </div>
      </div>
    </div>
  );
}
