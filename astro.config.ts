// Astro configuration for the CISD research-group website (static, GitHub Pages).
// See README.md for the project overview and docs/deployment.md for build and deployment.
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { isLegacyCompatUrl } from './src/lib/legacy.ts';

export default defineConfig({
  // Organisation Pages repository (esd-univr.github.io) => served at the domain root.
  site: 'https://esd-univr.github.io',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    // One folder per page (people/index.html) so URLs end with a slash like the legacy site.
    format: 'directory',
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
