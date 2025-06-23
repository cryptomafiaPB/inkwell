import { z } from "zod/v4";
import { AvailableRoles } from "../utils/constants.js";

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(30),
  username: z.string().min(3).max(30),
  fullname: z.string().min(3).max(50),
  role: z.enum(AvailableRoles),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(30),
});

export const reqUserSchema = z.object({
  id: z.string(),
  role: z.enum(AvailableRoles),
});
