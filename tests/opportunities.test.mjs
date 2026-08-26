/**
 * Student opportunities: the ordering and filter helpers, and the invariants every
 * published proposal must satisfy. The content tests pass vacuously while the
 * collection is empty, and start biting the moment a proposal is added.
 *
 * The cross-cutting invariants (slug file names, known groups, unique legacy ids, no
 * contact details, resolvable supervisors and areas) live in content.test.mjs, which
 * applies them to every collection.
 */
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import {
  buildFilters,
  compareOpportunities,
  filterAttributes,
  kindLine,
  OPPORTUNITY_ACTIVITIES,
  OPPORTUNITY_LEVELS,
  OPPORTUNITY_STATUSES,
  OPPORTUNITY_TYPES,
  token,
  WORKLOAD_INTENSITIES,
  workloadLine,
} from '../src/lib/opportunities.ts';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIR = path.join(ROOT, 'src/content/opportunities');
const GROUPS = [
  { id: 'esd', label: 'Electronic Systems Design' },
  { id: 'parco', label: 'PARCO Lab' },
  { id: 'iot4care', label: 'Internet of Things 4 Care' },
];

const opportunity = (id, data) => ({
  id,
  data: {
    title: id,
    type: 'thesis',
    levels: ['master'],
    status: 'open',
    posted: new Date('2026-01-01'),
    groups: ['esd'],
    activities: ['Modelling'],
    ...data,
  },
});

/** Published proposals, parsed straight from disk. Empty while none are published. */
function published() {
  return readdirSync(DIR)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .map((file) => {
      const src = readFileSync(path.join(DIR, file), 'utf8');
      const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(src);
      assert.ok(m, `opportunities/${file}: missing frontmatter`);
      return { file, slug: file.slice(0, -3), data: YAML.parse(m[1]), body: m[2] };
    });
}
const all = published();
const label = (e) => `opportunities/${e.file}`;

// --- Vocabularies -------------------------------------------------------------

test('every vocabulary value is distinct and yields a distinct filter token', () => {
  for (const [name, values] of Object.entries({
    OPPORTUNITY_TYPES,
    OPPORTUNITY_LEVELS,
    OPPORTUNITY_STATUSES,
    WORKLOAD_INTENSITIES,
    OPPORTUNITY_ACTIVITIES,
  })) {
    assert.equal(new Set(values).size, values.length, `${name} repeats a value`);
    const tokens = values.map(token);
    assert.equal(new Set(tokens).size, tokens.length, `${name} produces two identical filter tokens`);
    for (const t of tokens) assert.match(t, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `${name}: "${t}" is not a usable token`);
  }
});

// --- Ordering and labels ------------------------------------------------------

test('opportunities sort open first, then newest, then by title', () => {
  const list = [
    opportunity('closed-recent', { status: 'closed', posted: new Date('2026-06-01') }),
    opportunity('open-old', { posted: new Date('2026-01-01') }),
    opportunity('paused', { status: 'paused', posted: new Date('2026-07-01') }),
    opportunity('open-new', { posted: new Date('2026-05-01') }),
  ];
  assert.deepEqual(list.sort(compareOpportunities).map((o) => o.id), ['open-new', 'open-old', 'paused', 'closed-recent']);
});

test('same status and date fall back to the title', () => {
  const list = [opportunity('Beta'), opportunity('Alpha')];
  assert.deepEqual(list.sort(compareOpportunities).map((o) => o.id), ['Alpha', 'Beta']);
});

test('kindLine joins the levels with the type', () => {
  assert.equal(kindLine('thesis', ['master']), "Master's thesis");
  assert.equal(kindLine('project', ['bachelor', 'master']), "Bachelor's / Master's project");
  assert.equal(kindLine('internship', ['bachelor']), "Bachelor's internship");
});

test('workloadLine keeps the duration human and the intensity controlled', () => {
  assert.equal(workloadLine({ duration: '4–6 months', intensity: 'substantial' }), '4–6 months · substantial');
});

test('token lower-cases and hyphenates a vocabulary value', () => {
  assert.equal(token('Formal Verification'), 'formal-verification');
  assert.equal(token('IoT4Care'), 'iot4care');
});

// --- Filter metadata ----------------------------------------------------------

test('filterAttributes exposes every field the client-side filter reads', () => {
  const attributes = filterAttributes(
    opportunity('digital-twin', {
      levels: ['bachelor', 'master'],
      groups: ['esd', 'iot4care'],
      activities: ['Software Development', 'Formal Verification'],
    }),
  );
  assert.deepEqual(attributes, {
    'data-opp': 'digital-twin',
    'data-status': 'open',
    'data-type': 'thesis',
    'data-levels': 'bachelor master',
    'data-groups': 'esd iot4care',
    'data-activities': 'software-development formal-verification',
  });
});

