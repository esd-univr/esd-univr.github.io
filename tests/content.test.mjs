/**
 * Invariants of the published content: file names, unique legacy ids, resolvable
 * cross-references and images, no contact details beyond the sanctioned `email`
 * field, and a well-formed bibliography.
 */
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import { parseBibtex } from '../src/lib/bibtex.ts';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CONTENT = path.join(ROOT, 'src/content');
const DATA = path.join(ROOT, 'src/data');
const COLLECTIONS = ['people', 'projects', 'news'];
const EMAIL = /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/;
// Italian landline/mobile shapes, with or without the +39 prefix; not inside DOIs or URLs.
const PHONE = /(?<![\w./-])(?:\+\d{2}\s?)?\(?0\d{1,3}\)?[\s.-]?\d{6,8}(?![\w./-])/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const readYaml = (name) => YAML.parse(readFileSync(path.join(DATA, name), 'utf8'));
const groups = readYaml('groups.yaml');
const research = readYaml('research.yaml');
const groupIds = new Set(groups.map((g) => g.id));

function entries(collection) {
  const dir = path.join(CONTENT, collection);
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .map((file) => {
      const src = readFileSync(path.join(dir, file), 'utf8');
      const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(src);
      assert.ok(m, `${collection}/${file}: missing frontmatter`);
      return { collection, file, slug: file.slice(0, -3), data: YAML.parse(m[1]), body: m[2], dir };
    });
}
const all = Object.fromEntries(COLLECTIONS.map((c) => [c, entries(c)]));
const slugs = Object.fromEntries(COLLECTIONS.map((c) => [c, new Set(all[c].map((e) => e.slug))]));
const label = (e) => `${e.collection}/${e.file}`;

test('groups.yaml: unique ids and orders, no missing fields', () => {
  const seenOrder = new Set();
  for (const g of groups) {
    assert.match(g.id, SLUG, `group id ${g.id}`);
    for (const field of ['name', 'shortName', 'summary']) assert.ok(g[field], `group ${g.id}: ${field} is required`);
    assert.ok(Number.isInteger(g.order), `group ${g.id}: order must be an integer`);
    assert.ok(!seenOrder.has(g.order), `group ${g.id}: order ${g.order} is used twice`);
    seenOrder.add(g.order);
  }
  assert.equal(groupIds.size, groups.length, 'duplicate group id');
});

test('research.yaml: unique ids, known groups, no empty topics', () => {
  const ids = new Set();
  for (const t of research) {
    assert.match(t.id, SLUG, `topic id ${t.id}`);
    assert.ok(!ids.has(t.id), `duplicate topic id ${t.id}`);
    ids.add(t.id);
    assert.ok(t.name && t.summary, `topic ${t.id}: name and summary are required`);
    assert.ok(Array.isArray(t.groups) && t.groups.length > 0, `topic ${t.id}: groups is required`);
    for (const g of t.groups) assert.ok(groupIds.has(g), `topic ${t.id}: unknown group "${g}"`);
  }
});

test('every group has at least one research topic', () => {
  for (const g of groups) {
    assert.ok(research.some((t) => t.groups.includes(g.id)), `group ${g.id} has no research topic`);
  }
});

test('file names are lower-case slugs and news files start with their date', () => {
  for (const c of COLLECTIONS) {
    for (const e of all[c]) {
      assert.match(e.slug, SLUG, label(e));
      if (c === 'news') {
        const date = String(e.data.date instanceof Date ? e.data.date.toISOString() : e.data.date).slice(0, 10);
        assert.ok(e.slug.startsWith(`${date}-`), `${label(e)}: file name must start with ${date}-`);
        assert.doesNotMatch(e.slug, /^\d+$/, `${label(e)}: purely numeric slugs are reserved for legacy ids`);
      }
    }
  }
});

test('every record belongs to at least one known group', () => {
  for (const c of COLLECTIONS) {
    for (const e of all[c]) {
      assert.ok(Array.isArray(e.data.groups) && e.data.groups.length > 0, `${label(e)}: groups is required`);
      for (const g of e.data.groups) assert.ok(groupIds.has(g), `${label(e)}: unknown group "${g}"`);
    }
  }
});

