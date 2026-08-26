# Maintaining the CISD website

Everything on the site comes from a handful of text files under `src/`. You never edit
templates to change content. Work on a branch, run `npm run ci`, open a pull request; the
site deploys automatically once the change reaches `main`.

```bash
npm ci               # once, after cloning
npm run dev          # http://localhost:4321 — reloads on save
npm run ci           # before pushing: checks, tests, build, verification
```

If something is wrong the build stops and names the file and the field, for example
`people/mario-rossi.md → role: Required`. Fix it and run again.

## Which file do I edit?

| To change | Edit |
| --- | --- |
| A person (role, links, bio, photo) | `src/content/people/<slug>.md` |
| The groups (ESD, PARCO, IoT4Care) | `src/data/groups.yaml` |
| Research topics | `src/data/research.yaml` |
| A project | `src/content/projects/<slug>.md` |
| Publications | `src/data/publications.bib` (+ `publications.overrides.yaml`) |
| A news item | `src/content/news/YYYY-MM-DD-<slug>.md` |
| Address, mission, footer links | `src/data/site.ts` |

Every person, project, news item and research topic carries a `groups:` list naming the
groups it belongs to (`esd`, `parco`, `iot4care` — the ids in `groups.yaml`). That list is
what puts a person in the right section of the People page and labels projects and topics.
Something can belong to more than one group: `groups: [esd, iot4care]`.

File names are URLs: `src/content/people/mario-rossi.md` → `/people/mario-rossi/`. Use
lower-case letters, digits and hyphens. Files starting with `_` are ignored. Dates are
`YYYY-MM-DD`. Text after the `---` block is Markdown; headings inside a body start at `##`.

Records that existed on the old CISD site carry a `legacyId`, which generates the
compatibility page for the old numeric address (`/profile/12/` → `/people/franco-fummi/`).
Keep it when you edit a file; never add one yourself. `docs/migration-map.md` says where the
published records came from.

---

## Update someone's role or status

Open their file under `src/content/people/` and edit `role` (free text, shown next to the
name). To move somebody to another group, change `groups`. Nothing else needs touching.

## Add a person

Create `src/content/people/<given-family>.md`:

```markdown
---
name: Mario Rossi
role: PhD Student          # free text, shown next to the name
groups: [esd]              # esd | parco | iot4care (one or more)
order: 40                  # lower comes first inside the group (default 100)
interests: [Digital twins, Verification]   # optional
photo: ./mario-rossi.jpg   # optional, see below
website: https://…         # optional
orcid: 0000-0000-0000-0000 # optional
scholar: https://scholar.google.com/citations?user=…   # optional
dblp: https://dblp.org/pid/…                          # optional
github: mariorossi         # optional (user name or URL)
linkedin: https://www.linkedin.com/in/…               # optional
aliases: ["M. Rossi"]      # optional: other spellings used in publications.bib
---

One or two paragraphs of public biography (optional).
```

Only publish institutional, already-public information. Do not add telephone numbers,
office numbers, private addresses or CVs. `email` exists but is left empty on this site.

## Remove a person

Delete their file. If they had a `legacyId`, the `/profile/<id>/` page disappears with it —
that is intended. Their publications stay in `publications.bib`; their name simply stops
being a link.

## Add or replace a photo

Put a JPEG or PNG next to the person's Markdown file and point `photo:` at it
(`photo: ./mario-rossi.jpg`). Roughly square, at least 480×480 px; it is cropped and
resized at build time. **Strip metadata (EXIF) before adding a photo**, and only publish a
portrait the person has agreed to. Without a photo the page shows their initials, which is
fine — the People page is designed to look right either way.

## Add a project / mark one completed

Create `src/content/projects/<slug>.md`:

```markdown
---
name: Full project title
acronym: ACRONYM           # optional
groups: [esd]
status: active             # active | completed
start: 2024-01-01
end: 2027-12-31            # optional
summary: One or two sentences shown in lists.
url: https://project-website          # optional
people: [mario-rossi]                 # slugs of people (optional)
funding:                              # optional
  programme: Horizon Europe
  funder: European Commission
  grant: "101000000"
featured: true             # optional: show on the home page
---

Full description in Markdown (optional).
```

When a project ends, set `status: completed` and fill in `end`. Funding **amounts** are not
part of the model and are not published.

## Edit the groups or the research topics

`src/data/groups.yaml` holds the three groups: name, acronym, one-sentence summary and the
order they appear in. `src/data/research.yaml` holds the topics, each with a `groups:` list,
a summary and an optional `details:` list of concrete subjects. Both files are plain lists —
add, edit or delete an entry and the Research page follows. Every group must keep at least
one topic (a test enforces it).

## Add a news item

Create `src/content/news/YYYY-MM-DD-short-title.md`:

```markdown
---
title: Paper accepted at DATE 2027
date: 2027-01-15
groups: [esd]
author: mario-rossi        # optional, the person posting
category: Publication      # optional short label
summary: One or two sentences shown in the list.
people: [mario-rossi]      # optional
projects: [strategus]      # optional
image: ./photo.jpg         # optional; imageAlt is then required
imageAlt: What the photo shows
lang: en                   # en | it
---

Body in Markdown.
```

## Refresh publications

The bibliography is one file: `src/data/publications.bib`. Every entry must have a key, a
`title`, an `author` (or `editor`) and a `year`; `journal`/`booktitle`, `pages`, `volume`,
`number`, `doi` and `url` are used when present.

To add a paper, open its DBLP record, choose *export record → BibTeX*, and paste the entry
under the right year. Keys of the form `DBLP:conf/date/Rossi27` automatically get a DBLP
link on the site.

Author names are matched to people automatically (`Mario Rossi`, `M. Rossi`, accents
ignored); add `aliases` to a person's file for other spellings. A test checks that every
entry has at least one author who is listed under People — the bibliography is a curated
selection, not a complete archive.

Per-entry extras go into `src/data/publications.overrides.yaml`:

```yaml
DBLP:conf/date/Rossi27:
  featured: true                     # shown in "Selected publications" on the home page
  projects: [strategus]              # link the entry to a project page
  pdf: /documents/papers/rossi27.pdf # file under public/documents/ or an https URL
  code: https://github.com/esd-univr/…
  people: [mario-rossi]              # only if automatic name matching fails
  hidden: true                       # keep the entry but never show or export it
```

The site also serves the visible bibliography at `/publications.bib`.

## Preview and deploy

```bash
npm run dev       # local preview at http://localhost:4321
npm run build     # production build into dist/
npm run preview   # serve the built site
npm run ci        # what CI runs: check, tests, build, verify
```

Pushing to `main` builds and deploys the site with
`.github/workflows/deploy.yml`. Pull requests run the same checks without deploying.

## Downloadable files

- Images that belong to a page: next to its Markdown file; they are optimised at build time.
- PDFs and files that need a fixed URL: `public/documents/…`, linked as `/documents/…`.

Never publish documents or photographs of people without their agreement.

## What must never be committed

See `SECURITY.md`: databases, dumps, archives, `.env` files, credentials, logs, migration
scratch material, private contact details or documents. `npm run verify` rejects the common
file types automatically.
