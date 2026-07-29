/**
 * Auto-generated excerpt from content when the admin leaves it blank —
 * used for the SEO/OG description tag and anywhere else a short summary
 * is needed.
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
