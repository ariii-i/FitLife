import { create } from "zustand";
import { addSessionApi, createWorkoutLogApi, getLast7daysApi, getWorkoutLogApi } from "./api";

export const useWorkoutLogStore = create((set) => ({
    workoutLogs: [],
    logs: [],
    activeSession: null,
    streak: 0,

    createWorkout: async (workoutId, exerciseId, startTimeStamp, userId) => {
        const newWorkout = await createWorkoutLogApi(workoutId, startTimeStamp, userId)

        set((state) => ({
            workoutLogs: [newWorkout, ...state.workoutLogs]
        }))
    },

    addSessionData: async (data, workoutId, exerciseId, startTimeStamp) => {
        const session = await addSessionApi(data, workoutId, exerciseId, startTimeStamp)
        console.log("sessionsssssss", session)
        set((state) => ({
            workoutLogs: state.workoutLogs.map((log) => log._id === workoutId ? { ...log, sessions: [...log.sessions, session] } : log)
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
        const startDate = sevenDays.toISOString().split("T")[0];

        const logs = await getLast7daysApi(userId, startDate);

        const streak = calculateStreak(logs);
        set({ logs, streak: streak });
    },

}));

const calculateStreak = (logs) => {
    const normalizedDates = logs
        .map((l) => l.date.split("T")[0])
        .sort((a, b) => b.localeCompare(a)); 

    let streak = 0;
    let current = new Date().toISOString().split("T")[0];

    for (let date of normalizedDates) {
        if (date === current) {
            streak++;
            const temp = new Date(current);
            temp.setDate(temp.getDate() - 1);
            current = temp.toISOString().split("T")[0];
        } else {
            break;
        }
    }

    return streak;
};