import Image from 'next/image';
import Link from 'next/link';
import { Heading } from '@/components/shared/Type';
import { postMeta, type Post } from '@/lib/blog-format';

/**
 * La card de una nota: la losa troquelada de `EventTypes` en chico. Papel,
 * `sombra-card`, filete punteado de punta a punta y la foto metida hacia
 * adentro con margen, que es lo que deja al troquel correr siempre sobre papel.
 *
 * ⚠️ EL TROQUEL VA A 10px Y NO A 14. En una losa de 400px de ancho los 14 de
 * `EventTypes` se comían el aire de la foto; 10 dejan el filete a mitad de
 * camino entre el borde y los 20px de padding.
 *
 * ⚠️ UN SOLO LINK, el del título, estirado sobre toda la card con `::after`.
 * Sin «Read more»: un segundo link al mismo destino es ruido para un lector de
 * pantalla. El gesto de hover es el de `shared/Card`.
 *
 * ⚠️ SIN PORTADA NO VA `PhotoPending`. No es una foto que falte en el sitio,
 * es una nota que el dashboard publicó sin foto: va un bloque `bone` con la
 * marca, que se lee como parte del diseño y no como un pendiente.
 */
export default function PostCard({
  post,
  headingLevel = 3,
}: {
  readonly post: Post;
  readonly headingLevel?: 2 | 3;
}) {
  return (
    <article className="group relative flex h-full flex-col rounded-door bg-paper sombra-card transition-[transform,box-shadow] duration-200 ease-brand hover:-translate-y-0.5 hover:shadow-float">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 z-10 rounded-door border border-dashed border-deep/35"
      />
      <div className="p-5 pb-0">
        <div className="relative aspect-3/2 overflow-hidden rounded-ticket bg-fog">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.imageAlt}
              fill
              sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 100vw"
              className="object-cover transition-transform duration-500 ease-brand group-hover:scale-104"
            />
          ) : (
            <div
              aria-hidden="true"
              className="grano flex h-full items-center justify-center bg-bone font-display text-d5 font-semibold uppercase text-deep/35"
            >
              Rooftop
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5 pt-4 pb-6">
        <p className="eyebrow m-0 text-deep">{postMeta(post)}</p>
        <Heading
          level={headingLevel}
          role="card"
          className="mt-1.5 transition-colors duration-200 group-hover:text-deep"
        >
          <Link
            href={`/blog/${post.slug}`}
            className="after:absolute after:inset-0 after:z-20 after:rounded-door after:content-['']"
          >
            {post.title}
          </Link>
        </Heading>
        {post.excerpt ? (
          <p className="mt-2 mb-0 line-clamp-3 text-base text-body/75">{post.excerpt}</p>
        ) : null}
      </div>
    </article>
  );
}
