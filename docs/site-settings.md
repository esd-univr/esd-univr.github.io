# Mission, affiliation, branding and theme

Two files hold everything that is not a content record:

```
src/data/site.ts          name, mission, department, address, footer links, brand slots
src/styles/tokens.css     colours, type scale, spacing — the whole visual language
```

## `src/data/site.ts`

Plain TypeScript, nothing generated. Edit a string and every page that uses it follows.

| Field | Where it shows |
| --- | --- |
| `shortName` | `CISD` — page titles, the footer, the header wordmark |
| `name` | The full name, spelled out next to the acronym |
| `title` | `<title>` of the home page and the Open Graph site name |
| `description` | Default meta description of every page. **Keep it under 160 characters.** |
| `mission` | The paragraph at the top of the home page |
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

Every colour, font size, spacing step, rule and radius the site uses is a custom property
declared once in `:root`. Components only ever reference the variables, so changing the
look means changing this file — not the components.

| Group | Tokens |
| --- | --- |
| Type | `--font-sans`, `--font-serif`, `--font-mono`, `--text-xs` … `--text-4xl` |
| Spacing | `--space-2xs` … `--space-3xl` |
| Colour | `--color-paper`, `--color-paper-2`, `--color-ink`, `--color-ink-2`, `--color-ink-3`, `--color-rule`, `--color-rule-strong`, `--color-accent`, `--color-accent-strong`, `--color-focus` |
| Layout | `--measure`, `--container`, `--gutter`, `--rule`, `--radius` |

The type and spacing scales use `clamp()` so they grow with the viewport; change the three
numbers of a `clamp()`, not the places that use it.

To change the accent colour, edit `--color-accent` and `--color-accent-strong` (the hover
and active shade) together, and check the contrast against `--color-paper` — body text and
links must stay at 4.5:1 or better.

Fonts are self-hosted IBM Plex, installed as npm packages and bundled at build time. The
site loads nothing from Google Fonts or any other third party, and `npm run verify` fails
if a build ever references a CDN.

### Theme

`tokens.css` currently declares `color-scheme: light` and one light palette. A dark theme
is planned as a separate piece of work: it will add a second set of colour tokens, and it
must not require touching any component. **Do not add dark-mode rules as a side effect of
another change.**

`npm run verify` requires the shipped CSS to keep a `prefers-reduced-motion` rule and a
`:focus-visible` rule, so do not remove them.

## What not to do

- Do not hard-code the group name, the department, the address or a colour into a component
  or a page. Everything comes from `site.ts` or a token.
- Do not add a third-party script, font, analytics tag, map embed or CDN reference. The
  site is designed to make no external request at all, and `npm run verify` enforces it.
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
list-heavy one (`/publications/`).

## See also

- `docs/deployment.md` — the site URL, GitHub Pages, custom domains
- `docs/research.md` — the group names and summaries (not in `site.ts`)
- `docs/content-safety.md` — what may be added under `public/`
