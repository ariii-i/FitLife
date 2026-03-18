import { create } from "zustand";
import { createWorkoutApi, deleteWorkoutApi, getSelectedWorkoutApi, getWorkoutApi, updateWorkoutApi } from "../api";
import { Workout } from "./types";
import z from "zod";
import { Schema_Create_Workout, Schema_Workout } from "server/src/orpc-server/packages/workout/domain/schema-workout";

type WorkoutStore = {
  workouts: Array<z.infer<typeof Schema_Workout>>;
  workout: Workout | null;
  createWorkout: (payload: z.infer<typeof Schema_Create_Workout>) => Promise<void>
  fetchWorkouts: () => Promise<void>
  fetchSelectedWorkout: (payload: z.infer<typeof Schema_Workout>) => Promise<void>
  updateWorkout: (payload: z.infer<typeof Schema_Workout>) => Promise<void>
  deleteWorkout: (id: string) => Promise<void>
  clearWorkouts: () => void;
}

export const useWorkoutStore = create<WorkoutStore>((set) => ({
  workouts: [],
  workout: null,

  createWorkout: async (payload) => {
    console.log(payload)
    try {
      const created = await createWorkoutApi(payload);
      console.log(created)

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

  fetchSelectedWorkout: async (workoutId) => {
    if (!workoutId) {
      console.error("No workoutId provided");
      return;
    }

    const data = await getSelectedWorkoutApi(workoutId)

    set({ workout: data || null });
  },

  updateWorkout: async (id, updatedField) => {
    const updated = await updateWorkoutApi(id, updatedField)

    set((state) => ({
      workouts: state.workouts.map((w) => (w._id === id ? updated : w)),
      workout: updated,
    }));
  },

  deleteWorkout: async (id) => {
    await deleteWorkoutApi(id)

    set((state) => ({
      workouts: state.workouts.filter(
        (w) => w._id !== id
      ),
    }));
  },

  clearWorkouts: () => {
    set({ workouts: [] });
  },

}));
