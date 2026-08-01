import { z } from "zod";

export const VIDEO_QUALITIES = ["max", "2160", "1440", "1080", "720", "480", "360", "240", "144"] as const;
export const AUDIO_FORMATS = ["best", "mp3", "ogg", "wav", "opus"] as const;
export const DOWNLOAD_MODES = ["auto", "audio", "mute"] as const;

export const ResolveDownloadSchema = z.object({
  url: z
    .string()
    .min(1, "Paste a link first")
    .max(2048)
    .refine(
      (val) => {
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: "Invalid URL" },
    ),
  videoQuality: z.enum(VIDEO_QUALITIES).optional().default("1080"),
  audioFormat: z.enum(AUDIO_FORMATS).optional().default("mp3"),
  downloadMode: z.enum(DOWNLOAD_MODES).optional().default("auto"),
});
export type ResolveDownloadInput = z.input<typeof ResolveDownloadSchema>;
