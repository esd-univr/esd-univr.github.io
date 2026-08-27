/**
 * Typed accessors over the content collections, with the ordering rules used
 * everywhere on the site. Pages import from here instead of calling getCollection()
 * with ad-hoc sorting.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { compareOpportunities } from './opportunities.ts';
import { comparePeople } from './people.ts';
import { publicationsForPerson } from './publications.ts';

export type Group = CollectionEntry<'groups'>;
export type ResearchTopic = CollectionEntry<'research'>;
export type Person = CollectionEntry<'people'>;
export type Project = CollectionEntry<'projects'>;
export type NewsItem = CollectionEntry<'news'>;
export type Opportunity = CollectionEntry<'opportunities'>;
export type Asset = CollectionEntry<'assets'>;
export type PublicationEntry = CollectionEntry<'publications'>;

const byOrder = (a: { data: { order: number } }, b: { data: { order: number } }) => a.data.order - b.data.order;

export async function getGroups(): Promise<Group[]> {
  return (await getCollection('groups')).sort(byOrder);
}

/** Every research topic, in display order. Also the vocabulary of `areas:`. */
export async function getResearchTopics(): Promise<ResearchTopic[]> {
  return (await getCollection('research')).sort(byOrder);
}

/** Research topics of one group, in display order. */
export async function getResearchForGroup(groupId: string): Promise<ResearchTopic[]> {
  return (await getResearchTopics()).filter((t) => t.data.groups.some((g) => g === groupId));
}

export async function getPeople(): Promise<Person[]> {
  return (await getCollection('people')).sort(comparePeople);
}

/** Active projects first (most recent start first), then completed ones. */
export async function getProjects(): Promise<Project[]> {
  const rank = { active: 0, completed: 1 } as const;
  return (await getCollection('projects')).sort(
    (a, b) =>
      rank[a.data.status] - rank[b.data.status] ||
      a.data.order - b.data.order ||
      b.data.start.getTime() - a.data.start.getTime(),
  );
}

/** Newest first. */
export async function getNews(): Promise<NewsItem[]> {
  return (await getCollection('news')).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Visible publications, newest first. Hidden entries are excluded everywhere. */
export async function getPublications(): Promise<PublicationEntry[]> {
  const all = await getCollection('publications', ({ data }) => !data.hidden);
  return all.sort((a, b) => b.data.year - a.data.year || a.data.title.localeCompare(b.data.title));
}

/** The publication objects (plain data) used by the list components. */
export function publicationData(entries: PublicationEntry[]) {
  return entries.map((e) => ({
    ...e.data,
    people: e.data.people.map((ref) => ref.id),
    projects: e.data.projects.map((ref) => ref.id),
  }));
}

export async function getPublicationsForPerson(person: Person) {
  const pubs = publicationData(await getPublications());
  return publicationsForPerson(pubs, { id: person.id, name: person.data.name, aliases: person.data.aliases });
}

export async function getPublicationsForProject(project: Project) {
  return publicationData(await getPublications()).filter((p) => p.projects.includes(project.id));
}

export async function getFeaturedPublications(limit = 5) {
  const pubs = publicationData(await getPublications());
  const featured = pubs.filter((p) => p.featured);
  return (featured.length > 0 ? featured : pubs).slice(0, limit);
}

/** Projects of one group. */
export async function getProjectsForGroup(groupId: string): Promise<Project[]> {
  return (await getProjects()).filter((p) => p.data.groups.some((g) => g === groupId));
}

/** Projects that list the given person. */
export async function getProjectsForPerson(person: Person): Promise<Project[]> {
  return (await getProjects()).filter((p) => p.data.people.some((ref) => ref.id === person.id));
}

/** News that reference the given person or project. */
export async function getNewsFor(kind: 'people' | 'projects', id: string): Promise<NewsItem[]> {
  return (await getNews()).filter((n) => n.data[kind].some((ref) => ref.id === id));
}

/** Every opportunity: open first, then paused, then closed; newest first within each. */
/**
 * Facilities and software, in the order the previous site listed them. `category` groups the
 * index; it never reorders, so a reader who knew the old page finds the same sequence.
 */
export async function getAssets(): Promise<Asset[]> {
  return (await getCollection('assets')).sort(byOrder);
}

export async function getOpportunities(): Promise<Opportunity[]> {
  return (await getCollection('opportunities')).sort(compareOpportunities);
}

export async function getOpenOpportunities(): Promise<Opportunity[]> {
  return (await getOpportunities()).filter((o) => o.data.status === 'open');
}

/** Open opportunities marked `featured`, for the home page. The schema rejects any other. */
export async function getFeaturedOpportunities(limit = 3): Promise<Opportunity[]> {
  return (await getOpenOpportunities()).filter((o) => o.data.featured).slice(0, limit);
}

/** Open opportunities this person supervises; drives the section on their page. */
export async function getOpportunitiesForSupervisor(person: Person): Promise<Opportunity[]> {
  return (await getOpenOpportunities()).filter((o) => o.data.supervisors.some((ref) => ref.id === person.id));
}
