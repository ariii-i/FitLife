import { useEffect } from "react";
import { Layout } from "../components/layout/Layout";
import { useExerciseStore } from "../store/excersiseStore";
import { ExerciseForm } from "../components/exercise/exerciseForm";
import { DisplayExercises } from "../components/exercise/displayExercise";


export function Exercises() {

  const { fetchExercises } = useExerciseStore();

  useEffect(() => {
    fetchExercises()
  }, []);

  return (
    <Layout>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Exercises</h1>
        <ExerciseForm />
      </div>
      <DisplayExercises />
    </Layout>
  )
}