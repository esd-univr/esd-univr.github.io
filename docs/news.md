# News

`/news/` and every `/news/<slug>/` page come from one directory:

```
src/content/news/
  2024-03-20-paper-dac-2024-mtl-split.md
  2023-02-16-msca-postdoctoral-fellowship-strategus.md
  _README.md      ignored by the site
```

**One Markdown file per item. The file name is the public address**, and it must start with
the item's own date.

## File names

```
YYYY-MM-DD-short-title.md
```

- The date prefix **must equal** the `date:` field. A unit test enforces it.
- Lower-case letters, digits and hyphens after the date. Keep the title part short: it is
  the URL, not the headline.
- A purely numeric slug is rejected — those addresses belong to the legacy compatibility
  pages.
- Files whose name starts with `_` are ignored.

`2024-03-20-paper-dac-2024-mtl-split.md` → `/news/2024-03-20-paper-dac-2024-mtl-split/`.

## Fields

Required: `title`, `date`, `summary`, `groups`.

| Field | Type | What it is |
| --- | --- | --- |
| `title` | text | The headline. Quote it if it contains a colon. |
| `date` | date | `YYYY-MM-DD`. Must match the file-name prefix. |
| `summary` | text | One or two sentences, shown in the list and used as the meta description. |
| `groups` | list | One or more of `esd`, `parco`, `iot4care`. |
| `author` | slug | The person posting, from `src/content/people/`. Their portrait appears next to the item. |
| `category` | text | Short label: `Publication`, `Award`, `Event`, `Talk`, … |
| `people` | list | Slugs of people the item is about. It then appears on their pages. |
| `projects` | list | Slugs of projects the item is about. It then appears on their pages. |
| `image` | path | An image next to the Markdown file. **`imageAlt` becomes required.** |
| `imageAlt` | text | What the image shows, for screen readers. |
| `lang` | `en` \| `it` | Default `en`. Use `it` for an item written in Italian. |
| `featured` | boolean | Default `false`. |
| `legacyId` | integer | Only on items migrated from the old site. |

The authoritative list is the `news` schema in `src/content.config.ts`.

The text after the closing `---` is the body, in Markdown. Headings inside it start at `##`.

## Add a news item

Create `src/content/news/2027-03-15-paper-date-2027-reconfigurable-lines.md`:

```markdown
---
title: "ESD Group: Paper accepted at DATE 2027"
date: 2027-03-15
groups: [esd]
author: mario-rossi
category: Publication
summary: "\"Contract-Based Verification of Reconfigurable Production Lines\" verifies a line that is reconfigured while it runs."
people: [mario-rossi, michele-lora]
projects: [strategus]
---

Our paper "[**Contract-Based Verification of Reconfigurable Production Lines**](https://doi.org/10.23919/DATE00000.2027.0000000)"
has been accepted at **DATE 2027**.

One or two paragraphs of context: what the problem was, what the paper does, why it
matters. Links are welcome.
```

The minimum that builds:

```markdown
---
title: Paper accepted at DATE 2027
date: 2027-03-15
summary: One sentence.
groups: [esd]
---
```

Then run `npm run ci`.

## Common edits

**Add a photograph.** Put the image next to the Markdown file and reference it relatively.
`imageAlt` is then mandatory — the build fails without it:

```yaml
image: ./2027-03-15-award-ceremony.jpg
imageAlt: Mario Rossi receiving the best-paper certificate on stage
```

The same rules as for portraits apply: `.jpg`, `.jpeg`, `.png` or `.webp`, named after the
item's slug, and **all EXIF/GPS/IPTC/XMP metadata stripped** before committing:

```bash
npm run strip-metadata src/content/news/2027-03-15-award-ceremony.jpg
```

`npm test` fails if any image under `src/content/` still carries metadata. Only publish a
photograph of identifiable people with their agreement — see `docs/content-safety.md`.

**Change the date.** Rename the file so its prefix matches, or the tests fail. Renaming
changes the public address, so avoid it once an item is published.

**Write in Italian.** Set `lang: it`. It sets the `lang` attribute so screen readers and
search engines read the page correctly.

**Link an item to people or projects.** Fill `people:` and `projects:` with existing slugs.
Wrong slugs fail the build.

**Correct a published item.** Edit the body in place; keep the file name and the `date`.
News items are a record, so prefer adding a correction to rewriting history.

**Delete an item.** `git rm` the file and its image. If it had a `legacyId`, its `/news/<id>/`
compatibility page disappears with it.

## What not to do

- Do not put an e-mail address or a telephone number in the body or in any field. A test
  scans for both patterns and fails. The old site's posts had contact addresses inline;
  none of them were migrated.
- Do not paste HTML. The bodies are Markdown; the legacy posts were converted on purpose.
- Do not announce something that has not happened, or a result that is not public yet.
- Do not add a `legacyId` to a new item.
- Do not use a purely numeric slug.
- Do not upload a poster, a programme or a PDF next to the Markdown file. Files that need a
  stable URL go in `public/documents/` and are linked as `/documents/…`.

## Validate

```bash
npm run dev    # http://localhost:4321/news/
npm run ci     # checks, unit tests, production build, verification
```

## See also

- `docs/content-safety.md` — photographs of people, personal data, files in `public/`
- `docs/people.md` — the slugs used in `author:` and `people:`, and the portrait rules
- `docs/projects.md` — the slugs used in `projects:`
