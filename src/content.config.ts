/**
 * Content collections — the single source of truth for what a person, research
 * area, project, news item or publication may contain. Every field is validated at
 * build time; a typo or missing required field fails the build with a clear message.
 *
 * Content lives in src/content/<collection>/<slug>.md (see MAINTENANCE.md).
 * Publications come from src/data/publications.bib via a small loader.
 */
import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
import { CONTENT_ROOT, DATA_ROOT } from './lib/fixtures.ts';
import { PERSON_GROUP_IDS, PERSON_STATUSES } from './lib/people.ts';
import { rootAwareGlob } from './loaders/glob.ts';
import { publicationsLoader } from './loaders/publications.ts';

/** Markdown files; names starting with "_" (e.g. _README.md) are ignored. */
const MARKDOWN = '**/[^_]*.md';

const people = defineCollection({
  loader: rootAwareGlob({ pattern: MARKDOWN, base: `${CONTENT_ROOT}/people` }),
  schema: ({ image }) =>
    z.object({
      name: z.string().min(1),
      /** Numeric id on the legacy site (/profile/<id>/); enables a compatibility page. */
      legacyId: z.number().int().positive().optional(),
      /** Free text shown next to the name, e.g. "Full Professor", "PhD student". */
      role: z.string().min(1),
      status: z.enum(PERSON_STATUSES),
      /** Section of the People page; omit to list under a generic "Members" heading. */
      group: z.enum(PERSON_GROUP_IDS).optional(),
      affiliation: z.string().optional(),
      interests: z.array(z.string()).default([]),
      /** Portrait, relative to the Markdown file (e.g. ./photo.jpg) or in src/assets/. */
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
      /** Sort key within a group (lower first); ties are broken by family name. */
      order: z.number().int().default(100),
    }),
});

const research = defineCollection({
  loader: rootAwareGlob({ pattern: MARKDOWN, base: `${CONTENT_ROOT}/research` }),
  schema: ({ image }) =>
    z.object({
      name: z.string().min(1),
      /** Numeric id on the legacy site (/area/<id>/). */
      legacyId: z.number().int().positive().optional(),
      /** One or two sentences used in lists and on the home page. */
      summary: z.string().min(1),
      logo: image().optional(),
      logoAlt: z.string().optional(),
      /** Institutional or external page about this theme, if any. */
      url: z.url().optional(),
      status: z.enum(['active', 'archived']).default('active'),
      lead: reference('people').optional(),
      featured: z.boolean().default(false),
      order: z.number().int().default(100),
    }),
});

const projects = defineCollection({
  loader: rootAwareGlob({ pattern: MARKDOWN, base: `${CONTENT_ROOT}/projects` }),
  schema: ({ image }) =>
    z
      .object({
        name: z.string().min(1),
        acronym: z.string().optional(),
        /** Numeric id on the legacy site (/project/<id>/). */
        legacyId: z.number().int().positive().optional(),
        status: z.enum(['active', 'completed', 'archived']),
        start: z.coerce.date(),
        end: z.coerce.date().optional(),
        summary: z.string().min(1),
        image: image().optional(),
        imageAlt: z.string().optional(),
        url: z.url().optional(),
        research: z.array(reference('research')).default([]),
        people: z.array(reference('people')).default([]),
        funding: z
          .object({
            programme: z.string().optional(),
            funder: z.string().optional(),
            grant: z.string().optional(),
            amount: z.number().nonnegative().optional(),
            currency: z.string().default('EUR'),
            /** Amounts are never shown unless this is explicitly set to true. */
            showAmount: z.boolean().default(false),
          })
          .optional(),
        featured: z.boolean().default(false),
        order: z.number().int().default(100),
      })
      .refine((p) => !p.image || !!p.imageAlt, { message: 'imageAlt is required when image is set', path: ['imageAlt'] })
      .refine((p) => !p.end || p.end >= p.start, { message: 'end must not be before start', path: ['end'] }),
});

const news = defineCollection({
  loader: rootAwareGlob({ pattern: MARKDOWN, base: `${CONTENT_ROOT}/news` }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1),
        /** Numeric id on the legacy site (/news/<id>/). */
        legacyId: z.number().int().positive().optional(),
        date: z.coerce.date(),
        author: reference('people').optional(),
        /** Short label such as "Publication", "Event", "Award". */
        category: z.string().optional(),
        summary: z.string().min(1),
        image: image().optional(),
        imageAlt: z.string().optional(),
        people: z.array(reference('people')).default([]),
        projects: z.array(reference('projects')).default([]),
        research: z.array(reference('research')).default([]),
        lang: z.enum(['en', 'it']).default('en'),
        featured: z.boolean().default(false),
      })
      .refine((n) => !n.image || !!n.imageAlt, { message: 'imageAlt is required when image is set', path: ['imageAlt'] }),
});

const publications = defineCollection({
  loader: publicationsLoader({
    bib: `${DATA_ROOT}/publications.bib`,
    overrides: `${DATA_ROOT}/publications.overrides.yaml`,
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
    research: z.array(reference('research')),
  }),
});

export const collections = { people, research, projects, news, publications };
