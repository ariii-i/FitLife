import { create } from "zustand";
import { sanityClient } from "../lib/sanity";

export const useExerciseStore = create((set) => ({
  exercises: [],

  setExercises: (exercises) => set({ exercises }),

  addExercise: (exercise) =>
    set((state) => ({ exercises: [...state.exercises, exercise] })),

  fetchExercises: async () => {
    const data = await sanityClient.fetch(`
      *[_type=="exercise"] | order(date desc){
        _id,
        name
      }
    `)
    set({ exercises: data })
    console.log("data ho la", data)
  },

  deleteExercise: async (id) => {
    await sanityClient.delete(id)
    set((state) => ({
      exercises: state.exercises.filter((ex) => ex._id !== id)
    }))
  },

  
}));
