# Mission, affiliation, branding and theme

Two files hold everything that is not a content record:

```
src/data/site.ts          name, mission, department, address, footer links, brand slots
src/styles/tokens.css     colours (light + dark), type, spacing, widths — the whole
                          visual language
```

## `src/data/site.ts`

Plain TypeScript, nothing generated. Edit a string and every page that uses it follows.

| Field | Where it shows |
| --- | --- |
| `shortName` | `CISD` — page titles, the footer, the header wordmark |
| `name` | The full name, spelled out next to the acronym |
| `title` | `<title>` of the home page and the Open Graph site name |
| `description` | Default meta description of every page. **Keep it under 160 characters.** |
| `mission` | The paragraph beside the title in the home page hero |
| `organisation.university` / `.universityUrl` | Named and linked in the footer and on `/contacts/` |
| `organisation.department` / `.departmentUrl` | Same |
| `organisation.address` | Lines of the postal address on `/contacts/` |
| `organisation.mapUrl` | A *link* to a map. Never an embedded map — the site loads nothing from third parties |
| `links.github` | Footer link |
| `brand.logo` / `.favicon` / `.ogImage` | Optional brand assets, see below |
| `locale` | `en`. The site is in English; individual news items can be Italian |

### Common edits

**Reword the mission.** Edit `mission`. It is one paragraph, shown large; write it to read
well on its own.

**Change the affiliation.** Edit `organisation.department` and `.departmentUrl` together,
and check `description` and `mission`, which name the department too. The current
affiliation is the Department of Engineering for Innovation Medicine (DIMI).

**Change the address.** Edit `organisation.address` — one array entry per line as it should
be printed — and `organisation.mapUrl` to match.

**Add a footer link.** Add a key to `links`, then use it in `src/components/Footer.astro`.
This one does need a component edit; it is the only case in this guide that does.

### Brand assets

```ts
brand: {
  logo: undefined,     // e.g. '/images/brand/cisd-logo.svg'
  favicon: undefined,  // e.g. '/images/brand/favicon.svg'
  ogImage: undefined,  // e.g. '/images/brand/og-cisd.png'
}
```

All three are deliberately `undefined`: no official CISD or University of Verona brand file
has been approved for this site yet. The header falls back to a text wordmark, and the
Open Graph card falls back to a text-only summary.

To enable one: put the file under `public/images/brand/`, set the slot to its path from the
site root (`/images/brand/…`), and run `npm run ci`.

**Do not add a University of Verona logo, a department logo or a group logo without
permission to use it.** Trademarked brand assets are not "just images".

## `src/styles/tokens.css`

Every colour, font size, spacing step, width, rule and radius the site uses is a custom
property declared once in this file. Components only ever reference the variables, so
changing the look means changing this file — not the components. **Custom properties are
the only theme source of truth**; a hard-coded colour anywhere else is a bug.

### Type, spacing, widths

| Group | Tokens |
| --- | --- |
| Type | `--font-sans`, `--font-serif`, `--font-mono`, `--text-xs` … `--text-4xl` |
| Leading | `--leading-tight` (1.15), `--leading-snug` (1.35), `--leading-body` (1.6), `--leading-prose` (1.7) |
| Spacing | `--space-2xs` … `--space-3xl` |
| Widths | `--measure`, `--container`, `--container-wide`, `--container-narrow`, `--gutter` |
| Detail | `--rule`, `--radius` |
| Motion | `--duration` (120ms), `--ease`, `--transition-link`, `--transition-control` |

The type and spacing scales use `clamp()` so they grow with the viewport; change the three
numbers inside a `clamp()`, not the places that use it.

### The type scale is an accessibility floor

The sizes are not a taste decision and must not be stepped down:

- running text never falls below **17px** — `--text-base` has a `1.0625rem` floor;
- the smallest step in the system is **14px** (`--text-xs`), reserved for mono metadata
  (eyebrows, years, resource links) and never used for prose;
- `--text-sm` is a real **16px**, so even a "small" caption sits at comfortable body size;
- line height is at or above 1.5 everywhere — 1.6 globally, 1.7 in `.prose`;
- text is left-aligned, never justified, and all-caps is limited to short mono labels.

This follows the British Dyslexia Association style guide and the Italian AID
recommendations for readers with dyslexia and other specific learning differences. IBM
Plex Sans is kept because it distinguishes **I / l / 1**.

**If a layout feels tight, cut content or widen the container. Never reduce a type size.**

The width tokens draw the line between reading and structure:

