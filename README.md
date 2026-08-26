# CISD — Cyber-Physical and IoT Systems Design · University of Verona

Static website of **CISD**, which brings together three research groups at the Department of
Engineering for Innovation Medicine of the University of Verona:

- **ESD** — Electronic Systems Design
- **PARCO** — PARCO Lab (parallel and heterogeneous computing)
- **IoT4Care** — Internet of Things 4 Care

One site, one design, one deployment: group membership is metadata on people, projects,
research topics and news, not a set of separate mini-sites.

Live at <https://esd-univr.github.io/>.

## Updating the site

Content lives in plain text files. You never edit a template or write code to change what
the site says. Find your task, open the guide, follow it.

| I want to… | Read |
| --- | --- |
| Add or edit a person / portrait | [docs/people.md](docs/people.md) |
| Add or edit a project | [docs/projects.md](docs/projects.md) |
| Add, close or edit a thesis / project / internship proposal | [docs/opportunities.md](docs/opportunities.md) |
| Edit groups or research topics | [docs/research.md](docs/research.md) |
| Add a publication | [docs/publications.md](docs/publications.md) |
| Add news | [docs/news.md](docs/news.md) |
| Change mission / affiliation / branding / theme | [docs/site-settings.md](docs/site-settings.md) |
| Preview or deploy | [docs/deployment.md](docs/deployment.md) |
| Publish anything about a person, or a photograph | [docs/content-safety.md](docs/content-safety.md) |

The short version of every guide:

```bash
npm ci               # once, after cloning
npm run dev          # http://localhost:4321 — reloads as you save
npm run ci           # before pushing: checks, tests, build, verification
```

Work on a branch and open a pull request. Merging into `main` deploys the site
automatically.

If something is wrong the build stops and names the file and the field, for example
`people/mario-rossi.md → role: Required`. Fix it and run again.

Using an AI coding agent? Point it at [AGENTS.md](AGENTS.md) — it routes the agent to the
right guide and lists the rules it must not break.

## How it is built

The site is **completely static**: no database, no server-side code, no login. Content is
Markdown, YAML and BibTeX under `src/`, built with [Astro](https://astro.build) into HTML,
CSS, a little JavaScript and optimised images.

Node.js **24** (see `.nvmrc`; anything from 22.12 works) and npm ≥ 9.

| Command | What it does |
| --- | --- |
| `npm ci` | Install the exact dependencies from `package-lock.json` |
| `npm run dev` | Development server on <http://localhost:4321> |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve `dist/` locally |
| `npm run check` | Astro + TypeScript checks (templates, schemas, types) |
| `npm test` | Unit tests and content invariants |
| `npm run verify` | Repository hygiene and built-site checks |
| `npm run strip-metadata <file…>` | Remove EXIF/GPS/IPTC/XMP from an image, losslessly |
| `npm run ci` | Everything CI runs, in order |

### Repository structure

```
astro.config.ts            site URL, sitemap, image defaults
src/content.config.ts      schema of every content type, validated at build time
src/data/
  groups.yaml              the three CISD groups
  research.yaml            research topics, each assigned to a group
  publications.bib         curated bibliography (BibTeX)
  publications.overrides.yaml   featured / project links / PDFs
  site.ts                  name, mission, department, address, footer links
src/content/               one Markdown file per record (+ portraits next to people)
  people/  projects/  news/  opportunities/
src/pages/                 routes — no content lives here
src/layouts/               HTML shell, inner-page layout, legacy-redirect stub
src/components/            lists and small building blocks
src/styles/                tokens.css (design tokens) + base.css (global styles)
src/lib/                   plain TypeScript helpers (BibTeX, publications, people, legacy URLs)
src/loaders/publications.ts   turns publications.bib into a collection
public/                    copied verbatim: robots.txt, .nojekyll
scripts/                   verify.mjs (CI quality gate), strip-image-metadata.mjs
tests/                     unit tests and content invariants (node --test)
docs/                      the task guides linked above
AGENTS.md                  rules for AI coding agents
MAINTENANCE.md             pointer to docs/
SECURITY.md                what must never be committed
```

### Routes

| URL | Source |
| --- | --- |
| `/` | `src/pages/index.astro` |
| `/research/` | `src/pages/research/index.astro` (anchors per group, `#esd`, and per topic, `#electronic-design-automation`) |
| `/people/`, `/people/<slug>/` | `src/pages/people/` |
| `/projects/`, `/projects/<slug>/` | `src/pages/projects/` |
| `/opportunities/`, `/opportunities/<slug>/` | `src/pages/opportunities/` |
| `/publications/`, `/publications.bib` | `src/pages/publications/`, `src/pages/publications.bib.ts` |
| `/news/`, `/news/<slug>/` | `src/pages/news/` |
| `/contacts/` | `src/pages/contacts.astro` |
| `/404.html` | `src/pages/404.astro` |
| `/profile/<id>/`, `/project/<id>/`, `/news/<id>/`, `/area/<id>/` | legacy compatibility stubs, generated from `legacyId` |
| `/news-list/`, `/areas/` | legacy compatibility stubs |
| `/sitemap-index.xml`, `/robots.txt` | generated / `public/` |

### Design

Plain CSS with custom properties (`src/styles/tokens.css`), self-hosted IBM Plex fonts
(bundled at build, no third-party requests), and an editorial layout built from lists and
rules rather than cards. Deep navy and indigo, in a **light and a dark theme**: the site
follows the operating system by default and the toggle in the masthead overrides it. Long
prose stays at a readable measure while structured sections use the full width of a large
screen. Navigation is plain links and works without JavaScript; the only scripts are the
inline theme switch, an optional text filter on the publications page and optional filters
on the opportunities page. Official CISD /
University of Verona brand assets are not included yet — `site.brand` in
`src/data/site.ts` has the slots for them.

### Provenance

This site replaces the former dynamic CISD web application (`cisd.di.univr.it`). The first
version is a **curated** selection of that content: [docs/migration-map.md](docs/migration-map.md)
records what was published, which old addresses still work, and what was deliberately left
out.
