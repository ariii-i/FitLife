import z from "zod";

export const Schema_Workout_Exercise = z.object({
  id: z.number().int(),
  workout_id: z.number(),
  exercise_id: z.number(),
  sets: z.number().int().optional(),
  reps: z.number().int().optional(),
  created_at: z.string(),
});
