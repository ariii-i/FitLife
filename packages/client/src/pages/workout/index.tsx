import { useExerciseStore } from "@/entities/exercise/modal/store"
import { useWorkoutStore } from "@/entities/workout/modal/store"
import { WorkoutButton } from "@/features/workouts/make-workout-request/ui/create-workout-button"
import { DisplayWorkout } from "@/widget/workout/display-workout"
import { useEffect } from "react"

export const Workout = () => {

    const { fetchWorkouts } = useWorkoutStore()
    const { fetchExercises } = useExerciseStore()
    
    useEffect(() => {
        fetchWorkouts();
        fetchExercises();
    }, [])

    return (
        <div>
            <div className="flex justify-between items-center font-semibold text-xl">
                Workouts
                <WorkoutButton />
            </div>
            <DisplayWorkout />
        </div>
    )
}