import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email("Email không hợp lệ").max(255),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự").max(200),
});

export const LoginSchema = z.object({
  email: z.string().email("Email không hợp lệ").max(255),
  password: z.string().min(1, "Vui lòng nhập mật khẩu").max(200),
});

export const UpdateProfileSchema = z.object({
  name: z.string().max(80).optional().or(z.literal("")),
  avatarUrl: z.string().url().max(500).optional().or(z.literal("")),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
