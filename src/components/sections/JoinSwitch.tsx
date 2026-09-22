import Link from 'next/link';
import { GUTTER } from '@/components/shared/Section';

/**
 * EL SELECTOR DE `/join-us`: equipo o artistas.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ NACIÓ EL 2026-09-22 Y REEMPLAZA A DOS SECCIONES APILADAS. Camila: «quiero
 * que los forms y sus textos cambien según si en un selector elijo the team o
 * artist, es decir quiero que si scrolleo tanto a primeras yo comprenda que
 * rooftop busca tanto gente para el team como artistas y que puedo postular
 * para cada uno».
 *
 * Eso es exactamente lo que la página apilada NO hacía. Los dos carriles
 * existían, pero el segundo empezaba mil y pico de píxeles más abajo: quien
 * abría la página veía un formulario de trabajo y tenía que adivinar que
 * scrolleando aparecía otra cosa. Las dos ofertas tienen que estar A LA VISTA
 * al mismo tiempo, y sólo una de las dos puede ocupar la pantalla.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠️ EL ESTADO VIAJA EN LA URL Y NO EN UN `useState`. Esto es un componente de
 * servidor: dos `<Link>` a `?apply=team` y `?apply=artist`, cero JavaScript.
 *
 * Es la misma decisión que rige `MonthBar` en el calendario, y acá además
 * paga las TRES objeciones que la página apilada le hacía a los tabs, escritas
 * en su propio comentario el 2026-09-21:
 *
 *   · «no se pueden enlazar» → sí: `/join-us?apply=artist` es la dirección que
 *     se le manda a un músico, y llega directo a su formulario;
 *   · «funcionan sin JavaScript» → sí, son links de verdad;
 *   · «obligan a reimplementar el teclado» → no hay teclado que implementar:
 *     son dos links, y el navegador ya sabe recorrerlos.
 *
 * Lo único que un `tablist` con estado en cliente daba y esto no es cambiar de
 * carril sin ir al servidor. La página es estática salvo las vacantes, así que
 * eso cuesta una navegación del App Router, no una recarga.
 *
 * ⚠️ `scroll={false}` EN LOS DOS. Sin eso, Next manda el scroll al tope en cada
 * navegación: alguien que bajó hasta el selector, tocó «Artists» y quería ver
 * el formulario de artistas, aterriza de vuelta en el hero. Es la misma regla
 * que la barra del calendario, donde está anotada largo.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠️ LAS DOS OPCIONES SE VEN SIEMPRE, Y ESA ES LA PIEZA ENTERA. No es un
 * desplegable ni un conmutador de una palabra: son dos bloques del mismo
 * tamaño, cada uno con su número, su nombre y una línea de qué hay adentro. La
 * que no está elegida no se esconde ni se apaga hasta desaparecer, porque su
 * trabajo es decir «también existe esto». Por eso la inactiva conserva el
 * texto legible y lo que cambia es el fondo y la barra de acento.
 *
 * ⚠️ EL ACTIVO ES `deep` Y NO `sunset`. Misma regla que las píldoras del
 * calendario, y por el mismo motivo: en esta pantalla el naranja es la ACCIÓN
 * —«Plan an Event» en el header, «Send application» al pie del formulario— y
 * una barra que sólo dice en qué carril estás parado no compite con eso.
 *
 * ⚠️ VA DE BORDE A BORDE Y FUERA DE UNA `Section`. Es una barra, no un objeto
 * de la página: una card centrada con aire a los costados se lee como un
 * elemento más y no como el control que parte la página en dos. Se pagina sola
 * con `GUTTER` afuera y `caja` adentro, igual que `MonthBar`.
 *
 * ⚠️ NO ES `sticky`. La del calendario sí lo es porque ahí se cambia de mes
 * quince veces seguidas mientras se mira la grilla; acá se elige un carril una
 * vez y después se llenan veinte campos. Una barra pegada durante todo ese
 * scroll es un objeto que tapa contenido sin que nadie lo vaya a tocar.
 *
 * ⚠️ LA BANDA VA EN `bone`, QUE ES EL FONDO DEL HERO, y no en `paper` como la
 * del calendario. Es deliberado: así el selector se lee como la última línea
 * del hero —la pregunta que el hero deja abierta— y no como la primera de la
 * sección de abajo. El escalón de superficie queda donde tiene que quedar, en
 * el borde del formulario. Por eso la tarjeta inactiva es `paper`: sobre una
 * banda `bone`, una tarjeta `bone` no existe.
 *
 * ⚠️ NO LO VE `npm run check:surfaces`, que sólo expande `<Section>` y
 * `<FormSlab>`. Si algún día esto pasa a ser una `Section`, entra al ritmo y
 * hay que revisar la página entera.
 * ══════════════════════════════════════════════════════════════════════════
 */

