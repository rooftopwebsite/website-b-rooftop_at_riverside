# Blog: listado y template de nota

Fecha: 23 de septiembre de 2026. Decisiones tomadas con Camila en sesión.

Camila: «diseña la página de blogs y de cada nota de blog que será tipo
template, para esto contempla el estilo de toda nuestra web y audita las
páginas de blog y notas en pretty, santa maria y yava. En este caso para cada
nota pondremos la imagen y el título sin el juego de recorte, la usaremos más
común. Ten en cuenta que todo debe estar conectado a la base de datos resto
exp como el resto de nuestros proyectos».

Rooftop hoy no tiene nada de blog: ni ruta, ni función en `lib/restoexp.ts`,
ni entrada en nav, sitemap o `PAGE_SEO`.

---

## 1. Lo que se auditó

Los cuatro sitios hermanos (Pretty Hens, Santa Maria, Yava y Juanitos como
referencia extra) leen el **mismo feed público del dashboard**:

```
GET https://app.restoexp.com/api/public/restaurants/<RESTAURANT_ID>/blogs
→ { data: FeedPost[] }   // ya filtrado a lo publicado, destacado primero, después del más nuevo al más viejo
```

No pide clave. Probado el 2026-09-23: **Rooftop devuelve 0 notas**, Yava 3,
Santa Maria 2. Los campos reales de cada nota:

`id, slug, canonicalUrl, title, excerpt, coverImageUrl, coverImageAlt,
ogImage, ogTitle, ogDescription, content (markdown), contentHtml (sanitizado
por el dashboard), jsonLd, author {name, avatarUrl}, publishedAt (YYYY-MM-DD),
updatedAt (ISO), featured`

| | Pretty Hens | Santa Maria | Yava | Juanitos |
|---|---|---|---|---|
| Capa de datos | **la mejor**: `cache()`, `server-only`, tests | buena, mapeo tolerante | floja | como Yava |
| Host de portada protegido | sí (`safeImageUrl`) | **no, se cae** | pattern amplio | `<img>` crudo |
| Canonical y OG por nota | sí | **no** | **no** | sí, con medidas |
| Fecha y volver al blog | **no** | sí, arriba y abajo | sí (fecha dos veces) | sí |
| Estilos de bloques del editor | no | no | **sí** (FAQ, callout, embed) | sí |

Lo que **no** se copia:

- `no-store` + `force-dynamic` en todo, y el fetch del feed en el layout raíz
  de Pretty Hens: una llamada al dashboard por cada página del sitio.
- El schema de Yava, que arma `https://sitio/https://supabase…` como imagen.
- El extracto de Yava, que queda vacío cuando llega `contentHtml`.
- El autor visible: el feed manda «Resto Experience», que es la agencia.
- El texto justificado a 1280px de Yava.

⚠️ **El HTML de las notas trae guiones medios** («More Than Rice — A Spanish
Ritual», nota real de Santa Maria). La regla del sitio no los admite en texto
visible.

---

## 2. Decisiones

| # | Decisión | Por qué |
|---|---|---|
| 1 | Se lee el feed público, con el caché de Next: `revalidate: 600`, tags `['restoexp', 'blog']` | Mismo origen que los hermanos, pero sin pegarle al dashboard en cada visita. Una nota nueva aparece sola en 10 minutos |
| 2 | El id sale de `NEXT_PUBLIC_SUPABASE_RESTAURANT_ID`, el que ya usa Rooftop | No sumar un segundo nombre para el mismo dato |
| 3 | Override opcional `BLOG_RESTAURANT_ID` | Sólo para verificar en dev con notas de otro restaurante mientras Rooftop tenga 0. No va a `.env` de producción |
| 4 | **Feed vacío → la página se ve, con estado vacío** (opción B de Camila) | El link está en la nav desde el día uno |
| 5 | El listado lleva `PlateHero` como las demás internas | Es una interna más del sitio |
| 6 | **La nota va clásica: portada rectangular y título, sin placa ni esquinas inversas** | Pedido de Camila |
| 7 | **El `h1` de la nota va monocromo** | Excepción explícita de Camila a la regla de la palabra en color: el título viene del dashboard y no se puede elegir la palabra a mano |
| 8 | El autor no se muestra; en el schema el autor es Rooftop (Organization) | El feed trae el nombre de la agencia |
| 9 | Sin paginación, categorías, compartir ni búsqueda | El feed no trae categorías y hoy hay 0 notas. La paginación entra cuando pasen de 12 |

