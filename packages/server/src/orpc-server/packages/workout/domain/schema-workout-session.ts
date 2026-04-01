import z from "zod";

export const Schema_Workout_Session = z.object({
  id: z.number().int().min(1),
  user_id: z.string(),
  workout_id: z.number(),
  duration_minutes: z.number().int(),
  performed_at: z.string(),
  exercises_done: z.number().int().optional(),
  exercise_id: z.number().int(),
  sets: z.number().int().optional(),
  reps: z.number().int().optional(),
});

export const Schema_Workout_Session_Create = Schema_Workout_Session.omit({
  id: true,
  exercises_done: true,
});
