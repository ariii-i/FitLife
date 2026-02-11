// import { useEffect } from "react";
import { useEffect } from "react";
import { Layout } from "../components/layout/Layout";
import { useExerciseStore } from "../store/excersiseStore";
import { WorkoutButton } from "../components/workout/workout-button";
import { useWorkoutStore } from "../store/workoutStore";
import { useWorkoutExerciseStore } from "../store/workout-exercise";
import { WorkoutForms } from "../components/workout/workout-form/form";
import { WorkoutField } from "../components/workout/workout-form/fields";

export function Workouts() {
    const { fetchExercises } = useExerciseStore()
    const { fetchWorkouts } = useWorkoutStore()
    const { fetchWorkoutExercises } = useWorkoutExerciseStore();

    useEffect(() => {
        fetchExercises();
        fetchWorkouts();
        fetchWorkoutExercises();
    }, [])

    return (
        <div>
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold mb-4">Workouts</h1>
                <WorkoutForms />
            </div>
            <WorkoutButton />
            <WorkoutField />
        </div>
    )
}