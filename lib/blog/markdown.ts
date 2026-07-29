import { marked } from "marked";
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
 * - HTML thô chèn trực tiếp (center, div, img...) — marked mặc định đã giữ nguyên
 */
export function renderMarkdown(raw: string): string {
  const withoutFrontmatter = stripFrontmatter(raw);
  const withEmoji = emojify(withoutFrontmatter);
  const withContainers = renderContainers(withEmoji);
  return marked.parse(withContainers, { async: false }) as string;
}
