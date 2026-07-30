const WORDS_PER_MINUTE = 200;

/**
 * Rough reading time estimate from raw markdown content. Doesn't bother
 * stripping syntax precisely — word count on raw text is close enough for a
 * "X min read" label.
 */
export function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
