import { useEffect } from "react";
import { Layout } from "../components/layout/Layout";
import { useExerciseStore } from "../store/excersiseStore";
import { ExercisePlan } from "../components/exercise/exercise";
import { DisplayExercises } from "../components/exercise/display-exercise";


export function Exercises() {

  const { fetchExercises } = useExerciseStore();

  useEffect(() => {
    fetchExercises()
  }, []);

  return (
    <Layout>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Exercises</h1>
        <ExercisePlan/>
      </div>
      <DisplayExercises/>
    </Layout>
  )
}