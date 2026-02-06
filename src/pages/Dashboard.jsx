import { useEffect } from "react";
import { DashboardCard } from "../components/dashboard/dashboard-card";
import { Header } from "../components/layout/Header";
import { Layout } from "../components/layout/Layout";
import { useExerciseStore } from "../store/excersiseStore";
import { useWorkoutExerciseStore } from "../store/workout-exercise";

export function Dashboard() {
    const { fetchExercises } = useExerciseStore();
    const { fetchWorkoutExercises } = useWorkoutExerciseStore()

    useEffect(() => {
        fetchExercises()
        fetchWorkoutExercises()
    }, [])

    return (
        <div>
            <Header />

            <div>
                <h1 className="text-3xl font-bold mb-4">Good Morning, "user"</h1>
                <DashboardCard />
            </div>
        </div>
    )
}