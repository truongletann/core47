import { marked, type Tokens } from "marked";
import matter from "gray-matter";
import { emojify } from "node-emoji";
import sanitizeHtml from "sanitize-html";
import { highlightCode } from "./highlight";

// Allow the tags/attributes actually produced by this renderer (headings
// with ids, highlighted code blocks, callout containers, table of contents)
// plus common rich-content tags editors paste raw HTML for, while still
// blocking script/style/iframe/on*-handlers/javascript: URLs.
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    "img",
    "h1",
    "h2",
    "span",
    "div",
    "video",
    "audio",
    "source",
    "nav",
    "center",
  ]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    "*": ["id", "class", "style", "title"],
    a: ["href", "name", "target", "rel"],
    img: ["src", "alt", "width", "height", "loading"],
    video: ["src", "controls", "width", "height", "poster"],
    source: ["src", "type"],
  },
  allowedSchemes: ["http", "https", "mailto", "data"],
  allowedSchemesByTag: { img: ["http", "https", "data"] },
};

// VitePress/Docusaurus-style container syntax: :::type Optional Title\n...\n:::
const CONTAINER_RE = /^:::([a-zA-Z]+)(?:[ \t]+(.*))?\r?\n([\s\S]*?)\r?\n:::[ \t]*$/gm;

const CONTAINER_ALIASES: Record<string, string> = {
  warning: "warning",
  danger: "danger",
  error: "danger",
  info: "info",
  note: "info",
  success: "success",
  tip: "tip",
};

// [TOC] / [toc] / [[TOC]] on its own line — auto table-of-contents
// shortcode, common in Docsify/MkDocs/GitBook.
const TOC_MARKER_RE = /^\[\[?toc\]?\]\s*$/gim;
const HEADING_LINE_RE = /^(#{1,6})[ \t]+(.+)$/gm;

interface HeadingEntry {
  level: number;
  text: string;
  slug: string;
}

function slugifyHeading(text: string, seen: Map<string, number>): string {
  const base =
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "") // strip diacritics
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section";
  const count = seen.get(base) ?? 0;
  seen.set(base, count + 1);
  return count === 0 ? base : `${base}-${count}`;
}

function extractHeadings(text: string): HeadingEntry[] {
  const seen = new Map<string, number>();
  const headings: HeadingEntry[] = [];
  for (const match of text.matchAll(HEADING_LINE_RE)) {
    const level = match[1].length;
    const cleanText = match[2]
      .trim()
      .replace(/[*_`]/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
    headings.push({ level, text: cleanText, slug: slugifyHeading(cleanText, seen) });
  }
  return headings;
}

function buildTocHtml(headings: HeadingEntry[]): string {
  if (headings.length === 0) return "";
  const minLevel = Math.min(...headings.map((h) => h.level));
  const items = headings
    .filter((h) => h.level <= minLevel + 2) // cap the outline depth
    .map(
      (h) =>
        `<li style="margin-left:${(h.level - minLevel) * 0.9}rem"><a href="#${h.slug}">${h.text}</a></li>`,
    )
    .join("");
  return `\n\n<nav class="md-toc"><p class="md-toc-title">Contents</p><ul>${items}</ul></nav>\n\n`;
}

// - Assigns an id to each heading tag in the same order precomputed by
//   extractHeadings, so links in the table of contents (#slug) jump to the
//   right spot.
// - Syntax-highlights fenced code blocks via highlight.js.
class BlogRenderer extends marked.Renderer {
  private queue: HeadingEntry[];

  constructor(headings: HeadingEntry[]) {
    super();
    this.queue = [...headings];
  }

  override heading({ tokens, depth }: Tokens.Heading): string {
    const text = this.parser.parseInline(tokens);
    const next = this.queue.shift();
    return next ? `<h${depth} id="${next.slug}">${text}</h${depth}>\n` : `<h${depth}>${text}</h${depth}>\n`;
  }

  override code({ text, lang }: Tokens.Code): string {
    const { html, language } = highlightCode(text, lang);
    const langClass = language ? ` language-${language}` : "";
    return `<pre><code class="hljs${langClass}">${html}</code></pre>\n`;
  }
}

/**
 * Strips YAML frontmatter (---\n...\n---) out of markdown content.
 * Many people paste an entire .md file with frontmatter into the editor —
 * without this, that block would print as raw text at the top of the post.
 */
export function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const { data, content } = matter(raw);
  return { data, content };
}

export function stripFrontmatter(raw: string): string {
  return matter(raw).content;
}

function renderContainers(text: string): string {
  return text.replace(CONTAINER_RE, (_match, rawType: string, title: string | undefined, inner: string) => {
    const type = CONTAINER_ALIASES[rawType.toLowerCase()] ?? "info";
    const innerHtml = marked.parse(inner, { async: false, renderer: new BlogRenderer([]) }) as string;
    const titleHtml = title ? `<p class="md-callout-title">${title}</p>` : "";
    return `\n\n<div class="md-callout md-callout-${type}">\n\n${titleHtml}\n\n${innerHtml}\n\n</div>\n\n`;
  });
}

/**
 * Renders markdown to HTML, tolerant of several common markdown "dialects":
 * - YAML frontmatter at the top of the file (stripped automatically)
 * - Containers like :::warning / :::info / :::success / :::tip / :::danger
 * - Emoji shortcodes like :small_blue_diamond:
 * - [TOC] auto-generates a table of contents with heading ids to jump to
 * - Fenced code blocks (```lang) get syntax highlighting via highlight.js
 * - Raw HTML embedded directly (center, div, img...) — marked already
 *   passes this through unchanged by default
 */
export function renderMarkdown(raw: string): string {
  const withoutFrontmatter = stripFrontmatter(raw);
  const withEmoji = emojify(withoutFrontmatter);

  // Headings used to build the outline/ids only count content OUTSIDE
  // containers (:::...:::), since container content is rendered through a
  // separate marked.parse() call the id-assigning renderer never sees.
  const outlineSource = withEmoji.replace(CONTAINER_RE, "");
  const headings = extractHeadings(outlineSource);

  const withToc = withEmoji.replace(TOC_MARKER_RE, () => buildTocHtml(headings));
  const withContainers = renderContainers(withToc);

  const html = marked.parse(withContainers, {
    async: false,
    renderer: new BlogRenderer(headings),
  }) as string;

  return sanitizeHtml(html, SANITIZE_OPTIONS);
}
