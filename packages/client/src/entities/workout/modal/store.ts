import { Schema_Create_Workout, Schema_Create_Workout_Output, Schema_Update_Workout, Schema_Workout } from "server/src/orpc-server/packages/workout/domain/schema-workout";
import z from "zod";
import { create } from "zustand";
import { createWorkoutApi, getSelectedWorkoutApi, getWorkoutApi, updateWorkoutApi } from "../api";

type WorkoutStore = {
  workouts: Array<z.infer<typeof Schema_Workout>>;
  workout: z.infer<typeof Schema_Create_Workout_Output> | null;

  createWorkout: (payload: z.infer<typeof Schema_Create_Workout>) => Promise<void>;
  fetchWorkouts: () => Promise<void>;
  fetchSelectedWorkout: (id: number) => Promise<void>;
  updateWorkout: (payload: z.infer<typeof Schema_Update_Workout>) => Promise<void>;
  // deleteWorkout: (id: number) => Promise<void>;
  clearWorkouts: () => void;
};

export const useWorkoutStore = create<WorkoutStore>((set) => ({
  workouts: [],
  workout: null,

  createWorkout: async (payload) => {
    try {
      const created = await createWorkoutApi(payload);

      set((state) => ({
        workouts: [...state.workouts, created],
      }));
    } catch (error) {
      console.error("Failed to create workout", error);
      throw error;
    }
  },

  fetchWorkouts: async () => {
    const data = await getWorkoutApi();
    set({ workouts: data });
  },

  fetchSelectedWorkout: async (id) => {
    if (!id) {
      console.error("No workoutId provided");
      return;
    }
    const data = await getSelectedWorkoutApi(id);
    set({ workout: data || null});
  },

  updateWorkout: async (payload) => {
    const updated = await updateWorkoutApi(payload);

    set((state) => ({
      workouts: state.workouts.map((w) =>
        w.id === updated.id ? updated : w
      ),
      workout: updated,
    }));
  },

  // deleteWorkout: async (id) => {
  //   set((state) => ({
  //     workouts: state.workouts.filter(
  //       (workout) => workout.id !== id
  //     ),
  //   }));
  // },

  clearWorkouts: () => {
    set({ workouts: [] });
  },
}));
