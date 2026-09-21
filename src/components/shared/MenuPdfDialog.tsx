'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from '@/components/shared/Icon';

/**
 * ══════════════════════════════════════════════════════════════════════════
 * LA CARTA DE UN TRUCK, EN GRANDE Y SIN SALIR DE LA PÁGINA.
 *
 * Camila, 2026-09-21: «conectá cada card con su menú de la base de datos; debe
 * abrirse cada PDF como se abre el de Sunset Bar».
 *
 * ⚠️ «COMO EL DE SUNSET BAR» ES EL MECANISMO, NO EL COMPONENTE. Allá la carta
 * son dos JPG y `MenuSheets` los hojea; acá es un PDF de una o varias páginas y
 * hojearlo lo hace el visor del navegador. Lo que se copia es lo que la persona
 * ve: el mismo `<dialog>` nativo a pantalla casi completa, el mismo telón que
 * cierra al hacer clic afuera, la misma cruz arriba a la derecha y el mismo
 * Escape. La carta se abre SOBRE la página y se cierra volviendo a ella.
 *
 * ⚠️ ES UN `<dialog>` NATIVO y no una librería ni un `div` con `position:fixed`.
 * Sale gratis lo que importa: cierra con Escape, atrapa el foco mientras está
 * abierto, lo anuncia como diálogo modal y deja inerte el fondo. Es el mismo
 * argumento escrito en `MenuSheets`, y por eso las dos piezas se comportan
 * igual sin compartir código.
 *
 * ⚠️ EL PDF VA EN UN `<iframe>` Y NO EN UN `<object>` NI EN UN `<embed>`. Los
 * tres muestran el visor del navegador, pero el `iframe` es el único que
 * acepta `title`, que es lo que un lector de pantalla anuncia al entrar.
 *
 * ⚠️ Y SIEMPRE HAY UNA SALIDA FUERA DEL VISOR: abajo queda el link «Open the
 * PDF» que lo abre en una pestaña. En los navegadores de iOS dentro de apps
 * —Instagram, Facebook— el visor embebido a veces no dibuja nada, y sin ese
 * link la carta sería inalcanzable justo para quien llega desde una historia.
 *
 * ⚠️ EL `<iframe>` SE MONTA RECIÉN AL ABRIR. Con cuatro tarjetas en la página,
 * montarlos de entrada son cuatro PDF descargándose sin que nadie los haya
 * pedido. Se monta con el diálogo y se desmonta al cerrar.
 * ══════════════════════════════════════════════════════════════════════════
 */
export default function MenuPdfDialog({
  url,
  label,
  cta = 'See the menu',
}: {
  /** La URL del PDF. Sale de la base; ver `menuDeTruck` en `content/trucks.ts`. */
  readonly url: string;
  /** De quién es la carta. Va en el título del diálogo y en el texto alterno. */
  readonly label: string;
  /**
   * Qué dice el botón.
   *
   * ⚠️ EXISTE POR LA PÁGINA DEL BAR. En una tarjeta de truck, «See the menu» es
   * la única acción y se entiende sola. En `/sunset-bar` la carta ya está
   * embebida arriba del botón, así que «See the menu» sería un botón que ofrece
   * lo que la persona está mirando: ahí dice «Open the menu».
   */
  readonly cta?: string;
}) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [abierto, setAbierto] = useState(false);

  const abrir = useCallback(() => {
    setAbierto(true);
    dialogo.current?.showModal();
  }, []);

  const cerrar = useCallback(() => {
    dialogo.current?.close();
  }, []);

  /*
    `close` lo dispara también Escape, que es la vía que no pasa por ningún
    handler nuestro: escuchar el evento es lo que mantiene el estado en sincro
    con el diálogo real y lo que desmonta el `<iframe>`.
  */
  useEffect(() => {
    const el = dialogo.current;
    if (!el) return;
    const onClose = () => setAbierto(false);
    el.addEventListener('close', onClose);
    return () => el.removeEventListener('close', onClose);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={abrir}
        className="inline-flex items-center gap-2 rounded-pill bg-sunset px-4.5 py-2 font-body text-dato font-semibold uppercase tracking-cta text-ink transition-colors duration-200 hover:bg-sunset-hover"
      >
        {cta}
        <ArrowUpRight className="size-3.5 shrink-0" />
        <span className="sr-only">for {label}</span>
      </button>

      {/*
        ⚠️ EL CLIC EN EL TELÓN SE DETECTA COMPARANDO EL TARGET CON EL PROPIO
        `<dialog>`: el telón ES el diálogo —su `::backdrop` no recibe eventos—,
        así que un clic cuyo target es el elemento y no su contenido cayó
        afuera. Es el mismo truco que usa `MenuSheets`.
      */}
      <dialog
        ref={dialogo}
        onClick={(e) => {
          if (e.target === dialogo.current) cerrar();
        }}
        aria-label={`${label} menu`}
        className="m-auto h-[92vh] w-[min(64rem,94vw)] rounded-shell bg-bone p-0 backdrop:bg-ink/70"
      >
        <div className="flex h-full flex-col">
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-ink/12 px-5 py-3">
            <p className="m-0 font-display text-d6 font-bold uppercase leading-none text-ink">
              {label}
            </p>
            <button
              type="button"
              onClick={cerrar}
              className="grid size-9 shrink-0 place-items-center rounded-pill border border-ink/20 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
            >
              {/* La misma X que el visor de la carta del bar y el drawer del
                  header: dos trazos, sin sumar un icono al set del sitio. */}
              <svg width="13" height="13" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span className="sr-only">Close</span>
            </button>
          </div>

          {abierto ? (
            <iframe src={url} title={`${label} menu`} className="min-h-0 grow border-0 bg-fog" />
          ) : null}

          <p className="m-0 shrink-0 border-t border-ink/12 px-5 py-3 text-center font-body text-dato text-body/80">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-texto font-semibold"
            >
              Open the PDF
            </a>{' '}
            if it does not load here.
          </p>
        </div>
      </dialog>
    </>
  );
}
