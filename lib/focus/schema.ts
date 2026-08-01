import { z } from "zod";

export const TaskSchema = z.object({
  title: z.string().trim().min(1).max(200),
  estimatedPomodoros: z.coerce.number().int().min(1).max(20).default(1),
});

export const UpdateTaskSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  isDone: z.boolean().optional(),
  completedPomodoros: z.coerce.number().int().min(0).optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export const SessionSchema = z.object({
  taskId: z.string().trim().max(64).nullable().optional(),
  type: z.enum(["work", "break"]),
  durationMinutes: z.coerce.number().int().min(1).max(180),
  completedAt: z.string().trim().min(1),
});

export const FocusSettingsSchema = z.object({
  workMinutes: z.coerce.number().int().min(1).max(180),
  breakMinutes: z.coerce.number().int().min(1).max(60),
  longBreakMinutes: z.coerce.number().int().min(1).max(120),
  sessionsBeforeLongBreak: z.coerce.number().int().min(1).max(20),
});

export const SoundTrackSchema = z.object({
  name: z.string().trim().min(1).max(80),
  category: z.string().trim().min(1).max(40),
  source: z.enum(["bundled", "r2", "external"]),
  urlOrKey: z.string().trim().min(1).max(500),
  isEnabled: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export const ThemeSchema = z
  .object({
    name: z.string().trim().min(1).max(80),
    category: z.string().trim().min(1).max(40),
    kind: z.enum(["image", "youtube"]), // "canvas" themes are seeded/system-only, not admin-creatable
    source: z.enum(["r2", "external", "youtube"]),
    urlOrKey: z.string().trim().min(1).max(500),
    startSeconds: z.coerce.number().int().min(0).nullable().optional(),
    endSeconds: z.coerce.number().int().min(0).nullable().optional(),
    isEnabled: z.boolean().default(true),
    sortOrder: z.coerce.number().int().default(0),
  })
  .refine((v) => v.endSeconds == null || v.startSeconds == null || v.endSeconds > v.startSeconds, {
    message: "Thời điểm kết thúc phải sau thời điểm bắt đầu",
    path: ["endSeconds"],
  });

export const PlaylistSchema = z.object({
  name: z.string().trim().min(1).max(120),
  spotifyEmbedUrl: z
    .string()
    .trim()
    .url()
    .refine((u) => u.startsWith("https://open.spotify.com/embed/"), {
      message: "Must be an open.spotify.com/embed/... URL",
    }),
  category: z.string().trim().max(40).nullable().optional(),
  isEnabled: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

// Payload shape for the one-time anonymous -> account import on login.
export const ImportPayloadSchema = z.object({
  tasks: z
    .array(
      z.object({
        title: z.string().trim().min(1).max(200),
        estimatedPomodoros: z.number().int().min(1).max(20),
        completedPomodoros: z.number().int().min(0),
        isDone: z.boolean(),
      }),
    )
    .max(500),
  sessions: z
    .array(
      z.object({
        type: z.enum(["work", "break"]),
        durationMinutes: z.number().int().min(1).max(180),
        completedAt: z.string(),
      }),
    )
    .max(2000),
});

export type TaskInput = z.infer<typeof TaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type SessionInput = z.infer<typeof SessionSchema>;
export type FocusSettingsInput = z.infer<typeof FocusSettingsSchema>;
export type SoundTrackInput = z.infer<typeof SoundTrackSchema>;
export type ThemeInput = z.infer<typeof ThemeSchema>;
export type PlaylistInput = z.infer<typeof PlaylistSchema>;
export type ImportPayload = z.infer<typeof ImportPayloadSchema>;
