import { useEffect } from "react";
import { useUserStore } from "../../entities/user/store"
import { Dashboard } from "../../widget/dashboard"
import { useWorkoutStore } from "../../entities/workout/store";
import { useWorkoutLogStore } from "../../entities/workout-log/store";
import { auth } from "../../shared/lib/firebase";

export const HomePage = () => {
    const { user, fetchUser } = useUserStore();
    const { fetchWorkouts, workouts } = useWorkoutStore();
    const { fetchWorkoutLogs } = useWorkoutLogStore()

    useEffect(() => {
        fetchUser(auth?.currentUser?.uid)
        console.log("userss", auth?.currentUser?.uid)
        fetchWorkouts()
        console.log("workouts", workouts)
        fetchWorkoutLogs()
    }, [])
    return (
        <div>
            <span className="font-semibold text-xl">Hi {auth?.currentUser?.name}</span>
            <Dashboard />
        </div>
    )
}