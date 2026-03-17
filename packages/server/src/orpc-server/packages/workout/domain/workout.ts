import z from "zod";
import { Model, QueryContext } from "objection";
import { Schema_Workout } from "./schema-workout";

export class WorkoutModel extends Model implements z.infer<typeof Schema_Workout> {
  id!: number;
  user_id!: number;
  name!: string;
  created_at!: string;

  static tableName = "workouts";

  $beforeInsert(): Promise<any> | void {
    this.created_at = new Date().toISOString();
  }
}
