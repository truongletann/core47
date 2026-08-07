// Shared, dependency-free filter definitions for the recipe library page.
// "Cách nấu" has no dedicated DB column — recipes are tagged with a cooking
// method by keyword-matching their own name, since that's already reliable
// for the mostly-single-technique recipes seeded so far and avoids yet
// another admin field to keep in sync. If recipes ever need more than one
// technique described accurately, promote this to a real column instead.

export const FOOD_CATEGORY_LABELS: Record<string, string> = {
  thit: "Thịt",
  hai_san: "Hải sản",
  rau_cu_qua: "Rau củ quả",
  tinh_bot: "Tinh bột",
  khac: "Khác",
};
export const FOOD_CATEGORY_ORDER = ["thit", "hai_san", "rau_cu_qua", "tinh_bot", "khac"];

const COOKING_METHOD_KEYWORDS: [key: string, label: string, keywords: string[]][] = [
  ["xao", "Xào", ["xào"]],
  ["chien_nuong", "Chiên/Nướng/Áp chảo", ["chiên", "nướng", "áp chảo", "quay"]],
  ["hap_luoc", "Hấp/Luộc", ["hấp", "luộc"]],
  ["kho", "Kho", ["kho"]],
  ["canh_sup", "Canh/Súp/Canh chua", ["canh", "súp"]],
  ["salad_goi", "Salad/Gỏi/Trộn", ["salad", "gỏi", "trộn"]],
  ["sinh_to_do_uong", "Sinh tố/Đồ uống", ["sinh tố", "cháo"]],
];

export function deriveCookingMethods(recipeName: string): string[] {
  const lower = recipeName.toLowerCase();
  const matched = COOKING_METHOD_KEYWORDS.filter(([, , keywords]) =>
    keywords.some((kw) => lower.includes(kw)),
  ).map(([key]) => key);
  return matched.length > 0 ? matched : ["khac"];
}

export const COOKING_METHOD_LABELS: Record<string, string> = {
  ...Object.fromEntries(COOKING_METHOD_KEYWORDS.map(([key, label]) => [key, label])),
  khac: "Khác",
};
export const COOKING_METHOD_ORDER = [...COOKING_METHOD_KEYWORDS.map(([key]) => key), "khac"];

export const CALORIE_RANGES = [
  { key: "under300", label: "Dưới 300 kcal", test: (c: number) => c < 300 },
  { key: "300to500", label: "300–500 kcal", test: (c: number) => c >= 300 && c <= 500 },
  { key: "over500", label: "Trên 500 kcal", test: (c: number) => c > 500 },
] as const;

export const GOAL_LABELS: Record<string, string> = {
  lose_weight: "Giảm cân",
  maintain: "Duy trì",
  gain_weight: "Tăng cân",
  gain_muscle: "Tăng cơ",
};
export const GOAL_ORDER = ["lose_weight", "maintain", "gain_weight", "gain_muscle"];
