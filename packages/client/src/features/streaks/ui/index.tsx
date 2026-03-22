import { useUserStore } from "@/entities/user/modal/store";
import { useWorkoutLogStore } from "@/entities/workout-log/modal/store";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export const StreaksTrack = () => {
  const { user } = useUserStore();
  const { workoutLogs, streak, fetchLast7Days } = useWorkoutLogStore();

  useEffect(() => {
    if (user?._id) {
      fetchLast7Days(user._id);
    }
  }, [user?._id, fetchLast7Days]);

  const last7days = getLast7days();
  const completedDates = workoutLogs.map((log) => log?.date);

  return (
    <div className="flex flex-col gap-2">
      <p className="font-medium ">
        {streak} {streak > 1 ? "days streaks" : "day streak"}{" "}
      </p>

      <div className="flex items-center gap-2">
        {last7days.map((day) => {
          const completed = completedDates.includes(day);
          const logForDay = workoutLogs.find(
            (log) => log?.date.split("T")[0] === day,
          );

          return (
            <Link
              key={day}
              to={logForDay ? `/workoutHistory/${logForDay._id}` : "#"}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold ${completed ? "bg-emerald-600 text-stone-100" : "bg-stone-600"}`}
              >
                {new Date(day).getDate()}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

function getLast7days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);

    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}
