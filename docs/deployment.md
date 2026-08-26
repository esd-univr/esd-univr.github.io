# Preview, build and deployment

## Requirements

- Node.js **24** (`.nvmrc`; anything from 22.12 works) and npm ≥ 9
- Git

```bash
git clone git@github.com:esd-univr/esd-univr.github.io.git
cd esd-univr.github.io
npm ci
```

Use `npm ci`, not `npm install`: it installs exactly what `package-lock.json` records,
which is what CI does.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server on <http://localhost:4321>, reloads on save |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run check` | Astro and TypeScript checks: templates, content schemas, types |
| `npm test` | Unit tests and content invariants (`node --test`) |
| `npm run verify` | Repository hygiene and built-site checks (`scripts/verify.mjs`) |
| `npm run strip-metadata <file…>` | Remove EXIF/GPS/IPTC/XMP from an image, losslessly |
| `npm run ci` | `check` → `test` → `build` → `verify`, in that order |

**`npm run ci` must pass before you open a pull request.** It is exactly what the CI
workflow runs, so a green run locally means a green run on GitHub.

`npm run verify` needs a build to inspect, so run it after `npm run build` (or just use
`npm run ci`).

### Reading a failure

The build names the file and the field:

```
people/mario-rossi.md → role: Required
```

`npm test` reports the record and the problem:

```
people/IMG_1234.jpg: no person record "IMG_1234.md" — a portrait must be named after the person's slug
```

`npm run verify` lists every problem it found and exits non-zero:

```
✗ dist/people/index.html: broken internal reference /people/mario-rossi/
```

## Workflow

1. Branch: `git switch -c content/add-mario-rossi`.
2. Edit the content files.
3. `npm run dev` and look at the pages you changed.
4. `npm run ci`.
5. Commit, push the branch, open a pull request.
6. CI runs `.github/workflows/ci.yml` on the pull request: install, check, test, build,
   verify. No deployment happens from a pull request.
7. Merge. The push to `main` deploys.

**Never push directly to `main`.** The deployment is automatic, so a bad push is live within
a couple of minutes.

## How the deployment works

`.github/workflows/deploy.yml` runs on every push to `main` (and on manual dispatch):

1. `npm ci`
2. `npm run check`, `npm test`, `npm run build`, `npm run verify`
3. upload `dist/` as a Pages artifact (`actions/upload-pages-artifact`)
4. deploy it with `actions/deploy-pages`

If any step fails, nothing is deployed and the previous version stays up.

The two jobs are split so the build job only needs `contents: read`; the `pages: write` and
`id-token: write` permissions belong to the deploy job alone.

Concurrency group `pages` with `cancel-in-progress: false`: deployments queue rather than
cancel each other, so two quick merges both reach production in order.

### Repository settings this depends on

- **Settings → Pages → Build and deployment → Source: GitHub Actions.** Not "Deploy from a
  branch". If it is ever switched back, the workflow succeeds and the site does not change.
- The `github-pages` environment exists (GitHub creates it on the first deployment).

Nothing else about the repository settings matters to the build.

## URL and domain

- The site is served at <https://esd-univr.github.io/> — an organisation Pages repository,
  so it lives at the domain root.
- `site: 'https://esd-univr.github.io'` in `astro.config.ts` is what canonical URLs, the
  sitemap and Open Graph URLs are built from.
- `build.format: 'directory'` produces `people/index.html`, so every URL ends with a slash,
  like the legacy site.
- `public/.nojekyll` stops GitHub from running Jekyll over the artifact.
- **No custom domain is configured.** There is no `CNAME` file.

### Moving to a custom domain

All four steps, or links break:

1. Set the DNS record with the university's DNS administrators (`CNAME` to
   `esd-univr.github.io` for a subdomain).
2. Settings → Pages → Custom domain, and enable *Enforce HTTPS*.
3. Add `public/CNAME` containing the bare domain, so the setting survives redeployment.
4. Change `site:` in `astro.config.ts` to the new origin.

Step 4 is the one that is easy to forget: `npm run verify` asserts that every canonical link
starts with `https://esd-univr.github.io/`, so it will fail until the check in
`scripts/verify.mjs` is updated too.

## Legacy addresses

Old numeric URLs keep working through static stub pages — a `<meta http-equiv="refresh">`, a
canonical link and `noindex` — because GitHub Pages cannot send HTTP redirects.

| Old | New |
| --- | --- |
| `/profile/<id>/` | the person's page |
| `/project/<id>/` | the project's page |
| `/news/<id>/` | the news item |
| `/area/<id>/` | the group's section of `/research/` |
| `/areas/`, `/news-list/` | `/research/`, `/news/` |

They are generated from the `legacyId` fields in the content, and excluded from the sitemap.
`npm run verify` fails if a `legacyId` has no stub, or if a stub points at a page that does
not exist. `docs/migration-map.md` is the record of which ids exist.

## What not to do

- Do not commit `dist/`. It is generated and git-ignored, and `npm run verify` rejects it.
- Do not edit files in `dist/`; the next build overwrites them.
- Do not add a deployment step, a hosting provider or a second workflow without agreeing it
  first.
- Do not make the build depend on a system binary. CI has Node and npm; anything else has to
  come from `package.json`.
- Do not bump dependency versions as part of a content change. Dependency updates are their
  own pull request, with `npm run ci` green.

## See also

- `docs/site-settings.md` — the site URL, brand assets and design tokens
- `docs/migration-map.md` — the legacy addresses that must keep working
- `SECURITY.md` — what must never be committed
