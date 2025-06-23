import { z } from "zod/v4";

export const postSchema = z.object({
  title: z.string().min(3).max(100).trim(),
  content: z.string().min(10).max(8000).trim(),
  category: z.string(), // Assuming category is a string ID
  user: z.string(), // Assuming user is a string ID
});

export const updateSchema = z.object({
  title: z.string().min(3).max(100).trim().optional(),
  content: z.string().min(10).max(8000).trim().optional(),
  category: z.string().optional(),
});
