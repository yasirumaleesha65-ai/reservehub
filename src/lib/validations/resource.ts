import { z } from "zod";

export const createResourceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Resource name must contain at least 2 characters.")
    .max(100),
  description: z.string().trim().max(500).default(""),
  category: z.enum(["MEETING_ROOM", "EQUIPMENT", "WORKSPACE"]),
  location: z.string().trim().max(150).default(""),
  capacity: z.number().int().min(1).max(1000),
});

export type CreateResourceInput = z.infer<typeof createResourceSchema>;
