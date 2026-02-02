// import { useEffect } from "react";
import { useEffect } from "react";
import { Layout } from "../components/layout/Layout";
import { useExerciseStore } from "../store/excersiseStore";
import { WorkoutForm } from "../components/workout/workout-form";
import { WorkoutButton } from "../components/workout/workout-button";
import { useWorkoutStore } from "../store/workoutStore";
import { useWorkoutExerciseStore } from "../store/workout-exercise";

export function Workouts() {
    const {fetchExercises}=useExerciseStore()
    const {fetchWorkouts}=useWorkoutStore()
    const {fetchWorkoutExercises}=useWorkoutExerciseStore();

    useEffect(()=>{
        fetchExercises();
        fetchWorkouts();
        // fetchWorkoutExercises();
    }, [])
    
    return (
        <Layout>
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold mb-4">Workouts</h1>
                <WorkoutForm/>
            </div>
            <WorkoutButton />
            
        </Layout>
    )
}