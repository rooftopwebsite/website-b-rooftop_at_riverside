import Image from 'next/image';
import type { Dish } from '@/lib/restoexp';
import { formatPrice } from '@/content/bar-menu';
import { TAG } from '@/lib/tag';

/**
 * La tarjeta de un plato. La usan las cartas de los food trucks.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ES LA TARJETA DE PLATO DE LA CASA, TRADUCIDA A ESTA MARCA. Camila,
 * 2026-09-16: «generá las cards de platos siguiendo la estética actual, podés
 * tomar de referencia pretty o santa maría para ver cómo deberían ser».
 *
 * De `pretty-hens/components/menu/menu-card.tsx` se toma el ORDEN, que es lo
 * que hace que la tarjeta se escanee bien, y está probado en dos sitios:
 *
 *     1. foto            2:1 o 3:2, arriba
 *     2. nombre + precio en el mismo renglón, el precio a la derecha
 *     3. variantes       en su propio renglón, si las hay
 *     4. chips           dietario, tags y picante
 *     5. descripción
 *     6. datos duros     calorías, minutos
 *     7. alérgenos       separados y en rojo
 *     8. notas           tras un filete punteado
 *
 * ⚠️ LO QUE NO SE COPIA SON LOS ÍCONOS POR TAG. Allá cada etiqueta lleva su
 * dibujo de Phosphor —catorce íconos— y acá el sitio tiene DIECISÉIS íconos en
 * total, dibujados a mano en `Icon.tsx`. Sumar catorce más por una tarjeta
 * duplicaría el set y ninguno sería de esta marca.
 *
 * La distinción la hace el MATERIAL de la píldora, que es el recurso que este
 * sitio ya usa en cuatro lugares:
 *
 *     dietario y tags   relleno `cream`, texto `deep`      9.44:1
 *     picante           relleno `sunset`, texto `ink`      8.26:1
 *     datos duros       relleno `bone`, texto `muted`      4.96:1
 *     alérgenos         filo `terra`, texto `terra`        7.43:1
 *
 * ⚠️ EL PRECIO USA `formatPrice` DE `bar-menu.ts`, que compone «9⁵⁰» con los
 * centavos en volada, tal como el menú impreso del bar. No se escribe un
 * formateador nuevo: que la carta del bar y la de un truck compongan el precio
 * distinto sería la clase de detalle que hace que un sitio parezca dos.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ ES SERVER COMPONENT. No tiene estado ni handlers, así que no viaja al
 * bundle del cliente. Si algún día lleva un botón de «agregar», deja de serlo.
 */

/** Las píldoras dietarias, en el orden en que se leen mejor. */
const DIETARIO: readonly (readonly [keyof Dish, string])[] = [
  ['is_vegan', 'Vegan'],
  ['is_vegetarian', 'Vegetarian'],
  ['is_gluten_free', 'Gluten free'],
  ['is_dairy_free', 'Dairy free'],
  ['is_nut_free', 'Nut free'],
  ['is_halal', 'Halal'],
  ['is_keto', 'Keto'],
  ['is_organic', 'Organic'],
];

/** La escala de picante del dashboard. El 0 no se muestra. */
const PICANTE = ['', 'Mild', 'Medium', 'Hot', 'Very hot'] as const;

/**
 * El precio, con sus tres formas posibles.
 *
 * ⚠️ SON TRES Y NO UNA, porque el dashboard guarda tres cosas distintas en
 * campos distintos y la tarjeta tiene que saber cuál mirar:
 *
 *   · `price_variants`   «Glass 12 / Bottle 44». Va en su propio renglón.
 *   · `base_is_price_range` con `base_price_max`: «18 a 26».
 *   · `base_price` solo: el caso normal.
 *
 * ⚠️ `show_currency` EXISTE Y SE RESPETA. Hay cartas cargadas sin símbolo a
 * propósito —las de precio único, donde el número repetido cincuenta veces con
 * el signo adelante se lee como un formulario— y es una decisión del cliente en
 * el dashboard, no nuestra.
 */
