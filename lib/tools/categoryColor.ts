// Maps a tool's category_id to its CSS accent-color variable (defined in
// app/globals.css). Shared by Hero and ToolCard so the two card renderings
// on the homepage never drift out of sync with each other.
const CATEGORY_VAR: Record<string, string> = {
  "dev-utilities": "--cat-dev-utilities",
  documents: "--cat-documents",
  productivity: "--cat-productivity",
  links: "--cat-links",
};

const DEFAULT_CATEGORY_VAR = "--cat-dev-utilities";

export function getCategoryColorVar(categoryId: string): string {
  return CATEGORY_VAR[categoryId] ?? DEFAULT_CATEGORY_VAR;
}
