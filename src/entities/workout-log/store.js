import { create } from "zustand";
import { sanityClient } from "../../components/lib/sanity";

export const useWorkoutLogStore = create((set) => ({
    workoutLogs: [],
    logs: [],
    streak: 0,

    fetchWorkoutLogs: async () => {
        const data = await sanityClient.fetch(`
            *[_type=="workoutLog"]{
                completed, 
                date,
                sessions[]{
                    _key, 
                    endTime,
                    startTime,
                    sets,
                    reps,
                    weight,
                    exercise -> { _id, name},
                },
                user -> { _id }
            }`
        )
        set({ workoutLogs: data })
    },

    fetchLast7Days: async (userId) => {
        const today = new Date();
        const sevenDays = new Date();
        sevenDays.setDate(today.getDate() - 6);

        const startDate = sevenDays.toDateString().split("T")[0];

        const logs = await sanityClient.fetch(`
            *[_type == "workoutLog"
                && user._ref == $userId
                && date >= $startDate
                && completed == true]{
                    date
                }`,
            { userId, startDate }
        );
        const streak = calculateStreak(logs);
        set({ logs, streak:streak });
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
            newOrUpdated= await sanityClient
                .patch(existing._id)
                .set({completed: true, sessions})
                .commit();
        } else {
            newOrUpdated= await sanityClient.create({
                _type: "workoutLog",
                user: { _type: "reference", _ref: userId },
                workout: { _type: "reference", _ref: workout._id },
                date: today,
                completed: true,
                sessions
            });
        }

        set((state)=> {
            const updatedLogs= state.workoutId.filter(
                (l)=> l._id !== newOrUpdated._id)
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