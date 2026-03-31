import { Card } from "../../components/ui/card";
import { useExerciseStore } from "../../entities/exercise/modal/store";
import { ExerciseActionMenu } from "../../features/exercise/action-menu/ui";
import { Switch, Case } from "react-if";
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
        <Card className="bg-stone-700 p-7 rounded-xl text-stone-100 font-semibold flex-col flex justify-center items-center text-2xl">
          <p>No exercise yet. Create a new one?</p>
        </Card>
      </Case>
      <Case condition={exercises && exercises.length > 0}>
        <Component />
      </Case>
    </Switch>
  );
};
