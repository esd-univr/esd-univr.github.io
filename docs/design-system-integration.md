# The CISD design system, and how this repository reconciles with it

The site's colours, type, spacing, radius and rules come from a design system authored
outside this repository. This file records **what was adopted, what was not, and why** —
everything a future change needs in order to stay consistent without re-deriving the
decisions.

It does **not** duplicate the design system itself. The system's own guide, reference CSS
and UI kit are not tracked here.

```
~/.claude/skills/cisd-design/     the design system (not in this repository)
src/styles/tokens.css             the values, as adopted
src/styles/base.css               the element defaults and utilities, as adopted
```

The system is installed as a machine-wide Claude Code skill rather than committed, on the
handoff bundle's own advice: *"then it is available in every repository on your machine and
never appears in a diff."* Re-import it from the Claude Design project
`f705d5f9-42cc-4ab2-ae89-5ae18a4a9f57` if it is missing. `github.md` inside the skill
records the last sync.

## Which source wins

The design system is a bundle of several documents written at different times, and they do
not all agree. Resolve in this order:

1. **`AGENTS.md` in this repository** — over everything, always.
2. **`tokens/*.css` and `base.css`** in the skill — the implementation, and the newest part.
3. **`readme.md`** in the skill — the design guide.
4. **`HANDOFF.md`** in the skill — the 27 August change list. Oldest, and partly superseded.

Across that boundary the division is:

- **The design system is ground truth for values** — a colour, a size, a spacing step, a
  radius. Where they disagree, the system wins.
- **This repository is ground truth for structure and content** — what a page contains,
  which routes exist, how the theme is switched, what a component is called. Where they
  disagree, the repository wins.

## Reconciliations already made

Each of these is a place where the bundle contradicted itself or contradicted the
repository. The resolution is already in the code; do not silently re-open one.

| # | The disagreement | Resolution |
| --- | --- | --- |
| 1 | `HANDOFF.md` §2a gives an indigo accent and violet / blue / cyan group hues (`#6a2fbe`, `#1c56c8`, `#0d6f86`). `tokens/palette.css` and `readme.md` give the logo's purple `#9d3e91` and the mark's own arcs. | **The CSS wins.** The accent is `#9d3e91`; the group hues are the mark's arcs. |
| 2 | `HANDOFF.md` says "Assets: None … the mark stays set type", and `readme.md` CAVEAT 3 says "No logo and no portraits". But `readme.md`'s ICONOGRAPHY section and the kit's `assets/README.md` document `logo-cisd.png` in detail, and `base.css` ships rules for it. | **The file exists**, at `public/images/brand/logo-cisd.png`, but it is not used at masthead scale — see "The mark" below. `brand.logo` is `undefined`, so `HANDOFF.md` turns out to be right by accident: the masthead is set type. |
| 3 | `readme.md`'s INDEX says the kit's `assets/` is "empty by design". | Wrong — it holds the mark. |
| 4 | The kit's `assets/README.md` describes the mark as having a "transparent background". | **The file has no alpha channel** and an opaque `#ffffff` ground. See "The mark" below. |
| 5 | `HANDOFF.md` §2b says this repository has four theme scopes, including `[data-theme='light']`. | It has **three**. There is no `[data-theme='light']` block, because the media query is scoped `:root:not([data-theme='light'])`. The repository's structure wins. |
| 6 | `readme.md` says `--text-4xl` "is reserved for the home hero", but `base.css` sets `.page-open h1` to `--text-3xl` and explains why (at `--text-4xl` capped at 18ch the site name broke into five lines). | **`base.css` wins.** Every page opening, including the home hero, is `--text-3xl` at 24ch. `--text-4xl` is currently unused. |
| 7 | The kit's `ui_kits/website/README.md` and `readme.md` both state that this repository contained no `.astro` files at all at the 27 August re-read. | **Simply false.** It had 20 routes, 3 layouts and 12 components. |
| 8 | `readme.md` and `HANDOFF.md` §5 both list nine glyphs as "in use" and give rules for them. Nothing in the kit — not `base.css`, not `styles.css`, not the website kit — references `.icon` or `--font-icon` even once. | **The icon layer was declared and never placed.** "Glyphs in use" is a wish list, so it carries no weight against the rules that *are* exercised. See "Iconography" below. |

