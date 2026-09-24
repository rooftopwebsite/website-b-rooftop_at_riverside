import { SentPanel } from '@/components/form/Fields';
import { Eyebrow, Heading } from '@/components/shared/Type';

export function Exito({
  eyebrow,
  titulo,
  children,
}: {
  readonly eyebrow: string;
  readonly titulo: string;
  readonly children: React.ReactNode;
}) {
  return (
    <SentPanel className="rounded-card border border-ink/15 bg-cream sombra-card p-[28px] lg:p-[36px]">
      <Eyebrow tone="deep">{eyebrow}</Eyebrow>
      <Heading level={3} className="mt-gap-kicker text-d5 lg:text-d4">
        {titulo}
      </Heading>
      <p className="mt-gap-bajada max-w-[52ch] text-lead text-body/80">{children}</p>
    </SentPanel>
  );
}

export function Bloque({ children }: { readonly children: React.ReactNode }) {
  return (
    <p
      aria-hidden="true"
      className="mt-[12px] border-t border-ink/15 pt-[24px] font-body text-caption font-bold uppercase tracking-[0.12em] text-body/70"
    >
      {children}
    </p>
  );
}