test('legacyId values are positive integers, unique within a collection', () => {
  for (const c of COLLECTIONS) {
    const seen = new Map();
    for (const e of all[c]) {
      const id = e.data.legacyId;
      if (id === undefined) continue;
      assert.ok(Number.isInteger(id) && id > 0, `${label(e)}: legacyId ${id}`);
      assert.ok(!seen.has(id), `${label(e)}: legacyId ${id} already used by ${seen.get(id)}`);
      seen.set(id, e.file);
    }
  }
  const areaIds = groups.map((g) => g.legacyAreaId).filter((id) => id !== undefined);
  assert.equal(new Set(areaIds).size, areaIds.length, 'duplicate legacyAreaId in groups.yaml');
});

test('no e-mail addresses or telephone numbers outside the sanctioned email field', () => {
  const files = [...COLLECTIONS.flatMap((c) => all[c]).map((e) => [label(e), e.body, e.data])];
  for (const [name, body, data] of files) {
    assert.doesNotMatch(body, EMAIL, `${name}: e-mail address in the body`);
    assert.doesNotMatch(body, PHONE, `${name}: telephone number in the body`);
    for (const [key, value] of Object.entries(data)) {
      if (key === 'email') continue;
      const text = JSON.stringify(value);
      assert.doesNotMatch(text, EMAIL, `${name}: e-mail address in field ${key}`);
      assert.doesNotMatch(text, PHONE, `${name}: telephone number in field ${key}`);
    }
  }
  for (const name of ['groups.yaml', 'research.yaml']) {
    const text = readFileSync(path.join(DATA, name), 'utf8');
    assert.doesNotMatch(text, EMAIL, `${name}: e-mail address`);
  }
});

test('cross-references point at existing records', () => {
  const refs = { projects: [['people', 'people']], news: [['author', 'people'], ['people', 'people'], ['projects', 'projects']] };
  for (const [c, fields] of Object.entries(refs)) {
    for (const e of all[c]) {
      for (const [field, target] of fields) {
        const value = e.data[field];
        if (value === undefined) continue;
        for (const ref of Array.isArray(value) ? value : [value]) {
          assert.ok(slugs[target].has(ref), `${label(e)}: ${field} "${ref}" is not a ${target} record`);
        }
      }
    }
  }
});

test('relative image references exist next to the file', () => {
  for (const c of COLLECTIONS) {
    for (const e of all[c]) {
      for (const field of ['photo', 'image']) {
        const value = e.data[field];
        if (typeof value !== 'string') continue;
        assert.ok(existsSync(path.join(e.dir, value)), `${label(e)}: ${field} ${value} not found`);
        if (field === 'image') assert.ok(e.data.imageAlt, `${label(e)}: imageAlt is required`);
      }
    }
  }
});

test('bibliography parses, keys are unique, overrides refer to known keys and records', () => {
  const bib = parseBibtex(readFileSync(path.join(DATA, 'publications.bib'), 'utf8'));
  assert.ok(bib.length > 0, 'the bibliography is empty');
  const keys = new Set();
  for (const entry of bib) {
    assert.ok(!keys.has(entry.key), `duplicate BibTeX key ${entry.key}`);
    keys.add(entry.key);
    assert.ok(entry.fields.title, `${entry.key}: title missing`);
    assert.ok(entry.fields.author || entry.fields.editor, `${entry.key}: author/editor missing`);
    assert.match(entry.fields.year ?? '', /^\d{4}$/, `${entry.key}: year missing`);
  }
  const overrides = YAML.parse(readFileSync(path.join(DATA, 'publications.overrides.yaml'), 'utf8')) ?? {};
  for (const [key, ov] of Object.entries(overrides)) {
    assert.ok(keys.has(key), `overrides: unknown key ${key}`);
    for (const field of ['people', 'projects']) {
      for (const ref of ov[field] ?? []) assert.ok(slugs[field].has(ref), `overrides ${key}: ${field} "${ref}" does not exist`);
    }
  }
});

test('every publication has an author among the published people', () => {
  const bib = parseBibtex(readFileSync(path.join(DATA, 'publications.bib'), 'utf8'));
  const names = all.people.map((p) => p.data.name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase());
  const unmatched = bib.filter((entry) => {
    const authors = (entry.fields.author ?? entry.fields.editor ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    return !names.some((name) => authors.includes(name));
  });
  assert.deepEqual(unmatched.map((e) => e.key), [], 'publications without a published author (curation rule)');
});
