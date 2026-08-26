# CISD — Cyber-Physical and IoT Systems Design · University of Verona

Static website of **CISD**, which brings together three research groups at the Department of
Engineering for Innovation Medicine of the University of Verona:

- **ESD** — Electronic Systems Design
- **PARCO** — PARCO Lab (parallel and heterogeneous computing)
- **IoT4Care** — Internet of Things 4 Care

One site, one design, one deployment: group membership is metadata on people, projects,
research topics and news, not a set of separate mini-sites.

GitHub Pages URL: <https://esd-univr.github.io/>. This site is intended to replace the former
dynamic CISD web application (`cisd.di.univr.it`) once the migration is approved. This first
version is a **curated** selection of content; `docs/migration-map.md` records where it came
from.

The site is **completely static**: no database, no server-side code, no login. Content is
plain Markdown, YAML and BibTeX under `src/`, built with [Astro](https://astro.build) into
HTML, CSS, a little JavaScript and optimised images.

## Prerequisites

- Node.js **24 LTS** (see `.nvmrc`; anything ≥ 22.12 works) and npm ≥ 9.
- Git.

## Commands

| Command | What it does |
| ------- | ------------ |
| `npm ci` | Install the exact dependencies from `package-lock.json`. |
| `npm run dev` | Development server (<http://localhost:4321>), reloads on save. |
| `npm run build` | Production build into `dist/`. |
| `npm run preview` | Serve `dist/` locally. |
| `npm run check` | Astro + TypeScript checks (templates, schemas, types). |
| `npm test` | Unit tests: BibTeX reader, publication helpers, people grouping, legacy paths, content invariants. |
| `npm run verify` | Repository hygiene and built-site checks (see `scripts/verify.mjs`). |
| `npm run ci` | Everything CI runs, in order. |

Before pushing: `npm run ci` must pass.

## Repository structure

```
astro.config.ts            site URL, sitemap, image defaults
src/content.config.ts      schema of every content type, validated at build time
src/data/
  groups.yaml              the three CISD groups
  research.yaml            research topics, each assigned to a group
  publications.bib         curated bibliography (BibTeX)
  publications.overrides.yaml   featured / project links / PDFs
  site.ts                  name, mission, department, address, footer links
src/content/               one Markdown file per record
  people/  projects/  news/
src/pages/                 routes (see below) — no content lives here
src/layouts/               HTML shell, inner-page layout, legacy-redirect stub
src/components/            lists and small building blocks
src/styles/                tokens.css (design tokens) + base.css (global styles)
src/lib/                   plain TypeScript helpers (BibTeX, publications, people, legacy URLs)
src/loaders/publications.ts   turns publications.bib into a collection
public/                    copied verbatim: robots.txt, .nojekyll
docs/migration-map.md      provenance of the published content
scripts/verify.mjs         quality gate used by CI
tests/                     unit tests (node --test)
.github/workflows/         ci.yml (checks) and deploy.yml (GitHub Pages)
MAINTENANCE.md             how to add or change content — start here
SECURITY.md                what must never be committed
```

## Routes

| URL | Source |
| --- | ------ |
| `/` | `src/pages/index.astro` |
| `/research/` | `src/pages/research/index.astro` (groups and their topics, anchors `#esd`, `#parco`, `#iot4care`) |
| `/people/`, `/people/<slug>/` | `src/pages/people/` |
| `/projects/`, `/projects/<slug>/` | `src/pages/projects/` |
| `/publications/`, `/publications.bib` | `src/pages/publications/`, `src/pages/publications.bib.ts` |
| `/news/`, `/news/<slug>/` | `src/pages/news/` |
| `/contacts/` | `src/pages/contacts.astro` |
| `/404.html` | `src/pages/404.astro` |
| `/profile/<id>/`, `/project/<id>/`, `/news/<id>/` | legacy compatibility stubs, generated from `legacyId` |
| `/area/<id>/` | legacy compatibility stubs → the group's section on `/research/` |
| `/news-list/`, `/areas/` | legacy compatibility stubs (`src/pages/news-list.astro`, `areas.astro`) |
| `/sitemap-index.xml`, `/robots.txt` | generated / `public/` |

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`: install, check, test, build,
verify, upload `dist/`, deploy with `actions/deploy-pages`. The repository's Pages source
must be set to **GitHub Actions** (Settings → Pages). Pull requests run
`.github/workflows/ci.yml` only. No custom domain or `CNAME` is configured.

## Design notes

Plain CSS with custom properties (`src/styles/tokens.css`), self-hosted IBM Plex fonts
(bundled at build, no third-party requests), an editorial layout built from lists and rules
rather than cards, and a single accent colour. Navigation is plain links and works without
JavaScript; the only script is an optional text filter on the publications page. Official
CISD / University of Verona brand assets are not included yet — `site.brand` in
`src/data/site.ts` has the slots for them.
