# Custom domain, search discovery and analytics

This site is intentionally usable without analytics or third-party tracking. Search discovery and visitor analytics are separate concerns: **Google Analytics is not required for Google Search indexing**.

## Current canonical origin

The production origin is configured by `site:` in `astro.config.ts`. That value feeds canonical URLs, Open Graph URLs, the Astro sitemap and the generated `robots.txt`.

Do not change it to a custom domain until that domain actually serves the site over HTTPS.

## Moving to a UniVR custom domain

First decide which hostname is authoritative. Because CISD is now associated with DIMI, confirm with the University whether the historical `cisd.di.univr.it` remains the canonical public address or should redirect to a DIMI-based hostname. Search engines should see one canonical hostname, not two equivalent sites.

For a GitHub Pages custom subdomain:

1. Ask the UniVR DNS/network administrators to point the chosen hostname to `esd-univr.github.io` with a `CNAME` record.
2. In GitHub, open **Settings → Pages → Custom domain**, enter the same hostname and enable **Enforce HTTPS** once GitHub offers it.
3. Verify that the custom HTTPS URL serves the current site.
4. Only then change `site:` in `astro.config.ts` to the custom origin and run `npm run ci`.
5. Update any verification rule that still deliberately pins the old origin before merging the domain switch.

A `CNAME` file in the repository is **not required** when Pages is deployed through a custom GitHub Actions workflow; the custom domain is configured in the repository Pages settings.

If an old hostname and a new hostname both need to remain reachable, one should issue a real HTTP redirect to the canonical hostname. GitHub Pages itself only accepts one custom domain for this site, so additional aliases/redirects need to be handled by the University DNS/web infrastructure.

## Google Search Console

After the canonical custom domain is live:

1. Add it to Google Search Console.
2. Prefer a **Domain property** if UniVR can add Google's DNS `TXT` verification record. Otherwise use an HTTPS URL-prefix property and one of Google's supported non-DNS verification methods.
3. Submit `https://<canonical-host>/sitemap-index.xml`.
4. Inspect the home page and a representative Research, People, Projects, Publications and News URL and request indexing if needed.
5. Keep the verification record in place.

The site already emits canonical links and a sitemap. `robots.txt` is generated from the same Astro `site` origin so it cannot silently keep advertising the old GitHub hostname after a domain migration.

## Google Analytics

Do not add Google Analytics merely for discoverability. Search Console provides search impressions, queries, indexing and crawl information without adding a visitor-tracking tag to the site.

If the University explicitly approves GA4 for this site, use the conservative implementation:

- obtain institutional privacy/DPO approval and update the privacy notice before deployment;
- use an accessible consent mechanism with analytics denied by default;
- use **Google Basic Consent Mode**: do not load or execute the Google tag before the visitor grants analytics consent;
- do not use Google Signals, remarketing or advertising personalization unless separately justified and approved;
- do not link the property to Google Ads unless there is an approved need;
- minimise optional device/location collection for EEA users and use the shortest useful user/event retention period;
- provide an equally easy way to withdraw the analytics choice;
- verify with browser developer tools that no Google Analytics request is made before consent.

This is an engineering baseline, not a legal certification. The controller for an institutional University website must make the final privacy/legal decision.

## No-tracking baseline

With no analytics enabled, the site currently makes no Google Analytics, advertising or profiling requests. The only browser-side persistence controlled by this codebase is the local theme preference described in the privacy notice.
