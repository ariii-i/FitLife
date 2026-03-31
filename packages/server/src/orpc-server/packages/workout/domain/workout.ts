import z from "zod";
import { Model, QueryContext } from "objection";
import { Schema_Workout } from "./schema-workout";
import { ExerciseModel } from "../../exericse/domain/exercise";

export class WorkoutModel extends Model implements z.infer<typeof Schema_Workout> {
  id!: number;
  user_id!: number;
  name!: string;
  created_at!: string;

  static tableName = "workouts";

  $beforeInsert(): Promise<any> | void {
    this.created_at = new Date().toISOString();
  }

  static relationMappings = {
    exercises: {
      relation: Model.ManyToManyRelation,
      modelClass: ExerciseModel,
      join: {
        from: "workouts.id",
        through: {
          from: "workout_exercises.workout_id",
          to: "workout_exercises.exercise_id",
          extra: ["sets", "reps"], // THIS is key
        },
        to: "exercises.id",
      },
    },
  };
}