Item 7 had a lasting consequence: the kit's **index** screens are genuine recreations of real
Astro source, but its **detail** pages and `DetailLayout` were designed from the system
without ever seeing `people/[slug].astro`, `projects/[slug].astro`, `news/[slug].astro` or
`opportunities/[slug].astro`. Those four routes existed and already carried a
metadata-sidebar layout, so `src/layouts/DetailLayout.astro` was reconciled **against them**
rather than ported from the kit. See "The detail-page family" below.

## Where this repository departs from the design system

Three departures. The first two share a cause — the system verified a colour in one context
and this site paints it in more than one — and the third is a consequence of the type floor.
The mark is a fourth, described in its own section below.

### `--light-iot4care`: `#2f7d43` → `#2a783f`

The design system checked the group hues against `--color-paper` only. IoT4Care's green
clears 4.5:1 there (4.74:1) but fails on every other ground this site actually uses:

| Ground | `#2f7d43` | `#2a783f` |
| --- | --- | --- |
| `--color-paper` | 4.74:1 | 5.09:1 |
| `--color-paper-2` (`.band--sunken`) | **4.31:1** | 4.62:1 |
| `.band--tint`, ESD | **4.31:1** | 4.62:1 |
| `.band--tint`, PARCO | **4.26:1** | 4.56:1 |
| `.band--tint`, IoT4Care | **4.32:1** | 4.64:1 |

`#2a783f` is the same OKLCh hue (149.1°) and the same chroma (0.118) with lightness lowered
0.016 — the minimum change that clears the bar everywhere. `-strong` moves `#246034` →
`#1f5b30` by the same step. Deriving it by pushing chroma to the gamut edge instead gives a
vivid `#037a2c`, which was rejected: the system has no status colours and a saturated green
reads as "success".

### The whole dark ground: `#0a0f1e` → `#1a2b56`

The design system's dark ground was OKLCh **L 0.172 at chroma 0.032** — a very dark
near-neutral. It read as black rather than as blue, which is not what a cool palette is for.
This repository ships **L 0.300 at chroma 0.081**: lighter, and actually blue.

This is the largest departure in the integration, and it is a whole-ramp change, not a
one-token tweak. Two things had to be got right:

1. **Lightening the ground alone would cut every foreground's contrast.** So each
   foreground moved with it.
2. **Sizing each foreground to the AA floor instead would destroy the hierarchy.** That was
   the first attempt and it failed: `--dark-ink-2` and `--dark-ink-3` landed **0.010** apart
   in OKLCh lightness, where they had been **0.134** apart. Secondary and tertiary text
   became indistinguishable — every ratio passed and the design was ruined.

The ramp is therefore rebuilt **bottom-up with the original offsets preserved**:
`--dark-ink-3` sits just above the 4.5:1 floor on the lightest ground, and every other
foreground keeps the lightness offset above it that it had in the design system. The gaps
come out at 0.113 and 0.117 against the original 0.134 and 0.146.

| | design system | shipped |
| --- | --- | --- |
| `--dark-paper` | `#0a0f1e` (L 0.172, C 0.032) | `#1a2b56` (L 0.300, C 0.081) |
| `--dark-paper-2` | `#151b2f` | `#253865` |
| `--dark-ink` | `#e6e9f5` | `#eff4ff` |
| `--dark-ink-2` | `#b2b9d4` | `#becef0` |
| `--dark-ink-3` | `#888fae` | `#97aad1` |
| `--dark-rule` | `#262e47` | `#344878` |
| `--dark-rule-strong` | `#c3c9de` | `#d5dff3` |
| `--dark-accent` / `-strong` | `#d79ccf` / `#e8bfe1` | `#edb1e5` / `#fed5f8` |
| `--dark-focus` | `#e0a6d6` | `#f6bcee` |
| `--dark-selection` | `#4a2a46` | `#674662` |
| `--dark-parco` / `-strong` | `#8fa5e8` / `#b3c2f2` | `#a3baff` / `#c5d4ff` |
| `--dark-iot4care` / `-strong` | `#6cc47f` / `#97d8a4` | `#89d998` / `#aeeeb9` |

Ink on paper is **12.5:1**, down from 15.8:1 and still well past the 7:1 this repository
requires — that headroom was never used. All **65** foreground/ground pairs clear their
minimum across paper, paper-2 and the three tinted plates; the tightest is `--dark-ink-3` on
`--dark-paper-2` at **4.90:1**.

Two side effects, both wanted: the three tinted Research plates now separate from the ground
instead of being almost invisible, and the mark's white plate is far less harsh against a
lighter navy.

