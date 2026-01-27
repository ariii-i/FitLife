// import { useEffect } from "react";
import { Layout } from "../components/layout/Layout";
// import { useWorkoutLogStore } from "../store/workout-Store";
// import { useExerciseStore } from "../store/excersiseStore";
import { WorkoutLog } from "../components/workout/workout-log";

export function Workouts() {
    // const {fetchWorkouts}=useWorkoutStore()
    // const {fetchExercises}=useExerciseStore()

    // useEffect(()=>{
    //     fetchWorkouts();
    //     fetchExercises();
    // }, [])
    
    return (
        <Layout>
            <h1 className="text-2xl font-bold">Workouts</h1>
            <WorkoutLog/>
        </Layout>
    )
}