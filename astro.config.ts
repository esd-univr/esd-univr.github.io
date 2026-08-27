// Astro configuration for the CISD research-group website (static, GitHub Pages).
// See README.md for the project overview and docs/deployment.md for build and deployment.
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import { isLegacyCompatUrl } from './src/lib/legacy.ts';
import { rehypeMarkdownFigures } from './src/lib/markdown-figures.ts';

export default defineConfig({
  // Organisation Pages repository (esd-univr.github.io) => served at the domain root.
  site: 'https://esd-univr.github.io',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    // One folder per page (people/index.html) so URLs end with a slash like the legacy site.
    format: 'directory',
  },
  markdown: {
    /*
     * Inline figures: a paragraph holding only an image becomes <figure>, and the
     * emphasised paragraphs after it become its <figcaption> and credit. See
     * src/lib/markdown-figures.ts for the transform and docs/figures.md for the syntax.
     *
     * Astro 7 defaults to the Sätteri processor, and `markdown.rehypePlugins` is deprecated
     * (it silently switches the processor back and warns). This sets the processor
     * explicitly instead, which is the supported form and is why
     * `@astrojs/markdown-remark` is a direct dependency rather than a transitive one.
     *
     * Sätteri was the alternative and was rejected on testability: its plugins are visitors
     * over a Rust-backed arena, driven by a context the engine supplies, so the transform
     * could only have been tested end-to-end. As a unified/hast plugin it is a pure
     * function over plain objects — see tests/markdown-figures.test.mjs. If this repository
     * ever moves to Sätteri for speed, the transform has to be rewritten as a
     * `defineHastPlugin` visitor and those tests rewritten with it.
     */
    processor: unified({ rehypePlugins: [rehypeMarkdownFigures] }),
  },
  image: {
    // Responsive <Image> output by default (srcset + sizes) with cropping to the box.
    layout: 'constrained',
    responsiveStyles: true,
  },
  integrations: [
    sitemap({
      // Legacy compatibility pages (meta-refresh stubs) must not be advertised.
      filter: (page) => !isLegacyCompatUrl(page),
    }),
  ],
  // Legacy URL compatibility is handled by static stub pages, not by `redirects`:
  // src/pages/{areas,news-list}.astro for the old list pages and the routes under
  // src/pages/{profile,area,project}/ (+ numeric /news/<id>/) for records with a `legacyId`.
});