**If you change the dark ground again, move the whole ramp and check the gaps, not just the
ratios.** A palette where every pair passes AA can still be a flat, unreadable one.

### The home groups margin column: `5rem` → `6.5rem`

`readme.md` specifies a 5rem margin column for group short names. At `--text-sm` with
`0.08em` letter-spacing, "IoT4Care" measures **92.2px** (5.8rem) and wrapped onto two lines.
The type floor's rule is to give the column room, never to step the type down.

## The colour budget

The site used to be one sheet of `--color-paper` on every page. It is not any more, and the
rules below are what keep it from becoming motley instead. They are worth reading before
adding colour anywhere.

**1. Tone does the heavy lifting, and tone is not colour.** Full-bleed `.band` /
`.band--sunken` alternate the two paper tones, so a page reads as plates. This accounts for
most of the effect and introduces no hue at all. The footer is the last band — it carries
`--color-paper-2` so the page closes instead of fading out on the same white as its content.

**2. Hue only at identity scale.** Mono labels at `--text-sm` or smaller, the 2px rule that
opens a group or topic block, and interaction states. Never a heading, never running text,
never a large fill.

**3. One tinted surface per page.** `.band--tint` or `.tint`, and it needs padding from its
consumer — `base.css` gives it the ground, the hairline and the radius, not the box. Research
is the deliberate exception: its three tinted plates *are* the page's subject.

**4. A group hue belongs where the page is organised by group.** This one is not in the design
system, and without it the site turns motley:

| Organised by group → hue per block | Mixes groups per row → parent accent |
| --- | --- |
| Research (one tinted plate per group) | News index and news detail |
| People (one plate and one hue per group) | Publications |
| The groups block on the home page | Projects index (organised by status) |
| A project, proposal or person page | |

There is an accessibility reason as well as a visual one. `NewsList` prints a date and a
category, never a group, so a group hue on a news row would be the sole carrier of
information that is nowhere in the text — which "colour never carries meaning alone" forbids.
A news item can also belong to two groups (`2026-08-26-edge-cloud-verification.md` is
`[parco, iot4care]`) and a subtree may only have one accent. Where the hue *is* applied, the
group's name or acronym is always printed beside it.

### Where each page stands

| Page | Tone | Hue | Tinted surface |
| --- | --- | --- | --- |
| `/` | hero paper → news sunken → groups paper | per group row, 2px opening rule | — |
| `/research/` | — | per group section; topics inherit it | 3 × `band--tint` |
| `/people/` | alternating per group | per group section, heading included | — |
| `/projects/` | Active paper → Completed sunken | parent accent | — |
| `/news/` | alternating per year | parent accent | — |
| `/publications/` | — | parent accent | — |
| `/opportunities/` | alternating per status | "open" status word | `.tint` on the empty state |
| `/contacts/` | — | — | `.tint` on the address |
| project / proposal detail | — | the entity's group | `.tint` on the facts strip |
| news / person detail | — | person: its group. News: parent accent | — |
| `/privacy/`, `/404` | — | — | — |

`/publications/` is left plain on purpose: its filter bar lives inside the opening, so a band
would mean splitting the opening block, and a 15 000px list is already visually busy.

### A consequence of the reduced home page

The home page is the hero, three recent news items and the groups — nothing else. It was the
**only** consumer of `featured` on projects, publications and opportunities, so that field now
changes nothing anywhere on the site. It is kept in the schema, the `only an open opportunity
may be featured` invariant still holds, and `docs/{projects,publications,opportunities}.md`
say plainly that no page reads it. If the selections should show up again, the obvious homes
are the index pages — featured first on `/projects/`, for instance — but that is a decision,
not a fix to apply silently.

## The detail-page family

`src/layouts/DetailLayout.astro` is the frame for all four single-entity pages. It was not
ported from the kit: the four routes already shared a layout, byte for byte, copied into each
of them — the same `.layout` grid, the same `.main` section rhythm, the same `.aside` stack
and the same 56rem breakpoint, four times, plus the facts strip twice. The component is where
that already-existing family now lives.

**Taken from the design system**, which the repository did not have:

- a **hairline left rule** separating the sidebar, instead of nothing;
- stacking at **60rem** rather than 56rem, and when stacked the hairline moves to the top of
  the sidebar at full contrast, because there it separates two stacked blocks;
- `facts` as **data** — a page passes rows, it does not write the strip.

