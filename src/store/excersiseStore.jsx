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

  deleteExercise: (id)=>{
    sanityClient.delete(id);
    set((state)=>({exercises:state.exercises.filter((ex)=> ex._id !==id)}))
  }

}));
