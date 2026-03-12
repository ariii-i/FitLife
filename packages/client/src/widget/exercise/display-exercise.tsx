import { Card } from "@/components/ui/card";
import { useExerciseStore } from "@/entities/exercise/modal/store";
import { ExerciseActionMenu } from "@/features/exercise/action-menu/ui";

export const DisplayExercises: React.FC = () => {
    const { exercises } = useExerciseStore();

    if (!exercises || exercises.length === 0) {
        return (
            <div className="py-2">
                <Card className="flex flex-col items-center justify-center font-semibold p-4">
                    No exercise added.
                    <div>
                        Create a new one?
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div>
            <span className="text-xs text-stone-500">{exercises.length} {exercises.length > 0 ? "exercises" : "exercise"}</span>
            {exercises.map((exercise) => (
                <div key={exercise._id} className="border-b border-dashed p-5 font-semibold flex items-center justify-between">
                    {exercise.name}

                    <ExerciseActionMenu selectedRow={{ name: exercise.name, _id: exercise._id }}/>
                </div>
            ))}
        </div>
    )
}