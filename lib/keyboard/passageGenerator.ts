import { secureRandomInt } from "@/lib/random/secureRandom";

export type Lang = "en" | "vi";
export type Length = "short" | "long";

// Common everyday words, generated into fresh random passages each time —
// with a pool this size and 20-58 words drawn per passage, the odds of ever
// generating the exact same sentence twice are astronomically low.
const WORD_BANKS: Record<Lang, string[]> = {
  en: [
    "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog", "sun", "sets",
    "behind", "distant", "mountains", "painting", "whole", "sky", "warm", "shades", "orange", "deep",
    "purple", "somewhere", "far", "valley", "below", "train", "whistle", "echoes", "gently", "across",
    "fields", "reminding", "every", "tired", "traveler", "last", "ride", "day", "about", "depart",
    "old", "wooden", "station", "near", "river", "programming", "art", "telling", "another", "human",
    "wants", "computer", "yet", "much", "actual", "craft", "spent", "reading", "code", "written",
    "someone", "else", "even", "yourself", "months", "ago", "trying", "patiently", "reconstruct", "exact",
    "reasoning", "decision", "once", "made", "perfect", "sense", "now", "looks", "nothing", "more",
    "than", "confusing", "riddle", "success", "usually", "comes", "those", "who", "busy", "looking",
    "notice", "how", "already", "come", "one", "small", "steady", "step", "time", "each",
    "journey", "thousand", "miles", "begins", "single", "stop", "overthinking", "plan", "just", "start",
    "typing", "very", "first", "sentence", "right", "practice", "makes", "real", "way", "faster",
    "without", "mistakes", "keep", "practicing", "little", "skipping", "difficulty", "opportunity", "saying", "goes",
    "nowhere", "feel", "true", "slow", "process", "learning", "quickly", "accurately", "mistake", "simply",
    "feedback", "gentle", "nudge", "pointing", "toward", "exactly", "which", "finger", "needs", "patient",
    "attempt", "build", "software", "impossible", "task", "becomes", "familiar", "comfortable", "routine", "weeks",
    "unglamorous", "progress", "nobody", "notices", "until", "project", "finally", "ships", "coffee", "morning",
    "before", "work", "begin", "because", "quiet", "moment", "think", "clearly", "life", "long",
    "enjoy", "moments", "people", "love", "tomorrow", "bring", "us", "friends", "family", "important",
    "world", "changes", "fast", "technology", "helps", "connect", "share", "ideas", "together", "grow",
  ],
  vi: [
    "tôi", "thích", "lập", "trình", "và", "uống", "cà", "phê", "vào", "mỗi",
    "buổi", "sáng", "trước", "khi", "bắt", "đầu", "công", "việc", "vì", "đó",
    "là", "khoảng", "thời", "gian", "yên", "tĩnh", "nhất", "trong", "ngày", "để",
    "suy", "nghĩ", "thấu", "đáo", "cuộc", "sống", "một", "chuyến", "đi", "dài",
    "hãy", "tận", "hưởng", "từng", "khoảnh", "khắc", "bên", "những", "người", "ta",
    "yêu", "thương", "không", "ai", "biết", "được", "mai", "sẽ", "mang", "đến",
    "điều", "gì", "cho", "chúng", "dự", "án", "này", "xây", "dựng", "trên",
    "nền", "tảng", "triển", "khai", "dụng", "khả", "năng", "chạy", "rất", "nhiều",
    "điểm", "toàn", "cầu", "lại", "tốc", "độ", "phản", "hồi", "nhanh", "có",
    "thể", "dùng", "bất", "kỳ", "đâu", "đồng", "vẫn", "giữ", "chi", "phí",
    "vận", "hành", "mức", "thấp", "nhờ", "mô", "hình", "hiện", "đại", "học",
    "gõ", "phím", "giúp", "tiết", "kiệm", "làm", "giảm", "mỏi", "tay", "đáng",
    "kể", "đặc", "biệt", "phải", "soạn", "thảo", "văn", "bản", "hoặc", "viết",
    "mã", "nguồn", "liên", "tục", "luyện", "tập", "đều", "đặn", "chỉ", "cải",
    "thiện", "còn", "hẳn", "số", "lỗi", "sai", "từ", "nâng", "cao", "chất",
    "lượng", "tổng", "kiên", "trì", "kết", "quả", "bất", "ngờ", "giống", "như",
    "giọt", "nước", "nhỏ", "bé", "cuối", "cùng", "cũng", "đầy", "cả", "chiếc",
    "bình", "lớn", "hôm", "nay", "chính", "hành", "trang", "quý", "giá", "phía",
    "con", "đường", "nhiều", "gian", "nan", "kỷ", "niệm", "đẹp", "dù", "nữa",
    "nhạc", "nhẹ", "nhàng", "đủ", "hiệu", "quả", "tách", "nóng", "vấn", "đề",
  ],
};

function pickRandomWords(bank: string[], count: number): string[] {
  const result: string[] = [];
  let prevIndex = -1;
  for (let i = 0; i < count; i++) {
    let index: number;
    do {
      index = secureRandomInt(0, bank.length - 1);
    } while (index === prevIndex && bank.length > 1);
    result.push(bank[index]);
    prevIndex = index;
  }
  return result;
}

export function generatePassage(lang: Lang, length: Length): string {
  const bank = WORD_BANKS[lang];
  const wordCount = length === "short" ? secureRandomInt(20, 26) : secureRandomInt(45, 58);
  const words = pickRandomWords(bank, wordCount);
  const sentence = words.join(" ");
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
}
