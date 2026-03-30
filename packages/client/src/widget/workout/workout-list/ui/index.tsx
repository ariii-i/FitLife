import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useWorkoutStore } from "@/entities/workout/modal/store";
import { WorkoutButton } from "@/features/workouts/make-workout-request/ui/update-wkrout-button";
import { Dot } from "lucide-react";
import { Case, Switch } from "react-if";
import { Link } from "react-router-dom";

export const Component = () => {
  const { workouts, workout } = useWorkoutStore();

  return (
    <div className="space-y-2 text-lg">
      <p>Today's Workout:</p>

      <div className="flex flex-col gap-z">  
        <div className="grid grid-cols-3 gap-2 items-center">
          {workouts.map((work) => (
            <Card key={work.id} className="bg-stone-800 text-white border-none p-2">
              <CardHeader className="text-2xl font-semibold py-2">
                {work.name}
              </CardHeader>

              <CardContent>
                <ul>
                  {work.exercises?.map((ex) => (
                    <li className="flex text-lg"><Dot/>{ex.name}</li>
                  ))}
                </ul>
              </CardContent>

              <Link key={work.id} to={`/workout/${work.id}`} className="w-full">
                <Button type="button" className="w-full">Start Workout</Button>
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
