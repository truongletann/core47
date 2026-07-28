import { z } from "zod";

function normalizeUrl(val: string): string {
  const trimmed = val.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export const CreateShortLinkSchema = z.object({
  url: z
    .string()
    .min(1, "Vui lòng nhập URL")
    .max(2048, "URL quá dài")
    .transform(normalizeUrl)
    .refine(
      (val) => {
        try {
          // eslint-disable-next-line no-new
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: "URL không hợp lệ, kiểm tra lại chính tả" },
    )
    .refine(
      (val) => {
        try {
          return !/(^|\.)core47\.xyz$/i.test(new URL(val).hostname);
        } catch {
          return false;
        }
      },
      { message: "Không thể rút gọn link trỏ về chính core47.xyz" },
    ),
  customCode: z
    .string()
    .min(2, "Mã tối thiểu 2 ký tự")
    .max(20, "Mã tối đa 20 ký tự")
    .regex(/^[a-zA-Z0-9-]+$/, "Chỉ chứa chữ, số và dấu gạch ngang")
    .optional(),
});

export type CreateShortLinkInput = z.input<typeof CreateShortLinkSchema>;

export const ShortCodeParamSchema = z
  .string()
  .min(1)
  .max(20)
  .regex(/^[a-zA-Z0-9-]+$/);