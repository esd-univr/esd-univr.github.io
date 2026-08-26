/**
 * Student opportunities: the controlled vocabularies, the display order, the labels
 * and the metadata the list page filters on.
 *
 * Pure functions and plain data (no Astro imports), so the same definitions are used
 * three times without drifting: `src/content.config.ts` turns the vocabularies into
 * the validated schema, the pages render the labels, and tests/opportunities.test.mjs
 * checks the published files against them.
 *
 * `areas` is deliberately absent: a scientific area is a research topic id from
 * src/data/research.yaml, not a vocabulary of its own. See docs/opportunities.md.
 */

/** What the student is offered. `project` means a student project, never a funded one. */
export const OPPORTUNITY_TYPES = ['thesis', 'project', 'internship'] as const;
export type OpportunityType = (typeof OPPORTUNITY_TYPES)[number];

/** Degree level. Independent of the type: a thesis may suit both. */
export const OPPORTUNITY_LEVELS = ['bachelor', 'master'] as const;
export type OpportunityLevel = (typeof OPPORTUNITY_LEVELS)[number];

export const OPPORTUNITY_STATUSES = ['open', 'paused', 'closed'] as const;
export type OpportunityStatus = (typeof OPPORTUNITY_STATUSES)[number];

/** Expected effort, in three steps. Never an hour count. */
export const WORKLOAD_INTENSITIES = ['light', 'moderate', 'substantial'] as const;
export type WorkloadIntensity = (typeof WORKLOAD_INTENSITIES)[number];

/** What the student will actually do. Short, controlled, and extended only deliberately. */
export const OPPORTUNITY_ACTIVITIES = [
  'Software Development',
  'Hardware Design',
  'Modelling',
  'Simulation',
  'Formal Verification',
  'Experimental Evaluation',
  'Data Analysis',
  'Machine Learning',
  'Literature Review',
  'Benchmarking',
] as const;
export type OpportunityActivity = (typeof OPPORTUNITY_ACTIVITIES)[number];

export const TYPE_LABEL: Record<OpportunityType, string> = {
  thesis: 'Thesis',
  project: 'Project',
  internship: 'Internship',
};

export const LEVEL_LABEL: Record<OpportunityLevel, string> = {
  bachelor: "Bachelor's",
  master: "Master's",
};

export const STATUS_LABEL: Record<OpportunityStatus, string> = {
  open: 'Open',
  paused: 'Paused',
  closed: 'Closed',
};

/** Open first, then paused; closed proposals stay reachable but come last. */
const STATUS_RANK: Record<OpportunityStatus, number> = { open: 0, paused: 1, closed: 2 };

export interface OpportunityLike {
  id: string;
  data: {
    title: string;
    type: OpportunityType;
    levels: readonly OpportunityLevel[];
    status: OpportunityStatus;
    posted: Date;
    groups: readonly string[];
    activities: readonly string[];
  };
}

/** Status, then most recently posted, then title. */
export function compareOpportunities(a: OpportunityLike, b: OpportunityLike): number {
  const rank = STATUS_RANK[a.data.status] - STATUS_RANK[b.data.status];
  if (rank !== 0) return rank;
  const posted = b.data.posted.getTime() - a.data.posted.getTime();
  if (posted !== 0) return posted;
  return a.data.title.localeCompare(b.data.title);
}

/**
 * "Master's thesis", "Bachelor's / Master's project" — the one line that answers
 * "what is this and who is it for" before anything else on the card.
 */
export function kindLine(type: OpportunityType, levels: readonly OpportunityLevel[]): string {
  const level = levels.map((l) => LEVEL_LABEL[l]).join(' / ');
  const kind = TYPE_LABEL[type].toLowerCase();
  return level ? `${level} ${kind}` : TYPE_LABEL[type];
}

/** "4–6 months · substantial". */
export function workloadLine(workload: { duration: string; intensity: WorkloadIntensity }): string {
  return `${workload.duration} · ${workload.intensity}`;
}

/**
 * A vocabulary value as a filter token: lower case, hyphens, no punctuation.
 * "Formal Verification" → "formal-verification".
 */
export function token(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * The `data-*` attributes the client-side filter reads. Values are space-separated
 * token lists, so a filter matches on whole tokens and never on a substring.
 */
export function filterAttributes(entry: OpportunityLike): Record<string, string> {
  return {
    'data-opp': entry.id,
    'data-status': entry.data.status,
    'data-type': entry.data.type,
    'data-levels': entry.data.levels.join(' '),
    'data-groups': entry.data.groups.map(token).join(' '),
    'data-activities': entry.data.activities.map(token).join(' '),
  };
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface Filter {
  /** Suffix of the control id and the `data-key` the script reads. */
  key: 'levels' | 'type' | 'groups' | 'activities';
  label: string;
  options: FilterOption[];
}

/**
 * The four filters, with only the values that actually occur in `entries` — a filter
 * never offers a choice that would empty the list. A filter with fewer than two
 * options is dropped; when nothing is left the page shows no filter form at all.
 */
export function buildFilters(
  entries: readonly OpportunityLike[],
  groupLabels: ReadonlyArray<{ id: string; label: string }>,
): Filter[] {
  const levels = collect(entries, (e) => e.data.levels);
  const types = collect(entries, (e) => [e.data.type]);
  const groups = collect(entries, (e) => e.data.groups);
  const activities = collect(entries, (e) => e.data.activities);

  const filters: Filter[] = [
    {
      key: 'levels',
      label: 'Level',
      options: OPPORTUNITY_LEVELS.filter((l) => levels.has(l)).map((l) => ({ value: l, label: LEVEL_LABEL[l] })),
    },
    {
      key: 'type',
      label: 'Type',
      options: OPPORTUNITY_TYPES.filter((t) => types.has(t)).map((t) => ({ value: t, label: TYPE_LABEL[t] })),
    },
    {
      key: 'groups',
      label: 'Group',
      options: groupLabels
        .filter((g) => groups.has(g.id))
        .map((g) => ({ value: token(g.id), label: g.label })),
    },
    {
      key: 'activities',
      label: 'Activity',
      options: OPPORTUNITY_ACTIVITIES.filter((a) => activities.has(a)).map((a) => ({ value: token(a), label: a })),
    },
  ];
  return filters.filter((filter) => filter.options.length > 1);
}

/** The distinct values one field takes across the published set. */
function collect(entries: readonly OpportunityLike[], values: (entry: OpportunityLike) => readonly string[]) {
  const seen = new Set<string>();
  for (const entry of entries) for (const value of values(entry)) seen.add(value);
  return seen;
}
