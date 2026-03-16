import z from "zod";
import { Model } from "objection";
import { Schema_Workout_Session } from "./schema-workout-session";
import { WorkoutModel } from "./workout";

export class WorkoutSessionModel extends Model implements z.infer<typeof Schema_Workout_Session> {
  id!: number;
  user_id!: number;
  workout_id!: number;
  duration_minutes!: number;
  performed_at!: string;

  // transient property
  exercises_done!: number;

  static tableName = "workout_sessions";

  static relationMappings = {
    workout: {
      relation: Model.BelongsToOneRelation,
      modelClass: WorkoutModel,
      join: {
        from: "workout_sessions.workout_id",
        to: "workouts.id",
      },
    },
  };
}
