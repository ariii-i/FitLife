import z from "zod";
import { Schema_Workout_Exercise } from "./schema-workout-exercise";

export const Schema_Workout = z.object({
  id: z.number().int().min(1),
  user_id: z.string(),
  name: z.string(),
  created_at: z.string(),
});

export const Schema_Create_Workout = Schema_Workout.omit({ id: true, created_at: true }).extend({
  exercises: z
    .array(Schema_Workout_Exercise.pick({ exercise_id: true, sets: true, reps: true, name: true }))
    .min(1),
});
export const Schema_Update_Workout = Schema_Workout.omit({ created_at: true }).extend({
  exercises: z
    .array(Schema_Workout_Exercise.pick({ exercise_id: true, sets: true, reps: true, name: true }))
    .min(1),
});

export const Schema_Create_Workout_Output = Schema_Workout.extend({
  exercises: z.array(Schema_Workout_Exercise),
});
