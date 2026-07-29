/**
 * Excerpt tự sinh từ nội dung khi admin để trống — dùng cho thẻ SEO/OG
 * description và bất kỳ nơi nào cần một đoạn tóm tắt ngắn.
 */
export function fallbackExcerpt(content: string, max = 160): string {
  const plain = content
    .replace(/^---[\s\S]*?---/, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^:::[a-zA-Z]+.*$/gm, "")
    .replace(/^:::\s*$/gm, "")
    .replace(/[#>*_~`-]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return plain.length > max ? plain.slice(0, max).trimEnd() + "…" : plain;
}
