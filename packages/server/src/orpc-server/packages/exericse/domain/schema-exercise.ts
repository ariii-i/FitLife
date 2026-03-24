import z from "zod";

export const MuscleGroupEnum = z.enum(["chest", "back", "legs", "shoulders", "arms", "core"]);

export type T_MuscleGroup = z.infer<typeof MuscleGroupEnum>;

export const Schema_Exercise = z.object({
  id: z.number().int().min(1),
  user_id: z.number().int().min(1),
  name: z.string(),
  description: z.string().optional(),
  // muscle_group: z.enum(["chest", "back", "legs", "shoulders", "arms", "core"]).optional(),
  muscle_group: z.string().optional(),
});
