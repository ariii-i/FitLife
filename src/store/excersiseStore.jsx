import { create } from "zustand";
import { sanityClient } from "../lib/sanity";

export const useExerciseStore = create((set) => ({
  exercises: [],

  fetchExercises: async () => {
    const data = await sanityClient.fetch(`
      *[_type == "exercise"]{
        _id,
        name,
        muscleGroup,
        equipment
      }
    `);
    set({ exercises: data });
  },

  //sanity ma save first ma
  addExercise: async (exercise, cb) => {
    const newExercise = {
      _type: "exercise",
      ...exercise,
    }
    await sanityClient.create(newExercise);
    cb?.()
  },

  deleteExercise: async (id, cb) => {
    await sanityClient.delete(id);
    
    set((state) => ({ exercises: state.exercises.filter((ex) => ex._id !== id) }))
    cb?.()
  },

  editExercise: async (id, updatedFields) => {
    const updated = await sanityClient
      .patch(id)
      .set(updatedFields)
      .commit();
    
    set((state) => ({
      exercises: state.exercises.map((ex) =>
        ex._id === id ? updated : ex
      ),
    }));
  },

}));
