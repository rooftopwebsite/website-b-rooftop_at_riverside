'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import DishCard from '@/components/shared/DishCard';
import { Eyebrow, Heading } from '@/components/shared/Type';
import type { DishGroup } from '@/lib/restoexp';

/**
 * LA CARTA DEL BAR: un panel crema con arco, tabs y una tarjeta por trago.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ QUÉ REEMPLAZA. Hasta el 2026-09-17 la carta eran CUATRO secciones
 * seguidas —cocktails, specials, beer, wine—, cada una con su encabezado
 * propio y sus ítems como renglones de dos columnas con filete punteado. Eso
 * funcionaba como menú impreso y tenía dos problemas: la página medía cuatro
 * pantallas sin forma de saltar a lo que uno busca, y el renglón sólo podía
 * mostrar nombre, precio y descripción.
 *
 * Pedido de Camila, 2026-09-17: «la sección siguiente que tenga color crema y
 * puntas redondas sobre el fondo verde, como en la home; en esta sección
 * pondremos todo el menú, con título y bajada y los tabs para navegar a las
 * diferentes secciones, y los items que sean cards como las de las 3 promo
 * pero para un item de menú».
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ EL ARCO ES `banda-arco`, LA MISMA UTILIDAD DE LA HOME. Da las dos puntas
 * de arriba redondeadas y el margen negativo que monta el panel sobre la banda
 * verde de happy hour. El radio es fluido (`--radius-band`) y el margen lo
 * lee, así que los dos se mueven juntos. La sección de arriba reserva el hueco
 * sola: hay un `:has(+ .banda-arco)` en `globals.css` que le pone un borde
 * inferior transparente del alto del radio.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LOS TABS SON LINKS Y NO BOTONES, y no es un detalle de gusto. Con `href`
 * a un ancla funcionan sin JavaScript, se pueden abrir en otra pestaña y el
 * navegador los anuncia como lo que son: un salto dentro de la página. El
 * scroll suave y el subrayado del activo son mejoras encima de algo que ya
 * funciona, no el mecanismo.
 *
 * ⚠️ POR ESO CADA SECCIÓN LLEVA `scroll-mt-*`: es lo que hace que el salto
 * nativo no deje el título escondido debajo del header pegajoso y de la propia
 * barra de tabs. El número es la suma de los dos.
 *
 * ⚠️ LA BARRA DE TABS ES `sticky` DEBAJO DEL HEADER. El header del sitio mide
 * 78px y también es `sticky top-0`, así que ésta se pega a 78. Si el header
 * cambia de alto, este número se mueve con él.
 *
 * ⚠️ EL TAB ACTIVO SE CENTRA SOLO EN EL SCROLLER. En un teléfono los tabs no
 * entran todos: sin esto, al scrollear la página el activo queda fuera de
 * cuadro y la barra parece rota. Es el mismo recurso que usa el menú de
 * pretty-hens, que es de donde salió este patrón.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LA TARJETA NO SE ESCRIBIÓ ACÁ: ES `DishCard`, QUE YA EXISTÍA. Está hecha
 * para el tipo `Dish` de la base y cubre la ficha entera —foto, nombre,
 * precio con variantes y descuento, dietarios, tags, picante, alérgenos,
 * calorías y notas—. Estaba en el árbol sin que la usara nadie desde que las
 * cartas de los trucks quedaron en espera. Acá encuentra su primer uso vivo.
 *
 * ⚠️ Y POR ESO LA CONSULTA CAMBIÓ: `getBarMenu()` pide las 29 columnas del
 * plato en vez de las cuatro de `getMenu()`. Si el cliente le carga una foto o
 * una variante a un trago en el dashboard, aparece sin tocar código.
 * ══════════════════════════════════════════════════════════════════════════
 */

