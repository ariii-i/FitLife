import { create } from "zustand";
import { sanityClient } from "../lib/sanity";

export const useWorkoutStore = create((set) => ({
    workouts: [],

    setWorkout: (workouts) => set({ workouts }),

    fetchWorkouts: async () => {
        const data = await sanityClient.fetch(`
            *[_type == "workout"] {
                _id, 
                name
                }`
        )

        set({ workouts: data })
    },

    addWorkouts: async (name) => {
        const workout = await sanityClient.create({
            _type: "workout",
            name
        })

        set((state) => ({
            workouts: [...state.workouts, workout]
        }))
    },

    deleteWorkout: async (id) => {
        await sanityClient.delete(id);
        set((state) => ({
            workouts: state.workouts.filter((w) => w._id !== id)
        }))
    },

    editWorkout: async (id, updatedField) => {
        const updated = await sanityClient
            .patch(id)
            .set(updatedField)
            .commit()

        set((state) => ({
            workouts: state.workouts.map((w) =>
                w._id === id ? updated : w)
        }))
    }
}))