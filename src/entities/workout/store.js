import { create } from "zustand";
import { createWorkoutApi, deleteWorkoutApi, getSelectedWorkoutApi, getWorkoutApi, updateWorkoutApi } from "./api";

export const useWorkoutStore = create((set) => ({
  workouts: [],
  workout: null,

  createWorkout: async (workoutPayload, cb) => {
    const newWorkout = await createWorkoutApi(workoutPayload)

    set((state) => ({
      workouts: [newWorkout, ...state.workouts],
    }));

    cb?.(newWorkout);
    return newWorkout;
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
      workouts: state.workouts.map((w) =>
        w._id === id ? updated : w
      ),
      workout: updated
    }));
  },

  deleteWorkout: async (id) => {
    await deleteWorkoutApi()

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
