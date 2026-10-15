import { z } from "zod";

export const updateResourceStatusSchema = z.object({
  isActive: z.boolean(),
});

export type UpdateResourceStatusInput = z.infer<
  typeof updateResourceStatusSchema
>;
