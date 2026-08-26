/**
 * People grouping and ordering rules used by the People page and the home page.
 * Pure functions (no Astro imports) — unit-tested in tests/people.test.mjs.
 */

/** Section ids of the People page, in display order (also the allowed `group` values). */
export const PERSON_GROUP_IDS = ['faculty', 'researchers', 'phd', 'students', 'staff', 'external', 'alumni'] as const;
export type PersonGroupId = (typeof PERSON_GROUP_IDS)[number];

export const PERSON_GROUP_LABELS: Record<PersonGroupId, string> = {
  faculty: 'Faculty',
  researchers: 'Research staff',
  phd: 'PhD students',
  students: 'Students',
  staff: 'Technical and administrative staff',
  external: 'External collaborators',
  alumni: 'Alumni and former members',
};

export const PERSON_GROUPS = PERSON_GROUP_IDS.map((id) => ({ id, label: PERSON_GROUP_LABELS[id] }));

export const PERSON_STATUSES = ['current', 'student', 'external', 'former', 'alumnus', 'alumna'] as const;
export type PersonStatus = (typeof PERSON_STATUSES)[number];

/** Statuses shown among the current members. */
const MEMBER_STATUSES: ReadonlySet<string> = new Set(['current', 'student']);
/** Statuses shown under "Alumni and former members". */
const FORMER_STATUSES: ReadonlySet<string> = new Set(['former', 'alumnus', 'alumna']);

export interface PersonLike {
  id: string;
  data: {
    name: string;
    status: PersonStatus;
    group?: PersonGroupId | undefined;
    order?: number | undefined;
  };
}

export interface PeopleSection<T> {
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

/**
 * Partition people into the sections of the People page:
 * current members (grouped, in PERSON_GROUPS order), external collaborators,
 * alumni and former members. Every person lands in exactly one section.
 */
export function groupPeople<T extends PersonLike>(people: T[]): {
  members: Array<PeopleSection<T>>;
  external: T[];
  former: T[];
} {
  const sorted = [...people].sort(comparePeople);
  const external: T[] = [];
  const former: T[] = [];
  const buckets = new Map<string, T[]>();

  for (const person of sorted) {
    const { status, group } = person.data;
    if (status === 'external' || group === 'external') external.push(person);
    else if (FORMER_STATUSES.has(status) || group === 'alumni') former.push(person);
    else if (MEMBER_STATUSES.has(status)) {
      const key = group ?? 'members';
      const bucket = buckets.get(key);
      if (bucket) bucket.push(person);
      else buckets.set(key, [person]);
    }
  }

  const members: Array<PeopleSection<T>> = [];
  for (const group of PERSON_GROUPS) {
    const bucket = buckets.get(group.id);
    if (bucket && bucket.length > 0) members.push({ id: group.id, label: group.label, people: bucket });
  }
  const ungrouped = buckets.get('members');
  if (ungrouped && ungrouped.length > 0) members.push({ id: 'members', label: 'Members', people: ungrouped });

  return { members, external, former };
}

/** Current members only (for the home page overview). */
export function currentMembers<T extends PersonLike>(people: T[]): T[] {
  return [...people].filter((p) => MEMBER_STATUSES.has(p.data.status) && p.data.group !== 'alumni' && p.data.group !== 'external').sort(comparePeople);
}
