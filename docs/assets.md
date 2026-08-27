# Assets & Tools

The laboratories the groups run and the software they maintain and release.

```
src/content/assets/<slug>.md          one facility or tool
src/content/assets/<slug>-1.jpg       its figures, next to it
```

`/assets/` lists them; `/assets/<slug>/` is each entry's own page. **The public path
`/assets/` is inherited from the previous CISD site and must not change** — it is part of the
migration, and `npm run verify` fails if the route disappears.

## Where the content came from

The five entries were migrated from `https://cisd.di.univr.it/assets/` on 27 August 2026:
the ICE Laboratory, HIFSuite, EDACurry, CHASE and the GLACIER Project. The prose is that
page's own wording, moved across rather than rewritten, and the images are its
`/media/assets_images/full/` files, resized to 1600px with their metadata stripped.

Two things to know if you compare the two pages:

- **The legacy copy uses American spelling** — *centers*, *modeling*, *optimizing*, *analyze*.
  The house style is British (`docs/site-settings.md`), but the text was migrated verbatim
  rather than silently re-edited. Normalising it is an editorial decision, not a migration one.
- **Alt text and captions are new.** The legacy page had neither, and alt text is required, so
  they were written from what the images show. They describe the image and claim nothing else.

## Fields

| Field | Type | Notes |
| --- | --- | --- |
| `name` | text | **Required.** As the entry calls itself. |
| `summary` | text | **Required.** One line for the directory, taken from the entry's own words. |
| `category` | `facility` \| `software` \| `project` | **Required.** Groups the index. |
| `kind` | text | **Required.** The margin label, in the entry's own vocabulary: `Laboratory`, `Library`, `Framework`, `Ecosystem`, `Tools and APIs`. |
| `groups` | list | **May be empty** — see below. |
| `order` | integer | Position in the index. Default `100`. |
| `url` | URL | The entry's own site. |
| `repository` | URL | Source repository, when the tool is released as code. |
| `licence` | text | Only when the group states one. **Never guessed from the repository.** |
| `contact` | object | `person`, or `name` / `email` / `phone` — see below. |
| `location` | object | `address` (list of lines) and optional `mapUrl`. Facilities only. |
| `publications` | list | `{ label, href }` — the papers the entry points at, with its own link text. |

Long-form description goes in the **Markdown body**, with its figures inline
(`docs/figures.md`). Frontmatter carries factual metadata only.

### `category` — do not force an entry into the wrong one

The previous site categorised nothing, so these three values are the honest minimum: a place,
a piece of software, or a project that is an ecosystem rather than a single tool. GLACIER is
`project` because it describes itself as one, not `software`. **If a new entry fits none of
them, add a value** — do not mislabel it.

### `groups` may be empty, and must never be guessed

The legacy page never said which group owns which asset, so all five ship with `groups: []`.
An empty list means *nobody has stated it yet*. AGENTS.md forbids inferring group membership,
and `npm test` exempts this collection — and only this collection — from the "at least one
group" rule for exactly that reason. Fill it in when a human tells you.

### `contact` — two shapes, on purpose

```yaml
contact:
  person: michele-lora        # a member of the roster
```

```yaml
contact:
  name: Sebastiano Gaiardelli  # someone the roster does not cover
  phone: '+39 045 8027069'     # or a facility's own switchboard
```

`person` is preferred: the page links to their entry, so it publishes nothing they have not
already approved on it. Use the plain fields for a contact the roster does not cover — a
project lead who is not a member, or a laboratory's switchboard.

**`email` is not published here.** `npm test` forbids an address anywhere in this collection,
including inside `contact`, and no member of the roster publishes one either. The legacy page
listed three; they were not carried over. `contact.phone` is the one exemption, narrowly: a
*facility's* public switchboard is not a person's number, and no collection describing a
person has a `contact` field. See `docs/content-safety.md`.

## Common edits

**Add an entry.** One Markdown file. Give it a `name`, a `summary`, a `category`, a `kind`,
and the body. Everything else is optional.

**Add a figure.** Put the image next to the Markdown file and write it inline — see
`docs/figures.md`. Remember `npm run strip-metadata`.

**Reorder the index.** Change `order`. The five migrated entries are 1–5 in the order the
previous site listed them, so a reader who knew that page finds the same sequence.

**Retire an entry.** Delete the file and its images. There is no `legacyId` to preserve: the
old page was a single page with no per-entry addresses, so nothing links to an individual
entry from outside.

## Validate

```bash
rm -rf node_modules/.astro   # only when you changed a figure or the markdown pipeline
npm run ci
```

## See also

- `docs/figures.md` — the inline figure syntax
- `docs/content-safety.md` — image metadata, personal data, what may go under `public/`
- `docs/design-system-integration.md` — why the index is an editorial row and not a card