---

## 3. Capa de datos

### `src/lib/blog-format.ts`: pura, sin fetch, con tests

- `toPost(feed): Post | null`. Descarta notas sin slug; si falta título, lo
  saca del slug.
- **Guiones medios:** `sinEmDash` (el de `lib/restoexp.ts`) sobre título,
  extracto, alt, y sobre **cada texto entre etiquetas** del HTML. Nunca dentro
  de atributos ni de `<code>`/`<pre>`.
- `h1` del cuerpo → `h2`, para que la página tenga un solo `h1`.
- `safeImage(url)`: sólo pasa
  `https://kqibgbvdgxrjhdyfoxvm.supabase.co/storage/v1/object/public/restaurant-assets/…`,
  que es el `remotePattern` de `next.config.ts`. Cualquier otro host o ruta
  relativa (las de Yava apuntan a su propio `public/`) → `null`: la nota queda
  sin foto, no se cae.
- **Minutos de lectura y extracto de respaldo:** salen del texto del HTML y,
  si no hay, del markdown. 230 palabras por minuto, mínimo 1.
- `faqNodes(jsonLd)`: sólo los `FAQPage`, recorriendo `@graph`, cada uno con
  su `@context`.
- **Cuerpo sin `contentHtml`:** mientras el dashboard no lo mande siempre, se
  imprime el markdown como párrafos de texto escapado. Sin librería nueva: los
  dos feeds reales de hoy ya traen `contentHtml`.

Tipo de salida:

```ts
export interface Post {
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly image: string | null;
  readonly imageAlt: string;
  readonly publishedAt: string;  // YYYY-MM-DD o ''
  readonly modifiedAt: string;   // ISO o ''
  readonly readMinutes: number;
  readonly featured: boolean;
}
export interface PostFull extends Post {
  readonly html: string;
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly ogImage: string | null;
  readonly canonicalPath: string; // `/blog/<slug>`, o el del dashboard si es del dominio propio
  readonly faqJsonLd: readonly unknown[];
}
```

### `src/lib/blog.ts`: el fetch

- `import 'server-only'`, una sola lectura envuelta en `cache()` de React
  para que metadata, página y sitemap compartan el mismo pedido.
- `getPosts(): Promise<readonly Post[]>`, `getPost(slug): Promise<PostFull | null>`,
  `getPostSlugs()`.
- **Si el feed falla:**
  - `getPosts()` para el listado devuelve `[]` y registra el error → estado
    vacío. Es la convención de Rooftop: la base nunca tumba una página.
  - `getPost(slug)` **tira** → 500. Un 404 le diría a Google que borre una
    URL indexada por una caída de diez minutos.
- `generateStaticParams` con los slugs y `dynamicParams` en `true`: una nota
  cargada después del build se genera en el primer pedido.

⚠️ Como el resto de `restoexp.ts`, el caché vive en `.next/cache/fetch-cache`:
para ver una nota recién cargada en dev hay que borrar esa carpeta. Ver la
memoria de la base de datos.

---

## 4. Listado `/blog`

> ⚠️ Superficies y cards cambiaron en la primera revisión: ver §10.

| # | Sección | Componente | Superficie |
|---|---|---|---|
| 1 | Hero | `PlateHero` con pregunta, `title` + `titleAccent`, foto de la terraza, migas | foto + placa `bone` |
| 2 | Nota destacada | `FeaturedPost` (nuevo) | blanco |
| 3 | Resto de las notas | `PostGrid` + `PostCard` (nuevos) | blanco |
| 2′ | Estado vacío, en lugar de 2 y 3 | `BlogEmpty` (nuevo) | `bone` |
| 4 | Cierre | `FindUs`, el cierre de las internas desde el 2026-09-22 | `bone` con su arco |

