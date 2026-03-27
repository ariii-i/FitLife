import z from "zod";
import { Model } from "objection";
import { Schema_Workout_Session } from "./schema-workout-session";
import { WorkoutModel } from "./workout";
import { ExerciseModel } from "../../exericse/domain/exercise";

export class WorkoutSessionModel extends Model implements z.infer<typeof Schema_Workout_Session> {
  id!: number;
  user_id!: number;
  workout_id!: number;
  duration_minutes!: number;
  performed_at!: string;
  exercise_id!: number;
  sets?: number;
  reps?: number;

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
    exercise: {
      relation: Model.BelongsToOneRelation,
      modelClass: ExerciseModel,
      join: {
        from: "workout_sessions.exercise_id",
        to: "exercises.id",
      },
    },
  };
}
