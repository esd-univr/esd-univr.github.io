# AGENTS.md — instructions for coding agents

Authoritative rules for any AI coding agent working in this repository. Read this file
first, then read the guide(s) that the routing table below assigns to your task. Do not
start editing before you have read them.

## What this repository is

The static website of **CISD** (Cyber-Physical and IoT Systems Design) at the University
of Verona, covering three research groups: **ESD**, **PARCO** and **IoT4Care**.

- Astro builds Markdown, YAML and BibTeX into static HTML, CSS and optimised images.
- There is **no backend, no database, no CMS, no login, no runtime Python**. Nothing on
  the deployed site executes on a server.
- The site is deployed to GitHub Pages from `main`. `dist/` is generated, never edited.
- The content is a **curated** selection, not a dump of the legacy CISD application it
  replaces. `docs/migration-map.md` records what was published and what was not.

## Principles

1. **A content change touches content files.** Editing a person, project, topic,
   publication, news item or student opportunity means editing files under `src/content/`
   or `src/data/` — nothing else.
2. **Do not refactor while doing editorial work.** No renames, no restructuring, no
   dependency bumps, no CSS tidying as a side effect of adding a person.
3. **Never invent academic or personnel information.** Roles, titles, affiliations,
   dates, grant numbers, funders and publication metadata must come from a source the
   requester gave you or from a record already in the repository.
4. **Prefer omission over an unsupported claim.** Every field except the required ones
   is optional, and the design is built to look right with fields missing. Leaving a
   field out is always better than guessing its value.
5. **Never reintroduce legacy server baggage.** No Django, no database, no dumps, no
   media trees, no authentication, no admin routes, no migration scratch material.
6. **The build is the safety net, not a formality.** `npm run ci` must pass before you
   report that work is done.

## Mandatory documentation routing

Find your task, read every guide listed for it, then act.

| Task | You MUST read |
| --- | --- |
| Add, update or remove a person; add or replace a portrait | `docs/people.md`, `docs/content-safety.md` |
| Add or update a project | `docs/projects.md`, `docs/content-safety.md` |
| Add, edit, close or remove a student opportunity (thesis / project / internship proposal) | `docs/opportunities.md`, `docs/content-safety.md` |
| Edit CISD groups or research topics | `docs/research.md` |
| Add or update publications | `docs/publications.md` |
| Add or update news | `docs/news.md`, `docs/content-safety.md` |
| Edit mission, affiliation, address, branding or theme | `docs/site-settings.md` |
| Change a colour, type size, spacing step, layout, component or stylesheet | `docs/design-system-integration.md`, `docs/site-settings.md` |
| Deployment, GitHub Pages, custom domain, CI | `docs/deployment.md` |
| Anything involving legacy ids or legacy data | `docs/migration-map.md`, `docs/content-safety.md` |
| Anything touching photographs, documents or personal data | `docs/content-safety.md`, `SECURITY.md` |

If your task spans several rows, read all of them. If your task matches no row, it is
probably not an editorial task — say so before changing anything.

## Hard rules

**Scope**

- A content-only request MUST NOT modify components, layouts, routes, schemas,
  dependencies or CSS unless the request is technically impossible without it. If it is,
  say so and explain why before doing it.
- Never perform a broad refactor as a side effect of adding content.
- Never change the layout, the visual design, the research taxonomy, the group
  membership of a record, or the selection of projects, publications and news unless
  that is precisely what was asked for.
- Never bump dependency versions unless the task is a dependency update.

**People and personal data**

- Never crawl the web to add people, publications or projects automatically unless you
  are explicitly asked to.
- Never infer group membership from a department affiliation. Being at DIMI does not make
  somebody a member of ESD, PARCO or IoT4Care. Membership is stated by a human.
- Never add a person because they existed in the legacy database. The roster is curated;
  absence is deliberate.
- Never publish a photograph, e-mail address, telephone number, office number, private
  address, CV or any other personal datum that the requester has not explicitly approved.
  See `docs/content-safety.md`.
- Never commit dumps, credentials, authentication data, log files or anything from the
  private migration work area. `SECURITY.md` lists what is forbidden; `npm run verify`
  rejects the common cases.

**Opportunities**

