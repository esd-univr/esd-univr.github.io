/**
 * Content collections — the single source of truth for what a group, research topic,
 * person, project, news item, publication or student opportunity may contain. Every
 * field is validated at build time; a typo or a missing required field fails the build
 * with a message that names the file and the field.
 *
 * Where the content lives (see the task guides in docs/):
 *   src/data/groups.yaml     the CISD groups
 *   src/data/research.yaml   research topics
 *   src/content/people/<slug>.md, projects/<slug>.md, news/<date>-<slug>.md
 *   src/content/opportunities/<slug>.md, assets/<slug>.md (+ their figures)
 *   src/data/publications.bib (+ publications.overrides.yaml)
 */
import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import YAML from 'yaml';
import { publicationsLoader } from './loaders/publications.ts';
import {
  OPPORTUNITY_ACTIVITIES,
  OPPORTUNITY_LEVELS,
  OPPORTUNITY_STATUSES,
  OPPORTUNITY_TYPES,
  WORKLOAD_INTENSITIES,
} from './lib/opportunities.ts';

/** Markdown files; names starting with "_" (e.g. _README.md) are ignored. */
const MARKDOWN = '**/[^_]*.md';
/** YAML data files are lists of objects, each with its own `id`. */
const yaml = (path: string) => file(path, { parser: (text) => YAML.parse(text) });

/** The CISD groups. Their ids are the only allowed values of every `groups:` field. */
export const GROUP_IDS = ['esd', 'parco', 'iot4care'] as const;
export type GroupId = (typeof GROUP_IDS)[number];
const groupIds = z.array(z.enum(GROUP_IDS)).nonempty();
/**
 * The same vocabulary, but allowed to be empty. Used where the source does not state a
 * current CISD group association. An empty list must never be filled in by inference.
 */
const optionalGroupIds = z.array(z.enum(GROUP_IDS)).default([]);

const groups = defineCollection({
  loader: yaml('src/data/groups.yaml'),
  schema: z.object({
    name: z.string().min(1),
    /** Acronym used in labels and lists. */
    shortName: z.string().min(1),
    /** One or two sentences shown on the home page and the Research page. */
    summary: z.string().min(1),
    order: z.number().int(),
    /** Id of the group's page on the legacy site (/area/<id>/); enables a compatibility page. */
    legacyAreaId: z.number().int().positive().optional(),
    url: z.url().optional(),
  }),
});

const research = defineCollection({
  loader: yaml('src/data/research.yaml'),
  schema: z.object({
    name: z.string().min(1),
    summary: z.string().min(1),
    groups: groupIds,
    order: z.number().int(),
    /** Optional short list of concrete subjects shown under the summary. */
    details: z.array(z.string()).default([]),
  }),
});

