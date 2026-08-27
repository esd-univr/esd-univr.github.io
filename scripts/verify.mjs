#!/usr/bin/env node
/**
 * Repository and build verification (run after `npm run build`; no dependencies).
 *
 *   1. No forbidden files (databases, dumps, archives, env files, forensic material)
 *      are tracked by Git or present in the working tree.
 *   2. The production build in dist/ contains the expected routes and files.
 *   3. Everything under public/ is copied into dist/ unchanged.
 *   4. Every built HTML page: one <h1>, no skipped heading levels, <html lang>, <title>,
 *      meta description, canonical link, a <main>, no third-party scripts/styles.
 *   5. Internal links and asset references resolve to files in the build.
 *   6. Legacy compatibility stubs carry a meta refresh + canonical to an existing page, and
 *      every `legacyId` in src/content/ has its stub (/profile, /project, /news/<id>).
 *   7. Every opportunity has its page, carries the filter metadata the list page needs,
 *      and appears on the page of every person who supervises it while it is open.
 *
 * Exit code 1 on any failure; prints a summary otherwise.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const notes = [];
const fail = (msg) => failures.push(msg);

// --- 1. Forbidden files --------------------------------------------------------
const FORBIDDEN = [
  /\.(sqlite3?|db|sql|dump|tar|tgz|zip|gz|bak|backup|log|pem|key|p12|pfx)$/i,
  /(^|\/)\.env(\..*)?$/,
  /(^|\/)(whole|initial_role_data)\.json$/,
  /cisd-migration|esdgroup|migration-audit/i,
  /^dist\//,
];
const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: root }).toString().split('\0').filter(Boolean);
for (const file of tracked) {
  if (FORBIDDEN.some((re) => re.test(file))) fail(`forbidden file is tracked by Git: ${file}`);
}
const IGNORED_DIRS = new Set(['node_modules', '.git', 'dist', '.astro']);
function walk(dir, visit) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, visit);
    else visit(full);
  }
}
walk(root, (file) => {
  const rel = path.relative(root, file).split(path.sep).join('/');
  if (rel.startsWith('public/')) return; // legacy passthrough trees may legitimately contain .gz/.zip
  if (FORBIDDEN.slice(0, 4).some((re) => re.test(rel))) fail(`forbidden file in working tree: ${rel}`);
});
notes.push(`${tracked.length} tracked files checked against forbidden patterns`);

// --- Helpers -------------------------------------------------------------------
function listFiles(dir) {
  const out = [];
  const rec = (d) => {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) rec(full);
      else out.push(full);
    }
  };
  if (existsSync(dir)) rec(dir);
  return out;
}
const rel = (base, file) => path.relative(base, file).split(path.sep).join('/');

function resolvesInDist(dist, href) {
  const clean = decodeURIComponent(href.split('#')[0].split('?')[0]);
  const candidates = [clean, `${clean}/index.html`, `${clean}index.html`, `${clean}.html`].map((p) => path.join(dist, p));
  return candidates.some((c) => existsSync(c) && statSync(c).isFile());
}

/** Files served verbatim from public/ (documents, images) are not held to the site's page rules. */
const PASSTHROUGH_PREFIXES = ['documents/', 'images/', 'media/'];

