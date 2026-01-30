import { create } from "zustand";
import { sanityClient } from "../lib/sanity";

export const useWorkoutLogStore = create((set) => ({
    workoutLog: [],

    fetchWorkoutLog: async (sessionId) => {
        const data = await sanityClient.fetch(`
            *[_type=="workoutLog" && sessionId==$sessionId]{
                _id,
                sessionId,
                sets,
                reps,
                weight,
                start_time,
                end_time,
                date, 
                duration, 
                workoutExercise -> {
                    _id,
                    plannedSets,
                    plannedReps,
                    exercise->{_id, name}
                }
            }`,
            { sessionId: sessionId }
        )

        set({ workoutLog: data })
    },

    addWorkoutLog: async ({
        workoutExerciseId,
        sessionId,
        sets,
        reps,
        weight,
        start_time,
        end_time,
        date,
        duration,
    }) => {
        const log = await sanityClient.create({
             _type: "workoutLog",
            workoutExercises: {
                _type: "reference",
                _ref: workoutExerciseId,
            },
            sessionId,
            sets,
            reps,
            weight,
            start_time,
            end_time,
            date,
            duration
        })

        set((state) => ({
            workoutLog: [...state.workoutLog, log]
        }))
    }
}))