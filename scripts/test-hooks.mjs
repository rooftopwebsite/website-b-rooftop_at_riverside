import { registerHooks } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

/**
 * Only for the tests run with `node --test`. Next resolves `./restoexp` and `@/lib/x`
 * on its own; Node doesn't. This hook teaches it both things: the `@/` alias points to
 * `src/`, and a relative import without an extension tries `.ts`.
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
