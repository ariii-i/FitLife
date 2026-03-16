import { Model } from "objection";
import z from "zod";
import { Schema_Exercise } from "./schema-exercise";

export class ExerciseModel extends Model implements z.infer<typeof Schema_Exercise> {
  id!: number;
  user_id!: number;
  name!: string;
  description?: string;
  muscle_group?: string;

  static tableName = "exercises";
}
