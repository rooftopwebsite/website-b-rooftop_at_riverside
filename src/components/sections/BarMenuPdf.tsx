import MenuPdfDialog from '@/components/shared/MenuPdfDialog';
import { Heading } from '@/components/shared/Type';

/**
 * ══════════════════════════════════════════════════════════════════════════
 * LA CARTA DE LA BARRA, EL PDF DE LA BASE.
 *
 * Camila, 2026-09-21: «tomá el PDF de ese menú para la página correspondiente,
 * actualizalo para que el menú se tome de ahí y no sean las imágenes subidas
 * desde el repo».
 *
 * ⚠️ REEMPLAZA A `MenuSheets`, QUE NO SE BORRA. Aquello son las dos láminas JPG
 * que se bajaron del sitio de Wix el 2026-09-17, cuando no existía ningún PDF
 * de la carta —está auditado: en `/drink` hay dos imágenes dentro de un slider y
 * ningún archivo—. Ahora el PDF existe y lo carga el cliente, así que la fuente
 * cambia. `MenuSheets` queda como respaldo para el caso en que la base no
 * conteste o la carta no esté cargada: lo decide la página.
 *
 * ⚠️ LO QUE SE GANA Y LO QUE NO. Se gana que el cliente actualice la carta solo,
 * sin que nadie recorte un JPG: sube el PDF al dashboard y el sitio lo sirve. NO
 * se gana texto: un PDF sigue sin ser HTML, así que la carta sigue sin
 * indexarse y sin poder leerse con un lector de pantalla. Eso sólo vuelve con
 * `BarMenu`, que sigue en el árbol y lee los cincuenta ítems de la base.
 *
 * ⚠️ EL VISOR VA EMBEBIDO Y ADEMÁS SE PUEDE ABRIR EN GRANDE. La carta del bar es
 * lo que la página viene a mostrar —no es un enlace más, como en las tarjetas de
 * los trucks— así que se ve sin hacer clic. El botón de abajo abre el mismo
 * diálogo que usan los trucks, para leerla a pantalla casi completa.
 *
 * ⚠️ LA ALTURA DEL EMBEBIDO ES `aspect` Y NO UN `vh`. Con `vh` el visor mide lo
 * mismo en un teléfono que en un monitor, y en el teléfono eso es media carta
 * ilegible. Con proporción de hoja —3:4 en angosto, 4:3 en desktop— el PDF se
 * ve como lo que es.
 * ══════════════════════════════════════════════════════════════════════════
 */
export default function BarMenuPdf({ url }: { readonly url: string }) {
  return (
    <section aria-labelledby="carta-title" className="banda-arco relative z-[2] bg-bone grano pb-cierre">
      {/*
        El encabezado es el mismo que tenía la versión de láminas, palabra por
        palabra: centrado, sin rótulo y nombrando la cosa. El porqué está escrito
        en `MenuSheets` y no se repite acá.
      */}
      <div className="caja-ancha pt-14 text-center lg:pt-20">
        <Heading level={2} id="carta-title" className="text-banda text-ink">
          The bar menu
        </Heading>
        <p className="mx-auto mt-gap-bajada max-w-[58ch] text-lead text-body/80">
          Cocktails made daily with fresh juice and house syrups, upstairs, by us. Drafts from
          breweries down the road, and the cans everybody actually orders.
        </p>

        {/*
          ⚠️ EL MARCO ES EL DE UNA LÁMINA: fondo `paper`, `rounded-frame` y la
          sombra de tarjeta del sistema. Sin marco, un `<iframe>` gris a lo ancho
          de la banda se lee como un error de carga y no como la carta.
        */}
        <div className="mx-auto mt-9 w-full max-w-[760px] overflow-hidden rounded-frame bg-paper sombra-card lg:mt-12">
          <iframe
            src={url}
            title="The Sunset Bar menu"
            className="block aspect-[3/4] w-full border-0 bg-fog md:aspect-[4/3]"
          />
        </div>

        <div className="mt-7 flex justify-center">
          <MenuPdfDialog url={url} label="The bar menu" cta="Open the menu" />
        </div>
      </div>
    </section>
  );
}
