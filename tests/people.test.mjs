import assert from 'node:assert/strict';
import { test } from 'node:test';
import { comparePeople, currentMembers, familyName, groupPeople } from '../src/lib/people.ts';

const person = (id, data) => ({ id, data: { name: id, status: 'current', ...data } });

test('familyName is the last token', () => {
  assert.equal(familyName('Franco Fummi'), 'Fummi');
  assert.equal(familyName("Nicola Dall'Ora"), "Dall'Ora");
});

test('comparePeople orders by order, then family name', () => {
  const list = [person('Zed Alpha', { order: 100 }), person('Ann Beta', { order: 1 }), person('Bob Alpha', { order: 100 })];
  assert.deepEqual(list.sort(comparePeople).map((p) => p.id), ['Ann Beta', 'Bob Alpha', 'Zed Alpha']);
});

test('groupPeople partitions into member groups, external and former', () => {
  const people = [
    person('Prof', { group: 'faculty' }),
    person('Postdoc', { group: 'researchers' }),
    person('Student', { status: 'student', group: 'phd' }),
    person('Nobody', {}),
    person('Ext', { status: 'external' }),
    person('Alum', { status: 'alumna', group: 'alumni' }),
    person('Former', { status: 'former' }),
  ];
  const { members, external, former } = groupPeople(people);
  assert.deepEqual(members.map((s) => s.id), ['faculty', 'researchers', 'phd', 'members']);
  assert.deepEqual(members.at(-1).people.map((p) => p.id), ['Nobody']);
  assert.deepEqual(external.map((p) => p.id), ['Ext']);
  assert.deepEqual(former.map((p) => p.id), ['Alum', 'Former']);
  assert.deepEqual(currentMembers(people).map((p) => p.id), ['Nobody', 'Postdoc', 'Prof', 'Student']);
});
