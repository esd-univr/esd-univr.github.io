# People and portraits

Everything on `/people/` and on every `/people/<slug>/` page comes from one directory:

```
src/content/people/
  franco-fummi.md          the person
  franco-fummi.jpg         their portrait (optional)
  michele-lora.md
  michele-lora.jpg
  _README.md               ignored by the site (files starting with _ are skipped)
```

**One Markdown file per person. The file name is the public address.**
`src/content/people/franco-fummi.md` is published at `/people/franco-fummi/`.

You never edit a template, a component or a route to change who appears on the site.

## File names and slugs

- Lower-case letters, digits and hyphens only: `mario-rossi.md`.
- Use `given-family`. Drop accents and apostrophes: Nicola Dall'Ora → `nicola-dall-ora.md`,
  Samuele Santacà → `samuele-santaca.md`. The displayed `name:` keeps them; the file name
  does not.
- The file name is a URL, so **renaming a file changes a public address**. Do not rename a
  published record without a reason.
- Files whose name starts with `_` are ignored.

## Fields

Required: `name`, `role`, `groups`. Everything else is optional, and the pages are designed
to look right without it — omit a field rather than guessing its value. `groups` is always a
list, but it may be empty when current CISD membership is established and no current
ESD/PARCO/IoT4Care laboratory association has been explicitly stated.

