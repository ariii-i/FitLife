import { useEffect } from "react";
import { useUserStore } from "../../entities/user/store"
import { Dashboard } from "../../widget/dashboard/dashboard"
import { useWorkoutStore } from "../../entities/workout/store";
import { useWorkoutLogStore } from "../../entities/workout-log/store";

export const HomePage = () => {
    const { users, fetchUsers } = useUserStore();
    const { fetchWorkouts } = useWorkoutStore();
    const { fetchWorkoutLogs } = useWorkoutLogStore()

    useEffect(() => {
        fetchUsers()
        fetchWorkouts()
        fetchWorkoutLogs()

    }, [])
    return (
        <div>
            <span className="font-semibold text-xl">Hi, {users[0]?.name}</span>
            <Dashboard />
        </div>
    )
}