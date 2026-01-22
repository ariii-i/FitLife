import { useEffect } from "react";
import { Layout } from "../components/layout/Layout";
import { AddWorkoutForm } from "../components/workout/workout-form";
import { useWorkoutStore } from "../store/workout-Store";
import { useExerciseStore } from "../store/excersiseStore";
import { WorkoutCards } from "../components/workout/workout-card";

export function Workouts() {
    const {fetchWorkouts}=useWorkoutStore()
    const {fetchExercises}=useExerciseStore()

    useEffect(()=>{
        fetchWorkouts();
        fetchExercises();
    }, [])
    
    return (
        <Layout>
            <h1 className="text-2xl font-bold">Workouts</h1>
            <AddWorkoutForm/>
            <WorkoutCards/>
        </Layout>
    )
}