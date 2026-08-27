# Projects

`/projects/` and every `/projects/<slug>/` page come from one directory:

```
src/content/projects/
  defacto.md
  strategus.md
  _README.md      ignored by the site
```

**One Markdown file per project. The file name is the public address.**
`src/content/projects/defacto.md` is published at `/projects/defacto/`.

## File names and slugs

- Lower-case letters, digits and hyphens: `strategus.md`, `smart-factory-twin.md`.
- Use the acronym when the project has one (`defacto.md` for DeFacto), otherwise a short
  form of the title. Not the full title.
- The file name is a URL, so renaming a published project changes a public address.
- Files whose name starts with `_` are ignored.

## Fields

Required: `name`, `groups`, `status`, `start`, `summary`.

| Field | Type | What it is |
| --- | --- | --- |
| `name` | text | Full project title. |
| `acronym` | text | Short name, shown as a label. |
| `groups` | list | One or more of `esd`, `parco`, `iot4care`. |
| `status` | `active` \| `completed` | Drives the ordering: active projects come first. |
| `start` | date | `YYYY-MM-DD`. |
| `end` | date | `YYYY-MM-DD`. Must not be before `start`. Omit while the end is open. |
| `summary` | text | One or two sentences, shown in every list. |
| `url` | URL | The project's own website. |
| `people` | list | Slugs of people (`src/content/people/<slug>.md`) involved in the project. |
| `funding.programme` | text | e.g. `Horizon Europe`, `Marie Skłodowska-Curie Actions`. |
| `funding.funder` | text | e.g. `European Commission`. |
| `funding.grant` | text | Grant or agreement number, quoted. |
| `featured` | boolean | Marks a project as selected. **Currently read by no page** — see the note below. Default `false`. |
| `order` | integer | Sort key, lower first, applied within a status. Default `100`. |
| `legacyId` | integer | Only on projects migrated from the old site. |

The authoritative list is the `projects` schema in `src/content.config.ts`.

**Funding amounts are not part of the model and are never published.** There is no field
for them; do not add one.

The text after the closing `---` is the full description, in Markdown. Headings inside it
start at `##`.

## Add a project

Create `src/content/projects/smart-line.md`:

```markdown
---
name: Verification of Reconfigurable Production Lines
acronym: SmartLine
groups: [esd]
status: active
start: 2026-01-01
end: 2028-12-31
summary: "Contract-based verification of production lines that are reconfigured while running, and the tooling that keeps the digital twin in step."
url: "https://example.org/smartline"
people: [michele-lora, francesco-biondani]
funding:
  programme: Horizon Europe
  funder: European Commission
  grant: "101000000"
featured: false
order: 30
---

One or more paragraphs describing the project: the problem, the approach and the expected
outcome. Markdown, so **bold**, links and lists all work.
```

The minimum that builds:

```markdown
---
name: Verification of Reconfigurable Production Lines
groups: [esd]
status: active
start: 2026-01-01
summary: "One sentence about the project."
---
```

Then run `npm run ci`.

## Common edits

**Mark a project completed.** Set `status: completed` and fill in `end:`. Completed
projects move below the active ones automatically; nothing else changes.

**Extend a project.** Change `end:`. It must not be earlier than `start:` or the build
fails.

**Add or remove a team member.** Edit `people:`. Every entry must be the slug of an
existing file in `src/content/people/`, without the `.md`:

```yaml
people: [michele-lora, enrico-fraccaroli]
```

A wrong slug fails the build. Listing somebody here makes the project appear on their
person page.

**Mark a project as selected.** Set `featured: true`. Keep the featured set small.

**No page reads `featured` today.** The home page was reduced to the hero, three recent news
items and the groups, and it was the only page that showed a selection of projects. The field
is kept so the choice survives — see `docs/design-system-integration.md`.

**Add funding information.** Fill the `funding` block. Every sub-field is optional, so a
project with only a programme is fine. Quote the grant number so YAML keeps it a string:

```yaml
funding:
  programme: Horizon Europe
  funder: European Commission
  grant: "101000000"
```

**Delete a project.** `git rm src/content/projects/<slug>.md`, then remove every reference
to that slug from `src/data/publications.overrides.yaml` and from the `projects:` lists in
`src/content/news/*.md`, or the build fails. If it had a `legacyId`, its `/project/<id>/`
compatibility page disappears with it.

## What not to do

- Do not invent a funder, a programme, a grant number or dates. Take them from the grant
  agreement or ask. Omit what you do not have.
- Do not publish funding amounts, budget breakdowns or internal partner agreements.
- Do not add a `legacyId` to a new project. Only projects that existed on the old CISD site
  have one, and `docs/migration-map.md` records which.
- Do not add a project image. Projects have no image field; the design does not use one.
- Do not change `groups:` on an existing project to make it appear elsewhere. Group
  ownership is a decision a human makes.

## Validate

```bash
npm run dev    # http://localhost:4321/projects/
npm run ci     # checks, unit tests, production build, verification
```

## See also

- `docs/people.md` — the slugs used in `people:`
- `docs/publications.md` — linking a publication to a project
- `docs/content-safety.md` — what must never be published or committed
- `docs/research.md` — the group ids used in `groups:`
