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

export const HabitSchema = z.object({
  name: z.string().trim().min(1).max(120),
});

export const HabitLogSchema = z.object({
  logDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD"),
});

export const PresetSchema = z.object({
  name: z.string().trim().min(1).max(80),
  soundIds: z
    .array(z.object({ id: z.string(), volume: z.number().min(0).max(1) }))
    .max(10),
  sceneKey: z.string().trim().min(1).max(60),
  workMinutes: z.coerce.number().int().min(1).max(180).default(25),
  breakMinutes: z.coerce.number().int().min(1).max(60).default(5),
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

export const SceneBackgroundSchema = z.object({
  sceneKey: z.string().trim().min(1).max(60),
  mediaType: z.enum(["image", "video"]),
  source: z.enum(["r2", "external"]),
  urlOrKey: z.string().trim().min(1).max(500),
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
  habits: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(120),
        logDates: z.array(z.string()).max(3660),
      }),
    )
    .max(100),
});

export type TaskInput = z.infer<typeof TaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type SessionInput = z.infer<typeof SessionSchema>;
export type HabitInput = z.infer<typeof HabitSchema>;
export type HabitLogInput = z.infer<typeof HabitLogSchema>;
export type PresetInput = z.infer<typeof PresetSchema>;
export type FocusSettingsInput = z.infer<typeof FocusSettingsSchema>;
export type SoundTrackInput = z.infer<typeof SoundTrackSchema>;
export type SceneBackgroundInput = z.infer<typeof SceneBackgroundSchema>;
export type PlaylistInput = z.infer<typeof PlaylistSchema>;
export type ImportPayload = z.infer<typeof ImportPayloadSchema>;
