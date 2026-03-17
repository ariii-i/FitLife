import { Exercise } from "../modal/types";
import { orpc } from "server/src/orpc-client";
import { Schema_Exercise } from "server/src/orpc-server/packages/exericse/domain/schema-exercise";
import z from "zod";

export const createExerciseApi = async (data: z.infer<typeof Schema_Exercise>) => {
  return await orpc.exercise.create({ ...data, user_id: 1 })
};

export const getExerciseApi = async () => {
  return await orpc.exercise.list_exercise_by_user({ user_id: 1, pageIndex: 0, pageSize: 10 })
}

export const deleteExerciseApi = async (id: string): Promise<void> => {
  return null;
}

export const editExerciseApi = async (data: z.infer<typeof Schema_Exercise>) => {
  return await orpc.exercise.update_exercise(data)
}