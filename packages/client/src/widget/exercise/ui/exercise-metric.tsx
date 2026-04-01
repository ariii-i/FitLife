import { useExerciseStore } from "@/entities/exercise/modal/store";

export const ExerciseMetric = () => {
    const { exercises } = useExerciseStore();

    return (
        <span className="text-sm text-gray-300">
            {exercises.length} {exercises.length > 0 ? "exercises" : "exercise"}
        </span>
    );
};
