import { useEffect } from "react"
import { useWorkoutStore } from "@/entities/workout/modal/store"
import { useExerciseStore } from "@/entities/exercise/modal/store"
import { DisplayWorkout } from "@/widget/workout/display-workout"

export const Workout: React.FC = () => {

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
                {/* <WorkoutForm /> */}
            </div>
            {/* <DisplayWorkout /> */}
        </div>
    )
}