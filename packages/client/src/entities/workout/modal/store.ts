import { create } from "zustand";
import {
  createWorkoutApi,
  get_workout_detail,
  getSelectedWorkoutApi,
  getWorkoutApi,
  updateWorkoutApi,
} from "../api";
import z from "zod";
import {
  Schema_Create_Workout,
  Schema_Update_Workout,
  Schema_Workout,
} from "server/src/orpc-server/packages/workout/domain/schema-workout";
import { Schema_Workout_Exercise } from "server/src/orpc-server/packages/workout/domain/schema-workout-exercise";

type WorkoutStore = {
  workouts: Array<z.infer<typeof Schema_Workout>>;
  workout: z.infer<typeof Schema_Workout_Exercise> | null;
  createWorkout: (
    payload: z.infer<typeof Schema_Create_Workout>,
    cb?: () => void,
  ) => Promise<void>;
  fetchWorkouts: () => Promise<void>;
  fetchWorkoutDetail: (workout_id: number) => Promise<any>;
  fetchSelectedWorkout: (
    payload: z.infer<typeof Schema_Create_Workout>,
  ) => Promise<void>;
  updateWorkout: (
    payload: z.infer<typeof Schema_Update_Workout>,
  ) => Promise<void>;
  // deleteWorkout: (id: string) => Promise<void>;
  clearWorkouts: () => void;
};

export const useWorkoutStore = create<WorkoutStore>((set) => ({
  workouts: [],
  workout: null,

  fetchWorkouts: async () => {
    const data = await getWorkoutApi();
    set({ workouts: data });
  },

  fetchWorkoutDetail: async (workout_id) => {
    const data = await get_workout_detail(workout_id);
    console.log(data);
    return data;
  },

  createWorkout: async (payload, cb) => {
    await createWorkoutApi(payload);
    cb?.();
  },

  fetchSelectedWorkout: async () => {
    const data = await getSelectedWorkoutApi();

    set({ workout: data || null });
  },

  updateWorkout: async (payload) => {
    await updateWorkoutApi(payload);
  },

  // deleteWorkout: async (id) => {
  //   await deleteWorkoutApi(id);

  //   set((state) => ({
  //     workouts: state.workouts.filter((w) => w._id !== id),
  //   }));
  // },

  clearWorkouts: () => {
    set({ workouts: [] });
  },
}));
