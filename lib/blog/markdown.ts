import { marked, type Tokens } from "marked";
import matter from "gray-matter";
import { emojify } from "node-emoji";
import { highlightCode } from "./highlight";

// Deliberately not using sanitize-html/DOMPurify here: they pull in enough
// weight (htmlparser2, deepmerge, a full DOM shim, ...) to push the deployed
// Worker over Cloudflare's 3 MiB free-plan size limit. This regex-based
// sanitizer is a narrower defense-in-depth pass — it strips the tags/attrs
// that actually execute code (script/style/iframe/object/embed/svg/math,
// on*= handlers, javascript:/vbscript: URLs) rather than allow-listing the
// full HTML grammar. It is not a substitute for treating post content as
// untrusted; content here is only ever authored by an admin.
const DANGEROUS_ELEMENTS = /<(script|style|iframe|object|embed|link|meta|base|form|svg|math)\b[^>]*>[\s\S]*?<\/\1\s*>/gi;
const DANGEROUS_TAGS = /<\/?(script|style|iframe|object|embed|link|meta|base|form|svg|math)\b[^>]*\/?>/gi;
const EVENT_HANDLER_ATTR = /\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;
const JS_URL_ATTR_QUOTED = /\s(href|src|action|formaction)\s*=\s*("|')\s*(?:javascript|vbscript):[^"']*\2/gi;
const JS_URL_ATTR_UNQUOTED = /\s(href|src|action|formaction)\s*=\s*(?:javascript|vbscript):[^\s>]*/gi;

function sanitizeHtml(html: string): string {
  return html
    .replace(DANGEROUS_ELEMENTS, "")
    .replace(DANGEROUS_TAGS, "")
    .replace(EVENT_HANDLER_ATTR, "")
    .replace(JS_URL_ATTR_QUOTED, "")
    .replace(JS_URL_ATTR_UNQUOTED, "");
}

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

  return sanitizeHtml(html);
}
