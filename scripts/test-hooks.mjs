import { registerHooks } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

/**
 * Sólo para los tests con `node --test`. Next resuelve `./restoexp` y `@/lib/x`
 * solo; Node no. Este hook le enseña las dos cosas: el alias `@/` apunta a
 * `src/`, y un import relativo sin extensión prueba con `.ts`.
 *
 *   node --import ./scripts/test-hooks.mjs --test "src/**\/*.test.ts"
 */
const SRC = pathToFileURL(path.resolve('src') + path.sep).href;

registerHooks({
  resolve(specifier, context, nextResolve) {
    const spec = specifier.startsWith('@/') ? SRC + specifier.slice(2) : specifier;
    try {
      return nextResolve(spec, context);
    } catch (error) {
      if (/^(\.|file:)/.test(spec) && !/\.[cm]?[jt]sx?$/.test(spec)) {
        return nextResolve(`${spec}.ts`, context);
      }
      throw error;
    }
  },
});
