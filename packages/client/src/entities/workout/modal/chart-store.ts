import { create } from "zustand";
import { get_workout_history_chart_data_api } from "../api";

type ExerciseData = {
    exercise_name: string;
    planned_sets: number | null;
    planned_reps: number | null;
    actual_sets: number | null;
    actual_reps: number | null;
    performed_at: string | null;
};

type WorkoutChartData = {
    workout_id: number;
    workout_name: string;
    performed_at: string;
    exercises_data: ExerciseData[];
};

type ChartStore = {
    chartData: WorkoutChartData[];
    loading: boolean;
    error: string | null;
    fetch_chart_data: (user_id: number, date: string) => Promise<void>;
    clear_chart_data: () => void;
};

export const useChartStore = create<ChartStore>((set) => ({
    chartData: [],
    loading: false,
    error: null,

    fetch_chart_data: async (user_id, date) => {
        set({ loading: true, error: null });
        try {
            const data = await get_workout_history_chart_data_api(user_id, date);
            set({ chartData: data, loading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "Failed to fetch chart data",
                loading: false,
            });
        }
    },

    clear_chart_data: () => {
        set({ chartData: [], error: null });
    },
}));