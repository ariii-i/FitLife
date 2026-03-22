import { useExerciseStore } from "@/entities/exercise/modal/store";

export const ExerciseMetric = () => {
  const { exercises } = useExerciseStore();

  return (
    <span className="text-xs text-stone-500">
      {exercises.length} {exercises.length > 0 ? "exercises" : "exercise"}
    </span>
  );
};
