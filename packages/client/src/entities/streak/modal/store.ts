import { create } from "zustand";
import { getStreakApi, getUserStreak } from "../api";

type StreakData = {
    date: string;
    done: boolean;
};
type StreakStore = {
    streakData: StreakData[];
    streak: number,
    fetchStreak: (user_id: string) => Promise<void>;
    getStreak: (user_id: string) => Promise<void>;
};

const getDateRange = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6);

    const formatDate = (d: Date) => d.toISOString().split("T")[0];

    return {
        start_date: formatDate(start),
        end_date: formatDate(end),
    };
};

export const useStreakStore = create<StreakStore>((set) => ({
    streakData: [],
    streak: 0,

    fetchStreak: async (user_id) => {
        const { start_date, end_date } = getDateRange();
        const data = await getStreakApi(user_id, start_date, end_date);
        set({ streakData: data });
    },

    getStreak: async (user_id) => {
        const data = await getUserStreak(user_id);
        set({ streak: data });
    },
}));