function Precio({ dish }: { readonly dish: Dish }) {
  const signo = dish.show_currency ? '$' : '';

  const numero = (n: number) => {
    const { whole, cents } = formatPrice(n);
    return (
      <>
        {signo}
        {whole}
        {cents ? <sup className="text-[0.62em] font-bold">{cents}</sup> : null}
      </>
    );
  };

  if (dish.base_price === null) return null;

  const rango =
    dish.base_is_price_range && dish.base_price_max !== null && dish.base_price_max > dish.base_price;

  return (
    <span className="flex flex-none items-baseline gap-2">
      {/*
        El descuento se muestra tachando el precio viejo, no calculando uno
        nuevo: el `base_price` de la base ES el precio vigente. Lo tachado es el
        de antes, reconstruido.
      */}
      {dish.discount_percent && dish.discount_percent > 0 ? (
        <span className="font-body text-caption font-medium text-muted line-through">
          {numero(dish.base_price / (1 - dish.discount_percent / 100))}
        </span>
      ) : null}
      <span className="font-display text-d6 font-bold tabular-nums text-deep">
        {numero(dish.base_price)}
        {rango ? <span className="font-body text-dato font-medium"> to {numero(dish.base_price_max!)}</span> : null}
      </span>
    </span>
  );
}

export default function DishCard({ dish }: { readonly dish: Dish }) {
  const variantes = (dish.price_variants ?? []).filter(
    (v) => v && (v.price ?? null) !== null,
  );
  const chips = DIETARIO.filter(([campo]) => dish[campo] === true).map(([, etiqueta]) => etiqueta);
  const tags = (dish.tags ?? []).filter(Boolean);
  const alergenos = (dish.allergens ?? []).filter(Boolean);
  const picante = dish.spice_level ?? 0;

  /* Los datos duros son los que el dashboard guarda como número. Se muestran
     sólo si están: la mayoría de las cartas no los carga. */
  const duros = [
    dish.calories !== null ? `${dish.calories} cal` : null,
    dish.cooking_time_minutes !== null ? `${dish.cooking_time_minutes} min` : null,
  ].filter((x): x is string => x !== null);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-shell bg-paper sombra-card">
      {dish.image_url ? (
        /*
          ⚠️ `object-cover` Y NO `contain`. En pretty-hens es `contain` porque
          las fotos vienen con fondo propio y recortarlas les come el plato;
          las de esta plataforma son cuadradas y centradas, así que `cover` a
          3:2 las encuadra sin cortar nada importante y no deja bandas.

          ⚠️ `unoptimized` porque la foto la sirve el storage de Supabase con
          su propio `?v=` de cache busting: pasarla por el optimizador de Next
          agregaría una segunda caché que se desactualiza cuando el cliente
          cambia la foto en el dashboard.
        */
        <div className="relative aspect-[3/2] overflow-hidden bg-fog">
          <Image
            src={dish.image_url}
            alt={dish.image_alt ?? ''}
            aria-hidden={dish.image_alt ? undefined : true}
            fill
            unoptimized
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 46vw, 90vw"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col gap-3 p-5.5 lg:p-6">
        {/* 1. Nombre y precio, en el mismo renglón. */}
        <div className="flex items-start justify-between gap-4">
          <h4 className="m-0 font-display text-d6 font-bold uppercase leading-[1.02] text-ink">
            {dish.name}
          </h4>
          {variantes.length === 0 ? <Precio dish={dish} /> : null}
        </div>

        {/*
          2. Las variantes, siempre en su propio renglón.

          ⚠️ EL SEPARADOR CIERRA CADA VARIANTE en vez de abrir la siguiente, y
          va dentro del mismo `span`: es el arreglo que ya está hecho en
          pretty-hens, donde con tres variantes el wrap dejaba la barra
          abriendo el segundo renglón.
        */}
        {variantes.length > 0 ? (
          <p className="m-0 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            {variantes.map((v, i) => (
              <span key={`${v.name ?? 'v'}-${i}`} className="flex items-baseline gap-1.5">
                {v.name ? (
                  <span className="font-body text-dato font-medium text-muted">{v.name}</span>
                ) : null}
                <span className="font-display text-d7 font-bold tabular-nums text-deep">
                  {dish.show_currency ? '$' : ''}
                  {Number(v.price)}
                </span>
                {i < variantes.length - 1 ? (
                  <span aria-hidden="true" className="ml-0.5 font-body text-dato text-fog">
                    /
                  </span>
                ) : null}
              </span>
            ))}
          </p>
        ) : null}

        {/*
          3. Chips: dietario, tags libres y picante. Mismo material, un solo
          bloque.

          ⚠️ LOS CUATRO SALEN DE `TAG` desde el 2026-09-16, y antes eran tres
          tratamientos distintos en la misma fila: «New» y el picante en
          negrita y caja alta con tracking, los dietarios en medium caja baja,
          y todos a 13px. Pedido de Camila: «si los tags serán con letra
          minúscula que lo sean todos, debemos unificar; en color pueden ser
          distintos pero que sean de la misma familia al menos en tipografía y
          tamaño». Así que lo único que distingue a un chip de otro acá es el
          COLOR, que es lo que el pedido deja libre. Ver `lib/tag.ts`.
        */}
        {chips.length + tags.length > 0 || picante > 0 || dish.is_new || dish.is_suggested ? (
          <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
            {dish.is_new ? (
              <li className={`rounded-pill bg-sunset ${TAG} text-ink`}>New</li>
            ) : null}
            {dish.is_suggested ? (
              <li className={`rounded-pill bg-deep ${TAG} text-cream`}>Chef&rsquo;s pick</li>
            ) : null}
            {[...chips, ...tags].map((etiqueta) => (
              <li key={etiqueta} className={`rounded-pill bg-cream ${TAG} text-deep`}>
                {etiqueta}
              </li>
            ))}
            {picante > 0 ? (
              <li className={`rounded-pill bg-sunset ${TAG} text-ink`}>
                {PICANTE[picante] ?? 'Spicy'}
              </li>
            ) : null}
          </ul>
        ) : null}

        {/* 4. La descripción. `whitespace-pre-line` porque el dashboard deja
               escribir saltos y el cliente los usa para separar ingredientes. */}
        {dish.description ? (
          <p className="m-0 whitespace-pre-line font-body text-base font-light leading-[1.5] text-body">
            {dish.description}
          </p>
        ) : null}

        {/* 5. Datos duros. Relleno `bone`, que es la otra superficie clara del
               sitio: los distingue de los chips sin sumar un color nuevo.

               ⚠️ TAMBIÉN VAN CON `TAG` aunque sean números, y es una decisión
               tomada: «320 cal» es un ATRIBUTO del plato en una fila de
               atributos, no el dato que se vino a buscar. La píldora del
               horario en las cards de eventos sí es lo segundo, y por eso
               aquélla se queda en negrita con su acolchado propio. Lo único
               que sobrevive acá de ese mundo es `tabular-nums`, que alinea las
               cifras y no tiene nada que ver con el tamaño. */}
        {duros.length > 0 ? (
          <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
            {duros.map((d) => (
              <li key={d} className={`rounded-pill bg-bone ${TAG} tabular-nums text-muted`}>
                {d}
              </li>
            ))}
          </ul>
        ) : null}

        {/*
          6. LOS ALÉRGENOS VAN APARTE Y EN ROJO, y no mezclados con los chips.

          ⚠️ En pretty-hens comparten estilo con los tags y se distinguen por un
          ícono de advertencia. Acá no hay ícono de advertencia dibujado, y el
          sitio YA TIENE un token para «esto hay que leerlo»: `terra`, que es el
          rojo de los errores de formulario y de los datos pendientes. Un
          alérgeno es exactamente eso: un aviso, no una característica.

          7.43:1 sobre `paper`. Y el filo, no el relleno: el relleno sólido en
          rojo dentro de una carta se lee como un error de la página.
        */}
        {alergenos.length > 0 ? (
          <ul className="m-0 flex list-none flex-wrap items-center gap-1.5 p-0">
            <li className="font-body text-micro font-bold uppercase tracking-cta text-terra">
              Contains
            </li>
            {alergenos.map((a) => (
              <li key={a} className={`rounded-pill ${TAG} text-terra ring-1 ring-terra/45`}>
                {a}
              </li>
            ))}
          </ul>
        ) : null}

        {/*
          7. Las notas, siempre texto y nunca chips. El campo mezcla agregados
          («Add shrimp 6»), restricciones («kids under 12 only») y avisos, y
          partirlo rompe la prosa. Es el mismo criterio que pretty-hens.

          El `mt-auto` las apoya en el piso de la tarjeta, que es lo que alinea
          el último renglón entre tarjetas de distinto largo.
        */}
        {dish.notes ? (
          <p className="m-0 mt-auto whitespace-pre-line border-t border-dashed border-fog pt-3 font-body text-caption font-medium leading-[1.4] text-muted">
            {dish.notes}
          </p>
        ) : null}

        {/*
          ⚠️ ACÁ HABÍA UN PUNTO NARANJA Y SE FUE EN SU PRIMER USO REAL. Existía
          para cerrar la pila cuando la tarjeta no tenía ni notas ni alérgenos,
          y en una carta de trucks —donde la mayoría sí los tiene— era un
          remate ocasional. La carta del bar son 50 tarjetas y NINGUNA tiene
          notas: el punto aparecía en las cincuenta y dejaba de leerse como un
          gesto de marca para leerse como suciedad en la pantalla.

          Lo que hacía además del adorno era empujar con `mt-auto`, y eso no se
          extraña: sin nada abajo, el contenido se apoya arriba y la tarjeta
          cierra con su propio `p-5.5`.
        */}
      </div>
    </article>
  );
}
