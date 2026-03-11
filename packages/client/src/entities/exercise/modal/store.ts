import { create } from "zustand";
import { createExerciseApi, deleteExerciseApi, editExerciseApi, getExerciseApi } from "../api";
import { Exercise } from "./types";

export interface ExerciseStore {
  exercises: Exercise[],
  setExercises: (exercise: Exercise[]) => void,
  createExercise: (data: string) => Promise<void>,
  fetchExercises: () => Promise<void>,
  deleteExercise: (id: string) => Promise<void>,
  editExercise: (id: string, name: string) => Promise<Exercise>
}

export const useExerciseStore = create<ExerciseStore>((set) => ({
  exercises: [],

  setExercises: (exercises) => set({ exercises }),

  createExercise: async (name: string) => {
    const created: Exercise = await createExerciseApi({ exercise: name });

    set((state) => ({
      exercises: [created, ...state.exercises],
    }));

  },

  fetchExercises: async () => {
    try {
      const data = await getExerciseApi()
      set({ exercises: data })
    } catch (error) {
      console.error(error);
    }
  },

  deleteExercise: async (id) => {
    await deleteExerciseApi(id)

    set((state) => ({
      exercises: state.exercises.filter((ex) => ex._id !== id)
    }))
  },

  editExercise: async (id: string, name: string) => {
    const update: Exercise = await editExerciseApi(id, name);

    set((state) => ({
      exercises: state.exercises.map((ex) =>
        ex._id === id ? update : ex
      ),
    }));

    return update;
  },

}));