const people = defineCollection({
  loader: glob({ pattern: MARKDOWN, base: './src/content/people' }),
  schema: ({ image }) =>
    z.object({
      name: z.string().min(1),
      /** Free text shown next to the name, e.g. "Full Professor", "PhD Student". */
      role: z.string().min(1),
      /**
       * Current CISD laboratory associations. May be empty when current CISD membership
       * is established but no ESD/PARCO/IoT4Care assignment has been explicitly stated.
       */
      groups: optionalGroupIds,
      /** Current relationship to CISD. Existing records default to member. */
      relationship: z.enum(['member', 'collaborator']).default('member'),
      /** Numeric id on the legacy site (/profile/<id>/); enables a compatibility page. */
      legacyId: z.number().int().positive().optional(),
      /** Sort key within a group or the collaborator section; ties break on family name. */
      order: z.number().int().default(100),
      /** Only when it differs from the department on the Contacts page. */
      affiliation: z.string().optional(),
      interests: z.array(z.string()).default([]),
      /** Portrait, relative to the Markdown file (e.g. ./photo.jpg). */
      photo: image().optional(),
      /** Public institutional e-mail — only when its publication has been approved. */
      email: z.email().optional(),
      website: z.url().optional(),
      orcid: z
        .string()
        .regex(/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/, 'ORCID iD must look like 0000-0002-1825-0097')
        .optional(),
      scholar: z.url().optional(),
      dblp: z.url().optional(),
      /** GitHub user name or profile URL. */
      github: z.string().optional(),
      linkedin: z.url().optional(),
      /** Other spellings under which this person appears as an author (e.g. "F. Fummi"). */
      aliases: z.array(z.string()).default([]),
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: MARKDOWN, base: './src/content/projects' }),
  schema: z
    .object({
      name: z.string().min(1),
      acronym: z.string().optional(),
      groups: groupIds,
      /** Numeric id on the legacy site (/project/<id>/). */
      legacyId: z.number().int().positive().optional(),
      status: z.enum(['active', 'completed']),
      start: z.coerce.date(),
      end: z.coerce.date().optional(),
      summary: z.string().min(1),
      url: z.url().optional(),
      people: z.array(reference('people')).default([]),
      /** Programme, funder and grant number. Amounts are never published. */
      funding: z
        .object({
          programme: z.string().optional(),
          funder: z.string().optional(),
          grant: z.string().optional(),
        })
        .optional(),
      featured: z.boolean().default(false),
      order: z.number().int().default(100),
    })
    .refine((p) => !p.end || p.end >= p.start, { message: 'end must not be before start', path: ['end'] }),
});

/**
 * Facilities and software the groups maintain, migrated from the previous site's /assets/
 * page. Long-form description belongs in the Markdown body, with its figures written inline
 * there; the frontmatter carries only factual metadata.
 */
const assets = defineCollection({
  loader: glob({ pattern: MARKDOWN, base: './src/content/assets' }),
  schema: z.object({
    name: z.string().min(1),
    /** One line for the directory. Taken from the entry's own words, never written fresh. */
    summary: z.string().min(1),
    /**
     * What kind of thing this is. The previous site categorised nothing, so these three
     * values are the honest minimum: a place, a piece of software, or a project that is an
     * ecosystem rather than a single tool. Do not force an entry into a category that
     * misdescribes it — add a value instead.
     */
    category: z.enum(['facility', 'software', 'project']),
    /** Free-text label in the row's margin, in the entry's own vocabulary: Laboratory,
     *  Library, Framework, Ecosystem, Tools and APIs. */
    kind: z.string().min(1),
    /** May be empty: the previous site never said which group owns which asset. */
    groups: optionalGroupIds,
    order: z.number().int().default(100),
    /** The asset's own public site. */
    url: z.url().optional(),
    /** Source repository, when the tool is released as code. */
    repository: z.url().optional(),
    /** Only when the group states one. Never guessed from the repository. */
    licence: z.string().optional(),
    /**
     * Who to ask about it. Two shapes on purpose: `person` points at the roster, so the page
     * links to them and publishes nothing they have not already approved; the plain fields
     * carry a contact the roster does not cover — a project lead who is not a member, or a
     * laboratory's own switchboard. At least one field must be set.
     */
    contact: z
      .object({
        person: reference('people').optional(),
        name: z.string().min(1).optional(),
        email: z.email().optional(),
        phone: z.string().min(1).optional(),
      })
      .refine((c) => Boolean(c.person ?? c.name ?? c.email ?? c.phone), {
        message: 'a contact must name a person, or carry a name, e-mail or telephone number',
      })
      .optional(),
    /** Where a facility physically is. Software has no location. */
    location: z
      .object({
        address: z.array(z.string().min(1)).nonempty(),
        mapUrl: z.url().optional(),
      })
      .optional(),
    /** The papers the entry itself points at, with the link text it used. */
    publications: z
      .array(z.object({ label: z.string().min(1), href: z.url() }))
      .default([]),
  })
  .refine((a) => a.category === 'facility' || !a.location, {
    message: 'only a facility has a location',
    path: ['location'],
  }),
});

