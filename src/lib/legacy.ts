/**
 * Legacy URL compatibility (cisd.di.univr.it → esd-univr.github.io).
 *
 * The old Django site used numeric ids: /profile/12/, /area/9/, /project/2/,
 * /news/31/, plus list pages /news-list/ and /areas/. Records carry those ids in
 * their `legacyId` frontmatter; the routes under src/pages/{profile,area,project}/
 * and the numeric branch of src/pages/news/[slug].astro emit tiny static pages that
 * point browsers and crawlers at the new URL (GitHub Pages cannot redirect server-side).
 */

/** Path prefixes that only exist for backwards compatibility. */
export const LEGACY_COMPAT_PREFIXES = ['/profile/', '/area/', '/project/'] as const;

/** Legacy list pages, served by the stub pages src/pages/areas.astro and news-list.astro. */
export const LEGACY_LIST_PATHS = ['/news-list', '/areas'] as const;

/** True for any path that is a legacy compatibility page (not real content). */
export function isLegacyCompatPath(pathname: string): boolean {
  const path = pathname.endsWith('/') ? pathname : `${pathname}/`;
  if (LEGACY_COMPAT_PREFIXES.some((prefix) => path.startsWith(prefix))) return true;
  if (LEGACY_LIST_PATHS.some((list) => path === `${list}/`)) return true;
  // /news/<numeric legacy id>/ — real news slugs are never purely numeric.
  return /^\/news\/\d+\/$/.test(path);
}

/** Same check for an absolute URL (used by the sitemap filter). */
export function isLegacyCompatUrl(url: string): boolean {
  return isLegacyCompatPath(new URL(url).pathname);
}

/** True when a route parameter looks like a legacy numeric id. */
export function isLegacyId(value: string): boolean {
  return /^\d+$/.test(value);
}

export interface LegacyTarget {
  /** Legacy numeric id as a string (route parameter). */
  legacyId: string;
  /** New absolute path, e.g. /people/franco-fummi/ */
  to: string;
  /** Human-readable title of the target (shown on the stub page). */
  title: string;
}

/**
 * Build the list of compatibility pages for a collection.
 * `toPath` maps an entry id (slug) to its new path.
 */
export function legacyTargets<T extends { id: string; data: { legacyId?: number } }>(
  entries: T[],
  toPath: (entry: T) => string,
  titleOf: (entry: T) => string,
): LegacyTarget[] {
  const targets: LegacyTarget[] = [];
  const seen = new Map<number, string>();
  for (const entry of entries) {
    const id = entry.data.legacyId;
    if (id === undefined) continue;
    const previous = seen.get(id);
    if (previous !== undefined) {
      throw new Error(
        `legacyId ${id} is used by both "${previous}" and "${entry.id}"; each legacy id must map to exactly one record`,
      );
    }
    seen.set(id, entry.id);
    targets.push({ legacyId: String(id), to: toPath(entry), title: titleOf(entry) });
  }
  return targets;
}
