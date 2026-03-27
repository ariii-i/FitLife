import { useEffect } from "react"
import { useWorkoutStore } from "@/entities/workout/modal/store"
import { useExerciseStore } from "@/entities/exercise/modal/store"
import { DisplayWorkout } from "@/widget/workout/display-workout"
import { CreateWorkoutButton } from "@/features/workouts/make-workout-request/ui/create-workout-button"
import { useUserStore } from "@/entities/user/modal/store"

export const Workout = () => {

    const { fetchWorkouts } = useWorkoutStore()
    const { fetchExercises } = useExerciseStore();
    const { user } = useUserStore()

    useEffect(() => {
        fetchWorkouts();
        fetchExercises(user?.uid ?? "");
    }, [])

    return (
        <div>
            <div className="flex justify-between items-center font-semibold text-xl">
                Workouts
                <CreateWorkoutButton />
            </div>
            <DisplayWorkout />
        </div>
    )
}