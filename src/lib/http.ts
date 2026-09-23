export async function fetchConTimeout(
  url: string,
  init: RequestInit = {},
  { ms = 5000, reintentos = 1 }: { ms?: number; reintentos?: number } = {},
): Promise<Response> {
  const metodo = (init.method ?? 'GET').toUpperCase();
  const intentos = metodo === 'GET' ? reintentos + 1 : 1;
  let ultimoError: unknown = new Error(`fetch sin intentos: ${url}`);
  for (let i = 0; i < intentos; i += 1) {
    try {
      const res = await fetch(url, { ...init, signal: AbortSignal.timeout(ms) });
      if (res.status >= 500 && i < intentos - 1) {
        try {
          await res.body?.cancel();
        } catch {
        }
        continue;
      }
      return res;
    } catch (error) {
      ultimoError = error;
    }
  }
  throw ultimoError;
}

export function conTimeout<T>(promesa: Promise<T>, ms: number): Promise<T> {
  let reloj: ReturnType<typeof setTimeout> | undefined;
  const limite = new Promise<never>((_, rechazar) => {
    reloj = setTimeout(() => rechazar(new Error(`timeout de ${ms} ms`)), ms);
  });
  return Promise.race([promesa, limite]).finally(() => clearTimeout(reloj));
}
