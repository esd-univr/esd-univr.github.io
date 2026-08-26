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
  const fontFiles = listFiles(path.join(dist, '_astro')).filter((f) => /\.woff2?$/.test(f));
  notes.push(`shipped CSS carries reduced-motion and focus-visible rules; ${fontFiles.length} self-hosted font files`);

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
}


// --- Report ----------------------------------------------------------------------------
for (const note of notes) console.log(`✓ ${note}`);
if (failures.length > 0) {
  console.error(`\n${failures.length} problem(s):`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log('\nverify: all checks passed');
