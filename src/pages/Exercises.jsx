import { useEffect } from "react";
import { AddExercisesForm } from "../components/exercise/add-exercise-form";
import { Layout } from "../components/layout/Layout";
import { ExerciseTable } from "../components/exercise/exercise-table";
import { useExerciseStore } from "../store/excersiseStore";

export function Exercises() {

  const { fetchExercises } = useExerciseStore();

  useEffect(() => {
    fetchExercises()
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Exercises</h1>
      <AddExercisesForm />
      <ExerciseTable />
    </Layout>
  )
}