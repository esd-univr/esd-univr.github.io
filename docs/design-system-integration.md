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
| 2 | `HANDOFF.md` says "Assets: None … the mark stays set type", and `readme.md` CAVEAT 3 says "No logo and no portraits". But `readme.md`'s ICONOGRAPHY section and the kit's `assets/README.md` document `logo-cisd.png` in detail, and `base.css` ships rules for it. | **The mark exists and ships**, at `public/images/brand/logo-cisd.png`, with `brand.logo` set. |
| 3 | `readme.md`'s INDEX says the kit's `assets/` is "empty by design". | Wrong — it holds the mark. |
| 4 | The kit's `assets/README.md` describes the mark as having a "transparent background". | **The file has no alpha channel** and an opaque `#ffffff` ground. See "The mark" below. |
| 5 | `HANDOFF.md` §2b says this repository has four theme scopes, including `[data-theme='light']`. | It has **three**. There is no `[data-theme='light']` block, because the media query is scoped `:root:not([data-theme='light'])`. The repository's structure wins. |
| 6 | `readme.md` says `--text-4xl` "is reserved for the home hero", but `base.css` sets `.page-open h1` to `--text-3xl` and explains why (at `--text-4xl` capped at 18ch the site name broke into five lines). | **`base.css` wins.** Every page opening, including the home hero, is `--text-3xl` at 24ch. `--text-4xl` is currently unused. |
| 7 | The kit's `ui_kits/website/README.md` and `readme.md` both state that this repository contained no `.astro` files at all at the 27 August re-read. | **Simply false.** It had 20 routes, 3 layouts and 12 components. |

Item 7 has a lasting consequence worth remembering: the kit's **index** screens are genuine
recreations of real Astro source, but its **detail** pages and `DetailLayout` were designed
from the system without ever seeing `people/[slug].astro`, `projects/[slug].astro`,
`news/[slug].astro` or `opportunities/[slug].astro`. Those four routes exist and already
carry a metadata-sidebar layout. Reconcile against them; do not treat detail pages as
greenfield.

## Where this repository departs from the design system

Two values, both for the same reason: the system verified them in one context and this site
paints them in more than one.

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

### The home groups margin column: `5rem` → `6.5rem`

`readme.md` specifies a 5rem margin column for group short names. At `--text-sm` with
`0.08em` letter-spacing, "IoT4Care" measures **92.2px** (5.8rem) and wrapped onto two lines.
The type floor's rule is to give the column room, never to step the type down.

## The mark

`public/images/brand/logo-cisd.png` — a five-arc "C" (green, blue, red, purple, gold) around
a circuit-etched sphere, with **ISD** in dark grey `#3d3d3d`. The arc's purple is where the
interface accent comes from; PARCO takes the blue arc and IoT4Care the green.

Rules carried over from the system: never recoloured, rotated, cropped, redrawn, inverted or
filtered; only on `--color-paper` or `--color-paper-2`; never beside the set-type wordmark,
which `base.css` hides whenever the anchor contains an image; height `2.4rem`, fluid, never
fixed px.

**One deviation.** The system specifies a `--light-paper` plate in dark theme only. The
supplied file has no alpha channel — its `#ffffff` ground is baked in — so a
`--light-paper` plate would frame a white image in a visibly different border. The plate
therefore uses `--brand-mark-ground` (`#ffffff`) and applies in **both** themes, which turns
an unavoidable white rectangle into a deliberate one with the system radius.

A transparent or vector version of the mark would remove all of this: plate in dark theme
only, with `--light-paper`, exactly as specified. It is worth asking the group for one — the
current file is a 1119×816 raster rendering at roughly 52×38px.

The mark's five colours are recorded as `--brand-green`, `--brand-blue`, `--brand-red`,
`--brand-purple`, `--brand-gold` and `--brand-mark-ink`. These are **brand-only**: the red
and the gold never enter the interface.

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
- **`src/content/assets/`** does not exist yet. The Assets & Tools entries (the ICE
  Laboratory, HIFSuite, EDACurry, CHASE) come from the previous site,
  `https://cisd.di.univr.it/assets/`. The collection needs a schema before any entry is
  written, and `/assets/` must stay out of the navigation until the route exists, or
  `npm run verify` fails on an unresolvable internal link.

## See also

- `AGENTS.md` — the page contract, and the group-colour and density rules
- `docs/site-settings.md` — every token, the palette table, how to repalette safely
- `docs/content-safety.md` — what may be added under `public/`, and image metadata
