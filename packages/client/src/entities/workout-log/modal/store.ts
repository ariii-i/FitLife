import { Schema_Workout_Session } from "server/src/orpc-server/packages/workout/domain/schema-workout-session";
import z from "zod";
import { create } from "zustand";
import { addSessionApi, createWorkoutLogApi, getLast7daysApi, getWorkoutLogApi } from "../api";
import { WorkoutLogSession } from "./type";

type AddSessionInput = {
    workoutLogId: string | null;
    exerciseId?: string;
    startTime?: string;
    endTime?: string;
    sets: number;
    reps: number;
    weight: number;
    completed?: boolean;
};

type WorkoutLogStore = {
    workoutLogs: Array<z.infer<typeof Schema_Workout_Session>>,
    logs: { date: string }[];
    activeSession: WorkoutLogSession | null;
    streak: number;
    createWorkoutLog: (data:z.infer<typeof Schema_Workout_Session>) => Promise<void>;
    addSession: (input: AddSessionInput) => Promise<void>;
    fetchWorkoutLogs: (userId: string) => Promise<void>;
    fetchLast7Days: (userId: string) => Promise<void>;
};

export const useWorkoutLogStore = create<WorkoutLogStore>((set) => ({
    workoutLogs: [],
    logs: [],
    activeSession: null,
    streak: 0,

    createWorkoutLog: async (data) => {
        const log = await createWorkoutLogApi(data);
        set((state) => ({ workoutLogs: [log, ...state.workoutLogs] }));
    },

    addSession: async ({ workoutLogId, exerciseId, startTime, endTime, completed, ...data }: AddSessionInput) => {
        if (!workoutLogId || !exerciseId) return;

        const payload: Omit<WorkoutLogSession, "_key"> = {
            ...data,
            exercise: {
                _type: "reference",
                _ref: exerciseId,
            },
            startTime: startTime ?? new Date().toISOString(),
            endTime: endTime ?? new Date().toISOString(),
            completed: true,
        };

        const session = await addSessionApi(workoutLogId, payload);

        set((state) => ({
            workoutLogs: state.workoutLogs.map((l) =>
                l._id === workoutLogId
                    ? { ...l, sessions: [...l.sessions, session] }
                    : l
            ),
        }));
    },

    fetchWorkoutLogs: async (userId: string) => {
        const logs = await getWorkoutLogApi(userId);
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
    const today = new Date().toISOString().split("T")[0];
    const logDates = new Set(logs.map(l => l.date.split("T")[0]));

    let streak = 0;
    let currentDate = today;

    while (logDates.has(currentDate)) {
        streak++;
        const temp = new Date(currentDate);
        temp.setDate(temp.getDate() - 1);
        currentDate = temp.toISOString().split("T")[0];
    }

    return streak;
};