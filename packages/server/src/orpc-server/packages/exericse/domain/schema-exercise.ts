import z from "zod";

export const Schema_Exercise = z.object({
  id: z.number().int().min(1),
  user_id: z.number().int().min(1),
  name: z.string(),
  description: z.string().optional(),
  muscle_group: z.string().optional(),
});