| Token | Value | Used for |
| --- | --- | --- |
| `--measure` | `66ch` | Long prose. Every `.prose`, `.lede`, `.measure` block and every list summary is capped here, so no line of running text ever gets too long to read. |
| `--container` | `94rem` | The default page width: masthead, footer, page headers, and every structured section — grids, rosters, project and publication lists. |
| `--container-wide` | `108rem` | Sections that should feel almost full-width. Currently the People and Opportunities directories. |
| `--container-narrow` | `56rem` | Long-form reading pages. Currently a news item. |
| `--gutter` | `clamp(1rem, 4vw, 2.5rem)` | The margin kept on both sides at every width. |

Three utility classes in `base.css` apply them. The modifiers only rebind `--container`, so
the width arithmetic lives in exactly one rule:

```html
<div class="container">…</div>                    <!-- 94rem  -->
<div class="container container--wide">…</div>     <!-- 108rem -->
<div class="container container--narrow">…</div>   <!-- 56rem  -->
```

`PageLayout.astro` takes a `width` prop (`"default" | "wide" | "narrow"`) that picks one for
a whole page:

```astro
<PageLayout title="People" width="wide">
```

Widening a container never widens running text: the prose caps are independent, so a wide
page gets more columns and more air, not longer lines.

### Colour: two palettes, one active theme, three group hues

Colour is declared in four layers, all in `tokens.css`:

1. `--light-*` — the light palette. Real hex values, defined once.
2. `--dark-*` — the dark palette. Real hex values, defined once.
3. `--color-*` — the active theme. An alias pointing at one of the two.
4. `[data-group]` — rebinds `--color-accent` to one group's hue inside one subtree.

Only layer 3 is switched. Components read layer 3 and never mention layer 1 or 2, so a
component cannot be "light-only" by accident.

| Active token | Light | Dark | Used for |
| --- | --- | --- | --- |
| `--color-paper` | `#f6f7fb` | `#1a2b56` | Page background, `.band` |
| `--color-paper-2` | `#eaecf5` | `#253865` | Surfaces: code, `pre`, portrait placeholder, toggle hover, `.band--sunken` |
| `--color-selection` | `#f2dcef` | `#674662` | `::selection` background |
| `--color-ink` | `#141a2e` | `#eff4ff` | Body text and headings |
| `--color-ink-2` | `#3b4468` | `#becef0` | Ledes, summaries, secondary prose |
| `--color-ink-3` | `#5a6383` | `#97aad1` | Eyebrows, meta, roles, captions |
| `--color-rule` | `#d3d8e8` | `#344878` | Hairline separators (`--rule`) |
| `--color-rule-strong` | `#141a2e` | `#d5dff3` | Masthead and footer edges, blockquote bar, current nav item |
| `--color-accent` | `#9d3e91` | `#edb1e5` | Link hover, group acronyms, toggle hover |
| `--color-accent-strong` | `#7e2f74` | `#fed5f8` | Selected text, the heavier accent |
| `--color-focus` | `#8a3580` | `#f6bcee` | Focus ring |

Light is a cool off-white ground with deep navy ink and brand-purple accents; dark is a
lit navy ground with near-white ink and lifted-purple accents. There are no gradients,
and no colour is used decoratively — every one of these has a job.

The accent is **the logo's purple arc**, sampled from the mark, so the interface and the
mark share one hue.

#### Group hues

Each research group owns one hue, taken from the logo's own arcs. ESD takes the purple,
which is also the parent accent.

| Group token | Light | Dark | Source |
| --- | --- | --- | --- |
| `--color-esd` / `-strong` | `#9d3e91` / `#7e2f74` | `#edb1e5` / `#fed5f8` | The mark's purple arc |
| `--color-parco` / `-strong` | `#334b9b` / `#263a7d` | `#a3baff` / `#c5d4ff` | The mark's blue arc, unchanged |
| `--color-iot4care` / `-strong` | `#2a783f` / `#1f5b30` | `#89d998` / `#aeeeb9` | The mark's green arc, darkened for contrast |

A subtree claims its hue declaratively, and everything inside that already paints with the
accent follows — **no component ever learns about groups**:

```html
<section data-group="iot4care"> … </section>
```

Three surfaces are derived from whichever accent is in scope, and re-mixed per subtree:
`--color-tint` (7% accent over paper, used by `.band--tint` and `.tint`),
`--color-tint-strong` (14%, for hover) and `--rule-accent` (45% accent mixed into the rule
colour). `.band--tint` and `.tint` are the **only** coloured backgrounds in the system.

**Colour never carries meaning on its own.** The acronym or the group name is always
present beside a coloured element.

The mark's own five arcs are recorded as `--brand-green / -blue / -red / -purple / -gold`
plus `--brand-mark-ink`. These are **brand-only**: red and gold never enter the interface,
and the mark is never recoloured.

### How the theme is chosen

In order:

1. **No choice made (the default).** Nothing is set on `<html>` and the CSS follows the
   operating system through `@media (prefers-color-scheme: dark)`. This is the path with
   JavaScript disabled too, so the site is correctly themed either way.