const news = defineCollection({
  loader: glob({ pattern: MARKDOWN, base: './src/content/news' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1),
        date: z.coerce.date(),
        summary: z.string().min(1),
        groups: groupIds,
        /** Numeric id on the legacy site (/news/<id>/). */
        legacyId: z.number().int().positive().optional(),
        author: reference('people').optional(),
        /** Short label such as "Publication", "Event", "Award". */
        category: z.string().optional(),
        image: image().optional(),
        imageAlt: z.string().optional(),
        people: z.array(reference('people')).default([]),
        projects: z.array(reference('projects')).default([]),
        lang: z.enum(['en', 'it']).default('en'),
        featured: z.boolean().default(false),
      })
      .refine((n) => !n.image || !!n.imageAlt, { message: 'imageAlt is required when image is set', path: ['imageAlt'] }),
});

/**
 * Student opportunities: thesis, student-project and internship proposals.
 *
 * Two references carry the taxonomy instead of repeating it: `areas` points at the
 * research topics in src/data/research.yaml and `supervisors` at published people, so
 * an unknown area or an unpublished supervisor fails the build. Adding a proposal is
 * one Markdown file and nothing else — see docs/opportunities.md.
 */
const opportunities = defineCollection({
  loader: glob({ pattern: MARKDOWN, base: './src/content/opportunities' }),
  schema: z
    .object({
      title: z.string().min(1),
      /** One or two sentences shown in the list and used as the page description. */
      summary: z.string().min(1),
      type: z.enum(OPPORTUNITY_TYPES),
      /** Degree levels this suits; independent of `type`, so a thesis may fit both. */
      levels: z.array(z.enum(OPPORTUNITY_LEVELS)).nonempty(),
      status: z.enum(OPPORTUNITY_STATUSES),
      /** When the proposal was published, `YYYY-MM-DD`. Sorts the list, newest first. */
      posted: z.coerce.date(),
      groups: groupIds,
      /** Research topic ids from src/data/research.yaml — the site's one taxonomy. */
      areas: z.array(reference('research')).nonempty(),
      /** What the student will actually do. */
      activities: z.array(z.enum(OPPORTUNITY_ACTIVITIES)).nonempty(),
      supervisors: z.array(reference('people')).nonempty(),
      /** Expected effort. `duration` is free text because thesis timing varies. */
      workload: z.object({
        duration: z.string().min(1),
        intensity: z.enum(WORKLOAD_INTENSITIES),
      }),
      /** CFU, only where the number is genuinely established. */
      credits: z.number().int().positive().optional(),
      prerequisites: z.array(z.string().min(1)).default([]),
      tools: z.array(z.string().min(1)).default([]),
      language: z.enum(['en', 'it']).default('en'),
      featured: z.boolean().default(false),
      /** Numeric id on the legacy site (/thesis/<id>/details/); never invented. */
      legacyId: z.number().int().positive().optional(),
    })
    .refine((o) => !o.featured || o.status === 'open', {
      message: 'only an open opportunity may be featured — set status: open or featured: false',
      path: ['featured'],
    }),
});

const publications = defineCollection({
  loader: publicationsLoader({
    bib: './src/data/publications.bib',
    overrides: './src/data/publications.overrides.yaml',
  }),
  schema: z.object({
    key: z.string(),
    type: z.string(),
    title: z.string(),
    authors: z.array(z.string()),
    year: z.number().int(),
    venue: z.string().optional(),
    venueKind: z.enum(['journal', 'conference', 'chapter', 'book', 'thesis', 'report', 'preprint', 'other']),
    volume: z.string().optional(),
    number: z.string().optional(),
    pages: z.string().optional(),
    publisher: z.string().optional(),
    doi: z.string().optional(),
    url: z.string().optional(),
    dblp: z.string().optional(),
    pdf: z.string().optional(),
    code: z.string().optional(),
    note: z.string().optional(),
    featured: z.boolean(),
    hidden: z.boolean(),
    people: z.array(reference('people')),
    projects: z.array(reference('projects')),
  }),
});

export const collections = { groups, research, people, projects, assets, news, opportunities, publications };
