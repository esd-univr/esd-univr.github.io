import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isLegacyCompatPath, isLegacyCompatUrl, isLegacyId, legacyTargets } from '../src/lib/legacy.ts';

test('recognises legacy compatibility paths only', () => {
  for (const p of ['/profile/12/', '/profile/12', '/area/9/', '/project/2/', '/news/31/', '/news-list/', '/news-list', '/areas/']) {
    assert.equal(isLegacyCompatPath(p), true, p);
  }
  for (const p of ['/', '/people/', '/people/franco-fummi/', '/projects/', '/projects/defacto/', '/news/', '/news/2024-01-15-dac-paper/', '/research/', '/publications/']) {
    assert.equal(isLegacyCompatPath(p), false, p);
  }
  assert.equal(isLegacyCompatUrl('https://esd-univr.github.io/profile/12/'), true);
  assert.equal(isLegacyCompatUrl('https://esd-univr.github.io/people/x/'), false);
  assert.equal(isLegacyId('12'), true);
  assert.equal(isLegacyId('2024-01-15-x'), false);
});

test('legacyTargets maps ids and rejects duplicates', () => {
  const entries = [
    { id: 'a', data: { legacyId: 1, name: 'A' } },
    { id: 'b', data: {} },
    { id: 'c', data: { legacyId: 3, name: 'C' } },
  ];
  const targets = legacyTargets(entries, (e) => `/people/${e.id}/`, (e) => e.data.name ?? e.id);
  assert.deepEqual(targets, [
    { legacyId: '1', to: '/people/a/', title: 'A' },
    { legacyId: '3', to: '/people/c/', title: 'C' },
  ]);
  assert.throws(() => legacyTargets([...entries, { id: 'd', data: { legacyId: 1 } }], (e) => e.id, (e) => e.id), /legacyId 1 is used by both/);
});
