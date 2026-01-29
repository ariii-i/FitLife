// import { useEffect } from "react";
import { useEffect } from "react";
import { Layout } from "../components/layout/Layout";
import { WorkoutLog } from "../components/workout/workout-log";
import { useExerciseStore } from "../store/excersiseStore";
import { WorkoutPlan } from "../components/workout/workout-plan";

export function Workouts() {
    const {fetchExercises}=useExerciseStore()

    useEffect(()=>{
        fetchExercises();
    }, [])
    
    return (
        <Layout>
            <h1 className="text-2xl font-bold mb-4">Workouts</h1>
            <WorkoutPlan/>
            <WorkoutLog/>
        </Layout>
    )
}