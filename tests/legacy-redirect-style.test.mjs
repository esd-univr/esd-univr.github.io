import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('../src/layouts/LegacyRedirect.astro', import.meta.url), 'utf8');
const style = /<style>([\s\S]*?)<\/style>/.exec(source)?.[1] ?? '';

test('legacy redirect styles stay scoped to the legacy page body', () => {
  assert.match(source, /<body class="legacy-redirect-page">/);
  assert.doesNotMatch(style, /(^|[}\s])body\s*\{/m, 'unqualified body CSS leaks into normal news pages when LegacyRedirect is imported');
  assert.doesNotMatch(style, /(^|[}\s]):root\s*\{/m, 'unqualified root CSS leaks into normal news pages when LegacyRedirect is imported');
});
