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
| Public researcher profiles and bibliographic indexes | research interests and public researcher links where institutional pages are sparse |
| Public funder/project records | historical project codes and period reconciliation where the legacy listing was stale |
| Research material supplied by group members | current doctoral research descriptions for Pietro Turco and Samuele Santacà |
| Current roster review supplied by CISD group members | current membership and laboratory associations where the public institutional record does not encode the CISD structure |
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
| `/profile/7/` | `/people/florenc-demrozi/` | Florenc Demrozi |
| `/profile/10/` | `/people/cristian-turetta/` | Cristian Turetta |
| `/profile/23/` | `/people/enrico-martini/` | Enrico Martini |
| `/profile/39/` | `/people/christian-farina/` | Christian Farina |
| `/profile/25/` | `/people/francesco-tosoni/` | Francesco Tosoni |
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

Pietro Turco and Samuele Santacà were not in the legacy database. Pietro's current PhD status
is verified from the University record and his research description is reconciled with his
2025 end-of-year report supplied for this migration. Samuele is published as **Incoming PhD
Student** on the basis of the current status supplied by the group; his research description
is based on the thesis abstract supplied for this site rather than on a legacy record.

## People relationship reconciliation

The old site mixed current members, former members and external collaborators in one roster.
The new site records the person's **current relationship to CISD** separately from their
current institutional role. `relationship: member` is the default; restored external or
cross-department collaborators use `relationship: collaborator` and appear in a separate
Collaborators section. `groups:` records current laboratory associations only; a current
CISD member may therefore remain ungrouped rather than being assigned to a laboratory by
research-topic similarity.

- **Filippo Ziche** — added after the current roster review identified him as a PARCO member.
  The University of Verona PREPARE project lists him as a PhD student; current research
  records document work on GPU algorithms for dynamic graphs and edge-oriented temporal
  action segmentation. No legacy id or portrait is inferred.
- **Ferdinando Pompanin** — added as a PARCO member from the same current roster review.
  University records list him among the Intelligent Systems Engineering doctoral students
  and document his IMPROVENET Smart Manufacturing doctoral position. His research profile
  is limited to publicly documented human-motion prediction and human-centred interfaces.
- **Daniele Nicoletti** — the current roster review identifies him as part of CISD but does
  not place him in ESD, PARCO or IoT4Care. He is therefore a current ungrouped member rather
  than being assigned to ESD because his verification research is scientifically close to
  it. The University record lists him as a 39th-cycle Computer Science PhD student through
  30 September 2026; public research records support the specification-mining and hybrid-
  system verification description.
- **Samuele Germiniani** — likewise retained as a current CISD member without a forced
  laboratory association. Current institutional records place him at Guglielmo Marconi
  University and record an active research appointment at DIMI through 31 December 2027.
  Public bibliographic records support the assertion-mining, runtime-verification and
  edge-cloud monitoring research description.
- **Mario Libro** — legacy profile 45 and the legacy ESD page identify him with ESD. The
  current University of Verona record lists him as a doctoral student in Computer Science,
  39th cycle, through 30 September 2026. He is therefore restored as a current ESD member,
  with the Department of Computer Science stated explicitly because it differs from the
  site's default DIMI affiliation.
- **Nicola Dall'Ora** — legacy profile 8 and the ESD area record establish his ESD history.
  Current Guglielmo Marconi University records place him in the Department of Engineering
  Sciences and public researcher material records his continuing research collaboration with
  Verona. He is restored as an ESD collaborator, not as a current DIMI member.
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
- **Florenc Demrozi** — legacy profile 7 and the historical IoT4Care records establish his
  role in the Verona research line and identify him as referent for several IoT4Care projects.
  His current public record lists him as Full Professor at the University of Stavanger. He
  is therefore published as an IoT4Care collaborator with his current Norwegian affiliation.
- **Cristian Turetta** — legacy profile 10 documents his IoT4Care work and the current DIMI
  IoT4Care roster lists him as a research appointee. He is published as a current IoT4Care
  member with the English role label `Research Assistant`.
- **Enrico Martini** — legacy profile 23 identifies his Verona research history; current DIMI
  records list an active research appointment and PARCO membership. His completed PhD and
  current work on human-motion modelling and human–robot interaction are reconciled against
  his public CV. He is therefore a current PARCO member.