| Field | Type | What it is |
| --- | --- | --- |
| `name` | text | Full display name, with accents. |
| `role` | text | Free text shown next to the name: `Full Professor`, `PhD Student`, … |
| `groups` | list | Zero or more of `esd`, `parco`, `iot4care` (the ids in `src/data/groups.yaml`). Empty means no current laboratory association is being claimed. |
| `relationship` | text | `member` (default) or `collaborator`. Independent of `groups`: a current member may be ungrouped. |
| `order` | integer | Sort key inside a group, lower first. Default `100`; ties break on family name. |
| `photo` | path | Portrait next to the Markdown file — see [Portraits](#portraits). |
| `interests` | list | Short research-interest labels shown on the person page. |
| `affiliation` | text | Only when it differs from the department on `/contacts/`. |
| `website` | URL | Institutional profile page or personal site. |
| `orcid` | text | Bare iD, `0000-0002-1825-0097`. Not a URL. |
| `scholar` | URL | Google Scholar profile. |
| `dblp` | URL | DBLP author page. |
| `github` | text | User name or full profile URL. |
| `linkedin` | URL | LinkedIn profile. |
| `email` | e-mail | Institutional address. Left empty on this site — see [Contact details](#what-must-not-be-published). |
| `aliases` | list | Other spellings used in `publications.bib` — see [Publication matching](#how-publications-find-a-person). |
| `legacyId` | integer | Only on records migrated from the old site — see [legacyId](#legacyid). |

The authoritative list is the `people` schema in `src/content.config.ts`. An unknown field
or a wrong type fails the build with the file name and the field in the message.

The text after the closing `---` is the public biography, in Markdown. Keep it to one or
two paragraphs. If you use headings inside it, start at `##`.

## Add a person

Create `src/content/people/mario-rossi.md`:

```markdown
---
name: Mario Rossi
role: PhD Student
groups: [esd]
order: 40
interests: [Digital twins, Verification]
photo: ./mario-rossi.jpg
website: "https://www.dimi.univr.it/?ent=persona&id=12345"
orcid: "0000-0002-1825-0097"
scholar: "https://scholar.google.com/citations?user=XXXXXXXXXXX"
dblp: "https://dblp.org/pid/000/1234.html"
aliases: ["M. Rossi"]
---

Mario Rossi is a PhD student at the Department of Engineering for Innovation Medicine of
the University of Verona. His research concerns digital twins of production plants and
the verification of the control software that drives them.
```

The minimum that builds:

```markdown
---
name: Mario Rossi
role: PhD Student
groups: [esd]
---
```

If a human source establishes that Mario is a current CISD member but does **not** establish
an ESD, PARCO or IoT4Care association, write that uncertainty explicitly instead of guessing:

```markdown
---
name: Mario Rossi
role: PhD Student
groups: []
relationship: member
---
```

He will appear in the neutral **CISD** section of `/people/`.

No `legacyId`, no `photo`, no body. That is a complete, valid record.

Then run `npm run ci`.

## Common edits

**Change a role or status.** Edit `role:`. It is free text and appears verbatim next to
the name, so write it the way it should read: `Assistant Professor`, `Postdoctoral
Researcher`, `Visiting PhD Student`. Nothing else needs touching.

**Change group membership.** Edit `groups:`. The list decides which laboratory section of
`/people/` the person appears in; a person in two groups appears in both:

```yaml
groups: [esd, iot4care]
```

Only the ids in `src/data/groups.yaml` are accepted. Membership is a decision a human
makes — never infer it from a department affiliation or from research similarity. When
current CISD membership is established but no current laboratory assignment is stated, use
`groups: []` and keep `relationship: member`; the person appears once in the neutral **CISD**
section. An empty list is not a placeholder to fill later by guesswork.

**Change the order within a group.** Edit `order:`. Lower numbers come first; the roster
currently uses 10, 20, 30 … so there is room to insert somebody. People with the same
`order` are sorted by family name.

**Add or remove a link.** Add or delete the corresponding line (`website`, `orcid`,
`scholar`, `dblp`, `github`, `linkedin`). A missing link simply does not appear. `orcid`
is the bare identifier, everything else is a full `https://` URL.

**Add or replace a portrait.** See [Portraits](#portraits).

## Remove someone from the public roster

Delete the two files:

```bash
git rm src/content/people/mario-rossi.md src/content/people/mario-rossi.jpg
```

Then check what referred to them and fix it, or the build will fail:

- `people:` lists in `src/content/projects/*.md`
- `author:` and `people:` in `src/content/news/*.md`
- `people:` in `src/data/publications.overrides.yaml`

Their publications stay in `src/data/publications.bib`; their name simply stops being a
link. If the record had a `legacyId`, the `/profile/<id>/` compatibility page disappears
with it — that is intended.

Removing a record is not a statement about the person. This roster is a curated selection;
somebody who is not listed is not thereby "former" or "alumni".

## Portraits

A portrait is optional. Without one, the person's initials are shown in a monogram, and
both `/people/` and the person page are designed to look right that way. Half a roster
with photographs and half without is fine.

### The naming rule

The portrait file **must** be named after the person's slug and sit next to their Markdown
file:

```
src/content/people/mario-rossi.md
src/content/people/mario-rossi.webp
```

```yaml
photo: ./mario-rossi.webp
```

There must be **at most one** portrait file per person. `npm test` fails on anything else.

| Good | Bad |
| --- | --- |
| `mario-rossi.webp` | `IMG_1234.jpg` |
| `mario-rossi.jpg` | `rossi-new.jpg` |
| `mario-rossi.png` | `MarioPhoto.JPG` |
| | `portrait-final-2.png` |
| | `mario-rossi.jpg` *and* `mario-rossi.webp` |

Replacing a portrait means overwriting the file, or deleting it and adding the new format —
never keeping both.

### Formats

`.jpg`, `.jpeg`, `.png` and `.webp`, in lower case. Keep the format the photograph arrives
in; there is no reason to convert a JPEG to WebP or the other way round for the sake of
uniformity. Astro generates the optimised WebP variants and the `srcset` at build time, so
the format in the repository only has to be a faithful original — different people may well
have different formats, and that is fine.

Never use SVG for a photograph.

### Shape: the source does not need to be square

**A portrait file does not have to be square, and it does not have to be 4:5 either.**
Hand it over in whatever shape the photograph came in.

The site displays portraits in a **4:5 upright frame** and does the cropping itself —
`src/components/Portrait.astro` applies `object-fit: cover` from slightly above centre, at
every size the pages need. (The one exception is the small author thumbnail on a news item,
which stays square; it is the same component with `variant="avatar"`.)

So:

- **Never crop a source file to match the site's aspect ratio.** Cropping to 4:5, or to a
  square, throws away pixels the responsive variants could have used and locks in a framing
  decision that the design already makes for you — better, and at every size.
- **Never rotate, pad or add bars** to change the shape either.
- The only thing you may do to an incoming file is strip its metadata, which is lossless —
  see [Metadata](#metadata-mandatory).

### Quality

Aim for:

- **at least 800 px on the shorter side** — the frame goes up to 160×200 CSS px, which is
  320×400 on a high-density screen, so 800 px leaves comfortable headroom;
- a clear head-and-shoulders portrait;
- some space around the subject, so the 4:5 crop has room to work.

But:

- **Never upscale** a small photograph to reach that size. Upscaling adds no detail and the
  result looks worse than the honest original.
- A mediocre legacy portrait is acceptable as a temporary state if it still looks right.
  Several of the current portraits come from the old site and are well below 800 px.
- **When in doubt, no photograph.** The monogram fallback is deliberately good-looking, and
  it beats a portrait that has to be crushed or badly cropped to fit.

Astro never upscales: for a source smaller than the size a page asks for, it emits the
largest variant the original supports and the browser's `object-fit: cover` does the rest.
So a small portrait renders soft, never stretched or broken — which is why a modest legacy
photograph is usable and an upscaled one is not.

The tests reject anything under 72 px on the shorter side, or an aspect ratio beyond 1:2 in
either direction — a banner or an icon is not a portrait. A source that is already close to
4:5, or a little taller, needs the least cropping, but anything in between is fine.

### Metadata: mandatory

Every image entering this repository must be free of **EXIF, GPS, IPTC, XMP** and
camera/device metadata. A photograph straight from a phone or a camera carries the date,
the device, often the exact GPS position and sometimes the photographer's name.

Strip it, then check that it is gone:

```bash
npm run strip-metadata src/content/people/mario-rossi.jpg
```

The tool rewrites the container and drops the metadata segments; the compressed image data
is copied byte for byte, so there is no re-encoding and no quality loss. It also keeps the
ICC colour profile, so the colours stay correct.

`npm test` fails if any image under `src/content/` still carries EXIF, IPTC or XMP, so this
is verified rather than assumed. Run the tool anyway — do not wait for CI to tell you.

### Consent

Only publish a portrait the person has agreed to publish on **this** site. A photograph
that was on the old CISD site is evidence of a past decision, not of a current one.

## How publications find a person

`/people/<slug>/` lists that person's publications. Nothing links them by hand: the
author strings in `src/data/publications.bib` are matched against the person's `name`.

Matching ignores accents, apostrophes, hyphens and case, and it accepts initials. For
`name: Nicola Dall'Ora` all of these match:

```
Nicola Dall'Ora        Nicola Dall Ora        N. Dall'Ora
```

The family name (the last token) must be equal; each given-name token must be equal or be
an initial of it. So `M. Rossi` matches `Mario Rossi`, and `Mario Rossi` does not match
`Marco Rossi`.

### `aliases`

When a bibliography entry spells the name in a way the rule above cannot reach — a maiden
name, a transliteration, a different name order, a middle name that appears only sometimes
— add it to `aliases`:

```yaml
name: Mario Rossi
aliases: ["Mario A. Rossi", "M. A. Rossi"]
```

Each alias is matched by exactly the same rule, so one alias usually covers its initials
too. `aliases` is only about author matching: it is never displayed.

If matching still fails for a single entry, link it explicitly in
`src/data/publications.overrides.yaml` (see `docs/publications.md`) instead of inventing an
alias.

Note the curation rule enforced by `npm test`: **every entry in `publications.bib` must
have at least one author who is listed under People.** Removing the last published
co-author of an entry makes the tests fail — remove the entry too, or keep the person.

## `legacyId`

The old CISD site addressed people by number: `/profile/12/`. Records migrated from it
carry that number as `legacyId`, and the build generates a small compatibility page at the
old address that points at the new one.

- **Keep `legacyId` when you edit a migrated record.** Removing it breaks an old link.
- **Never add a `legacyId` to a new person.** They never had a numeric address, and
  `npm run verify` fails on an id with no matching legacy page. Only `docs/migration-map.md`
  decides which ids exist.

## What must not be published

- **Telephone and office numbers, private addresses, personal e-mail addresses, CVs, ID
  scans, dates of birth, family information.** The legacy database held some of these; none
  of them belong here. A test scans every record for e-mail and telephone patterns and
  fails if it finds one.
- **Institutional e-mail addresses.** The `email` field exists, but this site publishes no
  address; `/contacts/` gives the department's address instead. Filling `email` needs an
  explicit decision.
- **Anything you are not sure of.** Do not guess a title, a start date, a degree or a
  supervisor. Omit the field and ask.

`docs/content-safety.md` is the full rule set; `SECURITY.md` lists what must never be
committed under any circumstances.

## Validate

```bash
npm run dev    # http://localhost:4321/people/ — check the list and the person page
npm run ci     # what CI runs: checks, unit tests, production build, verification
```

`npm run ci` must pass before you open a pull request.

## See also

- `docs/content-safety.md` — personal data, photographs, consent, what never gets committed
- `docs/publications.md` — the bibliography and the overrides file
- `docs/research.md` — the group ids used in `groups:`
- `docs/migration-map.md` — which legacy ids exist and why
