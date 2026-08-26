# Provenance of the published content

The former CISD website (`cisd.di.univr.it`, a Django application) was replaced by this
static site. Its public data was migrated in August 2026 and then **curated**: the first
public version deliberately contains only content that has been approved for publication,
not everything the old database held. This file records where the published records came
from, which old addresses still work, and what was deliberately left out.

It names public records only (people, project and news titles, public URLs). It contains no
contact details, funding amounts or other private data.

## Sources

| Source | Used for |
| --- | --- |
| Production database of the legacy site (PostgreSQL, exported 2026-08-26) | people, projects, news, publications |
| Official University of Verona group pages (`di.univr.it`, `dimi.univr.it`) | current roles and the group descriptions |
| Legacy group descriptions written by the groups themselves | research topics, group summaries |

The full export, the complete 560-entry bibliography and everything not published live in a
private working area outside this repository and are not part of the public site.

## Published records and their old addresses

| Old URL | New URL | Record |
| --- | --- | --- |
| `/profile/12/` | `/people/franco-fummi/` | Franco Fummi |
| `/profile/9/` | `/people/michele-lora/` | Michele Lora |
| `/profile/1/` | `/people/enrico-fraccaroli/` | Enrico Fraccaroli |
| `/profile/44/` | `/people/francesco-biondani/` | Francesco Biondani |
| `/profile/15/` | `/people/nicola-bombieri/` | Nicola Bombieri |
| `/profile/22/` | `/people/graziano-pravadelli/` | Graziano Pravadelli |
| `/area/9/` | `/research/#esd` | Electronic Systems Design |
| `/area/8/` | `/research/#parco` | PARCO Lab |
| `/area/7/` | `/research/#iot4care` | Internet of Things 4 Care |
| `/project/2/` | `/projects/defacto/` | DeFacto |
| `/project/8/` | `/projects/strategus/` | STRATEGUS |
| `/news/17/` | `/news/2023-02-16-msca-postdoctoral-fellowship-strategus/` | MSCA fellowship |
| `/news/27/` | `/news/2024-01-15-paper-ieee-tcad-2023-analog-defect-injection-review/` | IEEE TCAD paper |
| `/news/30/` | `/news/2024-01-15-paper-ieee-tc-2023-multi-domain-fault-models/` | IEEE TC paper |
| `/news/31/` | `/news/2024-03-20-paper-dac-2024-mtl-split/` | DAC 2024 paper |
| `/areas/` | `/research/` | group list |
| `/news-list/` | `/news/` | news list |
| `/`, `/people/`, `/projects/`, `/publications/`, `/contacts/` | unchanged | — |

Every stub is a static page with a meta refresh, a canonical link and `noindex`; GitHub
Pages cannot send HTTP redirects. `npm run verify` fails if a `legacyId` in the content has
no stub, or if a stub points at a page that does not exist.

Pietro Turco and Samuele Santacà were not in the legacy database; their records were created
for this site and their exact titles still need confirmation.

## Editorial decisions behind the published set

- **People** — a curated roster approved for the first version, not the 34 profiles the old
  database held. The others were not migrated into this repository; they are neither
  "former" nor "alumni", simply not published yet.
- **Research** — the old database modelled ESD, PARCO and IoT4Care as "research areas"
  alongside two groups (ForME, NeST) that are separate research groups of the department.
  Here ESD, PARCO and IoT4Care are *groups*, and research *topics* were written from the
  groups' own descriptions and their published work. ForME and NeST are not part of CISD.
- **Projects** — the two ESD projects approved for this version. The IoT4Care projects and
  the NeST project from the old site are not published.
- **Publications** — a curated selection: work from 2020 onwards co-authored by someone
  listed under People, with three preprints removed that duplicate a published paper in the
  same selection. Entries the authors had hidden on the old site remain excluded. Fields the
  old database did not store (pages, volume, publisher) are absent; a DBLP refresh can add
  them.
- **News** — four recent items. The rest of the 31 legacy posts were not published.
- **Photographs** — none. The old site's portraits are not republished until each person
  confirms; the People page is designed to work without them.
- **Never migrated** — user accounts, password hashes, sessions, invite keys, admin logs;
  e-mail addresses, telephone, office and fax fields; CV files; deleted records.
- **Not part of this site** — the independent `/wg10-5/` and `/essm-workshop/` static sites,
  the `/m9a/` document store, the `/reloaddash/` application, and the legacy
  authentication, administration and API routes. No compatibility addresses are provided
  for them.
