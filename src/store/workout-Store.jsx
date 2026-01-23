import { create } from "zustand";
import { sanityClient } from "../lib/sanity";

export const useWorkoutStore = create((set) => ({
    workouts: [],
    exerciseLogs: [],

    fetchWorkouts: async () => {
        const data = await sanityClient.fetch(`*[_type=="workout"]{
            _id,
            title, 
            day,
            exercises[]->{
                _id,
                name, 
                muscleGroup,
                }
            }`)
        set({
            workouts: data.map((w) => ({
                ...w,
                exercises: w.exercises?.filter(Boolean) || []
            })),
        })
    },

    fetchExerciseLogs: async () => {
        const logs = await sanityClient.fetch(`
            *[_type=="exerciseLog"] | order (date desc){
                _id,
                date,
                sets,
                completed,
                exercise->{
                    _id,
                    name
                },
                workout-<{
                    _id,
                    title
                }
            }
        `)
        set({exerciseLogs: logs})
    },

    addWorkout: async (workout) => {
        await sanityClient.create({
            _type: "workout",
            ...workout,
        });

        const data = await sanityClient.fetch(`
            *[_type=="workout"]{
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
            }
        `)

        set({
            workouts: data.map((w) => ({
                ...w,
                exercises: w.exercises?.filter(Boolean) || []
            }))
        })
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