import { useEffect } from "react";
import { StreaksTrack } from "../../features/streaks";
import { WorkoutList } from "../../widget/workout/workout-list";
import { auth } from "../../shared/lib/firebase";

export const HomePage = () => {
    // const { user, fetchUser } = useUserStore()
    // const { fetchWorkouts, workouts } = useWorkoutStore();
    // const { fetchWorkoutLogs } = useWorkoutLogStore()

    // useEffect(() => {
    //     fetchUser(auth?.currentUser?.uid)
    //     console.log("userss", auth?.currentUser?.uid)
    //     fetchWorkouts()
    //     console.log("workouts", workouts)
    //     fetchWorkoutLogs()
    // }, [])
    
    return (
        <div>
            {/* <span className="font-semibold text-xl">Hi {auth?.currentUser?.name}</span>
            <StreaksTrack /> */}

            {/* <DisplayWorkoutList /> */}
            
            {/* <div className="space-y-2 font-semibold">
                Today's Workout:

                <WorkoutList />
            </div> */}
        </div>
    )
}