- **Hero:** h1 «Stories from the» + acento «Rooftop» (entra en `PAGE_SEO['/blog']`
  y lo controla `check:seo`). La placa lleva sus esquinas inversas como en las
  otras internas.
- **Nota destacada:** la que tenga `featured`, o si no la primera del feed.
  Desktop: foto 3:2 a la izquierda (7 de 12 columnas), texto a la derecha con
  eyebrow «fecha · N min read», título en display `h2`, extracto y link
  «Read the story». Tablet y mobile: se apila, foto arriba.
- **Grilla:** 1 columna en mobile, 2 desde 640px, 3 desde 1024px.
  - `PostCard`: foto 3:2 con `rounded-card`, eyebrow con la fecha, título con
    `role="card"` (Jost, caja mixta: la condensada no baja de 24px), extracto
    cortado a 3 líneas.
  - Toda la card es clickeable con **un solo** link (el del título, estirado
    con `::after`). Hover igual al de `Card`: −2px, foto ×1.03, título a `deep`.
  - Sin portada: bloque `bone` con el monograma, nunca `PhotoPending` (no es
    una foto que falte, es una nota sin foto).
- **Estado vacío:** titular «Stories are on their way», una bajada y un CTA de
  una sola línea a What's On.

## 5. Nota `/blog/[slug]`

> ⚠️ Migas, portada, cierre y "More stories" cambiaron en la primera revisión: ver §10.

De arriba a abajo, todo en `caja`:

1. **Cabecera sobre blanco**, ancho de lectura:
   - migas Home / Blog / título;
   - eyebrow «September 8, 2026 · 6 min read» (fecha en UTC, sin corrimiento);
   - `h1` monocromo, `text-h2` fluido, display caja alta;
   - el extracto como bajada, separado con `gap-bajada`.
2. **Portada**: más ancha que el texto (hasta 1280), **rectangular**, 16:9 en
   desktop y tablet, 4:3 en mobile, `rounded-image`, `priority`, `sizes`
   declarado, alt del dashboard. Sin placa, sin esquinas inversas, sin
   recorte. Si la nota no tiene portada, no se dibuja nada.
3. **Cuerpo** en `.prose-post` (nueva, en `globals.css`, basada en
   `.prose-legal`):
   - `max-width` ~68ch, Jost 18px/1.75 desde tablet, 17px en mobile;
   - **interpárrafo 12px** (regla del sitio: menor que titular→bajada);
   - `h2` display `d4` caja alta, `h3` Jost 600;
   - links `link-texto` en `deep`; marcadores de lista en `sunset-deep`;
   - citas con filete `sunset` a la izquierda;
   - imágenes y `figure` al 100%, `rounded-image`, `figcaption` en `caption`;
   - bloques del editor (FAQ, callout, embed), portados de `.post` de Yava;
   - `text-align: left`, nunca justificado.
4. **Cierre de la nota:** link «Back to all stories» y, si hay otras notas,
   «More stories» con hasta 3 `PostCard` (las más nuevas, sin la actual).
5. **`FindUs`**, el mismo cierre del listado.
6. **Slug que no existe** → `notFound()`, que usa el `not-found.tsx` del sitio.

---

## 6. SEO, nav y sitemap

- `generateMetadata` por nota, extendiendo `pageMeta` con `type: 'article'`,
  `publishedTime` y `modifiedTime`. Título `ogTitle || title`, descripción
  `ogDescription || excerpt`, imagen `ogImage || portada || la del sitio`,
  canonical propio salvo que el del dashboard sea de nuestro dominio.
- JSON-LD: `BlogPosting` (con imagen absoluta, `datePublished`,
  `dateModified`, autor y publisher Rooftop) + `BreadcrumbList` + FAQ.
  Escapado con el `jsonLdScript()` de `lib/seo.ts`.
