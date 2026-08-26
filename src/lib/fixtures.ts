/**
 * Development fixtures switch.
 *
 * `ESD_FIXTURES=1 npm run dev` (or `npm run dev:fixtures`) points every content
 * collection at src/content-fixtures/ instead of src/content/ + src/data/. The
 * fixture set exists only to exercise layouts; it is never part of the deployed site
 * (`npm run build` ignores it and `npm run verify` fails if a fixture marker leaks).
 */
export const FIXTURES_ENABLED = process.env.ESD_FIXTURES === '1';

/** Directory holding people/, research/, projects/, news/ Markdown files. */
export const CONTENT_ROOT = FIXTURES_ENABLED ? './src/content-fixtures' : './src/content';

/** Directory holding publications.bib and publications.overrides.yaml. */
export const DATA_ROOT = FIXTURES_ENABLED ? './src/content-fixtures' : './src/data';

/** Marker string present in every fixture record; must never appear in a production build. */
export const FIXTURE_MARKER = 'DEV-FIXTURE';
