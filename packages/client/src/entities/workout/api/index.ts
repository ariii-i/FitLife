import { orpc } from "server/src/orpc-client";
import { Schema_Create_Workout, Schema_Update_Workout } from "server/src/orpc-server/packages/workout/domain/schema-workout";
import z from "zod";

export const createWorkoutApi = async (data: z.infer<typeof Schema_Create_Workout>) => {
  return await orpc.workout.create({ ...data, user_id: 1 });
};

export const getWorkoutApi = async () => {
  return await orpc.workout.list({ pageIndex: 0, pageSize: 10 });
};

export const getSelectedWorkoutApi = async (id: number) => {
  if (!id) {
    console.error("Workout ID is required");
  }
  return await orpc.workout.list_exercise_in_a_workout({ workout_id: id });
};

export const updateWorkoutApi = async (data: z.infer<typeof Schema_Update_Workout>) => {
  return await orpc.workout.update_workout(data);
};

// export const deleteWorkoutApi = async (id: string): Promise<void> => {
//   await sanityClient.delete(id)
// }