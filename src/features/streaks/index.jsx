import { useEffect } from "react"
import { useUserStore } from "../../entities/user/store"
import { useWorkoutLogStore } from "../../entities/workout-log/store"
import { auth } from "../../shared/lib/firebase"
import { Link, useNavigate } from "react-router-dom"

export const StreaksTrack = () => {
    const { user } = useUserStore()
    const { workoutLogs, streak, fetchLast7Days } = useWorkoutLogStore()

    useEffect(() => {
        if (user?._id) {
            fetchLast7Days(user._id)
            console.log("authsss", auth)
        }
    }, [user?._id, fetchLast7Days]);


    const last7days = getLast7days();
    console.log("last",last7days)
    const completedDates = workoutLogs.map((log) => log?.date)
    console.log("completeddate",completedDates)

    return (
        <div>
            <p className="font-semibold text-sm py-1">{streak} {streak > 1 ? "days streaks" : "day streak"} </p>

            <div className="flex gap-2 ">
                {last7days.map((day) => {
                    const completed = completedDates.includes(day);
                    const logForDay = workoutLogs.find((log) => log?.date.split("T")[0] === day)

                    return (
                        <Link key={day} to={logForDay ? `/workoutHistory/${logForDay._id}` : '#'}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold ${completed ? "bg-emerald-600 text-stone-100" : "bg-stone-400"}`}>
                                {new Date(day).getDate()}
                            </div>
                        </Link>
                    )
                })}
            </div>

        </div>
    )
}

function getLast7days() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);

        days.push(d.toISOString().split("T")[0])
    }
    return days;
}