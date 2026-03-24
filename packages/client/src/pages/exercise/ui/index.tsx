import { useEffect } from "react";
import { useExerciseStore } from "@/entities/exercise/modal/store";
import { useExerciseFilterStore } from "@/entities/exercise/modal/use-exercise-filter-store";
import { AddExercises } from "@/features/exercise/make-exercise-request/ui/create-exercises-button";
import { ExerciseFilter } from "@/features/exercise/ui/exercise-filter";
import { ExerciseList } from "@/widget/exercise/exercise-list";

export const Exercise: React.FC = () => {
  const { fetchExercises } = useExerciseStore();
  const { name, muscleGroup } = useExerciseFilterStore();

  useEffect(() => {
    fetchExercises({
      name: name || undefined,
      muscle_group: muscleGroup || undefined,
    });
  }, [fetchExercises, name, muscleGroup]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center font-semibold text-xl">
        <h3>Exercises</h3>
        <AddExercises />
      </div>
      <ExerciseFilter />
      <ExerciseList />
    </div>
  );
};
