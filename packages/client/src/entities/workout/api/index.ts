import { orpc } from "@/shared/lib/orpc";
import {
  Schema_Create_Workout,
  Schema_Update_Workout,
} from "server/src/orpc-server/packages/workout/domain/schema-workout";
import z from "zod";

export const createWorkoutApi = async (
  data: z.infer<typeof Schema_Create_Workout>,
) => {
  return orpc.workout.create(data);
};
export const get_workout_detail = async (workout_id: number) => {
  return orpc.workout.find({ id: workout_id });
};

export const getWorkoutApi = async (params: {
  user_id: string;
  pageIndex?: number;
  pageSize?: number;
}) => {
  return orpc.workout.list_workout_by_user(params);
};

export const getSelectedWorkoutApi = async (workout_id: number) => {
  return orpc.workout.list_exercise_in_a_workout({ workout_id: workout_id });
};

export const updateWorkoutApi = async (
  payload: z.infer<typeof Schema_Update_Workout>,
) => {
  return orpc.workout.update(payload);
};

export const get_workout_history_chart_data_api = async (
  user_id: string,
  date: string,
) => {
  return orpc.workout.get_workout_history_chart_data({ user_id, date });
};
