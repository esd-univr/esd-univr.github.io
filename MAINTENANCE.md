# Maintaining the ESD website

Everything on the site comes from text files in `src/`. You never need to touch the
templates to add or change content. Work on a branch, run `npm run ci`, open a pull
request; the site deploys automatically when the change reaches `main`.

Quick start:

```bash
npm ci               # once
npm run dev          # http://localhost:4321 — reloads on save
npm run ci           # before pushing: checks, tests, build, verification
```

If the build fails after a content change, the error message names the file and the
field (for example `people/mario-rossi.md → email: Invalid email`). Fix and re-run.

---

## Slugs and file names

The **file name is the URL**: `src/content/people/mario-rossi.md` → `/people/mario-rossi/`.
Use lower-case letters, digits and hyphens; never rename a published file without
adding a redirect (ask before doing so — external sites link to us).
Files starting with `_` (such as `_README.md`) are ignored.

Dates are written `YYYY-MM-DD`. Text after the frontmatter (`---` block) is Markdown.
Headings inside a body start at `##` (the page title is the only `#`/H1); `npm run verify`
rejects skipped heading levels.

## Add or update a person

Create `src/content/people/<slug>.md`:

```markdown
---
name: Mario Rossi
role: Assistant Professor          # free text shown next to the name
status: current                    # current | student | external | former | alumnus | alumna
group: faculty                     # faculty | researchers | phd | students | staff | external | alumni
order: 10                          # lower = earlier within the group (optional, default 100)
affiliation: Department of Computer Science, University of Verona   # optional
interests: [Design automation, Digital twins]                        # optional
photo: ./mario-rossi.jpg           # optional; put the file next to the .md (or in src/assets/)
email: mario.rossi@univr.it        # optional — only institutional addresses whose publication is approved
website: https://…                 # optional
orcid: 0000-0000-0000-0000         # optional
scholar: https://scholar.google.com/citations?user=…   # optional
dblp: https://dblp.org/pid/…       # optional
github: mariorossi                 # optional (user name or URL)
linkedin: https://www.linkedin.com/in/…                # optional
aliases: ["M. Rossi"]              # optional: other spellings used in publications.bib
legacyId: 12                       # optional: id on the old site (/profile/12/) → compatibility page
---

Short biography in Markdown (optional).
```

Photos: JPEG or PNG, at least 480×480 px, roughly square (they are cropped to a square
and resized at build time). Strip personal metadata (EXIF) before adding a photo.

### Mark someone as former / alumni

Edit their file: set `status: former` (or `alumnus` / `alumna`) and `group: alumni`,
optionally update `role` (e.g. `Former PhD student (2019–2023)`). Do **not** delete the
file — their publications and projects still link to the page.

## Add or update a research area

Create `src/content/research/<slug>.md`:

```markdown
---
name: Design automation for cyber-physical systems
summary: One or two sentences shown in lists and on the home page.
status: active                     # active | archived
lead: mario-rossi                  # optional: slug of a person
logo: ./logo.png                   # optional; add logoAlt when set
logoAlt: Logo of …
url: https://…                     # optional external page
featured: true                     # optional
order: 1                           # optional
legacyId: 9                        # optional (/area/9/)
---

Long description in Markdown (optional): topics, methods, tools.
```

To archive a theme set `status: archived`; it moves to the "Archived themes" list.

## Add or update a project

Create `src/content/projects/<slug>.md`:

```markdown
---
name: Full project title
acronym: ACRONYM                   # optional
status: active                     # active | completed | archived
start: 2024-01-01
end: 2027-12-31                    # optional
summary: One or two sentences.
image: ./image.jpg                 # optional; imageAlt is then required
imageAlt: Description of the image
url: https://project-website       # optional
research: [design-automation]      # slugs of research areas (optional)
people: [mario-rossi]              # slugs of people (optional)
funding:                           # optional
  programme: Horizon Europe
  funder: European Commission
  grant: "101000000"
  amount: 250000                   # never shown unless showAmount: true
  showAmount: false
featured: false
legacyId: 2                        # optional (/project/2/)
---

Full description in Markdown (optional).
```

When a project ends, set `status: completed` and the `end` date. Projects are never
deleted; `archived` exists for very old projects you want out of the main list.

## Add a news item

Create `src/content/news/YYYY-MM-DD-short-title.md` (the date prefix keeps files sorted
and slugs unique):

```markdown
---
title: Paper accepted at DATE 2026
date: 2026-01-15
author: mario-rossi                # optional
category: Publication              # optional short label
summary: One or two sentences shown in the list.
image: ./photo.jpg                 # optional; imageAlt is then required
imageAlt: …
people: [mario-rossi]              # optional
projects: [acronym-slug]           # optional
research: [design-automation]      # optional
lang: en                           # en | it
legacyId: 31                       # optional (/news/31/)
---

Body in Markdown.
```

Slugs of news items must not be purely numeric (numbers are reserved for old ids).

## Publications

The bibliography is **one BibTeX file**: `src/data/publications.bib`. Add or edit
entries there (DBLP's "export → BibTeX" is the reference format; keys such as
`DBLP:conf/date/Rossi26` automatically get a DBLP link). Each entry needs a key,
`title`, `author` and `year`; `journal`/`booktitle`, `pages`, `volume`, `number`,
`doi` (or a `doi.org` url) are used when present. LaTeX accents are decoded; UTF-8 is
fine too.

Per-publication extras go into `src/data/publications.overrides.yaml`, keyed by the
BibTeX key:

```yaml
DBLP:conf/date/Rossi26:
  featured: true                        # shown on the home page
  pdf: /documents/papers/rossi26.pdf    # file under public/documents/ or an https URL
  code: https://github.com/esd-univr/…
  projects: [acronym-slug]
  research: [design-automation]
  people: [mario-rossi]                 # only if the author name does not match automatically
  hidden: true                          # keep the entry but never show or export it
```

Author names are matched to people automatically (`Mario Rossi`, `M. Rossi`, accents
ignored); add `aliases` to a person's file for other spellings. The site also serves
the visible bibliography at `/publications.bib`.

## Images and documents

- Content images (photos, logos, project/news pictures): next to the Markdown file or
  in `src/assets/`; they are optimised and resized at build time.
- Downloadable PDFs and files that must keep a fixed URL: `public/documents/…` and
  link to them as `/documents/…`.
- Legacy files that must stay at their old `/media/...` address: `public/media/…`.
- Independent static sites: `public/wg10-5/` and `public/essm-workshop/` are copied
  unchanged to `/wg10-5/` and `/essm-workshop/`.

Never add photos or documents of people without their agreement.

## Institutional information and branding

`src/data/site.ts` holds the group name, mission text, department, address and footer
links. `site.brand` has slots for the official logo, favicon and social preview image;
put approved files under `public/images/brand/` and reference them there.

## Checks before pushing

```bash
npm run ci
```

runs `astro check` (templates and schemas), the unit tests, the production build, the
fixture build and `scripts/verify.mjs` (no forbidden files, all routes present, no
broken internal links, heading structure, no third-party scripts, passthrough of the
legacy trees). Fix everything it reports; CI runs the same commands.

## What must never be committed

See `SECURITY.md`: databases, dumps, archives, `.env` files, credentials, password
hashes, logs, migration scratch material, private contact details or documents. The
verification script rejects the common file types automatically.
