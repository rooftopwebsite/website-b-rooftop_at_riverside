export async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
  { ms = 5000, retries = 1 }: { ms?: number; retries?: number } = {},
): Promise<Response> {
  const method = (init.method ?? 'GET').toUpperCase();
  const attempts = method === 'GET' ? retries + 1 : 1;
  let lastError: unknown = new Error(`fetch with no attempts: ${url}`);
  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(url, { ...init, signal: AbortSignal.timeout(ms) });
      if (res.status >= 500 && i < attempts - 1) {
        try {
          await res.body?.cancel();
        } catch {
        }
        continue;
      }
      return res;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let clock: ReturnType<typeof setTimeout> | undefined;
  const limit = new Promise<never>((_, reject) => {
    clock = setTimeout(() => reject(new Error(`timeout de ${ms} ms`)), ms);
  });
  return Promise.race([promise, limit]).finally(() => clearTimeout(clock));
}
