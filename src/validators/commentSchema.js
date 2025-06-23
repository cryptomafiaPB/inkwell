import { z } from "zod/v4";

export const commentSchema = z.object({
  content: z.string().min(1, "Content is required"),
  user: z.string(), // user id as a string
});
