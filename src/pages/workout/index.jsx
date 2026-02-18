import { useEffect } from "react"
import { useWorkoutStore } from "../../entities/workout/store"
import { WorkoutForm } from "../../features/workouts/add-workouts"
import { useExerciseStore } from "../../entities/exercise/store"
import { DisplayWorkout } from "../../widget/workout/display-workout"

export const Workout = () => {

    const { workouts, fetchWorkouts } = useWorkoutStore()
    const { fetchExercises } = useExerciseStore()
    useEffect(() => {
        fetchWorkouts();
        fetchExercises()
    }, [])

    return (
        <div>
            <div className="flex justify-between items-center font-semibold text-xl">
                Workouts
                <WorkoutForm />
            </div>
            <DisplayWorkout />
        </div>
    )
}