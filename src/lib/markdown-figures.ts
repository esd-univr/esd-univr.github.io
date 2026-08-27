/**
 * Inline figures in Markdown content.
 *
 * The author writes an image on its own line and the caption on the next line, with the
 * credit — when there is one — on a third:
 *
 *     ![The HIF core between the HDL front-ends and back-ends](./hifsuite-structure.jpg)
 *     *The core sits between the front-end and back-end tools.*
 *     *Source: HIFSuite documentation*
 *
 * No blank lines between them: in Markdown consecutive lines are one paragraph, and that is
 * exactly what this reads. A paragraph that *starts* with an image becomes a `<figure>`;
 * whatever follows the image in that paragraph becomes the `<figcaption>`; and when the last
 * line is its own emphasised run it becomes the credit inside the caption. An image in the
 * middle of a sentence is left alone — it stays inline.
 *
 * ## Why it is shaped this way
 *
 * The syntax stays `![alt](./relative)` because that is the only form Astro resolves: it
 * rewrites the path, emits resized and modern-format copies, and fails the build when the
 * file is missing. A bespoke directive would be an opaque string and would get none of that.
 *
 * Astro 7 tags each markdown image with `__ASTRO_IMAGE_="{…}"` and swaps it for the real
 * attributes with a **string replacement over the finished HTML** (see
 * `astro/dist/vite-plugin-markdown/images.js`). It never inspects the tree, so moving the
 * `<img>` into a `<figure>` is safe as long as the element survives — and this keeps the very
 * same node object rather than rebuilding it. It runs on hast rather than mdast because hast
 * has a real `figure` element to build, where mdast would force raw HTML around the image.
 *
 * Astro 7's default processor is Sätteri, whose plugins are visitors over a Rust-backed
 * arena; this is a plain unified/rehype plugin, which is why `astro.config.ts` selects the
 * `unified()` processor explicitly. Being a pure function over plain objects is what makes
 * it testable — see tests/markdown-figures.test.mjs.
 *
 * Nothing is imported. `unist-util-visit` is only a transitive dependency here, and building
 * on those is how a build breaks on an unrelated upgrade. A hast tree is plain objects.
 */

/** Minimal structural types — hast, without depending on `@types/hast`. */
interface HastNode {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

const isElement = (node: HastNode | undefined, tagName: string): boolean =>
  node?.type === 'element' && node.tagName === tagName;

const isBlank = (node: HastNode): boolean =>
  node.type === 'text' && typeof node.value === 'string' && node.value.trim() === '';

/**
 * The line break between the image, the caption and the credit. remark keeps a soft break as
 * a text node holding a newline rather than as a `<br>`, so both have to count.
 */
const isLineBreak = (node: HastNode): boolean =>
  isElement(node, 'br') || (node.type === 'text' && typeof node.value === 'string' && node.value.includes('\n'));

function element(tagName: string, properties: Record<string, unknown>, children: HastNode[]): HastNode {
  return { type: 'element', tagName, properties, children };
}

/** Drops blank nodes from both ends, keeping the ones between lines. */
function trimEnds(nodes: HastNode[]): HastNode[] {
  let start = 0;
  let end = nodes.length;
  while (start < end && isBlank(nodes[start]!)) start++;
  while (end > start && isBlank(nodes[end - 1]!)) end--;
  return nodes.slice(start, end);
}

/**
 * The asterisks around a caption are this syntax's marker, not a request for italics, so a
 * caption written as one emphasised run is unwrapped. Emphasis *inside* it survives.
 */
const unwrapEmphasis = (nodes: HastNode[]): HastNode[] =>
  nodes.flatMap((node) => (isElement(node, 'em') ? (node.children ?? []) : [node]));

/**
 * `alt` is required: a figure without it ships an image a screen reader cannot describe.
 *
 * This throws, but **do not rely on the throw alone**. Astro's glob loader catches render
 * errors and only logs them (`content/loaders/glob.js`), so a throw here leaves the build
 * green with the whole entry body missing from the page — worse than a figure without alt
 * text. The real gate is the content invariant in tests/content.test.mjs, which fails CI.
 * This throw exists so the message names the file when someone reads the build log.
 */
function requireAlt(img: HastNode, sourcePath: string | undefined): void {
  const alt = img.properties?.['alt'];
  if (typeof alt === 'string' && alt.trim() !== '') return;
  const where = sourcePath ? ` in ${sourcePath}` : '';
  const src = typeof img.properties?.['src'] === 'string' ? img.properties['src'] : 'unknown source';
  throw new Error(
    `Markdown figure without alt text${where}: ${src}. Every figure needs alt text describing ` +
      'the image — write it inside the square brackets: ![what the image shows](./file.png)',
  );
}

/**
 * Splits what follows the image into the caption and, when the author put it on a line of its
 * own, the credit. The credit is the last line when that line is a single emphasised run and
 * something else came before it — so one caption line stays a caption, and two become a
 * caption plus a credit.
 */
function splitCaption(nodes: HastNode[]): { caption: HastNode[]; credit: HastNode[] | undefined } {
  const lastBreak = nodes.findLastIndex(isLineBreak);
  if (lastBreak < 0) return { caption: nodes, credit: undefined };

  const tail = trimEnds(nodes.slice(lastBreak + 1));
  const head = trimEnds(nodes.slice(0, lastBreak));
  const isCredit = tail.length === 1 && isElement(tail[0], 'em') && head.length > 0;
  if (!isCredit) return { caption: nodes, credit: undefined };

  return { caption: head, credit: tail[0]!.children ?? [] };
}

/** Rewrites paragraphs that open with an image into semantic figures. */
export function transformFigures(tree: HastNode, sourcePath?: string): void {
  const walk = (node: HastNode): void => {
    const children = node.children;
    if (!children || children.length === 0) return;

    for (let i = 0; i < children.length; i++) {
      const child = children[i]!;
      if (!isElement(child, 'p')) {
        walk(child);
        continue;
      }

      const content = trimEnds(child.children ?? []);
      const img = content[0];
      if (!isElement(img, 'img')) continue;

      requireAlt(img!, sourcePath);

      const { caption, credit } = splitCaption(content.slice(1));
      const captionContent = unwrapEmphasis(trimEnds(caption));

      const figureChildren: HastNode[] = [img!];
      if (captionContent.some((n) => !isBlank(n)) || credit) {
        const parts = [...captionContent];
        if (credit) parts.push(element('span', { className: ['figure__credit'] }, credit));
        figureChildren.push(element('figcaption', {}, parts));
      }

      children[i] = element('figure', { className: ['figure'] }, figureChildren);
    }
  };

  walk(tree);
}

/**
 * The rehype plugin, for `unified({ rehypePlugins: [...] })` in `astro.config.ts`.
 * unified passes the current file second, which is what points the alt-text error at the
 * offending Markdown rather than at the pipeline.
 */
export function rehypeMarkdownFigures() {
  return (tree: HastNode, file?: { path?: string; history?: string[] }): void => {
    transformFigures(tree, file?.path ?? file?.history?.[0]);
  };
}