export type JoinLane = 'team' | 'artist';

/**
 * Qué carril pidió la URL.
 *
 * ⚠️ CUALQUIER COSA QUE NO SEA `artist` CAE EN `team`, incluido `?apply=` con
 * basura adentro. El default es el trabajo porque es el carril con el volumen:
 * el cliente publica una hoja de aplicación impresa, no una de casting.
 */
export function parseLane(v: string | string[] | undefined): JoinLane {
  return v === 'artist' ? 'artist' : 'team';
}

const CARRILES: readonly {
  readonly id: JoinLane;
  readonly n: string;
  readonly label: string;
  readonly hint: string;
}[] = [
  {
    id: 'team',
    n: '01',
    label: 'The team',
    hint: 'Bar, kitchen, floor and the yard. Apply for a shift.',
  },
  {
    id: 'artist',
    n: '02',
    label: 'Artists',
    hint: 'Solo acts, bands and DJs. Send us your material.',
  },
];

export default function JoinSwitch({ lane }: { readonly lane: JoinLane }) {
  return (
    <div className={`grano border-b border-ink/12 bg-bone py-[14px] lg:py-[18px] ${GUTTER}`}>
      <div className="caja">
        {/*
          ⚠️ ES UNA `<nav>` CON LISTA Y NO UN `role="tablist"`. Un tablist
          promete paneles que se muestran y se ocultan en la misma página, con
          las flechas del teclado moviendo el foco entre pestañas. Acá cada
          opción es una DIRECCIÓN distinta: lo honesto es una navegación, y así
          un lector de pantalla anuncia «link» y no «tab», que es lo que
          efectivamente pasa al activarlo.
        */}
        <nav aria-label="What you are applying for">
          <ul className="m-0 grid list-none gap-[10px] p-0 sm:grid-cols-2">
            {CARRILES.map((c) => {
              const activo = c.id === lane;
              return (
                <li key={c.id}>
                  <Link
                    href={`/join-us?apply=${c.id}`}
                    scroll={false}
                    /*
                      ⚠️ `aria-current="page"` Y NO ALCANZA EL COLOR. Es la misma
                      regla que ya cumplen los filtros del calendario: quien no
                      ve el fondo teal necesita que se le diga cuál está activo.
                    */
                    aria-current={activo ? 'page' : undefined}
                    className={[
                      'group flex h-full items-start gap-[14px] rounded-card border p-[16px] transition-colors lg:p-[20px]',
                      activo
                        ? 'border-deep bg-deep text-paper'
                        : 'border-ink/15 bg-paper text-body hover:border-deep/40 hover:bg-cream',
                    ].join(' ')}
                  >
                    {/*
                      La barra de acento del activo. Es la misma marca de «acá
                      estás» que usan las pestañas de `VenueTabs`, y es lo que
                      hace que los dos bloques se lean como un control y no como
                      dos tarjetas sueltas que linkean a cualquier lado.
                    */}
                    <span
                      aria-hidden="true"
                      className={[
                        'mt-[4px] h-[34px] w-[2px] shrink-0 rounded-pill transition-colors lg:h-[40px]',
                        activo ? 'bg-sunset' : 'bg-ink/20 group-hover:bg-deep/40',
                      ].join(' ')}
                    />
                    <span className="min-w-0">
                      <span className="flex items-baseline gap-[10px]">
                        <span
                          aria-hidden="true"
                          className={[
                            'font-body text-caption font-bold tabular-nums',
                            activo ? 'text-paper/70' : 'text-body/70',
                          ].join(' ')}
                        >
                          {c.n}
                        </span>
                        <span className="font-display text-d6 uppercase leading-none lg:text-d5">
                          {c.label}
                        </span>
                      </span>
                      <span
                        className={[
                          'mt-[6px] block font-body text-[15px] leading-[1.5]',
                          activo ? 'text-paper/80' : 'text-body/75',
                        ].join(' ')}
                      >
                        {c.hint}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