/** «By the glass» → `by-the-glass`. El ancla de cada sección. */
function anclaDe(titulo: string): string {
  return titulo
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Lo que mide el header pegajoso, en px. El salto y el scroll-spy descuentan
 * esto más el alto de la barra de tabs, que se mide en vivo.
 */
const ALTO_HEADER = 78;

export default function BarMenu({ grupos }: { readonly grupos: readonly DishGroup[] }) {
  const anclas = grupos.map((g) => anclaDe(g.title));
  const [activo, setActivo] = useState(anclas[0] ?? '');
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const barraRef = useRef<HTMLElement | null>(null);

  /** Alto real de la barra de tabs. Cambia si los tabs pasan a dos renglones. */
  const altoBarra = useCallback(() => barraRef.current?.getBoundingClientRect().height ?? 0, []);

  /*
   * ⚠️ EL SCROLL-SPY MIRA QUÉ SECCIÓN CRUZÓ LA LÍNEA, y no cuál está más
   * centrada: con secciones de alturas muy distintas —«Specials» tiene dos
   * ítems y «Signature cocktails» diez— la más alta se llevaría el activo casi
   * siempre. La línea es el borde de abajo de la barra de tabs más un pelo.
   *
   * ⚠️ Va con `requestAnimationFrame` y no en cada evento: el `scroll` dispara
   * decenas de veces por segundo y esto lee `getBoundingClientRect` de cada
   * sección, que fuerza layout.
   */
  useEffect(() => {
    if (anclas.length === 0) return;
    let pedido = 0;

    const revisar = () => {
      pedido = 0;
      const linea = ALTO_HEADER + altoBarra() + 24;
      let actual = anclas[0];
      for (const id of anclas) {
        const nodo = document.getElementById(id);
        if (nodo && nodo.getBoundingClientRect().top <= linea) actual = id;
      }
      setActivo((prev) => (prev === actual ? prev : actual));
    };

    const alScrollear = () => {
      if (pedido) return;
      pedido = requestAnimationFrame(revisar);
    };

    revisar();
    window.addEventListener('scroll', alScrollear, { passive: true });
    window.addEventListener('resize', alScrollear, { passive: true });
    return () => {
      if (pedido) cancelAnimationFrame(pedido);
      window.removeEventListener('scroll', alScrollear);
      window.removeEventListener('resize', alScrollear);
    };
  }, [anclas, altoBarra]);

  /* El activo siempre visible dentro del scroller horizontal. */
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || scroller.scrollWidth <= scroller.clientWidth) return;
    const tab = scroller.querySelector<HTMLElement>(`[data-ancla="${activo}"]`);
    if (!tab) return;
    scroller.scrollTo({
      left: tab.offsetLeft - scroller.clientWidth / 2 + tab.clientWidth / 2,
      behavior: 'smooth',
    });
  }, [activo]);

  const saltar = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const nodo = document.getElementById(id);
    if (!nodo) return;
    e.preventDefault();
    const destino = nodo.getBoundingClientRect().top + window.scrollY - ALTO_HEADER - altoBarra();
    window.scrollTo({ top: Math.max(destino, 0), behavior: 'smooth' });
    setActivo(id);
    /* El foco va igual al destino: sin esto el salto es sólo visual y quien
       navega con teclado sigue donde estaba. */
    nodo.focus({ preventScroll: true });
  };

  return (
    <section
      aria-labelledby="carta-title"
      className="banda-arco relative z-[2] bg-bone grano pb-cierre"
    >
      <div className="caja-ancha pt-14 lg:pt-20">
        <Eyebrow tone="plum">The list</Eyebrow>
        <Heading level={2} id="carta-title" className="mt-gap-kicker text-d3 lg:text-d2">
          Everything we pour
        </Heading>
        <p className="mt-gap-bajada max-w-[62ch] text-lead text-body/80">
          Cocktails made daily with fresh juice and house syrups, upstairs, by us. Drafts from
          breweries down the road, and the cans everybody actually orders.
        </p>
      </div>

      {/*
        ⚠️ LA BARRA SALE DE `caja-ancha` A PROPÓSITO: el scroller tiene que
        llegar a los dos bordes de la pantalla para que en un teléfono el
        último tab no quede cortado contra el margen. El aire lo pone el
        `px-borde` de adentro, que es el mismo del contenedor.
      */}
      <nav
        ref={barraRef}
        aria-label="Menu sections"
        className="sticky top-19.5 z-20 mt-8 border-b border-ink/10 bg-bone grano lg:mt-10"
      >
        <div
          ref={scrollerRef}
          className="flex gap-x-6 overflow-x-auto px-borde [scrollbar-width:none] lg:gap-x-8 [&::-webkit-scrollbar]:hidden"
        >
          {grupos.map((g) => {
            const id = anclaDe(g.title);
            const esActivo = id === activo;
            return (
              <Link
                key={id}
                href={`#${id}`}
                data-ancla={id}
                onClick={(e) => saltar(e, id)}
                aria-current={esActivo ? 'true' : undefined}
                className={[
                  'shrink-0 border-b-2 py-4 font-body text-nav font-bold whitespace-nowrap transition-colors duration-200',
                  esActivo
                    ? 'border-sunset text-ink'
                    : 'border-transparent text-body/70 hover:text-terra',
                ].join(' ')}
              >
                {g.title}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="caja-ancha">
        {grupos.map((g) => {
          const id = anclaDe(g.title);
          return (
            <section
              key={id}
              id={id}
              tabIndex={-1}
              aria-labelledby={`${id}-title`}
              className="scroll-mt-[136px] pt-12 lg:pt-16"
            >
              <Heading level={3} id={`${id}-title`} className="text-d4 lg:text-d3">
                {g.title}
              </Heading>
              {g.note ? (
                <p className="mt-2.5 max-w-[62ch] font-body text-base text-body/80">{g.note}</p>
              ) : null}

              {/*
                ⚠️ TRES COLUMNAS RECIÉN EN `xl`. A dos columnas la tarjeta mide
                unos 340px, que es donde el nombre de un trago largo entra en
                dos renglones; a tres en una pantalla de 1280 bajaría a 250 y
                empieza a partir palabras.
              */}
              <ul className="m-0 mt-6 grid list-none gap-4 p-0 sm:grid-cols-2 lg:gap-5 xl:grid-cols-3">
                {g.items.map((dish) => (
                  <li key={`${id}-${dish.name}`} className="contents-none">
                    <DishCard dish={dish} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

      </div>
    </section>
  );
}
