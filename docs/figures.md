# Figures in Markdown

A figure is an image with a caption, written **inline in the Markdown body**, where it belongs
in the narrative. It is not frontmatter: a project or a news item can carry several figures,
each at the point in the text it illustrates.

```md
![An assembly line of linked conveyor modules, with a collaborative robot at the far end](./ice-laboratory-1.jpg)
*The assembly line, with a collaborative robot at the far station.*
*Photo: Simone Girardi*
```

renders as

```html
<figure class="figure">
  <img src="/_astro/ice-laboratory-1.BsjqxDrk_fNsJA.webp" srcset="…" width="1600" height="1200"
       alt="An assembly line of linked conveyor modules, with a collaborative robot at the far end">
  <figcaption>The assembly line, with a collaborative robot at the far station.
    <span class="figure__credit">Photo: Simone Girardi</span></figcaption>
</figure>
```

## The three lines

| Line | What it is | Required |
| --- | --- | --- |
| `![…](./file.jpg)` | The image, and the alt text inside the brackets | **Yes** |
| `*…*` | The caption | No |
| `*…*` | The credit or source | No |

**No blank lines between them.** In Markdown consecutive lines are one paragraph, and that is
exactly what this reads: a paragraph that starts with an image becomes the figure, and the rest
of that paragraph becomes the caption.

- **One `*…*` line is always a caption**, never a credit.
- **Two `*…*` lines** are a caption and then a credit. The credit is wrapped so the design can
  set it apart; it is a `<span>`, not a `<cite>`, because `<cite>` marks the title of a work and
  a credit is usually a person or an organisation.
- **A blank line ends the figure.** `*Emphasised text*` after a blank line is ordinary prose.
- **An image inside a sentence stays inline** — no figure, no caption.
- The asterisks are the syntax marker, so the caption is not italicised. Emphasis, links and
  `**bold**` inside the caption work normally.

## Alt text is required

Describe what the image shows, for a reader who cannot see it. `npm test` fails on an image
with empty alt text, naming the file.

Do not rely on the build to catch it: Astro's content loader **catches render errors and only
logs them**, so a figure with no alt text leaves the build green with the entry's whole body
missing from the page. That is why the check is a test (`tests/content.test.mjs`) rather than a
build error.

## Where the file goes

Next to the Markdown file that uses it, in the same content folder — the same convention as
portraits:

```
src/content/assets/
  ice-laboratory.md
  ice-laboratory-1.jpg      used only by ice-laboratory.md
```

Astro resolves the relative path at build time, so it **fails if the file is missing**, emits
resized and modern-format copies, and writes the intrinsic width and height onto the `<img>` so
the page does not jump while it loads. A path into `public/` gets none of that. `npm test` also
checks that every referenced file exists.

## House rules for the images

- **Neutral and evenly lit.** No filters, no grain, no duotone, no vignette.
- **Diagrams: redraw, do not screenshot.** A screenshot of a slide carries the slide's fonts
  and colours into the page. Export SVG where you can.
- **Strip the metadata.** `npm run strip-metadata <file>` removes EXIF, GPS, IPTC and XMP
  without touching a pixel; `npm test` fails on any image under `src/content/` that still
  carries some. Phone photographs routinely embed the exact location.
- **Credit anything the group did not produce**, and never use an image whose licence you
  cannot name. Check the metadata before you assume: the ICE Laboratory photographs arrived
  with `Artist: Simone Girardi` and `Copyright: All right reserved` in their EXIF.
- **Photographs of people need the same approval as portraits** — see `docs/content-safety.md`.
- 1600px wide is plenty; the build produces the smaller sizes.

## How it works, and the one thing that will waste your afternoon

`src/lib/markdown-figures.ts` is a rehype plugin, selected in `astro.config.ts` through
`markdown.processor: unified({ rehypePlugins: [...] })`. That is why `@astrojs/markdown-remark`
is a direct dependency: Astro 7 defaults to the Sätteri processor, and `markdown.rehypePlugins`
is deprecated. Sätteri's own plugin API is a visitor over a Rust-backed arena, which cannot be
unit-tested without the engine; this transform is a pure function over plain objects, which is
what `tests/markdown-figures.test.mjs` exercises — through Astro's real processor, from Markdown
to HTML, because the first version of the plugin passed a full suite of tree-level tests while
being unable to match a single real document.

**The rendered Markdown is cached in `node_modules/.astro/data-store.json`, keyed on the file's
contents alone.** Changing the pipeline — the plugin, the processor, the config — does not
invalidate it, so the build will happily reuse the old HTML and nothing you do will appear to
work. Clear it:

```bash
rm -rf node_modules/.astro && npm run build
```

Note that `.astro/` in the project root is **not** the cache; deleting that changes nothing.

## See also

- `docs/assets.md` — the Assets & Tools collection, which uses figures heavily
- `docs/content-safety.md` — image metadata, and what may be published
- `docs/people.md` — portraits, which use frontmatter rather than inline figures