- **Christian Farina** — legacy profile 39 is retained for URL continuity, but its old role is
  not copied. Current public material records completion of his MSc in 2025 and active doctoral
  research with IoT4Care on contactless mmWave sensing. He is published as a current IoT4Care
  PhD Student.
- **Francesco Tosoni** — legacy profile 25 called him a PhD Student. University records show
  completion of his PhD in 2026 and current publications describe a postdoctoral position at
  the University of Verona. He is published as an ESD collaborator and Postdoctoral Researcher.
  No contract end date is stated because the exact date has not been verified from a public
  institutional record.

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

- **People** — the roster distinguishes current members from collaborators and is curated
  against current public roles rather than copying all 34 legacy profiles. The August 2026
  roster publishes 22 people: current members across ESD, PARCO and IoT4Care, current CISD
  members without a forced laboratory assignment, plus collaborators whose relationship to
  the group is intentionally preserved. A missing legacy profile is still not automatically
  labelled "former" or "alumni".
- **Research** — the old database modelled ESD, PARCO and IoT4Care as "research areas"
  alongside two groups (ForME, NeST) that are separate research groups of the department.
  Here ESD, PARCO and IoT4Care are *groups*, and research *topics* were written from the
  groups' own descriptions and their published work. ForME and NeST are not part of CISD.
- **Projects** — the seven projects shown by the former CISD project index are represented:
  DeFacto, STRATEGUS, OPERA 4.0, Bip-Bip, Smart-Pump, ADA and the IoT infrastructure for
  monitoring motor fluctuations in Parkinson's disease. When a historical contributor is
  also published under People, a structured project reference is added only where the legacy
  project record explicitly supports it. This is why Florenc Demrozi is linked to four
  IoT4Care projects and Cristian Turetta to ADA.
- **Publications** — a curated selection: work from 2020 onwards co-authored by someone
  listed under People, with three preprints removed that duplicate a published paper in the
  same selection. Entries the authors had hidden on the old site remain excluded. Fields the
  old database did not store (pages, volume, publisher) are absent; a DBLP refresh can add
  them. Project links are restored only where a public legacy record explicitly associates
  the publication with that project.
- **News** — four recent items. The rest of the 31 legacy posts were not published.
- **Photographs** — the site owner has explicitly confirmed that the portraits published on
  the former CISD site are group-owned material and may be reused on this replacement site.
  This is the current publication approval for the migrated legacy portraits; it supersedes
  the earlier migration precaution that treated the old publication decision as insufficient
  on its own. Portraits are still copied locally, never hotlinked, and image metadata must be
  stripped before a file enters `src/content/people/`.

  Six portraits were already migrated and metadata-cleaned:

  | Person | Legacy file | Published as | Size |
  | --- | --- | --- | --- |
  | Franco Fummi | `media/profile_images/franco_fummi.jpg` | `people/franco-fummi.jpg` | 93×120 |
  | Michele Lora | `media/profile_images/MicheleLora.jpg` | `people/michele-lora.jpg` | 1235×1498 |
  | Enrico Fraccaroli | `media/profile_images/foto034230.jpg` | `people/enrico-fraccaroli.jpg` | 100×120 |
  | Francesco Biondani | `media/profile_images/profilolinkedin.jpg` | `people/francesco-biondani.jpg` | 960×1280 |
  | Nicola Bombieri | `media/profile_images/nicola_bombieri.jpg` | `people/nicola-bombieri.jpg` | 119×128 |
  | Graziano Pravadelli | `media/profile_images/GP_June_21.png` | `people/graziano-pravadelli.png` | 212×291 |

  Additional authorised legacy source files have been identified for Mario Libro
  (`media/profile_images/2025_fototessera_200.jpg`), Cristian Turetta
  (`media/profile_images/me.jpg`) and Francesco Tosoni
  (`media/profile_images/_MG_9951.jpg`). They are not hotlinked and are not represented by
  substitute images: the migration tooling currently cannot retrieve their binary contents
  from the legacy host. They remain monograms until the original files can be exported and
  passed through the same metadata-hygiene checks. Other restored profiles follow the same
  rule when an original portrait becomes available.
- **Never migrated** — user accounts, password hashes, sessions, invite keys, admin logs;
  e-mail addresses, telephone, office and fax fields; CV files; deleted records.
- **Not part of this site** — the independent `/wg10-5/` and `/essm-workshop/` static sites,
  the `/m9a/` document store, the `/reloaddash/` application, and the legacy
  authentication, administration and API routes. No compatibility addresses are provided
  for them.
