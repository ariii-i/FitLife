import { create } from "zustand";
import { deleteWorkoutApi, getSelectedWorkoutApi, getWorkoutApi, updateWorkoutApi } from "../api";
import { Workout } from "./types";

type WorkoutStore = {
  workouts: Workout[];
  workout: Workout | null;
  // createWorkout: (data: { name: string; exercises: { _id: string; plannedSets: number; plannedReps: number }[] }) => Promise<Workout>
  fetchWorkouts: () => Promise<void>
  fetchSelectedWorkout: (workoutId: string) => Promise<void>
  updateWorkout: (id: string, updatedField: Partial<Workout>) => Promise<void>
  deleteWorkout: (id: string) => Promise<void>
  clearWorkouts: () => void;
}

export const useWorkoutStore = create<WorkoutStore>((set) => ({
  workouts: [],
  workout: null,

  // createWorkout: async (data) => {
  //   const newWorkout = await createWorkoutApi(data)

  //   set((state) => ({
  //     workouts: [newWorkout, ...state.workouts],
  //   }))
  //   return newWorkout;
  // },

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
