/**
 * The toggle script reads its two durations out of `tokens.css` so the numbers live in one
 * place. That is only safe if it respects the unit, and this test exists because it did not:
 * `--duration-flash` is authored as `1600ms`, the CSS minifier ships it as `1.6s`, and a bare
 * `parseFloat` turned a 1.6 second frame into a 1.6 millisecond one. The "Flash out!" frame
 * was hidden again on the next tick, and the 500ms theme fade was cancelled after 0.5ms — the
 * feature was inert in production while looking correct in the source.
 *
 * The reader is inline in an `.astro` file (it has to be: it runs before first paint), so it
 * is lifted out by pattern and evaluated against a stub. If it moves or is renamed this test
 * fails loudly, which is the intended behaviour — it is a canary, not an abstraction.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync('src/layouts/BaseLayout.astro', 'utf8');
const reader = /const ms = \(name, fallback\) => \{[\s\S]*?\n {8}\};/.exec(source)?.[0];

/** Rebuild the reader with `getComputedStyle` stubbed to return one value. */
const readerFor = (value) =>
  new Function(
    'getComputedStyle',
    'root',
    `${reader}\nreturn ms;`,
  )(() => ({ getPropertyValue: () => value }), {});

test('the duration reader is still where this test can find it', () => {
  assert.ok(reader, 'const ms = (name, fallback) => {…} is gone from BaseLayout.astro');
});

test('a CSS time is read in milliseconds whichever unit it ships in', () => {
  assert.equal(readerFor('1600ms')('--duration-flash', 0), 1600, 'authored form');
  assert.equal(readerFor('1.6s')('--duration-flash', 0), 1600, 'minified form — the bug');
  assert.equal(readerFor('500ms')('--duration-theme', 0), 500);
  assert.equal(readerFor('.5s')('--duration-theme', 0), 500, 'minified form — the bug');
  assert.equal(readerFor(' 0.25s ')('--x', 0), 250, 'whitespace and a leading zero');
});

test('a missing or unreadable token falls back instead of disabling the feature', () => {
  assert.equal(readerFor('')('--nope', 1600), 1600);
  assert.equal(readerFor('inherit')('--nope', 500), 500);
});

test('both durations are declared as tokens, so the reader has something to read', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf8');
  for (const name of ['--duration-theme', '--duration-flash']) {
    assert.match(tokens, new RegExp(`${name}:\\s*[\\d.]+m?s\\s*;`), `${name} is not a CSS time`);
  }
});
