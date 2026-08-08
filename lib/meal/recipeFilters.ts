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

// c === 0 means "unknown" (no estimate), not "zero calories" — every range
// requires c > 0 so unrated recipes don't wrongly show up under "Dưới 300
// kcal" just because 0 < 300.
export const CALORIE_RANGES = [
  { key: "under300", label: "Dưới 300 kcal", test: (c: number) => c > 0 && c < 300 },
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

// "Bữa ăn" — which meal-time(s) a dish suits. Same keyword-heuristic
// approach/limitations as deriveCookingMethods above: no dedicated ground
// truth, derived from the dish name. A dish gets every plausible slot
// (phở/bún/mì etc. are eaten at breakfast or lunch in practice) rather than
// one exclusive pick — Vietnamese cuisine also doesn't meaningfully
// distinguish lunch vs. dinner dishes, so savory mains default to both.
const DESSERT_KEYWORDS = [
  "chè", "kem", "pudding", "mousse", "tiramisu", "thạch", "rau câu",
  "panna cotta", "cheesecake", "macaron", "cupcake", "cookie", "brownie",
  "bánh flan", "bánh bông lan", "bánh quy", "bánh su kem", "bánh ngọt",
  "custard", "caramel", "bánh trung thu", "chocolate", "socola", "trái cây dầm",
  "yaourt", "sữa chua",
];
const SNACK_KEYWORDS = [
  "gỏi cuốn", "chả giò", "nem chua", "bánh tráng trộn", "khoai tây chiên",
  "snack", "bắp rang", "sinh tố", "nước ép", "trà sữa", "bánh mì que",
  "bánh xèo mini", "chips", "popcorn", "nước detox", "trà",
];
const BREAKFAST_KEYWORDS = [
  "cháo", "xôi", "phở", "hủ tiếu", "bún", "mì", "bánh mì", "bánh cuốn",
  "bánh giò", "ngũ cốc", "yến mạch", "bánh canh", "miến",
];

export function deriveMealTimeCategories(recipeName: string): string[] {
  const lower = recipeName.toLowerCase();
  const has = (list: string[]) => list.some((kw) => lower.includes(kw));

  if (has(DESSERT_KEYWORDS)) return ["dessert"];
  if (has(SNACK_KEYWORDS)) return ["snack"];
  if (has(BREAKFAST_KEYWORDS)) return ["breakfast", "lunch"];
  return ["lunch", "dinner"];
}

export const MEAL_TIME_LABELS: Record<string, string> = {
  breakfast: "Sáng",
  lunch: "Trưa",
  dinner: "Tối",
  snack: "Ăn vặt",
  dessert: "Tráng miệng",
};
export const MEAL_TIME_ORDER = ["breakfast", "lunch", "dinner", "snack", "dessert"];
