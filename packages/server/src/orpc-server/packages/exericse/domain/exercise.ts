import { Model } from "objection";
import z from "zod";
import { Schema_Exercise } from "./schema-exercise";

export class ExerciseModel extends Model implements z.infer<typeof Schema_Exercise> {
  id!: number;
  user_id!: string;
  name!: string;
  description?: string;
  muscle_group?: string;
  image_path?: string;

  static tableName = "exercises";
}
