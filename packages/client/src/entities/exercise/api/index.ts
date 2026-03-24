import { orpc } from "server/src/orpc-client";
import { Schema_Exercise, MuscleGroupEnum } from "server/src/orpc-server/packages/exericse/domain/schema-exercise";
import z from "zod";

export type T_GetExerciseParams = {
  name?: string;
  muscle_group?: z.infer<typeof MuscleGroupEnum>;
};

export const createExerciseApi = async (data: z.infer<typeof Schema_Exercise>) => {
  return await orpc.exercise.create({ ...data, user_id: 1 })
};

export const getExerciseApi = async (params?: T_GetExerciseParams) => {
  return await orpc.exercise.list_exercise_by_user({ user_id: 1, pageIndex: 0, pageSize: 100, ...params })
}

export const editExerciseApi = async (data: z.infer<typeof Schema_Exercise>) => {
  return await orpc.exercise.update_exercise(data)
}

// export const deleteExerciseApi = async (): Promise<void> => {
//   return 0;
// }