# ESD — Electronic Systems Design · University of Verona

Static website of the **Electronic Systems Design (ESD)** research group,
Department of Computer Science, University of Verona.

Production URL: <https://esd-univr.github.io/> (GitHub Pages). It replaces the former
dynamic CISD web application (`cisd.di.univr.it`); the migration of its public content
is tracked outside this repository and happens in a later phase.

The site is **completely static**: no database, no server-side code, no login. Content
is plain Markdown/YAML/BibTeX under `src/`, built with [Astro](https://astro.build)
into HTML, CSS, a little JavaScript and optimised images.

## Prerequisites

- Node.js **24 LTS** (see `.nvmrc`; anything ≥ 22.12 works) and npm ≥ 9.
- Git.

## Commands

| Command | What it does |
| ------- | ------------ |
| `npm ci` | Install the exact dependencies from `package-lock.json`. |
| `npm run dev` | Start the development server (<http://localhost:4321>) with the real content. |
| `npm run dev:fixtures` | Same, with the sample content from `src/content-fixtures/` (see below). |
| `npm run build` | Production build into `dist/`. |
| `npm run build:fixtures` | Build the sample content into `dist-fixtures/` (layout smoke test). |
| `npm run preview` | Serve `dist/` locally. |
| `npm run check` | Astro + TypeScript checks (templates, schemas, types). |
| `npm test` | Unit tests of the BibTeX reader, publication helpers, people grouping, legacy paths. |
| `npm run verify` | Repository hygiene and built-site checks (see `scripts/verify.mjs`). |
| `npm run ci` | Everything CI runs, in order. |

Before pushing: `npm run ci` must pass.

## Repository structure

```
astro.config.ts            site URL, sitemap, image defaults
src/content.config.ts      schemas of the four content collections (validated at build)
src/content/               CONTENT — one Markdown file per record
  people/  research/  projects/  news/
src/data/
  publications.bib         canonical bibliography (BibTeX)
  publications.overrides.yaml   featured / PDF / code / project links / hidden flags
  site.ts                  group name, affiliation, address, footer links
src/pages/                 routes (see below) — no content lives here
src/layouts/               HTML shell, inner-page layout, legacy-redirect stub
src/components/            lists and small building blocks
src/styles/                tokens.css (design tokens) + base.css (global styles)
src/lib/                   plain TypeScript helpers (BibTeX, publications, people, legacy URLs)
src/loaders/               the loader that turns publications.bib into a collection
src/content-fixtures/      DEV-ONLY sample content; never deployed
public/                    copied verbatim: robots.txt, .nojekyll, future wg10-5/, essm-workshop/, media/
scripts/verify.mjs         quality gate used by CI
tests/                     unit tests (node --test)
.github/workflows/         ci.yml (checks) and deploy.yml (GitHub Pages)
MAINTENANCE.md             how to add or change content
SECURITY.md                what must never be committed
```

## Routes

| URL | Source |
| --- | ------ |
| `/` | `src/pages/index.astro` |
| `/research/`, `/research/<slug>/` | `src/pages/research/` |
| `/people/`, `/people/<slug>/` | `src/pages/people/` |
| `/projects/`, `/projects/<slug>/` | `src/pages/projects/` |
| `/publications/`, `/publications.bib` | `src/pages/publications/`, `src/pages/publications.bib.ts` |
| `/news/`, `/news/<slug>/` | `src/pages/news/` |
| `/contacts/` | `src/pages/contacts.astro` |
| `/404.html` | `src/pages/404.astro` |
| `/profile/<id>/`, `/area/<id>/`, `/project/<id>/`, `/news/<id>/` | legacy compatibility stubs, generated from `legacyId` fields |
| `/news-list/`, `/areas/` | legacy compatibility stubs (`src/pages/news-list.astro`, `src/pages/areas.astro`) |
| `/wg10-5/**`, `/essm-workshop/**` | independent static trees under `public/` (not yet imported) |
| `/sitemap-index.xml`, `/robots.txt` | generated / `public/` |

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`: install, check, test, build,
verify, upload `dist/`, deploy with `actions/deploy-pages`. The repository's Pages
source must be set to **GitHub Actions** (Settings → Pages). Pull requests run
`.github/workflows/ci.yml` only. No custom domain or `CNAME` is configured yet.

## Design notes

Plain CSS with custom properties (`src/styles/tokens.css`), self-hosted IBM Plex
fonts (bundled at build, no third-party requests), an editorial layout built from
lists and rules rather than cards, and a single accent colour. Navigation is plain
links and works without JavaScript; the only script is an optional text filter on
the publications page. Official ESD / University of Verona brand assets are not yet
included — `site.brand` in `src/data/site.ts` has the slots for them.