**Not taken:** the kit columns the main content at `minmax(0, var(--measure))`. The real
routes carry `PublicationList`, `ProjectList`, `NewsList` and `OpportunityList` in that
column, and 66ch strangles them. The main column stays `minmax(0, 1fr)` and running text is
capped by `.prose`, which is where "prose at `--measure`" actually belongs.

**The person page was the one that had to move.** It built its own frame on `BaseLayout`,
with the portrait set beside a `--text-4xl` name, and it was the last page whose `h1` did not
line up with every other page's. Its reading order is unchanged — groups, name, role,
affiliation — but the opening is now the shared one and **the portrait moved into the
metadata column**, where the other three pages already keep their entity's people and media.

One Astro detail worth knowing before editing the layout: **slotted content carries the
page's style scope, not the layout's.** A rule like `.main .section` written in
`DetailLayout` cannot see a `.section` passed in by a route. The layout therefore uses
`:global()` for every selector that reaches into its slots, anchored to its own `.main` and
`.aside`. Verified in the built pages: the first `.section` in the main column resolves to
`padding-top: 0` and `padding-bottom: var(--space-xl)` on all three live detail routes.

The opportunity detail route is real but currently unexercised — `src/content/opportunities/`
is empty on purpose, so no page is built from it.

## The mark

`public/images/brand/logo-cisd.png` — a five-arc "C" (green, blue, red, purple, gold) around
a circuit-etched sphere, with **ISD** in dark grey `#3d3d3d`. The arc's purple is where the
interface accent comes from; PARCO takes the blue arc and IoT4Care the green.

Rules carried over from the system: never recoloured, rotated, cropped, redrawn, inverted or
filtered; only on `--color-paper` or `--color-paper-2`; never beside the set-type wordmark,
which `base.css` hides whenever the anchor contains an image; height `2.4rem`, fluid, never
fixed px.

**Two deviations, and the second one supersedes the first.**

The system specifies a `--light-paper` plate in dark theme only. The supplied file has no
alpha channel — its `#ffffff` ground is baked in — so a `--light-paper` plate would frame a
white image in a visibly different border. The plate therefore uses `--brand-mark-ground`
(`#ffffff`) and applies in **both** themes.

More importantly, **the masthead does not use the mark at all.** The system puts it at
`2.4rem`, but the file is a 1119×816 raster: at roughly 52×38px the five arcs collapse into
a smudge, and a raster downscaled 21× is soft on top of that. Enlarging or re-processing it
is explicitly not the answer. So `brand.logo` is `undefined`, the masthead renders the
set-type wordmark, and `.mark-plate` exists as an opt-in for contexts large enough to carry
the mark legibly.

This is treated as **non-blocking**. When a vector or a small-size transparent asset is
supplied: set `brand.logo`, add the file's intrinsic dimensions in `Header.astro`, and — if
it has real transparency — narrow the plate back to dark theme only with `--light-paper`,
exactly as the system specifies. `base.css` already drops the set-type "CISD" whenever the
masthead anchor contains an image, so the wordmark gets out of the way on its own.

The mark's five colours are recorded as `--brand-green`, `--brand-blue`, `--brand-red`,
`--brand-purple`, `--brand-gold` and `--brand-mark-ink`. These are **brand-only**: the red
and the gold never enter the interface.

## Iconography

The system adopts **Material Symbols Rounded** (outlined, weight 400, because its stroke reads
at the same visual weight as the 1px rules) from Google Fonts, and lists nine glyphs. This
repository ships **one icon, as an inline SVG path, and no font at all.** Three findings got it
there.

