import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useWorkoutStore } from "@/entities/workout/modal/store";
import { WorkoutButton } from "@/features/workouts/make-workout-request/ui/create-workout-button";
import React from "react";
import { Case, Default, Switch, When } from "react-if";
import { Link, useParams } from "react-router-dom";

const Component = () => {
  const { workoutId } = useParams<{ workoutId: string }>();
  const { fetchWorkoutDetail } = useWorkoutStore();

  const [detail, setDetail] = React.useState<any>(null);
  // const {exercises, fetchExerciseForWorkout } = useExerciseStore();

  const init = React.useCallback(async () => {
    const res = await fetchWorkoutDetail(Number(workoutId));
    setDetail(res);
  }, [workoutId, fetchWorkoutDetail]);

  React.useEffect(() => {
    init();
  }, [init]);

  return (
    <div className="font-semibold text-xl p-2">
      <p>{detail?.name}</p>

      <When condition={!detail?.exercises || detail.exercises.length === 0}>
        <Card className="bg-stone-700 p-7 rounded-xl text-stone-100 font-semibold flex-col flex justify-center items-center text-lg">
          No exercises yet.
          <WorkoutButton />
        </Card>
      </When>

      {detail?.exercises?.map((exercise: any) => {
        return (
          <Link
            key={exercise.id}
            to={`/workout/${workoutId}/session/${exercise.id}`}
          >
            <Card className="bg-stone-700 p-5 rounded-xl text-stone-100 font-semibold flex justify-between items-center text-lg">
              <span>{exercise?.name}</span>

              <div className="font-medium text-sm text-stone-300">
                {exercise.plannedSets} sets x {exercise.plannedReps} reps
              </div>
            </Card>
          </Link>
        );
      })}

      <div className="py-2 flex justify-end">
        <Link to="/">
          <Button type="button" variant="link">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};
export const WorkoutDetail = () => {
  const { workoutId } = useParams<{ workoutId: string }>();

  return (
    <Switch>
      <Case condition={!workoutId}>
        <p>Workout Not Found</p>
      </Case>
      <Default>
        <Component />
      </Default>
    </Switch>
  );
};
