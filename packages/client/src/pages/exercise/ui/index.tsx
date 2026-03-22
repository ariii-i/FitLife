import { useEffect } from "react";
import { useExerciseStore } from "@/entities/exercise/modal/store";
import { AddExercises } from "@/features/exercise/make-exercise-request/ui/create-exercises-button";
import { ExerciseList } from "@/widget/exercise/exercise-list";

export const Exercise: React.FC = () => {
  const { fetchExercises } = useExerciseStore();

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center font-semibold text-xl">
        <h3>Exercises</h3>
        <AddExercises />
      </div>
      <ExerciseList />
    </div>
  );
};
