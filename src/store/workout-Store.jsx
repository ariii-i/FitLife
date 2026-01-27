import { create } from "zustand";

export const useWorkoutLogStore = create((set, get) => ({
    logs: [],

    setLogs: (logs) => set({ logs }),

    addLogs: (log) => set((state) => ({
        logs: [...state.logs, log]
    })),

    updateLog: (id, data) => set((state) => ({
        logs: state.logs.map((log) =>
            log._id === id ? { ...log, ...data } : log)
    })),

    getLogsBySession: (sessionId) => get().logs.filter((log) =>
        log.sessionId === sessionId),

    getLogsByDate: (date) => get().logs.filter((log) =>
        log.date === date)
}))