function checkHtml(dist, label) {
  const files = listFiles(dist).filter((f) => f.endsWith('.html') && !PASSTHROUGH_PREFIXES.some((p) => rel(dist, f).startsWith(p)));
  if (files.length === 0) {
    fail(`${label}: no HTML files found`);
    return;
  }
  let links = 0;
  for (const file of files) {
    const page = rel(dist, file);
    const html = readFileSync(file, 'utf8');
    const isStub = /<meta http-equiv="refresh"/i.test(html);
    if (!/<html[^>]*\slang=/.test(html)) fail(`${label}/${page}: <html> has no lang attribute`);
    if (!/<title>[^<]+<\/title>/.test(html)) fail(`${label}/${page}: missing <title>`);
    if (!/<link rel="canonical" href="https:\/\/esd-univr\.github\.io\//.test(html)) fail(`${label}/${page}: missing canonical link`);
    if (/https?:\/\/(fonts\.googleapis|fonts\.gstatic|cdn\.jsdelivr|cdnjs|unpkg|kit\.fontawesome|maxcdn)\./.test(html)) fail(`${label}/${page}: references a third-party CDN`);
    if (/<script[^>]+src="https?:\/\//.test(html)) fail(`${label}/${page}: loads an external script`);
    const h1s = html.match(/<h1[\s>]/g) ?? [];
    if (h1s.length !== 1) fail(`${label}/${page}: expected exactly one <h1>, found ${h1s.length}`);
    if (!isStub) {
      if (!/<meta name="description" content="[^"]+"/.test(html)) fail(`${label}/${page}: missing meta description`);
      if (!/<main[\s>]/.test(html)) fail(`${label}/${page}: missing <main>`);
      if (!/class="skip-link"/.test(html)) fail(`${label}/${page}: missing skip link`);
      if (
        page.startsWith('news/') &&
        page !== 'news/index.html' &&
        /(?:^|[}\s])body\s*\{[^}]*max-width\s*:\s*40rem/i.test(html)
      ) {
        fail(`${label}/${page}: normal news page contains the legacy redirect body width rule`);
      }
      let previous = 1;
      for (const m of html.matchAll(/<h([1-6])[\s>]/g)) {
        const level = Number(m[1]);
        if (level > previous + 1) fail(`${label}/${page}: heading level jumps from h${previous} to h${level}`);
        previous = level;
      }
    } else {
      const target = /<link rel="canonical" href="https:\/\/esd-univr\.github\.io(\/[^"]*)"/.exec(html)?.[1];
      if (!target || !resolvesInDist(dist, target)) fail(`${label}/${page}: compatibility stub points to a missing page (${target})`);
    }
    for (const m of html.matchAll(/(?:href|src)="(\/[^"/][^"]*|\/)"/g)) {
      const href = m[1];
      if (href.startsWith('//')) continue;
      links++;
      if (!resolvesInDist(dist, href)) fail(`${label}/${page}: broken internal reference ${href}`);
    }
  }
  notes.push(`${label}: ${files.length} HTML pages checked, ${links} internal references resolved`);
}

