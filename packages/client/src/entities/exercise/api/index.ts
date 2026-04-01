import { orpc } from "@/shared/lib/orpc";
import {
  MuscleGroupEnum,
  Schema_Exercise,
} from "server/src/orpc-server/packages/exericse/domain/schema-exercise";
import z from "zod";

export const ExerciseFormSchema = Schema_Exercise.extend({
  image_base64: z.string().optional(),
});

export type T_GetExerciseParams = {
  user_id: string;
  name?: string;
  muscle_group?: z.infer<typeof MuscleGroupEnum>;
};

export const createExerciseApi = async (
  data: z.infer<typeof ExerciseFormSchema>,
) => {
  const { image_base64, ...rest } = data;
  return await orpc.exercise.create({ ...rest, image_base64 });
};

export const getExerciseApi = async (params: T_GetExerciseParams) => {
  return await orpc.exercise.list_exercise_by_user({
    pageIndex: 0,
    pageSize: 100,
    ...params,
  });
};

export const editExerciseApi = async (
  data: z.infer<typeof ExerciseFormSchema>,
) => {
  const { image_base64, ...rest } = data;
  return await orpc.exercise.update_exercise({ ...rest, image_base64 });
};
