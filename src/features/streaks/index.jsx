import { useEffect } from "react"
import { useUserStore } from "../../entities/user/store"
import { useWorkoutLogStore } from "../../entities/workout-log/store"

export const StreaksTrack = () => {
    const { users } = useUserStore()
    const { workoutLogs, streak, fetchLast7Days } = useWorkoutLogStore()

    useEffect(() => {
        if (users?._id) {
            fetchLast7Days(users._id)
        }
    }, [users?._id, fetchLast7Days]);

    // console.log("streak in render:", streak);
    const store = useWorkoutLogStore.getState();
    // console.log(store.streak);

    const last7days = getLast7days();
    const completedDates = workoutLogs.map((log) => log.date)

    return (
        <div>
            <p className="font-semibold text-sm py-1">{streak} {streak > 1 ? "days streaks" : "day streak"} </p>

            <div className="flex gap-2 ">
                {last7days.map((day) => {
                    const completed = completedDates.includes(day);

                    return (
                        <div
                            key={day}
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold 
                                ${completed ? "bg-emerald-600 text-stone-100" : "bg-stone-400"}`} >
                            {new Date(day).getDate()}

                        </div>
                    )
                })}
            </div>

        </div>
    )
}

function getLast7days() {
    const days = [];
    for (let i = 0; i <= 6; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);

        days.push(d.toISOString().split("T")[0])
    }
    return days;
}