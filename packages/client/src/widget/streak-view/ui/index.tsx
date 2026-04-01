import { useStreakStore } from "@/entities/streak/modal/store";
import { auth } from "@/shared/lib/firebase";
import { cn } from "@/shared/lib/utils";
import { Activity, Check } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const getDayName = (dateStr: string) => {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { weekday: "short" });
};

// const getDayNumber = (dateStr: string) => {
//   const date = new Date(dateStr + "T00:00:00");
//   return date.getDate();
// };

export const StreakView = () => {
  const { streakData, fetchStreak } = useStreakStore();
  const sortedData = [...streakData].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  let streak = 0;

  for (const day of sortedData) {
    if (day.done) {
      streak++;
    } else {
      break;
    }
  }

  useEffect(() => {
    fetchStreak(auth.currentUser?.uid || "");
  }, [fetchStreak]);

  return (
    <div className="space-y-4">
      {streak}
      {streak > 1 ? " days streaks" : " day streak"}

      <div className="flex gap-2">
        {streakData.map((item) => (
          <div className="flex flex-col justify-center items-center">
            <Link
              key={item.date}
              to={`/workout-history-chart/${item.date}`}
              className={cn(
                "flex flex-col items-center justify-center w-20 h-16 rounded-lg text-black",
                item.done
                  ? "bg-[#A1FAFF] cursor-pointer hover:bg-primary_container"
                  : "bg-[#FFA1A1]",
              )}
            >
              {item.done ? <Check /> : ""}
            </Link>

            <span className="text-center">{getDayName(item.date)}</span>
          </div>
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
