/**
 * Tests for the inline figure syntax, run through Astro's own Markdown processor.
 *
 * These deliberately go from real Markdown to real HTML rather than exercising the hast
 * transform on hand-built trees: the thing worth testing is the *syntax* an author types,
 * and the first version of this plugin passed a full suite of tree-level tests while being
 * unable to match a single real document — Markdown puts consecutive lines in one paragraph,
 * which the tree fixtures never showed.
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import { rehypeMarkdownFigures } from '../src/lib/markdown-figures.ts';

const processor = await createMarkdownProcessor({ rehypePlugins: [rehypeMarkdownFigures] });
const render = async (markdown) => (await processor.render(markdown)).code.trim();

test('an image on its own line becomes a figure', async () => {
  const html = await render('![An assembly line](./line.jpg)\n');
  assert.equal(html, '<figure class="figure"><img src="./line.jpg" alt="An assembly line"></figure>');
});

test('the next line becomes the caption, with no blank line needed', async () => {
  const html = await render('![An assembly line](./line.jpg)\n*The line at the far station.*\n');
  assert.match(html, /^<figure class="figure">/);
  assert.match(html, /<figcaption>The line at the far station\.<\/figcaption>/);
  assert.doesNotMatch(html, /<em>/, 'the asterisks are the syntax marker, not a request for italics');
});

test('a third line becomes the credit, marked up so it can be styled apart', async () => {
  const html = await render('![An assembly line](./line.jpg)\n*The line.*\n*Photo: Simone Girardi*\n');
  assert.match(
    html,
    /<figcaption>The line\.<span class="figure__credit">Photo: Simone Girardi<\/span><\/figcaption>/,
  );
  assert.doesNotMatch(html, /<cite>/, '<cite> marks the title of a work, not a person');
});

test('one caption line is a caption, never a credit', async () => {
  const html = await render('![A diagram](./d.png)\n*Only a caption.*\n');
  assert.doesNotMatch(html, /figure__credit/);
  assert.match(html, /<figcaption>Only a caption\.<\/figcaption>/);
});

test('an image with no caption gets no empty figcaption', async () => {
  const html = await render('![A diagram](./d.png)\n');
  assert.doesNotMatch(html, /figcaption/);
});

test('an image inside a sentence stays inline', async () => {
  const html = await render('Text before ![An icon](./i.png) and text after.\n');
  assert.match(html, /^<p>/);
  assert.doesNotMatch(html, /figure/);
});

test('a blank line means the emphasis is prose, not a caption', async () => {
  const html = await render('![A diagram](./d.png)\n\n*A separate emphasised sentence.*\n');
  assert.match(html, /<figure class="figure"><img[^>]*><\/figure>/);
  assert.match(html, /<p><em>A separate emphasised sentence\.<\/em><\/p>/);
});

test('emphasis inside a caption survives', async () => {
  const html = await render('![A diagram](./d.png)\n*The **core** library.*\n');
  assert.match(html, /<figcaption>The <strong>core<\/strong> library\.<\/figcaption>/);
});

test('a link in a caption survives', async () => {
  const html = await render('![A diagram](./d.png)\n*See [the paper](https://example.org/p).*\n');
  assert.match(html, /<figcaption>See <a href="https:\/\/example\.org\/p">the paper<\/a>\.<\/figcaption>/);
});

test('several figures in one document are independent', async () => {
  const html = await render(
    '![First](./a.png)\n*First caption.*\n\nProse between them.\n\n![Second](./b.png)\n*Second caption.*\n*Credit.*\n',
  );
  assert.equal((html.match(/<figure/g) ?? []).length, 2);
  assert.equal((html.match(/figure__credit/g) ?? []).length, 1, 'only the second figure has a credit');
  assert.match(html, /<p>Prose between them\.<\/p>/);
});

test('a figure inside a blockquote is still transformed', async () => {
  const html = await render('> ![A diagram](./d.png)\n> *A caption.*\n');
  assert.match(html, /<blockquote>[\s\S]*<figure class="figure">/);
  assert.match(html, /<figcaption>A caption\.<\/figcaption>/);
});

test('the img element is preserved, not rebuilt', async () => {
  // Astro tags markdown images with __ASTRO_IMAGE_ and swaps the attribute on the finished
  // HTML string, so every attribute the pipeline put on the element has to survive the move.
  const html = await render('![Alt text](./x.png "A title")\n');
  assert.match(html, /<img src="\.\/x\.png" alt="Alt text" title="A title">/);
});

test('missing alt text fails the build, and the message names the file', async () => {
  const withPath = await createMarkdownProcessor({ rehypePlugins: [rehypeMarkdownFigures] });
  await assert.rejects(
    () => withPath.render('![](./ice-2.jpg)\n', { fileURL: new URL('file:///repo/src/content/assets/ice.md') }),
    (error) => {
      assert.match(error.message, /without alt text/);
      assert.match(error.message, /ice-2\.jpg/);
      return true;
    },
  );
});

test('whitespace-only alt text fails too', async () => {
  await assert.rejects(() => render('![   ](./x.png)\n'), /without alt text/);
});

test('a document with no images is untouched', async () => {
  const html = await render('A paragraph.\n\n*An emphasised one.*\n');
  assert.equal(html, '<p>A paragraph.</p>\n<p><em>An emphasised one.</em></p>');
});