test('filter tokens are whole words, so one value never matches another', () => {
  const attributes = filterAttributes(opportunity('x', { activities: ['Machine Learning', 'Modelling'] }));
  const tokens = attributes['data-activities'].split(' ');
  assert.ok(tokens.includes('modelling'));
  assert.ok(!tokens.includes('model'));
});

test('buildFilters only offers values that occur, in vocabulary order', () => {
  const entries = [
    opportunity('a', { type: 'thesis', levels: ['master'], groups: ['esd'], activities: ['Modelling'] }),
    opportunity('b', { type: 'internship', levels: ['bachelor'], groups: ['parco'], activities: ['Benchmarking'] }),
  ];
  const filters = buildFilters(entries, GROUPS);
  const byKey = Object.fromEntries(filters.map((f) => [f.key, f.options.map((o) => o.value)]));
  assert.deepEqual(byKey.levels, ['bachelor', 'master']);
  assert.deepEqual(byKey.type, ['thesis', 'internship'], 'types keep vocabulary order, not appearance order');
  assert.deepEqual(byKey.groups, ['esd', 'parco'], 'iot4care has no proposal and is not offered');
  assert.deepEqual(byKey.activities, ['modelling', 'benchmarking']);
});

test('a filter with a single option is dropped, and an empty set yields no filters', () => {
  const same = [opportunity('a'), opportunity('b')];
  assert.deepEqual(buildFilters(same, GROUPS), [], 'every value is identical, so nothing is worth filtering');
  assert.deepEqual(buildFilters([], GROUPS), []);
});

// --- Published content --------------------------------------------------------

test('controlled fields only use supported values', () => {
  for (const e of all) {
    assert.ok(OPPORTUNITY_TYPES.includes(e.data.type), `${label(e)}: unknown type "${e.data.type}"`);
    assert.ok(OPPORTUNITY_STATUSES.includes(e.data.status), `${label(e)}: unknown status "${e.data.status}"`);
    assert.ok(Array.isArray(e.data.levels) && e.data.levels.length > 0, `${label(e)}: levels is required`);
    for (const level of e.data.levels) {
      assert.ok(OPPORTUNITY_LEVELS.includes(level), `${label(e)}: unknown level "${level}"`);
    }
    assert.ok(Array.isArray(e.data.activities) && e.data.activities.length > 0, `${label(e)}: activities is required`);
    for (const activity of e.data.activities) {
      assert.ok(OPPORTUNITY_ACTIVITIES.includes(activity), `${label(e)}: unknown activity "${activity}"`);
    }
    if (e.data.language !== undefined) {
      assert.ok(['en', 'it'].includes(e.data.language), `${label(e)}: unknown language "${e.data.language}"`);
    }
  }
});

test('workload is a duration and a controlled intensity', () => {
  for (const e of all) {
    const workload = e.data.workload;
    assert.ok(workload && typeof workload === 'object', `${label(e)}: workload is required`);
    assert.equal(typeof workload.duration, 'string', `${label(e)}: workload.duration must be text`);
    assert.ok(workload.duration.trim().length > 0, `${label(e)}: workload.duration must not be empty`);
    assert.ok(
      WORKLOAD_INTENSITIES.includes(workload.intensity),
      `${label(e)}: unknown workload.intensity "${workload.intensity}"`,
    );
    if (e.data.credits !== undefined) {
      assert.ok(Number.isInteger(e.data.credits) && e.data.credits > 0, `${label(e)}: credits must be a positive integer`);
    }
  }
});

test('title, summary, supervisors, areas and posted are present and usable', () => {
  for (const e of all) {
    for (const field of ['title', 'summary']) {
      assert.equal(typeof e.data[field], 'string', `${label(e)}: ${field} is required`);
      assert.ok(e.data[field].trim().length > 0, `${label(e)}: ${field} must not be empty`);
    }
    for (const field of ['supervisors', 'areas']) {
      assert.ok(Array.isArray(e.data[field]) && e.data[field].length > 0, `${label(e)}: ${field} needs at least one entry`);
    }
    const posted = e.data.posted;
    const date = posted instanceof Date ? posted : new Date(posted);
    assert.ok(!Number.isNaN(date.getTime()), `${label(e)}: posted "${posted}" is not a date`);
  }
});

test('only an open opportunity may be featured', () => {
  for (const e of all) {
    if (e.data.featured) assert.equal(e.data.status, 'open', `${label(e)}: a ${e.data.status} proposal must not be featured`);
  }
});

test('slugs are not numeric, so they can never collide with a legacy address', () => {
  for (const e of all) assert.doesNotMatch(e.slug, /^\d+$/, `${label(e)}: numeric slugs are reserved for legacy ids`);
});
