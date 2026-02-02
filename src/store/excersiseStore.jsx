import { create } from "zustand";
import { sanityClient } from "../lib/sanity";

export const useExerciseStore = create((set) => ({
  exercises: [],

  setExercises: (exercises) => set({ exercises }),

  addExercise: (exercise) =>
    set((state) => ({ exercises: [...state.exercises, exercise] })),

  fetchExercises: async () => {
    const data = await sanityClient.fetch(`
      *[_type=="exercise"] | order(_createdAt desc){
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

  editExercises: async (id, updatedField) => {
    const update = await sanityClient.patch(id)
      .set(updatedField)
      .commit()

    set((state) => ({
      exercises: state.exercises.map((ex) =>
        ex._id === id ? update : ex)
    }))
  },


}));
