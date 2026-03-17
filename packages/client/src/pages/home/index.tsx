import { useEffect } from "react";
import { auth } from "../../shared/lib/firebase";
import { useUserStore } from "@/entities/user/modal/store";
import { useWorkoutStore } from "@/entities/workout/modal/store";
import { useWorkoutLogStore } from "@/entities/workout-log/modal/store";
import { WorkoutList } from "@/widget/workout/workout-list";
import { StreaksTrack } from "@/features/streaks/ui";

export const HomePage = () => {
    const { user, fetchUser } = useUserStore()
    const { fetchWorkouts, workouts } = useWorkoutStore();
    const { fetchWorkoutLogs } = useWorkoutLogStore()

    const currentUser = auth.currentUser
    useEffect(() => {
        if (currentUser) {
            fetchUser(currentUser.uid)
            fetchWorkoutLogs(currentUser.uid)
        }
        fetchWorkouts()
    }, [])

    return (
        <div>
            <span className="font-semibold text-xl">Hi {currentUser?.displayName}</span>
            <StreaksTrack />

            {/* <DisplayWorkoutList /> */}

            <div className="space-y-2 font-semibold">
                Today's Workout:

                <WorkoutList />
            </div>
        </div>
    )
}