import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email("Invalid email").max(255),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed")
    .optional()
    .or(z.literal("")),
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
});

export const LoginSchema = z.object({
  identifier: z.string().min(1, "Please enter your email or username").max(255),
  password: z.string().min(1, "Please enter your password").max(200),
});

export const UpdateProfileSchema = z.object({
  name: z.string().max(80).optional().or(z.literal("")),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed")
    .optional()
    .or(z.literal("")),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Please enter your current password"),
  newPassword: z.string().min(8, "New password must be at least 8 characters").max(200),
});

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
