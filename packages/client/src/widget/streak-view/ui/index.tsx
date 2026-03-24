import { useEffect } from "react";
import { useStreakStore } from "@/entities/streak/modal/store";

const getDayName = (dateStr: string) => {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { weekday: "short" });
};

const getDayNumber = (dateStr: string) => {
  const date = new Date(dateStr + "T00:00:00");
  return date.getDate();
};

export const StreakView = () => {
  const { streakData, fetchStreak } = useStreakStore();

  useEffect(() => {
    fetchStreak(1);
  }, [fetchStreak]);

  return (
    <div className="flex gap-2">
      {streakData.map((item) => (
        <div
          key={item.date}
          className={`flex flex-col items-center justify-center w-10 h-14 rounded-lg ${
            item.done ? "bg-green-500" : "bg-gray-200"
          }`}
        >
          <span
            className={`text-xs font-medium ${
              item.done ? "text-white" : "text-gray-500"
            }`}
          >
            {getDayName(item.date)}
          </span>
          <span
            className={`text-sm font-bold ${
              item.done ? "text-white" : "text-gray-700"
            }`}
          >
            {getDayNumber(item.date)}
          </span>
        </div>
      ))}
    </div>
  );
};
