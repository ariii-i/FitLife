import { Model } from "objection";
import z from "zod";
import { ExerciseModel } from "../../exericse/domain/exercise";
import { Schema_Workout_Exercise } from "./schema-workout-exercise";

export class WorkoutExerciseModel extends Model implements z.infer<typeof Schema_Workout_Exercise> {
  id!: number;
  workout_id!: number;
  exercise_id!: number;
  sets!: number;
  reps!: number;
  created_at!: string;

  // transient property
  exercises_done!: number;

  static tableName = "workout_exercises";

  static relationMappings = {
    exercise: {
      relation: Model.BelongsToOneRelation,
      modelClass: ExerciseModel,
      join: {
        from: "workout_exercises.exercise_id",
        to: "exercises.id",
      },
    },
  };

  $beforeInsert(): Promise<any> | void {
    this.created_at = new Date().toISOString();
  }
}
