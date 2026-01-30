import { create } from "zustand";
import { sanityClient } from "../lib/sanity";

export const useWorkoutExerciseStore = create((set) => ({
    workoutExercises: [],

    fetchWorkoutExercises: async (workoutId) => {
        const data = await sanityClient.fetch(`
            *[_type == "workout_exercise" && workout._ref==$workoutId]{
                _id,
                plannedSets,
                plannedReps,
                workout -> {_id, name},
                exercise -> {_id, name}
            }`,
            {workoutId:workoutId}
        )

        set({workoutExercises: data})
    },

    addWorkoutExercises: async ({
        workoutId,
        exerciseId,
        plannedSets,
        plannedReps
    }) => {
        const doc = await sanityClient.create({
            _type:"workout_exercise",
            workout:{
                _type:"reference",
                _ref:workoutId
            },
            exercise:{
                _type:"reference",
                _ref:exerciseId
            },
            plannedSets,
            plannedReps,
        })

        set((state) => ({
            workoutExercises: [...state.workoutExercises, doc]
        }))
    },

    deleteWorkoutExercises: async(id) => {
        await sanityClient.delete(id);
        set((state) => ({
            workoutExercises: state.workoutExercises.filter((we) => we._id !== id)
        }))
    }
}))