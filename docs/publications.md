# Publications

The bibliography is two files:

```
src/data/publications.bib               the entries themselves (BibTeX)
src/data/publications.overrides.yaml    per-entry extras, keyed by BibTeX key
```

They feed `/publications/`, the "Selected publications" section of the home page, the
publication list on every person and project page, and the machine-readable export at
`/publications.bib`.

## The curation rule

This bibliography is a **curated selection, not a complete archive**. A unit test enforces
the rule that keeps it coherent:

> Every entry must have at least one author who is listed under People.

So an entry whose only CISD author leaves the roster has to go too, and a paper by somebody
who is not on the site cannot be added without adding them first.

## `publications.bib`

Standard BibTeX. Required in every entry: a unique key, `title`, `author` (or `editor`) and
a four-digit `year`. Used when present: `journal` / `booktitle`, `volume`, `number`,
`pages`, `publisher`, `school`, `institution`, `doi`, `url`, `ee`, `biburl`.

```bibtex
@inproceedings{DBLP:conf/date/RossiLF27,
  author    = {Mario Rossi and Michele Lora and Franco Fummi},
  title     = {Contract-Based Verification of Reconfigurable Production Lines},
  booktitle = {Design, Automation and Test in Europe, {DATE} 2027},
  pages     = {1--6},
  year      = {2027},
  doi       = {10.23919/DATE00000.2027.0000000},
  biburl    = {https://dblp.org/rec/conf/date/RossiLF27.bib}
}
```

The entry type decides how the venue is shown: `article` → journal, `inproceedings` /
`conference` → conference, `incollection` / `inbook` → book chapter, `book` /
`proceedings` → book, `phdthesis` / `mastersthesis` → thesis, `techreport` → report. An
`article` in a preprint server (`CoRR`, `arXiv`, `bioRxiv`, …) is labelled a preprint.

### Adding a paper

1. Open the paper's DBLP record.
2. *export record* → *BibTeX* → copy the entry.
3. Paste it into `src/data/publications.bib` under the right year (the file is ordered
   newest-first for readability; the site sorts by year regardless).
4. Run `npm run ci`.

DBLP keys of the form `DBLP:conf/date/RossiLF27` automatically get a link to the DBLP
record. If you paste an entry from elsewhere, the `biburl` field produces the same link.

A DOI may be given as `doi = {10.1109/...}` or as a `https://doi.org/...` URL in `url` or
`ee` — both are recognised, and the `url` field is only shown separately when it is not a
DOI link.

### Things to fix on paste

- **HTML entities.** DBLP sometimes exports `&amp;` or `&#38;`. Replace them with the real
  character.
- **Page ranges.** `pages = {1--6}` is correct BibTeX; the site renders the en dash.
- **Braces around proper nouns.** Keep `{DATE}`, `{IEEE}`, `{FPGA}` — they stop BibTeX
  tools from lower-casing an acronym.
- **Duplicates.** A preprint and the published version of the same paper are two entries.
  Keep one, normally the published one. Duplicate keys fail the tests.

## `publications.overrides.yaml`

Everything the bibliography cannot express. The key is the exact BibTeX key:

```yaml
DBLP:conf/date/RossiLF27:
  featured: true                      # show in "Selected publications" on the home page
  projects: [strategus]               # link the entry to project pages
  people: [mario-rossi]               # only when automatic author matching fails
  pdf: /documents/papers/rossi27.pdf  # a file under public/documents/ or an https URL
  code: https://github.com/esd-univr/example
  note: Best paper award                # short free-text note
  hidden: true                          # keep the entry but never show or export it
```

Every field is optional. An unknown key fails the tests, which is what you want — it catches
a typo in a citation key.

**`featured`** — keep the featured set small; the home page shows a handful.
**`hidden`** — the entry stays in the file but appears nowhere, not even in the exported
`.bib`. Used for entries whose authors asked for them not to be listed.
**`pdf`** — only link a PDF the publisher's licence allows you to host. Put the file in
`public/documents/papers/` and reference it as `/documents/papers/<name>.pdf`.

## How authors become links

Author strings are matched against the `name` (and `aliases`) of every person, ignoring
accents, apostrophes, hyphens and case, and accepting initials: `M. Rossi` matches
`Mario Rossi`. `docs/people.md` explains the rule and the `aliases` field in detail.

Use `people:` in the overrides only for a single entry that matching genuinely cannot
reach. If a person's name fails to match repeatedly, add an alias to their record instead —
one alias fixes every entry at once.

## Common edits

**Feature a paper on the home page.** Add `featured: true` under its key.

**Link papers to a project.** Add `projects: [<project-slug>]` under each key. The project
page then lists them.

**Attach a PDF or a code repository.** Add `pdf:` or `code:`.

**Hide a paper.** Add `hidden: true`. Do not delete the entry if you may need it back.

**Remove a paper.** Delete the entry from `publications.bib` and its block from the
overrides file.

**Refresh from DBLP.** Paste the new entries, then run `npm run ci`. The tests will tell
you about duplicate keys, missing years and entries with no author on the roster.

## What not to do

- Do not add an entry whose authors are all outside the People roster — the tests reject it,
  and the fix is to decide whether the person belongs on the site, not to weaken the rule.
- Do not invent a DOI, a venue, page numbers or a year. Omit what the record does not give
  you; every field except key, title, author and year is optional.
- Do not paste an entry with a `file`, `abstract` or `annote` field full of local paths or
  private notes. Keep only bibliographic fields.
- Do not link a PDF you are not allowed to host.
- Do not edit `src/loaders/publications.ts`, `src/lib/bibtex.ts` or `src/lib/publications.ts`
  to make one entry render differently. Fix the entry.

## Validate

```bash
npm run dev    # http://localhost:4321/publications/
npm run ci     # checks, unit tests, production build, verification
```

The tests check that the file parses, that keys are unique, that every entry has a title, an
author or editor and a year, that every override key exists, that every `people:` and
`projects:` reference exists, and the curation rule above.

## See also

- `docs/people.md` — author matching, `aliases`, and the People roster
- `docs/projects.md` — the slugs used in `projects:`
- `docs/content-safety.md` — hosting PDFs and other files in `public/documents/`