**Eight of the nine glyphs have nowhere to go.** `hub`, `developer_board`, `memory`,
`monitor_heart`, `science`, `groups`, `menu_book` and `campaign` are *identity* icons for
*compact* surfaces, and this site has neither: `data-density='compact'` is defined in
`base.css` and set on no page, and where a group needs to be identifiable the acronym or the
group name is already printed beside it (`AGENTS.md`, "Group colour is claimed, never
passed"). The ninth, `arrow_forward`, is the one affordance on the list, and the system
separately requires `.more`'s arrow to stay a text `→` "not a glyph asset".

**One affordance is real.** A link that leaves the site, in a list that mixes the two: an
asset's sidebar puts its own group page directly beside its upstream repository, and a
person's puts the group page beside four external profiles. Nothing in the type-and-rule
vocabulary says that. So `open_in_new` is placed once, in `LinkList`, on any absolute
`http(s)` href — every internal link in the site is root-relative. It is `aria-hidden`,
because the label beside it already says where the link goes.

**One glyph does not justify a font.** `@fontsource` was measured first and rejected: the
smallest single-axis cut of the 6597-glyph variable font is 960 kB, the full one 5.3 MB, and
this repository may not reference a third-party font host either (`npm run verify` fails on
`fonts.googleapis.com`). Hand-subsetting the font *worked* — pinned to the system's instance
(FILL 0, wght 400, GRAD 0, opsz 24) it came to 720 bytes — but it needed a Python generator
script, a committed binary, and a test to catch the component's glyph list drifting from the
generator's. That is a maintenance surface out of all proportion to one icon, so it was
removed again. The outline now lives in `src/components/Icon.astro` as a path, the way the
theme toggle in `Header.astro` already does, in the `0 -960 960 960` viewBox Google's own SVG
exports use.

Everything else about the system's icon rules is kept: outlined weight 400,
`--color-accent` and never ink, never inside running prose, never the sole carrier of meaning.

**Still a flagged substitution.** Material Symbols is not CISD's own icon set, because CISD
has none; the outline is © Google LLC under the Apache License 2.0, recorded in
`THIRD_PARTY_NOTICES.md`. If a set is adopted,
`src/components/Icon.astro` is the only file that names a shape. Adding a *second* icon is a
decision, not a chore — it needs an affordance that type and rules cannot state, on a surface
that is not running prose.

## Two records that must never be ported

The kit's `data.js` invents two records purely so their layouts could be reviewed, and marks
both `fictional: true`:

- a seminar news item, `fictional-seminar-digital-twins`;
- a thesis proposal, `fictional-digital-twin-maintenance`.

Neither is in `src/content/` and **neither may ever be added**. `src/content/opportunities/`
is empty on purpose.

## Verifying a change

Two checks are specific to this integration and are not covered by `npm run ci`.

**Contrast, against every ground.** There are four grounds now, not one: `--color-paper`,
`--color-paper-2` and the three `.band--tint` mixes. A hue can pass on paper and fail on a
sunken band — IoT4Care's did. Check `--color-ink` at 7:1, and `--color-ink-2`,
`--color-ink-3`, `--color-accent`, `--color-accent-strong` and all three group hues at
4.5:1, in both themes. The tint grounds are
`color-mix(in oklab, <hue> 7%, var(--color-paper))`, so they must be computed in OKLab, not
sRGB. `--color-rule` and `--rule-accent` are exempt: they are hairlines, never text.

**The page contract.** `main h1` sits at the same left offset on every page of the same width
class, and no page nests a `.container` inside another. See the contract in `AGENTS.md`.
Note that `container--narrow` and `container--wide` pages are *designed* to differ from
default-width pages on wide viewports — at 2000px the offsets are 240.5px (default), 128.5px
(wide) and 544.5px (narrow) — so the test compares like with like.

## Keeping the two in sync

The design system is the source of truth for values; this repository is the source of truth
for content and structure. When a token changes in the system, re-import the skill and
reconcile `src/styles/tokens.css` against it — keeping the departures listed above, and
re-checking contrast if a hue moved. When this site's structure changes, the design session
re-reads the repository from its public files.

Whoever changes a palette value must also update the table in `docs/site-settings.md` and the
four colours repeated inline in `src/layouts/LegacyRedirect.astro`.

## Still open

- **A vector or dark-ground version of the mark**, which would remove the plate.
- **`brand.favicon` and `brand.ogImage`** are still `undefined`; both can be derived from the
  mark once approved.
- **Portraits** stay monograms until publication is approved (`docs/content-safety.md`).
- **Two shortened strings** — a one-sentence mission and a one-clause group summary — are
  proposed by the kit for the home page and the compact group cards. They are *proposals*
  and need the group's approval before they are published; the full wording in
  `src/data/site.ts` and `groups.yaml` is what ships until then.
- **The Assets & Tools copy is in American spelling** (*centers*, *modeling*, *optimizing*,
  *analyze*) against the house British style. All five entries were migrated verbatim from
  `https://cisd.di.univr.it/assets/` rather than silently rewritten; normalising the spelling
  is an editorial decision, not a migration one. See `docs/assets.md`.
- **GLACIER has no published contact address.** The legacy page gave one, but it belongs to
  somebody who is not on the roster, so only the name is published
  (`docs/content-safety.md`).

## See also

- `AGENTS.md` — the page contract, and the group-colour and density rules
- `docs/site-settings.md` — every token, the palette table, how to repalette safely
- `docs/content-safety.md` — what may be added under `public/`, and image metadata