- `/blog` en `PAGE_SEO`, en `ALL_ROUTES` y en el sitemap; cada nota suma su
  URL con `lastModified`.
- Nav: «Blog» en el grupo «Get to know us» del mega-menú, con hint; y en los
  links rápidos del footer.

## 7. Motion y accesibilidad

- `Reveal` y stagger de `Motion` en la grilla; nada en la cabecera de la nota
  (el `h1` y la portada son el LCP). Con reduced motion el layout es idéntico.
- Un solo `h1` por página, jerarquía `h2` en el cuerpo.
- Contraste: eyebrows en `muted` sobre blanco y sobre `bone`, a verificar con
  `npm run contrast`.
- CTAs de una línea en todos los anchos.

## 8. Verificación

1. Tests de `blog-format.ts` con `node --test --experimental-strip-types`:
   guiones medios en texto y no en atributos, `h1`→`h2`, host de portada,
   extracto y minutos desde HTML, FAQ con `@context`.
2. Dev con `BLOG_RESTAURANT_ID` de Santa Maria (2 notas reales) para ver
   listado, destacada, grilla y nota; y sin override para ver el estado vacío
   de Rooftop.
3. Capturas a 1440, 1024, 768 y 390.
4. `npm run check:seo`, `check:surfaces`, `contrast`, `build`.

## 9. Pendientes que no bloquean

- Rooftop no tiene notas: el contenido se carga en el dashboard.
- Foto del hero del listado: se usa una de la terraza que ya está en el sitio.

---

## 10. Primera revisión sobre capturas (mismo día)

Camila miró las dos páginas corriendo, en los dos estados, y pidió:

- «agregá olas para el cambio de fondos, así no queda tan básico»
- «que la nota destacada esté en una card; las cards hacelas como las de
  nuestro proyecto, con línea punteada»
- sobre la nota, tachando las migas y marcando un recuadro del ancho del
  texto sobre la foto: «el título, contenido y todo lo previo a la imagen
  centrado, y la imagen más chica, con máximo el ancho del texto. Además no
  pongamos al final el bloque que muestra otras notas»

Cómo quedó construido. Esto manda sobre §4 y §5:

| | Antes | Ahora |
|---|---|---|
| Listado, superficies | hero `bone` · notas `paper` · `FindUs` | hero `bone` · **`SoftWave` bone→mint** · notas en **`mint`** · `FindUs` con su arco |
| Estado vacío | banda `paper` suelta | la misma losa troquelada, sobre la banda menta |
| Nota destacada | foto y texto sueltos | **losa troquelada de `EventTypes`**: papel, `sombra-card`, filete punteado `inset-3.5` `border-deep/35`, foto metida con el padding del texto (`p-7 lg:p-12`) |
| `PostCard` | card de `shared/Card` con `ring-fog` | la misma losa en chico: `rounded-door`, filete a 10px, foto `rounded-ticket` con margen |
| Nota, cabecera | alineada a la izquierda, con migas | **centrada, sin migas visibles** (el `BreadcrumbList` del schema se queda) |
| Nota, portada | 16:9 hasta 1280px | **3:2, con el ancho del texto** (`MEDIDA`, 42rem, el mismo `max-width` de `.prose-post`) |
| Nota, pie | «More stories» con 3 cards | **sin otras notas**: «Back to all stories» y `FindUs` |

Otras cosas que cambiaron al construir:

- **`.prose-post` vive en `src/app/blog/prose-post.css`**, importado por la
  nota, y no en `globals.css`: otra sesión estaba editando `globals.css` al
  mismo tiempo.
- **El OG de artículo se arma en la página**, sobre lo que devuelve `pageMeta`,
  sin tocar `seo.ts`, por el mismo motivo.
- **«Blog» va en `LINKS_CONOCERNOS` de `Footer.tsx`**. `FOOTER_QUICK_LINKS` de
  `nav.ts` no la usa nadie.
- **Tests:** `node --import ./scripts/test-hooks.mjs --test "src/**/*.test.ts"`
  (27). No hay script en `package.json` porque lo estaba editando la otra
  sesión.
