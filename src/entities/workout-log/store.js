import { create } from "zustand";
import { sanityClient } from "../../shared/lib/sanity";
import { createWorkoutLogApi, getLast7daysApi, getWorkoutLogApi } from "./api";

export const useWorkoutLogStore = create((set) => ({
    workoutLogs: [],
    logs: [],
    activeSession: null,
    lastSession: null,
    streak: 0,

    createWorkout: async (data, workoutId, exerciseId, startTimeStamp ) => {
        const newWorkout = await createWorkoutLogApi(data, workoutId, exerciseId, startTimeStamp )

        set((state) => ({
            workoutLogs: [newWorkout, ...state.workoutLogs]
        }))
    },

    fetchWorkoutLogs: async () => {
        const data = await getWorkoutLogApi()
        set({ workoutLogs: data })
    },

    fetchLast7Days: async (userId) => {
        const today = new Date();
        const sevenDays = new Date();
        sevenDays.setDate(today.getDate() - 6);
        const startDate = sevenDays.toDateString().split("T")[0];

        const logs = await getLast7daysApi(userId, startDate);

        const streak = calculateStreak(logs);
        set({ logs, streak: streak });
    },

    updateWorkoutLog: async (userId, workout) => {
        const today = new Date().toISOString().split("T")[0];

        const existing = await sanityClient.fetch(
            `*[_type=="workoutLog" 
                && user._ref == $userId 
                && workout._ref == $workoutId 
                && date == $today][0]`,
            { userId, workoutId: workout._id, today }
        );

        const sessions = workout.exercises?.map((we) => ({
            _type: "session",
            exercise: { _type: "reference", _ref: we.exercise._id },
            sets: we.plannedSets || 0,
            reps: we.plannedReps || 0,
            weight: we.weight || 0,
            startTime: null,
            endTime: null
        })) || [];

        let newOrUpdated;
        if (existing?._id) {
            newOrUpdated = await sanityClient
                .patch(existing._id)
                .set({ completed: true, sessions })
                .commit();
        } else {
            newOrUpdated = await sanityClient.create({
                _type: "workoutLog",
                user: { _type: "reference", _ref: userId },
                workout: { _type: "reference", _ref: workout._id },
                date: today,
                completed: true,
                sessions
            });
        }

        set((state) => {
            const updatedLogs = state.workoutId.filter(
                (l) => l._id !== newOrUpdated._id)
            updatedLogs.push(newOrUpdated)
        });

        fetchWorkoutLogs();
    },

}));

const calculateStreak = (logs) => {
    const sorted = logs
        .map((l) => new Date(l.date))
        .sort((a, b) => b - a);

    let streak = 0;
    let current = new Date();

    for (let date of sorted) {
        if (
            date.toISOString().split("T")[0] ===
            current.toISOString().split("T")[0]
        ) {
            streak++;
            current.setDate(current.getDate() - 1);
        } else {
            break;
        }
    }

    return streak;
};