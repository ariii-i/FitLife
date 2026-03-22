import { useWorkoutStore } from "@/entities/workout/modal/store";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Switch, Case } from "react-if";
import { WorkoutButton } from "@/features/workouts/make-workout-request/ui/create-workout-button";
export const Component = () => {
  const { workouts } = useWorkoutStore();

  return (
    <div className="space-y-2">
      <p>Today's Workout:</p>
      <div className="flex flex-col gap-z">
        {workouts.map((workout) => (
          <Link key={workout.id} to={`/workout/${workout.id}`}>
            <div className="bg-stone-900 border border-stone-700 px-5 py-3 rounded-sm text-gray-50">
              {workout.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const WorkoutList = () => {
  const { workouts } = useWorkoutStore();

  return (
    <Switch>
      <Case condition={!workouts || workouts.length === 0}>
        <Card className="bg-stone-700 p-7 rounded-xl text-stone-100 font-semibold flex-col flex justify-center items-center text-lg">
          <p>No workout yet. Create a new one?</p>
          <WorkoutButton />
        </Card>
      </Case>
      <Case condition={workouts && workouts.length > 0}>
        <Component />
      </Case>
    </Switch>
  );
};
