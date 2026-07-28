import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email("Email không hợp lệ").max(255),
  username: z
    .string()
    .min(3, "Username tối thiểu 3 ký tự")
    .max(20, "Username tối đa 20 ký tự")
    .regex(/^[a-zA-Z0-9_]+$/, "Chỉ chứa chữ, số và dấu gạch dưới")
    .optional()
    .or(z.literal("")),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự").max(200),
});

export const LoginSchema = z.object({
  identifier: z.string().min(1, "Vui lòng nhập email hoặc username").max(255),
  password: z.string().min(1, "Vui lòng nhập mật khẩu").max(200),
});

export const UpdateProfileSchema = z.object({
  name: z.string().max(80).optional().or(z.literal("")),
  username: z
    .string()
    .min(3, "Username tối thiểu 3 ký tự")
    .max(20, "Username tối đa 20 ký tự")
    .regex(/^[a-zA-Z0-9_]+$/, "Chỉ chứa chữ, số và dấu gạch dưới")
    .optional()
    .or(z.literal("")),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
  newPassword: z.string().min(8, "Mật khẩu mới tối thiểu 8 ký tự").max(200),
});

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;