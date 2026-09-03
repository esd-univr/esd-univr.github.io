/**
 * `LegacyRedirect.astro` is a standalone page with no stylesheet — it inlines six palette
 * values because it cannot read `tokens.css`. Its own comment asks whoever repalettes the
 * site to keep them in step by hand, which is the kind of instruction that gets missed: the
 * page is a redirect nobody looks at, and a stale value there means a legacy URL flashes the
 * old theme on the way to the new one.
 *
 * This asserts the six are still the tokens they claim to be. It deliberately does not check
 * *where* they appear — the redirect is free to lay itself out however it likes.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const tokens = readFileSync('src/styles/tokens.css', 'utf8');
const redirect = readFileSync('src/layouts/LegacyRedirect.astro', 'utf8');
const style = /<style>([\s\S]*?)<\/style>/.exec(redirect)?.[1] ?? '';

const token = (name) => {
  const found = new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{3,8})\\s*;`).exec(tokens);
  assert.ok(found, `--${name} is not a hex value in tokens.css`);
  return found[1].toLowerCase();
};

test('the redirect page inlines the real palette values', () => {
  assert.ok(style.length > 0, 'no <style> block found in LegacyRedirect.astro');
  for (const name of [
    'light-ink',
    'light-paper',
    'light-accent-strong',
    'dark-ink',
    'dark-paper',
    'dark-accent-strong',
  ]) {
    const value = token(name);
    assert.ok(
      style.toLowerCase().includes(value),
      `LegacyRedirect.astro no longer carries --${name} (${value}) — repalette it in step`,
    );
  }
});
