/**
 * `glob()` loader that forgets everything when the content root changes.
 *
 * Astro keeps collection entries in a persistent data store between builds. The
 * built-in glob loader only removes entries whose files disappeared *inside its own
 * base directory*, so switching between src/content/ and src/content-fixtures/
 * (ESD_FIXTURES=1) would otherwise leave sample records in a production build.
 * This wrapper records the base directory in the loader's persistent `meta` store
 * and clears the collection whenever it differs from the previous run.
 */
import { glob } from 'astro/loaders';
import type { Loader } from 'astro/loaders';

type GlobOptions = Parameters<typeof glob>[0];

export function rootAwareGlob(options: GlobOptions & { base: string }): Loader {
  const inner = glob(options);
  return {
    name: 'esd-root-aware-glob',
    async load(context) {
      const previous = context.meta.get('esd:base');
      if (previous !== options.base) {
        if (previous !== undefined) {
          context.logger.info(`Content root changed (${previous} → ${options.base}); clearing cached entries.`);
        }
        context.store.clear();
        context.meta.set('esd:base', options.base);
      }
      await inner.load(context);
    },
  };
}
