# Opportunities

`/opportunities/` and every `/opportunities/<slug>/` page come from one directory:

```
src/content/opportunities/
  digital-twin-maintenance.md
  _README.md      ignored by the site
```

**One Markdown file per proposal. The file name is the public address.**
`src/content/opportunities/digital-twin-maintenance.md` is published at
`/opportunities/digital-twin-maintenance/`.

Adding a proposal is:

```bash
# 1. write one Markdown file under src/content/opportunities/
npm run ci          # 2. checks, unit tests, production build, verification
# 3. commit on a branch and open a pull request
```

No template, no component, no schema and no index is touched. If you find yourself
editing anything outside `src/content/opportunities/`, stop and read
["When the schema is not enough"](#when-the-schema-is-not-enough).

## What an opportunity is

A proposal addressed to **students**: something they can come and do with one of the CISD
groups. Three kinds, all in this one section:

| `type` | What it means |
| --- | --- |
| `thesis` | A Bachelor's or Master's thesis subject. |
| `project` | A **student** project — a course project, a small supervised activity. Not a funded research project; those live in `src/content/projects/` and are documented in `docs/projects.md`. |
| `internship` | An internship or *stage*. |

The degree level is a separate field, because it is a separate question: a subject may
suit a Bachelor's student, a Master's student, or both.

This is not a course catalogue, an exam page or a list of open positions for staff. A
post-doc or PhD vacancy is news, not an opportunity.

## File names and slugs

- Lower-case letters, digits and hyphens: `digital-twin-maintenance.md`, `opc-ua-server.md`.
- Short and about the subject, not the full title. Three or four words is plenty.
- Never purely numeric — numeric addresses are reserved for legacy compatibility pages.
- The file name is a URL, so renaming a published proposal changes a public address.
- Files whose name starts with `_` are ignored.

## Fields

Required: `title`, `summary`, `type`, `levels`, `status`, `posted`, `groups`, `areas`,
`activities`, `supervisors`, `workload`.

| Field | Type | What it is |
| --- | --- | --- |
| `title` | text | The proposal's title, as a student would read it. |
| `summary` | text | One or two sentences. Shown in every list and used as the page description. Do not repeat the body. |
| `type` | `thesis` \| `project` \| `internship` | See the table above. |
| `levels` | list | One or more of `bachelor`, `master`. |
| `status` | `open` \| `paused` \| `closed` | Drives the section a proposal lands in. |
| `posted` | date | `YYYY-MM-DD`. Sorts the list, newest first, and shows a student how fresh the proposal is. |
| `groups` | list | One or more of `esd`, `parco`, `iot4care`. |
| `areas` | list | Research topic ids from `src/data/research.yaml`. See [Areas](#areas). |
| `activities` | list | What the student will actually do. See [Activities](#activities). |
| `supervisors` | list | Slugs of people (`src/content/people/<slug>.md`). At least one. |
| `workload.duration` | text | Free text, e.g. `4–6 months`. Must not be empty. |
| `workload.intensity` | `light` \| `moderate` \| `substantial` | Expected effort. |
| `credits` | integer | CFU, **only** where the number is genuinely established. Omit otherwise. |
| `prerequisites` | list | Short items: `Programming`, `Basic modelling knowledge`. |
| `tools` | list | Technologies and platforms: `Python`, `Modelica`, `SystemC`. |
| `language` | `en` \| `it` | Language of the title, summary and body. Default `en`. |
| `featured` | boolean | `true` shows it on the home page. Only allowed while `status: open`. Default `false`. |
| `legacyId` | integer | Only on a proposal migrated from the old site. See [`legacyId`](#legacyid). |

The authoritative list is the `opportunities` schema in `src/content.config.ts`, and the
vocabularies it validates against live in `src/lib/opportunities.ts`.

**There is no contact field, by decision.** Supervisors are already linked to their People
pages; that is where a student finds how to reach them. Never put an e-mail address or a
telephone number in a proposal — `npm test` rejects both.

### Areas

`areas` names **research topics that already exist**, by their id in
`src/data/research.yaml`. There is no separate list of subject labels to keep in step:

```yaml
areas:
  - digital-twins-and-smart-manufacturing
  - embedded-and-cyber-physical-systems
```

renders as *Digital Twins and Smart Manufacturing · Embedded and Cyber-Physical Systems*,
each linking to that topic on `/research/`. The ids available today:

| Id | Group |
| --- | --- |
| `electronic-design-automation` | ESD |
| `embedded-and-cyber-physical-systems` | ESD |
| `modelling-simulation-and-verification` | ESD |
| `digital-twins-and-smart-manufacturing` | ESD |
| `parallel-and-heterogeneous-computing` | PARCO |
| `iot-for-health-and-wellbeing` | IoT4Care |

An unknown id fails the build. A proposal may name a topic belonging to another group —
`areas` says what the work is about, `groups` says who is offering it.

If a proposal genuinely belongs to a subject the Research page does not cover, that is a
decision about the research taxonomy, not about one proposal: read `docs/research.md` and
raise it with the group, rather than inventing a label here.

### Activities

`activities` is what a student would be **doing** — the field most likely to make them
open the proposal or move on. Pick from this closed list, exactly as spelled:

`Software Development` · `Hardware Design` · `Modelling` · `Simulation` ·
`Formal Verification` · `Experimental Evaluation` · `Data Analysis` · `Machine Learning` ·
`Literature Review` · `Benchmarking`

Two or three are usually right. Listing eight says nothing.

### Workload

The list page has to convey effort without pretending to a precision that does not exist.

```yaml
workload:
  duration: 4–6 months
  intensity: substantial
```

- `duration` is free text because thesis timing varies: `4–6 months`, `one semester`,
  `2–3 months, part-time`. Write what is realistic, not what is flattering.
- `intensity` is one of `light`, `moderate`, `substantial`. Roughly: `light` is a small
  supervised activity alongside coursework, `moderate` is a serious project, `substantial`
  is full thesis work.
- **Do not invent hours.** There is no field for them.
- `credits` is optional and should stay empty unless the CFU count is actually fixed by a
  study plan. A wrong number is worse than none.

## Add a thesis proposal

Minimal Bachelor's thesis — every required field and nothing else:

```markdown
---
title: Radio-Signal Sensing of Room Occupancy
summary: "Use the propagation patterns of ordinary WiFi and Bluetooth signals to tell whether a room is occupied, and by how many people."
type: thesis
levels: [bachelor]
status: open
posted: 2026-09-01
groups: [iot4care]
areas: [iot-for-health-and-wellbeing]
activities: [Data Analysis, Machine Learning]
supervisors: [graziano-pravadelli]
workload:
  duration: 3–4 months
  intensity: moderate
---

## Context

One or two paragraphs on the setting and why it matters.

## What you will do

The concrete work, as a short list or a paragraph.
```

Master's thesis, with the optional fields filled in:

```markdown
---
title: Digital Twin for Predictive Maintenance
summary: "Build a hierarchical digital twin of a production line and use it to predict when a machine needs servicing."
type: thesis
levels: [master]
status: open
posted: 2026-09-01
groups: [esd]
areas:
  - digital-twins-and-smart-manufacturing
  - embedded-and-cyber-physical-systems
activities:
  - Modelling
  - Software Development
  - Experimental Evaluation
supervisors: [franco-fummi, francesco-biondani]
workload:
  duration: 4–6 months
  intensity: substantial
credits: 24
prerequisites:
  - Programming
  - Basic modelling knowledge
tools: [Python, Modelica]
language: en
featured: false
---

## Context

...
```

A student project, which may suit either level:

```markdown
---
title: Benchmarking GPU Kernels for Edge Inference
summary: "Port a small inference stack to an embedded GPU and measure where the time actually goes."
type: project
levels: [bachelor, master]
status: open
posted: 2026-09-01
groups: [parco]
areas: [parallel-and-heterogeneous-computing]
activities: [Software Development, Benchmarking]
supervisors: [nicola-bombieri]
workload:
  duration: 2–3 months
  intensity: moderate
tools: [CUDA, C++]
---
```

An internship is the same shape with `type: internship`.

## The body

The text after the closing `---` is the proposal itself, in Markdown. Headings start at
`##`. These sections work well, and **none of them is required** — use the ones you have
something to say about:

```markdown
## Context
## Objectives
## What you will do
## Suggested background
## Expected outcome
## References
```

Keep the frontmatter short and put the detail here. If a proposal has no body at all the
page still builds and shows the summary, but a student deserves more than two sentences.

Write in the language named by `language:`. A proposal in Italian is fine; set
`language: it` so the page marks it up correctly for screen readers and search engines.

## Close, pause and reopen

The status field is the whole mechanism — nothing is deleted and no address changes.

| Situation | Do |
| --- | --- |
| A student has taken the subject | `status: closed` |
| Temporarily not accepting anyone | `status: paused` |
| Available again | `status: open`, and update `posted:` to today |

- **Open** proposals lead the page and are the only ones that appear on a supervisor's
  People page or on the home page.
- **Paused** proposals stay visible in their own section, with a note on the page saying
  they are not accepting new students.
- **Closed** proposals move to a quiet *Past opportunities* section at the bottom and
  their page says so. The URL keeps working, so a link in an e-mail or a thesis
  registration form never breaks.

Setting `featured: true` on anything that is not open **fails the build** on purpose.

**Deleting** a proposal is also fine — `git rm src/content/opportunities/<slug>.md` — but
it breaks the URL. Prefer `closed` unless the proposal should never have been published.

## How supervisors are linked

`supervisors:` lists the slugs of files in `src/content/people/`, without the `.md`:

```yaml
supervisors: [franco-fummi, francesco-biondani]
```

A slug that does not exist fails the build. From that one list the site derives, with no
second list to maintain anywhere:

- the supervisor names under the proposal, each linking to their People page;
- the **Supervisors** block on the proposal's own page;
- an **Open opportunities** section on each supervisor's People page, which appears only
  when they have at least one open proposal and disappears again when they do not.

Never add an opportunity list to a person's Markdown file. There is no field for it.

Everyone who would actually supervise the work belongs here. Somebody who is merely
interested does not.

## How the filters work

`/opportunities/` offers four filters — Level, Type, Group and Activity — built from the
metadata of the published proposals:

- their **options are derived from what is actually published**, so a filter never offers
  a choice that would empty the list, and a filter with a single option is not shown at all;
- they are plain `<select>` controls with labels, usable from the keyboard;
- they are **progressive enhancement**. Without JavaScript the form stays hidden and the
  complete list is readable. Nothing on the page depends on a script.

You never configure them. Writing `groups: [parco]` in a file is what puts *PARCO Lab* in
the Group filter, and removing the last PARCO proposal takes it out again.

## `legacyId`

The former CISD site published proposals at `/thesis/<id>/details/`. `legacyId` records
that old number for a proposal migrated from it.

- **Never invent one.** A new proposal has no legacy address, so it gets no `legacyId`.
- None of the legacy proposals has been republished, so no opportunity carries one today
  and no `/thesis/…` compatibility route exists. If one is ever republished after review,
  its compatibility route is added at that point — see `docs/migration-map.md`.

## What not to publish

- **No contact details.** No e-mail addresses, no telephone numbers, no office numbers —
  not in the frontmatter, not in the body. Supervisors are linked to their People pages.
  `npm test` fails on both patterns. See `docs/content-safety.md`.
- **No student names.** Not the student who took the subject, not the one who is
  interested. "ASSIGNED: …" in a title is not how a subject is closed; `status: closed` is.
- **Nothing about a company that is not agreed.** A proposal run with an external partner
  may name them only if they have agreed to be named publicly.
- **No unpublished results, no confidential data, no internal system details.**
- **No invented supervisor.** Everybody in `supervisors:` must be a published person who
  has agreed to supervise.
- **No stale proposal left open.** A proposal nobody would accept today should be `closed`.
  `posted:` makes age visible; keep it honest rather than refreshing the date to look busy.

## When the schema is not enough

Adding a proposal must never require changing code. Two situations are different:

- **A subject the Research page does not cover** → a research-taxonomy decision.
  Read `docs/research.md`. Do not invent an area here.
- **An activity that is genuinely not in the list** → the vocabulary in
  `src/lib/opportunities.ts` gains one entry, `docs/opportunities.md` is updated to match,
  and that is a change in its own right, discussed and reviewed on its own. It is not
  something to slip into a pull request that adds a proposal.

Everything else — a new type of workload phrasing, more tools, a second group, an Italian
proposal — the current schema already handles.

## Validate

```bash
npm run dev    # http://localhost:4321/opportunities/
npm run ci     # checks, unit tests, production build, verification
```

`npm run ci` checks, among other things, that every controlled value is valid, that
supervisors and areas resolve to real records, that `workload.duration` is not empty, that
nothing closed is featured, that every proposal has its page, that each list row carries
the metadata the filter reads, and that an open proposal appears on the page of everyone
who supervises it.

A failure names the file and the field, for example
`opportunities/digital-twin-maintenance.md → activities: Invalid enum value`.

### While the section is empty

No proposal has been approved for publication yet, so `src/content/opportunities/`
contains only `_README.md`. Two consequences, both expected:

- `/opportunities/` shows its empty state, and no filter form is rendered.
- The build prints, once per page that reads the collection,
  `The collection "opportunities" does not exist or is empty.` That is Astro reporting an
  empty collection, not an error: the build succeeds and `npm run ci` passes. The message
  disappears with the first published proposal.

## See also

- `docs/people.md` — the slugs used in `supervisors:`
- `docs/research.md` — the topic ids used in `areas:`, and the group ids used in `groups:`
- `docs/projects.md` — funded research projects, which are a different thing
- `docs/content-safety.md` — what must never be published or committed
- `docs/migration-map.md` — what was published from the legacy site, and what was not
