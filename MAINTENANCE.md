# Maintaining the CISD website

This file used to hold every procedure. They now live in focused guides under `docs/`, one
per task — that is where the details are kept up to date. This page only points you at the
right one.

## Which guide do I need?

| I want to… | Read |
| --- | --- |
| Add or edit a person, or add a portrait | [docs/people.md](docs/people.md) |
| Add or edit a project, mark one completed | [docs/projects.md](docs/projects.md) |
| Add a thesis / project / internship proposal, or close one | [docs/opportunities.md](docs/opportunities.md) |
| Edit the groups or the research topics | [docs/research.md](docs/research.md) |
| Add or refresh publications | [docs/publications.md](docs/publications.md) |
| Post a news item | [docs/news.md](docs/news.md) |
| Change the mission, affiliation, branding or theme | [docs/site-settings.md](docs/site-settings.md) |
| Preview, build, deploy, change the domain | [docs/deployment.md](docs/deployment.md) |
| Publish anything about a person, or a photograph | [docs/content-safety.md](docs/content-safety.md) |
| Understand where the migrated content came from | [docs/migration-map.md](docs/migration-map.md) |
| Know what must never be committed | [SECURITY.md](SECURITY.md) |

If you are an AI coding agent, read [AGENTS.md](AGENTS.md) first.

## The parts that apply to everything

**Where content lives.** Everything on the site comes from text files under `src/`:

| To change | Edit |
| --- | --- |
| A person (role, links, bio, portrait) | `src/content/people/<slug>.md` |
| The groups (ESD, PARCO, IoT4Care) | `src/data/groups.yaml` |
| Research topics | `src/data/research.yaml` |
| A project | `src/content/projects/<slug>.md` |
| Publications | `src/data/publications.bib` (+ `publications.overrides.yaml`) |
| A news item | `src/content/news/YYYY-MM-DD-<slug>.md` |
| A student opportunity | `src/content/opportunities/<slug>.md` |
| Address, mission, footer links | `src/data/site.ts` |

You never edit a template, a component or a route to change content.

**Groups.** Every person, project, research topic, news item and opportunity carries a `groups:` list
naming the groups it belongs to — `esd`, `parco`, `iot4care`, the ids in `groups.yaml`. That
list is what puts a person in the right section of the People page and labels projects and
topics. Something can belong to more than one: `groups: [esd, iot4care]`.

**File names are URLs.** `src/content/people/mario-rossi.md` → `/people/mario-rossi/`. Use
lower-case letters, digits and hyphens. Files starting with `_` are ignored. Dates are
`YYYY-MM-DD`, and a news file name must start with its own date. Text after the `---` block
is Markdown; headings inside a body start at `##`.

**`legacyId`.** Records that existed on the old CISD site carry one, and it generates the
compatibility page for the old numeric address (`/profile/12/` → `/people/franco-fummi/`).
Keep it when you edit a file; never add one yourself.

**Working on a change.**

```bash
npm ci               # once, after cloning
npm run dev          # http://localhost:4321 — reloads on save
npm run ci           # before pushing: checks, tests, build, verification
```

Work on a branch, run `npm run ci`, open a pull request. Merging into `main` deploys the
site automatically. If something is wrong the build stops and names the file and the field,
for example `people/mario-rossi.md → role: Required`.
