/**
 * Typed accessors over the content collections with the ordering rules used
 * everywhere on the site. Pages import from here instead of calling
 * getCollection() with ad-hoc sorting.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { comparePeople } from './people.ts';
import { publicationsForPerson } from './publications.ts';

export type Person = CollectionEntry<'people'>;
export type ResearchArea = CollectionEntry<'research'>;
export type Project = CollectionEntry<'projects'>;
export type NewsItem = CollectionEntry<'news'>;
export type PublicationEntry = CollectionEntry<'publications'>;

export async function getPeople(): Promise<Person[]> {
  return (await getCollection('people')).sort(comparePeople);
}

export async function getResearchAreas(): Promise<ResearchArea[]> {
  return (await getCollection('research')).sort(
    (a, b) => a.data.order - b.data.order || a.data.name.localeCompare(b.data.name),
  );
}

/** Active projects first (most recent start first), then completed/archived. */
export async function getProjects(): Promise<Project[]> {
  const rank = { active: 0, completed: 1, archived: 2 } as const;
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
    research: e.data.research.map((ref) => ref.id),
  }));
}

export async function getPublicationsForPerson(person: Person) {
  const pubs = publicationData(await getPublications());
  return publicationsForPerson(pubs, { id: person.id, name: person.data.name, aliases: person.data.aliases });
}

export async function getPublicationsForProject(project: Project) {
  return publicationData(await getPublications()).filter((p) => p.projects.includes(project.id));
}

export async function getPublicationsForResearch(area: ResearchArea) {
  return publicationData(await getPublications()).filter((p) => p.research.includes(area.id));
}

export async function getFeaturedPublications(limit = 5) {
  const pubs = publicationData(await getPublications());
  const featured = pubs.filter((p) => p.featured);
  return (featured.length > 0 ? featured : pubs).slice(0, limit);
}

/** Projects that list the given research area. */
export async function getProjectsForResearch(area: ResearchArea): Promise<Project[]> {
  return (await getProjects()).filter((p) => p.data.research.some((ref) => ref.id === area.id));
}

/** Projects that list the given person. */
export async function getProjectsForPerson(person: Person): Promise<Project[]> {
  return (await getProjects()).filter((p) => p.data.people.some((ref) => ref.id === person.id));
}

/** News that reference the given entry (person, project or research area). */
export async function getNewsFor(kind: 'people' | 'projects' | 'research', id: string): Promise<NewsItem[]> {
  return (await getNews()).filter((n) => n.data[kind].some((ref) => ref.id === id));
}
