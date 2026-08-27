# Provenance of the published content

The former CISD website (`cisd.di.univr.it`, a Django application) was replaced by this
static site. Its public data was migrated in August 2026 and then **curated**: the public
site contains approved records rather than a blind copy of everything the old database held.
This file records where the published records came from, which old addresses still work, and
where a migrated record was reconciled with a more authoritative public source.

It names public records only (people, project and news titles, public URLs). It contains no
contact details, funding amounts or other private data.

## Sources

| Source | Used for |
| --- | --- |
| Production database of the legacy site (PostgreSQL, exported 2026-08-26) | people, projects, news, publications |
| Public legacy site (`cisd.di.univr.it`) | legacy titles, biographies, project descriptions, dates, group attribution and old URLs |
| Official University of Verona group, people and project pages (`di.univr.it`, `dimi.univr.it`) | current roles and affiliations, group descriptions, project metadata and funding provenance |
| Current institutional pages at collaborators' universities | current external roles and affiliations |
| Public funder/project records | historical project codes and period reconciliation where the legacy listing was stale |
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
| `/profile/45/` | `/people/mario-libro/` | Mario Libro |
| `/profile/8/` | `/people/nicola-dall-ora/` | Nicola Dall'Ora |
| `/profile/21/` | `/people/sebastiano-gaiardelli/` | Sebastiano Gaiardelli |
| `/profile/20/` | `/people/tiziano-villa/` | Tiziano Villa |
| `/profile/29/` | `/people/davide-quaglia/` | Davide Quaglia |
| `/area/9/` | `/research/#esd` | Electronic Systems Design |
| `/area/8/` | `/research/#parco` | PARCO Lab |
| `/area/7/` | `/research/#iot4care` | Internet of Things 4 Care |
| `/project/1/` | `/projects/ada/` | ADA |
| `/project/2/` | `/projects/defacto/` | DeFacto |
| `/project/7/` | `/projects/parkinson-motor-fluctuations/` | IoT infrastructure for monitoring motor fluctuations in Parkinson's disease |
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

Three restored project records — OPERA 4.0, Bip-Bip and Smart-Pump — were present on the
legacy `/projects/` page, but their numeric `/project/<id>/` addresses have not been verified
from a public source. No `legacyId` is guessed for them, so no compatibility URL is invented.

Pietro Turco and Samuele Santacà were not in the legacy database; their records were created
for this site and their exact titles still need confirmation.

## People relationship reconciliation

The old site mixed current members, former members and external collaborators in one roster.
The new site records the person's **current relationship to CISD** separately from their
current institutional role. `relationship: member` is the default; restored external or
cross-department collaborators use `relationship: collaborator` and appear in a separate
Collaborators section.

- **Mario Libro** — legacy profile 45 and the legacy ESD page identify him with ESD. The
  current University of Verona record lists him as a doctoral student in Computer Science,
  39th cycle, through 30 September 2026. He is therefore restored as a current ESD member,
  with the Department of Computer Science stated explicitly because it differs from the
  site's default DIMI affiliation.
- **Nicola Dall'Ora** — legacy profile 8 and the ESD area record establish his ESD history.
  Current Guglielmo Marconi University records place him in the Department of Engineering
  Sciences. He is restored as an ESD collaborator, not as a current DIMI member.
- **Sebastiano Gaiardelli** — legacy profile 21 and the ESD area record establish his ESD
  history. Current Technical University of Munich records list him as a Postdoctoral
  Researcher at the Chair of Cyber-Physical Systems in Production Engineering. He is
  restored as an ESD collaborator.
- **Davide Quaglia** — legacy profile 29 identifies him as Associate Professor at the
  Department of Computer Science and the old CISD records associate his work with both ESD
  and the former NeST area. The current University record still lists him as Associate
  Professor at the Department of Computer Science. Because NeST is not a current CISD group,
  the new record preserves the explicit ESD association and marks him as collaborator.
- **Tiziano Villa** — legacy profile 20 was associated primarily with the former ForME area,
  which is not part of the current CISD group set. The current University record lists him
  as Honorary Professor at the Department of Computer Science. He is therefore restored as
  an ungrouped CISD collaborator rather than being assigned to ESD, PARCO or IoT4Care by
  inference.

No legacy e-mail, telephone, office or CV data is republished in these records.

## Historical project reconciliation

The legacy project index had several open-ended `To Today` values that were stale by 2026.
Historical records keep the legacy identity, but a stale period is reconciled against a more
specific public source rather than being presented as an active project.

- **ADA** — the legacy detail page `/project/1/` explicitly gives 1 January 2017 to
  31 December 2019 and is preserved as the migration source for the dates. The current
  University project record gives a different administrative start (1 January 2018,
  24 months); its permanent institutional page is retained as the project URL.
