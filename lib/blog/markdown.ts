import { marked, type Tokens } from "marked";
import matter from "gray-matter";
import { emojify } from "node-emoji";

// Cú pháp container kiểu VitePress/Docusaurus: :::type Tiêu đề tuỳ chọn\n...\n:::
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

// [TOC] / [toc] / [[TOC]] trên 1 dòng riêng — shortcode tự sinh mục lục,
// phổ biến ở Docsify/MkDocs/GitBook.
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
      .replace(/[̀-ͯ]/g, "") // bỏ dấu tiếng Việt
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
    .filter((h) => h.level <= minLevel + 2) // giới hạn độ sâu mục lục
    .map(
      (h) =>
        `<li style="margin-left:${(h.level - minLevel) * 0.9}rem"><a href="#${h.slug}">${h.text}</a></li>`,
    )
    .join("");
  return `\n\n<nav class="md-toc"><p class="md-toc-title">Mục lục</p><ul>${items}</ul></nav>\n\n`;
}

// Gán id cho từng thẻ heading theo đúng thứ tự đã tính sẵn ở extractHeadings,
// để link trong mục lục (#slug) nhảy tới đúng chỗ.
class HeadingIdRenderer extends marked.Renderer {
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
}

/**
 * Tách frontmatter YAML (---\n...\n---) ra khỏi nội dung markdown.
 * Nhiều người viết blog dán nguyên file .md có frontmatter — nếu không tách,
 * block đó bị in ra thành text thô ở đầu bài.
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
    const innerHtml = marked.parse(inner, { async: false }) as string;
    const titleHtml = title ? `<p class="md-callout-title">${title}</p>` : "";
    return `\n\n<div class="md-callout md-callout-${type}">\n\n${titleHtml}\n\n${innerHtml}\n\n</div>\n\n`;
  });
}

/**
 * Render markdown ra HTML, chịu được nhiều "phương ngữ" markdown phổ biến:
 * - Frontmatter YAML ở đầu file (tự động bỏ, không hiện ra ngoài)
 * - Container kiểu :::warning / :::info / :::success / :::tip / :::danger
 * - Emoji shortcode kiểu :small_blue_diamond:
 * - [TOC] tự sinh mục lục kèm id cho heading để nhảy tới đúng chỗ
 * - HTML thô chèn trực tiếp (center, div, img...) — marked mặc định đã giữ nguyên
 */
export function renderMarkdown(raw: string): string {
  const withoutFrontmatter = stripFrontmatter(raw);
  const withEmoji = emojify(withoutFrontmatter);

  // Heading dùng để build mục lục/id chỉ tính phần NGOÀI container (:::...:::),
  // vì nội dung trong container được marked.parse() riêng, renderer gắn id sẽ
  // không thấy được heading bên trong đó.
  const outlineSource = withEmoji.replace(CONTAINER_RE, "");
  const headings = extractHeadings(outlineSource);

  const withToc = withEmoji.replace(TOC_MARKER_RE, () => buildTocHtml(headings));
  const withContainers = renderContainers(withToc);

  return marked.parse(withContainers, {
    async: false,
    renderer: new HeadingIdRenderer(headings),
  }) as string;
}
