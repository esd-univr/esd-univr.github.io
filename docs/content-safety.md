# Content safety

This site is public, and the repository that produces it is public too. Everything
committed here is published twice: as a page and as a file in the Git history, which
cannot be quietly undone.

`SECURITY.md` covers what must never be committed at all — dumps, credentials, archives.
This guide covers the editorial side: what may be *published*, and about whom.

## The rule

> Publish institutional, already-public information about people, with their agreement.
> Nothing else.

When you are not sure, omit. Every optional field is optional on purpose and the design is
built to look right without it. An empty field is invisible; a wrong one is a correction, a
complaint, or a data-protection problem.

## Personal data

**Never publish**

- telephone numbers, mobile numbers, fax numbers
- office or room numbers, private addresses
- personal (non-institutional) e-mail addresses
- CVs, ID scans, certificates, contracts, payslips
- dates of birth, nationality, marital or family information
- health information, of any kind, about anyone
- student numbers, employee numbers, internal identifiers
- private correspondence, or anything from an internal system

The legacy CISD database held telephone, office and fax fields and four CV files. None of
them were migrated, and none of them may be added back.

**Institutional e-mail addresses** are a decision, not a default. The `email` field exists
in the people schema but is empty for everybody; `/contacts/` gives the department's postal
address instead. Filling it in needs an explicit request from the person.

**Automatic check.** `npm test` scans every content record — frontmatter and body — for
e-mail and telephone patterns and fails if it finds one outside the sanctioned `email`
field. The check is a backstop, not permission to try.

## Photographs

A photograph of a person is personal data. Three separate conditions, all required:

1. **Consent for this site.** Not for a conference programme, not for LinkedIn, not for the
   old CISD site. A portrait that was on the legacy site records a decision made years ago
   about a different website; ask again.
2. **No embedded metadata.** Every image entering the repository must be free of EXIF, GPS,
   IPTC, XMP and camera/device metadata. A phone photograph typically carries the exact
   time, the device, and often the coordinates where it was taken.
3. **Right to publish the image itself.** A portrait taken by a professional photographer
   may be the photographer's copyright even when the subject agrees. Stripping the metadata
   removes their credit — check that republication is covered.

### Stripping metadata

```bash
npm run strip-metadata src/content/people/mario-rossi.jpg
```

It rewrites the container and drops the metadata segments; the compressed image data is
copied byte for byte, so there is no re-encoding and no quality loss. ICC colour profiles
are kept so colours stay correct. It handles `.jpg`, `.jpeg`, `.png` and `.webp`.

To report without writing, pass the flag through with `--` (npm swallows a bare
`--check`) — it exits non-zero if anything would be removed:

```bash
npm run strip-metadata -- --check src/content/people/*.jpg
```

**Verify, do not assume.** `npm test` inspects every image under `src/content/` with `sharp`
and fails on any EXIF, IPTC or XMP block. Run the tool yourself rather than letting CI find
out.

### Photographs of groups and events

A news photograph with identifiable people needs everyone's agreement, and `imageAlt` must
describe the picture without naming people who did not agree to be named. Prefer a
photograph of the room, the poster or the equipment.

Never publish a photograph of a person who is not a member of CISD without their explicit
permission — visiting speakers and students included.

## Claims and attribution

- **Do not invent academic information.** Titles, roles, degrees, dates, supervisors,
  affiliations, grant numbers, funders, venues, DOIs. Take them from a document the
  requester provided or from a record already in the repository.
- **Do not upgrade a title.** "Assistant Professor" does not become "Professor" because it
  reads better.
- **Do not infer group membership from a department affiliation.** DIMI hosts several
  research groups; being at DIMI does not make somebody a member of ESD, PARCO or IoT4Care.
- **Do not publish funding amounts.** There is no field for them, by decision.
- **Do not announce unpublished results**, papers under review, or awards not yet made
  public.
- **Do not add somebody to the site because they exist in the legacy database.** The roster
  is a curated selection; absence is deliberate and says nothing about the person.

## Files under `public/`

`public/` is copied into the build verbatim, so anything placed there is downloadable at a
predictable URL, whether or not a page links to it.

- PDFs and files that need a stable address: `public/documents/…`, linked as `/documents/…`.
- Images that belong to one page: next to that page's Markdown file, so Astro optimises
  them.
- Only host a paper's PDF if the publisher's licence allows it.
- Never put a CV, a scan, a spreadsheet, an export or a "temporary" file there.

## Legacy and migration material

The legacy CISD application, its database, the production dumps and the migration audit are
**inputs**, kept outside this repository in a private work area, inspected read-only.

- Never copy a dump, an archive, a `.env`, a log, a media tree or an audit note into the
  repository — not even as an excerpt, not even in a comment or a commit message.
- Never reference an internal server path, host name or credential in a file here.
- `docs/migration-map.md` is the only public record of the migration. It names public
  records only: people, project and news titles, old and new URLs. Keep it that way.
- `npm run verify` fails when a database, dump, archive, env file, log or migration scratch
  file is tracked by Git or merely present in the working tree.

## If something sensitive gets committed

Deleting it in a later commit is **not** enough — it stays in the history and may already be
cloned or cached.

1. Stop; do not push if it has not been pushed.
2. Tell whoever owns the data.
3. Treat any credential as exposed and rotate it.
4. Remove it from the history with a rewrite before continuing, as `SECURITY.md` describes.

## See also

- `SECURITY.md` — the list of files that must never be committed, and the incident procedure
- `docs/people.md` — the portrait standard and the fields a person record may have
- `docs/news.md` — images in news items
- `docs/migration-map.md` — what was published from the legacy site, and what was not
