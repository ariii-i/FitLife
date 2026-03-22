import { sanityClient } from "@/shared/lib/sanity";
import { orpc } from "server/src/orpc-client";
import {
  Schema_Create_Workout,
  Schema_Update_Workout,
} from "server/src/orpc-server/packages/workout/domain/schema-workout";
import z from "zod";

const get_unique_key = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

type CreateWorkoutInput = {
  name: string;
  exercises: {
    _id: string;
    plannedSets: number;
    plannedReps: number;
  }[];
};

export const createWorkoutApi = async (
  data: z.infer<typeof Schema_Create_Workout>,
) => {
  return orpc.workout.create(data);
};
export const get_workout_detail = async (workout_id: number) => {
  return orpc.workout.find({ id: workout_id });
};

export const getWorkoutApi = async () => {
  return orpc.workout.list_workout_by_user({
    user_id: 1,
    pageIndex: 0,
    pageSize: 10,
  });
};

export const getSelectedWorkoutApi = async () => {
  return orpc.workout.list_exercise_in_a_workout({ workout_id: 1 });
};

export const updateWorkoutApi = async (
  payload: z.infer<typeof Schema_Update_Workout>,
) => {
  return orpc.workout.update(payload);
};

export const deleteWorkoutApi = async (id: string): Promise<void> => {
  await sanityClient.delete(id);
};
