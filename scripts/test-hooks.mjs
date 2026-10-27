import { registerHooks } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

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
