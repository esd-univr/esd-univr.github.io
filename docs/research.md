# Groups and research topics

Two YAML files describe what CISD is and what it works on:

```
src/data/groups.yaml      the three CISD groups
src/data/research.yaml    the research topics, each assigned to one or more groups
```

Both are plain lists. Add, edit or delete an entry and `/research/` follows.

## Why `groups.yaml` matters everywhere

The `id` of each group is the vocabulary used by the `groups:` field of every person,
project, research topic and news item, and it is the anchor on the Research page
(`/research/#esd`). The three ids are:

```
esd        Electronic Systems Design
parco      PARCO Lab
iot4care   Internet of Things 4 Care
```

Changing an `id` invalidates every record that names it and changes a public anchor.
Do not do it as part of an editorial task.

## `groups.yaml`

Required: `id`, `name`, `shortName`, `summary`, `order`.

| Field | Type | What it is |
| --- | --- | --- |
| `id` | slug | Lower-case identifier used in every `groups:` field and as the page anchor. |
| `name` | text | Full name, e.g. `Electronic Systems Design`. |
| `shortName` | text | Acronym used in labels and lists, e.g. `ESD`. |
| `summary` | text | One or two sentences, shown on the home page and on `/research/`. |
| `order` | integer | Display order. Must be unique across the file. |
| `legacyAreaId` | integer | Id of the group's page on the old site (`/area/<id>/`). Only on migrated groups. |
| `url` | URL | The group's own website, if it has one. |

```yaml
- id: esd
  name: Electronic Systems Design
  shortName: ESD
  order: 1
  legacyAreaId: 9
  summary: >-
    Design automation for electronic and cyber-physical systems: languages, models and
    tools for modelling, verification, testing and optimisation, from circuit level to
    smart manufacturing.
```

`>-` starts a folded block: write the summary over several lines, and YAML joins them into
one paragraph. Use it for anything longer than a few words — it keeps the file readable and
avoids quoting problems with colons and apostrophes.

**Every group must have at least one research topic.** A unit test enforces it, so a new
group needs its first topic in the same change.

## `research.yaml`

Required: `id`, `name`, `groups`, `order`, `summary`.

| Field | Type | What it is |
| --- | --- | --- |
| `id` | slug | Unique identifier, lower-case with hyphens. |
| `name` | text | Topic heading shown on `/research/`. |
| `groups` | list | One or more group ids. A topic shared by two groups appears in both sections. |
| `order` | integer | Order within a group, lower first. |
| `summary` | text | One or two sentences describing the topic. |
| `details` | list | Optional short list of concrete subjects, shown under the summary. |

```yaml
- id: digital-twins-and-smart-manufacturing
  name: Digital Twins and Smart Manufacturing
  groups: [esd]
  order: 4
  summary: >-
    Digital representations of production plants used to analyse timing, predict
    behaviour and optimise the line.
  details:
    - Digital twins of cyber-physical production systems
    - Scheduling and optimisation of production activities
    - Predictive maintenance
```

The minimum that builds:

```yaml
- id: my-new-topic
  name: My New Topic
  groups: [esd]
  order: 5
  summary: One or two sentences.
```

## Common edits

**Add a topic.** Append an entry to `src/data/research.yaml` with a unique `id` and an
`order` that puts it where you want it inside its group. Nothing else needs touching.

**Reorder topics.** Change `order:` within the group. Topics of different groups do not
compete: each group's list is ordered independently.

**Move a topic to another group.** Change `groups:`. To share it, list both ids:
`groups: [esd, parco]`.

**Rewrite a summary or the `details` list.** Edit in place. `details` entries are short
noun phrases, not sentences — no trailing full stops.

**Delete a topic.** Remove the entry, but check that its group still has one; the tests
fail otherwise.

**Change a group's description.** Edit `summary` in `groups.yaml`. It appears both on the
home page and on `/research/`, so write it to work in both places.

## What not to do

- Do not change a group `id`, or add or remove a group, as part of an editorial task. The
  three CISD groups are a structural decision; every record's `groups:` field, the Research
  page anchors and the `/area/<id>/` compatibility pages depend on them.
- Do not restructure the taxonomy — merging, splitting or renaming topics — unless that is
  exactly what was asked for. The current topics were written from the groups' own
  descriptions and their published work.
- Do not add a group that is not part of CISD. The department hosts other research groups
  (ForME, NeST among them); they are not CISD and `docs/migration-map.md` records that
  decision.
- Do not invent a `legacyAreaId`. Only the three migrated groups have one.
- Do not add logos here. Brand assets are handled in `docs/site-settings.md` and none are
  approved yet.

## Validate

```bash
npm run dev    # http://localhost:4321/research/
npm run ci     # checks, unit tests, production build, verification
```

The unit tests check unique ids, unique group orders, that every `groups:` reference names a
real group, and that no group is left without a topic.

## See also

- `docs/people.md`, `docs/projects.md`, `docs/news.md` — the records that use these group ids
- `docs/site-settings.md` — the mission statement and institutional metadata
- `docs/migration-map.md` — how the old "research areas" became groups and topics
