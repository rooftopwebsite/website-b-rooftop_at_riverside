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
 * ⚠️ ES UNA FILA DE PÍLDORAS Y ANTES ERAN DOS TARJETAS GRANDES. Camila,
 * 2026-09-22, sobre la captura: «saca la bajada del hero, conviértela en un
 * título y bajada que le siga un selector típico como usamos en otros
 * proyectos, y con él cambie el contenido de debajo».
 *
 * El «selector típico» del repo son los filtros del calendario: píldoras en
 * una fila, la activa en `deep` con tinta `paper`, las otras con filete. Acá
 * eran dos tarjetas de 100px de alto con número, nombre, una línea de
 * descripción y una barra de acento — o sea un objeto con más peso visual que
 * el titular de la sección que ahora tiene encima.
 *
 * ⚠️ LAS DOS OPCIONES SE SIGUEN VIENDO SIEMPRE, que es lo que esta pieza tiene
 * que hacer: la que no está elegida no se esconde ni se apaga hasta
 * desaparecer, porque su trabajo es decir «también existe esto».
 *
 * ⚠️ Y SE FUE LA LÍNEA DE DESCRIPCIÓN DE CADA UNA. «Bar, kitchen, floor and the
 * yard» y «Solo acts, bands and DJs» decían lo mismo que la bajada del
 * formulario que se abre dos píldoras más abajo. En una píldora no entran, y
 * duplicadas no hacían falta.
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
 * ⚠️ LA BANDA VA EN `bone` Y YA NO LLEVA FILETE ABAJO. Sigue el titular que
 * `/join-us` monta encima —«What are you here for»— y las dos cosas son el
 * mismo bloque, así que un borde entre el texto y su propio control lo partía
 * en dos. El corte con el formulario lo hace el cambio de superficie.
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
  readonly label: string;
}[] = [
  { id: 'team', label: 'The team' },
  { id: 'artist', label: 'Artists' },
];

/**
 * El molde de la píldora activa, calcado de los filtros del calendario.
 *
 * ⚠️ ES `deep` Y NO `sunset`. Misma regla que allá, y por el mismo motivo: en
 * esta pantalla el naranja es la ACCIÓN —«Plan an Event» en el header, «Send
 * application» al pie del formulario— y una píldora que sólo dice en qué
 * carril estás parado no compite con eso.
 */
const ACTIVA = 'bg-deep text-paper';

export default function JoinSwitch({ lane }: { readonly lane: JoinLane }) {
  return (
    <div className={`grano bg-paper pt-gap-cta pb-[28px] lg:pb-[36px] ${GUTTER}`}>
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
          {/*
            ⚠️ EL RIEL CON FILETE ALREDEDOR DE LAS DOS ES LO QUE LAS HACE UN
            CONTROL. Sueltas, dos píldoras seguidas se leen como dos botones que
            hacen dos cosas distintas; adentro de una cápsula con borde, se leen
            como un conmutador de dos posiciones. Es el mismo riel que el
            selector de vista del calendario.

            ⚠️ `w-fit` PARA QUE EL RIEL MIDA LO QUE MIDEN LAS PÍLDORAS. Sin eso
            el `<ul>` se estira a la caja entera y queda una cápsula de 1168px
            con dos píldoras apretadas a la izquierda.
          */}
          <ul className="m-0 mx-auto flex w-fit list-none gap-[4px] rounded-pill border border-teal600/30 p-[3px]">
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
                      'flex items-center whitespace-nowrap rounded-pill px-[16px] py-[9px] text-caption font-bold uppercase tracking-[0.1em] transition-colors lg:px-[22px]',
                      activo ? ACTIVA : 'text-deep hover:bg-mint/60',
                    ].join(' ')}
                  >
                    {c.label}
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
