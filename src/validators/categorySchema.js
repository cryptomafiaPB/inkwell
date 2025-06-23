import { z } from "zod/v4";

export const categorySchema = z.object({
  title: z.string().min(2).max(50).trim(),
  description: z.string().min(10).max(1600).trim(),
});
