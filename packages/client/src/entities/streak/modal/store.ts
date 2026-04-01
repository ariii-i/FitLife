import { create } from "zustand";
import { getStreakApi } from "../api";

type StreakData = {
  date: string;
  done: boolean;
};

type StreakStore = {
  streakData: StreakData[];
  fetchStreak: (user_id: string) => Promise<void>;
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

  fetchStreak: async (user_id) => {
    const { start_date, end_date } = getDateRange();
    const data = await getStreakApi(user_id, start_date, end_date);
    set({ streakData: data });
  },
}));
