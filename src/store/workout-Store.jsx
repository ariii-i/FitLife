import { create } from "zustand";
import { sanityClient } from "../lib/sanity";

export const useWorkoutStore = create((set) => ({
    workouts: [],

    fetchWorkouts: async () => {
        const data = await sanityClient.fetch(`*[_type=="workout"]{
            _id,
            title, 
            day,
            sets,
            reps,
            exercises[]->{
                _id,
                name, 
                muscleGroup,
                equipment
                }
            }`)
        set({ workouts: data })
    },

    addWorkout: async (workout) => {
        const created = await sanityClient.create({
            _type: "workout",
            ...workout,
        });

        set((state) => ({
            workouts: [...state.workouts, { ...workout, ...created, id: created._id }],
        }));
    },

    markCompleted: async (workoutId, date) => {
        await sanityClient.create({
            _type: "workoutLog",
            workout: { _ref: workoutId },
            date,
            completed: false,
        })

        set((state) => ({
            workouts: state.workouts.map((w) => w._id === workoutId ? { ...w, completed: true } : w)
        }))
    }

}))