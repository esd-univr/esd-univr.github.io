/**
 * Ordering of people and their partition into CISD groups.
 * Pure functions (no Astro imports) — unit-tested in tests/people.test.mjs.
 */

export interface PersonLike {
  id: string;
  data: {
    name: string;
    groups: readonly string[];
    order?: number | undefined;
  };
}

export interface PeopleSection<T> {
  /** Group id, e.g. "esd". */
  id: string;
  label: string;
  people: T[];
}

/** Family name = last token; used for alphabetical ordering. */
export function familyName(name: string): string {
  const tokens = name.trim().split(/\s+/);
  return tokens[tokens.length - 1] ?? name;
}

/** Sort by `order` (ascending, default 100), then family name, then full name. */
export function comparePeople(a: PersonLike, b: PersonLike): number {
  const orderA = a.data.order ?? 100;
  const orderB = b.data.order ?? 100;
  if (orderA !== orderB) return orderA - orderB;
  const fam = familyName(a.data.name).localeCompare(familyName(b.data.name));
  if (fam !== 0) return fam;
  return a.data.name.localeCompare(b.data.name);
}

/** Members of one group, in display order. */
export function peopleInGroup<T extends PersonLike>(people: readonly T[], groupId: string): T[] {
  return people.filter((p) => p.data.groups.includes(groupId)).sort(comparePeople);
}

/**
 * One section per group, in the order the groups are given; groups without members
 * are omitted. A person belonging to two groups appears in both sections.
 */
export function groupPeople<T extends PersonLike>(
  people: readonly T[],
  groups: ReadonlyArray<{ id: string; label: string }>,
): Array<PeopleSection<T>> {
  return groups
    .map((group) => ({ id: group.id, label: group.label, people: peopleInGroup(people, group.id) }))
    .filter((section) => section.people.length > 0);
}
