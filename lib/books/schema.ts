import { z } from "zod";

export const CreateBookMetaSchema = z.object({
  title: z.string().trim().min(1).max(200),
  author: z.string().trim().max(120).optional(),
  description: z.string().trim().max(1000).optional(),
});
export type CreateBookMetaInput = z.infer<typeof CreateBookMetaSchema>;
