import { AddExercises } from "@/features/exercise/make-exercise-request/ui/create-exercises-button";
import { Case, Switch } from "react-if";
import { useExerciseStore } from "../../entities/exercise/modal/store";
import { ExerciseActionMenu } from "../../features/exercise/action-menu/ui";
import { ReusableCardContent } from "../layout/card-content";
import { ExerciseMetric } from "./ui/exercise-metric";

export const Component = () => {
    const { exercises } = useExerciseStore();

    return (
        <div className="flex flex-col gap-4">
            <ExerciseMetric />
            <div className="flex flex-col gap-3 text-lg">
                {exercises.map((exercise) => (
                    <div
                        key={exercise.id}
                        className="bg-gray-800 border border-gray-700 px-5 py-3 rounded-sm text-gray-50 flex items-center justify-between">
                        <p>{exercise.name}</p>

                        <ExerciseActionMenu selectedRow={exercise} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export const ExerciseList = () => {
    const { exercises } = useExerciseStore();

    return (
        <Switch>
            <Case condition={!exercises || exercises.length === 0}>
                <ReusableCardContent button={<AddExercises />} message="No exercise yet. Create a new one?" />
            </Case>
            <Case condition={exercises && exercises.length > 0}>
                <Component />
            </Case>
        </Switch>
    );
};
