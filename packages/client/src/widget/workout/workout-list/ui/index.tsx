import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useWorkoutStore } from "@/entities/workout/modal/store";
import { WorkoutButton } from "@/features/workouts/make-workout-request/ui/update-wkrout-button";
import { Case, Switch } from "react-if";
import { Link } from "react-router-dom";

export const Component = () => {
  const { workouts, workout } = useWorkoutStore();

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

        <div className="grid grid-cols-3 gap-2 items-center">
          {workouts.map((work) => (
            <Card key={work.id}>
              <CardHeader>
                {work.name}
              </CardHeader>
              <CardContent>

                {work.exercises?.map((ex) => (
                  <li>{ex.name}</li>
                ))}
              </CardContent>
              <Link key={work.id} to={`/workout/${work.id}`}>
                <Button type="button">Start Workout</Button>
              </Link>
            </Card>
          ))}


        </div>
      </div>
    </div>
  );
};

export const WorkoutList = () => {
  const { workouts } = useWorkoutStore();

  return (
    <Switch>
      <Case condition={!workouts || workouts.length === 0}>
        <Card className="bg-stone-700 p-7 rounded-xl text-stone-100 font-semibold flex-col flex justify-center items-center text-2xl">
          <WorkoutButton />
          <p>No workout yet. Create a new one?</p>
        </Card>
      </Case>
      <Case condition={workouts && workouts.length > 0}>
        <Component />
      </Case>
    </Switch>
  );
};
