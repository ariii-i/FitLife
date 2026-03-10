import { create } from "zustand";
import { addSessionApi, createWorkoutLogApi, getLast7daysApi, getWorkoutLogApi } from "../api";
import { WorkoutLog, WorkoutLogSession } from "./type";

type WorkoutLogStore = {
    workoutLogs: WorkoutLog[];
    logs: { date: string }[];
    activeSession: WorkoutLogSession | null;
    streak: number;

    createWorkoutLog: (workoutId: string, userId: string) => Promise<void>;
    addSession: (workoutLogId: string, sessionData: Omit<WorkoutLogSession, "_key">) => Promise<void>;
    fetchWorkoutLogs: () => Promise<void>;
    fetchLast7Days: (userId: string) => Promise<void>;
};

export const useWorkoutLogStore = create<WorkoutLogStore>((set, get) => ({
    workoutLogs: [],
    logs: [],
    activeSession: null,
    streak: 0,

    createWorkoutLog: async (workoutId, userId) => {
        const log = await createWorkoutLogApi(workoutId, userId);
        set((state) => ({ workoutLogs: [log, ...state.workoutLogs] }));
    },

    addSession: async (workoutLogId, sessionData) => {
        const session = await addSessionApi(workoutLogId, sessionData);
        set((state) => ({
            workoutLogs: state.workoutLogs.map((log) =>
                log._id === workoutLogId
                    ? { ...log, sessions: [...log.sessions, session] }
                    : log
            ),
        }));
    },

    fetchWorkoutLogs: async () => {
        const logs = await getWorkoutLogApi();
        set({ workoutLogs: logs });
    },

    fetchLast7Days: async (userId) => {
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 6);
        const startDate = sevenDaysAgo.toISOString().split("T")[0];

        const logs = await getLast7daysApi(userId, startDate);
        const streak = calculateStreak(logs);
        set({ logs, streak });
    },
}));

const calculateStreak = (logs: { date: string }[]) => {
    const normalizedDates = logs.map((l) => l.date.split("T")[0]).sort((a, b) => b.localeCompare(a));

    let streak = 0;
    let current = new Date().toISOString().split("T")[0];

    for (const date of normalizedDates) {
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