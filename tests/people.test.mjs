import assert from 'node:assert/strict';
import { test } from 'node:test';
import { comparePeople, familyName, groupPeople, peopleInGroup } from '../src/lib/people.ts';

const person = (id, groups, order) => ({ id, data: { name: id, groups, order } });
const GROUPS = [
  { id: 'esd', label: 'Electronic Systems Design' },
  { id: 'parco', label: 'PARCO Lab' },
  { id: 'iot4care', label: 'Internet of Things 4 Care' },
];

test('familyName is the last token', () => {
  assert.equal(familyName('Franco Fummi'), 'Fummi');
  assert.equal(familyName("Nicola Dall'Ora"), "Dall'Ora");
});

test('comparePeople orders by order, then family name, then full name', () => {
  const list = [person('Zed Alpha', ['esd'], 100), person('Ann Beta', ['esd'], 1), person('Bob Alpha', ['esd'], 100)];
  assert.deepEqual(list.sort(comparePeople).map((p) => p.id), ['Ann Beta', 'Bob Alpha', 'Zed Alpha']);
  const noOrder = [person('B B', ['esd'], undefined), person('A A', ['esd'], 50)];
  assert.deepEqual(noOrder.sort(comparePeople).map((p) => p.id), ['A A', 'B B'], 'a missing order defaults to 100');
});

test('peopleInGroup filters and sorts', () => {
  const people = [person('Second', ['esd'], 20), person('Other', ['parco'], 1), person('First', ['esd'], 10)];
  assert.deepEqual(peopleInGroup(people, 'esd').map((p) => p.id), ['First', 'Second']);
  assert.deepEqual(peopleInGroup(people, 'iot4care'), []);
});

test('groupPeople builds one section per group, in group order, skipping empty groups', () => {
  const people = [person('Prof', ['esd'], 10), person('Head', ['parco'], 10), person('Student', ['esd'], 20)];
  const sections = groupPeople(people, GROUPS);
  assert.deepEqual(sections.map((s) => s.id), ['esd', 'parco']);
  assert.deepEqual(sections[0].people.map((p) => p.id), ['Prof', 'Student']);
  assert.equal(sections[1].label, 'PARCO Lab');
});

test('a person in two groups appears in both sections', () => {
  const sections = groupPeople([person('Bridge', ['esd', 'iot4care'], 10)], GROUPS);
  assert.deepEqual(sections.map((s) => s.id), ['esd', 'iot4care']);
  assert.equal(sections[0].people.length, 1);
  assert.equal(sections[1].people.length, 1);
});