2. **An explicit choice.** The toggle in the masthead writes `light` or `dark` to
   `localStorage` under the key `cisd-theme`, and sets `<html data-theme="…">`.
   `:root[data-theme='dark']` and `:root:not([data-theme='light'])` make that win over the
   system preference in both directions.
3. **Choosing your own system default clears the override.** If the theme you pick is the
   one your system already asks for, the stored value is removed and you are back on
   "follow the system" — the site has no third button for it.

The inline script that applies step 2 lives in the `<head>` of `BaseLayout.astro`. It runs
**before first paint**, so navigating between pages never flashes the wrong palette. It is
inline and tiny on purpose: a deferred or bundled script would paint first and correct
afterwards. It also sets `data-js` on `<html>`, which is what reveals the toggle — without
JavaScript the button would do nothing, so it is not shown.

`color-scheme` is set per theme (`light` or `dark`), which is what makes scrollbars, form
controls and other browser-drawn surfaces match.

### Changing the palette safely

1. **Edit `--light-*` and `--dark-*` in `tokens.css`. Nothing else.** Never touch the
   `--color-*` aliases and never put a colour in a component.
2. **Change both palettes.** A token that exists in one and not the other is a hole; the
   dark theme is not optional.
3. **Check the contrast before committing, against every ground.** The current palette
   clears WCAG AA everywhere and AAA for body text. Keep at least:
   - 7:1 for `--color-ink` on `--color-paper` and on `--color-paper-2`;
   - 4.5:1 for `--color-ink-2`, `--color-ink-3`, `--color-accent`,
     `--color-accent-strong` and **each of the three group hues** on the backgrounds they
     appear on — `--color-ink-3` is used for small text, so it needs the full 4.5:1;
   - 3:1 for `--color-focus` against both `--color-paper` and `--color-paper-2`, and for
     `--color-rule-strong` against `--color-paper`.

   "Every ground" now means four, not one: `--color-paper`, `--color-paper-2` (which is
   `.band--sunken`) and the three `.band--tint` mixes. A hue can pass on paper and fail on
   a sunken band — `--light-iot4care` did. The design system's `#2f7d43` clears 4.5:1 on
   paper (4.74:1) but not on `--color-paper-2` (4.31:1) or a tint (4.26:1), so this
   repository ships `#2a783f`: same OKLCh hue and chroma, lightness lowered 0.016, worst
   ground 4.56:1. It is the one value where the site departs from the design system.

   `--color-rule` is deliberately low-contrast (about 1.4:1): the hairlines are decorative
   separators and never the only way information is conveyed. `--rule-accent` is the same —
   about 2.3–2.7:1 in light theme — and is a rule, never text.
4. **Look at both themes.** `npm run dev`, then use the toggle. Check a text-heavy page
   (`/research/`), a list-heavy one (`/publications/`), a page with portraits (`/people/`)
   and a legacy stub (`/profile/12/`).
5. **`src/layouts/LegacyRedirect.astro` repeats four values.** The compatibility stubs load
   no stylesheet at all — they exist for half a second — so they carry their own inline
   colours. It is the one sanctioned exception, it is commented as such, and it must be
   updated in step with the palette.

## What not to do

- Do not hard-code the group name, the department, the address or a colour into a component
  or a page. Everything comes from `site.ts` or a token.
- Do not add a colour that exists in only one of the two palettes.
- Do not add a third-party script, font, analytics tag, map embed or CDN reference. The
  site is designed to make no external request at all, and `npm run verify` enforces it.
- Do not move the theme script out of the `<head>`, defer it, or bundle it — it has to run
  before first paint or every page load flashes.
- Do not remove the `prefers-reduced-motion` block or the `:focus-visible` rule from
  `base.css`; `npm run verify` fails if either disappears from the shipped CSS.
- Do not widen `--measure` to fill a wide container. Wide pages get more columns, not
  longer lines.
- Do not change the layout or the visual design while doing editorial work.
- Do not add a brand asset you do not have permission to publish.
- Do not edit `astro.config.ts` (site URL, sitemap, image defaults) for a content change —
  see `docs/deployment.md`.

## Validate

```bash
npm run dev    # http://localhost:4321
npm run ci     # checks, unit tests, production build, verification
```

After a change to `site.ts`, look at the home page, `/contacts/` and the footer of any inner
page; after a change to `tokens.css`, look at a text-heavy page (`/research/`) and a
list-heavy one (`/publications/`) **in both themes**, and check a wide page (`/people/`) on
the largest screen you have.

## See also

- `docs/design-system-integration.md` — where these values come from, which of them depart
  from the design system, and how to verify a change against every ground
- `docs/deployment.md` — the site URL, GitHub Pages, custom domains
- `docs/research.md` — the group names and summaries (not in `site.ts`)
- `docs/content-safety.md` — what may be added under `public/`