- **Bip-Bip** — the legacy index said `From Jan. 1, 2019 - To Today`. A public project-activity
  record gives October 2018 to September 2019. The Markdown date fields use the first and
  last day of those stated months solely to fit the site's day-precision schema; the source
  itself is only month-precise.
- **Smart-Pump** — the legacy index said `From Jan. 1, 2020 - To Today`. Public project
  records identify the FSE project code `1695-0013-1463-2019`, Graziano Pravadelli as
  scientific lead and a July 2020 to July 2021 activity period. The date fields similarly
  normalise that month-level period to its month boundaries.
- **OPERA 4.0** — the legacy CISD site classified the project under Networked Systems and
  Technologies (NeST). The official University ESD project history also lists OPERA 4.0;
  the new site therefore associates the historical record with ESD while preserving the
  former NeST classification explicitly in the project text. The institutional record gives
  1 January 2021 and a duration of 24 months, represented as 2021–2022.
- **Parkinson motor-fluctuation IoT infrastructure** — `/project/7/` provides exact dates,
  1 June 2021 to 31 May 2022, so no reconciliation is needed.

Funding amounts from the legacy site and public grant records are deliberately not migrated.

## Editorial decisions behind the published set

- **People** — the roster distinguishes current members from collaborators. It is still a
  curated selection rather than a copy of all 34 legacy profiles. Mario Libro is restored as
  an ESD member; Nicola Dall'Ora, Sebastiano Gaiardelli, Tiziano Villa and Davide Quaglia are
  restored as collaborators with their current affiliations. Absence of any other legacy
  profile remains neither a statement that the person is "former" nor that they are alumni.
- **Research** — the old database modelled ESD, PARCO and IoT4Care as "research areas"
  alongside two groups (ForME, NeST) that are separate research groups of the department.
  Here ESD, PARCO and IoT4Care are *groups*, and research *topics* were written from the
  groups' own descriptions and their published work. ForME and NeST are not part of CISD.
- **Projects** — the seven projects shown by the former CISD project index are now represented:
  DeFacto, STRATEGUS, OPERA 4.0, Bip-Bip, Smart-Pump, ADA and the IoT infrastructure for
  monitoring motor fluctuations in Parkinson's disease. Historical people who are not in the
  published People collection remain plain-text provenance in the project body rather than
  being invented as references.
- **Publications** — a curated selection: work from 2020 onwards co-authored by someone
  listed under People, with three preprints removed that duplicate a published paper in the
  same selection. Entries the authors had hidden on the old site remain excluded. Fields the
  old database did not store (pages, volume, publisher) are absent; a DBLP refresh can add
  them. Project links are restored only where a public legacy record explicitly associates
  the publication with that project.
- **News** — four recent items. The rest of the 31 legacy posts were not published.
- **Photographs** — six published member profiles currently use portraits migrated from the
  legacy site. Identification came from the legacy profile records themselves (profile id →
  name → image file), not from recognising faces. Each migrated file had its metadata chunks
  removed without pixel re-encoding. Newly restored people and collaborators deliberately use
  the monogram fallback: a portrait that appeared on the old site is evidence of a past
  publication decision, not consent for this site.

  | Person | Legacy file | Published as | Size |
  | --- | --- | --- | --- |
  | Franco Fummi | `media/profile_images/franco_fummi.jpg` | `people/franco-fummi.jpg` | 93×120 |
  | Michele Lora | `media/profile_images/MicheleLora.jpg` | `people/michele-lora.jpg` | 1235×1498 |
  | Enrico Fraccaroli | `media/profile_images/foto034230.jpg` | `people/enrico-fraccaroli.jpg` | 100×120 |
  | Francesco Biondani | `media/profile_images/profilolinkedin.jpg` | `people/francesco-biondani.jpg` | 960×1280 |
  | Nicola Bombieri | `media/profile_images/nicola_bombieri.jpg` | `people/nicola-bombieri.jpg` | 119×128 |
  | Graziano Pravadelli | `media/profile_images/GP_June_21.png` | `people/graziano-pravadelli.png` | 212×291 |

  No other legacy portrait was copied as part of the people/collaborator restoration. No CV,
  document or event photograph was migrated.
- **Never migrated** — user accounts, password hashes, sessions, invite keys, admin logs;
  e-mail addresses, telephone, office and fax fields; CV files; deleted records.
- **Not part of this site** — the independent `/wg10-5/` and `/essm-workshop/` static sites,
  the `/m9a/` document store, the `/reloaddash/` application, and the legacy
  authentication, administration and API routes. No compatibility addresses are provided
  for them.
