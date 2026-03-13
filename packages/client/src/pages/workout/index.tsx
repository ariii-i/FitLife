import { useEffect } from "react"
import { useWorkoutStore } from "@/entities/workout/modal/store"
import { useExerciseStore } from "@/entities/exercise/modal/store"
import { DisplayWorkout } from "@/widget/workout/display-workout"
import { WorkoutButton } from "@/features/workouts/make-workout-request/ui/create-workout-button"

export const Workout = () => {

    const { workouts, fetchWorkouts } = useWorkoutStore()
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