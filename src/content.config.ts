/**
 * Content collections — the single source of truth for what a group, research topic,
 * person, project, news item or publication may contain. Every field is validated at
 * build time; a typo or a missing required field fails the build with a message that
 * names the file and the field.
 *
 * Where the content lives (see the task guides in docs/):
 *   src/data/groups.yaml     the CISD groups
 *   src/data/research.yaml   research topics
 *   src/content/people/<slug>.md, projects/<slug>.md, news/<date>-<slug>.md
 *   src/data/publications.bib (+ publications.overrides.yaml)
 */
import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import YAML from 'yaml';
import { publicationsLoader } from './loaders/publications.ts';

/** Markdown files; names starting with "_" (e.g. _README.md) are ignored. */
const MARKDOWN = '**/[^_]*.md';
/** YAML data files are lists of objects, each with its own `id`. */
const yaml = (path: string) => file(path, { parser: (text) => YAML.parse(text) });

/** The CISD groups. Their ids are the only allowed values of every `groups:` field. */
export const GROUP_IDS = ['esd', 'parco', 'iot4care'] as const;
export type GroupId = (typeof GROUP_IDS)[number];
const groupIds = z.array(z.enum(GROUP_IDS)).nonempty();

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
      /** Free text shown next to the name, e.g. "Full Professor", "PhD student". */
      role: z.string().min(1),
      groups: groupIds,
      /** Numeric id on the legacy site (/profile/<id>/); enables a compatibility page. */
      legacyId: z.number().int().positive().optional(),
      /** Sort key within a group (lower first); ties are broken by family name. */
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

export const collections = { groups, research, people, projects, news, publications };