- Adding, editing, closing or removing an opportunity is **one Markdown file** under
  `src/content/opportunities/`. Agents MUST NOT modify a layout, a component, a route or
  the schema while doing it — unless the requested content genuinely cannot be represented
  by the documented schema, in which case say so and explain why before changing anything.
- The vocabulary of `areas:` is the research taxonomy in `src/data/research.yaml`. Never
  invent an area, and never edit `research.yaml` to make one proposal fit.
- Never publish a legacy thesis or stage proposal. The 11 proposals on the old site are
  historical source material awaiting human review; none of them is approved.
- Never put an e-mail address, a telephone number or a student's name in a proposal.

**Legacy ids**

- `legacyId` maps an old numeric URL to a new page. **Preserve it** when you edit an
  existing migrated record.
- **Never invent a `legacyId`** for a new record. A new person, project, news item or
  opportunity has no legacy address, so it gets no `legacyId`.

**Finishing**

- Run `npm run ci` (checks, unit tests, production build, verification) and report the
  real result. Do not claim success you have not observed.
- Work on a branch and open a pull request unless you were explicitly told otherwise.
- **Never push to `main` directly** unless you were explicitly instructed to.
- Do not commit unless you were asked to commit.

## The page contract

Every page is **one opening block plus its own content, and nothing else.** The opening is
`PageLayout`'s header, or the home hero. Breaking any of the rules below produces pages
whose titles do not line up, which is the defect this contract exists to prevent.

1. **The opening carries its own `.container`.** Never nest a `.container` inside another
   `.container` — it doubles the gutter and pushes the title further right than on every
   other page. That was a real bug on the Projects / News fallback.
2. **Never give the opening padding.** Its spacing is the single `.page-open` rule in
   `src/styles/base.css`, and the title's size and measure are `.page-open h1`. If an
   opening looks wrong, fix that rule — never a page.
3. **The width travels with both blocks.** If the content uses `container--wide`, the
   opening takes `wide` too. `PageLayout`'s `width` prop does this for you.
4. **A new page adds content, not a frame.** If two pages need the same block it belongs
   in `src/components/`, never copied into both.
5. **Detail pages take their frame from the shared layout** and supply only their metadata
   rows. A new entity type is a data mapping, not a new layout.

**The test, and it is not optional:** `main h1` sits at the same left offset on every page.
Check it before calling any layout work done.

Two related rules that live in the same layer:

- **Group colour is claimed, never passed.** A subtree sets `data-group="esd|parco|iot4care"`
  and everything inside that already paints with `--color-accent` follows. **Never add a
  colour prop to a component**, and never let colour carry meaning alone — the acronym or
  the group name is always present beside a coloured element.
- **Density is not a user control.** `data-density="compact"` is set once on `<html>` by
  whoever builds the surface. Do not add a toggle for it.

## Where things are

| Path | What lives there |
| --- | --- |
| `src/content/people/` | One Markdown file per person, plus their portrait image |
| `src/content/projects/` | One Markdown file per project |
| `src/content/news/` | One Markdown file per news item, `YYYY-MM-DD-<slug>.md` |
| `src/content/opportunities/` | One Markdown file per thesis / project / internship proposal |
| `src/data/` | `groups.yaml`, `research.yaml`, `publications.bib`, `publications.overrides.yaml`, `site.ts` |
| `src/content.config.ts` | The schema of every content type — the definition of which fields exist |
| `src/pages/` | Routes. No content lives here |
| `src/layouts/`, `src/components/` | HTML shell and building blocks |
| `src/styles/` | `tokens.css` (design tokens) and `base.css` |
| `src/lib/`, `src/loaders/` | Plain TypeScript helpers (BibTeX, publications, people, legacy URLs) |
| `public/` | Files copied verbatim into the build (`robots.txt`, `documents/…`) |
| `scripts/verify.mjs` | Repository and built-site verification, run by CI |
| `tests/` | Unit tests and content invariants (`node --test`) |
| `docs/` | The task guides listed above |

`src/content.config.ts` is the source of truth for which fields a record may have. If a
guide and the schema disagree, the schema wins — and fix the guide.

## Commands

```bash
npm ci        # install exactly what package-lock.json says
npm run dev   # local preview on http://localhost:4321
npm run ci    # check + unit tests + production build + verification
```