// --- 2. Production build -----------------------------------------------------------
const dist = path.join(root, 'dist');
if (!existsSync(dist)) {
  fail('dist/ not found — run `npm run build` first');
} else {
  const required = [
    'index.html', '404.html', 'robots.txt', '.nojekyll', 'sitemap-index.xml', 'publications.bib',
    'research/index.html', 'people/index.html', 'projects/index.html', 'publications/index.html',
    'news/index.html', 'contacts/index.html', 'news-list/index.html', 'areas/index.html',
    // /assets/ carries over from the previous site; the path is part of the migration.
    'opportunities/index.html', 'assets/index.html',
  ];
  for (const f of required) if (!existsSync(path.join(dist, f))) fail(`dist/${f} is missing`);

  // 3. Everything under public/ reaches the build unchanged.
  const publicDir = path.join(root, 'public');
  let copied = 0;
  for (const file of listFiles(publicDir)) {
    const target = path.join(dist, rel(publicDir, file));
    if (!existsSync(target) || statSync(target).size !== statSync(file).size) fail(`public/ file not copied unchanged: ${rel(root, file)}`);
    else copied++;
  }
  notes.push(`${copied} files from public/ copied unchanged into dist/`);

  // Accessibility rules that must survive bundling: reduced-motion media query and
  // visible keyboard focus styles in the shipped CSS.
  const css = listFiles(path.join(dist, '_astro')).filter((f) => f.endsWith('.css')).map((f) => readFileSync(f, 'utf8')).join('\n');
  if (!css.includes('prefers-reduced-motion')) fail('shipped CSS has no prefers-reduced-motion rule');
  if (!css.includes(':focus-visible')) fail('shipped CSS has no :focus-visible rule');
  // Without the !important, any component `display` silently cancels the `hidden`
  // attribute, and every list filter and progressively-enhanced form stops working.
  if (!/\[hidden\]\{display:none!important\}/.test(css.replace(/\s+/g, ''))) {
    fail('shipped CSS has no `[hidden] { display: none !important }` rule — filters and hidden forms would not hide');
  }
  const fontFiles = listFiles(path.join(dist, '_astro')).filter((f) => /\.woff2?$/.test(f));
  notes.push(`shipped CSS carries reduced-motion, focus-visible and [hidden] rules; ${fontFiles.length} self-hosted font files`);

  // 4–5. Page checks
  checkHtml(dist, 'dist');

  // 6. Every legacyId declared in the content has a compatibility stub.
  const STUB_DIRS = { people: 'profile', projects: 'project', news: 'news' };
  let stubs = 0;
  for (const [collection, prefix] of Object.entries(STUB_DIRS)) {
    const dir = path.join(root, 'src/content', collection);
    if (!existsSync(dir)) continue;
    for (const file of readdirSync(dir).filter((f) => f.endsWith('.md') && !f.startsWith('_'))) {
      const id = /^legacyId:\s*(\d+)\s*$/m.exec(readFileSync(path.join(dir, file), 'utf8'))?.[1];
      if (!id) continue;
      stubs++;
      if (!existsSync(path.join(dist, prefix, id, 'index.html'))) fail(`missing legacy stub /${prefix}/${id}/ for ${collection}/${file}`);
    }
  }
  notes.push(`${stubs} legacy ids from src/content/ have compatibility stubs in dist/`);

  // --- 7. Opportunities ----------------------------------------------------------
  const opportunityDir = path.join(root, 'src/content/opportunities');
  const opportunities = existsSync(opportunityDir)
    ? readdirSync(opportunityDir)
        .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
        .map((f) => ({ slug: f.slice(0, -3), frontmatter: frontmatterOf(path.join(opportunityDir, f)) }))
    : [];

  for (const { slug, frontmatter } of opportunities) {
    // Every proposal gets its own page at the address its file name promises.
    if (!existsSync(path.join(dist, 'opportunities', slug, 'index.html'))) {
      fail(`missing page /opportunities/${slug}/ for opportunities/${slug}.md`);
      continue;
    }
    // An open proposal must be reachable from the page of everyone supervising it.
    if (scalar(frontmatter, 'status') !== 'open') continue;
    for (const supervisor of list(frontmatter, 'supervisors')) {
      const page = path.join(dist, 'people', supervisor, 'index.html');
      if (!existsSync(page)) {
        fail(`opportunities/${slug}.md: supervisor "${supervisor}" has no page in dist/`);
      } else if (!readFileSync(page, 'utf8').includes(`href="/opportunities/${slug}/"`)) {
        fail(`dist/people/${supervisor}/: open opportunity "${slug}" is missing from the page`);
      }
    }
  }

  // The filter is progressive enhancement, so the metadata it reads must be in the HTML.
  const listPage = readFileSync(path.join(dist, 'opportunities/index.html'), 'utf8');
  const rows = [...listPage.matchAll(/<li class="opportunity"[^>]*>/g)].map((m) => m[0]);
  if (rows.length !== opportunities.length) {
    fail(`dist/opportunities/: ${opportunities.length} proposal(s) in src/content/ but ${rows.length} row(s) on the page`);
  }
  for (const row of rows) {
    for (const attribute of ['data-opp', 'data-status', 'data-type', 'data-levels', 'data-groups', 'data-activities']) {
      if (!row.includes(`${attribute}="`)) fail(`dist/opportunities/: a list row is missing ${attribute}`);
    }
  }
  if (rows.length > 1 && !/<form[^>]*data-opp-filter/.test(listPage)) {
    fail('dist/opportunities/: several proposals are listed but the filter form is absent');
  }
  notes.push(
    opportunities.length === 0
      ? 'no opportunities are published; /opportunities/ shows its empty state'
      : `${opportunities.length} opportunity page(s), filter metadata and supervisor back-links checked`,
  );
}

/** Frontmatter block of a Markdown file, as raw text. */
function frontmatterOf(file) {
  return /^---\n([\s\S]*?)\n---/.exec(readFileSync(file, 'utf8'))?.[1] ?? '';
}

/** `key: value` from a frontmatter block, unquoted. */
function scalar(frontmatter, key) {
  const value = new RegExp(`^${key}:\\s*(.+?)\\s*$`, 'm').exec(frontmatter)?.[1];
  return value?.replace(/^["']|["']$/g, '');
}

/** A frontmatter list, written either inline (`[a, b]`) or as `- a` lines. */
function list(frontmatter, key) {
  const inline = new RegExp(`^${key}:\\s*\\[(.*?)\\]\\s*$`, 'm').exec(frontmatter);
  if (inline) return inline[1].split(',').map((v) => v.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
  const block = new RegExp(`^${key}:\\s*\\n((?:\\s*-\\s*.+\\n?)+)`, 'm').exec(frontmatter);
  if (!block) return [];
  return block[1]
    .split('\n')
    .map((line) => /^\s*-\s*(.+?)\s*$/.exec(line)?.[1]?.replace(/^["']|["']$/g, ''))
    .filter(Boolean);
}


// --- Report ----------------------------------------------------------------------------
for (const note of notes) console.log(`✓ ${note}`);
if (failures.length > 0) {
  console.error(`\n${failures.length} problem(s):`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log('\nverify: all checks passed');
