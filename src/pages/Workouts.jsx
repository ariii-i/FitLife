import { useState } from "react";
import { Layout } from "../components/layout/Layout";
import { AddWorkoutForm } from "../components/workouts/AddWorkoutForm";
import { WorkoutTable } from "../components/workouts/WorkoutTable";

export function Workouts() {
    const [worksouts, setWorkouts] = useState([
        {
            title: "Chest & Triceps",
            day: "Monday",
            duration: 60
        }, {
            title: "Back & Biceps",
            day: "Wednesday",
            duration: 55,
        }, {
            title: "Leg",
            day: "Friday",
            duration: 70
        }
    ])

    const addWorkout=(workout)=>{
        setWorkouts((prev)=>[...prev, workout])
    }
    return (
        <Layout>
            <h1 className="text-2xl font-bold">Workouts</h1>
            <AddWorkoutForm onAdd={addWorkout} />
            <WorkoutTable data={worksouts} />
        </Layout>
    )
}