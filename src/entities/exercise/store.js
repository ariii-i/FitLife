import { create } from "zustand";
import { createExerciseApi, deleteExerciseApi, editExerciseApi, getExerciseApi } from "./api";

export const useExerciseStore = create((set) => ({
  exercises: [],

  setExercises: (exercises) => set({ exercises }),

  createExercise: async (data) => {
    const created = await createExerciseApi(data);

    set((state) => ({
      exercises: [created, ...state.exercises],
    }));

  },

  fetchExercises: async () => {
    const data = await getExerciseApi()

    set({ exercises: data })
  },

  deleteExercise: async (id) => {
    await deleteExerciseApi(id)

    set((state) => ({
      exercises: state.exercises.filter((ex) => ex._id !== id)
    }))
  },

  editExercise: async (id, updatedField) => {
    const update = await editExerciseApi(id, updatedField)

    set((state) => ({
      exercises: state.exercises.map((ex) =>
        ex._id === id ? update : ex)
    }))
  },

}));
