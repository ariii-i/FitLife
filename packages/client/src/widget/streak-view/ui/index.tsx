import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useStreakStore } from "@/entities/streak/modal/store";
import { cn } from "@/shared/lib/utils";
import { Activity } from "lucide-react";

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
    <div className="space-y-4">
      <div className="flex gap-2">
        {streakData.map((item) => (
          <Link
            key={item.date}
            to={`/workout-history-chart/${item.date}`}
            className={cn(
              "flex flex-col items-center justify-center w-10 h-14 rounded-lg",
              item.done ? "bg-green-500 cursor-pointer hover:bg-green-600" : "bg-gray-200"
            )}
          >
            <span
              className={cn(
                "text-xs font-medium",
                item.done ? "text-white" : "text-gray-500"
              )}
            >
              {getDayName(item.date)}
            </span>
            <span
              className={cn(
                "text-sm font-bold",
                item.done ? "text-white" : "text-gray-700"
              )}
            >
              {getDayNumber(item.date)}
            </span>
          </Link>
        ))}
      </div>
      <div className="flex justify-end">
        <Link
          to={`/workout-history-chart/${new Date().toISOString().split("T")[0]}`}
          className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
        >
          <Activity className="w-4 h-4" />
          View Workout Charts
        </Link>
      </div>
    </div>
  );
};
